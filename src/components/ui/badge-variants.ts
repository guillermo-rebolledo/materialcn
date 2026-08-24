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
 * Material 3 chip geometry: 32dp tall, the small shape step, label-large type.
 * M3's own "badge" is the tiny 6/16dp dot that rides a navigation icon; this is
 * the chip, which is what shadcn's Badge is used for in practice.
 */
export const badgeVariants = cva(
  "group/badge inline-flex h-8 w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-m3-sm border border-transparent px-4 text-m3-label-lg whitespace-nowrap transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-4.5!",
  {
    variants: {
      variant: {
        default: "bg-m3-primary text-m3-on-primary",
        secondary:
          "bg-m3-secondary-container text-m3-on-secondary-container",
        tertiary: "bg-m3-tertiary-container text-m3-on-tertiary-container",
        destructive: "bg-m3-error-container text-m3-on-error-container",
        // M3's assist chip: transparent with a hairline.
        outline:
          "border-m3-outline-variant text-m3-on-surface-variant [a]:hover:bg-m3-on-surface/8",
        ghost: "text-m3-on-surface-variant [a]:hover:bg-m3-on-surface/8",
        link: "text-m3-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
