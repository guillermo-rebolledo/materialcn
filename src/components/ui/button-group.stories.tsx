import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"

import { Button } from "./button"
import { ButtonGroup } from "./button-group"

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: { "aria-label": "Button group" },
  argTypes: {
    buttonVariant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "elevated",
        "outline",
        "ghost",
        "destructive",
      ],
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    shape: { control: "radio", options: ["round", "square"] },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl", "2xl"],
    },
    variant: { control: "radio", options: ["standard", "connected"] },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Related actions remain independent buttons rather than selectable segments. */
export const StandardActions: Story = {
  render: () => (
    <ButtonGroup
      {...({ role: "toolbar" } as Record<string, string>)}
      aria-label="Document actions"
    >
      <Button>Share</Button>
      <Button>Archive</Button>
      <Button>Delete</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole("group", { name: "Document actions" })
    const buttons = within(group).getAllByRole("button")

    await expect(buttons).toHaveLength(3)
    for (const button of buttons) {
      await expect(button.tagName).toBe("BUTTON")
      await expect(button).not.toHaveAttribute("aria-pressed")
    }
  },
}

/** Group defaults keep related buttons visually coherent without blocking overrides. */
export const GroupDefaults: Story = {
  render: () => (
    <ButtonGroup
      aria-label="Editor actions"
      buttonVariant="outline"
      shape="square"
      size="lg"
      variant="standard"
    >
      <Button>Format</Button>
      <Button shape="round" size="xs" variant="default">
        Publish
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const inherited = canvas.getByRole("button", { name: "Format" })
    const overridden = canvas.getByRole("button", { name: "Publish" })
    const inheritedStyle = getComputedStyle(inherited)
    const overriddenStyle = getComputedStyle(overridden)

    await expect(Math.round(inherited.getBoundingClientRect().height)).toBe(56)
    await expect(inheritedStyle.borderTopLeftRadius).toBe("16px")
    await expect(inheritedStyle.borderTopStyle).toBe("solid")
    await expect(inheritedStyle.borderTopColor).not.toBe("rgba(0, 0, 0, 0)")

    await expect(Math.round(overridden.getBoundingClientRect().height)).toBe(32)
    await expect(overriddenStyle.borderTopLeftRadius).toBe("16px")
    await expect(overriddenStyle.backgroundColor).not.toBe(
      inheritedStyle.backgroundColor,
    )
  },
}

/** Standard groups preserve the kit's touch-area spacing at every size. */
export const StandardSizesAndOrientations: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <ButtonGroup aria-label="Extra-small actions" size="xs">
        <Button>Cut</Button>
        <Button>Copy</Button>
      </ButtonGroup>
      <ButtonGroup
        aria-label="Small vertical actions"
        orientation="vertical"
        shape="square"
        size="sm"
      >
        <Button>Move up</Button>
        <Button>Move down</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Medium actions" size="lg">
        <Button>Accept</Button>
        <Button>Decline</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const extraSmall = canvas.getByRole("group", {
      name: "Extra-small actions",
    })
    const vertical = canvas.getByRole("group", {
      name: "Small vertical actions",
    })
    const medium = canvas.getByRole("group", { name: "Medium actions" })
    const extraSmallStyle = getComputedStyle(extraSmall)
    const verticalStyle = getComputedStyle(vertical)
    const mediumStyle = getComputedStyle(medium)

    await expect(extraSmallStyle.columnGap).toBe("18px")
    await expect(extraSmallStyle.paddingLeft).toBe("9px")
    await expect(extraSmallStyle.paddingRight).toBe("9px")
    await expect(Math.round(extraSmall.getBoundingClientRect().height)).toBe(48)
    await expect(
      getComputedStyle(within(extraSmall).getAllByRole("button")[0])
        .borderTopLeftRadius,
    ).toBe("16px")

    await expect(verticalStyle.flexDirection).toBe("column")
    await expect(verticalStyle.rowGap).toBe("12px")
    await expect(verticalStyle.paddingTop).toBe("6px")
    await expect(verticalStyle.paddingBottom).toBe("6px")
    await expect(
      getComputedStyle(within(vertical).getAllByRole("button")[0])
        .borderTopLeftRadius,
    ).toBe("12px")

    await expect(mediumStyle.columnGap).toBe("8px")
    await expect(Math.round(medium.getBoundingClientRect().height)).toBe(56)
  },
}

