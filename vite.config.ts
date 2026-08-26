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
        // Node-side unit tests for the build scripts (token and registry
        // generation). Kept out of the browser project so they do not pay for
        // a Chromium boot.
        test: {
          name: "scripts",
          environment: "node",
          include: ["scripts/**/*.test.mjs"],
        },
      },
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
              dragPointer: async (
                { iframe, page },
                selector: string,
                deltaX: number,
                deltaY: number,
              ) => {
                const bounds = await iframe.locator(selector).boundingBox()
                if (!bounds) throw new Error(`Could not locate ${selector}`)

                const startX = bounds.x + bounds.width / 2
                const startY = bounds.y + bounds.height / 2
                await page.mouse.move(startX, startY)
                await page.mouse.down()
                await page.mouse.move(startX + deltaX, startY + deltaY, {
                  steps: 8,
                })
                await page.mouse.up()
              },
              dragTouch: async (
                { iframe, page },
                selector: string,
                deltaX: number,
                deltaY: number,
              ) => {
                const bounds = await iframe.locator(selector).boundingBox()
                if (!bounds) throw new Error(`Could not locate ${selector}`)

                const startX = bounds.x + bounds.width / 2
                const startY = bounds.y + bounds.height / 2
                const session = await page.context().newCDPSession(page)
                const touchPoint = (step: number) => ({
                  x: startX + (deltaX * step) / 12,
                  y: startY + (deltaY * step) / 12,
                  radiusX: 1,
                  radiusY: 1,
                  force: 1,
                  id: 1,
                })

                try {
                  await session.send("Emulation.setTouchEmulationEnabled", {
                    enabled: true,
                    maxTouchPoints: 1,
                  })
                  await session.send("Input.dispatchTouchEvent", {
                    type: "touchStart",
                    touchPoints: [touchPoint(0)],
                  })
                  await page.waitForTimeout(50)
                  for (let step = 1; step <= 12; step += 1) {
                    await session.send("Input.dispatchTouchEvent", {
                      type: "touchMove",
                      touchPoints: [touchPoint(step)],
                    })
                    await page.waitForTimeout(20)
                  }
                  await session.send("Input.dispatchTouchEvent", {
                    type: "touchEnd",
                    touchPoints: [],
                  })
                } finally {
                  await session.send("Emulation.setTouchEmulationEnabled", {
                    enabled: false,
                  })
                  await session.detach()
                }
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
