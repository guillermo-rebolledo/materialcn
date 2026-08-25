# Material component backlog

Backlog derived from the local `Material 3 Design Kit (Community).fig`, the
current exports in `src/index.ts`, and the shadcn registry available to this
Base UI project. Last audited: 2026-08-24.

This document lists missing component APIs. It intentionally excludes
components that the repository already implements or that should remain simple
compositions of existing primitives.

## Definition of done

Every completed item should:

- Match the geometry, color roles, state layers, and motion in the Material 3
  design kit.
- Use an existing shadcn/Base UI primitive when one provides the required
  behavior.
- Use semantic tokens or existing `m3-` tokens rather than raw colors.
- Support keyboard interaction, focus-visible treatment, disabled states, and
  reduced motion where applicable.
- Be exported from `src/index.ts`.
- Include colocated Storybook stories for its important variants, states, and
  light/dark presentation.
- Pass `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`.

## P0 — Core gaps

### Notification badge

- [ ] Add the Material notification badge: dot, small numeric, and large
  numeric variants.
- [ ] Support placement over an icon without coupling the component to a
  particular navigation component.
- [ ] Define overflow behavior such as `99+`.
- [ ] Resolve naming with the existing `Badge`, which currently implements
  Material chip geometry. Prefer introducing `Chip` and preserving a
  compatibility path for current `Badge` consumers.

Foundation: custom styling; optionally compose with the existing Button,
Avatar, and future navigation components.

### Chip API

- [ ] Introduce a semantic `Chip` API around the existing chip visuals.
- [ ] Add assist, filter, input, and suggestion variants.
- [ ] Add selected, disabled, leading-icon, trailing-icon, and removable input
  states.
- [ ] Add a chip-group example using `ToggleGroup` for selectable chips.

Foundation: existing `Badge`, `Toggle`, `ToggleGroup`, and Button.

### Menu

- [ ] Add `DropdownMenu` primitives styled to the Material menu spec.
- [ ] Add standard and vibrant menu items.
- [ ] Support leading icons, trailing text, shortcuts, checked items,
  submenus, separators, destructive actions, and disabled states.

Foundation: shadcn `dropdown-menu`.

### Snackbar

- [x] Add the Material snackbar surface and imperative toast API.
- [x] Support plain text, an optional action, and an optional close control.
- [x] Support single-line and two-line layouts.
- [x] Add appropriate entrance, exit, duration, and stacking behavior.

Foundation: shadcn `toast` for this Base UI project.

### List and list item

- [x] Add `List`, `ListItem`, and list section composition.
- [x] Support one-, two-, and three-line items.
- [x] Support the kit's default, `-2`, and `-4` density options.
- [x] Support leading icons, avatars, media, overlines, supporting text, and
  trailing controls.
- [x] Ensure interactive items use the correct semantic element rather than a
  clickable wrapper.

Foundation: shadcn `item` and the existing Separator, Avatar, Checkbox,
RadioGroup, and Switch.

### Circular progress and loading indicator

- [x] Add determinate and indeterminate `CircularProgress` variants.
- [x] Add the Material Expressive `LoadingIndicator` as a separate component.
- [x] Provide accessible labels and reduced-motion behavior.

Foundation: shadcn `spinner` where its behavior is sufficient; custom SVG or
CSS geometry for the Material indicators.

### Button groups and split button

- [x] Add non-toggle standard and connected button groups.
- [x] Add `SplitButton` with a primary action and menu trigger.
- [x] Support the Material size and shape combinations shown in the kit.
- [x] Keep selectable segmented controls on the existing `ToggleGroup` rather
  than creating a duplicate state model.

Foundation: shadcn `button-group`, existing Button and ToggleGroup, and future
DropdownMenu.

## P1 — Common product components

### Carousel

- [x] Add standard, multi-browse, hero, and uncontained layouts.
- [x] Add full-screen and responsive examples.
- [x] Support keyboard navigation, touch/drag interaction, and reduced motion.

Foundation: shadcn `carousel`.

### Search

- [x] Add `SearchBar` with leading search, trailing actions, active, disabled,
  and populated states.
- [x] Add docked and full-screen `SearchView` presentations.
- [ ] Support suggestions, recent searches, results, empty state, and keyboard
  navigation.

Foundation: shadcn `input-group`, `command`, and `popover`, plus the existing
Dialog, Sheet, Input, and List once available.

### Date picker

- [x] Add docked input, modal date picker, and input-modal configurations.
- [x] Support single-date and range selection.
- [x] Support month/year navigation, validation, disabled dates, and locale
  formatting.

