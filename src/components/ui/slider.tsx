import { useState } from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

/**
 * Material 3 Expressive slider.
 *
 * Kit geometry (Sliders page): five sizes with a thick track and a narrow 4dp
 * handle that squeezes to 2dp while dragged. The active and inactive tracks
 * are separate shapes — outer ends fully round, handle-facing ends 2dp — with
 * a real 6dp gap either side of the handle, so the handle appears to part the
 * track rather than sit on top of it.
 *
 * | Size | Track | Handle |
 * | ---- | ----- | ------ |
 * | xs   | 16    | 44     |
 * | sm   | 24    | 44     |
 * | md   | 40    | 52     |
 * | lg   | 56    | 68     |
 * | xl   | 96    | 108    |
 */

type SliderSize = "xs" | "sm" | "md" | "lg" | "xl"
/** @deprecated `small` / `medium` / `large` map to `xs` / `sm` / `md`. */
type LegacySliderSize = "small" | "medium" | "large"
type SliderVariant = "standard" | "centered"
type SliderProps = SliderPrimitive.Root.Props & {
  getAriaLabel?: SliderPrimitive.Thumb.Props["getAriaLabel"]
  showTicks?: boolean
  showValue?: boolean
  size?: SliderSize | LegacySliderSize
  variant?: SliderVariant
}

const legacySizes: Record<LegacySliderSize, SliderSize> = { small: "xs", medium: "sm", large: "md" }

const trackSize: Record<SliderSize, string> = {
  xs: "data-horizontal:h-4 data-vertical:w-4",
  sm: "data-horizontal:h-6 data-vertical:w-6",
  md: "data-horizontal:h-10 data-vertical:w-10",
  lg: "data-horizontal:h-14 data-vertical:w-14",
  xl: "data-horizontal:h-24 data-vertical:w-24",
}

const handleSize: Record<SliderSize, string> = {
  xs: "data-horizontal:h-11 data-vertical:w-11",
  sm: "data-horizontal:h-11 data-vertical:w-11",
  md: "data-horizontal:h-13 data-vertical:w-13",
  lg: "data-horizontal:h-17 data-vertical:w-17",
  xl: "data-horizontal:h-27 data-vertical:w-27",
}

