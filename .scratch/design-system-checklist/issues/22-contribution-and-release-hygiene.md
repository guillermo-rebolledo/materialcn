# 22 — Contribution guidelines and release hygiene

**What to build:** A contributor knows what "done" means before opening a change,
and a consumer can see what changed between versions. The definition of done
already exists and is good — it is buried in the component backlog, where nobody
looking to contribute would find it. The design principles exist too, written up
as engineering gotchas in the repository instructions rather than as principles.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Contribution guidelines live at the conventional location, built on the
      existing definition of done rather than a new one written from scratch.
- [ ] The backlog links to the guidelines instead of carrying its own copy, so
      the two cannot drift.
- [ ] A design principles section states the load-bearing rules as principles:
      that retheming is a token edit and components are never patched for
      colour, that dark mode is a token swap and never a utility override, and
      that spring choice follows from whether the animated property clamps.
- [ ] A changelog exists and records the current state as a baseline.
- [ ] The release cadence and what counts as a breaking change are documented.
