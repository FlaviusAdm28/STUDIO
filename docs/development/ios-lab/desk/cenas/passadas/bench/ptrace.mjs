// a profile through two variants: where they disagree, the events around (dt, dy)
import { readFileSync } from 'node:fs'
import { make } from './det.mjs'
const [name, va = 'today', vb = 'v2'] = process.argv.slice(2)
const rows = readFileSync(`${process.env.HOME}/.local/share/v5-lab/strokes/${name}`, 'utf8').trim().split('\n').map((l) => l.split(' '))
let t = 0
const ev = rows.map(([dt, dy]) => { t += Number(dt); return { t, ts: t, dy: Number(dy), dt: Number(dt) } })
const A = make(va), B = make(vb)
const ra = ev.map((e) => A(e)), rb = ev.map((e) => B(e))
console.log(name, va, ra.filter(Boolean).length, vb, rb.filter(Boolean).length)
ev.forEach((e, i) => {
  if (!ra[i] && !rb[i]) return
  const near = ev.slice(Math.max(0, i - 8), i + 6).map((x) => `${x === e ? '[' : ''}${x.dy}${x.dt > 12 ? '(' + x.dt + ')' : ''}${x === e ? ']' : ''}`).join(' ')
  console.log(`${String(e.t).padStart(6)} ${String(ra[i] || '-').padEnd(5)} ${String(rb[i] || '-').padEnd(5)} ${near}`)
})
