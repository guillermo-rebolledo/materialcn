import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type LoadingIndicatorSize = "inline" | "standalone"

const loadingIndicatorSizeClasses: Record<
  LoadingIndicatorSize,
  { root: string; shape: string }
> = {
  inline: { root: "size-6", shape: "size-[19px]" },
  standalone: { root: "size-12", shape: "size-[38px]" },
}

type LoadingIndicatorProps = Omit<
  ComponentProps<"span">,
  "children" | "role"
> & {
  /** Paints the animated shape on a Primary Container surface. */
  contained?: boolean
  /** Selects the kit's text-adjacent or independent loading geometry. */
  size?: LoadingIndicatorSize
}

/** A named, indeterminate Material Expressive waiting affordance. */
function LoadingIndicator({
  className,
  "aria-label": ariaLabel = "Loading",
  contained = false,
  size = "standalone",
  ...props
}: LoadingIndicatorProps) {
  const sizeClasses = loadingIndicatorSizeClasses[size]

  return (
    <span
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center",
        sizeClasses.root,
        contained && "rounded-m3-full bg-m3-primary-container",
        className,
      )}
      data-contained={contained ? "" : undefined}
      data-slot="loading-indicator"
      data-size={size}
      role="status"
      {...props}
    >
      <span
        className={cn(
          "m3-loading-indicator-shape",
          contained ? "bg-m3-on-primary-container" : "bg-primary",
          sizeClasses.shape,
        )}
        data-slot="loading-indicator-shape"
      />
    </span>
  )
}

export { LoadingIndicator }
export type { LoadingIndicatorProps, LoadingIndicatorSize }
