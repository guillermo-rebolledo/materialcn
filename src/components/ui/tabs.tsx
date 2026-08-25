"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { tabsListVariants } from "./tabs-variants"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
        "text-m3-title-sm text-muted-foreground outline-none",
        "transition-[color,background-color] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
        "hover:not-data-disabled:text-m3-on-surface",
        "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:-outline-offset-3",
        "disabled:pointer-events-none disabled:text-m3-on-surface/38 aria-disabled:pointer-events-none aria-disabled:text-m3-on-surface/38",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
        // Segmented: the active tab becomes a filled pill.
        "group-data-[variant=default]/tabs-list:h-full group-data-[variant=default]/tabs-list:rounded-m3-full group-data-[variant=default]/tabs-list:px-4",
        "group-data-[variant=default]/tabs-list:data-active:bg-m3-secondary-container group-data-[variant=default]/tabs-list:data-active:text-m3-on-secondary-container",
        "group-data-[variant=segmented]/tabs-list:h-full group-data-[variant=segmented]/tabs-list:rounded-m3-full group-data-[variant=segmented]/tabs-list:px-4",
        "group-data-[variant=segmented]/tabs-list:data-active:bg-m3-secondary-container group-data-[variant=segmented]/tabs-list:data-active:text-m3-on-secondary-container",
        // Primary / secondary rows are 48dp; the kit's icon-and-label tab grows
        // to 64dp with the icon stacked 2dp above the label (10 / 8 padding).
        "group-data-[variant=line]/tabs-list:h-12 group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:has-[svg]:h-16",
        "group-data-[variant=primary]/tabs-list:h-12 group-data-[variant=primary]/tabs-list:px-4 group-data-[variant=primary]/tabs-list:has-[svg]:h-16",
        "group-data-[variant=secondary]/tabs-list:h-12 group-data-[variant=secondary]/tabs-list:px-4 group-data-[variant=secondary]/tabs-list:has-[svg]:h-16",
        "group-data-[variant=line]/tabs-list:data-active:text-m3-primary",
        "group-data-[variant=primary]/tabs-list:data-active:text-m3-primary",
        "group-data-[variant=secondary]/tabs-list:data-active:text-foreground",
        // Secondary indicator: 2dp, square, spanning the whole trigger.
        "after:absolute after:bg-m3-primary after:opacity-0",
        "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration)",
        "group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-0.5",
        "group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:right-0 group-data-vertical/tabs:after:w-0.5",
        "group-data-[variant=secondary]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    >
      <span
        data-slot="tabs-trigger-label"
        className={cn(
          "relative flex items-center gap-2",
          "group-has-[svg]/tabs-list:flex-col group-has-[svg]/tabs-list:gap-0.5",
          "group-data-vertical/tabs:flex-row",
          // Primary indicator: a 3dp rounded pill as wide as the label, not
          // the trigger (kit: a 20dp shape under a 24dp label box).
          "after:pointer-events-none after:absolute after:rounded-t-m3-full after:bg-m3-primary after:opacity-0",
          "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration)",
          "group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-3.5 group-data-horizontal/tabs:after:h-[3px]",
          "group-data-horizontal/tabs:group-has-[svg]/tabs-list:after:-bottom-[9px]",
          "group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-4 group-data-vertical/tabs:after:w-[3px] group-data-vertical/tabs:after:rounded-l-m3-full group-data-vertical/tabs:after:rounded-tr-none",
          "in-data-[variant=line]:in-data-active:after:opacity-100",
          "in-data-[variant=primary]:in-data-active:after:opacity-100",
        )}
      >
        {children}
      </span>
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-m3-body-md text-m3-on-surface outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
