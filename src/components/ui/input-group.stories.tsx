import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { SearchIcon } from "lucide-react"

import { Button } from "./button"
import { Icon } from "./icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "./input-group"

const meta = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An input with things attached to it. `TextField` covers Material's text field, and `SearchBar` covers search — reach for this when you need something neither does: a unit suffix, a button welded to the input, a textarea with a counter.",
      },
    },
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

const ALIGNMENTS = [
  ["inline-start", "Leading — an icon or a currency symbol"],
  ["inline-end", "Trailing — a unit, a clear button"],
  ["block-start", "Above the input"],
  ["block-end", "Below — a counter, a hint"],
] as const

/**
 * `align` places an addon on any of the four edges. The two inline ones sit in
 * the input's own row; the block ones stack, which is what makes a counter or a
 * hint part of the control rather than a paragraph after it.
 */
export const Alignments: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex max-w-md flex-col gap-m3-lg">
      {ALIGNMENTS.map(([align, note]) => (
        <div key={align} className="flex flex-col gap-m3-xs">
          <code className="text-m3-label-sm text-muted-foreground">
            {align} — {note}
          </code>
          <InputGroup>
            <InputGroupInput
              aria-label={align}
              placeholder="Type something"
            />
            <InputGroupAddon align={align} data-testid={`addon-${align}`}>
              <span className="text-m3-label-md">addon</span>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const [align] of ALIGNMENTS) {
      // The side-by-side decorator renders the story once per scheme, so every
      // testid matches twice. Asserting on all of them beats picking the first
      // and quietly checking one pane.
      const addons = canvas.getAllByTestId(`addon-${align}`)
      expect(addons.length).toBeGreaterThan(0)
      for (const addon of addons) {
        expect(addon).toHaveAttribute("data-align", align)
      }
    }
  },
}

/** An icon in, a button out — both welded to the input rather than beside it. */
export const WithControls: Story = {
  render: () => (
    <InputGroup className="max-w-md">
      <InputGroupAddon align="inline-start">
        <Icon size="sm">
          <SearchIcon />
        </Icon>
      </InputGroupAddon>
      <InputGroupInput aria-label="Query" placeholder="Search the docs" />
      <InputGroupAddon align="inline-end">
        <Button size="xs" variant="tonal">
          Go
        </Button>
      </InputGroupAddon>
    </InputGroup>
  ),
}

/** A textarea with its counter attached below, inside the same control. */
export const Multiline: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <InputGroup className="max-w-md">
      <InputGroupTextarea
        aria-label="Notes"
        rows={4}
        placeholder="Anything the team should know"
      />
      <InputGroupAddon align="block-end">
        <span className="text-m3-label-sm text-muted-foreground ml-auto">
          0 / 280
        </span>
      </InputGroupAddon>
    </InputGroup>
  ),
}
