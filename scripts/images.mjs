// Chapter One V5 — media derivatives.
//
// Reads the masters in `media-src/` (git-ignored, never modified) and writes web derivatives to
// `public/media/v5/<group>/`: AVIF + JPEG at each width, never upscaled. A source marked `reveal`
// also gets a monochrome derived from the *same* colour frame, so hold-to-colour always compares one
// photograph with itself (docs/design/v5/interactions.md). A `reveal` source that is not actually in
// colour is refused — two different frames must never stand in for a reveal. A source marked `aura`
// also gets the ~48 px blurred image the Work and the About use as atmosphere (interactions.md, #40).
// The entrance video encodes are copied as they are (assets.md §1).
//
// Usage:
//   npm run images -- --dry-run            list what would be written, touch nothing
//   npm run images -- --only=portrait      process one source (`--only=video`: the video only)
//   npm run images -- --out=<dir>          write somewhere else (e.g. a scratch folder)
//   npm run images -- --force              overwrite existing derivatives
//
// Sources and roles: docs/design/v5/assets.md §5 and §7.

import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'media-src')

const AVIF = { quality: 50, effort: 6 }
const JPEG = { quality: 80, progressive: true, mozjpeg: true }

// Below this mean saturation (0–1, measured at 64×96) a file is treated as monochrome.
// Measured 24 Oct 2026: every Helder Couto B&W delivery reads 0.000; the colour ones 0.099–0.354.
const COLOUR_THRESHOLD = 0.05

// Monochrome grade for derived B&W: Rec.601 luminance, a slight contrast lift and a faint warm tone,
// so a derived B&W sits beside the photographer's own B&W set.
const MONO_CONTRAST = 1.22
const MONO_OFFSET = (1 - MONO_CONTRAST) / 2 - 0.03
const MONO_TINT = [0.012, 0.004, -0.01]

// The aura: 48 px wide, blurred, stretched by the page. A B&W photograph gets a warm aura (#40); the
// tint is a starting value, tuned with the Work on the Xiaomi (M5).
const AURA_WIDTH = 48
const AURA_BLUR = 4
const AURA_WARM = '#b8936a'

/**
 * id → master, group and role. `widths` are the widths written (the AI masters are 1024 px wide, so
 * they stop there). `reveal`: colour master used for hold-to-colour. `aura`: adds the aura (and,
 * for a reveal, the aura of its monochrome too). `warm`: the master is B&W; its aura is tinted.
 */
const SOURCES = [
  // Entrance — the poster frame at 4.4 s (assets.md §1), wide and tall; also the Contact.
  { id: 'poster-wide', group: 'entrance', file: 'video/test-encodes/poster-wide.png', widths: [960, 1920] },
  { id: 'poster-tall', group: 'entrance', file: 'video/test-encodes/poster-tall.png', widths: [720] },
  // Work — I Weddings: the photographer's own B&W (Solteiros, assets.md §2).
  { id: 'weddings-before', group: 'work', file: 'weddings/HelderCoutoPhoto_002.jpg', widths: [640, 960, 1440], aura: true, warm: true },
  { id: 'weddings-day', group: 'work', file: 'weddings/HelderCoutoPhoto_154.jpg', widths: [640, 960, 1440], aura: true, warm: true },
  { id: 'weddings-after', group: 'work', file: 'weddings/HelderCoutoPhoto_343.jpg', widths: [640, 960, 1440], aura: true, warm: true },
  // Work — II Artists and III Experiences: AI images, in colour (assets.md §3; never presented as client work).
  { id: 'artists-always', group: 'work', file: 'artists/always.png', widths: [640, 1024], aura: true },
  { id: 'artists-moment', group: 'work', file: 'artists/for-a-moment.png', widths: [640, 1024], aura: true },
  { id: 'artists-record', group: 'work', file: 'artists/on-record.png', widths: [640, 1024], aura: true },
  { id: 'experiences-before', group: 'work', file: 'experiences/before.png', widths: [640, 1024], aura: true },
  { id: 'experiences-during', group: 'work', file: 'experiences/during.png', widths: [640, 1024], aura: true },
  { id: 'experiences-after', group: 'work', file: 'experiences/after.png', widths: [640, 1024], aura: true },
  // Method — the Wedding website screen (Solteiros 299, #49).
  { id: 'screen-wedding', group: 'method', file: 'weddings/HelderCoutoPhoto_299.jpg', widths: [640, 960] },
  // About — the portrait and the room, B&W derived from the colour frame, colour by gesture.
  { id: 'portrait', group: 'about', file: 'about/portrait-124.jpg', widths: [640, 960, 1440], reveal: true, aura: true },
  { id: 'workspace', group: 'about', file: 'about/workspace.png', widths: [640, 1024], reveal: true },
]

