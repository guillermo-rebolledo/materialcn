import type * as React from "react"

/** One step in the trail. The last entry is the current page. */
export type BreadcrumbEntry = {
  /** What the step is called. */
  label: string
  /** Where it goes. Absent on the current page, which is not a destination. */
  href?: string
  /** Prevents navigation while keeping the step in the trail. */
  disabled?: boolean
}

export type BreadcrumbsProps = Omit<React.ComponentProps<"nav">, "children"> & {
  items: BreadcrumbEntry[]
  /**
   * Drawn between every step. Defaults to a chevron.
   */
  separator?: React.ReactNode
  /**
   * Drawn before every step's label.
   *
   * Deliberately one icon for the whole trail rather than one per entry: a
   * trail with icons on some steps and not others reads as though the icons
   * mean something, and they do not — the trail is a path, and every segment of
   * it is the same kind of thing.
   */
  icon?: React.ReactNode
}
