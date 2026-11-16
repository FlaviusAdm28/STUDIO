// case.mjs <label> <placeY|-> <dy> [n] [sec]: place, record, one real stroke, tape of scrollY per frame
import * as D from './desk.mjs'
const S = process.env.S
const [, , label, at, dy, n = '10', sec = '4'] = process.argv
D.front(); await D.sleep(300)
if (at !== '-') await D.place(+at)
const from = await D.where()
const mov = `${S}/rec/${label}.mov`
const c = D.record(mov, +sec); await D.sleep(700)
await D.tape(); D.stroke(+dy, +n)
await D.done(c)
const ys = await D.readTape()
const to = await D.where()
console.log(`${label}: ${from}\n  → ${to}\n  went ${Math.min(...ys.map((a) => a[1]))}…${Math.max(...ys.map((a) => a[1]))}; held frames ${ys.filter((a) => a[2]).length}/${ys.length}`)
// compress the tape: one entry per change
let last = null; const comp = []; for (const [t, y, h] of ys) { const k = `${y}${h ? 'H' : ''}`; if (k !== last) { comp.push(`${t}:${k}`); last = k } }
console.log('  tape', comp.join(' '))
D.frames(mov, `${S}/rec/${label}`)
D.close()
