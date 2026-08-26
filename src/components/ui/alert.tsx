import { type VariantProps } from "class-variance-authority"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { alertTextColumn, alertVariants } from "./alert-variants"
import { Icon } from "./icon"
import type { AlertSeverity } from "./alert.types"

/**
 * The default glyph per severity. Colour alone cannot carry the role — roughly
 * one man in twelve cannot separate the warning and success containers — so the
 * icon is on by default rather than opt-in.
 */
const SEVERITY_ICONS = {
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  error: CircleAlertIcon,
} as const

/**
 * Whether the severity is worth interrupting for.
 *
 * `alert` is assertive: it cuts across whatever a screen reader is currently
 * saying. That is right for something that has gone wrong and wrong for a
 * confirmation, which is why it is derived from the severity rather than left
 * to every call site to get right.
 */
const URGENT: Record<AlertSeverity, boolean> = {
  info: false,
  success: false,
  warning: true,
  error: true,
}

type AlertProps = Omit<React.ComponentProps<"div">, "children"> &
  Omit<VariantProps<typeof alertVariants>, "severity"> & {
    children?: React.ReactNode
    severity?: AlertSeverity
    /** Replace the default glyph, or pass `false` for no icon at all. */
    icon?: React.ReactNode | false
    /**
     * Override how insistently it is announced. Defaults to assertive for
     * warning and error, polite for informational and success.
     */
    urgent?: boolean
  }

/**
 * A message about a page or a region of one, that stays until it is dealt with.
 *
 * The snackbar covers the transient case. This is the persistent one — a
 * form-level error, a service notice, a warning above a destructive area.
 */
function Alert({
  children,
  className,
  icon,
  severity = "info",
  urgent,
  ...props
}: AlertProps) {
  const Glyph = SEVERITY_ICONS[severity]
  const assertive = urgent ?? URGENT[severity]

  return (
    <div
      data-slot="alert"
      data-severity={severity}
      role={assertive ? "alert" : "status"}
      // `role` sets the politeness, but only for content present when the
      // element mounts in some screen readers; the explicit pair is what makes
      // a message swapped into an existing alert announce too.
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic
      className={cn(alertVariants({ severity }), className)}
      {...props}
    >
      {icon === false ? null : (
        <span data-slot="alert-icon" className="row-span-full">
          {icon ?? (
            <Icon size="md">
              <Glyph />
            </Icon>
          )}
        </span>
      )}
      {children}
    </div>
  )
}

/** Optional. Present so a longer message can be scanned rather than read. */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "text-m3-title-md",
        alertTextColumn,
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-m3-body-md [&_p:not(:last-child)]:mb-m3-sm",
        alertTextColumn,
        className
      )}
      {...props}
    />
  )
}

/**
 * Actions sit below the message and wrap, rather than being pinned to a corner.
 *
 * A corner-pinned action has to reserve its width from the text at every
 * viewport, and on a phone that leaves a column of two-word lines beside an
 * empty gutter. Below the text, the alert simply gets taller.
 */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "mt-m3-sm flex flex-wrap items-center gap-m3-sm",
        alertTextColumn,
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants }
export type { AlertProps }
