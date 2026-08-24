# 26 — Extend TextField

**What to build:** Extend the current outlined input into a complete Material text-field stack with filled, multiline, adorned, supporting, and validation presentations.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Outlined and filled single-line fields share one coherent API and state model.
- [ ] Multiline fields use the shadcn input-group textarea composition rather than nesting a raw textarea incorrectly.
- [ ] Leading and trailing icons, prefixes, suffixes, counters, supporting text, errors, disabled, and read-only states are supported.
- [ ] Validation uses `data-invalid` on Field and `aria-invalid` on the control.
- [ ] Stories cover field variants, adornments, validation, multiline content, and light/dark presentation.
- [ ] Typecheck, lint, browser tests, and the library build pass.
