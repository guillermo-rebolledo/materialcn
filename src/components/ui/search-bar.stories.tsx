import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { ArrowLeftIcon, MicIcon, SearchIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "./avatar"
import { Button } from "./button"
import {
  SearchBar,
  SearchBarClear,
  SearchBarInput,
  SearchBarLeading,
  SearchBarSubmit,
  SearchBarTrailing,
} from "./search-bar"

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>

/** Uncontrolled search supports keyboard submission and pointer clearing. */
export const UncontrolledInteractions: Story = {
  args: {
    defaultValue: "Oaxaca",
    onSubmit: fn(),
  },
  render: (args) => (
    <SearchBar {...args} className="max-w-[360px]">
      <SearchBarLeading>
        <SearchIcon aria-hidden="true" />
      </SearchBarLeading>
      <SearchBarInput aria-label="Search destinations" />
      <SearchBarTrailing>
        <SearchBarClear />
        <SearchBarSubmit />
      </SearchBarTrailing>
    </SearchBar>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("searchbox", {
      name: "Search destinations",
    })

    await expect(input).toHaveValue("Oaxaca")
    await userEvent.clear(input)
    await userEvent.type(input, "Mérida{Enter}")
    await expect(args.onSubmit).toHaveBeenCalledWith(
      "Mérida",
      expect.anything(),
    )

    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    await expect(input).toHaveValue("")
    await expect(input).toHaveFocus()

    await userEvent.type(input, "Puebla")
    await userEvent.click(
      canvas.getByRole("button", { name: "Submit search" }),
    )
    await expect(args.onSubmit).toHaveBeenLastCalledWith(
      "Puebla",
      expect.anything(),
    )

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }))
    await expect(input).toHaveValue("")
    await expect(input).toHaveFocus()
  },
}

function ControlledExample() {
  const [value, setValue] = useState("Bacalar")

  return (
    <div className="flex max-w-[360px] flex-col gap-4">
      <SearchBar value={value} onValueChange={setValue}>
        <SearchBarLeading>
          <SearchIcon aria-hidden="true" />
        </SearchBarLeading>
        <SearchBarInput aria-label="Controlled search" />
        <SearchBarTrailing>
          <SearchBarClear />
        </SearchBarTrailing>
      </SearchBar>
      <output aria-label="Current query">{value}</output>
    </div>
  )
}

/** Controlled consumers own the query while SearchBar owns no result state. */
export const ControlledValue: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("searchbox", { name: "Controlled search" })

    await userEvent.clear(input)
    await userEvent.type(input, "Puebla")

    await expect(canvas.getByLabelText("Current query")).toHaveTextContent(
      "Puebla",
    )
  },
}

/** Stable leading and trailing slots compose navigation, voice, avatar, and custom actions. */
export const StatesAndSlots: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex w-[360px] flex-col gap-4">
      <SearchBar>
        <SearchBarLeading>
          <SearchIcon aria-hidden="true" />
        </SearchBarLeading>
        <SearchBarInput
          aria-label="Empty search"
          placeholder="Search destinations"
        />
      </SearchBar>

      <SearchBar defaultValue="Mexico City">
        <SearchBarLeading>
          <Button aria-label="Go back" size="icon" variant="ghost">
            <ArrowLeftIcon aria-hidden="true" />
          </Button>
        </SearchBarLeading>
        <SearchBarInput aria-label="Populated search" />
        <SearchBarTrailing>
          <SearchBarClear />
          <Button aria-label="Voice search" size="icon" variant="ghost">
            <MicIcon aria-hidden="true" />
          </Button>
          <Avatar className="size-8">
            <AvatarFallback>GO</AvatarFallback>
          </Avatar>
        </SearchBarTrailing>
      </SearchBar>

      <SearchBar defaultValue="Unknown" invalid>
        <SearchBarLeading>
          <SearchIcon aria-hidden="true" />
        </SearchBarLeading>
        <SearchBarInput aria-label="Invalid search" />
      </SearchBar>

      <SearchBar defaultValue="Unavailable" disabled>
        <SearchBarLeading>
          <SearchIcon aria-hidden="true" />
        </SearchBarLeading>
        <SearchBarInput aria-label="Disabled search" />
        <SearchBarTrailing>
          <SearchBarClear />
          <Button
            aria-label="Disabled voice search"
            size="icon"
            variant="ghost"
          >
            <MicIcon aria-hidden="true" />
          </Button>
        </SearchBarTrailing>
      </SearchBar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const searchBars = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="search-bar"]'),
    )
    const invalidInputs = canvas.getAllByRole("searchbox", {
      name: "Invalid search",
    })
    const disabledInputs = canvas.getAllByRole("searchbox", {
      name: "Disabled search",
    })
    const disabledActions = canvas.getAllByRole("button", {
      name: "Disabled voice search",
    })

    for (const input of invalidInputs) {
      await expect(input).toHaveAttribute("aria-invalid", "true")
    }
    for (const input of disabledInputs) {
      await expect(input).toBeDisabled()
    }
    for (const action of disabledActions) {
      await expect(action).toBeDisabled()
    }
    for (const searchBar of searchBars) {
      await expect(Math.round(searchBar.getBoundingClientRect().width)).toBe(360)
      await expect(Math.round(searchBar.getBoundingClientRect().height)).toBe(56)
      await expect(
        getComputedStyle(
          searchBar.querySelector<HTMLElement>('[data-slot="input-group"]')!,
        ).borderRadius,
      ).toBe("28px")
    }
  },
}

/** SearchBar remains fluid in compact and wider page regions. */
export const ResponsiveWidths: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="w-[280px]">
        <SearchBar defaultValue="Compact query">
          <SearchBarLeading>
            <SearchIcon aria-hidden="true" />
          </SearchBarLeading>
          <SearchBarInput aria-label="Compact search" />
          <SearchBarTrailing>
            <SearchBarClear />
          </SearchBarTrailing>
        </SearchBar>
      </div>

      <div className="w-[520px]">
        <SearchBar>
          <SearchBarLeading>
            <SearchIcon aria-hidden="true" />
          </SearchBarLeading>
          <SearchBarInput
            aria-label="Fluid search"
            placeholder="Search across all destinations"
          />
        </SearchBar>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const searchBars = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="search-bar"]'),
    )

    await expect(Math.round(searchBars[0].getBoundingClientRect().width)).toBe(280)
    await expect(Math.round(searchBars[1].getBoundingClientRect().width)).toBe(520)
  },
}
