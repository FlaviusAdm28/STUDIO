// bug 1 in the real Safari: the same frame logger as wprobe.mjs, put in through the proxy's remote console (3146), real trackpad strokes
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
const [plan, label = 'sw'] = process.argv.slice(2)
const S = `${process.env.HOME}/.local/share/v5-lab`
const OUT = `${process.env.OUTDIR}/${label}`
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
const run = async (js) => (await fetch('http://localhost:3146/__diag/run', { method: 'POST', body: js })).json()
osa(`tell application "Safari" to set miniaturized of window 1 to false`)
osa(`tell application "Safari" to activate`)
osa(`tell application "Safari" to set URL of current tab of front window to "http://localhost:3146/?cenas=1&t=${Date.now()}"`)
await sleep(4000)
const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell process "Safari" to get {position, size} of window 1`).split(', ').map(Number)
const P = [Math.round(wx + ww * Number(process.env.PX ?? 0.5)), Math.round(wy + 52 + (wh - 52) * Number(process.env.PY ?? 0.42))]
const stroke = (prof) => execFileSync(`${S}/bin/stroke`, [String(P[0]), String(P[1]), `${S}/strokes/${prof}`])
stroke('empty')
osa(`tell application "System Events" to key code 56`)
await sleep(2500)
await run(`document.getElementById('diag-hud')?.remove?.();const F=window.__F=[];const N=window.__N=[];window.__vtMark=(s)=>N.push([Math.round(performance.now()),s]);
  const box=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return [Math.round(r.left*10)/10,Math.round(r.top*10)/10,Math.round(r.width*10)/10,Math.round(r.height*10)/10]};
  const f=(t)=>{const st=document.querySelector('.w-ch[data-c="weddings"] .w-stack');const img=st?.querySelector('.w-ph[data-j="0"] img');
    const lift=[...document.querySelectorAll('.e-window > div[aria-hidden="true"]')].filter(d=>d.style.zIndex==='3');
    F.push({t:Math.round(t),pass:document.documentElement.dataset.pass||'',img:box(img),imgT:img?getComputedStyle(img).transform:'',l0o:lift[0]?getComputedStyle(lift[0]).opacity:'',li:box(lift[0]?.querySelector('img')),look:!!document.querySelector('.w-ch.w-look')});
    if(F.length>6000)F.shift();requestAnimationFrame(f)};requestAnimationFrame(f);return 1`)
const log = []
for (const st of plan.split(/\s+/).filter(Boolean)) {
  const [k, msS] = st.split(':')
  log.push([(await run('return Math.round(performance.now())')), k])
  if (k === 'CLICK') await run(`document.querySelector('.bar-left').click()`)
  else stroke({ D: 'swipe800', d: 'gentle300', U: 'swipe800-up', u: 'gentle300-up' }[k])
  await sleep(Number(msS) || 0)
}
await sleep(2000)
const R = await run(`return {F: window.__F, N: window.__N}`)
writeFileSync(`${OUT}/probe.json`, JSON.stringify({ plan, log, ...R }))
osa(`tell application "Safari" to set miniaturized of window 1 to true`)
console.log(OUT)
