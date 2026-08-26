/**
 * The template registry.
 *
 * Data only, and deliberately in its own module: a file that exports anything
 * other than components is not a Fast Refresh boundary, so keeping the list
 * here means editing a screen reloads that screen rather than the whole app.
 */
import type { ComponentType } from "react"

import { AuthTemplate } from "./AuthTemplate"
import { BookingTemplate } from "./BookingTemplate"
import { CheckoutTemplate } from "./CheckoutTemplate"
import { DashboardTemplate } from "./DashboardTemplate"
import { DocsTemplate } from "./DocsTemplate"
import { GalleryTemplate } from "./GalleryTemplate"
import { MailTemplate } from "./MailTemplate"
import { SettingsTemplate } from "./SettingsTemplate"

export type Template = {
  /** The hash segment: `#/t/<id>`. */
  id: string
  title: string
  /** What this screen is for exercising, not what it pretends to be. */
  blurb: string
  Screen: ComponentType
}

export const TEMPLATES: Template[] = [
  {
    id: "mail",
    title: "Mail",
    blurb: "Adaptive three-pane: rail, selectable list, reading pane.",
    Screen: MailTemplate,
  },
  {
    id: "settings",
    title: "Settings",
    blurb: "Every form control at list-row height.",
    Screen: SettingsTemplate,
  },
  {
    id: "booking",
    title: "Booking",
    blurb: "A stepped flow, the pickers, and stacked overlays.",
    Screen: BookingTemplate,
  },
  {
    id: "gallery",
    title: "Gallery",
    blurb: "Carousel, imagery, skeletons, and the FAB menu.",
    Screen: GalleryTemplate,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    blurb: "Metric tiles and the progress family.",
    Screen: DashboardTemplate,
  },
  {
    id: "auth",
    title: "Sign in",
    blurb: "Validation and error styling, isolated.",
    Screen: AuthTemplate,
  },
  {
    id: "checkout",
    title: "Checkout",
    blurb: "Editable list, sticky summary, compact bottom sheet.",
    Screen: CheckoutTemplate,
  },
  {
    id: "docs",
    title: "Docs",
    blurb: "The type scale carrying a page alone.",
    Screen: DocsTemplate,
  },
]
