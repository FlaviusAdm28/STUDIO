// The About's lit room (storyboard 13–14; README #40, #52): the room's ground with the portrait's own atmosphere, made here as finished
// images — one in black and white, one in colour, for a wide screen and a tall one — instead of being put together by the browser.
//
// Why (owner, 4 Nov: "a luz de fundo na 13 nota-se muito camadas, má qualidade, principalmente desktop"): the page made the room from a
// 192 px JPEG aura stretched 8×, under a CSS mask and an opacity, over the ground. Each of those is rounded to 8 bits again, and the steps
// of a dark, slow gradient came back as rings even under the grain (measured at ×3 contrast, 1440 × 900). As with the Method's light
// (scripts/spill-mask.mjs): a fall-off only stays smooth if the file holds the final value. Here the aura is blurred at 16 bits, laid over
// the ground with the storyboard's mask and opacity in floating point, and rounded once. The grain over it (about.css .a-grain) breaks the
// last one-level steps.
//
// The geometry is the storyboard's (about.css, before: .a-aura): the aura's box as a share of the screen, its elliptical mask
// (closest-side, solid to 20 %, clear at 100 %), at 0.9 (B&W) and 0.95 (colour). The browser stretches each file to the screen, as it
// stretched the aura's box, so the composition is the same at any shape of screen.
// The colours are the approved About storyboard's own atmospheres (its img/a-124-mono.jpg and a-124.jpg, measured 4 Nov): the B&W one a grey
// (saturation 0.00 — only the B&W grade's faint tone, "cinzento quente"), never the Work's warm tint (with it the room was more coloured at
// rest than with the colour, and the hover seemed to take the colour away: owner, 4 Nov), both about 0.6 of the photograph's light, the
// colour one's saturation brought back (the blur mixes the colours).
// Written by `npm run images` (scripts/images.mjs) for the source marked `room`.
import path from 'node:path'
import sharp from 'sharp'

// the room's ground as it is written in about.css (--a-room: two levels under the approved #1B1C1A, which the grain brings back)
const GROUND = [25, 26, 24]
// the aura's box on the screen (share of its width and height) and the file's size, for the desktop's frame and the phone's. Only light
// without detail: the size changes nothing in its smoothness (the steps come from the slope, not the pixels), only the weight
const SHAPES = {
  wide: { box: { l: -0.22, t: -0.3, w: 1.12, h: 1.6 }, size: [1280, 800] },
  tall: { box: { l: -0.4, t: -0.24, w: 1.8, h: 1.12 }, size: [600, 1300] },
}
const OPACITY = { mono: 0.9, col: 0.95 }
const SOLID = 0.2
// as the About's large aura (images.mjs AURA_LARGE): the storyboard's light and saturation; the blur at twice its size, at 384 px
const AURA = { width: 384, blur: 32, dim: 0.6, saturation: 1.35 }

/** The aura at 16 bits a channel: [data, width, height]. */
async function aura(input, grade, { crop } = {}) {
  let p = sharp(input).rotate()
  if (crop) p = p.extract(crop)
  p = p.resize({ width: AURA.width }).toColourspace('srgb')
  if (grade) p = grade(p)
  p = p.linear(AURA.dim, 0)
  if (!grade) p = p.modulate({ saturation: AURA.saturation })
  const { data, info } = await p.blur(AURA.blur).toColourspace('rgb16').raw({ depth: 'ushort' }).toBuffer({ resolveWithObject: true })
  // 16 bits a channel, or the steps would be back before the compose; checked, never assumed
  if (data.length !== info.width * info.height * info.channels * 2) throw new Error(`about-room: expected 16-bit raw, got ${data.length} bytes`)
  const px = new Uint16Array(data.buffer, data.byteOffset, data.length / 2)
  return { px, w: info.width, h: info.height, ch: info.channels }
}

function compose(a, shape, opacity) {
  const [W, H] = shape.size
  const { l, t, w, h } = shape.box
  const out = Buffer.alloc(W * H * 3)
  const at = (x, y, c) => a.px[(y * a.w + x) * a.ch + c] / 257
  for (let y = 0; y < H; y++) {
    const v = ((y + 0.5) / H - t) / h
    for (let x = 0; x < W; x++) {
      const u = ((x + 0.5) / W - l) / w
      const d = Math.hypot((u - 0.5) / 0.5, (v - 0.5) / 0.5)
      const m = Math.min(1, Math.max(0, (1 - d) / (1 - SOLID)))
      const k = (y * W + x) * 3
      if (m <= 0 || u < 0 || u > 1 || v < 0 || v > 1) {
        out[k] = GROUND[0]
        out[k + 1] = GROUND[1]
        out[k + 2] = GROUND[2]
        continue
      }
      // the aura stretched to its box (bilinear, in floating point: the blurred image is smooth far beyond a pixel)
      const fx = Math.min(a.w - 1, Math.max(0, u * a.w - 0.5))
      const fy = Math.min(a.h - 1, Math.max(0, v * a.h - 0.5))
      const x0 = Math.floor(fx), y0 = Math.floor(fy)
      const x1 = Math.min(a.w - 1, x0 + 1), y1 = Math.min(a.h - 1, y0 + 1)
      const dx = fx - x0, dy = fy - y0
      const alpha = m * opacity
      for (let c = 0; c < 3; c++) {
        const s = (at(x0, y0, c) * (1 - dx) + at(x1, y0, c) * dx) * (1 - dy) + (at(x0, y1, c) * (1 - dx) + at(x1, y1, c) * dx) * dy
        out[k + c] = Math.round(GROUND[c] * (1 - alpha) + s * alpha)
      }
    }
  }
  return out
}

/** Writes about/room-{mono,col}-{wide,tall}.png from the colour master; `grade` is images.mjs's B&W. */
export async function writeAboutRoom(input, out, { grade, shouldWrite, crop }) {
  const written = []
  const auras = { mono: await aura(input, grade, { crop }), col: await aura(input, null, { crop }) }
  for (const [name, shape] of Object.entries(SHAPES)) {
    for (const kind of ['mono', 'col']) {
      const target = path.join(out, 'about', `room-${kind}-${name}.png`)
      if (!shouldWrite(target)) continue
      const [W, H] = shape.size
      const raw = compose(auras[kind], shape, OPACITY[kind])
      const info = await sharp(raw, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(target)
      written.push([target, info])
    }
  }
  return written
}
