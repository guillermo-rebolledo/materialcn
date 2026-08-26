/**
 * Generates the two token files that are tedious/error-prone to hand-write:
 *
 *   src/styles/tokens/color.css   M3 color roles (light + dark) in OKLCH
 *   src/styles/tokens/motion.css  M3 Expressive spring easings as CSS linear()
 *
 * Run with: pnpm tokens
 */
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import {
  contrastRatio,
  fitToSrgb,
  formatOklch,
  hexToOklchValues,
  oklchToSrgb,
} from "./hex-to-oklch.mjs"
import { allPairings } from "./contrast-pairings.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const out = (name) => path.join(root, "src/styles/tokens", name)

/* ------------------------------------------------------------------ color */

// Material 3 baseline scheme (seed #6750A4), taken verbatim from the roles
// in the official Material 3 Design Kit — see docs/m3-specs.md.
const LIGHT = {
  "primary": "#6750A4",
  "surface-tint": "#6750A4",
  "on-primary": "#FFFFFF",
  "primary-container": "#EADDFF",
  "on-primary-container": "#4F378A",
  "secondary": "#625B71",
  "on-secondary": "#FFFFFF",
  "secondary-container": "#E8DEF8",
  "on-secondary-container": "#4A4459",
  "tertiary": "#7D5260",
  "on-tertiary": "#FFFFFF",
  "tertiary-container": "#FFD8E4",
  "on-tertiary-container": "#633B48",
  "error": "#B3261E",
  "on-error": "#FFFFFF",
  "error-container": "#F9DEDC",
  "on-error-container": "#852221",
  "background": "#FEF7FF",
  "on-background": "#1D1B20",
  "surface": "#FEF7FF",
  "on-surface": "#1D1B20",
  "surface-variant": "#E7E0EC",
  "on-surface-variant": "#49454F",
  "outline": "#79747E",
  "outline-variant": "#CAC4D0",
  "shadow": "#000000",
  "scrim": "#000000",
  "inverse-surface": "#322F35",
  "inverse-on-surface": "#F5EFF7",
  "inverse-primary": "#D0BCFF",
  "primary-fixed": "#EADDFF",
  "on-primary-fixed": "#21005D",
  "primary-fixed-dim": "#D0BCFF",
  "on-primary-fixed-variant": "#4F378B",
  "secondary-fixed": "#E8DEF8",
  "on-secondary-fixed": "#1D192B",
  "secondary-fixed-dim": "#CCC2DC",
  "on-secondary-fixed-variant": "#4A4458",
  "tertiary-fixed": "#FFD8E4",
  "on-tertiary-fixed": "#31111D",
  "tertiary-fixed-dim": "#EFB8C8",
  "on-tertiary-fixed-variant": "#633B48",
  "surface-dim": "#DED8E1",
  "surface-bright": "#FEF7FF",
  "surface-container-lowest": "#FFFFFF",
  "surface-container-low": "#F7F2FA",
  "surface-container": "#F3EDF7",
  "surface-container-high": "#ECE6F0",
  "surface-container-highest": "#E6E0E9",
}

const DARK = {
  "primary": "#D0BCFF",
  "surface-tint": "#D0BCFF",
  "on-primary": "#381E72",
  "primary-container": "#4F378B",
  "on-primary-container": "#EADDFF",
  "secondary": "#CCC2DC",
  "on-secondary": "#332D41",
  "secondary-container": "#4A4458",
  "on-secondary-container": "#E8DEF8",
  "tertiary": "#EFB8C8",
  "on-tertiary": "#492532",
  "tertiary-container": "#633B48",
  "on-tertiary-container": "#FFD8E4",
  "error": "#F2B8B5",
  "on-error": "#601410",
  "error-container": "#8C1D18",
  "on-error-container": "#F9DEDC",
  "background": "#141218",
  "on-background": "#E6E0E9",
  "surface": "#141218",
  "on-surface": "#E6E0E9",
  "surface-variant": "#49454F",
  "on-surface-variant": "#CAC4D0",
  "outline": "#938F99",
  "outline-variant": "#49454F",
  "shadow": "#000000",
  "scrim": "#000000",
  "inverse-surface": "#E6E0E9",
  "inverse-on-surface": "#322F35",
  "inverse-primary": "#6750A4",
  "primary-fixed": "#EADDFF",
  "on-primary-fixed": "#21005D",
  "primary-fixed-dim": "#D0BCFF",
  "on-primary-fixed-variant": "#4F378B",
  "secondary-fixed": "#E8DEF8",
  "on-secondary-fixed": "#1D192B",
  "secondary-fixed-dim": "#CCC2DC",
  "on-secondary-fixed-variant": "#4A4458",
  "tertiary-fixed": "#FFD8E4",
  "on-tertiary-fixed": "#31111D",
  "tertiary-fixed-dim": "#EFB8C8",
  "on-tertiary-fixed-variant": "#633B48",
  "surface-dim": "#141218",
  "surface-bright": "#3B383E",
  "surface-container-lowest": "#0F0D13",
  "surface-container-low": "#1D1B20",
  "surface-container": "#211F26",
  "surface-container-high": "#2B2930",
  "surface-container-highest": "#36343B",
}

