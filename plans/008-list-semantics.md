# 008 — Fix List / ListItem / ListSection screen-reader semantics

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Rule**: `react-doctor/prefer-tag-over-role` + beyond the scan
- **Estimated scope**: 1 file, 3 components — **investigation first, then a change**

## Problem

The scanner flags one line. The actual problem spans three components and is
structural.

**1. The reported line —** `src/components/ui/list.tsx:14-22`:

    <div
      role="list"
      data-slot="list"
      data-density={density}
      className={cn("flex w-full flex-col", className)}
      {...props}
    />

**2. `display: contents` on a role-bearing element —** `src/components/ui/list.tsx:66-74`:

    return (
      <div
        role={wrapperRole}          // "listitem" | "presentation"
        data-slot="list-item-wrapper"
        data-lines={lines}
        className="contents"        // <-- display: contents
      >
        {item}
      </div>
    )

`display: contents` on an element that carries an ARIA role is a long-standing
accessibility-tree dropout: several browser/AT combinations remove the element
entirely, taking its `listitem` role with it. The class is not decorative — it
exists so the inner `item` participates in the parent's flex layout — so it
cannot simply be deleted.

**3. A `group` between the list and its items —** `src/components/ui/list.tsx:78-83`:

    <div
      role="group"
      data-slot="list-section"
      className={cn("flex w-full flex-col", className)}

The `list` → `listitem` relationship requires the items to be **owned** by the
list. An intervening `role="group"` can break that ownership, so assistive
technology may announce no item count and no "item M of N" position at all.

Combined, a `List` containing `ListSection`s may announce as an unstructured
run of text.

## This one needs judgment, not a rule fix

The canonical recipe says so explicitly —
`react-doctor/prefer-tag-over-role`, verbatim:

> Swap the generic element for the native tag that carries the role implicitly
> and drop the now-redundant `role`: `<div role="button">` becomes `<button>`,
> `<span role="navigation">` becomes `<nav>`. **When a role maps to multiple
> tags the rule suggests only the first match in its internal table, so
> `<div role="list">` becomes `<menu>` (not `<ul>`): review the suggestion and
> substitute the contextually correct element if another fits better.** Native
> elements bring built-in keyboard, focus, and semantics that a role alone does
> not, so reach for the real element rather than reintroducing ARIA.

**Take that warning seriously: the scanner's own suggestion here is `<menu>`,
which is wrong for a Material list. Do not apply it.** `<ul>` is the correct
element if the native route is chosen.

Two viable directions, both with real costs:

- **A — native `<ul>` / `<li>`.** Correct semantics for free, and the recipe's
  stated preference. Costs: changes the public DOM contract (a breaking change
  for consumers styling or querying `div[data-slot="list"]`); the props type
  becomes `ComponentProps<"ul">` rather than `ComponentProps<"div">`; and a
  `<ul>` with `list-style: none` is itself stripped of list semantics by
  Safari/VoiceOver — the very bug `role="list"` on a div is commonly used to
  work around. Verify this before assuming A is a clean win.
- **B — keep the current elements and repair ownership.** Resolve the
  `display: contents` dropout (for example by moving the role onto the element
  that carries the layout, eliminating the wrapper) and make `ListSection`
  either a `listitem`-compatible grouping or use explicit ownership. Costs: more
  ARIA, and ARIA is easier to get subtly wrong.

**Static analysis cannot settle this.** The deciding evidence is what a real
screen reader announces. Do not close this plan on a passing lint run.

## Repo conventions to follow

- This repo explains non-obvious structural decisions in a comment above the
  component — see the comment style in `calendar.tsx` and `text-field.tsx`.
  Whichever direction is chosen, leave a comment saying why.
- `list.tsx` uses Base UI's `useRender` with `mergeProps` for `ListItem`; any
  restructuring must keep the `render` prop escape hatch and the
  `data-interactive` behavior intact.
- Density variants key off `in-data-[density=…]` selectors that assume the
  current nesting. Changing the element structure may require updating them.

## Steps

1. **Reproduce first.** With VoiceOver (Safari) and NVDA (Firefox), navigate the
   existing `list.stories.tsx` stories and record exactly what is announced for:
   a plain `List`, a `List` with `ListSection`s, and an interactive `ListItem`.
   Write the transcript into this plan before changing anything.
2. Test whether the `display: contents` dropout actually occurs in current
   browsers, or whether it has been fixed. This determines whether problem 2 is
   live or historical.
3. Choose direction A or B on the evidence and write down the reasoning.
4. Implement it, keeping the `useRender` escape hatch and all density styling.
5. Re-run the same AT navigation and diff the transcripts against step 1.

## Boundaries

- Do NOT apply the scanner's literal `<menu>` suggestion.
- Do NOT delete `className="contents"` without replacing the layout mechanism it
  provides; removing it will break `ListItem` flex layout.
- Do NOT change the visual rendering of any list story, at any density.
- Do NOT silence the rule to close this plan.
- Do NOT change `List`'s public props without recording it as a breaking change.
- If the AT testing in step 1 shows the current markup already announces
  correctly in both readers, STOP: record that as **Rejected — false positive**
  with the transcript as evidence, and change nothing.

## Verification

- **Mechanical**:
  - `pnpm typecheck && pnpm build && pnpm test` pass.
  - `npx react-doctor@latest --scope changed`: `prefer-tag-over-role` clears if
    direction A was taken. Under direction B it may still fire — that is
    acceptable **only** with the AT transcript recorded as the waiver evidence.
- **AT check — this is the acceptance criterion, not a supplement**:
  - VoiceOver (Safari) and NVDA (Firefox) both announce "list, N items" on entry
    and correct "item M of N" positions while arrowing through.
  - The same holds for a `List` containing `ListSection`s.
  - Interactive `ListItem`s are still reachable and operable by keyboard, and
    disabled items are announced as disabled.
- **Visual check**: every story in `list.stories.tsx` is pixel-identical across
  all three density settings (`default`, `-2`, `-4`) and for 1-, 2-, and
  3-line items.
- **Done when**: both screen readers announce list structure correctly, the
  before/after transcripts are recorded in this file, visuals are unchanged, and
  any remaining diagnostic is explicitly waived with that evidence.
