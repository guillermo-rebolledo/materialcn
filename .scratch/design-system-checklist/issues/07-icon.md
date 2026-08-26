# 07 — Icon

**What to build:** An icon in the library has one place that controls its size
and colour, and sizes that pair with the type scale so an icon set beside a label
optically matches it. Today the icon library is used directly at every call site,
so sizing is re-decided per component and there is no guidance on which icon to
use for a given action.

This ticket also delivers the iconography guidance the design system is missing:
style, naming, keywords, and reserved icons for common actions.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] An Icon component controls size and colour, inheriting colour from its
      parent by default.
- [ ] Sizes are named and paired to the type scale so an icon beside a given
      label role has a matching size.
- [ ] The component is decorative by default and does not become interactive on
      its own; interactivity comes from wrapping it in a button or link.
- [ ] Icons that convey meaning can carry an accessible name; purely decorative
      ones are hidden from assistive technology by default.
- [ ] Exported from the public barrel with stories covering the sizes, colour
      inheritance, and the labelled vs decorative cases.
- [ ] Documentation covers icon style, naming by purpose rather than appearance,
      and the reserved icons for common actions.
- [ ] Typecheck, lint, build, and the story test run pass.

**Note:** the existing components continue to use the icon library directly.
Migrating them onto this component is deliberate follow-up, not part of this
ticket.
