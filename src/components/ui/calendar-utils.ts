function sameDay(a?: Date | null, b?: Date | null) {
  return Boolean(
    a &&
      b &&
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

function isDateSelectable(
  date: Date,
  options: {
    disabled?: boolean
    isDateUnavailable?: (date: Date) => boolean
    max?: Date
    min?: Date
  },
) {
  const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
  const minimum = options.min
    ? new Date(options.min.getFullYear(), options.min.getMonth(), options.min.getDate(), 12)
    : null
  const maximum = options.max
    ? new Date(options.max.getFullYear(), options.max.getMonth(), options.max.getDate(), 12)
    : null

  return !(
    options.disabled ||
    (minimum && candidate < minimum) ||
    (maximum && candidate > maximum) ||
    options.isDateUnavailable?.(candidate)
  )
}

/**
 * The weekday a locale's calendar starts on, as a `Date.getDay()` index
 * (0 = Sunday).
 *
 * Most of the world starts on Monday; the Sunday-first grid is a US
 * convention. `Intl.Locale` knows which, through `getWeekInfo()` — a method in
 * newer engines and a `weekInfo` property in slightly older ones, so both are
 * tried before falling back.
 *
 * The fallback is Sunday rather than Monday only because it is what the
 * component did before this existed; it is reached solely on engines that
 * expose neither, which no longer includes any current browser.
 *
 * Note the conversion: week info numbers days 1–7 with Monday as 1 and Sunday
 * as 7, while `Date.getDay()` numbers them 0–6 with Sunday as 0. Getting that
 * off by one rotates the whole grid, which is exactly the bug this replaces.
 */
function firstDayOfWeek(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number }
      weekInfo?: { firstDay: number }
    }
    const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay
    if (firstDay) return firstDay % 7
  } catch {
    // An unparseable locale tag is the caller's problem, not a reason to fail
    // to render a calendar.
  }
  return 0
}

/** How many days back from `date` the containing week began. */
function daysSinceWeekStart(date: Date, weekStart: number) {
  return (date.getDay() - weekStart + 7) % 7
}

export { dateKey, daysSinceWeekStart, firstDayOfWeek, isDateSelectable, sameDay }
