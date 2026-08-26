import type * as React from "react"

type Common = Omit<React.ComponentProps<"nav">, "onChange"> & {
  /** The current page, 1-based. */
  page: number
  onPageChange: (page: number) => void
  /**
   * How many pages to show either side of the current one. The rendered width
   * is `siblingCount * 2 + 5` slots whatever the total, so a range of 9 pages
   * and a range of 9,000 occupy the same space and nothing shifts as the user
   * moves through them.
   */
  siblingCount?: number
  /** Offer a choice of how many rows appear on a page. */
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
}

/** The total is known, so the range can be drawn. */
type Determinate = Common & {
  totalPages: number
  hasNextPage?: never
}

/**
 * The total is not known ahead of time — a cursor-paged API, a search that
 * counts lazily. There is no range to draw, so it falls back to previous and
 * next, and the caller says whether a next page exists.
 */
type Indeterminate = Common & {
  totalPages?: undefined
  hasNextPage: boolean
}

export type PaginatorProps = Determinate | Indeterminate
