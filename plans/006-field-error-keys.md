# 006 — Stabilize error list keys in Field

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: LOW
- **Category**: Bugs & correctness
- **Rule**: `react-doctor/no-array-index-as-key`
- **Estimated scope**: 1 file, 1 line — **or a documented decision not to change it**

## Problem

    // src/components/ui/field.tsx:194-209 — current
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )

The list is keyed by array index. When the error set changes — a field goes from
`["Required", "Too short"]` to `["Too short"]` — React matches the surviving
item to the wrong `<li>`, reusing DOM state across rows that mean different
things.

The list is **already deduplicated by message** two lines above, via
`new Map(errors.map((error) => [error?.message, error]))`. So a unique, stable
key is sitting right there at no cost.

The rule's suppression clause — "append-only logs whose rows have no per-item
identity and never reorder or filter" — does not apply: these rows have identity
(the message, already used as the Map key) and they do filter.

## Decide before you edit

`src/components/ui/field.tsx` is **vendored shadcn**, not hand-written for this
repo. CLAUDE.md: "Treat as vendored; when upstream changes, use
`shadcn add --diff` rather than editing blind." Editing this file means
`shadcn add --diff` flags it from here on.

Weigh that against the payoff, which is genuinely small: the error list is short
and reorders rarely, and the visible symptom is a mis-reused `<li>` rather than
wrong data. **Declining this finding with a written reason is an acceptable
outcome of this plan.** Do not edit a vendored file on autopilot.

## Target

If proceeding — canonical recipe, `react-doctor/no-array-index-as-key`, verbatim:

> Use a stable per-item identifier: `key={item.id}`, `key={item.slug}`, or any
> field that uniquely identifies the row across renders. If items truly lack an
> id, derive one (content hash, `crypto.randomUUID()` cached on the item): never
> the index alone, because reordering reassigns React state across the wrong DOM
> nodes.

The message is already the unique identifier — it is the Map key that produced
this list, so uniqueness is guaranteed by construction:

    // src/components/ui/field.tsx — target
    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error) =>
            error?.message && <li key={error.message}>{error.message}</li>
        )}
      </ul>
    )

The `index` parameter is dropped entirely.

## Repo conventions to follow

- If you do edit, record the divergence where this repo records its other
  deliberate departures from upstream shadcn — see the CLAUDE.md section
  "Variants live in sibling `*-variants.ts` files" for the established tone and
  placement of such notes.
- If you decline, write the reason into `plans/README.md` beside this plan's
  status and mark it DECLINED rather than DONE.

## Steps

1. Decide: edit or decline. Record the decision either way.
2. If editing: at `src/components/ui/field.tsx:206`, replace `key={index}` with
   `key={error.message}` and drop the now-unused `index` parameter.
3. If editing: add a line to CLAUDE.md noting that `field.tsx` diverges from
   upstream shadcn and why, so the next `shadcn add --diff` is not confusing.
4. If declining: change nothing in `src/` and record the rationale.

## Boundaries

- Do NOT restructure the deduplication logic or the `useMemo` around it.
- Do NOT change the single-error early return.
- Do NOT re-run `shadcn add` on this file.
- Do NOT edit any other vendored shadcn file as part of this plan.
- Do NOT touch `src/components/ui/list.stories.tsx:52`, which carries the same
  rule but is story code, not shipped.

## Verification

- **If declined**: verification is that `src/` is unchanged and the rationale is
  recorded. Nothing else applies.
- **If edited — Mechanical**:
  - `npx react-doctor@latest --scope changed` reports zero
    `no-array-index-as-key` from `field.tsx`, score not lower.
  - `pnpm typecheck && pnpm build && pnpm test` pass.
- **If edited — Behavior check**: render a `Field` carrying two errors, then
  remove the first. The remaining message stays correct and its `<li>` is not
  reusing the removed row's DOM state. Also confirm a single-error field still
  renders as bare text (the early return) rather than a bulleted list.
- **Done when**: either the diagnostic is clear and the divergence is recorded,
  or the finding is explicitly declined in writing and `src/` is untouched.
