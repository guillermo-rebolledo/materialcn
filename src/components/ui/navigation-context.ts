import { createContext, useContext } from "react"

/**
 * How a destination lays out its icon and label.
 *
 * - `stacked` — the kit's vertical nav item: a 56×32 indicator pill over a
 *   label-medium caption (or a 56×56 circle when the label is hidden).
 * - `inline`  — the kit's horizontal nav item: icon and caption together
 *   inside a 40dp pill.
 * - `row`     — the expanded navigation rail item: a full-width 56dp pill with
 *   a label-large caption.
 */
type NavigationItemLayout = "stacked" | "inline" | "row"

type NavigationContextValue = {
  focusValue?: string
  itemLayout?: NavigationItemLayout
  onValueChange: (value: string) => void
  setFocusValue?: (value: string) => void
  value: string
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error("Navigation items must be used within a navigation container")
  return context
}

export { NavigationContext, useNavigation, type NavigationItemLayout }
