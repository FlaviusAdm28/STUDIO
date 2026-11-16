import { readFileSync, readdirSync } from 'node:fs'
const dir = `${process.env.HOME}/.local/share/v5-lab/strokes`
const sim = (rows, v) => {
  let t = 0, at = -1e9, way0 = 0, peak = 0, prev = 0, falling = false, trough = Infinity, rises = 0, n = 0, times = [], start = 0
  for (const [dt, dy] of rows) {
    t += 0
    if (!dy) { t += dt; continue }
    const a = Math.abs(dy), way = Math.sign(dy)
    rises = a > prev ? rises + 1 : 0
    if (falling) trough = Math.min(trough, a)
    const old = a > 15 && a > 2.5 * prev && prev < 0.4 * peak
    let fresh = t - at > 300 || (a > 3 && way0 !== 0 && way !== way0) || old
    if (v === 'new' && !fresh) fresh = falling && rises >= 2 && a > 8 && a >= 2 * trough
    at = t
    if (a > 3 || fresh) way0 = way
    if (fresh) { peak = 0; falling = false; trough = Infinity; rises = 0; n++; times.push(t); start = t }
    peak = Math.max(peak, a)
    if (v === 'new' && !falling && t - start > 150 && a < 0.3 * peak) { falling = true; trough = a }
    if (fresh || a > 3 || way === way0) prev = a
    t += dt
  }
  return { n, times }
}
for (const f of readdirSync(dir).sort()) {
  const rows = readFileSync(`${dir}/${f}`, 'utf8').trim().split('\n').map((l) => l.split(' ').map(Number))
  const o = sim(rows, 'old'), w = sim(rows, 'new')
  console.log(f.padEnd(24), 'old', String(o.n).padStart(3), ' new', String(w.n).padStart(3), w.n !== o.n ? '  old ' + o.times.join(',') + '\n' + ' '.repeat(34) + 'new ' + w.times.join(',') : '')
}