/*
 * Alternate palettes, as a hue rotation of the baseline.
 *
 * The baseline above is the kit's, verbatim, and stays the default. These are
 * derived from it rather than seeded independently, and that is the whole
 * point: rotating hue holds every role's lightness and chroma, so the surface
 * ramp keeps its steps, every container keeps its distance from its content
 * role, and the contrast the baseline was verified for survives the change.
 * `pnpm check:contrast` checks each of them anyway rather than taking that on
 * trust.
 *
 * A palette is one number. Adding one is a line here and `pnpm tokens`.
 */
const BASELINE_HUE = hexToOklchValues(LIGHT.primary).H

const PALETTES = [
  { id: "ocean", label: "Ocean", hue: 250 },
  { id: "forest", label: "Forest", hue: 150 },
  { id: "ember", label: "Ember", hue: 55 },
  { id: "rose", label: "Rose", hue: 15 },
]

/*
 * Error keeps the baseline's red under every palette. It is the one family
 * whose colour carries meaning rather than brand: a green "delete" confirmation
 * is a worse interface, however well it matches.
 */
const isErrorRole = (role) => role === "error" || role.includes("error")

function rotate(scheme, hue) {
  const delta = hue - BASELINE_HUE
  return Object.fromEntries(
    Object.entries(scheme).map(([role, hex]) => {
      const value = hexToOklchValues(hex)
      if (isErrorRole(role) || value.C < 0.0005) return [role, value]
      return [role, fitToSrgb({ ...value, H: (value.H + delta + 360) % 360 })]
    }),
  )
}

const ratioOf = (a, b) =>
  contrastRatio(oklchToSrgb(a.L, a.C, a.H).linear, oklchToSrgb(b.L, b.C, b.H).linear)

/**
 * Restores the contrast a rotation cost, by moving lightness and nothing else.
 *
 * Rotating hue holds OKLCH lightness, but WCAG's relative luminance is
 * *hue-weighted* — green carries far more of it than blue at the same L. So a
 * pairing that clears AA in violet can fall under it in green even though
 * nothing about its lightness changed. The baseline's tightest pairing, the
 * snackbar's action label on its own surface, has barely half a point of
 * headroom, and that is the one that goes.
 *
 * The correction walks the *content* role's lightness away from its container
 * until the pairing clears, one role at a time, re-fitting chroma to sRGB at
 * each step. Containers are left alone: they are surfaces other things sit on,
 * and moving one to fix its label would shift everything else that pairs with
 * it. Repeated to a fixed point because a role can appear in several pairings —
 * `on-surface` is set against nine.
 */
function correctContrast(scheme, label) {
  const STEP = 0.002
  const MAX_STEPS = 200
  const corrected = { ...scheme }

  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false

    for (const { content, container, min } of allPairings()) {
      const a = corrected[content]
      const b = corrected[container]
      if (!a || !b) throw new Error(`${label}: unknown role ${content}/${container}`)
      if (ratioOf(a, b) >= min) continue

      // Away from the container: a light label goes lighter, a dark one darker.
      const direction = a.L >= b.L ? 1 : -1
      let next = a
      let steps = 0
      while (ratioOf(next, corrected[container]) < min && steps < MAX_STEPS) {
        const L = Math.min(1, Math.max(0, next.L + direction * STEP))
        if (L === next.L) break
        next = fitToSrgb({ ...next, L })
        steps += 1
      }

      if (ratioOf(next, corrected[container]) < min) {
        throw new Error(
          `${label}: cannot reach ${min}:1 for ${content} on ${container}`,
        )
      }

      corrections.push(
        `${label}: ${content} L ${a.L.toFixed(4)} -> ${next.L.toFixed(4)} ` +
          `for ${min}:1 on ${container}`,
      )
      corrected[content] = next
      changed = true
    }

    if (!changed) return corrected
  }

  throw new Error(`${label}: contrast correction did not settle`)
}

