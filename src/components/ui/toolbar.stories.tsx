import { useState } from "react"
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

function DynamicToolbar() {
  const [firstDisabled, setFirstDisabled] = useState(false)
  return (
    <div className="flex items-center gap-3">
      <Toolbar aria-label="Dynamic tools">
        <Button disabled={firstDisabled}>First tool</Button>
        <Button>Second tool</Button>
      </Toolbar>
      <Button variant="outline" onClick={() => setFirstDisabled(true)}>Disable first tool</Button>
    </div>
  )
}

export const MixedControls: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toolbar aria-label="Document tools">
        <ToolbarLabel>Format</ToolbarLabel>
        <ToolbarGroup><Button aria-label="Undo" size="icon" variant="ghost"><UndoIcon /></Button></ToolbarGroup>
        <ToolbarDivider />
        <ToolbarGroup><ToggleGroup><ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem><ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem></ToggleGroup></ToolbarGroup>
        <ToolbarGroup><ButtonGroup aria-label="Alignment"><Button>Left</Button><Button>Right</Button></ButtonGroup></ToolbarGroup>
        <ToolbarOverflow>
          <DropdownMenu><DropdownMenuTrigger render={<Button aria-label="More tools" size="icon" variant="ghost" />}><MoreVerticalIcon /></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Export</DropdownMenuItem><DropdownMenuItem>Print</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        </ToolbarOverflow>
        <ToolbarFAB><FAB aria-label="Create"><PlusIcon /></FAB></ToolbarFAB>
      </Toolbar>
      <Button variant="outline">After toolbar</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const undo = canvas.getByRole("button", { name: "Undo" })
    undo.focus()
    await userEvent.keyboard("{ArrowRight}")
    const bold = canvas.getByRole("button", { name: "Bold" })
    await expect(bold).toHaveFocus()
    await expect(undo).toHaveAttribute("tabindex", "-1")
    await expect(bold).toHaveAttribute("tabindex", "0")
    const overflow = canvas.getByRole("button", { name: "More tools" })
    await userEvent.click(overflow)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(await page.findByRole("menuitem", { name: "Export" }))
    await waitFor(() => expect(overflow).toHaveFocus())
    await userEvent.tab()
    await expect(canvas.getByRole("button", { name: "After toolbar" })).toHaveFocus()
  },
}

export const PresentationsAndStates: Story = {
  parameters: { sideBySide: true },
  render: () => <div className="flex flex-col gap-4"><Toolbar><Button>Standard</Button><Button disabled>Disabled</Button></Toolbar><Toolbar color="vibrant"><Button size="lg">Vibrant</Button><ToolbarDivider /><FAB aria-label="Add"><PlusIcon /></FAB></Toolbar><Toolbar variant="docked"><Button>Docked</Button><Button variant="outline">Flat</Button></Toolbar></div>,
}

export const DynamicTabStopFallback: Story = {
  render: () => <DynamicToolbar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button", { name: "First tool" })).toHaveAttribute("tabindex", "0")
    await userEvent.click(canvas.getByRole("button", { name: "Disable first tool" }))
    await waitFor(() => expect(canvas.getByRole("button", { name: "Second tool" })).toHaveAttribute("tabindex", "0"))
  },
}
