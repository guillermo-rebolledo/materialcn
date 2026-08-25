import { Children, type ComponentProps, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { NavigationContext, useNavigation } from "./navigation-context"

type NavigationOrientation = "horizontal" | "vertical"

type NavigationBarProps = ComponentProps<"nav"> & {
  onValueChange: (value: string) => void
  orientation?: NavigationOrientation
  value: string
}

function NavigationBar({
  "aria-label": ariaLabel = "Primary navigation",
  children,
  className,
  onKeyDown,
  onValueChange,
  orientation = "horizontal",
  value,
  ...props
}: NavigationBarProps) {
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
    <NavigationContext.Provider value={{ onValueChange, value }}>
      <nav
        {...props}
        aria-label={ariaLabel}
        aria-orientation={orientation}
        data-slot="navigation-bar"
        data-orientation={orientation}
        data-count={Children.count(children)}
        className={cn(
          "flex bg-m3-surface-container text-foreground",
          "data-[orientation=horizontal]:h-20 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:items-stretch",
          "data-[orientation=vertical]:w-20 data-[orientation=vertical]:flex-col data-[orientation=vertical]:py-2",
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
  value,
}: NavigationBarItemProps) {
  const navigation = useNavigation()
  const selected = navigation.value === value
  const itemClassName = cn(
      "group/navigation-item relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-m3-label-md text-muted-foreground outline-none",
      "in-data-[orientation=vertical]:min-h-16 in-data-[orientation=vertical]:w-full in-data-[orientation=vertical]:flex-none",
      "hover:bg-m3-on-surface/8 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-m3-secondary",
      "data-selected:text-foreground disabled:pointer-events-none disabled:text-muted-foreground/38 aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/38",
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
      <span className="relative flex h-8 min-w-16 items-center justify-center rounded-full px-5 transition-colors group-data-selected/navigation-item:bg-m3-secondary-container group-data-selected/navigation-item:text-m3-on-secondary-container [&>svg]:size-6">
        {icon}
        {badge && <span className="absolute top-0 right-3">{badge}</span>}
      </span>
      {showLabel && <span className="max-w-full truncate px-1">{label}</span>}
    </>
  )

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        id={id}
        style={style}
        title={title}
        aria-current={selected ? "page" : undefined}
        aria-disabled={disabled || undefined}
        data-selected={selected || undefined}
        data-slot="navigation-bar-item"
        className={itemClassName}
        tabIndex={disabled ? -1 : undefined}
        onClick={handleClick}
      >
        {content}
      </a>
    )
  }
  return (
    <button
      type="button"
      id={id}
      style={style}
      title={title}
      aria-current={selected ? "page" : undefined}
      data-selected={selected || undefined}
      data-slot="navigation-bar-item"
      className={itemClassName}
      disabled={disabled}
      onClick={handleClick}
    >
      {content}
    </button>
  )
}

export {
  NavigationBar,
  NavigationBarItem,
  type NavigationBarItemProps,
  type NavigationBarProps,
  type NavigationOrientation,
}
