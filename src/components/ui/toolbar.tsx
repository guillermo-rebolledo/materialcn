import { useEffect, useRef, type ComponentProps, type KeyboardEvent } from "react"

import { cn } from "@/lib/utils"
import { Separator } from "./separator"

/** @deprecated Use `variant` (`floating` | `docked`) — the kit has no 96dp toolbar. */
type ToolbarPresentation = "standard" | "expressive"
type ToolbarVariant = "floating" | "docked"
type ToolbarColor = "standard" | "vibrant"

/**
 * Kit geometry (Toolbars page): every toolbar is 64dp. `floating` has 32dp
 * corners, 12×8dp padding, a 4dp gap and elevation level 3; `docked` is flat,
 * square and full-width with 12×16dp padding and an 8dp gap. `standard`
 * colour is Surface Container, `vibrant` is Primary Container.
 */
type ToolbarProps = ComponentProps<"div"> & {
  color?: ToolbarColor
  /** @deprecated Use `variant`. `standard` maps to `floating`. */
  presentation?: ToolbarPresentation
  variant?: ToolbarVariant
}

function Toolbar({
  "aria-label": ariaLabel = "Tools",
  className,
  color = "standard",
  onKeyDown,
  presentation,
  ref,
  variant = "floating",
  ...props
}: ToolbarProps) {
  void presentation
  const rootRef = useRef<HTMLDivElement>(null)
  const getControls = (root: HTMLElement) => Array.from(
    root.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [role="button"]:not([aria-disabled="true"])'),
  )
  const setTabStop = (controls: HTMLElement[], active: HTMLElement) => {
    controls.forEach((control) => {
      control.tabIndex = control === active ? 0 : -1
    })
  }
  const ensureTabStop = () => {
    const controls = rootRef.current ? getControls(rootRef.current) : []
    if (!controls.length) return
    const focused = controls.find((control) => control === document.activeElement)
    const active = focused ?? controls.find((control) => control.tabIndex === 0) ?? controls[0]
    setTabStop(controls, active)
  }

  useEffect(() => {
    if (!rootRef.current) return
    ensureTabStop()
    const observer = new MutationObserver(ensureTabStop)
    observer.observe(rootRef.current, {
      attributeFilter: ["aria-disabled", "disabled"],
      attributes: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    const controls = getControls(event.currentTarget)
    if (!controls.length) return
    const index = controls.indexOf(document.activeElement as HTMLElement)
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? controls.length - 1
        : event.key === "ArrowRight"
          ? (index + 1) % controls.length
          : (index - 1 + controls.length) % controls.length
    event.preventDefault()
    if (controls[next]) setTabStop(controls, controls[next])
    controls[next]?.focus()
  }
  return (
    <div
      {...props}
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      role="toolbar"
      aria-label={ariaLabel}
      data-slot="toolbar"
      data-variant={variant}
      data-color={color}
      className={cn(
        "flex min-h-16 max-w-full items-center overflow-x-auto text-foreground",
        variant === "floating"
          ? "w-fit gap-1 rounded-m3-xl-increased px-2 py-3 shadow-m3-3"
          : "w-full gap-2 px-4 py-3",
        color === "vibrant"
          ? "bg-m3-primary-container text-m3-on-primary-container"
          : "bg-m3-surface-container",
        className,
      )}
      onKeyDown={handleKeyDown}
      onFocusCapture={(event) => {
        const controls = getControls(event.currentTarget)
        const focused = controls.find((control) => control === event.target)
        if (focused) setTabStop(controls, focused)
      }}
    />
  )
}

function ToolbarGroup({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} role="group" data-slot="toolbar-group" className={cn("flex shrink-0 items-center gap-1", className)} />
}

function ToolbarLabel({ className, ...props }: ComponentProps<"span">) {
  return <span {...props} data-slot="toolbar-label" className={cn("shrink-0 px-2 text-m3-label-lg text-muted-foreground", className)} />
}

function ToolbarDivider({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator {...props} orientation="vertical" data-slot="toolbar-divider" className={cn("mx-1 h-8", className)} />
}

function ToolbarOverflow({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="toolbar-overflow" className={cn("ml-auto flex shrink-0 items-center", className)} />
}

function ToolbarFAB({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="toolbar-fab" className={cn("ml-2 flex shrink-0 items-center", className)} />
}

export {
  Toolbar,
  ToolbarDivider,
  ToolbarFAB,
  ToolbarGroup,
  ToolbarLabel,
  ToolbarOverflow,
  type ToolbarColor,
  type ToolbarPresentation,
  type ToolbarProps,
  type ToolbarVariant,
}
