import type { Meta, StoryObj } from "@storybook/react-vite"

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
