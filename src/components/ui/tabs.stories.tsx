import type { Meta, StoryObj } from "@storybook/react-vite"
import { HeartIcon, SearchIcon, StarIcon } from "lucide-react"
import { expect, userEvent, within } from "storybook/test"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/** M3 primary tabs: a 3dp pill indicator riding the divider under the row. */
export const Primary: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList variant="primary">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="specs">Specs</TabsTrigger>
        <TabsTrigger value="motion">Motion</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4">
        The active label takes the primary color and the indicator slides.
      </TabsContent>
      <TabsContent value="specs" className="pt-4">
        Tab height is 48dp, with title-small type.
      </TabsContent>
      <TabsContent value="motion" className="pt-4">
        Indicator and label color cross-fade on an effects spring.
      </TabsContent>
    </Tabs>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="starred" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="starred">
          <StarIcon />
          Starred
        </TabsTrigger>
        <TabsTrigger value="liked">
          <HeartIcon />
          Liked
        </TabsTrigger>
        <TabsTrigger value="search">
          <SearchIcon />
          Search
        </TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

/** The segmented variant: the active tab becomes a tonal pill. */
export const Segmented: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <Tabs defaultValue="light">
      <TabsList variant="segmented">
        <TabsTrigger value="light">Light</TabsTrigger>
        <TabsTrigger value="dark">Dark</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

/** Secondary tabs use a shorter label-width indicator and preserve Base UI semantics. */
export const Secondary: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <Tabs defaultValue="photos" className="w-96">
      <TabsList variant="secondary">
        <TabsTrigger value="photos"><StarIcon />Photos</TabsTrigger>
        <TabsTrigger value="albums"><HeartIcon />Albums</TabsTrigger>
        <TabsTrigger value="search" disabled><SearchIcon />Search</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">Photos panel</TabsContent>
      <TabsContent value="albums">Albums panel</TabsContent>
    </Tabs>
  ),
}

export const SecondaryVerticalKeyboard: Story = {
  render: () => (
    <Tabs defaultValue="one" orientation="vertical" className="h-48">
      <TabsList variant="secondary" aria-label="Sections">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">One panel</TabsContent>
      <TabsContent value="two">Two panel</TabsContent>
      <TabsContent value="three">Three panel</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const one = canvas.getByRole("tab", { name: "One" })
    one.focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(canvas.getByRole("tab", { name: "Two" })).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(canvas.getByRole("tabpanel", { name: "Two" })).toHaveTextContent("Two panel")
    const indicator = getComputedStyle(canvas.getByRole("tab", { name: "Two" }), "::after")
    await expect(Number.parseFloat(indicator.width)).toBe(2)
    await expect(indicator.height).not.toBe("2px")
  },
}
