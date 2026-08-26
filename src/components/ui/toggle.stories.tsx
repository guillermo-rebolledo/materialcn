import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { BoldIcon, StarIcon } from "lucide-react"

import { Icon } from "./icon"
import { Toggle } from "./toggle"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: { children: "Bold" },
  parameters: {
    docs: {
      description: {
        component:
          "A two-state button. Material's toggle swaps both colour and shape when selected — use `ToggleGroup` when the options are mutually exclusive.",
      },
    },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function DefaultStory() {
    const [pressed, setPressed] = useState(false)
    return (
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        <Icon size="sm">
          <BoldIcon />
        </Icon>
        Bold
      </Toggle>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: "Bold" })

    expect(toggle).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-pressed", "true")
  },
}

/**
 * Selection changes the shape as well as the colour. That is deliberate in
 * Material: a state you can only see by colour is a state a colourblind user
 * cannot see at all.
 */
export const Variants: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      {(["default", "outline"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-m3-lg">
          <code className="text-m3-label-md text-muted-foreground w-20 shrink-0">
            {variant}
          </code>
          <Toggle variant={variant}>Off</Toggle>
          <Toggle variant={variant} defaultPressed>
            On
          </Toggle>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-m3-md">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Toggle key={size} size={size} defaultPressed>
          <Icon size={size === "lg" ? "md" : "sm"}>
            <StarIcon />
          </Icon>
          {size}
        </Toggle>
      ))}
    </div>
  ),
}

/** Round toggles settle to a corner when selected; square ones go the other way. */
export const Shapes: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex items-center gap-m3-md">
      {(["round", "square"] as const).map((shape) => (
        <Toggle key={shape} shape={shape} defaultPressed>
          {shape}
        </Toggle>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-m3-md">
      <Toggle disabled>Off</Toggle>
      <Toggle disabled defaultPressed>
        On
      </Toggle>
    </div>
  ),
}
