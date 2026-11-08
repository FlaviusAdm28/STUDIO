const t = (await (await fetch('http://localhost:9223/json/list')).json()).find((x) => x.type === 'page')
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); const errs = []
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description?.slice(0, 120)); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.text }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Runtime.enable'); await send('Page.enable')
for (const [w, h] of [[390, 844], [1440, 900]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 900 })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await send('Page.navigate', { url: `http://localhost:3100/?rm=${Date.now()}` }); await sleep(6000)
  const r = await ev(`const o = []; const max = document.documentElement.scrollHeight - innerHeight; for (let y = 0; y <= max; y += innerHeight * 0.5) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); o.push(Math.abs(scrollY - y) > 2 ? 'moved@' + y : '') } return JSON.stringify({ snap: getComputedStyle(document.documentElement).scrollSnapType, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, held: o.filter(Boolean).slice(0, 5), marks: document.querySelectorAll('.m-snap, .a-snap').length, h: document.documentElement.scrollHeight })`)
  console.log('reduced', w, r)
  await send('Emulation.setEmulatedMedia', { features: [] })
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await send('Page.navigate', { url: `http://localhost:3100/?nojs=${Date.now()}` }); await sleep(4000)
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  const n = await ev(`return JSON.stringify({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, h: document.documentElement.scrollHeight, words: ['No templates', 'Made once', 'Talk to us'].map(s => document.body.innerText.includes(s)), js: document.documentElement.hasAttribute('data-js') })`)
  console.log('no-js', w, n)
}
console.log('errors', JSON.stringify(errs))
await send('Emulation.clearDeviceMetricsOverride'); ws.close()
