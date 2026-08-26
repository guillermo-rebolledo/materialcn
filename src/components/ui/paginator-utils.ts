/**
 * Lives beside the component rather than inside it, for the reason
 * `calendar-utils.ts` does: a module is a React Fast Refresh boundary only when
 * every export is a component or keeps a stable identity across
 * re-evaluations. A plain function exported from the component file is a fresh
 * object each time the module runs, which demotes every edit to a full reload.
 */

/** An elided run of pages, rather than a page. */
export const ELIDED = "elided" as const

export type PageSlot = number | typeof ELIDED

/**
 * The slots to draw: page numbers, with `ELIDED` where a run is hidden.
 *
 * The length is always `siblingCount * 2 + 5` once the total exceeds it —
 * first, last, current, the siblings either side, and two elisions — so a range
 * of 9 pages and a range of 9,000 occupy the same width and no control moves
 * under the pointer as the user steps through.
 */
export function buildRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): PageSlot[] {
  const slots = siblingCount * 2 + 5
  if (totalPages <= slots)
    return Array.from({ length: totalPages }, (_, i) => i + 1)

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, totalPages)
  const elideLeft = left > 2
  const elideRight = right < totalPages - 1

  // Both elisions present is the steady state. When the window reaches an end,
  // the run that would have been elided is shown instead, which keeps the slot
  // count identical rather than letting the row shrink at the extremes.
  const run = slots - 2
  if (!elideLeft && elideRight) {
    return [...Array.from({ length: run }, (_, i) => i + 1), ELIDED, totalPages]
  }
  if (elideLeft && !elideRight) {
    return [
      1,
      ELIDED,
      ...Array.from({ length: run }, (_, i) => totalPages - run + 1 + i),
    ]
  }
  return [
    1,
    ELIDED,
    ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
    ELIDED,
    totalPages,
  ]
}
