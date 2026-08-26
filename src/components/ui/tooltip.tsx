import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

/**
 * How long a pointer must rest on a trigger before its tooltip opens.
 *
 * Material does not specify a value, so this is the library's. 500ms sits
 * between the two failure modes: a pointer crossing a dense icon row is over
 * any one target for well under 200ms, so a shorter delay fires every tooltip
 * it passes and the toolbar flickers; past roughly 700ms a deliberate hover
 * starts to feel like nothing is going to happen.
 *
 * It applies to hover only. Focus opens immediately — the delay exists to
 * filter out pointer movement that was never aimed at the trigger, and moving
 * focus to something is never accidental in that way.
 */
const TOOLTIP_OPEN_DELAY = 500

/**
 * Wrap the app once. Besides supplying the delay, the provider is what makes a
 * tooltip that is already open hand over to the next trigger instantly, so
 * reading along a row of icons costs the delay once rather than per icon.
 */
function TooltipProvider({
  delay = TOOLTIP_OPEN_DELAY,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/**
 * `delay` is deliberately not defaulted here. A value on the trigger wins over
 * the provider's, so defaulting it would silence the provider for every tooltip
 * in the app and leave the grouping with nothing to group. Pass one only to
 * override a single instance.
 */
function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-(--m3-z-tooltip)"
      >
        <TooltipPrimitive.Popup
          role="tooltip"
          data-slot="tooltip-content"
          className={cn(
            "w-fit max-w-56 rounded-m3-xs bg-m3-inverse-surface px-2 py-1 text-m3-body-sm text-m3-inverse-on-surface",
            className
          )}
          {...props}
        >
          {/* The kit's plain tooltip has no caret. */}
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export {
  TOOLTIP_OPEN_DELAY,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}
