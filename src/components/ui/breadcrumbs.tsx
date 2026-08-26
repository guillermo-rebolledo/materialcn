import { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import type { BreadcrumbEntry, BreadcrumbsProps } from "./breadcrumbs.types"

/**
 * The lower bound on how many steps are shown: the root and the current page.
 *
 * Collapsing past this would fold the current page into the menu — leaving the
 * user with a trail whose only visible entries are the root and an ellipsis,
 * which says where they came from and not where they are.
 */
const MINIMUM_VISIBLE = 2

/**
 * How many steps fit before the trail overflows, never fewer than the two ends.
 *
 * There is no CSS for "collapse the middle when it does not fit", so this
 * measures. It shrinks one step at a time and re-measures, which converges in a
 * few layout passes and — because it runs in a layout effect — before paint, so
 * the overflowing state is never shown.
 *
 * Widths are never cached. A cache would be faster and would go stale on a font
 * swap, a language change, or a type-scale step at a breakpoint, each of which
 * is exactly when the trail needs re-measuring.
 */
function useFittedCount(total: number) {
  const listRef = useRef<HTMLOListElement>(null)
  const [count, setCount] = useState(total)

  // A width change means everything might fit again, so measurement restarts
  // from the top rather than only ever collapsing further.
  const reset = useCallback(() => setCount(total), [total])

  // A changed trail restarts measurement during render rather than in an
  // effect: an effect would paint one frame of the old count against the new
  // items, which is a visible flicker precisely when the trail changes.
  const [measuredFor, setMeasuredFor] = useState(total)
  if (measuredFor !== total) {
    setMeasuredFor(total)
    setCount(total)
  }

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const observer = new ResizeObserver(reset)
    observer.observe(list)
    return () => observer.disconnect()
  }, [reset])

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    // The +1 absorbs sub-pixel rounding, which otherwise collapses a trail
    // that fits by a fraction of a pixel.
    if (list.scrollWidth > list.clientWidth + 1 && count > MINIMUM_VISIBLE) {
      setCount((current) => current - 1)
    }
  }, [count])

  return { count, listRef }
}

/**
 * Where the user is, and a way back to any ancestor.
 *
 * Driven by an array rather than composed from the parts, because the
 * collapsing has to know the whole trail: it decides which steps to hide, and
 * a component assembled child by child cannot be asked that. The parts remain
 * exported for a trail that needs something this shape cannot express.
 */
function Breadcrumbs({
  className,
  icon,
  items,
  separator,
  ...props
}: BreadcrumbsProps) {
  const { count, listRef } = useFittedCount(items.length)

  const collapsed = count < items.length && items.length > MINIMUM_VISIBLE
  // `count` counts the root, so the tail is one shorter. Floored at
  // MINIMUM_VISIBLE above, the tail is never empty — which is what keeps the
  // current page on screen no matter how narrow the container gets.
  const hidden = collapsed ? items.slice(1, items.length - (count - 1)) : []
  const tail = collapsed
    ? items.slice(items.length - (count - 1))
    : items.slice(1)

  const step = (entry: BreadcrumbEntry, isCurrent: boolean) => (
    <BreadcrumbItem key={`${entry.label}-${entry.href ?? "current"}`}>
      {isCurrent ? (
        <BreadcrumbPage>
          {icon}
          {entry.label}
        </BreadcrumbPage>
      ) : (
        <BreadcrumbLink
          href={entry.disabled ? undefined : entry.href}
          aria-disabled={entry.disabled || undefined}
        >
          {icon}
          {entry.label}
        </BreadcrumbLink>
      )}
    </BreadcrumbItem>
  )

  const divider = (key: string) => (
    <BreadcrumbSeparator key={key}>{separator}</BreadcrumbSeparator>
  )

  return (
    <Breadcrumb className={cn("min-w-0", className)} {...props}>
      <BreadcrumbList ref={listRef} className="overflow-hidden">
        {items.length > 0 && step(items[0], items.length === 1)}

        {collapsed && hidden.length > 0 && (
          <>
            {divider("sep-collapsed")}
            <BreadcrumbItem>
              <DropdownMenu>
                {/*
                  The hidden steps stay reachable — a collapse that dropped them
                  would remove navigation rather than fold it. The trigger is a
                  real button so it is tabbable and named.
                */}
                <DropdownMenuTrigger
                  data-slot="breadcrumb-ellipsis-trigger"
                  className="rounded-m3-xs hover:text-m3-on-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-m3-secondary"
                  aria-label={`Show ${hidden.length} hidden steps`}
                >
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hidden.map((entry) => (
                    <DropdownMenuItem
                      key={entry.label}
                      disabled={entry.disabled}
                      render={<a href={entry.href} />}
                    >
                      {entry.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {/*
          A Fragment, not a wrapper element: an `ol` may only contain `li`, and
          a `div` here would take the list apart for a screen reader — which is
          the structure the landmark exists to convey.
        */}
        {tail.map((entry, index) => (
          <Fragment key={`${entry.label}-${index}`}>
            {divider(`sep-${entry.label}-${index}`)}
            {step(entry, index === tail.length - 1)}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { Breadcrumbs }
export type { BreadcrumbEntry, BreadcrumbsProps }
