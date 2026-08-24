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
 * Material 3 toggle button.
 *
 * Unselected it is a plain pill; selected it takes the secondary-container
 * pair, and — like the button — the corners tighten while pressed. Hover and
 * press are a state layer of the content color rather than a background swap,
 * so the selected and unselected states share one mechanism.
 */
export const toggleVariants = cva(
  [
    "group/toggle relative isolate inline-flex cursor-pointer items-center justify-center gap-2",
    "border border-transparent text-m3-label-lg whitespace-nowrap outline-none",
    "transition-[border-radius,background-color,color]",
    "duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default)",
    "text-m3-on-surface-variant",
    "disabled:pointer-events-none disabled:text-m3-on-surface/38",
    // State layer.
    // Covers the border box — see the note in button-variants.ts.
    "after:pointer-events-none after:absolute after:-inset-px after:-z-10",
    "after:rounded-[inherit] after:bg-current after:opacity-0",
    "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration)",
    "hover:not-disabled:after:opacity-8 focus-visible:after:opacity-10",
    "active:not-disabled:after:opacity-10",
    "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-2",
    // Selected.
    "aria-pressed:bg-m3-secondary-container aria-pressed:text-m3-on-secondary-container",
    "data-[state=on]:bg-m3-secondary-container data-[state=on]:text-m3-on-secondary-container",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-m3-surface-container-highest",
        outline: "border border-m3-outline-variant bg-transparent",
      },
      size: {
        sm: "h-8 min-w-8 rounded-[16px] px-3 active:not-disabled:rounded-m3-sm [&_svg:not([class*='size-'])]:size-5",
        default:
          "h-10 min-w-10 rounded-[20px] px-4 active:not-disabled:rounded-m3-sm [&_svg:not([class*='size-'])]:size-6",
        lg: "h-14 min-w-14 rounded-[28px] px-6 text-m3-title-md active:not-disabled:rounded-m3-md [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
