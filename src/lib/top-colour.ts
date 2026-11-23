/*
  The colour of what is really drawn at the top of the screen, for the page's edges (html, body and theme-color: what Safari shows around
  the Dynamic Island, and Chrome's address bar on Android). Read from the image itself, as it is laid out on this screen — never a value
  measured once elsewhere: on the iPhone the held scenes are 130 px taller than in Chrome (--screen), so a picture drawn with `cover` is
  cut differently and its top is another colour (owner, iPhone, 4 Nov: "a cor de cima da ilha muda e fica errada").

  `drawn` places the image in a box as CSS does (`cover` with an object-/background-position, or `fill`); `band` is the part of that box
  to average, in its own pixels (it may reach above the box's top: on iOS the scenes run 70 px above the screen). Same-origin images
  only; any failure returns null and the caller keeps its own colour.
*/
type Fit = 'cover' | 'fill'
export type Rgb = readonly [number, number, number]

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null

export function bandColour(
  img: HTMLImageElement,
  box: { w: number; h: number },
  band: { x0: number; x1: number; y0: number; y1: number },
  fit: Fit = 'cover',
  pos: readonly [number, number] = [0.5, 0.5],
): Rgb | null {
  try {
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    if (!img.complete || !iw || !ih || !box.w || !box.h) return null
    // the image's place in the box, in box pixels
    let sx: number, sy: number, ox: number, oy: number
    if (fit === 'fill') {
      sx = box.w / iw
      sy = box.h / ih
      ox = 0
      oy = 0
    } else {
      sx = sy = Math.max(box.w / iw, box.h / ih)
      ox = (box.w - iw * sx) * pos[0]
      oy = (box.h - ih * sy) * pos[1]
    }
    // the band back in the image's pixels, kept inside it
    const clamp = (v: number, m: number) => Math.min(m, Math.max(0, v))
    const x0 = clamp((band.x0 - ox) / sx, iw)
    const x1 = clamp((band.x1 - ox) / sx, iw)
    const y0 = clamp((band.y0 - oy) / sy, ih)
    const y1 = clamp((band.y1 - oy) / sy, ih)
    const w = Math.max(1, x1 - x0)
    const h = Math.max(1, y1 - y0)
    canvas ??= document.createElement('canvas')
    canvas.width = 16
    canvas.height = 4
    ctx ??= canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.clearRect(0, 0, 16, 4)
    // the whole image drawn so that the band fills the canvas — never a source rectangle: Chrome reads one in the file's own pixels,
    // while naturalWidth is the srcset's corrected size (the About's portrait: 392 natural, 1440 in the file). The band read was a
    // corner of the photograph, darker: the edge #adaca8 over a top of #c1c0be at the About's 13 and 14 (Xiaomi, 13 Nov)
    const kx = 16 / w
    const ky = 4 / h
    ctx.drawImage(img, -x0 * kx, -Math.min(y0, ih - h) * ky, iw * kx, ih * ky)
    const d = ctx.getImageData(0, 0, 16, 4).data
    let r = 0
    let g = 0
    let b = 0
    for (let i = 0; i < d.length; i += 4) {
      r += d[i]
      g += d[i + 1]
      b += d[i + 2]
    }
    const n = d.length / 4
    return [r / n, g / n, b / n]
  } catch {
    return null
  }
}

/** a colour over another, at an alpha (as the browser composes them) */
export const over = (base: Rgb, top: Rgb, a: number): Rgb => [0, 1, 2].map((i) => base[i] * (1 - a) + top[i] * a) as unknown as Rgb

/** `rgb(…)` / `rgba(…)` / `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa` → [r, g, b, a]. The build's CSS minifier writes a custom property's
 * rgba() as #rrggbbaa (--m-key: rgba(255, 196, 140, 0.26) → #ffc48c42), and read back it was no colour at all: in production the Method's
 * edges left the hour's light out, the room alone (found 23 Nov; next dev keeps rgba()) */
export function parseColour(c: string): [number, number, number, number] | null {
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (m) {
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]
  }
  const h = c.trim().match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
  if (!h) return null
  const x = h[1].length <= 4 ? [...h[1]].map((d) => d + d).join('') : h[1]
  const v = [0, 2, 4, 6].map((i) => parseInt(x.slice(i, i + 2), 16))
  return [v[0], v[1], v[2], x.length === 8 ? v[3] / 255 : 1]
}

export const hex = ([r, g, b]: Rgb) => `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`

/**
 * Desktop Safari's tab bar (Safari 27, macOS 27.2, light appearance) shows the page's colour 8 levels lighter in each channel, from black
 * to white, once the page is off its top: ~85 % of it from body's background, the rest from the page just above the viewport (the
 * conductor's strip, lib/conductor.ts feed), nothing from html's while body has one. At the page's top, nothing scrolled off, it takes
 * body's colour as it is. Body and the strip painted this much darker, the bar is the scene's own colour: bar − page 0 ± 1 over 16
 * colours, the site's among them, where it was +5 to +10 (desk/cenas/tint/calib.html, 23 Nov). Body is never seen on the site (bodyshow).
 */
export const SAFARI_BAR_LIFT = 8
export const underSafariBar = (c: readonly number[], lift = SAFARI_BAR_LIFT) => c.slice(0, 3).map((v) => Math.max(0, Math.round(v - lift)))
