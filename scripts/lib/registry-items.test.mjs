import { describe, expect, it } from "vitest"

import { deriveItems, findCycle, importsOf, isShipped } from "./registry-items.mjs"

const ui = (name, source) => ({ path: `src/components/ui/${name}`, source })

describe("isShipped", () => {
  it("ships components and their helpers", () => {
    expect(isShipped("src/components/ui/button.tsx")).toBe(true)
    expect(isShipped("src/components/ui/button-variants.ts")).toBe(true)
    expect(isShipped("src/components/ui/alert.types.ts")).toBe(true)
  })

  it("excludes stories, compile-time type fixtures and docs", () => {
    expect(isShipped("src/components/ui/button.stories.tsx")).toBe(false)
    expect(isShipped("src/components/ui/fab.types.tsx")).toBe(false)
    expect(isShipped("src/components/ui/anatomy.mdx")).toBe(false)
  })
})

describe("importsOf", () => {
  it("reads import and re-export specifiers", () => {
    const source = [
      'import { cn } from "@/lib/utils"',
      'import * as React from "react"',
      'export { useTheme } from "./theme-context"',
      'export type Props = { x: string }',
    ].join("\n")

    expect(importsOf(source)).toEqual(["@/lib/utils", "react", "./theme-context"])
  })

  it("reads an import clause that spans several lines", () => {
    const source = [
      "import {",
      "  ButtonGroupContext,",
      "  type ButtonGroupButtonDefaults,",
      '} from "./button-group-context"',
    ].join("\n")

    expect(importsOf(source)).toEqual(["./button-group-context"])
  })

  it("ignores a commented-out import", () => {
    expect(importsOf('// import { x } from "./nope"')).toEqual([])
  })

  it("does not mistake a type alias for an import clause", () => {
    const source = [
      'export type ToolbarVariant = "floating" | "docked"',
      "",
      'import { Separator } from "./separator"',
    ].join("\n")

    expect(importsOf(source)).toEqual(["./separator"])
  })

  it("ignores a specifier inside a string that is not an import", () => {
    expect(importsOf('const help = `run from "./nowhere"`')).toEqual([])
  })
})

