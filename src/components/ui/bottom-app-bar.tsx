import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type BottomAppBarProps = ComponentProps<"nav"> & {
  safeArea?: boolean
}

function BottomAppBar({
  "aria-label": ariaLabel = "Application actions",
  className,
  safeArea = false,
  ...props
}: BottomAppBarProps) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      data-slot="bottom-app-bar"
      data-safe-area={safeArea || undefined}
      className={cn(
        // Kit geometry (App bars page): 80dp, Surface Container, square corners, no
        // elevation, 4dp leading / 16dp trailing inset, 8dp between actions.
        "flex h-20 w-full max-w-full items-center gap-2 bg-m3-surface-container pl-1 pr-4 text-m3-on-surface-variant",
        "data-safe-area:h-auto data-safe-area:min-h-20 data-safe-area:pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    />
  )
}

function BottomAppBarActions({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="bottom-app-bar-actions" className={cn("flex min-w-0 flex-1 items-center gap-2", className)} />
}

function BottomAppBarFAB({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="bottom-app-bar-fab" className={cn("ml-auto flex shrink-0 items-center pl-3", className)} />
}

export { BottomAppBar, BottomAppBarActions, BottomAppBarFAB, type BottomAppBarProps }
