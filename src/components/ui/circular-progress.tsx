"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

type CircularProgressVariant = "flat" | "wavy"
type CircularProgressThickness = 4 | 8

type CircularProgressProps = Omit<
  ProgressPrimitive.Root.Props,
  "children" | "value"
> & {
  disabled?: boolean
  value?: number | null
  variant?: CircularProgressVariant
  thickness?: CircularProgressThickness
}

const TRACK_GAP = 4

// Extracted from the kit's full circular wave vectors: six radial lobes on a
// 20dp centreline, moving 2dp inward and outward. Sixteen line segments per
// lobe keep the SVG silhouette smooth without baking a large Figma path into
// the component.
const WAVE_LOBE_COUNT = 6
const WAVE_RADIUS = 20
const WAVE_AMPLITUDE = 2
const WAVE_SEGMENTS_PER_LOBE = 16

type PathPosition = {
  anglePercent: number
  radius: number
}

function createCirclePath(size: number, radius: number) {
  const center = size / 2

  return [
    `M${center + radius} ${center}`,
    `A${radius} ${radius} 0 1 1 ${center - radius} ${center}`,
    `A${radius} ${radius} 0 1 1 ${center + radius} ${center}`,
    "Z",
  ].join(" ")
}

function createWavyCircleGeometry(size: number) {
  const center = size / 2
  const segmentCount = WAVE_LOBE_COUNT * WAVE_SEGMENTS_PER_LOBE
  const points = Array.from({ length: segmentCount + 1 }, (_, index) => {
    const progress = index / segmentCount
    const angle = progress * Math.PI * 2
    const radius =
      WAVE_RADIUS +
      Math.cos(progress * Math.PI * 2 * WAVE_LOBE_COUNT) * WAVE_AMPLITUDE

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    }
  })
  const segmentLengths = points.slice(1).map((point, index) =>
    Math.hypot(point.x - points[index].x, point.y - points[index].y),
  )
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0)
  const path = `${points
    .map(
      ({ x, y }, index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(3)} ${y.toFixed(3)}`,
    )
    .join(" ")} Z`

  function positionAtPercent(percent: number): PathPosition {
    if (percent >= 100) {
      return { anglePercent: 100, radius: WAVE_RADIUS + WAVE_AMPLITUDE }
    }

    const targetLength = (Math.max(0, percent) / 100) * totalLength
    let traversedLength = 0

    for (const [index, segmentLength] of segmentLengths.entries()) {
      if (traversedLength + segmentLength < targetLength) {
        traversedLength += segmentLength
        continue
      }

      const segmentProgress =
        segmentLength === 0
          ? 0
          : (targetLength - traversedLength) / segmentLength
      const start = points[index]
      const end = points[index + 1]
      const x = start.x + (end.x - start.x) * segmentProgress
      const y = start.y + (end.y - start.y) * segmentProgress

      return {
        anglePercent: ((index + segmentProgress) / segmentCount) * 100,
        radius: Math.hypot(x - center, y - center),
      }
    }

    return { anglePercent: 100, radius: WAVE_RADIUS + WAVE_AMPLITUDE }
  }

  return { path, positionAtPercent }
}

const flatPositionAtPercent = (radius: number, percent: number): PathPosition => ({
  anglePercent: percent,
  radius,
})
const wavy4Geometry = createWavyCircleGeometry(48)
const wavy8Geometry = createWavyCircleGeometry(52)

const geometry = {
  flat: {
    4: {
      className: "size-10",
      indicatorPath: createCirclePath(40, 18),
      positionAtPercent: (percent: number) => flatPositionAtPercent(18, percent),
      size: 40,
      trackRadius: 18,
    },
    8: {
      className: "size-11",
      indicatorPath: createCirclePath(44, 18),
      positionAtPercent: (percent: number) => flatPositionAtPercent(18, percent),
      size: 44,
      trackRadius: 18,
    },
  },
  wavy: {
    4: {
      className: "size-12",
      indicatorPath: wavy4Geometry.path,
      positionAtPercent: wavy4Geometry.positionAtPercent,
      size: 48,
      trackRadius: 22,
    },
    8: {
      className: "size-13",
      indicatorPath: wavy8Geometry.path,
      positionAtPercent: wavy8Geometry.positionAtPercent,
      size: 52,
      trackRadius: 22,
    },
  },
} as const

function getGapPercent(
  indicatorRadius: number,
  trackRadius: number,
  thickness: CircularProgressThickness,
) {
  const centerDistance = TRACK_GAP + thickness
  const cosine =
    (indicatorRadius ** 2 + trackRadius ** 2 - centerDistance ** 2) /
    (2 * indicatorRadius * trackRadius)

  return (Math.acos(Math.min(1, Math.max(-1, cosine))) / (Math.PI * 2)) * 100
}

/**
 * Material 3 circular progress.
 *
 * Omit `value` (or pass `null`) for indeterminate progress. Determinate values
 * are normalized between `min` and `max`, with Base UI supplying the native
 * progressbar semantics. Give every indicator an accessible name with
 * `aria-label` or `aria-labelledby`.
 *
 * The flat and Expressive wavy variants use the kit's 40/44dp and 48/52dp
 * geometries for 4dp and 8dp strokes, respectively.
 */
function CircularProgress({
  className,
  value = null,
  min = 0,
  max = 100,
  variant = "flat",
  thickness = 4,
  disabled = false,
  ...props
}: CircularProgressProps) {
  const selectedGeometry = geometry[variant][thickness]
  const percent =
    typeof value === "number" && max > min
      ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
      : null
  // A round cap extends half a stroke beyond each path endpoint. The angular
  // offsets preserve a 4dp straight-line gap between the two cap edges, even
  // when a wavy endpoint sits inside or outside the track radius.
  const indicatorEnd =
    percent === null ? null : selectedGeometry.positionAtPercent(percent)
  const trackStartGap =
    indicatorEnd === null
      ? 0
      : getGapPercent(
          indicatorEnd.radius,
          selectedGeometry.trackRadius,
          thickness,
        )
  const indicatorStart = selectedGeometry.positionAtPercent(0)
  const trackEndGap = getGapPercent(
    indicatorStart.radius,
    selectedGeometry.trackRadius,
    thickness,
  )
  const visibleTrack =
    percent === null || percent <= 0
      ? 100
      : Math.max(
          0,
          100 -
            indicatorEnd!.anglePercent -
            trackStartGap -
            trackEndGap,
        )
  const trackOffset =
    percent === null || percent <= 0
      ? 0
      : -(indicatorEnd!.anglePercent + trackStartGap)

  return (
    <ProgressPrimitive.Root
      data-slot="circular-progress"
      value={value}
      min={min}
      max={max}
      data-variant={variant}
      data-thickness={thickness}
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "inline-flex shrink-0",
        selectedGeometry.className,
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="size-full -rotate-90 overflow-visible"
        viewBox={`0 0 ${selectedGeometry.size} ${selectedGeometry.size}`}
      >
        <circle
          data-slot="circular-progress-track"
          className={cn(
            "m3-circular-progress-track-transition stroke-m3-secondary-container",
            disabled && "stroke-m3-on-surface/12",
          )}
          cx={selectedGeometry.size / 2}
          cy={selectedGeometry.size / 2}
          fill="none"
          pathLength="100"
          r={selectedGeometry.trackRadius}
          strokeDasharray={`${visibleTrack} ${100 - visibleTrack}`}
          strokeDashoffset={trackOffset}
          strokeLinecap="round"
          strokeWidth={thickness}
        />
        {percent === null || percent > 0 ? (
          <path
            data-slot="circular-progress-indicator"
            className={cn(
              "stroke-m3-primary transition-[stroke-dasharray] duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default)",
              disabled && "stroke-m3-on-surface/38",
              percent === null && "m3-circular-progress-indeterminate",
            )}
            d={selectedGeometry.indicatorPath}
            fill="none"
            pathLength="100"
            strokeDasharray={
              percent === null ? "25 75" : `${percent} ${100 - percent}`
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={thickness}
          />
        ) : null}
      </svg>
    </ProgressPrimitive.Root>
  )
}

export { CircularProgress }
export type {
  CircularProgressProps,
  CircularProgressThickness,
  CircularProgressVariant,
}
