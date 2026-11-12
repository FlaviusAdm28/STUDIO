// rgb.mjs <video> <x0> <w> <t...>: mean R,G,B per 20-pt band from y 560 pt down, columns x0..x0+w px
import { execFileSync } from 'node:child_process'
const [, , V, X, Wd, ...ts] = process.argv, H = 2622, w = +Wd
const cols = ts.map((t) => { const b = execFileSync('ffmpeg', ['-v', 'error', '-ss', t, '-i', V, '-frames:v', '1', '-vf', `crop=${w}:${H}:${X}:0,format=rgb24`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 27 }); const o = []; for (let y = 1680; y < 2622; y += 60) { const s = [0, 0, 0]; let n = 0; for (let r = y; r < Math.min(H, y + 60); r++) for (let x = 0; x < w; x++) { for (let c = 0; c < 3; c++) s[c] += b[(r * w + x) * 3 + c]; n++ } o.push(s.map((v) => Math.round(v / n)).join(',')) } return o })
console.log(' y pt  ' + ts.map((t) => String(t).padStart(12)).join(''))
for (let i = 0; i < cols[0].length; i++) console.log(String(560 + i * 20).padStart(5) + '  ' + cols.map((c) => c[i].padStart(12)).join(''))
