// after the fix: the Method's stops a run went through, in order, and how long after the one before each came (a played stop sooner than
// its change was seen through, the same way, would be a stroke not held); strokes kept and dropped
import { readFileSync } from 'node:fs'
const IN = ['experiences', '7', '8a', '8b', '8c', '9', '10', '11', '12']
let bad = 0, n = 0, kept = 0, dropped = 0, made = 0
const S = `${process.env.HOME}/.local/share/v5-lab/strokes`
for (const run of process.argv.slice(2)) {
  const { plan, R } = JSON.parse(readFileSync(`runs/${run}/rec.json`, 'utf8'))
  for (const st of plan.split(/\s+/)) if (st[0] === 'P') made += readFileSync(`${S}/${st.slice(1).split(':')[0]}`, 'utf8').split('\n').filter((l) => / b$/.test(l)).length
  let prev = null
  const out = []
  for (const [t, s] of R.n) {
    if (/kept/.test(s)) kept++
    if (/dropped/.test(s)) dropped++
    const m = s.match(/^cenas at (\S+) (play|jump)/)
    if (!m) continue
    const [, id, how] = m
    if (how === 'jump') { prev = null; out.push(`J${id}`); continue }
    n++
    let flag = ''
    if (prev && IN.includes(id) && IN.includes(prev.id)) {
      const d = IN.indexOf(id) - IN.indexOf(prev.id)
      if (Math.abs(d) !== 1) flag = ' SKIP'
      // the same way as the change before, sooner than ~0.6 s (8a–9) or ~1.46 s (into 10): not held
      const min = prev.id === '10' && prev.way > 0 ? 1440 : 590
      if (d === prev.way && t - prev.t < min && !['experiences', '7', '12'].includes(prev.id)) flag += ` SOON(${t - prev.t})`
      prev = { id, t, way: Math.sign(d) }
    } else prev = { id, t, way: prev ? Math.sign(IN.indexOf(id) - IN.indexOf(prev.id)) : 0 }
    if (flag) bad++
    out.push(`${id}${prev ? '' : ''}${flag}`)
  }
  console.log(run.padEnd(4), out.join(' '))
}
console.log(`strokes made ${made}, stops played ${n}, kept ${kept}, dropped ${dropped}, flagged ${bad}`)
