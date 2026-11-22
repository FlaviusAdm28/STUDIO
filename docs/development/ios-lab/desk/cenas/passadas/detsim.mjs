// The conductor's stroke detector (conductor.ts onWheel, as of today) run over the owner's real wheel recordings (rec.js): every "fresh",
// which rule made it, and whether it looks like a hand (a ramp up after it) or a spike inside a momentum (the values after it fall back)
import { readFileSync } from 'node:fs'
const GAP = 300
for (const file of process.argv.slice(2)) {
  const rows = readFileSync(file, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
  const ua = rows[0][2]?.ua ?? ''
  const w = rows.filter((r) => r[1] === 'wheel').map((r) => ({ t: r[0], dy: r[2][1], dx: r[2][0], mode: r[2][2] })).filter((e) => e.dy && Math.abs(e.dx) <= Math.abs(e.dy))
  let wheelAt = -1e9, wheelWay = 0, wheelPeak = 0, wheelPrev = 0, falling = false, trough = Infinity, rises = 0, strokeAt = 0
  const fresh = []
  w.forEach((e, i) => {
    const now = e.t, a = Math.abs(e.dy * (e.mode === 1 ? 16 : 1)), way = Math.sign(e.dy)
    rises = a > wheelPrev ? rises + 1 : 0
    if (falling) trough = Math.min(trough, a)
    const r1 = now - wheelAt > GAP, r2 = a > 3 && wheelWay !== 0 && way !== wheelWay, r3 = a > 15 && a > 2.5 * wheelPrev && wheelPrev < 0.4 * wheelPeak, r4 = falling && rises >= 2 && a > 8 && a >= 2 * trough
    const f = r1 || r2 || r3 || r4
    const dtPrev = now - wheelAt
    wheelAt = now
    if (a > 3 || f) wheelWay = way
    if (f) { fresh.push({ i, t: now, rule: r1 ? 'gap' : r2 ? 'way' : r3 ? 'jump' : 'rise', dtPrev, peakBefore: wheelPeak }); wheelPeak = 0; falling = false; trough = Infinity; rises = 0; strokeAt = now }
    wheelPeak = Math.max(wheelPeak, a)
    if (!falling && now - strokeAt > 150 && a < 0.3 * wheelPeak) { falling = true; trough = a }
    if (f || a > 3 || way === wheelWay) wheelPrev = a
  })
  const byRule = {}
  fresh.forEach((f) => (byRule[f.rule] = (byRule[f.rule] || 0) + 1))
  console.log(`\n${file.split('/').pop()} ${/Chrome/.test(ua) ? 'Chrome' : 'Safari'}: ${w.length} events, ${fresh.length} strokes`, byRule)
  // the inner ones (not after a pause or a turn): the values around, and whether the next five keep rising (a hand) or fall back (a spike)
  for (const f of fresh.filter((f) => f.rule === 'jump' || f.rule === 'rise')) {
    const v = (k) => (w[k] ? Math.abs(w[k].dy) : '')
    const before = [5, 4, 3, 2, 1].map((k) => v(f.i - k)), after = [0, 1, 2, 3, 4, 5].map((k) => v(f.i + k))
    const dts = [0, 1, 2, 3].map((k) => (w[f.i + k] && w[f.i + k - 1] ? w[f.i + k].t - w[f.i + k - 1].t : ''))
    const spike = Math.max(...after.slice(1, 6).map(Number)) < 0.8 * Number(after[0])
    console.log(`  ${String(f.t).padStart(7)} ${f.rule.padEnd(4)} ${spike ? 'SPIKE' : 'ramp '} before ${before.join(' ')} | ${after.join(' ')}  dt ${dts.join(' ')}`)
  }
}
