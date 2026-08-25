import { useCallback, useLayoutEffect, useRef, useState, type ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { FAB, type FABProps } from "./fab"
import { FABMenuContext, useFABMenu, type FABMenuColor } from "./fab-menu-context"

type FABMenuPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end"

/**
 * Kit geometry (`FAB menu` on the Buttons page): 56dp pill actions with
 * 24dp horizontal padding, an 8dp icon gap and title-medium labels, stacked
 * 4dp apart and 8dp away from a 56dp *round* FAB. Actions take the
 * `<color>-container` roles while the trigger takes the plain role.
 */
type FABMenuProps = ComponentProps<"div"> & {
  color?: FABMenuColor
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: FABMenuPlacement
}

function FABMenu({
  children,
  className,
  color = "primary",
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
    <FABMenuContext.Provider value={{ close, color, focusTrigger, open, setTriggerNode, toggle }}>
      <div
        {...props}
        ref={rootRef}
        data-slot="fab-menu"
        data-color={color}
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
          const actions = Array.from(
            rootRef.current?.querySelectorAll<HTMLButtonElement>(
              '[data-slot="fab-menu-action"]:not(:disabled)',
            ) ?? [],
          )
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            if (!actions.length) return
            event.preventDefault()
            const index = actions.indexOf(document.activeElement as HTMLButtonElement)
            const next = event.key === "Home"
              ? 0
              : event.key === "End"
                ? actions.length - 1
                : event.key === "ArrowDown"
                  ? (index + 1) % actions.length
                  : (index - 1 + actions.length) % actions.length
            actions[next]?.focus()
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
      color={context.color}
      shape="round"
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
  return (
    <>
      <button
        type="button"
        aria-label="Dismiss actions"
        aria-hidden={!context.open || undefined}
        tabIndex={context.open ? 0 : -1}
        data-slot="fab-menu-scrim"
        data-open={context.open}
        className="fixed inset-0 -z-10 cursor-default bg-m3-scrim/32 transition-opacity duration-(--m3-spring-effects-fast-duration) data-[open=false]:pointer-events-none data-[open=false]:opacity-0 motion-reduce:transition-none"
        onClick={() => {
          context.close()
          requestAnimationFrame(context.focusTrigger)
        }}
      />
      <div
        {...props}
        role="menu"
        aria-hidden={!context.open || undefined}
        inert={!context.open}
        data-slot="fab-menu-content"
        data-open={context.open}
        className={cn(
          "absolute flex min-w-max flex-col gap-1",
          "transition-[transform,opacity] duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) data-[open=false]:pointer-events-none data-[open=false]:scale-95 data-[open=false]:opacity-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 motion-reduce:transition-none",
          "in-data-[placement=bottom-start]:right-0 in-data-[placement=bottom-start]:bottom-full in-data-[placement=bottom-start]:mb-2",
          "in-data-[placement=bottom-end]:bottom-full in-data-[placement=bottom-end]:left-0 in-data-[placement=bottom-end]:mb-2",
          "in-data-[placement=top-start]:top-full in-data-[placement=top-start]:right-0 in-data-[placement=top-start]:mt-2",
          "in-data-[placement=top-end]:top-full in-data-[placement=top-end]:left-0 in-data-[placement=top-end]:mt-2",
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

const actionColorStyles: Record<FABMenuColor, string> = {
  primary: "bg-m3-primary-container text-m3-on-primary-container",
  secondary: "bg-m3-secondary-container text-m3-on-secondary-container",
  tertiary: "bg-m3-tertiary-container text-m3-on-tertiary-container",
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
      size="lg"
      className={cn(
        "h-14 justify-start gap-2 rounded-[28px] px-6 has-[>svg]:pl-6 text-m3-title-md active:not-disabled:rounded-[28px]",
        actionColorStyles[context.color],
        className,
      )}
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
