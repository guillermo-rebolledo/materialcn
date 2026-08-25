import type * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "./input"

const interactiveElementSelector = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[contenteditable]",
  '[role="button"]',
  '[role="link"]',
  '[tabindex]:not([tabindex="-1"])',
].join(",")

function focusInputGroupControl(
  addon: HTMLDivElement,
  eventTarget: EventTarget | null,
) {
  if (
    eventTarget instanceof HTMLElement &&
    eventTarget.closest(interactiveElementSelector)
  ) {
    return
  }

  const group = addon.closest('[data-slot="input-group"]')
  const control = group?.querySelector<HTMLInputElement>(
    '[data-slot="input-group-control"]',
  )
  control?.focus()
}

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      role="group"
      data-slot="input-group"
      className={cn(
        "group/input-group relative flex w-full min-w-0 items-center outline-none",
        className,
      )}
    />
  )
}

function InputGroupAddon({
  align = "inline-start",
  className,
  onClick,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "inline-start" | "inline-end" | "block-start" | "block-end"
}) {
  return (
    <div
      {...props}
      role="group"
      data-align={align}
      data-slot="input-group-addon"
      className={cn(
        "flex shrink-0 items-center justify-center gap-2 text-muted-foreground",
        align === "inline-start" && "order-first",
        align === "inline-end" && "order-last",
        align === "block-start" && "order-first w-full",
        align === "block-end" && "order-last w-full",
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        focusInputGroupControl(event.currentTarget, event.target)
      }}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      {...props}
      data-slot="input-group-control"
      className={cn(
        "min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:shadow-none",
        className,
      )}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupInput }
