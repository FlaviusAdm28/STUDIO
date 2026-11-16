// S3–S10: the "stupid" cases — turning back mid-passage, keys, a jump then a stroke at once, someone else's scroll, a reload mid-page,
// an address, a chapter's title, a change of size mid-passage, the name field focused from the top
import { open, stroke, key, state, stuck, rest, check, sleep } from './h.mjs'
const URL = 'http://localhost:3100/?cenas=1'
let fails = 0
const report = async (p, name, want) => {
  await rest(p, 500, 7000)
  const s = await state(p)
  const st = await stuck(p)
  const c = check(s)
  const okStop = !want || s.cur === want
  const ok = c === 'ok' && !st.length && okStop
  if (!ok) fails++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(46)} → ${String(s.cur).padEnd(11)} y=${s.y} ${c}${okStop ? '' : ` (wanted ${want})`}${st.length ? ' STUCK ' + st.join(',') : ''}`)
  return s
}
const fresh = async (url = URL) => {
  const p = await open(url)
  await key(p, 'Shift')
  await sleep(900)
  return p
}
const go = (p, id, how = 'jump') => p.ev(`window.__cenas.go('${id}','${how}'); return 1`)
const half = (p, name, ms, way = 1) => // part of a stroke (its first ms), as a hand turning back
  (async () => {
    const { profile } = await import('./h.mjs')
    const t0 = Date.now()
    for (const [dt, dy] of profile(name)) {
      if (Date.now() - t0 > ms) return
      await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: p.w / 2, y: p.h / 2, deltaX: 0, deltaY: dy * way })
      await sleep(dt)
    }
  })()

let p = await fresh()
// S3 turning back mid-passage: the Work's blade (0.4 s in), the Method's light (0.6 s in)
await half(p, 'gentle300', 250)
await sleep(400)
await stroke(p, 'gentle300-up')
await report(p, 'Work passage ↓ then ↑ at 0.65 s', 'top')
await go(p, 'weddings')
await sleep(300)
await half(p, 'gentle300-up', 250)
await sleep(300)
await stroke(p, 'gentle300')
await report(p, 'Work passage ↑ then ↓ at 0.55 s', 'weddings')
await go(p, 'experiences')
await sleep(1500)
await half(p, 'gentle300', 250)
await sleep(600)
await stroke(p, 'gentle300-up')
await report(p, 'Method light ↓ then ↑ at 0.85 s', 'experiences')
// a stroke on during the light: no cut, no move seconds later
await half(p, 'gentle300', 250)
await sleep(500)
await stroke(p, 'gentle300')
await report(p, 'Method light ↓ then ↓ again at 0.75 s', '7')

// S4 keys
await go(p, 'top')
await sleep(500)
for (const [k, want] of [['PageDown', 'weddings'], ['ArrowDown', 'artists'], [' ', 'experiences'], ['PageDown', '7'], ['PageDown', '8a'], ['End', 'end'], ['PageUp', 'contact'], ['Home', 'top']]) {
  await key(p, k)
  await sleep(300)
  await report(p, `key ${k === ' ' ? 'Space' : k}`, want)
  await sleep(1500)
}
// S5 a jump from the menu, then a stroke at once (bug #7)
for (const [id, after, want] of [['method', 250, '8a'], ['about', 250, '13'], ['questions', 250, 'contact'], ['method', 700, '8a']]) {
  await go(p, 'top')
  await sleep(500)
  await p.ev(`document.querySelector('a[href="#${id}"]').click(); return 1`)
  await sleep(after)
  await stroke(p, 'gentle300')
  await report(p, `menu #${id}, stroke ${after} ms after`, want)
}
// S6 someone else's scroll (a scrollbar dragged, find in the page): onto the nearest stop, every scene in place
for (const y of [700, 3300, 6100, 8700, 11000]) {
  await p.ev(`scrollTo(0, ${y}); return 1`)
  await report(p, `scrollTo ${y}`)
}
// S7 a chapter's title within the Work (played) and an address (at once)
await go(p, 'weddings')
await sleep(2000)
await p.ev(`document.querySelector('#work a[href="#experiences"]')?.click(); return 1`)
await report(p, 'Work title → Experiences', 'experiences')
// S8 a change of size mid-passage
await go(p, 'top')
await sleep(500)
await half(p, 'gentle300', 250)
await sleep(300)
await p.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 760, deviceScaleFactor: 2, mobile: false })
p.w = 1280
p.h = 760
await sleep(1500)
await report(p, 'resize 1440×900 → 1280×760 mid-passage', 'weddings')
await stroke(p, 'gentle300')
await report(p, '… then a stroke', 'artists')
// S9 the name field focused from the top (Tab)
await go(p, 'top')
await sleep(800)
await p.ev(`document.querySelector('#m-name').focus(); return 1`)
await report(p, 'focus the name field from the top', '7')
p.ws.close()

// S10 reload mid-page, and an address arrived with
p = await fresh()
await go(p, '8b')
await sleep(1500)
await p.send('Page.reload')
await sleep(2500)
await report(p, 'reload at 8b')
p.ws.close()
p = await open(URL + '#about')
await sleep(2500)
await report(p, 'arrive with #about')
await stroke(p, 'gentle300')
await report(p, '… then a stroke')
p.ws.close()
console.log('fails', fails)
process.exit(0)
