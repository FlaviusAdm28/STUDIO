/*
  The scroll motor — a desktop's one driver of the page (prototype, behind `?motor`; docs/development/v5-scroll-options.md §5–6).

  Why: the browser moved the page with a trackpad's momentum that only it controls, and the site braked it afterwards — overflow holds, the
  snapping turned on and off, corrections by scrollTo, holds by the clock. Every brake met the others in a fast scroll; one of them crashed
  Safari (15 Nov). Here the browser never moves the page on a desktop: every wheel and scrolling key is cancelled from a stroke's first event
  (both Chrome and Safari then let the rest of the stroke be cancelled), and the motor glides the page itself from stop to stop. A stroke is a
  signal, "onwards" or "back"; what is left of its momentum is ignored.

  The stops are the sections' own marks (the same the snapping used: `.w-pass-snap, .m-snap, .a-snap` that snap); the sections choose their
  scene by where the page is, as they always have, and play it by their clock. So the approved animations are untouched: the motor only puts
  the page on a stop and waits while a scene plays (the sections' own flags: the entrance running, the Work's passage, the Method's and the
  About's passages, the Contact's light).

  Fast scrolling (owner, 15 Nov: rule b): a stroke is one stop, and strokes that come while the page glides carry it on, one stop more
  each — but the page always stops at a barrier, the start of each chapter (the top, Weddings, the Method's 7, the About's 12, the
  Questions, the Contact). Scenes passed on the way show their own end state (the sections already do, as with a jump).

  Phones and tablets are left to the browser's own scrolling (the owner, 15 Nov: "the scroll on mobile Safari felt really good").
*/
import { cenasOn } from './conductor'

const SNAPS = '.w-pass-snap, .m-snap, .a-snap'
// a new stroke: the wheel quiet this long, the other way round, or a clear new push inside a momentum (finger.ts, measured 14–15 Nov)
const GAP = 300
// the glide: its length grows a little with the distance, an even ease in and out
const glideMs = (d: number) => Math.min(1050, Math.max(620, 520 + 0.22 * d))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3
// a scene that never says it has ended does not hold the page longer than this
const BUSY_MAX = 4500

let on = false
export const motorOn = () => on

type Stop = { y: number; barrier: boolean; el: HTMLElement | null }
const stops = (): Stop[] => {
  const root = document.documentElement
  const y0 = scrollY
  const seen = new Map<number, Stop>()
  // every mark that is laid out, whatever the snapping says now: the sections turn marks off while a scene plays, a brake for the browser's
  // snapping (method.css data-passage, data-c-hold) — read here, a strong stroke from the About's 12 stopped at 14, the Questions' stop off
  const marks = [...document.querySelectorAll<HTMLElement>(SNAPS)].filter((el) => el.getClientRects().length > 0)
  const below = marks.filter((el) => el.dataset.at === 'below')
  for (const el of marks) {
    const y = Math.round(el.getBoundingClientRect().top + y0)
    const at = el.dataset.at
    // the chapters' starts: the top, Weddings, the Method's 7, the About's 12, then the Questions and the Contact (the About's marks below it)
    const barrier = at === 'top' || at === 'weddings' || at === '7' || at === '12' || el === below[0] || el === below[1]
    const was = seen.get(y)
    seen.set(y, { y, barrier: barrier || !!was?.barrier, el: was?.el ?? el })
  }
  const end = Math.round(root.scrollHeight - innerHeight)
  if (![...seen.keys()].some((y) => Math.abs(y - end) < 3)) seen.set(end, { y: end, barrier: false, el: null })
  return [...seen.values()].sort((a, b) => a.y - b.y)
}

const busySince = { at: 0 }
const sceneBusy = () => {
  const root = document.documentElement
  const method = document.getElementById('method')
  const about = document.getElementById('about')
  return (
    root.dataset.entrance === 'run' ||
    root.dataset.pass === 'on' ||
    (!!method && 'passage' in method.dataset) ||
    (!!about && 'passage' in about.dataset) ||
    'cRun' in root.dataset
  )
}
// On a barrier the page rests at least this long before a stroke moves it on: the scene there plays whole. Its own flag came a moment after
// the page arrived, and the owner's fast chain went on through the Method's 7 the very frame it landed (lab, 15 Nov: 2834 → 8012, no rest at
// 7). Only at the six barriers: elsewhere a stroke that comes is taken at once
const BARRIER_MS = 1200
let restUntil = 0
const busy = (now: number) => {
  if (now < restUntil) return true
  if (!sceneBusy()) {
    busySince.at = 0
    return false
  }
  if (!busySince.at) busySince.at = now
  return now - busySince.at < BUSY_MAX
}

