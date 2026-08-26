# 009 — Extract a shared media-query hook for reduced motion

- **Status**: TODO
- **Commit**: 8872ab1
- **Severity**: — (missed opportunity; additive)
- **Category**: Maintainability & architecture
- **Rule**: Beyond the scan
- **Estimated scope**: 1 new file, 2 files edited

## Problem

Two components hand-roll the same `matchMedia` subscription with
`useState` + `useEffect` + an event listener.

    // src/components/ui/carousel.tsx:78-94 — current
    function usePrefersReducedMotion() {
      const [prefersReducedMotion, setPrefersReducedMotion] = useState(
        () =>
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      )

      useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)")
        const updatePreference = () => setPrefersReducedMotion(query.matches)
        updatePreference()
        query.addEventListener("change", updatePreference)
        return () => query.removeEventListener("change", updatePreference)
      }, [])

      return prefersReducedMotion
    }

    // src/components/theme-provider.tsx:33-41 — current (same shape, different query)
    const [system, setSystem] = useState<"light" | "dark">(systemTheme)

    useEffect(() => {
      const query = window.matchMedia("(prefers-color-scheme: dark)")
      const onChange = () => setSystem(query.matches ? "dark" : "light")
      query.addEventListener("change", onChange)
      return () => query.removeEventListener("change", onChange)
    }, [])

Three reasons this is worth consolidating rather than left alone:

1. `useSyncExternalStore` is the purpose-built primitive for subscribing to an
   external store like `matchMedia`. It is SSR-safe by construction via its
   server-snapshot argument, which matters for a published library — consumers
   will render this in Next.js and elsewhere.
2. The carousel copy sets state during the effect body (`updatePreference()` on
   mount) purely to cover the gap between the `useState` initializer and the
   subscription — a gap `useSyncExternalStore` does not have.
3. Motion is a first-class concern in this repo. CLAUDE.md devotes two sections
   to spring tokens and clamped-property rules, and components already emit
   `motion-reduce:` utilities. More components will need this, so the third
   caller is likely rather than hypothetical.

This is additive: it fixes no reported defect. Its value is that the next
component needing a media query does not write a fourth copy.

## Target

A single hook built on `useSyncExternalStore`, plus a named wrapper for the
reduced-motion query:

    // src/lib/use-media-query.ts — new
    import { useCallback, useSyncExternalStore } from "react"

    /**
     * Subscribes to a CSS media query.
     *
     * Built on `useSyncExternalStore` so the server snapshot is explicit: SSR
     * renders as `false` and hydrates to the real value without a mismatch.
     */
    function useMediaQuery(query: string): boolean {
      const subscribe = useCallback(
        (onStoreChange: () => void) => {
          const list = window.matchMedia(query)
          list.addEventListener("change", onStoreChange)
          return () => list.removeEventListener("change", onStoreChange)
        },
        [query],
      )

      return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false,
      )
    }

    function usePrefersReducedMotion(): boolean {
      return useMediaQuery("(prefers-reduced-motion: reduce)")
    }

    export { useMediaQuery, usePrefersReducedMotion }

`carousel.tsx` then imports `usePrefersReducedMotion` and deletes its local
copy. `theme-provider.tsx` replaces its `system` state and effect with:

    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
    const system = prefersDark ? "dark" : "light"

…and drops both the `systemTheme()` helper and the subscription effect. Note
`theme-provider.tsx` keeps its *other* effect (the one applying the
`light`/`dark` class to the target element) untouched.

## Repo conventions to follow

- Shared non-component utilities live in `src/lib/` — see `src/lib/utils.ts`.
- **Hooks must not live in component files.** CLAUDE.md: "Keep new `cva()`
  definitions and non-component exports out of component files", because a
  module is only a Fast Refresh boundary when every export is a component or
  keeps a stable identity. `useTheme` lives in `theme-context.ts` for exactly
  this reason — that is the exemplar to imitate.
- Follow the JSDoc comment style used on the components in `src/components/ui/`.

## Steps

1. Create `src/lib/use-media-query.ts` with the exact code above.
2. In `carousel.tsx`, delete the local `usePrefersReducedMotion` (lines 78-94)
   and import the shared one. Confirm `useState`/`useEffect` are still used
   elsewhere in the file before removing them from the import.
3. In `theme-provider.tsx`, replace the `system` state and its subscription
   effect with `useMediaQuery`, and delete the now-unused `systemTheme` helper.
   Leave the class-applying effect alone.
4. Decide whether `useMediaQuery` / `usePrefersReducedMotion` are public API. If
   yes, export them from `src/index.ts` — CLAUDE.md requires new public
   components to be added to the barrel. If no, leave them internal. **Make this
   choice deliberately and say which you chose.**
5. Re-read the diff and remove unrelated churn.

## Boundaries

- Do NOT change any component's rendered output or public props.
- Do NOT alter the theme-persistence logic, the `storageKey` handling, or the
  effect that applies the `light`/`dark` class.
- Do NOT change the `"system"` behavior described in the comment at
  `theme-provider.tsx:47` — leaving both classes off on `"system"` is
  deliberate and load-bearing for SSR.
- Do NOT put the hook in a component file.
- Do NOT add a dependency.

## Verification

- **Mechanical**:
  - `pnpm typecheck && pnpm build && pnpm test` pass.
  - `npx react-doctor@latest --scope changed` introduces no new diagnostic and
    the score does not regress.
- **Behavior check**:
  - Set the OS "Reduce motion" preference on, open the Carousel story, and
    confirm scrolling is instant (Embla `duration: 0`). Toggle the OS setting
    **while the story is open** and confirm the change takes effect without a
    reload — this is what the subscription is for.
  - With `ThemeProvider` on `defaultTheme="system"`, toggle OS dark mode and
    confirm the theme follows live.
  - Confirm the explicit `light` / `dark` settings still override the system
    preference, and that the choice still persists across a reload via
    `localStorage`.
  - Run a story with `parameters: { sideBySide: true }` to confirm the token
    layer still renders light and dark correctly.
- **Done when**: one hook exists in `src/lib/`, both callers use it, no
  `matchMedia` subscription remains duplicated, live OS toggles still work for
  both motion and color scheme, and the public-API decision is recorded.
