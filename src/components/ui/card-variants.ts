/**
 * Variant definitions live beside the component rather than inside it.
 *
 * React Fast Refresh only treats a module as a hot boundary when every export
 * either is a component or keeps a stable identity across re-evaluations.
 * `cva()` builds a fresh object each time its module runs, so exporting it from
 * the component file demoted that file to a full page reload on every edit.
 * Re-exported from here, the binding's identity survives edits to the component.
 */

import { cva } from "class-variance-authority"

/**
 * Material 3 card.
 *
 * Radius is the medium shape step (12dp), and the three variants differ only in
 * how they express depth — which is the Material point. `elevated` lifts with a
 * shadow, `filled` steps up the surface-container ramp, `outlined` uses a
 * hairline. In dark themes the ramp does more work than the shadow does.
 */
export const cardVariants = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-m3-md text-m3-body-md [--card-spacing:--spacing(4)] py-(--card-spacing) has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-m3-md *:[img:last-child]:rounded-b-m3-md",
  {
    variants: {
      variant: {
        elevated: "bg-m3-surface-container-low text-m3-on-surface shadow-m3-1",
        filled: "bg-m3-surface-container-highest text-m3-on-surface",
        outlined:
          "bg-m3-surface text-m3-on-surface border border-m3-outline-variant",
      },
    },
    defaultVariants: {
      variant: "elevated",
    },
  },
)
