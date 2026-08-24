import type { Meta, StoryObj } from "@storybook/react-vite"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** The fallback uses the primary-container pair, per M3's avatar guidance. */
export const Default: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex items-center gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src="" alt="" />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}
