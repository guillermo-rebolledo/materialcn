import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { NavigationBar, NavigationBarItem, type NavigationBarItemProps } from "./navigation-bar"
import { NavigationContext, useNavigation } from "./navigation-context"
import { NavigationRailContext, useNavigationRail } from "./navigation-rail-context"
import { TooltipProvider } from "./tooltip"

type NavigationRailVariant = "docked" | "floating"

/**
 * Material 3 navigation rail.
 *
 * Kit geometry (`Navigation Rail` / `Navigation Rail: Expanded` on the
 * Navigation page): the compact rail is 96dp wide with 44dp above the menu
 * button and 56dp below the destinations; the menu button and FAB stack 4dp
 * apart and sit 40dp above the destination column. Expanding widens the rail
 * to 220dp with 20dp side/bottom padding, swaps the destinations to 56dp
 * full-width pills and leaves everything else in place. The floating variant
 * adds a Surface Container fill with 16dp corners.
 */
type NavigationRailProps = ComponentProps<"aside"> & {
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onValueChange: (value: string) => void
  value: string
  variant?: NavigationRailVariant
}

function NavigationRail({
  "aria-label": ariaLabel = "Primary navigation",
  children,
  className,
  expanded = false,
  onExpandedChange,
  onValueChange,
  value,
  variant = "docked",
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
            data-variant={variant}
            className={cn(
              "flex h-full flex-col pt-11 text-foreground transition-[width,padding] duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default) motion-reduce:transition-none",
              variant === "floating" ? "rounded-m3-lg bg-m3-surface-container" : "bg-m3-surface",
              expanded ? "w-[220px] items-stretch px-5 pb-5" : "w-24 items-center pb-14",
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
  return <div {...props} data-slot="navigation-rail-menu" className={cn("flex min-h-14 items-center justify-center in-data-[expanded=true]:justify-start", className)} />
}

function NavigationRailFAB({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="navigation-rail-fab" className={cn("mt-1 flex min-h-14 items-center justify-center in-data-[expanded=true]:justify-start", className)} />
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
      itemLayout={rail.expanded ? "row" : "stacked"}
      data-slot="navigation-rail-destinations"
      className={cn("mt-10 min-h-0 flex-1 bg-transparent data-[orientation=vertical]:w-full", rail.expanded && "gap-0", className)}
    />
  )
}

/**
 * Compact rails show captions by default, as the kit does. Pass
 * `showLabel={false}` for an icon-only rail; the caption then moves into a
 * tooltip and the indicator becomes the kit's 56dp circle.
 */
function NavigationRailItem({ label, showLabel = true, ...props }: NavigationBarItemProps) {
  const rail = useNavigationRail()
  const labelVisible = rail.expanded || showLabel
  return (
    <NavigationBarItem
      {...props}
      label={label}
      showLabel={labelVisible}
      title={labelVisible ? undefined : label}
      tooltip={labelVisible ? undefined : label}
    />
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
  type NavigationRailVariant,
}
