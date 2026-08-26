/**
 * How serious the message is.
 *
 * Material's baseline scheme has no success or warning colour role, so those
 * two borrow the container pair closest in meaning — see alert-variants.ts.
 */
export type AlertSeverity = "info" | "success" | "warning" | "error"
