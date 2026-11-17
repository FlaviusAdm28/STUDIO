// xiaomi-hoje.mjs [prefix]: Xiaomi — the site as visitors have it (no conductor), after 17 Nov's changes (the Work's names in
// turn, the way back's first frame): where the names sit on the phone (stacked, not a row: the turning row must not apply there), a
// walk down to the Method's 7 and back to the top by touch strokes — where the page is, fps and frames over 50 ms per stroke, the strokes'
// times for a screen recording made alongside — and the page's errors.
//   adb reverse tcp:3100 tcp:3100; adb forward tcp:9222 localabstract:chrome_devtools_remote; a Chrome tab on http://localhost:3100/
import { readFileSync } from 'node:fs'
const [, , prefix = 'http://localhost:3100/'] = process.argv
const WHERE = readFileSync(new URL('./where.js', import.meta.url), 'utf8')
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith(prefix))
const ws = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
const errors = []
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m)
    wait.delete(m.id)
  }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails?.exception?.description ?? m.params.exceptionDetails?.text)
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value ?? a.description).join(' '))
}
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    wait.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const ev = async (js) => {
  const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })
  return r.result?.result?.value ?? r.result?.exceptionDetails?.text
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Runtime.enable')
await send('Page.enable')
await send('Page.navigate', { url: prefix + '?' + (process.env.Q ? process.env.Q + '&' : '') + 't=' + Date.now() })
await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] })
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
await sleep(4500)
const H = await ev('return innerHeight')
console.log('viewport', await ev('return innerWidth + "×" + innerHeight + " dpr " + devicePixelRatio'))

// the names on the phone: each chapter's in the DOM's order, where each sits, and whether they make a row (the turning row's condition)
console.log(
  'names:',
  await ev(`
  return [...document.querySelectorAll('.w-ch')].map((c) => {
    const n = [...c.querySelectorAll('.w-nav-ch')]
    const r = n.map((e) => e.getBoundingClientRect())
    const row = n.every((e, i) => i === 0 || r[i].left >= r[i - 1].right - 1)
    const label = (e, i) => e.textContent.trim().split(' ')[0] + '(' + e.dataset.role + ' x' + Math.round(r[i].left) + ' y' + Math.round(r[i].top) + ')'
    return c.dataset.c + ': ' + n.map(label).join(' ') + ' row=' + row
  }).join(' | ')`),
)

const stroke = (down, dist = 320, speed = 1200) =>
  send('Input.synthesizeScrollGesture', { x: 120, y: Math.round(H * (down ? 0.75 : 0.3)), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', preventFling: false })
const rec = () =>
  ev('window.__d = []; let l = performance.now(); window.__on = true; const f = (t) => { window.__d.push(t - l); l = t; if (window.__on) requestAnimationFrame(f) }; requestAnimationFrame(f); return 1')
const end = () =>
  ev('window.__on = false; const d = window.__d.slice(2); const s = d.reduce((a, b) => a + b, 0); return d.length ? (d.length / (s / 1000)).toFixed(0) + " fps, worst " + Math.round(Math.max(...d)) + " ms, >50 ms: " + d.filter((x) => x > 50).length : "-"')
const where = () => ev(WHERE)
// the strokes' times from the start, to find them in a screen recording made alongside (adb shell screenrecord)
const t0 = Date.now()
console.log("t0 epoch", t0)
const go = async (down, label) => {
  const before = await where()
  await rec()
  const at = Date.now() - t0
  await stroke(down)
  await sleep(2600)
  console.log(`${String(at).padStart(6)} ms  ${label.padEnd(2)} ${before.padEnd(10)} → ${(await where()).padEnd(10)} ${await end()}`)
}
console.log('início:', await where())
for (let i = 0; i < 7; i++) {
  const w = await where()
  void w
  await go(true, '↓')
  if (/^(7|8)/.test(await where())) break
}
for (let i = 0; i < 6; i++) {
  const w = await where()
  if (/^topo/.test(w)) break
  await go(false, '↑')
}
console.log('fim:', await where())
console.log('erros:', errors.length ? errors.join(' || ') : 'nenhum')
ws.close()
