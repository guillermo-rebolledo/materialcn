import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { EditIcon, NavigationIcon, PlusIcon } from "lucide-react"

import { ExtendedFAB, FAB } from "./fab"

const meta = {
  title: "Components/FAB",
  component: FAB,
  tags: ["autodocs"],
  args: { "aria-label": "Create", children: <PlusIcon aria-hidden="true" /> },
} satisfies Meta<typeof FAB>

export default meta
type Story = StoryObj<typeof meta>

export const SizesColorsAndShapes: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <FAB aria-label="Add" size="small" color="surface"><PlusIcon /></FAB>
      <FAB aria-label="Edit" size="medium" color="primary" shape="square"><EditIcon /></FAB>
      <FAB aria-label="Navigate" size="large" color="secondary"><NavigationIcon /></FAB>
      <FAB aria-label="Unavailable" color="tertiary" disabled><PlusIcon /></FAB>
      <ExtendedFAB label="Create" color="primary"><PlusIcon /></ExtendedFAB>
      <ExtendedFAB label="Navigate" size="large" color="tertiary" shape="square"><NavigationIcon /></ExtendedFAB>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const pane of [0, 1]) {
      await expect(canvas.getAllByRole("button", { name: "Add" })[pane].getBoundingClientRect().width).toBe(40)
      await expect(canvas.getAllByRole("button", { name: "Edit" })[pane].getBoundingClientRect().width).toBe(56)
      await expect(canvas.getAllByRole("button", { name: "Navigate" })[pane].getBoundingClientRect().height).toBe(96)
      await expect(canvas.getAllByRole("button", { name: "Unavailable" })[pane]).toBeDisabled()
    }
  },
}
