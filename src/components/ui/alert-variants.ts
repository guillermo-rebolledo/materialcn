/**
 * Variant definitions live beside the component rather than inside it — see
 * badge-variants.ts for why (React Fast Refresh boundaries).
 */

import { cva } from "class-variance-authority"

/**
 * Severity colours.
 *
 * Material's baseline scheme has no `success` or `warning` role — it ships
 * primary, secondary, tertiary, and error. Rather than invent two roles that a
 * retheme would then have to know about, each severity borrows the container
 * pair closest to it in meaning. All four pairs are covered by
 * `pnpm check:contrast`, so the content clears AA against the alert's own
 * background in both schemes; a product with real semantic colours should
 * retheme tertiary and primary rather than patch this component.
 *
 * Colour is never the only signal — every severity carries a leading icon for
 * exactly this reason.
 */
export const alertVariants = cva(
  [
    "group/alert relative grid w-full gap-x-m3-md gap-y-m3-xs rounded-m3-lg p-m3-lg text-left text-m3-body-md",
    "has-[>[data-slot=alert-icon]]:grid-cols-[auto_1fr]",
  ].join(" "),
  {
    variants: {
      severity: {
        info: "bg-m3-secondary-container text-m3-on-secondary-container",
        success: "bg-m3-primary-container text-m3-on-primary-container",
        warning: "bg-m3-tertiary-container text-m3-on-tertiary-container",
        error: "bg-m3-error-container text-m3-on-error-container",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
)
