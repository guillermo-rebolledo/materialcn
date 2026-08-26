# 004 — Remove unsupported `aria-orientation` from NavigationBar

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Rule**: `react-doctor/role-supports-aria-props`
- **Estimated scope**: 1 file, 1 line

## Problem

    // src/components/ui/navigation-bar.tsx:91-103 — current
    <nav
      {...props}
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      aria-label={ariaLabel}
      aria-orientation={orientation}        // <-- line 99, the finding
      data-slot="navigation-bar"
      data-orientation={orientation}
      data-item-layout={itemLayout}
      data-count={Children.count(children)}

`<nav>` has the implicit role `navigation`, which does not support
`aria-orientation`. Every screen reader discards it, so it communicates nothing
while implying to future readers that orientation is exposed to assistive
technology when it is not.

It is also dead weight. The canonical recipe warns that an unsupported property
may belong on a parent or controlling element rather than being deleted — that
does not apply here, because the styling reads the separate `data-orientation`
attribute declared on the very next line. Nothing visual depends on the ARIA
attribute, and there is no other element that should own it.

## Target

Canonical recipe, `react-doctor/role-supports-aria-props`, verbatim:

> Remove or move the unsupported property without substituting a different
> meaning merely because the role allows it. […] Change the role only when the
> element truly performs the new role's complete interaction contract.

Removal, with no substitution and no role change:

    // src/components/ui/navigation-bar.tsx — target
    <nav
      {...props}
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      aria-label={ariaLabel}
      data-slot="navigation-bar"
      data-orientation={orientation}
      data-item-layout={itemLayout}
      data-count={Children.count(children)}

Exactly one line is deleted.

## Repo conventions to follow

- `data-*` attributes drive all styling in this repo (see the
  `data-[orientation=…]` variants in the `className` immediately below).
  `data-orientation` stays.
- Do not substitute `aria-orientation` with another ARIA attribute. There is no
  correct replacement; the orientation of a navigation landmark is simply not
  part of the ARIA model.

## Steps

1. Delete the `aria-orientation={orientation}` line at
   `src/components/ui/navigation-bar.tsx:99`.
2. Confirm `orientation` is still used — it feeds `data-orientation` on the next
   line, so the variable must NOT be removed.
3. Re-read the diff; it should be exactly one deleted line.

## Boundaries

- Do NOT remove or rename `data-orientation`.
- Do NOT add a `role` to the `<nav>`.
- Do NOT touch `navigation-rail.tsx` — it does not carry this attribute.
- Do NOT change the `orientation` prop or its default.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope changed` reports zero
    `role-supports-aria-props`, score not lower.
  - `pnpm typecheck && pnpm build && pnpm test` pass, including the Storybook
    a11y addon checks.
- **Behavior check**: In the NavigationBar stories, both the horizontal and the
  vertical variants are pixel-identical to before — the orientation-dependent
  layout classes all key off `data-orientation`, so nothing should shift.
  Confirm the vertical story still renders as a column.
- **Done when**: the diagnostic is clear, the diff is one line, and both
  orientations render unchanged.
