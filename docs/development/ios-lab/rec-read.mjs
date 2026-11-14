// Reads a recording of rec.js (out/<id>-rec.jsonl) as a timeline: gestures grouped, the site's state as it changes, marks and notes,
// slow frames, errors. `node rec-read.mjs out/<id>-rec.jsonl [--all]` (--all: every wheel event and every scroll position).
// Times are seconds from ● gravar, and the wall clock beside them, to find the moment in a screen recording of the Mac.
import { readFileSync } from 'node:fs'
const [, , file, flag] = process.argv
const all = flag === '--all'
const rows = readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
let wall0 = 0
let base = 0 // a reload starts its clock again: its rows are moved on by the time since ● gravar
const clock = (t) => {
  const s = (base + t) / 1000
  const w = wall0 ? new Date(wall0 + base + t).toTimeString().slice(0, 8) : ''
  return `${s.toFixed(2).padStart(8)}s ${w}`
}
const out = []
let wheel = null // a burst of wheel events: from its first to its last, the sum of dy
let yFrom = null
let yNow = null
const flushWheel = () => {
  if (!wheel) return
  out.push(`${clock(wheel.t0)}  ROLL  ${wheel.n} wheel events in ${((wheel.t1 - wheel.t0) / 1000).toFixed(2)} s, Σdy ${wheel.dy}${wheel.dx ? `, Σdx ${wheel.dx}` : ''}${wheel.mode ? ` (mode ${wheel.mode})` : ''}`)
  wheel = null
}
const summary = { marks: 0, errors: 0, slow: 0, slowest: 0, reloads: 0 }
for (const [t, k, d] of rows) {
  if (k === 'start' || k === 'reload') {
    flushWheel()
    if (k === 'start') wall0 = Date.parse(d.wall)
    else { base = d.sinceStart; summary.reloads++ }
    out.push(`${clock(t)}  ${k.toUpperCase()}  ${d.url}  ${d.inner.join('×')} dpr ${d.dpr}${d.reduce ? ' REDUCED-MOTION' : ''}  ${/Safari/.test(d.ua) && !/Chrome/.test(d.ua) ? 'Safari' : /Chrome\/(\d+)/.test(d.ua) ? 'Chrome ' + d.ua.match(/Chrome\/(\d+)/)[1] : d.ua}`)
    continue
  }
  if (k === 'wheel') {
    if (all) out.push(`${clock(t)}  wheel ${d.join(' ')}`)
    if (wheel && t - wheel.t1 < 250) { wheel.n++; wheel.dy += d[1]; wheel.dx += d[0]; wheel.t1 = t }
    else { flushWheel(); wheel = { t0: t, t1: t, n: 1, dy: d[1], dx: d[0], mode: d[2] } }
    continue
  }
  if (k === 'y') {
    if (all) out.push(`${clock(t)}  y ${d}`)
    if (yFrom === null) yFrom = d
    yNow = d
    continue
  }
  flushWheel()
  // the scroll travelled since the last line: written once, where something else happens
  if (yFrom !== null && yNow !== null && yNow !== yFrom && k !== 'slow') { out.push(`${clock(t)}  page  y ${yFrom} → ${yNow}`); yFrom = yNow }
  if (k === 'state') out.push(`${clock(t)}  ·     ${Object.entries(d).map(([a, b]) => `${a}=${b === '' ? '∅' : b}`).join('  ')}`)
  else if (k === 'MARK') { summary.marks++; out.push(`${clock(t)}  ⚑⚑⚑ BUG ${d.n} (y ${d.y}) ⚑⚑⚑`) }
  else if (k === 'NOTE') out.push(`${clock(t)}  ⚑ NOTA ${d.n}: "${d.text}"`)
  else if (k === 'slow') { summary.slow++; summary.slowest = Math.max(summary.slowest, d); if (d > 80 || all) out.push(`${clock(t)}  slow frame ${d} ms`) }
  else if (/ERROR|REJECTION|console/.test(k)) { summary.errors++; out.push(`${clock(t)}  ✗ ${k} ${typeof d === 'string' ? d : JSON.stringify(d)}`) }
  else out.push(`${clock(t)}  ${k} ${d === null ? '' : typeof d === 'string' ? d : JSON.stringify(d)}`)
}
flushWheel()
console.log(out.join('\n'))
console.log(`\n— ${rows.length} rows · ${summary.marks} marks · ${summary.errors} errors/warnings · ${summary.slow} frames > 50 ms (slowest ${summary.slowest} ms) · ${summary.reloads} reloads`)
