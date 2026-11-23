// bodyshow.mjs [w] [h] [stroke] [query]: is the page's own background (body's, html's) seen anywhere on the site under the conductor? Body is
// painted magenta and html green (!important, over the inline colours sequence.ts writes), the page walked by strokes down to the end and
// back, a screenshot every ~120 ms through each move and at each stop; bodyshow.py counts the magenta and green pixels in them.
// Why (23 Nov): desktop Safari's bar takes ~85 % of its colour from body's background (calib.html): matching it means painting body a
// little darker than the scene, which is only invisible if body is never seen.
import { mkdirSync, writeFileSync } from 'node:fs'
import { open, stroke, key, state, rest, sleep } from '../h.mjs'
const W = Number(process.argv[2] || 1440)
const H = Number(process.argv[3] || 900)
const STR = process.argv[4] || 'swipe300'
const out = `${import.meta.dirname}/runs/bodyshow-${W}x${H}${process.argv[5] ? '-' + process.argv[5].replace(/[^a-z0-9]/gi, '') : ''}`
mkdirSync(out, { recursive: true })
const Q = process.argv[5] || 'cenas=1'
const p = await open(`http://localhost:3100/?${Q}`, { w: W, h: H })
await p.ev(`const s=document.createElement('style');s.textContent='html{background:#00ff00!important}body{background:#ff00ff!important}';document.head.append(s)`)
let n = 0
// the viewport at 1 device pixel (a clip is in the document's coordinates: it captured the top of the page, not the screen)
await p.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false })
const shot = async (tag) => {
  const r = await Promise.race([p.send('Page.captureScreenshot', { format: 'png' }), sleep(3000).then(() => null)])
  if (!r?.result?.data) return console.log('no shot', tag)
  writeFileSync(`${out}/${String(n++).padStart(4, '0')}-${tag}.png`, Buffer.from(r.result.data, 'base64'))
}
await shot('top')
await key(p, 'Shift')
for (let i = 0; i < 12; i++) {
  await shot('entrance')
  await sleep(80)
}
await rest(p)
let s = await state(p)
for (const way of [1, -1]) {
  let last = s.cur
  for (let i = 0; i < 30; i++) {
    const going = stroke(p, way > 0 ? STR : `${STR}-up`)
    const t0 = Date.now()
    while (Date.now() - t0 < 2600) {
      await shot(`${last}${way > 0 ? 'v' : '^'}`)
      await sleep(60)
    }
    await going
    await rest(p)
    s = await state(p)
    await shot(`at-${s.cur}`)
    if (s.cur === last && (s.cur === 'end' || s.cur === 'top')) break
    last = s.cur
  }
}
console.log(n, 'screenshots in', out)
p.ws.close()
process.exit(0)
