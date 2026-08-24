import type * as React from "react"

import { cn } from "@/lib/utils"

type NotificationBadgeBaseProps = Omit<
  React.ComponentProps<"span">,
  "aria-hidden" | "aria-label" | "children" | "role"
>

type NotificationBadgeProps = NotificationBadgeBaseProps &
  (
    | {
        "aria-label"?: never
        max?: never
        value?: never
      }
    | {
        "aria-label": string
        max?: number
        value: number
      }
  )

function NotificationBadge({
  "aria-label": ariaLabel,
  className,
  max = 99,
  value,
  ...props
}: NotificationBadgeProps) {
  const isDot = value === undefined
  const displayValue = !isDot && value > max ? `${max}+` : value
  const isLarge = String(displayValue).length > 1

  return (
    <span
      {...props}
      aria-hidden={isDot ? true : undefined}
      aria-label={ariaLabel}
      data-slot="notification-badge"
      role={isDot ? undefined : "status"}
      className={cn(
        "pointer-events-none inline-flex shrink-0 items-center justify-center rounded-m3-full bg-m3-error text-m3-label-sm text-m3-on-error select-none",
        isDot ? "size-1.5" : isLarge ? "h-4 min-w-5.5 px-1" : "size-4",
        className
      )}
    >
      {displayValue}
    </span>
  )
}

function NotificationBadgeAnchor({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="notification-badge-anchor"
      className={cn(
        "relative inline-flex shrink-0 [&>[data-slot=notification-badge]]:absolute [&>[data-slot=notification-badge]]:top-0 [&>[data-slot=notification-badge]]:right-0",
        className
      )}
      {...props}
    />
  )
}

export {
  NotificationBadge,
  NotificationBadgeAnchor,
  type NotificationBadgeProps,
}
