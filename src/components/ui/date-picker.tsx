import { useId, useRef, useState, type ComponentProps } from "react"
import { CalendarDaysIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Calendar, type CalendarProps } from "./calendar"
import { Field, FieldDescription, FieldError, FieldLabel } from "./field"
import { Input } from "./input"

type DatePickerProps = Omit<ComponentProps<"div">, "defaultValue" | "onChange"> &
  Pick<CalendarProps, "defaultMonth" | "isDateUnavailable" | "locale" | "max" | "min"> & {
    disabled?: boolean
    error?: string
    formatDate?: (date: Date, locale: string) => string
    invalid?: boolean
    label: string
    onValueChange: (date: Date | null) => void
    parseDate?: (text: string, locale: string) => Date | null
    readOnly?: boolean
    supportingText?: string
    value: Date | null
  }

function defaultFormat(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(date)
}

function defaultParse(text: string) {
  const timestamp = Date.parse(text)
  return Number.isNaN(timestamp) ? null : new Date(timestamp)
}

function DatePicker({
  className,
  defaultMonth,
  disabled = false,
  error,
  formatDate = defaultFormat,
  invalid = false,
  isDateUnavailable,
  label,
  locale = "en-US",
  max,
  min,
  onValueChange,
  parseDate = defaultParse,
  readOnly = false,
  supportingText,
  value,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const sourceKey = value
    ? `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}-${locale}`
    : `empty-${locale}`
  const [draftState, setDraftState] = useState(() => ({
    sourceKey,
    text: value ? formatDate(value, locale) : "",
  }))
  if (draftState.sourceKey !== sourceKey) {
    setDraftState({
      sourceKey,
      text: value ? formatDate(value, locale) : "",
    })
  }
  const draft = draftState.text
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const errorId = `${id}-error`

  const select = (date: Date) => {
    onValueChange(date)
    setDraftState({
      sourceKey: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${locale}`,
      text: formatDate(date, locale),
    })
    setOpen(false)
  }

  return (
    <div
      {...props}
      data-slot="date-picker"
      className={cn("relative flex flex-col gap-2", className)}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return
        event.preventDefault()
        setOpen(false)
        requestAnimationFrame(() => triggerRef.current?.focus())
      }}
    >
      <Field data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <div className="relative">
          <Input
            id={id}
            value={draft}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={invalid || undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={new Intl.DateTimeFormat(locale).format(new Date(2026, 7, 24))}
            className="pr-24"
            onChange={(event) => setDraftState({ sourceKey, text: event.target.value })}
            onBlur={() => {
              if (!draft) return onValueChange(null)
              const parsed = parseDate(draft, locale)
              if (parsed) onValueChange(parsed)
            }}
          />
          <div className="absolute inset-y-0 right-1 flex items-center">
            {value && !disabled && !readOnly && (
              <Button aria-label="Clear date" size="icon-sm" variant="ghost" onClick={() => { onValueChange(null); setDraftState({ sourceKey: `empty-${locale}`, text: "" }) }}>
                <XIcon aria-hidden="true" />
              </Button>
            )}
            <Button
              ref={triggerRef}
              aria-label="Choose date"
              aria-expanded={open}
              size="icon-sm"
              variant="ghost"
              disabled={disabled || readOnly}
              onClick={() => setOpen((current) => !current)}
            >
              <CalendarDaysIcon aria-hidden="true" />
            </Button>
          </div>
        </div>
        {supportingText && <FieldDescription>{supportingText}</FieldDescription>}
        {error && <FieldError id={errorId}>{error}</FieldError>}
      </Field>
      {open && (
        <Calendar
          selected={value}
          onSelect={select}
          defaultMonth={defaultMonth ?? value ?? undefined}
          locale={locale}
          min={min}
          max={max}
          isDateUnavailable={isDateUnavailable}
        />
      )}
    </div>
  )
}

export { DatePicker, type DatePickerProps }
