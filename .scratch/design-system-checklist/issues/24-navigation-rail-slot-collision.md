# 24 — Navigation rail reuses the navigation bar's slot name

**What to build:** A consumer can tell a bottom navigation bar apart from a
navigation rail's internals by selector alone.

`NavigationRailDestinations` renders `NavigationBar` internally, so the element
carries `data-slot="navigation-bar"`. A page with both — which is the normal
responsive arrangement, a bar for compact and a rail above it — has three
elements matching `[data-slot="navigation-bar"]`, two of which are inside a
rail. Anything selecting on that slot to style, test, or measure the bottom bar
silently picks up the rail as well.

**Found by:** 23 — the realistic playground screen. A responsive check reported
the bottom bar as visible at every width; the bar was correctly hidden and the
measurement had found the rail's copy.

**Blocked by:** None.

**Status:** ready-for-agent

- [ ] The rail's internal destinations element is distinguishable from a
      standalone navigation bar by `data-slot` alone.
- [ ] Existing `data-slot="navigation-bar"` consumers of the *standalone* bar
      keep working, or the change is recorded as breaking in the changelog —
      slot names are part of the API a consumer can select on.
- [ ] The rail's own semantics are checked while the slot is being changed: a
      rail nested inside something announcing as a navigation bar is a second
      symptom of the same reuse.
- [ ] A story or test asserts the two are separable, so this cannot regress.
- [ ] Typecheck, lint, build, and the story test run pass.
