import type { Meta, StoryObj } from "@storybook/react-vite"

import { Field, FieldDescription, FieldGroup, FieldLabel } from "./field"
import { Input } from "./input"

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: { placeholder: "you@example.com" },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
}

/**
 * The M3 outlined text field: 56dp tall, extra-small radius, and a 2dp outline
 * that turns primary on focus rather than growing a separate ring.
 */
export const States: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel htmlFor="in-default">Email</FieldLabel>
        <Input id="in-default" placeholder="you@example.com" />
      </Field>
      <Field>
        <FieldLabel htmlFor="in-value">With a value</FieldLabel>
        <Input id="in-value" defaultValue="ada@example.com" />
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="in-invalid">Invalid</FieldLabel>
        <Input id="in-invalid" defaultValue="not-an-email" aria-invalid />
        <FieldDescription>Enter a valid email address.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="in-disabled">Disabled</FieldLabel>
        <Input id="in-disabled" placeholder="Unavailable" disabled />
      </Field>
    </FieldGroup>
  ),
}
