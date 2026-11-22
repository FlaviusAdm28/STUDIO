// one stretch of an owner recording through today's rule and v3, event by event, with v3's state
import { make } from './det.mjs'
import { sessions } from './owner.mjs'
const [file, from, to] = process.argv.slice(2)
const w = sessions().find((x) => x.name === file).w
const A = make('today'), B = make('v3', { log: true })
let p = null
for (const e of w) {
  const a = A(e), b = B(e)
  if (e.t >= Number(from) && e.t <= Number(to)) console.log(String(e.t).padStart(7), String(e.dy).padStart(5), 'dt', p ? e.t - p.t : '-', a || '', '|', b || '')
  p = e
}
