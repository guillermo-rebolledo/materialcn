import { useId, useState } from "react"

import { Button } from "./button"
import { Calendar, type CalendarProps } from "./calendar"
import { isDateSelectable } from "./calendar-utils"
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
  formatDate?: (date: Date, locale: string) => string
  mode?: "calendar" | "input"
  onValueChange: (value: Date | null) => void
  parseDate?: (text: string, locale: string) => Date | null
  value: Date | null
}

function defaultFormatDate(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function defaultParseDate(text: string) {
  const timestamp = Date.parse(text)
  return Number.isNaN(timestamp) ? null : new Date(timestamp)
}

function DatePickerDialog({
  defaultMonth,
  disabled,
  error,
  formatDate = defaultFormatDate,
  invalid,
  isDateUnavailable,
  label,
  locale = "en-US",
  max,
  min,
  mode = "calendar",
  onValueChange,
  parseDate = defaultParseDate,
  value,
}: DatePickerDialogProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Date | null>(value)
  const [text, setText] = useState(() => value ? formatDate(value, locale) : "")
  const id = useId()
  const inputId = `${id}-input`
  const errorId = `${id}-error`
  const parsedText = text ? parseDate(text, locale) : null
  const inputInvalid = mode === "input" && Boolean(
    text &&
      (!parsedText || !isDateSelectable(parsedText, { isDateUnavailable, max, min })),
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setDraft(value)
          setText(value ? formatDate(value, locale) : "")
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
          <Field data-invalid={invalid || inputInvalid || undefined} className="px-6 py-4">
            <FieldLabel htmlFor={inputId}>Date</FieldLabel>
            <Input
              id={inputId}
              value={text}
              aria-invalid={invalid || inputInvalid || undefined}
              aria-describedby={error || inputInvalid ? errorId : undefined}
              onChange={(event) => {
                setText(event.target.value)
                const parsed = parseDate(event.target.value, locale)
                setDraft(
                  parsed && isDateSelectable(parsed, { isDateUnavailable, max, min })
                    ? parsed
                    : null,
                )
              }}
            />
            {(error || inputInvalid) && (
              <FieldError id={errorId}>
                {error ?? "Enter an available date within the allowed range"}
              </FieldError>
            )}
          </Field>
        )}
        <DialogFooter className="px-6 pb-6">
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose
            render={<Button />}
            disabled={!draft || invalid || inputInvalid}
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
    ? `${defaultFormatDate(value.start, locale)}${value.end ? ` – ${defaultFormatDate(value.end, locale)}` : " – …"}`
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
