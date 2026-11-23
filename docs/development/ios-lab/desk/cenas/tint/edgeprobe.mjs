// edgeprobe.mjs [hour] [w] [h]: at each stop (ArrowDown from the top, through the bare proxy on 3147 with the page's clock at <hour>), the
// colour the page paints for its top (html's background: what desktop Safari's bar is made from) against the true average of the screen's
// first 4 rows, read from a screenshot (sRGB, no recording in between) — where a scene says its top wrong, whatever Safari does after.
// edgeprobe.py prints the table (ΔE2000).
import { writeFileSync, mkdirSync } from 'node:fs'
import { open, key, rest, sleep } from '../h.mjs'
const HOUR = process.argv[2] || '22'
const W = Number(process.argv[3] || 1728)
const H = Number(process.argv[4] || 1000)
const out = `${import.meta.dirname}/runs/edgeprobe-${HOUR}h-${W}x${H}`
mkdirSync(out, { recursive: true })
const p = await open(`http://localhost:3147/?cenas=1&hour=${HOUR}`, { w: W, h: H })
await p.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false })
await sleep(500)
await key(p, 'Shift')
await sleep(2500)
const rows = []
let last = ''
for (let i = 0; i < 24; i++) {
  await rest(p)
  await sleep(1200)
  const s = await p.ev(`const R=document.documentElement;return {y:scrollY,stop:window.__cenas?.current?.()??'',sec:R.dataset.section,paint:R.style.backgroundColor,m:document.getElementById('method')?.dataset.edge??'',a:document.getElementById('about')?.dataset.edge??'',c:document.getElementById('contact')?.dataset.edge??''}`)
  const r = await p.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: s.y, width: W, height: 4, scale: 1 } })
  const f = `${String(i).padStart(2, '0')}.png`
  writeFileSync(`${out}/${f}`, Buffer.from(r.result.data, 'base64'))
  rows.push({ ...s, f })
  const at = `${s.y}`
  if (at === last) break
  last = at
  await key(p, 'ArrowDown')
}
writeFileSync(`${out}/rows.json`, JSON.stringify(rows))
console.log(out)
p.ws.close()
process.exit(0)
