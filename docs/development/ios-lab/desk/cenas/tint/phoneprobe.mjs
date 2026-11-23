// phoneprobe.mjs [hour] [w] [h]: a phone's Chrome (Android's path: touch, coarse pointer, no hover) in headless Chrome — from the Method's 7
// (an address jump) the page moved down a quarter screen at a time; at each Method phase reached, the colour the page gives Chrome's bar
// (theme-color) against the true average of the screen's first 4 rows. The Xiaomi is the verdict; this is the check before it.
import { writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { sleep } from '../h.mjs'
const [HOUR = '22', W = '390', H = '844'] = process.argv.slice(2)
const PORT = process.env.PORT || 9333
const t = await (await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m)
    wait.delete(m.id)
  }
}
const send = (method, params = {}) =>
  new Promise((r) => {
    wait.set(++id, r)
    ws.send(JSON.stringify({ id, method, params }))
  })
const ev = async (js) => (await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })).result?.result?.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: Number(W), height: Number(H), deviceScaleFactor: 1, mobile: true })
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
await send('Emulation.setEmulatedMedia', { features: [{ name: 'pointer', value: 'coarse' }, { name: 'hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }] })
await send('Page.navigate', { url: `http://localhost:3147/?hour=${HOUR}#method` })
await sleep(5000)
// &nokey (argv 5): the hour's light switched off (--m-key transparent): the room alone, on the page and in what it says
if (process.argv[5] === 'nokey') await ev(`document.getElementById('method').style.setProperty('--m-key','transparent');return 1`)
const out = []
let last = ''
for (let i = 0; i < 40; i++) {
  const s = await ev(`const m=document.getElementById('method');return {y:Math.round(scrollY),ph:m.dataset.phase,theme:document.querySelector('meta[name="theme-color"]')?.content,edge:m.dataset.edge??''}`)
  if (s.ph !== last) {
    await sleep(2200)
    const s2 = await ev(`const m=document.getElementById('method');return {y:Math.round(scrollY),ph:m.dataset.phase,theme:document.querySelector('meta[name="theme-color"]')?.content,edge:m.dataset.edge??''}`)
    const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: s2.y, width: Number(W), height: 4, scale: 1 } })
    const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', 'pipe:0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { input: Buffer.from(r.result.data, 'base64') })
    const n = raw.length / 3
    const top = [0, 1, 2].map((c) => { let v = 0; for (let k = c; k < raw.length; k += 3) v += raw[k]; return Math.round(v / n) })
    out.push({ ...s2, top })
    console.log(JSON.stringify({ ...s2, top }))
    last = s.ph
    if (s.ph === '11') break
  }
  await ev(`scrollBy(0, innerHeight / 4)`)
  await sleep(700)
}
mkdirSync(`${import.meta.dirname}/runs`, { recursive: true })
writeFileSync(`${import.meta.dirname}/runs/phoneprobe-${HOUR}h-${W}x${H}.json`, JSON.stringify(out))
ws.close()
process.exit(0)
