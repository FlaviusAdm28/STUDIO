// one run's timeline: strokes posted, the conductor's notes, phase changes, long frames, wheel events not cancelable / not prevented,
// scrolls the conductor did not make (y not on a stop), and the wheel's queueing delay (dispatch − OS time)
import { readFileSync } from 'node:fs'
const { log, R } = JSON.parse(readFileSync(process.argv[2] + '/rec.json', 'utf8'))
const verbose = process.argv.includes('-v')
const stopY = new Map(R.stops.map((s) => [s.y, s.id]))
const ev = []
log.forEach(([t, k]) => ev.push([t, `STROKE ${k}`]))
R.n.forEach(([t, s]) => ev.push([t, `   ${s}`]))
R.p.forEach(([t, v]) => ev.push([t, `      phase ${v}`]))
R.f.filter(([, d]) => d > 50).forEach(([t, d]) => ev.push([t, `         long frame ${d}ms`]))
const bad = R.w.filter((w) => !w[2] || !w[3])
bad.forEach((w) => ev.push([w[0], `         WHEEL dy=${w[1]} cancelable=${w[2]} prevented=${w[3]} y=${w[5]}`]))
R.s.forEach(([t, y]) => {
  const near = [...stopY.keys()].find((s) => Math.abs(s - y) < 2)
  if (near === undefined) ev.push([t, `         scroll off-stop y=${y}`])
})
// wheel queueing delay: dispatch time vs OS timestamp (big = main thread busy, events coalesced)
const lag = R.w.map((w) => w[0] - w[4])
const base = Math.min(...lag)
R.w.forEach((w, i) => { if (lag[i] - base > 40) ev.push([w[0], `         wheel late ${lag[i] - base}ms dy=${w[1]}`]) })
ev.sort((a, b) => a[0] - b[0])
let prev = null
for (const [t, s] of ev) { if (!verbose && s.startsWith('         scroll') && prev?.startsWith('         scroll')) continue; console.log(String(t).padStart(7), s); prev = s }
console.log(`wheel events ${R.w.length}, not cancelable ${R.w.filter((w) => !w[2]).length}, not prevented ${R.w.filter((w) => !w[3]).length}; end at ${R.cur}`)
