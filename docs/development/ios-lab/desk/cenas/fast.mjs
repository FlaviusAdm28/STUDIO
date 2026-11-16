// S2: fast scrolling — strokes one after another, each cutting the last one's momentum (as a hand on a trackpad does), or the owner's
// recorded chains; then the path the conductor took and whether everything is coherent once the hand stops
import { open, profile, key, state, stuck, rest, check, sleep, notes } from './h.mjs'
const mode = process.argv[2] || 'burst' // burst | chain
const every = Number(process.argv[3] || 300) // ms between strokes (burst)
const count = Number(process.argv[4] || 30)
const p = await open('http://localhost:3100/?cenas=1')
await key(p, 'Shift')
await sleep(800)
const sendFor = async (name, way, ms) => {
  const t0 = Date.now()
  for (const [dt, dy] of profile(name)) {
    if (Date.now() - t0 >= ms) return
    await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: p.w / 2, y: p.h / 2, deltaX: 0, deltaY: dy * way })
    await new Promise((r) => setTimeout(r, dt))
  }
}
const run = async (way) => {
  const n0 = (await notes(p)).length
  const t0 = Date.now()
  if (mode === 'burst') for (let i = 0; i < count; i++) await sendFor(way > 0 ? (process.env.ST||'gentle300') : (process.env.ST||'gentle300')+'-up', 1, every)
  else for (const name of way > 0 ? ['owner-chain-chrome', 'owner-chain-safari'] : ['owner-chain-chrome-up', 'owner-chain-safari-up']) await sendFor(name, 1, 1e9)
  const handMs = Date.now() - t0
  await rest(p, 500, 8000)
  const s = await state(p)
  const st = await stuck(p)
  const ns = (await notes(p)).slice(n0)
  const path = ns.filter(([, x]) => x.startsWith('cenas at')).map(([t, x]) => `${x.split(' ')[2]}@${t}`)
  const kept = ns.filter(([, x]) => x.includes(' kept')).length
  const dropped = ns.filter(([, x]) => x.includes(' dropped')).length
  console.log(`${way > 0 ? '↓' : '↑'} hand ${handMs} ms · ${path.length} stops: ${path.map((x) => x.split('@')[0]).join(' → ')}`)
  console.log(`   kept ${kept}, dropped ${dropped} · end: ${s.cur} y=${s.y} ${check(s)}${st.length ? ' STUCK ' + st.join(',') : ''}`)
  console.log(`   times: ${path.join(' ')}`)
}
await run(1)
await sleep(500)
await run(-1)
console.log('long frames', JSON.stringify(await p.ev('return window.__long')))
p.ws.close()
process.exit(0)
