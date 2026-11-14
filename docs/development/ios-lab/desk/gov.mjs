// desktop Chrome, 1728×942: strong strokes (the browser's own trackpad gestures) from given places; how far the page went, where it rested
const W = 1728, H = 942
const tab = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:3100/' }); await sleep(4000)
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await sleep(3500)
const name = `const R=document.documentElement, s=R.dataset.section; const n = s==='work'?'Work ch'+document.querySelector('.work').dataset.ch:s==='method'?'Method '+document.getElementById('method').dataset.phase:s==='about'?'About '+document.getElementById('about').dataset.phase:s; return Math.round(scrollY)+' '+n+('wheelHeld' in R.dataset?' HELD':'')`
const place = async (y) => { await ev(`const R=document.documentElement; R.style.scrollSnapType='none'; scrollTo(0, ${y}); await new Promise(r=>setTimeout(r,500)); R.style.removeProperty('scroll-snap-type'); return 1`); await sleep(3200) }
const go = async (label, dist, speed = 5000) => {
  const from = await ev(name)
  await ev(`window.__ys=[]; const f=()=>{window.__ys.push(Math.round(scrollY)); if(window.__ys.length<240) requestAnimationFrame(f)}; f(); return 1`)
  await send('Input.synthesizeScrollGesture', { x: W / 2, y: H / 2, yDistance: -dist, speed, gestureSourceType: 'mouse' })
  await sleep(2500)
  const ys = await ev('return window.__ys')
  console.log(`${label.padEnd(34)} ${from.padEnd(22)} → ${(await ev(name)).padEnd(22)} | went ${Math.min(...ys)}…${Math.max(...ys)}`)
}
const end = await ev('return document.documentElement.scrollHeight - innerHeight')
console.log('page end', end)
await place(7725); await go('Method 9, strong down', 2400)
await place(8855); await go('Method 11, strong down', 2600)
await sleep(300); await go('About 12 passage, strong down', 2600)
await place(10880); await sleep(300); await go('About 14 story, strong down', 3000)
await place(end); await sleep(1000); await go('the end, strong down', 3000)
await go('the end, strong up', -3000)
await place(0); await sleep(500); await go('top, strong up', -2000)
await go('top, down: the passage', 600, 2000)
await sleep(2500); await go('Weddings, strong down', 3000)
await sleep(1500); await go('Artists, strong down', 3000)
await sleep(1500); await go('Experiences, strong down', 3000)
await sleep(1500); await go('Method 7, strong up', -3000)
await sleep(1500); await go('Experiences, strong up', -3000)
ws.close()
