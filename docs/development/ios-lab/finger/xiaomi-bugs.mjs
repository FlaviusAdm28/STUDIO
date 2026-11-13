// The owner's five bugs of 12 Nov and the Contact made smoother (13 Nov), checked on the Xiaomi over CDP: touch strokes with their fling
// (Input.synthesizeScrollGesture), the page read frame by frame. node xiaomi-bugs.mjs [url-prefix] [only]
// Xiaomi: adb forward tcp:9222 localabstract:chrome_devtools_remote; adb reverse tcp:3133 tcp:3133; Chrome on localhost:3133
const [, , prefix = 'http://localhost:3133/', only = ''] = process.argv
const list = await (await fetch('http://localhost:9222/json/list')).json()
const t = list.find((x) => x.type === 'page' && x.url.startsWith(prefix))
if (!t) {
  console.log('no target')
  process.exit(1)
}
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
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => {
  const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })
  return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description ?? r.result?.exceptionDetails?.text
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const H = await ev('return innerHeight')
const W = await ev('return innerWidth')
// a touch stroke: down = the page goes down (the finger up); dist in px, speed in px/s
const stroke = (down, dist = 300, speed = 1200) =>
  send('Input.synthesizeScrollGesture', { x: Math.round(W * 0.3), y: down ? Math.round(H * 0.78) : Math.round(H * 0.22), yDistance: down ? -dist : dist, speed, gestureSourceType: 'touch', repeatCount: 0, preventFling: false })
const strokeNow = (down, dist, speed) => { stroke(down, dist, speed) } // not awaited: a second stroke while the first still flies
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 900) ok(1); else requestAnimationFrame(f) }; f() })')
const snapOff = (js) => ev(`document.documentElement.style.scrollSnapType = 'none'; ${js}; await new Promise(r => setTimeout(r, 400)); document.documentElement.style.removeProperty('scroll-snap-type'); return 1`)
const top0 = async () => { await snapOff('scrollTo(0, 0)'); await sleep(2500) }
const where = () => ev(`const R = document.documentElement, m = document.querySelector('.method'), a = document.querySelector('.about'), s = R.dataset.section, y = Math.round(scrollY);
  if (s === 'contact') return (R.scrollHeight - innerHeight - scrollY < 60 ? 'END' : 'C') + y
  if (s === 'questions') return 'Q' + y
  if (a.dataset.phase !== 'pre' && s === 'about') return a.dataset.phase
  if (m.dataset.phase !== 'pre') return m.dataset.phase
  return (R.dataset.pass === 'done' ? 'W' + document.querySelector('.work').dataset.ch : 'top') + '@' + y`)
const menu = async (hash) => { await ev(`document.querySelector('.menu a[href="${hash}"]').click(); return 1`); await sleep(3500); await rest(); await sleep(800) }
const run = (name) => !only || only.split(',').includes(name)
const log = (...a) => console.log(...a)

// the entrance, done once
await ev('return 1')
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: Math.round(W / 2), y: Math.round(H / 2) }] })
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
await sleep(4500)
log(`Xiaomi ${W}×${H}`)

// ---- 1: the Work's stops, the passage held, a second stroke ----
if (run('1')) {
  for (const [label, dist, speed] of [['normal', 300, 1200], ['strong', 700, 6000], ['very strong', 900, 9000]]) {
    const o = []
    for (let r = 0; r < 3; r++) { await top0(); await stroke(true, dist, speed); await rest(); await sleep(2200); o.push(await where()) }
    log(`1 one stroke from the top, ${label}:`, o.join(' '))
  }
  for (const gap of [300, 600, 900, 1200]) {
    await top0()
    strokeNow(true, 300, 1200)
    await sleep(gap)
    await stroke(true, 300, 1200)
    await rest()
    await sleep(2500)
    log(`1 two strokes ${gap} ms apart:`, await where())
  }
  for (const [label, dist, speed] of [['normal', 300, 1200], ['strong', 700, 6000]]) {
    await top0()
    const o = []
    for (let k = 0; k < 4; k++) { await stroke(true, dist, speed); await rest(); await sleep(2400); o.push(await where()) }
    for (let k = 0; k < 5; k++) { await stroke(false, dist, speed); await rest(); await sleep(2000); o.push(await where()) }
    log(`1 walk ${label}:`, o.join(' → '))
  }
  for (const gap of [300, 500, 800]) {
    await top0()
    await ev(`window.__seen = new Set(); const w = document.querySelector('.work'); cancelAnimationFrame(window.__sr); const f = () => { if (document.documentElement.dataset.pass === 'done') window.__seen.add(w.dataset.ch); window.__sr = requestAnimationFrame(f) }; f(); return 1`)
    for (let k = 0; k < 5; k++) { strokeNow(true, 300, 1500); await sleep(gap); strokeNow(false, 300, 1500); await sleep(gap) }
    await rest()
    await sleep(2500)
    log(`1 back and forth at ${gap} ms: chapters seen`, await ev('cancelAnimationFrame(window.__sr); return [...window.__seen].join(",") || "none"'), '| ends', await where())
  }
}

