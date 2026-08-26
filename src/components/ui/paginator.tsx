import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "./pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import type { PaginatorProps } from "./paginator.types"

const GAP = "gap" as const

/**
 * The slots to draw: page numbers, with `GAP` where a run is elided.
 *
 * The length is always `siblingCount * 2 + 5` once the total exceeds it —
 * first, last, current, two siblings either side, two gaps — so a range of 9
 * pages and a range of 9,000 occupy the same width and no control moves under
 * the pointer as the user steps through.
 */
function buildRange(page: number, totalPages: number, siblingCount: number) {
  const slots = siblingCount * 2 + 5
  if (totalPages <= slots)
    return Array.from({ length: totalPages }, (_, i) => i + 1)

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, totalPages)
  const showLeftGap = left > 2
  const showRightGap = right < totalPages - 1

  // Both gaps present is the steady state; when the window is near an end, the
  // run that would have been elided is shown instead, which keeps the count of
  // slots identical rather than letting the row shrink at the extremes.
  if (!showLeftGap && showRightGap) {
    const run = slots - 2
    return [...Array.from({ length: run }, (_, i) => i + 1), GAP, totalPages]
  }
  if (showLeftGap && !showRightGap) {
    const run = slots - 2
    return [
      1,
      GAP,
      ...Array.from({ length: run }, (_, i) => totalPages - run + 1 + i),
    ]
  }
  return [
    1,
    GAP,
    ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
    GAP,
    totalPages,
  ]
}

/**
 * Navigation across a range of pages.
 *
 * The current page stays a `button` rather than becoming a `span`: it has to be
 * non-interactive *and* it has to announce "current page" when a keyboard user
 * arrives on it, and a span would deliver the first at the cost of the second.
 * `aria-disabled` with no handler is what gives both.
 *
 * Every control carries a full label — "Go to page 4 of 20", not "4". A bare
 * number read out of context is not navigation, it is a number.
 */
function Paginator({
  className,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  pageSizeOptions,
  siblingCount = 1,
  totalPages,
  ...props
}: PaginatorProps) {
  const indeterminate = totalPages === undefined
  const of = indeterminate ? "" : ` of ${totalPages}`
  const canGoBack = page > 1
  const canGoForward = indeterminate ? hasNextPage : page < totalPages

  return (
    <Pagination
      className={cn("flex-wrap items-center gap-m3-md", className)}
      {...props}
    >
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Go to previous page${of}`}
            disabled={!canGoBack}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeftIcon data-icon="inline-start" />
            <span className="m3-medium:inline hidden">Previous</span>
          </Button>
        </PaginationItem>

        {!indeterminate &&
          buildRange(page, totalPages, siblingCount).map((slot, index) =>
            slot === GAP ? (
              <PaginationItem key={`gap-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={slot}>
                <Button
                  variant={slot === page ? "tonal" : "ghost"}
                  size="sm"
                  className="min-w-10 px-m3-sm"
                  aria-current={slot === page ? "page" : undefined}
                  aria-disabled={slot === page || undefined}
                  aria-label={
                    slot === page
                      ? `Page ${slot}${of}, current page`
                      : `Go to page ${slot}${of}`
                  }
                  onClick={
                    slot === page ? undefined : () => onPageChange(slot)
                  }
                >
                  {slot}
                </Button>
              </PaginationItem>
            )
          )}

        {indeterminate && (
          <PaginationItem>
            <span
              data-slot="pagination-position"
              className="text-m3-body-md text-m3-on-surface-variant px-m3-sm"
            >
              Page {page}
            </span>
          </PaginationItem>
        )}

        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Go to next page${of}`}
            disabled={!canGoForward}
            onClick={() => onPageChange(page + 1)}
          >
            <span className="m3-medium:inline hidden">Next</span>
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </PaginationItem>
      </PaginationContent>

      {pageSizeOptions && pageSize !== undefined && (
        <div className="flex items-center gap-m3-sm">
          <span
            id="paginator-page-size"
            className="text-m3-body-md text-m3-on-surface-variant"
          >
            Per page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
          >
            <SelectTrigger
              aria-labelledby="paginator-page-size"
              className="w-24"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </Pagination>
  )
}

export { Paginator, buildRange }
export type { PaginatorProps }
