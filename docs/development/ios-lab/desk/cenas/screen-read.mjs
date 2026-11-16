// Measures a screen.mjs recording frame by frame (the frames' own times): the flying photograph's box — the bright region where the blade
// (E4) and the arch (2) are, the title's band left out — its left, top, width and height. Then each passage: where it stood still while it
// should move (a freeze), where it jumped (a change far over its neighbours'), and how it landed (the last frames against the rest after).
//   node screen-read.mjs <dir>            (dir: the run's folder, with screen.mov)
import { execFileSync } from 'node:child_process'
import { readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
const dir = process.argv[2]
const W = 432
const fr = `${dir}/frames`
if (!existsSync(fr)) {
  mkdirSync(fr)
  execFileSync('/usr/local/bin/ffmpeg', ['-loglevel', 'error', '-i', `${dir}/screen.mov`, '-fps_mode', 'passthrough', '-vf', `scale=${W}:-1`, '-frame_pts', '1', `${fr}/f%06d.png`])
}
const pts = execFileSync('/usr/local/bin/ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'frame=pts_time', '-of', 'csv=p=0', `${dir}/screen.mov`])
  .toString()
  .trim()
  .split('\n')
  .map(Number)
const files = readdirSync(fr).filter((f) => f.endsWith('.png')).sort()
// the window: its toolbar at the top (Chrome 87 px, Safari 52 px of 1029)
const plan = JSON.parse(execFileSync('cat', [`${dir}/plan.json`]).toString())
const barFrac = (plan.viewport[1] - plan.window[1]) / plan.window[3]
const rows = []
// every frame in one pass (one ffmpeg per frame took minutes)
const all = execFileSync('/usr/local/bin/ffmpeg', ['-loglevel', 'error', '-i', `${dir}/screen.mov`, '-fps_mode', 'passthrough', '-vf', `scale=${W}:-1`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 2 ** 31 })
const H = Math.round(all.length / W / files.length)
for (let i = 0; i < files.length; i++) {
  const raw = all.subarray(i * W * H, (i + 1) * W * H)
  const vy0 = Math.round(barFrac * H)
  const vh = H - vy0
  let x0 = W, x1 = -1, y0 = H, y1 = -1, n = 0
  for (let y = vy0; y < H; y++) {
    const fy = (y - vy0) / vh
    for (let x = Math.round(0.04 * W); x < Math.round(0.4 * W); x++) {
      const fx = x / W
      // the title and its lines (x 20–40 %, y 15–56 %) and anything right of the arch above the blades (x > 34 %, y < 56 %) left out
      if (fx > 0.2 && fy < 0.56 && fy > 0.15) continue
      if (fx > 0.34 && fy < 0.56) continue
      if (raw[y * W + x] > 170) {
        n++
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  rows.push({ t: Math.round((pts[i] ?? i / 60) * 1000), f: files[i], n, l: x0, tp: y0, w: n > 40 ? x1 - x0 : 0, h: n > 40 ? y1 - y0 : 0 })
}
writeFileSync(`${dir}/boxes.json`, JSON.stringify(rows))
// passages: stretches where the box's size changes; a freeze is a run of ≥ 4 frames (and ≥ 60 ms) unchanged inside one; a jump a change
// of width or place over 12 px (at 432 px wide: ~48 px of the page) and over 3× the median change around it
// the box's width, left and bottom: its top can be cut by the title's band, its bottom never
const bottom = (r) => r.tp + r.h
const sizeOf = (r) => r.w * 10000 + bottom(r)
const out = []
let i = 0
while (i < rows.length - 1) {
  // a passage starts where the size starts changing
  if (sizeOf(rows[i + 1]) === sizeOf(rows[i]) || !rows[i].w) {
    i++
    continue
  }
  let j = i + 1
  let still = 0
  while (j < rows.length - 1) {
    if (sizeOf(rows[j + 1]) === sizeOf(rows[j])) still++
    else still = 0
    // the passage has ended: ~0.4 s unchanged
    if (still >= 1 && rows[j + 1].t - rows[j + 1 - still].t > 400) break
    j++
  }
  const seg = rows.slice(i, j - still + 2)
  if (seg.length > 6) out.push(seg)
  i = j + 1
}
console.log(`${rows.length} frames over ${((rows[rows.length - 1]?.t ?? 0) / 1000).toFixed(1)} s · ${out.length} passages\n`)
const dW = (a, b) => Math.max(Math.abs(a.w - b.w), Math.abs(a.l - b.l), Math.abs(bottom(a) - bottom(b)))
for (const seg of out) {
  const a = seg[0], z = seg[seg.length - 1]
  const way = z.w > a.w ? 'E4 → 2 (in) ' : '2 → E4 (back)'
  const notes = []
  let run = 1
  for (let k = 1; k < seg.length; k++) {
    if (sizeOf(seg[k]) === sizeOf(seg[k - 1]) && seg[k].l === seg[k - 1].l) run++
    else {
      if (run >= 4 && seg[k - 1].t - seg[k - run].t >= 60 && k - run > 1) notes.push(`STILL ${seg[k - run].t}–${seg[k - 1].t} ms (${run} frames, w${seg[k - 1].w})`)
      run = 1
    }
    const d = dW(seg[k], seg[k - 1])
    const around = seg.slice(Math.max(1, k - 4), Math.min(seg.length, k + 5)).map((r, m, arr) => (m ? dW(r, arr[m - 1]) : 0)).filter((x, m) => m && x)
    const med = around.sort((p, q) => p - q)[Math.floor(around.length / 2)] || 1
    if (d > 12 && d > 3 * med) notes.push(`JUMP at ${seg[k].t} ms: w${seg[k - 1].w} x${seg[k - 1].l} bottom${bottom(seg[k - 1])} → w${seg[k].w} x${seg[k].l} bottom${bottom(seg[k])} (${seg[k].t - seg[k - 1].t} ms apart)`)
  }
  console.log(`${way} ${a.t}–${z.t} ms (${seg.length} frames, ${Math.round((z.t - a.t) / Math.max(1, seg.length - 1))} ms/frame): w ${a.w} → ${z.w}${notes.length ? '\n   ' + notes.join('\n   ') : '   smooth'}`)
}
