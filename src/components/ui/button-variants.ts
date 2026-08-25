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
 * Material 3 Expressive button.
 *
 * Three things make it read as Material rather than as a generic pill:
 *
 * 1. **Shape.** Fully rounded at rest; on press the corners tighten to the
 *    medium step. That morph is the Expressive signature, and it rides a
 *    spatial spring so it overshoots slightly before settling.
 * 2. **State layer.** Hover/focus/press are a translucent wash of the *content*
 *    color over the container (`::after` at 8% / 10% / 10%), not a different
 *    background per state. One mechanism, every variant.
 * 3. **Size scale.** M3 Expressive defines five heights — 32 / 40 / 56 / 96 /
 *    136 — each with its own type role and padding, rather than one height
 *    scaled up.
 *
 * shadcn's variant names are kept so registry markup keeps working; `elevated`
 * and `tonal` are additions for the Material variants shadcn has no name for.
 */
export const buttonVariants = cva(
  [
    "group/button relative isolate inline-flex shrink-0 items-center justify-center",
    "border border-transparent font-m3-medium whitespace-nowrap",
    "outline-none select-none",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    // M3 expresses disabled as opacity on content and container, not a grey fill.
    // Only `outline` paints a border, and the kit keeps it at outline-variant
    // when disabled, so no border override is needed here.
    "disabled:text-m3-on-surface/38",
    // Shape morph: the pressed corner radius is set per size below.
    //
    // This deliberately uses the *effects* spring, not the spatial one. Spatial
    // springs overshoot by ~9%, and an overshoot on border-radius interpolates
    // past the target into negative values, which CSS clamps to 0 — the button
    // flicks through a hard-cornered rectangle on the way down.
    "transition-[border-radius,box-shadow,background-color,color]",
    "duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default)",
    // State layer. It must cover the *border* box, not the padding box:
    // `inset-0` would size it to the padding box while `rounded-[inherit]`
    // gives it the border-box radius, so the corners would not line up. Every
    // variant carries a 1px border (transparent unless `outline`), which is
    // why -1px is exact. A negative z-index paints it above the element's own
    // border — that is correct for Material, where the state layer washes the
    // whole container shape including its outline.
    "after:pointer-events-none after:absolute after:-inset-px after:-z-10",
    "after:rounded-[inherit] after:bg-current after:opacity-0",
    "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration)",
    "after:ease-(--m3-spring-effects-fast)",
    "hover:not-disabled:after:opacity-8 focus-visible:after:opacity-10",
    "active:not-disabled:after:opacity-10",
    // Focus ring, per M3: a 3px outline offset from the container.
    "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-2",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-m3-primary text-m3-on-primary disabled:bg-m3-on-surface/10",
        tonal:
          "bg-m3-secondary-container text-m3-on-secondary-container disabled:bg-m3-on-surface/10",
        // shadcn's `secondary` is Material's tonal button.
        secondary:
          "bg-m3-secondary-container text-m3-on-secondary-container disabled:bg-m3-on-surface/10",
        elevated:
          "bg-m3-surface-container-low text-m3-primary shadow-m3-1 disabled:bg-m3-on-surface/10 disabled:shadow-m3-0",
        outline:
          "border-m3-outline-variant text-m3-on-surface-variant bg-transparent",
        ghost: "text-m3-primary bg-transparent",
        destructive: "bg-m3-error text-m3-on-error disabled:bg-m3-on-surface/10",
        link: "text-m3-primary bg-transparent underline-offset-4 hover:underline after:hidden",
      },
      size: {
        // Pressed radii are the kit's, not a guess: round buttons squeeze to
        // 8 / 8 / 12 / 16 / 16 across the five sizes. See docs/m3-specs.md.
        //
        // The resting radius is written as half the height rather than as
        // `rounded-m3-full`, because `full` is 9999px and interpolating from
        // there spends the whole transition far outside the range a viewer can
        // perceive — a pill looks identical at any radius past half the height.
        //
        // Padding is symmetric whether or not a leading icon is present: the
        // Expressive kit has no icon-side reduction, so there is no
        // `has-[>svg]:pl-*` here. Per size the kit gives 12 / 16 / 24 / 48 / 64
        // horizontal padding and 4 / 8 / 8 / 12 / 16 gap.
        xs: [
          "h-8 gap-1 rounded-[16px] px-3 text-m3-label-lg active:not-disabled:rounded-m3-sm",
          "[&_svg:not([class*='size-'])]:size-5",
        ],
        sm: [
          "h-10 gap-2 rounded-[20px] px-4 text-m3-label-lg active:not-disabled:rounded-m3-sm",
          "[&_svg:not([class*='size-'])]:size-5",
        ],
        // shadcn's baseline. M3's small button, which is the everyday size.
        default: [
          "h-10 gap-2 rounded-[20px] px-4 text-m3-label-lg active:not-disabled:rounded-m3-sm",
          "[&_svg:not([class*='size-'])]:size-5",
        ],
        lg: [
          "h-14 gap-2 rounded-[28px] px-6 text-m3-title-md active:not-disabled:rounded-m3-md",
          "[&_svg:not([class*='size-'])]:size-6",
        ],
        // The two headline sizes set their label in Regular, not Medium.
        xl: [
          "h-24 gap-3 rounded-[48px] px-12 text-m3-headline-sm font-m3-regular active:not-disabled:rounded-m3-lg",
          "[&_svg:not([class*='size-'])]:size-8",
        ],
        "2xl": [
          "h-34 gap-4 rounded-[68px] px-16 text-m3-headline-lg font-m3-regular active:not-disabled:rounded-m3-lg",
          "[&_svg:not([class*='size-'])]:size-10",
        ],
        icon: "size-10 rounded-[20px] active:not-disabled:rounded-m3-sm [&_svg:not([class*='size-'])]:size-6",
        "icon-xs":
          "size-8 rounded-[16px] active:not-disabled:rounded-m3-sm [&_svg:not([class*='size-'])]:size-5",
        "icon-sm":
          "size-10 rounded-[20px] active:not-disabled:rounded-m3-sm [&_svg:not([class*='size-'])]:size-6",
        "icon-lg":
          "size-14 rounded-[28px] active:not-disabled:rounded-m3-md [&_svg:not([class*='size-'])]:size-6",
      },
      /** Square buttons keep the size scale but start from a rounded rect. */
      shape: {
        round: "",
        square: "",
      },
    },
    compoundVariants: [
      // Text (`ghost`) buttons share the contained padding in the Expressive
      // kit, so only `link` — an inline affordance, not a kit component —
      // drops its padding.
      { variant: "link", size: "xs", class: "px-0" },
      { variant: "link", size: "sm", class: "px-0" },
      { variant: "link", size: "default", class: "px-0" },
      { variant: "link", size: "lg", class: "px-0" },
      { variant: "link", size: "xl", class: "px-0" },
      { variant: "link", size: "2xl", class: "px-0" },

      { shape: "square", size: "xs", class: "rounded-m3-md active:not-disabled:rounded-m3-sm" },
      { shape: "square", size: "sm", class: "rounded-m3-md active:not-disabled:rounded-m3-sm" },
      { shape: "square", size: "default", class: "rounded-m3-md active:not-disabled:rounded-m3-sm" },
      { shape: "square", size: "lg", class: "rounded-m3-lg active:not-disabled:rounded-m3-md" },
      { shape: "square", size: "xl", class: "rounded-m3-xl active:not-disabled:rounded-m3-lg" },
      { shape: "square", size: "2xl", class: "rounded-m3-xl active:not-disabled:rounded-m3-lg" },
      { shape: "square", size: "icon", class: "rounded-m3-md active:not-disabled:rounded-m3-sm" },
      { shape: "square", size: "icon-xs", class: "rounded-m3-md active:not-disabled:rounded-m3-sm" },
      { shape: "square", size: "icon-sm", class: "rounded-m3-md active:not-disabled:rounded-m3-sm" },
      { shape: "square", size: "icon-lg", class: "rounded-m3-lg active:not-disabled:rounded-m3-md" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "round",
    },
  },
)
