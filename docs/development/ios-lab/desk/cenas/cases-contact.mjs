// Step 4 (22 Nov): the Questions and the Contact under the conductor — the page from the Questions' stop to the Contact's at once (no glide),
// the passage by its clock; a stroke on during it (early: dropped; in its last 0.45 s before the words are seen: kept), turned back midway
// and turned again, a stroke up during the way back (the Questions' barrier), the colophon at the end and back, a jump, a reload at the
// end, the keyboard; and the questions' box frame by frame as it fades (held where it was). `W=375 H=667` for a narrow window.
import { open, key, state, stuck, rest, check, sleep, notes } from './h.mjs'
const URL = 'http://localhost:3100/?cenas=1'
const W = Number(process.env.W || 1440)
const H = Number(process.env.H || 900)
let fails = 0
let noted = 0
const report = async (p, name, want, extra = '') => {
  await rest(p, 500, 9000)
  // read once at rest
  if (typeof extra === 'function') extra = await extra()
  const n = await notes(p, noted)
  noted += n.length
  extra += '  [' + n.filter(([, s]) => /^cenas/.test(s)).map(([, s]) => s.replace('cenas ', '')).join(', ') + ']'
  const s = await state(p)
  const st = await stuck(p)
  const c = check(s)
  const ok = c === 'ok' && !st.length && (!want || s.cur === want)
  if (!ok) fails++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(58)} → ${String(s.cur).padEnd(10)} dk=${s.dk ? 1 : 0} ${c}${st.length ? ' STUCK ' + st.join(',') : ''}${extra}`)
}
const tap = (p, way = 1) => p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: p.w / 2, y: p.h / 2, deltaX: 0, deltaY: 60 * way })
const at = async (p, id) => {
  await p.ev(`window.__cenas.go('${id}', 'jump'); return 1`)
  await sleep(2600)
}
const p = await open(URL, { w: W, h: H })
await key(p, 'Shift')
await sleep(1200)
const stopY = Object.fromEntries((await p.ev(`return window.__cenas.stops()`)).map((s) => [s.id, s.y]))
console.log(`${W}×${H}: questions ${stopY.questions}, contact ${stopY.contact}, end ${stopY.end}`)

// 1. questions → contact: at once, the passage played, and the questions' box held where it was while it fades
await at(p, 'questions')
const tape = p.ev(`return new Promise((ok) => { const b = document.querySelector('#questions .q-box'), out = [], t0 = performance.now();
  const f = () => { out.push([Math.round(performance.now() - t0), Math.round(scrollY), Math.round(b.getBoundingClientRect().top * 10) / 10, Number(getComputedStyle(b).opacity)]);
  if (performance.now() - t0 < 3600) requestAnimationFrame(f); else ok(out) }; requestAnimationFrame(f) })`)
await sleep(150)
await tap(p)
const rows = await tape
const qTop = rows[0][2]
// (within 2 px of a stop: exact() places on the mark measured beside it, a pixel from the list's rounding at some sizes)
const near = (y, id) => Math.abs(y - stopY[id]) <= 2
const between = rows.filter((r) => !near(r[1], 'questions') && !near(r[1], 'contact'))
const ys = [...new Set(rows.map((r) => r[1]))]
const seenOff = rows.filter((r) => r[3] > 0.02 && Math.abs(r[2] - qTop) > 0.6)
const moved = rows.find((r) => near(r[1], 'contact'))
const ok1 = !between.length && !seenOff.length && moved
if (!ok1) fails++
console.log(`${ok1 ? 'ok  ' : 'FAIL'} questions → contact: ${between.length} frames between the stops, box seen off its place in ${seenOff.length} frames` +
  ` (at ${qTop}); on the Contact's stop at ${moved?.[0] ?? '—'} ms, box gone at ${rows.find((r) => r[3] === 0)?.[0] ?? '—'} ms` +
  ` (y: ${ys.join(' ')})` + (seenOff.length ? ' ' + JSON.stringify(seenOff.slice(0, 4)) : ''))
await report(p, '… and after', 'contact')

// 2. a stroke on during the passage: 0.5 s in (dropped), 2.3 s in (kept for the words), 2.9 s in (the colophon)
for (const [ms, want, what] of [[500, 'contact', 'dropped'], [2300, 'end', 'kept for the words seen'], [2900, 'end', 'goes']]) {
  await at(p, 'questions')
  await tap(p)
  await sleep(ms)
  await tap(p)
  await report(p, `questions → contact, ↓ ${ms / 1000} s in (${what})`, want)
}

// 3. turned back midway, and turned again
await at(p, 'questions')
await tap(p)
await sleep(800)
await tap(p, -1)
await report(p, 'questions → contact, ↑ at 0.8 s (turned back)', 'questions')
await at(p, 'contact')
await tap(p, -1)
await sleep(300)
await tap(p)
await report(p, 'contact → questions, ↓ at 0.3 s (turned again)', 'contact')

// 4. a stroke up during the way back: the Questions' barrier, then the way back plays whole
await at(p, 'contact')
await tap(p, -1)
await sleep(400)
await tap(p, -1)
await report(p, 'contact → questions, ↑ at 0.4 s (barrier: dropped)', 'questions')
await at(p, 'contact')
await tap(p, -1)
await sleep(1300)
await tap(p, -1)
await report(p, 'contact → questions, ↑ at 1.3 s (on to the About)', '14')

// 5. the colophon: in at the end, out back at the Contact
await at(p, 'contact')
await tap(p)
const cin = () => p.ev(`return getComputedStyle(document.getElementById('contact')).getPropertyValue('--c-in')`)
const want = async (v) => {
  const c = Number(await cin())
  if (c !== v) fails++
  return `  --c-in ${c}${c !== v ? ' (FAIL, want ' + v + ')' : ''}`
}
await report(p, 'contact → end (the colophon)', 'end', async () => (await sleep(900), want(1)))
await tap(p, -1)
await sleep(1800)
await report(p, 'end → contact', 'contact', () => want(0))

// 6. a jump from the top to the Contact: there at once, nothing playing
await at(p, 'top')
await p.ev(`window.__cenas.go('contact', 'jump'); return 1`)
await sleep(120)
const j = await p.ev(`const a = document.querySelector('#contact .c-ask'); return { run: 'cRun' in document.documentElement.dataset, ask: getComputedStyle(a).opacity }`)
await report(p, 'top ⇒ contact (a jump)', 'contact', `  at 0.12 s: run ${j.run} ask ${j.ask}`)
if (j.run || j.ask !== '1') fails++

// 7. the keyboard: Space from the Questions, Home from the Contact
await at(p, 'questions')
await key(p, ' ', 'Space')
await report(p, 'Space at the Questions', 'contact')
await key(p, 'Home')
await report(p, 'Home at the Contact', 'top')

// 8. a reload at the page's end
await at(p, 'end')
await p.send('Page.reload')
await sleep(4000)
await report(p, 'reload at the end', 'end', () => want(1))
console.log('fails', fails)
p.ws.close()
process.exit(0)
