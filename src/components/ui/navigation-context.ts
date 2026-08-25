import { createContext, useContext } from "react"

type NavigationContextValue = {
  onValueChange: (value: string) => void
  value: string
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error("Navigation items must be used within a navigation container")
  return context
}

export { NavigationContext, useNavigation }
