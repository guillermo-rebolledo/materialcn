import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import {
  ArrowLeftIcon,
  ClockIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "./button"
import {
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemSupportingText,
} from "./list"
import {
  SearchBarClear,
  SearchBarInput,
  SearchBarLeading,
  SearchBarTrailing,
} from "./search-bar"
import {
  SearchView,
  SearchViewBar,
  SearchViewClose,
  SearchViewContent,
  SearchViewItem,
  SearchViewList,
  SearchViewMessage,
} from "./search-view"

const meta = {
  title: "Components/SearchView",
  component: SearchView,
  tags: ["autodocs"],
  args: {
    open: true,
    onOpenChange: () => undefined,
    value: "",
    onValueChange: () => undefined,
  },
} satisfies Meta<typeof SearchView>

export default meta
type Story = StoryObj<typeof meta>

const destinations = [
  ["Oaxaca", "Culture and cuisine"],
  ["Mérida", "History and architecture"],
  ["Bacalar", "Lagoon and nature"],
] as const

function SearchViewExample({
  initialOpen = false,
  presentation = "docked",
}: {
  initialOpen?: boolean
  presentation?: "docked" | "full-screen"
}) {
  const [open, setOpen] = useState(initialOpen)
  const [query, setQuery] = useState("")
  const [selection, setSelection] = useState("None")

  return (
    <div
      className={
        presentation === "full-screen"
          ? "h-[560px] w-[412px] max-w-full"
          : "w-[360px] max-w-full"
      }
    >
      <Button onClick={() => setOpen(true)}>Open search</Button>
      <output aria-label="Selected destination" className="ml-3">
        {selection}
      </output>
      <SearchView
        open={open}
        onOpenChange={setOpen}
        value={query}
        onValueChange={setQuery}
        onSelect={setSelection}
        presentation={presentation}
        aria-label="Destination search"
      >
        <SearchViewBar>
          <SearchBarLeading>
            {presentation === "full-screen" ? (
              <SearchViewClose>
                <ArrowLeftIcon aria-hidden="true" />
              </SearchViewClose>
            ) : (
              <SearchIcon aria-hidden="true" />
            )}
          </SearchBarLeading>
          <SearchBarInput
            aria-label="Search destinations"
            placeholder="Search destinations"
          />
          <SearchBarTrailing>
            <SearchBarClear />
          </SearchBarTrailing>
        </SearchViewBar>
        <SearchViewContent state={query ? "suggestions" : "recent"}>
          <SearchViewList aria-label={query ? "Suggestions" : "Recent searches"}>
            {destinations.map(([name, description]) => (
              <SearchViewItem key={name} value={name} lines={2}>
                <ListItemLeading>
                  {query ? (
                    <SearchIcon aria-hidden="true" />
                  ) : (
                    <ClockIcon aria-hidden="true" />
                  )}
                </ListItemLeading>
                <ListItemContent>
                  <ListItemHeadline>{name}</ListItemHeadline>
                  <ListItemSupportingText>{description}</ListItemSupportingText>
                </ListItemContent>
              </SearchViewItem>
            ))}
          </SearchViewList>
        </SearchViewContent>
      </SearchView>
    </div>
  )
}

/** A single controlled query/open model drives focus, selection, and dismissal. */
export const DockedInteraction: Story = {
  render: () => <SearchViewExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Open search" })

    await userEvent.click(trigger)
    const input = canvas.getByRole("searchbox", { name: "Search destinations" })
    await expect(input).toHaveFocus()
    await userEvent.type(input, "oa")
    await expect(canvas.getByRole("listbox", { name: "Suggestions" })).toBeVisible()

    await userEvent.keyboard("{ArrowDown}")
    await expect(canvas.getByRole("option", { name: /Oaxaca/ })).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await expect(canvas.getByLabelText("Selected destination")).toHaveTextContent("Mérida")
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await expect(canvas.getByRole("searchbox", { name: "Search destinations" })).toHaveFocus()
    await userEvent.keyboard("{Escape}")
    await expect(trigger).toHaveFocus()
  },
}

export const FullScreen: Story = {
  parameters: { sideBySide: true },
  render: () => <SearchViewExample initialOpen presentation="full-screen" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const closeButtons = canvas.getAllByRole("button", { name: "Close search" })
    await expect(closeButtons).toHaveLength(2)
    await userEvent.click(closeButtons[0])
    await expect(canvas.getAllByRole("button", { name: "Close search" })).toHaveLength(1)
  },
}

export const RecentAndSuggestions: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-4">
      <SearchViewExample initialOpen />
      <SearchView
        open
        onOpenChange={() => undefined}
        value="Oa"
        onValueChange={() => undefined}
        presentation="docked"
        aria-label="Suggestion search"
      >
        <SearchViewBar>
          <SearchBarLeading><SearchIcon aria-hidden="true" /></SearchBarLeading>
          <SearchBarInput aria-label="Suggestion query" />
        </SearchViewBar>
        <SearchViewContent state="suggestions">
          <SearchViewList aria-label="Suggestions">
            <SearchViewItem value="Oaxaca">Oaxaca</SearchViewItem>
          </SearchViewList>
        </SearchViewContent>
      </SearchView>
    </div>
  ),
}

export const Results: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <SearchView
      open
      onOpenChange={() => undefined}
      value="Yucatán"
      onValueChange={() => undefined}
      presentation="docked"
      aria-label="Search results"
    >
      <SearchViewBar>
        <SearchBarLeading><SearchIcon aria-hidden="true" /></SearchBarLeading>
        <SearchBarInput aria-label="Results query" />
        <SearchBarTrailing><SearchBarClear /></SearchBarTrailing>
      </SearchViewBar>
      <SearchViewContent state="results">
        <SearchViewList aria-label="Destinations">
          {destinations.map(([name, description]) => (
            <SearchViewItem key={name} value={name} lines={2}>
              <ListItemContent>
                <ListItemHeadline>{name}</ListItemHeadline>
                <ListItemSupportingText>{description}</ListItemSupportingText>
              </ListItemContent>
            </SearchViewItem>
          ))}
        </SearchViewList>
      </SearchViewContent>
    </SearchView>
  ),
}

/** Loading, empty, and error feedback use the same content region and live semantics. */
export const ResultStates: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      {(["loading", "empty", "error"] as const).map((state) => (
        <SearchView
          key={state}
          open
          onOpenChange={() => undefined}
          value="Querétaro"
          onValueChange={() => undefined}
          presentation="docked"
          aria-label={`${state} search`}
        >
          <SearchViewBar>
            <SearchBarLeading><SearchIcon aria-hidden="true" /></SearchBarLeading>
            <SearchBarInput aria-label={`${state} query`} />
          </SearchViewBar>
          <SearchViewContent state={state}>
            <SearchViewMessage>
              {state === "loading" && "Searching destinations…"}
              {state === "empty" && "No destinations found"}
              {state === "error" && "Search is temporarily unavailable"}
            </SearchViewMessage>
          </SearchViewContent>
        </SearchView>
      ))}
    </div>
  ),
}