// ---- 4: the Questions with an answer open ----
const openQ = (i) => ev(`document.querySelectorAll('#questions .q-row').forEach((r, j) => { if ((j === ${i}) !== r.classList.contains('is-open')) r.querySelector('.q-btn').click() }); await new Promise(r => setTimeout(r, 1000)); return 1`)
if (run('4')) {
  for (const row of [0, 6]) {
    await menu('#questions')
    await openQ(row)
    await ev(`const b = document.querySelector('#questions .q-box'), t = document.querySelector('#questions .q-title'); window.__qb = []; cancelAnimationFrame(window.__qr); const f = () => { window.__qb.push([Math.round(t.getBoundingClientRect().top), +getComputedStyle(b).opacity, document.querySelectorAll('#questions .q-row.is-open').length, document.documentElement.classList.contains('c-dusk') ? 1 : 0]); window.__qr = requestAnimationFrame(f) }; f(); return 1`)
    await stroke(true, 300, 1200)
    await rest()
    await sleep(2000)
    log(`4 answer ${row} open, stroke on:`, await ev(`cancelAnimationFrame(window.__qr); const L = window.__qb; const seen = L.filter(r => r[1] > 0.02).map(r => r[0]); const c = L.findIndex(r => r[2] === 0), d = L.findIndex(r => r[3] === 1); return 'title while seen ' + Math.min(...seen) + '..' + Math.max(...seen) + ' | closed at frame ' + c + ', light down at frame ' + d`), '| ends', await where())
  }
  await menu('#questions')
  await openQ(6)
  await stroke(true, 90, 200) // a slow drag to read
  await rest()
  await sleep(1500)
  log('4 slow drag 90 px with answer 6 open: open', await ev(`return document.querySelectorAll('#questions .q-row.is-open').length`), '| ends', await where())
  await openQ(-1)
}

// ---- 3: Questions ↔ Contact with quick strokes ----
if (run('3')) {
  for (const gap of [300, 500, 1000]) {
    await menu('#questions')
    await ev(`const ask = document.querySelector('.c-ask'), colo = document.querySelector('.colophon'); window.__qa = {}; const t0 = performance.now(); cancelAnimationFrame(window.__ar); const f = () => { const t = Math.round(performance.now() - t0); if (+getComputedStyle(ask).opacity > 0.5 && window.__qa.ask == null) window.__qa.ask = t; if (colo.getBoundingClientRect().top < innerHeight - 40 && window.__qa.colo == null) window.__qa.colo = t; window.__ar = requestAnimationFrame(f) }; f(); return 1`)
    strokeNow(true, 600, 5000)
    await sleep(gap)
    await stroke(true, 600, 5000)
    await rest()
    await sleep(3500)
    log(`3 two strokes ${gap} ms apart from the Questions:`, await where(), '|', await ev(`cancelAnimationFrame(window.__ar); return 'question at ' + window.__qa.ask + ' ms, colophon ' + (window.__qa.colo ?? 'never')`))
  }
  for (const [label, dist, speed] of [['normal', 300, 1200], ['strong', 600, 5000]]) {
    await menu('#contact')
    await ev(`const ask = document.querySelector('.c-ask'), box = document.querySelector('#questions .q-box'); window.__bk = [null, null]; const t0 = performance.now(); cancelAnimationFrame(window.__br); const f = () => { const t = Math.round(performance.now() - t0); if (window.__bk[0] == null && +getComputedStyle(ask).opacity < 0.05) window.__bk[0] = t; if (window.__bk[0] != null && window.__bk[1] == null && +getComputedStyle(box).opacity > 0.5) window.__bk[1] = t; window.__br = requestAnimationFrame(f) }; f(); return 1`)
    await stroke(false, dist, speed)
    await rest()
    await sleep(2500)
    log(`3 back from the Contact, ${label}:`, await ev(`cancelAnimationFrame(window.__br); const [a, b] = window.__bk; return 'question gone ' + a + ' ms, questions back ' + b + ' ms → dark between ' + (b - a) + ' ms'`), '| ends', await where())
  }
}

