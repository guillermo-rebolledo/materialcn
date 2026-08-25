import {
  SearchBarInput,
  SearchView,
  SearchViewBar,
  SearchViewContent,
  type SearchViewProps,
} from "../../index"

const controlledSearch: SearchViewProps = {
  open: true,
  onOpenChange: () => undefined,
  value: "Oaxaca",
  onValueChange: () => undefined,
}

function SearchViewTypeChecks() {
  return (
    <>
      <SearchView {...controlledSearch} presentation="docked">
        <SearchViewBar>
          <SearchBarInput aria-label="Search" />
        </SearchViewBar>
        <SearchViewContent state="results" />
      </SearchView>

      {/* @ts-expect-error SearchView requires a controlled open state. */}
      <SearchView value="" onValueChange={() => undefined} />

      {/* @ts-expect-error SearchView requires a controlled query. */}
      <SearchView open onOpenChange={() => undefined} />
    </>
  )
}

void SearchViewTypeChecks
