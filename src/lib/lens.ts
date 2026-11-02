/*
  The liquid glass's lens (README #69): a displacement map shaped like its element. Within 14 px of the rim the backdrop
  is pulled from further inside, so the rim magnifies. `radius` is the element's corner; by default it is a pill. Drawn on
  the client, for browsers where backdrop-filter takes a url() (Chromium).
*/
export function lensMap(w: number, h: number, radius = h / 2) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  if (!g) return ''
  const im = g.createImageData(w, h)
  const E = 14
  // never under the lens's own width, or a small corner would leave a step inside the glass
  const r = Math.min(Math.max(radius, E), h / 2)
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const vx = x + 0.5 - Math.min(Math.max(x + 0.5, r), w - r)
      const vy = y + 0.5 - Math.min(Math.max(y + 0.5, r), h - r)
      const len = Math.hypot(vx, vy) || 1
      const d = r - len
      const k = d < E ? ((E - Math.max(d, 0)) / E) ** 2 : 0
      const i = (y * w + x) * 4
      im.data[i] = 128 + 127 * (vx / len) * k * 0.9
      im.data[i + 1] = 128 + 127 * (vy / len) * k * 0.9
      im.data[i + 2] = 128
      im.data[i + 3] = 255
    }
  g.putImageData(im, 0, 0)
  return c.toDataURL()
}
