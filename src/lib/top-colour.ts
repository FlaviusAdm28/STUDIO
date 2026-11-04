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
    canvas.width = 8
    canvas.height = 2
    ctx ??= canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.clearRect(0, 0, 8, 2)
    ctx.drawImage(img, x0, Math.min(y0, ih - h), w, h, 0, 0, 8, 2)
    const d = ctx.getImageData(0, 0, 8, 2).data
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

/** `rgb(…)` / `rgba(…)` / `#rrggbb` → [r, g, b, a] */
export function parseColour(c: string): [number, number, number, number] | null {
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (m) {
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]
  }
  const h = c.trim().match(/^#([0-9a-f]{6})$/i)
  if (h) return [parseInt(h[1].slice(0, 2), 16), parseInt(h[1].slice(2, 4), 16), parseInt(h[1].slice(4, 6), 16), 1]
  return null
}

export const hex = ([r, g, b]: Rgb) => `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`
