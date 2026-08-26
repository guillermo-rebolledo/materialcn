# 10 — Breadcrumbs

**What to build:** A trail showing where the current page sits in the product's
hierarchy, letting the user step back to any ancestor.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Renders a list of ancestors ending in the current page, with the current
      page marked as current and non-interactive.
- [x] Supports an optional icon per item, applied consistently across the trail
      rather than to arbitrary items.
- [x] Individual items can be disabled to prevent navigation.
- [x] Collapses the middle of the trail when it does not fit its container,
      keeping the root and the current page visible, with the collapsed items
      reachable.
- [x] The separator is customisable.
- [x] Announces as a navigation landmark with the trail structure intact.
- [x] Exported from the public barrel with stories covering the collapsed state,
      icons, and a light/dark side-by-side case.
- [x] Typecheck, lint, build, and the story test run pass.
