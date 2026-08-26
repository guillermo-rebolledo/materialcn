# 02 — Spacing scale and 4dp unit tokens

**What to build:** The 4dp base unit the components already follow becomes an
explicit, documented scale rather than an implied convention. Today spacing is
hardcoded per component as raw Tailwind numeric utilities, so the relationship
between a component's padding and Material's density rules exists only in the
author's head and cannot be adjusted in one place.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] A spacing scale is defined in the token layer with the Material density
      steps it corresponds to.
- [ ] The README documents the base unit, the scale, and when to reach for each
      step, in the same shape as the existing token layer sections.
- [ ] A foundations story renders the scale so the steps can be compared
      visually.
- [ ] Existing components are unchanged in appearance — this ticket introduces
      the scale and documents it; migrating components onto it is out of scope
      and should be noted as follow-up.
- [ ] Typecheck, lint, build, and the story test run pass.
