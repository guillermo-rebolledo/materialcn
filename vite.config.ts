/// <reference types="vitest/config" />
import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"

// Dev/playground + Storybook config.
// The distributable library build lives in vite.lib.config.ts (`pnpm build`).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(import.meta.dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
            commands: {
              emulateReducedMotion: async ({ page }, reduced: boolean) => {
                await page.emulateMedia({
                  reducedMotion: reduced ? "reduce" : "no-preference",
                })
              },
              holdPointer: async ({ iframe, page }, selector: string) => {
                await iframe.locator(selector).hover()
                await page.mouse.down()
              },
              releasePointer: async ({ page }) => {
                await page.mouse.up()
              },
            },
          },
        },
      },
    ],
  },
})
