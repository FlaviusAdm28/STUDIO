// The Method's phase changes under the conductor (22 Nov): each plays until it is seen through before a stroke carries on its way, as
// long as it needs (8a–9 ~0.6 s, 10 ~1.46 s), turned back at once, free the moment it is seen through. Headless, against `next start`.
//   node cases-method.mjs        (PORT=9223 for the lab's windowed Chrome)
import { open, profile, key, state, stuck, check, sleep, notes } from './h.mjs'
const p = await open('http://localhost:3100/?cenas=1')
await key(p, 'Shift')
await sleep(800)
const now = () => p.ev('return Math.round(performance.now() - window.__t0)')
// a hand's stroke: the finger alone (192 ms, no momentum), so each one is its own. Its events are sent at their own times without waiting
// for each answer (awaited one by one, a stroke took ~0.8 s headless and the plan's times stretched)
const fire = (method, params) => p.send(method, params)
// a short flick (64 ms), so that a second one 0.15 s after the first's start is a stroke of its own (2.5× the first's last event)
const FLICK = [60, 120, 120, 90, 50, 25, 12, 6]
// the steps at their times from the case's start; the page notes when each step's first event reached it (window.__in)
const plan = async (steps) => {
  await p.ev(`window.__in=[];if(!window.__inOn){window.__inOn=1;addEventListener('wheel',()=>window.__in.push(Math.round(performance.now()-window.__t0)),{capture:true,passive:true});addEventListener('keydown',()=>window.__in.push(Math.round(performance.now()-window.__t0)),{capture:true})}`)
  const t0 = await now()
  const n0 = (await notes(p)).length
  const T0 = Date.now()
  const at = (ms, f) => new Promise((r) => setTimeout(() => (f(), r()), Math.max(0, ms - (Date.now() - T0))))
  const jobs = []
  for (const [ms, way, short] of steps) {
    if (way === 'key') jobs.push(at(ms, () => key(p, 'ArrowDown')))
    else if (typeof way === 'string') jobs.push(at(ms, () => p.ev(`window.__cenas.go('${way}','jump')`)))
    else {
      let t = ms
      const rows = short ? FLICK.map((dy) => [8, dy * way]) : profile(way > 0 ? 'swipe300-nomom' : 'swipe300-nomom-up')
      for (const [dt, dy] of rows) {
        t += dt
        jobs.push(at(t, () => fire('Input.dispatchMouseEvent', { type: 'mouseWheel', x: p.w / 2, y: p.h / 2, deltaX: 0, deltaY: dy })))
      }
    }
  }
  await Promise.all(jobs)
  await sleep(2600)
  const arrived = (await p.ev('return window.__in')).map((t) => t - t0)
  // when each step reached the page: its first event at or after its planned time
  const sent = steps.map(([ms]) => arrived.find((t) => t >= ms - 5) ?? NaN)
  const ns = (await notes(p)).slice(n0).map(([t, x]) => [t - t0, x.replace('cenas ', '')])
  return { sent, ns, at: ns.filter(([, x]) => x.startsWith('at ')).map(([t, x]) => [t, x.split(' ')[1]]) }
}
const place = async (stop) => {
  await p.ev(`window.__cenas.go('${stop}','jump')`)
  await sleep(1500)
}
let fails = 0
const report = async (name, ok, detail) => {
  const s = await state(p)
  const st = await stuck(p)
  const good = ok && check(s) === 'ok' && !st.length
  if (!good) fails++
  console.log(`${good ? 'ok  ' : 'FAIL'} ${name.padEnd(58)} → ${s.cur} ${check(s)}${st.length ? ' STUCK ' + st.join(',') : ''}\n       ${detail}`)
}
const path = (r) => r.at.map(([t, s]) => `${s}@${t}`).join(' ')

