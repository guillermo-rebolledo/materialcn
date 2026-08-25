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
          "after:absolute after:-inset-3.5 " +
          // 40dp circular state layer (8 / 10 / 10 %) in the content colour.
          "before:pointer-events-none before:absolute before:-inset-2.5 before:rounded-full before:bg-m3-on-surface before:opacity-0 " +
          "before:transition-opacity before:duration-(--m3-spring-effects-fast-duration) before:ease-(--m3-spring-effects-fast) " +
          "hover:not-disabled:before:opacity-8 focus-visible:before:opacity-10 active:not-disabled:before:opacity-10 " +
          "data-checked:before:bg-m3-primary aria-invalid:before:bg-m3-error " +
          "data-unchecked:hover:not-disabled:border-m3-on-surface data-unchecked:focus-visible:border-m3-on-surface " +
          // Focus indicator wraps the 40dp state layer.
          "focus-visible:outline-m3-secondary focus-visible:outline-3 focus-visible:outline-offset-[10px] " +
          "disabled:cursor-not-allowed data-disabled:cursor-not-allowed disabled:border-m3-on-surface/38 data-disabled:border-m3-on-surface/38 " +
          "aria-invalid:border-m3-error " +
          "data-checked:border-m3-primary data-checked:text-m3-primary " +
          "data-checked:disabled:border-m3-on-surface/38 data-checked:data-disabled:border-m3-on-surface/38 data-checked:disabled:text-m3-on-surface/38 data-checked:data-disabled:text-m3-on-surface/38",
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
