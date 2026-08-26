import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

import { App } from "./App"
import { ProductScreen } from "./ProductScreen"

/**
 * Two views: the token gallery, and one product-shaped screen.
 *
 * The gallery shows each piece; the screen shows them competing for the same
 * layout, which is where spacing, elevation, and overlay ordering problems
 * actually surface. The hash is enough of a router for a dev app.
 *
 * It lives here rather than in `main.tsx` for the same Fast Refresh reason the
 * library keeps `cva()` out of component files: a module is only a hot boundary
 * when everything it exports is a component.
 */
export function Playground() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const screen = hash === "#/screen"

  return (
    <>
      <div className="fixed top-2 right-2 z-(--m3-z-sticky)">
        <Button
          variant="tonal"
          size="xs"
          // Rendering as an anchor means it is no longer a native button, and
          // Base UI warns unless it is told so.
          nativeButton={false}
          render={<a href={screen ? "#/" : "#/screen"} />}
        >
          {screen ? "Token gallery" : "Product screen"}
        </Button>
      </div>
      {screen ? <ProductScreen /> : <App />}
    </>
  )
}
