# 20 — Component reference documentation

**What to build:** A consumer can see what props a component takes without
reading its source, and can see how a compound component is meant to be
assembled. The docs addon is already installed and the components' types are
already extracted into dedicated type modules, so most of this is wiring rather
than authoring.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Prop tables are generated from the existing types and appear in the docs
      for every exported component.
- [ ] Prop descriptions come from the source comments rather than being
      duplicated in the docs.
- [ ] The compound components — the list, text field, search view, and toolbar
      families — document their anatomy: which parts are required, which are
      optional, and how they nest.
- [ ] Composition examples exist for the components that take slotted content,
      showing how to build a more advanced arrangement from the parts.
- [ ] The docs build passes.
