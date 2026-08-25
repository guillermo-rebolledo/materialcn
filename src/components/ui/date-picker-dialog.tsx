import { useState } from "react"

import { Button } from "./button"
import { Calendar, type CalendarProps } from "./calendar"
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
import { Field, FieldError, FieldLabel } from "./field"
import { Input } from "./input"

type DateRange = { start: Date | null; end: Date | null }

type SharedModalProps = Pick<
  CalendarProps,
  "defaultMonth" | "isDateUnavailable" | "locale" | "max" | "min"
> & {
  disabled?: boolean
  error?: string
  invalid?: boolean
  label: string
}

type DatePickerDialogProps = SharedModalProps & {
  mode?: "calendar" | "input"
  onValueChange: (value: Date | null) => void
  value: Date | null
}

function formatDate(date: Date | null, locale = "en-US") {
  return date
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    : ""
}

function DatePickerDialog({
  defaultMonth,
  disabled,
  error,
  invalid,
  isDateUnavailable,
  label,
  locale = "en-US",
  max,
  min,
  mode = "calendar",
  onValueChange,
  value,
}: DatePickerDialogProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Date | null>(value)
  const [text, setText] = useState(() => formatDate(value, locale))

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setDraft(value)
          setText(formatDate(value, locale))
        }
      }}
    >
      <DialogTrigger
        disabled={disabled}
        render={<Button variant="outline" />}
      >
        {value ? formatDate(value, locale) : `Choose ${label}`}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="w-[360px] max-w-[calc(100%-2rem)] gap-3 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            {mode === "input" ? "Enter a date, then confirm." : "Choose a date from the calendar."}
          </DialogDescription>
        </DialogHeader>
        {mode === "calendar" ? (
          <Calendar
            className="w-full rounded-none p-3 shadow-none"
            selected={draft}
            onSelect={setDraft}
            defaultMonth={defaultMonth ?? value ?? undefined}
            locale={locale}
            min={min}
            max={max}
            isDateUnavailable={isDateUnavailable}
          />
        ) : (
          <Field data-invalid={invalid || undefined} className="px-6 py-4">
            <FieldLabel htmlFor="modal-date-input">Date</FieldLabel>
            <Input
              id="modal-date-input"
              value={text}
              aria-invalid={invalid || undefined}
              onChange={(event) => {
                setText(event.target.value)
                const parsed = Date.parse(event.target.value)
                setDraft(Number.isNaN(parsed) ? null : new Date(parsed))
              }}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
        )}
        <DialogFooter className="px-6 pb-6">
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose
            render={<Button />}
            disabled={!draft || invalid}
            onClick={() => {
              onValueChange(draft)
            }}
          >
            Confirm date
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type DateRangePickerProps = SharedModalProps & {
  onValueChange: (value: DateRange) => void
  value: DateRange
}

function DateRangePicker({
  defaultMonth,
  disabled,
  error,
  invalid,
  isDateUnavailable,
  label,
  locale = "en-US",
  max,
  min,
  onValueChange,
  value,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange>(value)
  const summary = value.start
    ? `${formatDate(value.start, locale)}${value.end ? ` – ${formatDate(value.end, locale)}` : " – …"}`
    : `Choose ${label}`

  const select = (date: Date) => {
    if (!draft.start || draft.end) return setDraft({ start: date, end: null })
    if (date < draft.start) return setDraft({ start: date, end: draft.start })
    setDraft({ start: draft.start, end: date })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setDraft(value)
      }}
    >
      <DialogTrigger disabled={disabled} render={<Button variant="outline" />}>
        {summary}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="w-[360px] max-w-[calc(100%-2rem)] gap-3 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>Choose a start date and an end date.</DialogDescription>
        </DialogHeader>
        <Calendar
          className="w-full rounded-none p-3 shadow-none"
          range={draft}
          onSelect={select}
          defaultMonth={defaultMonth ?? value.start ?? undefined}
          locale={locale}
          min={min}
          max={max}
          isDateUnavailable={isDateUnavailable}
        />
        {error && <FieldError className="px-6">{error}</FieldError>}
        <DialogFooter className="px-6 pb-6">
          <Button
            variant="ghost"
            onClick={() => {
              onValueChange({ start: null, end: null })
              setOpen(false)
            }}
          >
            Clear dates
          </Button>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose
            render={<Button />}
            aria-label="Confirm dates"
            disabled={!draft.start || invalid}
            onClick={() => {
              onValueChange(draft)
            }}
          >
            Confirm
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export {
  DatePickerDialog,
  DateRangePicker,
  type DatePickerDialogProps,
  type DateRange,
  type DateRangePickerProps,
}
