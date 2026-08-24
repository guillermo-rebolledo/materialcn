# 01 — Establish Badge/Chip compatibility

**What to build:** Introduce `Chip` as the semantic name for the repository's existing Material chip visuals while keeping current `Badge` consumers working. The result gives later chip and notification-badge work unambiguous public names without a breaking release.

**Blocked by:** None — can start immediately.

**Status:** complete

- [x] Consumers can import and render `Chip` with every visual variant currently exposed by `Badge`.
- [x] Existing `Badge` imports continue to compile and render unchanged.
- [x] The compatibility/deprecation policy is documented in generated component documentation or Storybook.
- [x] Public exports, type declarations, stories, and tests cover both names.
- [x] Typecheck, lint, browser tests, and the library build pass.
