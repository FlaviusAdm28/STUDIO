// human.mjs (12 Nov): the iPhone Simulator, Chrome or Safari on the Mac walked as a visitor would — the walk of human-xiaomi.mjs with
// real input: the Simulator by finger (simtouch: drags and clicks), the desktop by real macOS events (wheel.swift: trackpad
// gestures of mixed strength, mouse-wheel clicks, clicks). Down to the end and back to the top, a stroke back now and then, the menu
// opened (and scrolled under) and shut, a moment of the Work and a question tapped, then the menu's links from different places.
// watch.js runs in the page through it; a screenshot at every stop.
//   node human.mjs sim <seed> <outdir>       (TOUCH=<simtouch's folder>, the lab console on :3135)
//   node human.mjs chrome|safari <seed> <outdir>   (WHEEL=<compiled wheel>; Chrome test :3131 at 0,40, Safari :3136 at 202,75)
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const [, , kind = 'sim', seedArg = '1', out = '/tmp/human'] = process.argv
mkdirSync(out, { recursive: true })
let seed = +seedArg
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const pick = (a, z) => a + (z - a) * rnd()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const here = (f) => readFileSync(new URL(f, import.meta.url), 'utf8')
const PORT = { sim: 3135, chrome: 3131, safari: 3136 }[kind]
const run = async (js) => {
  const r = await fetch(`http://localhost:${PORT}/__diag/run`, { method: 'POST', body: js, signal: AbortSignal.timeout(25000) })
  const t = await r.text()
  try { return JSON.parse(t) } catch { return t }
}
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()
const front = () => {
  const who = { sim: 'process "DeviceHub"', chrome: '(first process whose unix id is 26098)', safari: 'process "Safari"' }[kind]
  sh('osascript', ['-e', `tell application "System Events" to set frontmost of ${who} to true`])
}
// ---- input ----
const TOUCH = process.env.TOUCH
const tcmd = async (c) => {
  rmSync(`${TOUCH}/res.txt`, { force: true })
  writeFileSync(`${TOUCH}/cmd.txt`, c)
  for (let i = 0; i < 300 && !existsSync(`${TOUCH}/res.txt`); i++) await sleep(50)
}
// the Simulator: Device Hub at 873,68, its screen at +373,+120, 0.834 / 0.836 pt per device pt; Safari's top adds 62 pt to the viewport
const gx = (x) => 873 + 373 + x * 0.834
const gy = (y) => 68 + 120 + y * 0.836
let origin = [0, 0]
const WHEEL = process.env.WHEEL
const CENTRE = { chrome: [750, 583], safari: [864, 571] }[kind]
const click = async (x, y) => {
  if (kind === 'sim') return tcmd(`click ${gx(x)} ${gy(y + 62)}`)
  sh(WHEEL, [String(origin[0] + x), String(origin[1] + y), 'click'])
}
const KINDS =
  kind === 'sim'
    ? { n: () => [pick(250, 330), pick(110, 200)], s: () => [pick(150, 230), pick(350, 600)], f: () => [pick(380, 460), pick(40, 70)] }
    : { n: () => [pick(250, 360), 20], s: () => [pick(120, 200), 26], f: () => [pick(900, 1400), 8], m: () => [Math.round(pick(1, 3.99)), pick(80, 250)] }
