/**
 * Variant definitions live beside the component rather than inside it — see
 * badge-variants.ts for why (React Fast Refresh boundaries).
 */

import { cva } from "class-variance-authority"

/**
 * Icon sizes, and the type roles they sit beside.
 *
 * The sizes are the kit's, not a doubling scale: an icon is optically matched
 * to the text next to it, and Material's own pairings are what the components
 * already use (see docs/m3-specs.md).
 *
 *   xs   18dp  chips and dense controls set in label-large
 *   sm   20dp  buttons at label-large and title-medium; the XSmall icon button
 *   md   24dp  the default — icon buttons, list leading icons, app bars,
 *              navigation destinations
 *   lg   32dp  buttons set in headline-large
 *   xl   40dp  extra-large controls
 *
 * Colour is controlled by inheritance rather than by a variant, which is why
 * there is no colour entry below. An icon takes `currentColor` from whatever
 * it sits in, so it is correct inside a filled button, a tonal chip, and an
 * error message without any of them passing it a colour. Reach for a text
 * colour utility on the icon only when it is meant to differ from its label.
 */
export const iconVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&>svg]:pointer-events-none [&>svg]:size-full",
  {
    variants: {
      size: {
        xs: "size-[18px]",
        sm: "size-5",
        md: "size-6",
        lg: "size-8",
        xl: "size-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
