/**
 * Extracts the M3 variable collections (color schemes, shape, type scale) from
 * a decoded .fig document into plain JSON.
 *
 * Usage: node tools/fig-tokens.mjs <decodedDir> > tokens.json
 */
import { readFileSync } from "node:fs"

const dir = process.argv[2]
const nodes = JSON.parse(readFileSync(`${dir}/doc.json`)).nodeChanges

const key = (g) => (g ? `${g.sessionID}:${g.localID}` : null)

/* Mode id -> human name, per variable set. */
const modeNames = new Map()
for (const set of nodes.filter((n) => n.type === "VARIABLE_SET")) {
  // `variableSetModes` is the mode array itself in current .fig versions;
  // older ones nested it under `.modes`.
  const modes = Array.isArray(set.variableSetModes)
    ? set.variableSetModes
    : (set.variableSetModes?.modes ?? [])
  for (const m of modes) {
    modeNames.set(key(m.id), m.name)
  }
}

const hex = ({ r, g, b }) =>
  "#" +
  [r, g, b]
    .map((c) => Math.round(c * 255).toString(16).padStart(2, "0").toUpperCase())
    .join("")

const out = {}

for (const v of nodes.filter((n) => n.type === "VARIABLE")) {
  const entry = (out[v.name] ??= {})
  for (const e of v.variableDataValues?.entries ?? []) {
    const mode = modeNames.get(key(e.modeID))
    if (!mode) continue
    const data = e.variableData
    const value = data?.value

    if (value?.colorValue) {
      entry[mode] = hex(value.colorValue)
      if (value.colorValue.a !== 1) entry[mode] += ` (a=${value.colorValue.a})`
    } else if (value?.alias) {
      entry[mode] = { alias: key(value.alias.guid ?? value.alias) }
    } else if (value !== undefined) {
      // Numbers, strings, and booleans arrive under a typed key.
      const [, raw] = Object.entries(value)[0] ?? []
      entry[mode] = raw
    }
  }
}

process.stdout.write(JSON.stringify(out, null, 2))
