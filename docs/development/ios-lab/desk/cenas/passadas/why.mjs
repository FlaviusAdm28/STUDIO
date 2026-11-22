// the conductor's detector over the events a run's page received: each fresh, its rule, and the events around it
import { readFileSync } from 'node:fs'
const { R } = JSON.parse(readFileSync(process.argv[2] + '/rec.json', 'utf8'))
const [from, to] = [Number(process.argv[3] ?? 0), Number(process.argv[4] ?? 1e9)]
let wheelAt = -1e9, wheelWay = 0, wheelPeak = 0, wheelPrev = 0, falling = false, trough = Infinity, rises = 0, strokeAt = 0
R.w.forEach((e) => {
  const now = e[0], a = Math.abs(e[1]), way = Math.sign(e[1])
  if (!e[1]) return
  rises = a > wheelPrev ? rises + 1 : 0
  if (falling) trough = Math.min(trough, a)
  const r = [now - wheelAt > 300, a > 3 && wheelWay !== 0 && way !== wheelWay, a > 15 && a > 2.5 * wheelPrev && wheelPrev < 0.4 * wheelPeak, falling && rises >= 2 && a > 8 && a >= 2 * trough]
  const f = r.some(Boolean)
  if (now >= from && now <= to) console.log(String(now).padStart(7), String(e[1]).padStart(6), `dt ${String(now - wheelAt).padStart(3)} prev ${wheelPrev} peak ${wheelPeak} falling ${falling} trough ${trough} rises ${rises}`, f ? 'FRESH ' + ['gap', 'way', 'jump', 'rise'][r.indexOf(true)] : '')
  wheelAt = now
  if (a > 3 || f) wheelWay = way
  if (f) { wheelPeak = 0; falling = false; trough = Infinity; rises = 0; strokeAt = now }
  wheelPeak = Math.max(wheelPeak, a)
  if (!falling && now - strokeAt > 150 && a < 0.3 * wheelPeak) { falling = true; trough = a }
  if (f || a > 3 || way === wheelWay) wheelPrev = a
})
