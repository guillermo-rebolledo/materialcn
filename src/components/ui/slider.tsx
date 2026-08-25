import { useState } from "react"
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

type SliderSize = "small" | "medium" | "large"
type SliderVariant = "standard" | "centered"
type SliderProps = SliderPrimitive.Root.Props & {
  getAriaLabel?: SliderPrimitive.Thumb.Props["getAriaLabel"]
  showTicks?: boolean
  showValue?: boolean
  size?: SliderSize
  variant?: SliderVariant
}

function Slider({
  "aria-label": ariaLabel,
  className,
  defaultValue,
  getAriaLabel,
  max = 100,
  min = 0,
  onValueChange,
  orientation = "horizontal",
  showTicks = false,
  showValue = false,
  size = "large",
  step = 1,
  value,
  variant = "standard",
  ...props
}: SliderProps) {
  const normalizeValues = (input: number | readonly number[] | undefined) =>
    typeof input === "number" ? [input] : Array.isArray(input) ? [...input] : [min]
  const [uncontrolledValues, setUncontrolledValues] = useState(() => normalizeValues(defaultValue))
  const values = value === undefined ? uncontrolledValues : normalizeValues(value)
  const percentage = (number: number) => ((number - min) / (max - min)) * 100
  const centered = variant === "centered" && values.length === 1
  const currentPercentage = percentage(values[0] ?? min)
  const centerStart = Math.min(50, currentPercentage)
  const centerSize = Math.abs(currentPercentage - 50)
  const tickCount = Math.min(100, Math.max(1, Math.floor((max - min) / step)))

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      aria-label={ariaLabel}
      data-slot="slider"
      data-size={size}
      data-variant={variant}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      thumbAlignment="edge"
      onValueChange={(nextValue, eventDetails) => {
        if (value === undefined) setUncontrolledValues(normalizeValues(nextValue))
        onValueChange?.(nextValue, eventDetails)
      }}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden rounded-m3-full bg-m3-secondary-container select-none",
            "data-horizontal:w-full data-vertical:h-full",
            size === "small" && "data-horizontal:h-1 data-vertical:w-1",
            size === "medium" && "data-horizontal:h-2 data-vertical:w-2",
            size === "large" && "data-horizontal:h-4 data-vertical:w-4",
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              "rounded-m3-full bg-m3-primary select-none",
              "data-horizontal:h-full data-vertical:w-full",
              centered && "hidden",
            )}
          />
          {centered && (
            <span
              data-slot="slider-centered-range"
              className={cn(
                "absolute rounded-m3-full bg-m3-primary",
                orientation === "horizontal" ? "inset-y-0" : "inset-x-0",
              )}
              style={orientation === "horizontal"
                ? { left: `${centerStart}%`, width: `${centerSize}%` }
                : { bottom: `${centerStart}%`, height: `${centerSize}%` }}
            />
          )}
          {centered && <span aria-hidden="true" className={cn("absolute z-10 size-1 -translate-1/2 rounded-full bg-m3-on-secondary-container", orientation === "horizontal" ? "top-1/2 left-1/2" : "bottom-1/2 left-1/2")} />}
          {showTicks && Array.from({ length: tickCount + 1 }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="absolute z-10 size-1 -translate-1/2 rounded-full bg-m3-on-secondary-container/60"
              style={orientation === "horizontal"
                ? { left: `${(index / tickCount) * 100}%`, top: "50%" }
                : { bottom: `${(index / tickCount) * 100}%`, left: "50%" }}
            />
          ))}
        </SliderPrimitive.Track>
        {Array.from({ length: values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            getAriaLabel={getAriaLabel ?? (ariaLabel
              ? (thumbIndex) => values.length > 1
                ? `${ariaLabel} ${thumbIndex === 0 ? "minimum" : "maximum"}`
                : ariaLabel
              : undefined)}
            className={cn(
              "relative block shrink-0 cursor-grab rounded-m3-full bg-m3-primary select-none",
              orientation === "horizontal" && "w-1 active:w-0.5 data-dragging:w-0.5",
              orientation === "vertical" && "h-1 active:h-0.5 data-dragging:h-0.5",
              orientation === "horizontal" && size === "small" && "h-8",
              orientation === "horizontal" && size === "medium" && "h-10",
              orientation === "horizontal" && size === "large" && "h-11",
              orientation === "vertical" && size === "small" && "w-8",
              orientation === "vertical" && size === "medium" && "w-10",
              orientation === "vertical" && size === "large" && "w-11",
              // The 4dp gap that makes the handle look like it is parting the
              // track rather than lying on it. It is painted as a ring in the
              // surface color, so a slider on a non-surface background should
              // override `ring-m3-*` to match its own container.
              "ring-4 ring-m3-surface",
              "transition-[width,height] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
              "after:absolute after:-inset-3",
              // Expressive squeezes the handle narrower while it is dragged.
              "active:cursor-grabbing",
              "outline-none focus-visible:ring-m3-primary",
              "data-disabled:pointer-events-none data-disabled:bg-m3-on-surface/38",
            )}
          >
            {showValue && (
              <span className={cn(
                "pointer-events-none absolute rounded-m3-xs bg-m3-inverse-surface px-2 py-1 text-m3-label-sm text-m3-inverse-on-surface",
                orientation === "horizontal" ? "bottom-full left-1/2 mb-2 -translate-x-1/2" : "bottom-auto left-full ml-2",
              )}>
                {values[index]}
              </span>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider, type SliderProps, type SliderSize, type SliderVariant }
