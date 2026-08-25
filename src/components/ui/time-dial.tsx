import { useState, type KeyboardEvent } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { FieldError } from "./field"
import { type TimeMode, type TimeValue } from "./time-picker"
import { formatTime, isValidTime } from "./time-picker-utils"

type TimeDialProps = {
  disabled?: boolean
  mode?: TimeMode
  onValueChange: (value: TimeValue) => void
  phase?: "hour" | "minute"
  value: TimeValue
}

function TimeDial({
  disabled = false,
  mode = "12-hour",
  onValueChange,
  phase: phaseProp,
  value,
}: TimeDialProps) {
  const [internalPhase, setInternalPhase] = useState<"hour" | "minute">("hour")
  const phase = phaseProp ?? internalPhase
  const hourValues = mode === "24-hour"
    ? Array.from({ length: 24 }, (_, index) => index)
    : Array.from({ length: 12 }, (_, index) => index + 1)
  const values = phase === "hour"
    ? hourValues
    : Array.from({ length: 12 }, (_, index) => index * 5)
  const selected = phase === "hour"
    ? mode === "12-hour" ? value.hour % 12 || 12 : value.hour
    : Math.round(value.minute / 5) * 5 % 60

  const choose = (next: number) => {
    if (disabled) return
    if (phase === "hour") {
      const hour = mode === "12-hour"
        ? (next % 12) + (value.hour >= 12 ? 12 : 0)
        : next
      onValueChange({ ...value, hour })
      if (!phaseProp) setInternalPhase("minute")
    } else {
      onValueChange({ ...value, minute: next })
    }
  }

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return
    event.preventDefault()
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[data-slot="time-dial-value"]')
    buttons?.[(index + delta + values.length) % values.length]?.focus()
  }

  return (
    <div data-slot="time-dial" data-phase={phase} className="flex flex-col items-center gap-3">
      {/* Kit dial inputs: 96 × 80, 8dp corners, display-large; the active
          segment is Primary Container. The separator is a fixed 24dp column. */}
      <div className="flex items-center gap-0" aria-label="Time segments">
        <Button
          disabled={disabled}
          aria-pressed={phase === "hour"}
          variant={phase === "hour" ? "tonal" : "outline"}
          className={cn(
            "h-20 w-24 rounded-m3-sm px-0 text-m3-display-lg font-m3-regular active:not-disabled:rounded-m3-sm",
            phase === "hour" ? "bg-m3-primary-container text-m3-on-primary-container" : "border-transparent bg-m3-surface-container-highest text-m3-on-surface",
          )}
          onClick={() => !phaseProp && setInternalPhase("hour")}
        >
          {String(mode === "12-hour" ? value.hour % 12 || 12 : value.hour).padStart(2, "0")}
        </Button>
        <span aria-hidden="true" className="flex w-6 justify-center text-m3-display-lg">:</span>
        <Button
          disabled={disabled}
          aria-pressed={phase === "minute"}
          variant={phase === "minute" ? "tonal" : "outline"}
          className={cn(
            "h-20 w-24 rounded-m3-sm px-0 text-m3-display-lg font-m3-regular active:not-disabled:rounded-m3-sm",
            phase === "minute" ? "bg-m3-primary-container text-m3-on-primary-container" : "border-transparent bg-m3-surface-container-highest text-m3-on-surface",
          )}
          onClick={() => !phaseProp && setInternalPhase("minute")}
        >
          {String(value.minute).padStart(2, "0")}
        </Button>
        {mode === "12-hour" && (
          <div className="ml-3 flex w-13 flex-col overflow-hidden rounded-m3-sm border border-m3-outline" aria-label="Period">
            {(["AM", "PM"] as const).map((period) => {
              const pressed = period === (value.hour >= 12 ? "PM" : "AM")
              return (
                <button
                  key={period}
                  type="button"
                  aria-pressed={pressed}
                  disabled={disabled}
                  // Kit: two 40dp halves, title-medium, Tertiary Container when selected.
                  className="h-10 text-m3-title-md text-m3-on-surface-variant outline-none transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) first:border-b first:border-m3-outline hover:bg-m3-on-surface/8 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-m3-secondary aria-pressed:bg-m3-tertiary-container aria-pressed:text-m3-on-tertiary-container disabled:text-m3-on-surface/38"
                  onClick={() => onValueChange({ ...value, hour: (value.hour % 12) + (period === "PM" ? 12 : 0) })}
                >
                  {period}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div
        role="group"
        aria-label={phase === "hour" ? "Choose hour" : "Choose minute"}
        className="relative size-64 touch-none rounded-full bg-m3-surface-container-highest"
      >
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-m3-primary" />
        {/* Clock hand: a 2dp Primary line from the centre to the selected numeral. */}
        {(() => {
          const index = values.indexOf(selected)
          if (index < 0) return null
          const clockPosition = phase === "minute" ? index : selected % 12
          const inner = phase === "hour" && mode === "24-hour" && (selected === 0 || selected > 12)
          const length = inner ? 72 : 104
          return (
            <div
              aria-hidden="true"
              data-slot="time-dial-hand"
              className="absolute top-1/2 left-1/2 h-0.5 origin-left bg-m3-primary transition-[transform,width] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) motion-reduce:transition-none"
              style={{ width: length, transform: `translateY(-50%) rotate(${clockPosition * 30 - 90}deg)` }}
            />
          )
        })()}
        {values.map((number, index) => {
          const clockPosition = phase === "minute" ? index : number % 12
          const angle = (clockPosition * 30 - 90) * Math.PI / 180
          const radius = phase === "hour" && mode === "24-hour" && (number === 0 || number > 12) ? 72 : 104
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const active = number === selected
          return (
            <button
              key={number}
              type="button"
              data-slot="time-dial-value"
              aria-label={`${number} ${phase === "hour" ? "hours" : "minutes"}`}
              aria-pressed={active}
              disabled={disabled}
              tabIndex={active ? 0 : -1}
              className={cn(
                // Kit numerals: 48dp targets, body-large.
                "absolute flex size-12 -translate-1/2 items-center justify-center rounded-full text-m3-body-lg outline-none",
                "transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) motion-reduce:transition-none",
                "hover:bg-m3-on-surface/8 focus-visible:ring-3 focus-visible:ring-m3-secondary",
                active && "bg-m3-primary text-m3-on-primary",
              )}
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
              onClick={() => choose(number)}
              onKeyDown={(event) => move(event, index)}
            >
              {number.toString().padStart(phase === "minute" ? 2 : 1, "0")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

type DialTimePickerProps = {
  defaultOpen?: boolean
  disabled?: boolean
  error?: string
  invalid?: boolean
  label: string
  max?: TimeValue
  min?: TimeValue
  mode?: TimeMode
  onValueChange: (value: TimeValue) => void
  value: TimeValue
}

function DialTimePicker({
  defaultOpen,
  disabled,
  error,
  invalid,
  label,
  max,
  min,
  mode = "12-hour",
  onValueChange,
  value,
}: DialTimePickerProps) {
  const [draft, setDraft] = useState(value)
  const valueInvalid = invalid || !isValidTime(draft, min, max)
  return (
    <Dialog
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (open) setDraft(value)
      }}
    >
      <DialogTrigger aria-label={`Choose ${label}`} disabled={disabled} render={<Button variant="outline" />}>
        {value && isValidTime(value) ? formatTime(value, mode) : `Choose ${label}`}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="w-[328px] max-w-[calc(100%-2rem)] gap-4">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>Choose the hour and minute on the clock dial.</DialogDescription>
        </DialogHeader>
        <TimeDial value={draft} onValueChange={setDraft} mode={mode} disabled={disabled} />
        {valueInvalid && <FieldError>{error ?? "Choose a time within the allowed range"}</FieldError>}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose
            render={<Button />}
            aria-label="Confirm time"
            disabled={valueInvalid}
            onClick={() => onValueChange(draft)}
          >
            Confirm
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DialTimePicker, TimeDial, type DialTimePickerProps, type TimeDialProps }
