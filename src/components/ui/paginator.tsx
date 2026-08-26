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
import { ELIDED, buildRange } from "./paginator-utils"
import type { PaginatorProps } from "./paginator.types"

/**
 * Previous and next differ only in direction, so they are one control rather
 * than a mirrored pair — the labels are the part that has to stay in step, and
 * two copies is how they stop being.
 *
 * The word is hidden below `medium`: on a phone the chevron alone is the
 * affordance, and the accessible name carries the rest.
 */
function Step({
  direction,
  enabled,
  label,
  onActivate,
}: {
  direction: "previous" | "next"
  enabled: boolean
  label: string
  onActivate: () => void
}) {
  const previous = direction === "previous"
  const Chevron = previous ? ChevronLeftIcon : ChevronRightIcon
  const word = previous ? "Previous" : "Next"

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={label}
      disabled={!enabled}
      onClick={onActivate}
    >
      {previous && <Chevron data-icon="inline-start" />}
      <span className="m3-medium:inline hidden">{word}</span>
      {!previous && <Chevron data-icon="inline-end" />}
    </Button>
  )
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
          <Step
            direction="previous"
            label={`Go to previous page${of}`}
            enabled={canGoBack}
            onActivate={() => onPageChange(page - 1)}
          />
        </PaginationItem>

        {!indeterminate &&
          buildRange(page, totalPages, siblingCount).map((slot, index) =>
            slot === ELIDED ? (
              <PaginationItem key={`elided-${index}`}>
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
          <Step
            direction="next"
            label={`Go to next page${of}`}
            enabled={canGoForward}
            onActivate={() => onPageChange(page + 1)}
          />
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

export { Paginator }
export type { PaginatorProps }
