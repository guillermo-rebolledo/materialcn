import { createContext, useContext } from "react"

type SearchBarContextValue = {
  clear: () => void
  disabled: boolean
  invalid: boolean
  readOnly: boolean
  setInputNode: (node: HTMLInputElement | null) => void
  setValue: (value: string) => void
  value: string
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

function useSearchBar() {
  const context = useContext(SearchBarContext)
  if (!context) {
    throw new Error("SearchBar components must be used within <SearchBar />")
  }
  return context
}

export { SearchBarContext, useSearchBar }
export type { SearchBarContextValue }
