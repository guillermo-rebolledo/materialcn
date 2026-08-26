import type { Meta, StoryObj } from "@storybook/react-vite"

import { PALETTES } from "@/lib/palettes"

const meta = {
  title: "Foundations/Color",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** A container role paired with the content role meant to sit on it. */
type Pair = readonly [container: string, content: string]

function Swatch({ pair: [container, content] }: { pair: Pair }) {
  return (
    <div
      className="rounded-m3-lg flex min-h-24 flex-col justify-between p-4"
      style={{
        backgroundColor: `var(--m3-${container})`,
        color: `var(--m3-${content})`,
      }}
    >
      <span className="text-m3-label-lg">{container}</span>
      <span className="text-m3-label-sm opacity-80">{content}</span>
    </div>
  )
}

function Group({ title, pairs }: { title: string; pairs: readonly Pair[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-m3-title-md">{title}</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {pairs.map((pair) => (
          <Swatch key={pair[0]} pair={pair} />
        ))}
      </div>
    </section>
  )
}

const ACCENT = [
  ["primary", "on-primary"],
  ["primary-container", "on-primary-container"],
  ["secondary", "on-secondary"],
  ["secondary-container", "on-secondary-container"],
  ["tertiary", "on-tertiary"],
  ["tertiary-container", "on-tertiary-container"],
  ["error", "on-error"],
  ["error-container", "on-error-container"],
] as const satisfies readonly Pair[]

const SURFACE = [
  ["surface-container-lowest", "on-surface"],
  ["surface-container-low", "on-surface"],
  ["surface-container", "on-surface"],
  ["surface-container-high", "on-surface"],
  ["surface-container-highest", "on-surface"],
  ["surface-dim", "on-surface"],
  ["surface-bright", "on-surface"],
  ["surface-variant", "on-surface-variant"],
] as const satisfies readonly Pair[]

const UTILITY = [
  ["inverse-surface", "inverse-on-surface"],
  ["outline", "surface"],
  ["outline-variant", "on-surface"],
  ["scrim", "on-primary"],
] as const satisfies readonly Pair[]

/**
 * Material assigns every color a *role*, and pairs each container role with the
 * content role guaranteed to be legible on it. Reading these as pairs is the
 * whole point — never mix a container from one row with content from another.
 */
export const Roles: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-8">
      <Group title="Accent" pairs={ACCENT} />
      <Group title="Surface" pairs={SURFACE} />
      <Group title="Utility" pairs={UTILITY} />
    </div>
  ),
}

/**
 * shadcn's semantic names resolve to M3 roles, so unmodified shadcn components
 * pick up Material color without being patched.
 */
export const ShadcnBridge: Story = {
  parameters: { sideBySide: true },
  render: () => {
    const bridge = [
      ["background / foreground", "surface", "on-surface"],
      ["card / card-foreground", "surface-container-low", "on-surface"],
      ["popover / popover-foreground", "surface-container", "on-surface"],
      ["primary / primary-foreground", "primary", "on-primary"],
      ["secondary / secondary-foreground", "secondary-container", "on-secondary-container"],
      ["muted / muted-foreground", "surface-container-highest", "on-surface-variant"],
      ["accent / accent-foreground", "tertiary-container", "on-tertiary-container"],
      ["destructive", "error", "on-error"],
      ["border", "outline-variant", "on-surface"],
      ["input / ring", "outline", "surface"],
    ] as const

    return (
      <table className="text-m3-body-md w-full max-w-3xl border-collapse">
        <thead>
          <tr className="text-m3-label-lg text-left">
            <th className="border-border border-b p-3">shadcn variable</th>
            <th className="border-border border-b p-3">M3 role</th>
            <th className="border-border border-b p-3">Preview</th>
          </tr>
        </thead>
        <tbody>
          {bridge.map(([name, container, content]) => (
            <tr key={name}>
              <td className="border-border border-b p-3 font-mono text-xs">
                {name}
              </td>
              <td className="border-border text-muted-foreground border-b p-3 font-mono text-xs">
                {container}
              </td>
              <td className="border-border border-b p-3">
                <span
                  className="rounded-m3-sm inline-block px-3 py-1 text-xs"
                  style={{
                    backgroundColor: `var(--m3-${container})`,
                    color: `var(--m3-${content})`,
                  }}
                >
                  Aa
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
}

/**
 * Every palette, side by side.
 *
 * `data-palette` is a plain selector, so each column can carry its own palette
 * without any of them knowing about the others — which is the same mechanism a
 * runtime theme switcher uses, just applied to a subtree instead of `<html>`.
 */
export const Palettes: Story = {
  parameters: { sideBySide: true },
  render: () => {
    const roles = [
      ["primary", "on-primary"],
      ["primary-container", "on-primary-container"],
      ["tertiary-container", "on-tertiary-container"],
      ["surface-container-highest", "on-surface"],
      ["error-container", "on-error-container"],
    ] as const

    const columns = [
      { id: undefined, label: "Baseline" },
      ...PALETTES.map((entry) => ({ id: entry.id, label: entry.label })),
    ]

    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="text-m3-body-md text-m3-on-surface-variant max-w-prose">
          Each column sets <code>data-palette</code> on its wrapper. Nothing
          inside them is styled differently — the roles resolve against
          whichever palette they land in. Note the error row: it holds its red
          across all of them, because error carries meaning rather than brand.
        </p>
        <div className="grid grid-cols-5 gap-3">
          {columns.map((column) => (
            <div
              key={column.label}
              data-palette={column.id}
              className="flex flex-col gap-2"
            >
              <span className="text-m3-label-lg">{column.label}</span>
              {roles.map(([container, content]) => (
                <div
                  key={container}
                  className="rounded-m3-md flex min-h-14 items-end p-2"
                  style={{
                    backgroundColor: `var(--m3-${container})`,
                    color: `var(--m3-${content})`,
                  }}
                >
                  <span className="text-m3-label-sm">{container}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  },
}
