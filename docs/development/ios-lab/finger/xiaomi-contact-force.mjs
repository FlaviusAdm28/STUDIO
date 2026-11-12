import { readFileSync } from 'node:fs'
const STATE = readFileSync(new URL('./cstate.js', import.meta.url), 'utf8')
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3133/'))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const H = await ev('return innerHeight')
const stroke = (down, dist, speed) => send('Input.synthesizeScrollGesture', { x: 120, y: down ? Math.round(H * 0.8) : Math.round(H * 0.25), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', repeatCount: 0, preventFling: false })
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const st = () => ev(STATE)
const toEnd = async () => { await ev(`document.documentElement.style.scrollSnapType = 'none'; scrollTo(0, document.documentElement.scrollHeight); await new Promise(r => setTimeout(r, 400)); document.documentElement.style.scrollSnapType = ''; return 1`); await sleep(2500) }
const toC = async () => { await ev(`document.querySelector('.menu a[href="#contact"]').click(); return 1`); await sleep(3000); await rest(); await sleep(3000) }
for (const [lab, dist, speed] of [['forte 700/6000', 700, 6000], ['médio 500/3500', 500, 3500], ['normal 320/1200', 320, 1200]]) {
  const a = [], b = [], c = []
  for (let r = 0; r < 3; r++) { await toEnd(); await stroke(false, dist, speed); await rest(); await sleep(2500); a.push(await st()) }
  for (let r = 0; r < 3; r++) { await toC(); await stroke(false, dist, speed); await rest(); await sleep(2500); b.push(await st()) }
  for (let r = 0; r < 3; r++) { await toC(); await stroke(true, dist, speed); await rest(); await sleep(2500); c.push(await st()) }
  console.log(lab, '| fim ↑:', a.join(' '), '| C ↑:', b.join(' '), '| C ↓:', c.join(' '))
}
ws.close()
