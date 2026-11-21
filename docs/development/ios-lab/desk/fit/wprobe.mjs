// The Work's text at rest, every chapter and every moment (each moment chosen by a tap, as a visitor may): where its last line ends
// against the screen's foot, and the photograph's pile against the text. Usage: node wprobe.mjs <W> <H> <outdir> [url]
import { writeFileSync, mkdirSync } from 'node:fs'
const [, , W, H, OUT, URL = 'http://localhost:3100/'] = process.argv
mkdirSync(OUT, { recursive: true })
const PORT = process.env.PORT || 9333
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const tab = await (await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m)
    wait.delete(m.id)
  }
}
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => {
  const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })
  return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description
}
const mobile = +W < 900 && +H > +W
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile })
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true })
await send('Page.navigate', { url: URL })
await sleep(3500)
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await sleep(3500)
const MEASURE = (c) => `
const ch = document.querySelector('.w-ch[data-c="${c}"]'), Hv = innerHeight
const seen = [...ch.querySelectorAll('.w-tx *')].filter(e => { const cs = getComputedStyle(e); return e.children.length === 0 && cs.display !== 'none' && e.getClientRects().length && e.textContent.trim() && !e.closest('.w-mo-h') && getComputedStyle(e.closest('.w-mo') || e).display !== 'none' })
const foot = Math.max(...seen.map(e => e.getBoundingClientRect().bottom))
const last = seen.find(e => e.getBoundingClientRect().bottom === foot)
const tx = ch.querySelector('.w-tx').getBoundingClientRect(), st = ch.querySelector('.w-stack').getBoundingClientRect()
return { m: ch.dataset.m, foot: Math.round(foot), room: Math.round(Hv - foot), last: (last?.className || last?.tagName) + ' "' + last?.textContent.trim().slice(0, 20) + '"', txTop: Math.round(tx.top), stackRight: Math.round(st.right), txLeft: Math.round(tx.left) }`
const out = []
for (const c of ['weddings', 'artists', 'experiences']) {
  const stop = c === 'experiences' ? 'experiences' : c
  await ev(`const m = [...document.querySelectorAll('[data-stop]')].find(m => m.dataset.stop === '${stop}'); scrollTo({ top: scrollY + m.getBoundingClientRect().top, behavior: 'instant' }); return 1`)
  await sleep(3000)
  for (const j of [0, 1, 2]) {
    await ev(`document.querySelector('.w-ch[data-c="${c}"] .w-mom[data-j="${j}"]').click(); return 1`)
    await sleep(1600)
    const r = await ev(MEASURE(c))
    if (typeof r !== 'object') { out.push(`${c} ${j}: ${r}`); continue }
    const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 })
    writeFileSync(`${OUT}/${W}x${H}-${c}-${j}.jpg`, Buffer.from(s.result.data, 'base64'))
    out.push(`${W}x${H} ${c.padEnd(11)} m${r.m} text ends ${r.foot} (room ${r.room}px; ${r.last})${r.room < 0 ? '  ← CUT' : r.room < 24 ? '  ← tight' : ''}${r.stackRight > r.txLeft ? '  ← photo over text' : ''}`)
  }
}
console.log(out.join('\n'))
ws.close()
await fetch(`http://localhost:${PORT}/json/close/${tab.id}`)
