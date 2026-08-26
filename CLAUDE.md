# materialcn

React component library: shadcn/ui primitives (Base UI) restyled with Material 3
Expressive tokens, on Tailwind v4. See README.md for the full token reference.

## Architecture

The load-bearing idea: **shadcn components are never patched for color.** Their
semantic variables (`--primary`, `--card`, `--border`) are pointed at M3 roles in
`src/styles/tokens/color.css`, so stock shadcn markup renders as Material.
Retheming is a token edit.

- `src/components/ui/` — shadcn components, added via the CLI. Treat as
  vendored; when upstream changes, use `shadcn add --diff` rather than editing
  blind.
- `src/styles/tokens/` — the M3 layer. `color.css`, `motion.css`,
  `typography.css`, `layout.css`, and `palettes.ts` are **generated** by
  `scripts/generate-tokens.mjs`; edit the script, run `pnpm tokens`.
  Alternate palettes are hue rotations of the kit baseline emitted under
  `[data-palette="…"]`; the baseline itself is never derived. Adding one is a
  line in `PALETTES` — then `pnpm check:contrast`, which holds every palette to
  AA and is what caught the one that needed a lightness nudge.
  `shape.css`, `spacing.css`, `elevation.css`, and `state.css` are hand-written.
  `palettes.ts` lives in `src/lib/`, not beside the CSS: it is copied into
  consumer projects by the registry, where a `../styles/tokens/` import has
  nothing to resolve against.
- `src/styles/theme.css` — maps `--m3-*` onto Tailwind's `@theme` namespaces.
  `inline` is required so runtime theme swaps are picked up. Two exceptions
  live in the generated token files instead: colors (emitted beside the roles so
  the two cannot drift) and breakpoints (which Tailwind substitutes into
  `@media` parameters, where a `var()` does not resolve, so they cannot be
  `inline` at all).
- `src/index.ts` — the public barrel. New components must be exported here.
- `registry.json` — **generated** by `scripts/generate-registry.mjs`
  (`pnpm registry`). `pnpm registry:build` regenerates it and flattens it into
  `public/r/`, which is gitignored and rebuilt by CI. See "Shipping as a shadcn
  registry" below.

## Conventions

- Colors: prefer shadcn semantics (`bg-primary`, `text-muted-foreground`). Reach
  for `bg-m3-*` only for roles shadcn has no equivalent of — tertiary, the
  surface-container ramp, outline.
- Motion: always pair `--m3-spring-<name>` with `--m3-spring-<name>-duration`.
  Spatial springs for movement, effects springs for color/opacity.
- Spacing: `flex` + `gap-*`, never `space-x/y-*`. `size-*` when width == height.
- Never add `dark:` utilities for color. Dark mode swaps token values; a `dark:`
  color override means the token layer is missing something.

## Gotcha: var() indirection and subtree theming

A `var()` is substituted where it is **declared**, not where it is used. Any
selector that redefines an `--m3-*` role must also re-declare the semantic
aliases that read it — otherwise the alias resolves once at `:root` against the
light value and inherits that fixed color into `.dark` subtrees. The generator
emits the alias block under `:root, .dark` for this reason. This bit us once
already; the side-by-side Storybook decorator is the regression check.

## Specs come from the Figma kit

Component geometry and token values are extracted from the official Material 3
Design Kit `.fig`, not transcribed from the docs site. `tools/fig-decode.mjs`
decodes the container (zip -> fig-kiwi -> self-describing Kiwi schema + zstd
document); `fig-tokens.mjs` and `fig-report.mjs` query the result. When a
measurement is in question, re-run those rather than guessing —
`docs/m3-specs.md` has the numbers already pulled.

## Gotcha: tailwind-merge and the m3 namespaces

`text-m3-label-lg` is a font-size and `text-m3-on-primary` is a color, but both
live under Tailwind's `text-*` utility. Unconfigured, tailwind-merge treats them
as one group and silently drops one — which renders filled buttons with
unreadable labels. `src/lib/utils.ts` teaches it the split; any new `m3-*`
namespace that collides with a built-in utility needs adding there too.

