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

export { dateKey, isDateSelectable, sameDay }
