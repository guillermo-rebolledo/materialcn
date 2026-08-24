import type { Meta, StoryObj } from "@storybook/react-vite"
import { HeartIcon, SearchIcon, StarIcon } from "lucide-react"

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
      <TabsList variant="line">
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
      <TabsList>
        <TabsTrigger value="light">Light</TabsTrigger>
        <TabsTrigger value="dark">Dark</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}
