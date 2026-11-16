// S1: the page stroke by stroke, waiting each time: down to the end and back to the top
import { open, stroke, key, state, stuck, rest, check, sleep } from './h.mjs'
const STR = process.argv[2] || 'swipe300'
const p = await open('http://localhost:3100/?cenas=1')
await key(p, 'Shift') // completes the entrance
await sleep(800)
console.log('stops', JSON.stringify(await p.ev('return window.__cenas?.stops()')))
let s = await state(p)
console.log('start', JSON.stringify(s))
let fails = 0
for (const way of [1, -1]) {
  let last = s.cur
  for (let i = 0; i < 30; i++) {
    const t0 = Date.now()
    await stroke(p, way > 0 ? STR : `${STR}-up`)
    const r = await rest(p)
    s = await state(p)
    const st = await stuck(p)
    const c = check(s)
    const moved = s.cur !== last
    if (c !== 'ok' || st.length) fails++
    console.log(`${way > 0 ? '↓' : '↑'} ${String(last).padEnd(11)} → ${String(s.cur).padEnd(11)} y=${s.y} ${c}${st.length ? ' STUCK ' + st.join(',') : ''} rest ${r}ms ${Date.now() - t0}ms${moved ? '' : ' (no move)'}`)
    if (!moved && (s.cur === 'end' || s.cur === 'top')) break
    last = s.cur
    await sleep(300)
  }
}
console.log('long frames', JSON.stringify(await p.ev('return window.__long.length')), 'fails', fails)
p.ws.close()
process.exit(0)