// ---- 5: the page's end and the browser's bar ----
if (run('5')) {
  const end = () => ev(`const c = document.querySelector('.colophon'); const words = [...c.querySelectorAll('*')].filter(e => !e.children.length && e.textContent.trim()); const last = words.reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0); return 'y ' + Math.round(scrollY) + ' H ' + innerHeight + ' | colophon ' + Math.round(c.getBoundingClientRect().top) + '→' + Math.round(c.getBoundingClientRect().bottom) + ' | last line ' + Math.round(innerHeight - last) + ' px above the foot | question ' + Math.round(document.querySelector('.c-ask').getBoundingClientRect().top)`)
  await menu('#contact')
  await stroke(true, 300, 1200)
  await rest()
  await sleep(1500)
  log('5 at the end:', await end())
  for (let k = 0; k < 3; k++) { await stroke(true, 300, 1200); await rest(); await sleep(1200); log(`5 a stroke more (${k + 1}):`, await end()) }
  await stroke(false, 60, 600) // a small stroke up: Chrome's bar comes back
  await rest()
  await sleep(1200)
  log('5 a small stroke up:', await end(), '|', await where())
  await stroke(true, 300, 1200)
  await rest()
  await sleep(1200)
  log('5 and down again:', await end())
}

// ---- 2: the Method, 8c ↔ 9 ↔ 10 ----
if (run('2')) {
  await snapOff(`scrollTo(0, [...document.querySelectorAll('.m-snap')].map(m => m.getBoundingClientRect().top + scrollY).sort((a, b) => a - b)[4])`)
  await sleep(2500)
  log('2 from', await where())
  const rec = () => ev(`const card = [...document.querySelectorAll('.method .m-card[data-phone]')].find(c => c.querySelector('.s-wed-tx')); const w = card.querySelector('.s-wed-nav span'); window.__ml = []; const t0 = performance.now(); cancelAnimationFrame(window.__mr); const f = () => { const r = card.getBoundingClientRect(); window.__ml.push([performance.now() - t0, r.top, r.height, w.getBoundingClientRect().top, +getComputedStyle(w.parentElement).opacity]); window.__mr = requestAnimationFrame(f) }; f(); return 1`)
  const read = () => ev(`cancelAnimationFrame(window.__mr); const L = window.__ml; let gap = 0, card = 0, word = 0; for (let k = 1; k < L.length; k++) { const dt = L[k][0] - L[k-1][0]; gap = Math.max(gap, dt); const per = Math.max(1, dt / 16.7); card = Math.max(card, Math.abs(L[k][2] - L[k-1][2]) / per); if (L[k][4] > 0.2) word = Math.max(word, Math.abs(L[k][3] - L[k-1][3]) / per) } const long = L.slice(1).filter((r, k) => r[0] - L[k][0] > 50).length; return 'longest frame ' + Math.round(gap) + ' ms, frames over 50 ms ' + long + ' | card height, biggest step per frame ' + card.toFixed(1) + ' px | menu word ' + word.toFixed(1) + ' px'`)
  for (const [label, down] of [['→', true], ['→', true], ['→', true], ['←', false], ['←', false]]) {
    const from = await where()
    await rec()
    await stroke(down, 300, 1200)
    await rest()
    await sleep(2200)
    log(`2 ${from} ${label} ${await where()}:`, await read())
  }
}

// ---- the Contact's words and colophon, made smoother: their frames ----
if (run('c')) {
  const rec = () => ev(`window.__fl = []; const t0 = performance.now(); cancelAnimationFrame(window.__fr); const f = () => { window.__fl.push(performance.now() - t0); window.__fr = requestAnimationFrame(f) }; f(); return 1`)
  const read = () => ev(`cancelAnimationFrame(window.__fr); const L = window.__fl; const d = L.slice(1).map((t, k) => t - L[k]); const busy = d.filter(x => x < 400); return 'frames ' + d.length + ', mean ' + (busy.reduce((a, b) => a + b, 0) / busy.length).toFixed(1) + ' ms, longest ' + Math.round(Math.max(...d)) + ' ms, over 34 ms ' + d.filter(x => x > 34).length`)
  await menu('#questions')
  await rec()
  await stroke(true, 300, 1200)
  await rest()
  await sleep(3200)
  log('c Questions → Contact (the passage, 3 s):', await read(), '|', await where())
  await rec()
  await stroke(true, 300, 1200)
  await rest()
  await sleep(1500)
  log('c Contact → the end (the colophon):', await read(), '|', await where())
  await rec()
  await stroke(false, 300, 1200)
  await rest()
  await sleep(1500)
  log('c back to the Contact:', await read(), '|', await where())
}
ws.close()
