// The Method's layout at rest, phase by phase, at one viewport: every card's real outline (rotation and scale counted) against the
// thesis, Make it yours and the bar's islands; screenshots of each phase. Usage: node mprobe.mjs <W> <H> <outdir> [url]
import { writeFileSync, mkdirSync } from 'node:fs'
const [, , W, H, OUT, URL = 'http://localhost:3100/'] = process.argv
mkdirSync(OUT, { recursive: true })
const PORT = process.env.PORT || 9333
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const tab = await (await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m)
    wait.delete(m.id)
  }
}
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (js) => {
  const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })
  return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description
}
const mobile = +W < 900 && +H > +W
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile })
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true })
await send('Page.navigate', { url: URL })
await sleep(3500)
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await sleep(3500)

const MEASURE = `
const sec = document.getElementById('method'), Wv = innerWidth, Hv = innerHeight
const op = (el) => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o }
const about = (el) => { const cs = getComputedStyle(el); const m = new DOMMatrix(cs.transform === 'none' ? undefined : cs.transform); const [ox, oy] = cs.transformOrigin.split(' ').map(parseFloat); return new DOMMatrix().translate(ox, oy).multiply(m).translate(-ox, -oy) }
const quad = (M, w, h) => [[0,0],[w,0],[w,h],[0,h]].map(([x,y]) => { const p = M.transformPoint(new DOMPoint(x,y)); return [Math.round(p.x), Math.round(p.y)] })
const R = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)] }
const box = sec.querySelector('.m-screens').getBoundingClientRect()
const cards = [...sec.querySelectorAll('.m-card')].filter(c => getComputedStyle(c).display !== 'none').map(c => {
  const Mc = new DOMMatrix().translate(box.left, box.top).multiply(about(c))
  const sh = c.querySelector('.m-sheet')
  let sheet = null
  if (sh && getComputedStyle(sh).display !== 'none') {
    const Ms = Mc.translate(sh.offsetLeft, sh.offsetTop).multiply(about(sh))
    sheet = { q: quad(Ms, sh.offsetWidth, sh.offsetHeight), o: +(op(c) * parseFloat(getComputedStyle(sh).opacity)).toFixed(2) }
  }
  return { k: c.dataset.k, q: quad(Mc, c.offsetWidth, c.offsetHeight), o: +op(c).toFixed(2), sheet, cover: c.classList.contains('is-cover') }
})
const head = sec.querySelector('.m-head')
const lines = [...sec.querySelector('.m-thesis').children].map(R)
const field = { label: R(sec.querySelector('.m-field label')), input: R(sec.querySelector('.m-in')), o: +op(sec.querySelector('.m-field')).toFixed(2) }
const lineBox = (el) => { if (!el) return null; const r = document.createRange(); r.selectNodeContents(el); const bs = [...r.getClientRects()].filter(b => b.width > 1); if (!bs.length) return null; return [Math.round(Math.min(...bs.map(b => b.left))), Math.round(Math.min(...bs.map(b => b.top))), Math.round(Math.max(...bs.map(b => b.right))), Math.round(Math.max(...bs.map(b => b.bottom)))] }
const end = ['.m-close', '.m-steps', '.m-cta'].map(s => lineBox(sec.querySelector(s)))
const bar = ['.bar-left', '.bar-right'].map(s => R(document.querySelector(s)))
return { W: Wv, H: Hv, phase: sec.dataset.phase, y: Math.round(scrollY), headO: +op(head).toFixed(2), lines, field, cards, end, endO: +op(sec.querySelector('.m-end')).toFixed(2), bar }
`
await ev(`document.querySelector('.bar-menu').click(); return 1`)
await sleep(1500)
await ev(`document.querySelector('.menu a[href="#method"]').click(); return 1`)
await sleep(4500)
const phases = ['7', '8a', '8b', '8c', '9', '10', '11']
const all = []
for (const ph of phases) {
  const got = await ev(`const m = [...document.querySelectorAll('#method .m-snap')].find(m => m.dataset.stop === '${ph}'); if (!m) return 'no mark'; scrollTo({ top: scrollY + m.getBoundingClientRect().top, behavior: 'instant' }); return 'ok'`)
  await sleep(ph === '7' ? 4200 : 2600)
  const m = await ev(MEASURE)
  if (typeof m !== 'object') { console.log(ph, got, m); continue }
  all.push(m)
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 })
  writeFileSync(`${OUT}/${W}x${H}-${ph}.jpg`, Buffer.from(s.result.data, 'base64'))
}
writeFileSync(`${OUT}/${W}x${H}.json`, JSON.stringify(all))