/** The entrance video, encoded and measured on 24 Oct (assets.md §1), served as it is. */
const VIDEOS = [
  { from: 'video/test-encodes/hero-1920.mp4', to: 'entrance/hero-1920.mp4' },
  { from: 'video/test-encodes/hero-720x1280.mp4', to: 'entrance/hero-720x1280.mp4' },
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

/** Skips an existing file unless --force; in a dry run only says what it would write. */
function shouldWrite(target) {
  if (!force && existsSync(target)) {
    console.log(`skip   ${path.relative(root, target)} (exists)`)
    return false
  }
  if (dryRun) {
    console.log(`would  ${path.relative(root, target)}`)
    return false
  }
  mkdirSync(path.dirname(target), { recursive: true })
  return true
}

async function write(input, width, base, grade) {
  const targets = [
    [`${base}-${width}.avif`, (p) => p.avif(AVIF)],
    [`${base}-${width}.jpg`, (p) => p.jpeg(JPEG)],
  ]
  for (const [target, encode] of targets) {
    if (!shouldWrite(target)) continue
    let p = sharp(input).rotate().resize({ width, withoutEnlargement: true }).toColourspace('srgb')
    if (grade) p = mono(p)
    const info = await encode(p).toFile(target)
    console.log(`wrote  ${path.relative(root, target)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`)
  }
}

async function writeAura(input, base, { grade, warm }) {
  const target = `${base}-aura.jpg`
  if (!shouldWrite(target)) return
  let p = sharp(input).rotate().resize({ width: AURA_WIDTH }).toColourspace('srgb')
  if (grade) p = mono(p)
  if (warm) p = p.tint(AURA_WARM)
  const info = await p.blur(AURA_BLUR).jpeg({ quality: 70 }).toFile(target)
  console.log(`wrote  ${path.relative(root, target)}  ${info.width}×${info.height}  ${info.size} B`)
}

async function main() {
  if (!existsSync(SRC)) throw new Error(`No masters at ${SRC}. See docs/design/v5/assets.md.`)

  const list = SOURCES.filter((s) => !only || s.id === only)
  if (!list.length && only !== 'video') throw new Error(`No source with id ${only}`)

  for (const source of list) {
    const input = path.join(SRC, source.file)
    if (!existsSync(input)) {
      console.error(`missing ${path.relative(root, input)} — skipped`)
      process.exitCode = 1
      continue
    }
    const sat = await saturation(input)
    if (source.reveal && sat < COLOUR_THRESHOLD) {
      throw new Error(`${source.id} is marked reveal but measures as monochrome (saturation ${sat.toFixed(3)})`)
    }
    const base = path.join(OUT, source.group, source.id)
    console.log(`\n${source.id}  saturation ${sat.toFixed(3)}  ${source.reveal ? 'colour + derived mono' : 'as delivered'}`)
    for (const w of source.widths) {
      await write(input, w, base, false)
      if (source.reveal) await write(input, w, `${base}-mono`, true)
    }
    if (source.aura) {
      await writeAura(input, base, { grade: false, warm: source.warm })
      if (source.reveal) await writeAura(input, `${base}-mono`, { grade: true, warm: true })
    }
  }

  if (!only || only === 'video') {
    for (const video of VIDEOS) {
      const target = path.join(OUT, video.to)
      if (!shouldWrite(target)) continue
      copyFileSync(path.join(SRC, video.from), target)
      console.log(`copied ${path.relative(root, target)}`)
    }
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
