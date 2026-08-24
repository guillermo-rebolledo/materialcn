import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-m3-sm bg-m3-surface-container-highest", className)}
      {...props}
    />
  )
}

export { Skeleton }
