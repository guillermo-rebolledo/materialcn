import { Children, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { NavigationContext, useNavigation, type NavigationItemLayout } from "./navigation-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

type NavigationOrientation = "horizontal" | "vertical"

/**
 * Material 3 navigation bar.
 *
 * Kit geometry (`Navigation Bar: Vertical items` / `Horizontal items` on the
 * Navigation page): a 64dp Surface Container bar. Each destination is 64dp
 * tall with a 56×32 Secondary Container indicator pill around the 24dp icon
 * and a label-medium caption 4dp beneath it; the inline variant puts icon and
 * caption together inside a 40dp pill. Hover/focus/press state layers paint on
 * the indicator, not the whole destination, and the selected caption uses the
 * Secondary role.
 *
 * The vertical orientation is the compact navigation rail's destination
 * column: 96dp wide with 4dp between destinations.
 */
type NavigationBarProps = ComponentProps<"nav"> & {
  itemLayout?: NavigationItemLayout
  onValueChange: (value: string) => void
  orientation?: NavigationOrientation
  value: string
}

function NavigationBar({
  "aria-label": ariaLabel = "Primary navigation",
  children,
  className,
  itemLayout = "stacked",
  onKeyDown,
  onValueChange,
  orientation = "horizontal",
  ref,
  value,
  ...props
}: NavigationBarProps) {
  const [focusValue, setFocusValue] = useState<string | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const ensureTabStop = () => {
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[data-slot="navigation-bar-item"]:not(:disabled):not([aria-disabled="true"])') ?? [],
    )
    if (!items.length) return
    const active = items.find((item) => item.tabIndex === 0) ?? items[0]
    items.forEach((item) => {
      item.tabIndex = item === active ? 0 : -1
    })
  }

  useLayoutEffect(ensureTabStop)
  useEffect(() => {
    if (!rootRef.current) return
    const observer = new MutationObserver(ensureTabStop)
    observer.observe(rootRef.current, {
      attributeFilter: ["aria-disabled", "disabled"],
      attributes: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [])
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
    const backward = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
    if (![forward, backward, "Home", "End"].includes(event.key)) return
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-slot="navigation-bar-item"]:not(:disabled):not([aria-disabled="true"])'),
    )
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(document.activeElement as HTMLElement)
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : event.key === forward
          ? (index + 1) % items.length
          : (index - 1 + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <NavigationContext.Provider value={{ focusValue: focusValue ?? value, itemLayout, onValueChange, setFocusValue, value }}>
      <nav
        {...props}
        ref={(node) => {
          rootRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        aria-label={ariaLabel}
        aria-orientation={orientation}
        data-slot="navigation-bar"
        data-orientation={orientation}
        data-item-layout={itemLayout}
        data-count={Children.count(children)}
        className={cn(
          "flex bg-m3-surface-container text-foreground",
          "data-[orientation=horizontal]:h-16 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:items-stretch",
          "data-[orientation=horizontal]:data-[item-layout=inline]:justify-center data-[orientation=horizontal]:data-[item-layout=inline]:gap-5",
          "data-[orientation=vertical]:w-24 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-1",
          className,
        )}
        onKeyDown={handleKeyDown}
      >
        {children}
      </nav>
    </NavigationContext.Provider>
  )
}

type NavigationBarItemProps = {
  badge?: ReactNode
  className?: string
  disabled?: boolean
  href?: string
  id?: string
  icon: ReactNode
  label: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  showLabel?: boolean
  style?: CSSProperties
  title?: string
  tooltip?: ReactNode
  tooltipDisabled?: boolean
  value: string
}

function NavigationBarItem({
  badge,
  className,
  disabled,
  href,
  id,
  icon,
  label,
  onClick,
  showLabel = true,
  style,
  title,
  tooltip,
  tooltipDisabled = false,
  value,
}: NavigationBarItemProps) {
  const navigation = useNavigation()
  const layout = navigation.itemLayout ?? "stacked"
  const stacked = layout === "stacked"
  const selected = navigation.value === value
  const tabbable = !disabled && (navigation.focusValue ?? navigation.value) === value
  const itemClassName = cn(
    "group/navigation-item relative flex min-w-0 flex-col items-center justify-center gap-1 text-m3-label-md text-muted-foreground outline-none",
    "focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-m3-secondary",
    "disabled:pointer-events-none disabled:text-m3-on-surface/38 aria-disabled:pointer-events-none aria-disabled:text-m3-on-surface/38",
    "in-data-[orientation=horizontal]:flex-1",
    "in-data-[orientation=vertical]:w-full in-data-[orientation=vertical]:flex-none",
    layout === "row"
      ? "min-h-14 rounded-full"
      : cn("min-h-16 rounded-m3-md", stacked && showLabel ? "py-1.5" : "py-1"),
    layout === "inline" && "in-data-[orientation=horizontal]:flex-none",
    className,
  )
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
    if (!event.defaultPrevented) navigation.onValueChange(value)
  }
  const content = (
    <>
      <span
        data-slot="navigation-bar-indicator"
        className={cn(
          "relative isolate flex shrink-0 items-center justify-center rounded-full",
          "transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) motion-reduce:transition-none",
          // State layer: the content colour washed over the indicator at the
          // kit's 8 / 10 / 10 % — it never spreads to the whole destination.
          "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-current after:opacity-0",
          "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration) after:ease-(--m3-spring-effects-fast)",
          "group-hover/navigation-item:after:opacity-8 group-focus-visible/navigation-item:after:opacity-10 group-active/navigation-item:after:opacity-10",
          "group-data-selected/navigation-item:bg-m3-secondary-container group-data-selected/navigation-item:text-m3-on-secondary-container",
          stacked && (showLabel ? "h-8 w-14" : "size-14"),
          layout === "inline" && "h-10 gap-1 px-4",
          layout === "row" && "h-14 w-full justify-start gap-2 px-4 text-m3-label-lg",
        )}
      >
        <span className="relative flex shrink-0 [&>svg]:size-6">
          {icon}
          {badge && <span className="absolute -top-1 left-4">{badge}</span>}
        </span>
        {!stacked && showLabel && <span className="min-w-0 truncate">{label}</span>}
      </span>
      {stacked && showLabel && (
        <span className="max-w-full truncate px-1 group-data-selected/navigation-item:text-m3-secondary">{label}</span>
      )}
    </>
  )

  const item = href ? (
      <a
        href={disabled ? undefined : href}
        id={id}
        style={style}
        title={title}
        aria-current={selected ? "page" : undefined}
        aria-disabled={disabled || undefined}
        data-selected={selected || undefined}
        data-value={value}
        data-slot="navigation-bar-item"
        className={itemClassName}
        tabIndex={tabbable ? 0 : -1}
        onClick={handleClick}
        onFocus={() => navigation.setFocusValue?.(value)}
      >
        {content}
      </a>
  ) : (
    <button
      type="button"
      id={id}
      style={style}
      title={title}
      aria-current={selected ? "page" : undefined}
      data-selected={selected || undefined}
      data-value={value}
      data-slot="navigation-bar-item"
      className={itemClassName}
      disabled={disabled}
      tabIndex={tabbable ? 0 : -1}
      onClick={handleClick}
      onFocus={() => navigation.setFocusValue?.(value)}
    >
      {content}
    </button>
  )

  if (!tooltip) return item
  return (
    <Tooltip disabled={tooltipDisabled}>
      <TooltipTrigger render={item} disabled={tooltipDisabled} />
      {!tooltipDisabled && <TooltipContent side="right">{tooltip}</TooltipContent>}
    </Tooltip>
  )
}

export {
  NavigationBar,
  NavigationBarItem,
  type NavigationBarItemProps,
  type NavigationBarProps,
  type NavigationOrientation,
}
