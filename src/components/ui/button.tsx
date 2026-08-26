import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { useContext } from "react"

import { cn } from "@/lib/utils"
import { ButtonGroupContext } from "./button-group-context"
import { buttonVariants } from "./button-variants"

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /**
     * The action is in flight.
     *
     * The button keeps its exact width and height: the label stays in the
     * layout and is only made invisible, with the indicator laid over it. A
     * button that shrinks to fit a spinner moves everything beside it, and can
     * slide out from under the pointer between mousedown and mouseup — so the
     * click that started the work lands somewhere else.
     */
    loading?: boolean
  }

/**
 * The spinner. It borrows the circular-progress utility rather than the
 * component: that class already collapses to a static arc under
 * `prefers-reduced-motion`, so the button inherits the library's handling
 * instead of growing a second version of it.
 */
function ButtonSpinner() {
  return (
    <span
      data-slot="button-spinner"
      className="absolute inset-0 grid place-items-center"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[1.25em]"
        fill="none"
        aria-hidden
      >
        <circle
          className="m3-circular-progress-indeterminate"
          cx="12"
          cy="12"
          r="10"
          pathLength="100"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function Button({
  children,
  className,
  loading = false,
  onClick,
  onKeyDown,
  variant: variantProp,
  size: sizeProp,
  shape: shapeProp,
  ...props
}: ButtonProps) {
  const groupDefaults = useContext(ButtonGroupContext)
  const variant = variantProp ?? groupDefaults.variant ?? "default"
  const size = sizeProp ?? groupDefaults.size ?? "default"
  const shape = shapeProp ?? groupDefaults.shape ?? "round"

  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      data-shape={shape}
      data-size={size}
      data-variant={variant}
      /*
       * `aria-disabled`, not `disabled`.
       *
       * The real attribute would pull in the variant's disabled styling, and
       * loading has to look different from disabled — one says "come back in a
       * moment", the other says "not for you". It also drops the button out of
       * the tab order mid-interaction, moving focus somewhere the user did not
       * ask for. So the element stays focusable and announces itself busy, and
       * activation is blocked below.
       */
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(
        buttonVariants({ variant, size, shape, className }),
        loading && "relative cursor-wait"
      )}
      onClick={(event) => {
        if (loading) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        onClick?.(event)
      }}
      onKeyDown={(event) => {
        // Space and Enter activate a button; `aria-disabled` describes the
        // state but does not enforce it.
        if (loading && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          return
        }
        onKeyDown?.(event)
      }}
      {...props}
    >
      {/*
        While loading, the label is wrapped so it can be hidden as a unit —
        `[&>*]:invisible` would miss a plain text label, which is the common
        case. `display: contents` means the wrapper generates no box, so the
        button's own flex layout and gap still apply to the label and its icons
        exactly as before, and `visibility` is inherited, so hiding the wrapper
        hides the text node too.

        It is only there while loading. Some of the library's own geometry
        (the split button's icon sizing) selects direct children of a button,
        and an always-present wrapper would break that for every button in
        order to serve the one state that needs it.
      */}
      {loading ? (
        <span data-slot="button-content" className="contents invisible">
          {children}
        </span>
      ) : (
        children
      )}
      {loading && <ButtonSpinner />}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
