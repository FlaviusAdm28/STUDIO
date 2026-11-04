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

import { writeSpillMasks } from './spill-mask.mjs'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'media-src')

const AVIF = { quality: 50, effort: 6 }
const JPEG = { quality: 80, progressive: true, mozjpeg: true }
// The photographer's own photographs (`fine`): at quality 50 the AVIF wiped their grain, the sky went flat and the cloth
// plastic (owner, 30 Oct: "fotos reais de boa qualidade"; before-1440: 62 KB at 50, 289 KB at 78, the grain back).
const AVIF_FINE = { quality: 78, effort: 6 }
const JPEG_FINE = { quality: 88, progressive: true, mozjpeg: true }

// The calm grade of the bought-in photographs (`calm`, their saturation): a warm cast and softened blacks, one treatment
// for all, so they sit with the amber of the AI images; each source only sets how far its colour comes down. Never on the
// photographer's own photographs (owner, 30 Oct: "identidade de cor parecida… não quero que pareçam falsas").
const CALM_WARM = [
  [1.03, 0, 0],
  [0, 1, 0],
  [0, 0, 0.93],
]
const CALM_CONTRAST = 0.94
const CALM_LIFT = 14

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
// The About's room spreads its aura over the whole screen: 48 px stretched 30× was drawn by the browser in facets (owner, 4 Nov: "consigo ver
// claramente camadas"). `auraLarge` also writes `-aura-lg.jpg`, four times wider, the blur in proportion.
const AURA_LARGE = { width: 192, blur: 16, quality: 82 }

/**
 * id → master, group and role. `widths` are the widths written (the AI masters are 1024 px wide, so
 * they stop there). `reveal`: colour master used for hold-to-colour. `mono`: also writes the derived
 * monochrome, with no reveal (the entrance's blades are B&W). `aura`: adds the aura (and,
 * for a reveal, the aura of its monochrome too); `auraLarge` also a 192 px one (the About's room). `warm`: the master is B&W; its aura is tinted.
 * `fine`: a real photograph, encoded to keep its grain. `calm`: the calm grade, with this saturation.
 * `crop`: the part of the master used.
 */
