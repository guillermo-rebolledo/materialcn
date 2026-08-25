import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { EditIcon, MoreVerticalIcon, ShareIcon, StarIcon } from "lucide-react"

import { FABMenu, FABMenuAction, FABMenuContent, FABMenuTrigger } from "./fab-menu"

const meta = {
  title: "Components/FABMenu",
  component: FABMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof FABMenu>

export default meta
type Story = StoryObj<typeof meta>

function MenuExample() {
  const [selection, setSelection] = useState("None")
  return (
    <div className="flex h-[360px] items-end justify-end">
      <FABMenu>
        <FABMenuTrigger aria-label="More actions"><MoreVerticalIcon /></FABMenuTrigger>
        <FABMenuContent>
          <FABMenuAction label="Edit" onClick={() => setSelection("Edit")}><EditIcon /></FABMenuAction>
          <FABMenuAction label="Share" onClick={() => setSelection("Share")}><ShareIcon /></FABMenuAction>
          <FABMenuAction label="Favorite" onClick={() => setSelection("Favorite")}><StarIcon /></FABMenuAction>
        </FABMenuContent>
      </FABMenu>
      <output aria-label="Selected action">{selection}</output>
    </div>
  )
}

export const Interactions: Story = {
  render: () => <MenuExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "More actions" })
    await userEvent.click(trigger)
    await expect(canvas.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(canvas.getByRole("menuitem", { name: "Share" })).toHaveFocus()
    await userEvent.click(canvas.getByRole("menuitem", { name: "Share" }))
    await expect(canvas.getByLabelText("Selected action")).toHaveTextContent("Share")
    await expect(trigger).toHaveFocus()
    const closingMenu = canvas.getByRole("menu", { hidden: true })
    await expect(closingMenu).toHaveAttribute("data-open", "false")
    await waitFor(() => expect(getComputedStyle(closingMenu).opacity).toBe("0"))
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Escape}")
    await expect(trigger).toHaveFocus()
  },
}

export const PlacementsAndCounts: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="grid h-[440px] grid-cols-2 place-items-center gap-20">
      {(["bottom-start", "bottom-end", "top-start", "top-end"] as const).map((placement) => (
        <FABMenu key={placement} defaultOpen placement={placement}>
          <FABMenuTrigger aria-label={`${placement} actions`}><MoreVerticalIcon /></FABMenuTrigger>
          <FABMenuContent>
            <FABMenuAction label="Edit"><EditIcon /></FABMenuAction>
            <FABMenuAction label="Share"><ShareIcon /></FABMenuAction>
          </FABMenuContent>
        </FABMenu>
      ))}
    </div>
  ),
}
