# 16 — Calendar locale-aware week start

**What to build:** A calendar rendered in a Monday-first locale starts its week
on Monday. The calendar already localises month names, weekday labels, and the
spoken full date, but the first visible cell is computed as though every locale
starts its week on Sunday — so for most of the world the labels are correct and
the columns are rotated out from under them.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] The first day of the week is derived from the locale, with a Sunday
      fallback for environments that do not expose week info.
- [x] The weekday header row and the day cells stay aligned under every
      supported first-day-of-week.
- [x] Keyboard navigation across a row still moves through the days in the
      displayed order, and moving off the end of a row lands where the user
      would expect.
- [x] Range selection highlighting is unbroken across the rotated week.
- [x] Stories cover at least a Sunday-first and a Monday-first locale, and the
      date picker and date picker dialog inherit the behaviour.
- [x] Typecheck, lint, build, and the story test run pass.
