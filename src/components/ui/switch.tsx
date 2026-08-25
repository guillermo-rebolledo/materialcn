"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

/**
 * Material 3 switch.
 *
 * Material's switch is much larger than the shadcn default — a 52×32 track with
 * a handle that *grows* from 16dp to 24dp as it travels, and to 28dp while
 * pressed. That size change is the affordance: the handle looks like it is
 * being squashed under a finger. It rides a spatial spring, so it overshoots
 * the far edge slightly before settling.
 *
 * The unselected track carries a 2dp outline; the selected one does not, which
 * is what keeps the "off" state from reading as a filled control.
 */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-m3-full outline-none",
        "transition-colors duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default)",
        // Expand the hit target without changing the painted size.
        "after:absolute after:-inset-x-2 after:-inset-y-2",
        "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-2",
        "data-[size=default]:h-8 data-[size=default]:w-13",
        "data-[size=sm]:h-6 data-[size=sm]:w-10",
        "data-checked:bg-m3-primary",
        "data-unchecked:bg-m3-surface-container-highest data-unchecked:border-2 data-unchecked:border-m3-outline",
        "data-disabled:cursor-not-allowed",
        "data-disabled:data-checked:bg-m3-on-surface/12",
        "data-disabled:data-unchecked:bg-m3-surface-container-highest/12 data-disabled:data-unchecked:border-m3-on-surface/12",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none relative block rounded-m3-full",
          // Only the travel is spatial; width, height and colour are clamped
          // properties and ride the effects spring.
          "[transition:translate_var(--m3-spring-spatial-fast-duration)_var(--m3-spring-spatial-fast),width_var(--m3-spring-effects-fast-duration)_var(--m3-spring-effects-fast),height_var(--m3-spring-effects-fast-duration)_var(--m3-spring-effects-fast),background-color_var(--m3-spring-effects-fast-duration)_var(--m3-spring-effects-fast)]",
          "motion-reduce:transition-none",
          // 40dp state layer centred on the handle (8 / 10 / 10 %).
          "before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:size-10 before:-translate-1/2 before:rounded-full before:opacity-0",
          "before:transition-opacity before:duration-(--m3-spring-effects-fast-duration) before:ease-(--m3-spring-effects-fast)",
          "data-unchecked:before:bg-m3-on-surface data-checked:before:bg-m3-primary",
          "group-hover/switch:before:opacity-8 group-focus-visible/switch:before:opacity-10 group-active/switch:before:opacity-10",
          "group-data-disabled/switch:before:opacity-0",
          // Unselected: a small dot in the outline color, inset from the track.
          // Interacting darkens it to On Surface Variant.
          "data-unchecked:bg-m3-outline",
          "group-hover/switch:data-unchecked:bg-m3-on-surface-variant group-focus-visible/switch:data-unchecked:bg-m3-on-surface-variant group-active/switch:data-unchecked:bg-m3-on-surface-variant",
          "group-data-[size=default]/switch:data-unchecked:size-4 group-data-[size=default]/switch:data-unchecked:translate-x-1.5",
          "group-data-[size=sm]/switch:data-unchecked:size-3 group-data-[size=sm]/switch:data-unchecked:translate-x-1",
          // Selected: grows and travels to the far end; interacting tints the
          // handle to Primary Container.
          "data-checked:bg-m3-on-primary",
          "group-hover/switch:data-checked:bg-m3-primary-container group-focus-visible/switch:data-checked:bg-m3-primary-container group-active/switch:data-checked:bg-m3-primary-container",
          "group-data-[size=default]/switch:data-checked:size-6 group-data-[size=default]/switch:data-checked:translate-x-6",
          "group-data-[size=sm]/switch:data-checked:size-5 group-data-[size=sm]/switch:data-checked:translate-x-4.5",
          // Pressed: the handle swells under the finger.
          "group-active/switch:group-data-[size=default]/switch:size-7",
          "group-active/switch:group-data-[size=default]/switch:data-checked:translate-x-5.5",
          "group-active/switch:group-data-[size=default]/switch:data-unchecked:translate-x-0.5",
          "group-data-disabled/switch:data-checked:bg-m3-surface",
          "group-data-disabled/switch:data-unchecked:bg-m3-on-surface/38",
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
