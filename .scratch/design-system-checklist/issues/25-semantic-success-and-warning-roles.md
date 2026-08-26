# 25 — Semantic success and warning colour roles

**What to build:** A warning does not look like an error.

Material's baseline scheme ships primary, secondary, tertiary, and error, and no
success or warning role. `Alert` borrows the closest container pair for each —
warning takes `tertiary-container`, success takes `primary-container` — which is
documented and contrast-verified, but in the baseline scheme tertiary-container
is pink. Set beside `error-container`, also pink, the two severities are
distinguishable by their icon and by nothing else.

That is not a failure of the alert. It is the palette not having the roles, and
every future component that needs to say "this went well" or "be careful" will
hit the same wall.

**Found by:** 23 — the realistic playground screen, where a storage warning read
as a failure at a glance.

**Blocked by:** None.

**Status:** ready-for-agent

- [ ] Success and warning exist as colour roles in the generated layer, with
      container/content pairs in both schemes, derived the same way the rest of
      the palette is rather than hand-picked.
- [ ] `pnpm check:contrast` covers the new pairs, and passes.
- [ ] The hues are far enough from `error` that severity is legible without the
      icon — the icon stays, but it should be reinforcement rather than the only
      signal.
- [ ] `Alert` uses the new roles instead of borrowing, and the note in
      `alert-variants.ts` explaining the borrow is removed rather than left to
      contradict the code.
- [ ] The README's colour guidance covers when to use them, and retheming
      guidance says what a consumer must supply.
- [ ] Typecheck, lint, build, and the story test run pass.
