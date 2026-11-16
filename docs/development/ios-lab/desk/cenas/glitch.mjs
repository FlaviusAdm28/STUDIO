// Any animation on a screen.mjs recording, not only the arch's box: each frame is compared with the frames either side of it, in a grid of
// the page (6 × 4 cells; the recorder's corner clock left out).
//   FLICKER — a frame that does not belong: it differs from both neighbours while they are alike (a piece showing for a frame, a photograph
//             going and coming back, a tremor back and forth)
//   JUMP    — a step in a movement far larger than the steps around it (a pile or a title arriving in its place at once)
// and the stretches where the page moves (to read the rest by eye with strip.mjs).
//   node glitch.mjs <dir> [from_ms] [to_ms]
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
const [dir, from = 0, to = 1e9] = process.argv.slice(2)
const plan = JSON.parse(readFileSync(`${dir}/plan.json`, 'utf8'))
const W = 480
const pts = execFileSync('/usr/local/bin/ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'frame=pts_time', '-of', 'csv=p=0', `${dir}/screen.mov`])
  .toString()
  .trim()
  .split('\n')
  .map((x) => Math.round(Number(x) * 1000))
const raw = execFileSync('/usr/local/bin/ffmpeg', ['-loglevel', 'error', '-i', `${dir}/screen.mov`, '-fps_mode', 'passthrough', '-vf', `scale=${W}:-1`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 2 ** 31, stdio: ['ignore', 'pipe', 'ignore'] })
const H = Math.round(raw.length / W / pts.length)
const n = Math.floor(raw.length / (W * H))
const frame = (i) => raw.subarray(i * W * H, (i + 1) * W * H)
// the page: below the browser's toolbar
const top = Math.round(((plan.viewport[1] - plan.window[1]) / plan.window[3]) * H)
const vh = H - top
const GX = 6
const GY = 4
const cellOf = (x, y) => Math.min(GX - 1, Math.floor((x / W) * GX)) + GX * Math.min(GY - 1, Math.floor(((y - top) / vh) * GY))
const masked = (x, y) => x / W > 0.9 && (y - top) / vh > 0.94
// per cell: the mean absolute difference between two frames
const diff = (a, b) => {
  const fa = frame(a)
  const fb = frame(b)
  const sum = new Float64Array(GX * GY)
  const cnt = new Float64Array(GX * GY)
  for (let y = top; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (masked(x, y)) continue
      const c = cellOf(x, y)
      sum[c] += Math.abs(fa[y * W + x] - fb[y * W + x])
      cnt[c]++
    }
  }
  return [...sum].map((s, i) => s / (cnt[i] || 1))
}
const name = (c) => `${'ABCDEF'[c % GX]}${1 + Math.floor(c / GX)}`
const t = (i) => pts[i] ?? Math.round((i * 1000) / 60)
const step = [] // step[i]: frame i-1 → i
for (let i = 1; i < n; i++) step[i] = diff(i - 1, i)
const events = []
for (let i = 1; i < n - 1; i++) {
  if (t(i) < from || t(i) > to) continue
  const a = step[i]
  const b = step[i + 1]
  let across = null
  for (let c = 0; c < GX * GY; c++) {
    // FLICKER: frame i odd one out in this cell
    const lo = Math.min(a[c], b[c])
    if (lo > 2) {
      across ??= diff(i - 1, i + 1)
      if (across[c] < 0.35 * lo) events.push([t(i), 'FLICKER', name(c), `${a[c].toFixed(1)} / ${b[c].toFixed(1)}, across ${across[c].toFixed(1)}`])
    }
    // the same over two frames (i and i+1 the odd ones out: the handoff's ghost of 16 Nov lasted two)
    const c2 = step[i + 2]?.[c] ?? 0
    const lo2 = Math.min(a[c], c2)
    if (i < n - 2 && lo2 > 2 && b[c] < lo2) {
      const far = diff(i - 1, i + 2)[c]
      if (far < 0.35 * lo2) events.push([t(i), 'FLICKER', name(c), `2 frames: ${a[c].toFixed(1)} / ${c2.toFixed(1)}, across ${far.toFixed(1)}`])
    }
    // JUMP: this step's speed against the steps around it (the capture's own uneven spacing taken out)
    const v = a[c] / Math.max(1, t(i) - t(i - 1))
    const around = []
    for (let k = Math.max(1, i - 5); k <= Math.min(n - 1, i + 5); k++) if (k !== i) around.push(step[k][c] / Math.max(1, t(k) - t(k - 1)))
    around.sort((p, q) => p - q)
    const med = around[Math.floor(around.length / 2)]
    if (a[c] > 4 && v > 5 * Math.max(med, 0.02)) events.push([t(i), 'JUMP', name(c), `${a[c].toFixed(1)} in ${t(i) - t(i - 1)} ms, around ${(med * 16.7).toFixed(2)}/frame`])
  }
}
// the stretches where the page moves
const moving = []
let on = null
for (let i = 1; i < n; i++) {
  const m = Math.max(...step[i])
  if (m > 0.6 && on === null) on = i
  if (m <= 0.6 && on !== null) {
    let quiet = 0
    for (let k = i; k < Math.min(n, i + 6) && Math.max(...step[k]) <= 0.6; k++) quiet++
    if (quiet >= 6 || i === n - 1) {
      if (t(i) - t(on) > 80) moving.push([t(on), t(i)])
      on = null
    }
  }
}
console.log(`${n} frames, ${(t(n - 1) / 1000).toFixed(1)} s; cells A–F left to right, 1–4 top to bottom`)
console.log('moving:', moving.map(([a, b]) => `${a}–${b}`).join('  '))
// one line per moment (events within 40 ms grouped)
const groups = []
for (const e of events.sort((p, q) => p[0] - q[0])) {
  const g = groups[groups.length - 1]
  if (g && e[0] - g.t <= 40 && g.kind === e[1]) g.cells.push(`${e[2]} ${e[3]}`)
  else groups.push({ t: e[0], kind: e[1], cells: [`${e[2]} ${e[3]}`] })
}
for (const g of groups) console.log(`${String(g.t).padStart(6)} ${g.kind.padEnd(7)} ${g.cells.slice(0, 4).join(' · ')}${g.cells.length > 4 ? ` (+${g.cells.length - 4})` : ''}`)
if (!groups.length) console.log('no flicker, no jump')
