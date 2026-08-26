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
  "group/badge inline-flex w-fit shrink-0 items-center justify-center border border-transparent whitespace-nowrap transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary [&>svg]:pointer-events-none",
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
      /**
       * Height, padding, type, corner, and icon all move together — a badge
       * that only changed height would keep 16dp of padding around 11dp text
       * and read as a mistake rather than a smaller badge.
       *
       * The last selector in each is the text-free case: with no label, the
       * horizontal padding would leave a wide, short lozenge instead of the
       * square the shape step was drawn for. `:only-child` catches exactly the
       * icon-only badge without needing a prop for it.
       */
      size: {
        sm: "h-6 gap-1 rounded-m3-xs px-2 text-m3-label-sm has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&>svg]:size-4! has-[>svg:only-child]:w-6 has-[>svg:only-child]:px-0",
        default:
          "h-8 gap-2 rounded-m3-sm px-4 text-m3-label-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:size-4.5! has-[>svg:only-child]:w-8 has-[>svg:only-child]:px-0",
        lg: "h-10 gap-2 rounded-m3-md px-5 text-m3-title-md has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&>svg]:size-5! has-[>svg:only-child]:w-10 has-[>svg:only-child]:px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
