import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { InfoIcon } from "lucide-react"

import { Button } from "./button"
import { RichTooltip, RichTooltipActions, RichTooltipContent, RichTooltipDescription, RichTooltipTitle, RichTooltipTrigger } from "./rich-tooltip"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const meta = { title: "Components/RichTooltip", component: RichTooltip, tags: ["autodocs"] } satisfies Meta<typeof RichTooltip>
export default meta
type Story = StoryObj<typeof meta>

function InteractiveTooltip() {
  const [action, setAction] = useState("None")
  return (
    <>
      <RichTooltip>
        <RichTooltipTrigger render={<Button aria-label="About sharing" size="icon" variant="outline" />}><InfoIcon /></RichTooltipTrigger>
        <RichTooltipContent side="right">
          <RichTooltipTitle>Share with your team</RichTooltipTitle>
          <RichTooltipDescription>Anyone in the workspace can open this destination.</RichTooltipDescription>
          <RichTooltipActions><Button variant="ghost" onClick={() => setAction("Learn more")}>Learn more</Button></RichTooltipActions>
        </RichTooltipContent>
      </RichTooltip>
      <output aria-label="Tooltip action">{action}</output>
    </>
  )
}

export const Interaction: Story = {
  render: () => <InteractiveTooltip />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "About sharing" })
    await userEvent.hover(trigger)
    const popup = await page.findByRole("dialog")
    await waitFor(() => expect(popup).toBeVisible())
    await userEvent.click(page.getByRole("button", { name: "Learn more" }))
    await expect(canvas.getByLabelText("Tooltip action")).toHaveTextContent("Learn more")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  },
}

export const PlainAndRichPlacements: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex gap-8 p-20">
      <TooltipProvider><Tooltip><TooltipTrigger render={<Button variant="outline" />}>Plain hint</TooltipTrigger><TooltipContent>Non-interactive hint</TooltipContent></Tooltip></TooltipProvider>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <RichTooltip key={side} defaultOpen>
          <RichTooltipTrigger render={<Button variant="outline" />}>{side}</RichTooltipTrigger>
          <RichTooltipContent side={side}><RichTooltipTitle>{side} rich tooltip</RichTooltipTitle><RichTooltipDescription>Supplemental information.</RichTooltipDescription></RichTooltipContent>
        </RichTooltip>
      ))}
    </div>
  ),
}
