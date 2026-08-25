import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { useContext } from "react"

import { cn } from "@/lib/utils"
import { ButtonGroupContext } from "./button-group-context"
import { buttonVariants } from "./button-variants"

function Button({
  className,
  variant: variantProp,
  size: sizeProp,
  shape: shapeProp,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const groupDefaults = useContext(ButtonGroupContext)
  const variant = variantProp ?? groupDefaults.variant ?? "default"
  const size = sizeProp ?? groupDefaults.size ?? "default"
  const shape = shapeProp ?? groupDefaults.shape ?? "round"

  return (
    <ButtonPrimitive
      data-slot="button"
      data-shape={shape}
      data-size={size}
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
