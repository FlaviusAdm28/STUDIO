// A strip of a screen.mjs recording: one frame every <step> ms from <from> to <to> (the recording's own times), the left part of the
// window (the blade and the arch), <cols> per row → <dir>/strip-<from>.png
//   node strip.mjs <dir> <from> <to> <step> [cols] [crop: fraction of the width, 0.42]
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
const [dir, from, to, step, cols = 12, crop = 0.42] = process.argv.slice(2)
const b = JSON.parse(readFileSync(`${dir}/boxes.json`, 'utf8'))
const pick = []
for (let t = Number(from); t <= Number(to); t += Number(step)) {
  let best = b[0]
  for (const r of b) if (Math.abs(r.t - t) < Math.abs(best.t - t)) best = r
  pick.push(best)
}
writeFileSync(`${dir}/strip.list`, pick.map((r) => `file '${dir}/frames/${r.f}'`).join('\n'))
const rows = Math.ceil(pick.length / Number(cols))
execFileSync('/usr/local/bin/ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${dir}/strip.list`, '-vf', `crop=iw*${crop}:ih:0:0,scale=150:-1,tile=${cols}x${rows}:padding=2`, '-frames:v', '1', `${dir}/strip-${from}.png`])
console.log(`${dir}/strip-${from}.png`, pick.map((r) => r.t).join(' '))
