import { useCallback, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"
import { RichTooltipContext, useRichTooltip } from "./rich-tooltip-context"

type RichTooltipProps = {
  children?: ReactNode
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

function RichTooltip({
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  children,
}: RichTooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const open = openProp ?? uncontrolledOpen
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const focusSessionRef = useRef(false)
  const restoringFocusRef = useRef(false)
  const wasOpenRef = useRef(open)
  const setOpen = useCallback((next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }, [onOpenChange, openProp])
  const cancelClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])
  const openNow = useCallback(() => {
    if (restoringFocusRef.current) return
    cancelClose()
    setOpen(true)
  }, [cancelClose, setOpen])
  const closeSoon = useCallback(() => {
    cancelClose()
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }, [cancelClose, setOpen])
  const noteFocus = useCallback(() => {
    focusSessionRef.current = true
  }, [])
  const setTriggerNode = useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node
  }, [])

  useEffect(() => cancelClose, [cancelClose])
  useEffect(() => {
    if (!open && wasOpenRef.current && focusSessionRef.current) {
      const frame = requestAnimationFrame(() => {
        restoringFocusRef.current = true
        triggerRef.current?.focus()
        restoringFocusRef.current = false
      })
      focusSessionRef.current = false
      wasOpenRef.current = open
      return () => cancelAnimationFrame(frame)
    }
    wasOpenRef.current = open
  }, [open])

  return (
    <RichTooltipContext.Provider value={{ cancelClose, closeSoon, noteFocus, openNow, setTriggerNode }}>
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(nextOpen) => {
          if (openProp === undefined) setUncontrolledOpen(nextOpen)
          onOpenChange?.(nextOpen)
        }}
      >
        {children}
      </PopoverPrimitive.Root>
    </RichTooltipContext.Provider>
  )
}

function RichTooltipTrigger({
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  ref,
  ...props
}: PopoverPrimitive.Trigger.Props) {
  const context = useRichTooltip()
  return (
    <PopoverPrimitive.Trigger
      {...props}
      ref={(node: HTMLButtonElement | null) => {
        context.setTriggerNode(node)
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      data-slot="rich-tooltip-trigger"
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (!event.defaultPrevented) context.openNow()
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        if (!event.defaultPrevented) context.closeSoon()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (!event.defaultPrevented) {
          context.noteFocus()
          context.openNow()
        }
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (!event.defaultPrevented) context.closeSoon()
      }}
    />
  )
}

function RichTooltipContent({
  align = "center",
  alignOffset = 0,
  children,
  className,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  side = "top",
  sideOffset = 8,
  ...props
}: PopoverPrimitive.Popup.Props & Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const context = useRichTooltip()
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} className="isolate z-50">
        <PopoverPrimitive.Popup
          {...props}
          data-slot="rich-tooltip-content"
          className={cn(
            "flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-m3-md bg-m3-surface-container p-4 text-foreground shadow-m3-2 outline-none",
            "origin-(--transform-origin) transition-[transform,opacity] duration-(--m3-spring-effects-fast-duration) data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none",
            className,
          )}
          onPointerEnter={(event) => {
            onPointerEnter?.(event)
            if (!event.defaultPrevented) context.cancelClose()
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event)
            if (!event.defaultPrevented) context.closeSoon()
          }}
          onFocus={(event) => {
            onFocus?.(event)
            if (!event.defaultPrevented) {
              context.noteFocus()
              context.cancelClose()
            }
          }}
          onBlur={(event) => {
            onBlur?.(event)
            if (!event.defaultPrevented) context.closeSoon()
          }}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function RichTooltipTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return <PopoverPrimitive.Title {...props} data-slot="rich-tooltip-title" className={cn("text-m3-title-md", className)} />
}

function RichTooltipDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return <PopoverPrimitive.Description {...props} data-slot="rich-tooltip-description" className={cn("text-m3-body-md text-muted-foreground", className)} />
}

function RichTooltipActions({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="rich-tooltip-actions" className={cn("flex items-center gap-2 pt-1", className)} />
}

export {
  RichTooltip,
  RichTooltipActions,
  RichTooltipContent,
  RichTooltipDescription,
  RichTooltipTitle,
  RichTooltipTrigger,
  type RichTooltipProps,
}
