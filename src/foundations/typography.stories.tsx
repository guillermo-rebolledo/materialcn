import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SCALE = [
  ["display", ["lg", "md", "sm"], "Largest text on the screen. Short strings only."],
  ["headline", ["lg", "md", "sm"], "High-emphasis text; shorter than display."],
  ["title", ["lg", "md", "sm"], "Section and card headings."],
  ["body", ["lg", "md", "sm"], "Long-form reading text."],
  ["label", ["lg", "md", "sm"], "Text inside components: buttons, chips, tabs."],
] as const

/**
 * The M3 type scale: five roles at three sizes each. Roles carry meaning —
 * pick by what the text *is*, not by how large you want it to look.
 */
export const Scale: Story = {
  render: () => (
    <div className="flex max-w-4xl flex-col gap-10">
      {SCALE.map(([role, sizes, description]) => (
        <section key={role} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-m3-title-md capitalize">{role}</h3>
            <p className="text-m3-body-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {sizes.map((size) => (
              <div key={size} className="flex flex-col gap-1">
                <code className="text-m3-label-sm text-muted-foreground">
                  text-m3-{role}-{size}
                </code>
                <p className={`text-m3-${role}-${size}`}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}

/**
 * Expressive adds an emphasized weight to every role. On Roboto Flex that is a
 * variable-axis shift rather than a separate font file, so it costs nothing to
 * load.
 */
export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["regular", "medium", "emphasized"] as const).map((weight) => (
        <div key={weight} className="flex flex-col gap-1">
          <code className="text-m3-label-sm text-muted-foreground">
            font-m3-{weight}
          </code>
          <p className={`text-m3-headline-sm font-m3-${weight}`}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      ))}
    </div>
  ),
}

/* ------------------------------------------------------- responsive scale */

/**
 * The roles that step down on a narrow window, and the rung they step to.
 *
 * The sizes are written out rather than read from the token layer on purpose —
 * a test that derives its expectation from the thing under test cannot catch a
 * hand-edited responsive value, which is the one failure worth catching here.
 */
const RESPONSIVE = [
  { role: "display-lg", size: 57, line: 64, step: "display-md", to: [45, 52] },
  { role: "display-md", size: 45, line: 52, step: "display-sm", to: [36, 44] },
  { role: "display-sm", size: 36, line: 44, step: "headline-lg", to: [32, 40] },
  { role: "headline-lg", size: 32, line: 40, step: "headline-md", to: [28, 36] },
  { role: "headline-md", size: 28, line: 36, step: "headline-sm", to: [24, 32] },
  { role: "headline-sm", size: 24, line: 32, step: "title-lg", to: [22, 28] },
] as const

/**
 * Display and headline step down one rung of the ladder below the `expanded`
 * class — display-lg renders at display-md's size, headline-sm at title-lg's.
 * One rule applied uniformly, rather than a second hand-tuned scale: the
 * ladder's own steps are already the sizes Material considers adjacent.
 *
 * Line height and tracking come down with the size. Leaving a 64dp line height
 * under 45dp text is the usual way a responsive scale goes wrong.
 *
 * Title, body, and label do not move — they are reading and control text, and
 * shrinking them on a phone would tighten the measure on the screen where it is
 * already tightest.
 *
 * The two columns below are the same specimen at both renderings. The narrow
 * column is not a mock-up of the stepped size — it is set from the rung the
 * role steps *to*, which is what stepping means, so the columns cannot show
 * something the token layer would not.
 */
export const ResponsiveScale: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="grid gap-m3-xl md:grid-cols-2">
      {(
        [
          ["expanded and up", false],
          ["compact and medium", true],
        ] as const
      ).map(([heading, stepped]) => (
        <section key={heading} className="flex flex-col gap-m3-md">
          <code className="text-m3-label-lg text-muted-foreground">
            {heading}
          </code>
          {RESPONSIVE.map(({ role, step }) => (
            <div key={role} className="flex flex-col gap-m3-xs">
              <code className="text-m3-label-sm text-muted-foreground">
                text-m3-{role}
                {stepped ? ` → ${step}` : ""}
              </code>
              <p
                style={{
                  fontSize: `var(--m3-${stepped ? step : role}-size)`,
                  lineHeight: `var(--m3-${stepped ? step : role}-line)`,
                  letterSpacing: `var(--m3-${stepped ? step : role}-tracking)`,
                }}
              >
                Material
              </p>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
}

/**
 * The stepping rule is "one rung down the ladder", and the ladder is the scale
 * itself. Pinning the equality here is what stops the two from drifting: a
 * hand-edited responsive value would still look plausible.
 */
export const StepsMatchTheLadder: Story = {
  render: () => (
    <ul className="flex flex-col gap-m3-xs">
      {RESPONSIVE.map(({ role, step }) => (
        <li key={role} className="text-m3-body-md" data-testid={`step-${role}`}>
          <code>{role}</code> renders at <code>{step}</code> below expanded
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    const styles = view.getComputedStyle(canvasElement)
    const dp = (role: string, part: string) =>
      Number.parseFloat(styles.getPropertyValue(`--m3-${role}-${part}`)) * 16

    const narrow = view.innerWidth < 840

    for (const { role, size, line, to } of RESPONSIVE) {
      expect(canvas.getByTestId(`step-${role}`)).toBeInTheDocument()

      const [steppedSize, steppedLine] = to
      const where = `${role} at ${view.innerWidth}px`
      expect(dp(role, "size"), where).toBe(narrow ? steppedSize : size)
      // The line height has to travel with the size, or the stepped text sits
      // in a box built for the canonical one — the usual way a responsive
      // scale goes wrong.
      expect(dp(role, "line"), where).toBe(narrow ? steppedLine : line)
    }
  },
}
