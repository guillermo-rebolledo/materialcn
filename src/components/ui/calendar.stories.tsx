import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Calendar } from "./calendar"
import { firstDayOfWeek } from "./calendar-utils"
import { DatePicker } from "./date-picker"

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A month grid. The week starts on whichever day the locale starts on — Sunday-first is a US convention, not a default.",
      },
    },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

const MARCH = new Date(2026, 2, 1, 12)

function Controlled({ locale }: { locale: string }) {
  const [selected, setSelected] = useState<Date | null>(null)
  return (
    <div data-testid={`calendar-${locale}`}>
      <Calendar
        locale={locale}
        defaultMonth={MARCH}
        selected={selected}
        onSelect={setSelected}
      />
    </div>
  )
}

export const Default: Story = {
  args: { onSelect: () => {}, defaultMonth: MARCH },
  render: () => <Controlled locale="en-US" />,
}

/**
 * Most of the world starts the week on Monday. The grid used to be built from
 * `getDay()` directly, which is Sunday-first everywhere — so for most locales
 * the weekday labels were right and the columns underneath them were rotated by
 * one.
 *
 * Both the header row and the day cells now come from the same computed week
 * start, which is what makes the two impossible to disagree.
 */
export const LocaleWeekStart: Story = {
  args: { onSelect: () => {}, defaultMonth: MARCH },
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-m3-xl">
      {(["en-US", "en-GB", "fr-FR", "fa-IR"] as const).map((locale) => (
        <div key={locale} className="flex flex-col gap-m3-sm">
          <code className="text-m3-label-lg text-muted-foreground">
            {locale}
          </code>
          <Controlled locale={locale} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const locale of ["en-US", "en-GB"] as const) {
      const grid = within(canvas.getAllByTestId(`calendar-${locale}`)[0])
      const headers = grid.getAllByRole("columnheader")

      // The header row is what the user reads the columns against, so assert
      // against the locale's own idea of the first day rather than against a
      // hard-coded letter.
      const expected = new Intl.DateTimeFormat(locale, {
        weekday: "narrow",
        // A Sunday, then offset by the locale's start.
      }).format(new Date(2026, 2, 1 + firstDayOfWeek(locale), 12))

      expect(headers[0], `${locale} first column`).toHaveAttribute(
        "aria-label",
        expected,
      )
    }

    // The two locales genuinely differ, or the assertion above proves nothing.
    expect(firstDayOfWeek("en-US")).toBe(0)
    expect(firstDayOfWeek("en-GB")).toBe(1)
  },
}

/**
 * Home and End mean the ends of the row as displayed, so on a Monday-first
 * calendar Home is Monday. Arrow keys move through the days in the order they
 * appear, which they already did — the rotation is what had to follow.
 */
export const KeyboardFollowsTheRow: Story = {
  args: { onSelect: () => {}, defaultMonth: MARCH },
  render: () => <Controlled locale="en-GB" />,
  play: async ({ canvasElement }) => {
    const cell = (date: string) =>
      canvasElement.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)!

    // 2026-03-11 is a Wednesday. On this Monday-first calendar, Home is the
    // Monday of that row and End is the Sunday — not Sunday and Saturday.
    cell("2026-03-11").focus()
    await userEvent.keyboard("{Home}")
    await waitFor(() => expect(cell("2026-03-09")).toHaveFocus())

    await userEvent.keyboard("{End}")
    await waitFor(() => expect(cell("2026-03-15")).toHaveFocus())
  },
}

/**
 * The range band is painted per cell across the full column, so it stays
 * continuous whatever day the row begins on.
 */
export const RangeAcrossTheWeek: Story = {
  args: { onSelect: () => {}, defaultMonth: MARCH },
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-m3-xl">
      {(["en-US", "en-GB"] as const).map((locale) => (
        <div key={locale} className="flex flex-col gap-m3-sm">
          <code className="text-m3-label-lg text-muted-foreground">
            {locale}
          </code>
          <Calendar
            locale={locale}
            defaultMonth={MARCH}
            onSelect={() => {}}
            range={{ start: new Date(2026, 2, 4, 12), end: new Date(2026, 2, 17, 12) }}
          />
        </div>
      ))}
    </div>
  ),
}

/** The pickers take a `locale` and pass it down, so both inherit the behaviour. */
export const PickersInherit: Story = {
  args: { onSelect: () => {}, defaultMonth: MARCH },
  render: function PickersInheritStory() {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <DatePicker
        label="date"
        locale="en-GB"
        defaultMonth={MARCH}
        value={value}
        onValueChange={setValue}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole("button", { name: /Choose date/ }))

    await waitFor(() =>
      expect(body.getAllByRole("columnheader")[0]).toHaveAttribute(
        "aria-label",
        new Intl.DateTimeFormat("en-GB", { weekday: "narrow" }).format(
          new Date(2026, 2, 2, 12),
        ),
      ),
    )
    await userEvent.keyboard("{Escape}")
  },
}
