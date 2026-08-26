import { useLayoutEffect, useMemo, useRef, useState, type ComponentProps, type KeyboardEvent } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  dateKey,
  daysSinceWeekStart,
  firstDayOfWeek,
  isDateSelectable,
  sameDay,
} from "./calendar-utils"

type CalendarProps = Omit<ComponentProps<"div">, "onSelect"> & {
  defaultMonth?: Date
  disabled?: boolean
  isDateUnavailable?: (date: Date) => boolean
  locale?: string
  max?: Date
  min?: Date
  onSelect: (date: Date) => void
  range?: { start: Date | null; end: Date | null }
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

function addMonthsPreservingDay(date: Date, amount: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0, 12).getDate()
  target.setDate(Math.min(date.getDate(), lastDay))
  return target
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
  range,
  ref,
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
  // Where the grid starts, and therefore what the header row is labelled with:
  // both derive from the same value, so the columns cannot rotate out from
  // under their labels.
  const weekStart = useMemo(() => firstDayOfWeek(locale), [locale])
  const firstVisible = addDays(month, -daysSinceWeekStart(month, weekStart))
  const days = Array.from({ length: 42 }, (_, index) => addDays(firstVisible, index))
  const years = Array.from({ length: 21 }, (_, index) => month.getFullYear() - 10 + index)

  useLayoutEffect(() => {
    if (!pendingFocus.current) return
    const key = pendingFocus.current
    pendingFocus.current = null
    rootRef.current?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus()
  }, [month])

  const unavailable = (date: Date) =>
    !isDateSelectable(date, { disabled, isDateUnavailable, max, min })
  const focusDate = [selected, range?.end, range?.start, today].find(
    (candidate) => candidate && days.some((date) => sameDay(date, candidate)) && !unavailable(candidate),
  ) ?? days.find((date) => date.getMonth() === month.getMonth() && !unavailable(date))
    ?? days.find((date) => !unavailable(date))

  const moveFocus = (
    date: Date,
    direction: -1 | 1,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    let target = date
    let attempts = 0
    while (unavailable(target) && attempts < 3660) {
      target = addDays(target, direction)
      attempts += 1
    }
    if (unavailable(target)) return
    pendingFocus.current = dateKey(target)
    if (target.getMonth() !== month.getMonth() || target.getFullYear() !== month.getFullYear()) {
      setMonth(startOfMonth(target))
    } else {
      requestAnimationFrame(() => {
        rootRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(target)}"]`)?.focus()
      })
      pendingFocus.current = null
    }
  }

  return (
    <div
      {...props}
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      data-slot="calendar"
      // Kit docked picker: 360dp, 16dp corners, Surface Container High, 12dp grid inset.
      className={cn("w-[360px] max-w-full rounded-m3-lg bg-m3-surface-container-high p-3 text-foreground shadow-m3-2", className)}
    >
      <div className="flex h-14 items-center gap-2 px-1">
        <select
          aria-label="Month"
          value={month.getMonth()}
          disabled={disabled}
          className="flex h-10 items-center gap-2 rounded-full bg-transparent pr-2 pl-3 text-m3-label-lg text-m3-on-surface-variant outline-none transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) hover:not-disabled:bg-m3-on-surface/8 focus-visible:ring-3 focus-visible:ring-m3-secondary disabled:text-m3-on-surface/38"
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
          className="flex h-10 items-center gap-2 rounded-full bg-transparent pr-2 pl-3 text-m3-label-lg text-m3-on-surface-variant outline-none transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) hover:not-disabled:bg-m3-on-surface/8 focus-visible:ring-3 focus-visible:ring-m3-secondary disabled:text-m3-on-surface/38"
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
      {/* Kit grid: 48dp rows with a 40dp visual circle centred in each 48dp cell. */}
      <div role="grid" aria-label={monthLabel} className="grid grid-cols-7">
        <div role="row" className="contents">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} role="columnheader" aria-label={weekday.format(addDays(firstVisible, index))} className="flex h-12 items-center justify-center text-m3-label-md text-foreground">
              {weekday.format(addDays(firstVisible, index))}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, rowIndex) => (
          <div key={rowIndex} role="row" className="contents">
            {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((date) => {
              const outside = date.getMonth() !== month.getMonth()
              const isSelected = sameDay(date, selected)
              const isRangeStart = sameDay(date, range?.start)
              const isRangeEnd = sameDay(date, range?.end)
              const isInRange = Boolean(
                range?.start && range.end && date > range.start && date < range.end,
              )
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
                  aria-selected={isSelected || isRangeStart || isRangeEnd || isInRange}
                  data-range-start={isRangeStart || undefined}
                  data-range-end={isRangeEnd || undefined}
                  data-in-range={isInRange || undefined}
                  disabled={isUnavailable}
                  tabIndex={sameDay(date, focusDate) ? 0 : -1}
                  className={cn(
                    "relative isolate flex size-12 items-center justify-center text-m3-body-lg outline-none",
                    // The 40dp visual container.
                    "before:absolute before:size-10 before:rounded-full before:-z-10 before:transition-colors before:duration-(--m3-spring-effects-fast-duration) before:ease-(--m3-spring-effects-fast)",
                    "hover:not-disabled:before:bg-m3-on-surface/8 focus-visible:before:ring-3 focus-visible:before:ring-m3-secondary",
                    outside && "text-muted-foreground",
                    isToday && !isSelected && !isRangeStart && !isRangeEnd && "text-m3-primary before:border before:border-m3-primary",
                    (isSelected || isRangeStart || isRangeEnd) && "text-m3-on-primary before:bg-m3-primary hover:not-disabled:before:bg-m3-primary",
                    // Range band: painted across the full 48dp column so it is
                    // continuous; endpoints fill only their inner half.
                    (isInRange || (isRangeStart && range?.end) || (isRangeEnd && range?.start)) && "after:absolute after:inset-y-1 after:-z-20 after:bg-m3-secondary-container",
                    isInRange && "text-m3-on-secondary-container after:inset-x-0",
                    isRangeStart && range?.end && !isRangeEnd && "after:left-1/2 after:right-0",
                    isRangeEnd && range?.start && !isRangeStart && "after:left-0 after:right-1/2",
                    "disabled:cursor-not-allowed disabled:text-m3-on-surface/38",
                  )}
                  onClick={() => onSelect(date)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight") moveFocus(addDays(date, 1), 1, event)
                    if (event.key === "ArrowLeft") moveFocus(addDays(date, -1), -1, event)
                    if (event.key === "ArrowDown") moveFocus(addDays(date, 7), 1, event)
                    if (event.key === "ArrowUp") moveFocus(addDays(date, -7), -1, event)
                    // Home and End mean the ends of the *displayed* row, so
                    // they follow the week start too — on a Monday-first
                    // calendar, Home is Monday.
                    if (event.key === "Home") moveFocus(addDays(date, -daysSinceWeekStart(date, weekStart)), 1, event)
                    if (event.key === "End") moveFocus(addDays(date, 6 - daysSinceWeekStart(date, weekStart)), -1, event)
                    if (event.key === "PageDown") moveFocus(addMonthsPreservingDay(date, 1), 1, event)
                    if (event.key === "PageUp") moveFocus(addMonthsPreservingDay(date, -1), -1, event)
                  }}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <Button variant="ghost" size="sm" disabled={unavailable(today)} onClick={() => { setMonth(startOfMonth(today)); onSelect(today) }}>
          Today
        </Button>
      </div>
    </div>
  )
}

export { Calendar, type CalendarProps }
