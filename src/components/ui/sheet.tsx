import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  side,
  ...props
}: SheetPrimitive.Backdrop.Props & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      data-side={side}
      className={cn(
        // Kit scrim: the Scrim role at 32%, no blur, on every side.
        "fixed inset-0 z-(--m3-z-scrim) bg-m3-scrim/32 transition-opacity duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay side={side} />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          // Side sheets (kit `Side Sheet`): Surface Container Low, 16dp corners on the
          // inner edge, elevation 1, 320dp wide.
          "group/sheet fixed z-(--m3-z-modal) flex flex-col gap-4 bg-m3-surface-container-low bg-clip-padding text-m3-body-md text-m3-on-surface shadow-m3-1 outline-none transition duration-(--m3-spring-effects-default-duration) ease-(--m3-spring-effects-default) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:mx-auto data-[side=bottom]:h-auto data-[side=bottom]:max-h-[min(480px,calc(100dvh-16px))] data-[side=bottom]:w-full data-[side=bottom]:max-w-[412px] data-[side=bottom]:gap-3 data-[side=bottom]:overflow-hidden data-[side=bottom]:rounded-t-m3-xl data-[side=bottom]:bg-m3-surface-container-low data-[side=bottom]:p-4 data-[side=bottom]:text-m3-on-surface data-[side=bottom]:shadow-m3-3 data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:rounded-r-m3-lg data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:rounded-l-m3-lg data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:rounded-b-m3-lg data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-80 data-[side=right]:sm:max-w-80",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[side=bottom]/sheet:p-0 group-data-[side=bottom]/sheet:pr-12",
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 p-4 group-data-[side=bottom]/sheet:p-0",
        className
      )}
      {...props}
    />
  )
}

/** Scrollable content region for sheets with variable-length content. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex min-h-0 flex-col gap-3 overflow-y-auto p-4 text-m3-body-md group-data-[side=bottom]/sheet:p-0",
        className
      )}
      {...props}
    />
  )
}

/** Visual affordance only; this component does not implement drag gestures. */
function SheetHandle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="sheet-handle"
      className={cn(
        "mx-auto h-1 w-8 shrink-0 rounded-m3-full bg-m3-outline",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        // Kit: title-large Regular; side sheets set it in On Surface Variant.
        "text-m3-title-lg font-m3-regular text-m3-on-surface-variant group-data-[side=bottom]/sheet:text-m3-on-surface",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-m3-body-md text-m3-on-surface-variant", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetBody,
  SheetHandle,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
