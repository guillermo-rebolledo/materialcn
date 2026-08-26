/*
 * Derives the registry's item graph from the source tree.
 *
 * Hand-maintaining ~60 items would drift the first time a component gains a
 * sibling file, so nothing here is authored: files are grouped into items by
 * the repo's own naming convention, and both dependency lists are read out of
 * the imports. Only titles and descriptions are written by hand, in
 * registry-metadata.mjs.
 */

/** Sibling suffixes that belong to the component of the same base name. */
const HELPER_SUFFIXES = ["-variants", "-context", "-utils", "-manager", ".types"]

/** Never shipped: Storybook stories, compile-time type fixtures, docs. */
const EXCLUDED = [/\.stories\.tsx?$/, /\.types\.tsx$/, /\.mdx$/]

/** Provided by the consumer's own project, never installed by an item. */
const AMBIENT_DEPENDENCIES = new Set(["react", "react-dom"])

/**
 * The `@/` prefixes shadcn rewrites to whatever components.json declares.
 * Longest first, so `@/components/ui/` wins over `@/components/`.
 */
const ALIASES = [
  ["@/components/ui/", "src/components/ui/"],
  ["@/components/", "src/components/"],
  ["@/lib/", "src/lib/"],
]

/**
 * Where a shipped file can live, and the item type it gets. Longest path
 * first, so `src/components/ui/` wins over `src/components/`. This is also the
 * list the generator scans, so a new source directory is one edit.
 */
export const AREAS = [
  { dir: "src/components/ui/", type: "registry:ui" },
  { dir: "src/components/", type: "registry:component" },
  { dir: "src/lib/", type: "registry:lib" },
]

export function isShipped(filePath) {
  return !EXCLUDED.some((pattern) => pattern.test(filePath))
}

function areaOf(filePath) {
  return AREAS.find((area) => filePath.startsWith(area.dir))
}

function baseNameOf(filePath) {
  return filePath.split("/").pop().replace(/\.(tsx|ts)$/, "")
}

function withoutExtension(filePath) {
  return filePath.replace(/\.(tsx|ts)$/, "")
}

/**
 * Every import specifier in a source file, in source order.
 *
 * The clause may span lines, so the gap cannot simply exclude newlines. It
 * excludes `;`, `=` and `:` instead — none of which an import clause contains,
 * while every statement that could be mistaken for one has at least one. A
 * commented-out import does not match: the line no longer starts with the
 * keyword.
 */
export function importsOf(source) {
  const specifiers = []
  const pattern = /(?:^|\n)\s*(?:import|export)\s[^;=:]*?from\s*["']([^"']+)["']/g

  for (const match of source.matchAll(pattern)) specifiers.push(match[1])

  return specifiers
}

/** `@base-ui/react/toggle` -> `@base-ui/react`; `lucide-react` -> itself. */
function packageNameOf(specifier) {
  const segments = specifier.split("/")
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0]
}

function resolveRelative(specifier, fromPath) {
  const directory = fromPath.split("/").slice(0, -1)
  for (const segment of specifier.split("/")) {
    if (segment === ".") continue
    else if (segment === "..") directory.pop()
    else directory.push(segment)
  }
  return directory.join("/")
}

/**
 * The file an import points at, or null when it is an npm package.
 *
 * A `@/` specifier that resolves to nothing is a typo, not a package — the
 * consumer would install it from npm and get a 404 at the end of a long
 * install, so fail here instead.
 */
function resolveImport(specifier, fromPath, index) {
  if (specifier.startsWith(".")) {
    const resolved = index.get(resolveRelative(specifier, fromPath))
    if (!resolved) throw new Error(`${fromPath}: "${specifier}" resolves to nothing`)
    return resolved
  }

  const alias = ALIASES.find(([prefix]) => specifier.startsWith(prefix))
  if (!alias) return null

  const resolved = index.get(alias[1] + specifier.slice(alias[0].length))
  if (!resolved) throw new Error(`${fromPath}: "${specifier}" resolves to nothing`)
  return resolved
}

/**
 * Assign each file to an item.
 *
 * A component root owns its `-variants` / `-context` / `-utils` / `-manager` /
 * `.types` siblings — until a second item imports it. `button-group-context`
 * is provided by ButtonGroup and consumed by Button; left inside either one it
 * makes the two items depend on each other, and installing Button would drag
 * in ButtonGroup. Promoting a shared helper to its own item breaks the cycle
 * and keeps each install minimal. Promotion can expose further sharing
 * (Button's variants are read by that same context), so it runs to a fixpoint.
 */