// ---- the glide ----
let raf = 0
let gliding = false
let target: Stop | null = null
let from = 0
let startAt = 0
let dur = 0
let curve = ease
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const place = (y: number) => scrollTo({ top: y, behavior: 'instant' })
const frame = (now: number) => {
  raf = 0
  if (!gliding || !target) return
  const t = Math.min(1, (now - startAt) / dur)
  place(from + (target.y - from) * curve(t))
  if (t < 1) raf = requestAnimationFrame(frame)
  else {
    gliding = false
    land(target)
  }
}
// On the mark exactly, measured again with the page beside it, and never short of it: the sections choose a scene by the page being on or
// past its mark, and a mark measured from far away came out half a pixel off — the page rested 1 px short (Chrome, 15 Nov: 2732 for 2733)
const land = (s: Stop) => {
  let y = s.y
  if (s.el) y = Math.ceil(scrollY + s.el.getBoundingClientRect().top - 0.01)
  y = Math.min(y, Math.round(document.documentElement.scrollHeight - innerHeight))
  if (Math.abs(scrollY - y) >= 0.5) place(y)
  target = { ...s, y }
  if (s.barrier) restUntil = performance.now() + BARRIER_MS
}
// the Work's passage between the top and Weddings is its own: the page goes there at once, unseen — the entrance and the stage are held on
// screen and the passage plays by its clock (work-client.tsx)
const passageStop = (a: number, b: number, list: Stop[]) => {
  const top = list[0]?.y ?? 0
  const weddings = list.find((s) => s.barrier && s.y > top + 2)?.y
  return weddings !== undefined && Math.min(a, b) <= top + 2 && Math.max(a, b) <= weddings + 2
}
const glideTo = (s: Stop, list: Stop[], again = false) => {
  const y = scrollY
  target = s
  if (Math.abs(s.y - y) < 1) {
    gliding = false
    return
  }
  if (reduce() || passageStop(y, s.y, list)) {
    gliding = false
    cancelAnimationFrame(raf)
    raf = 0
    place(s.y)
    land(s)
    return
  }
  from = y
  startAt = performance.now()
  dur = glideMs(Math.abs(s.y - y))
  // carried on by another stroke mid-glide: from where it is, already moving — no second ease in
  curve = again ? easeOut : ease
  gliding = true
  if (!raf) raf = requestAnimationFrame(frame)
}

// ---- strokes ----
const nextFrom = (y: number, way: number, list: Stop[]) => (way > 0 ? list.find((s) => s.y > y + 2) : [...list].reverse().find((s) => s.y < y - 2))
const nextBarrier = (y: number, way: number, list: Stop[]) => {
  const ahead = way > 0 ? list.filter((s) => s.y > y + 2) : [...list].reverse().filter((s) => s.y < y - 2)
  return ahead.find((s) => s.barrier) ?? ahead[ahead.length - 1]
}
let glideWay = 0
// the lab's tape (vtape.js), when it runs: each decision of the motor, for the tests
const note = (s: string) => (window as unknown as { __vtMark?: (s: string) => void }).__vtMark?.('motor ' + s)
const stroke = (way: number, strong: boolean, now: number) => {
  if (busy(now)) {
    note(`${way} ${strong ? 'strong ' : ''}busy`)
    return
  }
  const list = stops()
  note(`${way} ${strong ? 'strong ' : ''}${gliding ? 'gliding→' + target?.y : 'at ' + Math.round(scrollY)}`)
  if (gliding && target && way === glideWay) {
    // carried on: one stop more, never past a barrier
    if (target.barrier) return
    const next = strong ? nextBarrier(target.y, way, list) : nextFrom(target.y, way, list)
    if (next) glideTo(next, list, true)
    return
  }
  // from where the page is (or, turned back mid-glide, from where it is now)
  const y = gliding ? scrollY : (target && Math.abs(target.y - scrollY) < 3 ? target.y : scrollY)
  const next = strong ? nextBarrier(y, way, list) : nextFrom(y, way, list)
  glideWay = way
  if (next) glideTo(next, list, gliding)
}

