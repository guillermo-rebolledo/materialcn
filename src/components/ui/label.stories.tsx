import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Checkbox } from "./checkbox"
import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  args: { children: "Workspace name" },
  parameters: {
    docs: {
      description: {
        component:
          "A control's label, set in label-large. Prefer `FieldLabel` inside a `Field`, and `TextField`'s own `label` prop for text inputs — this is the bare element for everything else.",
      },
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-m3-sm">
      <Label htmlFor="workspace">Workspace name</Label>
      <Input id="workspace" defaultValue="Engineering" />
    </div>
  ),
}

/**
 * A label is a click target for its control, which is most of the point of
 * using one — it roughly doubles the hit area of a checkbox.
 */
export const ActivatesItsControl: Story = {
  render: () => (
    <div className="flex items-center gap-m3-sm">
      <Checkbox id="agree" />
      <Label htmlFor="agree">Send me the newsletter</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole("checkbox")

    expect(checkbox).toHaveAttribute("aria-checked", "false")
    await userEvent.click(canvas.getByText("Send me the newsletter"))
    expect(checkbox).toHaveAttribute("aria-checked", "true")
  },
}

/**
 * The label dims with its control rather than needing its own disabled state —
 * it follows `peer-disabled` and the group's `data-disabled`.
 */
export const Disabled: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex items-center gap-m3-sm">
      <Checkbox id="disabled-option" disabled className="peer" />
      <Label htmlFor="disabled-option">Unavailable option</Label>
    </div>
  ),
}
