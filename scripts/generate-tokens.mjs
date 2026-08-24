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
import { hexToOklch } from "./hex-to-oklch.mjs"

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

const block = (scheme) =>
  Object.entries(scheme)
    .map(([name, hex]) => `  --m3-${name}: ${hexToOklch(hex)};`)
    .join("\n")

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

/*
 * shadcn/ui semantics, mapped onto the M3 roles.
 *
 * This block is repeated for every selector that redefines an \`--m3-*\` role,
 * and that repetition is load-bearing. A \`var()\` is substituted where it is
 * *declared*, not where it is used — so a lone \`:root\` declaration of
 * \`--background: var(--m3-surface)\` would resolve to the light value once and
 * inherit that fixed color into \`.dark\` subtrees.
 */
:root,
.dark {
${SHADCN_BRIDGE}
}

@media (prefers-color-scheme: dark) {
  :root:not(.light):not(.dark) {
${block(DARK)
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}
  }
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

console.log("Wrote src/styles/tokens/color.css and src/styles/tokens/motion.css")
