# 06 — Contrast verification for the generated palette

**What to build:** A palette edit that drops a role pairing below AA fails the
build instead of shipping. The Material roles are contrast-designed by
construction, but nothing in the repo proves it, so the guarantee is inherited
rather than held — and the palette is generated, which means it is exactly the
kind of thing a future edit can regress silently.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] A check walks every on-role/role pairing in the generated colour layer, in
      both light and dark, and reports the measured contrast ratio.
- [x] The check fails below the AA threshold for normal text, with the failing
      pairs and their ratios named in the output.
- [x] Pairings that are legitimately decorative rather than text-bearing are
      excluded explicitly, with the reason recorded, rather than by lowering the
      threshold.
- [x] The check is runnable as a package script and passes against the current
      palette.
- [x] The README notes the guarantee and how to run the check after a palette
      edit.
