import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { DialTimePicker } from "./time-dial"
import { formatTime, type TimeValue } from "./time-picker"

const meta = {
  title: "Components/TimePicker/Dial",
  component: DialTimePicker,
  tags: ["autodocs"],
  args: { value: { hour: 9, minute: 0 }, onValueChange: () => undefined, label: "Meeting time" },
} satisfies Meta<typeof DialTimePicker>

export default meta
type Story = StoryObj<typeof meta>

function DialExample() {
  const [value, setValue] = useState<TimeValue>({ hour: 9, minute: 0 })
  return (
    <>
      <DialTimePicker value={value} onValueChange={setValue} label="Meeting time" mode="12-hour" />
      <output aria-label="Selected dial time">{formatTime(value, "24-hour")}</output>
    </>
  )
}

export const PointerAndKeyboard: Story = {
  render: () => <DialExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Choose Meeting time" })
    await userEvent.click(trigger)
    await userEvent.click(body.getByRole("button", { name: "11 hours" }))
    const minutes = body.getByRole("button", { name: "30 minutes" })
    minutes.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.click(body.getByRole("button", { name: "Confirm time" }))
    await expect(canvas.getByLabelText("Selected dial time")).toHaveTextContent("11:30")
    await new Promise((resolve) => setTimeout(resolve, 150))
    await expect(trigger).toHaveFocus()
  },
}

export const ModesAndStates: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-4">
      <DialTimePicker value={{ hour: 13, minute: 20 }} onValueChange={() => undefined} label="24-hour dial" mode="24-hour" defaultOpen />
      <DialTimePicker value={{ hour: 9, minute: 0 }} onValueChange={() => undefined} label="Disabled dial" disabled />
      <DialTimePicker value={{ hour: 25, minute: 80 }} onValueChange={() => undefined} label="Invalid dial" invalid error="Choose a valid time" />
    </div>
  ),
}
