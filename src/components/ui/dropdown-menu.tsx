import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

import { ThemeContext } from "@/components/theme-context"
import { cn } from "@/lib/utils"
import {
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
  dropdownMenuSelectableItemVariants,
  dropdownMenuSubTriggerVariants,
  type DropdownMenuPresentation,
} from "./dropdown-menu-variants"

const DropdownMenuPresentationContext =
  React.createContext<DropdownMenuPresentation>("standard")

function DropdownMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ className, ...props }: MenuPrimitive.Portal.Props) {
  const theme = React.use(ThemeContext)

  return (
    <MenuPrimitive.Portal
      data-slot="dropdown-menu-portal"
      className={cn(theme?.resolvedTheme, className)}
      {...props}
    />
  )
}

function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  variant = "standard",
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    variant?: DropdownMenuPresentation
  }) {
  return (
    <DropdownMenuPortal>
      <MenuPrimitive.Positioner
        className="isolate z-(--m3-z-menu) outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          data-presentation={variant}
          className={cn(
            dropdownMenuContentVariants({ presentation: variant }),
            className,
          )}
          {...props}
        >
          <DropdownMenuPresentationContext value={variant}>
            {children}
          </DropdownMenuPresentationContext>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </DropdownMenuPortal>
  )
}

function DropdownMenuGroup({ className, ...props }: MenuPrimitive.Group.Props) {
  return (
    <MenuPrimitive.Group
      data-slot="dropdown-menu-group"
      className={cn("flex flex-col rounded-m3-sm py-0.5", className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & { inset?: boolean }) {
  const presentation = React.use(DropdownMenuPresentationContext)

  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "flex h-8 items-center px-4 text-m3-label-lg data-inset:pl-10",
        presentation === "standard"
          ? "text-m3-on-surface-variant"
          : "text-m3-on-tertiary-container",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(dropdownMenuItemVariants({ variant }), className)}
      {...props}
    />
  )
}

function DropdownMenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  const presentation = React.use(DropdownMenuPresentationContext)

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        dropdownMenuSubTriggerVariants({ presentation }),
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon aria-hidden="true" className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  const presentation = React.use(DropdownMenuPresentationContext)

  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      variant={presentation}
      className={className}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & { inset?: boolean }) {
  const presentation = React.use(DropdownMenuPresentationContext)

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        dropdownMenuSelectableItemVariants({ presentation }),
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-4 flex size-5 items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & { inset?: boolean }) {
  const presentation = React.use(DropdownMenuPresentationContext)

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        dropdownMenuSelectableItemVariants({ presentation }),
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-4 flex size-5 items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  const presentation = React.use(DropdownMenuPresentationContext)

  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "mx-3 my-0.5 h-px shrink-0",
        presentation === "standard"
          ? "bg-m3-outline-variant"
          : "bg-m3-on-tertiary-container/20",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const presentation = React.use(DropdownMenuPresentationContext)

  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-m3-label-sm tracking-normal",
        presentation === "standard"
          ? "text-m3-on-surface-variant"
          : "text-m3-on-tertiary-container",
        className,
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
