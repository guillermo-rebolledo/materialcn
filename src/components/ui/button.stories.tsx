import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { ArrowRightIcon, PlusIcon, TrashIcon } from "lucide-react"

import { Button } from "./button"

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon data-icon="inline-start" />
        New item
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="destructive">
        <TrashIcon data-icon="inline-start" />
        Delete
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Default</Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
}

/** Every size and variant the button has, so none can quietly resize. */
const LOADING_SIZES = [
  "xs",
  "sm",
  "default",
  "lg",
  "xl",
  "2xl",
  "icon",
  "icon-xs",
  "icon-sm",
  "icon-lg",
] as const
const LOADING_VARIANTS = [
  "default",
  "secondary",
  "tonal",
  "elevated",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

/**
 * A loading button keeps its exact width and height. A button that shrinks to
 * fit a spinner moves everything beside it — and can slide out from under the
 * pointer between mousedown and mouseup, so the click that started the work
 * lands somewhere else.
 *
 * Loading is not disabled. It stays in the tab order, keeps its variant's
 * colours, and announces itself busy: one state says "come back in a moment",
 * the other says "not for you", and a user cannot act on the difference if they
 * look identical.
 */
export const Loading: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-m3-xl">
      {LOADING_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-m3-md">
          <code className="text-m3-label-md text-muted-foreground w-20 shrink-0">
            {variant}
          </code>
          {LOADING_SIZES.map((size) => (
            <div key={size} className="flex items-center gap-m3-sm">
              <Button
                variant={variant}
                size={size}
                data-testid={`idle-${variant}-${size}`}
              >
                Save
              </Button>
              <Button
                variant={variant}
                size={size}
                loading
                data-testid={`loading-${variant}-${size}`}
              >
                Save
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const variant of LOADING_VARIANTS) {
      for (const size of LOADING_SIZES) {
        const [idle] = canvas.getAllByTestId(`idle-${variant}-${size}`)
        const [busy] = canvas.getAllByTestId(`loading-${variant}-${size}`)

        const a = idle.getBoundingClientRect()
        const b = busy.getBoundingClientRect()
        expect(Math.round(a.width), `${variant}/${size} width`).toBe(
          Math.round(b.width),
        )
        expect(Math.round(a.height), `${variant}/${size} height`).toBe(
          Math.round(b.height),
        )
      }
    }

    const [busy] = canvas.getAllByTestId("loading-default-default")
    expect(busy).toHaveAttribute("aria-busy", "true")
    // Focusable, and not carrying the disabled attribute — losing focus
    // mid-interaction moves the user somewhere they did not ask to go.
    expect(busy).not.toBeDisabled()

    // The label is hidden as a unit, text node included.
    const label = busy.querySelector('[data-slot="button-content"]')!
    expect(
      canvasElement.ownerDocument.defaultView!.getComputedStyle(label)
        .visibility,
    ).toBe("hidden")
    expect(busy.querySelector('[data-slot="button-spinner"]')).not.toBeNull()
  },
}

/** Loading is non-interactive in fact, not only in announcement. */
export const LoadingBlocksActivation: Story = {
  render: function LoadingBlocksActivationStory() {
    const [count, setCount] = useState(0)
    return (
      <div className="flex items-center gap-m3-lg">
        <Button loading onClick={() => setCount((n) => n + 1)}>
          Save
        </Button>
        <span className="text-m3-body-md" data-testid="count">
          {count}
        </span>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button")

    await userEvent.click(button)
    button.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard(" ")

    expect(canvas.getByTestId("count")).toHaveTextContent("0")
  },
}

/**
 * The spinner borrows the circular-progress utility, so it collapses to a
 * static arc under `prefers-reduced-motion` exactly as the library's other
 * indicators do, rather than growing a second version of that handling.
 */
export const LoadingReducedMotion: Story = {
  render: () => <Button loading>Save</Button>,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== "test") return

    const { commands } = await import("vitest/browser")
    const canvas = within(canvasElement)
    const arc = canvas
      .getByRole("button")
      .querySelector<SVGCircleElement>(".m3-circular-progress-indeterminate")!

    expect(getComputedStyle(arc).animationName).not.toBe("none")

    await commands.emulateReducedMotion(true)
    try {
      await waitFor(() =>
        expect(getComputedStyle(arc).animationName).toBe("none"),
      )
    } finally {
      await commands.emulateReducedMotion(false)
    }
  },
}
