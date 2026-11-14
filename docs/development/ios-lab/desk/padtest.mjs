// desktop Chrome: trackpad-like strokes (ramp, then momentum fading) one after another, where the page rests after each
const [, , W = '1728', H = '942', scen = 'all'] = process.argv
const tab = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:3100/' }); await sleep(4000)
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await sleep(3500)
// a stroke: 5 events rising to `peak`, then momentum ×0.9 per event for `len` events, every 16 ms
const stroke = async (way, peak = 60, len = 35) => {
  // the browser's own gesture (wheel events with a trackpad's phases), not awaited: momentum-like overlap is up to the caller's gap
  const dist = Math.round(peak * 14 * (len / 35))
  await send('Input.synthesizeScrollGesture', { x: +W / 2, y: +H / 2, yDistance: -way * dist, speed: 2400, gestureSourceType: 'mouse' })
}
const where = () => ev(`const R=document.documentElement; return Math.round(scrollY)+' '+(R.dataset.section||'')+' a'+document.getElementById('about').dataset.phase+' '+(R.classList.contains('c-dusk')?'dusk':'')+('cOn' in R.dataset?' ON':'')+('cHold' in R.dataset?' HOLD':'')+('cRun' in R.dataset?' run':'')`)
const jump = async (h) => { await ev(`document.querySelector('.bar-menu').click(); return 1`); await sleep(1500); await ev(`document.querySelector('.menu a[href="${h}"]').click(); return 1`); await sleep(3500) }
const series = async (label, way, n, gap) => { const out = []; for (let i = 0; i < n; i++) { await stroke(way); await sleep(gap); out.push(await where()) } console.log(label + ':\n  ' + out.join('\n  ')) }
if (scen === 'all' || scen === 'in') {
  // bug 10: from the Questions' stop, strokes onwards one after another (~0.75 s apart, the page never at rest 250 ms)
  await jump('#questions'); console.log('start', await where())
  await series('onwards, strokes every ~0.8 s', 1, 8, 50)
}
if (scen === 'all' || scen === 'back') {
  // bugs 7/8: from the Contact's stop, strokes back one after another
  await jump('#contact'); console.log('start', await where())
  await series('back, strokes every ~0.8 s', -1, 7, 50)
}
if (scen === 'all' || scen === 'm11') {
  await jump('#method'); await sleep(2000)
  await ev(`const R=document.documentElement; R.style.scrollSnapType='none'; scrollTo(0, 8855); await new Promise(r=>setTimeout(r,500)); R.style.removeProperty('scroll-snap-type'); return 1`); await sleep(3000)
  console.log('at', await where(), 'm' + (await ev(`return document.getElementById('method').dataset.phase`)))
  const t = []
  const poll = setInterval(async () => t.push(await ev(`const R=document.documentElement; return Math.round(scrollY)+'/'+getComputedStyle(R).scrollSnapType.split(' ')[0]+'/'+(R.dataset.section||'')+'/a'+document.getElementById('about').dataset.phase`)), 30)
  send('Input.synthesizeScrollGesture', { x: +W / 2, y: +H / 2, yDistance: -(+process.argv[5] || 900), speed: +process.argv[6] || 3000, gestureSourceType: 'mouse' })
  await sleep(3500); clearInterval(poll)
  const u = t.filter((x, i) => x !== t[i - 1])
  console.log('strong stroke from 11:', u.join(' › '))
  console.log('rest', await where())
}
ws.close()
