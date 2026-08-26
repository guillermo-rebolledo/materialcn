# Design system checklist — gap audit

Audit of this repo against `docs/design-system-checklist.md`. Last audited:
2026-08-26.

Only **gaps** are listed. Items the repo already satisfies are summarised at the
bottom so the list isn't mistaken for a full inventory.

Legend: ✗ nothing exists · ◐ partially there, needs finishing.

---

## P0 — Foundations with no token layer at all

These are the only checklist *foundations* categories with nothing behind them.
Everything downstream (responsive components, overlay ordering) is improvised
without them.

### Layout — ✗ the whole category

- [ ] **Breakpoints** — `src/styles/theme.css` defines no `--breakpoint-*`. The
      library inherits Tailwind's stock `sm/md/lg/xl/2xl`, which are not M3's
      window size classes (compact / medium / expanded / large / extra-large).
      Emit them from `scripts/generate-tokens.mjs` and document the mapping.
- [ ] **Grid** — no column/gutter/margin definitions for any window class. M3
      specifies 4/8/12-column grids with per-class margins; nothing encodes that.
- [ ] **Spacing** — no documented spacing scale. Components hardcode Tailwind
      numeric spacing (`px-4`, `gap-2`) with the 4dp relationship implied but
      never stated, so there is no single place to change it.
- [ ] **Units** — the 4pt base is real but undocumented. One paragraph in
      `README.md` under a new `### Layout` token section closes this.

### Elevation — ◐

- [ ] **Z-index** — no scale. `toast.tsx:46` improvises
      `z-[calc(1000-var(--toast-index))]`; other overlays rely on Base UI's
      internals. Add `--m3-z-*` tokens (base / raised / sticky / dropdown /
      overlay / modal / toast / tooltip) and point the overlays at them.

Shadows and the surface-container background ramp are already covered.

---

## P0 — Components in the checklist with no implementation

Six of the checklist's core components have no export in `src/index.ts` and no
entry in `docs/component-backlog.md`, so they are not on any existing plan.

- [ ] **Icon** — ✗. `lucide-react` is used directly everywhere; there is no
      wrapper controlling size or color. The checklist's Icon item (colors,
      sizes paired to the type scale, non-interactive by default) is unmet, and
      so is the whole **Iconography** foundation section (style, naming,
      keywords, reserved icons, grid relation, guidelines).
- [ ] **Link** — ✗. No component. M3 has no link spec, but the checklist wants
      colors, disabled state, font inheritance, multiline flow, and correct
      role resolution. This is genuinely needed for text-heavy product surfaces.
- [ ] **Alert** — ✗. No inline banner component. `Toast` covers transient
      messages only. Needs role colors, title, icon, actions, and correct
      `role="alert"` / `role="status"` announcement.
- [ ] **Pagination** — ✗. No component. shadcn has a `pagination` primitive to
      start from.
- [ ] **Breadcrumbs** — ✗. No component. shadcn has `breadcrumb`.
- [ ] **Image** — ✗. No component. Needs aspect-ratio support, a fallback for
      broken/undefined URLs, `srcset` density support, and alt-text discipline.

---

## P1 — Existing components missing checklist items

Concrete, small, and individually shippable.

- [ ] **Button · loading state** — `button-variants.ts` has no loading variant
      and `button.tsx` has no `loading` prop. The checklist explicitly requires
      the spinner not to change the button's width or height, which means
      reserving the label's box. Pairs with the existing `CircularProgress`.
- [ ] **Skeleton · reduced motion** — `skeleton.tsx` uses `animate-pulse` with
      no guard. The `prefers-reduced-motion` block in `src/index.css:600` covers
      the wave, circular progress, loading indicator, and carousel, but not
      this. One-line fix (`motion-reduce:animate-none`) plus a token-layer
      comment.
- [ ] **Skeleton · sizes / shapes / composition + stories** — currently a bare
      `div`. No variants matching component shapes, and no story file. This is
      the one remaining unchecked line in `docs/component-backlog.md` (Field,
      Label, Skeleton, Toggle all lack stories).
- [ ] **Tooltip · timeout** — `tooltip.tsx:6` defaults `delay = 0`, so tooltips
      fire while the cursor is merely crossing the trigger. The checklist asks
      for a brief open delay; M3 does not specify one, so pick a value
      (~500ms hover, 0ms on focus) and document it.
