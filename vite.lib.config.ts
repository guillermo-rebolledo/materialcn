import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import dts from "vite-plugin-dts"
import type { Plugin } from "vite"

/**
 * `import "materialcn/styles.css"` is a side-effect import with no type
 * declaration, which TypeScript rejects outright (TS2882) in any consumer on
 * `moduleResolution: bundler`. A `.d.css.ts` sibling is the resolution TS
 * looks for, and `exports["./styles.css"].types` points it here.
 */
function cssTypes(): Plugin {
  return {
    name: "materialcn:css-types",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "styles.d.css.ts",
        source: "declare const styles: string\nexport default styles\n",
      })
    },
  }
}

/**
 * Distributable build. Emits:
 *   dist/index.js     ESM bundle
 *   dist/index.d.ts   types
 *   dist/styles.css   tokens, @theme mapping, and every utility the
 *                     components use — so consumers without Tailwind still
 *                     get a working stylesheet
 *
 * The font stylesheet is deliberately NOT built here. Vite's lib mode inlines
 * every asset as a data URI regardless of `assetsInlineLimit`, which would
 * base64 all six Roboto Flex subsets into one file and defeat unicode-range
 * subsetting. `materialcn/fonts.css` is exported as source instead, so the
 * consumer's own bundler emits the woff2 files with correct URLs.
 */
export default defineConfig({
  plugins: [
    cssTypes(),
    react(),
    tailwindcss(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // Lib mode defaults this off, which rejects a CSS entry point.
    cssCodeSplit: true,
    // The playground's public/ has nothing the package should ship.
    copyPublicDir: false,
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, "src/index.ts"),
        styles: path.resolve(import.meta.dirname, "src/index.css"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      // Anything the consumer already has, or should own a single copy of.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@base-ui\/react/,
        "class-variance-authority",
        "clsx",
        "lucide-react",
        "tailwind-merge",
      ],
      output: {
        assetFileNames: (asset) => {
          const name = asset.names?.[0] ?? ""
          // The entry stylesheet keeps a stable name so `exports` can point
          // at it; anything else stays hashed.
          if (name === "styles.css") return "styles.css"
          return "assets/[name]-[hash][extname]"
        },
      },
    },
  },
})
