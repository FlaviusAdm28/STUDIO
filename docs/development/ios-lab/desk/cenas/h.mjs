// CDP helpers for the conductor's battery (headless or windowed Chrome)
import { readFileSync } from 'node:fs'
export const PORT = process.env.PORT || 9333
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const STROKES = `${process.env.HOME}/.local/share/v5-lab/strokes`

export async function open(url, { w = 1440, h = 900 } = {}) {
  const t = await (await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' })).json()
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
  const ev = async (js) => {
    const r = await send('Runtime.evaluate', { expression: `(async()=>{${js}})()`, awaitPromise: true, returnByValue: true })
    return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: false })
  // the conductor's notes and the long frames, from the first script on
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__notes=[];window.__t0=performance.now();window.__vtMark=(s)=>window.__notes.push([Math.round(performance.now()-window.__t0),s]);
      window.__long=[];(()=>{let l=0;const f=(t)=>{if(l&&t-l>50)window.__long.push([Math.round(t-window.__t0),Math.round(t-l)]);l=t;requestAnimationFrame(f)};requestAnimationFrame(f)})();`,
  })
  await send('Page.navigate', { url })
  await sleep(1500)
  const page = { ws, send, ev, w, h }
  return page
}

// a stroke from a lab profile ("dt dy phase" per line), as wheel events at the window's middle; way -1 flips it
export const profile = (name) =>
  readFileSync(`${STROKES}/${name}`, 'utf8')
    .trim()
    .split('\n')
    .map((l) => l.split(' '))
    .map(([dt, dy]) => [Number(dt), Number(dy)])
export async function stroke(p, name = 'swipe300', way = 1) {
  for (const [dt, dy] of profile(name)) {
    await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: p.w / 2, y: p.h / 2, deltaX: 0, deltaY: dy * way })
    await sleep(dt)
  }
}
// a stroke sent without waiting for its momentum to end (for chains): the events keep coming in the background
export function strokeAsync(p, name = 'swipe300', way = 1) {
  return stroke(p, name, way)
}
export const key = (p, k, code = k) =>
  p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: { PageDown: 34, PageUp: 33, End: 35, Home: 36, ' ': 32, ArrowDown: 40, ArrowUp: 38, Shift: 16 }[k] ?? 0 }).then(() =>
    p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code }),
  )

export const STATE = `const R=document.documentElement, w=document.getElementById('work'), m=document.getElementById('method'), a=document.getElementById('about');
  return {y:Math.round(scrollY), cur: window.__cenas?.current?.() ?? null, gl: !!window.__cenas?.gliding?.(), pass:R.dataset.pass||'', ch:w?.dataset.ch, mp:m?.dataset.phase, ap:a?.dataset.phase, ent:R.dataset.entrance||'', jump: R.dataset.jump ?? null}`
export const state = (p) => p.ev(STATE)
// animations left paused halfway (a scene stuck): finite, paused, neither at their start nor their end
export const STUCK = `return document.getAnimations().filter(a=>{const t=a.effect?.getComputedTiming?.(); if(!t||!isFinite(t.endTime)||a.playState!=='paused')return false; const c=Number(a.currentTime??0); return c>1 && c<t.endTime-1}).map(a=>(a.effect.target?.className||a.effect.target?.tagName||'?')+'@'+Math.round(a.currentTime)+'/'+Math.round(a.effect.getComputedTiming().endTime))`
export const stuck = (p) => p.ev(STUCK)
// at rest: the page still and no finite animation running for `quiet` ms (or `max` ms in all)
export const rest = (p, quiet = 400, max = 9000) =>
  p.ev(`return new Promise((ok)=>{const t0=performance.now();let y=scrollY,since=performance.now();const f=()=>{const now=performance.now();const run=document.getAnimations().some(a=>a.playState==='running'&&isFinite(a.effect?.getComputedTiming?.().endTime));if(Math.abs(scrollY-y)>0.5||run||window.__cenas?.gliding?.()){since=now;y=scrollY}if(now-since>${quiet}||now-t0>${max})ok(Math.round(now-t0));else requestAnimationFrame(f)};f()})`)
export const notes = (p, from = 0) => p.ev(`return window.__notes.slice(${from})`)
// what the stop should show (the scenes' states)
export const expected = (stop) => {
  const work = ['top', 'weddings', 'artists', 'experiences']
  const method = ['7', '8a', '8b', '8c', '9', '10', '11']
  // the About (step 3, 21 Nov): its own phase at 12–14, 14 below them (the Questions' paper rises over it), unseen above
  const about = ['12', '13', '14']
  const i = work.indexOf(stop)
  if (i === 0) return { pass: '', ch: '0', mp: 'pre', ap: 'pre' }
  if (i > 0) return { pass: 'done', ch: String(i - 1), mp: 'pre', ap: 'pre' }
  if (method.includes(stop)) return { pass: 'done', ch: '2', mp: stop, ap: 'pre' }
  if (about.includes(stop)) return { pass: 'done', ch: '2', mp: '11', ap: stop }
  return { pass: 'done', ch: '2', mp: '11', ap: '14' }
}
export const check = (s) => {
  const e = expected(s.cur)
  const bad = Object.entries(e).filter(([k, v]) => s[k] !== v)
  return bad.length ? bad.map(([k, v]) => `${k}=${s[k]}≠${v}`).join(' ') : 'ok'
}
