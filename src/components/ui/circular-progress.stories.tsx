import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { CircularProgress } from "./circular-progress"

const meta = {
  title: "Components/CircularProgress",
  component: CircularProgress,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["flat", "wavy"],
    },
    thickness: {
      control: "inline-radio",
      options: [4, 8],
    },
  },
} satisfies Meta<typeof CircularProgress>

export default meta
type Story = StoryObj<typeof meta>

function getVisibleGap(
  progress: HTMLElement,
  value: number,
  thickness: number,
) {
  const indicator = progress.querySelector<SVGPathElement>(
    '[data-slot="circular-progress-indicator"]',
  )!
  const track = progress.querySelector<SVGCircleElement>(
    '[data-slot="circular-progress-track"]',
  )!
  const center = track.cx.baseVal.value
  const indicatorEnd = indicator.getPointAtLength(
    indicator.getTotalLength() * (value / 100),
  )
  const trackStartPercent =
    ((-Number(track.getAttribute("stroke-dashoffset")) % 100) + 100) % 100
  const trackStartAngle = (trackStartPercent / 100) * Math.PI * 2
  const trackStart = {
    x: center + Math.cos(trackStartAngle) * track.r.baseVal.value,
    y: center + Math.sin(trackStartAngle) * track.r.baseVal.value,
  }

  return (
    Math.hypot(
      trackStart.x - indicatorEnd.x,
      trackStart.y - indicatorEnd.y,
    ) - thickness
  )
}

/** Determinate progress exposes its current value with the default 40dp geometry. */
export const Determinate: Story = {
  render: () => <CircularProgress aria-label="Upload progress" value={25} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const progress = canvas.getByRole("progressbar", { name: "Upload progress" })

    await expect(progress).toHaveAttribute("aria-valuemin", "0")
    await expect(progress).toHaveAttribute("aria-valuemax", "100")
    await expect(progress).toHaveAttribute("aria-valuenow", "25")
    await expect(progress.getBoundingClientRect().width).toBe(40)
    await expect(progress.getBoundingClientRect().height).toBe(40)

    await expect(getVisibleGap(progress, 25, 4)).toBeCloseTo(4, 1)
  },
}

const geometries = [
  { variant: "flat", thickness: 4, size: 40 },
  { variant: "flat", thickness: 8, size: 44 },
  { variant: "wavy", thickness: 4, size: 48 },
  { variant: "wavy", thickness: 8, size: 52 },
] as const

/** Flat and Expressive wavy forms use the four geometries defined by the kit. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {geometries.map(({ variant, thickness }) => (
        <CircularProgress
          key={`${variant}-${thickness}`}
          aria-label={`${variant} ${thickness}dp progress`}
          data-testid={`${variant}-${thickness}`}
          thickness={thickness}
          value={60}
          variant={variant}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const { variant, thickness, size } of geometries) {
      const progress = canvas.getByTestId(`${variant}-${thickness}`)

      await expect(progress).toHaveAttribute("data-variant", variant)
      await expect(progress).toHaveAttribute("data-thickness", String(thickness))
      await expect(progress.getBoundingClientRect().width).toBe(size)
      await expect(progress.getBoundingClientRect().height).toBe(size)
      await expect(getVisibleGap(progress, 60, thickness)).toBeCloseTo(4, 1)
    }
  },
}

/** Without a value, the indicator communicates ongoing work without inventing a number. */
export const Indeterminate: Story = {
  parameters: { sideBySide: true },
  render: () => <CircularProgress aria-label="Loading workspace" variant="wavy" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const progressbars = canvas.getAllByRole("progressbar", {
      name: "Loading workspace",
    })

    for (const progress of progressbars) {
      const indicator = progress.querySelector(
        '[data-slot="circular-progress-indicator"]',
      )

      await expect(progress).not.toHaveAttribute("aria-valuenow")
      await expect(indicator).toBeInTheDocument()
      await expect(getComputedStyle(indicator!).animationName).not.toBe("none")
    }
  },
}

