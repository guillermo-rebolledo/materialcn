import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"
import { Link } from "./link"

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A message about a page or a region of one that stays until it is dealt with. The snackbar covers the transient case; this is the persistent one.",
      },
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <AlertDescription>Your changes have been saved.</AlertDescription>,
  },
}

const SEVERITIES = [
  ["info", "status", "A service notice, a heads-up about a limit"],
  ["success", "status", "A confirmation that something completed"],
  ["warning", "alert", "Above a destructive area, or a deadline"],
  ["error", "alert", "A form-level failure, a service outage"],
] as const

/**
 * Material's baseline scheme ships primary, secondary, tertiary, and error — no
 * success or warning role — so those two borrow the container pair closest in
 * meaning rather than inventing roles a retheme would then have to know about.
 * All four pairs are covered by `pnpm check:contrast`, so the content clears AA
 * against the alert's own background in both schemes.
 *
 * Every severity carries an icon. Colour cannot be the only signal: roughly one
 * man in twelve cannot separate the warning and success containers.
 */
export const Severities: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex max-w-lg flex-col gap-m3-md">
      {SEVERITIES.map(([severity, , when]) => (
        <Alert
          key={severity}
          severity={severity}
          data-testid={`alert-${severity}`}
        >
          <AlertTitle className="capitalize">{severity}</AlertTitle>
          <AlertDescription>{when}</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const [severity, role] of SEVERITIES) {
      const [element] = canvas.getAllByTestId(`alert-${severity}`)

      // `alert` is assertive — it cuts across whatever a screen reader is
      // saying. Right for something that has gone wrong, wrong for a
      // confirmation, so it is derived from the severity rather than left to
      // each call site to get right.
      expect(element, severity).toHaveAttribute("role", role)
      expect(element).toHaveAttribute(
        "aria-live",
        role === "alert" ? "assertive" : "polite",
      )
      // The icon is what keeps the severity legible without colour.
      expect(
        element.querySelector('[data-slot="alert-icon"]'),
        `${severity} icon`,
      ).not.toBeNull()
    }
  },
}

/** The title is optional; a one-line message does not need one. */
export const WithAndWithoutTitle: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex max-w-lg flex-col gap-m3-md">
      <Alert severity="warning">
        <AlertDescription>
          Deleting this workspace cannot be undone.
        </AlertDescription>
      </Alert>
      <Alert severity="warning">
        <AlertTitle>This cannot be undone</AlertTitle>
        <AlertDescription>
          Deleting a workspace removes every project inside it, along with the
          history of each. Export anything you need first.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

/**
 * Actions sit below the message and wrap. A corner-pinned action has to reserve
 * its width from the text at every viewport, which on a phone leaves a column
 * of two-word lines beside an empty gutter; below the text, the alert simply
 * gets taller.
 */
export const WithActions: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex max-w-lg flex-col gap-m3-md">
      <Alert severity="error">
        <AlertTitle>Payment could not be processed</AlertTitle>
        <AlertDescription>
          The card ending 4242 was declined. Try another card, or{" "}
          <Link href="#">contact support</Link>.
        </AlertDescription>
        {/*
          Tonal rather than filled. A filled primary button sits its own
          On Primary label on Primary, which is a verified pair — but the
          button itself then sits on error-container, and primary against
          error-container is a pairing nothing checks. Tonal keeps the action
          inside the alert's own colour family.
        */}
        <AlertAction>
          <Button size="sm" variant="tonal">
            Update payment
          </Button>
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
        </AlertAction>
      </Alert>
    </div>
  ),
}

/**
 * The alert is full-width by default, so it fills whatever region it is given —
 * a form, a card, or the page. Narrow it by constraining the parent rather than
 * the alert.
 */
export const Widths: Story = {
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      <Alert severity="info">
        <AlertDescription>Full width of its container.</AlertDescription>
      </Alert>
      <div className="max-w-xs">
        <Alert severity="info">
          <AlertDescription>
            The same alert in a narrow region — the text reflows and the box
            gets taller.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  ),
}

/** The icon can be replaced, or dropped when the surrounding context supplies it. */
export const IconControl: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-m3-md">
      <Alert severity="info" icon={false} data-testid="no-icon">
        <AlertDescription>No icon.</AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByTestId("no-icon")
    expect(alert.querySelector('[data-slot="alert-icon"]')).toBeNull()
  },
}
