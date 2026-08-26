import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { linkVariants } from "./link-variants"

type LinkProps = useRender.ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    /** Where it goes. Its presence is what makes this a link rather than a button. */
    href?: string
    /** Visually clear and genuinely non-interactive — see the note below. */
    disabled?: boolean
  }

/**
 * A link inside a paragraph.
 *
 * The role comes from the props, not from a prop that names it: something with
 * a destination announces as a link, something with only an action announces as
 * a button. Getting that backwards is the most common accessibility defect in a
 * component like this one — a "link" that runs a callback tells a screen-reader
 * user that a new page is coming, and nothing arrives.
 *
 * A disabled link renders as a `span`. Removing `href` from an anchor would
 * leave it in the tab order with no role; `aria-disabled` alone would leave it
 * still activating. The span carries `role="link"` so the announcement stays
 * accurate about what it *would* be.
 *
 * An icon-only link is not a supported shape. Without a label there is nothing
 * for the underline to sit under and nothing to click but the glyph — that is
 * an icon button, which is what `Button` is for.
 */
function Link({
  className,
  color,
  disabled = false,
  href,
  render,
  ...props
}: LinkProps) {
  const isAction = href === undefined

  return useRender({
    defaultTagName: disabled ? "span" : isAction ? "button" : "a",
    props: mergeProps<"a">(
      {
        className: cn(linkVariants({ color }), className),
        ...(disabled
          ? { "aria-disabled": true, role: isAction ? "button" : "link" }
          : { href }),
        // A `button` defaults to type="submit", which turns an in-form link
        // into an accidental submit.
        ...(isAction && !disabled ? { type: "button" } : {}),
      } as useRender.ElementProps<"a">,
      props
    ),
    render,
    state: {
      slot: "link",
      color: color ?? "inherit",
      disabled,
    },
  })
}

export { Link, linkVariants }
export type { LinkProps }
