# 11 — Pagination

**What to build:** Navigation across a range of pages, where the user can jump to
a nearby page directly rather than stepping one at a time.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] The selected page is visually highlighted and non-interactive.
- [x] A configurable range of pages renders around the selection, with the rest
      elided, so a long range stays a fixed width.
- [x] Supports choosing how many items appear per page.
- [x] Supports an indeterminate mode for when the total page count is not known
      ahead of time, falling back to previous/next navigation.
- [x] Each page control carries a full descriptive label for assistive
      technology rather than a bare number.
- [x] The selected state is announced when a page control receives focus.
- [x] Exported from the public barrel with stories covering the elided range,
      the indeterminate mode, and a light/dark side-by-side case.
- [x] Typecheck, lint, build, and the story test run pass.
