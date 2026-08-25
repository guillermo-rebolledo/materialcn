import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Button } from "./button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHandle,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

function BottomSheet({ long = false }: { long?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="tonal">Open bottom sheet</Button>} />
      <SheetContent side="bottom">
        <SheetHandle data-testid="sheet-handle" />
        <SheetHeader>
          <SheetTitle>Plan a weekend</SheetTitle>
          <SheetDescription>
            Save a short itinerary without leaving the current page.
          </SheetDescription>
        </SheetHeader>
        <SheetBody data-testid="sheet-body">
          <p>
            Pick a neighborhood, collect a few places, and share the plan when
            it is ready.
          </p>
          {long &&
            Array.from({ length: 12 }, (_, index) => (
              <p key={index}>
                Stop {index + 1}: allow enough content to verify that the body
                scrolls while the title and actions remain available.
              </p>
            ))}
        </SheetBody>
        <SheetFooter>
          <SheetClose render={<Button>Save plan</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

/** Use the Storybook theme toolbar to inspect the same token roles in light and dark. */
export const BottomPresentation: Story = {
  render: () => <BottomSheet long />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Open bottom sheet" })

    await userEvent.click(trigger)

    const dialog = await page.findByRole("dialog", { name: "Plan a weekend" })
    const handle = page.getByTestId("sheet-handle")
    const body = page.getByTestId("sheet-body")
    const styles = getComputedStyle(dialog)

    await expect(dialog).toHaveAttribute("data-side", "bottom")
    await expect(styles.borderTopLeftRadius).toBe("28px")
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(412)
    await expect(handle.getBoundingClientRect().width).toBe(32)
    await expect(handle.getBoundingClientRect().height).toBe(4)
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight)

    await userEvent.tab()
    await expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(true)

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await userEvent.click(await page.findByRole("button", { name: "Save plan" }))
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  },
}

export const ShortContent: Story = {
  render: () => <BottomSheet />,
}

export const DarkBottomPresentation: Story = {
  globals: { theme: "dark" },
  render: () => <BottomSheet long />,
}

export const SideSheets: Story = {
  render: () => (
    <div className="flex gap-3">
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Open left sheet</Button>} />
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Existing side-sheet presentation.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Open right sheet</Button>} />
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Details</SheetTitle>
            <SheetDescription>Existing side-sheet presentation.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole("button", { name: "Open right sheet" }))
    const dialog = await page.findByRole("dialog", { name: "Details" })
    await expect(dialog).toHaveAttribute("data-side", "right")
    await expect(Number.parseFloat(getComputedStyle(dialog).borderLeftWidth)).toBeGreaterThan(0)
    await expect(page.queryByTestId("sheet-handle")).not.toBeInTheDocument()
  },
}
