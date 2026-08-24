import type { Meta, StoryObj } from "@storybook/react-vite"

import { FieldLabel } from "./field"
import { RadioGroup, RadioGroupItem } from "./radio-group"

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/** 20dp ring; selected draws a 10dp dot in the ring color, not a knockout. */
export const Default: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <RadioGroup defaultValue="spatial">
      {["spatial", "effects", "none"].map((value) => (
        <div key={value} className="flex items-center gap-4">
          <RadioGroupItem id={`radio-${value}`} value={value} />
          <FieldLabel htmlFor={`radio-${value}`} className="capitalize">
            {value}
          </FieldLabel>
        </div>
      ))}
      <div className="flex items-center gap-4">
        <RadioGroupItem id="radio-disabled" value="disabled" disabled />
        <FieldLabel htmlFor="radio-disabled">Disabled</FieldLabel>
      </div>
    </RadioGroup>
  ),
}
