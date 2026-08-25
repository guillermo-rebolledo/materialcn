import { useId, useRef, useState, type ComponentProps, type KeyboardEvent } from "react"

import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldError, FieldLabel } from "./field"
import { isValidTime } from "./time-picker-utils"

type TimeValue = { hour: number; minute: number }
type TimeMode = "12-hour" | "24-hour"

type TimePickerProps = Omit<ComponentProps<"div">, "onChange"> & {
  disabled?: boolean
  error?: string
  invalid?: boolean
  label: string
  max?: TimeValue
  min?: TimeValue
  mode?: TimeMode
  onValueChange: (value: TimeValue) => void
  readOnly?: boolean
  supportingText?: string
  value: TimeValue
}

function TimePicker({
  className,
  disabled = false,
  error,
  invalid = false,
  label,
  max,
  min,
  mode = "12-hour",
  onValueChange,
  readOnly = false,
  supportingText,
  value,
  ...props
}: TimePickerProps) {
  const key = `${value.hour}:${value.minute}:${mode}`
  const displayHour = mode === "12-hour" && value.hour >= 0 && value.hour <= 23
    ? value.hour % 12 || 12
    : value.hour
  const [draft, setDraft] = useState(() => ({ key, hour: String(displayHour), minute: String(value.minute).padStart(2, "0") }))
  if (draft.key !== key) {
    setDraft({ key, hour: String(displayHour), minute: String(value.minute).padStart(2, "0") })
  }
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const valueInvalid = !isValidTime(value, min, max)
  const emptySegment = draft.hour === "" || draft.minute === ""
  const ariaInvalid = invalid || valueInvalid || emptySegment

  const updateHour = (raw: string) => {
    if (raw === "") return setDraft({ ...draft, hour: raw })
    const entered = Number(raw)
    let hour = entered
    if (mode === "12-hour" && entered >= 1 && entered <= 12) {
      const pm = value.hour >= 12
      hour = (entered % 12) + (pm ? 12 : 0)
    }
    const next = { ...value, hour }
    setDraft({ key: `${next.hour}:${next.minute}:${mode}`, hour: raw, minute: draft.minute })
    onValueChange(next)
  }

  const updateMinute = (raw: string) => {
    if (raw === "") return setDraft({ ...draft, minute: raw })
    const next = { ...value, minute: Number(raw) }
    setDraft({ key: `${next.hour}:${next.minute}:${mode}`, hour: draft.hour, minute: raw })
    onValueChange(next)
  }

  const handleSegmentKey = (
    segment: "hour" | "minute",
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowRight" && segment === "hour") {
      event.preventDefault()
      minuteRef.current?.focus()
      return
    }
    if (event.key === "ArrowLeft" && segment === "minute") {
      event.preventDefault()
      hourRef.current?.focus()
      return
    }
    if (readOnly) return
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    const delta = event.key === "ArrowUp" ? 1 : -1
    if (segment === "hour") {
      const nextHour = (value.hour + delta + 24) % 24
      onValueChange({ ...value, hour: nextHour })
    } else {
      const nextMinute = (value.minute + delta + 60) % 60
      onValueChange({ ...value, minute: nextMinute })
    }
  }

  const segmentClass = cn(
    "h-16 w-20 rounded-m3-md border border-m3-outline bg-m3-surface-container-high text-center text-m3-display-sm text-foreground outline-none",
    "focus-visible:border-m3-primary focus-visible:shadow-[inset_0_0_0_2px_var(--m3-primary)]",
    "disabled:cursor-not-allowed disabled:text-muted-foreground/38",
    "aria-invalid:border-m3-error",
  )

  return (
    <Field
      {...props}
      data-slot="time-picker"
      data-invalid={ariaInvalid || undefined}
      data-disabled={disabled || undefined}
      className={cn("max-w-[360px]", className)}
    >
      <FieldLabel id={`${id}-label`}>{label}</FieldLabel>
      <div role="group" aria-labelledby={`${id}-label`} className="flex items-center gap-2">
        <input
          ref={hourRef}
          type="number"
          inputMode="numeric"
          aria-label="Hours"
          aria-invalid={ariaInvalid || undefined}
          value={draft.hour}
          min={mode === "12-hour" ? 1 : 0}
          max={mode === "12-hour" ? 12 : 23}
          disabled={disabled}
          readOnly={readOnly}
          className={segmentClass}
          onChange={(event) => updateHour(event.target.value)}
          onKeyDown={(event) => handleSegmentKey("hour", event)}
        />
        <span aria-hidden="true" className="text-m3-display-sm">:</span>
        <input
          ref={minuteRef}
          type="number"
          inputMode="numeric"
          aria-label="Minutes"
          aria-invalid={ariaInvalid || undefined}
          value={draft.minute}
          min={0}
          max={59}
          disabled={disabled}
          readOnly={readOnly}
          className={segmentClass}
          onChange={(event) => updateMinute(event.target.value)}
          onKeyDown={(event) => handleSegmentKey("minute", event)}
        />
        {mode === "12-hour" && (
          <select
            aria-label="Period"
            value={value.hour >= 12 ? "PM" : "AM"}
            disabled={disabled}
            aria-readonly={readOnly || undefined}
            className="h-14 rounded-m3-sm border border-m3-outline bg-transparent px-3 text-m3-label-lg outline-none focus-visible:ring-3 focus-visible:ring-m3-secondary disabled:text-muted-foreground/38"
            onChange={(event) => {
              if (readOnly) return
              const pm = event.target.value === "PM"
              onValueChange({ ...value, hour: (value.hour % 12) + (pm ? 12 : 0) })
            }}
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        )}
      </div>
      {supportingText && <FieldDescription>{supportingText}</FieldDescription>}
      {(error || valueInvalid || emptySegment) && (
        <FieldError>
          {error ?? (emptySegment ? "Enter both hours and minutes" : "Enter a time within the allowed range")}
        </FieldError>
      )}
    </Field>
  )
}

export {
  TimePicker,
  type TimeMode,
  type TimePickerProps,
  type TimeValue,
}