/** Connected groups coordinate first, middle, and last segment geometry. */
export const ConnectedGeometry: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <ButtonGroup
        aria-label="Horizontal view actions"
        size="lg"
        variant="connected"
      >
        <Button>List</Button>
        <Button>Grid</Button>
        <Button>Board</Button>
      </ButtonGroup>
      <ButtonGroup
        aria-label="Vertical alignment actions"
        orientation="vertical"
        shape="square"
        size="sm"
        variant="connected"
      >
        <Button>Start</Button>
        <Button>Center</Button>
        <Button>End</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const horizontal = canvas.getByRole("group", {
      name: "Horizontal view actions",
    })
    const vertical = canvas.getByRole("group", {
      name: "Vertical alignment actions",
    })
    const horizontalButtons = within(horizontal).getAllByRole("button")
    const verticalButtons = within(vertical).getAllByRole("button")
    const [first, middle, last] = horizontalButtons.map((button) =>
      getComputedStyle(button),
    )

    await expect(getComputedStyle(horizontal).display).toBe("grid")
    await expect(getComputedStyle(horizontal).columnGap).toBe("2px")
    await expect(horizontalButtons[0].getBoundingClientRect().width).toBe(
      horizontalButtons[1].getBoundingClientRect().width,
    )
    await expect(horizontalButtons[1].getBoundingClientRect().width).toBe(
      horizontalButtons[2].getBoundingClientRect().width,
    )
    await expect(first.borderTopLeftRadius).toBe("28px")
    await expect(first.borderTopRightRadius).toBe("8px")
    await expect(middle.borderTopLeftRadius).toBe("8px")
    await expect(middle.borderTopRightRadius).toBe("8px")
    await expect(last.borderTopLeftRadius).toBe("8px")
    await expect(last.borderTopRightRadius).toBe("28px")

    await expect(getComputedStyle(vertical).gridAutoFlow).toBe("row")
    await expect(getComputedStyle(vertical).rowGap).toBe("2px")
    for (const button of verticalButtons) {
      const style = getComputedStyle(button)
      await expect(style.borderTopLeftRadius).toBe("8px")
      await expect(style.borderTopRightRadius).toBe("8px")
      await expect(style.borderBottomLeftRadius).toBe("8px")
      await expect(style.borderBottomRightRadius).toBe("8px")
    }
  },
}

/** Connected actions soften their segment corners for interactive states. */
export const ConnectedStates: Story = {
  render: () => (
    <ButtonGroup
      aria-label="Workspace actions"
      shape="square"
      size="lg"
      variant="connected"
    >
      <Button>Rename</Button>
      <Button data-testid="connected-state-action">Move</Button>
      <Button disabled>Delete</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const enabled = canvas.getByRole("button", { name: "Move" })
    const disabled = canvas.getByRole("button", { name: "Delete" })

    await expect(getComputedStyle(enabled).borderTopLeftRadius).toBe("8px")
    await expect(disabled).toBeDisabled()

    if (import.meta.env.MODE !== "test") return

    const { commands, userEvent: browserUserEvent } = await import(
      "vitest/browser"
    )

    await browserUserEvent.hover(enabled)
    await waitFor(() =>
      expect(getComputedStyle(enabled).borderTopLeftRadius).toBe("16px"),
    )
    await browserUserEvent.unhover(enabled)

    await browserUserEvent.tab()
    await browserUserEvent.tab()
    await expect(enabled).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(enabled).borderTopLeftRadius).toBe("16px"),
    )
    await expect(getComputedStyle(enabled).zIndex).toBe("10")
    enabled.blur()

    await commands.holdPointer('[data-testid="connected-state-action"]')
    await waitFor(() =>
      expect(getComputedStyle(enabled).borderTopLeftRadius).toBe("16px"),
    )
    await commands.releasePointer()

    await expect(getComputedStyle(disabled).borderTopLeftRadius).toBe("8px")
  },
}

