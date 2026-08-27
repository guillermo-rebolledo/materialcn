import { useEffect, useState } from "react"
import { LayersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { App } from "./App"
import { Landing } from "./Landing"
import { ThemeControls } from "./ThemeControls"
import { ProductScreen } from "./ProductScreen"
import { TEMPLATES } from "./templates"

/**
 * The dev app's shell: the token gallery, one product screen, and the
 * template screens.
 *
 * The gallery shows each piece; the screens show them competing for the same
 * layout, which is where spacing, elevation, and overlay ordering problems
 * actually surface. The hash is enough of a router — and it is what lets this
 * deploy to a static host without rewrite rules. `#/` is the landing index,
 * `#/gallery` the token gallery, `#/screen` the original product screen, and
 * `#/t/<id>` a template.
 *
 * It lives here rather than in `main.tsx` for the same Fast Refresh reason the
 * library keeps `cva()` out of component files: a module is only a hot boundary
 * when everything it exports is a component. The template list is data, so it
 * lives in `templates/index.ts` for the same reason.
 */
export function Playground() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const templateId = hash.startsWith("#/t/") ? hash.slice(4) : null
  const template = TEMPLATES.find((entry) => entry.id === templateId)
  const current = template
    ? template.title
    : hash === "#/screen"
      ? "Product screen"
      : hash === "#/gallery"
        ? "Token gallery"
        : "Overview"

  return (
    /*
      A strip rather than a floating button. A fixed overlay in any corner sat
      on top of something real on at least one screen — the app bar's actions
      top-right, the FAB bottom-right, the navigation bar bottom-centre — and a
      switcher that blocks the controls it is there to let you reach is worse
      than one that costs 40px. The screens are `min-h-full` inside the scroll
      area for the same reason: the strip owns the viewport, not them.
    */
    <div className="flex h-svh flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-m3-sm border-b border-m3-outline-variant bg-m3-surface-container px-m3-md py-m3-sm">
        {/* The controls come first at compact: the strip is a dev affordance,
            and its own name is the part worth dropping when space runs out. */}
        <span className="hidden text-m3-label-md text-m3-on-surface-variant m3-medium:inline">
          materialcn playground
        </span>
        <div className="ml-auto">
          <ThemeControls />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="tonal" size="xs" />}>
            <LayersIcon />
            {current}
          </DropdownMenuTrigger>
          {/*
            One line per item. A Material menu item is a fixed 48dp row, so a
            title stacked over a description overflows into its neighbour —
            the blurb goes in the tooltip instead of the row.
          */}
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Reference</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  window.location.hash = "#/"
                }}
              >
                Overview
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.location.hash = "#/gallery"
                }}
              >
                Token gallery
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.location.hash = "#/screen"
                }}
              >
                Product screen
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Templates</DropdownMenuLabel>
              {TEMPLATES.map((entry) => (
                <DropdownMenuItem
                  key={entry.id}
                  title={entry.blurb}
                  onClick={() => {
                    window.location.hash = `#/t/${entry.id}`
                  }}
                >
                  {entry.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {template ? (
          <template.Screen />
        ) : hash === "#/screen" ? (
          <ProductScreen />
        ) : hash === "#/gallery" ? (
          <App />
        ) : (
          <Landing />
        )}
      </div>
    </div>
  )
}
