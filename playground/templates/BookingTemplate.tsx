/**
 * Booking — a multi-step flow, and the date and time pickers in anger.
 *
 * The interesting part is overlay ordering: the picker dialogs open from
 * inside a step that is itself inside a card, and the confirmation dialog
 * opens over the lot. Anything wrong with the z-index scale shows here first.
 */
import { useState } from "react"
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Chip, FilterChip } from "@/components/ui/chip"
import { DatePicker } from "@/components/ui/date-picker"
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
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonTrigger,
} from "@/components/ui/split-button"
import { TextField } from "@/components/ui/text-field"
import { TimePicker, type TimeValue } from "@/components/ui/time-picker"
import { ToggleGroup } from "@/components/ui/toggle-group"
import {
  TopAppBar,
  TopAppBarActions,
  TopAppBarNavigation,
  TopAppBarTitle,
} from "@/components/ui/top-app-bar"
import { Toaster, toast } from "@/components/ui/toast"

const STEPS = ["When", "Where", "Who"] as const

const ROOMS = [
  { value: "hopper", label: "Hopper", capacity: "8 seats — 3rd floor" },
  { value: "lovelace", label: "Lovelace", capacity: "4 seats — 2nd floor" },
  { value: "johnson", label: "Johnson", capacity: "16 seats — ground floor" },
]

const DURATIONS = {
  "30": "30 minutes",
  "60": "1 hour",
  "90": "1 hour 30",
  "120": "2 hours",
}

const EXTRAS = [
  { value: "video", label: "Video call" },
  { value: "catering", label: "Catering" },
  { value: "whiteboard", label: "Whiteboard" },
]

