// The seam between the Work and the Method, frame by frame, in the lab's real Chrome (CDP 9223) with real trackpad strokes (bin/stroke):
// the page's own log of every frame (rAF) and every scroll event — the scroll, where the Method's section and its held stage are, the
// stage's position, the phase, the snapping, the Work's stage — so a frame or two that "does not belong" in a screen recording can be told
// by its cause. Usage: node seam.mjs "<plan>" <label> [site port]   plan as screen.mjs (d/u gentle300, D/U swipe800, then the ms to wait)
// Writes ~/.local/share/v5-lab/rec/seam/<label>.json and prints the frames where a held stage is not where it is held.
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
const [plan = 'd2600 d2600 d2600 d3800 u3200', label = 'seam', site = '3100'] = process.argv.slice(2)
const S = `${process.env.HOME}/.local/share/v5-lab`
mkdirSync(`${S}/rec/seam`, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const osa = (s) => execFileSync('osascript', ['-e', s]).toString().trim()
const LOGGER = `(() => {
  window.__seam = []; window.__scrolls = []; const t0 = performance.now(); window.__t0 = t0
  const rd = () => {
    const m = document.getElementById('method'), w = document.getElementById('work'), R = document.documentElement
    if (!m || !w) return null
    const ms = m.querySelector('.m-stage'), ws = w.querySelector('.w-stage')
    return [Math.round(scrollY), Math.round(m.getBoundingClientRect().top), Math.round(ms.getBoundingClientRect().top), getComputedStyle(ms).position[0],
      m.dataset.phase || '-', 'near' in m.dataset ? 1 : 0, getComputedStyle(R).scrollSnapType === 'none' ? 0 : 1, m.classList.contains('m-leaving') ? 1 : 0,
      Math.round(ws.getBoundingClientRect().top), w.dataset.ch ?? '-', R.dataset.passZone !== undefined ? 1 : 0,
      ...(() => { const a = document.getElementById('about'), as = a?.querySelector('.a-stage'); return a ? [Math.round(a.getBoundingClientRect().top), Math.round(as.getBoundingClientRect().top), getComputedStyle(as).position[0], a.dataset.phase || '-', a.classList.contains('a-leaving') ? 1 : 0, R.dataset.wheelHeld !== undefined ? 1 : 0] : [] })()]
  }
  const f = (t) => { const v = rd(); if (v) window.__seam.push([Math.round(t - t0), ...v]); requestAnimationFrame(f) }
  requestAnimationFrame(f)
  addEventListener('scroll', () => window.__scrolls.push([Math.round(performance.now() - t0), Math.round(scrollY)]), { passive: true, capture: true })
})()`
const tabs = await (await fetch('http://localhost:9223/json/list')).json()
const tab = tabs.find((t) => t.type === 'page' && /^http:\/\/localhost:31\d\d/.test(t.url))
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
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    wait.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const ev = async (js) => {
  const r = await send('Runtime.evaluate', { expression: js, returnByValue: true })
  return r.result?.result?.value
}
await send('Page.enable')
const { result } = await send('Page.addScriptToEvaluateOnNewDocument', { source: LOGGER })
await send('Page.navigate', { url: `http://localhost:${site}/?cenas=0` })
await fetch(`http://localhost:9223/json/activate/${tab.id}`)
const pid = execFileSync('cat', [`${S}/chrome.pid`]).toString().trim()
const proc = `(first process whose unix id is ${pid})`
osa(`tell application "System Events" to set frontmost of ${proc} to true`)
await sleep(3500)
const [wx, wy, ww, wh] = osa(`tell application "System Events" to tell ${proc} to get {position, size} of window 1`).split(', ').map(Number)
const at = [Math.round(wx + ww / 2), Math.round(wy + 87 + (wh - 87) * 0.42)]
osa(`tell application "System Events" to key code 56`)
await sleep(1500)
execFileSync(`${S}/bin/stroke`, [String(at[0]), String(at[1]), `${S}/strokes/empty`])
const strokes = []
for (const s of plan.split(/\s+/).filter(Boolean)) {
  const prof = { d: 'gentle300', u: 'gentle300-up', D: 'swipe800', U: 'swipe800-up' }[s[0]]
  if (prof) {
    strokes.push([await ev('Math.round(performance.now() - window.__t0)'), s[0]])
    execFileSync(`${S}/bin/stroke`, [String(at[0]), String(at[1]), `${S}/strokes/${prof}`])
  }
  await sleep(Number(s.slice(1)) || 0)
}
const seam = await ev('window.__seam')
const scrolls = await ev('window.__scrolls')
const H = await ev('innerHeight')
// the stops (every [data-stop] mark, by its place on the page) and, for each stroke, the one the page rests on just before the next stroke
const marks = await ev(`[...document.querySelectorAll('[data-stop]')].map(m => [m.dataset.stop, Math.round(m.getBoundingClientRect().top + scrollY)]).sort((a, b) => a[1] - b[1])`)
const ends = strokes.map((_, i) => (i + 1 < strokes.length ? strokes[i + 1][0] - 80 : seam[seam.length - 1][0]))
const restsOn = ends.map((t) => {
  const row = [...seam].reverse().find((r) => r[0] <= t)
  const y = row?.[1] ?? -1
  if (y < 2) return 'top'
  const m = marks.filter(([, at]) => Math.abs(at - y) <= 2).map(([s]) => s)
  return m.length ? m.join('/') : `y${y}`
})
console.log('rests on: ' + strokes.map(([, k], i) => `${k}:${restsOn[i]}`).join(' '))
await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: result.identifier })
ws.close()
writeFileSync(`${S}/rec/seam/${label}.json`, JSON.stringify({ plan, site, H, strokes, cols: ['t', 'y', 'mTop', 'stageTop', 'pos', 'phase', 'near', 'snap', 'leaving', 'wStageTop', 'ch', 'passZone', 'aTop', 'aStageTop', 'aPos', 'aPhase', 'aLeaving', 'wheelHeld'], seam, scrolls }))
// a held stage out of its place: the Method's stage seen (lit, not 'pre' or going back) but not at the screen's top; the Work's stage not at
// the top while the Method's section is still below the screen's top (Experiences shown)
// (only while the Method's section still covers the screen: past its end, at 11, its stage leaves with the page as it should)
const odd = seam.filter(([, , mTop, stageTop, , phase, , , , wTop]) => (phase !== 'pre' && phase !== '-' && mTop + 6.2 * H > H && Math.abs(stageTop) > 1) || (mTop > 0 && mTop < H && Math.abs(wTop) > 1))
console.log(`${label}: ${seam.length} frames, ${scrolls.length} scroll events, H ${H}; strokes at ${strokes.map((s) => s[0] + s[1]).join(' ')}`)
console.log(`frames with a held stage out of place: ${odd.length}`)
for (const r of odd.slice(0, 40)) console.log('  ' + r.join(' '))
