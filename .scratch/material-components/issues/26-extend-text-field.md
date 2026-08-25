# 26 — Extend TextField

**What to build:** Extend the current outlined input into a complete Material text-field stack with filled, multiline, adorned, supporting, and validation presentations.

**Blocked by:** None — can start immediately.

**Status:** completed

- [x] Outlined and filled single-line fields share one coherent API and state model.
- [x] Multiline fields use the shadcn input-group textarea composition rather than nesting a raw textarea incorrectly.
- [x] Leading and trailing icons, prefixes, suffixes, counters, supporting text, errors, disabled, and read-only states are supported.
- [x] Validation uses `data-invalid` on Field and `aria-invalid` on the control.
- [x] Stories cover field variants, adornments, validation, multiline content, and light/dark presentation.
- [x] Typecheck, lint, browser tests, and the library build pass.
