import { writeFileSync } from 'node:fs'
const [, , W, H, dir] = process.argv
const tab = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0, n = 0, rec = false; const wait = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) }
  if (m.method === 'Page.screencastFrame') { ws.send(JSON.stringify({ id: ++id, method: 'Page.screencastFrameAck', params: { sessionId: m.params.sessionId } })); if (rec) writeFileSync(`${dir}/f${String(n++).padStart(4, '0')}-${Math.round(m.params.metadata.timestamp * 1000) % 100000}.jpg`, Buffer.from(m.params.data, 'base64')) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:3100/' }); await sleep(4000)
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await sleep(3500)
const wheel = async (dy, k) => { for (let i = 0; i < k; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: +W / 2, y: +H / 2, deltaX: 0, deltaY: dy }); await sleep(16) } }
await send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: +W / 2, everyNthFrame: 1 })
rec = true
const ys = []
const poll = setInterval(async () => ys.push(await ev('return Math.round(scrollY)+" "+(document.documentElement.dataset.pass||"-")')), 50)
await wheel(20, 3); await sleep(3200)
clearInterval(poll)
rec = false; await send('Page.stopScreencast')
console.log([...new Set(ys)].join(' | '), n, 'frames')
ws.close()
