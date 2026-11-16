// The Method's light after a way back (7 → Experiences): where its boxes are and how much they show. Gathered, the light is a band of no
// width (by day in the middle of the screen); at opacity 1 Safari drew it as a hairline over the Work (16 Nov). It must end at 0.001.
//   node light.mjs
import { open, stroke, key, rest, sleep } from './h.mjs'
const p = await open('http://localhost:3100/?cenas=1')
await key(p, 'Shift')
await sleep(900)
await p.ev(`window.__cenas.go('experiences','jump'); return 1`)
await sleep(1500)
const look = `const m=document.getElementById('method'); return m.dataset.phase+' · light '+document.documentElement.dataset.light+' · '+['.m-wipe','.m-wipe-b','.m-spill'].map(s=>{const e=m.querySelector(s); const r=e.getBoundingClientRect(); return s+' op='+getComputedStyle(e).opacity+' x='+Math.round(r.left)}).join(' ')`
await stroke(p, 'gentle300')
await rest(p, 500, 7000)
console.log('at 7   ', await p.ev(look))
await stroke(p, 'gentle300-up')
await rest(p, 500, 7000)
console.log('back   ', await p.ev(look))
p.ws.close()
process.exit(0)
