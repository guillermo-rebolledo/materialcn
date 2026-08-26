# 010 — Confirm NavigationRail context parity with NavigationBar

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: — (missed opportunity; investigation)
- **Category**: Bugs & correctness
- **Rule**: Beyond the scan
- **Estimated scope**: 1–2 files — **investigation first; the fix may be a type change only**

## Problem

`NavigationBar` and `NavigationRail` both provide the **same**
`NavigationContext`, but with different shapes.

    // src/components/ui/navigation-context.ts:15-21
    type NavigationContextValue = {
      focusValue?: string
      itemLayout?: NavigationItemLayout
      onValueChange: (value: string) => void
      setFocusValue?: (value: string) => void
      value: string
    }

    // src/components/ui/navigation-bar.tsx:90 — supplies all five
    <NavigationContext.Provider value={{ focusValue: focusValue ?? value, itemLayout, onValueChange, setFocusValue, value }}>

    // src/components/ui/navigation-rail.tsx:43 — supplies two
    <NavigationContext.Provider value={{ onValueChange, value }}>

Three of the five fields are optional in the type, so this compiles. But the
consequence is that a navigation item rendered inside a rail receives
`focusValue === undefined`, `setFocusValue === undefined`, and
`itemLayout === undefined`, while the *same component* inside a bar receives all
three. `navigation-bar.tsx:42` holds `const [focusValue, setFocusValue] = useState<string | null>(null)`
and uses it to drive roving focus across destinations — the rail has no
equivalent.

So rail items and bar items may have materially different keyboard behavior,
and the type system is actively hiding the difference behind optionality.

**This may well be deliberate** — a rail's items are laid out differently and
may not want a roving tabindex. The point of this plan is to find out and make
the answer explicit, not to assume it is a bug.

## Target

Depends on the finding. Two acceptable end states:

**If rail items should have roving focus and a layout** — the rail supplies the
missing fields, mirroring the bar:

    // src/components/ui/navigation-rail.tsx — target (parity case)
    const [focusValue, setFocusValue] = useState<string | null>(null)

    const navigationValue = useMemo(
      () => ({ focusValue: focusValue ?? value, itemLayout, onValueChange, setFocusValue, value }),
      [focusValue, itemLayout, onValueChange, setFocusValue, value],
    )

…with `itemLayout` derived from the rail's `expanded` state (the `row` layout
documented in `navigation-context.ts:11` is described as "the expanded
navigation rail item", which suggests the rail is *supposed* to set it).

**If the difference is intentional** — make it visible at the type level instead
of implied. Split the context into a required base and an optional roving-focus
extension, or introduce a discriminant, so a reader can see which container
supplies what without cross-referencing two files. Document the reason in
`navigation-context.ts`.

Do not leave it as-is with all three fields silently optional.

## Repo conventions to follow

- `navigation-context.ts` already documents `NavigationItemLayout` with a
  detailed comment tying each value to the Figma kit. Extend that comment style
  for whatever you decide.
- CLAUDE.md: component geometry and behavior come from the official M3 Design
  Kit, not the docs site. If the question is "should a rail have roving focus",
  the kit is the authority — `docs/m3-specs.md` has numbers already pulled, and
  `tools/fig-specs.mjs` can query the kit directly.

## Steps

1. Read `navigation-bar.tsx:42-88` and understand exactly what `focusValue` /
   `setFocusValue` do — they drive arrow-key roving focus across destinations.
2. Find every consumer of `useNavigation()` and determine what each does when
   `focusValue` / `itemLayout` are `undefined`. This is the core question: does
   the rail silently lose behavior, or do its items not use those fields at all?
3. Check the M3 kit for the intended rail keyboard behavior.
4. Decide: parity, or documented divergence.
5. Implement, and add a story exercising keyboard navigation in the rail if one
   does not exist.

## Boundaries

- Do NOT change `NavigationBar`'s behavior. It is the reference implementation.
- Do NOT make the optional fields required without supplying them everywhere —
  that breaks the rail's compile.
- Do NOT change the rail's visual layout, the `expanded` transition, or the
  `TooltipProvider` nesting.
- Keep the `useMemo` from plan 002 intact; edit the memoized object, do not
  revert to an inline literal.

## Verification

- **Mechanical**:
  - `pnpm typecheck && pnpm build && pnpm test` pass.
  - `npx react-doctor@latest --scope changed` introduces no new diagnostic,
    and `jsx-no-constructed-context-values` stays clear (plan 002 must not
    regress).
- **Behavior check**, in both the NavigationBar and NavigationRail stories:
  - Arrow keys move focus between destinations.
  - `Home` / `End` jump to the first and last destination.
  - Focus is preserved correctly when the selected value changes.
  - Tabbing into and out of the container lands on the expected element.
  - Both rail variants (`docked`, `floating`) and both states (`expanded`,
    collapsed) behave consistently.
  - Record what the rail does **before** the change so the difference is
    documented either way.
- **Done when**: rail and bar keyboard behavior is either equivalent or
  documented as deliberately different, the context type makes the difference
  visible rather than implicit, and the reasoning is recorded in
  `navigation-context.ts`.
