import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { DatePicker } from "./date-picker"

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    value: null,
    onValueChange: () => undefined,
    label: "Travel date",
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

function ControlledDatePicker() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 7, 12))
  return (
    <div className="w-[360px] max-w-full">
      <DatePicker
        value={value}
        onValueChange={setValue}
        defaultMonth={new Date(2026, 7, 1)}
        label="Travel date"
        locale="en-US"
        max={new Date(2026, 7, 20)}
        isDateUnavailable={(date) => date.getDate() === 18}
      />
      <output aria-label="Selected date">
        {value ? value.toISOString().slice(0, 10) : "None"}
      </output>
    </div>
  )
}

export const DockedInteraction: Story = {
  render: () => <ControlledDatePicker />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole("button", { name: "Choose date" }))
    await waitFor(() => expect(page.getByRole("grid", { name: "August 2026" })).toBeVisible())

    const selected = page.getByRole("gridcell", { name: "Wednesday, August 12, 2026" })
    await expect(selected).toHaveAttribute("aria-selected", "true")
    await waitFor(() => expect(selected).toHaveFocus())
    await userEvent.click(page.getByRole("gridcell", { name: "Saturday, August 15, 2026" }))
    await expect(canvas.getByLabelText("Selected date")).toHaveTextContent("2026-08-15")

    await userEvent.click(canvas.getByRole("button", { name: "Choose date" }))
    // Navigated with arrow keys the whole way rather than jumping with a bare
    // `.focus()`. The grid is a roving tabindex, so a programmatic focus does
    // not make the popup adopt that cell — under load the popup's own focus
    // setup had not run yet, the keystroke went to a stale cell, and the
    // assertion saw focus sitting where the test had put it.
    await waitFor(() =>
      expect(
        page.getByRole("gridcell", { name: "Saturday, August 15, 2026" }),
      ).toHaveFocus(),
    )
    await userEvent.keyboard("{ArrowRight}")
    // Calendar.moveFocus focuses inside a requestAnimationFrame, so focus
    // after an arrow key is always a frame late — asserting it directly is a
    // race that only holds on a fast machine. The calendar and dialog stories
    // already wait the same way.
    await waitFor(() =>
      expect(page.getByRole("gridcell", { name: "Sunday, August 16, 2026" })).toHaveFocus(),
    )
    await expect(page.getByRole("gridcell", { name: "Tuesday, August 18, 2026" })).toBeDisabled()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() =>
      expect(page.getByRole("gridcell", { name: "Monday, August 17, 2026" })).toHaveFocus(),
    )
    // August 18 is unavailable, so the next step skips over it.
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() =>
      expect(page.getByRole("gridcell", { name: "Wednesday, August 19, 2026" })).toHaveFocus(),
    )
    await expect(page.getByRole("button", { name: "Today" })).toBeDisabled()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(canvas.getByRole("button", { name: "Choose date" })).toHaveFocus())
    await userEvent.click(canvas.getByRole("button", { name: "Clear date" }))
    await expect(canvas.getByLabelText("Selected date")).toHaveTextContent("None")
    const input = canvas.getByRole("textbox", { name: "Travel date" })
    await userEvent.type(input, "Aug 18, 2026")
    await userEvent.tab()
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(canvas.getByLabelText("Selected date")).toHaveTextContent("None")
  },
}

export const LocalesAndStates: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex w-[360px] flex-col gap-4">
      <DatePicker
        value={new Date(2026, 7, 12)}
        onValueChange={() => undefined}
        defaultMonth={new Date(2026, 7, 1)}
        label="Fecha de viaje"
        locale="es-MX"
      />
      <DatePicker value={null} onValueChange={() => undefined} label="Required date" invalid error="Choose a valid date" />
      <DatePicker value={new Date(2026, 7, 12)} onValueChange={() => undefined} label="Disabled date" disabled />
      <DatePicker value={new Date(2026, 7, 12)} onValueChange={() => undefined} label="Read-only date" readOnly />
    </div>
  ),
}
