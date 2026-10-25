// Chapter One V5 — image derivatives.
//
// Reads the photographic masters in `media-src/` (git-ignored, never modified) and writes web
// derivatives to `public/media/v5/`: AVIF + JPEG at each width, never upscaled. A source marked
// `reveal` also gets a monochrome derived from the *same* colour frame, so hold-to-colour always
// compares one photograph with itself (docs/design/v5/interactions.md). A `reveal` source that is
// not actually in colour is refused — two different frames must never stand in for a reveal.
//
// Usage:
//   npm run images -- --dry-run            list what would be written, touch nothing
//   npm run images -- --only=302           process one source
//   npm run images -- --out=<dir>          write somewhere else (e.g. a scratch folder)
//   npm run images -- --force              overwrite existing derivatives
//
// Sources and roles are documented in docs/design/v5/assets.md.

import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'media-src')

const WIDTHS = [640, 960, 1440]
const OPENING_WIDTH = 2048
const AVIF = { quality: 50, effort: 6 }
const JPEG = { quality: 80, progressive: true, mozjpeg: true }

// Below this mean saturation (0–1, measured at 64×96) a file is treated as monochrome.
// Measured 24 Oct 2026: every Helder Couto B&W delivery reads 0.000; the colour ones 0.099–0.354.
const COLOUR_THRESHOLD = 0.05

// Monochrome grade for derived B&W: Rec.601 luminance, a slight contrast lift and a faint warm tone,
// the grade the invite uses so a derived B&W sits beside the photographer's own B&W set.
const MONO_CONTRAST = 1.22
const MONO_OFFSET = (1 - MONO_CONTRAST) / 2 - 0.03
const MONO_TINT = [0.012, 0.004, -0.01]

/**
 * id → master and role. `dir`/`file` default to `helder-couto/HelderCoutoPhoto_<id>.jpg`.
 * `reveal`: colour master used for hold-to-colour. `opening`: adds 2048w. `widths` overrides.
 */
const SOURCES = [
  { id: '302', reveal: true, opening: true },
  { id: '300', reveal: true },
  { id: '157', reveal: true, opening: true },
  { id: '024', reveal: true },
  { id: '045', reveal: true },
  { id: '124', reveal: true },
  { id: '178', reveal: true },
  { id: '195', reveal: true },
  { id: '023' },
  { id: '046' },
  { id: '192' },
  { id: '303' },
  { id: '179' },
  { id: '337' },
  // The invite's own materials (D:INVITEmedia, copied): its colour hero and the night frames.
  { id: 'main', dir: 'invite', file: 'main.jpg', reveal: true },
  { id: '335', dir: 'invite' },
  { id: '347', dir: 'invite' },
  { id: '171', dir: 'invite' },
  // Studio plates (made or improved with AI from the studio's own material; 1536px masters).
  { id: 'art', dir: 'plates', file: 'art.png', widths: [640, 960, 1536] },
  { id: 'method', dir: 'plates', file: 'method.png', widths: [640, 960, 1536] },
  { id: 'lamp', dir: 'plates', file: 'image19aug26.png', widths: [640, 960, 1536] },
]

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)
const dryRun = args.has('dry-run')
const force = args.has('force')
const only = args.get('only')
const OUT = path.resolve(root, typeof args.get('out') === 'string' ? args.get('out') : 'public/media/v5')

const file = (s) => path.join(SRC, s.dir ?? 'helder-couto', s.file ?? `HelderCoutoPhoto_${s.id}.jpg`)

async function saturation(input) {
  const { data, info } = await sharp(input).rotate().resize(64, 96, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true })
  let s = 0
  for (let p = 0; p < data.length; p += info.channels) {
    const max = Math.max(data[p], data[p + 1], data[p + 2])
    const min = Math.min(data[p], data[p + 1], data[p + 2])
    s += max ? (max - min) / max : 0
  }
  return s / (data.length / info.channels)
}

function mono(pipeline) {
  const lum = [0.299, 0.587, 0.114]
  return pipeline
    .recomb([lum, lum, lum])
    .linear(
      [MONO_CONTRAST, MONO_CONTRAST, MONO_CONTRAST],
      MONO_TINT.map((t) => (MONO_OFFSET + t) * 255),
    )
}

async function write(input, width, name, grade) {
  const targets = [
    [path.join(OUT, `${name}-${width}.avif`), (p) => p.avif(AVIF)],
    [path.join(OUT, `${name}-${width}.jpg`), (p) => p.jpeg(JPEG)],
  ]
  for (const [target, encode] of targets) {
    if (!force && existsSync(target)) {
      console.log(`skip   ${path.relative(root, target)} (exists)`)
      continue
    }
    if (dryRun) {
      console.log(`would  ${path.relative(root, target)}`)
      continue
    }
    let p = sharp(input).rotate().resize({ width, withoutEnlargement: true }).toColourspace('srgb')
    if (grade) p = mono(p)
    const info = await encode(p).toFile(target)
    console.log(`wrote  ${path.relative(root, target)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`)
  }
}

async function main() {
  if (!existsSync(SRC)) throw new Error(`No masters at ${SRC}. See docs/design/v5/assets.md.`)
  if (!dryRun) mkdirSync(OUT, { recursive: true })

  const list = SOURCES.filter((s) => !only || s.id === only)
  if (!list.length) throw new Error(`No source with id ${only}`)

  for (const source of list) {
    const input = file(source)
    if (!existsSync(input)) {
      console.error(`missing ${path.relative(root, input)} — skipped`)
      process.exitCode = 1
      continue
    }
    const sat = await saturation(input)
    if (source.reveal && sat < COLOUR_THRESHOLD) {
      throw new Error(`${source.id} is marked reveal but measures as monochrome (saturation ${sat.toFixed(3)})`)
    }
    const widths = source.widths ?? (source.opening ? [...WIDTHS, OPENING_WIDTH] : WIDTHS)
    console.log(`\n${source.id}  saturation ${sat.toFixed(3)}  ${source.reveal ? 'colour + derived mono' : 'as delivered'}`)
    for (const w of widths) {
      await write(input, w, source.id, false)
      if (source.reveal) await write(input, w, `${source.id}-mono`, true)
    }
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
