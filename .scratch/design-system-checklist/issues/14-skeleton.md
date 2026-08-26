# 14 — Skeleton: reduced motion, sizes, shapes, and stories

**What to build:** A skeleton that matches the shape and size of the component it
stands in for, so nothing jumps when the real content arrives — and that stops
pulsing for users who have asked for reduced motion.

The skeleton is currently a bare pulsing rectangle. Its animation is the one
motion in the library not covered by the reduced-motion handling that the wave,
circular progress, loading indicator, and carousel all have. It is also the last
unchecked item in the component backlog, which flags it as missing stories.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] The pulse stops under the reduced-motion preference, consistent with how
      the library's other animations collapse.
- [x] Skeletons can match the sizes of the components they replace without the
      consumer measuring by hand.
- [x] Skeletons can match the library's shapes, including the circular and
      pill forms, not just the default corner radius.
- [x] Stories demonstrate composing several skeletons into a realistic loading
      layout, showing that a one-to-one mapping of the interface is not the
      intent.
- [x] Stories include a light/dark side-by-side case.
- [x] The corresponding line in the component backlog is checked off.
- [x] Typecheck, lint, build, and the story test run pass.
