import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { iconVariants } from "./icon-variants"

type IconProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof iconVariants> & {
    children: React.ReactNode
    /**
     * The name announced by assistive technology.
     *
     * Omit it — the common case — and the icon is hidden entirely, which is
     * correct whenever the meaning is already carried by adjacent text. Supply
     * it only when the icon is the *only* thing conveying something, and then
     * name the meaning ("Delete") rather than the picture ("Trash can").
     */
    label?: string
  }

/**
 * Sizes an icon and lets it inherit its colour.
 *
 * Deliberately not interactive: it renders a `span` and takes no press
 * handling. An icon that does something is an icon inside a `Button` or a
 * `Link`, which is where the target size, the focus ring, and the role come
 * from — an icon that grew its own would give you two competing versions of
 * each.
 */
function Icon({ children, className, label, size, ...props }: IconProps) {
  return (
    <span
      data-slot="icon"
      data-size={size ?? "md"}
      // Decorative by default. The alternative — leaving it exposed with no
      // name — is the case that actually hurts: a screen reader announces
      // "image" or the raw file name beside a label that already said it.
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(iconVariants({ size }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { Icon, iconVariants }
export type { IconProps }
