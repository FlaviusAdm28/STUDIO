// The same recorder in the real Safari, through the proxy's remote console (localhost:3146, hud.js): real trackpad strokes (bin/stroke)
//   node saf.mjs "<plan>" label   (plan as rec.mjs; J<stop>:ms jumps by the lab hook)
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
const [plan = 'Jexperiences D1500', label = 'srun'] = process.argv.slice(2)
const PORT = 3146
const S = `${process.env.HOME}/.local/share/v5-lab`
const OUT = `${process.env.OUTDIR}/${label}`
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
const run = async (js) => { const r = await fetch(`http://localhost:${PORT}/__diag/run`, { method: 'POST', body: js }); return r.json() }
const REC = `const R=window.__R={w:[],s:[],n:[],p:[],f:[]};const now=()=>Math.round(performance.now());
  window.__vtMark=(s)=>R.n.push([now(),s]);
  addEventListener('wheel',(e)=>{const r=[now(),Math.round(e.deltaY*10)/10,e.cancelable?1:0,0,Math.round(e.timeStamp),Math.round(scrollY)];R.w.push(r);setTimeout(()=>{r[3]=e.defaultPrevented?1:0},0)},{capture:true,passive:true});
  addEventListener('scroll',()=>R.s.push([now(),Math.round(scrollY*10)/10]),{capture:true,passive:true});
  const m=document.getElementById('method'),w=document.getElementById('work'),a=document.getElementById('about');
  const mo=new MutationObserver(()=>{const v=[m.dataset.phase,w?.dataset.ch,a?.dataset.phase].join('|');if(R.p.length&&R.p[R.p.length-1][1]===v)return;R.p.push([now(),v])});
  [m,w,a].forEach(el=>el&&mo.observe(el,{attributes:true,attributeFilter:['data-phase','data-ch']}));
  let l=0;const f=(t)=>{if(l&&t-l>34)R.f.push([Math.round(t),Math.round(t-l)]);l=t;requestAnimationFrame(f)};requestAnimationFrame(f);
  document.getElementById('diag-hud')?.remove?.(); return [innerWidth, innerHeight, !!window.__cenas]`
osa(`tell application "Safari" to set miniaturized of window 1 to false`)
osa(`tell application "Safari" to activate`)
osa(`tell application "Safari" to set URL of current tab of front window to "http://localhost:${PORT}/?cenas=1&t=${Date.now()}"`)
await sleep(4000)
const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell process "Safari" to get {position, size} of window 1`).split(', ').map(Number)
const P = [Math.round(wx + ww * Number(process.env.PX ?? 0.5)), Math.round(wy + 52 + (wh - 52) * Number(process.env.PY ?? 0.42))]
const stroke = (prof) => execFileSync(`${S}/bin/stroke`, [String(P[0]), String(P[1]), `${S}/strokes/${prof}`])
stroke('empty')
osa(`tell application "System Events" to key code 56`)
await sleep(1500)
console.log('page', JSON.stringify(await run(REC)))
const T = await run('return Math.round(performance.now())')
const t0 = Date.now()
const log = []
const PROF = { d: 'gentle300', u: 'gentle300-up', D: 'swipe800', U: 'swipe800-up', s: 'swipe300', S: 'swipe300-up', n: 'swipe300-nomom', N: 'swipe300-nomom-up' }
for (const st of plan.split(/\s+/).filter(Boolean)) {
  if (st[0] === 'J') { const [stop, ms] = st.slice(1).split(':'); await run(`window.__cenas.go('${stop}','jump')`); log.push([T + Date.now() - t0, 'J' + stop]); await sleep(Number(ms) || 1500); continue }
  if (st[0] === 'P') { const [name, ms] = st.slice(1).split(':'); log.push([T + Date.now() - t0, 'P' + name]); stroke(name); await sleep(Number(ms) || 0); continue }
  const k = st[0], ms = Number(st.slice(1)) || 0
  log.push([T + Date.now() - t0, k]); stroke(PROF[k]); await sleep(ms)
}
await sleep(2500)
const R = await run(`return {...window.__R, stops: window.__cenas.stops(), cur: window.__cenas.current()}`)
writeFileSync(`${OUT}/rec.json`, JSON.stringify({ plan, log, R }))
osa(`tell application "Safari" to set miniaturized of window 1 to true`)
console.log(OUT)
