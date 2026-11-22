// The Method under real trackpad strokes in the lab's windowed Chrome (CDP 9223), with a recorder in the page: every wheel event (time,
// OS time, delta, cancelable, prevented), every scroll, the conductor's notes, the scenes' phases, long frames.
//   node rec.mjs "<plan>" label     plan: J<stop> = jump there (lab), d/u gentle300, D/U swipe800, s/S swipe300, C/c owner chain, then ms to wait
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
const [plan = 'Jexperiences D1500', label = 'run'] = process.argv.slice(2)
const URL = `http://localhost:${process.env.SITE ?? 3100}/?cenas=${process.env.CENAS ?? 1}`
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
await send('Page.addScriptToEvaluateOnNewDocument', { source: `(()=>{const R=window.__R={w:[],s:[],n:[],p:[],f:[],m:[]};const now=()=>Math.round(performance.now());
  window.__vtMark=(s)=>R.n.push([now(),s]);
  addEventListener('wheel',(e)=>{const r=[now(),Math.round(e.deltaY*10)/10,e.cancelable?1:0,0,Math.round(e.timeStamp),Math.round(scrollY)];R.w.push(r);setTimeout(()=>{r[3]=e.defaultPrevented?1:0},0)},{capture:true,passive:true});
  addEventListener('scroll',()=>R.s.push([now(),Math.round(scrollY*10)/10]),{capture:true,passive:true});
  const obs=()=>{const m=document.getElementById('method');if(!m)return setTimeout(obs,50);const w=document.getElementById('work'),a=document.getElementById('about');
    const mo=new MutationObserver(()=>{const v=[m.dataset.phase,w?.dataset.ch,a?.dataset.phase].join('|');if(R.p.length&&R.p[R.p.length-1][1]===v)return;R.p.push([now(),v])});
    [m,w,a].forEach(el=>el&&mo.observe(el,{attributes:true,attributeFilter:['data-phase','data-ch']}))};
  document.addEventListener('DOMContentLoaded',obs);
  let l=0;const f=(t)=>{if(l&&t-l>34)R.f.push([Math.round(t),Math.round(t-l)]);l=t;requestAnimationFrame(f)};requestAnimationFrame(f);
})();` })
await send('Page.navigate', { url: URL })
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
await sleep(1500)
await ev(`document.title='method-lab'`)
const T = await ev(`return Math.round(performance.now())`)
const t0 = Date.now()
const log = []
const PROF = { d: 'gentle300', u: 'gentle300-up', D: 'swipe800', U: 'swipe800-up', s: 'swipe300', S: 'swipe300-up', C: 'owner-chain-chrome', c: 'owner-chain-chrome-up', n: 'swipe300-nomom', N: 'swipe300-nomom-up' }
for (const st of plan.split(/\s+/).filter(Boolean)) {
  if (st[0] === 'J') { const [stop, ms] = st.slice(1).split(':'); await ev(`window.__cenas.go('${stop}','jump')`); log.push([T + Date.now() - t0, 'J' + stop]); await sleep(Number(ms) || 1500); continue }
  if (st[0] === 'P') { const [name, ms] = st.slice(1).split(':'); log.push([T + Date.now() - t0, 'P' + name]); run(name); await sleep(Number(ms) || 0); continue }
  const k = st[0], ms = Number(st.slice(1)) || 0
  log.push([T + Date.now() - t0, k])
  run(PROF[k])
  await sleep(ms)
}
await sleep(2500)
const R = await ev(`return {...window.__R, stops: window.__cenas.stops(), cur: window.__cenas.current()}`)
writeFileSync(`${OUT}/rec.json`, JSON.stringify({ plan, log, R }))
ws.close()
console.log(OUT)