/** Every lightness nudge made, reported at the end of the run. */
const corrections = []

/*
 * Memoised: each palette's dark scheme is emitted twice — once for `.dark` and
 * once for the `prefers-color-scheme` fallback — and correcting it twice would
 * both repeat the work and report every nudge twice.
 */
const paletteCache = new Map()

function palette(hue, scheme, label) {
  const key = `${hue}:${label}`
  if (!paletteCache.has(key)) {
    paletteCache.set(key, correctContrast(rotate(scheme, hue), label))
  }
  return paletteCache.get(key)
}

// shadcn/ui semantic variables, expressed as M3 roles. This is the bridge that
// makes every stock shadcn component render as Material without patching it.
const SHADCN_BRIDGE = `  --background: var(--m3-surface);
  --foreground: var(--m3-on-surface);
  --card: var(--m3-surface-container-low);
  --card-foreground: var(--m3-on-surface);
  --popover: var(--m3-surface-container);
  --popover-foreground: var(--m3-on-surface);
  --primary: var(--m3-primary);
  --primary-foreground: var(--m3-on-primary);
  --secondary: var(--m3-secondary-container);
  --secondary-foreground: var(--m3-on-secondary-container);
  --muted: var(--m3-surface-container-highest);
  --muted-foreground: var(--m3-on-surface-variant);
  --accent: var(--m3-tertiary-container);
  --accent-foreground: var(--m3-on-tertiary-container);
  --destructive: var(--m3-error);
  --destructive-foreground: var(--m3-on-error);
  --border: var(--m3-outline-variant);
  --input: var(--m3-outline);
  --ring: var(--m3-primary);

  --sidebar: var(--m3-surface-container-low);
  --sidebar-foreground: var(--m3-on-surface);
  --sidebar-primary: var(--m3-primary);
  --sidebar-primary-foreground: var(--m3-on-primary);
  --sidebar-accent: var(--m3-secondary-container);
  --sidebar-accent-foreground: var(--m3-on-secondary-container);
  --sidebar-border: var(--m3-outline-variant);
  --sidebar-ring: var(--m3-primary);

  --chart-1: var(--m3-primary);
  --chart-2: var(--m3-tertiary);
  --chart-3: var(--m3-secondary);
  --chart-4: var(--m3-primary-container);
  --chart-5: var(--m3-tertiary-container);
`.trimEnd()

const block = (scheme, indent = "  ") =>
  Object.entries(scheme)
    .map(
      ([name, value]) =>
        `${indent}--m3-${name}: ${formatOklch(
          typeof value === "string" ? hexToOklchValues(value) : value,
        )};`,
    )
    .join("\n")

/*
 * A palette's selectors. `[data-palette]` is an attribute selector, so it has
 * the same specificity as `:root` and as `.dark` — which is why the dark rules
 * below are written as a compound rather than relying on source order alone.
 *
 * `.dark` is still allowed to be a descendant, so a palette on <html> and a
 * dark subtree inside it both work.
 */
const paletteRoot = (id) => `[data-palette="${id}"]`
const paletteDark = (id) =>
  [
    // The palette element is itself the dark root.
    `[data-palette="${id}"].dark`,
    // A dark subtree inside a palette.
    `[data-palette="${id}"] .dark`,
    // A palette applied inside a dark subtree — a swatch in a theme picker,
    // a preview pane. Without this it would draw its light scheme on a dark
    // page, which is not what "this is the Ocean palette" should look like.
    `.dark [data-palette="${id}"]`,
  ].join(",\n")

const paletteBlocks = PALETTES.map(
  ({ id, hue }) => `
${paletteRoot(id)} {
${block(palette(hue, LIGHT, `${id} light`))}
}

${paletteDark(id)} {
${block(palette(hue, DARK, `${id} dark`))}
}`,
).join("\n")

