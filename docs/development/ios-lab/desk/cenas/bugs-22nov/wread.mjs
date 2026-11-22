// the Weddings card around the passage's end: each frame where the card or its photograph moves after the passage is done
import { readFileSync } from 'node:fs'
const { F, N, log } = JSON.parse(readFileSync(process.argv[2] + '/probe.json', 'utf8'))
const from = Number(process.argv[3] ?? 0)
const strokes = log.filter(([, k]) => !k.startsWith('J') && k !== 'CLICK').map(([t]) => t)
const last = strokes[strokes.length - 1] ?? 0
console.log('log', log.map(([t, k]) => `${k}@${t}`).join(' '), '| notes', N.filter(([t]) => t > last - 3000).map(([t, s]) => `${t}:${s}`).join(' '))
const seg = F.filter((f) => f.t >= (from || last) - 50)
let prev = null
for (const f of seg) {
  const ch = prev && (JSON.stringify(f.st) !== JSON.stringify(prev.st) || JSON.stringify(f.img) !== JSON.stringify(prev.img) || f.pass !== prev.pass || f.stT !== prev.stT || f.l0o !== prev.l0o || f.imgT !== prev.imgT || f.look !== prev.look)
  if (!prev || ch) console.log(String(f.t).padStart(6), `y ${f.y} pass ${f.pass || '-'} ch ${f.ch} st ${f.st} ${f.stT} o${f.stO} img ${f.img} ${f.imgT.slice(0, 40)} lift ${f.l0} o${f.l0o} limg ${f.li} look ${f.look}`)
  prev = f
}
