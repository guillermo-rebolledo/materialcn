import { NavigationBar, NavigationBarItem } from "../../index"

function NavigationBarTypeChecks() {
  return (
    <>
      <NavigationBar value="home" onValueChange={() => undefined}>
        <NavigationBarItem value="home" label="Home" icon="H" href="/" />
      </NavigationBar>
      {/* @ts-expect-error NavigationBar selection is controlled. */}
      <NavigationBar value="home" />
    </>
  )
}

void NavigationBarTypeChecks
