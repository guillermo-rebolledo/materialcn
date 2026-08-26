# 09 — Alert

**What to build:** A prominent, persistent message about a page or a region of
one. The library covers transient messages with the snackbar, but has nothing for
a message that stays on the page — a form-level error, a service notice, a
warning above a destructive area.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Roles are visually distinguished — at minimum informational, success,
      warning, and error — using colour roles that keep the content above the AA
      contrast threshold against the alert's own background.
- [x] Supports an optional title, so a longer message can be scanned.
- [x] Supports a leading icon, so the role is legible to colourblind users
      without relying on the background colour alone.
- [x] Supports actions related to the message.
- [x] Announces its role correctly to assistive technology, distinguishing an
      urgent alert from a passive status message.
- [x] Adapts to narrow viewports, going full-width where the layout calls for it.
- [x] Exported from the public barrel with stories covering every role, the
      title and icon variants, and a light/dark side-by-side case.
- [x] Typecheck, lint, build, and the story test run pass.
