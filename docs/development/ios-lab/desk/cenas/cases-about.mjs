// Step 3 (21 Nov): the About under the conductor — its "stupid" cases. Turning back mid-passage (the light finding the portrait), down again
// mid-way back, a stroke into the Questions during 14's story (early: dropped; late: kept), the keyboard reaching the portrait, and the About's
// stage frame by frame on the way back to the Method's 11 (held where it was seen, at the screen's top, until the light has gone back).
import { open, stroke, key, state, stuck, rest, check, sleep, notes } from './h.mjs'
const URL = 'http://localhost:3100/?cenas=1'
let fails = 0
let noted = 0
const report = async (p, name, want, extra = '') => {
  await rest(p, 500, 8000)
  const n = await notes(p, noted)
  noted += n.length
  extra += '  [' + n.filter(([, s]) => /^cenas/.test(s)).map(([, s]) => s.replace('cenas ', '')).join(', ') + ']'
  const s = await state(p)
  const st = await stuck(p)
  const c = check(s)
  const ok = c === 'ok' && !st.length && (!want || s.cur === want)
  if (!ok) fails++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(54)} → ${String(s.cur).padEnd(10)} ap=${s.ap} mp=${s.mp} ${c}${st.length ? ' STUCK ' + st.join(',') : ''}${extra}`)
}
// one wheel event: a stroke the conductor counts at once (a profile's events, each a round trip to the browser, took ~1 s to send — the
// timing of the cases below has to be known)
const tap = (p, way = 1) => p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: p.w / 2, y: p.h / 2, deltaX: 0, deltaY: 60 * way })
const at = async (p, id) => {
  await p.ev(`window.__cenas.go('${id}', 'jump'); return 1`)
  await sleep(2600)
}
const p = await open(URL)
await key(p, 'Shift')
await sleep(1200)

// the passage of 12, turned back halfway (the light still on its way to the portrait)
await at(p, '11')
await stroke(p, 'swipe300')
await sleep(600)
await stroke(p, 'swipe300-up')
await report(p, '11 → 12, ↑ at 0.6 s (passage turned back)', '11')

// the way back, turned down again halfway
await at(p, '12')
await sleep(2400)
await stroke(p, 'swipe300-up')
await sleep(500)
await stroke(p, 'swipe300')
await report(p, '12 → 11, ↓ at 0.5 s (way back turned)', '12')

// a stroke on into the Questions during 14's story: early it is dropped, late it is kept
// (the story is 1.6 s from 13; a stroke in its last 0.45 s is kept for its end, earlier dropped)
await at(p, '13')
await tap(p)
await sleep(500)
await tap(p)
await report(p, '13 → 14, a stroke 0.5 s into the story (dropped)', '14')
await at(p, '13')
await tap(p)
await sleep(1300)
await tap(p)
await report(p, '13 → 14, a stroke 1.3 s into it (kept for its end)', 'questions')

// quickly up through the About: 14 → 13 → 12 → 11 → (held: the way back plays) 10
await at(p, '14')
for (let i = 0; i < 4; i++) {
  await tap(p, -1)
  await sleep(400)
}
await report(p, '14, four strokes up 0.4 s apart (the 4th dropped: way back)', '11')

// the keyboard: the focus reaches the About's link before 14 → 14 at once
await at(p, '12')
await p.ev(`document.querySelector('#about a, #about [tabindex]')?.focus(); return 1`)
await report(p, 'focus inside the About at 12', '14')

// the About's stage on the way back, frame by frame: held at the top until it lets go
await at(p, '12')
await sleep(2400)
const tape = p.ev(`return new Promise((ok) => { const a = document.getElementById('about'), s = a.querySelector('.a-stage'), out = []; const t0 = performance.now();
  const f = () => { const r = s.getBoundingClientRect(); out.push([Math.round(performance.now() - t0), Math.round(r.top), getComputedStyle(s).position[0], a.dataset.phase, a.classList.contains('a-leaving') ? 1 : 0, getComputedStyle(s).clipPath === 'none' ? 'seen' : 'clip']);
  if (performance.now() - t0 < 2600) requestAnimationFrame(f); else ok(out) }; requestAnimationFrame(f) })`)
await sleep(100)
await stroke(p, 'swipe300-up')
const rows = await tape
const seen = rows.filter((r) => r[5] === 'seen')
const off = seen.filter((r) => Math.abs(r[1]) > 1)
console.log(`${off.length ? 'FAIL' : 'ok  '} the About's stage on the way back: ${seen.length} frames seen, ${off.length} not at the top${off.length ? ' ' + JSON.stringify(off.slice(0, 5)) : ''}; let go at ${rows.find((r) => r[4] === 0 && r[3] === 'pre')?.[0] ?? '—'} ms`)
if (off.length) fails++
await report(p, '… and after', '11')
console.log('fails', fails)
p.ws.close()
process.exit(0)
