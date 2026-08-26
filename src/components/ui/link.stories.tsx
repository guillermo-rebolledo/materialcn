import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { ExternalLinkIcon } from "lucide-react"

import { Icon } from "./icon"
import { Link } from "./link"

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  args: { children: "a link", href: "#" },
  parameters: {
    docs: {
      description: {
        component:
          "A link inside a paragraph. Inherits the surrounding typography and colour; announces as a link or a button depending on whether it has a destination.",
      },
    },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * The default inherits everything but the underline. A link that changes the
 * font, the size, or the colour of the sentence it is in makes the paragraph
 * harder to read than the link is to find.
 */
export const InAParagraph: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex max-w-md flex-col gap-m3-lg">
      <p className="text-m3-body-lg">
        Material 3 is a design system, and{" "}
        <Link href="#">this is a link inside a paragraph that is long enough
        to wrap across more than one line</Link>{" "}
        — note that it fragments with the text rather than jumping to the next
        line as a block would.
      </p>
      <p className="text-m3-body-sm text-m3-on-surface-variant">
        The same link in smaller, muted text{" "}
        <Link href="#">takes that size and that colour</Link>, because it
        inherits both.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    const [link] = canvas.getAllByRole("link", { name: /fragments|wrap/ })

    // Inline, not inline-flex: a flex link is one unbreakable box, so setting
    // one mid-paragraph shunts the whole thing to the next line and leaves a
    // ragged hole above it.
    expect(view.getComputedStyle(link).display).toBe("inline")
    // Which is observable: a wrapping inline element reports several boxes.
    expect(link.getClientRects().length).toBeGreaterThan(1)

    const [muted] = canvas.getAllByRole("link", { name: /that colour/ })
    const paragraph = muted.closest("p")!
    const styles = view.getComputedStyle(muted)
    const around = view.getComputedStyle(paragraph)
    expect(styles.color).toBe(around.color)
    expect(styles.fontSize).toBe(around.fontSize)
    expect(styles.fontWeight).toBe(around.fontWeight)
  },
}

/**
 * The role is resolved from the props rather than named by one. A destination
 * announces as a link; an action announces as a button. Getting this backwards
 * tells a screen-reader user a new page is coming and then delivers nothing.
 */
export const RoleFollowsThePurpose: Story = {
  render: () => (
    <div className="flex flex-col gap-m3-md text-m3-body-lg">
      <span>
        <Link href="/pricing">Has a destination</Link> — announces as a link
      </span>
      <span>
        <Link onClick={() => {}}>Runs an action</Link> — announces as a button
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.getByRole("link", { name: "Has a destination" }),
    ).toBeInTheDocument()
    expect(
      canvas.getByRole("button", { name: "Runs an action" }),
    ).toBeInTheDocument()
  },
}

/**
 * A disabled link renders as a `span`. Dropping `href` from an anchor would
 * leave it focusable with no role; `aria-disabled` alone would leave it still
 * activating. The span keeps `role="link"` so the announcement stays accurate
 * about what it would be.
 */
export const Disabled: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-m3-md text-m3-body-lg">
      <span>
        <Link href="#" disabled data-testid="disabled-link">
          Unavailable destination
        </Link>
      </span>
      <span>
        <Link disabled onClick={() => {}}>
          Unavailable action
        </Link>
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    const [link] = canvas.getAllByTestId("disabled-link")

    expect(link.tagName).toBe("SPAN")
    expect(link).toHaveAttribute("aria-disabled", "true")
    expect(link).not.toHaveAttribute("href")
    // Non-interactive in fact, not only in announcement.
    expect(view.getComputedStyle(link).pointerEvents).toBe("none")
  },
}

/** Colour roles, for the cases that genuinely need to stand apart from their text. */
export const Colours: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-col gap-m3-md text-m3-body-lg">
      <span>
        <Link href="#">inherit</Link> — the default
      </span>
      <span>
        <Link href="#" color="primary">
          primary
        </Link>{" "}
        — a standalone call to action
      </span>
      <span>
        <Link href="#" color="error">
          error
        </Link>{" "}
        — inside an error message
      </span>
    </div>
  ),
}

/**
 * An icon sits beside the label with `vertical-align`, not with flex — the link
 * has to stay inline to wrap. An icon-*only* link is not a supported shape:
 * with no label there is nothing for the underline to sit under, which is an
 * icon button, and that is what `Button` is for.
 */
export const WithIcon: Story = {
  render: () => (
    <p className="max-w-md text-m3-body-lg">
      The specification lives on{" "}
      <Link href="https://m3.material.io">
        m3.material.io
        <Icon size="xs">
          <ExternalLinkIcon />
        </Icon>
      </Link>
      , which opens in a new place.
    </p>
  ),
}
