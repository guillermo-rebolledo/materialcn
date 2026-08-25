import { useCallback, useLayoutEffect, useRef, useState, type ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { FAB, type FABProps } from "./fab"
import { FABMenuContext, useFABMenu } from "./fab-menu-context"

type FABMenuPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end"

type FABMenuProps = ComponentProps<"div"> & {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: FABMenuPlacement
}

function FABMenu({
  children,
  className,
  defaultOpen = false,
  onKeyDown,
  onOpenChange,
  open: openProp,
  placement = "bottom-end",
  ...props
}: FABMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const setTriggerNode = useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node
  }, [])
  const focusTrigger = useCallback(() => triggerRef.current?.focus(), [])

  const setOpen = useCallback((next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }, [onOpenChange, openProp])
  const close = useCallback(() => setOpen(false), [setOpen])
  const toggle = useCallback(() => setOpen(!open), [open, setOpen])

  useLayoutEffect(() => {
    if (!open) return
    rootRef.current?.querySelector<HTMLButtonElement>('[data-slot="fab-menu-action"]:not(:disabled)')?.focus()
  }, [open])

  return (
    <FABMenuContext.Provider value={{ close, focusTrigger, open, setTriggerNode, toggle }}>
      <div
        {...props}
        ref={rootRef}
        data-slot="fab-menu"
        data-open={open || undefined}
        data-placement={placement}
        className={cn("relative z-50 inline-flex", className)}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || !open) return
          if (event.key === "Escape") {
            event.preventDefault()
            close()
            requestAnimationFrame(focusTrigger)
            return
          }
          if (event.key !== "Tab") return
          const focusable = Array.from(
            rootRef.current?.querySelectorAll<HTMLButtonElement>(
              '[data-slot="fab-menu-action"]:not(:disabled), [data-slot="fab"]:not(:disabled)',
            ) ?? [],
          )
          if (!focusable.length) return
          const index = focusable.indexOf(document.activeElement as HTMLButtonElement)
          const next = event.shiftKey
            ? (index - 1 + focusable.length) % focusable.length
            : (index + 1) % focusable.length
          event.preventDefault()
          focusable[next]?.focus()
        }}
      >
        {children}
      </div>
    </FABMenuContext.Provider>
  )
}

function FABMenuTrigger({ onClick, ref, ...props }: FABProps) {
  const context = useFABMenu()
  return (
    <FAB
      {...props}
      ref={(node) => {
        context.setTriggerNode(node)
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      aria-expanded={context.open}
      aria-haspopup="menu"
      data-open={context.open || undefined}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.toggle()
      }}
    />
  )
}

function FABMenuContent({ className, ...props }: ComponentProps<"div">) {
  const context = useFABMenu()
  if (!context.open) return null
  return (
    <>
      <button
        type="button"
        aria-label="Dismiss actions"
        data-slot="fab-menu-scrim"
        className="fixed inset-0 -z-10 cursor-default bg-m3-scrim/32"
        onClick={() => {
          context.close()
          requestAnimationFrame(context.focusTrigger)
        }}
      />
      <div
        {...props}
        role="menu"
        data-slot="fab-menu-content"
        className={cn(
          "absolute flex min-w-max flex-col gap-3",
          "animate-in fade-in zoom-in-95 duration-(--m3-spring-effects-fast-duration) motion-reduce:animate-none",
          "in-data-[placement=bottom-start]:right-0 in-data-[placement=bottom-start]:bottom-full in-data-[placement=bottom-start]:mb-4",
          "in-data-[placement=bottom-end]:bottom-full in-data-[placement=bottom-end]:left-0 in-data-[placement=bottom-end]:mb-4",
          "in-data-[placement=top-start]:top-full in-data-[placement=top-start]:right-0 in-data-[placement=top-start]:mt-4",
          "in-data-[placement=top-end]:top-full in-data-[placement=top-end]:left-0 in-data-[placement=top-end]:mt-4",
          className,
        )}
      />
    </>
  )
}

type FABMenuActionProps = Omit<ComponentProps<typeof Button>, "children"> & {
  children?: React.ReactNode
  closeOnSelect?: boolean
  label: string
}

function FABMenuAction({
  children,
  className,
  closeOnSelect = true,
  label,
  onClick,
  ...props
}: FABMenuActionProps) {
  const context = useFABMenu()
  return (
    <Button
      {...props}
      role="menuitem"
      data-slot="fab-menu-action"
      variant="elevated"
      className={cn("h-12 justify-start gap-3 rounded-m3-lg px-4 shadow-m3-2", className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || !closeOnSelect) return
        context.close()
        requestAnimationFrame(context.focusTrigger)
      }}
    >
      {children}
      <span>{label}</span>
    </Button>
  )
}

export {
  FABMenu,
  FABMenuAction,
  FABMenuContent,
  FABMenuTrigger,
  type FABMenuActionProps,
  type FABMenuPlacement,
  type FABMenuProps,
}
