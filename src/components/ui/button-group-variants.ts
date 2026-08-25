import { cva } from "class-variance-authority"

const buttonGroupVariants = cva("w-fit", {
  variants: {
    orientation: {
      horizontal: "",
      vertical: "",
    },
    size: {
      xs: "",
      sm: "",
      default: "",
      lg: "",
      xl: "",
      "2xl": "",
    },
    variant: {
      standard: "",
      connected: "[&>[data-slot=button]:focus-visible]:z-10",
    },
  },
  compoundVariants: [
    {
      variant: "standard",
      orientation: "horizontal",
      className: "flex items-center",
    },
    {
      variant: "standard",
      orientation: "vertical",
      className: "flex flex-col items-stretch",
    },
    {
      variant: "connected",
      orientation: "horizontal",
      className:
        "m3-connected-button-group grid grid-flow-col auto-cols-fr items-center gap-0.5",
    },
    {
      variant: "connected",
      orientation: "vertical",
      className:
        "m3-connected-button-group grid grid-flow-row auto-rows-fr items-stretch gap-0.5",
    },
    {
      variant: "connected",
      orientation: "horizontal",
      size: ["xs", "sm", "default"],
      className: "min-h-12",
    },
    {
      variant: "standard",
      orientation: "horizontal",
      size: "xs",
      className: "min-h-12 gap-[18px] px-[9px]",
    },
    {
      variant: "standard",
      orientation: "vertical",
      size: "xs",
      className: "min-w-12 gap-[18px] py-[9px]",
    },
    {
      variant: "standard",
      orientation: "horizontal",
      size: ["sm", "default"],
      className: "min-h-12 gap-3 px-1.5",
    },
    {
      variant: "standard",
      orientation: "vertical",
      size: ["sm", "default"],
      className: "min-w-12 gap-3 py-1.5",
    },
    {
      variant: "standard",
      orientation: "horizontal",
      size: ["lg", "xl", "2xl"],
      className: "gap-2",
    },
    {
      variant: "standard",
      orientation: "vertical",
      size: ["lg", "xl", "2xl"],
      className: "gap-2",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
    variant: "standard",
  },
})

export { buttonGroupVariants }
