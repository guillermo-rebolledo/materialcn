import { createContext } from "react"
import type { VariantProps } from "class-variance-authority"

import type { buttonVariants } from "./button-variants"

type ButtonGroupButtonDefaults = Pick<
  VariantProps<typeof buttonVariants>,
  "shape" | "size" | "variant"
>

const ButtonGroupContext = createContext<ButtonGroupButtonDefaults>({})

export { ButtonGroupContext }
export type { ButtonGroupButtonDefaults }
