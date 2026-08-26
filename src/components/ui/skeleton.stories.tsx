import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"

import { Skeleton } from "./skeleton"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A placeholder for content that has not arrived. Match the shape and the size of what it stands in for, so nothing jumps when the real content lands.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { className: "h-4 w-48" },
}

const SHAPES = [
  ["square", "Images and media that sit flush in their container"],
  ["rounded", "The default — cards, list rows, text blocks"],
  ["large", "Sheets and larger surfaces"],
  ["extraLarge", "Dialogs"],
  ["circle", "Avatars and icon buttons — pair with a size utility"],
  ["pill", "Chips, pill buttons, FABs"],
] as const

/**
 * The shapes are the library's own steps, not a free-form radius. Corners that
 * do not match the component the skeleton stands in for produce a visible jump
 * at the moment the content arrives — which is the one thing a skeleton exists
 * to avoid.
 */
export const Shapes: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      {SHAPES.map(([shape, use]) => (
        <div key={shape} className="flex items-center gap-m3-lg">
          <code className="text-m3-label-md text-muted-foreground w-24 shrink-0">
            {shape}
          </code>
          <Skeleton
            shape={shape}
            className={shape === "circle" ? "size-12" : "h-12 w-40"}
          />
          <span className="text-m3-body-sm text-muted-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
}

const TEXT_ROLES = ["headline-sm", "title-md", "body-lg", "label-md"] as const

/**
 * `text` sizes a skeleton to a line of a given type role. Taking the height
 * from the role's own line box rather than a hand-typed pixel value is what
 * keeps the two together when the scale changes — including when display and
 * headline step down on a narrow window.
 */
export const TextLines: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-m3-lg">
      {TEXT_ROLES.map((role) => (
        <div key={role} className="flex flex-col gap-m3-xs">
          <code className="text-m3-label-sm text-muted-foreground">
            text="{role}"
          </code>
          <Skeleton data-testid={`text-${role}`} text={role} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    const styles = view.getComputedStyle(canvasElement)

    for (const role of TEXT_ROLES) {
      const line = styles.getPropertyValue(`--m3-${role}-line`)
      const skeleton = canvas.getByTestId(`text-${role}`)
      // The point is the equality, not the number: a skeleton sized from a
      // literal would pass a snapshot and drift the moment the scale moved.
      expect(view.getComputedStyle(skeleton).height, role).toBe(
        `${Number.parseFloat(line) * 16}px`,
      )
    }
  },
}

/**
 * A skeleton is a sketch of the layout, not a tracing of it. Blocking out the
 * shape of a card — media, a heading, two lines of body — reads as loading;
 * reproducing every control reads as a broken page.
 *
 * Note the shortened last line. Real paragraphs do not end flush, and a stack
 * of identical bars is the tell that makes a skeleton look synthetic.
 */
export const LoadingLayout: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div
      // The region owning the load is where the loading state is announced —
      // the skeletons themselves are hidden from assistive technology, since
      // announcing "loading" once per placeholder is worse than silence.
      aria-busy
      aria-live="polite"
      aria-label="Loading articles"
      className="bg-m3-surface-container-low rounded-m3-lg p-m3-lg flex w-80 flex-col gap-m3-lg"
    >
      <Skeleton shape="large" className="h-40 w-full" />
      <div className="flex items-center gap-m3-md">
        <Skeleton shape="circle" className="size-10" />
        <div className="flex flex-1 flex-col gap-m3-xs">
          <Skeleton text="title-md" className="w-2/3" />
          <Skeleton text="label-md" className="w-1/3" />
        </div>
      </div>
      <div className="flex flex-col gap-m3-xs">
        <Skeleton text="body-md" />
        <Skeleton text="body-md" />
        <Skeleton text="body-md" className="w-3/5" />
      </div>
      <div className="flex gap-m3-sm">
        <Skeleton shape="pill" className="h-10 w-24" />
        <Skeleton shape="pill" className="h-10 w-24" />
      </div>
    </div>
  ),
}

/**
 * The pulse is decorative, but it is also the only signal that the screen is
 * loading rather than broken — so under `prefers-reduced-motion` the movement
 * stops and the shape stays, consistent with how the wave, circular progress,
 * loading indicator, and carousel all collapse.
 */
export const ReducedMotion: Story = {
  render: () => <Skeleton data-testid="skeleton" className="h-12 w-48" />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== "test") return

    const { commands } = await import("vitest/browser")
    const canvas = within(canvasElement)
    const skeleton = canvas.getByTestId("skeleton")

    expect(getComputedStyle(skeleton).animationName).toBe("pulse")

    await commands.emulateReducedMotion(true)
    try {
      await waitFor(() =>
        expect(getComputedStyle(skeleton).animationName).toBe("none"),
      )
    } finally {
      await commands.emulateReducedMotion(false)
    }
  },
}