const kindOf = () => {
  const r = rnd()
  if (kind === 'sim') return r < 0.6 ? 'n' : r < 0.8 ? 's' : 'f'
  return r < 0.45 ? 'n' : r < 0.6 ? 's' : r < 0.8 ? 'f' : 'm'
}
const stroke = async (down, k = kindOf()) => {
  const [a, b] = KINDS[k]()
  if (kind === 'sim') {
    const y0 = down ? 560 : 200
    await tcmd(`drag ${gx(110)} ${gy(y0)} ${gx(110)} ${gy(down ? y0 - a : y0 + a)} ${Math.round(b)} 0`)
  } else if (k === 'm') sh(WHEEL, [String(CENTRE[0]), String(CENTRE[1]), String(down ? a : -a), String(Math.round(b))])
  else sh(WHEEL, [String(CENTRE[0]), String(CENTRE[1]), String(Math.round(down ? a : -a)), String(b), 'pad'])
  return k + (down ? '↓' : '↑')
}
// ---- the page ----
const spot = (sel) => run(`const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => { const b = e.getBoundingClientRect(); return b.width && b.top >= 0 && b.bottom < innerHeight - 20 && getComputedStyle(e).visibility !== 'hidden' }); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left + b.width / 2), Math.round(b.top + b.height / 2), e.textContent.trim().replace(/\\s+/g, ' ').slice(0, 24)]`)
const tapSel = async (sel) => {
  const p = await spot(sel)
  if (!p || typeof p === 'string') return null
  await click(p[0], p[1])
  return p[2]
}
const rest = () => run('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const where = async () => String(await run(`const w = window.__w; return w && w.rests.length ? w.rests[w.rests.length - 1] : String(Math.round(scrollY))`))
let shot = 0
const snap = async (tag) => {
  const f = `${out}/${String(++shot).padStart(3, '0')}-${tag.replace(/[^\w@.-]/g, '_')}.jpg`
  if (kind === 'sim') sh('xcrun', ['simctl', 'io', 'booted', 'screenshot', '--type=jpeg', f])
  else {
    const [w, h] = await run('return [innerWidth, innerHeight]')
    sh('screencapture', ['-x', '-t', 'jpg', `-R${origin[0]},${origin[1]},${w},${h}`, f])
  }
}
const trail = []
const step = async (txt) => {
  await sleep(300)
  await rest()
  await sleep(700)
  const w = await where()
  trail.push(`${txt}:${w}`)
  await snap(`${txt}-${w}`)
  return w
}
const menuPeek = async () => {
  if (!(await tapSel('.bar-menu'))) return
  await sleep(pick(700, 2000))
  const y = await run('return Math.round(scrollY)')
  await stroke(rnd() < 0.5) // scrolling with the menu open: nothing may move
  await sleep(600)
  const y2 = await run('return Math.round(scrollY)')
  await snap('menu-open')
  trail.push(y2 === y ? 'menu' : `menu(MOVED ${y}→${y2})`)
  await tapSel('.bar-menu')
  await sleep(900)
}
// ---- the walk ----
front()
// a new address, not a reload: Safari brings a reloaded page back to where it was (the first walk began at the Questions)
await run('setTimeout(() => { location.href = location.pathname + "?h=" + Date.now() }, 50); return 1')
await sleep(8000)
front()
if (kind !== 'sim') origin = await run('return [Math.round(screenX + (outerWidth - innerWidth) / 2), Math.round(screenY + outerHeight - innerHeight)]')
// the entrance: a visitor waits a moment, then taps
await sleep(pick(500, 2500))
await click(kind === "sim" ? 380 : 200, kind === "sim" ? 200 : 400) // away from the blades (they are links: a tap on Weddings landed there)
await sleep(4500)
console.log('watch:', await run(here('./watch.js')))
const leg = async (down) => {
  for (let i = 0; i < 70; i++) {
    const w = await step(await stroke(down))
    if (down ? w.startsWith('fim') : (await run('return scrollY')) < 5) break
    const r = rnd()
    if (r < 0.12) await step(await stroke(!down))
    else if (r < 0.22) await menuPeek()
    else if (r < 0.32 && w.startsWith('W')) {
      const m = await tapSel('.w-mom:not([aria-pressed="true"])')
      if (m) {
        await sleep(pick(800, 2500))
        trail.push('tap:' + m)
      }
    } else if (r < 0.45 && w.startsWith('Q')) {
      const q = await tapSel('.q-btn')
      if (q) {
        await sleep(pick(1000, 3000))
        trail.push('q:' + q.slice(0, 12))
        await snap('question')
      }
    }
    await sleep(pick(300, 3000))
  }
}
await leg(true)
console.log('down:', trail.splice(0).join(' '))
await sleep(1500)
await leg(false)
console.log('up:', trail.splice(0).join(' '))
for (let i = 0; i < 6; i++) {
  if (!(await tapSel('.bar-menu'))) { trail.push('NO-MENU-BUTTON'); continue }
  await sleep(pick(700, 1500))
  const n = Math.floor(rnd() * 5)
  const p = await run(`const a = document.querySelectorAll('.menu-list a')[${n}], b = a.getBoundingClientRect(); return [Math.round(b.left + b.width / 2), Math.round(b.top + b.height / 2), a.textContent.replace(/[^A-Za-z]/g, '')]`)
  await click(p[0], p[1])
  await sleep(3500)
  await step('menu→' + p[2])
  for (let k = 0, m = 1 + Math.floor(rnd() * 3); k < m; k++) await step(await stroke(rnd() < 0.6))
}
console.log('menu:', trail.splice(0).join(' '))
console.log(await run(here('./watch-dump.js')))