- [ ] **Calendar · internationalisation (week start)** — `calendar.tsx:66`
      computes the first visible cell as `addDays(month, -month.getDay())`,
      which hardcodes Sunday. The `locale` prop correctly localises month names,
      weekday labels, and the full-date announcement, but every locale that
      starts its week on Monday (or Saturday) renders in the wrong order. Needs
      `Intl.Locale.prototype.getWeekInfo` with a Sunday fallback.
- [ ] **Dropdown · hover trigger** — `dropdown-menu.tsx` has no `openOnHover`
      path. Base UI's Menu supports it; this is mostly a prop passthrough plus
      the matching keyboard-focus behaviour the checklist asks for.
- [ ] **Badge · sizes** — `badge-variants.ts` is fixed at `h-8`. `Chip` covers
      the dismissible and icon requirements and `NotificationBadge` covers
      positioning, so size is the only genuine gap here.

---

## P1 — Typography and color, partially met

- [ ] **Typography · responsiveness** — the M3 scale is fixed-size. No
      viewport-adaptive step exists, so a display role set for desktop is
      oversized on compact windows. Blocked on the breakpoint tokens above.
- [ ] **Color · accessibility (verification)** — the M3 role pairings are
      contrast-designed by construction, but nothing in the repo *proves* it.
      Add a script alongside `scripts/hex-to-oklch.mjs` that walks every
      on-role/role pair in the generated `color.css` and fails on sub-AA
      contrast. This is the regression guard for any future palette edit.
- [ ] **Color · guidelines** — `README.md` documents the token *mechanism*
      thoroughly but not when to reach for tertiary vs secondary, or how not to
      use the roles. Same for the typography scale.

---

## P2 — Documentation and maintenance

The `Maintenance` half of the checklist is essentially untouched — no
`.github/` directory, `CONTRIBUTING.md`, `LICENSE`, or `CHANGELOG.md` exists.
Most of it is org process that does not apply to a single-maintainer library,
so only the items with real value here are listed.

- [ ] **Getting started** — `README.md` has `## Quick start` and
      `## Consuming the package`, but no end-to-end "install → theme → first
      screen" path.
- [ ] **Component properties** — no prop tables. Storybook's `addon-docs` is
      already installed and can autogenerate them from the TS types; the
      per-component `*.types.tsx` files make this nearly free.
- [ ] **Component anatomy** — the foundations stories document tokens, not
      component structure. Worth adding for the compound components
      (`List`, `TextField`, `SearchView`, `Toolbar`).
- [ ] **Browser / OS support** — undefined. The library leans on
      `@media (prefers-reduced-motion)`, `oklch()`, `color-scheme`, container
      queries, and `:has()`; state the floor explicitly.
- [ ] **Release cycle / CHANGELOG** — nothing published. The package is
      consumable (`## Consuming the package`), so consumers have no way to see
      what changed.
- [ ] **Contribution guidelines** — `docs/component-backlog.md` has an
      excellent "Definition of done" that is effectively contribution guidance
      buried in a backlog file. Promote it to `CONTRIBUTING.md`.
- [ ] **Sandbox product example** — `playground/` exists as a dev app but does
      not simulate a real product layout. A single realistic screen would
      exercise the components together the way the checklist intends.
- [ ] **Accessibility guidelines** — `@storybook/addon-a11y` is installed and
      components use `aria-invalid`, `role`, and focus-visible treatment
      consistently, but no document states the standard being held to (AA?
      keyboard model? focus-ring rules?).
- [ ] **Design principles / vision / tone of voice / terminology** — the entire
      `Design language` section. Mostly not applicable to a component library
      restyling shadcn, but "design principles" is worth a short section: the
      token-indirection rule, the no-`dark:`-utilities rule, and the
      spring-selection rule in `CLAUDE.md` *are* the principles, just written as
      engineering gotchas.

---

## Already satisfied — do not re-audit

- **Color**: semantic roles, full light/dark swap, `:root, .dark` alias block.
- **Motion**: easing tokens, duration scale, and a real reduced-motion collapse
  in both `motion.css` and `index.css`.
- **Elevation**: `shadow-m3-0`…`shadow-m3-5` plus the surface-container ramp.
- **Typography**: full M3 scale with tracking, self-hosted variable Roboto Flex
  kept opt-in for payload reasons.
- **Components**: every other core component in the checklist is implemented
  with its states — 48 components with stories, `docs/component-backlog.md`
  down to one unchecked line.
