# 23 — Realistic playground screen

**What to build:** One product-shaped screen that uses the components together
the way a real application would, rather than in isolation. Stories exercise each
component alone; nothing in the repo exercises a navigation rail, a list, a
search bar, and a snackbar competing for the same layout at the same time — which
is where spacing, elevation, and overlay-ordering problems actually surface.

**Blocked by:** None — can start immediately. Best sequenced after 08 (Link),
09 (Alert), and 12 (Image) so the screen can use them, but it does not require
them.

**Status:** ready-for-agent

- [ ] A single screen resembling a real product surface — navigation, a content
      region, forms, and at least one overlay.
- [ ] Exercises the responsive behaviour across window size classes rather than
      being fixed-width.
- [ ] Works in both themes, verified side by side.
- [ ] Stays out of the published package.
- [ ] Any problems it surfaces are written up as new tickets rather than fixed
      inline, so this ticket stays reviewable.
