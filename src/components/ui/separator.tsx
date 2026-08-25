"use client"

import type * as React from "react"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  decorative = false,
  orientation = "horizontal",
  variant = "full",
  ...props
}: SeparatorPrimitive.Props & {
  decorative?: boolean
  variant?: "full" | "inset" | "middle-inset"
}) {
  return (
    <SeparatorPrimitive
      {...props}
      data-slot="separator"
      data-variant={variant}
      orientation={orientation}
      role={decorative ? "none" : (props.role ?? "separator")}
      aria-hidden={decorative || undefined}
      className={cn(
        "shrink-0 bg-m3-outline-variant data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        orientation === "horizontal" && variant === "inset" && "ml-4 w-[calc(100%-1rem)]!",
        orientation === "horizontal" && variant === "middle-inset" && "mx-4 w-[calc(100%-2rem)]!",
        className
      )}
    />
  )
}

function SeparatorSubhead({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="separator-subhead"
      className={cn("flex min-h-12 items-center gap-4 px-4", className)}
    >
      <h3 className="shrink-0 text-m3-title-sm text-muted-foreground">{children}</h3>
      <Separator decorative className="flex-1" />
    </div>
  )
}

export { Separator, SeparatorSubhead }