const SOURCES = [
  // Entrance — the poster frame at 4.4 s (assets.md §1), wide and tall; also the Contact.
  { id: 'poster-wide', group: 'entrance', file: 'video/test-encodes/poster-wide.png', widths: [960, 1920] },
  { id: 'poster-tall', group: 'entrance', file: 'video/test-encodes/poster-tall.png', widths: [720] },
  // Work — I Weddings: the photographer's own B&W (Solteiros, assets.md §2).
  { id: 'weddings-before', group: 'work', file: 'weddings/HelderCoutoPhoto_002.jpg', widths: [640, 960, 1280, 1600], aura: true, warm: true, fine: true },
  { id: 'weddings-day', group: 'work', file: 'weddings/HelderCoutoPhoto_154.jpg', widths: [640, 960, 1280, 1600], aura: true, warm: true, fine: true },
  { id: 'weddings-after', group: 'work', file: 'weddings/HelderCoutoPhoto_343.jpg', widths: [640, 960, 1280, 1600], aura: true, warm: true, fine: true },
  // the guests' photographs of the live gallery (On the day): six more of the photographer's B&W, so the gallery never
  // repeats the chapter's own three (owner, 29 Oct). Copied from the V4's public/media/new, SHA-1 checked.
  { id: 'weddings-guests-1', group: 'work', file: 'weddings/HelderCoutoPhoto_046.jpg', widths: [320, 640], fine: true },
  { id: 'weddings-guests-2', group: 'work', file: 'weddings/HelderCoutoPhoto_067.jpg', widths: [320, 640], fine: true },
  { id: 'weddings-guests-3', group: 'work', file: 'weddings/HelderCoutoPhoto_126.jpg', widths: [320, 640], fine: true },
  { id: 'weddings-guests-4', group: 'work', file: 'weddings/HelderCoutoPhoto_156.jpg', widths: [320, 640], fine: true },
  { id: 'weddings-guests-5', group: 'work', file: 'weddings/HelderCoutoPhoto_179.jpg', widths: [320, 640], fine: true },
  { id: 'weddings-guests-6', group: 'work', file: 'weddings/HelderCoutoPhoto_337.jpg', widths: [320, 640], fine: true },
  // Work — II Artists and III Experiences: AI images, in colour (assets.md §3; never presented as client work).
  { id: 'artists-always', group: 'work', file: 'artists/always.png', widths: [640, 1024], aura: true, mono: true, fine: true },
  { id: 'artists-moment', group: 'work', file: 'artists/for-a-moment.png', widths: [640, 1024], aura: true },
  { id: 'artists-record', group: 'work', file: 'artists/on-record.png', widths: [640, 1024], aura: true, fine: true },
  { id: 'experiences-before', group: 'work', file: 'experiences/before.png', widths: [640, 1024], aura: true },
  { id: 'experiences-during', group: 'work', file: 'experiences/during.png', widths: [640, 1024], aura: true, mono: true },
  { id: 'experiences-after', group: 'work', file: 'experiences/after.png', widths: [640, 1024], aura: true },
  // Work — bought-in photographs chosen by the owner (30 Oct; Unsplash License, assets.md §3). New ids: the entrance's
  // blade keeps the AI concert (experiences-during), the approved entrance does not change.
  { id: 'artists-moment-photo', group: 'work', file: 'stock/unsplash-Cu5pKZkpJj8.jpg', widths: [640, 960, 1280, 1600], aura: true, fine: true, calm: 0.72 },
  { id: 'experiences-before-photo', group: 'work', file: 'stock/unsplash-e_0kguyKNmc.jpg', widths: [640, 960, 1280, 1600], aura: true, fine: true, calm: 0.7 },
  { id: 'experiences-during-photo', group: 'work', file: 'stock/unsplash-rCX_nOPnSNA.jpg', widths: [640, 960, 1280, 1600], aura: true, fine: true, calm: 0.55 },
  { id: 'experiences-after-photo', group: 'work', file: 'stock/unsplash-5PNmURC73JQ.jpg', widths: [640, 960, 1280, 1600], aura: true, fine: true, calm: 0.8 },
  // the owner's own new studio image (ChatGPT, 30 Oct), for Always; the door frame at its left is cut. The blade keeps artists-always.
  { id: 'artists-always-photo', group: 'work', file: 'artists/always-studio.png', widths: [640, 960], aura: true, fine: true, calm: 0.8, crop: { left: 64, top: 0, width: 960, height: 1536 } },
  // Method — the Wedding website screen: Solteiros 163, the couple face to face on the road, in colour (owner, 2/11, README #96;
  // was 299, a woman alone, which read wrong under a man's name). Up to 1280: on a phone it opens to the whole screen.
  { id: 'screen-wedding', group: 'method', file: 'weddings/HelderCoutoPhoto_163.jpg', widths: [640, 960, 1280], fine: true },
  // About — the portrait and the room, B&W derived from the colour frame, colour by gesture.
  { id: 'portrait', group: 'about', file: 'about/portrait-124.jpg', widths: [640, 960, 1440], reveal: true, aura: true, auraLarge: true },
  { id: 'workspace', group: 'about', file: 'about/workspace.png', widths: [640, 1024], reveal: true },
]

/** The entrance video, encoded and measured on 24 Oct (assets.md §1), served as it is. */
const VIDEOS = [
  { from: 'video/test-encodes/hero-1920.mp4', to: 'entrance/hero-1920.mp4' },
  { from: 'video/test-encodes/hero-720x1280.mp4', to: 'entrance/hero-720x1280.mp4' },
]

