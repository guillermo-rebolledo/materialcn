import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

const meta = {
  title: "Foundations/Stacking",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** The documented order, lowest first. */
const LAYERS = [
  ["raised", "A surface lifted within the normal flow — a badge over an avatar"],
  ["sticky", "A header or toolbar that stays put while content scrolls"],
  ["scrim", "The dimming layer a modal paints over the page"],
  ["modal", "Dialogs and sheets — above their own scrim"],
  ["menu", "Menus, selects, popovers, date pickers"],
  ["snackbar", "Transient messages"],
  ["tooltip", "Tooltips"],
] as const

/**
 * Material describes elevation — shadow and surface tint — which says nothing
 * about paint order, so this scale is the library's own.
 *
 * Two placements are deliberate and easy to get backwards. **Menus sit above
 * modals**: a select inside a dialog portals to the body, making it a *sibling*
 * of the dialog rather than a descendant, so a lower z-index renders it behind
 * the dialog that opened it. Nothing is lost, because a page under an open
 * modal is inert and cannot have a menu open on it. **Tooltips sit above
 * everything**, one step further along the same argument.
 *
 * The panels below are stacked in reverse order and overlap deliberately: the
 * one painted on top is the one highest on the scale.
 */
export const Order: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="relative isolate h-96 w-full max-w-lg">
      {LAYERS.map(([layer, note], index) => (
        <div
          key={layer}
          data-testid={`layer-${layer}`}
          className="bg-m3-surface-container-high text-m3-on-surface border-m3-outline rounded-m3-md p-m3-md absolute w-72 border shadow-m3-2"
          style={{
            zIndex: `var(--m3-z-${layer})`,
            top: index * 44,
            left: index * 28,
          }}
        >
          <code className="text-m3-label-lg">--m3-z-{layer}</code>
          <p className="text-m3-body-sm text-m3-on-surface-variant">{note}</p>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!

    const values = LAYERS.map(([layer]) => {
      const [panel] = canvas.getAllByTestId(`layer-${layer}`)
      return Number.parseInt(view.getComputedStyle(panel).zIndex, 10)
    })

    // Every value resolves, and the documented order is the painted order —
    // asserting the sequence rather than the numbers, since the numbers are
    // spaced to leave room and may be renumbered.
    expect(values.some(Number.isNaN)).toBe(false)
    expect([...values].sort((a, b) => a - b)).toEqual(values)

    // The two placements that are worth stating outright, so a well-meaning
    // renumbering that puts menus under modals fails here.
    const value = (layer: string) =>
      values[LAYERS.findIndex(([name]) => name === layer)]
    expect(value("menu")).toBeGreaterThan(value("modal"))
    expect(value("modal")).toBeGreaterThan(value("scrim"))
    expect(value("tooltip")).toBeGreaterThan(value("snackbar"))
  },
}
