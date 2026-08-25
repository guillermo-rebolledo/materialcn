import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { NavigationBar, NavigationBarItem, type NavigationBarItemProps } from "./navigation-bar"
import { NavigationContext, useNavigation } from "./navigation-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

type NavigationRailProps = ComponentProps<"aside"> & {
  onValueChange: (value: string) => void
  value: string
}

function NavigationRail({
  "aria-label": ariaLabel = "Primary navigation",
  children,
  className,
  onValueChange,
  value,
  ...props
}: NavigationRailProps) {
  return (
    <NavigationContext.Provider value={{ onValueChange, value }}>
      <TooltipProvider>
        <aside
          {...props}
          aria-label={ariaLabel}
          data-slot="navigation-rail"
          data-expanded="false"
          className={cn("flex h-full w-20 flex-col items-center gap-3 bg-m3-surface px-1 py-5 text-foreground", className)}
        >
          {children}
        </aside>
      </TooltipProvider>
    </NavigationContext.Provider>
  )
}

function NavigationRailMenu({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="navigation-rail-menu" className={cn("flex min-h-12 items-center justify-center", className)} />
}

function NavigationRailFAB({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="navigation-rail-fab" className={cn("flex min-h-14 items-center justify-center", className)} />
}

function NavigationRailDestinations({ className, ...props }: ComponentProps<"nav">) {
  const navigation = useNavigation()
  return (
    <NavigationBar
      {...props}
      value={navigation.value}
      onValueChange={navigation.onValueChange}
      orientation="vertical"
      data-slot="navigation-rail-destinations"
      className={cn("min-h-0 flex-1 bg-transparent py-2", className)}
    />
  )
}

function NavigationRailItem({ label, ...props }: NavigationBarItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="contents" />}>
        <NavigationBarItem {...props} label={label} showLabel={false} title={label} />
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

function NavigationRailNotifications({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="navigation-rail-notifications" className={cn("mt-auto flex min-h-12 items-center justify-center", className)} />
}

export {
  NavigationRail,
  NavigationRailDestinations,
  NavigationRailFAB,
  NavigationRailItem,
  NavigationRailMenu,
  NavigationRailNotifications,
  type NavigationRailProps,
}
