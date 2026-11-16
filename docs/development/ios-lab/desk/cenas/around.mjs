import { readFileSync } from 'node:fs'
const [f, T] = [process.argv[2], Number(process.argv[3])]
const rows = readFileSync(`${process.env.HOME}/.local/share/v5-lab/strokes/${f}`, 'utf8').trim().split('\n').map((l) => l.split(' '))
let t = 0, out = []
for (const [dt, dy, ph] of rows) { if (t >= T - 300 && t <= T + 150) out.push((t === T ? '[' : '') + dy + (ph.startsWith('m') ? 'm' : '') + (t === T ? ']' : '')); t += Number(dt) }
console.log(f, '@' + T + ':', out.join(' '))