// A. strokes 0.35 s apart from 8a: every phase seen, in order, each after the one before is seen through
await place('8a')
{
  const r = await plan(Array.from({ length: 10 }, (_, i) => [i * 350, 1]))
  const ids = r.at.map(([, s]) => s)
  const order = ['8b', '8c', '9', '10', '11']
  const inOrder = order.every((s, i) => ids[i] === s)
  const gaps = r.at.slice(1, 5).map(([t], i) => t - r.at[i][0])
  // seen through: 8b–9 ~615 ms each (the cards, 1.1 s at EASE), 10 ~1463 ms (the cover's three lines)
  const ok = inOrder && gaps.slice(0, 3).every((g) => g >= 600) && gaps[3] >= 1440
  await report('A. 10 strokes 0.35 s apart from 8a', ok, `${path(r)} · gaps ${gaps.join(' ')} · kept ${r.ns.filter(([, x]) => x.includes('kept')).length} dropped ${r.ns.filter(([, x]) => x.includes('dropped')).length}`)
}
// B. a stroke once the change is seen through goes at once
await place('8a')
{
  const r = await plan([[0, 1], [720, 1]])
  const lat = r.at[1] ? r.at[1][0] - r.sent[1] : NaN
  await report('B. 8a → 8b, then a stroke 0.72 s later: no wait', r.at[1]?.[1] === '8c' && lat < 80, `${path(r)} · second stroke answered after ${lat} ms`)
}
// C. turned back mid-change at once; a stroke on back waits only for that change, never the 1.2 s of a barrier
await place('8b')
{
  const r = await plan([[0, 1], [250, -1], [600, -1]])
  const [a, b, c] = r.at
  const lat = b ? b[0] - r.sent[1] : NaN
  const wait = c && b ? c[0] - b[0] : NaN
  const ok = a?.[1] === '8c' && b?.[1] === '8b' && c?.[1] === '8a' && lat < 80 && wait >= 590 && wait < 800
  await report('C. 8b → 8c, back at 0.25 s, back again at 0.6 s', ok, `${path(r)} · turned back after ${lat} ms · 8a ${wait} ms after 8b`)
}
// D. 10 waits for the cover's three lines: a stroke 0.6 s in is dropped, one 1.15 s in is kept and runs when they are in
await place('9')
{
  const r = await plan([[0, 1], [600, 1], [1150, 1]])
  const [a, b] = r.at
  const wait = b && a ? b[0] - a[0] : NaN
  const ok = a?.[1] === '10' && b?.[1] === '11' && r.at.length === 2 && wait >= 1440 && wait < 1560
  await report('D. 9 → 10, strokes on at 0.6 s and 1.15 s', ok, `${path(r)} · 11 ${wait} ms after 10 · ${r.ns.filter(([, x]) => /kept|dropped/.test(x)).map(([, x]) => x).join(', ')}`)
}
// E. a second stroke 0.15 s after the first, the same way (what a busy frame made of one stroke in Safari, 147 ms after it): dropped.
// Later, in the change's last QUEUE ms (from ~0.19 s here), a stroke is kept and runs once it is seen through (the conductor's rule)
await place('9')
{
  const r = await plan([[0, -1, true], [150, -1, true]])
  await report('E. 9 → 8c, a stroke the same way 0.15 s later: dropped', r.at.length === 1 && r.at[0][1] === '8c' && r.ns.some(([, x]) => x.includes('dropped')), `${path(r)} · ${r.ns.filter(([, x]) => /kept|dropped/.test(x)).map(([, x]) => x).join(', ')}`)
}
await place('9')
{
  const r = await plan([[0, -1, true], [300, -1, true]])
  const ok = r.at[0]?.[1] === '8c' && r.at[1]?.[1] === '8b' && r.at[1][0] - r.at[0][0] >= 600
  await report('E2. … 0.3 s later: kept, runs once 8c is seen through', ok, `${path(r)} · ${r.ns.filter(([, x]) => /kept|dropped/.test(x)).map(([, x]) => x).join(', ')}`)
}
// F. the keyboard holds the same way
await place('8a')
{
  const r = await plan([[0, 'key'], [150, 'key'], [300, 'key'], [450, 'key']])
  const ok = r.at[0]?.[1] === '8b' && r.at[1]?.[1] === '8c' && r.at[1][0] - r.at[0][0] >= 590
  await report('F. ArrowDown ×4, 0.15 s apart, from 8a', ok, path(r))
}
// G. a jump (the menu, a title) is never held, and leaves nothing to wait for
await place('8a')
{
  const r = await plan([[0, 1], [150, '11'], [600, 1]])
  const ok = r.at[0]?.[1] === '8b' && r.at[1]?.[1] === '11' && r.at[2]?.[1] === '12' && r.at[2][0] - r.sent[2] < 80
  await report('G. 8a → 8b, jump to 11 at 0.15 s, a stroke at 0.6 s', ok, path(r))
}
// H. back at 7 the barrier still rests 1.2 s for strokes on up
await place('8a')
{
  const r = await plan([[0, -1], [400, -1], [1000, -1]])
  const toExp = r.at.find(([, s]) => s === 'experiences')
  const ok = r.at[0]?.[1] === '7' && (!toExp || toExp[0] - r.at[0][0] >= 1190)
  await report('H. 8a → 7, strokes on up at 0.4 s and 1.0 s', ok, path(r))
}
console.log(`fails ${fails}`)
p.ws.close()
process.exit(0)
