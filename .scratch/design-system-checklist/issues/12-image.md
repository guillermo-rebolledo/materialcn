# 12 — Image

**What to build:** An image that holds its space while loading, degrades to
something deliberate when the source is missing or broken, and serves an
appropriately sized asset for the viewer's screen density.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Supports width and height as well as an aspect ratio that scales against
      the parent, so the layout does not shift when the image loads.
- [x] Shows a deliberate fallback when the source is undefined or fails to load
      — a placeholder surface, an icon, or supplied content.
- [x] Supports serving multiple asset sizes by screen density.
- [x] Requires alt text for non-decorative images and marks decorative ones as
      such, so neither case is left ambiguous.
- [x] Masks to the shape it is given, including the library's corner radius
      tokens.
- [x] Exported from the public barrel with stories covering the fallback,
      aspect ratios, and a light/dark side-by-side case.
- [x] Typecheck, lint, build, and the story test run pass.
