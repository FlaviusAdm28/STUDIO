// edgecurve.mjs <stop> <key> [hour] [w] [h]: from a stop (ArrowDown from the top until there), one key (ArrowDown or ArrowUp), then for 2.6 s
// the colour painted for the top (html's background) against the screen's first 4 rows (a screenshot every few tens of ms): a passage
// whose colour runs ahead of or behind the page shows here, without Safari. Prints "t painted top" (red channel), and the largest gap
import { open, key, rest, sleep } from '../h.mjs'
const [STOP, KEY = 'ArrowDown', HOUR = '22', W = 1728, H = 1000] = process.argv.slice(2)
const p = await open(`http://localhost:3147/?cenas=1&hour=${HOUR}`, { w: Number(W), h: Number(H) })
await p.send('Emulation.setDeviceMetricsOverride', { width: Number(W), height: Number(H), deviceScaleFactor: 1, mobile: false })
await key(p, 'Shift')
await sleep(2500)
for (let i = 0; i < 30; i++) {
  await rest(p)
  if ((await p.ev('return window.__cenas.current()')) === STOP) break
  await key(p, 'ArrowDown')
}
await sleep(1500)
const t0 = Date.now()
await key(p, KEY)
const rows = []
while (Date.now() - t0 < 2600) {
  const y = await p.ev('return [scrollY, document.documentElement.style.backgroundColor]')
  const r = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 100, clip: { x: 0, y: y[0], width: Number(W), height: 4, scale: 1 } })
  rows.push([Date.now() - t0, y[1], r.result.data])
}
const { execFileSync } = await import('node:child_process')
let worst = 0
for (const [t, paint, data] of rows) {
  const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', 'pipe:0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { input: Buffer.from(data, 'base64') })
  let s = 0
  for (let i = 0; i < raw.length; i += 3) s += raw[i]
  const top = Math.round(s / (raw.length / 3))
  const pr = Number(paint.match(/\d+/)?.[0] ?? NaN)
  worst = Math.max(worst, Math.abs(pr - top))
  console.log(String(t).padStart(5), String(pr).padStart(4), String(top).padStart(4), pr - top > 0 ? '+'.repeat(Math.min(20, pr - top)) : '-'.repeat(Math.min(20, top - pr)))
}
console.log('largest gap painted − top (red):', worst, 'over', rows.length, 'samples')
p.ws.close()
process.exit(0)
