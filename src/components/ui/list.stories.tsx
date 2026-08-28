import { useId, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Bell, ChevronRight, Folder } from "lucide-react"

import { Avatar, AvatarFallback } from "./avatar"
import { Checkbox } from "./checkbox"
import {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemOverline,
  ListItemSupportingText,
  ListItemTrailing,
  ListSection,
  ListSubheader,
} from "./list"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Switch } from "./switch"

const meta = {
  title: "Components/List",
  component: List,
  tags: ["autodocs"],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

const densityHeights = {
  default: [56, 72, 88],
  "-2": [48, 64, 80],
  "-4": [40, 56, 72],
} as const

/** Density changes the row geometry without changing its content structure. */
export const DensityGeometry: Story = {
  render: () => (
    <div className="flex w-full max-w-90 flex-col gap-6">
      {Object.entries(densityHeights).map(([density, heights]) => (
        <List
          key={density}
          density={density as keyof typeof densityHeights}
          aria-label={`${density} density`}
        >
          {heights.map((_, index) => {
            const lines = (index + 1) as 1 | 2 | 3

            return (
              <ListItem key={lines} lines={lines} data-testid={`${density}-${lines}`}>
                <ListItemContent>
                  <ListItemHeadline>List item</ListItemHeadline>
                  {lines > 1 ? (
                    <ListItemSupportingText>
                      {lines === 3
                        ? "Supporting text that occupies two lines."
                        : "Supporting text"}
                    </ListItemSupportingText>
                  ) : null}
                </ListItemContent>
              </ListItem>
            )
          })}
        </List>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const [density, heights] of Object.entries(densityHeights)) {
      for (const [index, height] of heights.entries()) {
        const item = canvas.getByTestId(`${density}-${index + 1}`)
        await expect(item.getBoundingClientRect().height).toBe(height)
      }
    }
  },
}

function InteractiveList() {
  const [lastAction, setLastAction] = useState("No action yet")

  return (
    <div className="flex w-full max-w-90 flex-col gap-4">
      <List aria-label="Project actions">
        <ListSection aria-labelledby="project-actions-heading">
          <ListSubheader id="project-actions-heading">Quick actions</ListSubheader>
          <ListItem render={<a href="#documents" />}>
            <ListItemContent>
              <ListItemHeadline>Documents</ListItemHeadline>
            </ListItemContent>
          </ListItem>
          <ListItem
            render={
              <button type="button" onClick={() => setLastAction("Project created")} />
            }
          >
            <ListItemContent>
              <ListItemHeadline>Create project</ListItemHeadline>
            </ListItemContent>
          </ListItem>
        </ListSection>
      </List>
      <output aria-live="polite">{lastAction}</output>
    </div>
  )
}

/** Interactive rows keep list semantics while exposing real links and buttons. */
export const SemanticInteraction: Story = {
  render: () => <InteractiveList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole("list", { name: "Project actions" })
    const link = canvas.getByRole("link", { name: "Documents" })
    const button = canvas.getByRole("button", { name: "Create project" })

    await expect(within(list).getAllByRole("listitem")).toHaveLength(2)
    await expect(link).toHaveAttribute("href", "#documents")
    await userEvent.tab()
    await waitFor(() => expect(link).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(button).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(canvas.getByText("Project created")).toBeVisible()
  },
}

function CompleteList() {
  const contentHeadingId = useId()
  const controlsHeadingId = useId()

  return (
    <RadioGroup defaultValue="daily" aria-label="Notification frequency">
      <List aria-label="List slot examples">
        <ListSection aria-labelledby={contentHeadingId}>
          <ListSubheader id={contentHeadingId}>Content</ListSubheader>
          <ListItem>
            <ListItemLeading variant="icon">
              <Folder aria-hidden="true" />
            </ListItemLeading>
            <ListItemContent>
              <ListItemHeadline>Documents</ListItemHeadline>
            </ListItemContent>
            <ListItemTrailing>24 files</ListItemTrailing>
          </ListItem>
          <ListItem lines={2}>
            <ListItemLeading variant="avatar">
              <Avatar size="lg">
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </ListItemLeading>
            <ListItemContent>
              <ListItemOverline>Owner</ListItemOverline>
              <ListItemHeadline>Ari Rivera</ListItemHeadline>
            </ListItemContent>
            <ListItemTrailing>
              <ChevronRight aria-hidden="true" />
            </ListItemTrailing>
          </ListItem>
          <ListItem lines={3}>
            <ListItemLeading variant="media">
              <img src="/favicon.svg" alt="Material artwork" />
            </ListItemLeading>
            <ListItemContent>
              <ListItemHeadline>Material collection</ListItemHeadline>
              <ListItemSupportingText>
                Supporting information can occupy up to two lines.
              </ListItemSupportingText>
            </ListItemContent>
            <ListItemTrailing>
              <Bell aria-hidden="true" />
            </ListItemTrailing>
          </ListItem>
        </ListSection>
        <ListSection aria-labelledby={controlsHeadingId}>
          <ListSubheader id={controlsHeadingId}>Controls</ListSubheader>
          <ListItem>
            <ListItemContent>
              <ListItemHeadline>Select updates</ListItemHeadline>
            </ListItemContent>
            <ListItemTrailing>
              <Checkbox aria-label="Select updates" />
            </ListItemTrailing>
          </ListItem>
          <ListItem>
            <ListItemContent>
              <ListItemHeadline>Daily notifications</ListItemHeadline>
            </ListItemContent>
            <ListItemTrailing>
              <RadioGroupItem aria-label="Daily notifications" value="daily" />
            </ListItemTrailing>
          </ListItem>
          <ListItem>
            <ListItemContent>
              <ListItemHeadline>Push notifications</ListItemHeadline>
            </ListItemContent>
            <ListItemTrailing>
              <Switch aria-label="Push notifications" />
            </ListItemTrailing>
          </ListItem>
        </ListSection>
      </List>
    </RadioGroup>
  )
}

/** Media, metadata, and the repository's existing controls compose in stable slots. */
export const SlotComposition: Story = {
  render: () => (
    <div className="w-full max-w-90">
      <CompleteList />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole("checkbox", { name: "Select updates" })
    const radio = canvas.getByRole("radio", { name: "Daily notifications" })
    const switchControl = canvas.getByRole("switch", { name: "Push notifications" })

    await expect(canvas.getByRole("img", { name: "Material artwork" })).toBeVisible()
    await expect(canvas.getByText("AR")).toBeVisible()
    await expect(canvas.getByText("24 files")).toBeVisible()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(radio).toBeChecked()
    await userEvent.click(switchControl)
    await expect(switchControl).toBeChecked()
  },
}

/** Keyboard focus is visible, and native disabled buttons leave the tab order. */
export const InteractionStates: Story = {
  render: () => (
    <div className="w-full max-w-90">
      <List aria-label="Interaction states">
        <ListItem render={<a href="#enabled" />}>
          <ListItemContent>
            <ListItemHeadline>Enabled link</ListItemHeadline>
          </ListItemContent>
        </ListItem>
        <ListItem render={<button type="button" disabled />}>
          <ListItemContent>
            <ListItemHeadline>Disabled action</ListItemHeadline>
          </ListItemContent>
        </ListItem>
        <ListItem render={<button type="button" />}>
          <ListItemContent>
            <ListItemHeadline>Enabled action</ListItemHeadline>
          </ListItemContent>
        </ListItem>
      </List>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole("link", { name: "Enabled link" })
    const disabled = canvas.getByRole("button", { name: "Disabled action" })
    const enabled = canvas.getByRole("button", { name: "Enabled action" })
    const isBrowserTest = import.meta.env.MODE === "test"

    await expect(disabled).toBeDisabled()
    if (isBrowserTest) {
      const { userEvent: browserUserEvent } = await import("vitest/browser")
      const restingBackground = getComputedStyle(enabled).backgroundColor

      await browserUserEvent.hover(enabled)
      await waitFor(() =>
        expect(getComputedStyle(enabled).backgroundColor).not.toBe(restingBackground),
      )
      await browserUserEvent.unhover(enabled)
    }
    await userEvent.tab()
    await waitFor(() => expect(link).toHaveFocus())
    if (isBrowserTest) {
      await expect(getComputedStyle(link).outlineWidth).toBe("3px")
    }
    await userEvent.tab()
    await waitFor(() => expect(enabled).toHaveFocus())
  },
}

/** Representative content and controls in both token-driven color schemes. */
export const LightAndDarkPresentation: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="w-full max-w-90">
      <CompleteList />
    </div>
  ),
}
