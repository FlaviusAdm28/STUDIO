// the owner's recordings (rec.js), one stream per page session (the time starts again after a reload)
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const OUT = fileURLToPath(new URL('../../../../out', import.meta.url))
export function sessions() {
  const all = []
  for (const f of readdirSync(OUT).filter((f) => f.endsWith('rec.jsonl')).sort()) {
    const rows = readFileSync(`${OUT}/${f}`, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
    let cur = [], last = -1, k = 0
    for (const r of rows) {
      if (r[0] < last - 1000) { if (cur.length) all.push({ name: `${f.slice(0, 19)}#${k++}`, w: cur }); cur = [] }
      last = r[0]
      if (r[1] !== 'wheel') continue
      const e = { t: r[0], ts: r[0], dy: r[2][1] * (r[2][2] === 1 ? 16 : 1), dx: r[2][0] }
      if (e.dy && Math.abs(e.dx) <= Math.abs(e.dy)) cur.push(e)
    }
    if (cur.length) all.push({ name: `${f.slice(0, 19)}#${k}`, w: cur })
  }
  return all
}