// --- the checks ---
const rectQ = ([l, t, r, b]) => [[l, t], [r, t], [r, b], [l, b]]
const axes = (q) => q.map((p, i) => { const n = q[(i + 1) % q.length]; return [-(n[1] - p[1]), n[0] - p[0]] })
const overlap = (a, b) => {
  for (const [ax, ay] of [...axes(a), ...axes(b)]) {
    const pa = a.map(([x, y]) => x * ax + y * ay), pb = b.map(([x, y]) => x * ax + y * ay)
    if (Math.max(...pa) <= Math.min(...pb) || Math.max(...pb) <= Math.min(...pa)) return false
  }
  return true
}
const pad = ([l, t, r, b], p) => [l - p, t - p, r + p, b + p]
const out = []
for (const m of all) {
  const issues = []
  const words = m.headO > 0.05 && m.phase !== '9'
  for (const c of m.cards) {
    if (c.o < 0.05) continue
    const ys = c.q.map((p) => p[1]), xs = c.q.map((p) => p[0])
    if (words && m.field.o > 0.05) {
      for (const [nm, r] of [['label', m.field.label], ['field', m.field.input]]) if (r && overlap(c.q, rectQ(pad(r, 6)))) issues.push(`${c.k} over ${nm}`)
      m.lines.forEach((r, i) => r && overlap(c.q, rectQ(r)) && issues.push(`${c.k} over thesis line ${i + 1}`))
    }
    if (c.sheet && c.sheet.o > 0.05 && words) {
      for (const [nm, r] of [['label', m.field.label], ['field', m.field.input]]) if (r && overlap(c.sheet.q, rectQ(pad(r, 6)))) issues.push(`${c.k}'s sheet over ${nm}`)
    }
    if (Math.max(...ys) > m.H + 2) issues.push(`${c.k} cut at the foot by ${Math.max(...ys) - m.H}px`)
    if (Math.min(...ys) < -2) issues.push(`${c.k} cut at the top by ${-Math.min(...ys)}px`)
    if (Math.min(...xs) < -2 || Math.max(...xs) > m.W + 2) issues.push(`${c.k} cut at a side`)
    if (c.o > 0.3) for (const b of m.bar) if (b && overlap(c.q, rectQ(b))) issues.push(`${c.k} under the bar`)
    if (m.phase === '11' && m.endO > 0.5) m.end.forEach((r, i) => r && overlap(c.q, rectQ(pad(r, 8))) && issues.push(`${c.k} over ${['the close', 'the steps', 'Talk to us'][i]}`))
  }
  if (words) {
    const foot = Math.max(m.field.label?.[3] ?? 0, m.field.input?.[3] ?? 0)
    const tops = m.cards.filter((c) => c.o > 0.05).flatMap((c) => [Math.min(...c.q.map((p) => p[1])), ...(c.sheet && c.sheet.o > 0.05 ? [Math.min(...c.sheet.q.map((p) => p[1]))] : [])])
    const feet = m.cards.filter((c) => c.o > 0.05).map((c) => Math.max(...c.q.map((p) => p[1])))
    const gap = tops.length ? Math.min(...tops) - foot : null
    issues.push(`(gap field→cards ${gap}px, foot room ${m.H - Math.max(...feet)}px)`)
  }
  out.push(`${m.W}x${m.H} ${m.phase.padEnd(3)} ${issues.join('; ') || 'clear'}`)
}
console.log(out.join('\n'))
ws.close()
await fetch(`http://localhost:${PORT}/json/close/${tab.id}`)
