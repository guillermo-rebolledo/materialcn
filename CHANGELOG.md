# Changelog

Notable changes to materialcn. Format follows [Keep a Changelog][kac];
versioning follows [semver][semver], with the pre-1.0 caveat described in
[CONTRIBUTING.md](CONTRIBUTING.md#releases) — anything breaking is a minor bump
while the version is below 1.0.

[kac]: https://keepachangelog.com/en/1.1.0/
[semver]: https://semver.org/spec/v2.0.0.html

## [Unreleased]

### Added

- **Window size class breakpoints.** Material's five classes as Tailwind
  variants — `m3-medium:` through `m3-extra-large:` — plus `--m3-breakpoint-*`
  for reading a bound at runtime. Tailwind's stock `sm`/`md`/`lg` are left
  alone rather than remapped.
- **Responsive grid tokens.** Column count, gutter, and margin per window size
  class, read off the kit's own layout grids, with an `m3-grid` utility that
  needs no media query of its own.
- **4dp spacing scale.** `--m3-space-*` and the `p-m3-*` / `gap-m3-*` /
  `size-m3-*` utilities. Shipped components still use numeric utilities;
  migrating them is deliberate follow-up.
- **Z-index scale.** `--m3-z-*` covering raised surfaces through tooltips, with
  the ordering documented — notably that menus sit above modals, since a select
  inside a dialog is its sibling in the DOM rather than its descendant.
- **`pnpm check:contrast`.** Walks all 86 text-bearing role pairings in both
  schemes and exits non-zero below WCAG AA.
- **`Icon`.** One place controlling icon size and colour inheritance, with the
  kit's optical pairings rather than a doubling scale. Decorative by default.
- **`Link`.** Inherits the surrounding typography; resolves its role from its
  props — a destination announces as a link, an action as a button.
- **`Alert`.** The persistent counterpart to the snackbar, with four severities,
  optional title and actions, and politeness derived from severity.
- **`Breadcrumbs`.** Collapses its middle by measurement when the trail does not
  fit; the folded steps stay reachable in a menu.
- **`Paginator`.** Fixed-width elided range, an indeterminate mode, and page
  size selection.
- **`Image`.** Reserves its box before loading, falls back deliberately, and
  requires either alt text or an explicit decorative marking.
- **Button `loading`.** Identical size loading and not, at every size and
  variant; distinct from disabled.
- **Badge sizes.** `sm`, `default`, `lg`, with padding, type, corner, and icon
  scaling together. The default is unchanged.
- **Skeleton shapes and `text` sizing**, plus stories, which it had none of.
- **Stories for `Field`, `Label`, `Toggle`, and `InputGroup`**, which were
  exported with no documentation page at all.
- **Dropdown `openOnHover`**, with focus opening it equivalently.

### Changed

- **The type scale is responsive.** Display and headline roles step down one
  rung below the `expanded` window size class; title, body, and label stay
  fixed. Desktop rendering is unchanged.
- **`typography.css` and `layout.css` are now generated** by
  `scripts/generate-tokens.mjs`, joining `color.css` and `motion.css`.
- **Docs use `react-docgen-typescript`**, so prop tables include props that come
  from `VariantProps` and Base UI intersections. They were silently missing.
- **Overlay components use the z-index scale** instead of all sitting at `z-50`.
- **Skeleton is hidden from assistive technology.** The region owning the load
  is where the busy state belongs.

### Fixed

- **The calendar starts its week where the locale does.** It was built from
  `getDay()` directly, which is Sunday-first everywhere, so for most locales the
  weekday labels were right and the columns beneath them were rotated by one.
- **The tooltip has an open delay.** It was forced to 0, so a pointer crossing a
  dense icon row fired every tooltip it passed.
- **Breadcrumbs no longer drop the current page.** In a container too narrow
  for both ends, the collapse kept folding until only the root and the ellipsis
  were left — a trail saying where the user came from and not where they are.
- **`cn` merges the spacing scale.** `p-m3-lg` was not recognised as conflicting
  with `p-4`, so both survived and CSS source order decided a component's
  padding.

### Documentation

- Getting started, verified against an empty project rather than written from
  memory, and the browser floor the library's CSS actually implies.
- Guidance on *choosing* colour and type roles, not just on how the token layer
  works.
- Compound-component anatomy for the List, TextField, SearchView, and Toolbar
  families.
- Iconography: style, naming by purpose, and the reserved icon per action.
- `CONTRIBUTING.md`, carrying the design principles and the definition of done
  that used to be buried in the component backlog.

## 0.0.0

Baseline. The library at the point this changelog was started: the Material 3
Expressive token layer (colour, shape, typography, elevation, state, motion)
over shadcn/ui primitives on Base UI and Tailwind v4, with the component set
listed in `src/index.ts` and `docs/component-backlog.md` tracking the gaps.
