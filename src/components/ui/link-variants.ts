/**
 * Variant definitions live beside the component rather than inside it — see
 * badge-variants.ts for why (React Fast Refresh boundaries).
 */

import { cva } from "class-variance-authority"

/**
 * A link is `display: inline`, and that is load-bearing rather than incidental.
 *
 * The obvious way to align an optional icon is `inline-flex`, which turns the
 * link into a single unbreakable box: set one mid-paragraph and the whole link
 * jumps to the next line, leaving a ragged hole above it. Staying inline lets
 * the link fragment across lines the way the text around it does, and the rule
 * below aligns any nested `Icon` with `vertical-align` instead — which costs
 * nothing and needs no prop, since an icon in a link is just a child.
 *
 * `decoration-from-font` takes the underline position and thickness from the
 * font's own metrics rather than the browser's guess, and `[text-underline-position:from-font]`
 * keeps descenders from being struck through.
 */
export const linkVariants = cva(
  [
    "inline cursor-pointer rounded-m3-xs underline decoration-from-font [text-underline-position:from-font]",
    // An optional icon beside the label, aligned optically to the text rather
    // than sitting on the baseline. `vertical-align` and not flex, because the
    // link has to stay inline to wrap.
    "[&>[data-slot=icon]]:mx-[0.15em] [&>[data-slot=icon]]:align-[-0.15em]",
    "underline-offset-2 transition-colors duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary focus-visible:no-underline",
    // `aria-disabled` rather than `:disabled`, because the anchor case has no
    // disabled attribute to hang it on and the two must look identical.
    "aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:text-m3-on-surface/38 aria-disabled:no-underline",
  ].join(" "),
  {
    variants: {
      /**
       * `inherit` is the default and the one that matters: a link in a
       * paragraph should be the paragraph's font, size, weight, and colour,
       * distinguished by the underline alone. The named roles are for the
       * cases that genuinely need to stand apart — a standalone call to
       * action, a link inside an error message.
       */
      color: {
        inherit: "text-inherit hover:text-m3-primary",
        primary: "text-m3-primary hover:text-m3-primary/80",
        error: "text-m3-error hover:text-m3-error/80",
      },
    },
    defaultVariants: {
      color: "inherit",
    },
  }
)
