/**
 * Settings — the densest test of the form controls at real row heights.
 *
 * Every row here is a list row, deliberately. The controls differ — a switch,
 * a select, a button, a slider — but the geometry does not: one 16dp inset,
 * one icon column, one place the control sits. Mixing `Field` rows in among
 * them gave two left edges and two row heights on the same page, which reads
 * as a mistake even when each row is individually correct.
 *
 * Sections follow from that: one `SeparatorSubhead` each, which carries its own
 * rule, so the distance from a divider to the heading under it is a property of
 * the component rather than of whichever gap happened to precede it.
 */
import { useState } from "react"
import {
  BellIcon,
  ChevronRightIcon,
  ClockIcon,
  GlobeIcon,
  LayoutListIcon,
  LockIcon,
  PaletteIcon,
  UserIcon,
  Volume1Icon,
  Volume2Icon,
} from "lucide-react"

import { useTheme, type Theme } from "@/components/theme-provider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldDescription, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemSupportingText,
  ListItemTrailing,
} from "@/components/ui/list"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SeparatorSubhead } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from "@/components/ui/toast"
import {
  TopAppBar,
  TopAppBarActions,
  TopAppBarTitle,
} from "@/components/ui/top-app-bar"

const THEMES: { value: Theme; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "Always the light scheme." },
  { value: "dark", label: "Dark", description: "Always the dark scheme." },
  {
    value: "system",
    label: "System",
    description: "Follow the device setting.",
  },
]

const DENSITIES = {
  comfortable: "Comfortable",
  compact: "Compact",
  dense: "Dense",
}

const LANGUAGES = {
  "en-GB": "English (UK)",
  "en-US": "English (US)",
  "es-MX": "Español (México)",
  "ja-JP": "日本語",
}

