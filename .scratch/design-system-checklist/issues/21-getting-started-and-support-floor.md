# 21 — Getting started guide and support floor

**What to build:** Someone who has never used the library can go from install to
a themed screen without reading the architecture section first, and can tell
whether it will run in the browsers they support.

The README covers quick start and package consumption, but not the path through
them; and the library leans on modern CSS — the perceptual colour space, colour
scheme handling, container queries, and the parent selector — without ever
stating the floor that implies.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] An end-to-end path: install, wire up the stylesheet and theme provider,
      render a first screen, switch themes.
- [ ] The path is verified by following it against a clean project, not written
      from memory.
- [ ] The supported browser and OS floor is stated explicitly, derived from the
      CSS features the library actually uses.
- [ ] Optional pieces are marked optional — notably the self-hosted font, which
      is deliberately opt-in for payload reasons.
