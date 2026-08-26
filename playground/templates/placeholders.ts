/**
 * Deterministic gradient images, as data URIs.
 *
 * The gallery and dashboard templates need more pictures than the repo has
 * assets, and a demo should not reach for the network. These are literal hex
 * rather than `var(--m3-*)`: an SVG in a `data:` URI is its own document and
 * cannot see the page's custom properties, so a token reference would resolve
 * to nothing. Photographs do not swap with the theme either, which is the
 * behaviour being stood in for.
 */
const PAIRS = [
  ["#6750a4", "#d0bcff"],
  ["#7d5260", "#ffd8e4"],
  ["#386a20", "#b6f2a0"],
  ["#00639b", "#c2e7ff"],
  ["#8b5000", "#ffddb0"],
  ["#4a4458", "#e8def8"],
  ["#006874", "#9eeffd"],
  ["#984061", "#ffd9e2"],
] as const

/**
 * A gradient tile keyed by index, so the same slot draws the same picture on
 * every render and screenshots stay comparable across runs.
 */
export function gradient(index: number, width = 800, height = 600) {
  const [from, to] = PAIRS[index % PAIRS.length]
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>`,
    `</linearGradient></defs>`,
    `<rect width="${width}" height="${height}" fill="url(#g)"/>`,
    `<circle cx="${width * 0.72}" cy="${height * 0.28}" r="${height * 0.22}" fill="${to}" fill-opacity="0.35"/>`,
    `</svg>`,
  ].join("")

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