/*
 * The bridge is repeated under every selector that redefines an `--m3-*` role
 * — see the note beside it below. Palettes redefine all of them, so each one
 * needs its own copy or a palette applied to a subtree would inherit the root
 * palette's already-substituted values.
 */
const bridgeSelectors = [
  ":root",
  ".dark",
  ...PALETTES.flatMap(({ id }) => [paletteRoot(id), paletteDark(id)]),
].join(",\n")

const paletteFallbacks = PALETTES.map(
  ({ id, hue }) => `
  [data-palette="${id}"]:not(.light):not(.dark) {
${block(palette(hue, DARK, `${id} dark`), "    ")}
  }`,
).join("\n")

const colorCss = `/* GENERATED by scripts/generate-tokens.mjs — do not edit by hand. */

/*
 * Material 3 color roles.
 *
 * Every role is defined under three selectors so a consumer can opt into any
 * strategy without touching component code:
 *
 *   :root                     light, the default
 *   .dark                     explicit dark, set by a theme toggle
 *   prefers-color-scheme      follows the OS, unless \`.light\` opts out
 *
 * Alternate palettes repeat all three under \`[data-palette="…"]\`. Setting that
 * attribute — on <html>, or on any subtree — re-points every role, and because
 * the Tailwind utilities are \`@theme inline\` they follow it at runtime.
 *
 * \`.dark\` is deliberately not root-scoped, so a subtree can carry its own
 * scheme — a dark navbar on a light page, or a light/dark preview pair.
 *
 * Because dark mode re-points the same variable names, no component ever needs
 * a \`dark:\` utility to change color.
 */

:root {
${block(LIGHT)}
}

.dark {
${block(DARK)}
}
${paletteBlocks}

/*
 * shadcn/ui semantics, mapped onto the M3 roles.
 *
 * This block is repeated for every selector that redefines an \`--m3-*\` role,
 * and that repetition is load-bearing. A \`var()\` is substituted where it is
 * *declared*, not where it is used — so a lone \`:root\` declaration of
 * \`--background: var(--m3-surface)\` would resolve to the light value once and
 * inherit that fixed color into \`.dark\` subtrees.
 */
${bridgeSelectors} {
${SHADCN_BRIDGE}
}

@media (prefers-color-scheme: dark) {
  :root:not(.light):not(.dark) {
${block(DARK, "    ")}
  }
${paletteFallbacks}
}
`

const themeColors = Object.keys(LIGHT)
  .filter((role) => role !== "shadow")
  .map((role) => `  --color-m3-${role}: var(--m3-${role});`)
  .join("\n")

writeFileSync(
  out("color.css"),
  `${colorCss}
/*
 * Tailwind utilities for every role: \`bg-m3-primary-container\`,
 * \`text-m3-on-surface-variant\`, \`border-m3-outline\`, and so on. \`inline\` is
 * required — it makes Tailwind emit the \`var()\` rather than the resolved
 * value, which is what lets a subtree re-theme at runtime.
 */
@theme inline {
${themeColors}
}
`,
)

/* ----------------------------------------------------------------- motion */

/**
 * M3 Expressive replaced fixed bezier curves with spring physics. CSS has no
 * spring() yet, so we sample a damped harmonic oscillator and emit the result
 * as a linear() easing — visually identical, and it works on any property.
 */
function spring({ stiffness, damping: zeta, mass = 1, samples = 42 }) {
  const w0 = Math.sqrt(stiffness / mass)
  const position = (t) => {
    if (zeta < 1) {
      const wd = w0 * Math.sqrt(1 - zeta * zeta)
      return (
        Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
      )
    }
    return Math.exp(-w0 * t) * (1 + w0 * t)
  }

  // Settling time: first moment the envelope stays within 0.1% of rest.
  let duration = 0
  for (let t = 0; t < 10; t += 1 / 240) {
    if (Math.abs(position(t)) < 0.001) {
      duration = t
      break
    }
  }
  duration = duration || 10

  const points = Array.from({ length: samples + 1 }, (_, i) => {
    const progress = 1 - position((i / samples) * duration)
    return Number(progress.toFixed(4))
  })
  points[0] = 0
  points[samples] = 1

  return { easing: `linear(${points.join(", ")})`, ms: Math.round(duration * 1000) }
}

