# 09 — Alert

**What to build:** A prominent, persistent message about a page or a region of
one. The library covers transient messages with the snackbar, but has nothing for
a message that stays on the page — a form-level error, a service notice, a
warning above a destructive area.

**Blocked by:** None — can start immediately.

**Status:** done (one box deferred to 25)

- [ ] Roles are visually distinguished — at minimum informational, success,
      warning, and error — using colour roles that keep the content above the AA
      contrast threshold against the alert's own background.
      **Partial.** All four pairs clear AA, and each severity carries an icon so
      the role never rests on colour alone. But the baseline scheme has no
      success or warning role, so warning borrows `tertiary-container`, which is
      within 25° of `error-container` at the same lightness — the two are not
      separable by colour. Tracked as 25; this box stays open until the palette
      has the roles.
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
