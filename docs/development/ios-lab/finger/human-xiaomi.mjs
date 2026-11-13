// human-xiaomi.mjs (12 Nov): the Xiaomi walked as a visitor would — down to the end and back to the top with strokes of mixed
// strength (normal, slow, fast), pauses of 0.3–3 s, a stroke back now and then, the menu opened and shut, a moment of the Work
// and a question tapped, then the menu's links from different places. watch.js runs in the page through it; a screenshot at
// every stop. node human-xiaomi.mjs <seed> <outdir>  (Chrome on the Xiaomi at localhost:3133, adb forward 9222)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
const [, , seedArg = '1', out = '/tmp/hx'] = process.argv
mkdirSync(out, { recursive: true })
let seed = +seedArg
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const pick = (a, z) => a + (z - a) * rnd()
const WATCH = readFileSync(new URL('./watch.js', import.meta.url), 'utf8')
const DUMP = readFileSync(new URL('./watch-dump.js', import.meta.url), 'utf8')
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3133/'))
const ws = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
const errs = []
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description?.slice(0, 160))
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m)
    wait.delete(m.id)
  }
}
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Runtime.enable')
await send('Page.navigate', { url: 'http://localhost:3133/?wake&h=' + Date.now() })
await sleep(7000)
const H = await ev('return innerHeight')
const Wd = await ev('return innerWidth')
const tap = async (x, y) => {
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  await sleep(pick(60, 140))
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}
// the centre of the first visible element matching sel, or null
const spot = (sel) => ev(`const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => { const b = e.getBoundingClientRect(); return b.width && b.top >= 0 && b.bottom < innerHeight - 20 && getComputedStyle(e).visibility !== 'hidden' }); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left + b.width / 2), Math.round(b.top + b.height / 2), e.textContent.trim().slice(0, 24)]`)
const tapSel = async (sel) => { const p = await spot(sel); if (!p) return null; await tap(p[0], p[1]); return p[2] }
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const where = () => ev(`const w = window.__w; return w && w.rests.length ? w.rests[w.rests.length - 1] : String(Math.round(scrollY))`)
let shot = 0
const snap = async (tag) => {
  const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 35 })
  if (r.result?.data) writeFileSync(`${out}/${String(++shot).padStart(3, '0')}-${tag.replace(/[^\w@.-]/g, '_')}.jpg`, Buffer.from(r.result.data, 'base64'))
}
const KINDS = { normal: () => [pick(260, 380), pick(900, 1500)], slow: () => [pick(140, 240), pick(300, 600)], fast: () => [pick(550, 800), pick(4000, 7000)] }
const kind = () => { const r = rnd(); return r < 0.6 ? 'normal' : r < 0.8 ? 'slow' : 'fast' }
const stroke = async (down, k = kind()) => {
  const [dist, speed] = KINDS[k]()
  await send('Input.synthesizeScrollGesture', { x: Math.round(pick(80, Wd - 80)), y: down ? Math.round(H * 0.78) : Math.round(H * 0.22), yDistance: down ? -dist : dist, speed: Math.round(speed), gestureSourceType: 'touch', preventFling: false })
  return k[0] + (down ? '↓' : '↑')
}
const trail = []
const step = async (txt) => { await sleep(250); await rest(); await sleep(700); const w = await where(); trail.push(`${txt}:${w}`); await snap(`${txt}-${w}`) }
const menuPeek = async () => {
  if (!(await tapSel('.bar-menu'))) return
  await sleep(pick(700, 2000))
  const y = await ev('return Math.round(scrollY)')
  await stroke(rnd() < 0.5) // scrolling with the menu open: nothing may move
  await sleep(600)
  const y2 = await ev('return Math.round(scrollY)')
  await snap('menu-open')
  trail.push(y2 === y ? 'menu' : `menu(MOVED ${y}→${y2})`)
  await tapSel('.bar-menu')
  await sleep(900)
}
// the entrance: a visitor waits a moment, then taps
await sleep(pick(500, 2500))
await tap(Math.round(Wd / 2), Math.round(H / 2))
await sleep(4500)
console.log('watch:', await ev(WATCH))
const leg = async (down) => {
  for (let i = 0; i < 70; i++) {
    const s = await stroke(down)
    await step(s)
    const w = await where()
    if (down ? w.startsWith('fim') : (await ev('return scrollY')) < 5) break
    const r = rnd()
    if (r < 0.12) {
      await step(await stroke(!down))
    } else if (r < 0.22) await menuPeek()
    else if (r < 0.32 && w.startsWith('W')) {
      const m = await tapSel('.w-mom:not([aria-pressed="true"])')
      if (m) {
        await sleep(pick(800, 2500))
        trail.push('tap:' + m)
      }
    } else if (r < 0.45 && w.startsWith('Q')) {
      const q = await tapSel('.q-btn')
      if (q) {
        await sleep(pick(1000, 3000))
        trail.push('q:' + q)
        await snap('question')
      }
    }
    await sleep(pick(300, 3000))
  }
}
await leg(true)
console.log('down:', trail.splice(0).join(' '))
await sleep(1500)
await leg(false)
console.log('up:', trail.splice(0).join(' '))
// the menu's links from different places
for (let i = 0; i < 6; i++) {
  await tapSel('.bar-menu')
  await sleep(pick(600, 1500))
  const links = await ev(`return [...document.querySelectorAll('.menu-list a')].length`)
  const n = Math.floor(rnd() * links)
  const p = await ev(`const b = document.querySelectorAll('.menu-list a')[${n}].getBoundingClientRect(); return [Math.round(b.left + b.width / 2), Math.round(b.top + b.height / 2), document.querySelectorAll('.menu-list a')[${n}].textContent.trim()]`)
  await tap(p[0], p[1])
  await sleep(3500)
  await step('menu→' + p[2].replace(/\s+/g, ''))
  for (let k = 0; k < 1 + Math.floor(rnd() * 3); k++) await step(await stroke(rnd() < 0.6))
}
console.log('menu:', trail.splice(0).join(' '))
console.log(await ev(DUMP))
console.log('cdp errors:', errs.length ? errs.join(' | ') : 'none')
ws.close()
