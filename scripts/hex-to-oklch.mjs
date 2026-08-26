// Minimal sRGB -> OKLCH conversion (Björn Ottosson's Oklab).
function srgbToLinear(c) {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function hexToOklchValues(hex) {
  const h = hex.replace("#", "")
  const r = srgbToLinear(parseInt(h.slice(0, 2), 16))
  const g = srgbToLinear(parseInt(h.slice(2, 4), 16))
  const b = srgbToLinear(parseInt(h.slice(4, 6), 16))

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const C = Math.sqrt(A * A + B * B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360

  return { L, C, H }
}

const round = (n, p) => Number(n.toFixed(p))

/** An OKLCH triple as the CSS value that ships. */
export function formatOklch({ L, C, H }) {
  return C < 0.0005
    ? `oklch(${round(L, 4)} 0 0)`
    : `oklch(${round(L, 4)} ${round(C, 4)} ${round(H, 2)})`
}

export function hexToOklch(hex) {
  return formatOklch(hexToOklchValues(hex))
}

function linearToSrgb(c) {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
  return Math.min(1, Math.max(0, v))
}

/**
 * OKLCH to linear-light sRGB, unclamped — so a caller can tell "outside the
 * gamut" from "sitting exactly on its edge".
 */
export function oklchToLinear(L, C, H) {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

/**
 * The inverse of `hexToOklch`, so a check can measure the colours that
 * actually ship rather than the hex they were authored from.
 *
 * Returns linear-light sRGB in 0..1 *and* the gamma-encoded channels: WCAG's
 * relative luminance is defined on the linear values, and rounding to 8-bit
 * first is a needless source of disagreement.
 */
export function oklchToSrgb(L, C, H) {
  const linear = oklchToLinear(L, C, H).map((c) => Math.min(1, Math.max(0, c)))
  return { linear, srgb: linear.map(linearToSrgb) }
}

/** Whether an OKLCH triple can be shown in sRGB without being clipped. */
export function inSrgbGamut(L, C, H) {
  const EPSILON = 1e-4
  return oklchToLinear(L, C, H).every((c) => c >= -EPSILON && c <= 1 + EPSILON)
}

/**
 * Pulls chroma down until the colour fits in sRGB, holding lightness and hue.
 *
 * The gamut is not a cylinder: the lightness and chroma that fit a violet can
 * fall outside it once the hue rotates to a green. Letting the channels clip
 * instead would shift the lightness silently — and lightness is the one
 * property the derived palettes exist to preserve.
 */
export function fitToSrgb({ L, C, H }) {
  if (inSrgbGamut(L, C, H)) return { L, C, H }

  let low = 0
  let high = C
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2
    if (inSrgbGamut(L, mid, H)) low = mid
    else high = mid
  }
  return { L, C: low, H }
}

/** WCAG 2.1 relative luminance. */
export function luminance([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.1 contrast ratio, 1..21. */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
