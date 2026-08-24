import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { Badge, Chip } from "@/index"

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
