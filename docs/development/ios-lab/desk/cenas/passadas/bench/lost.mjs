// the owner's recordings: every detection today's rule makes and v3 does not, sorted into: a duplicate (within 150 ms after another
// detection of today's own — a hand does not stroke twice so soon), delayed (v3 finds it within 150 ms after), or LOST — with its events
import { make } from './det.mjs'
import { sessions } from './owner.mjs'
const opts = { refr: Number(process.env.REFR ?? 150), dip: !!process.env.DIP }
const tally = { dup: 0, delayed: 0, lost: 0 }
const show = []
for (const { name: f, w } of sessions()) {
  const A = make('today'), B = make(process.env.VAR || 'v3', opts)
  const ra = w.map((e) => A(e)), rb = w.map((e) => B(e))
  const ta = w.filter((_, i) => ra[i]).map((e) => e.t), tb = w.filter((_, i) => rb[i]).map((e) => e.t)
  w.forEach((e, i) => {
    if (!ra[i] || rb[i]) return
    if (ta.some((t) => t < e.t && e.t - t < 150)) return tally.dup++
    if (tb.some((t) => Math.abs(t - e.t) < 150)) return tally.delayed++
    tally.lost++
    const ctx = w.slice(Math.max(0, i - 10), i + 8).map((x, k, arr) => `${x === e ? '[' : ''}${Math.abs(x.dy)}${k && x.t - arr[k - 1].t > 20 ? '(' + (x.t - arr[k - 1].t) + ')' : ''}${x === e ? ']' : ''}`).join(' ')
    show.push(`${f.slice(0, 19)} ${String(e.t).padStart(7)} ${ra[i]}: ${ctx}`)
  })
}
console.log(tally)
show.forEach((l) => console.log(l))
