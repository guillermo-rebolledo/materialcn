import { createContext, useContext } from "react"

type SearchViewContextValue = {
  close: () => void
  onSelect?: (value: string) => void
  setValue: (value: string) => void
  value: string
}

const SearchViewContext = createContext<SearchViewContextValue | null>(null)

function useSearchView() {
  const context = useContext(SearchViewContext)
  if (!context) {
    throw new Error("SearchView components must be used within SearchView")
  }
  return context
}

type SearchViewState =
  | "recent"
  | "suggestions"
  | "loading"
  | "results"
  | "empty"
  | "error"

const SearchViewContentContext = createContext<SearchViewState>("results")

export {
  SearchViewContentContext,
  SearchViewContext,
  useSearchView,
  type SearchViewState,
}
