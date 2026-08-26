import { describe, expect, it } from "vitest"

import { cssToRegistryObject, mergeCssObjects } from "./css-to-registry.mjs"

const rulesOf = (...args) => cssToRegistryObject(...args).css

describe("cssToRegistryObject", () => {
  it("encodes declarations under their selector", () => {
    expect(rulesOf(":root { --m3-primary: oklch(0.5 0 0); }")).toEqual({
      ":root": { "--m3-primary": "oklch(0.5 0 0)" },
    })
  })

  it("keeps an at-rule's parameters in the key", () => {
    expect(rulesOf("@media (width >= 600px) { :root { --a: 1; } }")).toEqual({
      "@media (width >= 600px)": { ":root": { "--a": "1" } },
    })
  })

  it("routes @theme through cssVars, where declarations survive", () => {
    const { css: themeRules, cssVars } = cssToRegistryObject(
      "@theme inline { --radius-m3-xs: 4px; }\n@theme { --breakpoint-m3-medium: 600px; }",
    )

    expect(themeRules).toEqual({})
    expect(cssVars).toEqual({
      theme: { "radius-m3-xs": "4px", "breakpoint-m3-medium": "600px" },
    })
  })

  it("refuses a declaration the CLI cannot place", () => {
    expect(() => cssToRegistryObject("@media print { color: red; }")).toThrow(
      /declares properties directly/,
    )
  })

  it("encodes a body-less at-rule as an empty object", () => {
    expect(rulesOf("@layer base { * { @apply border-border; } }")).toEqual({
      "@layer base": { "*": { "@apply border-border": {} } },
    })
  })

  it("nests rules inside at-rules", () => {
    const css = `@media (prefers-color-scheme: dark) {
      :root:not(.light) { --m3-primary: oklch(0.8 0 0); }
    }`

    expect(rulesOf(css)).toEqual({
      "@media (prefers-color-scheme: dark)": {
        ":root:not(.light)": { "--m3-primary": "oklch(0.8 0 0)" },
      },
    })
  })

  it("keeps a nested `&` selector verbatim", () => {
    const css = `@utility m3-state-layer {
      position: relative;
      &::after { content: ""; opacity: 0; }
    }`

    expect(rulesOf(css)).toEqual({
      "@utility m3-state-layer": {
        position: "relative",
        "&::after": { content: '""', opacity: "0" },
      },
    })
  })

  it("carries @slot through a custom variant", () => {
    const css = `@custom-variant dark {
      &:where(.dark, .dark *) { @slot; }
    }`

    expect(rulesOf(css)).toEqual({
      "@custom-variant dark": {
        "&:where(.dark, .dark *)": { "@slot": {} },
      },
    })
  })

  it("merges a selector that appears twice, letting the later value win", () => {
    const css = `
      :root { --a: 1; --b: 2; }
      :root { --b: 3; }
    `

    expect(rulesOf(css)).toEqual({
      ":root": { "--a": "1", "--b": "3" },
    })
  })

  it("drops the imports a shadcn project already has", () => {
    const css = `
      @import "tailwindcss";
      @import "tw-animate-css";
      :root { --a: 1; }
    `

    expect(rulesOf(css, { skipImports: ["tailwindcss"] }),
    ).toEqual({
      '@import "tw-animate-css"': {},
      ":root": { "--a": "1" },
    })
  })

  it("puts a selector list broken across lines on one line", () => {
    expect(rulesOf(":root,\n.dark {\n  --a: 1;\n}")).toEqual({
      ":root, .dark": { "--a": "1" },
    })
  })

  it("drops comments", () => {
    expect(rulesOf("/* hi */ :root { --a: 1; }")).toEqual({
      ":root": { "--a": "1" },
    })
  })

  it("preserves !important", () => {
    expect(rulesOf(":root { --a: 1 !important; }")).toEqual({
      ":root": { "--a": "1 !important" },
    })
  })
})

describe("mergeCssObjects", () => {
  it("unions selectors and theme vars across stylesheets", () => {
    expect(
      mergeCssObjects([
        cssToRegistryObject(":root { --a: 1; }\n@theme inline { --x: var(--a); }"),
        cssToRegistryObject(":root { --b: 2; }\n@theme inline { --y: var(--b); }"),
      ]),
    ).toEqual({
      css: { ":root": { "--a": "1", "--b": "2" } },
      cssVars: { theme: { x: "var(--a)", y: "var(--b)" } },
    })
  })

  it("does not let an empty at-rule erase an existing body", () => {
    expect(
      mergeCssObjects([
        { css: { "@slot": {} }, cssVars: {} },
        { css: { "@slot": {} }, cssVars: {} },
      ]),
    ).toEqual({ css: { "@slot": {} }, cssVars: {} })
  })
})
