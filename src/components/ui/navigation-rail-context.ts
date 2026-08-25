import { createContext, useContext } from "react"

type NavigationRailContextValue = {
  expanded: boolean
  onExpandedChange?: (expanded: boolean) => void
}

const NavigationRailContext = createContext<NavigationRailContextValue>({ expanded: false })
const useNavigationRail = () => useContext(NavigationRailContext)

export { NavigationRailContext, useNavigationRail }