// M3 Expressive ships two motion schemes. "Expressive" uses looser damping so
// movement overshoots and settles — that bounce is the whole personality of the
// system. "Standard" is the restrained one. Spatial springs move things;
// effects springs animate color/opacity and must never overshoot.
const SCHEMES = {
  expressive: {
    "spatial-fast": { stiffness: 800, damping: 0.6 },
    "spatial-default": { stiffness: 380, damping: 0.8 },
    "spatial-slow": { stiffness: 200, damping: 0.8 },
    "effects-fast": { stiffness: 3800, damping: 1 },
    "effects-default": { stiffness: 1600, damping: 1 },
    "effects-slow": { stiffness: 800, damping: 1 },
  },
  standard: {
    "spatial-fast": { stiffness: 1400, damping: 0.9 },
    "spatial-default": { stiffness: 700, damping: 0.9 },
    "spatial-slow": { stiffness: 300, damping: 0.9 },
    "effects-fast": { stiffness: 3800, damping: 1 },
    "effects-default": { stiffness: 1600, damping: 1 },
    "effects-slow": { stiffness: 800, damping: 1 },
  },
}

const TOKENS = Object.keys(SCHEMES.expressive)

const schemeLines = Object.entries(SCHEMES)
  .map(([scheme, springs]) =>
    Object.entries(springs)
      .flatMap(([name, cfg]) => {
        const { easing, ms } = spring(cfg)
        return [
          `  --m3-spring-${scheme}-${name}: ${easing};`,
          `  --m3-spring-${scheme}-${name}-duration: ${ms}ms;`,
          "",
        ]
      })
      .join("\n")
      .trimEnd(),
  )
  .join("\n\n")

// The active scheme. Redefine these six pairs to switch the whole library over
// to the standard scheme without touching a single component.
const activeLines = TOKENS.flatMap((name) => [
  `  --m3-spring-${name}: var(--m3-spring-expressive-${name});`,
  `  --m3-spring-${name}-duration: var(--m3-spring-expressive-${name}-duration);`,
]).join("\n")

const motionCss = `/* GENERATED by scripts/generate-tokens.mjs — do not edit by hand. */

/*
 * Material 3 Expressive motion.
 *
 * Springs are the default: pair \`--m3-spring-<name>\` with its matching
 * \`-duration\` so the curve finishes exactly when the transition does.
 * The bezier easings below remain for the cases springs are wrong for —
 * anything entering or leaving the screen entirely.
 */

:root {
${schemeLines}

  /* Active scheme. */
${activeLines}

  /* Legacy M3 easing set. */
  --m3-ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --m3-ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --m3-ease-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --m3-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --m3-ease-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --m3-ease-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
  --m3-ease-linear: cubic-bezier(0, 0, 1, 1);

  /* M3 duration scale, for the bezier easings. */
  --m3-duration-short-1: 50ms;
  --m3-duration-short-2: 100ms;
  --m3-duration-short-3: 150ms;
  --m3-duration-short-4: 200ms;
  --m3-duration-medium-1: 250ms;
  --m3-duration-medium-2: 300ms;
  --m3-duration-medium-3: 350ms;
  --m3-duration-medium-4: 400ms;
  --m3-duration-long-1: 450ms;
  --m3-duration-long-2: 500ms;
  --m3-duration-long-3: 550ms;
  --m3-duration-long-4: 600ms;
  --m3-duration-extra-long-1: 700ms;
  --m3-duration-extra-long-2: 800ms;
  --m3-duration-extra-long-3: 900ms;
  --m3-duration-extra-long-4: 1000ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
${TOKENS.map(
    (name) =>
      `    --m3-spring-${name}: var(--m3-ease-linear);\n    --m3-spring-${name}-duration: 1ms;`,
  ).join("\n")}
  }
}
`

writeFileSync(out("motion.css"), motionCss)

/*
 * The palette list, as TypeScript.
 *
 * Emitted from the same array that produced the CSS so the two cannot drift:
 * a palette that exists in one and not the other is the kind of bug that only
 * shows up as a theme switcher with a dead entry in it.
 */
