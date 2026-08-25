import { createContext, useContext } from "react"

type FABMenuColor = "primary" | "secondary" | "tertiary"

type FABMenuContextValue = {
  close: () => void
  color: FABMenuColor
  focusTrigger: () => void
  open: boolean
  setTriggerNode: (node: HTMLButtonElement | null) => void
  toggle: () => void
}

const FABMenuContext = createContext<FABMenuContextValue | null>(null)

function useFABMenu() {
  const context = useContext(FABMenuContext)
  if (!context) throw new Error("FABMenu components must be used within FABMenu")
  return context
}

export { FABMenuContext, useFABMenu, type FABMenuColor }
