/**
 * Reports the geometry of components in a decoded .fig document.
 *
 * Usage:
 *   node tools/fig-specs.mjs <decodedDir> --pages          list pages
 *   node tools/fig-specs.mjs <decodedDir> --sets <page>    list component sets on a page
 *   node tools/fig-specs.mjs <decodedDir> --spec <regex>   dump specs for matching components
 */
import { readFileSync } from "node:fs"

const dir = process.argv[2]
const nodes = JSON.parse(readFileSync(`${dir}/doc.json`)).nodeChanges

const key = (g) => (g ? `${g.sessionID}:${g.localID}` : null)
const byGuid = new Map(nodes.map((n) => [key(n.guid), n]))
const children = new Map()
for (const n of nodes) {
  const p = key(n.parentIndex?.guid)
  if (!p) continue
  if (!children.has(p)) children.set(p, [])
  children.get(p).push(n)
}

const parentOf = (n) => byGuid.get(key(n.parentIndex?.guid))

function ancestry(n) {
  const chain = []
  let cur = n
  for (let i = 0; cur && i < 50; i++) {
    chain.push(cur)
    cur = parentOf(cur)
  }
  return chain
}

const pageOf = (n) => ancestry(n).find((a) => a.type === "CANVAS")?.name ?? "?"

/** Variable id -> name, so bound fills report a role rather than a hex value. */
const varNames = new Map(
  nodes
    .filter((n) => n.type === "VARIABLE")
    .map((v) => [key(v.guid), v.name]),
)

function paintDesc(p) {
  if (!p) return null
  const bound = p.colorVar?.value?.alias
  const name = bound && varNames.get(key(bound.guid ?? bound))
  if (name) return name
  if (p.color) {
    const { r, g, b, a } = p.color
    const hex =
      "#" +
      [r, g, b]
        .map((c) => Math.round(c * 255).toString(16).padStart(2, "0").toUpperCase())
        .join("")
    return a === 1 ? hex : `${hex}@${a.toFixed(2)}`
  }
  return p.type ?? "paint"
}

function describe(n) {
  const corners = [
    n.rectangleTopLeftCornerRadius,
    n.rectangleTopRightCornerRadius,
    n.rectangleBottomRightCornerRadius,
    n.rectangleBottomLeftCornerRadius,
  ]
  const uniform = corners.every((c) => c === corners[0])

  return {
    name: n.name,
    type: n.type,
    w: n.size?.x,
    h: n.size?.y,
    radius: uniform ? (corners[0] ?? n.cornerRadius) : corners,
    stack: n.stackMode,
    gap: n.stackSpacing,
    // Figma stores padding as left/top plus explicit right/bottom.
    padding: [
      n.stackVerticalPadding,
      n.stackPaddingRight,
      n.stackPaddingBottom,
      n.stackHorizontalPadding,
    ],
    fill: n.fillPaints?.map(paintDesc).filter(Boolean),
    stroke: n.strokePaints?.length
      ? { w: n.strokeWeight, paint: n.strokePaints.map(paintDesc) }
      : undefined,
    fontSize: n.fontSize,
    lineHeight: n.lineHeight?.value,
    letterSpacing: n.letterSpacing?.value,
    weight: n.fontName?.style,
    text: n.textData?.characters?.slice(0, 40),
  }
}

const clean = (o) =>
  Object.fromEntries(
    Object.entries(o).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        !(Array.isArray(v) && v.every((x) => x === undefined || x === null)),
    ),
  )

function dump(n, depth = 0, max = 3) {
  console.log("  ".repeat(depth) + JSON.stringify(clean(describe(n))))
  if (depth >= max) return
  for (const c of children.get(key(n.guid)) ?? []) dump(c, depth + 1, max)
}

const [, , , mode, arg] = process.argv

if (mode === "--pages") {
  for (const c of nodes.filter((n) => n.type === "CANVAS")) console.log(c.name)
} else if (mode === "--sets") {
  const seen = new Set()
  for (const n of nodes) {
    if (n.type !== "SYMBOL" || pageOf(n) !== arg) continue
    const p = parentOf(n)
    const label = p?.name ?? "(loose)"
    if (seen.has(label)) continue
    seen.add(label)
    console.log(label)
  }
} else if (mode === "--spec") {
  const re = new RegExp(arg, "i")
  let count = 0
  for (const n of nodes) {
    if (n.type !== "SYMBOL" || !re.test(n.name)) continue
    if (count++ > 12) break
    console.log(`\n=== [${pageOf(n)}] ${parentOf(n)?.name ?? ""} :: ${n.name}`)
    dump(n)
  }
  if (!count) console.log("no match")
} else {
  console.log("modes: --pages | --sets <page> | --spec <regex>")
}
