import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"

const meta = {
  title: "Foundations/Motion",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SPATIAL = ["spatial-fast", "spatial-default", "spatial-slow"] as const
const EFFECTS = ["effects-fast", "effects-default", "effects-slow"] as const

function Track({ token, moved }: { token: string; moved: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <code className="text-m3-label-md text-muted-foreground w-40 shrink-0">
        {token}
      </code>
      <div
        className="bg-m3-surface-container rounded-m3-full relative h-12 flex-1"
        style={{ containerType: "inline-size" }}
      >
        <div
          className="bg-m3-primary rounded-m3-full absolute top-0 left-0 h-12 w-12"
          style={{
            transform: moved ? "translateX(calc(100cqw - 3rem))" : "none",
            transitionProperty: "transform",
            transitionTimingFunction: `var(--m3-spring-${token})`,
            transitionDuration: `var(--m3-spring-${token}-duration)`,
          }}
        />
      </div>
    </div>
  )
}

/**
 * Expressive spatial springs overshoot their target by roughly 9% before
 * settling. That bounce is what separates Expressive from the standard motion
 * scheme — it is not decoration, it is how the system signals that something
 * moved under its own momentum.
 */
export const SpatialSprings: Story = {
  render: function SpatialSpringsStory() {
    const [moved, setMoved] = useState(false)

    return (
      <div className="flex max-w-3xl flex-col gap-6">
        <Button className="self-start" onClick={() => setMoved((v) => !v)}>
          {moved ? "Send back" : "Move"}
        </Button>
        <div className="flex flex-col gap-4">
          {SPATIAL.map((token) => (
            <Track key={token} token={token} moved={moved} />
          ))}
        </div>
        <p className="text-m3-body-sm text-muted-foreground">
          Each track uses <code>--m3-spring-*</code> paired with its matching{" "}
          <code>-duration</code>. The curve is a sampled damped-spring emitted as
          CSS <code>linear()</code>, so it works on any animatable property.
        </p>
      </div>
    )
  },
}

/**
 * Effects springs are critically damped — they never overshoot. Color and
 * opacity must not bounce, or the UI reads as broken rather than lively.
 */
export const EffectsSprings: Story = {
  render: function EffectsSpringsStory() {
    const [on, setOn] = useState(false)

    return (
      <div className="flex max-w-3xl flex-col gap-6">
        <Button className="self-start" onClick={() => setOn((v) => !v)}>
          Toggle
        </Button>
        <div className="flex flex-col gap-4">
          {EFFECTS.map((token) => (
            <div key={token} className="flex items-center gap-4">
              <code className="text-m3-label-md text-muted-foreground w-40 shrink-0">
                {token}
              </code>
              <div
                className="rounded-m3-lg h-12 flex-1"
                style={{
                  backgroundColor: on
                    ? "var(--m3-tertiary-container)"
                    : "var(--m3-surface-container-highest)",
                  transitionProperty: "background-color",
                  transitionTimingFunction: `var(--m3-spring-${token})`,
                  transitionDuration: `var(--m3-spring-${token}-duration)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * The Expressive and standard schemes side by side. Switch the whole library
 * over by re-pointing the six `--m3-spring-*` aliases at the standard set.
 */
export const SchemeComparison: Story = {
  render: function SchemeComparisonStory() {
    const [moved, setMoved] = useState(false)

    return (
      <div className="flex max-w-3xl flex-col gap-6">
        <Button className="self-start" onClick={() => setMoved((v) => !v)}>
          {moved ? "Send back" : "Move"}
        </Button>
        {(["expressive", "standard"] as const).map((scheme) => (
          <div key={scheme} className="flex flex-col gap-3">
            <h3 className="text-m3-title-sm capitalize">{scheme}</h3>
            {SPATIAL.map((token) => (
              <Track key={token} token={`${scheme}-${token}`} moved={moved} />
            ))}
          </div>
        ))}
      </div>
    )
  },
}

/** Bezier easings, for transitions that enter or leave the screen entirely. */
export const Easings: Story = {
  render: function EasingsStory() {
    const [moved, setMoved] = useState(false)
    const easings = [
      "emphasized",
      "emphasized-decelerate",
      "emphasized-accelerate",
      "standard",
      "standard-decelerate",
      "standard-accelerate",
    ] as const

    return (
      <div className="flex max-w-3xl flex-col gap-6">
        <Button className="self-start" onClick={() => setMoved((v) => !v)}>
          {moved ? "Send back" : "Move"}
        </Button>
        <div className="flex flex-col gap-4">
          {easings.map((name) => (
            <div key={name} className="flex items-center gap-4">
              <code className="text-m3-label-md text-muted-foreground w-52 shrink-0">
                {name}
              </code>
              <div
                className="bg-m3-surface-container rounded-m3-full relative h-12 flex-1"
                style={{ containerType: "inline-size" }}
              >
                <div
                  className="bg-m3-secondary rounded-m3-full absolute top-0 left-0 h-12 w-12"
                  style={{
                    transform: moved
                      ? "translateX(calc(100cqw - 3rem))"
                      : "none",
                    transitionProperty: "transform",
                    transitionTimingFunction: `var(--m3-ease-${name})`,
                    transitionDuration: "var(--m3-duration-long-2)",
                          }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
