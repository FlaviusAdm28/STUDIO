// The owner's own Chrome (the lab's windowed Chrome, CDP 9223), the owner's own trackpad: attaches to the localhost:3100 tab, records
// <s> seconds while the owner scrolls, and says where the screen went without a frame and what was happening then. Nothing is changed
// in the page but two listeners (the conductor's notes, the wheel's deltas) and a frame clock. Run it, then go to Chrome and scroll:
//   ~/.local/share/node22/bin/node docs/development/ios-lab/desk/cenas/owner-trace.mjs 40
import { writeFileSync, mkdirSync } from 'node:fs'
const S = Number(process.argv[2] || 40)
const PORT = process.env.PORT || 9223
const OUT = `${process.env.HOME}/.local/share/v5-lab/rec`
const list = await (await fetch(`http://localhost:${PORT}/json/list`)).json()
const tab = list.find((t) => t.type === 'page' && t.url.startsWith('http://localhost:3100'))
if (!tab) {
  console.log('No localhost:3100 tab in the lab Chrome (port', PORT + ').')
  process.exit(1)
}
const ws = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const wait = new Map()
const events = []
let done
const finished = new Promise((r) => (done = r))
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m)
    wait.delete(m.id)
  }
  if (m.method === 'Tracing.dataCollected') events.push(...m.params.value)
  if (m.method === 'Tracing.tracingComplete') done()
}
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    wait.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const ev = async (js) => (await send('Runtime.evaluate', { expression: `(()=>{${js}})()`, returnByValue: true })).result?.result?.value
await ev(`window.__ot={t0:performance.now(),notes:[],wheel:[],frames:[]};
  window.__vtMark=(s)=>window.__ot.notes.push([Math.round(performance.now()-window.__ot.t0),s]);
  addEventListener('wheel',(e)=>window.__ot.wheel.push([Math.round(performance.now()-window.__ot.t0),Math.round(e.deltaY)]),{capture:true,passive:true});
  let l=0;const f=(t)=>{if(l&&t-l>25)window.__ot.frames.push([Math.round(t-window.__ot.t0),Math.round(t-l),document.documentElement.dataset.pass||'']);l=t;if(performance.now()-window.__ot.t0<${S * 1000 + 2000})requestAnimationFrame(f)};requestAnimationFrame(f);
  let w=document.documentElement.dataset.pass; new MutationObserver(()=>{const n=document.documentElement.dataset.pass; if(n!==w){window.__ot.notes.push([Math.round(performance.now()-window.__ot.t0),'pass '+(n||'none')]); w=n}}).observe(document.documentElement,{attributes:true,attributeFilter:['data-pass']});
  return 1`)
await send('Tracing.start', {
  transferMode: 'ReportEvents',
  traceConfig: { includedCategories: ['viz', 'benchmark', 'disabled-by-default-devtools.timeline.frame', 'blink.user_timing'] },
})
// the trace's clock against the page's: a mark at a known page time
const markAt = await ev(`performance.mark('ot-sync'); return performance.now() - window.__ot.t0`)
console.log(`Recording ${S} s — go to Chrome now and scroll (in and out of the Work, back and forth).`)
await new Promise((r) => setTimeout(r, S * 1000))
await send('Tracing.end')
await finished
const page = await ev('return window.__ot')
mkdirSync(OUT, { recursive: true })
const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')
writeFileSync(`${OUT}/owner-trace-${stamp}.json`, JSON.stringify({ page, events }))
// the display's frames (viz: Display::DrawAndSwap), in the page's clock
const sync = events.find((e) => e.name === 'ot-sync')
const tStart = (sync?.ts ?? 0) - markAt * 1000
const draws = events.filter((e) => e.name === 'Display::DrawAndSwap').map((e) => (e.ts - tStart) / 1000).filter((t) => t >= 0).sort((a, b) => a - b)
const holes = []
for (let i = 1; i < draws.length; i++) if (draws[i] - draws[i - 1] > 50) holes.push([Math.round(draws[i - 1]), Math.round(draws[i] - draws[i - 1])])
const near = (t) => page.notes.filter(([n]) => Math.abs(n - t) < 400).map(([n, s]) => `${n}:${s.replace('cenas ', '')}`).join(' · ')
console.log(`\nScreen: ${draws.length} frames drawn in ${S} s; ${holes.length} holes > 50 ms (the screen frozen):`)
for (const [t, d] of holes.slice(0, 30)) console.log(`  ${t} ms: ${d} ms without a frame   ← ${near(t)}`)
// the compositor's own account of each frame: dropped, or drawn with content missing (not rasterized in time)
const reps = events.filter((e) => e.name === 'PipelineReporter' && e.args?.frame_reporter)
const bad = reps.filter((e) => /DROPPED/.test(e.args.frame_reporter.state) || e.args.frame_reporter.has_missing_content || e.args.frame_reporter.checkerboarded_needs_raster)
const states = {}
for (const e of reps) states[e.args.frame_reporter.state] = (states[e.args.frame_reporter.state] || 0) + 1
console.log('Compositor frames:', JSON.stringify(states), `· dropped or missing content: ${bad.length}`, bad.slice(0, 20).map((e) => `${Math.round((e.ts - tStart) / 1000)}${e.args.frame_reporter.has_missing_content ? 'm' : ''}${e.args.frame_reporter.checkerboarded_needs_raster ? 'r' : ''}`).join(' '))
console.log(`\nMain thread: ${page.frames.length} frames > 25 ms:`, JSON.stringify(page.frames.slice(0, 30)))
// the strokes: a pause over 300 ms between wheel events starts a new one
const strokes = []
let last = -1e9
for (const [t, d] of page.wheel) {
  if (t - last > 300) strokes.push([t, 0, 0])
  const s = strokes[strokes.length - 1]
  s[1] += 1
  s[2] += d
  last = t
}
console.log(`\nWheel: ${page.wheel.length} events in ${strokes.length} gestures (separated by 300 ms):`, strokes.map(([t, n, d]) => `${t}ms ${d > 0 ? '↓' : '↑'}${n}`).join(' '))
console.log(`\nThe conductor:`, page.notes.map(([t, s]) => `${t}:${s.replace('cenas ', '')}`).join(' · '))
console.log(`\nSaved: ${OUT}/owner-trace-${stamp}.json`)
ws.close()
process.exit(0)
