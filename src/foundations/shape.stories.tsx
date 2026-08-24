import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Foundations/Shape",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const STEPS = [
  ["none", "0px"],
  ["xs", "4px"],
  ["sm", "8px"],
  ["md", "12px"],
  ["lg", "16px"],
  ["lg-increased", "20px"],
  ["xl", "28px"],
  ["xl-increased", "32px"],
  ["2xl", "48px"],
  ["full", "9999px"],
] as const

/**
 * Expressive leans on shape harder than earlier Material: corners are larger,
 * and the gap between adjacent steps is wide enough that a shape change reads
 * as intentional. The `-increased` steps are Expressive additions.
 */
export const Scale: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {STEPS.map(([step, value]) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <div
            className="bg-m3-primary-container text-m3-on-primary-container grid size-24 place-items-center"
            style={{ borderRadius: `var(--m3-shape-${step})` }}
          >
            <span className="text-m3-label-md">{value}</span>
          </div>
          <code className="text-m3-label-sm text-muted-foreground">
            rounded-m3-{step}
          </code>
        </div>
      ))}
    </div>
  ),
}
