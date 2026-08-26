import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { Checkbox } from "./checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field"
import { Input } from "./input"
import { Switch } from "./switch"

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The assembly kit for a labelled control. Reach for `TextField` when you want Material's text field — this is for the cases it does not cover: a checkbox with a description, a switch in a settings row, a fieldset of related inputs.",
      },
    },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="workspace">Workspace name</FieldLabel>
      <Input id="workspace" defaultValue="Engineering" />
      <FieldDescription>
        Shown to everyone you invite.
      </FieldDescription>
    </Field>
  ),
}

/**
 * `vertical` stacks; `horizontal` puts the control beside its label, which is
 * the settings-row shape; `responsive` is vertical until the surrounding
 * `FieldGroup` is wide enough, using a container query rather than the window.
 */
export const Orientations: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <FieldGroup className="max-w-md">
      {(["vertical", "horizontal"] as const).map((orientation) => (
        <Field key={orientation} orientation={orientation}>
          <FieldLabel htmlFor={`notify-${orientation}`}>
            {orientation}
          </FieldLabel>
          <Switch id={`notify-${orientation}`} defaultChecked />
        </Field>
      ))}
    </FieldGroup>
  ),
}

/**
 * `FieldContent` is what lets a description sit under a label *beside* a
 * control rather than under the whole row — the checkbox stays aligned to the
 * first line of text instead of drifting to the middle of the block.
 */
export const WithContent: Story = {
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox id="terms" />
      <FieldContent>
        <FieldLabel htmlFor="terms">Keep me signed in</FieldLabel>
        <FieldDescription>
          Not recommended on a shared computer.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
}

/** `FieldError` takes either children or a list of errors, and renders neither if empty. */
export const Invalid: Story = {
  render: () => (
    <Field className="max-w-sm" data-invalid="true">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" defaultValue="not-an-email" aria-invalid />
      <FieldError errors={[{ message: "Enter a valid email address." }]} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.getByText("Enter a valid email address."),
    ).toBeInTheDocument()
  },
}

/** A set of related fields, with a legend that names the group. */
export const Grouped: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <FieldSet className="max-w-md">
      <FieldLegend>Notifications</FieldLegend>
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="email-notifications">Email</FieldLabel>
          <Switch id="email-notifications" defaultChecked />
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Push</FieldTitle>
            <FieldDescription>Requires a mobile app.</FieldDescription>
          </FieldContent>
          <Switch id="push-notifications" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}
