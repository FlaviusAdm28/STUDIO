// clicks.mjs <chrome|safari> "<plan>" <label> (17 Nov) — the site's own jumps to a chapter on the screen, in the real browsers, with real
// mouse clicks (bin/wheel … click) and real trackpad strokes (bin/stroke), the window recorded (screencapture -V), the page read through the
// lab's remote console (proxy.mjs: Safari on 3142, Chrome on 3143 — started here if not running; the HUD hidden). After each action: every
// change of chapter it made (one is right; a chapter coming back between is a jump let go early), where the page rests.
//   plan: n<k> click the Work's name of chapter k (0 Weddings, 1 Artists, 2 Experiences) in the row shown · b<k> click the entrance's blade k
//   (at the top) · mw the menu, then its Work · q<k> the Questions' chapter k (the page is put on the Questions first) · back history.back()
//   · d / u a trackpad stroke down / up · top / weddings / questions put the page there (setup, not measured) · w<ms> wait (default 1400 after
//   each action; an action's own: n1:1000)
//   CENAS=1 … the site with the conductor (default: without, as visitors have it)
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
const [browser = 'chrome', plan = 'weddings n1 n2 n0', label = 'clicks'] = process.argv.slice(2)
const S = `${process.env.HOME}/.local/share/v5-lab`
const LAB = new URL('../../', import.meta.url).pathname
// UP=3101 … another build of the site (a comparison): its own proxy ports
const UP = process.env.UP ?? '3100'
const PORT = (browser === 'safari' ? 3142 : 3143) + (UP === '3100' ? 0 : 2)
const OUT = `${S}/rec/screen/${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}-${browser}-${label}`
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
const up = async () => fetch(`http://localhost:${PORT}/`).then(() => true, () => false)
if (!(await up())) {
  spawn(`${process.env.HOME}/.local/share/node22/bin/node`, [`${LAB}proxy.mjs`, String(PORT), UP], { detached: true, stdio: 'ignore' }).unref()
  await sleep(1500)
}
const run = async (js) => {
  const r = await fetch(`http://localhost:${PORT}/__diag/run`, { method: 'POST', body: js })
  const t = await r.text()
  try {
    return JSON.parse(t)
  } catch {
    return t
  }
}
const ADDR = `http://localhost:${PORT}/?cenas=${process.env.CENAS ?? 0}&t=${Date.now()}`
const proc = browser === 'safari' ? 'process "Safari"' : `(first process whose unix id is ${readFileSync(`${S}/chrome.pid`, 'utf8').trim()})`
if (browser === 'safari') {
  osa(`tell application "Safari" to activate`)
  osa(`tell application "Safari" to set URL of current tab of front window to "${ADDR}"`)
} else {
  const tabs = await (await fetch('http://localhost:9223/json/list')).json()
  const tab = tabs.find((t) => t.type === 'page' && /^http:\/\/localhost:31\d\d/.test(t.url)) ?? tabs.find((t) => t.type === 'page')
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  ws.send(JSON.stringify({ id: 1, method: 'Page.navigate', params: { url: ADDR } }))
  await fetch(`http://localhost:9223/json/activate/${tab.id}`)
  await sleep(300)
  ws.close()
}
osa(`tell application "System Events" to set frontmost of ${proc} to true`)
await sleep(4000)
const front = () => osa(`tell application "System Events" to set frontmost of ${proc} to true`)
const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell ${proc} to get {position, size} of window 1`).split(', ').map(Number)
const bar = browser === 'safari' ? 52 : 87
const click = ([x, y]) => execFileSync(`${S}/bin/wheel`, [String(Math.round(wx + x)), String(Math.round(wy + bar + y)), 'click'])
const stroke = (prof) => execFileSync(`${S}/bin/stroke`, [String(wx + ww / 2), String(wy + bar + (wh - bar) * 0.42), `${S}/strokes/${prof}`])
// the entrance completed by a key, the HUD hidden, the log
osa(`tell application "System Events" to key code 56`)
await sleep(1600)
await run(`document.getElementById('v5-hud') && (document.getElementById('v5-hud').style.display = 'none')
  window.__L = []; const t0 = performance.now(); const log = (s) => __L.push([Math.round(performance.now() - t0), s])
  new MutationObserver(() => log('ch' + document.querySelector('.work').dataset.ch)).observe(document.querySelector('.work'), { attributes: true, attributeFilter: ['data-ch'] })
  addEventListener('click', (e) => log('click on ' + (e.target.closest('a,button')?.textContent || e.target.className || e.target.tagName).trim().replace(/\\s+/g, ' ').slice(0, 24) + ' y' + Math.round(scrollY)), true)
  addEventListener('error', (e) => log('ERROR ' + e.message)); addEventListener('unhandledrejection', (e) => log('ERROR ' + e.reason))
  window.__mark = (s) => log('@' + s); return 1`)
const centre = (sel) =>
  run(`const el = ${sel}; if (!el) return null; const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]`)
const shown = `['weddings','artists','experiences'][+document.querySelector('.work').dataset.ch]`
const rest = () => run('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
const steps = plan.split(/\s+/).filter(Boolean)
const mov = `${OUT}/screen.mov`
// the recording's length: each step's wait and its own time (a click, the console, the setups' 2.5 s)
const total = steps.reduce((t, x) => t + (/^w\d+$/.test(x) ? +x.slice(1) : +(x.split(':')[1] ?? 1400) + (['top', 'weddings', 'questions'].includes(x) ? 3200 : 900)), 0) / 1000 + 5
const rec = spawn('screencapture', ['-x', '-V', String(Math.ceil(total)), `-R${wx},${wy},${ww},${wh}`, mov], { stdio: 'ignore' })
const recDone = new Promise((r) => rec.on('exit', r))
const t0 = Date.now()
const acts = []
await sleep(600)
for (const step of steps) {
  front()
  // an action's own wait after it: n1:1000
  const [s, after] = step.split(':')
  let wait = 1400
  const act = async (name, fn) => {
    acts.push([Date.now() - t0, name])
    await run(`__mark(${JSON.stringify(name)}); return 1`)
    await fn()
  }
  if (/^w\d+$/.test(s)) wait = +s.slice(1)
  else if (s === 'top' || s === 'weddings' || s === 'questions') {
    await run(`__mark('setup ${s}'); return 1`)
    await run(`document.documentElement.style.scrollSnapType = 'none'; ${s === 'top' ? 'scrollTo(0, 0)' : s === 'weddings' ? "location.hash = 'weddings'" : "document.getElementById('questions').scrollIntoView()"}; setTimeout(() => document.documentElement.style.removeProperty('scroll-snap-type'), 600); return 1`)
    await sleep(2500)
    await rest()
    wait = 600
  } else if (/^n\d$/.test(s)) {
    const p = await centre(`document.querySelector('.w-ch[data-c="' + ${shown} + '"] .w-nav-ch[data-k="${s[1]}"]')`)
    await act(s, () => click(p))
  } else if (/^b\d$/.test(s)) {
    const p = await centre(`document.querySelectorAll('.e-blades .e-blade')[${s[1]}]`)
    await act(s, () => click(p))
    wait = 2200
  } else if (s === 'mw') {
    const p = await centre(`document.querySelector('.bar-menu')`)
    click(p)
    await sleep(900)
    const q = await centre(`document.querySelector('.menu a[href="#work"]')`)
    await act(s, () => click(q))
    wait = 2200
  } else if (/^q\d$/.test(s)) {
    const p = await centre(`document.querySelectorAll('.q-chs a')[${s[1]}]`)
    await act(s, () => click(p))
    wait = 2200
  } else if (s === 'back') await act(s, () => run('history.back(); return 1'))
  else if (s === 'd' || s === 'u') await act(s, async () => stroke(s === 'd' ? 'gentle300' : 'gentle300-up'))
  await sleep(after ? +after : wait)
}
await sleep(1500)
await rest()
const L = await run('return __L')
await recDone
// per action: the chapters it went through
const out = []
let cur = null
for (const [t, s] of L) {
  if (s.startsWith('@')) {
    cur = { act: s.slice(1), t, ch: [] }
    out.push(cur)
  } else if (s.startsWith('ERROR')) out.push({ act: s, t, ch: [] })
  else if (s.startsWith('click on')) {
    if (cur) cur.on = s.slice(9)
  }
  else if (cur) cur.ch.push(s.slice(2))
}
const where = await run(`return Math.round(scrollY) + ' ' + (document.documentElement.dataset.section || 'top') + ' ch' + document.querySelector('.work').dataset.ch`)
for (const o of out) {
  if (o.act.startsWith('setup')) continue
  console.log(`${o.act.padEnd(5)} → ${o.ch.join(' → ') || '(no change)'}${o.ch.length > 1 ? '   ← MORE THAN ONE' : ''}${o.on ? `   [clicked: ${o.on}]` : ''}`)
}
console.log('rests at', where)
writeFileSync(`${OUT}/plan.json`, JSON.stringify({ browser, plan, window: [wx, wy, ww, wh], viewport: [wx, wy + bar, ww, wh - bar], strokes: acts, log: L }))
console.log(`recorded ${mov}`)
