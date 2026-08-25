import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "./toggle-variants"

function Toggle({
  className,
  variant = "default",
  size = "default",
  shape = "round",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-shape={shape}
      className={cn(toggleVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
