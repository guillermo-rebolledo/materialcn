/**
 * Produces a spec sheet for the components we mirror, from a decoded .fig.
 *
 * Figma nests M3 components as SYMBOL > Content (fill + radius) > State-layer
 * (padding + gap) > children, so the numbers a stylesheet needs are spread
 * across three levels. This flattens them into one row per variant.
 *
 * Usage: node tools/fig-report.mjs <decodedDir> [nameRegex]
 */
import { readFileSync } from "node:fs"

const dir = process.argv[2]
const filter = process.argv[3] ? new RegExp(process.argv[3], "i") : null
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
const kidsOf = (n) => children.get(key(n.guid)) ?? []
const parentOf = (n) => byGuid.get(key(n.parentIndex?.guid))

const varNames = new Map(
  nodes.filter((n) => n.type === "VARIABLE").map((v) => [key(v.guid), v.name]),
)

function paint(p) {
  const alias = p?.colorVar?.value?.alias
  const named = alias && varNames.get(key(alias.guid ?? alias))
  if (named) return named.replace(/^Schemes\//, "").replace(/^State Layers\//, "SL/")
  if (p?.color) {
    const { r, g, b, a } = p.color
    const hex =
      "#" +
      [r, g, b]
        .map((c) => Math.round(c * 255).toString(16).padStart(2, "0").toUpperCase())
        .join("")
    return a === 1 ? hex : `${hex}@${a.toFixed(2)}`
  }
  return null
}

const paints = (n, field = "fillPaints") =>
  n?.[field]?.map(paint).filter(Boolean).join(",") || null

/** First descendant of a type, breadth-first, bounded. */
function find(n, pred, depth = 4) {
  const queue = [[n, 0]]
  while (queue.length) {
    const [cur, d] = queue.shift()
    if (cur !== n && pred(cur)) return cur
    if (d >= depth) continue
    for (const c of kidsOf(cur)) queue.push([c, d + 1])
  }
  return null
}

function spec(sym) {
  const content =
    find(sym, (n) => n.fillPaints?.length || n.strokePaints?.length, 2) ?? sym
  const layer =
    find(sym, (n) => /state-?layer/i.test(n.name), 3) ??
    find(sym, (n) => n.stackHorizontalPadding != null, 3)
  const text = find(sym, (n) => n.type === "TEXT", 4)

  return {
    variant: sym.name,
    w: sym.size?.x,
    h: sym.size?.y,
    radius:
      content.rectangleTopLeftCornerRadius ?? content.cornerRadius ?? null,
    radiusBR: content.rectangleBottomRightCornerRadius ?? null,
    padX: layer?.stackHorizontalPadding ?? null,
    padR: layer?.stackPaddingRight ?? null,
    padY: layer?.stackVerticalPadding ?? null,
    gap: layer?.stackSpacing ?? null,
    fill: paints(content),
    stroke: content.strokePaints?.length
      ? `${content.strokeWeight}px ${paints(content, "strokePaints")}`
      : null,
    font: text ? `${text.fontSize}/${text.lineHeight?.value} ${text.fontName?.style ?? ""}`.trim() : null,
    fg: paints(text),
  }
}

/* Group variants by their component set. */
const sets = new Map()
for (const n of nodes) {
  if (n.type !== "SYMBOL") continue
  const parent = parentOf(n)
  if (parent?.type !== "FRAME") continue
  const name = parent.name
  if (filter && !filter.test(name)) continue
  if (!sets.has(name)) sets.set(name, [])
  sets.get(name).push(n)
}

const pad = (v, n) => String(v ?? "-").padEnd(n)

for (const [name, variants] of sets) {
  const enabled = variants.filter(
    (v) => !/State=(Disabled|Hovered|Focused|Pressed|Dragged)/i.test(v.name),
  )
  if (!enabled.length) continue

  console.log(`\n## ${name}`)
  for (const v of enabled.slice(0, 14)) {
    const s = spec(v)
    console.log(
      `  ${pad(s.variant, 50)} ${pad(s.w + "x" + s.h, 10)} r=${pad(s.radius, 5)} ` +
        `pad=${pad(`${s.padY}/${s.padX}`, 10)} gap=${pad(s.gap, 4)} ` +
        `font=${pad(s.font, 18)} fill=${pad(s.fill, 26)} fg=${pad(s.fg, 24)} ${s.stroke ? "stroke=" + s.stroke : ""}`,
    )
  }
}
