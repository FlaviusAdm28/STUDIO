// the menu tour on a page over CDP: landing, the edges (page colour / theme-color) over time, and whether a passage played
const [, , prefix = 'http://localhost:3133/'] = process.argv
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith(prefix))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.reload', {}); await sleep(7000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(4500)
const wh = () => ev(`const R = document.documentElement, m = document.querySelector('.method'), a = document.querySelector('.about'), s = R.dataset.section, y = Math.round(scrollY); if (s === 'contact') return 'C' + y; if (s === 'questions') return 'Q' + y; if (a.dataset.phase !== 'pre' && s === 'about') return 'about ' + a.dataset.phase; if (m.dataset.phase !== 'pre') return 'method ' + m.dataset.phase; return (R.dataset.pass === 'done' ? 'work W' + document.querySelector('.work').dataset.ch : 'top') + '@' + y`)
for (const d of ['work', 'method', 'about', 'questions', 'contact', 'work', 'questions', 'method', 'contact', 'about', 'work', 'about', 'method', 'questions', 'about', 'contact', 'method', 'work']) {
  await ev(`document.querySelector('.bar-menu').click(); return 1`); await sleep(1300)
  await ev(`const R = document.documentElement, meta = document.querySelector('meta[name="theme-color"]'); window.__x = []; window.__played = new Set(); const t0 = performance.now(); let last = ''; cancelAnimationFrame(window.__xr); const f = () => { const c = meta.getAttribute('content'); if (c !== last) { window.__x.push(Math.round(performance.now() - t0) + 'ms:' + c); last = c } if ('cRun' in R.dataset) window.__played.add('contact light'); if ('passage' in document.querySelector('.method').dataset) window.__played.add('method light'); if ('passage' in document.querySelector('.about').dataset) window.__played.add('about light'); if (performance.now() - t0 < 3000) window.__xr = requestAnimationFrame(f) }; f(); document.querySelector('.menu a[href="#${d}"]').click(); return 1`)
  await sleep(3400)
  console.log(`→ #${d}: ${await wh()} | theme-color ${await ev('return window.__x.join("  ")')} | played: ${await ev('return [...window.__played].join(",") || "nothing"')}`)
}
ws.close()
