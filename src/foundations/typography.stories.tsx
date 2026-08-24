import type { Meta, StoryObj } from "@storybook/react-vite"

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
