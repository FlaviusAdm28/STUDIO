// simsweep.mjs <label> <step>… — the strategy's phase 0 on the iPhone Simulator (v5-iphone, iOS 27.3): sweep.mjs's sibling. The page from a
// fresh load past the entrance (a tap), then the steps by real touches (simtouch: mouse drags in Device Hub's window are finger strokes, with
// iOS's own momentum), the visual tape (vtape.js) through the lab console on :3135, the screen recorded (simctl io recordVideo). Writes the
// same files as sweep.mjs ($S/rec/<label>.vt.json, .steps.json, .mp4), so vscan.py, vdiff.py and frames.py read them.
// Steps:  n | s | f  [-up] [:waitMs] [!]   a normal (290 pt, 150 ms), slow (190 pt, 450 ms) or fast (420 pt, 55 ms) stroke; "!" = no rest
//         menu=<id>[:waitMs][!]            the bar's menu, then its link to #<id>
//         name[:waitMs][!]                 the bar's "Chapter One"
// Needs: simtouch running on $S/touch ($S/bin/simtouch $S/touch &), Device Hub at 873,68 (842 × 965) in front, the proxy on :3135.
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
const S = process.env.S
const U = 'EF6A63EE-3787-4CDA-B539-FB14663E44AD'
const [, , label, ...steps] = process.argv
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const VTAPE = readFileSync(new URL('./vtape.js', import.meta.url), 'utf8')
const ev = async (js) => {
  const r = await fetch('http://localhost:3135/__diag/run', { method: 'POST', body: js, signal: AbortSignal.timeout(25000) })
  const t = await r.text()
  try { return JSON.parse(t) } catch { return t }
}
const front = () => execFileSync('osascript', ['-e', 'tell application "System Events" to set frontmost of process "DeviceHub" to true'])
const tcmd = async (c) => {
  rmSync(`${S}/touch/res.txt`, { force: true })
  writeFileSync(`${S}/touch/cmd.txt`, c)
  for (let i = 0; i < 300 && !existsSync(`${S}/touch/res.txt`); i++) await sleep(50)
}
// Device Hub at 873,68, its screen at +373,+120, 0.834 / 0.836 pt per device pt; Safari's top adds 62 pt to the viewport (lab.sh, human.mjs)
const gx = (x) => 873 + 373 + x * 0.834
const gy = (y) => 68 + 120 + y * 0.836
const tap = (x, y) => tcmd(`click ${gx(x)} ${gy(y + 62)}`)
const KIND = { n: [290, 150], s: [190, 450], f: [420, 55] }
const stroke = (k, down) => {
  const [a, ms] = KIND[k]
  const y0 = down ? 560 : 200
  return tcmd(`drag ${gx(110)} ${gy(y0)} ${gx(110)} ${gy(down ? y0 - a : y0 + a)} ${ms} 0`)
}
const nameJs = `const R=document.documentElement, s=R.dataset.section; const n = s==='work'?'Work ch'+document.querySelector('.work').dataset.ch:s==='method'?'Method '+document.getElementById('method').dataset.phase:s==='about'?'About '+document.getElementById('about').dataset.phase:s; return Math.round(scrollY)+' '+n`
const where = () => ev(nameJs)
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 900) ok(1); else requestAnimationFrame(f) }; f(); setTimeout(() => ok(0), 15000) })')
const centre = (sel) => ev(`const e=[...document.querySelectorAll(${JSON.stringify(sel)})].find((e)=>{const b=e.getBoundingClientRect(); return b.width && b.top>=0 && b.bottom<=innerHeight}); if(!e) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x+r.width/2), Math.round(r.y+r.height/2)]`)

front(); await sleep(300)
execFileSync('xcrun', ['simctl', 'openurl', U, `http://localhost:3135/?t=${Date.now()}`])
await sleep(9000); front(); await sleep(300)
await tap(380, 200); await sleep(4500); await rest()
console.log('sim', label, 'start', await where(), 'inner', await ev('return innerWidth+"x"+innerHeight'))
await ev(VTAPE + '; return 1')
const rec = spawn('xcrun', ['simctl', 'io', U, 'recordVideo', '--codec=h264', '--force', `${S}/rec/${label}.mp4`], { stdio: 'ignore' })
const recWall = Date.now()
await sleep(2000)
const log = []
const T0 = Date.now()
for (const s of steps) {
  const quick = s.endsWith('!')
  const [what, waitS = '3500'] = s.replace(/!$/, '').split(':')
  const from = quick ? '' : await where()
  await ev(`window.__vtMark(${JSON.stringify(what)}); return 1`)
  const at = Date.now() - T0, wall = Date.now()
  if (what === 'name') { const c = await centre('header.bar a.bar-left'); if (c) await tap(...c) }
  else if (what.startsWith('menu=')) {
    const c = await centre('header.bar a.bar-menu'); if (c) await tap(...c); await sleep(900)
    const l = await centre(`dialog.menu a[href="#${what.slice(5)}"]`); if (l) await tap(...l)
  } else await stroke(what[0], !what.endsWith('-up'))
  await sleep(+waitS)
  if (!quick) await rest()
  const to = quick ? '' : await where()
  log.push({ step: what, at, wall, from, to })
  if (!quick) console.log(`[${(at / 1000).toFixed(1)}s] ${what.padEnd(16)} ${from.padEnd(24)} → ${to}`)
}
await sleep(1500)
await ev('window.__vtStop(); return 1')
let all = null
for (let from = 0; ; from += 1500) {
  let part = await ev(`return window.__vtDump(${from}, 1500)`)
  if (typeof part === 'string') part = JSON.parse(part)
  if (!all) all = part
  else all.frames.push(...part.frames)
  all.els = part.els; all.marks = part.marks
  if (from + 1500 >= part.total) break
}
writeFileSync(`${S}/rec/${label}.vt.json`, JSON.stringify(all))
writeFileSync(`${S}/rec/${label}.steps.json`, JSON.stringify({ browser: 'sim', label, steps: log, recWall, vtWall: all.wall0 }))
console.log(`tape: ${all.frames.length} frames, ${all.els.length} elements → ${S}/rec/${label}.vt.json`)
rec.kill('SIGINT'); await Promise.race([new Promise((r) => rec.on('exit', r)), sleep(10000)])
process.exit(0)
