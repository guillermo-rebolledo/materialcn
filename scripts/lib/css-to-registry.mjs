/*
 * CSS -> shadcn registry `css` object.
 *
 * A registry item cannot ship a stylesheet as a file: the `@import` it would
 * need is written into the consumer's CSS, which lives at a path we do not
 * know (`src/index.css`, `app/globals.css`, …), so no relative specifier is
 * portable. The sanctioned alternative is the item's `css` field — CSS encoded
 * as JSON — which the CLI merges into whatever stylesheet components.json
 * points at.
 *
 * The encoding the CLI expects (see its `update-css` postcss plugin):
 *
 *   declaration      "prop": "value"
 *   rule             "selector": { … }
 *   at-rule w/ body  "@name params": { … }
 *   at-rule alone    "@name params": {}          // @apply, @slot
 *
 * `@theme` is the one block that does not stay in `css`: a declaration sitting
 * directly inside an at-rule is something the CLI cannot write out. It goes to
 * `cssVars.theme` instead, which the CLI merges into the project's
 * `@theme inline` — so the inline semantics the token layer depends on survive
 * anyway.
 *
 * Comments are dropped — the JSON encoding has nowhere to put them.
 */

import postcss from "postcss"

/** Merge `source` into `target` in place, recursing into nested objects. */
function mergeInto(target, source) {
  for (const [key, value] of Object.entries(source)) {
    const existing = target[key]

    if (isObject(existing) && isObject(value)) {
      // An empty object is a bare at-rule (`@slot`), not a container to merge.
      if (Object.keys(value).length === 0) continue
      mergeInto(existing, value)
      continue
    }

    // A later declaration of the same property wins, matching the cascade.
    target[key] = isObject(value) ? mergeInto({}, value) : value
  }

  return target
}

function isObject(value) {
  return typeof value === "object" && value !== null
}

/**
 * A selector list broken across lines becomes one line.
 *
 * The key is compared verbatim when the CLI merges into an existing
 * stylesheet, and it manipulates the string when nesting `&` — neither wants
 * an embedded newline.
 */
function normalizeSelector(selector) {
  return selector.replace(/\s*\n\s*/g, " ").trim()
}

function atRuleKey(node) {
  return node.params ? `@${node.name} ${node.params}` : `@${node.name}`
}

function nodesToObject(container) {
  const out = {}

  for (const node of container.nodes ?? []) {
    if (node.type === "comment") continue

    if (node.type === "decl") {
      out[node.prop] = node.important
        ? `${node.value} !important`
        : node.value
      continue
    }

    if (node.type === "rule") {
      mergeInto(out, { [normalizeSelector(node.selector)]: nodesToObject(node) })
      continue
    }

    if (node.type === "atrule") {
      // `@apply …;` and `@slot;` carry no body: the empty object is the signal.
      const value = node.nodes ? nodesToObject(node) : {}
      mergeInto(out, { [atRuleKey(node)]: value })
      continue
    }
  }

  return out
}

/**
 * At-rules the CLI gives a body of declarations to. Everywhere else it treats
 * an at-rule's children as selectors, so a declaration sitting directly inside
 * one is written out as `.temp{<value>}` and throws.
 */
const ACCEPTS_DECLARATIONS = new Set(["utility", "keyframes", "property", "theme"])

/**
 * Convert a stylesheet to a registry item's `css` and `cssVars`.
 *
 * `@theme` is split out into `cssVars.theme`: the CLI writes those into the
 * project's `@theme inline`, which is the one place declarations under an
 * at-rule survive. Everything else — including `:root` and `.dark`, which are
 * ordinary rules — stays in `css`, so selectors are preserved exactly as
 * written rather than redistributed by role.
 *
 * `skipImports` drops `@import` rules whose specifier is listed: the imports a
 * shadcn project already has, and the token files inlined here.
 */
export function cssToRegistryObject(css, { skipImports = [] } = {}) {
  const root = postcss.parse(css)
  const skip = new Set(skipImports)

  root.walkAtRules("import", (node) => {
    if (skip.has(unquote(node.params))) node.remove()
  })

  const cssVars = {}
  root.walkAtRules("theme", (node) => {
    for (const child of node.nodes ?? []) {
      if (child.type !== "decl") continue
      cssVars.theme ??= {}
      cssVars.theme[child.prop.replace(/^--/, "")] = child.value
    }
    node.remove()
  })

  assertNoStrandedDeclarations(root)

  return { css: nodesToObject(root), cssVars }
}

/**
 * Fail on a declaration the CLI would choke on rather than shipping a registry
 * that dies halfway through someone's install.
 */
function assertNoStrandedDeclarations(root) {
  root.walkAtRules((node) => {
    if (ACCEPTS_DECLARATIONS.has(node.name)) return
    if (!node.nodes?.some((child) => child.type === "decl")) return

    throw new Error(
      `@${node.name} ${node.params} declares properties directly. The shadcn CLI only ` +
        "accepts those inside @theme, @utility, @keyframes and @property — wrap them in a " +
        "selector, or move them to a rule.",
    )
  })
}

/** Merge several converted stylesheets, in order. */
export function mergeCssObjects(converted) {
  return converted.reduce(
    (acc, { css, cssVars }) => ({
      css: mergeInto(acc.css, css),
      cssVars: mergeInto(acc.cssVars, cssVars),
    }),
    { css: {}, cssVars: {} },
  )
}

function unquote(value) {
  return value.trim().replace(/^["']|["']$/g, "")
}
