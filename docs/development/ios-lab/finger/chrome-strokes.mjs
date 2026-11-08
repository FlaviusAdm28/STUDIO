// desk.mjs <w> <h> <port> [mobile]: Chrome :9223 — entrance by a click, then one wheel stroke at a time through the page and back,
// the phase after each; then the journey tape (journey.js: fps, long frames, label lag); horizontal overflow
const [, , W, H, port = '3130', mobile] = process.argv
const t = (await (await fetch('http://localhost:9223/json/list')).json()).find((x) => x.type === 'page')
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.enable'); await send('Page.bringToFront')
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: mobile ? 3 : 1, mobile: !!mobile })
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
await send('Page.navigate', { url: `http://localhost:${port}/?t=${Date.now()}` }); await sleep(8000)
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: +W / 2, y: +H / 2, button: 'left', clickCount: 1 }); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: +W / 2, y: +H / 2, button: 'left', clickCount: 1 }); await sleep(4500)
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const ph = () => ev(`const m = document.querySelector('.method'), a = document.querySelector('.about'), s = document.documentElement.dataset.section; const y = Math.round(scrollY);
  if (s === 'questions' || s === 'contact') return 'Q' + y; if (a.dataset.phase !== 'pre' && s === 'about') return a.dataset.phase; return m.dataset.phase !== 'pre' ? m.dataset.phase : 'W' + y`)
const wheel = async (dy) => { if (mobile) await send('Input.synthesizeScrollGesture', { x: 100, y: Math.round(+H * (dy > 0 ? 0.75 : 0.3)), yDistance: -dy, speed: 1500, gestureSourceType: 'touch', preventFling: false }); else { // a trackpad stroke: a burst of wheel events, large then easing off (sum ≈ 3 × dy)
    const steps = [0.3, 0.3, 0.28, 0.26, 0.24, 0.22, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01]
    for (const k of steps) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: +W / 2, y: +H / 2, deltaX: 0, deltaY: Math.round(dy * k) }); await sleep(16) } } }
await ev(`document.documentElement.style.scrollSnapType = 'none'; scrollTo(0, document.querySelector('.method').getBoundingClientRect().top + scrollY - 1.2 * innerHeight); await new Promise(r => setTimeout(r, 400)); document.documentElement.style.scrollSnapType = ''; return 1`); await sleep(2000)
const fwd = []; for (let i = 0; i < 15; i++) { await wheel(mobile ? 320 : 400); await sleep(200); await rest(); fwd.push(await ph()); await sleep(2200) }
const back = []; for (let i = 0; i < 15; i++) { await wheel(mobile ? -320 : -400); await sleep(200); await rest(); back.push(await ph()); await sleep(1600) }
console.log(`${W}x${H}${mobile ? ' touch' : ''} fwd:`, fwd.join(' ')); console.log(`${W}x${H}${mobile ? ' touch' : ''} back:`, back.join(' '))
const ov = await ev('const o = []; for (const y of [0, 0.25, 0.5, 0.75, 1]) { scrollTo(0, y * (document.documentElement.scrollHeight - innerHeight)); await new Promise(r => setTimeout(r, 300)); o.push(document.documentElement.scrollWidth - document.documentElement.clientWidth) } return o.join(",")')
console.log(`${W}x${H} overflow:`, ov)
await send('Emulation.clearDeviceMetricsOverride'); ws.close()
