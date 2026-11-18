// On the screen, in the real browsers (owner, 16 Nov: "conduz testes no Chrome e Safari pelo ecrã, deves sempre fazer isso agora"): the
// lab's windowed Chrome (CDP 9223) or Safari, the site with ?cenas&rec, real macOS trackpad strokes (bin/stroke, CGEvents), the window
// recorded (screencapture -V). Then every recorded frame is measured: the flying photograph's box (the bright region where the blade and
// the arch are) — a passage must change it smoothly, never stand still mid-way, never jump, and land where the stage's photograph is.
// The flight recorder (?rec → collector.mjs) gives the page's own timeline for the same run.
//   node screen.mjs chrome "d2500 u2500 d7500 u2500" label        (Q=curva=seno … adds to the address; CENAS=0 … the site without the conductor; SITE=3101 … another build)
//   plan: d/u = a gentle stroke down/up (gentle300), D/U = a strong one (swipe800), n/N = one without momentum (swipe300-nomom: the
//   finger alone, to turn a passage back halfway), then the ms to wait; h = the pointer on the
//   Weddings blade first (its zoom); c = the pointer back to the middle
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
const [browser = 'chrome', plan = 'd2500 u2500', label = 'run'] = process.argv.slice(2)
const S = `${process.env.HOME}/.local/share/v5-lab`
const OUT = `${S}/rec/screen/${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}-${browser}-${label}`
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
// Q: more of the address (e.g. Q=curva=seno)
const URL = `http://localhost:${process.env.SITE ?? 3100}/?cenas=${process.env.CENAS ?? 1}&rec${process.env.Q ? `&${process.env.Q}` : ''}`
const proc = browser === 'safari' ? 'process "Safari"' : `(first process whose unix id is ${execFileSync('cat', [`${S}/chrome.pid`]).toString().trim()})`
if (browser === 'safari') {
  osa(`tell application "Safari" to activate`)
  osa(`tell application "Safari" to set URL of current tab of front window to "${URL}"`)
} else {
  const tabs = await (await fetch('http://localhost:9223/json/list')).json()
  const tab = tabs.find((t) => t.type === 'page' && /^http:\/\/localhost:31\d\d/.test(t.url))
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  ws.send(JSON.stringify({ id: 1, method: 'Page.navigate', params: { url: URL } }))
  // the site's tab in front (another tab in front takes the strokes)
  await fetch(`http://localhost:9223/json/activate/${tab.id}`)
  await sleep(300)
  ws.close()
  osa(`tell application "System Events" to set frontmost of ${proc} to true`)
}
await sleep(3500)
const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell ${proc} to get {position, size} of window 1`).split(', ').map(Number)
// the page's viewport: the window less its toolbar (measured once per browser)
const bar = browser === 'safari' ? 52 : 87
const vx = wx, vy = wy + bar, vw = ww, vh = wh - bar
const at = (fx, fy) => [Math.round(vx + fx * vw), Math.round(vy + fy * vh)]
const move = ([x, y]) => execFileSync(`${S}/bin/stroke`, [String(x), String(y), `${S}/strokes/empty`])
// the entrance completed by a key (it waits otherwise)
osa(`tell application "System Events" to key code 56`)
await sleep(1500)
let pointer = at(0.5, 0.42)
move(pointer)
const steps = plan.split(/\s+/).filter(Boolean)
const total = steps.reduce((s, x) => s + (Number(x.slice(1)) || 0) + (/[dDuUnN]/.test(x[0]) ? 1600 : 400), 0) + 1500
const mov = `${OUT}/screen.mov`
const rec = spawn('screencapture', ['-x', '-V', String(Math.ceil(total / 1000)), `-R${wx},${wy},${ww},${wh}`, mov], { stdio: 'ignore' })
const t0 = Date.now()
const log = []
await sleep(600)
for (const s of steps) {
  const k = s[0], ms = Number(s.slice(1)) || 0
  if (k === 'h') pointer = at(0.29, 0.72)
  if (k === 'c') pointer = at(0.5, 0.42)
  if ('hc'.includes(k)) move(pointer)
  const prof = { d: 'gentle300', u: 'gentle300-up', D: 'swipe800', U: 'swipe800-up', n: 'swipe300-nomom', N: 'swipe300-nomom-up' }[k]
  if (prof) {
    log.push([Date.now() - t0, k])
    execFileSync(`${S}/bin/stroke`, [String(pointer[0]), String(pointer[1]), `${S}/strokes/${prof}`])
  }
  await sleep(ms)
}
await new Promise((r) => rec.on('exit', r))
writeFileSync(`${OUT}/plan.json`, JSON.stringify({ browser, plan, window: [wx, wy, ww, wh], viewport: [vx, vy, vw, vh], strokes: log }))
console.log(`recorded ${OUT}/screen.mov`)