export function SettingsTemplate() {
  const { theme, setTheme } = useTheme()
  const [pendingTheme, setPendingTheme] = useState<Theme>(theme)
  const [notifications, setNotifications] = useState(true)
  const [digest, setDigest] = useState(false)
  const [sounds, setSounds] = useState(true)
  const [volume, setVolume] = useState([70])
  const [language, setLanguage] = useState("en-GB")
  const [density, setDensity] = useState("comfortable")

  return (
    <div className="bg-background text-foreground flex min-h-full flex-col">
      <TopAppBar size="large">
        <TopAppBarTitle>Settings</TopAppBarTitle>
        <TopAppBarActions>
          <Avatar size="sm">
            <AvatarFallback>GO</AvatarFallback>
          </Avatar>
        </TopAppBarActions>
      </TopAppBar>

      {/*
        One gap between sections, and the sections own their own dividers. The
        page previously alternated a bare `Separator` with a `SeparatorSubhead`,
        which draws a rule of its own — so one heading sat 4dp under its rule
        and the next sat 100dp under one.
      */}
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-m3-xl p-m3-lg pb-m3-4xl">
        {/* The account row carries no subhead: it is who you are, not a
            category of setting, and a rule above it would separate it from
            nothing. */}
        <List aria-label="Account">
          <ListItem lines={2} render={<a href="#account" />}>
            <ListItemLeading variant="avatar">
              <Avatar>
                <AvatarFallback>GO</AvatarFallback>
              </Avatar>
            </ListItemLeading>
            <ListItemContent>
              <ListItemHeadline>Guillermo Ortiz</ListItemHeadline>
              <ListItemSupportingText>
                Signed in — manage your account
              </ListItemSupportingText>
            </ListItemContent>
            <ListItemTrailing>
              <Icon size="sm">
                <ChevronRightIcon />
              </Icon>
            </ListItemTrailing>
          </ListItem>
        </List>

        <section className="flex flex-col gap-m3-sm">
          <SeparatorSubhead>Notifications</SeparatorSubhead>
          <List aria-label="Notifications">
            <ListItem lines={2}>
              <ListItemLeading>
                <Icon size="md">
                  <BellIcon />
                </Icon>
              </ListItemLeading>
              <ListItemContent>
                <ListItemHeadline id="set-push">
                  Push notifications
                </ListItemHeadline>
                <ListItemSupportingText>
                  Mentions, replies, and direct messages.
                </ListItemSupportingText>
              </ListItemContent>
              <ListItemTrailing>
                <Switch
                  aria-labelledby="set-push"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </ListItemTrailing>
            </ListItem>

            <ListItem lines={2}>
              <ListItemLeading>
                <Icon size="md">
                  <ClockIcon />
                </Icon>
              </ListItemLeading>
              <ListItemContent>
                <ListItemHeadline id="set-digest">
                  Weekly digest
                </ListItemHeadline>
                <ListItemSupportingText>
                  {notifications
                    ? "Sent every Monday morning."
                    : "Unavailable while push notifications are off."}
                </ListItemSupportingText>
              </ListItemContent>
              <ListItemTrailing>
                <Switch
                  aria-labelledby="set-digest"
                  checked={digest && notifications}
                  disabled={!notifications}
                  onCheckedChange={setDigest}
                />
              </ListItemTrailing>
            </ListItem>
          </List>
        </section>

        <section className="flex flex-col gap-m3-sm">
          <SeparatorSubhead>Appearance</SeparatorSubhead>
          <List aria-label="Appearance">
            {/*
              Theme opens a dialog rather than a select: each option carries a
              description, which a select's single-line rows cannot hold.
            */}
            <ListItem lines={2}>
              <ListItemLeading>
                <Icon size="md">
                  <PaletteIcon />
                </Icon>
              </ListItemLeading>
              <ListItemContent>
                <ListItemHeadline>Theme</ListItemHeadline>
                <ListItemSupportingText>
                  Currently{" "}
                  {THEMES.find((entry) => entry.value === theme)?.label}.
                </ListItemSupportingText>
              </ListItemContent>
              <ListItemTrailing>
                <Dialog>
                  <DialogTrigger
                    render={<Button variant="outline" size="sm">Change</Button>}
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Choose a theme</DialogTitle>
                      <DialogDescription>
                        Applies to this device only.
                      </DialogDescription>
                    </DialogHeader>
                    <RadioGroup
                      value={pendingTheme}
                      onValueChange={(value) => setPendingTheme(value as Theme)}
                      className="flex flex-col gap-m3-md"
                    >
                      {THEMES.map((entry) => (
                        <div
                          key={entry.value}
                          className="flex items-start gap-m3-md"
                        >
                          <RadioGroupItem
                            id={`theme-${entry.value}`}
                            value={entry.value}
                          />
                          <div className="flex flex-col gap-m3-xs">
                            <FieldLabel htmlFor={`theme-${entry.value}`}>
                              {entry.label}
                            </FieldLabel>
                            <FieldDescription>
                              {entry.description}
                            </FieldDescription>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    <DialogFooter>
                      <DialogClose
                        render={
                          <Button
                            variant="ghost"
                            onClick={() => setPendingTheme(theme)}
                          >
                            Cancel
                          </Button>
                        }
                      />
                      <DialogClose
                        render={
                          <Button onClick={() => setTheme(pendingTheme)}>
                            Apply
                          </Button>
                        }
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </ListItemTrailing>
            </ListItem>

            <ListItem lines={2}>
              <ListItemLeading>
                <Icon size="md">
                  <LayoutListIcon />
                </Icon>
              </ListItemLeading>
              <ListItemContent>
                <ListItemHeadline id="set-density">Density</ListItemHeadline>
                <ListItemSupportingText>
                  Row height across lists.
                </ListItemSupportingText>
              </ListItemContent>
              <ListItemTrailing>
                {/*
                  `items` is what lets the trigger show "Comfortable" rather
                  than the raw `comfortable` — the value is what a form would
                  carry, and the map is what the reader sees.
                */}
                <Select
                  items={DENSITIES}
                  value={density}
                  onValueChange={(next) => setDensity(next ?? "comfortable")}
                >
                  <SelectTrigger aria-labelledby="set-density" className="w-44">
                    <SelectValue placeholder="Density" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DENSITIES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ListItemTrailing>
            </ListItem>

            <ListItem lines={2}>
              <ListItemLeading>
                <Icon size="md">
                  <GlobeIcon />
                </Icon>
              </ListItemLeading>
              <ListItemContent>
                <ListItemHeadline id="set-language">Language</ListItemHeadline>
                <ListItemSupportingText>
                  Interface and email.
                </ListItemSupportingText>
              </ListItemContent>
              <ListItemTrailing>
                <Select
                  items={LANGUAGES}
                  value={language}
                  onValueChange={(next) => setLanguage(next ?? "en-GB")}
                >
                  <SelectTrigger
                    aria-labelledby="set-language"
                    className="w-44"
                  >
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ListItemTrailing>
            </ListItem>
          </List>
        </section>

        <section className="flex flex-col gap-m3-sm">
          <SeparatorSubhead>Sound</SeparatorSubhead>
          <List aria-label="Sound">
            <ListItem lines={2}>
              <ListItemLeading>
                <Icon size="md">
                  <Volume2Icon />
                </Icon>
              </ListItemLeading>
              <ListItemContent>
                <ListItemHeadline id="set-sounds">
                  Interface sounds
                </ListItemHeadline>
                <ListItemSupportingText>
                  Short cues for sends and errors.
                </ListItemSupportingText>
              </ListItemContent>
              <ListItemTrailing>
                <Switch
                  aria-labelledby="set-sounds"
                  checked={sounds}
                  onCheckedChange={setSounds}
                />
              </ListItemTrailing>
            </ListItem>

            {/*
              The slider is the row's content, not a band under it — and it
              reports its value in the trailing slot rather than in the handle's
              bubble, which is drawn above the track and would collide with the
              row above.
            */}
            <ListItem lines={2}>
              <ListItemLeading>
                <Icon size="md">
                  <Volume1Icon />
                </Icon>
              </ListItemLeading>
              <ListItemContent className="gap-m3-xs">
                <ListItemHeadline id="set-volume">Volume</ListItemHeadline>
                <Slider
                  aria-labelledby="set-volume"
                  disabled={!sounds}
                  value={volume}
                  onValueChange={(next) =>
                    setVolume(Array.isArray(next) ? [...next] : [next])
                  }
                />
              </ListItemContent>
              <ListItemTrailing>
                <span className="w-8 text-right text-m3-label-lg tabular-nums">
                  {volume[0]}
                </span>
              </ListItemTrailing>
            </ListItem>
          </List>
        </section>

        <section className="flex flex-col gap-m3-sm">
          <SeparatorSubhead>More</SeparatorSubhead>
          {/* The accordion trigger is `px-4` and `min-h-14`, the same inset and
              row height as a list item — so it continues the column rather than
              starting a new one. */}
          <Accordion>
            <AccordionItem value="privacy">
              <AccordionTrigger>
                <span className="flex items-center gap-m3-lg">
                  <Icon size="md">
                    <LockIcon />
                  </Icon>
                  Privacy
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <List aria-label="Privacy">
                  <ListItem>
                    <ListItemContent>
                      <ListItemHeadline id="set-receipts">
                        Read receipts
                      </ListItemHeadline>
                    </ListItemContent>
                    <ListItemTrailing>
                      <Switch aria-labelledby="set-receipts" defaultChecked />
                    </ListItemTrailing>
                  </ListItem>
                  <ListItem>
                    <ListItemContent>
                      <ListItemHeadline id="set-presence">
                        Show when I am online
                      </ListItemHeadline>
                    </ListItemContent>
                    <ListItemTrailing>
                      <Switch aria-labelledby="set-presence" />
                    </ListItemTrailing>
                  </ListItem>
                </List>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="profile">
              <AccordionTrigger>
                <span className="flex items-center gap-m3-lg">
                  <Icon size="md">
                    <UserIcon />
                  </Icon>
                  Profile
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="px-m3-lg text-m3-body-md text-m3-on-surface-variant">
                  Your display name and avatar are managed by your workspace
                  administrator.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advanced">
              <AccordionTrigger>
                <span className="flex items-center gap-m3-lg">
                  <Icon size="md">
                    <PaletteIcon />
                  </Icon>
                  Advanced
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-m3-sm px-m3-lg">
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.add({ description: "Cache cleared", timeout: 4000 })
                    }
                  >
                    Clear cache
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      toast.add({
                        description: "Sign-out requested",
                        timeout: 4000,
                        actionProps: { children: "Undo" },
                      })
                    }
                  >
                    Sign out everywhere
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <Toaster />
    </div>
  )
}
