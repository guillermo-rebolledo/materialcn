import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { cn } from "@/lib/utils"

const meta = {
  title: "Foundations/Spacing",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Each step is a value the Material kit actually uses, paired with the job it
 * does there — see docs/m3-specs.md for where each was measured.
 */
const STEPS = [
  ["xs", "Icon-to-label gap in the densest controls"],
  ["sm", "Gap inside a standard control; chip icon-to-label"],
  ["md", "Dense inset — segmented button segments, sheet internal spacing"],
  ["lg", "The default content inset — cards, sheets, list rows"],
  ["xl", "Dialog padding; separation between sections of a screen"],
  ["2xl", "Expressive large-control padding"],
  ["3xl", "Large button padding; page-level separation"],
  ["4xl", "Extra-large button padding"],
] as const

/** Bar widths are set from the token, so the story cannot drift from it. */
const WIDTH = {
  xs: "w-m3-xs",
  sm: "w-m3-sm",
  md: "w-m3-md",
  lg: "w-m3-lg",
  xl: "w-m3-xl",
  "2xl": "w-m3-2xl",
  "3xl": "w-m3-3xl",
  "4xl": "w-m3-4xl",
} as const

/**
 * Every measurement in the Material kit is a multiple of 4dp, and that unit is
 * the only number here that is chosen rather than derived — the rest are
 * `calc()` off `--m3-space-unit`, so a denser system is one declaration.
 *
 * Tailwind's numeric scale is the same 4dp unit expressed in rem, so `p-4` and
 * `p-m3-lg` agree at the default root font size. They diverge when the reader
 * scales their font: the numeric utilities grow, these do not. Reach for
 * `p-m3-*` when a measurement has to match the kit's geometry exactly, and for
 * `p-4` otherwise.
 */
export const Scale: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex max-w-3xl flex-col gap-m3-sm">
      {STEPS.map(([step, use]) => (
        <div key={step} className="flex items-center gap-m3-lg">
          <code className="text-m3-label-lg w-24 shrink-0">m3-{step}</code>
          <div
            data-testid={`bar-${step}`}
            className={cn("bg-m3-primary h-6 shrink-0", WIDTH[step])}
          />
          <span className="text-m3-body-sm text-muted-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!

    // Each step is its multiple of the base unit, and the derivation is the
    // point of the scale — a hand-typed value would pass a snapshot but break
    // the one-declaration promise.
    const expected = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32, "3xl": 48, "4xl": 64 }
    for (const [step, width] of Object.entries(expected)) {
      const [bar] = canvas.getAllByTestId(`bar-${step}`)
      expect(view.getComputedStyle(bar).width, `m3-${step}`).toBe(`${width}px`)
    }
  },
}

/**
 * `cn` has to know the scale, or a consumer's `p-6` and a component's
 * `p-m3-lg` both survive the merge and CSS source order picks the winner.
 * This is the same trap the `text-m3-*` namespaces set, in a quieter form.
 */
export const MergesWithTailwindSpacing: Story = {
  render: () => (
    <code className="text-m3-body-md" data-testid="merged">
      {cn("p-4", "p-m3-lg")}
    </code>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByTestId("merged")).toHaveTextContent(/^p-m3-lg$/)
  },
}