/** Half the 4dp handle plus the kit's 6dp gap. */
const HANDLE_CLEARANCE = 8

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
  size: sizeProp = "xs",
  step = 1,
  value,
  variant = "standard",
  ...props
}: SliderProps) {
  const size: SliderSize = sizeProp in legacySizes ? legacySizes[sizeProp as LegacySliderSize] : (sizeProp as SliderSize)
  const normalizeValues = (input: number | readonly number[] | undefined) =>
    typeof input === "number" ? [input] : Array.isArray(input) ? [...input] : [min]
  const [uncontrolledValues, setUncontrolledValues] = useState(() => normalizeValues(defaultValue))
  const values = value === undefined ? uncontrolledValues : normalizeValues(value)
  const percentage = (number: number) => ((number - min) / (max - min)) * 100
  const centered = variant === "centered" && values.length === 1
  const currentPercentage = percentage(values[0] ?? min)
  const tickCount = Math.min(100, Math.max(1, Math.floor((max - min) / step)))
  const horizontal = orientation === "horizontal"

  // The track is drawn as segments between the thumbs (and the midpoint for a
  // centered slider) so each one can carry its own corners and clearance.
  type Boundary = { at: number; handle: boolean }
  const boundaries: Boundary[] = [
    { at: 0, handle: false },
    ...values.map((item) => ({ at: percentage(item), handle: true })),
    ...(centered ? [{ at: 50, handle: false }] : []),
    { at: 100, handle: false },
  ].sort((a, b) => a.at - b.at)
  const segments = boundaries.slice(0, -1).map((start, index) => {
    const end = boundaries[index + 1]
    const active = centered
      ? Math.min(start.at, end.at) >= Math.min(50, currentPercentage) && Math.max(start.at, end.at) <= Math.max(50, currentPercentage) && start.at !== end.at
      : values.length > 1
        ? index === 1
        : index === 0
    return { start, end, active }
  })
  const clearance = (boundary: Boundary) => (boundary.handle ? HANDLE_CLEARANCE : 0)
  const segmentStyle = (start: Boundary, end: Boundary) =>
    horizontal
      ? { left: `calc(${start.at}% + ${clearance(start)}px)`, right: `calc(${100 - end.at}% + ${clearance(end)}px)` }
      : { bottom: `calc(${start.at}% + ${clearance(start)}px)`, top: `calc(${100 - end.at}% + ${clearance(end)}px)` }
  // Outer ends are round; ends that face a handle are the kit's 2dp corner.
  const segmentRadius = (start: Boundary, end: Boundary) =>
    cn(
      "rounded-[2px]",
      !start.handle && (horizontal ? "rounded-l-m3-full" : "rounded-b-m3-full"),
      !end.handle && (horizontal ? "rounded-r-m3-full" : "rounded-t-m3-full"),
    )

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
            "relative grow select-none",
            "data-horizontal:w-full data-vertical:h-full",
            trackSize[size],
          )}
        >
          {/* Base UI's indicator is kept for its semantics but painted by the segments below. */}
          <SliderPrimitive.Indicator data-slot="slider-range" className="hidden" />
          {segments.map(({ start, end, active }, index) => (
            <span
              key={index}
              aria-hidden="true"
              data-slot={active ? "slider-active-track" : "slider-inactive-track"}
              className={cn(
                "absolute",
                horizontal ? "inset-y-0" : "inset-x-0",
                active ? "bg-m3-primary" : "bg-m3-secondary-container",
                segmentRadius(start, end),
              )}
              style={segmentStyle(start, end)}
            />
          ))}
          {centered && (
            <span
              aria-hidden="true"
              data-slot="slider-center-stop"
              className={cn("absolute z-10 size-1 -translate-1/2 rounded-full bg-m3-primary", horizontal ? "top-1/2 left-1/2" : "bottom-1/2 left-1/2")}
            />
          )}
          {showTicks && Array.from({ length: tickCount + 1 }, (_, index) => {
            const at = (index / tickCount) * 100
            const onActive = values.length > 1
              ? at >= percentage(values[0]) && at <= percentage(values[1])
              : centered
                ? at >= Math.min(50, currentPercentage) && at <= Math.max(50, currentPercentage)
                : at <= currentPercentage
            return (
              <span
                key={index}
                aria-hidden="true"
                data-slot="slider-stop"
                className={cn("absolute z-10 size-1 -translate-1/2 rounded-full", onActive ? "bg-m3-on-primary" : "bg-m3-primary")}
                style={horizontal
                  ? { left: `${at}%`, top: "50%" }
                  : { bottom: `${at}%`, left: "50%" }}
              />
            )
          })}
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
              "group/slider-thumb relative block shrink-0 cursor-grab rounded-[2px] bg-m3-primary select-none",
              handleSize[size],
              // Expressive squeezes the 4dp handle to 2dp while it is dragged.
              horizontal ? "w-1 active:w-0.5 data-dragging:w-0.5" : "h-1 active:h-0.5 data-dragging:h-0.5",
              "transition-[width,height] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
              // 48dp minimum touch target.
              "after:absolute after:-inset-x-6 after:-inset-y-1",
              "active:cursor-grabbing",
              "outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary",
              "data-disabled:pointer-events-none data-disabled:bg-m3-on-surface/38",
            )}
          >
            {showValue && (
              <span
                data-slot="slider-value"
                className={cn(
                  "pointer-events-none absolute flex h-11 items-center rounded-m3-full bg-m3-inverse-surface px-4 text-m3-label-lg whitespace-nowrap text-m3-inverse-on-surface",
                  horizontal ? "bottom-full left-1/2 mb-1 -translate-x-1/2" : "top-1/2 left-full ml-2 -translate-y-1/2",
                )}
              >
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
