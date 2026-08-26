# 17 — Dropdown hover trigger

**What to build:** A dropdown that can open on hover, for the navigation-menu
shape where requiring a click on every level is tedious. Keyboard users get the
equivalent: the menu opens when its trigger receives focus.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] A dropdown can be configured to open on hover, and remains click-triggered
      by default.
- [ ] When hover-triggered, focusing the trigger from the keyboard produces the
      same open behaviour.
- [ ] Moving the pointer from the trigger toward the menu does not close it
      part-way.
- [ ] Closing behaviour is unchanged — escape, an explicit close, and tabbing
      out of the content all still work.
- [ ] A story demonstrates a hover-triggered navigation menu.
- [ ] Typecheck, lint, build, and the story test run pass.
