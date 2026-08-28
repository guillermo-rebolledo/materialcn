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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <FAB aria-label="Add"><PlusIcon /></FAB>
        <FAB aria-label="Edit" size="medium" color="secondary-container"><EditIcon /></FAB>
        <FAB aria-label="Navigate" size="large" color="tertiary-container"><NavigationIcon /></FAB>
        <FAB aria-label="Round" shape="round" color="primary"><PlusIcon /></FAB>
        <FAB aria-label="Secondary" color="secondary"><EditIcon /></FAB>
        <FAB aria-label="Tertiary" color="tertiary"><NavigationIcon /></FAB>
        <FAB aria-label="Unavailable" disabled><PlusIcon /></FAB>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <ExtendedFAB label="Create"><PlusIcon /></ExtendedFAB>
        <ExtendedFAB label="Compose" size="medium" color="primary"><EditIcon /></ExtendedFAB>
        <ExtendedFAB label="Navigate" size="large" color="tertiary-container"><NavigationIcon /></ExtendedFAB>
        <ExtendedFAB label="Round" shape="round" color="secondary-container"><PlusIcon /></ExtendedFAB>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const pane of [0, 1]) {
      const add = canvas.getAllByRole("button", { name: "Add" })[pane]
      await expect(Math.round(add.getBoundingClientRect().width)).toBe(56)
      // The icon must sit dead-centre: nothing from the Button size scale may
      // leak padding into the FAB through tailwind-merge.
      const icon = add.querySelector("svg")!.getBoundingClientRect()
      const box = add.getBoundingClientRect()
      await expect(icon.left - box.left).toBeCloseTo(box.right - icon.right, 1)
      await expect(Math.round(canvas.getAllByRole("button", { name: "Edit" })[pane].getBoundingClientRect().width)).toBe(80)
      await expect(Math.round(canvas.getAllByRole("button", { name: "Navigate" })[pane].getBoundingClientRect().height)).toBe(96)
      await expect(Math.round(canvas.getAllByRole("button", { name: "Create" })[pane].getBoundingClientRect().height)).toBe(56)
      await expect(canvas.getAllByRole("button", { name: "Unavailable" })[pane]).toBeDisabled()
    }
  },
}
