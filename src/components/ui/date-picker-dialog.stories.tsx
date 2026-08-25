import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { DatePickerDialog, DateRangePicker, type DateRange } from "./date-picker-dialog"

const meta = {
  title: "Components/DatePicker/ModalAndRange",
  component: DatePickerDialog,
  tags: ["autodocs"],
  args: { value: null, onValueChange: () => undefined, label: "Choose date" },
} satisfies Meta<typeof DatePickerDialog>

export default meta
type Story = StoryObj<typeof meta>

function RangeExample() {
  const [value, setValue] = useState<DateRange>({ start: null, end: null })
  return (
    <>
      <DateRangePicker
        value={value}
        onValueChange={setValue}
        defaultMonth={new Date(2026, 7, 1)}
        label="Travel dates"
      />
      <output aria-label="Selected range">
        {value.start ? value.start.getDate() : "None"}–{value.end ? value.end.getDate() : "None"}
      </output>
    </>
  )
}

export const RangeInteraction: Story = {
  render: () => <RangeExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Choose Travel dates" })
    await userEvent.click(trigger)
    await userEvent.click(body.getByRole("gridcell", { name: "Wednesday, August 12, 2026" }))
    await userEvent.click(body.getByRole("gridcell", { name: "Saturday, August 15, 2026" }))
    await userEvent.click(body.getByRole("button", { name: "Confirm dates" }))
    await expect(canvas.getByLabelText("Selected range")).toHaveTextContent("12–15")
    await new Promise((resolve) => setTimeout(resolve, 150))
    await expect(trigger).toHaveFocus()
  },
}

export const ModalSingleAndInput: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-4">
      <DatePickerDialog
        value={new Date(2026, 7, 12)}
        onValueChange={() => undefined}
        defaultMonth={new Date(2026, 7, 1)}
        label="Calendar date"
      />
      <DatePickerDialog
        value={null}
        onValueChange={() => undefined}
        label="Input date"
        mode="input"
        invalid
        error="Enter a valid date"
      />
    </div>
  ),
}
