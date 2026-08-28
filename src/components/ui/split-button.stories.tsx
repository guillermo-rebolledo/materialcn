import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { PlusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./dropdown-menu"
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonTrigger,
} from "./split-button"

const meta = {
  title: "Components/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  args: { "aria-label": "Split button" },
  argTypes: {
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl", "2xl"],
    },
    variant: {
      control: "radio",
      options: ["default", "tonal", "outline", "elevated"],
    },
  },
} satisfies Meta<typeof SplitButton>

export default meta
type Story = StoryObj<typeof meta>

function IndependentActionsExample() {
  const [primaryCount, setPrimaryCount] = useState(0)

  return (
    <div className="flex flex-col items-start gap-4">
      <SplitButton aria-label="Create actions">
        <SplitButtonAction onClick={() => setPrimaryCount((count) => count + 1)}>
          <PlusIcon aria-hidden="true" data-icon="inline-start" />
          Create
        </SplitButtonAction>
        <DropdownMenu>
          <SplitButtonTrigger aria-label="More create actions" />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Create folder</DropdownMenuItem>
              <DropdownMenuItem>Import file</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>
      <output aria-live="polite">Created {primaryCount} times</output>
    </div>
  )
}

/** The primary segment acts immediately; only the trailing segment owns the menu. */
export const PrimaryAndMenuActions: Story = {
  render: () => <IndependentActionsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const group = canvas.getByRole("group", { name: "Create actions" })
    const primary = within(group).getByRole("button", { name: "Create" })
    const trigger = within(group).getByRole("button", {
      name: "More create actions",
    })

    await userEvent.click(primary)
    await expect(canvas.getByText("Created 1 times")).toBeVisible()
    await expect(page.queryByRole("menu")).not.toBeInTheDocument()

    await userEvent.click(trigger)
    await waitFor(() => expect(page.getByRole("menu")).toBeVisible())
    await expect(
      within(page.getByRole("menu")).getByRole("menuitem", {
        name: "Create folder",
      }),
    ).toBeVisible()
  },
}

function KeyboardLifecycleExample() {
  const [lastAction, setLastAction] = useState("No action yet")

  return (
    <div className="flex flex-col items-start gap-4">
      <SplitButton aria-label="Publish actions">
        <SplitButtonAction onClick={() => setLastAction("Published now")}>
          Publish
        </SplitButtonAction>
        <DropdownMenu>
          <SplitButtonTrigger aria-label="More publish actions" />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setLastAction("Scheduled")}>
                Schedule
              </DropdownMenuItem>
              <DropdownMenuItem>Save draft</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>
      <output aria-live="polite">{lastAction}</output>
    </div>
  )
}

/** Keyboard users can invoke either segment and regain the menu trigger on close. */
export const KeyboardLifecycle: Story = {
  render: () => <KeyboardLifecycleExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const primary = canvas.getByRole("button", { name: "Publish" })
    const trigger = canvas.getByRole("button", {
      name: "More publish actions",
    })

    primary.focus()
    await userEvent.keyboard("{Enter}")
    await expect(canvas.getByText("Published now")).toBeVisible()
    await expect(page.queryByRole("menu")).not.toBeInTheDocument()

    await userEvent.tab()
    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    const menu = await page.findByRole("menu")
    const schedule = within(menu).getByRole("menuitem", { name: "Schedule" })
    await waitFor(() => expect(schedule).toHaveFocus())

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("menu")).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())

    await userEvent.keyboard("{Enter}")
    await page.findByRole("menu")
    await userEvent.keyboard("{Enter}")
    await expect(canvas.getByText("Scheduled")).toBeVisible()
    await waitFor(() => expect(page.queryByRole("menu")).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

function DisabledExample() {
  const [primaryCount, setPrimaryCount] = useState(0)

  return (
    <div className="flex flex-col items-start gap-4">
      <SplitButton aria-label="Disabled export actions" disabled>
        <SplitButtonAction onClick={() => setPrimaryCount((count) => count + 1)}>
          Export
        </SplitButtonAction>
        <DropdownMenu>
          <SplitButtonTrigger aria-label="More export actions" />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Export PDF</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>
      <output aria-live="polite">Exported {primaryCount} times</output>
    </div>
  )
}

/** Disabling the split control prevents both the immediate and menu actions. */
export const Disabled: Story = {
  render: () => <DisabledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const primary = canvas.getByRole("button", { name: "Export" })
    const trigger = canvas.getByRole("button", { name: "More export actions" })

    await expect(primary).toBeDisabled()
    await expect(trigger).toBeDisabled()
    primary.click()
    trigger.click()
    await expect(canvas.getByText("Exported 0 times")).toBeVisible()
    await expect(page.queryByRole("menu")).not.toBeInTheDocument()
  },
}

