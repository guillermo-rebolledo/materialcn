import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { NavigationBar, NavigationBarItem, type NavigationBarItemProps } from "./navigation-bar"
import { NavigationContext, useNavigation } from "./navigation-context"
import { NavigationRailContext, useNavigationRail } from "./navigation-rail-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

type NavigationRailProps = ComponentProps<"aside"> & {
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onValueChange: (value: string) => void
  value: string
}

function NavigationRail({
  "aria-label": ariaLabel = "Primary navigation",
  children,
  className,
  expanded = false,
  onExpandedChange,
  onValueChange,
  value,
  ...props
}: NavigationRailProps) {
  return (
    <NavigationContext.Provider value={{ onValueChange, value }}>
      <NavigationRailContext.Provider value={{ expanded, onExpandedChange }}>
        <TooltipProvider>
          <aside
          {...props}
          aria-label={ariaLabel}
          data-slot="navigation-rail"
          data-expanded={expanded}
          className={cn(
            "flex h-full flex-col gap-3 bg-m3-surface py-5 text-foreground transition-[width,padding] motion-reduce:transition-none",
            expanded ? "w-[360px] items-stretch px-3" : "w-20 items-center px-1",
            className,
          )}
        >
          {children}
          </aside>
        </TooltipProvider>
      </NavigationRailContext.Provider>
    </NavigationContext.Provider>
  )
}

function NavigationRailMenu({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="navigation-rail-menu" className={cn("flex min-h-12 items-center justify-center in-data-[expanded=true]:justify-start", className)} />
}

function NavigationRailFAB({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="navigation-rail-fab" className={cn("flex min-h-14 items-center justify-center in-data-[expanded=true]:justify-start", className)} />
}

function NavigationRailDestinations({ className, ...props }: ComponentProps<"nav">) {
  const navigation = useNavigation()
  const rail = useNavigationRail()
  return (
    <NavigationBar
      {...props}
      value={navigation.value}
      onValueChange={navigation.onValueChange}
      orientation="vertical"
      data-slot="navigation-rail-destinations"
      className={cn("min-h-0 flex-1 bg-transparent py-2", rail.expanded && "w-full", className)}
    />
  )
}

function NavigationRailItem({ label, ...props }: NavigationBarItemProps) {
  const rail = useNavigationRail()
  const item = (
    <NavigationBarItem
      {...props}
      label={label}
      showLabel={rail.expanded}
      title={rail.expanded ? undefined : label}
      className={cn(rail.expanded && "min-h-14! w-full! flex-none! flex-row! justify-start! gap-3 px-4")}
    />
  )
  if (rail.expanded) return item
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="contents" />}>
        {item}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

function NavigationRailNotifications({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="navigation-rail-notifications" className={cn("mt-auto flex min-h-12 items-center justify-center", className)} />
}

function NavigationRailExpansionToggle({ onClick, ...props }: ComponentProps<typeof Button>) {
  const rail = useNavigationRail()
  return (
    <Button
      {...props}
      type="button"
      aria-expanded={rail.expanded}
      size="icon"
      variant="ghost"
      disabled={props.disabled || !rail.onExpandedChange}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) rail.onExpandedChange?.(!rail.expanded)
      }}
    />
  )
}

export {
  NavigationRail,
  NavigationRailDestinations,
  NavigationRailExpansionToggle,
  NavigationRailFAB,
  NavigationRailItem,
  NavigationRailMenu,
  NavigationRailNotifications,
  type NavigationRailProps,
}
