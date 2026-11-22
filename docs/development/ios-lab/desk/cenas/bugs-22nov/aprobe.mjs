// bug 3: the About's name ("I'm Flávio.") on a quick way back 13 → 12 → 11, frame by frame, in Safari (proxy 3146) or Chrome (B=chrome)
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
const [plan, label = 'ap'] = process.argv.slice(2)
const B = process.env.B ?? 'safari'
const S = `${process.env.HOME}/.local/share/v5-lab`
const OUT = `${process.env.OUTDIR}/${label}`
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
let run, P
const LOGGER = `document.getElementById('diag-hud')?.remove?.();const F=window.__F=[];window.__N=window.__N||[];const N=window.__N;window.__vtMark=(s)=>N.push([Math.round(performance.now()),s]);
  const a=document.getElementById('about');const name=a.querySelector('.a-name'),pt=a.querySelector('.a-pt'),frame=a.querySelector('.a-frame'),say=a.querySelector('.a-say');
  const f=(t)=>{const cs=getComputedStyle(name);F.push({t:Math.round(t),ph:a.dataset.phase,lv:a.classList.contains('a-leaving'),no:cs.opacity.slice(0,5),nt:cs.transform.slice(0,46),na:name.getAnimations().map(x=>x.playState[0]+(x.effect.getKeyframes().map(k=>Object.keys(k).filter(p=>!['offset','computedOffset','easing','composite'].includes(p)).join('+')).join('/'))+'@'+Math.round(x.currentTime??-1)).join(','),
    po:getComputedStyle(frame).opacity.slice(0,5),so:getComputedStyle(say).opacity.slice(0,5),io:name.style.opacity});if(F.length>8000)F.shift();requestAnimationFrame(f)};requestAnimationFrame(f);return 1`
if (B === 'safari') {
  run = async (js) => (await fetch('http://localhost:3146/__diag/run', { method: 'POST', body: js })).json()
  osa(`tell application "Safari" to set miniaturized of window 1 to false`)
  osa(`tell application "Safari" to activate`)
  osa(`tell application "Safari" to set URL of current tab of front window to "http://localhost:3146/?cenas=1&t=${Date.now()}"`)
  await sleep(4000)
  const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell process "Safari" to get {position, size} of window 1`).split(', ').map(Number)
  P = [Math.round(wx + ww * 0.85), Math.round(wy + 52 + (wh - 52) * 0.85)]
} else {
  const tabs = await (await fetch('http://localhost:9223/json/list')).json()
  let tab = tabs.find((t) => t.type === 'page' && t.title === 'method-lab')
  if (!tab) tab = await (await fetch(`http://localhost:9223/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  let id = 0
  const wait = new Map()
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
  run = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value }
  await send('Page.navigate', { url: 'http://localhost:3100/?cenas=1' })
  await sleep(300)
  await fetch(`http://localhost:9223/json/activate/${tab.id}`)
  const pid = execFileSync('cat', [`${S}/chrome.pid`]).toString().trim()
  osa(`tell application "System Events" to set frontmost of (first process whose unix id is ${pid}) to true`)
  await sleep(3000)
  await run(`document.title='method-lab'`)
  const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell (first process whose unix id is ${pid}) to get {position, size} of window 1`).split(', ').map(Number)
  P = [Math.round(wx + ww * 0.85), Math.round(wy + 87 + (wh - 87) * 0.85)]
}
const stroke = (prof) => execFileSync(`${S}/bin/stroke`, [String(P[0]), String(P[1]), `${S}/strokes/${prof}`])
stroke('empty')
osa(`tell application "System Events" to key code 56`)
await sleep(2500)
await run(LOGGER)
const log = []
let rec = null
for (const st of plan.split(/\s+/).filter(Boolean)) {
  const [k, msS] = st.split(':')
  log.push([await run('return Math.round(performance.now())'), k])
  if (k === 'REC') {
    const { spawn } = await import('node:child_process')
    const proc = B === 'safari' ? 'process "Safari"' : `(first process whose unix id is ${execFileSync('cat', [`${S}/chrome.pid`]).toString().trim()})`
    const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell ${proc} to get {position, size} of window 1`).split(', ').map(Number)
    const p = spawn('screencapture', ['-x', '-V', String(Number(msS) || 6), `-R${wx},${wy},${ww},${wh}`, `${OUT}/screen.mov`], { stdio: 'ignore' })
    rec = new Promise((r) => p.on('exit', r))
    await sleep(500)
    continue
  }
  if (k[0] === 'J') await run(`window.__cenas.go('${k.slice(1)}','jump')`)
  else if (k[0] === 'P') stroke(k.slice(1))
  else stroke({ D: 'swipe800', d: 'gentle300', U: 'swipe800-up', u: 'gentle300-up' }[k])
  await sleep(Number(msS) || 0)
}
if (rec) await rec
await sleep(500)
const R = await run(`return {F: window.__F, N: window.__N}`)
writeFileSync(`${OUT}/probe.json`, JSON.stringify({ plan, log, ...R }))
if (B === 'safari') osa(`tell application "Safari" to set miniaturized of window 1 to true`)
process.exit(0)
console.log(OUT)
