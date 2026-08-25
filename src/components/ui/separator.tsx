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
        // Kit: 1dp Outline Variant. `inset` starts 16dp from the leading edge,
        // `middle-inset` leaves 16dp at both ends — on either axis.
        "shrink-0 bg-m3-outline-variant",
        orientation === "horizontal"
          ? cn("h-px", variant === "full" && "w-full", variant === "inset" && "ml-4 w-[calc(100%-1rem)]", variant === "middle-inset" && "mx-4 w-[calc(100%-2rem)]")
          : cn("w-px", variant === "full" && "self-stretch", variant === "inset" && "mt-4 self-stretch", variant === "middle-inset" && "my-4 self-stretch"),
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
      // Kit `Divider with subhead`: the rule on top, the subhead 4dp beneath
      // it with 16dp side padding.
      className={cn("flex flex-col gap-1", className)}
    >
      <Separator decorative />
      <h3 className="px-4 text-m3-title-sm text-muted-foreground">{children}</h3>
    </div>
  )
}

export { Separator, SeparatorSubhead }
