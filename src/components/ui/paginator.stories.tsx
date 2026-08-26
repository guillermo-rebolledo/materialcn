import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Paginator } from "./paginator"
import { buildRange } from "./paginator-utils"

const meta = {
  title: "Components/Paginator",
  component: Paginator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Navigation across a range of pages, where the user can jump to a nearby page rather than stepping one at a time.",
      },
    },
  },
} satisfies Meta<typeof Paginator>

export default meta
type Story = StoryObj<typeof meta>

function Controlled({
  initial = 1,
  ...props
}: { initial?: number } & Omit<
  React.ComponentProps<typeof Paginator>,
  "page" | "onPageChange"
>) {
  const [page, setPage] = useState(initial)
  return (
    <Paginator
      {...(props as React.ComponentProps<typeof Paginator>)}
      page={page}
      onPageChange={setPage}
    />
  )
}

export const Default: Story = {
  args: { page: 1, totalPages: 10, onPageChange: () => {} },
  render: () => <Controlled totalPages={10} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Every control carries a full label. A bare number read out of context
    // is not navigation, it is a number.
    const target = canvas.getByRole("button", { name: "Go to page 3 of 10" })
    await userEvent.click(target)

    const current = canvas.getByRole("button", {
      name: "Page 3 of 10, current page",
    })
    expect(current).toHaveAttribute("aria-current", "page")
    // Non-interactive, but still focusable — a `span` would deliver the first
    // at the cost of announcing "current page" when a keyboard user arrives.
    expect(current).toHaveAttribute("aria-disabled", "true")
    current.focus()
    expect(current).toHaveFocus()
  },
}

/**
 * The elided range is a fixed number of slots — `siblingCount * 2 + 5` — so a
 * range of 9 pages and a range of 9,000 occupy the same width, and no control
 * moves under the pointer as the user steps through.
 *
 * When the window reaches an end, the run that would have been elided is shown
 * instead of the row simply getting shorter.
 */
export const ElidedRange: Story = {
  args: { page: 1, totalPages: 40, onPageChange: () => {} },
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      {[1, 5, 20, 40].map((page) => (
        <div key={page} className="flex flex-col gap-m3-xs">
          <code className="text-m3-label-sm text-muted-foreground">
            page {page} of 40
          </code>
          <Controlled initial={page} totalPages={40} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The width promise, asserted on the model rather than on pixels: the
    // number of slots is what has to stay constant.
    const widths = [1, 5, 20, 40].map(
      (page) => buildRange(page, 40, 1).length,
    )
    expect(new Set(widths).size, `slot counts: ${widths}`).toBe(1)

    // And both ends are always reachable in one click.
    expect(
      canvas.getAllByRole("button", { name: "Go to page 40 of 40" }).length,
    ).toBeGreaterThan(0)
  },
}

/**
 * When the total is not known ahead of time — a cursor-paged API, a search that
 * counts lazily — there is no range to draw, so it falls back to previous and
 * next. The caller says whether a next page exists; the component does not
 * guess.
 */
export const Indeterminate: Story = {
  args: { page: 1, hasNextPage: true, onPageChange: () => {} },
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      <Controlled hasNextPage />
      <div data-testid="last-page">
        <Controlled initial={4} hasNextPage={false} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const last = within(canvas.getByTestId("last-page"))

    expect(last.getByRole("button", { name: /next page/i })).toBeDisabled()
    expect(last.getByRole("button", { name: /previous page/i })).toBeEnabled()
    // No page numbers to jump between, so none are drawn.
    expect(last.queryByRole("button", { name: /Go to page/ })).toBeNull()
  },
}

/** How many rows a page holds, when that is the user's to choose. */
export const PageSize: Story = {
  args: { page: 1, totalPages: 20, onPageChange: () => {} },
  render: function PageSizeStory() {
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(25)
    return (
      <Paginator
        page={page}
        onPageChange={setPage}
        totalPages={20}
        pageSize={size}
        pageSizeOptions={[10, 25, 50, 100]}
        onPageSizeChange={(next) => {
          setSize(next)
          // Changing the page size changes what page 8 even means, so the
          // only honest place to land is the start.
          setPage(1)
        }}
      />
    )
  },
}
