// every lab profile: strokes made (finger 'b' marks; the recorded rounds have none inside), today's rule, the windowed one (48 ms)
import { readFileSync, readdirSync } from 'node:fs'
const src = readFileSync(new URL('cmp.mjs', import.meta.url), 'utf8')
const detect = new Function('return ' + src.slice(src.indexOf('(w, rate, WIN = 32) =>'), src.indexOf('\nlet T')))()
const dir = `${process.env.HOME}/.local/share/v5-lab/strokes`
for (const f of readdirSync(dir).sort()) {
  const rows = readFileSync(`${dir}/${f}`, 'utf8').trim().split('\n').map((l) => l.split(' '))
  let t = 0
  const w = rows.map(([dt, dy]) => { t += Number(dt); return [t, Number(dy), 1, 1, t] })
  const made = rows.filter((r) => r[2] === 'b').length
  const a = detect(w, false), b = detect(w, true, 48)
  console.log(f.padEnd(22), 'b-marks', String(made).padStart(2), ' today', String(a).padStart(3), ' windowed', String(b).padStart(3), a !== b ? '  <—' : '')
}
