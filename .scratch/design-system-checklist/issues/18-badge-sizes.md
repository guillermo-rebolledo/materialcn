# 18 — Badge sizes

**What to build:** A badge that can be rendered at more than one size, so it can
sit in a dense table row as comfortably as in a marketing header. It is currently
fixed at a single height.

The badge's other checklist requirements are already met elsewhere: the chip
component covers dismissal and icons, and the notification badge covers
positioning over an icon. Size is the remaining gap.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] At least a small, default, and large size, with padding, typography, and
      corner radius scaling coherently rather than the height alone changing.
- [x] Icon contents stay recognisable at the smallest size.
- [x] The text-free shape stays correct at every size.
- [x] The existing default size is unchanged, so current consumers see no
      visual difference.
- [x] Stories cover every size, including a light/dark side-by-side case.
- [x] Typecheck, lint, build, and the story test run pass.
