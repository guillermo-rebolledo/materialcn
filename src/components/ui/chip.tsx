import type * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge, badgeVariants } from "./badge"

/**
 * Kit `Style=Elevated`: Surface Container Low at level 1, level 2 while pressed,
 * no outline.
 */
const elevatedChipClassName =
  "border-transparent bg-m3-surface-container-low shadow-m3-1 active:not-disabled:shadow-m3-2 disabled:bg-m3-on-surface/12 disabled:shadow-m3-0 disabled:border-transparent"

const actionChipClassName =
  "cursor-pointer select-none hover:bg-m3-on-surface/8 focus-visible:bg-m3-on-surface/10 active:bg-m3-on-surface/10 disabled:pointer-events-none disabled:border-m3-on-surface/12 disabled:text-m3-on-surface/38 [&_[data-icon]]:text-m3-primary disabled:[&_[data-icon]]:text-m3-on-surface/38"

type ActionChipProps = ButtonPrimitive.Props & { elevated?: boolean }

function AssistChip({
  className,
  elevated = false,
  type = "button",
  ...props
}: ActionChipProps) {
  return (
    <ButtonPrimitive
      data-slot="assist-chip"
      data-elevated={elevated || undefined}
      type={type}
      className={cn(
        badgeVariants({ variant: "outline" }),
        actionChipClassName,
        // The kit's assist chip label is On Surface (filter / suggestion stay
        // On Surface Variant).
        "text-m3-on-surface",
        elevated && elevatedChipClassName,
        className
      )}
      {...props}
    />
  )
}

function SuggestionChip({
  className,
  elevated = false,
  type = "button",
  ...props
}: ActionChipProps) {
  return (
    <ButtonPrimitive
      data-slot="suggestion-chip"
      data-elevated={elevated || undefined}
      type={type}
      className={cn(
        badgeVariants({ variant: "outline" }),
        actionChipClassName,
        elevated && elevatedChipClassName,
        className
      )}
      {...props}
    />
  )
}

type FilterChipProps<Value extends string = string> =
  TogglePrimitive.Props<Value> & {
    elevated?: boolean
    selectedIcon?: React.ReactNode
  }

function FilterChip<Value extends string>({
  children,
  className,
  elevated = false,
  selectedIcon = <Check />,
  ...props
}: FilterChipProps<Value>) {
  return (
    <TogglePrimitive
      data-slot="filter-chip"
      data-elevated={elevated || undefined}
      className={cn(
        badgeVariants({ variant: "outline" }),
        elevated && elevatedChipClassName,
        "group/filter-chip relative isolate cursor-pointer select-none outline-none after:pointer-events-none after:absolute after:-inset-px after:-z-10 after:rounded-[inherit] after:bg-current after:opacity-0 after:transition-opacity after:duration-(--m3-spring-effects-fast-duration) after:ease-(--m3-spring-effects-fast) hover:not-disabled:after:opacity-8 focus-visible:after:opacity-10 active:not-disabled:after:opacity-10 data-[pressed]:border-transparent data-[pressed]:bg-m3-secondary-container data-[pressed]:text-m3-on-secondary-container disabled:pointer-events-none disabled:border-m3-on-surface/12 disabled:text-m3-on-surface/38",
        selectedIcon && "data-[pressed]:pl-2",
        className
      )}
      {...props}
    >
      {selectedIcon && (
        <span
          aria-hidden="true"
          data-slot="filter-chip-selected-icon"
          className="hidden size-4.5 shrink-0 items-center justify-center group-data-[pressed]/filter-chip:flex [&>svg]:size-4.5"
        >
          {selectedIcon}
        </span>
      )}
      {children}
    </TogglePrimitive>
  )
}

type InputChipProps = Omit<
  React.ComponentProps<typeof Badge>,
  "aria-disabled" | "render" | "variant"
> &
  {
    disabled?: boolean
    /** Kit `Selected=True`: Secondary Container fill, no outline. */
    selected?: boolean
  } & (
    | {
        onRemove: React.MouseEventHandler<HTMLButtonElement>
        removeLabel: string
      }
    | {
        onRemove?: never
        removeLabel?: never
      }
  )

function InputChip({
  children,
  className,
  disabled = false,
  onRemove,
  removeLabel,
  selected = false,
  ...props
}: InputChipProps) {
  return (
    <Badge
      {...props}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      data-selected={selected || undefined}
      data-slot="input-chip"
      variant="outline"
      className={cn(
        // Kit: no container fill, 1dp outline-variant stroke, 12dp leading
        // inset for a label-only chip.
        "pl-3 text-m3-on-surface-variant data-disabled:border-m3-on-surface/12 data-disabled:text-m3-on-surface/38 data-disabled:[&_[data-icon]]:text-m3-on-surface/38",
        selected && "border-transparent bg-m3-secondary-container text-m3-on-secondary-container",
        className
      )}
    >
      {children}
      {removeLabel && (
        <ButtonPrimitive
          aria-label={removeLabel}
          data-slot="input-chip-remove"
          disabled={disabled}
          type="button"
          className="-my-1 -mr-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-m3-full text-m3-on-surface-variant outline-none hover:bg-m3-on-surface/8 focus-visible:bg-m3-on-surface/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-m3-secondary active:bg-m3-on-surface/10 disabled:pointer-events-none [&>svg]:size-4.5"
          onClick={onRemove}
        >
          <X aria-hidden="true" data-icon="inline-end" />
        </ButtonPrimitive>
      )}
    </Badge>
  )
}

/**
 * Material calls this 32dp component a chip. `Badge` is retained as a
 * compatibility name because it is the corresponding shadcn component API.
 */
const Chip = Badge
const chipVariants = badgeVariants

export {
  AssistChip,
  Chip,
  FilterChip,
  InputChip,
  SuggestionChip,
  chipVariants,
  type ActionChipProps,
  type FilterChipProps,
  type InputChipProps,
}
