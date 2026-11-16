// safari.mjs <label> <sec> <stroke:wait>… — real Safari (frontmost), driven through the lab proxy's remote console on 3142 (hud mode);
// real trackpad strokes (stroke tool); screen recording of the window; per stroke: where it began and rested, the tape of scrollY per frame
import { execFileSync, spawn } from 'node:child_process'
const S = process.env.S
const [, , label, sec, ...list] = process.argv
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
const run = async (js) => { const r = await fetch('http://localhost:3142/__diag/run', { method: 'POST', body: js }); const t = await r.text(); try { return JSON.parse(t) } catch { return t } }
const geom = () => osa('tell application "System Events" to tell process "Safari" to get {position, size} of window 1').split(', ').map(Number)
const front = () => osa('tell application "Safari" to activate')
const strokeFile = (name) => { const [x, y, w, h] = geom(); execFileSync(`${S}/bin/stroke`, [String(x + w / 2), String(y + h / 2 + 40), `${S}/strokes/${name}`]) }
const click = () => { const [x, y, w, h] = geom(); execFileSync(`${S}/bin/wheel`, [String(x + w / 2), String(y + h / 2 + 40), 'click']) }
const record = (file, s) => { const [x, y, w, h] = geom(); return spawn('screencapture', ['-x', '-V', String(s), `-R${x},${y},${w},${h}`, file], { stdio: 'ignore' }) }
const url = `http://localhost:3142/?t=${Date.now()}`
osa(`tell application "Safari"
  activate
  if (count of windows) = 0 then make new document with properties {URL:"${url}"}
  set URL of current tab of front window to "${url}"
  set bounds of front window to {0, 33, 1728, 1062}
end tell`)
await sleep(5000); front(); await sleep(300)
const nameJs = `const R=document.documentElement, s=R.dataset.section; const n = s==='work'?'Work ch'+document.querySelector('.work').dataset.ch:s==='method'?'Method '+document.getElementById('method').dataset.phase:s==='about'?'About '+document.getElementById('about').dataset.phase:s; return Math.round(scrollY)+' '+n+('wheelHeld' in R.dataset?' HELD':'')+' snap='+getComputedStyle(R).scrollSnapType`
const where = () => run(nameJs)
const rest = () => run('return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })')
console.log('loaded:', await where())
click(); await sleep(4000); await rest(); console.log('after the entrance:', await where())
await run(`window.__ys=[]; window.__wh=[]; window.__t0=performance.now(); addEventListener('wheel',e=>window.__wh.push([Math.round(performance.now()-window.__t0),Math.round(e.deltaY),e.cancelable?1:0,e.defaultPrevented?1:0]),{passive:true}); const f=()=>{const R=document.documentElement; window.__ys.push([Math.round(performance.now()-window.__t0), Math.round(scrollY), 'wheelHeld' in R.dataset?1:0]); requestAnimationFrame(f)}; f(); return 1`)
const c = record(`${S}/rec/${label}.mov`, +sec); await sleep(800)
const t0 = Date.now()
for (const s of list) {
  const [prof, wait = '3000'] = s.split(':')
  const from = await where(); const tStart = await run('return Math.round(performance.now()-window.__t0)'); const w0 = await run('return window.__wh.length')
  strokeFile(prof); await sleep(+wait); await rest()
  const to = await where()
  const ys = await run(`return window.__ys.filter(a=>a[0]>=${tStart})`); const wh = await run(`return window.__wh.slice(${w0})`)
  const comp = []; let last = null; for (const [t, y, h] of ys) { const k = `${y}${h ? 'H' : ''}`; if (k !== last) { comp.push(`${t}:${k}`); last = k } }
  console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] stroke ${prof}  ${from}\n   → ${to}\n   went ${Math.min(...ys.map((a) => a[1]))}…${Math.max(...ys.map((a) => a[1]))}; wheel events ${wh.length} (${wh.slice(0, 4).map((a) => a[1] + (a[2] ? 'c' : '') + (a[3] ? 'P' : '')).join(' ')} … ${wh.slice(-2).map((a) => a[1]).join(' ')})\n   tape: ${comp.slice(0, 14).join(' ')}${comp.length > 14 ? ' …' + comp.slice(-2).join(' ') : ''}`)
}
await new Promise((r) => c.on('exit', r))
