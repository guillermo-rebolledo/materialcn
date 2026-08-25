import { useEffect, useMemo, useRef, useState, type ComponentProps, type KeyboardEvent } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

type CalendarProps = Omit<ComponentProps<"div">, "onSelect"> & {
  defaultMonth?: Date
  disabled?: boolean
  isDateUnavailable?: (date: Date) => boolean
  locale?: string
  max?: Date
  min?: Date
  onSelect: (date: Date) => void
  selected?: Date | null
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12)
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount, 12)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1, 12)
}

function sameDay(a?: Date | null, b?: Date | null) {
  return Boolean(
    a && b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate(),
  )
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function Calendar({
  className,
  defaultMonth,
  disabled = false,
  isDateUnavailable,
  locale = "en-US",
  max,
  min,
  onSelect,
  selected,
  ...props
}: CalendarProps) {
  const [month, setMonth] = useState(() => startOfMonth(defaultMonth ?? selected ?? new Date()))
  const rootRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<string | null>(null)
  const today = useMemo(() => new Date(), [])

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month)
  const fullDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
  const firstVisible = addDays(month, -month.getDay())
  const days = Array.from({ length: 42 }, (_, index) => addDays(firstVisible, index))
  const years = Array.from({ length: 21 }, (_, index) => month.getFullYear() - 10 + index)

  useEffect(() => {
    if (!pendingFocus.current) return
    const key = pendingFocus.current
    pendingFocus.current = null
    requestAnimationFrame(() => {
      rootRef.current?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus()
    })
  }, [month])

  const unavailable = (date: Date) =>
    disabled ||
    Boolean(min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate(), 12)) ||
    Boolean(max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate(), 12)) ||
    Boolean(isDateUnavailable?.(date))

  const moveFocus = (date: Date, event: KeyboardEvent<HTMLButtonElement>) => {
    event.preventDefault()
    pendingFocus.current = dateKey(date)
    if (date.getMonth() !== month.getMonth() || date.getFullYear() !== month.getFullYear()) {
      setMonth(startOfMonth(date))
    } else {
      requestAnimationFrame(() => {
        rootRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(date)}"]`)?.focus()
      })
      pendingFocus.current = null
    }
  }

  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="calendar"
      className={cn("w-[360px] max-w-full rounded-m3-md bg-m3-surface-container-high p-3 text-foreground shadow-m3-2", className)}
    >
      <div className="flex h-14 items-center gap-2 px-1">
        <select
          aria-label="Month"
          value={month.getMonth()}
          disabled={disabled}
          className="h-10 rounded-m3-sm bg-transparent px-2 text-m3-title-md outline-none focus-visible:ring-3 focus-visible:ring-m3-secondary"
          onChange={(event) => setMonth(new Date(month.getFullYear(), Number(event.target.value), 1, 12))}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2026, index, 1))}
            </option>
          ))}
        </select>
        <select
          aria-label="Year"
          value={month.getFullYear()}
          disabled={disabled}
          className="h-10 rounded-m3-sm bg-transparent px-2 text-m3-title-md outline-none focus-visible:ring-3 focus-visible:ring-m3-secondary"
          onChange={(event) => setMonth(new Date(Number(event.target.value), month.getMonth(), 1, 12))}
        >
          {years.map((year) => <option key={year}>{year}</option>)}
        </select>
        <span className="flex-1" />
        <Button aria-label="Previous month" size="icon-sm" variant="ghost" disabled={disabled} onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronLeftIcon aria-hidden="true" />
        </Button>
        <Button aria-label="Next month" size="icon-sm" variant="ghost" disabled={disabled} onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRightIcon aria-hidden="true" />
        </Button>
      </div>
      <div role="grid" aria-label={monthLabel} className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} role="columnheader" aria-label={weekday.format(addDays(firstVisible, index))} className="flex h-10 items-center justify-center text-m3-label-sm text-muted-foreground">
            {weekday.format(addDays(firstVisible, index))}
          </div>
        ))}
        {days.map((date) => {
          const outside = date.getMonth() !== month.getMonth()
          const isSelected = sameDay(date, selected)
          const isToday = sameDay(date, today)
          const isUnavailable = unavailable(date)
          return (
            <button
              key={dateKey(date)}
              type="button"
              role="gridcell"
              data-date={dateKey(date)}
              data-outside={outside || undefined}
              data-today={isToday || undefined}
              aria-label={fullDate.format(date)}
              aria-selected={isSelected}
              disabled={isUnavailable}
              tabIndex={isSelected || (!selected && sameDay(date, today)) ? 0 : -1}
              className={cn(
                "mx-auto flex size-10 items-center justify-center rounded-full text-m3-body-md outline-none transition-colors",
                "hover:not-disabled:bg-m3-on-surface/8 focus-visible:ring-3 focus-visible:ring-m3-secondary",
                outside && "text-muted-foreground/60",
                isToday && !isSelected && "border border-m3-primary text-m3-primary",
                isSelected && "bg-m3-primary text-m3-on-primary",
                "disabled:cursor-not-allowed disabled:text-muted-foreground/38 disabled:line-through",
              )}
              onClick={() => onSelect(date)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") moveFocus(addDays(date, 1), event)
                if (event.key === "ArrowLeft") moveFocus(addDays(date, -1), event)
                if (event.key === "ArrowDown") moveFocus(addDays(date, 7), event)
                if (event.key === "ArrowUp") moveFocus(addDays(date, -7), event)
                if (event.key === "Home") moveFocus(addDays(date, -date.getDay()), event)
                if (event.key === "End") moveFocus(addDays(date, 6 - date.getDay()), event)
                if (event.key === "PageDown") moveFocus(addMonths(date, 1), event)
                if (event.key === "PageUp") moveFocus(addMonths(date, -1), event)
              }}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
      <div className="flex justify-end pt-2">
        <Button variant="ghost" size="sm" disabled={disabled} onClick={() => { setMonth(startOfMonth(today)); onSelect(today) }}>
          Today
        </Button>
      </div>
    </div>
  )
}

export { Calendar, type CalendarProps, dateKey, sameDay }
