import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { TimePicker, type TimeValue } from "./time-picker"
import { formatTime } from "./time-picker-utils"

const meta = {
  title: "Components/TimePicker/Keyboard",
  component: TimePicker,
  tags: ["autodocs"],
  args: { value: { hour: 9, minute: 30 }, onValueChange: () => undefined, label: "Start time" },
} satisfies Meta<typeof TimePicker>

export default meta
type Story = StoryObj<typeof meta>

function ControlledTime() {
  const [value, setValue] = useState<TimeValue>({ hour: 9, minute: 30 })
  return (
    <>
      <TimePicker value={value} onValueChange={setValue} label="Start time" mode="12-hour" />
      <output aria-label="Selected time">{formatTime(value, "24-hour")}</output>
    </>
  )
}

export const KeyboardInteraction: Story = {
  render: () => <ControlledTime />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hours = canvas.getByRole("spinbutton", { name: "Hours" })
    const minutes = canvas.getByRole("spinbutton", { name: "Minutes" })
    await userEvent.clear(hours)
    await expect(hours).toHaveAttribute("aria-invalid", "true")
    await expect(canvas.getByText("Enter both hours and minutes")).toBeVisible()
    await userEvent.type(hours, "11")
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Period" }), "PM")
    await expect(canvas.getByLabelText("Selected time")).toHaveTextContent("23:30")
    hours.focus()
    await userEvent.keyboard("{ArrowRight}{ArrowUp}")
    await expect(minutes).toHaveFocus()
    await expect(canvas.getByLabelText("Selected time")).toHaveTextContent("23:31")
  },
}

export const ModesAndStates: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex max-w-[360px] flex-col gap-5">
      <TimePicker value={{ hour: 13, minute: 45 }} onValueChange={() => undefined} label="24-hour time" mode="24-hour" />
      <TimePicker value={{ hour: 8, minute: 0 }} onValueChange={() => undefined} label="Constrained time" min={{ hour: 9, minute: 0 }} max={{ hour: 17, minute: 0 }} />
      <TimePicker value={{ hour: 25, minute: 70 }} onValueChange={() => undefined} label="Invalid time" invalid error="Enter a valid time" />
      <TimePicker value={{ hour: 10, minute: 15 }} onValueChange={() => undefined} label="Disabled time" disabled />
      <TimePicker value={{ hour: 10, minute: 15 }} onValueChange={() => undefined} label="Read-only time" readOnly />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const hours = within(canvasElement).getAllByRole("spinbutton", { name: "Hours" })[4]
    hours.focus()
    await userEvent.keyboard("{ArrowUp}")
    await expect(hours).toHaveValue(10)
  },
}
