// walk.mjs <label> <sec> <stroke>…  stroke = dy[:n][:waitMs]  — reload, entrance, then real trackpad strokes like a visitor; one recording;
// per stroke: where it began (state of the marks), where it rested, how far it went, wheel events Chrome delivered
import * as D from './desk.mjs'
import { writeFileSync } from 'node:fs'
const raw = []
const S = process.env.S
const [, , label, sec, ...list] = process.argv
D.front(); await D.sleep(300)
await D.send('Page.navigate', { url: `http://localhost:3141/?t=${Date.now()}` }); await D.sleep(4500)
await D.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await D.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await D.sleep(4000); await D.rest()
const stateJs = `const R=document.documentElement, M=document.getElementById('method'), A=document.getElementById('about');
  const act=[...document.querySelectorAll('.w-pass-snap, .m-snap, .a-snap')].filter(e=>!getComputedStyle(e).scrollSnapAlign.startsWith('none')).map(e=>Math.round(e.getBoundingClientRect().top+scrollY)).sort((a,b)=>a-b);
  return 'root['+Object.keys(R.dataset).filter(k=>!['js','section','theme'].includes(k)).join(',')+'] method['+Object.keys(M.dataset).join(',')+'] about['+Object.keys(A.dataset).join(',')+'] marks='+act.join(',')`
await D.ev(`window.__ys=[]; window.__wh=[]; window.__sn=[]; window.__t0=performance.now(); const tg=e=>{const b=e.snapTargetBlock; return b?((b.dataset&&b.dataset.at)||b.className||b.tagName)+'@'+Math.round(b.getBoundingClientRect().top+scrollY):'-'}; for (const k of ['scrollsnapchanging','scrollsnapchange']) document.addEventListener(k,e=>window.__sn.push([Math.round(performance.now()-window.__t0),k==='scrollsnapchanging'?'~':'=',tg(e)])); addEventListener('scrollend',()=>window.__sn.push([Math.round(performance.now()-window.__t0),'end',Math.round(scrollY)])); addEventListener('wheel',e=>window.__wh.push([Math.round(performance.now()-window.__t0),Math.round(e.deltaY),e.cancelable?1:0,e.defaultPrevented?1:0]),{passive:true}); const f=()=>{const R=document.documentElement; window.__ys.push([Math.round(performance.now()-window.__t0), Math.round(scrollY), 'wheelHeld' in R.dataset?1:0, R.dataset.pass||'', R.style.overflow||'']); requestAnimationFrame(f)}; f(); return 1`)
const mov = `${S}/rec/${label}.mov`
const c = D.record(mov, +sec); await D.sleep(800)
const t0 = Date.now()
for (const s of list) {
  const [prof, wait = '3000'] = s.split(':'); const dy = prof
  const from = await D.where(), st = await D.ev(stateJs)
  const tStart = await D.ev('return Math.round(performance.now()-window.__t0)')
  const w0 = await D.ev('return window.__wh.length'); const s0 = await D.ev('return window.__sn.length')
  if (/^-?\d+$/.test(prof)) D.stroke(+prof, 10); else D.strokeFile(prof)
  await D.sleep(+wait); await D.rest()
  const to = await D.where()
  const ys = (await D.ev(`return window.__ys.filter(a=>a[0]>=${tStart})`))
  const wh = await D.ev(`return window.__wh.slice(${w0})`); const sn = await D.ev(`return window.__sn.slice(${s0})`)
  raw.push({ stroke: dy, from, to, tStart, ys, wh, sn })
  const gaps = ys.slice(1).map((a, i) => a[0] - ys[i][0]); const longF = gaps.filter((g) => g > 50); const comp = []; let last = null; for (const [t, y, h] of ys) { const k = `${y}${h ? 'H' : ''}`; if (k !== last) { comp.push(`${t}:${k}`); last = k } }
  console.log(`   snap: ${sn.map((a) => a[0] + ':' + a[1] + a[2]).join(' ')}`); console.log(`   frames: ${ys.length}, longest ${Math.max(...gaps)} ms, >50 ms: ${longF.length}${longF.length ? ' (' + longF.join(' ') + ')' : ''}`); console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] stroke ${dy}  ${from}\n   → ${to}\n   went ${Math.min(...ys.map((a) => a[1]))}…${Math.max(...ys.map((a) => a[1]))}; wheel events ${wh.length} (${wh.slice(0, 4).map((a) => a[1] + (a[2] ? 'c' : '') + (a[3] ? 'P' : '')).join(' ')} … ${wh.slice(-2).map((a) => a[1]).join(' ')}; ${wh.length ? wh[0][0] + '–' + wh[wh.length - 1][0] + ' ms' : ''})\n   start: ${st}\n   tape: ${comp.slice(0, 14).join(' ')}${comp.length > 14 ? ' …' + comp.slice(-2).join(' ') : ''}`)
}
writeFileSync(`${S}/rec/${label}.json`, JSON.stringify(raw))
await Promise.race([D.done(c), D.sleep(8000)]); try { c.kill() } catch {}
D.close(); process.exit(0)
