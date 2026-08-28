import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { ArchiveIcon, PlusIcon, SearchIcon, ShareIcon } from "lucide-react"

import { BottomAppBar, BottomAppBarActions, BottomAppBarFAB } from "./bottom-app-bar"
import { Button } from "./button"
import { FAB } from "./fab"

const meta = { title: "Components/BottomAppBar", component: BottomAppBar, tags: ["autodocs"] } satisfies Meta<typeof BottomAppBar>
export default meta
type Story = StoryObj<typeof meta>

function Example({ fab = false }: { fab?: boolean }) {
  return (
    <BottomAppBar>
      <BottomAppBarActions>
        <Button aria-label="Search" size="icon" variant="ghost"><SearchIcon /></Button>
        <Button aria-label="Archive" size="icon" variant="ghost"><ArchiveIcon /></Button>
        <Button aria-label="Share" size="icon" variant="ghost" disabled><ShareIcon /></Button>
      </BottomAppBarActions>
      {fab && <BottomAppBarFAB><FAB aria-label="Create"><PlusIcon /></FAB></BottomAppBarFAB>}
    </BottomAppBar>
  )
}

export const Arrangements: Story = {
  parameters: { sideBySide: true },
  render: () => <div className="flex w-[412px] max-w-full flex-col gap-4"><Example /><Example fab /></div>,
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll<HTMLElement>('[data-slot="bottom-app-bar"]')
    for (const bar of bars) await expect(Math.round(bar.getBoundingClientRect().height)).toBe(80)
    const canvas = within(canvasElement)
    for (const action of canvas.getAllByRole("button", { name: "Share" })) await expect(action).toBeDisabled()
  },
}

export const ResponsiveAndSafeArea: Story = {
  render: () => <div className="w-[280px]"><BottomAppBar safeArea><BottomAppBarActions><Button>Action</Button></BottomAppBarActions></BottomAppBar></div>,
}
