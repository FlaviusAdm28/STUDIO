// The whole page at rest, stop by stop (every [data-stop] mark, top to bottom, reached one after the other), at one viewport: the words
// that run into other words, the words under the bar's islands, the words cut by the screen's edges, a horizontal overflow; a screenshot
// of each stop. Usage: node pprobe.mjs <W> <H> <outdir> [url]   (PORT = the headless Chrome's CDP port)
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

const CHECK = `
const Wv = innerWidth, Hv = innerHeight
const vis = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.contentVisibility === 'hidden') return 0; o *= parseFloat(cs.opacity) } return o }
const name = (el) => { const s = el.closest('section,header,footer,nav,[id]'); const c = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : ''; return (s?.id ? '#' + s.id + ' ' : '') + el.tagName.toLowerCase() + c }
// the words: each element's own text, by its lines' boxes
const words = []
const force = document.createElement('style'); force.textContent = '*{pointer-events:auto!important}'; document.head.append(force)
const opaque = (e) => { if (/^(IMG|PICTURE|VIDEO|CANVAS|svg)$/i.test(e.tagName)) return true; const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return true; const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/); if (!m) return false; const p = m[1].split(',').map(Number); return (p[3] ?? 1) >= 0.85 }
const seenAt = (el, b) => { const x = (b.left + b.right) / 2, y = (b.top + b.bottom) / 2; if (x < 0 || y < 0 || x >= Wv || y >= Hv) return true; for (const e of document.elementsFromPoint(x, y)) { if (e === el || el.contains(e)) return true; if (e.contains(el)) return true; if (vis(e) > 0.5 && opaque(e)) return false } return true }
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
for (let t = walker.nextNode(); t; t = walker.nextNode()) {
  if (!t.textContent.trim()) continue
  const el = t.parentElement
  if (!el || el.closest('script,style,noscript,.m-scr,.m-sheet,.m-cv,.menu,.sr-only,.visually-hidden,.m-title,.m-label,.w-w,.w-mo-h')) continue
  const o = vis(el)
  if (o < 0.15) continue
  const r = document.createRange(); r.selectNodeContents(t)
  for (const b of r.getClientRects()) {
    if (b.width < 2 || b.height < 2) continue
    if (b.right < 0 || b.left > Wv || b.bottom < 0 || b.top > Hv) continue
    // a box clipped away by an ancestor (overflow hidden) is not seen
    let clipped = false
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.overflow !== 'visible' || cs.clipPath !== 'none') { const ar = a.getBoundingClientRect(); if (b.bottom <= ar.top || b.top >= ar.bottom || b.right <= ar.left || b.left >= ar.right) { clipped = true; break } } }
    if (clipped || !seenAt(el, b)) continue
    words.push({ el, o: +o.toFixed(2), b: [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)], t: t.textContent.trim().slice(0, 24) })
  }
}
force.remove()
const inter = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]))
const out = { y: Math.round(scrollY), overflowX: document.documentElement.scrollWidth - Wv, clash: [], bar: [], cut: [] }
const barEls = [...document.querySelectorAll('.bar-isl')].filter(e => vis(e) > 0.5).map(e => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom] })
for (let i = 0; i < words.length; i++) {
  const a = words[i]
  const inBar = a.el.closest('.bar, .site-header')
  if (!inBar) for (const b of barEls) if (inter(a.b, b) > 20) out.bar.push(name(a.el) + ' "' + a.t + '"')
  if (!inBar && (a.b[0] < -1 || a.b[2] > Wv + 1 || a.b[1] < -1 || a.b[3] > Hv + 1)) out.cut.push(name(a.el) + ' "' + a.t + '" ' + a.b.join(','))
  for (let j = i + 1; j < words.length; j++) {
    const b = words[j]
    if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue
    if (inBar || b.el.closest('.bar, .site-header')) continue
    if (a.el.closest('p') && a.el.closest('p') === b.el.closest('p')) continue
    const area = inter(a.b, b.b)
    if (area > 0.15 * Math.min((a.b[2] - a.b[0]) * (a.b[3] - a.b[1]), (b.b[2] - b.b[0]) * (b.b[3] - b.b[1]))) out.clash.push(name(a.el) + ' "' + a.t + '" (' + a.o + ') × ' + name(b.el) + ' "' + b.t + '" (' + b.o + ')')
  }
}
out.clash = [...new Set(out.clash)].slice(0, 6); out.bar = [...new Set(out.bar)].slice(0, 4); out.cut = [...new Set(out.cut)].slice(0, 4)
return out
`
// the entrance completed, then every stop in order
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await sleep(3500)
const stops = await ev(`return [...document.querySelectorAll('[data-stop]')].map(m => [m.dataset.stop, Math.round(m.getBoundingClientRect().top + scrollY)]).sort((a, b) => a[1] - b[1]).map(s => s[0])`)
const lines = []
const seen = new Set()
for (const s of ['top', ...stops]) {
  if (seen.has(s) || !s) continue
  seen.add(s)
  if (s !== 'top') {
    await ev(`const m = [...document.querySelectorAll('[data-stop]')].find(m => m.dataset.stop === '${s}'); scrollTo({ top: scrollY + m.getBoundingClientRect().top, behavior: 'instant' }); return 1`)
    await sleep(3200)
  }
  const r = await ev(CHECK)
  if (typeof r !== 'object') { lines.push(`${s}: ${r}`); continue }
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 })
  writeFileSync(`${OUT}/${W}x${H}-${s}.jpg`, Buffer.from(shot.result.data, 'base64'))
  const bits = []
  if (r.overflowX > 0) bits.push(`OVERFLOW-X ${r.overflowX}px`)
  if (r.clash.length) bits.push(`words over words: ${r.clash.join(' | ')}`)
  if (r.bar.length) bits.push(`under the bar: ${r.bar.join(' | ')}`)
  if (r.cut.length) bits.push(`cut by the screen: ${r.cut.join(' | ')}`)
  lines.push(`${W}x${H} ${s.padEnd(11)} ${bits.join(' ;; ') || 'clear'}`)
}
console.log(lines.join('\n'))
ws.close()
await fetch(`http://localhost:${PORT}/json/close/${tab.id}`)
