import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { FolderIcon, SlashIcon } from "lucide-react"

import { Breadcrumbs } from "./breadcrumbs"
import { Icon } from "./icon"

const meta = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Where the current page sits in the hierarchy, and a way back to any ancestor. Collapses its middle when the trail does not fit.",
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Navigation", href: "/components/navigation" },
  { label: "Breadcrumbs" },
]

export const Default: Story = {
  args: { items: TRAIL },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A landmark with the list intact — the structure is what tells a screen
    // reader how deep the page sits, not the chevrons.
    const nav = canvas.getByRole("navigation", { name: /breadcrumb/i })
    expect(within(nav).getByRole("list")).toBeInTheDocument()

    // The current page is marked and is not a destination.
    const current = canvas.getByText("Breadcrumbs")
    expect(current).toHaveAttribute("aria-current", "page")
    expect(current.tagName).not.toBe("A")

    expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    )
  },
}

/**
 * One icon for the whole trail, not one per entry. Icons on some steps and not
 * others read as though they mean something, and they do not — a trail is a
 * path, and every segment of it is the same kind of thing.
 */
export const WithIcons: Story = {
  parameters: { sideBySide: true },
  args: {
    items: TRAIL,
    icon: (
      <Icon size="xs">
        <FolderIcon />
      </Icon>
    ),
  },
}

/** The separator is whatever you give it. */
export const CustomSeparator: Story = {
  parameters: { sideBySide: true },
  args: {
    items: TRAIL,
    separator: (
      <Icon size="xs">
        <SlashIcon />
      </Icon>
    ),
  },
}

/** A step can be present in the path without being navigable. */
export const DisabledStep: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Restricted", href: "/restricted", disabled: true },
      { label: "Current" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const step = canvas.getByText("Restricted")
    expect(step).toHaveAttribute("aria-disabled", "true")
    expect(step).not.toHaveAttribute("href")
  },
}

const DEEP = [
  { label: "Home", href: "/" },
  { label: "Workspaces", href: "/w" },
  { label: "Engineering", href: "/w/eng" },
  { label: "Design system", href: "/w/eng/ds" },
  { label: "Components", href: "/w/eng/ds/components" },
  { label: "Navigation", href: "/w/eng/ds/components/nav" },
  { label: "Breadcrumbs" },
]

/**
 * There is no CSS for "collapse the middle when it does not fit", so the
 * component measures — shrinking one step at a time until the trail fits, in a
 * layout effect so the overflowing state is never painted.
 *
 * The root and the current page always survive: they are the two ends the trail
 * exists to relate. The steps in between fold into a menu rather than being
 * dropped, so the navigation is still there.
 */
export const CollapsesWhenItDoesNotFit: Story = {
  args: { items: DEEP },
  render: (args) => (
    <div className="flex flex-col gap-m3-xl">
      <div>
        <code className="text-m3-label-sm text-muted-foreground">
          room for the whole trail
        </code>
        <Breadcrumbs {...args} />
      </div>
      <div className="w-80" data-testid="narrow">
        <code className="text-m3-label-sm text-muted-foreground">
          320px — the middle folds away
        </code>
        <Breadcrumbs {...args} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const narrow = within(canvas.getByTestId("narrow"))

    const trigger = await narrow.findByRole("button", {
      name: /hidden steps/i,
    })

    // Both ends stay visible; the middle is what folds.
    expect(narrow.getByRole("link", { name: "Home" })).toBeInTheDocument()
    expect(narrow.getByText("Breadcrumbs")).toHaveAttribute(
      "aria-current",
      "page",
    )

    // And the folded steps are reachable rather than gone.
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByRole("menuitem", {
          name: "Workspaces",
        }),
      ).toBeInTheDocument(),
    )
    await userEvent.keyboard("{Escape}")
  },
}
