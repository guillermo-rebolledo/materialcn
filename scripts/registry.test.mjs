/*
 * Holds the generated registry to what the CLI and the registry directory
 * require. Validation runs against the CLI's own schemas, so it tracks
 * whatever version of shadcn this repo builds with.
 */

import { describe, expect, it } from "vitest"
import { registryItemSchema, registrySchema } from "shadcn/schema"

import { buildRegistry } from "./generate-registry.mjs"

/** `https://host/r/button.json` -> `button`. */
const itemName = (url) => url.split("/").pop().replace(/\.json$/, "")

const registry = buildRegistry()
const items = registry.items
const themeItem = items.find((item) => item.name === "materialcn-theme")

describe("registry.json", () => {
  it("validates against the shadcn registry schema", () => {
    expect(() => registrySchema.parse(registry)).not.toThrow()
  })

  it("validates every item against the registry-item schema", () => {
    for (const item of items) {
      expect(() => registryItemSchema.parse(item), item.name).not.toThrow()
    }
  })

  it("titles and describes every item, as the directory listing shows both", () => {
    for (const item of items) {
      expect(item.title, item.name).toBeTruthy()
      expect(item.description, item.name).toBeTruthy()
    }
  })

  it("is flat: a consumer endpoint cannot resolve `include`", () => {
    expect(registry).not.toHaveProperty("include")
  })

  it("inlines no file content in the index, which the directory forbids", () => {
    // The rule is about the catalogue served at /registry.json. The per-item
    // JSON that `shadcn build` writes does carry file content — that is how a
    // consumer gets the source.
    for (const item of items) {
      for (const file of item.files ?? []) {
        expect(file, `${item.name}: ${file.path}`).not.toHaveProperty("content")
      }
    }
  })

  it("points every internal dependency at an absolute URL for an item that exists", () => {
    const names = new Set(items.map((item) => item.name))

    for (const item of items) {
      for (const dependency of item.registryDependencies ?? []) {
        expect(dependency, `${item.name} -> ${dependency}`).toMatch(/^https?:\/\//)
        expect(names, `${item.name} -> ${dependency}`).toContain(itemName(dependency))
      }
    }
  })

  it("makes everything that renders markup depend on the token layer", () => {
    const rendering = items.filter((item) =>
      (item.files ?? []).some((file) => file.path.endsWith(".tsx")),
    )
    expect(rendering.length).toBeGreaterThan(50)

    for (const item of rendering) {
      if (item.name === "materialcn-theme") continue
      expect(item.registryDependencies.map(itemName), item.name).toContain("materialcn-theme")
    }
  })

  it("keeps the libraries installable on their own", () => {
    // `shadcn add @materialcn/utils` should not drag in the whole stylesheet.
    for (const name of ["utils", "palettes"]) {
      expect(items.find((item) => item.name === name).registryDependencies).toBeUndefined()
    }
  })
})

describe("the theme item", () => {
  it("re-declares the shadcn aliases under every scheme selector", () => {
    // A `var()` is substituted where it is declared. An alias declared only at
    // `:root` inherits the light value into a `.dark` subtree.
    const aliasBlock = Object.keys(themeItem.css).find((selector) =>
      selector.startsWith(":root, .dark"),
    )

    expect(aliasBlock).toBeDefined()
    expect(themeItem.css[aliasBlock]["--primary"]).toBe("var(--m3-primary)")
    expect(aliasBlock).toContain('[data-palette="ocean"]')
  })

  it("carries the dark variant with its system-preference fallback", () => {
    expect(themeItem.css).toHaveProperty("@custom-variant dark")
    expect(JSON.stringify(themeItem.css["@custom-variant dark"])).toContain(
      "prefers-color-scheme: dark",
    )
  })

  it("keeps breakpoints out of the runtime-swappable roles", () => {
    // Tailwind substitutes these into `@media` parameters, where a var() does
    // not resolve, so they have to be literal lengths.
    expect(themeItem.cssVars.theme["breakpoint-m3-medium"]).toBe("600px")
  })

  it("ships the utilities components rely on", () => {
    for (const utility of ["m3-grid", "m3-state-layer", "m3-carousel", "m3-split-button"]) {
      expect(themeItem.css, utility).toHaveProperty(`@utility ${utility}`)
    }
  })

  it("brings tw-animate-css, which Dialog and Select use", () => {
    expect(themeItem.css).toHaveProperty('@import "tw-animate-css"')
  })

  it("does not ask the consumer to import a token file that will not exist", () => {
    const imports = Object.keys(themeItem.css).filter((key) => key.startsWith("@import"))
    expect(imports).toEqual(['@import "tw-animate-css"'])
  })
})