/** Connected groups preserve all five kit size tiers and their resting radii. */
export const ConnectedSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <ButtonGroup aria-label="Extra-small group" size="xs" variant="connected">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Small group" size="sm" variant="connected">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Medium group" size="lg" variant="connected">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Large group" size="xl" variant="connected">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
      <ButtonGroup
        aria-label="Extra-large group"
        size="2xl"
        variant="connected"
      >
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expectations = [
      ["Extra-small group", 48, 32, "4px"],
      ["Small group", 48, 40, "8px"],
      ["Medium group", 56, 56, "8px"],
      ["Large group", 96, 96, "16px"],
      ["Extra-large group", 136, 136, "20px"],
    ] as const

    for (const [name, groupHeight, buttonHeight, innerRadius] of expectations) {
      const group = canvas.getByRole("group", { name })
      const middleEdge = within(group).getAllByRole("button")[0]

      await expect(Math.round(group.getBoundingClientRect().height)).toBe(groupHeight)
      await expect(Math.round(middleEdge.getBoundingClientRect().height)).toBe(buttonHeight)
      await expect(getComputedStyle(middleEdge).borderTopRightRadius).toBe(
        innerRadius,
      )
    }
  },
}

/** One, two, and four actions retain valid connected edge geometry. */
export const ItemCounts: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <ButtonGroup aria-label="One action" size="sm" variant="connected">
        <Button>Done</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Two actions" size="sm" variant="connected">
        <Button>Back</Button>
        <Button>Next</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Four actions" size="sm" variant="connected">
        <Button>Cut</Button>
        <Button>Copy</Button>
        <Button>Paste</Button>
        <Button>Delete</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const one = within(canvas.getByRole("group", { name: "One action" }))
    const two = within(canvas.getByRole("group", { name: "Two actions" }))
    const four = within(canvas.getByRole("group", { name: "Four actions" }))
    const singleStyle = getComputedStyle(one.getByRole("button"))

    await expect(one.getAllByRole("button")).toHaveLength(1)
    await expect(two.getAllByRole("button")).toHaveLength(2)
    await expect(four.getAllByRole("button")).toHaveLength(4)
    await expect(singleStyle.borderTopLeftRadius).toBe("20px")
    await expect(singleStyle.borderTopRightRadius).toBe("20px")
    await expect(singleStyle.borderBottomLeftRadius).toBe("20px")
    await expect(singleStyle.borderBottomRightRadius).toBe("20px")
  },
}

/** Token-driven Buttons preserve connected roles and disabled colors in both themes. */
export const SurfaceContexts: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <span
        className="absolute size-0 bg-m3-secondary-container"
        data-testid="secondary-container-role"
      />
      <span
        className="absolute size-0 text-m3-on-secondary-container"
        data-testid="on-secondary-container-role"
      />
      <ButtonGroup
        aria-label="Connected theme actions"
        size="sm"
        variant="connected"
      >
        <Button>Save</Button>
        <Button disabled>Discard</Button>
      </ButtonGroup>
      <ButtonGroup
        aria-label="Standard theme actions"
        buttonVariant="outline"
        size="sm"
      >
        <Button>Previous</Button>
        <Button>Next</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const connectedGroups = canvas.getAllByRole("group", {
      name: "Connected theme actions",
    })
    const containerRoles = canvas.getAllByTestId("secondary-container-role")
    const contentRoles = canvas.getAllByTestId("on-secondary-container-role")

    for (const index of [0, 1]) {
      const enabled = within(connectedGroups[index]).getByRole("button", {
        name: "Save",
      })
      const disabled = within(connectedGroups[index]).getByRole("button", {
        name: "Discard",
      })
      const style = getComputedStyle(enabled)

      await expect(style.backgroundColor).toBe(
        getComputedStyle(containerRoles[index]).backgroundColor,
      )
      await expect(style.color).toBe(getComputedStyle(contentRoles[index]).color)
      await expect(disabled).toBeDisabled()
    }

    await expect(
      getComputedStyle(
        within(connectedGroups[0]).getByRole("button", { name: "Save" }),
      ).backgroundColor,
    ).not.toBe(
      getComputedStyle(
        within(connectedGroups[1]).getByRole("button", { name: "Save" }),
      ).backgroundColor,
    )
  },
}