writeFileSync(
  path.join(root, "src/lib/palettes.ts"),
  `/* GENERATED by scripts/generate-tokens.mjs — do not edit by hand. */

/**
 * The palettes shipped in \`styles.css\`, beyond the default.
 *
 * Setting \`data-palette\` to one of these ids — on \`<html>\`, or on any element
 * — re-points every M3 role beneath it. \`ThemeProvider\` does it for you.
 */
export const PALETTES = [
${PALETTES.map(
  ({ id, label, hue }) =>
    `  { id: "${id}", label: "${label}", hue: ${hue} },`,
).join("\n")}
] as const

/** A palette id, or \`"baseline"\` for the kit's own scheme. */
export type Palette = "baseline" | (typeof PALETTES)[number]["id"]
`,
)

console.log("Wrote src/styles/tokens/color.css and src/styles/tokens/motion.css")
console.log("Wrote src/lib/palettes.ts")

// Reported rather than silent: a palette that needed a nudge is a fact about
// that palette, and a long list here means a hue was a poor choice.
if (corrections.length) {
  console.log(`  ${corrections.length} lightness correction(s) for contrast:`)
  for (const note of corrections) console.log(`    ${note}`)
}

/* ----------------------------------------------------------------- layout */

/**
 * Material's window size classes, and the responsive grid defined against each.
 *
 * The breakpoints are Material's own, not Tailwind's stock scale — `md` fires
 * at 768px, which lands in the middle of Material's medium class rather than on
 * either of its edges.
 *
 * `min` is the *lower* bound of a class; its upper bound is the next entry's
 * lower bound, minus one.
 *
 * `columns`, `gutter`, and `margin` are read off the `Examples/Layout grid`
 * component set's Figma layout grids in the official kit — `numSections`,
 * `gutterSize`, and `offset` respectively — not transcribed from the docs site,
 * which disagrees with the kit about medium. Re-derive with tools/fig-specs.mjs
 * rather than editing these by hand.
 *
 * `maxWidth` is the *content* width the grid is held to, before margins. Only
 * extra-large has one: its kit grid is CENTER rather than STRETCH, pinning 12
 * columns of 72dp with 24dp gutters and letting the margins absorb the rest, so
 * a line of body text does not run the width of a television.
 */
const WINDOW_SIZE_CLASSES = [
  {
    name: "compact",
    min: 0,
    note: "Phone in portrait.",
    columns: 4,
    gutter: 16,
    margin: 16,
  },
  {
    name: "medium",
    min: 600,
    note: "Tablet in portrait, or an unfolded phone.",
    columns: 8,
    gutter: 16,
    margin: 32,
  },
  {
    name: "expanded",
    min: 840,
    note: "Tablet in landscape, or a small desktop window.",
    columns: 12,
    gutter: 24,
    margin: 24,
  },
  {
    name: "large",
    min: 1200,
    note: "Desktop.",
    columns: 12,
    gutter: 24,
    margin: 200,
  },
  {
    name: "extra-large",
    min: 1600,
    note: "Ultra-wide desktop, or a TV.",
    columns: 12,
    gutter: 24,
    margin: 24,
    // 12 × 72dp columns + 11 × 24dp gutters.
    maxWidth: 12 * 72 + 11 * 24,
  },
]

const bounds = (i) => {
  const { min } = WINDOW_SIZE_CLASSES[i]
  const next = WINDOW_SIZE_CLASSES[i + 1]
  return next ? `${min}–${next.min - 1}dp` : `${min}dp and up`
}

const layoutVars = WINDOW_SIZE_CLASSES.map(
  ({ name, min }) => `  --m3-breakpoint-${name}: ${min}px;`,
).join("\n")

// Deliberately not `inline`: Tailwind substitutes these into `@media`
// parameters, which cannot resolve a `var()`. The literal has to reach the
// media query — which is also why Tailwind consumes these rather than emitting
// them as custom properties, and why the `:root` block above exists.
const layoutTheme = WINDOW_SIZE_CLASSES.map(
  ({ name, min, note }, i) =>
    `  /* ${bounds(i).padEnd(14)} ${note} */\n  --breakpoint-m3-${name}: ${min}px;`,
).join("\n")

/**
 * The grid is one set of three variables redefined per class, rather than one
 * variable per class. That keeps `m3-grid` free of media queries: it reads
 * `--m3-grid-columns` once and the cascade supplies the right value.
 */
