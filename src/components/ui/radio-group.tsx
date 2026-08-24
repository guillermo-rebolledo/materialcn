"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-5 shrink-0 cursor-pointer items-center justify-center rounded-m3-full border-2 border-m3-on-surface-variant outline-none " +
          "transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast) " +
          "after:absolute after:-inset-x-3.5 after:-inset-y-3.5 " +
          "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-2 " +
          "disabled:cursor-not-allowed disabled:border-m3-on-surface/38 " +
          "aria-invalid:border-m3-error " +
          "data-checked:border-m3-primary data-checked:text-m3-primary " +
          "data-checked:disabled:border-m3-on-surface/38 data-checked:disabled:text-m3-on-surface/38",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        {/* M3 draws a 10dp dot in the *border* color, not a knocked-out hole. */}
        <span
          className={cn(
            "size-2.5 rounded-m3-full bg-current",
            "transition-transform duration-(--m3-spring-spatial-fast-duration) ease-(--m3-spring-spatial-fast)",
            "group-data-checked/radio-group-item:scale-100 scale-0",
          )}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
