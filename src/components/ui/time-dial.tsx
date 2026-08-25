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
import { formatTime, isValidTime, type TimeMode, type TimeValue } from "./time-picker"

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
      <div className="flex items-center gap-2" aria-label="Time segments">
        <Button
          aria-pressed={phase === "hour"}
          variant={phase === "hour" ? "tonal" : "outline"}
          onClick={() => !phaseProp && setInternalPhase("hour")}
        >
          {String(mode === "12-hour" ? value.hour % 12 || 12 : value.hour).padStart(2, "0")}
        </Button>
        <span aria-hidden="true" className="text-m3-headline-lg">:</span>
        <Button
          aria-pressed={phase === "minute"}
          variant={phase === "minute" ? "tonal" : "outline"}
          onClick={() => !phaseProp && setInternalPhase("minute")}
        >
          {String(value.minute).padStart(2, "0")}
        </Button>
        {mode === "12-hour" && (
          <div className="flex flex-col" aria-label="Period">
            {(["AM", "PM"] as const).map((period) => {
              const pressed = period === (value.hour >= 12 ? "PM" : "AM")
              return (
                <button
                  key={period}
                  type="button"
                  aria-pressed={pressed}
                  disabled={disabled}
                  className="h-8 min-w-12 border border-m3-outline px-2 text-m3-label-md first:rounded-t-m3-xs last:rounded-b-m3-xs aria-pressed:bg-m3-tertiary-container"
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
        {values.map((number, index) => {
          const clockPosition = phase === "minute" ? index : number % 12
          const angle = (clockPosition * 30 - 90) * Math.PI / 180
          const radius = phase === "hour" && mode === "24-hour" && (number === 0 || number > 12) ? 72 : 106
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
                "absolute flex size-9 -translate-1/2 items-center justify-center rounded-full text-m3-body-md outline-none",
                "transition-colors duration-(--m3-spring-effects-fast-duration) motion-reduce:transition-none",
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
        <TimeDial value={draft} onValueChange={setDraft} mode={mode} />
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
