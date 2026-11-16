// chain.mjs <label> <step:gapMs>…  step = a stroke profile name | click (the bar's "Chapter One") | top (scrollTo 0 by the site's link, same as click)
// reload, entrance (Enter), then the steps back to back (no waiting for rest) — the owner's timing; a tape per frame of scrollY, held, pass, ch, snap
import * as D from '/Users/flaviooliveira/WebstormProjects/STUDIO/docs/development/ios-lab/desk/desk.mjs'
const [, , label, ...list] = process.argv
D.front(); await D.sleep(300)
if (!process.env.KEEP) {
  await D.send('Page.navigate', { url: `http://localhost:3141/?t=${Date.now()}` }); await D.sleep(4500)
  for (const type of ['keyDown', 'keyUp']) await D.send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await D.sleep(4000); await D.rest()
}
await D.ev(`window.__ys=[]; window.__t0=performance.now(); const f=()=>{const R=document.documentElement, W=document.querySelector('.work'); window.__ys.push([Math.round(performance.now()-window.__t0), Math.round(scrollY), ('wheelHeld' in R.dataset?'H':'')+(R.dataset.pass||'')+(R.dataset.jump!==undefined?'J':''), W?W.dataset.ch:'', getComputedStyle(R).scrollSnapType.startsWith('none')?'-':'s']); requestAnimationFrame(f)}; f();
  window.__wh=[]; addEventListener('wheel',e=>setTimeout(()=>window.__wh.push([Math.round(e.timeStamp-window.__t0),Math.round(e.deltaY),(e.cancelable?'c':'')+(e.defaultPrevented?'P':''),Math.round(scrollY)])),{passive:true});
  window.__st=[]; const o=window.scrollTo.bind(window); window.scrollTo=function(a,b){const top=typeof a==='object'?a.top:b; window.__st.push([Math.round(performance.now()-window.__t0),Math.round(top),Math.round(scrollY),(new Error().stack.split(String.fromCharCode(10))[2]||'').trim().slice(0,90)]); return o(...arguments)}; return 1`)
// steps: name@ms from the chain's start, each launched on time (spawned, not waited for: the owner's timing)
const marks = []; const [gx, gy, gw, gh] = D.geom(); const T0 = Date.now()
const { spawn } = await import('node:child_process')
for (const s of list) {
  const [name, at = '0'] = s.split('@')
  const dt = T0 + +at - Date.now(); if (dt > 0) await D.sleep(dt)
  marks.push([await D.ev('return Math.round(performance.now()-window.__t0)'), name])
  if (name === 'click') { const r = await D.ev(`const b=document.querySelector('a#top .bar-name, a[href="#top"] .bar-name, .bar-left'); const q=b.getBoundingClientRect(); return [q.x+q.width/2,q.y+q.height/2]`); for (const type of ['mousePressed', 'mouseReleased']) await D.send('Input.dispatchMouseEvent', { type, x: r[0], y: r[1], button: 'left', clickCount: 1 }) }
  else if (name === 'nudge') await D.ev('window.scrollBy(0, 13); return 1')
  else spawn(`${process.env.S}/bin/stroke`, [String(gx + gw / 2), String(gy + gh / 2 + 40), `${process.env.S}/strokes/${name}`], { stdio: 'ignore' })
}
await D.sleep(1500)
await D.sleep(2500); await D.rest()
const ys = await D.ev('return window.__ys')
let last = null; const comp = []
for (const [t, y, h, ch, sn] of ys) { const k = `${y}${h ? ' ' + h : ''} c${ch}${sn}`; if (k !== last) { comp.push(`${t}:${k}`); last = k } }
console.log(label, 'steps', marks.map((m) => m.join('@')).join(' '))
console.log(' end', await D.where())
console.log(' tape', comp.length > 70 ? comp.slice(0, 50).join(' | ') + ' … ' + comp.slice(-15).join(' | ') : comp.join(' | '))
if (process.env.WH) console.log(' wheel', (await D.ev('return window.__wh')).map((w) => w.join(',')).join(' '))
console.log(' scrollTo', (await D.ev('return window.__st')).map((w) => w.join(' ')).join('\n   '))
D.close(); process.exit(0)
