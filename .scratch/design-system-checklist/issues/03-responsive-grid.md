# 03 — Responsive grid tokens

**What to build:** A layout can be placed on Material's responsive grid — the
column count, gutter, and margin all change together as the window crosses a size
class boundary. Right now nothing in the system encodes the grid, so every
consumer improvises page-level layout.

**Blocked by:** 01 — Window size class breakpoint tokens. The grid is defined per
window size class and cannot be expressed until those exist.

**Status:** ready-for-agent

- [ ] Column count, gutter, and margin are defined for every window size class.
- [ ] The grid is consumable from component classnames without hand-writing
      media queries.
- [ ] A foundations story demonstrates content on the grid and visibly reflows
      at each breakpoint.
- [ ] The README documents the grid alongside the other layout tokens.
- [ ] Typecheck, lint, build, and the story test run pass.
