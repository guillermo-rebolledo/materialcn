# React Audit Tickets

Source: React Doctor scan (v0.9.12) + senior audit at commit `8872ab1`.
Baseline score **61/100** — 106 warnings, 0 errors, 49 files. Of those, 84 are
false positives on deliberate repo conventions (see ticket 01).

All tickets are independent except 10. Recommended order: **01 first** (it makes
every other ticket's verification meaningful), then anything.

| #   | Title                                              | Severity | Blocked by |
| --- | -------------------------------------------------- | -------- | ---------- |
| 01  | Exclude type-tests and tools from the scan          | —        | None       |
| 02  | Memoize compound-component context values           | HIGH     | None       |
| 03  | Memoize date formatters in Calendar and DatePicker  | HIGH     | None       |
| 04  | Remove unsupported `aria-orientation` from nav      | MEDIUM   | None       |
| 05  | Fix stray `0` render in the TextField help row      | MEDIUM   | None       |
| 06  | Stabilize error list keys in Field                  | LOW      | None       |
| 07  | Hoist pure helpers in Slider and Toolbar            | LOW      | None       |
| 08  | Fix List screen-reader semantics                    | MEDIUM   | None       |
| 09  | Extract a shared `usePrefersReducedMotion` hook     | —        | None       |
| 10  | Confirm NavigationRail context parity               | —        | 02         |

---

# 01 — Exclude type-tests and tools from the React Doctor scan

**What to build:** A React Doctor configuration that ignores the type-test files
and the CLI tooling, so the score measures real defects instead of noise.

Today 84 of the 106 warnings are false positives against conventions this repo
chose on purpose:

- `unused-file` ×18 and `no-barrel-import` ×17 fire on `src/components/ui/*.types.tsx`.
  These are **type-level API tests**: they import from the public barrel
  deliberately (the point is to exercise the published surface), assert with
  `@ts-expect-error`, and are run by `tsc -b` via `include: ["src"]`. Being
  unreachable from a runtime entry point is the design, not a defect.
- `unused-file` ×4 more fire on `tools/*.mjs`, which are CLI entry points.
- `only-export-components` ×39 fires on the `*-variants.ts` / `*-context.ts`
  split that CLAUDE.md documents with a Fast Refresh rationale.

Until these are silenced, "the score did not regress" is not a usable
acceptance criterion for any other ticket.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `*.types.tsx` files are excluded from the scan.
- [ ] `tools/` is excluded from the scan.
- [ ] A decision is recorded on `only-export-components`: either the rule is
      disabled with a comment pointing at the CLAUDE.md rationale, or the
      remaining hits are triaged individually.
- [ ] The config change is committed; no source file is modified.
- [ ] A fresh scan reports substantially fewer warnings, and every remaining
      warning corresponds to a ticket below or is explicitly triaged.
- [ ] The new baseline score is recorded in this file so later tickets can
      compare against it.

---

# 02 — Memoize compound-component context values

**Severity:** HIGH · **Category:** Performance · **Rule:** `react-doctor/jsx-no-constructed-context-values`

**What to build:** Every compound component's context value keeps a stable
identity across renders, so consumers only re-render when something they
actually read has changed.

Each of these components builds its provider `value` as an inline object
literal. That literal gets a new identity on every render of the container, so
**all** consumers re-render even when nothing they read changed:

| Component      | Site                            | Why it matters                                                    |
| -------------- | ------------------------------- | ----------------------------------------------------------------- |
| `SearchBar`    | `search-bar.tsx:105`            | Re-renders per keystroke                                          |
| `SearchView`   | `search-view.tsx:118`           | Re-renders per keystroke                                          |
| `Carousel`     | `carousel.tsx:185`              | Re-renders on every Embla `select` event                          |
| `NavigationBar`| `navigation-bar.tsx:90`         | Re-renders on every route change                                  |
| `NavigationRail`| `navigation-rail.tsx:43`, `:44` | Two providers, and they wrap a `TooltipProvider` — a rail render re-renders every tooltip |
| `FABMenu`      | `fab-menu.tsx:57`               |                                                                   |
| `RichTooltip`  | `rich-tooltip.tsx:67`           |                                                                   |
| `ToggleGroup`  | `toggle-group.tsx:58`           |                                                                   |
| `ButtonGroup`  | `button-group.tsx:70`           |                                                                   |

This is a real win rather than a cosmetic one: the members of every value are
already stable. `SearchBar`, `SearchView`, `FABMenu`, `RichTooltip` and
`Carousel` wrap their handlers in `useCallback`; the rest pass through raw state
setters and props. Wrapping the object is all that is missing.

Because this is a published library, the fan-out is every consuming app.

**Repo exemplars to imitate:** `theme-provider.tsx:65` and `progress.tsx:51`
already do exactly this. Match their style — do not invent a new pattern.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] All 10 provider sites listed above wrap their value in `useMemo` with a
      complete, correct dependency array.
