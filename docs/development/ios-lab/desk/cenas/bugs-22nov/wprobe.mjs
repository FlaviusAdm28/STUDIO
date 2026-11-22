// Bug 1 (22 Nov): the Weddings card at the end of the passage, frame by frame, in the lab's windowed Chrome with real trackpad strokes.
//   node wprobe.mjs "<plan>" label   plan: J<stop>:ms (lab jump), CLICK:ms (the bar's Chapter One, a real CDP mouse click), D:ms / P<profile>:ms (a stroke)
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
const [plan, label = 'w'] = process.argv.slice(2)
const S = `${process.env.HOME}/.local/share/v5-lab`
const OUT = `${process.env.OUTDIR}/${label}`
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
const pid = execFileSync('cat', [`${S}/chrome.pid`]).toString().trim()
const proc = `(first process whose unix id is ${pid})`
const tabs = await (await fetch('http://localhost:9223/json/list')).json()
let tab = tabs.find((t) => t.type === 'page' && t.title === 'method-lab')
if (!tab) tab = await (await fetch(`http://localhost:9223/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id) } }
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description }
await send('Page.enable'); await send('Runtime.enable')
await send('Page.addScriptToEvaluateOnNewDocument', { source: `(()=>{const F=window.__F=[];const N=window.__N=[];window.__vtMark=(s)=>N.push([Math.round(performance.now()),s]);
  const box=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return [Math.round(r.left*10)/10,Math.round(r.top*10)/10,Math.round(r.width*10)/10,Math.round(r.height*10)/10]};
  const f=(t)=>{const st=document.querySelector('.w-ch[data-c="weddings"] .w-stack');const img=st?.querySelector('.w-ph[data-j="0"] img');
    const lift=[...document.querySelectorAll('.e-window > div[aria-hidden="true"]')].filter(d=>d.style.zIndex==='3');
    F.push({t:Math.round(t),y:Math.round(scrollY),pass:document.documentElement.dataset.pass||'',ch:document.getElementById('work')?.dataset.ch,
      st:box(st),stT:st?getComputedStyle(st).transform:'',stO:st?getComputedStyle(st).opacity:'',img:box(img),imgT:img?getComputedStyle(img).transform:'',
      l0:box(lift[0]),li:box(lift[0]?.querySelector('img')),look:!!document.querySelector('.w-ch.w-look'),l0o:lift[0]?getComputedStyle(lift[0]).opacity:'',n:lift.length});
    if(F.length>6000)F.shift();requestAnimationFrame(f)};requestAnimationFrame(f)})();` })
await send('Page.navigate', { url: `http://localhost:3100/?cenas=${process.env.CENAS ?? 1}` })
await sleep(300)
await ev(`document.title='method-lab'`)
await fetch(`http://localhost:9223/json/activate/${tab.id}`)
osa(`tell application "System Events" to set frontmost of ${proc} to true`)
await sleep(2500)
const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell ${proc} to get {position, size} of window 1`).split(', ').map(Number)
const P = [Math.round(wx + ww * Number(process.env.PX ?? 0.5)), Math.round(wy + 87 + (wh - 87) * Number(process.env.PY ?? 0.42))]
const run = (prof) => execFileSync(`${S}/bin/stroke`, [String(P[0]), String(P[1]), `${S}/strokes/${prof}`])
run('empty')
osa(`tell application "System Events" to key code 56`)
await sleep(2500)
await ev(`document.title='method-lab'`)
const log = []
const now = () => ev('return Math.round(performance.now())')
for (const st of plan.split(/\s+/).filter(Boolean)) {
  const [k, msS] = st.split(':')
  const ms = Number(msS) || 0
  log.push([await now(), k])
  if (k[0] === 'J') await ev(`window.__cenas.go('${k.slice(1)}','jump')`)
  else if (k === 'CLICK') {
    const c = await ev(`const r=document.querySelector('.bar-left').getBoundingClientRect();return [r.left+r.width/2, r.top+r.height/2]`)
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c[0], y: c[1] })
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: c[0], y: c[1], button: 'left', clickCount: 1 })
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: c[0], y: c[1], button: 'left', clickCount: 1 })
    run('empty')
  } else run(k[0] === 'P' ? k.slice(1) : { D: 'swipe800', d: 'gentle300', U: 'swipe800-up' }[k])
  await sleep(ms)
}
await sleep(2500)
const R = await ev(`return {F: window.__F, N: window.__N}`)
writeFileSync(`${OUT}/probe.json`, JSON.stringify({ plan, log, ...R }))
ws.close()
console.log(OUT)
