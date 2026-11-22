// every corpus against a detector variant: the lab's runs (strokes made known, events with their own time), every lab profile, the
// owner's own recordings (arrival times only; inner detections classed SPIKE / ramp)
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { make as makeDet } from './det.mjs'
import { makeProd } from './prod.mjs'
const make = (v, o) => (v === 'prod' ? makeProd() : makeDet(v, o))
import { sessions } from './owner.mjs'
const [variant = 'today', ...rest] = process.argv.slice(2)
const o = Object.fromEntries(rest.map((x) => x.split('=')).map(([k, v]) => [k, v === undefined ? true : Number(v)]))
const S = `${process.env.HOME}/.local/share/v5-lab/strokes`
// the runs recorded in the page (rec.mjs / saf.mjs), and the made-up cases (syn.py)
const RUNS = process.env.RUNS ?? `${process.env.HOME}/.local/share/v5-lab/rec/passadas`
const SYN = `${process.env.HOME}/.local/share/v5-lab/strokes-syn`
const PROF = { d: 'gentle300', u: 'gentle300-up', D: 'swipe800', U: 'swipe800-up', s: 'swipe300', S: 'swipe300-up', C: 'owner-chain-chrome', c: 'owner-chain-chrome-up', n: 'swipe300-nomom', N: 'swipe300-nomom-up' }
const bmarks = (name) => readFileSync(`${S}/${name}`, 'utf8').split('\n').filter((l) => / b$/.test(l)).length
let runsOk = 0, runsN = 0, made = 0, found = 0
const lines = []
for (const run of readdirSync(RUNS).sort()) {
  if (!existsSync(`${RUNS}/${run}/rec.json`)) continue
  const { plan, R } = JSON.parse(readFileSync(`${RUNS}/${run}/rec.json`, 'utf8'))
  let m = 0
  for (const st of plan.split(/\s+/).filter(Boolean)) {
    const name = st[0] === 'P' ? st.slice(1).split(':')[0] : st[0] === 'J' ? null : PROF[st[0]]
    if (name) m += bmarks(name)
  }
  const d = make(variant, o)
  const n = R.w.filter((w) => d({ t: w[0], ts: w[4], dy: w[1] })).length
  runsN++; if (n === m) runsOk++; made += m; found += n
  if (n !== m) lines.push(`  run ${run}: made ${m}, found ${n}`)
}
console.log(`runs: ${runsOk}/${runsN} exact, strokes made ${made}, found ${found}`)
lines.forEach((l) => console.log(l))
// profiles: synthetic ones count their finger marks; the owner's recorded rounds: owner-chrome-3 = 12 (16 Nov), the others shown
const KNOWN = { 'owner-chrome-3': 7, 'o15-first': 2 }
let pOk = 0, pN = 0
const other = []
for (const f of readdirSync(S).sort()) {
  const rows = readFileSync(`${S}/${f}`, 'utf8').trim().split('\n').map((l) => l.split(' '))
  let t = 0
  const ev = rows.map(([dt, dy]) => { t += Number(dt); return { t, ts: t, dy: Number(dy) } })
  const d = make(variant, o)
  const n = ev.filter((e) => d(e)).length
  const recorded = /^owner-/.test(f)
  const want = KNOWN[f] ?? (recorded ? null : rows.filter((r) => r[2] === 'b').length)
  if (want === null) { other.push(`${f} ${n}`); continue }
  pN++; if (n === want) pOk++; else lines.push(`  profile ${f}: want ${want}, found ${n}`)
}
console.log(`profiles: ${pOk}/${pN} exact; recorded rounds: ${other.join(', ')}`)
lines.filter((l) => l.includes('profile')).forEach((l) => console.log(l))
// synthetic: a silence then a new stroke (two), joined events inside a momentum (one)
{
  let ok = 0, n = 0
  const bad = []
  for (const f of readdirSync(SYN).filter((f) => !f.endsWith('.want')).sort()) {
    const want = Number(readFileSync(`${SYN}/${f}.want`, 'utf8'))
    let t = 0
    const ev = readFileSync(`${SYN}/${f}`, 'utf8').trim().split('\n').map((l) => l.split(' ').map(Number)).map(([dt, dy]) => { t += dt; return { t, ts: t, dy } })
    const d = make(variant, o)
    const got = ev.filter((e) => d(e)).length
    n++; if (got === want) ok++; else bad.push(`${f} ${got}`)
  }
  // cut*: a strong momentum cut by a silence, a stroke begun at once as fast — missed by the rule before too (a finger starts small)
  console.log(`synthetic: ${ok}/${n} exact${bad.length ? ' · wrong: ' + bad.join(', ') : ''}`)
}
// the owner's recordings, one stream per page session
let spikes = 0, ramps = 0, all = 0
for (const { w } of sessions()) {
  const d = make(variant, o)
  w.forEach((e, i) => {
    const r = d(e)
    if (!r) return
    all++
    if (r !== 'jump' && r !== 'rise') return
    const after = [0, 1, 2, 3, 4, 5].map((k) => (w[i + k] ? Math.abs(w[i + k].dy) : 0))
    if (Math.max(...after.slice(1)) < 0.8 * after[0]) spikes++
    else ramps++
  })
}
console.log(`owner's recordings: ${all} strokes found, inside a stroke: ${ramps} ramps (a hand), ${spikes} SPIKES (a joined event)`)
