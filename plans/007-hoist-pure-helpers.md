# 007 — Hoist pure helpers to module scope in Slider and Toolbar

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: LOW
- **Category**: Maintainability & architecture
- **Rule**: `react-doctor/prefer-module-scope-pure-function`
- **Estimated scope**: 2 files, 3 functions

## Problem

Three helper functions are declared inside a component body but close over
nothing from it, so they are reallocated on every render for no reason.

    // src/components/ui/slider.tsx:103 — current (inside Slider)
    const clearance = (boundary: Boundary) => (boundary.handle ? HANDLE_CLEARANCE : 0)

    // src/components/ui/toolbar.tsx:36-42 — current (inside Toolbar)
    const getControls = (root: HTMLElement) => Array.from(
      root.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [role="button"]:not([aria-disabled="true"])'),
    )
    const setTabStop = (controls: HTMLElement[], active: HTMLElement) => {
      controls.forEach((control) => {
        control.tabIndex = control === active ? 0 : -1
      })
    }

I verified each against the rule's suppression clause ("the helper actually does
close over local state: it reads a `useState` value or setter, a prop, or
another local helper that itself captures state"). None of them do:

- `clearance` — one parameter plus the module constant `HANDLE_CLEARANCE`.
- `getControls` — one parameter, plus a string literal.
- `setTabStop` — two parameters, plus the DOM.

All three qualify. **`ensureTabStop` in the same component does not** — it reads
`rootRef` and `document.activeElement` and calls the other two helpers, so it
closes over a component-scope binding and must stay inside.

## Target

Canonical recipe, `react-doctor/prefer-module-scope-pure-function`, verbatim:

> Move the function out of the component to module scope (above the component
> declaration) since it references no local state, turning a per-render
> allocation into a one-time module binding: lift
> `const formatName = (user) => user.firstName + " " + user.lastName` above
> `function App()` unchanged, and if it needs render-time values pass them as
> explicit parameters rather than closing over them. Only confirm after
> verifying every identifier the body uses is a param, a module import/const, or
> a global; if it touches props or `useState` values, leave it in place.

Lifted unchanged, above their component declarations:

    // src/components/ui/slider.tsx — target (module scope, below HANDLE_CLEARANCE)
    const clearance = (boundary: Boundary) => (boundary.handle ? HANDLE_CLEARANCE : 0)

    // src/components/ui/toolbar.tsx — target (module scope, above function Toolbar)
    const getControls = (root: HTMLElement) => Array.from(
      root.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [role="button"]:not([aria-disabled="true"])'),
    )

    const setTabStop = (controls: HTMLElement[], active: HTMLElement) => {
      controls.forEach((control) => {
        control.tabIndex = control === active ? 0 : -1
      })
    }

The function bodies do not change at all — only where they are declared.

**`clearance` cannot move on its own.** The `Boundary` type it references is
declared *inside* the component at `slider.tsx:87`:

    // src/components/ui/slider.tsx:85-87 — current, inside Slider
    // The track is drawn as segments between the thumbs (and the midpoint for a
    // centered slider) so each one can carry its own corners and clearance.
    type Boundary = { at: number; handle: boolean }

So the type must be lifted to module scope alongside `clearance`, keeping its
comment. `Boundary` is also referenced at lines 88, 104 and 109, which stay
inside the component and resolve to the module-scope type unchanged. The type is
erased at build time, so this is a compile-time move only.

Place both **after** `const HANDLE_CLEARANCE = 8` (`slider.tsx:55`), since
`const` bindings are not hoisted:

    // src/components/ui/slider.tsx — target (module scope, after HANDLE_CLEARANCE)
    // The track is drawn as segments between the thumbs (and the midpoint for a
    // centered slider) so each one can carry its own corners and clearance.
    type Boundary = { at: number; handle: boolean }

    const clearance = (boundary: Boundary) => (boundary.handle ? HANDLE_CLEARANCE : 0)

## Repo conventions to follow

- Both files already declare module-scope helpers and constants above their
  components — match that placement and ordering.
- Keep the existing arrow-function style and the exact formatting; this should
  read as a pure move in the diff.

## Steps

1. In `slider.tsx`, move **both** the `Boundary` type (line 87, with its
   comment) and the `clearance` declaration (line 103) to module scope, placed
   after `HANDLE_CLEARANCE` at line 55. Moving `clearance` alone will not
   typecheck.
2. Confirm `segmentStyle` (which calls `clearance`) still resolves it. It reads
   `horizontal`, a component-scope value, so `segmentStyle` itself stays inside.
3. In `toolbar.tsx`, move `getControls` and `setTabStop` above `function Toolbar`.
4. Confirm `ensureTabStop` remains **inside** the component and still resolves
   both helpers from module scope.
5. Re-read the diff: it should contain no changed function bodies, only moved
   declarations.

## Boundaries

- Do NOT move `ensureTabStop` — it captures `rootRef`.
- Do NOT move `segmentStyle` or `segmentRadius` in `slider.tsx` — both read
  `horizontal` from the component body. They keep referencing `Boundary`, which
  now resolves to the module-scope type.
- Do NOT inline or rename the `Boundary` type; move it verbatim with its comment.
- Do NOT change any function body, signature, or name.
- Do NOT wrap anything in `useCallback`; module scope is the fix, not memoization.
- STOP if the code has drifted from commit `8872ab1`.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope changed` reports zero
    `prefer-module-scope-pure-function`, score not lower.
  - `pnpm typecheck` — this is the real check. If a moved helper had captured
    something, TypeScript fails on the unresolved identifier.
  - `pnpm build && pnpm test` pass.
- **Behavior check**:
  - **Toolbar roving tabindex** — the risk concentrates here. In the Toolbar
    stories: tab into the toolbar (focus lands on one control), arrow across the
    controls, tab out and tab back (focus returns to the last active control).
    Then disable a control and confirm the `MutationObserver` still recomputes
    the tab stop.
  - **Slider** — drag single-value and range sliders; the gap between the track
    segments and the handles is unchanged, and segment end radii still round
    correctly on the outer ends only.
- **Done when**: the diagnostic is clear, typecheck passes, roving tabindex and
  slider geometry are unchanged, and the diff contains only moved declarations.

## Note for later

This rule is **disabled when the React Compiler is enabled**. If this project
adopts the Compiler, this class of finding stops being reported.
