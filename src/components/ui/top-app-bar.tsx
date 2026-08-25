import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type TopAppBarSize = "small" | "medium" | "large"

type TopAppBarProps = ComponentProps<"header"> & {
  scrolled?: boolean
  size?: TopAppBarSize
}

function TopAppBar({ className, scrolled = false, size = "small", ...props }: TopAppBarProps) {
  return (
    <header
      {...props}
      data-slot="top-app-bar"
      data-size={size}
      data-scrolled={scrolled || undefined}
      className={cn(
        "relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start bg-m3-surface px-1 text-foreground transition-[background-color,box-shadow]",
        "data-[size=small]:h-16 data-[size=medium]:h-[116px] data-[size=large]:h-40",
        "data-scrolled:bg-m3-surface-container data-scrolled:shadow-m3-2",
        "motion-reduce:transition-none",
        className,
      )}
    />
  )
}

function TopAppBarNavigation({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="top-app-bar-navigation" className={cn("z-10 flex h-16 items-center px-1", className)} />
}

function TopAppBarTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="top-app-bar-title"
      className={cn(
        "min-w-0 truncate text-m3-title-lg",
        "in-data-[size=small]:self-center in-data-[size=small]:px-2",
        "in-data-[size=medium]:absolute in-data-[size=medium]:right-4 in-data-[size=medium]:bottom-5 in-data-[size=medium]:left-4 in-data-[size=medium]:text-m3-headline-sm",
        "in-data-[size=large]:absolute in-data-[size=large]:right-4 in-data-[size=large]:bottom-7 in-data-[size=large]:left-4 in-data-[size=large]:text-m3-headline-md",
        className,
      )}
    />
  )
}

function TopAppBarActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="top-app-bar-actions"
      className={cn("z-10 col-start-3 row-start-1 flex h-16 items-center gap-0 px-1", className)}
    />
  )
}

function TopAppBarOverflow({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="top-app-bar-overflow" className={cn("flex items-center", className)} />
}

export {
  TopAppBar,
  TopAppBarActions,
  TopAppBarNavigation,
  TopAppBarOverflow,
  TopAppBarTitle,
  type TopAppBarProps,
  type TopAppBarSize,
}
