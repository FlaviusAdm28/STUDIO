// which stops lie from the About's 14 to the end, and what moves on the screen between them (a scroll position every 40 px)
import { open, sleep } from './h.mjs'
const sizes = (process.argv[2] || '1440x900,1366x633,1920x1080,2560x1305,1024x768').split(',').map((s) => s.split('x').map(Number))
for (const [w, h] of sizes) {
  const p = await open('http://localhost:3100/?cenas=1', { w, h })
  await sleep(2500)
  const r = await p.ev(`
    const st = window.__cenas.stops(); const ids = st.map(s => s.id); const i14 = ids.indexOf('14');
    const sel = { paper: '#questions .q-paper', box: '#questions .q-box', room: '#contact .c-room', scene: '#contact .c-scene', start: '#contact .c-start', colo: '#contact .colophon', ask: '#contact .c-ask' };
    const read = () => Object.fromEntries(Object.entries(sel).map(([k, s]) => { const e = document.querySelector(s); return [k, e ? Math.round(e.getBoundingClientRect().top * 10) / 10 : null] }));
    const out = { stops: st.slice(i14).map(s => s.id + '@' + s.y), moves: [] };
    const seg = st.slice(i14);
    for (let k = 0; k < seg.length - 1; k++) {
      const a = seg[k].y, b = seg[k + 1].y; const ref = (scrollTo(0, a), await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))), read());
      const moved = {};
      for (let y = a; y <= b; y += 40) { scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); const now = read(); for (const key in now) { const d = (now[key] ?? 0) - (ref[key] ?? 0); const vis = now[key] !== null && now[key] < innerHeight && now[key] > -innerHeight * 3; if (Math.abs(d) > 0.5) moved[key] = Math.round(Math.max(Math.abs(d), Math.abs(moved[key] || 0))) } }
      out.moves.push(seg[k].id + '→' + seg[k + 1].id + ' ' + (b - a) + 'px: ' + (Object.keys(moved).length ? JSON.stringify(moved) : 'nothing moves'));
    }
    return JSON.stringify(out);`)
  const o = JSON.parse(r)
  console.log(`${w}x${h}  stops ${o.stops.join(' ')}`)
  o.moves.forEach((m) => console.log('   ', m))
  p.ws.close()
}
process.exit(0)
