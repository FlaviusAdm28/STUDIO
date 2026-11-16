// Reads a flight-recorder session (collector.mjs → ~/.local/share/v5-lab/rec/live/<session>.ndjson): the timeline of what the site did
// (the conductor's notes, the passage's state, the Work's chapter, the Method's phase, the entrance shown for the way back), the owner's
// marks (M), errors, long frames and gaps, a page that died before this one, and, during each passage, the arch's box frame by frame as the
// page computes it (its clock, place and size). The page's clock is the corner clock seen in a screen recording.
//   node rec-read.mjs            → the latest sessions, one line each
//   node rec-read.mjs <session>  → that session's timeline        (add `frames` for every frame of the passages)
import { readFileSync, readdirSync, statSync } from 'node:fs'
const DIR = `${process.env.HOME}/.local/share/v5-lab/rec/live`
const [want, more] = process.argv.slice(2)
const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.ndjson'))
  .sort((a, b) => statSync(`${DIR}/${b}`).mtimeMs - statSync(`${DIR}/${a}`).mtimeMs)
const load = (f) =>
  readFileSync(`${DIR}/${f}`, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .sort((a, b) => a[0] - b[0])
if (!want) {
  for (const f of files.slice(0, 12)) {
    const e = load(f)
    const start = e.find((x) => x[1] === 'start')
    const flags = ['PREVIOUS-DIED', 'ERROR', 'REJECTION', 'MARK'].map((k) => [k, e.filter((x) => x[1] === k).length]).filter(([, n]) => n)
    const end = e[e.length - 1]
    console.log(
      `${f.replace('.ndjson', '')}  ${((end?.[0] ?? 0) / 1000).toFixed(1)} s  ${start?.[4] ?? ''}  ${/Safari\//.test(start?.[3] ?? '') && !/Chrome/.test(start?.[3] ?? '') ? 'Safari' : 'Chrome'}` +
        `  ${flags.map(([k, n]) => `${k}×${n}`).join(' ')}${end?.[1] === 'pagehide' ? '' : '  (no pagehide: the page did not end cleanly, or is still open)'}`,
    )
  }
  process.exit(0)
}
const f = files.find((x) => x.startsWith(want))
if (!f) {
  console.log('no session', want)
  process.exit(1)
}
const e = load(f)
let inPass = false
let prev = null
for (const x of e) {
  const [t, k, ...r] = x
  if (k === 'f') {
    // a passage's frame: [left, top, width, opacity, clocks, card, card opacity, scrollY]
    const [l, tp, w, op, clocks, card, cop, y] = r
    const jump = prev && Math.abs(w - prev[2]) > 25 ? '   ← JUMP ' + (w - prev[2]) + ' px' : ''
    const still = prev && w === prev[2] && l === prev[0] && clocks !== prev[4] && inPass ? '   (still)' : ''
    if (more === 'frames' || jump) console.log(`${String(t).padStart(7)}  box ${l},${tp} w${w} op${op}  ${clocks}  card ${card} op${cop}  y${y}${jump}${still}`)
    prev = r
    continue
  }
  if (k === 'wheel' || k === 'scroll' || k === 'beat') continue
  if (k === 'attr' && r[1] === 'data-pass') inPass = r[2] === 'on'
  const loud = ['PREVIOUS-DIED', 'ERROR', 'REJECTION', 'MARK', 'gap', 'longframe', 'pagehide', 'start', 'resize'].includes(k)
  console.log(`${String(t).padStart(7)}  ${loud ? '** ' : ''}${k} ${r.map((v) => (typeof v === 'string' ? v.slice(0, 110) : v)).join(' ')}`)
}
const wheels = e.filter((x) => x[1] === 'wheel')
console.log(`\n${e.length} entries · ${wheels.length} wheel events · ${e.filter((x) => x[1] === 'f').length} passage frames`)
