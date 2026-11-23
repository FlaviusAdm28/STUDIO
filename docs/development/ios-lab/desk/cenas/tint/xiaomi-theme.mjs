// xiaomi-theme.mjs [hour] [old,…] [section=method] [last phase=11]: the Xiaomi's Chrome (adb forward tcp:9222 → chrome_devtools_remote; adb reverse tcp:3147) on the tab
// open at localhost:3147 — from the Method's 7 a quarter screen at a time, at each phase: the page's theme-color, Chrome's bar as the
// screen shows it (adb screencap: the toolbar beside its home button) and the page's first rows under it (the middle); with [old] given
// (comma-separated hex), the bar also shown with each of those put in theme-color, the same moment (what it looked like before)
import { execFileSync } from 'node:child_process'
const [HOUR = '22', OLD = '', AT = 'method', END = '11'] = process.argv.slice(2)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const tabs = await (await fetch('http://localhost:9222/json')).json()
const tab = tabs.find((t) => t.type === 'page' && t.url.includes('localhost:3147'))
if (!tab) throw new Error('no tab on localhost:3147')
const ws = new WebSocket(tab.webSocketDebuggerUrl)
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
await send('Page.navigate', { url: `http://localhost:3147/?hour=${HOUR}&t=${Date.now()}#${AT}` })
await sleep(7000)
const W = 1080
const shot = () => execFileSync('adb', ['-s', 'c3e8fb35', 'exec-out', 'screencap'], { maxBuffer: 64 << 20 }) // raw RGBA after a 12/16-byte header
const mean = (buf, x0, x1, y0, y1) => {
  const head = buf.length - W * 2400 * 4
  const s = [0, 0, 0]
  let n = 0
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = head + (y * W + x) * 4
      s[0] += buf[i]
      s[1] += buf[i + 1]
      s[2] += buf[i + 2]
      n++
    }
  return s.map((v) => Math.round(v / n))
}
const read = () => {
  const b = shot()
  return { bar: mean(b, 0, 30, 140, 240), top: mean(b, 380, 700, 262, 280) }
}
let last = ''
for (let i = 0; i < 40; i++) {
  const ph = await ev(`return document.getElementById('${AT}').dataset.phase`)
  if (ph !== last) {
    await sleep(2500)
    const theme = await ev(`return document.querySelector('meta[name="theme-color"]').content`)
    const now = read()
    const row = { ph, theme, bar: now.bar, top: now.top }
    for (const o of OLD ? OLD.split(',') : []) {
      await ev(`document.querySelector('meta[name="theme-color"]').content='${o}';return 1`)
      await sleep(900)
      row[`bar@${o}`] = read().bar
      await ev(`document.querySelector('meta[name="theme-color"]').content='${theme}';return 1`)
      await sleep(600)
    }
    console.log(JSON.stringify(row))
    last = ph
    if (ph === END) break
  }
  await ev(`scrollBy(0, innerHeight / 4);return 1`)
  await sleep(800)
}
ws.close()
process.exit(0)
