import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

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

function LocalizedInputExample() {
  const [value, setValue] = useState<Date | null>(null)
  return (
    <>
      <DatePickerDialog
        value={value}
        onValueChange={setValue}
        label="Fecha de viaje"
        locale="es-MX"
        mode="input"
        formatDate={(date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
        parseDate={(text) => {
          const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
          return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), 12) : null
        }}
      />
      <output aria-label="Localized date">{value?.toISOString().slice(0, 10) ?? "None"}</output>
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
    await waitFor(() => expect(trigger).toHaveFocus())
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

export const RangeKeyboardTabStop: Story = {
  render: () => (
    <DateRangePicker
      value={{ start: null, end: null }}
      onValueChange={() => undefined}
      defaultMonth={new Date(2027, 0, 1)}
      label="Future travel dates"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole("button", { name: "Choose Future travel dates" }))
    const grid = page.getByRole("grid", { name: "January 2027" })
    const tabStops = within(grid).getAllByRole("gridcell").filter((day) => day.tabIndex === 0)
    await expect(tabStops).toHaveLength(1)
    tabStops[0].focus()
    await userEvent.keyboard("{PageDown}")
    await expect(page.getByRole("grid", { name: "February 2027" })).toBeVisible()
    await waitFor(() => expect(page.getByRole("gridcell", { name: "Monday, February 1, 2027" })).toHaveFocus())
  },
}

export const LocalizedInputParsing: Story = {
  render: () => <LocalizedInputExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole("button", { name: "Choose Fecha de viaje" }))
    await userEvent.type(page.getByRole("textbox", { name: "Date" }), "24/8/2026")
    await userEvent.click(page.getByRole("button", { name: "Confirm date" }))
    await expect(canvas.getByLabelText("Localized date")).toHaveTextContent("2026-08-24")
  },
}