type GeometrySize = "xs" | "sm" | "lg" | "xl" | "2xl"

function GeometrySplitButton({ size }: { size: GeometrySize }) {
  return (
    <SplitButton aria-label={`${size} add actions`} size={size}>
      <SplitButtonAction>
        <PlusIcon aria-hidden="true" data-icon="inline-start" />
        Add
      </SplitButtonAction>
      <DropdownMenu>
        <SplitButtonTrigger aria-label={`More ${size} add actions`} />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Add file</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SplitButton>
  )
}

/** All five size tiers use the kit's touch targets and asymmetric segments. */
export const SizesAndGeometry: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <GeometrySplitButton size="xs" />
      <GeometrySplitButton size="sm" />
      <GeometrySplitButton size="lg" />
      <GeometrySplitButton size="xl" />
      <GeometrySplitButton size="2xl" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expectations = [
      ["xs", 48, 32, 48, "16px", "4px", "4px", "12px", 20, 22],
      ["sm", 48, 40, 48, "20px", "4px", "8px", "16px", 20, 22],
      ["lg", 56, 56, 56, "28px", "4px", "8px", "24px", 24, 26],
      ["xl", 96, 96, 96, "48px", "8px", "12px", "48px", 32, 38],
      ["2xl", 136, 136, 136, "68px", "12px", "16px", "64px", 40, 50],
    ] as const

    for (const [
      size,
      groupHeight,
      buttonHeight,
      triggerWidth,
      outerRadius,
      innerRadius,
      actionGap,
      actionPadding,
      actionIconSize,
      triggerIconSize,
    ] of expectations) {
      const group = canvas.getByRole("group", { name: `${size} add actions` })
      const action = within(group).getByRole("button", { name: "Add" })
      const trigger = within(group).getByRole("button", {
        name: `More ${size} add actions`,
      })
      const actionStyle = getComputedStyle(action)
      const triggerStyle = getComputedStyle(trigger)
      const actionIcon = action.querySelector("svg")
      const triggerIcon = trigger.querySelector("svg")

      await expect(getComputedStyle(group).columnGap).toBe("2px")
      await expect(group.getBoundingClientRect().height).toBe(groupHeight)
      await expect(action.getBoundingClientRect().height).toBe(buttonHeight)
      await expect(trigger.getBoundingClientRect().width).toBe(triggerWidth)
      await expect(actionStyle.borderTopLeftRadius).toBe(outerRadius)
      await expect(actionStyle.borderTopRightRadius).toBe(innerRadius)
      await expect(triggerStyle.borderTopLeftRadius).toBe(innerRadius)
      await expect(triggerStyle.borderTopRightRadius).toBe(outerRadius)
      await expect(actionStyle.columnGap).toBe(actionGap)
      await expect(actionStyle.paddingLeft).toBe(actionPadding)
      await expect(actionStyle.paddingRight).toBe(actionPadding)
      await expect(actionIcon?.getBoundingClientRect().width).toBe(actionIconSize)
      await expect(triggerIcon?.getBoundingClientRect().width).toBe(
        triggerIconSize,
      )
    }
  },
}

/** Hover, press, focus, and menu-open states use independent segment shapes. */
export const InteractiveShapes: Story = {
  render: () => (
    <SplitButton aria-label="Insert actions" size="lg">
      <SplitButtonAction data-testid="split-action">Insert</SplitButtonAction>
      <DropdownMenu>
        <SplitButtonTrigger
          aria-label="More insert actions"
          data-testid="split-trigger"
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Insert page</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SplitButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const action = canvas.getByRole("button", { name: "Insert" })
    const trigger = canvas.getByRole("button", { name: "More insert actions" })

    await expect(getComputedStyle(action).borderTopRightRadius).toBe("4px")
    await expect(getComputedStyle(trigger).borderTopLeftRadius).toBe("4px")

    if (import.meta.env.MODE !== "test") return

    const { commands, userEvent: browserUserEvent } = await import(
      "vitest/browser"
    )

    await browserUserEvent.hover(action)
    await waitFor(() =>
      expect(getComputedStyle(action).borderTopRightRadius).toBe("12px"),
    )
    await browserUserEvent.unhover(action)
    await waitFor(() =>
      expect(getComputedStyle(action).borderTopRightRadius).toBe("4px"),
    )

    await browserUserEvent.tab()
    await expect(action).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(action).borderTopRightRadius).toBe("4px"),
    )
    await expect(getComputedStyle(action).zIndex).toBe("10")
    action.blur()

    await commands.holdPointer('[data-testid="split-action"]')
    await waitFor(() =>
      expect(getComputedStyle(action).borderTopRightRadius).toBe("12px"),
    )
    await commands.releasePointer()
    await expect(getComputedStyle(action).borderTopRightRadius).toBe("12px")
    await browserUserEvent.unhover(action)
    await waitFor(() =>
      expect(getComputedStyle(action).borderTopRightRadius).toBe("4px"),
    )

    await browserUserEvent.hover(trigger)
    await waitFor(() =>
      expect(getComputedStyle(trigger).borderTopLeftRadius).toBe("12px"),
    )
    await browserUserEvent.unhover(trigger)
    await waitFor(() =>
      expect(getComputedStyle(trigger).borderTopLeftRadius).toBe("4px"),
    )

    await commands.holdPointer('[data-testid="split-trigger"]')
    await waitFor(() =>
      expect(getComputedStyle(trigger).borderTopLeftRadius).toBe("12px"),
    )
    await commands.releasePointer()
    await page.findByRole("menu")
    await browserUserEvent.unhover(trigger)
    await expect(trigger).toHaveAttribute("data-popup-open")
    await waitFor(() =>
      expect(getComputedStyle(trigger).borderTopLeftRadius).toBe("28px"),
    )
    await expect(getComputedStyle(trigger).borderTopRightRadius).toBe("28px")

    await browserUserEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("menu")).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
    await waitFor(() =>
      expect(getComputedStyle(trigger).borderTopLeftRadius).toBe("4px"),
    )
    await expect(getComputedStyle(trigger).zIndex).toBe("10")
  },
}

