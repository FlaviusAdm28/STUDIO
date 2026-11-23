// xiaomi-11.mjs [label]: the Xiaomi's Chrome from the Method's 10 to its 11 (the dark coming in) — the screen recorded (adb screenrecord)
// and, in the page, every theme-color change (Chrome's bar is painted with it) and every frame over 20 ms; then Chrome's bar read from
// the recording frame by frame (its colour, and its steps). The owner, 23 Nov: "ao passar do 10 para o 11 também vejo um lagzinho ao mudar
// a cor da barra no chrome em mobile"
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
const label = process.argv[2] || 'x11'
// SITE: the port served (3100; another build beside it for a before and after, e.g. 3101)
const SITE = process.env.SITE || '3100'
// FROM and TO: the phases of the passage recorded (10 → 11 unless said)
const FROM = process.env.FROM || '10'
const TO = process.env.TO || '11'
const OUT = `${process.env.HOME}/.local/share/v5-lab/rec/xiaomi/${label}`
mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const adb = (...a) => execFileSync('adb', ['-s', 'c3e8fb35', ...a], { maxBuffer: 256 << 20 })
const tabs = await (await fetch('http://localhost:9222/json')).json()
const tab = tabs.find((t) => t.type === 'page' && /localhost:31\d\d/.test(t.url)) ?? tabs.find((t) => t.type === 'page')
// the tab driven must be the one shown: a tab in the background runs no frames
await fetch(`http://localhost:9222/json/activate/${tab.id}`)
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
    wait.set(++id, r)
    ws.send(JSON.stringify({ id, method, params }))
  })
const ev = async (js) => (await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })).result?.result?.value
await send('Page.navigate', { url: `http://localhost:${SITE}/?t=${Date.now()}` })
await sleep(6000)
const phase = () => ev(`return document.getElementById('method').dataset.phase`)
for (let i = 0; i < 160 && (await phase()) !== FROM; i++) {
  await ev(`scrollBy(0, innerHeight / 4);return 1`)
  await sleep(700)
}
await sleep(3000)
await ev(`window.__T=[];window.__F=[];const t0=performance.now();const meta=document.querySelector('meta[name="theme-color"]');new MutationObserver(()=>window.__T.push([Math.round(performance.now()-t0),meta.content])).observe(meta,{attributes:true});let l=0;const f=(t)=>{if(l&&t-l>20)window.__F.push([Math.round(t-t0),Math.round(t-l)]);l=t;requestAnimationFrame(f)};requestAnimationFrame(f);window.__t0=t0;return 1`)
const rec = spawn('adb', ['-s', 'c3e8fb35', 'shell', 'screenrecord', '--time-limit', '7', '/sdcard/x11.mp4'])
await sleep(1200)
const at = await ev(`return Math.round(performance.now()-window.__t0)`)
for (let i = 0; i < 12 && (await phase()) !== TO; i++) {
  await ev(`scrollBy(0, innerHeight / 4);return 1`)
  await sleep(250)
}
await new Promise((r) => rec.on('exit', r))
const page = await ev(`return {T: window.__T, F: window.__F}`)
writeFileSync(`${OUT}/page.json`, JSON.stringify({ at, ...page }))
writeFileSync(`${OUT}/screen.mp4`, adb('exec-out', 'cat', '/sdcard/x11.mp4'))
console.log(`scroll to ${TO} at ${at} ms; theme-color changes: ${page.T.length}`)
console.log('  ', page.T.map(([t, c]) => `${t}:${c}`).join(' '))
console.log(`frames over 20 ms: ${page.F.length}`, page.F.map(([t, d]) => `${t}:${d}`).join(' '))
console.log(OUT)
ws.close()
process.exit(0)
