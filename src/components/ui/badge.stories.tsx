import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon } from "lucide-react"

import { Badge } from "./badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge" },
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
