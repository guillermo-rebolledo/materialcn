import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { HeartIcon, HomeIcon, MailIcon, SettingsIcon } from "lucide-react"

import { NavigationBar, NavigationBarItem } from "./navigation-bar"
import { NotificationBadge } from "./notification-badge"

const meta = {
  title: "Components/NavigationBar",
  component: NavigationBar,
  tags: ["autodocs"],
  args: { value: "home", onValueChange: () => undefined },
} satisfies Meta<typeof NavigationBar>
export default meta
type Story = StoryObj<typeof meta>

function ControlledNavigation({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  const [value, setValue] = useState("home")
  return (
    <>
      <NavigationBar value={value} onValueChange={setValue} orientation={orientation} aria-label="Primary navigation">
        <NavigationBarItem value="home" label="Home" href="#home" icon={<HomeIcon />} />
        <NavigationBarItem value="favorites" label="Favorites" icon={<HeartIcon />} />
        <NavigationBarItem value="messages" label="Messages" icon={<MailIcon />} badge={<NotificationBadge aria-label="3 unread messages" value={3} />} />
        <NavigationBarItem value="settings" label="Settings" icon={<SettingsIcon />} disabled />
      </NavigationBar>
      <output aria-label="Current destination">{value}</output>
    </>
  )
}

export const ControlledLinksAndKeyboard: Story = {
  render: () => <div className="w-[412px] max-w-full"><ControlledNavigation /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const home = canvas.getByRole("link", { name: /Home/ })
    await expect(home).toHaveAttribute("aria-current", "page")
    home.focus()
    await userEvent.keyboard("{ArrowRight}{Enter}")
    await expect(canvas.getByLabelText("Current destination")).toHaveTextContent("favorites")
    await userEvent.keyboard("{End}")
    await expect(canvas.getByRole("button", { name: /Messages/ })).toHaveFocus()
  },
}

export const OrientationsAndCounts: Story = {
  parameters: { sideBySide: true },
  render: () => <div className="flex items-start gap-6"><div className="w-[412px]"><ControlledNavigation /></div><ControlledNavigation orientation="vertical" /></div>,
}
