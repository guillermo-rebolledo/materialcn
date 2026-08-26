# 01 — Window size class breakpoint tokens

**What to build:** A developer writing a responsive component can target Material's
window size classes by name — compact, medium, expanded, large, extra-large —
instead of Tailwind's stock `sm`/`md`/`lg` scale, which does not line up with
Material's breakpoints. The tokens are generated alongside the rest of the token
layer, mapped into Tailwind's breakpoint namespace so the variants come for free,
and documented so the M3 name and the pixel value are visible in one place.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Breakpoint tokens for all five Material window size classes are emitted by
      the token generator rather than hand-written.
- [x] Tailwind responsive variants named after the window size classes work in
      component classnames.
- [x] A foundations story shows the active window size class and its boundaries,
      updating as the viewport resizes.
- [x] The token reference in the README lists the layout layer with its source
      file and the utilities it produces, matching how the other five layers are
      documented.
- [x] Typecheck, lint, build, and the story test run pass.
