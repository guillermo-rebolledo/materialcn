import type { Meta, StoryObj } from "@storybook/react-vite"

import { FieldLabel } from "./field"
import { Switch } from "./switch"

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { defaultChecked: true },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * Material's handle grows from 16dp to 24dp as it travels, and the unselected
 * track carries a 2dp outline so "off" never reads as a filled control.
 */
export const States: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["On", { defaultChecked: true }],
          ["Off", { defaultChecked: false }],
          ["On, disabled", { defaultChecked: true, disabled: true }],
          ["Off, disabled", { defaultChecked: false, disabled: true }],
        ] as const
      ).map(([label, props]) => (
        <div key={label} className="flex items-center gap-4">
          <Switch id={`switch-${label}`} {...props} />
          <FieldLabel htmlFor={`switch-${label}`}>{label}</FieldLabel>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch size="sm" defaultChecked />
      <Switch size="default" defaultChecked />
    </div>
  ),
}
