import { writeFileSync } from 'node:fs'
const [, , W, H, out, ...ys] = process.argv
const tab = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:3100/' }); await sleep(4000)
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await sleep(3500)
await ev(`document.querySelector('.bar-menu').click(); return 1`); await sleep(1500)
await ev(`document.querySelector('.menu a[href="#method"]').click(); return 1`); await sleep(3500)
for (let k = 0; k < +ys[0]; k++) {
  if (k) { for (let i = 0; i < 3; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: +W / 2, y: +H / 2, deltaX: 0, deltaY: 220 }); await sleep(30) } await sleep(3200) }
  const at = await ev(`return Math.round(scrollY) + ' m=' + document.getElementById('method').dataset.phase`)
  console.log(k, at)
  const s = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${out}-${k}.png`, Buffer.from(s.result.data, 'base64'))
}
ws.close()
