# 15 — Tooltip open delay

**What to build:** A tooltip that waits before opening, so moving the pointer
across a toolbar does not fire every tooltip it passes over. The delay currently
defaults to zero, which makes dense icon rows flicker.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Hovering a trigger waits a short interval before the tooltip opens; the
      chosen value is documented along with the reasoning, since Material does
      not specify one.
- [x] Focusing a trigger from the keyboard opens the tooltip immediately — the
      delay exists to filter accidental pointer movement, which focus is not.
- [x] Moving between adjacent triggers while a tooltip is already open does not
      re-incur the full delay.
- [x] The delay remains overridable per instance.
- [x] A story places several triggers adjacently so the pass-through behaviour
      is demonstrable.
- [x] Typecheck, lint, build, and the story test run pass.
