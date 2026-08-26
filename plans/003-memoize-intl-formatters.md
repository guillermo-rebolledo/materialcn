# 003 — Memoize date formatters in Calendar and DatePicker

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: HIGH
- **Category**: Performance
- **Rule**: `react-doctor/js-hoist-intl`
- **Estimated scope**: 2 files, 5 diagnostics, ~25 lines

## Problem

`Calendar` constructs **15 `Intl.DateTimeFormat` instances on every render** —
three at the top of the component, plus twelve more inside the month `<select>`
map. `DatePicker` adds a sixteenth.

    // src/components/ui/calendar.tsx:58-65 — current
    const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month)
    const fullDate = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" })

    // src/components/ui/calendar.tsx:130 — current (inside a 12-iteration map)
    {Array.from({ length: 12 }, (_, index) => (
      <option key={index} value={index}>
        {new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2026, index, 1))}
      </option>
    ))}

    // src/components/ui/date-picker.tsx:106 — current
    // (one further construction; read the surrounding lines before editing)

The component re-renders on every month change, every year change, and every
keyboard focus move — there is a `useLayoutEffect` keyed on `month` at
`calendar.tsx:70` driving `pendingFocus`. Each `Intl.DateTimeFormat` constructor
loads and allocates locale-data tables, making it one of the most expensive
routine operations in JavaScript. Sixteen of them per interaction is real work.

`locale` is a prop, so these **cannot** be hoisted to module scope.

## Target

Canonical recipe, `react-doctor/js-hoist-intl`, verbatim:

> Hoist to module scope:
> `const numberFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });`
> In React, when locale or options vary, wrap with
> `useMemo(() => new Intl.NumberFormat(locale), [locale])`. Each constructor
> loads and allocates locale-data tables that are expensive to rebuild per
> render or per list item.

The `locale`-varies branch applies. Applied:

    // src/components/ui/calendar.tsx — target
    const monthLabelFormat = useMemo(
      () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
      [locale],
    )
    const monthLabel = monthLabelFormat.format(month)

    const fullDate = useMemo(
      () =>
        new Intl.DateTimeFormat(locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      [locale],
    )

    const weekday = useMemo(
      () => new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
      [locale],
    )

    // The twelve month names collapse into ONE memoized array built by ONE
    // formatter, instead of twelve constructions per render.
    const monthNames = useMemo(() => {
      const format = new Intl.DateTimeFormat(locale, { month: "long" })
      return Array.from({ length: 12 }, (_, index) =>
        format.format(new Date(2026, index, 1)),
      )
    }, [locale])

    // …and the JSX becomes:
    {monthNames.map((name, index) => (
      <option key={index} value={index}>
        {name}
      </option>
    ))}

Note `monthLabel` stays a formatted string — only the *formatter* is memoized,
because `monthLabel` also depends on `month`, which changes constantly. Keeping
`.format(month)` outside the memo is correct and intentional.

For `date-picker.tsx:106`, read the surrounding code and apply the same shape:
memoize the formatter on `locale` (plus any other option inputs it reads), and
keep the `.format(…)` call at the use site.

## Repo conventions to follow

- `calendar.tsx:56` already uses `useMemo` (`const today = useMemo(() => new Date(), [])`)
  and already imports it — follow that placement and style.
- Keep the existing declaration order: these formatters sit between the `today`
  memo and the `firstVisible` / `days` / `years` derivations.
- The `key={index}` on `<option>` is fine and must stay — a fixed 12-element
  static list is explicitly excluded by `no-array-index-as-key`.

## Steps

1. In `calendar.tsx`, convert the three top-level constructions to memos keyed
   on `[locale]`, preserving each formatter's exact options object.
2. Keep `monthLabel` as the formatted string, deriving it from the memoized
   formatter outside the memo.
3. Replace the inline `<option>` construction with the `monthNames` memo and map
   over it.
4. In `date-picker.tsx`, read around line 106 and apply the same pattern.
   Confirm what its formatter actually depends on before writing the array.
5. Re-read the diff and remove unrelated churn.

## Boundaries

- Do NOT hoist any formatter to module scope. `locale` is a prop; a module
  constant would silently ignore it and ship a real i18n bug.
- Do NOT change any formatter's options object.
- Do NOT change the rendered output for any locale.
- Do NOT touch the `useLayoutEffect` focus logic.
- STOP if the code has drifted from commit `8872ab1`.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope changed` reports zero `js-hoist-intl`,
    score not lower.
  - `pnpm typecheck && pnpm build && pnpm test` pass.
- **Evidence gate (required by the rule).** Classed *Evidence-required risk*:
  source code, runtime behavior, measurement. In the Calendar story, record a
  React DevTools Profiler pass stepping through six months before and after, and
  confirm render duration dropped. If it did not measurably improve, record
  **Needs evidence** rather than keeping the change on syntax alone.
- **Behavior check — i18n is the risk here, so this is not optional**:
  - Render `Calendar` with `locale="en-US"`, `locale="es-MX"`, and
    `locale="ja-JP"`. The month/year header, the twelve month-select options,
    the narrow weekday header row, and the day cells' full-date accessible
    labels must all be identical to the pre-change output in every locale.
  - Change `locale` at runtime and confirm every label re-formats — this is the
    exact bug a module-scope hoist would introduce, so prove it does not happen.
  - Step through months with the keyboard and confirm focus still lands on the
    right day cell.
- **Done when**: the diagnostic is clear, all three locales render identically
  to before, a runtime locale change still re-formats, and the Profiler shows
  reduced render duration.
