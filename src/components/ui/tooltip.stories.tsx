import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Button } from "./button"
import {
  TOOLTIP_OPEN_DELAY,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

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

const TOOLS = ["Bold", "Italic", "Underline", "Strikethrough", "Code"]

/**
 * The delay exists for this shape. Moving a pointer across a dense row is over
 * any one target for well under 200ms, so a zero delay fires every tooltip on
 * the way past and the toolbar flickers. Sweep across the row below to see it
 * stay quiet.
 *
 * Once one tooltip *is* open, the provider hands over to the next trigger
 * instantly — reading along the row costs the delay once, not once per icon.
 *
 * Focus is different: tab into the row and each tooltip appears immediately.
 * The delay filters out pointer movement that was never aimed at the trigger,
 * and moving focus to something is never accidental in that way.
 */
export const OpenDelay: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-m3-xs">
        {TOOLS.map((tool) => (
          <Tooltip key={tool}>
            <TooltipTrigger
              render={<Button variant="ghost" size="sm" />}
              data-testid={`trigger-${tool}`}
            >
              {tool[0]}
            </TooltipTrigger>
            <TooltipContent>{tool}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const bold = canvas.getByTestId("trigger-Bold")

    // Hovering does not open it straight away — that is the whole point.
    await userEvent.hover(bold)
    expect(body.queryByRole("tooltip")).toBeNull()

    // …and does open once the pointer has rested.
    await waitFor(
      () => expect(body.getByRole("tooltip")).toHaveTextContent("Bold"),
      { timeout: TOOLTIP_OPEN_DELAY + 1500 },
    )

    // With one open, the neighbour takes over without re-serving the delay.
    await userEvent.unhover(bold)
    await userEvent.hover(canvas.getByTestId("trigger-Italic"))
    await waitFor(
      () => expect(body.getByRole("tooltip")).toHaveTextContent("Italic"),
      { timeout: 300 },
    )
  },
}

/** Focus opens immediately — it is never an accidental pass-through. */
export const FocusOpensImmediately: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Focus me
        </TooltipTrigger>
        <TooltipContent>Opens without waiting</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    await userEvent.tab()
    await waitFor(() => expect(canvas.getByRole("button", { name: "Focus me" })).toHaveFocus())
    await waitFor(
      () =>
        expect(body.getByRole("tooltip")).toHaveTextContent(
          "Opens without waiting",
        ),
      // Comfortably under the hover delay: if focus were paying it, this fails.
      { timeout: TOOLTIP_OPEN_DELAY - 200 },
    )
  },
}

/** The delay is overridable per instance when one trigger needs a different one. */
export const CustomDelay: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />} delay={0}>
          Instant
        </TooltipTrigger>
        <TooltipContent>No delay on this one</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
