import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

type ToggleGroupOptions = VariantProps<typeof toggleVariants> & {
  /**
   * Space between items in dp. The kit's connected group uses 2; `0` turns
   * the group into a segmented button, whose segments share one outline.
   */
  spacing?: number
  orientation?: "horizontal" | "vertical"
}

const ToggleGroupContext = React.createContext<ToggleGroupOptions>({
  size: "default",
  variant: "default",
  shape: "round",
  spacing: 2,
  orientation: "horizontal",
})

/**
 * Base UI's ToggleGroup announces its axis as `data-orientation="horizontal"`
 * or `"vertical"` — there is no bare `data-vertical` attribute — so every
 * axis-dependent style below keys off `data-[orientation=…]`.
 */
function ToggleGroup({
  className,
  variant,
  size,
  shape,
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props & ToggleGroupOptions) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-spacing={spacing}
      orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[calc(var(--gap)*1px)] rounded-m3-full",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, shape, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

/**
 * Segmented-button styling for `spacing={0}`.
 *
 * The kit's segmented button is a different component from the toggle: it
 * keeps the secondary-container pair when selected (not the toggle's primary),
 * has no shape morph, shares a single `outline` stroke between segments, pads
 * each segment 12dp, and shows an 18dp check in front of the selected label.
 *
 * The corner classes carry both group variants so they outrank the
 * `active:not-disabled:` radius override on the first and last segment.
 */
const segmentClasses = [
  "rounded-none border-m3-outline bg-transparent px-3 text-m3-on-surface",
  "data-pressed:rounded-none data-pressed:border-m3-outline",
  "data-pressed:bg-m3-secondary-container data-pressed:text-m3-on-secondary-container",
  "active:not-disabled:rounded-none",
  // Shared stroke: every segment after the first drops its leading edge.
  "group-data-[orientation=horizontal]/toggle-group:not-first:border-l-0",
  "group-data-[orientation=vertical]/toggle-group:not-first:border-t-0",
  // Outer corners follow the group's pill.
  "group-data-[orientation=horizontal]/toggle-group:group-data-[spacing=0]/toggle-group:first:rounded-l-m3-full",
  "group-data-[orientation=horizontal]/toggle-group:group-data-[spacing=0]/toggle-group:last:rounded-r-m3-full",
  "group-data-[orientation=vertical]/toggle-group:group-data-[spacing=0]/toggle-group:first:rounded-t-m3-full",
  "group-data-[orientation=vertical]/toggle-group:group-data-[spacing=0]/toggle-group:last:rounded-b-m3-full",
]

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  shape = "round",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  const segmented = context.spacing === 0
  const resolved = {
    variant: context.variant || variant,
    size: context.size || size,
    shape: context.shape || shape,
  }

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={resolved.variant}
      data-size={resolved.size}
      data-shape={resolved.shape}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 focus:z-10 focus-visible:z-10",
        toggleVariants(resolved),
        segmented && segmentClasses,
        className,
      )}
      {...props}
    >
      {segmented && (
        <CheckIcon
          aria-hidden
          data-slot="toggle-group-item-check"
          className="hidden size-4.5 group-data-pressed/toggle:block"
        />
      )}
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
