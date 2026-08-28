import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Slider } from "./slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { defaultValue: [60] },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { sideBySide: true },
  render: (args) => (
    <div className="w-80">
      <Slider {...args} />
    </div>
  ),
}

/**
 * Expressive made the track thick and the handle a narrow pill, so it reads as
 * a handle parting a groove rather than a bead riding a wire.
 */
export const Range: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-8">
      <Slider defaultValue={[25, 75]} />
      <Slider defaultValue={[40]} disabled />
    </div>
  ),
}

export const CenteredSizesAndIndicators: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex w-80 flex-col gap-10">
      <Slider aria-label="Small balance" defaultValue={[25]} variant="centered" size="xs" showValue />
      <Slider aria-label="Medium balance" defaultValue={[65]} variant="centered" size="sm" showTicks step={10} />
      <Slider aria-label="Large balance" defaultValue={[75]} variant="centered" size="md" showValue />
      <div className="h-56"><Slider aria-label="Vertical balance" defaultValue={[40]} variant="centered" orientation="vertical" size="sm" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const small = canvas.getAllByRole("slider", { name: "Small balance" })[0]
    small.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(small).toHaveAttribute("aria-valuenow", "26")
    // The active segment runs from the value (plus the 8px handle clearance) to the midpoint.
    const centeredRange = canvasElement.querySelectorAll<HTMLElement>('[data-slot="slider-active-track"]')[0]
    await expect(centeredRange.style.left).toBe("calc(26% + 8px)")
    await expect(centeredRange.style.right).toBe("calc(50% + 0px)")
    await expect(small.parentElement).toHaveTextContent("26")
    const tracks = canvasElement.querySelectorAll<HTMLElement>('[data-slot="slider-track"]')
    await expect(Math.round(tracks[0].getBoundingClientRect().height)).toBe(16)
    await expect(Math.round(tracks[1].getBoundingClientRect().height)).toBe(24)
    await expect(Math.round(tracks[2].getBoundingClientRect().height)).toBe(40)
  },
}

export const OrientationsAndRanges: Story = {
  parameters: { sideBySide: true },
  render: () => <div className="flex h-64 w-80 gap-8"><Slider aria-label="Horizontal range" defaultValue={[20, 80]} size="sm" /><Slider aria-label="Vertical range" defaultValue={[25, 75]} orientation="vertical" size="md" /></div>,
}
