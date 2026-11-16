// xiaomi-pass.mjs: the Work's passage on the Xiaomi, forward (top → Weddings) and back (Weddings → top), by touch: synthesized strokes
// (normal and strong) and real-touch drags; per stroke the tape of scrollY per frame with data-pass and the root's overflow, long frames,
// and whether the page moved on its own after resting (the desktop hold's guard of 14 Nov runs on Android too). Tab on localhost:3133.
import { readFileSync } from 'node:fs'
const WHERE = readFileSync(new URL('./where.js', import.meta.url), 'utf8')
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3133/'))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.bringToFront')
await send('Page.navigate', { url: 'http://localhost:3133/?wake&t=' + Date.now() }); await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(4500)
const H = await ev('return innerHeight')
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const wh = () => ev(WHERE)
await ev(`window.__ys=[]; window.__t0=performance.now(); const f=()=>{const R=document.documentElement; window.__ys.push([Math.round(performance.now()-window.__t0), Math.round(scrollY), R.dataset.pass||'', R.style.overflow||'']); requestAnimationFrame(f)}; f(); return 1`)
const stroke = (down, dist, speed) => send('Input.synthesizeScrollGesture', { x: 120, y: down ? Math.round(H * 0.8) : Math.round(H * 0.25), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', repeatCount: 0, preventFling: false })
const drag = async (dy, ms) => { const x = 120, y0 = Math.round(H * (dy > 0 ? 0.8 : 0.25)), steps = Math.max(2, Math.round(ms / 16))
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] })
  for (let i = 1; i <= steps; i++) { await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: Math.round(y0 - (dy * i) / steps) }] }); await sleep(16) }
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }) }
const one = async (lab, act) => {
  const from = await wh(); const t0 = await ev('return Math.round(performance.now()-window.__t0)')
  await act(); await sleep(2500); await rest(); const to = await wh(); await sleep(2000); const later = await wh()
  const ys = await ev(`return window.__ys.filter(a=>a[0]>=${t0})`)
  const gaps = ys.slice(1).map((a, i) => a[0] - ys[i][0]); const long = gaps.filter((g) => g > 50)
  const comp = []; let last = null; for (const [t, y, p, o] of ys) { const k = `${y}:${p}${o ? '/' + o : ''}`; if (k !== last) { comp.push(`${t - t0}:${k}`); last = k } }
  console.log(`${lab}  ${from} → ${to}${later !== to ? '  ⚠ 2 s depois: ' + later : ''}\n   frames ${ys.length}, >50 ms: ${long.length}${long.length ? ' (' + long.join(' ') + ')' : ''}; tape ${comp.slice(0, 10).join(' ')}${comp.length > 10 ? ' … ' + comp.slice(-2).join(' ') : ''}`)
}
console.log('H', H, 'início:', await wh())
for (let i = 0; i < 3; i++) { await one(`normal ↓ ${i + 1}`, () => stroke(true, 320, 1200)); await one(`normal ↑ ${i + 1}`, () => stroke(false, 320, 1200)) }
for (let i = 0; i < 3; i++) { await one(`forte ↓ ${i + 1}`, () => stroke(true, 700, 6000)); await one(`forte ↑ ${i + 1}`, () => stroke(false, 700, 6000)) }
for (let i = 0; i < 3; i++) { await one(`arrasto ↓ ${i + 1}`, () => drag(300, 400)); await one(`arrasto ↑ ${i + 1}`, () => drag(-300, 400)) }
for (let i = 0; i < 2; i++) { await one(`arrasto lento ↓ ${i + 1}`, () => drag(250, 1200)); await one(`arrasto lento ↑ ${i + 1}`, () => drag(-250, 1200)) }
ws.close()