const gridVars = ({ columns, gutter, margin, maxWidth }, indent) =>
  [
    `${indent}--m3-grid-columns: ${columns};`,
    `${indent}--m3-grid-gutter: ${gutter}px;`,
    `${indent}--m3-grid-margin: ${margin}px;`,
    `${indent}--m3-grid-max-width: ${maxWidth ? `${maxWidth + 2 * margin}px` : "none"};`,
  ].join("\n")

const gridQueries = WINDOW_SIZE_CLASSES.slice(1)
  .map(
    (cls) => `@media (width >= ${cls.min}px) {
  :root {
${gridVars(cls, "    ")}
  }
}
`,
  )
  .join("\n")

const layoutCss = `/* GENERATED by scripts/generate-tokens.mjs — do not edit by hand. */

/*
 * Material window size classes, and the responsive grid.
 *
 * A responsive decision in Material is made against the *window*, not the
 * device, and against one of five named classes rather than a raw pixel count.
 * The variants are mobile-first min-widths, so \`m3-compact\` is the base every
 * later class overrides — \`p-4 m3-expanded:p-6\`.
 *
 * These sit alongside Tailwind's stock \`sm\`/\`md\`/\`lg\`; the \`m3-\` prefix is
 * what keeps a Material breakpoint from being confused with one that is a few
 * pixels away and means something else.
 *
 * Every variant is a min-width, so \`m3-compact:\` matches at *every* width —
 * it names the base, it does not isolate the compact class. For styling that
 * must stop at a boundary, negate the next one up: \`max-m3-medium:\` is
 * compact-only, \`m3-medium:max-m3-expanded:\` is medium-only.
 *
 * Material writes these bounds in dp; on the web a dp is a CSS pixel, so the
 * values are emitted as \`px\` and the two are the same number.
 */

/*
 * The same bounds, readable at runtime. Tailwind substitutes the \`@theme\`
 * values straight into \`@media\` parameters and never emits them as custom
 * properties, so script that needs to know where a boundary sits reads these.
 */
:root {
${layoutVars}
}

@theme {
${layoutTheme}
}

/*
 * The responsive grid. Column count, gutter, and margin all change together at
 * a class boundary — that co-movement is the grid, and it is why these are one
 * set of variables redefined per class rather than five separate sets.
 *
 * Consume them with the \`m3-grid\` utility (see index.css); place children with
 * Tailwind's own \`col-span-*\`, stepped per class where the span should change:
 * \`col-span-4 m3-expanded:col-span-6\`.
 */
:root {
${gridVars(WINDOW_SIZE_CLASSES[0], "  ")}
}

${gridQueries}`

writeFileSync(out("layout.css"), layoutCss)

console.log("Wrote src/styles/tokens/layout.css")

/* ------------------------------------------------------------- typography */

/**
 * The M3 type scale: five roles at three sizes each, in the order they sit on
 * the ladder. Sizes and line heights are dp; tracking is dp too, converted with
 * the rest.
 *
 * The ladder order matters — the responsive scale below steps a role down to
 * the *next entry*, so display-lg on a phone renders at display-md's size.
 */
const TYPE_SCALE = [
  ["display-lg", 57, 64, -0.25],
  ["display-md", 45, 52, 0],
  ["display-sm", 36, 44, 0],
  ["headline-lg", 32, 40, 0],
  ["headline-md", 28, 36, 0],
  ["headline-sm", 24, 32, 0],
  ["title-lg", 22, 28, 0],
  ["title-md", 16, 24, 0.15],
  ["title-sm", 14, 20, 0.1],
  ["body-lg", 16, 24, 0.5],
  ["body-md", 14, 20, 0.25],
  ["body-sm", 12, 16, 0.4],
  ["label-lg", 14, 20, 0.1],
  ["label-md", 12, 16, 0.5],
  ["label-sm", 11, 16, 0.5],
]

/**
 * The roles that shrink on a narrow window. Display and headline exist to be
 * the largest thing on a screen — at 57dp on a 360dp phone that stops being
 * hierarchy and becomes an obstacle. Title, body, and label are left fixed:
 * they are reading and control text, and resizing them with the window would
 * make the measure worse, not better, on the very screens where it is tightest.
 */
const RESPONSIVE_ROLES = TYPE_SCALE.filter(([role]) =>
  /^(display|headline)-/.test(role),
).map(([role]) => role)

