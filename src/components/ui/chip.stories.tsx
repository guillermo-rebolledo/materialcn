import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRight, Plus, UserRound } from "lucide-react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  AssistChip,
  Badge,
  Chip,
  FilterChip,
  InputChip,
  SuggestionChip,
  ToggleGroup,
} from "@/index"

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "Chip" },
  parameters: {
    docs: {
      description: {
        component:
          "Material's 32dp chip. `Badge` remains available as a compatibility name for the same visuals while consumers migrate to `Chip`.",
      },
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

const variants = [
  "default",
  "secondary",
  "tertiary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const

export const Default: Story = {}

function ActionChipExample() {
  const [lastAction, setLastAction] = useState("None")

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-2">
        <AssistChip onClick={() => setLastAction("Added to calendar")}>
          <Plus data-icon="inline-start" />
          Add to calendar
        </AssistChip>
        <AssistChip disabled>Disabled assist</AssistChip>
        <SuggestionChip onClick={() => setLastAction("More shown")}>
          Show more
          <ArrowRight data-icon="inline-end" />
        </SuggestionChip>
        <SuggestionChip disabled>Disabled suggestion</SuggestionChip>
      </div>
      <output aria-live="polite">Last action: {lastAction}</output>
    </div>
  )
}

export const ActionChips: Story = {
  render: () => <ActionChipExample />,
  parameters: { sideBySide: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const assistChips = canvas.getAllByRole("button", {
      name: "Add to calendar",
    })
    const suggestionChips = canvas.getAllByRole("button", {
      name: "Show more",
    })
    const disabledAssistChips = canvas.getAllByRole("button", {
      name: "Disabled assist",
    })
    const disabledSuggestionChips = canvas.getAllByRole("button", {
      name: "Disabled suggestion",
    })

    await expect(assistChips).toHaveLength(2)
    await expect(suggestionChips).toHaveLength(2)
    await expect(disabledAssistChips[0]).toBeDisabled()
    await expect(disabledSuggestionChips[0]).toBeDisabled()
    await expect(assistChips[0]).toHaveAttribute("type", "button")
    await expect(suggestionChips[0]).toHaveAttribute("type", "button")
    await userEvent.click(assistChips[0])
    await expect(canvas.getAllByText("Last action: Added to calendar")[0]).toBeVisible()
    await userEvent.click(suggestionChips[0])
    await expect(canvas.getAllByText("Last action: More shown")[0]).toBeVisible()
  },
}

export const FilterChips: Story = {
  render: () => (
    <ToggleGroup
      aria-label="Dietary preferences"
      defaultValue={["vegetarian"]}
      multiple
    >
      <FilterChip value="vegetarian">Vegetarian</FilterChip>
      <FilterChip value="dairy-free">Dairy-free</FilterChip>
      <FilterChip disabled value="gluten-free">
        Gluten-free
      </FilterChip>
    </ToggleGroup>
  ),
  parameters: { sideBySide: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const vegetarian = canvas.getAllByRole("button", {
      name: "Vegetarian",
    })[0]
    const dairyFree = canvas.getAllByRole("button", {
      name: "Dairy-free",
    })[0]
    const glutenFree = canvas.getAllByRole("button", {
      name: "Gluten-free",
    })[0]

    await expect(vegetarian).toHaveAttribute("aria-pressed", "true")
    await expect(dairyFree).toHaveAttribute("aria-pressed", "false")
    await expect(glutenFree).toBeDisabled()

    vegetarian.focus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(dairyFree).toHaveFocus())
    await userEvent.keyboard(" ")
    await expect(dairyFree).toHaveAttribute("aria-pressed", "true")
    await expect(vegetarian).toHaveAttribute("aria-pressed", "true")
  },
}

function InputChipExample() {
  const [removed, setRemoved] = useState(false)

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-2">
        {!removed && (
          <InputChip
            onRemove={() => setRemoved(true)}
            removeLabel="Remove Ada Lovelace"
          >
            <UserRound data-icon="inline-start" />
            Ada Lovelace
          </InputChip>
        )}
        <InputChip
          disabled
          onRemove={() => undefined}
          removeLabel="Remove disabled label"
        >
          Disabled label
        </InputChip>
        <InputChip>Read only</InputChip>
      </div>
      <output aria-live="polite">
        {removed ? "Ada Lovelace removed" : "No labels removed"}
      </output>
    </div>
  )
}

export const InputChips: Story = {
  render: () => <InputChipExample />,
  parameters: { sideBySide: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const removeButtons = canvas.getAllByRole("button", {
      name: "Remove Ada Lovelace",
    })
    const disabledRemoveButtons = canvas.getAllByRole("button", {
      name: "Remove disabled label",
    })

    await expect(removeButtons).toHaveLength(2)
    await expect(disabledRemoveButtons[0]).toBeDisabled()
    removeButtons[0].focus()
    await userEvent.keyboard("{Enter}")
    await expect(canvas.getAllByText("Ada Lovelace removed")[0]).toBeVisible()
    await expect(canvas.getAllByText("Ada Lovelace")).toHaveLength(1)
  },
}

/**
 * `Badge` remains a compatibility name for the chip visuals until consumers
 * have migrated to the Material-specific `Chip` name.
 */
export const LegacyBadgeCompatibility: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {variants.map((variant) => (
        <div className="flex items-center gap-2" key={variant}>
          <Chip data-testid={`chip-${variant}`} variant={variant}>
            Current API
          </Chip>
          <Badge data-testid={`badge-${variant}`} variant={variant}>
            Legacy API
          </Badge>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const variant of variants) {
      const chip = canvas.getByTestId(`chip-${variant}`)
      const badge = canvas.getByTestId(`badge-${variant}`)

      await expect(chip.className).toBe(badge.className)
    }
  },
}
