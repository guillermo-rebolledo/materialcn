import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Copy, FolderInput, MoreVertical, Pencil, Share2, Trash2 } from "lucide-react"

import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"

const meta = {
  title: "Components/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

function PointerMenu() {
  const [lastAction, setLastAction] = useState("No action yet")

  return (
    <div className="flex flex-col items-start gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setLastAction("Duplicate selected")}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>Move</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <output aria-live="polite">{lastAction}</output>
    </div>
  )
}

/** Pointer selection dismisses the popup and restores focus to its trigger. */
export const PointerInteraction: Story = {
  render: () => <PointerMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Actions" })

    await userEvent.click(trigger)
    const menu = await page.findByRole("menu")
    await waitFor(() => expect(menu).toBeVisible())
    await userEvent.click(within(menu).getByRole("menuitem", { name: "Duplicate" }))
    await expect(canvas.getByText("Duplicate selected")).toBeVisible()
    await waitFor(() => expect(page.queryByRole("menu")).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

function KeyboardMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Edit actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Pencil aria-hidden="true" />
            Rename
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <Trash2 aria-hidden="true" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem defaultChecked>
            Show activity
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Arrow keys expose disabled actions without activating them; Escape restores focus. */
export const KeyboardAndStates: Story = {
  render: () => <KeyboardMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Edit actions" })

    trigger.focus()
    await userEvent.keyboard("{Enter}")
    const menu = await page.findByRole("menu")
    const rename = within(menu).getByRole("menuitem", { name: /Rename/ })
    const unavailable = within(menu).getByRole("menuitem", { name: "Unavailable" })
    const destructive = within(menu).getByRole("menuitem", { name: "Delete" })
    const checked = within(menu).getByRole("menuitemcheckbox", { name: "Show activity" })

    await waitFor(() => expect(rename).toHaveFocus())
    await expect(unavailable).toHaveAttribute("aria-disabled", "true")
    await expect(destructive).toHaveAttribute("data-variant", "destructive")
    await expect(checked).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() => expect(unavailable).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() => expect(destructive).toHaveFocus())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

function PresentationMenu({
  variant,
  defaultOpen = false,
}: {
  variant: "standard" | "vibrant"
  defaultOpen?: boolean
}) {
  return (
    <DropdownMenu defaultOpen={defaultOpen} modal={!defaultOpen}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open {variant}
      </DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Copy aria-hidden="true" />
            Copy link
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The kit's standard and vibrant menu surfaces, shown in both color schemes. */
export const Presentations: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <PresentationMenu variant="standard" />
      <PresentationMenu variant="vibrant" />
    </div>
  ),
}

export const StandardPresentation: Story = {
  parameters: { sideBySide: true },
  render: () => <PresentationMenu variant="standard" defaultOpen />,
}

export const VibrantPresentation: Story = {
  parameters: { sideBySide: true },
  render: () => <PresentationMenu variant="vibrant" defaultOpen />,
}

/** Both Material presentations expose their selected surface to composed items. */
export const PresentationContract: Story = {
  render: () => <PresentationMenu variant="vibrant" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole("button", { name: "Open vibrant" }))
    const menu = await page.findByRole("menu")
    await expect(menu).toHaveAttribute("data-presentation", "vibrant")
    await waitFor(() =>
      expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(208),
    )
  },
}

function CompleteMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" aria-label="More actions" />}
      >
        <MoreVertical aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="vibrant">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Document</DropdownMenuLabel>
          <DropdownMenuItem>
            <Pencil aria-hidden="true" />
            Rename
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInput aria-hidden="true" />
              Move to
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Destination</DropdownMenuLabel>
                <DropdownMenuItem>Design</DropdownMenuItem>
                <DropdownMenuItem>Research</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem defaultChecked>
            Show activity
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup defaultValue="team">
            <DropdownMenuRadioItem value="team">Team access</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="private">Private access</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Share2 aria-hidden="true" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <Trash2 aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Groups, separators, checked choices, nested destinations, and destructive actions. */
export const CompleteComposition: Story = {
  parameters: { sideBySide: true },
  render: () => <CompleteMenu />,
}

/** Escape closes a nested menu first, then the root menu and restores trigger focus. */
export const NestedKeyboardInteraction: Story = {
  render: () => <CompleteMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "More actions" })

    await userEvent.click(trigger)
    const rootMenu = await page.findByRole("menu")
    await userEvent.click(within(rootMenu).getByRole("menuitem", { name: "Move to" }))
    await waitFor(() => expect(page.getAllByRole("menu")).toHaveLength(2))
    const submenu = page.getAllByRole("menu")[1]
    await expect(submenu).toHaveAttribute("data-presentation", "vibrant")
    await waitFor(() =>
      expect(
        within(submenu).getByRole("menuitem", { name: "Design" }),
      ).toBeVisible(),
    )

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.getAllByRole("menu")).toHaveLength(1))
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

const NAV = [
  ["Product", ["Overview", "Features", "Integrations"]],
  ["Developers", ["Documentation", "API reference", "Changelog"]],
  ["Company", ["About", "Careers", "Contact"]],
] as const

/**
 * The navigation-menu shape, where a click at every level is tedious. Hover a
 * top-level item to open it, and move sideways to swap between them.
 *
 * Keyboard users get the equivalent: tab to a trigger and the menu opens. The
 * two have to match, or hover becomes a shortcut only some people have.
 *
 * Closing is unchanged — Escape, a selection, and tabbing out of the content
 * all still work, because none of that was reimplemented.
 */
export const HoverTriggered: Story = {
  render: () => (
    <nav className="flex items-center gap-m3-sm">
      {NAV.map(([section, links]) => (
        <DropdownMenu key={section}>
          <DropdownMenuTrigger
            openOnHover
            render={<Button variant="ghost" size="sm" />}
            data-testid={`nav-${section}`}
          >
            {section}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {links.map((link) => (
              <DropdownMenuItem key={link}>{link}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.hover(canvas.getByTestId("nav-Product"))
    await waitFor(() =>
      expect(body.getByRole("menuitem", { name: "Overview" })).toBeVisible(),
    )

    // Escape still closes — the hover path did not replace the close path.
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(body.queryByRole("menuitem", { name: "Overview" })).toBeNull(),
    )
  },
}

/** Focus opens it too, or hover would be a shortcut only some people have. */
export const HoverTriggerOpensOnFocus: Story = {
  render: () => (
    <div className="flex items-center gap-m3-sm">
      <Button variant="ghost" size="sm">
        Before
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          openOnHover
          render={<Button variant="ghost" size="sm" />}
        >
          Product
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Overview</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    canvas.getByRole("button", { name: "Before" }).focus()
    await userEvent.tab()

    await waitFor(() =>
      expect(body.getByRole("menuitem", { name: "Overview" })).toBeVisible(),
    )
    await userEvent.keyboard("{Escape}")
  },
}

/** Without the prop, nothing changes: hovering does not open it. */
export const ClickTriggeredByDefault: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" />}
        data-testid="click-trigger"
      >
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.hover(canvas.getByTestId("click-trigger"))
    expect(body.queryByRole("menuitem", { name: "Rename" })).toBeNull()

    await userEvent.click(canvas.getByTestId("click-trigger"))
    await waitFor(() =>
      expect(body.getByRole("menuitem", { name: "Rename" })).toBeVisible(),
    )
    await userEvent.keyboard("{Escape}")
  },
}
