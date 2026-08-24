import { Toast as ToastPrimitive } from "@base-ui/react/toast"

/** Material-specific presentation options carried by Base UI's toast manager. */
type SnackbarData = {
  /** Add the kit's trailing 48dp close affordance. */
  dismissible?: boolean
  /** Put a longer action below the message instead of beside it. */
  layout?: "auto" | "stacked"
}

/**
 * Creates an isolated snackbar manager, useful for nested apps and previews.
 * Most applications should use the exported global `toast` manager instead.
 */
function createToastManager() {
  return ToastPrimitive.createToastManager<SnackbarData>()
}

/** App-wide imperative manager. Mount one `Toaster`, then call `toast.add()`. */
const toast = createToastManager()

function useToastManager() {
  return ToastPrimitive.useToastManager<SnackbarData>()
}

export { createToastManager, toast, useToastManager }
export type { SnackbarData }
