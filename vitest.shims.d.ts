/// <reference types="@vitest/browser-playwright" />

export {}

declare module "vitest/browser" {
  interface BrowserCommands {
    dragPointer(
      selector: string,
      deltaX: number,
      deltaY: number,
    ): Promise<void>
    dragTouch(
      selector: string,
      deltaX: number,
      deltaY: number,
    ): Promise<void>
    emulateReducedMotion(reduced: boolean): Promise<void>
    holdPointer(selector: string): Promise<void>
    releasePointer(): Promise<void>
  }
}
