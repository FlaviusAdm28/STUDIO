// Xiaomi battery over CDP: touch strokes (Input.synthesizeScrollGesture), phase after each. node xi.mjs <url-prefix> [reload]
const [, , prefix = 'http://localhost:3130/', reload] = process.argv
const list = await (await fetch('http://localhost:9222/json/list')).json()
const t = list.find((x) => x.type === 'page' && x.url.startsWith(prefix))
if (!t) { console.log('no target'); process.exit(1) }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

if (reload) { await send('Page.navigate', { url: prefix + '?wake&t=' + Date.now() }); await sleep(8000); await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(4500) }
const H = await ev('return innerHeight')
const stroke = (down, dist, speed) => send('Input.synthesizeScrollGesture', { x: 120, y: down ? Math.round(H * 0.75) : Math.round(H * 0.3), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', repeatCount: 0, preventFling: false })
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const ph = () => ev(`const m = document.querySelector('.method'), a = document.querySelector('.about'), s = document.documentElement.dataset.section; const y = Math.round(scrollY);
  if (s === 'questions' || s === 'contact') return 'Q' + y; if (a.dataset.phase !== 'pre' && s === 'about') return a.dataset.phase; return m.dataset.phase !== 'pre' ? m.dataset.phase : 'W' + y`)
const goto = async (js) => { await ev(`document.documentElement.style.scrollSnapType = 'none'; ${js}; await new Promise(r => setTimeout(r, 400)); document.documentElement.style.scrollSnapType = ''; return 1`); await sleep(2500) }
const toExp = () => goto(`const m = document.querySelector('.m-snap[data-at="out"]'); scrollTo(0, m.getBoundingClientRect().top + scrollY)`)
const seq = async (label, n, down, dist, speed, pause) => { const o = []; for (let i = 0; i < n; i++) { await stroke(down, dist, speed); await rest(); o.push(await ph()); await sleep(pause) } console.log(label, o.join(' ')) }
await toExp(); await seq('fwd normal:', 13, true, 300, 1200, 2600); await seq('back normal:', 13, false, 300, 1200, 1600)
await toExp(); await seq('fwd strong:', 13, true, 700, 6000, 2600); await seq('back strong:', 13, false, 700, 6000, 1600)
for (const f of [0.15, 0.45, 0.7]) { const o = []; for (let r = 0; r < 2; r++) { await goto(`scrollTo(0, document.querySelector('.method').getBoundingClientRect().top + scrollY - ${f} * 4 * innerHeight)`); await stroke(true, 900, 8000); await rest(); await sleep(3500); o.push(await ph()) } console.log('strong fwd from Work', f, o.join(' ')) }
{ const o = []; for (let r = 0; r < 2; r++) { await goto('scrollTo(0, document.documentElement.scrollHeight)'); await stroke(false, 900, 8000); await rest(); await sleep(1500); o.push(await ph()) } console.log('strong back from bottom', o.join(' ')) }
await toExp(); for (let i = 0; i < 4; i++) { stroke(true, 600, 5000); await sleep(250) } await rest(); console.log('rapid during passage:', await ph()); await sleep(3000); console.log('  then:', await ph()); await stroke(true, 300, 1200); await rest(); console.log('  next:', await ph())
await toExp(); for (let i = 0; i < 5; i++) { await stroke(false, 400, 3000); await sleep(400); await stroke(true, 400, 3000); await sleep(400) } await rest(); await sleep(3000); const a1 = await ph(); await stroke(false, 400, 3000); await rest(); const a2 = await ph(); await stroke(false, 400, 3000); await rest(); console.log('alternation, then 2 back:', a1, a2, await ph())
{ const o = []; for (const to of ['#method', '#about', '#questions', '#contact', '#work']) { await goto(`scrollTo(0, document.querySelectorAll('.m-snap')[0].getBoundingClientRect().top + scrollY)`); await ev(`document.querySelector('.menu a[href="${to}"]').click(); return 1`); await sleep(3500); await rest(); o.push(to + '→' + (await ph())) } console.log('jumps:', o.join(' ')) }
ws.close()
