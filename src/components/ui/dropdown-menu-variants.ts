import { cva } from "class-variance-authority"

/** Material 3 action-menu surfaces from the current design kit. */
export const dropdownMenuContentVariants = cva(
  [
    "z-50 max-h-(--available-height) w-(--anchor-width) min-w-52",
    "overflow-x-hidden overflow-y-auto rounded-m3-sm py-0.5 has-[>[data-slot=dropdown-menu-group]:only-child]:rounded-m3-xs",
    "text-m3-label-lg shadow-m3-2 outline-none",
    "duration-(--m3-spring-effects-fast-duration) ease-(--m3-spring-effects-fast)",
    "data-open:animate-in data-open:fade-in-0",
    "data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0",
  ],
  {
    variants: {
      presentation: {
        standard: "bg-m3-surface-container-low text-m3-on-surface",
        vibrant: "bg-m3-tertiary-container text-m3-on-tertiary-container",
      },
    },
    defaultVariants: { presentation: "standard" },
  },
)

const menuItemBase = [
  "relative isolate flex h-12 cursor-default items-center gap-2 px-4",
  "outline-none select-none",
  "before:pointer-events-none before:absolute before:inset-x-1 before:inset-y-0.5 before:-z-20 before:rounded-m3-xs before:opacity-0",
  "after:pointer-events-none after:absolute after:inset-x-1 after:inset-y-0.5 after:-z-10 after:rounded-m3-xs after:bg-current after:opacity-0",
  "after:transition-opacity after:duration-(--m3-spring-effects-fast-duration) after:ease-(--m3-spring-effects-fast)",
  "hover:not-data-disabled:after:opacity-8 focus-visible:not-data-disabled:after:opacity-10 active:not-data-disabled:after:opacity-10",
  "data-disabled:pointer-events-none data-disabled:opacity-38",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  "data-inset:pl-10",
]

export const dropdownMenuItemVariants = cva(menuItemBase, {
  variants: {
    variant: {
      default: "",
      destructive: "text-m3-error",
    },
  },
  defaultVariants: { variant: "default" },
})

export const dropdownMenuSelectableItemVariants = cva(
  [
    ...menuItemBase,
    "pr-11 data-checked:before:rounded-m3-md data-checked:before:opacity-100 data-checked:after:rounded-m3-md",
  ],
  {
    variants: {
      presentation: {
        standard:
          "data-checked:before:bg-m3-tertiary-container data-checked:text-m3-on-tertiary-container",
        vibrant:
          "data-checked:before:bg-m3-tertiary data-checked:text-m3-on-tertiary",
      },
    },
    defaultVariants: { presentation: "standard" },
  },
)

export const dropdownMenuSubTriggerVariants = cva(
  [
    ...menuItemBase,
    "data-popup-open:before:rounded-m3-md data-popup-open:before:opacity-100 data-popup-open:after:rounded-m3-md",
  ],
  {
    variants: {
      presentation: {
        standard:
          "data-popup-open:before:bg-m3-tertiary-container data-popup-open:text-m3-on-tertiary-container",
        vibrant:
          "data-popup-open:before:bg-m3-tertiary data-popup-open:text-m3-on-tertiary",
      },
    },
    defaultVariants: { presentation: "standard" },
  },
)

export type DropdownMenuPresentation = "standard" | "vibrant"