export function BookingTemplate() {
  const [step, setStep] = useState(0)
  const [date, setDate] = useState<Date | null>(new Date())
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 })
  const [duration, setDuration] = useState("60")
  const [room, setRoom] = useState("hopper")
  const [extras, setExtras] = useState<string[]>(["video"])
  const [title, setTitle] = useState("Design review")
  const [guests, setGuests] = useState("ada@example.com, grace@example.com")

  const chosenRoom = ROOMS.find((entry) => entry.value === room)!
  const percent = ((step + 1) / STEPS.length) * 100

  return (
    <div className="bg-background text-foreground flex min-h-full flex-col">
      <TopAppBar>
        {/*
          The small app bar reserves a 56dp leading slot, so a bar without a
          navigation icon starts its title 4dp from the edge. This is that
          slot, not decoration.
        */}
        <TopAppBarNavigation>
          <Button variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeftIcon />
          </Button>
        </TopAppBarNavigation>
        <TopAppBarTitle>Book a room</TopAppBarTitle>
        <TopAppBarActions>
          <Button variant="ghost">Cancel</Button>
        </TopAppBarActions>
      </TopAppBar>

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-m3-xl p-m3-lg">
        {/*
          A determinate bar rather than a row of numbered circles: three steps
          do not need a diagram, and the bar reads at every width without
          reflowing.
        */}
        <div className="flex flex-col gap-m3-sm">
          <Progress value={percent}>
            <ProgressLabel>
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>

        <div className="grid gap-m3-lg m3-expanded:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] m3-expanded:items-start">
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
              <CardDescription>
                {step === 0
                  ? "Pick a slot. Rooms are released 15 minutes after the start."
                  : step === 1
                    ? "Rooms with the equipment you asked for are listed first."
                    : "Guests get an invitation as soon as you confirm."}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-m3-lg">
              {step === 0 ? (
                <>
                  <div className="grid gap-m3-lg sm:grid-cols-2">
                    <DatePicker
                      label="Date"
                      value={date}
                      onValueChange={setDate}
                      min={new Date(2020, 0, 1)}
                      supportingText="Bookings open 60 days ahead."
                    />
                    <TimePicker
                      label="Start time"
                      value={time}
                      onValueChange={setTime}
                      mode="12-hour"
                    />
                  </div>
                  {/* `items` maps value to label, so the trigger reads
                      "1 hour" instead of "60". */}
                  <Select
                    items={DURATIONS}
                    value={duration}
                    onValueChange={(next) => setDuration(next ?? "60")}
                  >
                    <SelectTrigger className="w-full sm:w-56">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DURATIONS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <div className="flex flex-col gap-m3-sm">
                    {ROOMS.map((entry) => (
                      // `Card` is a div, not a Base UI part, so it takes no
                      // `render` — the button wraps it rather than becoming it.
                      <button
                        key={entry.value}
                        type="button"
                        aria-pressed={entry.value === room}
                        className="cursor-pointer rounded-m3-md text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary"
                        onClick={() => setRoom(entry.value)}
                      >
                        <Card
                          variant={entry.value === room ? "filled" : "outlined"}
                        >
                        <CardContent className="flex items-center gap-m3-md py-m3-lg text-left">
                          <Icon size="md">
                            <MapPinIcon />
                          </Icon>
                          <span className="flex flex-1 flex-col">
                            <span className="text-m3-title-md">
                              {entry.label}
                            </span>
                            <span className="text-m3-body-sm text-m3-on-surface-variant">
                              {entry.capacity}
                            </span>
                          </span>
                          {entry.value === room ? (
                            <Icon size="sm" label="Selected">
                              <CheckIcon />
                            </Icon>
                          ) : null}
                        </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-m3-sm">
                    <span className="text-m3-title-sm">Extras</span>
                    <ToggleGroup
                      aria-label="Extras"
                      multiple
                      value={extras}
                      onValueChange={setExtras}
                    >
                      {EXTRAS.map((extra) => (
                        <FilterChip key={extra.value} value={extra.value}>
                          {extra.label}
                        </FilterChip>
                      ))}
                    </ToggleGroup>
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <TextField
                    label="Meeting title"
                    value={title}
                    onValueChange={setTitle}
                    maxLength={80}
                  />
                  <TextField
                    label="Guests"
                    multiline
                    rows={3}
                    value={guests}
                    onValueChange={setGuests}
                    supportingText="Comma separated email addresses."
                  />
                  <Alert severity="info">
                    <AlertTitle>Room policy</AlertTitle>
                    <AlertDescription>
                      {chosenRoom.label} is released automatically if nobody
                      checks in within 15 minutes of the start time.
                    </AlertDescription>
                  </Alert>
                </>
              ) : null}
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-m3-md">
              <Button
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((current) => current - 1)}
              >
                Back
              </Button>

              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep((current) => current + 1)}>
                  Next
                </Button>
              ) : (
                <Dialog>
                  {/*
                    The split button's primary action confirms; the menu holds
                    the variants that would otherwise be three more buttons
                    nobody presses.
                  */}
                  <SplitButton aria-label="Confirm booking">
                    <DialogTrigger
                      render={<SplitButtonAction>Confirm</SplitButtonAction>}
                    />
                    <DropdownMenu>
                      <SplitButtonTrigger aria-label="Other booking actions" />
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.add({
                                description: "Saved as draft",
                                timeout: 4000,
                              })
                            }
                          >
                            Save as draft
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.add({
                                description: "Booking repeated weekly",
                                timeout: 4000,
                              })
                            }
                          >
                            Repeat weekly
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SplitButton>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm this booking?</DialogTitle>
                      <DialogDescription>
                        {chosenRoom.label} on{" "}
                        {date?.toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        at {String(time.hour).padStart(2, "0")}:
                        {String(time.minute).padStart(2, "0")}.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose
                        render={<Button variant="ghost">Not yet</Button>}
                      />
                      <DialogClose
                        render={
                          <Button
                            onClick={() =>
                              toast.add({
                                description: `${chosenRoom.label} booked`,
                                timeout: 5000,
                                actionProps: { children: "View" },
                              })
                            }
                          >
                            Book it
                          </Button>
                        }
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>

          {/* The summary is metadata, so it stays a narrow companion column
              and disappears entirely below `expanded`. */}
          <Card variant="filled" className="hidden m3-expanded:block">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-m3-md">
              <div className="flex items-center gap-m3-md">
                <Icon size="sm">
                  <CalendarDaysIcon />
                </Icon>
                <span className="text-m3-body-md">
                  {date
                    ? date.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "No date"}
                </span>
              </div>
              <div className="flex items-center gap-m3-md">
                <Icon size="sm">
                  <ClockIcon />
                </Icon>
                <span className="text-m3-body-md">
                  {String(time.hour).padStart(2, "0")}:
                  {String(time.minute).padStart(2, "0")} — {duration} min
                </span>
              </div>
              <div className="flex items-center gap-m3-md">
                <Icon size="sm">
                  <MapPinIcon />
                </Icon>
                <span className="text-m3-body-md">{chosenRoom.label}</span>
              </div>
              <div className="flex items-center gap-m3-md">
                <Icon size="sm">
                  <UsersIcon />
                </Icon>
                <span className="text-m3-body-md">
                  {guests.split(",").filter(Boolean).length} guests
                </span>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-m3-sm">
                {extras.length === 0 ? (
                  <span className="text-m3-body-sm text-m3-on-surface-variant">
                    No extras
                  </span>
                ) : (
                  extras.map((extra) => (
                    <Chip key={extra} variant="secondary" size="sm">
                      {EXTRAS.find((entry) => entry.value === extra)?.label}
                    </Chip>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
