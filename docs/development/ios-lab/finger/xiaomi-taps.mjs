// xiaomi-taps.mjs [gap ms] [n]: Xiaomi — taps on the Work's next chapter name, `gap` ms apart (the owner's rhythm ~1.4 s), real touch
// events by CDP; the page's own log of every change of chapter. One change per tap is right; a chapter coming back between two is the
// jump's end let go early (17 Nov: a 1.5 s timer from the jump before)
const [, , gap = '1400', n = '8'] = process.argv
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3100/'))
const ws = new WebSocket(t.webSocketDebuggerUrl)
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
await send('Page.navigate', { url: 'http://localhost:3100/?t=' + Date.now() })
await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] })
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
await sleep(4500)
// to Weddings by the menu's chapter address, then the log
await ev(`location.hash = 'weddings'; return 1`)
await sleep(3000)
await ev(`window.__L = []; const t0 = performance.now(); new MutationObserver(() => __L.push(Math.round(performance.now() - t0) + ' ch' + document.querySelector('.work').dataset.ch + ' y' + Math.round(scrollY))).observe(document.querySelector('.work'), { attributes: true, attributeFilter: ['data-ch'] }); addEventListener('click', () => __L.push(Math.round(performance.now() - t0) + ' click'), true); return 1`)
for (let i = 0; i < +n; i++) {
  const p = await ev(`const cs = ['weddings','artists','experiences']; const ch = +document.querySelector('.work').dataset.ch; const r = document.querySelector('.w-ch[data-c="' + cs[ch] + '"] .w-nav-ch[data-role="next"]').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]`)
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p[0], y: p[1] }] })
  await sleep(70)
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await sleep(+gap - 70)
}
await sleep(2500)
const log = await ev('return __L')
// one change per click: the changes between two clicks
const groups = []
for (const l of log) {
  if (l.endsWith('click')) groups.push([])
  else if (groups.length) groups[groups.length - 1].push(l.split(' ')[1])
}
console.log(`gap ${gap} ms:`, groups.map((g) => g.join('→') || '-').join(' | '), groups.every((g) => g.length === 1) ? '— one change per tap' : '— EXTRA CHANGES')
ws.close()
