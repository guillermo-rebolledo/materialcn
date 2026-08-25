import { useId, useRef, useState, type ComponentProps } from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { CalendarDaysIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Calendar, type CalendarProps } from "./calendar"
import { isDateSelectable } from "./calendar-utils"
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
  const parsedDraft = draft ? parseDate(draft, locale) : null
  const draftInvalid = Boolean(
    draft &&
      (!parsedDraft || !isDateSelectable(parsedDraft, { isDateUnavailable, max, min })),
  )
  const ariaInvalid = invalid || draftInvalid

  const select = (date: Date) => {
    onValueChange(date)
    setDraftState({
      sourceKey: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${locale}`,
      text: formatDate(date, locale),
    })
    setOpen(false)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div
        {...props}
        data-slot="date-picker"
        className={cn("relative flex flex-col gap-2", className)}
      >
        <Field data-invalid={ariaInvalid || undefined} data-disabled={disabled || undefined}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="relative">
            <Input
              id={id}
              value={draft}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={ariaInvalid || undefined}
              aria-describedby={error || draftInvalid ? errorId : undefined}
              placeholder={new Intl.DateTimeFormat(locale).format(new Date(2026, 7, 24))}
              className="pr-24"
              onChange={(event) => setDraftState({ sourceKey, text: event.target.value })}
              onBlur={() => {
                if (!draft) return onValueChange(null)
                if (parsedDraft && !draftInvalid) onValueChange(parsedDraft)
              }}
            />
            <div className="absolute inset-y-0 right-1 flex items-center">
              {value && !disabled && !readOnly && (
                <Button aria-label="Clear date" size="icon-sm" variant="ghost" onClick={() => { onValueChange(null); setDraftState({ sourceKey: `empty-${locale}`, text: "" }) }}>
                  <XIcon aria-hidden="true" />
                </Button>
              )}
              <PopoverPrimitive.Trigger
                ref={triggerRef}
                disabled={disabled || readOnly}
                render={<Button aria-label="Choose date" size="icon-sm" variant="ghost" />}
              >
                <CalendarDaysIcon aria-hidden="true" />
              </PopoverPrimitive.Trigger>
            </div>
          </div>
          {supportingText && <FieldDescription>{supportingText}</FieldDescription>}
          {(error || draftInvalid) && (
            <FieldError id={errorId}>
              {error ?? "Enter an available date within the allowed range"}
            </FieldError>
          )}
        </Field>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner align="end" side="bottom" sideOffset={8} className="isolate z-50">
            <PopoverPrimitive.Popup
              aria-label={`${label} calendar`}
              data-slot="date-picker-popover"
              className="max-w-[calc(100vw-2rem)] origin-(--transform-origin) outline-none transition-[transform,opacity] duration-(--m3-spring-effects-fast-duration) data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none"
            >
              <Calendar
                selected={value}
                onSelect={select}
                defaultMonth={defaultMonth ?? value ?? undefined}
                locale={locale}
                min={min}
                max={max}
                isDateUnavailable={isDateUnavailable}
              />
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </div>
    </PopoverPrimitive.Root>
  )
}

export { DatePicker, type DatePickerProps }