/** Indicators retain their token roles on surfaces and use disabled content roles when inactive. */
export const SurfaceContexts: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <svg aria-hidden="true" className="absolute size-0 overflow-hidden">
        <path className="stroke-m3-primary" data-testid="role-primary" />
        <path
          className="stroke-m3-secondary-container"
          data-testid="role-secondary-container"
        />
        <path
          className="stroke-m3-on-surface/38"
          data-testid="role-disabled-indicator"
        />
        <path
          className="stroke-m3-on-surface/12"
          data-testid="role-disabled-track"
        />
      </svg>
      <Card className="w-48">
        <CardHeader>
          <CardTitle>Syncing</CardTitle>
        </CardHeader>
        <CardContent>
          <CircularProgress aria-label="Sync progress" value={70} />
        </CardContent>
      </Card>
      <Card className="w-48" variant="filled">
        <CardHeader>
          <CardTitle>Paused</CardTitle>
        </CardHeader>
        <CardContent>
          <CircularProgress
            aria-label="Paused progress"
            disabled
            value={70}
            variant="wavy"
          />
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const enabled = canvas.getAllByRole("progressbar", { name: "Sync progress" })
    const disabled = canvas.getAllByRole("progressbar", {
      name: "Paused progress",
    })
    const primaryRoles = canvas.getAllByTestId("role-primary")
    const secondaryContainerRoles = canvas.getAllByTestId(
      "role-secondary-container",
    )
    const disabledIndicatorRoles = canvas.getAllByTestId(
      "role-disabled-indicator",
    )
    const disabledTrackRoles = canvas.getAllByTestId("role-disabled-track")

    for (const index of [0, 1]) {
      const enabledIndicator = enabled[index].querySelector(
        '[data-slot="circular-progress-indicator"]',
      )!
      const enabledTrack = enabled[index].querySelector(
        '[data-slot="circular-progress-track"]',
      )!
      const disabledIndicator = disabled[index].querySelector(
        '[data-slot="circular-progress-indicator"]',
      )!
      const disabledTrack = disabled[index].querySelector(
        '[data-slot="circular-progress-track"]',
      )!

      await expect(disabled[index]).toHaveAttribute("aria-disabled", "true")
      await expect(getComputedStyle(enabledIndicator).stroke).toBe(
        getComputedStyle(primaryRoles[index]).stroke,
      )
      await expect(getComputedStyle(enabledTrack).stroke).toBe(
        getComputedStyle(secondaryContainerRoles[index]).stroke,
      )
      await expect(getComputedStyle(disabledIndicator).stroke).toBe(
        getComputedStyle(disabledIndicatorRoles[index]).stroke,
      )
      await expect(getComputedStyle(disabledTrack).stroke).toBe(
        getComputedStyle(disabledTrackRoles[index]).stroke,
      )
    }

    await expect(
      getComputedStyle(
        enabled[0].querySelector('[data-slot="circular-progress-indicator"]')!,
      ).stroke,
    ).not.toBe(
      getComputedStyle(
        enabled[1].querySelector('[data-slot="circular-progress-indicator"]')!,
      ).stroke,
    )
  },
}

/** Values clamp to their range, while custom ranges normalize the visible arc. */
export const Values: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {[-20, 0, 25, 50, 75, 100, 120].map((value) => (
        <CircularProgress
          key={value}
          aria-label={`${value} input progress`}
          value={value}
        />
      ))}
      <CircularProgress
        aria-label="Custom range progress"
        max={20}
        min={10}
        value={15}
        variant="wavy"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expectedValues = [0, 0, 25, 50, 75, 100, 100]

    for (const [index, value] of [-20, 0, 25, 50, 75, 100, 120].entries()) {
      await expect(
        canvas.getByRole("progressbar", { name: `${value} input progress` }),
      ).toHaveAttribute("aria-valuenow", String(expectedValues[index]))
    }

    const custom = canvas.getByRole("progressbar", {
      name: "Custom range progress",
    })
    const indicator = custom.querySelector(
      '[data-slot="circular-progress-indicator"]',
    )

    await expect(custom).toHaveAttribute("aria-valuemin", "10")
    await expect(custom).toHaveAttribute("aria-valuemax", "20")
    await expect(custom).toHaveAttribute("aria-valuenow", "15")
    await expect(indicator).toHaveAttribute("stroke-dasharray", "50 50")
  },
}

/** Reduced motion keeps a static partial arc, preserving the indeterminate meaning. */
export const ReducedMotion: Story = {
  render: () => <CircularProgress aria-label="Reduced motion loading" />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== "test") return

    const { commands } = await import("vitest/browser")
    const canvas = within(canvasElement)
    const progress = canvas.getByRole("progressbar", {
      name: "Reduced motion loading",
    })
    const indicator = progress.querySelector(
      '[data-slot="circular-progress-indicator"]',
    )!

    await commands.emulateReducedMotion(true)
    try {
      await waitFor(() =>
        expect(getComputedStyle(indicator).animationName).toBe("none"),
      )
      await expect(getComputedStyle(indicator).strokeDasharray).not.toBe("none")
    } finally {
      await commands.emulateReducedMotion(false)
    }
  },
}
