// xwalk.mjs: Xiaomi — the whole page by touch strokes, normal and strong, down to the end and back to the top; where.js after each
import { readFileSync } from 'node:fs'
const WHERE = readFileSync(new URL('./where.js', import.meta.url), 'utf8')
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3133/'))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.navigate', { url: 'http://localhost:3133/?wake&t=' + Date.now() }); await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(4500)
const H = await ev('return innerHeight')
const stroke = (down, dist, speed) => send('Input.synthesizeScrollGesture', { x: 120, y: down ? Math.round(H * 0.8) : Math.round(H * 0.25), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', repeatCount: 0, preventFling: false })
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const wh = () => ev(WHERE)
const walk = async (lab, n, down, dist, speed, pause) => { const o = []; for (let i = 0; i < n; i++) { await stroke(down, dist, speed); await rest(); o.push(await wh()); await sleep(pause) } console.log(lab + ':', o.join(' ')) }
const toWork = async () => { await ev(`document.querySelector('.menu a[href="#work"]').click(); return 1`); await sleep(3000); await rest() }
console.log('início:', await wh())
await toWork(); console.log('#work:', await wh())
await walk('normal ↓', 21, true, 320, 1200, 2600); await walk('normal ↑', 22, false, 320, 1200, 2200)
await toWork(); await walk('forte ↓', 18, true, 700, 6000, 2600); await walk('forte ↑', 20, false, 700, 6000, 2200)
ws.close()
