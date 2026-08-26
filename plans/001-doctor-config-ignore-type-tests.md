# 001 — Exclude type-tests and tooling from the React Doctor scan

- **Status**: DONE
- **Commit**: 8872ab1
- **Severity**: — (enabler; unblocks verification for every other plan)
- **Category**: Maintainability & architecture
- **Rule**: Beyond the scan
- **Estimated scope**: 1 new config file, 0 source files

## Problem

A baseline scan reports **106 warnings / score 61**. Of those, **84 are false
positives** against conventions this repository adopted deliberately. Until they
are silenced, the acceptance criterion used by plans 002–008 — "the diagnostic
clears and the score does not regress" — carries no signal.

The three false-positive families:

**1. `unused-file` ×18 and `no-barrel-import` ×17 on `src/components/ui/*.types.tsx`.**
These are type-level API tests. Example, `src/components/ui/search-bar.types.tsx:1`:

    import {
      SearchBar,
      SearchBarInput,
      type SearchBarProps,
    } from "../../index"

    const controlledProps: SearchBarProps = {
      value: "Oaxaca",
      onValueChange: () => undefined,
    }
    // ...
      {/* @ts-expect-error A controlled SearchBar requires onValueChange. */}
      <SearchBar value="Puebla" />
    // ...
    void SearchBarTypeChecks

They import from the public barrel *on purpose* — the point is to exercise the
published surface exactly as a consumer would. They are unreachable from a
runtime entry point *on purpose*. `tsc -b` executes them via `include: ["src"]`
in `tsconfig.app.json`, and the `@ts-expect-error` lines are the assertions.
Both rules are structurally incapable of seeing this.

**2. `unused-file` ×4 on `tools/*.mjs`** — `fig-decode.mjs`, `fig-report.mjs`,
`fig-specs.mjs`, `fig-tokens.mjs` are CLI entry points documented in CLAUDE.md.

**3. `only-export-components` ×39** on the `*-variants.ts` / `*-context.ts`
split. CLAUDE.md documents the rationale precisely: `cva()` builds a new object
per module evaluation, so exporting it from a component file breaks the Fast
Refresh boundary (`prevExports[key] === nextExports[key]`). This is a settled
decision with a written reason.

## Target

Add a React Doctor configuration that ignores the type-tests and the tooling
directory. React Doctor reads `doctor.config.{js,mjs,ts,json}` from the
repository root; **confirm the exact filename and schema for the installed
version before writing it** —

    npx react-doctor@latest --help
    npx react-doctor@latest rules explain unused-file

The intended effect, expressed as the exclusions to encode:

- ignore `src/components/**/*.types.tsx`
- ignore `tools/**`

For family 3, make a deliberate choice and record it in the config as a comment
pointing at the CLAUDE.md section:

- **Preferred**: disable `react/only-export-components` repository-wide, since
  the convention it objects to is the repository's documented architecture.
- **Alternative**: leave it enabled and suppress per-file, if any hit turns out
  to be a genuine accident rather than the convention.

Do not modify any source file to satisfy these rules.

## Repo conventions to follow

- Config files live at the repository root beside `components.json` and
  `vitest.config.ts`.
- When a config encodes a non-obvious decision, this repo explains it in prose —
  see the comment style in `src/components/ui/list.tsx` and `calendar.tsx`.
  Reference `CLAUDE.md` § "Variants live in sibling `*-variants.ts` files".

## Steps

1. Run `npx react-doctor@latest --json --json-out /tmp/baseline.json` and record
   the exact starting numbers: total warnings, score, and per-rule counts.
2. Determine the config filename and ignore-key schema for the installed
   version from `--help` / the rule explainer. Do not guess the shape.
3. Write the config with the two ignore globs plus the
   `only-export-components` decision, each with a one-line comment saying why.
4. Re-scan. Confirm `unused-file`, `no-barrel-import`, and (if disabled)
   `only-export-components` report zero, and that **no other rule's count
   changed** — the ignore globs must not accidentally mask real files.
5. Record the new baseline (warnings, score) in `plans/README.md`.

## Boundaries

- Do NOT modify any file under `src/` or `tools/`.
- Do NOT delete the `*.types.tsx` files. They are the type test suite.
- Do NOT add ignores for any rule not named here. The remaining warnings are
  real findings covered by plans 002–008.
- If an ignore glob would also mask a rule that is currently reporting a real
  hit, STOP and report it rather than widening the glob.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --json` shows zero `unused-file` and zero
    `no-barrel-import`.
  - Per-rule counts for `jsx-no-constructed-context-values` (10),
    `js-hoist-intl` (5), `prefer-module-scope-pure-function` (3),
    `no-array-index-as-key` (2), and the four single-hit rules are **unchanged**.
  - `pnpm typecheck` still runs the type tests — deliberately break one
    `@ts-expect-error` assertion, confirm `tsc -b` fails, then revert. This
    proves the ignore affected only the scanner, not the type suite.
- **Done when**: warnings drop to roughly 22, every remaining warning maps to a
  numbered plan, the type tests still fail correctly when broken, and the new
  baseline score is written into `plans/README.md`.

## Outcome (executed)

Config: `doctor.config.mjs` at the repository root. `.mjs` rather than the
typed `doctor.config.ts`, because the typed form imports `ReactDoctorConfig`
from `react-doctor/api` and react-doctor is run via `npx` rather than
installed — that import would break `pnpm typecheck`.

**Result: 106 warnings → 28, score 61 → 62, 49 files → 18.** `unused-file`,
`no-barrel-import`, and `only-export-components` all report zero; every other
rule's count is unchanged (`jsx-no-constructed-context-values` 10,
`js-hoist-intl` 5, `prefer-module-scope-pure-function` 3, `no-array-index-as-key`
2, `require-pnpm-hardening` 2, and the five single-hit rules).

The score moved one point for 78 silenced warnings, so it is too coarse to
register any single plan's work. **Plans 002–010 should read their acceptance
criterion against the per-rule counts, not the score.**

### Verification performed

- Per-rule counts diffed programmatically between the pre- and post-config JSON
  reports; only the three target rules changed. Nothing was masked.
- The type suite was proved live, as the spec required: the
  `@ts-expect-error` on `search-bar.types.tsx:32` was made stale, `pnpm
  typecheck` failed with `error TS2578: Unused '@ts-expect-error' directive.`,
  and the file was reverted. The ignore affects the scanner only.
- `pnpm typecheck && pnpm build` clean; `pnpm test` 158/158 on a full run.

### Deviations from the plan as written

- **Suppression is per-rule, not per-file.** The plan said "ignore
  `src/components/**/*.types.tsx`" and "ignore `tools/**`". Written as
  `ignore.files`, that drops those paths from the scan entirely and would
  silence every *future* rule on them — wider than this plan's own boundary
  ("Do NOT add ignores for any rule not named here"), and it would mean
  security rules never run on the `tools/*.mjs` CLI scripts. v0.9.12 offers
  `ignore.overrides: [{ files, rules }]`, so each path names only the rules it
  must. Verified to produce counts identical to the whole-file form.
- **A third path was added**: `doctor.config.mjs` itself, which `deslop`
  reports as an unreachable module. Same rule (`unused-file`), same family of
  false positive — the config flagging itself.
- **The plan's "84 false positives" was arithmetic that did not hold**:
  39 + 22 + 17 = 78. The remaining 6 (3 on `carousel.tsx:165`, 2
  `require-pnpm-hardening`, 1 in story code) were always classed as rejected in
  place, not silenced. So the target "warnings drop to roughly 22" lands at 28.