function PresentationSplitButton({
  label,
  variant,
}: {
  label: string
  variant: "default" | "tonal" | "outline" | "elevated"
}) {
  return (
    <SplitButton aria-label={`${label} actions`} size="sm" variant={variant}>
      <SplitButtonAction>
        <PlusIcon aria-hidden="true" data-icon="inline-start" />
        {label}
      </SplitButtonAction>
      <DropdownMenu>
        <SplitButtonTrigger aria-label={`More ${label.toLowerCase()} actions`} />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>{label} later</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SplitButton>
  )
}

/** Filled, tonal, outlined, and elevated colors stay token-driven in both themes. */
export const VariantsAndThemes: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <span
        className="absolute size-0 bg-m3-primary"
        data-testid="primary-role"
      />
      <span
        className="absolute size-0 bg-m3-secondary-container"
        data-testid="secondary-container-role"
      />
      <span
        className="absolute size-0 bg-m3-surface-container-low"
        data-testid="surface-container-low-role"
      />
      <span
        className="absolute size-0 border border-m3-outline-variant"
        data-testid="outline-variant-role"
      />
      <PresentationSplitButton label="Create" variant="default" />
      <PresentationSplitButton label="Compose" variant="tonal" />
      <PresentationSplitButton label="Upload" variant="outline" />
      <PresentationSplitButton label="Add" variant="elevated" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primaryRoles = canvas.getAllByTestId("primary-role")
    const secondaryRoles = canvas.getAllByTestId("secondary-container-role")
    const surfaceRoles = canvas.getAllByTestId("surface-container-low-role")
    const outlineRoles = canvas.getAllByTestId("outline-variant-role")
    const filledGroups = canvas.getAllByRole("group", { name: "Create actions" })
    const tonalGroups = canvas.getAllByRole("group", { name: "Compose actions" })
    const outlinedGroups = canvas.getAllByRole("group", { name: "Upload actions" })
    const elevatedGroups = canvas.getAllByRole("group", { name: "Add actions" })

    for (const index of [0, 1]) {
      const filled = within(filledGroups[index]).getByRole("button", {
        name: "Create",
      })
      const tonal = within(tonalGroups[index]).getByRole("button", {
        name: "Compose",
      })
      const outlined = within(outlinedGroups[index]).getByRole("button", {
        name: "Upload",
      })
      const elevated = within(elevatedGroups[index]).getByRole("button", {
        name: "Add",
      })

      await expect(getComputedStyle(filled).backgroundColor).toBe(
        getComputedStyle(primaryRoles[index]).backgroundColor,
      )
      await expect(getComputedStyle(tonal).backgroundColor).toBe(
        getComputedStyle(secondaryRoles[index]).backgroundColor,
      )
      await expect(getComputedStyle(outlined).borderTopColor).toBe(
        getComputedStyle(outlineRoles[index]).borderTopColor,
      )
      await expect(getComputedStyle(elevated).backgroundColor).toBe(
        getComputedStyle(surfaceRoles[index]).backgroundColor,
      )
      await expect(getComputedStyle(elevated).boxShadow).not.toBe("none")
    }

    await expect(
      getComputedStyle(
        within(filledGroups[0]).getByRole("button", { name: "Create" }),
      ).backgroundColor,
    ).not.toBe(
      getComputedStyle(
        within(filledGroups[1]).getByRole("button", { name: "Create" }),
      ).backgroundColor,
    )
  },
}
