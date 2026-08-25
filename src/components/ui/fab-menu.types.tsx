import { FABMenu, FABMenuContent, FABMenuTrigger } from "../../index"

function FABMenuTypeChecks() {
  return (
    <>
      <FABMenu open onOpenChange={() => undefined} placement="bottom-end">
        <FABMenuTrigger aria-label="Actions">+</FABMenuTrigger>
        <FABMenuContent />
      </FABMenu>
      {/* @ts-expect-error FAB menu trigger inherits FAB accessible-name requirements. */}
      <FABMenuTrigger>+</FABMenuTrigger>
    </>
  )
}

void FABMenuTypeChecks
