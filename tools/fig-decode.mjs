/**
 * Minimal decoder for Figma's `.fig` container.
 *
 * A .fig is a zip whose `canvas.fig` is Figma's "fig-kiwi" format: an 8-byte
 * magic, a version, then length-prefixed blocks. Block 0 is a self-describing
 * Kiwi schema; block 1 is the document, zstd-compressed in recent versions
 * (older files used raw deflate — both are handled).
 *
 * Because the schema is self-describing we can decode the document without
 * knowing Figma's internals ahead of time.
 *
 * Usage: node tools/fig-decode.mjs <file.fig> <outDir>
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { execFileSync } from "node:child_process"
import zlib from "node:zlib"
import path from "node:path"

/* ------------------------------------------------------------ byte reader */

class Reader {
  constructor(buf) {
    this.buf = buf
    this.off = 0
  }
  byte() {
    return this.buf[this.off++]
  }
  bool() {
    return this.byte() !== 0
  }
  varuint() {
    let value = 0
    let shift = 0
    let b
    do {
      b = this.buf[this.off++]
      value |= (b & 0x7f) << shift
      shift += 7
    } while (b & 0x80 && shift < 35)
    return value >>> 0
  }
  varint() {
    const v = this.varuint()
    // Kiwi zigzags signed ints.
    return v & 1 ? ~(v >>> 1) : v >>> 1
  }
  varuint64() {
    let value = 0n
    let shift = 0n
    let b
    do {
      b = this.buf[this.off++]
      value |= BigInt(b & 0x7f) << shift
      shift += 7n
    } while (b & 0x80)
    return value
  }
  varint64() {
    const v = this.varuint64()
    return v & 1n ? -(v >> 1n) - 1n : v >> 1n
  }
  float() {
    // Kiwi's float is a byte-reversed IEEE754 with a 0 shortcut.
    const first = this.buf[this.off]
    if (first === 0) {
      this.off++
      return 0
    }
    const bits = this.buf.readUInt32LE(this.off)
    this.off += 4
    const rotated = ((bits << 23) | (bits >>> 9)) >>> 0
    const tmp = Buffer.allocUnsafe(4)
    tmp.writeUInt32LE(rotated)
    return tmp.readFloatLE(0)
  }
  string() {
    const start = this.off
    while (this.buf[this.off] !== 0) this.off++
    const s = this.buf.toString("utf8", start, this.off)
    this.off++
    return s
  }
  get done() {
    return this.off >= this.buf.length
  }
}

/* ---------------------------------------------------------- schema parsing */

const KIND = ["ENUM", "STRUCT", "MESSAGE"]
const BUILTIN = {
  "-1": "bool",
  "-2": "byte",
  "-3": "int",
  "-4": "uint",
  "-5": "float",
  "-6": "string",
  "-7": "int64",
  "-8": "uint64",
}

function parseSchema(buf) {
  const r = new Reader(buf)
  const count = r.varuint()
  const defs = []

  for (let i = 0; i < count; i++) {
    const name = r.string()
    const kind = KIND[r.byte()]
    const fieldCount = r.varuint()
    const fields = []

    for (let f = 0; f < fieldCount; f++) {
      const fname = r.string()
      const type = r.varint()
      const isArray = r.bool()
      const value = r.varuint()
      fields.push({ name: fname, type, isArray, value })
    }
    defs.push({ name, kind, fields })
  }
  return defs
}

/* -------------------------------------------------------- message decoding */

function makeDecoder(defs) {
  const byIndex = defs
  const enumValues = new Map()

  for (const def of defs) {
    if (def.kind !== "ENUM") continue
    const map = new Map()
    for (const f of def.fields) map.set(f.value, f.name)
    enumValues.set(def, map)
  }

  function readValue(r, type) {
    if (type < 0) {
      switch (BUILTIN[type]) {
        case "bool":
          return r.bool()
        case "byte":
          return r.byte()
        case "int":
          return r.varint()
        case "uint":
          return r.varuint()
        case "float":
          return r.float()
        case "string":
          return r.string()
        case "int64":
          return Number(r.varint64())
        case "uint64":
          return Number(r.varuint64())
        default:
          throw new Error(`unknown builtin ${type}`)
      }
    }
    const target = byIndex[type]
    if (!target) throw new Error(`unknown type index ${type}`)
    return readDef(r, target)
  }

  function readDef(r, def) {
    if (def.kind === "ENUM") {
      const v = r.varuint()
      return enumValues.get(def).get(v) ?? v
    }

    const obj = {}

    if (def.kind === "STRUCT") {
      for (const f of def.fields) {
        obj[f.name] = f.isArray
          ? Array.from({ length: r.varuint() }, () => readValue(r, f.type))
          : readValue(r, f.type)
      }
      return obj
    }

    // MESSAGE: (fieldId, value)* terminated by 0.
    for (;;) {
      const id = r.varuint()
      if (id === 0) break
      const f = def.fields.find((x) => x.value === id)
      if (!f) throw new Error(`unknown field ${id} on ${def.name}`)
      obj[f.name] = f.isArray
        ? Array.from({ length: r.varuint() }, () => readValue(r, f.type))
        : readValue(r, f.type)
    }
    return obj
  }

  return { readDef, byName: (n) => defs.find((d) => d.name === n) }
}

/* -------------------------------------------------------------------- main */

const [, , figPath, outDir] = process.argv
mkdirSync(outDir, { recursive: true })

const tmp = path.join(outDir, "_unzip")
mkdirSync(tmp, { recursive: true })
execFileSync("unzip", ["-o", "-q", figPath, "canvas.fig", "-d", tmp])

const canvas = readFileSync(path.join(tmp, "canvas.fig"))
if (canvas.subarray(0, 8).toString() !== "fig-kiwi") {
  throw new Error("not a fig-kiwi file")
}

let off = 12 // magic + version
const blocks = []
while (off + 4 <= canvas.length) {
  const len = canvas.readUInt32LE(off)
  off += 4
  if (!len || off + len > canvas.length) break
  const chunk = canvas.subarray(off, off + len)
  off += len

  let out = chunk
  if (chunk.subarray(0, 4).equals(Buffer.from([0x28, 0xb5, 0x2f, 0xfd]))) {
    out = zlib.zstdDecompressSync(chunk)
  } else {
    try {
      out = zlib.inflateRawSync(chunk)
    } catch {
      try {
        out = zlib.inflateSync(chunk)
      } catch {
        /* stored */
      }
    }
  }
  blocks.push(out)
}

const defs = parseSchema(blocks[0])
const { readDef, byName } = makeDecoder(defs)

const root = byName("Message")
const r = new Reader(blocks[1])
const doc = readDef(r, root)

writeFileSync(path.join(outDir, "schema.json"), JSON.stringify(defs, null, 2))
writeFileSync(path.join(outDir, "doc.json"), JSON.stringify(doc, null, 2))
console.log(
  `decoded ${doc.nodeChanges?.length ?? 0} nodes -> ${path.join(outDir, "doc.json")}`,
)
