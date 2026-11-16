// sweep.mjs <chrome|safari> <label> <recSec> <step>… — the strategy's phase 0 (v5-scroll-strategy.md): one browser, the page from a fresh
// load past the entrance, then the steps, with the visual tape (vtape.js) running all along and, if recSec > 0, the window recorded.
// Steps (real input: macOS trackpad events, real keys; clicks by CDP in Chrome, by a real click in Safari):
//   <profile>[:waitMs]   a trackpad stroke from $S/strokes, then wait and wait for rest      e.g. swipe300:3800
//   <profile>:waitMs!    the same without waiting for rest (rhythms: bursts, reversals)       e.g. swipe300:300!
//   name[:waitMs]        click the bar's "Chapter One" (to the top)
//   menu=<id>[:waitMs]   open the menu, click its link to #<id> (work, method, about, questions, contact)
//   key=<Key>[:waitMs]   a real key: PageDown PageUp Down Up Space End Home
// Writes $S/rec/<label>.vt.json (the tape and every element's name) and $S/rec/<label>.steps.json (each step: where from, where to).
import { execFileSync, spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
const S = process.env.S
const [, , browser, label, recSec, ...steps] = process.argv
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
const VTAPE = readFileSync(new URL('./vtape.js', import.meta.url), 'utf8')
let D, ev, geom, front, clickAt
if (browser === 'chrome') {
  D = await import('./desk.mjs')
  ev = D.ev
  geom = D.geom
  front = () => { D.front(); D.send('Page.bringToFront') }
  clickAt = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await D.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }) }
} else {
  ev = async (js) => { const r = await fetch('http://localhost:3142/__diag/run', { method: 'POST', body: js }); const t = await r.text(); try { return JSON.parse(t) } catch { return t } }
  geom = () => osa('tell application "System Events" to tell process "Safari" to get {position, size} of window 1').split(', ').map(Number)
  front = () => osa('tell application "Safari" to activate')
  clickAt = async (x, y) => { const [wx, wy, , wh] = geom(); const ih = await ev('return innerHeight'); execFileSync(`${S}/bin/wheel`, [String(wx + x), String(wy + (wh - ih) + y), 'click']) }
}
const KEY = { PageDown: 121, PageUp: 116, Down: 125, Up: 126, Space: 49, End: 119, Home: 115 }
const nameJs = `const R=document.documentElement, s=R.dataset.section; const n = s==='work'?'Work ch'+document.querySelector('.work').dataset.ch:s==='method'?'Method '+document.getElementById('method').dataset.phase:s==='about'?'About '+document.getElementById('about').dataset.phase:s; return Math.round(scrollY)+' '+n`
const where = () => ev(nameJs)
const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 900) ok(1); else requestAnimationFrame(f) }; f(); setTimeout(() => ok(0), 15000) })')
const stroke = (name) => { const [x, y, w, h] = geom(); execFileSync(`${S}/bin/stroke`, [String(x + w / 2), String(y + h / 2 + 40), `${S}/strokes/${name}`]) }
const centre = (sel) => ev(`const e=document.querySelector(${JSON.stringify(sel)}); if(!e) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x+r.width/2), Math.round(r.y+r.height/2)]`)

// a fresh load, past the entrance (a key: Enter completes it)
front(); await sleep(300)
// QS: more of the address (e.g. QS='&motor' for the motor prototype)
const url = `http://localhost:${browser === 'chrome' ? 3141 : 3142}/?t=${Date.now()}${process.env.QS || ''}`
if (browser === 'chrome') await D.send('Page.navigate', { url })
else osa(`tell application "Safari"
  activate
  if (count of windows) = 0 then make new document with properties {URL:"${url}"}
  set URL of current tab of front window to "${url}"
  set bounds of front window to {0, 33, 1728, 1062}
end tell`)
await sleep(5000); front(); await sleep(300)
osa('tell application "System Events" to key code 36'); await sleep(4000); await rest()
console.log(browser, label, 'start', await where(), 'inner', await ev('return innerWidth+"x"+innerHeight'))
// LIGHT=1: the tape without the elements (frame times, scrollY, marks), to measure long frames without vtape's own cost (getComputedStyle
// per element per frame). PROBE=<file>: a script injected after the tape (it can write to the tape with window.__vtMark)
await ev((process.env.LIGHT ? VTAPE.replace(/const SEL = '[^']*'/, "const SEL = 'x-none'").replace('for (const a of document.getAnimations())', 'for (const a of [])') : VTAPE) + '; return 1')
if (process.env.PROBE) console.log('probe', await ev(readFileSync(process.env.PROBE, 'utf8')))
let rec = null
// the window recorded by ffmpeg (stops cleanly on SIGINT; screencapture loses the file when stopped early): 60 fps, the window's pixels
let recWall = 0
if (+recSec > 0) {
  const [x, y, w, h] = geom()
  rec = spawn('/usr/local/bin/ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'avfoundation', '-pixel_format', 'nv12', '-capture_cursor', '0', '-framerate', '60', '-i', '1:none', '-vf', `crop=${w * 2}:${h * 2}:${x * 2}:${y * 2},scale=1152:-2`, '-r', '60', '-c:v', 'h264_videotoolbox', '-b:v', '5M', `${S}/rec/${label}.mp4`], { stdio: 'ignore' })
  recWall = Date.now()
  await sleep(1200)
}
const log = []
const T0 = Date.now()
for (const s of steps) {
  const quick = s.endsWith('!')
  const [what, waitS = '3500'] = s.replace(/!$/, '').split(':')
  const from = quick ? '' : await where()
  await ev(`window.__vtMark(${JSON.stringify(what)}); return 1`)
  const at = Date.now() - T0, wall = Date.now()
  if (what === 'name') { const c = await centre('header.bar a.bar-left'); await clickAt(...c) }
  else if (what.startsWith('click=')) { const c = await centre(what.slice(6).replace(/_/g, ' ')); if (c) await clickAt(...c) } // click=<css>, "_" for spaces
  else if (what.startsWith('menu=')) {
    const c = await centre('header.bar a.bar-menu'); await clickAt(...c); await sleep(900)
    const l = await centre(`dialog.menu a[href="#${what.slice(5)}"]`); await clickAt(...l)
  } else if (what.startsWith('key=')) osa(`tell application "System Events" to key code ${KEY[what.slice(4)]}`)
  else stroke(what)
  await sleep(+waitS)
  if (!quick) await rest()
  const to = quick ? '' : await where()
  log.push({ step: what, at, wall, from, to })
  if (!quick) console.log(`[${(at / 1000).toFixed(1)}s] ${what.padEnd(16)} ${from.padEnd(24)} → ${to}`)
}
await sleep(1500)
await ev('window.__vtStop(); return 1')
// read the tape back in pieces (Safari's remote console carries text)
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
writeFileSync(`${S}/rec/${label}.steps.json`, JSON.stringify({ browser, label, steps: log, recWall, vtWall: all.wall0 }))
console.log(`tape: ${all.frames.length} frames, ${all.els.length} elements → ${S}/rec/${label}.vt.json`)
if (rec) { rec.kill('SIGINT'); await Promise.race([new Promise((r) => rec.on('exit', r)), sleep(10000)]) }
if (D) D.close()
process.exit(0)
