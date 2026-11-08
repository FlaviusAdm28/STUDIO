// xfps.mjs <prefix>: Xiaomi — the passage 6 → 7 and back, by touch strokes: fps and frames over 50 ms, 3 times each
const [, , prefix = 'http://localhost:3130/'] = process.argv
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith(prefix))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.navigate', { url: prefix + '?wake&t=' + Date.now() }); await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(4500)
const H = await ev('return innerHeight')
const stroke = (down) => send('Input.synthesizeScrollGesture', { x: 120, y: Math.round(H * (down ? 0.75 : 0.3)), yDistance: down ? -300 : 300, speed: 1200, gestureSourceType: 'touch', preventFling: false })
const rec = () => ev('window.__d = []; let l = performance.now(); window.__on = true; const f = (t) => { window.__d.push(t - l); l = t; if (window.__on) requestAnimationFrame(f) }; requestAnimationFrame(f); return 1')
const end = () => ev('window.__on = false; const d = window.__d.slice(1); const s = d.reduce((a, b) => a + b, 0); return JSON.stringify({ fps: +(d.length / (s / 1000)).toFixed(1), worst: Math.round(Math.max(...d)), over50: d.filter((x) => x > 50).length })')
await ev(`document.documentElement.style.scrollSnapType = 'none'; scrollTo(0, document.querySelector('.m-snap[data-at="out"]').getBoundingClientRect().top + scrollY); await new Promise(r => setTimeout(r, 400)); document.documentElement.style.scrollSnapType = ''; return 1`); await sleep(2500)
for (let i = 0; i < 3; i++) {
  await rec(); await stroke(true); await sleep(3200); console.log('6 → 7', await end(), await ev("return document.querySelector('.method').dataset.phase"))
  await rec(); await stroke(false); await sleep(2500); console.log('7 → 6', await end(), await ev("return document.querySelector('.method').dataset.phase"))
}
ws.close()
