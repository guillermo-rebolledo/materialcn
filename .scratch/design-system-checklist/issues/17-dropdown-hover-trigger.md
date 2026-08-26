# 17 — Dropdown hover trigger

**What to build:** A dropdown that can open on hover, for the navigation-menu
shape where requiring a click on every level is tedious. Keyboard users get the
equivalent: the menu opens when its trigger receives focus.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] A dropdown can be configured to open on hover, and remains click-triggered
      by default.
- [x] When hover-triggered, focusing the trigger from the keyboard produces the
      same open behaviour.
- [x] Moving the pointer from the trigger toward the menu does not close it
      part-way.
- [x] Closing behaviour is unchanged — escape, an explicit close, and tabbing
      out of the content all still work.
- [x] A story demonstrates a hover-triggered navigation menu.
- [x] Typecheck, lint, build, and the story test run pass.
