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
      // Kit `Card states`: interactive cards wash an 8% On Surface state layer
      // over the container, lift one elevation step on hover, and show a
      // 3dp Secondary focus ring 2dp outside the 12dp shape.
      interactive: {
        true: [
          "relative isolate cursor-pointer outline-none",
          "transition-[box-shadow,background-color] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
          "after:pointer-events-none after:absolute after:-inset-px after:-z-10 after:rounded-[inherit] after:bg-m3-on-surface after:opacity-0",
          "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration) after:ease-(--m3-spring-effects-fast)",
          "hover:after:opacity-8 focus-visible:after:opacity-10 active:after:opacity-10",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary",
        ],
        false: "",
      },
    },
    compoundVariants: [
      { variant: "elevated", interactive: true, class: "hover:shadow-m3-2 active:shadow-m3-1" },
      { variant: "filled", interactive: true, class: "hover:shadow-m3-1 active:shadow-m3-0" },
      { variant: "outlined", interactive: true, class: "hover:shadow-m3-1 active:shadow-m3-0" },
    ],
    defaultVariants: {
      variant: "elevated",
      interactive: false,
    },
  },
)
