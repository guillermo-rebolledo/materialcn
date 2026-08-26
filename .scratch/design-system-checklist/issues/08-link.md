# 08 — Link

**What to build:** A link inside a paragraph of text that inherits the
paragraph's typography and colour, wraps across lines without breaking the text
flow, and announces itself as a link — or as a button when it is given an action
rather than a destination.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Inherits font family, size, weight, and colour from the surrounding text
      by default, with colour roles available for the cases that need them.
- [ ] Wraps across multiple lines inside a paragraph without disturbing the
      line box or leaving an orphaned underline segment.
- [ ] Supports a disabled state that is both visually clear and non-interactive.
- [ ] Resolves its accessibility role from its props — a destination announces
      as a link, an action announces as a button.
- [ ] Supports an optional icon beside the label; an icon-only link is not a
      supported shape.
- [ ] Has a visible focus indicator consistent with the rest of the library.
- [ ] Exported from the public barrel with stories, including a light/dark
      side-by-side case and a link set in a real paragraph.
- [ ] Typecheck, lint, build, and the story test run pass.
