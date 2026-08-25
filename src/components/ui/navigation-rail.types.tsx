import { NavigationRail, NavigationRailDestinations, NavigationRailExpansionToggle, NavigationRailItem } from "../../index"

function NavigationRailTypeChecks() {
  return (
    <NavigationRail value="home" onValueChange={() => undefined} expanded onExpandedChange={() => undefined}>
      <NavigationRailExpansionToggle aria-label="Collapse">C</NavigationRailExpansionToggle>
      <NavigationRailDestinations>
        <NavigationRailItem value="home" label="Home" icon="H" href="/" />
      </NavigationRailDestinations>
    </NavigationRail>
  )
}

void NavigationRailTypeChecks
