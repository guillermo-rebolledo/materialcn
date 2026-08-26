import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  // Stories live next to the components they document.
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  /*
   * `react-docgen-typescript` rather than the default `react-docgen`.
   *
   * The default parses the source without a type checker, so it stops at the
   * first thing it cannot resolve locally: every component here declares its
   * props as an intersection with `VariantProps<typeof xVariants>` or a Base UI
   * `Props` type, and none of those were reaching the tables. `Icon` documented
   * `children` and `label` and silently omitted `size`, which is the prop
   * anyone reading the page came for.
   *
   * The cost is a slower docs build, since it runs the compiler. That is the
   * right trade for a reference that is otherwise wrong by omission.
   *
   * One known gap remains: where a prop name collides with a React DOM
   * attribute — `Link`'s `href` and `color` against `AnchorHTMLAttributes` —
   * docgen reports React as the owning declaration, so the library's version
   * is not distinguishable from the hundreds of attributes the filter exists
   * to remove. Those two are documented in the component's own doc block
   * instead.
   */
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      /*
       * The root tsconfig is a solution file — `files: []` plus project
       * references — so a resolver pointed at it sees an empty program and
       * skips every component without failing the build. Point it at the
       * project that actually contains `src`.
       */
      tsconfigPath: "./tsconfig.app.json",
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      /*
       * Drop React's own DOM attributes — several hundred rows of `onCopy`,
       * `about`, `vocab` per component, which bury the handful of props the
       * component actually defines. Base UI's props are deliberately kept:
       * `render`, `nativeButton`, and the popup positioning props are part of
       * the API a consumer uses.
       */
      propFilter: (prop) => {
        /*
         * Keep anything this library or a library it composes declares; drop
         * only what is *exclusively* React's own DOM surface.
         *
         * Filtering on `prop.parent` alone is not enough. Where a name exists
         * on both sides of an intersection — `Link` declares `href` and
         * `color`, and so does `AnchorHTMLAttributes` — the reported parent is
         * React's, so the documented version was thrown away in favour of
         * nothing at all.
         */
        const REACT_OWN = /node_modules\/(@types\/react|typescript)\//

        const declarations = prop.declarations ?? []

        // Declared here: keep it, whatever React also calls the name.
        if (
          declarations.some(
            (declaration) =>
              declaration.fileName.includes("/src/") &&
              !declaration.fileName.includes("node_modules")
          )
        ) {
          return true
        }

        // Declared somewhere that is not React's DOM surface — a variant type,
        // a Base UI part — keep that too.
        if (declarations.length > 0) {
          return !declarations.every((declaration) =>
            REACT_OWN.test(declaration.fileName)
          )
        }

        const declaredIn = prop.parent?.fileName ?? ""
        return !declaredIn || !REACT_OWN.test(declaredIn)
      },
    },
  },
  // Vite config (Tailwind plugin + the `@` alias) is inherited from
  // vite.config.ts, so there is nothing to duplicate here.
}

export default config
