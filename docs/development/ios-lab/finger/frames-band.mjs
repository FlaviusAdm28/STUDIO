// band.mjs <video> <x0> <w> <t0> <dur> <y0pt> <y1pt> <steppt>: per frame (30 fps), mean R per band; one line per frame, only when changed
import { execFileSync } from 'node:child_process'
const [, , V, X, Wd, t0, dur, Y0, Y1, ST] = process.argv, H = 2622, w = +Wd
const buf = execFileSync('ffmpeg', ['-v', 'error', '-ss', t0, '-t', dur, '-i', V, '-vf', `fps=30,crop=${w}:${H}:${X}:0,format=rgb24`, '-f', 'rawvideo', '-'], { maxBuffer: 2 ** 32 })
const fs = w * H * 3, n = buf.length / fs
const head = []; for (let y = +Y0; y < +Y1; y += +ST) head.push(String(y).padStart(4)); console.log('     t ' + head.join(''))
let prev = ''
for (let f = 0; f < n; f++) { const o = []; for (let y = +Y0; y < +Y1; y += +ST) { let s = 0, c = 0; for (let r = y * 3; r < (y + +ST) * 3; r++) for (let x = 0; x < w; x++) { s += buf[f * fs + (r * w + x) * 3]; c++ } o.push(String(Math.round(s / c)).padStart(4)) } const line = o.join(''); if (line !== prev) console.log((+t0 + f / 30).toFixed(2).padStart(6) + ' ' + line); prev = line }
