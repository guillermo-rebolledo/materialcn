import { useEffect, useRef, type ComponentProps, type KeyboardEvent } from "react"

import { cn } from "@/lib/utils"
import { Separator } from "./separator"

type ToolbarPresentation = "standard" | "expressive"

type ToolbarProps = ComponentProps<"div"> & {
  presentation?: ToolbarPresentation
}

function Toolbar({
  "aria-label": ariaLabel = "Tools",
  className,
  onKeyDown,
  presentation = "standard",
  ref,
  ...props
}: ToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const getControls = (root: HTMLElement) => Array.from(
    root.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [role="button"]:not([aria-disabled="true"])'),
  )
  const setTabStop = (controls: HTMLElement[], active: HTMLElement) => {
    controls.forEach((control) => {
      control.tabIndex = control === active ? 0 : -1
    })
  }

  useEffect(() => {
    const controls = rootRef.current ? getControls(rootRef.current) : []
    if (controls.length) setTabStop(controls, controls[0])
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
      data-presentation={presentation}
      className={cn(
        "flex w-fit max-w-full items-center gap-1 overflow-x-auto bg-m3-surface-container px-2 text-foreground shadow-m3-1",
        "data-[presentation=standard]:min-h-16 data-[presentation=standard]:rounded-m3-lg",
        "data-[presentation=expressive]:min-h-24 data-[presentation=expressive]:gap-2 data-[presentation=expressive]:rounded-m3-xl data-[presentation=expressive]:px-3",
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
  type ToolbarPresentation,
  type ToolbarProps,
}
