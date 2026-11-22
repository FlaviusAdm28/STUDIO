// where two variants disagree on a run: the events around each detection one finds and the other does not
import { readFileSync } from 'node:fs'
import { make } from './det.mjs'
const [run, va = 'today', vb = 'v1'] = process.argv.slice(2)
const { R } = JSON.parse(readFileSync(`${process.env.RUNS ?? process.env.HOME + '/.local/share/v5-lab/rec/passadas'}/${run}/rec.json`, 'utf8'))
const A = make(va), B = make(vb)
const ev = R.w.map((w) => ({ t: w[0], ts: w[4], dy: w[1] }))
const ra = ev.map((e) => A(e)), rb = ev.map((e) => B(e))
let shown = 0
ev.forEach((e, i) => {
  if (!!ra[i] === !!rb[i] || shown > 6) return
  shown++
  console.log(`at ${e.t}: ${va}=${ra[i]} ${vb}=${rb[i]}`)
  for (let k = Math.max(0, i - 6); k <= Math.min(ev.length - 1, i + 3); k++) console.log(`   ${k === i ? '>' : ' '} ${ev[k].t} dy ${ev[k].dy} arr ${k ? ev[k].t - ev[k - 1].t : '-'} os ${k ? ev[k].ts - ev[k - 1].ts : '-'}`)
})
