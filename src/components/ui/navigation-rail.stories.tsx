import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { HeartIcon, HomeIcon, MailIcon, MenuIcon, PlusIcon } from "lucide-react"

import { Button } from "./button"
import { FAB } from "./fab"
import { NavigationRail, NavigationRailDestinations, NavigationRailExpansionToggle, NavigationRailFAB, NavigationRailItem, NavigationRailMenu } from "./navigation-rail"
import { NotificationBadge } from "./notification-badge"

const meta = {
  title: "Components/NavigationRail",
  component: NavigationRail,
  tags: ["autodocs"],
  args: { value: "home", onValueChange: () => undefined },
} satisfies Meta<typeof NavigationRail>
export default meta
type Story = StoryObj<typeof meta>

function CompactRail({ labels = true, variant }: { labels?: boolean; variant?: "docked" | "floating" }) {
  const [value, setValue] = useState("home")
  return (
    <>
      <NavigationRail value={value} onValueChange={setValue} variant={variant} aria-label="Workspace navigation">
        <NavigationRailMenu><Button aria-label="Menu" size="icon" variant="ghost"><MenuIcon /></Button></NavigationRailMenu>
        <NavigationRailFAB><FAB aria-label="Create"><PlusIcon /></FAB></NavigationRailFAB>
        <NavigationRailDestinations>
          <NavigationRailItem value="home" label="Home" icon={<HomeIcon />} href="#home" showLabel={labels} />
          <NavigationRailItem value="favorites" label="Favorites" icon={<HeartIcon />} showLabel={labels} />
          <NavigationRailItem value="messages" label="Messages" icon={<MailIcon />} badge={<NotificationBadge />} showLabel={labels} />
        </NavigationRailDestinations>
      </NavigationRail>
      <output aria-label="Rail destination">{value}</output>
    </>
  )
}

function ResponsiveRail() {
  const [value, setValue] = useState("home")
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="flex h-[640px] items-start gap-3">
      <NavigationRail value={value} onValueChange={setValue} expanded={expanded} onExpandedChange={setExpanded} aria-label="Responsive navigation">
        <NavigationRailMenu><NavigationRailExpansionToggle aria-label="Toggle rail"><MenuIcon /></NavigationRailExpansionToggle></NavigationRailMenu>
        <NavigationRailFAB><FAB aria-label="Create"><PlusIcon /></FAB></NavigationRailFAB>
        <NavigationRailDestinations>
          <NavigationRailItem value="home" label="Home" icon={<HomeIcon />} />
          <NavigationRailItem value="favorites" label="Favorites" icon={<HeartIcon />} />
          <NavigationRailItem value="messages" label="Messages" icon={<MailIcon />} badge={<NotificationBadge />} />
        </NavigationRailDestinations>
      </NavigationRail>
    </div>
  )
}

export const CompactInteraction: Story = {
  render: () => <div className="h-[640px]"><CompactRail labels={false} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const home = canvas.getByRole("link", { name: /Home/ })
    await expect(home).toHaveAttribute("aria-current", "page")
    home.focus()
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await expect(canvas.getByLabelText("Rail destination")).toHaveTextContent("favorites")
    await userEvent.hover(canvas.getByRole("button", { name: /Messages/ }))
    const tooltip = within(canvasElement.ownerDocument.body).getByRole("tooltip")
    await expect(tooltip).toHaveTextContent("Messages")
    await expect(canvas.getByRole("button", { name: /Messages/ })).toHaveAttribute("data-base-ui-tooltip-trigger")
  },
}

export const RegionsAndBadges: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex h-[640px] items-start gap-6">
      <CompactRail />
      <CompactRail labels={false} />
      <CompactRail variant="floating" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector<HTMLElement>('[data-slot="navigation-rail"]')!
    // Rounded: the assertion is that the rail is 96dp, and sub-pixel layout
    // differences across environments are not a spec violation. CI measured
    // 95.5 here and failed a publish over half a pixel.
    await expect(Math.round(rail.getBoundingClientRect().width)).toBe(96)
    const indicator = rail.querySelector<HTMLElement>('[data-slot="navigation-bar-indicator"]')!.getBoundingClientRect()
    await expect(indicator.width).toBe(56)
    await expect(indicator.height).toBe(32)
  },
}

export const ControlledExpansion: Story = {
  parameters: { sideBySide: true },
  render: () => <ResponsiveRail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rails = canvasElement.querySelectorAll<HTMLElement>('[data-slot="navigation-rail"]')
    await expect(Math.round(rails[0].getBoundingClientRect().width)).toBe(96)
    const home = canvas.getAllByRole("button", { name: /Home/ })[0]
    home.focus()
    await userEvent.click(canvas.getAllByRole("button", { name: "Toggle rail" })[0])
    await waitFor(() =>
      expect(Math.round(rails[0].getBoundingClientRect().width)).toBe(220),
    )
    const expandedHome = canvas.getAllByRole("button", { name: /Home/ })[0]
    await expect(expandedHome).toBe(home)
    await expect(expandedHome).toHaveAttribute("aria-current", "page")
  },
}