- [ ] No handler is newly wrapped in `useCallback` unless it was genuinely
      unstable; do not add memoization the value did not need.
- [ ] `jsx-no-constructed-context-values` reports zero hits.
- [ ] `pnpm typecheck && pnpm build` pass.
- [ ] `pnpm test` passes — every story renders in Chromium.
- [ ] **Profiler check:** with React DevTools "Highlight updates" on, typing in
      a `SearchBar` no longer flashes sibling subtrees that do not read `value`.
      Record before/after.

---

# 03 — Memoize date formatters in Calendar and DatePicker

**Severity:** HIGH · **Category:** Performance · **Rule:** `react-doctor/js-hoist-intl`

**What to build:** Calendar month navigation and keyboard focus stop paying to
rebuild date formatters on every render.

`Calendar` constructs **15 `Intl.DateTimeFormat` instances per render** — three
at `calendar.tsx:58`, `:59`, `:65`, plus twelve more inside the month `<select>`
map at `:130`. `DatePicker` adds one more at `date-picker.tsx:106`.

The component re-renders on every month change, every year change, and every
keyboard focus move (there is a `useLayoutEffect` keyed on `month` driving
`pendingFocus`). `Intl.DateTimeFormat` construction is among the most expensive
routine operations in JS, so this is real work on a real interaction.

These cannot be hoisted to module scope, because `locale` is a prop — they need
`useMemo` keyed on `locale` (and the twelve month names collapse into a single
memoized array).

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] All formatter construction is memoized on `locale`.
- [ ] The twelve month-name options come from one memoized array rather than
      twelve constructions inside the map.
- [ ] Passing a different `locale` still re-formats correctly — verify against
      at least one non-English locale.
- [ ] `js-hoist-intl` reports zero hits.
- [ ] `pnpm typecheck && pnpm build && pnpm test` pass.
- [ ] **Behavior check:** step through several months with the keyboard and with
      the month/year selects; labels, the `aria-label` on day cells, and the
      weekday header are unchanged.

---

# 04 — Remove unsupported `aria-orientation` from NavigationBar

**Severity:** MEDIUM · **Category:** Accessibility · **Rule:** `react-doctor/role-supports-aria-props`

**What to build:** The navigation landmark stops carrying an ARIA attribute
that assistive technology ignores.

`navigation-bar.tsx:99` sets `aria-orientation` on a `<nav>`. The implicit role
is `navigation`, which does not support that attribute, so it is silently
discarded by every screen reader. It is also dead weight — the styling reads the
separate `data-orientation` attribute declared on the following line, so nothing
visual depends on it.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `aria-orientation` is removed from the `<nav>` element.
- [ ] `data-orientation` is left in place and all orientation styling is
      visually unchanged in both horizontal and vertical stories.
- [ ] `role-supports-aria-props` reports zero hits.
- [ ] `pnpm test` passes, including the Storybook a11y addon checks.

---

# 05 — Fix stray `0` render in the TextField help row

