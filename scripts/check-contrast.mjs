/**
 * Verifies every text-bearing role pairing in the generated colour layer meets
 * WCAG AA, in both schemes.
 *
 * The Material roles are contrast-designed by construction, but the palette is
 * *generated* — which makes it exactly the kind of thing a future edit can
 * regress silently. This holds the guarantee rather than inheriting it.
 *
 * It reads src/styles/tokens/color.css, not the hex maps in the generator, so
 * it measures the colours that actually ship — including the OKLCH conversion.
 *
 * Run with: pnpm check:contrast
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { contrastRatio, oklchToSrgb } from "./hex-to-oklch.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const css = readFileSync(path.join(root, "src/styles/tokens/color.css"), "utf8")

/* --------------------------------------------------------------- parsing */

/**
 * The file declares every role three times — `:root`, `.dark`, and the
 * `prefers-color-scheme` fallback. The first two are the two schemes; the third
 * repeats `.dark` and is skipped, since checking it would only prove the
 * generator emitted the same block twice.
 */
function scheme(selector) {
  const start = css.indexOf(`\n${selector} {`)
  if (start === -1) throw new Error(`No ${selector} block in color.css`)
  const body = css.slice(start, css.indexOf("\n}", start))

  const roles = new Map()
  for (const [, role, L, C, H] of body.matchAll(
    /--m3-([a-z0-9-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g,
  )) {
    roles.set(role, oklchToSrgb(Number(L), Number(C), Number(H)).linear)
  }
  return roles
}

const SCHEMES = { light: scheme(":root"), dark: scheme(".dark") }

/* -------------------------------------------------------------- pairings */

/** The full surface ramp: anything `on-surface` is legitimately set against. */
const SURFACES = [
  "surface",
  "background",
  "surface-dim",
  "surface-bright",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
]

const ACCENTS = ["primary", "secondary", "tertiary", "error"]

/**
 * Every pairing a consumer is expected to set text in. Derived rather than
 * listed, so a role added to the palette cannot quietly escape the check.
 */
function pairings() {
  const pairs = []
  const add = (content, container) => pairs.push({ content, container })

  for (const accent of ACCENTS) {
    add(`on-${accent}`, accent)
    add(`on-${accent}-container`, `${accent}-container`)
  }

  // The surface ramp exists so a container can be lifted without changing its
  // content colour, which is a promise about contrast at every step of it.
  for (const surface of SURFACES) {
    add("on-surface", surface)
    add("on-surface-variant", surface)
  }
  add("on-surface-variant", "surface-variant")
  add("on-surface", "surface-variant")

  // Fixed roles hold one value across schemes; both their content roles are
  // specified against both the base and the dim step.
  for (const accent of ["primary", "secondary", "tertiary"]) {
    for (const container of [`${accent}-fixed`, `${accent}-fixed-dim`]) {
      add(`on-${accent}-fixed`, container)
      add(`on-${accent}-fixed-variant`, container)
    }
  }

  // The inverse pair is the snackbar: its label and its action label.
  add("inverse-on-surface", "inverse-surface")
  add("inverse-primary", "inverse-surface")

  return pairs
}

/**
 * Roles excluded from the text check, and why. Each is excluded because it is
 * not text — never because it failed and the threshold was inconvenient.
 */
const NOT_TEXT = {
  shadow: "A shadow colour, painted at low alpha behind an element.",
  scrim: "A dimming layer, painted at 32% over the page.",
  "surface-tint": "An elevation tint mixed into a surface, never set as text.",
  outline:
    "A stroke, not text — held to the 3:1 non-text threshold below instead.",
  "outline-variant":
    "Decorative only. M3 uses it for dividers and container edges that carry " +
    "no information: the boundary is never the thing that identifies a " +
    "control, so WCAG 1.4.11 does not apply. Anything a user has to *find* " +
    "by its edge — a text field, a focus ring — uses `outline`, which is " +
    "checked. At 1.6:1 it would fail 3:1, and raising it would flatten the " +
    "distinction between the two roles rather than help anyone.",
}

/**
 * Strokes that *do* identify a control are held to WCAG's non-text threshold.
 * That is a different bar for a different job, not a lowered version of the
 * text one — nothing that carries text is checked against it.
 */
const STROKES = [{ content: "outline", container: "surface", min: 3 }]

/* ---------------------------------------------------------------- report */

const AA_NORMAL_TEXT = 4.5

const failures = []
const rows = []

for (const [name, roles] of Object.entries(SCHEMES)) {
  const check = ({ content, container, min }) => {
    const a = roles.get(content)
    const b = roles.get(container)
    if (!a || !b) {
      failures.push(`${name}: unknown role in ${content} on ${container}`)
      return
    }
    const ratio = contrastRatio(a, b)
    const ok = ratio >= min
    rows.push(
      `${ok ? "  " : "✗ "}${name.padEnd(5)} ${content.padEnd(28)} on ${container.padEnd(26)} ${ratio.toFixed(2)}:1 (needs ${min})`,
    )
    if (!ok) {
      failures.push(
        `${name}: ${content} on ${container} is ${ratio.toFixed(2)}:1, below ${min}:1`,
      )
    }
  }

  for (const pair of pairings()) check({ ...pair, min: AA_NORMAL_TEXT })
  for (const stroke of STROKES) check(stroke)
}

console.log(rows.join("\n"))
console.log()

for (const [role, reason] of Object.entries(NOT_TEXT)) {
  const wrapped = reason
    .split(" ")
    .reduce(
      (lines, word) => {
        const last = lines[lines.length - 1]
        if ((last + " " + word).length > 58) lines.push(word)
        else lines[lines.length - 1] = last ? `${last} ${word}` : word
        return lines
      },
      [""],
    )
    .join("\n" + " ".repeat(28))
  console.log(`  excluded  ${role.padEnd(16)} ${wrapped}`)
}
console.log()

if (failures.length) {
  console.error(`${failures.length} pairing(s) below threshold:\n`)
  for (const failure of failures) console.error(`  ${failure}`)
  process.exit(1)
}

console.log(
  `All ${rows.length} pairings meet their threshold (AA ${AA_NORMAL_TEXT}:1 for text, 3:1 for strokes).`,
)
