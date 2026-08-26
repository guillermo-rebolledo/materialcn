/**
 * React Doctor configuration.
 *
 * Everything silenced here is a deliberate repository convention that the
 * scanner is structurally unable to see, not a finding worked around. Real
 * findings stay reported.
 *
 * Suppressions are written as `ignore.overrides` — path + explicit rule list —
 * rather than `ignore.files`, which drops the path from the scan entirely and
 * would silence every future rule on it too (security rules on the `tools/*.mjs`
 * CLI scripts, most of all). Each entry names only the rules it must.
 *
 * `.mjs` rather than `.ts` on purpose: the typed form imports
 * `ReactDoctorConfig` from `react-doctor/api`, and react-doctor is run through
 * `npx` rather than installed, so that import would break `pnpm typecheck`.
 */
export default {
  ignore: {
    overrides: [
      {
        // Type-level API tests. Each one imports from the public barrel *as a
        // consumer would* — that is the assertion — and has no runtime entry
        // point, so both rules below misread them. They are compiled by
        // `tsc -b` via tsconfig.app.json's "src" include; the
        // `@ts-expect-error` lines are the assertions.
        files: ["src/components/**/*.types.tsx"],
        rules: ["deslop/unused-file", "react-doctor/no-barrel-import"],
      },
      {
        // CLI entry points for decoding and querying the Material 3 Figma kit,
        // documented in CLAUDE.md § "Specs come from the Figma kit". Invoked by
        // hand, so nothing imports them and all four read as unreachable.
        files: ["tools/**"],
        rules: ["deslop/unused-file"],
      },
      {
        // This file. React Doctor reads it as configuration, but `deslop` only
        // sees a module no entry point imports.
        files: ["doctor.config.mjs"],
        rules: ["deslop/unused-file"],
      },
    ],
  },

  rules: {
    // CLAUDE.md § "Variants live in sibling `*-variants.ts` files" documents
    // why `cva()` definitions and other non-component exports live outside
    // component files: `cva()` builds a new object per module evaluation, so
    // exporting it from a component file breaks Fast Refresh's identity check
    // (`prevExports[key] === nextExports[key]`) and turns every edit into a
    // full page reload. The sibling-file split *is* the fix this rule asks
    // for; it fires on the sibling modules themselves, which have no component
    // to preserve. Settled decision — disabled repository-wide.
    "react/only-export-components": "off",
  },
}
