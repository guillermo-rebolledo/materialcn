# 005 — Fix stray `0` render in the TextField help row

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: MEDIUM
- **Category**: Bugs & correctness
- **Rule**: `react-doctor/rendering-conditional-render`
- **Estimated scope**: 1 file, 3 lines + 1 story

## Problem

    // src/components/ui/text-field.tsx:185-190 — current
    {(supportingText || maxLength) && (
      <div id={helpId} className="flex justify-between gap-4 px-4 pt-1">
        {supportingText ? <FieldDescription className="text-m3-body-sm">{supportingText}</FieldDescription> : <span />}
        {maxLength && <span className="shrink-0 text-m3-body-sm text-muted-foreground">{value.length} / {maxLength}</span>}
      </div>
    )}

`maxLength` is typed `maxLength?: number` (`text-field.tsx:31`) and is public
API. Two guards test it for truthiness:

- Line 185: when `supportingText` is absent and `maxLength` is `0`, the
  expression `(undefined || 0)` evaluates to `0` and JSX renders the literal
  text **`0`** where the help row should be.
- Line 188: `maxLength && …` has the same failure independently.

Only `false`, `null`, and `undefined` render as nothing in JSX. `0` always
renders.

**There is a third site the scanner does not flag, and it must be kept in
sync** — `text-field.tsx:81`:

    // src/components/ui/text-field.tsx:81 — current
    const describedBy = error ? errorId : supportingText || maxLength ? helpId : undefined

This one is a ternary *condition*, so it renders no stray digit and the rule
correctly ignores it. But it decides whether `aria-describedby` points at the
help row. If lines 185/188 start rendering the help row for `maxLength={0}`
while line 81 still treats `0` as falsy, the counter renders but is never
announced to screen readers. Fixing two of the three sites creates an
accessibility bug that did not exist before.

The rule requires confirming the value can actually reach zero. It can:
`maxLength={0}` is legal against the declared type, and nothing in the component
rejects or normalizes it. The trigger is narrow — `maxLength={0}` is unusual
input — which is why this is MEDIUM and not HIGH. But it is a shipped public
prop on a text input, the failure is visible garbage in the UI, and the fix is
free.

## Target

Canonical recipe, `react-doctor/rendering-conditional-render`, verbatim:

> Convert to an explicit boolean check: `{items.length > 0 && <List />}`,
> `{Boolean(count) && <Badge />}`, or a ternary
> `{items.length ? <List /> : null}`. Only `false`, `null`, and `undefined`
> render to nothing in JSX: `0` always renders.

Use the explicit `undefined` test rather than `Boolean()` or `> 0`, because
`maxLength={0}` should render *no counter* — not a `0 / 0` counter — and the
component must still distinguish "not provided" from "provided as zero":

    // src/components/ui/text-field.tsx — target
    {(supportingText || maxLength !== undefined) && (
      <div id={helpId} className="flex justify-between gap-4 px-4 pt-1">
        {supportingText ? <FieldDescription className="text-m3-body-sm">{supportingText}</FieldDescription> : <span />}
        {maxLength !== undefined && <span className="shrink-0 text-m3-body-sm text-muted-foreground">{value.length} / {maxLength}</span>}
      </div>
    )}

This keeps `maxLength={0}` rendering a real (if useless) `0 / 0` counter rather
than swallowing it, which is the honest reading of "the consumer asked for a
counter with a limit of zero". If the team would rather treat `0` as "no
counter", use `maxLength ? …` on line 188 and say so in a comment — but do not
leave the bare truthiness test, which renders the stray digit.

## Repo conventions to follow

- This file keeps long JSX lines rather than wrapping them; match the
  surrounding formatting exactly and change only the two conditions.
- `text-field.stories.tsx` is the story file; follow its existing story
  structure when adding coverage.

## Steps

1. At `src/components/ui/text-field.tsx:185`, change `maxLength` to
   `maxLength !== undefined` inside the `||`.
2. At `src/components/ui/text-field.tsx:188`, change the `maxLength &&` guard to
   `maxLength !== undefined &&`.
3. At `src/components/ui/text-field.tsx:81`, apply the same test so
   `describedBy` stays consistent with what line 185 now renders:

       const describedBy = error ? errorId : supportingText || maxLength !== undefined ? helpId : undefined

4. Add a story to `text-field.stories.tsx` rendering a `TextField` with
   `maxLength={0}`, so the regression is covered by `pnpm test`.
5. Re-read the diff and remove unrelated churn — it should touch exactly three
   lines plus the new story.

## Boundaries

- Do NOT change the `maxLength` prop type or add runtime validation.
- Do NOT change the counter's format, styling, or position.
- Do NOT touch the `supportingText` branch or the `<span />` spacer.
- Do NOT "fix" other truthiness guards elsewhere in the file; only the three
  sites named above involve `maxLength`.
- STOP if the code has drifted from commit `8872ab1`.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope changed` reports zero
    `rendering-conditional-render`, score not lower.
  - `pnpm typecheck && pnpm build && pnpm test` pass.
- **Behavior check**, all four combinations:
  1. `maxLength={0}` — no stray `0` appears anywhere in or around the field.
  2. `maxLength={10}` — the `n / 10` counter renders and increments as you type.
  3. `supportingText` only, no `maxLength` — the description renders, no counter.
  4. Neither — the help row does not render at all.
  - For cases 1 and 2, inspect the rendered input's `aria-describedby` and
    confirm it points at the help row whenever that row is visible.
- **Done when**: the diagnostic is clear, all four combinations behave as listed,
  and the `maxLength={0}` story is committed.
