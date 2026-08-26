/**
 * Variant definitions live beside the component rather than inside it — see
 * badge-variants.ts for why (React Fast Refresh boundaries).
 */

import { cva } from "class-variance-authority"

/**
 * The pulse stops under `prefers-reduced-motion`, matching how every other
 * animation in the library collapses. A skeleton is the one place where that
 * is easy to forget: the animation is decorative, but it is also the only
 * signal that the screen is still loading rather than broken — so the shape
 * stays, only the movement goes.
 */
export const skeletonVariants = cva(
  "block shrink-0 bg-m3-surface-container-highest animate-pulse motion-reduce:animate-none",
  {
    variants: {
      /**
       * The library's shape steps, not a free-form radius. A skeleton whose
       * corners do not match the component it stands in for is a visible jump
       * at the moment the content arrives, which is the whole thing a skeleton
       * exists to avoid.
       */
      shape: {
        square: "rounded-m3-none",
        rounded: "rounded-m3-sm",
        large: "rounded-m3-lg",
        extraLarge: "rounded-m3-xl",
        /** For avatars and icon buttons — pair with a `size-*` utility. */
        circle: "rounded-m3-full aspect-square",
        /** For chips, pill buttons, and FABs. */
        pill: "rounded-m3-full",
      },
    },
    defaultVariants: {
      shape: "rounded",
    },
  }
)
