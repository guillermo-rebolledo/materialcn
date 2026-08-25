import {
  DropdownMenu,
  SplitButton,
  SplitButtonAction,
  SplitButtonTrigger,
} from "../../index"

function SplitButtonTypeChecks() {
  return (
    <>
      {/* @ts-expect-error SplitButton requires an accessible group name. */}
      <SplitButton>
        <SplitButtonAction>Create</SplitButtonAction>
      </SplitButton>

      <SplitButton aria-label="Create actions" variant="tonal">
        <SplitButtonAction>Create</SplitButtonAction>
        <DropdownMenu>
          {/* @ts-expect-error The menu segment requires an accessible name. */}
          <SplitButtonTrigger />
        </DropdownMenu>
      </SplitButton>

      <h2 id="export-actions">Export actions</h2>
      <SplitButton aria-labelledby="export-actions" disabled size="2xl">
        <SplitButtonAction>Export</SplitButtonAction>
        <DropdownMenu>
          <SplitButtonTrigger aria-label="More export actions" />
        </DropdownMenu>
      </SplitButton>

      {/* @ts-expect-error The kit supports four SplitButton color variants. */}
      <SplitButton aria-label="Delete actions" variant="destructive">
        <SplitButtonAction>Delete</SplitButtonAction>
      </SplitButton>
    </>
  )
}

void SplitButtonTypeChecks
