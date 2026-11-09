// journey.mjs <w> <h> [touch] [port]: test Chrome :9223 — the whole page, one stroke at a time, down to the end and back to the top.
// After each stroke: section, Method/About phase, the bar's label, scrollY. Through it: fps, frames over 50 ms, console errors,
// horizontal overflow at each stop, and checks: the bar's label against the section seen.
const [, , W = '1440', H = '900', touch = '', port = '3100'] = process.argv
const mobile = touch === 'touch'
const t = (await (await fetch('http://localhost:9223/json/list')).json()).find((x) => x.type === 'page')
const ws = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
const errs = []
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description?.slice(0, 160))
  if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning'))
    errs.push(m.params.type + ': ' + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 160))
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errs.push('log: ' + m.params.entry.text.slice(0, 160))
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m)
    wait.delete(m.id)
  }
}
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    wait.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const ev = async (js) => {
  const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })
  return r.result?.result?.value ?? r.result?.exceptionDetails?.text
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Runtime.enable')
await send('Log.enable')
await send('Page.enable')
await send('Page.bringToFront')
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: mobile ? 3 : 1, mobile })
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
await send('Page.navigate', { url: `http://localhost:${port}/?j=${Date.now()}` })
await sleep(7000)
// the entrance: a tap or a click completes it
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: +W / 2, y: +H / 2, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: +W / 2, y: +H / 2, button: 'left', clickCount: 1 })
await sleep(4500)
// fps tape for the whole run
await ev(`window.__d = []; let l = performance.now(); window.__on = true; const f = (t) => { window.__d.push(t - l); l = t; if (window.__on) requestAnimationFrame(f) }; requestAnimationFrame(f); return 1`)
const rest = () =>
  ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const state = () =>
  ev(`const R = document.documentElement, s = R.dataset.section || '-', m = document.querySelector('.method'), a = document.querySelector('.about'), w = document.querySelector('.work');
  const lab = (document.querySelector('.bar-sec')?.textContent || '').trim();
  let ph = s; if (s === 'work') ph = 'W' + (w?.dataset.ch ?? ''); if (m && m.dataset.phase !== 'pre' && (s === 'method' || s === 'work')) ph = m.dataset.phase; if (a && a.dataset.phase !== 'pre' && s === 'about') ph = a.dataset.phase;
  const ov = R.scrollWidth - R.clientWidth; const end = scrollY >= R.scrollHeight - innerHeight - 2;
  return { y: Math.round(scrollY), s, ph, lab, ov, end, top: scrollY < 2 }`)
const stroke = async (dy) => {
  if (mobile) {
    await send('Input.synthesizeScrollGesture', { x: 100, y: Math.round(+H * (dy > 0 ? 0.75 : 0.3)), yDistance: -dy, speed: 1500, gestureSourceType: 'touch', preventFling: false })
  } else {
    const steps = [0.3, 0.3, 0.28, 0.26, 0.24, 0.22, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01]
    for (const k of steps) {
      await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: +W / 2, y: +H / 2, deltaX: 0, deltaY: Math.round(dy * k) })
      await sleep(16)
    }
  }
}
const out = { down: [], up: [] }
const odd = []
const label = (st) => `${st.ph}${st.lab ? '[' + st.lab.replace(/\s+/g, ' ') + ']' : ''}`
const check = (st, dir) => {
  if (st.ov) odd.push(`${dir} y${st.y}: horizontal overflow ${st.ov}px`)
  const want = { work: '01', method: '02', about: '03', questions: '04', contact: '05' }[st.s]
  if (want && !st.lab.startsWith(want)) odd.push(`${dir} y${st.y}: section ${st.s}, bar says "${st.lab}"`)
}
let lastY = -1, same = 0
for (let i = 0; i < 70; i++) {
  await stroke(mobile ? 320 : 400)
  await sleep(200)
  await rest()
  let st = await state()
  if (st.y === lastY && ++same >= 2) {
    odd.push(`down y${st.y}: STUCK (${st.ph}) — 3 strokes without moving; pushed 0.5 screen by script`)
    await ev(`document.documentElement.style.scrollSnapType='none'; scrollBy(0, innerHeight*0.5); await new Promise(r=>setTimeout(r,500)); document.documentElement.style.removeProperty('scroll-snap-type'); return 1`)
    await sleep(1500); same = 0; st = await state(); out.down.push('⟂STUCK')
  } else if (st.y !== lastY) same = 0
  lastY = st.y
  out.down.push(label(st))
  check(st, 'down')
  if (st.end) break
  await sleep(2400)
}
await sleep(1500)
lastY = -1; same = 0
for (let i = 0; i < 70; i++) {
  await stroke(mobile ? -320 : -400)
  await sleep(200)
  await rest()
  let st = await state()
  if (st.y === lastY && ++same >= 2) {
    odd.push(`up y${st.y}: STUCK (${st.ph}) — 3 strokes without moving; pushed 0.5 screen by script`)
    await ev(`document.documentElement.style.scrollSnapType='none'; scrollBy(0, -innerHeight*0.5); await new Promise(r=>setTimeout(r,500)); document.documentElement.style.removeProperty('scroll-snap-type'); return 1`)
    await sleep(1500); same = 0; st = await state(); out.up.push('⟂STUCK')
  } else if (st.y !== lastY) same = 0
  lastY = st.y
  out.up.push(label(st))
  check(st, 'up')
  if (st.top) break
  await sleep(1800)
}
const tape = await ev(`window.__on = false; const d = window.__d.slice(1); const s = d.reduce((a, b) => a + b, 0); return { fps: +(d.length / (s / 1000)).toFixed(1), worst: Math.round(Math.max(...d)), over50: d.filter((x) => x > 50).length, frames: d.length }`)
console.log(`== ${W}x${H}${mobile ? ' touch' : ''}`)
console.log('down:', out.down.join(' '))
console.log('up:  ', out.up.join(' '))
console.log('tape:', JSON.stringify(tape))
console.log('odd:', odd.length ? '\n  ' + odd.join('\n  ') : 'none')
console.log('errors:', errs.length ? '\n  ' + [...new Set(errs)].join('\n  ') : 'none')
await send('Emulation.clearDeviceMetricsOverride')
ws.close()
