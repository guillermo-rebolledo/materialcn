import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { Separator, SeparatorSubhead } from "./separator"

const meta = { title: "Components/Separator", component: Separator, tags: ["autodocs"] } satisfies Meta<typeof Separator>
export default meta
type Story = StoryObj<typeof meta>

export const MaterialVariants: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="w-80 rounded-m3-md bg-m3-surface-container py-4">
      <div className="px-4 py-3">First item</div>
      <Separator data-testid="full" variant="full" />
      <div className="px-4 py-3">Second item</div>
      <Separator data-testid="inset" variant="inset" />
      <div className="px-4 py-3">Third item</div>
      <Separator data-testid="middle" variant="middle-inset" />
      <SeparatorSubhead>Recent</SeparatorSubhead>
      <div className="flex h-16 items-stretch gap-4 px-4"><span>A</span><Separator orientation="vertical" /><span>B</span></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const full = canvas.getAllByTestId("full")[0].getBoundingClientRect()
    const inset = canvas.getAllByTestId("inset")[0].getBoundingClientRect()
    const middle = canvas.getAllByTestId("middle")[0].getBoundingClientRect()
    await expect(inset.left - full.left).toBe(16)
    await expect(middle.left - full.left).toBe(16)
    await expect(full.right - middle.right).toBe(16)
    await expect(canvas.getAllByRole("heading", { name: "Recent", level: 3 })).toHaveLength(2)
  },
}

export const DecorativeAndSemantic: Story = {
  render: () => <div><Separator decorative data-testid="decorative" /><Separator aria-label="Section boundary" /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId("decorative")).toHaveAttribute("aria-hidden", "true")
    await expect(canvas.getByRole("separator", { name: "Section boundary" })).toBeVisible()
  },
}
