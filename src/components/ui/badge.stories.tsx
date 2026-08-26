import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon } from "lucide-react"
import { expect, within } from "storybook/test"

import { Badge } from "./badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge" },
  parameters: {
    docs: {
      description: {
        component:
          "Compatibility API for the Material chip visuals. New Material-specific code should import `Chip`; `Badge` remains available without rendering changes.",
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Material chip geometry: 32dp tall, small shape step, label-large type. */
export const Variants: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="tertiary">Tertiary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        <CheckIcon data-icon="inline-start" />
        Selected
      </Badge>
      <Badge variant="outline">
        <CheckIcon data-icon="inline-start" />
        Filter
      </Badge>
    </div>
  ),
}

const SIZES = [
  ["sm", 24, "Dense contexts — a status cell in a table row"],
  ["default", 32, "The Material chip height; unchanged from before sizes existed"],
  ["lg", 40, "Standalone emphasis — a plan name beside a heading"],
] as const

/**
 * Height alone is not a size. Padding, type, corner, and icon move with it, or
 * the small badge ends up with 16dp of padding around 11dp text and reads as a
 * mistake rather than as a smaller badge.
 */
export const Sizes: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      {SIZES.map(([size, , use]) => (
        <div key={size} className="flex items-center gap-m3-lg">
          <code className="text-m3-label-md text-muted-foreground w-20 shrink-0">
            {size}
          </code>
          <div className="flex items-center gap-m3-sm">
            <Badge size={size}>Badge</Badge>
            <Badge size={size} variant="secondary">
              <CheckIcon data-icon="inline-start" />
              With icon
            </Badge>
            <Badge size={size} variant="tertiary" aria-label="Verified">
              <CheckIcon />
            </Badge>
          </div>
          <span className="text-m3-body-sm text-muted-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!

    for (const [size, height] of SIZES) {
      const [badge] = canvas.getAllByText("Badge", {
        selector: `[data-slot="badge"][data-size="${size}"]`,
      })
      expect(view.getComputedStyle(badge).height, size).toBe(`${height}px`)

      // Text-free badges are square at every size: with no label to pad
      // around, the horizontal padding would leave a lozenge instead of the
      // shape the step was drawn for.
      const [iconOnly] = canvas.getAllByLabelText("Verified")
      const box = view.getComputedStyle(iconOnly)
      expect(box.width, `${size} icon-only`).toBe(box.height)
    }
  },
}
