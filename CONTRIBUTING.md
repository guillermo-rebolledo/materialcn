# Contributing

## Design principles

Four rules carry most of the architecture. They read as engineering details in
`CLAUDE.md`; they are principles, and a change that breaks one is a change to
the system rather than to a component.

### Retheming is a token edit

shadcn components are **never patched for colour**. Their semantic variables —
`--primary`, `--card`, `--border` — are pointed at Material roles in
`src/styles/tokens/color.css`, so stock shadcn markup renders as Material.

The consequence you have to hold onto: if a component needs a colour it cannot
express through a token, the token layer is missing something. Adding the colour
to the component is the change that makes the next retheme a per-component
audit instead of one file.

### Dark mode is a token swap, never a utility override

**Never add a `dark:` utility for colour.** Dark mode re-points the same
variable names, so a component that needs `dark:bg-…` is telling you a role does
not exist yet.

The trap underneath it: a `var()` is substituted where it is *declared*, not
where it is used. Any selector that redefines an `--m3-*` role must also
re-declare the semantic aliases that read it, or the alias resolves once at
`:root` against the light value and inherits that fixed colour into `.dark`
subtrees. The generator emits the alias block under `:root, .dark` for exactly
this reason, and the side-by-side stories are the regression check.

### Spring choice follows from whether the property clamps

Spatial springs overshoot by about 9%. That is the point for `transform`. On a
property CSS clamps at zero — `border-radius`, `opacity`, `width` — the
overshoot interpolates past the target into negative values and gets pinned at
the clamp.

So: **spatial springs for movement, effects springs for anything clamped.**
Effects springs are critically damped and do not overshoot. On the button's
press morph this showed up as the pill flicking through a hard-cornered
rectangle for over half the transition.

Related, and the same class of mistake: write a resting pill radius as half the
element's height, not `rounded-m3-full`. `full` is 9999px, so interpolating from
it spends the whole transition far outside the perceptible range.

### Specs come from the kit, not the docs site

Component geometry and token values are extracted from the official Material 3
Design Kit `.fig`, not transcribed from `m3.material.io`. The two disagree — the
responsive grid's medium breakpoint is 8 columns in the kit and 12 on the site,
and several numbers in `docs/m3-specs.md` had been taken from the kit's
deprecated internal canvas before an audit caught them.

When a measurement is in question, re-run `tools/fig-specs.mjs` rather than
guessing. `docs/m3-specs.md` has the numbers already pulled.

## Definition of done

Every change should:

- Match the geometry, colour roles, state layers, and motion in the Material 3
  design kit.
- Use an existing shadcn/Base UI primitive when one provides the required
  behaviour.
- Use semantic tokens or existing `m3-` tokens rather than raw colours.
- Support keyboard interaction, focus-visible treatment, disabled states, and
  reduced motion where applicable.
- Be exported from `src/index.ts`.
- Include colocated Storybook stories for its important variants, states, and
  light/dark presentation.
- Pass `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`.

After a palette change, also run `pnpm check:contrast`.

## Working in the repo

**Components are vendored.** `src/components/ui/` is added by the shadcn CLI.
When upstream changes, run `shadcn add --diff` rather than editing blind. Expect
it to flag two deliberate divergences: variants live in sibling `*-variants.ts`
files, and several components have been restyled onto the token layer.

Note that `shadcn add` will happily rewrite a component you did not ask for —
adding `pagination` rewrote `button.tsx` back to stock. Check `git status` after
running it.

**Keep `cva()` out of component files.** A module is a Fast Refresh boundary
only when every export is a component *or* keeps a stable identity across
re-evaluations. `cva()` builds a new object each time its module runs, so
exporting it from the component file makes every edit a full page reload.
Re-exporting from `<name>-variants.ts` preserves identity. Same reasoning puts
`useTheme` in `theme-context.ts`.

**Teach `tailwind-merge` any new `m3-` namespace that collides with a built-in
utility.** `text-m3-label-lg` is a font size and `text-m3-on-primary` is a
colour, and unconfigured, merge treats them as one group and silently drops one
— which renders filled buttons with unreadable labels. `src/lib/utils.ts` splits
them; the spacing scale needed the same treatment.

**State layers must cover the border box.** `after:inset-0` sizes the layer to
the padding box while `rounded-[inherit]` gives it the border-box radius, and
the mismatch shows as a pale crescent inside the outline of any bordered variant
when pressed. Use `after:-inset-px` and keep a 1px transparent border on every
variant.

**Spacing:** `flex` + `gap-*`, never `space-x/y-*`. `size-*` when width equals
height.

## Verifying

```bash
pnpm test        # every story in a real Chromium, via Vitest
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm test` is the fastest real check that nothing is broken — run it after any
token change. Stories with `parameters: { sideBySide: true }` render light and
dark at once; use that for anything touching the token layer.

Four pointer-driven stories (the carousel's drag and touch tests, the split
button's interactive shapes, the connected button group's states) are flaky
under load and fail intermittently on an unmodified checkout. Re-run before
assuming a change broke them.

## Releases

**Cadence.** Released as needed rather than on a schedule. The library is
pre-1.0, so the version is `0.MINOR.PATCH` and the usual semver promise about
the major number does not apply yet.

- **Patch** — a bug fix, a spec correction, documentation.
- **Minor** — a new component, a new variant, a new token. Also anything
  breaking, while the version is below 1.0.

**What counts as breaking.** More than the TypeScript signature:

- Removing or renaming an export, a prop, or a variant value.
- Removing or renaming an `--m3-*` token, or a `data-slot`/`data-*` attribute
  a consumer could be selecting on.
- Changing what an existing token *resolves to*, where it is not a bug fix.
  Repointing `--border` from `outline-variant` to `outline` would silently
  restyle every card in every consuming app.
- Changing a component's default variant, size, or shape.
- Changing rendered element type or nesting where it could break a consumer's
  CSS — an `a` becoming a `span`, or a new wrapper element appearing between a
  component and its children.
- Raising the browser floor.

**What does not:** adding a variant, adding an optional prop, adding a token, or
correcting geometry to match the kit. The last one changes pixels, and is still
a patch — matching the kit is the library's whole contract.

Record every change in `CHANGELOG.md` under Unreleased as you go, not at release
time.
