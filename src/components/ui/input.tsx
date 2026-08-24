import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/**
 * Material 3 outlined text field.
 *
 * 56dp tall with the extra-small radius. Focus is expressed by thickening the
 * outline — 1dp at rest, 3dp focused — rather than by adding a separate ring.
 * The extra weight is painted as an inset shadow so that growing the border
 * does not reflow the text inside.
 *
 * Filled fields (a tinted container with a bottom rule) are the other M3 style;
 * the outlined one is used here because it matches how shadcn composes Input
 * inside `Field` and `InputGroup`.
 */

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full min-w-0 rounded-m3-xs border border-m3-outline bg-transparent px-4 text-m3-body-lg text-m3-on-surface outline-none " +
          "transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) " +
          "placeholder:text-m3-on-surface-variant " +
          "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-m3-label-lg file:text-m3-on-surface " +
          "hover:not-disabled:border-m3-on-surface " +
          "focus-visible:border-m3-primary focus-visible:shadow-[inset_0_0_0_2px_var(--m3-primary)] " +
          "disabled:cursor-not-allowed disabled:border-m3-on-surface/12 disabled:text-m3-on-surface/38 " +
          "aria-invalid:border-m3-error aria-invalid:focus-visible:border-m3-error " +
          "aria-invalid:focus-visible:shadow-[inset_0_0_0_2px_var(--m3-error)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
