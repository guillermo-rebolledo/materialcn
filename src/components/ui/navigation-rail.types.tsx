import { NavigationRail, NavigationRailDestinations, NavigationRailItem } from "../../index"

function NavigationRailTypeChecks() {
  return (
    <NavigationRail value="home" onValueChange={() => undefined}>
      <NavigationRailDestinations>
        <NavigationRailItem value="home" label="Home" icon="H" href="/" />
      </NavigationRailDestinations>
    </NavigationRail>
  )
}

void NavigationRailTypeChecks
