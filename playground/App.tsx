import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react"

import { useTheme, type Theme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const THEMES: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      value={[theme]}
      onValueChange={([next]) => next && setTheme(next as Theme)}
      variant="outline"
    >
      {THEMES.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/** Every M3 color role, so a theme change is verifiable at a glance. */
function ColorRoles() {
  const roles = [
    ["primary", "on-primary"],
    ["primary-container", "on-primary-container"],
    ["secondary", "on-secondary"],
    ["secondary-container", "on-secondary-container"],
    ["tertiary", "on-tertiary"],
    ["tertiary-container", "on-tertiary-container"],
    ["error", "on-error"],
    ["error-container", "on-error-container"],
    ["surface-container-lowest", "on-surface"],
    ["surface-container", "on-surface"],
    ["surface-container-highest", "on-surface"],
    ["inverse-surface", "inverse-on-surface"],
  ] as const

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {roles.map(([bg, fg]) => (
        <div
          key={bg}
          className="rounded-m3-lg px-4 py-6 text-m3-label-lg"
          style={{
            backgroundColor: `var(--m3-${bg})`,
            color: `var(--m3-${fg})`,
          }}
        >
          {bg}
        </div>
      ))}
    </div>
  )
}

export function App() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-m3-display-sm font-m3-emphasized">materialcn</h1>
          <p className="text-m3-body-md text-muted-foreground">
            shadcn/ui components on Material 3 Expressive tokens.
          </p>
        </div>
        <ThemeSwitcher />
      </header>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-m3-title-lg">Color roles</h2>
        <ColorRoles />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-m3-title-lg">Type scale</h2>
        <div className="flex flex-col gap-2">
          <p className="text-m3-display-sm">Display small</p>
          <p className="text-m3-headline-md">Headline medium</p>
          <p className="text-m3-title-lg">Title large</p>
          <p className="text-m3-body-lg">
            Body large — the reading size for longer passages of text.
          </p>
          <p className="text-m3-label-lg">Label large</p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-m3-title-lg">Elevation</h2>
        <div className="flex flex-wrap gap-4">
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="rounded-m3-lg bg-m3-surface-container-low grid size-24 place-items-center text-m3-label-md"
              style={{ boxShadow: `var(--m3-elevation-${level})` }}
            >
              level {level}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-m3-title-lg">Components</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Backbone check</CardTitle>
              <CardDescription>
                shadcn component APIs, drawn to the Material 3 spec.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <Button>Filled</Button>
                <Button variant="tonal">Tonal</Button>
                <Button variant="elevated">Elevated</Button>
                <Button variant="outline">Outlined</Button>
                <Button variant="ghost">Text</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" placeholder="you@example.com" />
                </Field>
              </FieldGroup>
              <div className="flex items-center gap-3">
                <Switch id="expressive" defaultChecked />
                <FieldLabel htmlFor="expressive">Expressive motion</FieldLabel>
              </div>
              <Slider defaultValue={[60]} />
            </CardContent>
            <CardFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expressive motion</CardTitle>
              <CardDescription>
                Spatial springs overshoot and settle. Hover a swatch.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {(["fast", "default", "slow"] as const).map((speed) => (
                <div key={speed} className="flex items-center gap-4">
                  <span className="w-16 text-m3-label-md text-muted-foreground">
                    {speed}
                  </span>
                  <div
                    className="bg-m3-primary-container rounded-m3-lg h-12 w-24 transition-transform hover:translate-x-24"
                    style={{
                      transitionTimingFunction: `var(--m3-spring-spatial-${speed === "default" ? "default" : speed})`,
                      transitionDuration: `var(--m3-spring-spatial-${speed === "default" ? "default" : speed}-duration)`,
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
