// xiaomi-bugb.mjs (18 Nov): Experiences reached for the first time by touch strokes — does its moment move on (the piece, the next one)?
// The owner's iPhone: the Before stays and nothing runs until a moment is tapped. Read: data-m / data-demo over 7 s and the Method's top
const t = (await (await fetch('http://localhost:9222/json/list')).json()).find((x) => x.type === 'page' && x.url.startsWith('http://localhost:3100/'))
const ws = new WebSocket(t.webSocketDebuggerUrl)
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
const ev = async (js) => (await send('Runtime.evaluate', { expression: `(()=>{${js}})()`, returnByValue: true })).result?.result?.value
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await send('Page.navigate', { url: 'http://localhost:3100/?t=' + Date.now() })
await sleep(8000)
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] })
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
await sleep(4500)
const H = await ev('return innerHeight')
for (let i = 0; i < 3; i++) {
  await send('Input.synthesizeScrollGesture', { x: 120, y: Math.round(H * 0.75), yDistance: -300, speed: 1200, gestureSourceType: 'touch', preventFling: false })
  await sleep(2600)
}
for (const s of [0, 2, 4, 6]) {
  console.log(`+${s}s`, await ev(`const a = document.querySelector('.w-ch[data-c="experiences"]'); const m = document.getElementById('method'); return 'ch' + document.querySelector('.work').dataset.ch + ' m=' + a.dataset.m + ' demo=' + a.dataset.demo + ' methodTop=' + Math.round(m.getBoundingClientRect().top) + ' y=' + Math.round(scrollY)`))
  await sleep(2000)
}
ws.close()
