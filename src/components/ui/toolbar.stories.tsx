import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { BoldIcon, ItalicIcon, MoreVerticalIcon, PlusIcon, UndoIcon } from "lucide-react"

import { Button } from "./button"
import { ButtonGroup } from "./button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { FAB } from "./fab"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import { Toolbar, ToolbarDivider, ToolbarFAB, ToolbarGroup, ToolbarLabel, ToolbarOverflow } from "./toolbar"

const meta = { title: "Components/Toolbar", component: Toolbar, tags: ["autodocs"] } satisfies Meta<typeof Toolbar>
export default meta
type Story = StoryObj<typeof meta>

export const MixedControls: Story = {
  render: () => (
    <Toolbar aria-label="Document tools">
      <ToolbarLabel>Format</ToolbarLabel>
      <ToolbarGroup><Button aria-label="Undo" size="icon" variant="ghost"><UndoIcon /></Button></ToolbarGroup>
      <ToolbarDivider />
      <ToolbarGroup><ToggleGroup><ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem><ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem></ToggleGroup></ToolbarGroup>
      <ToolbarGroup><ButtonGroup aria-label="Alignment"><Button>Left</Button><Button>Right</Button></ButtonGroup></ToolbarGroup>
      <ToolbarOverflow>
        <DropdownMenu><DropdownMenuTrigger render={<Button aria-label="More tools" size="icon" variant="ghost" />}><MoreVerticalIcon /></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Export</DropdownMenuItem><DropdownMenuItem>Print</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      </ToolbarOverflow>
      <ToolbarFAB><FAB aria-label="Create" size="small"><PlusIcon /></FAB></ToolbarFAB>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const undo = canvas.getByRole("button", { name: "Undo" })
    undo.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(canvas.getByRole("button", { name: "Bold" })).toHaveFocus()
    const overflow = canvas.getByRole("button", { name: "More tools" })
    await userEvent.click(overflow)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(await page.findByRole("menuitem", { name: "Export" }))
    await waitFor(() => expect(overflow).toHaveFocus())
  },
}

export const PresentationsAndStates: Story = {
  parameters: { sideBySide: true },
  render: () => <div className="flex flex-col gap-4"><Toolbar><Button>Standard</Button><Button disabled>Disabled</Button></Toolbar><Toolbar presentation="expressive"><Button size="lg">Expressive</Button><ToolbarDivider /><FAB aria-label="Add"><PlusIcon /></FAB></Toolbar></div>,
}
