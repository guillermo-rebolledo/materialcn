import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { EyeIcon, MailIcon } from "lucide-react"

import { Button } from "./button"
import { TextField } from "./text-field"

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "Name" },
} satisfies Meta<typeof TextField>
export default meta
type Story = StoryObj<typeof meta>

function ControlledField() {
  const [value, setValue] = useState("hello")
  return (
    <>
      <TextField
        label="Email"
        value={value}
        onValueChange={setValue}
        leading={<MailIcon />}
        trailing={<Button aria-label="Show email" size="icon-sm" variant="ghost"><EyeIcon /></Button>}
        prefix="mailto:"
        suffix=".com"
        supportingText="Used for account notices"
        maxLength={24}
      />
      <output aria-label="Field value">{value}</output>
    </>
  )
}

export const ControlledAndAdorned: Story = {
  render: () => <div className="max-w-[360px]"><ControlledField /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox", { name: "Email" })
    await userEvent.clear(input)
    await userEvent.type(input, "person")
    await expect(canvas.getByLabelText("Field value")).toHaveTextContent("person")
    await expect(canvas.getByText("6 / 24")).toBeVisible()
  },
}

export const VariantsAndStates: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex w-[360px] flex-col gap-5">
      <TextField label="Outlined" defaultValue="Value" />
      <TextField label="Filled" variant="filled" defaultValue="Value" />
      <TextField label="Biography" multiline defaultValue="A multiline Material field" maxLength={120} />
      <TextField label="Invalid" defaultValue="Bad value" invalid error="Correct this value" />
      <TextField label="Disabled" defaultValue="Unavailable" disabled />
      <TextField label="Read only" defaultValue="Fixed" readOnly />
    </div>
  ),
}
