import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { LoadingIndicator } from "./loading-indicator"

const meta = {
  title: "Components/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  argTypes: {
    contained: { control: "boolean" },
    size: {
      control: "radio",
      options: ["inline", "standalone"],
    },
  },
} satisfies Meta<typeof LoadingIndicator>

export default meta
type Story = StoryObj<typeof meta>

/** The standalone indicator is a named status with the kit's default geometry. */
export const Standalone: Story = {
  render: () => <LoadingIndicator />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole("status", { name: "Loading" })
    const shape = status.querySelector('[data-slot="loading-indicator-shape"]')

    await expect(Math.round(status.getBoundingClientRect().width)).toBe(48)
    await expect(Math.round(status.getBoundingClientRect().height)).toBe(48)
    await expect(Math.round(shape!.getBoundingClientRect().width)).toBe(38)
    await expect(Math.round(shape!.getBoundingClientRect().height)).toBe(38)
  },
}

/** Inline and standalone sizes serve text-adjacent and independent loading contexts. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingIndicator aria-label="Inline loading" size="inline" />
      <LoadingIndicator aria-label="Standalone loading" size="standalone" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const inline = canvas.getByRole("status", { name: "Inline loading" })
    const standalone = canvas.getByRole("status", {
      name: "Standalone loading",
    })
    const inlineShape = inline.querySelector(
      '[data-slot="loading-indicator-shape"]',
    )
    const standaloneShape = standalone.querySelector(
      '[data-slot="loading-indicator-shape"]',
    )

    await expect(Math.round(inline.getBoundingClientRect().width)).toBe(24)
    await expect(Math.round(inline.getBoundingClientRect().height)).toBe(24)
    await expect(Math.round(inlineShape!.getBoundingClientRect().width)).toBe(19)
    await expect(Math.round(inlineShape!.getBoundingClientRect().height)).toBe(19)
    await expect(Math.round(standalone.getBoundingClientRect().width)).toBe(48)
    await expect(Math.round(standalone.getBoundingClientRect().height)).toBe(48)
    await expect(Math.round(standaloneShape!.getBoundingClientRect().width)).toBe(38)
    await expect(Math.round(standaloneShape!.getBoundingClientRect().height)).toBe(38)
  },
}

/** Contained and uncontained indicators keep their Material roles on both color schemes. */
export const SurfaceContexts: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <span
        className="absolute size-0 bg-primary"
        data-testid="role-primary"
      />
      <span
        className="absolute size-0 bg-m3-primary-container"
        data-testid="role-primary-container"
      />
      <span
        className="absolute size-0 bg-m3-on-primary-container"
        data-testid="role-on-primary-container"
      />
      <Card className="w-48">
        <CardHeader>
          <CardTitle>Syncing</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingIndicator aria-label="Syncing workspace" />
        </CardContent>
      </Card>
      <Card className="w-48" variant="filled">
        <CardHeader>
          <CardTitle>Refreshing</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingIndicator aria-label="Refreshing workspace" contained />
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const uncontained = canvas.getAllByRole("status", {
      name: "Syncing workspace",
    })
    const contained = canvas.getAllByRole("status", {
      name: "Refreshing workspace",
    })
    const primaryRoles = canvas.getAllByTestId("role-primary")
    const primaryContainerRoles = canvas.getAllByTestId("role-primary-container")
    const onPrimaryContainerRoles = canvas.getAllByTestId(
      "role-on-primary-container",
    )

    for (const index of [0, 1]) {
      const uncontainedShape = uncontained[index].querySelector(
        '[data-slot="loading-indicator-shape"]',
      )!
      const containedShape = contained[index].querySelector(
        '[data-slot="loading-indicator-shape"]',
      )!

      await expect(getComputedStyle(uncontainedShape).backgroundColor).toBe(
        getComputedStyle(primaryRoles[index]).backgroundColor,
      )
      await expect(getComputedStyle(contained[index]).backgroundColor).toBe(
        getComputedStyle(primaryContainerRoles[index]).backgroundColor,
      )
      await expect(getComputedStyle(containedShape).backgroundColor).toBe(
        getComputedStyle(onPrimaryContainerRoles[index]).backgroundColor,
      )
    }

    await expect(
      getComputedStyle(uncontained[0].firstElementChild!).backgroundColor,
    ).not.toBe(
      getComputedStyle(uncontained[1].firstElementChild!).backgroundColor,
    )
  },
}

/** The indicator continuously morphs through the kit's seven-shape sequence. */
export const Motion: Story = {
  render: () => <LoadingIndicator aria-label="Loading dashboard" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole("status", { name: "Loading dashboard" })
    const shape = status.querySelector<HTMLElement>(
      '[data-slot="loading-indicator-shape"]',
    )!
    const animation = shape
      .getAnimations()
      .find(
        (candidate) =>
          candidate instanceof CSSAnimation &&
          candidate.animationName === "m3-loading-indicator-morph",
      )
    const keyframes = (animation?.effect as KeyframeEffect)?.getKeyframes() ?? []
    const style = getComputedStyle(shape)
    const expectedShapeOrder = [1, 2, 3, 4, 5, 7, 6, 1].map((step) =>
      style.getPropertyValue(`--m3-loading-shape-${step}`).trim(),
    )
    const expectedOffsets = [0, 1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7, 1]

    await expect(style.animationDuration).toBe("2.8s")
    await expect(keyframes).toHaveLength(8)
    await expect(keyframes.map(({ clipPath }) => clipPath)).toEqual(
      expectedShapeOrder,
    )
    for (const [index, keyframe] of keyframes.entries()) {
      await expect(keyframe.offset).toBeCloseTo(expectedOffsets[index])
      if (index < keyframes.length - 1) {
        await expect(keyframe.easing).toBe("cubic-bezier(0.2, 0, 0, 1)")
      }
    }
  },
}

/** Reduced motion preserves a stable, recognizable soft-burst loading shape. */
export const ReducedMotion: Story = {
  render: () => <LoadingIndicator aria-label="Reduced motion loading" />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== "test") return

    const { commands } = await import("vitest/browser")
    const canvas = within(canvasElement)
    const shape = canvas
      .getByRole("status", { name: "Reduced motion loading" })
      .querySelector<HTMLElement>('[data-slot="loading-indicator-shape"]')!

    await commands.emulateReducedMotion(true)
    try {
      await waitFor(() =>
        expect(getComputedStyle(shape).animationName).toBe("none"),
      )
      await expect(getComputedStyle(shape).clipPath).toContain("polygon")
    } finally {
      await commands.emulateReducedMotion(false)
    }
  },
}
