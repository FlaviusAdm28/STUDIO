// xc.mjs: Xiaomi (CDP :9222, Chrome Android), the Contact by touch strokes; state checked at each rest (cstate.js)
import { readFileSync } from 'node:fs'
const STATE = readFileSync(new URL('./cstate.js', import.meta.url), 'utf8')
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3133/'))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.navigate', { url: 'http://localhost:3133/?wake&t=' + Date.now() }); await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(4500)
const H = await ev('return innerHeight'), W = await ev('return innerWidth')
const stroke = (down, dist, speed, noFling) => send('Input.synthesizeScrollGesture', { x: 120, y: down ? Math.round(H * 0.8) : Math.round(H * 0.25), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', repeatCount: 0, preventFling: !!noFling })
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const st = () => ev(STATE)
const jump = async (to) => { await ev(`document.querySelector('.menu a[href="${to}"]').click(); return 1`); await sleep(3000); await rest(); await sleep(3500) }
const seq = async (label, n, down, dist, speed, pause = 3500) => { const o = []; for (let i = 0; i < n; i++) { await stroke(down, dist, speed); await rest(); await sleep(pause); o.push(await st()) } console.log(label, o.join('  ')) }
console.log('ecrã', W, '×', H)
await jump('#questions'); console.log('salto #questions:', await st())
await seq('normal ↓ desde Q:', 3, true, 320, 1200); await seq('normal ↑:', 4, false, 320, 1200)
await jump('#questions'); await seq('forte ↓ desde Q:', 3, true, 700, 6000); await seq('forte ↑:', 4, false, 700, 6000)
await jump('#questions'); { const o = []; await stroke(true, Math.round(H * 0.3), 400, true); await rest(); await sleep(3500); o.push('lento 30 %→' + (await st())); await stroke(true, Math.round(H * 0.7), 400, true); await rest(); await sleep(3500); o.push('lento 70 %→' + (await st())); console.log('arrastos lentos sem largar com força:', o.join('  ')) }
await jump('#questions'); for (let i = 0; i < 5; i++) { stroke(true, 400, 3000); await sleep(350); stroke(false, 400, 3000); await sleep(350) } await rest(); await sleep(4000); console.log('vaivém a meio da passagem (5×), depois:', await st())
await jump('#questions'); stroke(true, 450, 4000); await sleep(300); await stroke(true, 450, 4000); await rest(); await sleep(3500); const two = await st(); stroke(false, 450, 4000); await sleep(300); await stroke(false, 450, 4000); await rest(); await sleep(3500); console.log('dois gestos seguidos ↓ e depois ↑:', two, ' ', await st())
// taps
await jump('#contact'); const tapAt = async (x, y) => { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(600) }
await tapAt(Math.round(W / 2), Math.round(H * 0.85)); console.log('toque no escuro do Contact: perguntas abertas =', await ev(`return document.querySelectorAll('.q-btn[aria-expanded="true"]').length`), await st())
await jump('#questions'); const b = await ev(`const r = document.querySelector('.q-btn').getBoundingClientRect(); return [Math.round(r.left + 40), Math.round(r.top + r.height / 2)]`); await tapAt(b[0], b[1]); const opened = await ev(`return document.querySelectorAll('.q-btn[aria-expanded="true"]').length`); await tapAt(b[0], b[1]); console.log('toque na 1.ª pergunta: abriu =', opened, ' fechou =', (await ev(`return document.querySelectorAll('.q-btn[aria-expanded="true"]').length`)) === 0)
// fps of each passage
const fps = async (label, act) => { await ev('window.__F = []; const f = (t) => { window.__F.push(t); if (window.__F.length < 600) window.__raf = requestAnimationFrame(f) }; window.__raf = requestAnimationFrame(f); return 1'); await act(); await sleep(3800); const r = await ev('cancelAnimationFrame(window.__raf); const F = window.__F, d = F.slice(1).map((t, i) => t - F[i]); const s = d.reduce((a, b) => a + b, 0); return [(1000 * d.length / s).toFixed(1) + " fps", "pior " + Math.max(...d).toFixed(0) + " ms", "> 50 ms: " + d.filter((x) => x > 50).length + "/" + d.length].join(", ")'); console.log('fps', label + ':', r) }
await jump('#questions'); await fps('Q → C', () => stroke(true, 320, 1200)); await fps('C → fim', () => stroke(true, 320, 1200)); await fps('fim → C', () => stroke(false, 320, 1200)); await fps('C → Q', () => stroke(false, 320, 1200))
console.log('erros de consola: ver abaixo'); ws.close()
