/*
 * Writes registry.json — the shadcn registry that lets a consumer run
 *
 *   npx shadcn add @materialcn/button
 *
 * and get a Material 3 button, its tokens, and nothing it does not need.
 *
 * Items are derived from the source tree rather than authored (see
 * lib/registry-items.mjs); only titles and descriptions are written by hand.
 * Run `pnpm registry` after adding a component, then `pnpm registry:build` to
 * flatten it into public/r for serving.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { cssToRegistryObject, mergeCssObjects } from "./lib/css-to-registry.mjs"
import { AREAS, deriveItems, findCycle, isShipped } from "./lib/registry-items.mjs"
import { REGISTRY, THEME_ITEM, knownItemNames, metadataFor } from "./lib/registry-metadata.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

/**
 * The stylesheet, in the order index.css imports it. Concatenated and encoded
 * into the theme item's `css`.
 */
const STYLESHEET = [
  "src/styles/tokens/color.css",
  "src/styles/tokens/shape.css",
  "src/styles/tokens/spacing.css",
  "src/styles/tokens/typography.css",
  "src/styles/tokens/elevation.css",
  "src/styles/tokens/state.css",
  "src/styles/tokens/z-index.css",
  "src/styles/tokens/motion.css",
  "src/styles/tokens/layout.css",
  "src/styles/theme.css",
  "src/index.css",
]

/**
 * Imports a shadcn project already has. `tw-animate-css` is deliberately not
 * here: Dialog and Select use its enter/exit utilities, so the theme item has
 * to bring it.
 */
const CONSUMER_ALREADY_HAS = ["tailwindcss", "shadcn/tailwind.css"]

/**
 * What every component needs but nothing imports.
 *
 * The token layer is what makes `bg-primary` render as Material, so a
 * component without it installs and looks wrong. `cn` is not here: it is a
 * real import, so the components that use it pick it up on their own and the
 * few that do not are spared.
 */
const SHARED_REGISTRY_DEPENDENCIES = [THEME_ITEM.name]

/**
 * Where the built registry is served from.
 *
 * Internal dependencies have to be absolute. A bare name means "the shadcn
 * registry" — `registryDependencies: ["button"]` fetches ui.shadcn.com's
 * button, not ours. A relative `./button.json` is read from the consumer's own
 * working directory, not from the URL the item came from. `@materialcn/button`
 * works only once the consumer has registered the namespace, which breaks
 * `shadcn add <url>`. An absolute URL is the one form that resolves in every
 * case.
 *
 * Set REGISTRY_URL to point the items at a different host — a local server
 * while testing, or a preview deployment.
 */
// An empty REGISTRY_URL is an unset one, not a request for host-relative refs.
const REGISTRY_URL = (
  process.env.REGISTRY_URL || "https://guillermo-rebolledo.github.io/materialcn/r"
).replace(/\/$/, "")

function internalRef(name) {
  return `${REGISTRY_URL}/${name}.json`
}

const packageJson = readJson("package.json")

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"))
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8")
}

function sourceFiles() {
  return AREAS.flatMap(({ dir }) =>
    fs
      .readdirSync(path.join(root, dir), { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(tsx|ts)$/.test(entry.name))
      .map((entry) => `${dir}${entry.name}`)
      .filter(isShipped)
      .map((filePath) => ({ path: filePath, source: read(filePath) })),
  )
}

/**
 * The token layer as one item.
 *
 * The CSS is inlined rather than shipped as files: the `@import` a file would
 * need is written into the consumer's own stylesheet, whose path we do not
 * know, so no relative specifier would resolve. `css` is merged into that
 * stylesheet wherever it lives.
 */
function themeItem() {
  const { css, cssVars } = mergeCssObjects(
    STYLESHEET.map((filePath) =>
      cssToRegistryObject(read(filePath), {
        // The token files are inlined here, so index.css must not also ask the
        // consumer to import them from a path that will not exist.
        skipImports: [
          ...CONSUMER_ALREADY_HAS,
          ...STYLESHEET.map((token) => `./${path.relative("src", token)}`),
        ],
      }),
    ),
  )

  return {
    ...THEME_ITEM,
    type: "registry:theme",
    dependencies: [
      `@fontsource-variable/roboto-flex@${installedVersion("@fontsource-variable/roboto-flex")}`,
    ],
    devDependencies: [`tw-animate-css@${installedVersion("tw-animate-css")}`],
    files: [],
    cssVars,
    css,
    docs: [
      "materialcn's tokens are now in your stylesheet. Roboto Flex is installed but not loaded:",
      'add `import "@fontsource-variable/roboto-flex"` to your entry point, or point',
      "`--m3-font-plain` and `--m3-font-brand` at a font of your own.",
    ].join(" "),
  }
}

/** The specifier this repo builds against, wherever it is declared. */
function installedVersion(name) {
  return packageJson.dependencies?.[name] ?? packageJson.devDependencies[name]
}

function componentItems() {
  const items = deriveItems({
    files: sourceFiles(),
    versions: packageJson.dependencies,
    sharedRegistryDependencies: SHARED_REGISTRY_DEPENDENCIES,
  })

  const cycle = findCycle(items)
  if (cycle) {
    throw new Error(
      `Registry items form a cycle: ${cycle.join(" -> ")}. Installing one would drag in the ` +
        "others; promote the file they share into its own item.",
    )
  }

  const unused = knownItemNames().filter((name) => !items.some((item) => item.name === name))
  if (unused.length > 0) {
    throw new Error(
      `registry-metadata.mjs describes items that no longer exist: ${unused.join(", ")}.`,
    )
  }

  return items.map((item) => {
    const { title, description, categories } = metadataFor(item.name)

    // The schema orders an item name-first; keep the emitted JSON readable.
    return {
      name: item.name,
      type: item.type,
      title,
      description,
      ...(categories ? { categories } : {}),
      ...(item.dependencies.length > 0 ? { dependencies: item.dependencies } : {}),
      ...(item.registryDependencies.length > 0
        ? { registryDependencies: item.registryDependencies.map(internalRef) }
        : {}),
      files: item.files,
    }
  })
}

/** The registry, as it is written to registry.json. */
export function buildRegistry() {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    ...REGISTRY,
    items: [themeItem(), ...componentItems()],
  }
}

// Importing this module (from the tests) must not write the file.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const registry = buildRegistry()
  fs.writeFileSync(path.join(root, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`)
  console.log(`Wrote registry.json — ${registry.items.length} items`)
}
