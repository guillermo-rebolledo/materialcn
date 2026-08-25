import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { HeartIcon, HomeIcon, MailIcon, MenuIcon, PlusIcon } from "lucide-react"

import { Button } from "./button"
import { FAB } from "./fab"
import { NavigationRail, NavigationRailDestinations, NavigationRailFAB, NavigationRailItem, NavigationRailMenu } from "./navigation-rail"
import { NotificationBadge } from "./notification-badge"

const meta = {
  title: "Components/NavigationRail",
  component: NavigationRail,
  tags: ["autodocs"],
  args: { value: "home", onValueChange: () => undefined },
} satisfies Meta<typeof NavigationRail>
export default meta
type Story = StoryObj<typeof meta>

function CompactRail() {
  const [value, setValue] = useState("home")
  return (
    <>
      <NavigationRail value={value} onValueChange={setValue} aria-label="Workspace navigation">
        <NavigationRailMenu><Button aria-label="Menu" size="icon" variant="ghost"><MenuIcon /></Button></NavigationRailMenu>
        <NavigationRailFAB><FAB aria-label="Create" size="small"><PlusIcon /></FAB></NavigationRailFAB>
        <NavigationRailDestinations>
          <NavigationRailItem value="home" label="Home" icon={<HomeIcon />} href="#home" />
          <NavigationRailItem value="favorites" label="Favorites" icon={<HeartIcon />} />
          <NavigationRailItem value="messages" label="Messages" icon={<MailIcon />} badge={<NotificationBadge />} />
        </NavigationRailDestinations>
      </NavigationRail>
      <output aria-label="Rail destination">{value}</output>
    </>
  )
}

export const CompactInteraction: Story = {
  render: () => <div className="h-[640px]"><CompactRail /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const home = canvas.getByRole("link", { name: /Home/ })
    await expect(home).toHaveAttribute("aria-current", "page")
    home.focus()
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await expect(canvas.getByLabelText("Rail destination")).toHaveTextContent("favorites")
    await userEvent.hover(canvas.getByRole("button", { name: /Messages/ }))
    await expect(within(canvasElement.ownerDocument.body).getByRole("tooltip")).toHaveTextContent("Messages")
  },
}

export const RegionsAndBadges: Story = { parameters: { sideBySide: true }, render: () => <div className="h-[640px]"><CompactRail /></div> }
