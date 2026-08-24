import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "./button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"
import { Field, FieldGroup, FieldLabel } from "./field"
import { Input } from "./input"

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Surface roles</CardTitle>
        <CardDescription>
          Cards sit on the surface-container-low role, one step above the page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-m3-body-md text-m3-on-surface-variant">
          In Material, depth is communicated by which surface container an
          element sits on, not by a drop shadow alone.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Dismiss</Button>
        <Button>Got it</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your work account.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">
            Sign up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="card-email">Email</FieldLabel>
            <Input id="card-email" type="email" placeholder="you@example.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="card-password">Password</FieldLabel>
            <Input id="card-password" type="password" />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  ),
}

/** Every elevation level, so shadow tokens can be compared side by side. */
export const Elevations: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[0, 1, 2, 3, 4, 5].map((level) => (
        <Card
          key={level}
          className="w-40"
          style={{ boxShadow: `var(--m3-elevation-${level})` }}
        >
          <CardHeader>
            <CardTitle className="text-m3-title-sm">Level {level}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
}

/** The three Material card styles, which differ only in how they show depth. */
export const Variants: Story = {
  parameters: { sideBySide: true },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["elevated", "filled", "outlined"] as const).map((variant) => (
        <Card key={variant} variant={variant} className="w-56">
          <CardHeader>
            <CardTitle className="capitalize">{variant}</CardTitle>
            <CardDescription>
              {variant === "elevated"
                ? "Shadow plus a low container."
                : variant === "filled"
                  ? "Highest container, no shadow."
                  : "Hairline outline on the base surface."}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
}
