// x12.mjs: Xiaomi — the passage 11 → 12 timed (name, portrait, hold), and the hold against a quick second stroke
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3133/'))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.navigate', { url: 'http://localhost:3133/?wake&t=' + Date.now() }); await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(4500)
const H = await ev('return innerHeight')
const stroke = (down, dist = 320, speed = 1200) => send('Input.synthesizeScrollGesture', { x: 120, y: down ? Math.round(H * 0.8) : Math.round(H * 0.25), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', repeatCount: 0, preventFling: false })
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const ph = () => ev(`const m = document.querySelector('.method'), a = document.querySelector('.about'); return a.dataset.phase !== 'pre' ? a.dataset.phase : 'M' + m.dataset.phase`)
const to11 = async () => { await ev(`document.querySelector('.menu a[href="#about"]').click(); return 1`); await sleep(3000); await rest(); await sleep(2500); await stroke(false); await rest(); await sleep(3500); return ph() }
for (let r = 0; r < 2; r++) {
  const at = await to11()
  await ev(`const a = document.querySelector('.about'), n = document.querySelector('.a-name'), f = document.querySelector('.a-frame'); const L = (window.__T = []); const t0 = performance.now(); window.__t0 = t0; const g = () => { L.push([performance.now() - t0, +getComputedStyle(n).opacity, +getComputedStyle(f).opacity, a.dataset.phase, 'passage' in a.dataset ? 1 : 0]); if (performance.now() - t0 < 5000) requestAnimationFrame(g) }; requestAnimationFrame(g); return 1`)
  await stroke(true); await rest(); await sleep(4500)
  const r1 = await ev(`const L = window.__T; const p12 = L.find((x) => x[3] === '12'); const t12 = p12 ? p12[0] : NaN; const at = (pred) => { const x = L.find(pred); return x ? ((x[0] - t12) / 1000).toFixed(2) + ' s' : '—' }; return 'de ' + '${at}' + ': nome começa ' + at((x) => x[3] === '12' && x[1] > 0.02) + ', nome inteiro ' + at((x) => x[3] === '12' && x[1] >= 0.9) + ', retrato inteiro ' + at((x) => x[3] === '12' && x[2] >= 0.98) + ', retenção acaba ' + at((x, i) => x[3] === '12' && i > 0 && L[i - 1][4] === 1 && x[4] === 0)`)
  console.log(r1)
}
// the hold: a second stroke 0.8 s after reaching 12 rests on 12; one after the passage goes on to 13


ws.close()