**Severity:** MEDIUM · **Category:** Bugs & correctness · **Rule:** `react-doctor/rendering-conditional-render`

**What to build:** A `TextField` given `maxLength={0}` renders no character
counter instead of painting a literal `0` into the help row.

Two sites guard on a number with `&&`: `text-field.tsx:185` wraps the whole help
row in `(supportingText || maxLength) &&`, and `:188` guards the counter itself
with `maxLength &&`. When `maxLength` is `0`, JSX renders the number `0` as
visible text.

`maxLength` is a public prop on a shipped component, so a consumer can reach
this without doing anything unusual. The trigger is narrow, but the fix is free.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Both guards test for `undefined` explicitly rather than truthiness.
- [ ] `maxLength={0}` renders no counter and no stray text.
- [ ] `maxLength={10}` still renders the `n / 10` counter, and a field with only
      `supportingText` and no `maxLength` still renders its description.
- [ ] `rendering-conditional-render` reports zero hits.
- [ ] A story or test covers the `maxLength={0}` case.

---

# 06 — Stabilize error list keys in Field

**Severity:** LOW · **Category:** Bugs & correctness · **Rule:** `react-doctor/no-array-index-as-key`

**What to build:** Field error items keep their identity when the error list
changes, so React reconciles them correctly instead of by position.

`field.tsx:206` keys the rendered error list by array index. The list two lines
above is already deduplicated **by message** through a `Map`, so a stable,
unique key is available with no extra work.

**Weigh before doing this:** `field.tsx` is vendored shadcn. Editing it means
`shadcn add --diff` will flag the file from here on. The payoff is small — the
list is short and rarely reorders. It is included for completeness; skipping it
with a note is a legitimate outcome.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Either the key is changed to the deduplicated error message, or the
      finding is explicitly declined and the reason recorded in this file.
- [ ] If changed: `no-array-index-as-key` no longer fires on `field.tsx`, and
      the divergence from upstream shadcn is noted where the repo tracks its
      other deliberate divergences.
- [ ] `pnpm test` passes.

---

# 07 — Hoist pure helpers to module scope in Slider and Toolbar

**Severity:** LOW · **Category:** Maintainability · **Rule:** `react-doctor/prefer-module-scope-pure-function`

**What to build:** Three helper functions that close over nothing from their
component stop being rebuilt on every render.

- `clearance` at `slider.tsx:103` — reads only the module constant `HANDLE_CLEARANCE`.
- `getControls` at `toolbar.tsx:36` — takes its root element as an argument.
- `setTabStop` at `toolbar.tsx:39` — takes both its arguments.

Pure hygiene, no user-visible change. Note that `ensureTabStop` in the same
component *does* close over `rootRef` and must stay inside.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] All three functions are declared at module scope.
- [ ] `ensureTabStop` remains inside the component, and the `MutationObserver`
      effect in `Toolbar` behaves identically.
- [ ] `prefer-module-scope-pure-function` reports zero hits.
- [ ] `pnpm typecheck && pnpm build && pnpm test` pass.
- [ ] **Behavior check:** roving tabindex still works in the Toolbar stories —
      tab into the toolbar, arrow across the controls, tab out and back, and
      confirm focus returns to the last active control.

---

# 08 — Fix List / ListItem / ListSection screen-reader semantics

**Severity:** MEDIUM · **Category:** Accessibility · **Rule:** `react-doctor/prefer-tag-over-role` + beyond the scan

**What to build:** Lists announce their item count and position correctly in
VoiceOver and NVDA.

The scanner flags only `list.tsx:16` (`<div role="list">` instead of `<ul>`),
but the problem is structural and spans three components:

1. `List` is a `<div role="list">`.
2. `ListItem` wraps its content in `<div role="listitem" className="contents">`.
   `display: contents` on a role-bearing element is a long-standing screen-reader
   dropout — the element can vanish from the accessibility tree entirely.
