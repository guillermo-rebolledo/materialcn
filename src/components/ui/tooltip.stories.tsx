import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** M3 plain tooltip: inverse surface, body-small, extra-small radius. */
export const Default: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger render={<Button variant="tonal">Hover me</Button>} />
        <TooltipContent side="bottom">Uses the inverse surface</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
