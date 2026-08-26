import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/components/theme-provider"
import "@/styles/fonts.css"
import "@/index.css"

import { Playground } from "./Playground"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Playground />
    </ThemeProvider>
  </StrictMode>,
)
