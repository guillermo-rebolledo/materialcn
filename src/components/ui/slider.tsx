import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

/**
 * Material 3 Expressive slider.
 *
 * The Expressive redesign made the slider thick — a 16dp track — and swapped
 * the round thumb for a narrow 4dp pill that reads as a *handle* being dragged
 * along a groove rather than a bead on a wire. Active and inactive halves are
 * separately rounded and separated by a gap, so the handle appears to part the
 * track rather than sit on top of it.
 */

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden rounded-m3-full bg-m3-secondary-container select-none",
            "data-horizontal:h-4 data-horizontal:w-full data-vertical:h-full data-vertical:w-4",
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              "rounded-m3-full bg-m3-primary select-none",
              "data-horizontal:h-full data-vertical:w-full",
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              "relative block h-11 w-1 shrink-0 cursor-grab rounded-m3-full bg-m3-primary select-none",
              // The 4dp gap that makes the handle look like it is parting the
              // track rather than lying on it. It is painted as a ring in the
              // surface color, so a slider on a non-surface background should
              // override `ring-m3-*` to match its own container.
              "ring-4 ring-m3-surface",
              "transition-[width,height] duration-(--m3-spring-spatial-fast-duration) ease-(--m3-spring-spatial-fast)",
              "after:absolute after:-inset-3",
              // Expressive squeezes the handle narrower while it is dragged.
              "active:w-0.5 active:cursor-grabbing",
              "outline-none focus-visible:ring-m3-primary data-dragging:w-0.5",
              "data-disabled:pointer-events-none data-disabled:bg-m3-on-surface/38",
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
