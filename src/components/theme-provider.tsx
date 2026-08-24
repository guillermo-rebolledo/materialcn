import { useCallback, useEffect, useMemo, useState } from "react"

import { ThemeContext, type Theme } from "./theme-context"

function systemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "materialcn-theme",
  element,
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  /** Set to null to opt out of persistence. */
  storageKey?: string | null
  /** Where the `light`/`dark` class goes. Defaults to <html>. */
  element?: HTMLElement | null
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined" || !storageKey) return defaultTheme
    const stored = window.localStorage.getItem(storageKey)
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : defaultTheme
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

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      if (storageKey) window.localStorage.setItem(storageKey, next)
    },
    [storageKey],
  )

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export { useTheme, type Theme } from "./theme-context"
