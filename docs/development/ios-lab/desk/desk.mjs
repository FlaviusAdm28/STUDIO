// visible Chrome (CDP 9223) + real macOS trackpad strokes (wheel pad) + screen recording of the window; scrollY sampled per frame
import { spawn, execFileSync } from 'node:child_process'
const S = process.env.S, WHEEL = `${S}/bin/wheel`
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const t = (await (await fetch('http://localhost:9223/json/list')).json()).find((x) => x.type === 'page' && x.url.includes('3141'))
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const wait = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
export const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
export const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
const PID = execFileSync('cat', [`${S}/chrome.pid`]).toString().trim()
export const front = () => execFileSync('osascript', ['-e', `tell application "System Events" to set frontmost of (first process whose unix id is ${PID}) to true`])
export const geom = () => execFileSync('osascript', ['-e', `tell application "System Events" to tell (first process whose unix id is ${PID}) to get {position, size} of window 1`]).toString().trim().split(', ').map(Number)
export const nameJs = `const R=document.documentElement, s=R.dataset.section; const n = s==='work'?'Work ch'+document.querySelector('.work').dataset.ch:s==='method'?'Method '+document.getElementById('method').dataset.phase:s==='about'?'About '+document.getElementById('about').dataset.phase:s; return Math.round(scrollY)+' '+n+('wheelHeld' in R.dataset?' HELD':'')+' snap='+getComputedStyle(R).scrollSnapType`
export const where = () => ev(nameJs)
export const place = async (y) => { await ev(`const R=document.documentElement; R.style.scrollSnapType='none'; scrollTo(0, ${y}); await new Promise(r=>setTimeout(r,500)); R.style.removeProperty('scroll-snap-type'); return 1`); await sleep(3200) }
export const rest = () => ev('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
// a real trackpad stroke at the window centre: dy px over n events, then momentum (positive = down)
export const stroke = (dy, n = 10) => { const [x, y, w, h] = geom(); execFileSync(WHEEL, [String(x + w / 2), String(y + h / 2 + 40), String(dy), String(n), 'pad']) }
// a recorded or generated stroke profile (strokes/<name>: "dt dy phase" lines) posted as real trackpad events
export const strokeFile = (name) => { const [x, y, w, h] = geom(); execFileSync(`${S}/bin/stroke`, [String(x + w / 2), String(y + h / 2 + 40), `${S}/strokes/${name}`]) }
export const tape = async () => { await ev(`window.__ys=[]; window.__t0=performance.now(); const f=()=>{const R=document.documentElement; window.__ys.push([Math.round(performance.now()-window.__t0), Math.round(scrollY), 'wheelHeld' in R.dataset?1:0]); if(window.__ys.length<400) requestAnimationFrame(f)}; f(); return 1`) }
export const readTape = () => ev('return window.__ys')
// record the window for `sec` seconds; returns the child (wait for it with done())
export const record = (file, sec) => { const [x, y, w, h] = geom(); const c = spawn('screencapture', ['-x', '-V', String(sec), `-R${x},${y},${w},${h}`, file], { stdio: 'ignore' }); return c }
export const done = (c) => new Promise((r) => c.on('exit', r))
export const frames = (mov, dir, fps = 30) => { execFileSync('mkdir', ['-p', dir]); execFileSync('/usr/local/bin/ffmpeg', ['-y', '-loglevel', 'error', '-i', mov, '-vf', `fps=${fps},scale=864:-1`, `${dir}/f%03d.png`]) }
export const close = () => ws.close()
