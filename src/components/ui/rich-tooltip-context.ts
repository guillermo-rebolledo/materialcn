import { createContext, useContext } from "react"

type RichTooltipContextValue = {
  cancelClose: () => void
  closeSoon: () => void
  noteFocus: () => void
  openNow: () => void
  setTriggerNode: (node: HTMLButtonElement | null) => void
}

const RichTooltipContext = createContext<RichTooltipContextValue | null>(null)

function useRichTooltip() {
  const context = useContext(RichTooltipContext)
  if (!context) throw new Error("RichTooltip components must be used within RichTooltip")
  return context
}

export { RichTooltipContext, useRichTooltip }