3. `ListSection` puts `role="group"` **between** the list and its items. The
   `list` → `listitem` ownership relationship requires the items to be owned by
   the list; an intervening `group` can break it, so AT may announce no item
   count at all.

This one needs a decision and real verification, not a rule fix. The two
plausible directions are native `<ul>`/`<li>` elements, or keeping the current
structure and repairing ownership explicitly. Each has costs — native elements
change the public DOM contract and the `ComponentProps<"div">` typing;
`display: contents` exists to let `ListItem` participate in the parent's flex
layout, so it cannot simply be deleted.

Static analysis cannot settle this. The ticket is not done until it has been
heard in a real screen reader.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] A direction is chosen and the tradeoff is written down.
- [ ] The `display: contents` dropout is resolved or demonstrated not to occur
      in current browsers.
- [ ] A `ListSection` between a `List` and its items no longer breaks the
      ownership chain.
- [ ] **AT check — not optional:** VoiceOver (Safari) and NVDA (Firefox) both
      announce "list, N items" and correct "item M of N" positions, including
      inside a `ListSection`.
- [ ] Layout is visually unchanged across all `list.stories.tsx` stories and all
      three density settings.
- [ ] Any change to the public DOM contract is recorded as a breaking change.

---

# 09 — Extract a shared `usePrefersReducedMotion` hook

**Category:** Maintainability (missed opportunity)

**What to build:** One media-query hook, used everywhere the library needs to
observe a user preference.

`usePrefersReducedMotion` currently lives inside `carousel.tsx:78`, and
`ThemeProvider` carries a near-identical `matchMedia` subscription for
`prefers-color-scheme`. Both hand-roll `useState` + `useEffect` + an event
listener. `useSyncExternalStore` is the purpose-built primitive for this and is
SSR-safe by construction, which matters for a published library.

Motion is a first-class concern in this repo — the CLAUDE.md motion rules and
the spring token layer mean more components will need this. A shared hook is
likely to earn its keep rather than being abstraction for its own sake.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] A single media-query hook exists in a shared location and is built on
      `useSyncExternalStore` with a server snapshot.
- [ ] `Carousel` and `ThemeProvider` both use it; no duplicated `matchMedia`
      subscription remains.
- [ ] It is exported from `src/index.ts` only if it is intended as public API —
      decide deliberately.
- [ ] `pnpm typecheck && pnpm build && pnpm test` pass.
- [ ] **Behavior check:** toggling the OS "Reduce motion" setting still disables
      carousel animation, and toggling OS dark mode still flips the theme while
      `ThemeProvider` is on `"system"`.

---

# 10 — Confirm NavigationRail context parity with NavigationBar

**Category:** Bugs & correctness (missed opportunity)

**What to build:** Navigation items behave consistently regardless of whether
they sit in a rail or a bar — or the difference is documented as intentional.

Both components provide the same `NavigationContext`, but with different shapes.
`navigation-bar.tsx:90` supplies all five fields (`focusValue`, `itemLayout`,
`onValueChange`, `setFocusValue`, `value`); `navigation-rail.tsx:43` supplies
only `onValueChange` and `value`. Every missing field is optional in
`NavigationContextValue`, so this type-checks — but it means an item rendered
inside a rail silently receives no `itemLayout` and no roving-focus support,
while the identical component inside a bar does.

This may well be deliberate. The ticket is to find out and make the answer
explicit, in the type or in a comment.

**Blocked by:** 02 — that ticket wraps this exact provider value in `useMemo`;
doing this first would mean editing the same lines twice.

**Status:** ready-for-agent

- [ ] Determine whether rail items are supposed to have roving focus and an
      item layout.
- [ ] If yes: the rail supplies the missing fields and its items behave like the
      bar's.
- [ ] If no: the divergence is documented, and the context type is tightened so
      the difference is visible at the type level rather than implied by
      optionality.
- [ ] **Behavior check:** in both the rail and bar stories, arrow keys move
      focus between destinations, `Home`/`End` jump to the ends, and focus is
      preserved correctly when the selected value changes.
