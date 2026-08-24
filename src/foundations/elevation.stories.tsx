import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Foundations/Elevation",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Six levels, each a key-light shadow plus an ambient one.
 *
 * In dark themes Material leans on surface *containers* rather than shadow to
 * express depth — a shadow against a dark surface reads as mud. Compare the
 * two columns: the same levels, very different legibility.
 */
export const Levels: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {[0, 1, 2, 3, 4, 5].map((level) => (
        <div key={level} className="flex flex-col items-center gap-2">
          <div
            className="bg-m3-surface-container-low rounded-m3-lg grid size-28 place-items-center"
            style={{ boxShadow: `var(--m3-elevation-${level})` }}
          >
            <span className="text-m3-label-lg">{level}</span>
          </div>
          <code className="text-m3-label-sm text-muted-foreground">
            shadow-m3-{level}
          </code>
        </div>
      ))}
    </div>
  ),
}

/** The surface container ramp — Material's primary depth cue in dark themes. */
export const SurfaceRamp: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-2">
      {[
        "surface-container-lowest",
        "surface-container-low",
        "surface-container",
        "surface-container-high",
        "surface-container-highest",
      ].map((role) => (
        <div
          key={role}
          className="rounded-m3-md text-m3-label-lg px-4 py-6"
          style={{
            backgroundColor: `var(--m3-${role})`,
            color: "var(--m3-on-surface)",
          }}
        >
          {role}
        </div>
      ))}
    </div>
  ),
}
