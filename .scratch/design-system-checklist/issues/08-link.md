# 08 — Link

**What to build:** A link inside a paragraph of text that inherits the
paragraph's typography and colour, wraps across lines without breaking the text
flow, and announces itself as a link — or as a button when it is given an action
rather than a destination.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Inherits font family, size, weight, and colour from the surrounding text
      by default, with colour roles available for the cases that need them.
- [x] Wraps across multiple lines inside a paragraph without disturbing the
      line box or leaving an orphaned underline segment.
- [x] Supports a disabled state that is both visually clear and non-interactive.
- [x] Resolves its accessibility role from its props — a destination announces
      as a link, an action announces as a button.
- [x] Supports an optional icon beside the label; an icon-only link is not a
      supported shape.
- [x] Has a visible focus indicator consistent with the rest of the library.
- [x] Exported from the public barrel with stories, including a light/dark
      side-by-side case and a link set in a real paragraph.
- [x] Typecheck, lint, build, and the story test run pass.
