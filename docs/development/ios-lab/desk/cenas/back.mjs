// The Work's way back (Weddings → the top) after resting at Weddings for <ms>: how bright the arch's middle is, frame by frame (Chrome's own
// frames, CDP screencast). The flying photograph is bright (~204); without it the stage's dark ground shows through (~45). 16 Nov: after
// ~4.5 s at Weddings the box was missing for 0.6 s (README #119; work-client.tsx syncOne / go). URL=… for the site without the conductor.
//   node back.mjs 7500
import { writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { open, stroke, key, rest, sleep } from './h.mjs'
const wait = Number(process.argv[2] || 7500)
const p = await open(process.env.URL || 'http://localhost:3100/?cenas=1', { w: 1440, h: 900 })
await key(p, 'Shift')
await sleep(900)
await stroke(p, 'gentle300')
await rest(p, 400, 6000)
await sleep(wait)
const shots = []
p.ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.method !== 'Page.screencastFrame') return
  shots.push([m.params.metadata.timestamp, m.params.data])
  p.send('Page.screencastFrameAck', { sessionId: m.params.sessionId })
})
await p.send('Page.startScreencast', { format: 'png', maxWidth: 360, maxHeight: 225, everyNthFrame: 1 })
await sleep(400)
const tw = Date.now() / 1000
await stroke(p, 'gentle300-up')
await sleep(300)
await p.send('Page.stopScreencast')
const rows = []
const tmp = `${process.cwd()}/.back-frame.png`
for (const [t, d] of shots) {
  writeFileSync(tmp, Buffer.from(d, 'base64'))
  // the arch's middle at 1440 × 900 (x 128–440, y 248–700), in the 360 × 225 frame
  const raw = execFileSync('/usr/local/bin/ffmpeg', ['-loglevel', 'error', '-i', tmp, '-vf', 'crop=78:113:32:62,scale=1:1:flags=area', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'])
  rows.push([Math.round((t - tw) * 1000), raw[0]])
}
console.log(`back after ${wait} ms at Weddings:`, rows.filter(([t]) => t >= 0 && t <= 800).map(([t, v]) => `${t}:${v}`).join(' '))
p.ws.close()
process.exit(0)
