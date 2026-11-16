// xiaomi-pass-drag.mjs <n> [dy] [ms]: the Work's passage on the Xiaomi by real-touch drags only (Input.dispatchTouchEvent), n cycles
// top → Weddings → top; tape per frame: scrollY, data-pass, overflow, data-pass-zone; snap events with their target; scrollend
import { readFileSync } from 'node:fs'
const WHERE = readFileSync(new URL('./where.js', import.meta.url), 'utf8')
const [, , N = '10', DY = '300', MS = '400', HOLD = '0'] = process.argv
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
await ev(`window.__ys=[]; window.__sn=[]; window.__t0=performance.now(); const tg=e=>{const b=e.snapTargetBlock; return b?((b.dataset&&b.dataset.at)||b.className||b.tagName):'-'}; for (const k of ['scrollsnapchanging','scrollsnapchange']) document.addEventListener(k,e=>window.__sn.push([Math.round(performance.now()-window.__t0),k==='scrollsnapchanging'?'~':'=',tg(e)])); addEventListener('scrollend',()=>window.__sn.push([Math.round(performance.now()-window.__t0),'end',Math.round(scrollY)])); addEventListener('touchstart',()=>window.__sn.push([Math.round(performance.now()-window.__t0),'finger','down']),{passive:true}); addEventListener('touchend',()=>window.__sn.push([Math.round(performance.now()-window.__t0),'finger','up']),{passive:true}); const f=()=>{const R=document.documentElement; window.__ys.push([Math.round(performance.now()-window.__t0), Math.round(scrollY), R.dataset.pass||'', R.style.overflow||'', 'passZone' in R.dataset?'z':'']); requestAnimationFrame(f)}; f(); return 1`)
const drag = async (dy, ms) => { const x = 120, y0 = Math.round(H * (dy > 0 ? 0.8 : 0.25)), steps = Math.max(2, Math.round(ms / 16))
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] })
  let last; for (let i = 1; i <= steps; i++) { last = send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: Math.round(y0 - (dy * i) / steps) }] }); await sleep(16) }
  await last; if (+HOLD) await sleep(+HOLD); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }) }
let bad = 0
const one = async (lab, dy, ms, expect) => {
  const from = await wh(); const t0 = await ev('return Math.round(performance.now()-window.__t0)'); const s0 = await ev('return window.__sn.length')
  await drag(dy, ms); await sleep(2500); await rest(); const to = await wh(); await sleep(1500); const later = await wh()
  const ys = await ev(`return window.__ys.filter(a=>a[0]>=${t0})`); const sn = await ev(`return window.__sn.slice(${s0})`)
  const comp = []; let last = null; for (const [t, y, p, o, z] of ys) { const k = `${y}:${p}${o ? '/' + o : ''}${z}`; if (k !== last) { comp.push(`${t - t0}:${k}`); last = k } }
  const ok = later.startsWith(expect) && to.startsWith(expect); if (!ok) bad++
  console.log(`${ok ? '  ' : '⚠ '}${lab}  ${from} → ${to}${later !== to ? '  (1,5 s depois: ' + later + ')' : ''}\n   snap ${sn.map((a) => (a[0] - t0) + ':' + a[1] + a[2]).join(' ')}\n   tape ${comp.slice(0, 9).join(' ')}${comp.length > 9 ? ' … ' + comp.slice(-3).join(' ') : ''}`)
}
console.log('H', H, 'início:', await wh(), `drag ${DY} px / ${MS} ms, finger held ${HOLD} ms × ${N}`)
for (let i = 0; i < +N; i++) { await one(`↓ ${i + 1}`, +DY, +MS, 'W0@'); await one(`↑ ${i + 1}`, -DY, +MS, 'top@0') }
console.log(`errados: ${bad} de ${2 * N}`)
ws.close()