function assignOwners(files, index) {
  const roots = new Set(
    files
      .filter((file) => file.path.endsWith(".tsx") && areaOf(file.path).type !== "registry:lib")
      .map((file) => baseNameOf(file.path)),
  )

  const owners = new Map(
    files.map((file) => {
      const base = baseNameOf(file.path)
      if (roots.has(base)) return [file.path, base]

      const suffix = HELPER_SUFFIXES.find((candidate) => base.endsWith(candidate))
      const owner = suffix ? base.slice(0, -suffix.length) : null

      return [file.path, owner && roots.has(owner) ? owner : base]
    }),
  )

  const importers = new Map(files.map((file) => [file.path, new Set()]))
  for (const file of files) {
    for (const specifier of importsOf(file.source)) {
      const target = resolveImport(specifier, file.path, index)
      if (target && target !== file.path) importers.get(target).add(file.path)
    }
  }

  for (let promoted = true; promoted; ) {
    promoted = false

    for (const file of files) {
      const base = baseNameOf(file.path)
      if (owners.get(file.path) === base) continue

      const importingItems = new Set(
        [...importers.get(file.path)].map((importer) => owners.get(importer)),
      )
      if (importingItems.size <= 1) continue

      // Some helpers import their own component back — TimePicker's utils take
      // its exported types while TimePicker calls into them. Splitting those
      // would only move the cycle, so they ship together and the component
      // stays the single unit anything else depends on.
      const importsItsOwner = importsOf(file.source).some((specifier) => {
        const target = resolveImport(specifier, file.path, index)
        return target !== null && owners.get(target) === owners.get(file.path)
      })
      if (importsItsOwner) continue

      owners.set(file.path, base)
      promoted = true
    }
  }

  return owners
}

/**
 * Group files into items and read their dependencies out of the imports.
 *
 * `files` is `[{ path, source }]` relative to the repo root. `versions` maps a
 * package name to the specifier to install (`^1.7.0`), so an item pins what
 * this repo builds against rather than whatever is latest.
 */
export function deriveItems({ files, versions = {}, sharedRegistryDependencies = [] }) {
  const shipped = files.filter((file) => isShipped(file.path) && areaOf(file.path))
  const index = new Map(shipped.map((file) => [withoutExtension(file.path), file.path]))
  const owners = assignOwners(shipped, index)

  const items = new Map()

  for (const file of shipped) {
    const name = owners.get(file.path)
    const area = areaOf(file.path)

    if (!items.has(name)) {
      items.set(name, {
        name,
        type: area.type,
        files: [],
        dependencies: new Set(),
        registryDependencies: new Set(),
      })
    }

    const item = items.get(name)
    item.files.push({ path: file.path, type: area.type })

    // A shared dependency is one that markup needs but never imports — the
    // token layer. Only an item that renders anything wants it, and a `.tsx`
    // is what says it does: seeding `utils` or a bare context module would
    // mean `shadcn add utils` pulled in the whole stylesheet.
    if (file.path.endsWith(".tsx")) {
      for (const dependency of sharedRegistryDependencies) {
        item.registryDependencies.add(dependency)
      }
    }

    for (const specifier of importsOf(file.source)) {
      const target = resolveImport(specifier, file.path, index)

      if (target === null) {
        const packageName = packageNameOf(specifier)
        if (AMBIENT_DEPENDENCIES.has(packageName)) continue
        item.dependencies.add(
          versions[packageName] ? `${packageName}@${versions[packageName]}` : packageName,
        )
        continue
      }

      const dependency = owners.get(target)
      if (dependency !== name) item.registryDependencies.add(dependency)
    }
  }

  return [...items.values()]
    .map((item) => ({
      ...item,
      // A component's own entry point sorts first so `shadcn view` opens on it.
      files: item.files.sort(byEntryPointFirst(item.name)),
      dependencies: [...item.dependencies].sort(),
      registryDependencies: [...item.registryDependencies]
        .filter((dependency) => dependency !== item.name)
        .sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function byEntryPointFirst(name) {
  const isEntryPoint = (file) => baseNameOf(file.path) === name
  return (a, b) => Number(isEntryPoint(b)) - Number(isEntryPoint(a)) || a.path.localeCompare(b.path)
}

/**
 * The first dependency cycle in the graph, as a path, or null.
 *
 * The CLI survives a cycle, but a cycle means installing one component drags
 * in an unrelated one, so it is a bug in how the items were cut.
 */
export function findCycle(items) {
  const byName = new Map(items.map((item) => [item.name, item]))
  const done = new Set()

  const walk = (name, path) => {
    if (path.includes(name)) return [...path.slice(path.indexOf(name)), name]
    if (done.has(name) || !byName.has(name)) return null

    for (const dependency of byName.get(name).registryDependencies) {
      const cycle = walk(dependency, [...path, name])
      if (cycle) return cycle
    }

    done.add(name)
    return null
  }

  for (const item of items) {
    const cycle = walk(item.name, [])
    if (cycle) return cycle
  }

  return null
}
