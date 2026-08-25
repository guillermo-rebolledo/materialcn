/// <reference types="@vitest/browser-playwright" />

export {}

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateReducedMotion(reduced: boolean): Promise<void>
  }
}
