import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"

/**
 * Material 3 checkbox: an 18dp box with a 2dp outline that fills with the
 * primary color when checked. The 48dp touch target is added with a
 * pseudo-element so it does not affect layout.
 */
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4.5 shrink-0 cursor-pointer items-center justify-center rounded-m3-xs border-2 border-m3-on-surface-variant outline-none " +
          "transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) " +
          // Widen the hit target to M3's 48dp touch target.
          "after:absolute after:-inset-x-3.5 after:-inset-y-3.5 " +
          "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-2 " +
          "disabled:cursor-not-allowed disabled:border-m3-on-surface/38 " +
          "aria-invalid:border-m3-error " +
          "data-checked:border-m3-primary data-checked:bg-m3-primary data-checked:text-m3-on-primary " +
          "data-checked:disabled:border-transparent data-checked:disabled:bg-m3-on-surface/38 " +
          "aria-invalid:data-checked:border-m3-error aria-invalid:data-checked:bg-m3-error aria-invalid:data-checked:text-m3-on-error",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current [&>svg]:size-4 [&>svg]:stroke-3"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
