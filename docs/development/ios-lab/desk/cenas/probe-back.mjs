// The Method's light going back (7 → Experiences) and a stroke on to Artists while it closes: where the Method's stage is, frame by frame
// (its box, fixed or not, the light's width on screen), around the page's move. 17 Nov: the light vanished in one frame in both browsers.
//   node probe-back.mjs [ms between the two strokes up]
import { open, sleep } from './h.mjs'
const gap = Number(process.argv[2] ?? 300)
const p = await open('http://localhost:3100/?cenas=1')
const key = async (k) => {
  await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: k })
  await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k })
}
await sleep(1500)
await key('Enter')
await sleep(5500)
for (const w of [3000, 1600, 1600, 3800]) {
  await key('PageDown')
  await sleep(w)
}
console.log('at', await p.ev(`return __cenas.current()`))
// a tape of every frame: the stage's box, its fixed place, the light's opacity and clip
await p.ev(`
  const s = document.querySelector('#method .m-stage') || document.querySelector('#method [class*=stage]')
  const sec = document.getElementById('method')
  window.__tape = []
  const t0 = performance.now()
  const f = () => {
    const r = s.getBoundingClientRect()
    window.__tape.push([Math.round(performance.now() - t0), __cenas.current(), Math.round(r.top), Math.round(sec.getBoundingClientRect().top), s.style.top, sec.classList.contains('m-leaving') ? 'fixed' : '-', sec.dataset.phase, Math.round(scrollY)])
    if (performance.now() - t0 < 1500) requestAnimationFrame(f)
  }
  requestAnimationFrame(f)
  return s.className`)
await key('PageUp')
await sleep(gap)
await key('PageUp')
await sleep(1400)
const tape = await p.ev(`return window.__tape`)
let last = ''
for (const r of tape) {
  const k = r.slice(1).join(' ')
  if (k !== last) console.log(r.join('  '))
  last = k
}
p.ws.close()
