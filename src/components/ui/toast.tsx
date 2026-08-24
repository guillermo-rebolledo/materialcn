import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import type { ToastManager } from "@base-ui/react/toast"
import { X } from "lucide-react"

import { ThemeContext } from "@/components/theme-context"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { toast, useToastManager, type SnackbarData } from "./toast-manager"

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ className, ...props }: ToastPrimitive.Portal.Props) {
  const theme = React.use(ThemeContext)

  return (
    <ToastPrimitive.Portal
      data-slot="toast-portal"
      className={cn(theme?.resolvedTheme, className)}
      {...props}
    />
  )
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "group/toast-viewport pointer-events-none fixed inset-x-4 bottom-4 mx-auto w-auto max-w-[344px] outline-none",
        "sm:right-6 sm:left-auto sm:mx-0 sm:w-[344px]",
        className,
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom",
        "rounded-m3-xs bg-m3-inverse-surface text-m3-inverse-on-surface shadow-m3-3",
        "outline-none select-none will-change-transform",
        "focus-visible:outline-m3-inverse-primary focus-visible:outline-3 focus-visible:outline-offset-2",
        "[--gap:0.5rem] [--peek:0.5rem]",
        "[--height:var(--toast-frontmost-height,var(--toast-height))]",
        "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
        "[--scale:calc(max(0,1-(var(--toast-index)*0.06)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height)",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
        "[transition:transform_var(--m3-spring-spatial-default-duration)_var(--m3-spring-spatial-default),opacity_var(--m3-spring-effects-fast-duration)_var(--m3-spring-effects-fast),height_var(--m3-spring-effects-fast-duration)_var(--m3-spring-effects-fast)]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:opacity-0 data-starting-style:[transform:translateY(100%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:opacity-0",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(100%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className,
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex w-full items-center overflow-hidden",
        "transition-opacity duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
        "data-behind:opacity-0 data-expanded:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-m3-body-md", className)}
      {...props}
    />
  )
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-m3-body-md", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="ghost" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn(
        "h-10 shrink-0 rounded-[20px] px-3 text-m3-label-lg text-m3-inverse-primary",
        "focus-visible:outline-m3-inverse-primary",
        className,
      )}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Dismiss notification"
      render={render}
      className={cn(
        "size-12 shrink-0 rounded-[24px] text-m3-inverse-on-surface",
        "focus-visible:outline-m3-inverse-primary",
        className,
      )}
      {...props}
    >
      {children ?? <X aria-hidden="true" />}
    </ToastPrimitive.Close>
  )
}

function ToastList() {
  const { toasts } = useToastManager()

  return toasts.map((toastItem, index) => {
    const layout = toastItem.data?.layout ?? "auto"
    const dismissible = toastItem.data?.dismissible ?? false
    const hasAction = Boolean(toastItem.actionProps)
    const hasControls = hasAction || dismissible

    return (
      <Toast
        key={toastItem.id}
        toast={toastItem}
        data-dismissible={dismissible || undefined}
        data-has-action={hasAction || undefined}
        data-layout={layout}
        swipeDirection={["left", "right", "down"]}
        className={cn(
          index === 0 &&
            "group-focus-within/toast-viewport:[outline:3px_solid_var(--m3-inverse-primary)] group-focus-within/toast-viewport:[outline-offset:2px]",
        )}
      >
        <ToastContent
          data-layout={layout}
          className={cn(
            layout === "stacked" && "min-h-28 flex-col items-stretch gap-2.5",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col justify-center py-3.5 pl-4",
              !hasControls && "pr-4",
              layout === "stacked" && "w-full flex-none pt-3.5 pb-0 pr-4",
            )}
          >
            {toastItem.title != null && <ToastTitle />}
            <ToastDescription />
          </div>
          {hasControls && (
            <div
              data-slot="toast-controls"
              className={cn(
                "flex shrink-0 items-center",
                layout === "stacked" && "h-12 w-full justify-end px-2",
              )}
            >
              {hasAction && <ToastAction />}
              {dismissible && <ToastClose />}
            </div>
          )}
        </ToastContent>
      </Toast>
    )
  })
}

type ToasterProps = Omit<ToastPrimitive.Provider.Props, "toastManager"> & {
  /** An isolated manager; defaults to the exported app-wide `toast`. */
  toastManager?: ToastManager<SnackbarData>
  /** Portal customization, including a theme-scoped `container`. */
  portalProps?: ToastPrimitive.Portal.Props
  /** Position or label overrides for the notification viewport. */
  viewportProps?: ToastPrimitive.Viewport.Props
}

/**
 * Renders the app's snackbar region. Mount once near the application root.
 * Base UI supplies timeout pausing, swipe dismissal, stacking, F6 navigation,
 * focus restoration, and polite/assertive live-region behavior.
 */
function Toaster({
  children,
  toastManager = toast,
  portalProps,
  viewportProps,
  ...props
}: ToasterProps) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal {...portalProps}>
        <ToastViewport {...viewportProps}>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
}
export { createToastManager, toast, useToastManager } from "./toast-manager"
export type { SnackbarData } from "./toast-manager"
export type { ToasterProps }
