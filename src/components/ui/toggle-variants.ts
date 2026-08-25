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
 * Material 3 Expressive toggle button.
 *
 * Unselected it sits on `surface-container`; selected it takes the primary
 * pair. Selection also swaps the shape: a round toggle settles from a pill to
 * the medium/large corner, and a square toggle does the reverse, so the
 * selected state reads at a glance even without color. Pressing tightens the
 * corners further, exactly as the button does.
 *
 * Base UI's Toggle exposes selection as `data-pressed` (plus `aria-pressed`);
 * there is no `data-state`, so every selected style keys off `data-pressed:`.
 *
 * Hover and press are a state layer of the content color rather than a
 * background swap, so the selected and unselected states share one mechanism.
 */
export const toggleVariants = cva(
  [
    "group/toggle relative isolate inline-flex cursor-pointer items-center justify-center gap-2",
    "border border-transparent font-m3-medium text-m3-label-lg whitespace-nowrap outline-none",
    // Shape morph on a clamped property: effects spring, never spatial.
    "transition-[border-radius,background-color,color,border-color]",
    "duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default)",
    "text-m3-on-surface-variant",
    "disabled:pointer-events-none disabled:text-m3-on-surface/38 disabled:bg-m3-on-surface/10",
    // State layer.
    // Covers the border box — see the note in button-variants.ts.
    "after:pointer-events-none after:absolute after:-inset-px after:-z-10",
    "after:rounded-[inherit] after:bg-current after:opacity-0",
    "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration)",
    "after:ease-(--m3-spring-effects-fast)",
    "hover:not-disabled:after:opacity-8 focus-visible:after:opacity-10",
    "active:not-disabled:after:opacity-10",
    "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-2",
    // Selected.
    "data-pressed:bg-m3-primary data-pressed:text-m3-on-primary",
    "data-pressed:disabled:bg-m3-on-surface/10 data-pressed:disabled:text-m3-on-surface/38",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-m3-surface-container",
        // Outlined toggles invert on selection, and the stroke goes away with
        // the fill taking its place.
        outline: [
          "border-m3-outline-variant bg-transparent",
          "data-pressed:border-transparent data-pressed:bg-m3-inverse-surface data-pressed:text-m3-inverse-on-surface",
        ],
      },
      // Heights, padding, gap and icon size per kit size (XSmall / Small /
      // Medium). Radii are set by the shape compound variants below.
      size: {
        sm: "h-8 min-w-8 gap-1 px-3 [&_svg:not([class*='size-'])]:size-5",
        default: "h-10 min-w-10 px-4 [&_svg:not([class*='size-'])]:size-5",
        lg: "h-14 min-w-14 px-6 text-m3-title-md [&_svg:not([class*='size-'])]:size-6",
      },
      shape: {
        round: "",
        square: "",
      },
    },
    compoundVariants: [
      // Round: pill at rest, kit's selected corner (12 / 12 / 16) when
      // selected, and the pressed corner (8 / 8 / 12) while pressed. The
      // resting pill is half the height rather than `rounded-m3-full` so the
      // morph spends its whole duration inside the perceptible range.
      {
        shape: "round",
        size: "sm",
        class: "rounded-[16px] data-pressed:rounded-m3-md active:not-disabled:rounded-m3-sm",
      },
      {
        shape: "round",
        size: "default",
        class: "rounded-[20px] data-pressed:rounded-m3-md active:not-disabled:rounded-m3-sm",
      },
      {
        shape: "round",
        size: "lg",
        class: "rounded-[28px] data-pressed:rounded-m3-lg active:not-disabled:rounded-m3-md",
      },
      // Square: the mirror image — rounded rect at rest, pill when selected.
      {
        shape: "square",
        size: "sm",
        class: "rounded-m3-md data-pressed:rounded-[16px] active:not-disabled:rounded-m3-sm",
      },
      {
        shape: "square",
        size: "default",
        class: "rounded-m3-md data-pressed:rounded-[20px] active:not-disabled:rounded-m3-sm",
      },
      {
        shape: "square",
        size: "lg",
        class: "rounded-m3-lg data-pressed:rounded-[28px] active:not-disabled:rounded-m3-md",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "round",
    },
  },
)