describe("deriveItems", () => {
  it("bundles a component with its variants sibling, entry point first", () => {
    const [item] = deriveItems({
      files: [
        ui("button-variants.ts", ""),
        ui("button.tsx", 'import { buttonVariants } from "./button-variants"'),
      ],
    })

    expect(item.name).toBe("button")
    expect(item.type).toBe("registry:ui")
    expect(item.files.map((file) => file.path)).toEqual([
      "src/components/ui/button.tsx",
      "src/components/ui/button-variants.ts",
    ])
    expect(item.registryDependencies).toEqual([])
  })

  it("gives the longer component name the ambiguous helper", () => {
    const items = deriveItems({
      files: [
        ui("button.tsx", ""),
        ui("button-group.tsx", 'import { x } from "./button-group-context"'),
        ui("button-group-context.ts", ""),
      ],
    })

    const group = items.find((item) => item.name === "button-group")
    expect(group.files.map((file) => file.path)).toContain(
      "src/components/ui/button-group-context.ts",
    )
  })

  it("makes a helper shared by two components its own item", () => {
    const items = deriveItems({
      files: [
        ui("navigation-context.ts", ""),
        ui("navigation-bar.tsx", 'import { x } from "./navigation-context"'),
        ui("navigation-rail.tsx", 'import { x } from "./navigation-context"'),
      ],
    })

    expect(items.map((item) => item.name)).toEqual([
      "navigation-bar",
      "navigation-context",
      "navigation-rail",
    ])
    expect(items[0].registryDependencies).toEqual(["navigation-context"])
    expect(items[2].registryDependencies).toEqual(["navigation-context"])
  })

  it("promotes a helper shared by two items, breaking the cycle it would form", () => {
    // Button consumes the group's context; the context reads Button's
    // variants. Left bundled, `button` and `button-group` import each other.
    const items = deriveItems({
      files: [
        ui("button-variants.ts", ""),
        ui("button-group-variants.ts", ""),
        ui("button-group-context.ts", 'import type { buttonVariants } from "./button-variants"'),
        ui("button.tsx", [
          'import { ButtonGroupContext } from "./button-group-context"',
          'import { buttonVariants } from "./button-variants"',
        ].join("\n")),
        ui("button-group.tsx", [
          'import { ButtonGroupContext } from "./button-group-context"',
          'import { buttonGroupVariants } from "./button-group-variants"',
        ].join("\n")),
      ],
    })

    expect(items.map((item) => item.name)).toEqual([
      "button",
      "button-group",
      "button-group-context",
      "button-variants",
    ])
    expect(findCycle(items)).toBeNull()
    // The group keeps the variants only it uses.
    expect(items[1].files.map((file) => file.path)).toEqual([
      "src/components/ui/button-group.tsx",
      "src/components/ui/button-group-variants.ts",
    ])
  })

  it("keeps a helper that imports its own component bundled with it", () => {
    const items = deriveItems({
      files: [
        ui("time-picker-utils.ts", 'import type { TimeValue } from "./time-picker"'),
        ui("time-picker.tsx", 'import { isValidTime } from "./time-picker-utils"'),
        ui("time-dial.tsx", 'import { isValidTime } from "./time-picker-utils"'),
      ],
    })

    expect(items.map((item) => item.name)).toEqual(["time-dial", "time-picker"])
    expect(findCycle(items)).toBeNull()
    expect(items[0].registryDependencies).toEqual(["time-picker"])
  })

  it("throws on an alias import that resolves to nothing", () => {
    expect(() =>
      deriveItems({ files: [ui("button.tsx", 'import { x } from "@/lib/typo"')] }),
    ).toThrow(/resolves to nothing/)
  })

  it("records a cross-item sibling import as a registry dependency", () => {
    const items = deriveItems({
      files: [ui("button.tsx", ""), ui("chip.tsx", 'import { Badge } from "./button"')],
    })

    expect(items.find((item) => item.name === "chip").registryDependencies).toEqual(["button"])
  })

  it("adds findCycle coverage for a real cycle", () => {
    const items = [
      { name: "a", registryDependencies: ["b"] },
      { name: "b", registryDependencies: ["a"] },
    ]

    expect(findCycle(items)).toEqual(["a", "b", "a"])
  })

  it("resolves the alias forms shadcn rewrites", () => {
    const items = deriveItems({
      files: [
        { path: "src/lib/utils.ts", source: "" },
        { path: "src/components/theme-context.ts", source: "" },
        ui("toast.tsx", [
          'import { cn } from "@/lib/utils"',
          'import { ThemeContext } from "@/components/theme-context"',
          'import { Button } from "@/components/ui/button"',
        ].join("\n")),
        ui("button.tsx", ""),
      ],
    })

    expect(items.find((item) => item.name === "toast").registryDependencies).toEqual([
      "button",
      "theme-context",
      "utils",
    ])
  })

  it("types files by the directory they come from", () => {
    const items = deriveItems({
      files: [
        { path: "src/lib/utils.ts", source: "" },
        { path: "src/components/theme-provider.tsx", source: "" },
        ui("button.tsx", ""),
      ],
    })

    expect(items.map((item) => [item.name, item.type])).toEqual([
      ["button", "registry:ui"],
      ["theme-provider", "registry:component"],
      ["utils", "registry:lib"],
    ])
  })

  it("pins npm dependencies to the version this repo builds against", () => {
    const [item] = deriveItems({
      files: [ui("toggle.tsx", 'import { Toggle } from "@base-ui/react/toggle"')],
      versions: { "@base-ui/react": "^1.7.0" },
    })

    expect(item.dependencies).toEqual(["@base-ui/react@^1.7.0"])
  })

  it("leaves an unpinned package unversioned", () => {
    const [item] = deriveItems({
      files: [ui("icon.tsx", 'import { X } from "lucide-react"')],
    })

    expect(item.dependencies).toEqual(["lucide-react"])
  })

  it("never installs react, which the consumer already has", () => {
    const [item] = deriveItems({
      files: [ui("list.tsx", 'import * as React from "react"')],
    })

    expect(item.dependencies).toEqual([])
  })

  it("gives the shared dependencies to anything that renders markup", () => {
    const items = deriveItems({
      files: [ui("button.tsx", 'import { cn } from "@/lib/utils"'), { path: "src/lib/utils.ts", source: "" }],
      sharedRegistryDependencies: ["materialcn-theme"],
    })

    expect(items.find((item) => item.name === "button").registryDependencies).toEqual([
      "materialcn-theme",
      "utils",
    ])
  })

  it("spares a library the shared dependencies, so `add utils` stays small", () => {
    const items = deriveItems({
      files: [
        { path: "src/lib/utils.ts", source: "" },
        ui("navigation-context.ts", ""),
      ],
      sharedRegistryDependencies: ["materialcn-theme"],
    })

    expect(items.map((item) => [item.name, item.registryDependencies])).toEqual([
      ["navigation-context", []],
      ["utils", []],
    ])
  })

  it("does not make a shared dependency depend on itself", () => {
    const items = deriveItems({
      files: [ui("materialcn-theme.tsx", "")],
      sharedRegistryDependencies: ["materialcn-theme"],
    })

    expect(items[0].registryDependencies).toEqual([])
  })
})
