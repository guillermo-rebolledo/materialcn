import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
  InfoIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"

import { Button } from "./button"
import { Icon } from "./icon"

const meta = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { children: <CheckIcon /> },
  parameters: {
    docs: {
      description: {
        component:
          "Sizes an icon and lets it inherit its colour. Decorative by default; not interactive on its own.",
      },
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const SIZES = [
  ["xs", 18, "Chips and dense controls set in label-large"],
  ["sm", 20, "Buttons at label-large and title-medium; the XSmall icon button"],
  ["md", 24, "The default — icon buttons, list rows, app bars, navigation"],
  ["lg", 32, "Buttons set in headline-large"],
  ["xl", 40, "Extra-large controls"],
] as const

/**
 * The sizes are the kit's pairings, not a doubling scale. An icon is optically
 * matched to the text beside it, so each step names the type role it belongs
 * with rather than a multiple of some base.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      {SIZES.map(([size, , pairs]) => (
        <div key={size} className="flex items-center gap-m3-lg">
          <code className="text-m3-label-md text-muted-foreground w-12 shrink-0">
            {size}
          </code>
          <Icon size={size} data-testid={`icon-${size}`}>
            <SettingsIcon />
          </Icon>
          <span className="text-m3-body-sm text-muted-foreground">{pairs}</span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView!
    for (const [size, dp] of SIZES) {
      const icon = canvas.getByTestId(`icon-${size}`)
      const box = view.getComputedStyle(icon)
      expect(box.width, size).toBe(`${dp}px`)
      expect(box.height, size).toBe(`${dp}px`)
    }
  },
}

/**
 * An icon takes `currentColor`, so it is correct inside a filled button, a
 * tonal chip, and an error message without any of them passing it a colour.
 * That is the whole reason there is no `color` prop: a prop would let the icon
 * disagree with the label it sits beside.
 */
export const InheritsColour: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap items-center gap-m3-lg">
      <Button>
        <Icon size="sm">
          <PlusIcon />
        </Icon>
        Filled
      </Button>
      <Button variant="outline">
        <Icon size="sm">
          <PlusIcon />
        </Icon>
        Outlined
      </Button>
      <span className="text-m3-error inline-flex items-center gap-m3-sm text-m3-body-md">
        <Icon size="sm">
          <CircleAlertIcon />
        </Icon>
        Inherits the error colour
      </span>
      <span className="text-m3-on-surface-variant inline-flex items-center gap-m3-sm text-m3-body-md">
        <Icon size="sm">
          <InfoIcon />
        </Icon>
        …and the muted one
      </span>
    </div>
  ),
}

/**
 * Most icons repeat something the text already said, and should say nothing to
 * a screen reader — that is the default. Give `label` only when the icon is the
 * *only* thing carrying the meaning, and name the meaning rather than the
 * picture: "Delete", not "Trash can".
 */
export const LabelledAndDecorative: Story = {
  render: () => (
    <div className="flex flex-col gap-m3-lg">
      <span className="inline-flex items-center gap-m3-sm text-m3-body-md">
        <Icon data-testid="decorative">
          <Trash2Icon />
        </Icon>
        Delete this item
      </span>
      <span className="inline-flex items-center gap-m3-sm text-m3-body-md">
        <Icon label="Verified" data-testid="labelled">
          <CheckIcon />
        </Icon>
        Ada Lovelace
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The label is what makes it visible to assistive technology at all; with
    // no label the icon is hidden rather than left unnamed, which is the case
    // that actually hurts.
    expect(canvas.getByTestId("decorative")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
    expect(canvas.getByTestId("labelled")).not.toHaveAttribute("aria-hidden")
    expect(canvas.getByRole("img", { name: "Verified" })).toBeInTheDocument()
  },
}

/**
 * The reserved set. Fixing one icon per action is what makes an icon legible
 * without its label: a user who learns that this glyph means "more" learns it
 * once. Reach for a different glyph only when the action is genuinely not one
 * of these.
 */
const RESERVED = [
  ["Close, dismiss", XIcon, "X"],
  ["Back", ArrowLeftIcon, "ArrowLeft"],
  ["More actions", MoreVerticalIcon, "MoreVertical"],
  ["Search", SearchIcon, "Search"],
  ["Add, create", PlusIcon, "Plus"],
  ["Delete", Trash2Icon, "Trash2"],
  ["Edit", PencilIcon, "Pencil"],
  ["Settings", SettingsIcon, "Settings"],
  ["Confirm, selected", CheckIcon, "Check"],
  ["Expand, reveal", ChevronDownIcon, "ChevronDown"],
  ["Opens elsewhere", ExternalLinkIcon, "ExternalLink"],
  ["Information", InfoIcon, "Info"],
  ["Warning", TriangleAlertIcon, "TriangleAlert"],
  ["Error", CircleAlertIcon, "CircleAlert"],
] as const

export const ReservedIcons: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="grid grid-cols-2 gap-m3-md">
      {RESERVED.map(([action, Glyph, name]) => (
        <div key={name} className="flex items-center gap-m3-md">
          <Icon>
            <Glyph />
          </Icon>
          <div className="flex flex-col">
            <span className="text-m3-body-md">{action}</span>
            <code className="text-m3-label-sm text-muted-foreground">
              {name}
            </code>
          </div>
        </div>
      ))}
    </div>
  ),
}
