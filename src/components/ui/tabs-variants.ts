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
 * Material 3 tabs.
 *
 * `line` is M3's primary tab: full-width, no container, and an active indicator
 * that is a 3dp pill sitting on the divider beneath the row. `default` keeps
 * shadcn's segmented look, restyled onto the surface ramp.
 */
export const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-m3-full p-1 text-muted-foreground group-data-horizontal/tabs:h-12 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:w-full data-[variant=line]:rounded-none data-[variant=line]:p-0 data-[variant=line]:border-b data-[variant=line]:border-m3-outline-variant data-[variant=primary]:w-full data-[variant=primary]:rounded-none data-[variant=primary]:border-b data-[variant=primary]:border-m3-outline-variant data-[variant=primary]:p-0 data-[variant=secondary]:w-full data-[variant=secondary]:rounded-none data-[variant=secondary]:border-b data-[variant=secondary]:border-m3-outline-variant data-[variant=secondary]:p-0",
  {
    variants: {
      variant: {
        default: "bg-m3-surface-container-highest",
        segmented: "bg-m3-surface-container-highest",
        line: "gap-0 bg-transparent",
        primary: "gap-0 bg-transparent",
        secondary: "gap-0 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
