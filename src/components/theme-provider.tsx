import { useCallback, useEffect, useMemo, useState } from "react"

import { PALETTES, type Palette } from "@/lib/palettes"
import { ThemeContext, type Theme } from "./theme-context"

const PALETTE_IDS: string[] = PALETTES.map((entry) => entry.id)

function isPalette(value: string | null): value is Palette {
  return value === "baseline" || (value !== null && PALETTE_IDS.includes(value))
}

function systemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultPalette = "baseline",
  storageKey = "materialcn-theme",
  paletteStorageKey = "materialcn-palette",
  element,
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultPalette?: Palette
  /** Set to null to opt out of persistence. */
  storageKey?: string | null
  /** Set to null to opt out of persistence. */
  paletteStorageKey?: string | null
  /** Where the `light`/`dark` class and `data-palette` go. Defaults to <html>. */
  element?: HTMLElement | null
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined" || !storageKey) return defaultTheme
    const stored = window.localStorage.getItem(storageKey)
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : defaultTheme
  })

  const [palette, setPaletteState] = useState<Palette>(() => {
    if (typeof window === "undefined" || !paletteStorageKey) return defaultPalette
    const stored = window.localStorage.getItem(paletteStorageKey)
    return isPalette(stored) ? stored : defaultPalette
  })

  const [system, setSystem] = useState<"light" | "dark">(systemTheme)

  // Track the OS preference so `resolvedTheme` stays correct while on "system".
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystem(query.matches ? "dark" : "light")
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  const resolvedTheme = theme === "system" ? system : theme

  useEffect(() => {
    const target = element ?? document.documentElement
    target.classList.remove("light", "dark")

    // On "system" we deliberately add no class: tokens/color.css already falls
    // back to `prefers-color-scheme`, so leaving both classes off is what lets
    // an unstyled server render match the client.
    if (theme !== "system") target.classList.add(theme)

    return () => target.classList.remove("light", "dark")
  }, [theme, element])

  useEffect(() => {
    const target = element ?? document.documentElement

    // The baseline carries no attribute, for the same reason "system" carries
    // no class: it is what the stylesheet already does, and an attribute that
    // changes nothing is one more thing a server render has to match.
    if (palette === "baseline") target.removeAttribute("data-palette")
    else target.setAttribute("data-palette", palette)

    return () => target.removeAttribute("data-palette")
  }, [palette, element])

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      if (storageKey) window.localStorage.setItem(storageKey, next)
    },
    [storageKey],
  )

  const setPalette = useCallback(
    (next: Palette) => {
      setPaletteState(next)
      if (paletteStorageKey) {
        window.localStorage.setItem(paletteStorageKey, next)
      }
    },
    [paletteStorageKey],
  )

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, palette, setPalette }),
    [theme, resolvedTheme, setTheme, palette, setPalette],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export { useTheme, type Theme } from "./theme-context"
export { PALETTES, type Palette } from "@/lib/palettes"
