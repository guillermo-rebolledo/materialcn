/*
 * `import "materialcn/fonts.css"` is a side-effect import, which TypeScript
 * rejects outright (TS2882) without a declaration to resolve. fonts.css ships
 * as source rather than through the build (see vite.lib.config.ts), so its
 * declaration is committed beside it instead of emitted.
 */
declare const styles: string
export default styles
