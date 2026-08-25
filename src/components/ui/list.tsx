import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

type ListDensity = "default" | "-2" | "-4"

function List({
  className,
  density = "default",
  ...props
}: React.ComponentProps<"div"> & { density?: ListDensity }) {
  return (
    <div
      role="list"
      data-slot="list"
      data-density={density}
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function ListItem({
  className,
  lines = 1,
  render,
  ...props
}: useRender.ComponentProps<"div"> & { lines?: 1 | 2 | 3 }) {
  const item = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "group/list-item flex w-full items-center gap-4 px-4 py-2 text-m3-on-surface",
          "data-[lines=1]:min-h-14 data-[lines=2]:min-h-18 data-[lines=3]:min-h-22 data-[lines=3]:py-3",
          "in-data-[density=-2]:data-[lines=1]:min-h-12 in-data-[density=-2]:data-[lines=2]:min-h-16 in-data-[density=-2]:data-[lines=3]:min-h-20 in-data-[density=-2]:data-[lines=3]:py-2",
          "in-data-[density=-4]:data-[lines=1]:min-h-10 in-data-[density=-4]:data-[lines=2]:min-h-14 in-data-[density=-4]:data-[lines=2]:py-1.5 in-data-[density=-4]:data-[lines=3]:min-h-18 in-data-[density=-4]:data-[lines=3]:py-1",
          "data-interactive:cursor-pointer data-interactive:border-0 data-interactive:text-left data-interactive:outline-none",
          "data-interactive:transition-colors data-interactive:duration-(--m3-spring-effects-fast-duration) data-interactive:ease-(--m3-spring-effects-fast)",
          "data-interactive:hover:bg-m3-on-surface/8 data-interactive:focus-visible:bg-m3-on-surface/10 data-interactive:active:bg-m3-on-surface/10",
          "data-interactive:focus-visible:outline-3 data-interactive:focus-visible:outline-offset-[-3px] data-interactive:focus-visible:outline-m3-secondary",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:[&_[data-slot=list-item-headline]]:text-m3-on-surface/38 disabled:[&_[data-slot=list-item-overline]]:text-m3-on-surface/38 disabled:[&_[data-slot=list-item-supporting-text]]:text-m3-on-surface/38 disabled:[&_[data-slot=list-item-trailing]]:text-m3-on-surface/38",
          "aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:[&_[data-slot=list-item-headline]]:text-m3-on-surface/38 aria-disabled:[&_[data-slot=list-item-overline]]:text-m3-on-surface/38 aria-disabled:[&_[data-slot=list-item-supporting-text]]:text-m3-on-surface/38 aria-disabled:[&_[data-slot=list-item-trailing]]:text-m3-on-surface/38",
          className,
        ),
      },
      props,
    ),
    state: {
      slot: "list-item",
      lines,
      interactive: Boolean(render),
    },
  })

  return (
    <div
      role="listitem"
      data-slot="list-item-wrapper"
      data-lines={lines}
      className="contents"
    >
      {item}
    </div>
  )
}

function ListSection({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="list-section"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function ListSubheader({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="list-subheader"
      className={cn(
        "flex min-h-12 items-center px-4 text-m3-title-sm text-m3-on-surface-variant",
        className,
      )}
      {...props}
    />
  )
}

function ListItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-content"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  )
}

function ListItemLeading({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "icon" | "avatar" | "media" | "control"
}) {
  return (
    <div
      data-slot="list-item-leading"
      data-variant={variant}
      className={cn(
        "flex shrink-0 items-center justify-center self-center text-m3-on-surface-variant group-data-[lines=3]/list-item:self-start",
        "data-[variant=icon]:size-6 data-[variant=icon]:[&>svg]:size-6",
        "data-[variant=avatar]:size-10",
        "data-[variant=media]:size-14 data-[variant=media]:overflow-hidden data-[variant=media]:[&>img]:size-full data-[variant=media]:[&>img]:object-cover",
        "data-[variant=control]:min-h-6 data-[variant=control]:min-w-6",
        className,
      )}
      {...props}
    />
  )
}

function ListItemOverline({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-overline"
      className={cn(
        "text-m3-label-md text-m3-on-surface-variant",
        className,
      )}
      {...props}
    />
  )
}

function ListItemHeadline({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-headline"
      className={cn("text-m3-body-lg text-m3-on-surface", className)}
      {...props}
    />
  )
}

function ListItemSupportingText({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-supporting-text"
      className={cn(
        "line-clamp-2 text-m3-body-md text-m3-on-surface-variant",
        className,
      )}
      {...props}
    />
  )
}

function ListItemTrailing({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-trailing"
      className={cn(
        "flex shrink-0 items-center justify-center gap-2 self-center text-m3-label-sm text-m3-on-surface-variant group-data-[lines=3]/list-item:self-start [&>svg]:size-6",
        className,
      )}
      {...props}
    />
  )
}

export {
  List,
  ListItem,
  ListItemContent,
  ListItemHeadline,
  ListItemLeading,
  ListItemOverline,
  ListItemSupportingText,
  ListItemTrailing,
  ListSection,
  ListSubheader,
}
export type { ListDensity }
