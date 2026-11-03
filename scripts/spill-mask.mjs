// The Method's slit light (README #100): the fall-off of the light outside each edge of the blade, as an alpha mask with ordered
// (Bayer 8×8) dither. As a CSS gradient, a light this faint over the night had only a few shades to fall through and showed steps
// (2560 × 1305, night, owner, 2 Nov). The colour comes from CSS (--m-spill, opaque); this file is how much of it, across the width,
// with the hour's strength baked in: a dither only survives if the mask holds the final value (an opacity applied afterwards is
// rounded again and the steps come back).
// Written by `npm run images` (scripts/images.mjs), or alone: node scripts/spill-mask.mjs
// → public/media/v5/method/spill-<hour>-<l|r>.png (128 × 64, tiled down the height)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { deflateSync } from 'node:zlib'

const W = 128
const H = 64
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]
// strongest at the edge (x = 0), gone at the far side; a soft curve, no knee
const fall = (x) => Math.pow(1 - x, 2.4)

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const c = Buffer.alloc(4)
  c.writeUInt32BE(crc(td))
  return Buffer.concat([len, td, c])
}
const png = (mirror, strength) => {
  // grey + alpha, 8 bits: white, the alpha carries the fall-off
  const raw = Buffer.alloc(H * (1 + W * 2))
  for (let y = 0; y < H; y++) {
    const row = y * (1 + W * 2)
    raw[row] = 0
    for (let x = 0; x < W; x++) {
      const t = (mirror ? W - 1 - x : x) / (W - 1)
      const v = strength * fall(t) * 255
      const a = Math.min(255, Math.max(0, Math.floor(v + BAYER[y % 8][x % 8] / 64)))
      raw[row + 1 + x * 2] = 255
      raw[row + 2 + x * 2] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8
  ihdr[9] = 4
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}
// the strength at the edge, by the hour (README #100, "B suave")
const STRENGTH = { morning: 0.18, day: 0.16, evening: 0.2, night: 0.11 }
/** Writes the eight masks into <out>/method (out: the derivatives' folder, public/media/v5 by default); returns the files written. */
export function writeSpillMasks(out = 'public/media/v5', { dryRun = false } = {}) {
  const dir = path.join(out, 'method')
  const files = []
  if (!dryRun) mkdirSync(dir, { recursive: true })
  for (const [hour, s] of Object.entries(STRENGTH)) {
    // right of the edge the light falls off to the right; left of it, to the left
    for (const [side, left] of [['r', false], ['l', true]]) {
      const file = path.join(dir, `spill-${hour}-${side}.png`)
      if (!dryRun) writeFileSync(file, png(left, s))
      files.push(file)
    }
  }
  return files
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  writeSpillMasks()
  console.log('spill masks written:', Object.keys(STRENGTH).join(', '))
}
