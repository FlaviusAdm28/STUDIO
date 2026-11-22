// today's rule (raw deltas) against the same rule on rates (delta per ms of the events' own time, e.timeStamp): strokes found vs strokes made
import { readFileSync } from 'node:fs'
const S = `${process.env.HOME}/.local/share/v5-lab/strokes`
const PROF = { d: 'gentle300', u: 'gentle300-up', D: 'swipe800', U: 'swipe800-up', s: 'swipe300', S: 'swipe300-up', C: 'owner-chain-chrome', c: 'owner-chain-chrome-up', n: 'swipe300-nomom', N: 'swipe300-nomom-up' }
const detect = (w, rate, WIN = 32) => {
  const win = []
  let at = -1e9, way0 = 0, peak = 0, prev = 0, falling = false, trough = Infinity, rises = 0, strokeAt = 0, n = 0
  for (const e of w) {
    if (!e[1]) continue
    const now = e[0], way = Math.sign(e[1]), raw = Math.abs(e[1])
    // the stroke's speed over the last WIN ms of its events' own time (a coalesced event carries the sum of those it stands for)
    if (way !== Math.sign(win.length ? win[win.length - 1][1] : way)) win.length = 0
    win.push([e[4], raw * way]); while (win.length && e[4] - win[0][0] >= WIN) win.shift()
    const a = rate ? (win.reduce((s, x) => s + Math.abs(x[1]), 0) * 8) / WIN : raw
    rises = a > prev ? rises + 1 : 0
    if (falling) trough = Math.min(trough, a)
    const f = now - at > 300 || (raw > 3 && way0 !== 0 && way !== way0) || (a > 15 && a > 2.5 * prev && prev < 0.4 * peak) || (falling && rises >= 2 && a > 8 && a >= 2 * trough)
    at = now
    if (raw > 3 || f) way0 = way
    if (f) { n++; peak = 0; falling = false; trough = Infinity; rises = 0; strokeAt = now }
    peak = Math.max(peak, a)
    if (!falling && now - strokeAt > 150 && a < 0.3 * peak) { falling = true; trough = a }
    if (f || raw > 3 || way === way0) prev = a
  }
  return n
}
let T = [0, 0, 0]
for (const run of process.argv.slice(2)) {
  const { plan, R } = JSON.parse(readFileSync(`runs/${run}/rec.json`, 'utf8'))
  let made = 0
  for (const st of plan.split(/\s+/).filter(Boolean)) {
    const name = st[0] === 'P' ? st.slice(1).split(':')[0] : st[0] === 'J' ? null : PROF[st[0]]
    if (name) made += readFileSync(`${S}/${name}`, 'utf8').split('\n').filter((l) => / b$/.test(l)).length
  }
  const old = detect(R.w, false), neu = detect(R.w, true, Number(process.env.WIN || 32))
  T = [T[0] + made, T[1] + old, T[2] + neu]
  console.log(run.padEnd(4), `made ${made}, today's rule ${old}, on rates ${neu}`)
}
console.log('all', `made ${T[0]}, today's rule ${T[1]}, on rates ${T[2]}`)
