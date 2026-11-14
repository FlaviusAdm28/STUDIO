// One line per gesture of a recording of rec.js: when, which way, how strong (Σ wheel dy, its peak per event), where the page rested
// before it and where it rested after (scrollY and the site's state there), and the marks (⚑) between. A gesture is a run of wheel
// events (a trackpad's momentum included) until a pause over 300 ms, a turn, or the wheel speeding up again once its momentum faded. `node rec-strokes.mjs out/<id>-rec.jsonl`
import { readFileSync } from 'node:fs'
const rows = readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
let base = 0, st = {}, y = 0
const ev = []
for (const [t0, k, d] of rows) {
  if (k === 'reload') base = d.sinceStart
  const t = base + t0
  if (k === 'state') st = { ...st, ...d }
  if (k === 'y') y = d
  ev.push({ t, k, d, y, st: { ...st } })
}
const name = (s) => {
  const sec = s.sec
  if (sec === 'top') return s.pass === 'on' ? 'top(passing)' : 'top'
  if (sec === 'work') return `Work ch${s.ch}${s.pass ? ' ' + s.pass : ''}`
  if (sec === 'method') return `Method ${s.m}`
  if (sec === 'about') return `About ${s.a}`
  if (sec === 'questions') return `Questions${s.c ? ' [' + s.c.trim() + ']' : ''}`
  if (sec === 'contact') return `Contact${s.c ? ' [' + s.c.trim() + ']' : ''}`
  return sec || '?'
}
// gestures
const out = []
let g = null
const restAfter = (t) => { // the state 900 ms after the gesture's last event, or at the next gesture
  let last = null
  for (const e of ev) { if (e.t < t) continue; if (e.t > t + 900 || (e.k === 'wheel' && e.t > t + 20)) break; last = e }
  return last
}
const close = () => {
  if (!g) return
  const r = restAfter(g.t1)
  const pass = []
  for (const e of ev) if (e.t >= g.t0 && e.t <= (r ? r.t : g.t1) && e.k === 'state' && (e.d.m || e.d.a || e.d.ch || e.d.sec || e.d.q || e.d.c)) pass.push(name(e.st))
  const uniq = pass.filter((p, i) => p !== pass[i - 1])
  out.push(`${(g.t0 / 1000).toFixed(2).padStart(7)}s ${g.dy > 0 ? '↓' : '↑'} Σ${String(Math.abs(g.dy)).padStart(5)} peak ${String(g.peak).padStart(4)} ${String(g.n).padStart(3)}ev ${((g.t1 - g.t0) / 1000).toFixed(2)}s | ${String(g.y0).padStart(5)} ${name(g.s0)}  →  ${String(r ? r.y : '?').padStart(5)} ${r ? name(r.st) : '?'}${uniq.length > 1 ? '   via ' + uniq.join(' › ') : ''}`)
  g = null
}
for (const e of ev) {
  if (e.k === 'wheel') {
    const a = Math.abs(e.d[1])
    // a new gesture: a pause, the other way, or the wheel speeding up again after its momentum had faded (a trackpad sends no pause
    // between a stroke's momentum and the next stroke)
    if (g && (e.t - g.t1 > 300 || (a > 3 && Math.sign(e.d[1]) !== Math.sign(g.dy) && g.dy !== 0) || (a > 15 && a > 2.5 * g.prev && g.prev < 0.4 * g.peak))) close()
    if (!g) g = { t0: e.t, t1: e.t, dy: 0, peak: 0, n: 0, y0: e.y, s0: e.st, prev: 0 }
    g.t1 = e.t; g.dy += e.d[1]; g.n++; g.peak = Math.max(g.peak, a); g.prev = a
  } else if (e.k === 'MARK' || e.k === 'NOTE' || e.k === 'click' || e.k === 'key' || e.k === 'RELOAD' || e.k === 'reload') {
    close()
    if (e.k === 'MARK') out.push(`${(e.t / 1000).toFixed(2).padStart(7)}s ⚑⚑ BUG ${e.d.n} at ${e.y} ${name(e.st)}`)
    else if (e.k === 'NOTE') out.push(`${(e.t / 1000).toFixed(2).padStart(7)}s ⚑  "${e.d.text}"`)
    else out.push(`${(e.t / 1000).toFixed(2).padStart(7)}s ${e.k} ${typeof e.d === 'string' ? e.d : JSON.stringify(e.d)}`)
  }
}
close()
console.log(out.join('\n'))
