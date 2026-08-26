# 04 — Responsive typography scale

**What to build:** A display or headline role set for a desktop layout no longer
renders at desktop size on a phone. The type scale steps down as the window
narrows, so the hierarchy stays readable without every consumer overriding sizes
by hand.

**Blocked by:** 01 — Window size class breakpoint tokens. The scale steps at
window size class boundaries.

**Status:** ready-for-agent

- [ ] The display and headline roles step down on the smaller window size
      classes; body and label roles are reviewed and left fixed unless Material
      specifies otherwise.
- [ ] Line height and tracking step with the size rather than being left at the
      desktop values.
- [ ] The typography foundations story shows the same specimen at each window
      size class so the steps can be compared.
- [ ] The README documents which roles are responsive and which are not.
- [ ] Existing stories are visually unchanged at desktop width.
- [ ] Typecheck, lint, build, and the story test run pass.
