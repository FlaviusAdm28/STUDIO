// new runs: on the events each page really got, strokes made vs strokes found by the rule before (today) and by the site's own detector
// (strokes.ts, the one the page ran); and the stops the page went through (holds.mjs's check: nothing skipped, nothing too soon)
import { readFileSync } from 'node:fs'
import { make } from './det.mjs'
import { makeProd } from './prod.mjs'
const S = `${process.env.HOME}/.local/share/v5-lab/strokes`
const PROF = { d: 'gentle300', u: 'gentle300-up', D: 'swipe800', U: 'swipe800-up', s: 'swipe300', S: 'swipe300-up', n: 'swipe300-nomom', N: 'swipe300-nomom-up' }
const tot = { made: 0, old: 0, site: 0, phantomsOld: 0, wrongSite: 0 }
for (const run of process.argv.slice(2)) {
  const { plan, R } = JSON.parse(readFileSync(`${process.env.RUNS ?? process.env.HOME + '/.local/share/v5-lab/rec/passadas'}/${run}/rec.json`, 'utf8'))
  let made = 0
  for (const st of plan.split(/\s+/).filter(Boolean)) {
    const name = st[0] === 'P' ? st.slice(1).split(':')[0] : st[0] === 'J' ? null : PROF[st[0]]
    if (name) made += readFileSync(`${S}/${name}`, 'utf8').split('\n').filter((l) => / b$/.test(l)).length
  }
  const A = make('today'), B = makeProd()
  const ev = R.w.map((w) => ({ t: w[0], ts: w[4], dy: w[1] }))
  const old = ev.filter((e) => A(e)).length, site = ev.filter((e) => B(e)).length
  tot.made += made; tot.old += old; tot.site += site; tot.phantomsOld += Math.max(0, old - made); tot.wrongSite += Math.abs(site - made)
  const long = R.f.filter(([, d]) => d > 50).length
  console.log(`${run.padEnd(5)} made ${String(made).padStart(3)} · rule before ${String(old).padStart(3)} · site ${String(site).padStart(3)}${site !== made ? '  ✗' : ''} · frames > 50 ms ${long}`)
}
console.log(tot)
