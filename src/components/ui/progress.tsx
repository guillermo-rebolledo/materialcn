"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

type ProgressVariant = "flat" | "wavy"

type ProgressContextValue = {
  variant: ProgressVariant
  /** 0–100, or null while indeterminate. */
  percent: number | null
}

const ProgressContext = React.createContext<ProgressContextValue>({
  variant: "flat",
  percent: null,
})

/**
 * Material 3 linear progress.
 *
 * `flat` is the classic 4dp bar. `wavy` is the Expressive one: the active
 * indicator is a travelling sine wave — 40dp wavelength, 6dp peak-to-peak
 * inside a 12dp box, matching the kit's `wave-increment` geometry. The wave
 * is a repeating mask rather than an inline path, so it tiles to any width at
 * no DOM cost and still takes its colour from the theme.
 *
 * Both variants keep the M3 details that make the bar read as Material: a gap
 * between the active indicator and the remaining track, and a stop dot marking
 * the full value.
 */
function Progress({
  className,
  children,
  value,
  min = 0,
  max = 100,
  variant = "flat",
  ...props
}: ProgressPrimitive.Root.Props & { variant?: ProgressVariant }) {
  // The wavy track has to know where the indicator ends, because — unlike the
  // flat bar, which the indicator simply paints over — a sine leaves gaps that
  // a full-width rule would show through.
  const percent =
    typeof value === "number" && max > min
      ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
      : null

  const context = React.useMemo(
    () => ({ variant, percent }),
    [variant, percent],
  )

  return (
    <ProgressContext value={context}>
      <ProgressPrimitive.Root
        value={value}
        min={min}
        max={max}
        data-slot="progress"
        data-variant={variant}
        className={cn("flex flex-wrap gap-3", className)}
        {...props}
      >
        {children}
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </ProgressPrimitive.Root>
    </ProgressContext>
  )
}

function ProgressTrack({
  className,
  style,
  ...props
}: ProgressPrimitive.Track.Props) {
  const { variant, percent } = React.use(ProgressContext)

  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      data-variant={variant}
      style={{
        ...({
          "--m3-progress": percent === null ? "0%" : `${percent}%`,
        } as React.CSSProperties),
        ...style,
      }}
      className={cn(
        "relative flex w-full items-center",
        // The stop dot marking the end of the track.
        "after:absolute after:right-0 after:size-1 after:rounded-m3-full after:bg-m3-primary",
        // Flat: the track *is* the 4dp bar.
        variant === "flat" &&
          "h-1 rounded-m3-full bg-m3-secondary-container",
        // Wavy: the box is 12dp tall to hold the wave, so the inactive track is
        // drawn as a centred 4dp rule instead of as the container itself.
        variant === "wavy" && [
          "h-3",
          // Starts where the indicator ends (plus the 4dp gap), so the rule
          // never shows through the troughs of the wave.
          "before:absolute before:top-1/2 before:right-0 before:h-1 before:-translate-y-1/2",
          "before:left-[calc(var(--m3-progress)+4px)]",
          "before:rounded-m3-full before:bg-m3-secondary-container",
        ],
        className,
      )}
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  const { variant } = React.use(ProgressContext)

  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      data-variant={variant}
      className={cn(
        "h-full",
        // The gap between the active indicator and the remaining track is
        // painted in the surface color, so a progress bar on a different
        // container should override `shadow-*` to match it.
        "shadow-[4px_0_0_0_var(--m3-surface)]",
        "transition-all duration-(--m3-spring-spatial-default-duration) ease-(--m3-spring-spatial-default)",
        variant === "flat" && "rounded-m3-full bg-m3-primary",
        // `relative` lifts the wave above the track rule drawn by ::before.
        variant === "wavy" && "m3-wave relative bg-m3-primary",
        className,
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-m3-label-lg text-m3-on-surface", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-m3-label-lg text-m3-on-surface-variant tabular-nums",
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
