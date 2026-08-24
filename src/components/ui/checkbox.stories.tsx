import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "./checkbox"
import { FieldLabel } from "./field"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { defaultChecked: true } }

/** 18dp box, 2dp outline, extra-small radius — and a 48dp touch target. */
export const States: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["Checked", { defaultChecked: true }],
          ["Unchecked", {}],
          ["Checked, disabled", { defaultChecked: true, disabled: true }],
          ["Unchecked, disabled", { disabled: true }],
          ["Invalid", { "aria-invalid": true }],
        ] as const
      ).map(([label, props]) => (
        <div key={label} className="flex items-center gap-4">
          <Checkbox id={`cb-${label}`} {...props} />
          <FieldLabel htmlFor={`cb-${label}`}>{label}</FieldLabel>
        </div>
      ))}
    </div>
  ),
}
