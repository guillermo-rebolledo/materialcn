import type { TimeMode, TimeValue } from "./time-picker"

function formatTime(value: TimeValue, mode: TimeMode = "24-hour") {
  if (mode === "24-hour") {
    return `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`
  }
  const period = value.hour >= 12 ? "PM" : "AM"
  const hours = value.hour % 12 || 12
  return `${hours}:${String(value.minute).padStart(2, "0")} ${period}`
}

function parseTime(text: string, mode: TimeMode = "24-hour"): TimeValue | null {
  const match = text.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i)
  if (!match) return null
  let hour = Number(match[1])
  const minute = Number(match[2])
  if (mode === "12-hour") {
    const period = match[3]?.toUpperCase()
    if (!period || hour < 1 || hour > 12) return null
    hour = (hour % 12) + (period === "PM" ? 12 : 0)
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return { hour, minute }
}

function minutesOf(value: TimeValue) {
  return value.hour * 60 + value.minute
}

function isValidTime(value: TimeValue, min?: TimeValue, max?: TimeValue) {
  if (value.hour < 0 || value.hour > 23 || value.minute < 0 || value.minute > 59) return false
  const total = minutesOf(value)
  return (!min || total >= minutesOf(min)) && (!max || total <= minutesOf(max))
}

export { formatTime, isValidTime, parseTime }
