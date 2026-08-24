import { useEffect, useState } from "react"
import type { Decorator, Preview } from "@storybook/react-vite"

import {
  ThemeProvider,
  useTheme,
  type Theme,
} from "../src/components/theme-provider"
import "../src/styles/fonts.css"
import "../src/index.css"

/**
 * Bridges the toolbar's theme global into the library's own ThemeProvider, so
 * stories exercise the exact code path an app would.
 */
function ThemeSync({ theme }: { theme: Theme }) {
  const { setTheme } = useTheme()
  useEffect(() => setTheme(theme), [theme, setTheme])
  return null
}

/**
 * One themed pane. The scheme class goes on this element rather than <html>,
 * which is what lets two panes with opposite schemes coexist on one page.
 */
function ThemePane({
  theme,
  children,
}: {
  theme: "light" | "dark"
  children: React.ReactNode
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  return (
    <div ref={setNode} className={`${theme} bg-background text-foreground p-8`}>
      {node && (
        <ThemeProvider defaultTheme={theme} storageKey={null} element={node}>
          {children}
        </ThemeProvider>
      )}
    </div>
  )
}

/**
 * Renders a story twice, light beside dark. Opt in per story with
 * `parameters: { sideBySide: true }` — the fastest way to review a token change.
 */
const withSideBySide: Decorator = (Story, context) => {
  if (!context.parameters.sideBySide) return <Story />

  return (
    <div className="grid min-h-svh gap-px md:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <ThemePane key={theme} theme={theme}>
          <Story />
        </ThemePane>
      ))}
    </div>
  )
}

/** The single-pane case: theme comes from the toolbar and lands on <html>. */
const withTheme: Decorator = (Story, context) => {
  // Side-by-side supplies its own providers and its own surfaces.
  if (context.parameters.sideBySide) return <Story />

  const theme = (context.globals.theme ?? "light") as Theme

  return (
    <ThemeProvider defaultTheme={theme} storageKey={null}>
      <ThemeSync theme={theme} />
      <div className="bg-background text-foreground min-h-svh p-8">
        <Story />
      </div>
    </ThemeProvider>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // The M3 surface roles supply the background; Storybook's own would fight them.
    backgrounds: { disable: true },
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
  globalTypes: {
    theme: {
      description: "Color scheme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "system", title: "System", icon: "browser" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  // Applied innermost-first, so withTheme wraps withSideBySide.
  decorators: [withSideBySide, withTheme],
}

export default preview
