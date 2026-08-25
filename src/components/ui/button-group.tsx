import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import {
  ButtonGroupContext,
  type ButtonGroupButtonDefaults,
} from "./button-group-context"
import { buttonGroupVariants } from "./button-group-variants"

type ButtonGroupVariant = "standard" | "connected"
type ButtonGroupOrientation = "horizontal" | "vertical"
type ButtonGroupSize = Exclude<
  NonNullable<ButtonGroupButtonDefaults["size"]>,
  "icon" | "icon-xs" | "icon-sm" | "icon-lg"
>
type ButtonGroupShape = NonNullable<ButtonGroupButtonDefaults["shape"]>
type ButtonGroupButtonVariant = NonNullable<
  ButtonGroupButtonDefaults["variant"]
>

type ButtonGroupAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: never; "aria-labelledby": string }

type ButtonGroupProps = Omit<
  ComponentProps<"div">,
  "aria-label" | "aria-labelledby" | "role"
> &
  ButtonGroupAccessibleName & {
  /** Default visual variant inherited by child buttons. */
  buttonVariant?: ButtonGroupButtonVariant
  /** Axis used to lay out the related actions. */
  orientation?: ButtonGroupOrientation
  /** Default shape inherited by child buttons. */
  shape?: ButtonGroupShape
  /** Material size inherited by child buttons. */
  size?: ButtonGroupSize
  /** Whether actions are spaced apart or share connected edges. */
  variant?: ButtonGroupVariant
}

/** Groups related, non-selectable button actions with Material geometry. */
function ButtonGroup({
  buttonVariant,
  children,
  className,
  orientation = "horizontal",
  shape = "round",
  size = "default",
  variant = "standard",
  ...props
}: ButtonGroupProps) {
  const resolvedButtonVariant =
    buttonVariant ?? (variant === "connected" ? "secondary" : "default")

  return (
    <div
      {...props}
      role="group"
      data-orientation={orientation}
      data-shape={shape}
      data-size={size}
      data-slot="button-group"
      data-variant={variant}
      className={cn(
        buttonGroupVariants({ orientation, size, variant }),
        className,
      )}
    >
      <ButtonGroupContext.Provider
        value={{ shape, size, variant: resolvedButtonVariant }}
      >
        {children}
      </ButtonGroupContext.Provider>
    </div>
  )
}

export { ButtonGroup, buttonGroupVariants }
export type {
  ButtonGroupAccessibleName,
  ButtonGroupButtonVariant,
  ButtonGroupOrientation,
  ButtonGroupProps,
  ButtonGroupShape,
  ButtonGroupSize,
  ButtonGroupVariant,
}
