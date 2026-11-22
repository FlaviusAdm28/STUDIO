import { readFileSync } from 'node:fs'
const { F, N, log } = JSON.parse(readFileSync(process.argv[2] + '/probe.json', 'utf8'))
const t0 = log.filter(([, k]) => !k.startsWith('J'))[0]?.[0] ?? 0
console.log('log', log.map(([t, k]) => `${k}@${t - t0}`).join(' '), '| notes', N.filter(([t]) => t >= t0 - 100).map(([t, s]) => `${t - t0}:${s}`).join(' '))
let prev = ''
for (const f of F.filter((f) => f.t >= t0 - 50)) {
  const k = [f.ph, f.lv, f.no, f.na.replace(/@\d+/g, ''), f.po, f.so, f.io].join('|')
  if (k !== prev) console.log(String(f.t - t0).padStart(6), `ph ${f.ph}${f.lv ? ' leaving' : ''} name o ${f.no} ${f.nt} anims [${f.na}] inline-o ${f.io} | frame o ${f.po} say o ${f.so}`)
  prev = k
}
