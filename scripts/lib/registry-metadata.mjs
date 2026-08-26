/*
 * The one hand-written part of the registry.
 *
 * Titles and descriptions are what `shadcn search` and the registry directory
 * show, so they are authored rather than derived from a file name. Every
 * shipped item needs an entry: generate-registry.mjs fails when one is
 * missing, so a new component cannot slip out with a placeholder blurb.
 */

/** Shown on the registry itself. */
export const REGISTRY = {
  name: "materialcn",
  homepage: "https://github.com/guillermo-rebolledo/materialcn",
}

/** The token layer every component is styled by. */
export const THEME_ITEM = {
  name: "materialcn-theme",
  title: "Material 3 Theme",
  description:
    "The Material 3 Expressive token layer: color roles and four alternate palettes, type scale, shape, spacing, elevation, state layers, motion springs, and the responsive grid. Points shadcn's semantic variables at M3 roles, so stock shadcn components render as Material.",
  categories: ["theme"],
}

const ITEMS = {
  // ------------------------------------------------------------- foundations
  utils: {
    title: "cn",
    description:
      "The `cn` class merger, configured for the M3 utility namespaces. Without it tailwind-merge treats `text-m3-label-lg` and `text-m3-on-primary` as one group and drops one of them.",
    categories: ["utilities"],
  },
  palettes: {
    title: "Palettes",
    description: "The alternate palettes shipped by the theme, as data for a palette picker.",
    categories: ["theme"],
  },
  "theme-context": {
    title: "Theme Context",
    description: "The context behind `useTheme`: the current color scheme and palette.",
    categories: ["theme"],
  },
  "theme-provider": {
    title: "Theme Provider",
    description:
      "Puts the page in light, dark, or system mode and selects a palette, persisting the choice and exposing it through `useTheme`.",
    categories: ["theme"],
  },

  // -------------------------------------------------------------- primitives
  button: {
    title: "Button",
    description:
      "The five Material button variants across five sizes, in round and square shapes, with the press morph and the loading state that keeps the button's size.",
    categories: ["actions"],
  },
  "button-variants": {
    title: "Button Variants",
    description: "The `cva` definition behind Button's variant, size, and shape props.",
    categories: ["actions"],
  },
  "button-group": {
    title: "Button Group",
    description:
      "Connected and standard groups of buttons, with the kit's 2dp separation and first/middle/last corner geometry.",
    categories: ["actions"],
  },
  "button-group-context": {
    title: "Button Group Context",
    description: "Carries a group's shape, size, and variant down to the buttons inside it.",
    categories: ["actions"],
  },
  "split-button": {
    title: "Split Button",
    description:
      "A primary action joined to a menu trigger, with the kit's asymmetric segment geometry.",
    categories: ["actions"],
  },
  fab: {
    title: "FAB",
    description:
      "The floating action button in three sizes, plus the extended FAB, which requires a readable label.",
    categories: ["actions"],
  },
  "fab-menu": {
    title: "FAB Menu",
    description: "A FAB that expands into a column of labelled actions.",
    categories: ["actions"],
  },
  toggle: {
    title: "Toggle",
    description: "A button that stays pressed, with the Material selected state.",
    categories: ["actions"],
  },
  "toggle-group": {
    title: "Toggle Group",
    description: "Single- or multi-select groups of toggles.",
    categories: ["actions"],
  },
  icon: {
    title: "Icon",
    description: "Sizes and optically aligns a lucide icon against the M3 type scale.",
    categories: ["media"],
  },
  link: {
    title: "Link",
    description: "An inline link on the M3 type and color roles.",
    categories: ["navigation"],
  },
  label: {
    title: "Label",
    description: "A form label bound to its control.",
    categories: ["forms"],
  },
  separator: {
    title: "Separator",
    description: "The Material divider, horizontal or vertical, full-width or inset.",
    categories: ["layout"],
  },
  skeleton: {
    title: "Skeleton",
    description: "Loading placeholders sized to the type scale role they stand in for.",
    categories: ["feedback"],
  },
  image: {
    title: "Image",
    description: "An image on the M3 shape scale, with aspect ratio, fallback, and loading states.",
    categories: ["media"],
  },
  avatar: {
    title: "Avatar",
    description: "A circular image with an initials fallback.",
    categories: ["media"],
  },
  badge: {
    title: "Badge",
    description: "Material chip geometry as a static label.",
    categories: ["display"],
  },
  chip: {
    title: "Chip",
    description:
      "Assist, filter, input, and suggestion chips, with selected, removable, and icon states.",
    categories: ["display"],
  },
  "notification-badge": {
    title: "Notification Badge",
    description: "The dot and numeric badges that sit over an icon, with `99+` overflow.",
    categories: ["display"],
  },
  card: {
    title: "Card",
    description: "Elevated, filled, and outlined cards on the M3 surface ramp.",
    categories: ["layout"],
  },
  list: {
    title: "List",
    description: "Material list rows in three densities, with leading and trailing slots.",
    categories: ["display"],
  },
  accordion: {
    title: "Accordion",
    description: "Expandable sections on the M3 motion springs.",
    categories: ["disclosure"],
  },
  carousel: {
    title: "Carousel",
    description:
      "The Material carousel layouts — multi-browse, hero, uncontained, full-screen — sized by container query.",
    categories: ["display"],
  },
  tabs: {
    title: "Tabs",
    description: "Primary and secondary tabs with the sliding active indicator.",
    categories: ["navigation"],
  },
  tooltip: {
    title: "Tooltip",
    description: "The plain Material tooltip.",
    categories: ["feedback"],
  },
  "rich-tooltip": {
    title: "Rich Tooltip",
    description: "The rich tooltip: a title, body text, and optional actions.",
    categories: ["feedback"],
  },
  dialog: {
    title: "Dialog",
    description: "The Material dialog, basic and full-screen.",
    categories: ["overlays"],
  },
  sheet: {
    title: "Sheet",
    description: "Side and bottom sheets, modal or standard.",
    categories: ["overlays"],
  },
  "dropdown-menu": {
    title: "Menu",
    description:
      "The Material menu: standard and vibrant items, leading icons, trailing text, submenus, and destructive actions.",
    categories: ["overlays"],
  },
  toast: {
    title: "Snackbar",
    description: "The Material snackbar and its imperative `toast` API, with stacking and actions.",
    categories: ["feedback"],
  },

  // ------------------------------------------------------------------- forms
  field: {
    title: "Field",
    description: "The label, description, and error scaffolding shared by every form control.",
    categories: ["forms"],
  },
  input: {
    title: "Input",
    description: "The bare text input Field and TextField build on.",
    categories: ["forms"],
  },
  "input-group": {
    title: "Input Group",
    description: "An input with leading and trailing affixes inside one container.",
    categories: ["forms"],
  },
  "text-field": {
    title: "Text Field",
    description:
      "The Material text field, filled and outlined, with the floating label, supporting text, and character counter.",
    categories: ["forms"],
  },
  checkbox: {
    title: "Checkbox",
    description: "The Material checkbox, including the indeterminate state.",
    categories: ["forms"],
  },
  "radio-group": {
    title: "Radio Group",
    description: "Material radio buttons.",
    categories: ["forms"],
  },
  switch: {
    title: "Switch",
    description: "The Material 3 switch, with the icon-in-thumb variants.",
    categories: ["forms"],
  },
  slider: {
    title: "Slider",
    description: "The M3 Expressive slider, continuous or stepped, with the value label.",
    categories: ["forms"],
  },
  select: {
    title: "Select",
    description: "A select styled to the Material menu.",
    categories: ["forms"],
  },
  calendar: {
    title: "Calendar",
    description: "The Material date grid, for single dates and ranges.",
    categories: ["forms"],
  },
  "calendar-utils": {
    title: "Calendar Utilities",
    description: "Date maths for the calendar and the date pickers, free of any date library.",
    categories: ["forms"],
  },
  "date-picker": {
    title: "Date Picker",
    description: "A text field with a docked date picker.",
    categories: ["forms"],
  },
  "date-picker-dialog": {
    title: "Date Picker Dialog",
    description: "The modal date picker, with the calendar and text-entry modes.",
    categories: ["forms"],
  },
  "time-picker": {
    title: "Time Picker",
    description: "Text entry for a time, in 12- or 24-hour mode.",
    categories: ["forms"],
  },
  "time-dial": {
    title: "Time Dial",
    description: "The Material clock dial, and the dialog that pairs it with text entry.",
    categories: ["forms"],
  },
  "search-bar": {
    title: "Search Bar",
    description: "The Material search bar, with leading and trailing actions.",
    categories: ["forms"],
  },
  "search-view": {
    title: "Search View",
    description: "The full-screen search surface a search bar expands into.",
    categories: ["forms"],
  },

  // -------------------------------------------------------------- navigation
  "top-app-bar": {
    title: "Top App Bar",
    description: "Small, medium, and large top app bars, with the scroll-collapse behavior.",
    categories: ["navigation"],
  },
  "bottom-app-bar": {
    title: "Bottom App Bar",
    description: "The bottom app bar, with actions and an optional docked FAB.",
    categories: ["navigation"],
  },
  "navigation-bar": {
    title: "Navigation Bar",
    description: "The bottom navigation bar, with the M3 Expressive active indicator.",
    categories: ["navigation"],
  },
  "navigation-rail": {
    title: "Navigation Rail",
    description: "The navigation rail, collapsed or expanded, for medium and larger windows.",
    categories: ["navigation"],
  },
  "navigation-context": {
    title: "Navigation Context",
    description: "The selected destination, shared by the navigation bar and the rail.",
    categories: ["navigation"],
  },
  toolbar: {
    title: "Toolbar",
    description: "The floating and docked toolbars, in standard and vibrant color.",
    categories: ["navigation"],
  },
  breadcrumb: {
    title: "Breadcrumb",
    description: "The shadcn breadcrumb primitives on the M3 type and color roles.",
    categories: ["navigation"],
  },
  breadcrumbs: {
    title: "Breadcrumbs",
    description: "A breadcrumb trail from a list of entries, collapsing the middle when it overflows.",
    categories: ["navigation"],
  },
  pagination: {
    title: "Pagination",
    description: "The shadcn pagination primitives on the M3 roles.",
    categories: ["navigation"],
  },
  paginator: {
    title: "Paginator",
    description: "A page control from a total and a current page, with the page-window logic.",
    categories: ["navigation"],
  },

  // ---------------------------------------------------------------- progress
  progress: {
    title: "Progress",
    description: "The linear progress indicator, determinate and indeterminate, with the M3 Expressive wave.",
    categories: ["feedback"],
  },
  "circular-progress": {
    title: "Circular Progress",
    description: "The circular progress indicator, determinate and indeterminate.",
    categories: ["feedback"],
  },
  "loading-indicator": {
    title: "Loading Indicator",
    description: "The M3 Expressive loading indicator, morphing through the kit's seven shapes.",
    categories: ["feedback"],
  },
  alert: {
    title: "Alert",
    description: "An inline message in four severities, mapped onto the closest M3 container roles.",
    categories: ["feedback"],
  },
}

export function metadataFor(name) {
  const metadata = ITEMS[name]
  if (!metadata) {
    throw new Error(
      `No title or description for "${name}". Add one to scripts/lib/registry-metadata.mjs — ` +
        "the registry directory lists both.",
    )
  }
  return metadata
}

export function knownItemNames() {
  return Object.keys(ITEMS)
}