/** The Method's studio, one room per hour and shape, without its light (README #93, #94). Made and measured for banding
 *  by media-src/method/ (room.html + dither-all.cjs / bayer3.cjs): served exactly as they are, never re-encoded. */
const STUDIO = ['morning', 'day', 'evening', 'night'].flatMap((band) =>
  ['wide', 'tall'].flatMap((shape) =>
    (band === 'night' ? ['png'] : ['avif', 'jpg']).map((ext) => ({
      from: `method/final/room-${band}-${shape}.${ext}`,
      to: `method/room-${band}-${shape}.${ext}`,
    })),
  ),
)

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

function calm(pipeline, saturation) {
  return pipeline.modulate({ saturation }).recomb(CALM_WARM).linear(CALM_CONTRAST, CALM_LIFT)
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

async function write(input, width, base, grade, { fine, calm: calmed, crop } = {}) {
  const targets = [
    [`${base}-${width}.avif`, (p) => p.avif(fine ? AVIF_FINE : AVIF)],
    [`${base}-${width}.jpg`, (p) => p.jpeg(fine ? JPEG_FINE : JPEG)],
  ]
  for (const [target, encode] of targets) {
    if (!shouldWrite(target)) continue
    let p = sharp(input).rotate()
    if (crop) p = p.extract(crop)
    p = p.resize({ width, withoutEnlargement: true }).toColourspace('srgb')
    if (grade) p = mono(p)
    if (calmed) p = calm(p, calmed)
    const info = await encode(p).toFile(target)
    console.log(`wrote  ${path.relative(root, target)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`)
  }
}

async function writeAura(input, base, { grade, warm, calm: calmed, crop, large = false }) {
  const size = large ? AURA_LARGE : { width: AURA_WIDTH, blur: AURA_BLUR, quality: 70 }
  const target = `${base}-aura${large ? '-lg' : ''}.jpg`
  if (!shouldWrite(target)) return
  let p = sharp(input).rotate()
  if (crop) p = p.extract(crop)
  p = p.resize({ width: size.width }).toColourspace('srgb')
  if (grade) p = mono(p)
  if (calmed) p = calm(p, calmed)
  if (warm) p = p.tint(AURA_WARM)
  const info = await p.blur(size.blur).jpeg({ quality: size.quality }).toFile(target)
  console.log(`wrote  ${path.relative(root, target)}  ${info.width}×${info.height}  ${info.size} B`)
}

async function main() {
  if (!existsSync(SRC)) throw new Error(`No masters at ${SRC}. See docs/design/v5/assets.md.`)

  const list = SOURCES.filter((s) => !only || s.id === only)
  if (!list.length && only !== 'video' && only !== 'studio') throw new Error(`No source with id ${only}`)

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
      await write(input, w, base, false, source)
      if (source.reveal || source.mono) await write(input, w, `${base}-mono`, true)
    }
    if (source.aura) {
      await writeAura(input, base, { grade: false, warm: source.warm, calm: source.calm, crop: source.crop })
      if (source.reveal) await writeAura(input, `${base}-mono`, { grade: true, warm: true })
    }
    if (source.auraLarge) {
      await writeAura(input, base, { grade: false, warm: source.warm, calm: source.calm, crop: source.crop, large: true })
      if (source.reveal) await writeAura(input, `${base}-mono`, { grade: true, warm: true, large: true })
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

  if (!only || only === 'studio') {
    for (const file of STUDIO) {
      const target = path.join(OUT, file.to)
      if (!shouldWrite(target)) continue
      copyFileSync(path.join(SRC, file.from), target)
      console.log(`copied ${path.relative(root, target)}`)
    }
    // the light's spill on its moving edges (README #100): drawn, not derived from a master (scripts/spill-mask.mjs)
    for (const file of writeSpillMasks(OUT, { dryRun }))
      console.log(`${dryRun ? 'would write' : 'wrote '} ${path.relative(root, file)}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
