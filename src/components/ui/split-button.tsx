import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  ButtonGroup,
  type ButtonGroupAccessibleName,
  type ButtonGroupButtonVariant,
  type ButtonGroupProps,
  type ButtonGroupSize,
} from "./button-group"
import { DropdownMenuTrigger } from "./dropdown-menu"

type SplitButtonVariant = Extract<
  ButtonGroupButtonVariant,
  "default" | "elevated" | "outline" | "tonal"
>

const SplitButtonDisabledContext = createContext(false)

type SplitButtonProps = Omit<
  ButtonGroupProps,
  | "aria-label"
  | "aria-labelledby"
  | "buttonVariant"
  | "orientation"
  | "shape"
  | "size"
  | "variant"
> &
  ButtonGroupAccessibleName & {
    /** Disables both the immediate action and the menu trigger. */
    disabled?: boolean
    /** Material size shared by both segments. */
    size?: ButtonGroupSize
    /** Material color treatment shared by both segments. */
    variant?: SplitButtonVariant
  }

type SplitButtonActionProps = Omit<
  ComponentProps<typeof Button>,
  "shape" | "size" | "variant"
>

type SplitButtonTriggerAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: never; "aria-labelledby": string }

type SplitButtonTriggerProps = Omit<
  ComponentProps<typeof DropdownMenuTrigger>,
  "aria-label" | "aria-labelledby" | "children" | "render"
> &
  SplitButtonTriggerAccessibleName & {
    children?: ReactNode
  }

/** Groups one immediate action with a trailing menu of related actions. */
function SplitButton(splitButtonProps: SplitButtonProps) {
  const accessibleName: ButtonGroupAccessibleName =
    splitButtonProps["aria-label"] !== undefined
      ? {
          "aria-label": splitButtonProps["aria-label"],
          "aria-labelledby": splitButtonProps["aria-labelledby"],
        }
      : { "aria-labelledby": splitButtonProps["aria-labelledby"] }
  const {
    "aria-label": _ariaLabel,
    "aria-labelledby": _ariaLabelledby,
    className,
    children,
    disabled = false,
    size = "default",
    variant = "default",
    ...props
  } = splitButtonProps

  return (
    <ButtonGroup
      {...props}
      {...accessibleName}
      buttonVariant={variant}
      className={cn("m3-split-button", className)}
      data-disabled={disabled || undefined}
      orientation="horizontal"
      shape="round"
      size={size}
      variant="connected"
    >
      <SplitButtonDisabledContext.Provider value={disabled}>
        {children}
      </SplitButtonDisabledContext.Provider>
    </ButtonGroup>
  )
}

/** The leading segment that invokes the split button's immediate action. */
function SplitButtonAction({ disabled, ...props }: SplitButtonActionProps) {
  const groupDisabled = useContext(SplitButtonDisabledContext)

  return (
    <Button
      {...props}
      data-split-button-segment="action"
      disabled={groupDisabled || disabled}
    />
  )
}

/** The trailing segment that opens a composed DropdownMenu. */
function SplitButtonTrigger({
  children = (
    <ChevronDownIcon aria-hidden="true" data-icon="inline-end" />
  ),
  disabled,
  onPointerCancel,
  onPointerDown,
  onPointerUp,
  ...props
}: SplitButtonTriggerProps) {
  const groupDisabled = useContext(SplitButtonDisabledContext)
  const resolvedDisabled = groupDisabled || disabled
  const [isPointerDown, setIsPointerDown] = useState(false)

  return (
    <DropdownMenuTrigger
      {...props}
      data-split-button-pressing={isPointerDown || undefined}
      disabled={resolvedDisabled}
      onPointerCancel={(event) => {
        setIsPointerDown(false)
        onPointerCancel?.(event)
      }}
      onPointerDown={(event) => {
        setIsPointerDown(true)
        onPointerDown?.(event)
      }}
      onPointerUp={(event) => {
        setIsPointerDown(false)
        onPointerUp?.(event)
      }}
      render={
        <Button
          data-split-button-segment="trigger"
          disabled={resolvedDisabled}
        />
      }
    >
      {children}
    </DropdownMenuTrigger>
  )
}

export { SplitButton, SplitButtonAction, SplitButtonTrigger }
export type {
  SplitButtonActionProps,
  SplitButtonProps,
  SplitButtonTriggerAccessibleName,
  SplitButtonTriggerProps,
  SplitButtonVariant,
}
