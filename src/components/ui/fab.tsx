import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

/**
 * Material 3 Expressive floating action button.
 *
 * Geometry comes from the kit's `FAB` / `Extended FAB` sets on the Buttons
 * page (the 40dp "small" FAB only survives on the deprecated internal canvas):
 *
 * | Size    | Box | Icon | Corner | Extended padding / gap / type   |
 * | ------- | --- | ---- | ------ | ------------------------------- |
 * | default | 56  | 24   | 16     | 16 / 8  / title-medium          |
 * | medium  | 80  | 28   | 20     | 26 / 12 / title-large (regular) |
 * | large   | 96  | 36   | 28     | 28 / 16 / headline-small        |
 *
 * Every color sits at elevation level 3 and rises to level 4 on hover. Unlike
 * the buttons, the kit's FAB keeps its corner radius while pressed, so the
 * active radius is written identically to cancel the inherited morph.
 */
type FABSize = "default" | "medium" | "large"
type FABColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "primary-container"
  | "secondary-container"
  | "tertiary-container"
type FABShape = "round" | "square"

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: never; "aria-labelledby": string }

type FABProps = Omit<
  ComponentProps<typeof Button>,
  "aria-label" | "aria-labelledby" | "shape" | "size" | "variant"
> &
  AccessibleName & {
    color?: FABColor
    shape?: FABShape
    size?: FABSize
  }

const baseStyles = [
  // `size="icon"` carries no padding classes, so nothing from the Button size
  // scale (notably `has-[>svg]:pl-*`) can survive tailwind-merge and push the
  // icon off-centre. `p-0` is belt-and-braces for consumer overrides.
  "p-0 shadow-m3-3 hover:not-disabled:shadow-m3-4",
  "disabled:bg-m3-on-surface/12 disabled:shadow-m3-0",
  "motion-reduce:transition-none",
]

const sizeStyles: Record<FABSize, string> = {
  default: "size-14 [&_svg:not([class*='size-'])]:size-6",
  medium: "size-20 [&_svg:not([class*='size-'])]:size-7",
  large: "size-24 [&_svg:not([class*='size-'])]:size-9",
}

const shapeStyles: Record<FABShape, Record<FABSize, string>> = {
  round: {
    default: "rounded-[28px] active:not-disabled:rounded-[28px]",
    medium: "rounded-[40px] active:not-disabled:rounded-[40px]",
    large: "rounded-[48px] active:not-disabled:rounded-[48px]",
  },
  square: {
    default: "rounded-m3-lg active:not-disabled:rounded-m3-lg",
    medium: "rounded-m3-lg-increased active:not-disabled:rounded-m3-lg-increased",
    large: "rounded-m3-xl active:not-disabled:rounded-m3-xl",
  },
}

const colorStyles: Record<FABColor, string> = {
  primary: "bg-m3-primary text-m3-on-primary",
  secondary: "bg-m3-secondary text-m3-on-secondary",
  tertiary: "bg-m3-tertiary text-m3-on-tertiary",
  "primary-container": "bg-m3-primary-container text-m3-on-primary-container",
  "secondary-container": "bg-m3-secondary-container text-m3-on-secondary-container",
  "tertiary-container": "bg-m3-tertiary-container text-m3-on-tertiary-container",
}

function FAB({
  className,
  color = "primary-container",
  shape = "square",
  size = "default",
  ...props
}: FABProps) {
  return (
    <Button
      {...props}
      size="icon"
      data-slot="fab"
      data-color={color}
      data-fab-size={size}
      className={cn(
        baseStyles,
        colorStyles[color],
        sizeStyles[size],
        shapeStyles[shape][size],
        className,
      )}
    />
  )
}

type ExtendedFABProps = Omit<
  ComponentProps<typeof Button>,
  "shape" | "size" | "variant"
> & {
  color?: FABColor
  label: string
  shape?: FABShape
  size?: FABSize
  children?: ReactNode
}

const extendedSizeStyles: Record<FABSize, string> = {
  default: "h-14 gap-2 px-4 has-[>svg]:pl-4 text-m3-title-md [&_svg:not([class*='size-'])]:size-6",
  medium:
    "h-20 gap-3 px-[26px] has-[>svg]:pl-[26px] text-m3-title-lg font-m3-regular [&_svg:not([class*='size-'])]:size-7",
  large:
    "h-24 gap-4 px-7 has-[>svg]:pl-7 text-m3-headline-sm font-m3-regular [&_svg:not([class*='size-'])]:size-9",
}

function ExtendedFAB({
  children,
  className,
  color = "primary-container",
  label,
  shape = "square",
  size = "default",
  ...props
}: ExtendedFABProps) {
  return (
    <Button
      {...props}
      size="lg"
      data-slot="extended-fab"
      data-color={color}
      data-fab-size={size}
      className={cn(
        "shadow-m3-3 hover:not-disabled:shadow-m3-4 disabled:bg-m3-on-surface/12 disabled:shadow-m3-0 motion-reduce:transition-none",
        colorStyles[color],
        extendedSizeStyles[size],
        shapeStyles[shape][size],
        className,
      )}
    >
      {children}
      <span>{label}</span>
    </Button>
  )
}

export {
  ExtendedFAB,
  FAB,
  type ExtendedFABProps,
  type FABColor,
  type FABProps,
  type FABShape,
  type FABSize,
}
