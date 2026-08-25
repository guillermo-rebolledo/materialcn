import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"

/**
 * Material 3 checkbox: an 18dp box with a 2dp outline that fills with the
 * primary color when checked. The 48dp touch target is added with a
 * pseudo-element so it does not affect layout.
 */
import { CheckIcon, MinusIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Kit: 18dp box, 2dp corner (not the 4dp xs step), 2dp stroke.
        "group/checkbox peer relative flex size-4.5 shrink-0 cursor-pointer items-center justify-center rounded-[2px] border-2 border-m3-on-surface-variant outline-none " +
          "transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) " +
          // Widen the hit target to M3's 48dp touch target.
          "after:absolute after:-inset-[15px] " +
          // 40dp circular state layer (8 / 10 / 10 %) in the content colour.
          "before:pointer-events-none before:absolute before:-inset-[11px] before:rounded-full before:bg-m3-on-surface before:opacity-0 " +
          "before:transition-opacity before:duration-(--m3-spring-effects-fast-duration) before:ease-(--m3-spring-effects-fast) " +
          "hover:not-disabled:before:opacity-8 focus-visible:before:opacity-10 active:not-disabled:before:opacity-10 " +
          "data-checked:before:bg-m3-primary data-indeterminate:before:bg-m3-primary aria-invalid:before:bg-m3-error " +
          // Unselected stroke darkens to On Surface while interacting.
          "data-unchecked:hover:not-disabled:border-m3-on-surface data-unchecked:focus-visible:border-m3-on-surface data-unchecked:active:not-disabled:border-m3-on-surface " +
          // Focus indicator wraps the 40dp state layer.
          "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-[11px] " +
          "disabled:cursor-not-allowed data-disabled:cursor-not-allowed disabled:border-m3-on-surface/38 data-disabled:border-m3-on-surface/38 " +
          "aria-invalid:border-m3-error " +
          "data-checked:border-m3-primary data-checked:bg-m3-primary data-checked:text-m3-on-primary " +
          "data-indeterminate:border-m3-primary data-indeterminate:bg-m3-primary data-indeterminate:text-m3-on-primary " +
          "data-checked:disabled:border-transparent data-checked:data-disabled:border-transparent data-checked:disabled:bg-m3-on-surface/38 data-checked:data-disabled:bg-m3-on-surface/38 " +
          "data-indeterminate:disabled:border-transparent data-indeterminate:data-disabled:border-transparent data-indeterminate:disabled:bg-m3-on-surface/38 data-indeterminate:data-disabled:bg-m3-on-surface/38 " +
          "aria-invalid:data-checked:border-m3-error aria-invalid:data-checked:bg-m3-error aria-invalid:data-checked:text-m3-on-error " +
          "aria-invalid:data-indeterminate:border-m3-error aria-invalid:data-indeterminate:bg-m3-error aria-invalid:data-indeterminate:text-m3-on-error",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current [&>svg]:size-4 [&>svg]:stroke-3"
      >
        <CheckIcon className="group-data-indeterminate/checkbox:hidden" />
        <MinusIcon className="hidden group-data-indeterminate/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
