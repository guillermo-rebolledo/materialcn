import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bell, Mail } from "lucide-react"
import { expect, within } from "storybook/test"

import { NotificationBadge, NotificationBadgeAnchor } from "@/index"

const meta = {
  title: "Components/Notification Badge",
  component: NotificationBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Material notification badges communicate an unread state or count without reusing the chip-shaped `Badge` compatibility API.",
      },
    },
  },
} satisfies Meta<typeof NotificationBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Standalone: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex items-center gap-4">
      <NotificationBadge data-testid="notification-dot" />
      <NotificationBadge aria-label="7 unread notifications" value={7} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dots = canvas.getAllByTestId("notification-dot")
    const counts = canvas.getAllByRole("status", {
      name: "7 unread notifications",
    })

    await expect(dots).toHaveLength(2)
    await expect(dots[0]).toHaveAttribute("aria-hidden", "true")
    await expect(Math.round(dots[0].getBoundingClientRect().width)).toBe(6)
    await expect(Math.round(dots[0].getBoundingClientRect().height)).toBe(6)

    await expect(counts).toHaveLength(2)
    await expect(counts[0]).toHaveTextContent("7")
    await expect(Math.round(counts[0].getBoundingClientRect().width)).toBe(16)
    await expect(Math.round(counts[0].getBoundingClientRect().height)).toBe(16)
  },
}

export const NumericCounts: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex items-center gap-4">
      <NotificationBadge aria-label="12 unread notifications" value={12} />
      <NotificationBadge aria-label="125 unread notifications" value={125} />
      <NotificationBadge
        aria-label="12 urgent notifications"
        max={9}
        value={12}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const twoDigits = canvas.getAllByRole("status", {
      name: "12 unread notifications",
    })[0]
    const defaultOverflow = canvas.getAllByRole("status", {
      name: "125 unread notifications",
    })[0]
    const customOverflow = canvas.getAllByRole("status", {
      name: "12 urgent notifications",
    })[0]

    await expect(twoDigits).toHaveTextContent("12")
    await expect(Math.round(twoDigits.getBoundingClientRect().width)).toBeGreaterThanOrEqual(
      22
    )
    await expect(Math.round(twoDigits.getBoundingClientRect().height)).toBe(16)
    await expect(defaultOverflow).toHaveTextContent("99+")
    await expect(customOverflow).toHaveTextContent("9+")
  },
}

export const IconPlacement: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex items-center gap-8">
      <NotificationBadgeAnchor data-testid="dot-anchor">
        <Bell aria-hidden="true" />
        <NotificationBadge data-testid="anchored-dot" />
      </NotificationBadgeAnchor>
      <NotificationBadgeAnchor data-testid="count-anchor">
        <Mail aria-hidden="true" />
        <NotificationBadge aria-label="7 unread messages" value={7} />
      </NotificationBadgeAnchor>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dotAnchor = canvas.getAllByTestId("dot-anchor")[0]
    const dot = canvas.getAllByTestId("anchored-dot")[0]
    const countAnchor = canvas.getAllByTestId("count-anchor")[0]
    const count = canvas.getAllByRole("status", {
      name: "7 unread messages",
    })[0]
    const dotAnchorBounds = dotAnchor.getBoundingClientRect()
    const dotBounds = dot.getBoundingClientRect()
    const countAnchorBounds = countAnchor.getBoundingClientRect()
    const countBounds = count.getBoundingClientRect()

    await expect(dotAnchorBounds.width).toBe(24)
    await expect(dotAnchorBounds.height).toBe(24)
    await expect(dotBounds.right).toBe(dotAnchorBounds.right)
    await expect(dotBounds.top).toBe(dotAnchorBounds.top)
    await expect(countBounds.right).toBe(countAnchorBounds.right)
    await expect(countBounds.top).toBe(countAnchorBounds.top)
  },
}