Foundation: shadcn `calendar` and `popover`, plus existing Dialog, Field,
Input, Select, and Button.

### Time picker

- [x] Add keyboard-entry time picker.
- [x] Add the Material dial picker.
- [x] Support 12- and 24-hour modes, validation, and accessible keyboard
  controls.

Foundation: existing Dialog, Field, Input, Select, ToggleGroup, and Button;
custom dial interaction.

### Floating action buttons

- [x] Add `FAB` sizes and color variants.
- [x] Add `ExtendedFAB` with icon and label.
- [x] Add the round and square expressive shape behaviors from the kit.
- [x] Add `FABMenu` with labeled actions, focus management, and coordinated
  entrance/exit motion.

Foundation: existing Button, Tooltip, and Material motion/shape tokens.

## P2 — Navigation and application structure

### App bars

- [x] Add small, medium, and large `TopAppBar` configurations.
- [x] Add `BottomAppBar` with actions and optional FAB placement.
- [x] Support scrolling/elevation state without owning the page's scroll
  container.

Foundation: existing Button, Avatar, Separator, and future DropdownMenu and
FAB.

### Navigation bar

- [x] Add horizontal and vertical navigation-bar item layouts.
- [x] Support icons, labels, active indicators, and notification badges.
- [x] Support responsive item sizing and keyboard navigation.

Foundation: existing ToggleGroup and Tooltip, plus the future Notification
Badge.

### Navigation rail

- [x] Add compact and expanded navigation rails.
- [x] Support optional menu and FAB regions.
- [x] Support active indicators, labels, notification badges, and responsive
  expansion.

Foundation: shadcn `sidebar` where useful, plus existing Button and Tooltip and
the future FAB, Menu, and NotificationBadge.

### Toolbar

- [x] Add standard and expressive toolbar containers.
- [x] Support action buttons, toggle buttons, grouped controls, dividers,
  overflow menus, and optional FAB composition.

Foundation: existing Button, ToggleGroup, Separator, and Tooltip, plus future
ButtonGroup, DropdownMenu, and FAB.

## Extensions to existing components

These are gaps in current components, not reasons to introduce parallel
primitives.

- [x] Add filled and multiline variants to the existing text-field stack using
  shadcn `input-group` and `textarea`.
- [x] Add secondary-tab styling to the existing Tabs component.
- [x] Add rich-tooltip content using shadcn `hover-card` or `popover` while
  retaining the existing plain Tooltip.
- [ ] Add inset, middle-inset, vertical, and subhead variants to Separator.
- [ ] Add centered-slider and Material size variants to the existing Slider.
- [ ] Refine the existing bottom Sheet with Material shape, sizing, and drag
  handle presentation; do not introduce another modal state primitive unless
  drag physics require shadcn `drawer`.
- [ ] Add Storybook coverage for Field, Label, Separator, Sheet, Skeleton, and
  Toggle, which are exported but currently have no dedicated stories.

## Already covered — do not duplicate

- Button and icon button: use existing Button variants and icon sizes.
- Toggle button and segmented selection: use Toggle and ToggleGroup.
- Cards: use Card composition for stacked and horizontal examples.
- Basic, list, and scrollable dialogs: use Dialog composition with List once
  available.
- Side and bottom sheets: use the existing Sheet `side` API.
- Linear and expressive wavy progress: use Progress.
- Single-value and range sliders: use Slider.
- Outlined text field: use Input with Field.
- Plain tooltip: use Tooltip.
- Select menu: use Select; do not conflate it with the missing action Menu.
- Generic avatars, avatar groups, and avatar status indicators: use Avatar.

## Deferred kit content

These Figma sections should remain out of the core web backlog unless a product
requirement appears:

- XR-specific app bars, dialogs, navigation, and toolbars.
- 3D avatar artwork and other kit assets.
- The complete decorative Shape Set; the reusable Material radius scale is
  already represented by shape tokens.

## Suggested implementation order

1. Resolve `Badge` versus `Chip`, then implement NotificationBadge and Chip.
2. Install and restyle `dropdown-menu`, `toast`, and `item` for Menu,
   Snackbar, and List.
3. Implement CircularProgress and LoadingIndicator.
4. Install and restyle `button-group`; implement connected groups and
   SplitButton.
5. Implement SearchBar/SearchView and Carousel.
6. Implement date and time pickers.
7. Implement FAB and FABMenu.
8. Build app bars, navigation bar/rail, and Toolbar from the completed lower
   level components.
