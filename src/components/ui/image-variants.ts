/**
 * Variant definitions live beside the component rather than inside it — see
 * badge-variants.ts for why (React Fast Refresh boundaries).
 */

import { cva } from "class-variance-authority"

/**
 * The mask lives on a wrapper rather than on the `img` itself, so the corner
 * step applies to the fallback too. An image whose placeholder is square and
 * whose photograph is rounded changes shape at the moment it loads, which is
 * the same jump the reserved box exists to prevent.
 */
export const imageVariants = cva(
  "relative block overflow-hidden bg-m3-surface-container-highest",
  {
    variants: {
      shape: {
        none: "rounded-m3-none",
        xs: "rounded-m3-xs",
        sm: "rounded-m3-sm",
        md: "rounded-m3-md",
        lg: "rounded-m3-lg",
        xl: "rounded-m3-xl",
        "2xl": "rounded-m3-2xl",
        full: "rounded-m3-full",
      },
    },
    defaultVariants: {
      shape: "none",
    },
  }
)
