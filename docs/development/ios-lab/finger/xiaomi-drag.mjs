// a real-touch drag on the Xiaomi over CDP (touchStart, touchMoves, touchEnd): the page gets the touches, Chrome scrolls with them
// usage: node xiaomi-drag.mjs (the lab's Xiaomi tab on localhost:3133; adb forward tcp:9222 localabstract:chrome_devtools_remote)
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3133/'))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const st = () => ev(`return Math.round(scrollY) + ' ' + document.documentElement.dataset.section + ' open ' + document.querySelectorAll('#questions .q-row.is-open').length + (document.documentElement.classList.contains('c-dusk') ? ' D' : '') + ' touches ' + (window.__te || 0)`)
const drag = async (dy, ms, hold) => {
  const x = 120, y0 = 520, steps = Math.max(2, Math.round(ms / 16))
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] })
  for (let i = 1; i <= steps; i++) { await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: Math.round(y0 - (dy * i) / steps) }] }); await sleep(16) }
  if (hold) await sleep(hold)
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}
for (const [dy, ms, hold] of [[90, 600, 300], [150, 700, 300], [250, 900, 300], [300, 150, 0]]) {
  await ev(`document.querySelector('.menu a[href="#questions"]').click(); return 1`); await sleep(4000)
  await ev(`document.querySelectorAll('#questions .q-row').forEach((r, j) => { if ((j === 6) !== r.classList.contains('is-open')) r.querySelector('.q-btn').click() }); await new Promise(r => setTimeout(r, 1000)); window.__te = 0; if (!window.__teOn) { window.__teOn = 1; addEventListener('touchstart', () => window.__te++, { passive: true }) } return 1`)
  const before = await st()
  await drag(dy, ms, hold)
  await sleep(3000)
  console.log(`real-touch drag ${dy} px over ${ms} ms, held ${hold} ms (answer 6 open): before ${before} → after ${await st()}`)
}
ws.close()
