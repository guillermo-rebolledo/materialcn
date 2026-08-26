/**
 * Every role pairing a consumer is expected to set text in, and the threshold
 * each is held to.
 *
 * Shared by the generator and the checker on purpose. The generator uses it to
 * correct a derived palette while it is being built; the checker uses it to
 * measure the CSS that actually shipped. One list means the two cannot drift
 * into disagreeing about what "correct" is — and the checker still reads the
 * emitted file, so it would catch a generator that produced something other
 * than what it intended.
 */

/** The full surface ramp: anything `on-surface` is legitimately set against. */
export const SURFACES = [
  "surface",
  "background",
  "surface-dim",
  "surface-bright",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
]

export const ACCENTS = ["primary", "secondary", "tertiary", "error"]

export const AA_NORMAL_TEXT = 4.5

/**
 * Strokes that identify a control are held to WCAG's non-text threshold. That
 * is a different bar for a different job, not a lowered version of the text
 * one — nothing that carries text is checked against it.
 */
export const STROKES = [{ content: "outline", container: "surface", min: 3 }]

/**
 * Derived rather than listed, so a role added to the palette cannot quietly
 * escape the check.
 */
export function pairings() {
  const pairs = []
  const add = (content, container) =>
    pairs.push({ content, container, min: AA_NORMAL_TEXT })

  for (const accent of ACCENTS) {
    add(`on-${accent}`, accent)
    add(`on-${accent}-container`, `${accent}-container`)
  }

  // The surface ramp exists so a container can be lifted without changing its
  // content colour, which is a promise about contrast at every step of it.
  for (const surface of SURFACES) {
    add("on-surface", surface)
    add("on-surface-variant", surface)
  }
  add("on-surface-variant", "surface-variant")
  add("on-surface", "surface-variant")

  // Fixed roles hold one value across schemes; both their content roles are
  // specified against both the base and the dim step.
  for (const accent of ["primary", "secondary", "tertiary"]) {
    for (const container of [`${accent}-fixed`, `${accent}-fixed-dim`]) {
      add(`on-${accent}-fixed`, container)
      add(`on-${accent}-fixed-variant`, container)
    }
  }

  // The inverse pair is the snackbar: its label and its action label.
  add("inverse-on-surface", "inverse-surface")
  add("inverse-primary", "inverse-surface")

  return pairs
}

/** Every pairing, text and stroke alike. */
export const allPairings = () => [...pairings(), ...STROKES]
