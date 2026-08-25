import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { ArrowLeftIcon, MoreVerticalIcon, SearchIcon, StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "./avatar"
import { Button } from "./button"
import { TopAppBar, TopAppBarActions, TopAppBarNavigation, TopAppBarTitle } from "./top-app-bar"

const meta = { title: "Components/TopAppBar", component: TopAppBar, tags: ["autodocs"] } satisfies Meta<typeof TopAppBar>
export default meta
type Story = StoryObj<typeof meta>

function AppBar({ size, scrolled = false }: { size: "small" | "medium" | "large"; scrolled?: boolean }) {
  return (
    <TopAppBar size={size} scrolled={scrolled}>
      <TopAppBarNavigation><Button aria-label="Go back" size="icon" variant="ghost"><ArrowLeftIcon /></Button></TopAppBarNavigation>
      <TopAppBarTitle>A very long destination collection title</TopAppBarTitle>
      <TopAppBarActions>
        <Button aria-label="Search" size="icon" variant="ghost"><SearchIcon /></Button>
        <Button aria-label="Favorite" size="icon" variant="ghost"><StarIcon /></Button>
        <Avatar className="size-8"><AvatarFallback>GO</AvatarFallback></Avatar>
        <Button aria-label="More actions" size="icon" variant="ghost"><MoreVerticalIcon /></Button>
      </TopAppBarActions>
    </TopAppBar>
  )
}

export const Configurations: Story = {
  parameters: { sideBySide: true },
  render: () => <div className="flex w-[412px] max-w-full flex-col gap-4"><AppBar size="small" /><AppBar size="medium" /><AppBar size="large" scrolled /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bars = canvasElement.querySelectorAll<HTMLElement>('[data-slot="top-app-bar"]')
    await expect(bars[0].getBoundingClientRect().height).toBe(64)
    await expect(bars[1].getBoundingClientRect().height).toBe(116)
    await expect(bars[2].getBoundingClientRect().height).toBe(160)
    const firstBack = canvas.getAllByRole("button", { name: "Go back" })[0]
    firstBack.focus()
    await userEvent.tab()
    await expect(canvas.getAllByRole("button", { name: "Search" })[0]).toHaveFocus()
  },
}
