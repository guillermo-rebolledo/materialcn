import { useCallback, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

const meta = {
  title: "Foundations/Grid",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * The kit's grid, class by class. Measured off the `Examples/Layout grid`
 * component set's Figma layout grids, not the docs site — the two disagree
 * about medium.
 */
const GRID = [
  { name: "compact", min: 0, columns: 4, gutter: 16, margin: 16 },
  { name: "medium", min: 600, columns: 8, gutter: 16, margin: 32 },
  { name: "expanded", min: 840, columns: 12, gutter: 24, margin: 24 },
  { name: "large", min: 1200, columns: 12, gutter: 24, margin: 200 },
  { name: "extra-large", min: 1600, columns: 12, gutter: 24, margin: 24 },
] as const

/** The grid variables as the cascade currently resolves them. */
function readGrid(element: Element) {
  const styles = getComputedStyle(element)
  const value = (name: string) =>
    Number.parseFloat(styles.getPropertyValue(`--m3-grid-${name}`))
  return {
    columns: value("columns"),
    gutter: value("gutter"),
    margin: value("margin"),
  }
}

function useGrid() {
  const [grid, setGrid] = useState<ReturnType<typeof readGrid> | null>(null)
  const ref = useCallback((node: Element | null) => {
    if (node) setGrid(readGrid(node))
  }, [])
  return [grid, ref] as const
}

/**
 * Material's grid is not a column count — it is a column count, a gutter, and a
 * margin that all change together as the window crosses a class boundary. That
 * co-movement is why the tokens are one set of three variables redefined per
 * class rather than five separate sets, and why `m3-grid` needs no media query
 * of its own.
 *
 * Note that the margin does not grow monotonically: medium's is wider than
 * expanded's. That is the kit's, not a transcription slip — a tablet in
 * portrait gets more breathing room per column than a landscape one.
 *
 * At large the margin jumps to 200dp, and at extra-large the grid stops
 * stretching entirely and centres 12 columns of 72dp. Both exist so a line of
 * body text does not run the full width of a desktop or a television.
 *
 * Resize the preview: the cells reflow, and the readout follows.
 */
export const Grid: Story = {
  render: function GridStory() {
    const [grid, ref] = useGrid()

    return (
      <div className="flex flex-col gap-m3-xl py-m3-xl">
        <div className="m3-grid">
          <code
            className="text-m3-body-md text-muted-foreground col-span-full"
            data-testid="readout"
          >
            {grid
              ? `${grid.columns} columns · ${grid.gutter}dp gutter · ${grid.margin}dp margin`
              : "—"}
          </code>
        </div>

        {/* One cell per column, so the count is countable. */}
        <div ref={ref} className="m3-grid" data-testid="grid">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              data-testid="cell"
              className="bg-m3-primary-container text-m3-on-primary-container rounded-m3-sm text-m3-label-sm grid h-16 place-items-center"
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* A realistic reflow: full width when compact, split once there is room. */}
        <div className="m3-grid">
          <div className="bg-m3-secondary-container text-m3-on-secondary-container rounded-m3-lg p-m3-lg col-span-full m3-expanded:col-span-8">
            <span className="text-m3-title-md">Content</span>
            <p className="text-m3-body-md">
              col-span-full m3-expanded:col-span-8
            </p>
          </div>
          <div className="bg-m3-tertiary-container text-m3-on-tertiary-container rounded-m3-lg p-m3-lg col-span-full m3-expanded:col-span-4">
            <span className="text-m3-title-md">Aside</span>
            <p className="text-m3-body-md">
              col-span-full m3-expanded:col-span-4
            </p>
          </div>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    const grid = canvas.getByTestId("grid")

    const expected = GRID.reduce(
      (found, entry) => (view.innerWidth >= entry.min ? entry : found),
      GRID[0],
    )
    expect(readGrid(grid), `at ${view.innerWidth}px`).toEqual({
      columns: expected.columns,
      gutter: expected.gutter,
      margin: expected.margin,
    })

    // The utility has to actually lay the columns out, not just hold the
    // numbers: a `repeat(var(--m3-grid-columns), …)` that failed to resolve
    // would leave the readout correct and the grid single-column.
    const tracks = view
      .getComputedStyle(grid)
      .gridTemplateColumns.split(" ")
      .filter(Boolean)
    expect(tracks).toHaveLength(expected.columns)

    const styles = view.getComputedStyle(grid)
    expect(styles.paddingLeft).toBe(`${expected.margin}px`)
    expect(styles.columnGap).toBe(`${expected.gutter}px`)
  },
}
