import {
  SearchBar,
  SearchBarInput,
  type SearchBarProps,
} from "../../index"

const controlledProps: SearchBarProps = {
  value: "Oaxaca",
  onValueChange: () => undefined,
}

const uncontrolledProps: SearchBarProps = {
  defaultValue: "Mérida",
}

function SearchBarTypeChecks() {
  return (
    <>
      <SearchBar {...controlledProps}>
        <SearchBarInput aria-label="Controlled search" />
      </SearchBar>

      <SearchBar {...uncontrolledProps}>
        <SearchBarInput aria-labelledby="search-heading" />
      </SearchBar>

      <SearchBar>
        {/* @ts-expect-error SearchBarInput requires an accessible name. */}
        <SearchBarInput />
      </SearchBar>

      {/* @ts-expect-error A controlled SearchBar requires onValueChange. */}
      <SearchBar value="Puebla" />

      {/* @ts-expect-error Controlled and uncontrolled initial values cannot be combined. */}
      <SearchBar
        defaultValue="Puebla"
        value="Oaxaca"
        onValueChange={() => undefined}
      />
    </>
  )
}

void SearchBarTypeChecks