let wheelAt = -1e9
let wheelWay = 0
let wheelPeak = 0
let wheelPrev = 0
const onWheel = (e: WheelEvent) => {
  const root = document.documentElement
  // a pinch (zoom) or a sideways swipe (back / forward in the history) is the browser's; the menu holds the page by itself (bar-client.tsx)
  if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || root.dataset.menu) return
  if (e.cancelable) e.preventDefault()
  if (!e.deltaY) return
  const now = performance.now()
  const px = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1
  const a = Math.abs(e.deltaY * px)
  const way = Math.sign(e.deltaY)
  const fresh = now - wheelAt > GAP || (a > 3 && way !== wheelWay) || (a > 15 && a > 2.5 * wheelPrev && wheelPrev < 0.4 * wheelPeak)
  wheelAt = now
  if (a > 3) wheelWay = way
  if (fresh) wheelPeak = 0
  wheelPeak = Math.max(wheelPeak, a)
  if (fresh || a > 3 || way === wheelWay) wheelPrev = a
  // How strong a stroke is cannot be read from its events: macOS accelerates strokes that follow one another, and the same 300 px stroke
  // reached the page with events of 300 and of 760–1455 px, in Safari and Chrome alike (lab, 15 Nov). So a stroke is one stop; it is the
  // strokes that come while the page still glides that carry it on — fast scrolling goes fast, and stops at the barriers
  if (fresh) stroke(way, false, now)
}

const KEYS: Record<string, number> = { PageDown: 1, PageUp: -1, ArrowDown: 1, ArrowUp: -1, ' ': 1, End: 9, Home: -9 }
const editable = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || !!t.closest('dialog[open]'))
const onKey = (e: KeyboardEvent) => {
  if (!(e.key in KEYS) || e.metaKey || e.ctrlKey || e.altKey || editable(e.target) || document.documentElement.dataset.menu) return
  e.preventDefault()
  const now = performance.now()
  if (busy(now)) return
  let way = KEYS[e.key]
  if (e.key === ' ' && e.shiftKey) way = -1
  const list = stops()
  if (Math.abs(way) === 9) {
    const s = way > 0 ? list[list.length - 1] : list[0]
    glideWay = Math.sign(way)
    if (s) glideTo(s, list)
    return
  }
  stroke(way, false, now)
}

// a move that is not the motor's (the menu, Chapter One, an address, the scrollbar dragged, find in the page): once the page rests, it rests
// on the stop nearest to it
let restT = 0
const onScroll = () => {
  if (gliding) return
  clearTimeout(restT)
  restT = window.setTimeout(() => {
    const root = document.documentElement
    if (gliding || busy(performance.now()) || root.dataset.jump !== undefined || root.style.scrollSnapType === 'none' || root.dataset.menu) return
    const list = stops()
    const y = scrollY
    const near = list.reduce<Stop | null>((b, s) => (!b || Math.abs(s.y - y) < Math.abs(b.y - y) ? s : b), null)
    if (near && Math.abs(near.y - y) > 2) glideTo(near, list)
    else if (near) target = near
  }, 400)
}

const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches && !CSS.supports('-webkit-touch-callout', 'none')
const wanted = () => {
  // a prototype (the conductor grew out of it): on this machine only, never on the published site (18 Nov)
  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return false
  try {
    const q = new URLSearchParams(location.search)
    if (q.has('motor')) sessionStorage.setItem('v5-motor', q.get('motor') === '0' ? '0' : '1')
    return sessionStorage.getItem('v5-motor') === '1'
  } catch {
    return new URLSearchParams(location.search).has('motor')
  }
}

/** start the motor on a desktop when asked for (`?motor`); returns the way to stop it */
export function startMotor() {
  // the conductor (conductor.ts, `?cenas`) is the motor grown up: never both
  if (!fine() || !wanted() || cenasOn()) return () => {}
  on = true
  const root = document.documentElement
  root.dataset.motor = ''
  addEventListener('wheel', onWheel, { passive: false })
  addEventListener('keydown', onKey)
  addEventListener('scroll', onScroll, { passive: true })
  return () => {
    on = false
    delete root.dataset.motor
    removeEventListener('wheel', onWheel)
    removeEventListener('keydown', onKey)
    removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
    raf = 0
    gliding = false
  }
}
