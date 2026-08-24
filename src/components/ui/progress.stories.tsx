import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress, ProgressLabel, ProgressValue } from "./progress"

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { value: 60 },
  argTypes: {
    variant: { control: "inline-radio", options: ["flat", "wavy"] },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

/** Linear determinate: 4dp track on the secondary container, primary fill. */
export const Default: Story = {
  parameters: { sideBySide: true },
  render: (args) => (
    <div className="w-80">
      <Progress {...args}>
        <ProgressLabel>Generating tokens</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
}

export const Steps: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      {[0, 25, 50, 75, 100].map((value) => (
        <Progress key={value} value={value} />
      ))}
    </div>
  ),
}

/**
 * The Expressive wavy indicator. The active portion is a travelling sine —
 * 40dp wavelength, 6dp peak-to-peak in a 12dp box — while the remaining track
 * stays a flat 4dp rule. The travel stops under `prefers-reduced-motion`.
 */
export const Wavy: Story = {
  args: { variant: "wavy" },
  parameters: { sideBySide: true },
  render: (args) => (
    <div className="w-80">
      <Progress {...args}>
        <ProgressLabel>Downloading</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
}

export const WavySteps: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      {[10, 35, 60, 85, 100].map((value) => (
        <Progress key={value} value={value} variant="wavy" />
      ))}
    </div>
  ),
}

/** Flat and wavy at the same value, for comparison. */
export const Comparison: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex w-80 flex-col gap-8">
      <Progress value={65} />
      <Progress value={65} variant="wavy" />
    </div>
  ),
}
