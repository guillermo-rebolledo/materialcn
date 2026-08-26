import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { skeletonVariants } from "./skeleton-variants"
import type { SkeletonTextRole } from "./skeleton.types"

type SkeletonProps = React.ComponentProps<"div"> &
  VariantProps<typeof skeletonVariants> & {
    /**
     * Size the skeleton to a line of a given type role, so a stand-in for
     * body-large text is exactly as tall as the text will be. Taking the
     * height from the role's own line box is what keeps the two from drifting
     * when the type scale changes — including when it steps down on a narrow
     * window.
     */
    text?: SkeletonTextRole
  }

function Skeleton({ className, shape, style, text, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-shape={shape ?? "rounded"}
      // A skeleton is a placeholder for content that is not there yet; there is
      // nothing for a screen reader to announce, and announcing "loading" once
      // per placeholder would be worse than silence. The region that owns the
      // load is where `aria-busy` belongs.
      aria-hidden
      className={cn(skeletonVariants({ shape }), text && "w-full", className)}
      style={text ? { height: `var(--m3-${text}-line)`, ...style } : style}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
export type { SkeletonProps }