/** The class at and above which the canonical scale applies. */
const TYPE_FULL_SCALE_FROM = WINDOW_SIZE_CLASSES.find(
  (cls) => cls.name === "expanded",
)

const rem = (dp) => `${dp / 16}rem`

const typeLines = (entries, indent) =>
  entries
    .flatMap(([role, size, line, tracking]) => [
      `${indent}--m3-${role}-size: ${rem(size)}; /* ${size}dp */`,
      `${indent}--m3-${role}-line: ${rem(line)};`,
      `${indent}--m3-${role}-tracking: ${rem(tracking)};`,
    ])
    .join("\n")

/** Role -> the entry one step down the ladder. */
const stepDown = (role) => {
  const index = TYPE_SCALE.findIndex(([name]) => name === role)
  return TYPE_SCALE[index + 1]
}

const groups = [
  ["display", "reserved for the largest, shortest strings on a screen"],
  ["headline", "high-emphasis text, shorter than display"],
  ["title", "medium-emphasis text, typically a section or card heading"],
  ["body", "long-form reading text"],
  ["label", "the text inside components: buttons, chips, tabs"],
]

const canonicalBlock = groups
  .map(([group, note]) => {
    const entries = TYPE_SCALE.filter(([role]) => role.startsWith(`${group}-`))
    return `  /* ${group[0].toUpperCase()}${group.slice(1)} — ${note}. */\n${typeLines(entries, "  ")}`
  })
  .join("\n\n")

const steppedBlock = RESPONSIVE_ROLES.map((role) => {
  const [next, size, line, tracking] = stepDown(role)
  return [
    `    /* ${role} renders at ${next}'s step. */`,
    `    --m3-${role}-size: ${rem(size)}; /* ${size}dp */`,
    `    --m3-${role}-line: ${rem(line)};`,
    `    --m3-${role}-tracking: ${rem(tracking)};`,
  ].join("\n")
}).join("\n\n")

const typographyCss = `/* GENERATED by scripts/generate-tokens.mjs — do not edit by hand. */

/*
 * Material 3 type scale.
 *
 * Five roles (display / headline / title / body / label) at three sizes each.
 * Expressive adds an "emphasized" weight for every role — on Roboto Flex that
 * is a variable-weight axis shift, which is why the font is loaded variable.
 *
 * Each role is stored as a size/line-height pair plus its own tracking, so
 * theme.css can expose all three to Tailwind's \`--text-*\` namespace in one go.
 */

:root {
  --m3-font-brand: "Roboto Flex Variable", "Roboto", ui-sans-serif, system-ui, sans-serif;
  --m3-font-plain: var(--m3-font-brand);

${canonicalBlock}

  /* Weights. \`emphasized\` is the Expressive addition. */
  --m3-weight-regular: 400;
  --m3-weight-medium: 500;
  --m3-weight-emphasized: 700;
}

/*
 * The responsive scale.
 *
 * Below the ${TYPE_FULL_SCALE_FROM.name} window size class, every display and headline role
 * renders at the *next step down the ladder* — display-lg at display-md's size,
 * headline-sm at title-lg's. One rule, applied uniformly, rather than a second
 * hand-tuned scale: the ladder's own steps are already the sizes Material
 * considers adjacent, so stepping along it keeps the hierarchy intact.
 *
 * Line height and tracking come down with the size. Leaving a 45dp line height
 * under 36dp text is the usual way a "responsive" scale goes wrong.
 *
 * Title, body, and label do not move. They are reading and control text, and
 * shrinking them on a phone would tighten the measure on the screen where it is
 * already tightest.
 *
 * This is a \`max-width\` query rather than the mobile-first form the rest of the
 * layer uses, deliberately: it keeps the canonical scale as the base, so the
 * values documented in the README and the foundations story are what a role
 * resolves to unless something narrows it. Redefining the roles mobile-first
 * would need literals in both blocks, since a \`var()\` pointing at the next rung
 * would pick up that rung's own override rather than its canonical value.
 */
@media (width < ${TYPE_FULL_SCALE_FROM.min}px) {
  :root {
${steppedBlock}
  }
}
`

writeFileSync(out("typography.css"), typographyCss)

console.log("Wrote src/styles/tokens/typography.css")