## Variants live in sibling `*-variants.ts` files

`buttonVariants`, `badgeVariants`, etc. are defined in `<name>-variants.ts` and
re-exported from the component. This is a deliberate divergence from upstream
shadcn's single-file layout, so expect `shadcn add --diff` to flag it.

The reason is React Fast Refresh: a module is only a hot boundary when every
export is a component *or* keeps a stable identity across re-evaluations
(`prevExports[key] === nextExports[key]` in the plugin's runtime). `cva()`
builds a new object each time its module runs, so exporting it from the
component file made every edit a full page reload. Re-exporting preserves
identity, because editing the component no longer re-evaluates the variants
module. Same reasoning puts `useTheme` in `theme-context.ts`.

Keep new `cva()` definitions and non-component exports out of component files.

## Gotcha: state layers must cover the border box

`after:inset-0` sizes the layer to the padding box while `rounded-[inherit]`
gives it the border-box radius. The mismatch shows as a pale crescent inside
the outline of any bordered variant when pressed. Use `after:-inset-px` and
keep a 1px (transparent) border on every variant so the offset stays exact.

## Gotcha: never spring an easing onto a clamped property

Spatial springs overshoot by ~9%. That is the point for `transform`, but on a
property CSS clamps at zero — `border-radius`, `opacity`, `width` — the
overshoot interpolates past the target into negative values and gets pinned at
the clamp. On the button's press morph this showed as the pill flicking through
a hard-cornered rectangle for more than half the transition.

Use an **effects** spring (critically damped, no overshoot) for anything
clamped. Spatial springs are for movement only.

Related: write a resting pill radius as half the element's height, not
`rounded-m3-full`. `full` is 9999px, so interpolating from it spends the whole
transition far outside the perceptible range — a pill looks identical at any
radius past half its height.

## Shipping as a shadcn registry

The item graph in `registry.json` — which files go together, what each one
depends on — is derived from the source tree, so adding a component needs no
registry edit. The prose is not: a title, description and categories go in
`scripts/lib/registry-metadata.mjs`, which also holds the registry's own name
and homepage. The generator fails on a missing entry, so nothing ships with a
placeholder blurb.

Three constraints the generator encodes, each of which was found the hard way
by installing into a scratch project:

- **Internal dependencies must be absolute URLs.** A bare `"button"` means
  *shadcn's* button, and `"./button.json"` is read from the consumer's working
  directory, not from the URL the item came from. `@materialcn/button` works
  only after the consumer registers the namespace, which breaks plain
  `shadcn add <url>`. The host comes from `REGISTRY_URL` in
  `scripts/generate-registry.mjs`; set it in the environment to build against a
  local server.
- **The token layer is inlined, not shipped as files.** An item can ship a
  `.css` file, but the `@import` for it goes into the consumer's own stylesheet
  — at a path the registry cannot know — so no relative specifier resolves.
  `scripts/lib/css-to-registry.mjs` encodes the stylesheet as the CLI's
  CSS-in-JSON instead.
- **Declarations cannot sit directly inside an at-rule.** The CLI treats an
  at-rule's children as selectors and writes a stray declaration out as
  `.temp{<value>}`, which throws mid-install. `@theme` is the exception, routed
  through `cssVars.theme`; the converter throws on anything else.

An item cycle means installing one component drags in an unrelated one, so a
helper imported by more than one item is promoted to an item of its own and
`findCycle` fails the build if one survives. `pnpm test` validates the result
against the CLI's own zod schemas.

To verify a change for real, serve `public/r` and install from it into a
scratch project — `shadcn add` is the only thing that exercises the CSS merge.

## Verifying

- `pnpm test` renders every story in a real Chromium via Vitest. It is the
  fastest real check that nothing is broken — run it after token changes.
- `pnpm typecheck && pnpm build` before calling anything done.
- Stories with `parameters: { sideBySide: true }` render light and dark at once;
  use that for any change to the token layer.
