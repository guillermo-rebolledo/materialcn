import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

type FABSize = "small" | "medium" | "large"
type FABColor = "surface" | "primary" | "secondary" | "tertiary"
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

const sizeStyles: Record<FABSize, string> = {
  small: "size-10 [&_svg:not([class*='size-'])]:size-6",
  medium: "size-14 [&_svg:not([class*='size-'])]:size-6",
  large: "size-24 [&_svg:not([class*='size-'])]:size-9",
}

const shapeStyles: Record<FABShape, Record<FABSize, string>> = {
  round: {
    small: "rounded-[20px] active:not-disabled:rounded-m3-sm",
    medium: "rounded-[28px] active:not-disabled:rounded-m3-md",
    large: "rounded-[48px] active:not-disabled:rounded-m3-lg",
  },
  square: {
    small: "rounded-m3-md active:not-disabled:rounded-m3-sm",
    medium: "rounded-m3-lg active:not-disabled:rounded-m3-md",
    large: "rounded-m3-xl active:not-disabled:rounded-m3-lg",
  },
}

const colorStyles: Record<FABColor, string> = {
  surface: "bg-m3-surface-container-high text-m3-primary",
  primary: "bg-m3-primary-container text-m3-on-primary-container",
  secondary: "bg-m3-secondary-container text-m3-on-secondary-container",
  tertiary: "bg-m3-tertiary-container text-m3-on-tertiary-container",
}

function FAB({
  className,
  color = "primary",
  shape = "square",
  size = "medium",
  ...props
}: FABProps) {
  return (
    <Button
      {...props}
      data-slot="fab"
      className={cn(
        "p-0 shadow-m3-2 hover:not-disabled:shadow-m3-3 disabled:bg-m3-on-surface/12 disabled:shadow-m3-0",
        "motion-reduce:transition-none",
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
  size?: "medium" | "large"
  children?: ReactNode
}

function ExtendedFAB({
  children,
  className,
  color = "primary",
  label,
  shape = "square",
  size = "medium",
  ...props
}: ExtendedFABProps) {
  return (
    <Button
      {...props}
      data-slot="extended-fab"
      className={cn(
        "shadow-m3-2 hover:not-disabled:shadow-m3-3 disabled:bg-m3-on-surface/12 disabled:shadow-m3-0 motion-reduce:transition-none",
        colorStyles[color],
        size === "medium"
          ? "h-14 gap-3 px-4 text-m3-label-lg [&_svg:not([class*='size-'])]:size-6"
          : "h-24 gap-4 px-7 text-m3-headline-sm [&_svg:not([class*='size-'])]:size-8",
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
