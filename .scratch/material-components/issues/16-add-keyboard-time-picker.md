# 16 — Add keyboard TimePicker

**What to build:** Add validated keyboard time entry with a reusable controlled value model shared by future time-picker presentations.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Consumers can enter and control hours and minutes in 12- or 24-hour mode.
- [ ] Period selection, parsing, formatting, min/max constraints, validation, disabled, and read-only states work coherently.
- [ ] Segment navigation and editing are keyboard accessible and announce errors through the existing Field pattern.
- [ ] The public value model is presentation-independent so a dial can reuse it.
- [ ] Stories cover modes, valid/invalid input, constraints, keyboard use, and light/dark presentation.
- [ ] Typecheck, lint, browser tests, and the library build pass.
