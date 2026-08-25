import { ExtendedFAB, FAB } from "../../index"

function FABTypeChecks() {
  return (
    <>
      <FAB aria-label="Add">+</FAB>
      <FAB aria-labelledby="fab-label">+</FAB>
      <ExtendedFAB label="Create">+</ExtendedFAB>
      {/* @ts-expect-error Icon-only FAB requires an accessible name. */}
      <FAB>+</FAB>
      {/* @ts-expect-error Extended FAB requires a readable label. */}
      <ExtendedFAB>+</ExtendedFAB>
    </>
  )
}

void FABTypeChecks
