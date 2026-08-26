import { useCallback, useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

const meta = {
  title: "Foundations/Layout",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * The five classes, in ascending order. The *bounds* are deliberately not here
 * — they come from `--m3-breakpoint-*` at runtime, so this page cannot drift
 * from the token layer it documents.
 *
 * `reveal` is spelled out rather than assembled from `name` because Tailwind
 * scans source text; a class built at runtime is never generated.
 */
const CLASSES = [
  { name: "compact", note: "Phone in portrait", reveal: "" },
  {
    name: "medium",
    note: "Tablet in portrait, or an unfolded phone",
    reveal: "hidden m3-medium:block",
  },
  {
    name: "expanded",
    note: "Tablet in landscape, or a small desktop window",
    reveal: "hidden m3-expanded:block",
  },
  { name: "large", note: "Desktop", reveal: "hidden m3-large:block" },
  {
    name: "extra-large",
    note: "Ultra-wide desktop, or a TV",
    reveal: "hidden m3-extra-large:block",
  },
] as const

/** Lower bound of each class, read off the token layer. */
function minWidths(element: Element) {
  const styles = getComputedStyle(element)
  return CLASSES.map(({ name }) =>
    Number.parseFloat(
      styles.getPropertyValue(`--m3-breakpoint-${name}`) || "NaN",
    ),
  )
}

/**
 * Tracks the *window* width, not the element's. Material's classes describe the
 * window a layout is living in; a component that wants to respond to its own
 * box wants a container query instead.
 */
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return width
}

/**
 * Reads the bounds off the element once it is in the document. A ref callback
 * rather than an effect: the values are inherent to the mounted node, not a
 * subscription to anything that changes.
 */
function useMinWidths() {
  const [mins, setMins] = useState<number[]>([])
  const ref = useCallback((node: Element | null) => {
    if (node) setMins(minWidths(node))
  }, [])
  return [mins, ref] as const
}

const range = (mins: number[], index: number) =>
  index === mins.length - 1
    ? `${mins[index]}dp and up`
    : `${mins[index]}–${mins[index + 1] - 1}dp`

/**
 * Material picks a layout by window size class, not by pixel count. These five
 * are what every Material component's responsive behaviour is specified
 * against — a navigation bar becomes a rail at `medium`, and the rail expands
 * at `expanded`, regardless of which device produced that width.
 *
 * Tailwind's stock scale does not line up: `md` fires at 768px, inside the
 * medium class rather than on either of its edges. Hence a parallel, prefixed
 * set of variants — `m3-medium:`, `m3-expanded:` — rather than a remapping of
 * `sm`/`md`/`lg`, which would silently move every breakpoint in a consuming app
 * as well.
 *
 * Resize the preview to watch the active row follow the window.
 */
export const WindowSizeClasses: Story = {
  render: function WindowSizeClassesStory() {
    const width = useWindowWidth()
    const [mins, ref] = useMinWidths()
    const activeIndex = mins.reduce(
      (found, min, index) => (width >= min ? index : found),
      0,
    )

    return (
      <div ref={ref} className="flex max-w-3xl flex-col gap-6">
        <div className="flex items-baseline gap-3">
          <span className="text-m3-display-sm text-m3-primary tabular-nums">
            {width}dp
          </span>
          <code
            className="text-m3-title-md text-muted-foreground"
            data-testid="active-class"
          >
            {CLASSES[activeIndex].name}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          {CLASSES.map(({ name, note }, index) => {
            const active = index === activeIndex
            return (
              <div
                key={name}
                data-testid={`row-${name}`}
                data-active={active || undefined}
                className={
                  "rounded-m3-lg flex items-center gap-4 px-4 py-3 " +
                  (active
                    ? "bg-m3-primary-container text-m3-on-primary-container"
                    : "bg-m3-surface-container text-m3-on-surface-variant")
                }
              >
                <code className="text-m3-label-lg w-32 shrink-0">{name}</code>
                <span className="text-m3-label-md w-32 shrink-0 tabular-nums">
                  {mins.length ? range(mins, index) : "—"}
                </span>
                <span className="text-m3-body-md">{note}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    const mins = minWidths(canvasElement)

    expect(mins).toEqual([0, 600, 840, 1200, 1600])

    const expected = CLASSES.reduce(
      (found, { name }, index) =>
        view.innerWidth >= mins[index] ? name : found,
      CLASSES[0].name as string,
    )
    expect(canvas.getByTestId("active-class")).toHaveTextContent(expected)
    expect(canvas.getByTestId(`row-${expected}`)).toHaveAttribute("data-active")
  },
}

/**
 * The variants in use. Each cell names the narrowest class that reveals it, so
 * the number of visible cells reads off the current window size class.
 *
 * `m3-compact:` is absent by design: every variant is a min-width, so it would
 * match at every width. Compact is the unprefixed base. To style compact *and
 * nothing wider*, negate the class above it — `max-m3-medium:`, as the base
 * cell does.
 */
export const Variants: Story = {
  render: () => (
    <div className="m3-medium:grid-cols-2 m3-expanded:grid-cols-3 m3-large:grid-cols-4 m3-extra-large:grid-cols-5 grid grid-cols-1 gap-2">
      {CLASSES.map(({ name, reveal }) => (
        <div
          key={name}
          data-testid={`cell-${name}`}
          className={
            "rounded-m3-lg bg-m3-secondary-container text-m3-on-secondary-container px-4 py-6 " +
            reveal
          }
        >
          <code className="text-m3-label-lg">
            {reveal ? `m3-${name}:` : "base"}
          </code>
          {reveal ? null : (
            <div
              data-testid="compact-only"
              className="text-m3-label-sm text-m3-on-surface-variant hidden max-m3-medium:block"
            >
              max-m3-medium: — compact only
            </div>
          )}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    const mins = minWidths(canvasElement)

    // A variant is only worth anything if it fires at Material's boundary and
    // not Tailwind's, so assert against the bound rather than against whatever
    // viewport the runner happens to have.
    CLASSES.forEach(({ name }, index) => {
      const cell = canvas.getByTestId(`cell-${name}`)
      const visible = view.getComputedStyle(cell).display !== "none"
      expect(visible, `m3-${name}: at ${view.innerWidth}px`).toBe(
        view.innerWidth >= mins[index],
      )
    })

    // The negated form is the only way to reach compact *and nothing wider*,
    // so it is worth pinning too.
    const compactOnly = canvas.getByTestId("compact-only")
    expect(view.getComputedStyle(compactOnly).display !== "none").toBe(
      view.innerWidth < mins[1],
    )
  },
}
