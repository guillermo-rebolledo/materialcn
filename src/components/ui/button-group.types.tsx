import { Button } from "./button"
import { ButtonGroup } from "./button-group"

function AccessibleNameTypeChecks() {
  return (
    <>
      {/* @ts-expect-error ButtonGroup requires an accessible name. */}
      <ButtonGroup>
        <Button>Unlabeled action</Button>
      </ButtonGroup>

      <h2 id="labeled-actions">Labeled actions</h2>
      <ButtonGroup aria-labelledby="labeled-actions">
        <Button>Labeled action</Button>
      </ButtonGroup>
    </>
  )
}

void AccessibleNameTypeChecks
