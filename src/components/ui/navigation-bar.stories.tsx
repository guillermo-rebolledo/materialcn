import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
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

function ControlledNavigation({ itemLayout, orientation = "horizontal" }: { itemLayout?: "stacked" | "inline"; orientation?: "horizontal" | "vertical" }) {
  const [value, setValue] = useState("home")
  return (
    <>
      <NavigationBar value={value} onValueChange={setValue} orientation={orientation} itemLayout={itemLayout} aria-label="Primary navigation">
        <NavigationBarItem value="home" label="Home" href="#home" icon={<HomeIcon />} />
        <NavigationBarItem value="favorites" label="Favorites" icon={<HeartIcon />} />
        <NavigationBarItem value="messages" label="Messages" icon={<MailIcon />} badge={<NotificationBadge aria-label="3 unread messages" value={3} />} />
        <NavigationBarItem value="settings" label="Settings" icon={<SettingsIcon />} disabled />
      </NavigationBar>
      <output aria-label="Current destination">{value}</output>
    </>
  )
}

function FallbackNavigation() {
  const [homeDisabled, setHomeDisabled] = useState(false)
  return (
    <>
      <NavigationBar value="missing" onValueChange={() => undefined}>
        <NavigationBarItem value="home" label="Home" icon={<HomeIcon />} disabled={homeDisabled} />
        <NavigationBarItem value="favorites" label="Favorites" icon={<HeartIcon />} />
      </NavigationBar>
      <button type="button" onClick={() => setHomeDisabled(true)}>Disable home</button>
    </>
  )
}

export const ControlledLinksAndKeyboard: Story = {
  render: () => <div className="w-[412px] max-w-full"><ControlledNavigation /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const home = canvas.getByRole("link", { name: /Home/ })
    await expect(home).toHaveAttribute("aria-current", "page")
    await expect(home).toHaveAttribute("tabindex", "0")
    await expect(canvas.getByRole("button", { name: /Favorites/ })).toHaveAttribute("tabindex", "-1")
    home.focus()
    await userEvent.keyboard("{ArrowRight}{Enter}")
    await expect(home).toHaveAttribute("tabindex", "-1")
    await expect(canvas.getByRole("button", { name: /Favorites/ })).toHaveAttribute("tabindex", "0")
    await expect(canvas.getByLabelText("Current destination")).toHaveTextContent("favorites")
    await userEvent.keyboard("{End}")
    await waitFor(() => expect(canvas.getByRole("button", { name: /Messages/ })).toHaveFocus())
  },
}

export const OrientationsAndCounts: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div className="w-[412px]"><ControlledNavigation /></div>
      <div className="w-[440px]"><ControlledNavigation itemLayout="inline" /></div>
      <ControlledNavigation orientation="vertical" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll<HTMLElement>('[data-slot="navigation-bar"][data-orientation="horizontal"]')
    for (const bar of bars) await expect(Math.round(bar.getBoundingClientRect().height)).toBe(64)
    const indicator = bars[0].querySelector<HTMLElement>('[data-slot="navigation-bar-indicator"]')!.getBoundingClientRect()
    await expect(indicator.width).toBe(56)
    await expect(indicator.height).toBe(32)
    const inline = bars[1].querySelector<HTMLElement>('[data-slot="navigation-bar-indicator"]')!.getBoundingClientRect()
    await expect(inline.height).toBe(40)
  },
}

export const MissingAndDisabledFallback: Story = {
  render: () => <FallbackNavigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const home = canvas.getByRole("button", { name: /Home/ })
    const favorites = canvas.getByRole("button", { name: /Favorites/ })
    await expect(home).toHaveAttribute("tabindex", "0")
    await userEvent.click(canvas.getByRole("button", { name: "Disable home" }))
    await waitFor(() => expect(favorites).toHaveAttribute("tabindex", "0"))
  },
}
