/*
  The conductor — the page's one driver on a desktop (the plan of 16 Nov in v5-handoff.md and v5-scroll-options.md §5–6; built behind
  `?cenas` on this machine, steps 1–4, 16–22 Nov; the desktop's scroll since step 5, 23 Nov, the old one gone: the wheel governor, the
  motor it grew out of). The browser never moves the page — every wheel and scrolling key is cancelled from a stroke's first event, and a
  stroke is only a request, "onwards" or "back".

  What is new: **the scenes no longer read the scroll.** A scene registers here (registerScene) and is told where the page is — "you are on
  stop 8b; played, or at once" — and shows what belongs there; it says how long a passage of its own must still play whole (busyUntil).
  Between the stops of those scenes (the entrance, the Work, the Method, the About: from the top to the About's 14, every one under a stage
  held on screen; and the Questions' stop and the Contact's, since step 4) the page is not scrolled at all: it is put on the next stop at
  once, unseen, and the scene plays its change by its clock. The page glides where something really goes up with it: from the About's 14
  to the Questions, whose paper rises over it, and from the Contact to the page's end, the colophon coming in.

  The rules (owner, 16 Nov):
  - one stroke, one stop; a stroke during a passage that must play whole (the Work's blade growing into the arch, the Method's light, and
    since 22 Nov each of the Method's phase changes until it is seen through) does not cut it: it is kept if it comes in the passage's last
    QUEUE ms and then runs, otherwise dropped. Kept from earlier it moved the page seconds after the hand had stopped, which the owner
    called broken (8 Nov, "8a came seconds after the stroke, by itself")
  - turning back mid-passage is allowed where the passage was made to go back from where it is (the Work's, the Method's light)
  - barriers (owner, 16 Nov): the top, Weddings, the Method's 7 and 11, the About's 14, the Questions, the Contact — the page rests there at
    least BARRIER_MS, whatever the strokes
  - jumps (the menu, an address, Chapter One, Home/End, a scrollbar dragged, find in the page) land on the nearest stop with every scene at
    once in its place (README #115)

  Phones are left to the browser for now (the touch adapter is the next step); reduced motion keeps the browser's own scroll (the scenes
  lie one after the other, no stops).
*/
import { strokeDetector } from '@/lib/strokes'
import { siteJumps } from '@/lib/unsnapped'

export type How = 'play' | 'jump'
export type Scene = {
  name: string
  /** the page is on this stop now (a [data-stop] id): show what belongs there, played or at once */
  to: (stop: string, how: How) => void
  /** until when (performance.now()) a passage of this scene must play whole before the page may go to `next`; 0 = nothing to wait for */
  busyUntil: (next: string) => number
  /** a stroke back now turns back a passage that holds the page, once there, as at a barrier (request); left out: any busyUntil(ahead) */
  turnBack?: (ahead: string) => boolean
}

const BARRIERS = new Set(['top', 'weddings', '7', '11', '14', 'questions', 'contact'])
// the stops between which the page goes at once, unseen: from the top to the About's 14 (the About's 12–14 since step 3, 21 Nov: its stage is
// held over them), and the Questions' stop and the Contact's (step 4, 22 Nov: the paper, the questions, the Contact's room and scene are
// held on the screen between them; measured at 26 viewports, contact-client.tsx). Never from one group to the other: the paper rises
const HELD = [
  new Set(['top', 'weddings', 'artists', 'experiences', '7', '8a', '8b', '8c', '9', '10', '11', '12', '13', '14']),
  new Set(['questions', 'contact']),
]
const heldBetween = (a: string, b: string) => HELD.some((g) => g.has(a) && g.has(b))
// a stroke kept for after a passage only in its last stretch
const QUEUE = 450
const BARRIER_MS = 1200
// a scene still reading the scroll that never says it has ended does not hold the page longer than this
const BUSY_MAX = 4500
const glideMs = (d: number) => Math.min(1050, Math.max(620, 520 + 0.22 * d))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3

const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches && !CSS.supports('-webkit-touch-callout', 'none')
let wanted: boolean | null = null
/** the conductor drives this page: a desktop (a fine pointer that hovers, not an iPhone or an iPad), motion allowed */
export const cenasOn = () => {
  if (wanted !== null) return wanted
  if (typeof window === 'undefined') return false
  return (wanted = fine() && !matchMedia('(prefers-reduced-motion: reduce)').matches)
}

const scenes = new Set<Scene>()
/** a scene answers to the conductor from now on; returns the way to stop */
export function registerScene(s: Scene) {
  scenes.add(s)
  return () => {
    scenes.delete(s)
  }
}

type Stop = { id: string; y: number; barrier: boolean; el: HTMLElement | null }
const maxY = () => Math.round(document.documentElement.scrollHeight - innerHeight)
const stops = (): Stop[] => {
  const y0 = scrollY
  const seen = new Map<number, Stop>()
  for (const el of document.querySelectorAll<HTMLElement>('[data-stop]')) {
    if (!el.getClientRects().length) continue
    const id = el.dataset.stop ?? ''
    const y = Math.min(maxY(), Math.round(el.getBoundingClientRect().top + y0))
    if (!seen.has(y)) seen.set(y, { id, y, barrier: BARRIERS.has(id), el })
  }
  const end = maxY()
  if (![...seen.keys()].some((y) => Math.abs(y - end) < 3)) seen.set(end, { id: 'end', y: end, barrier: false, el: null })
  return [...seen.values()].sort((a, b) => a.y - b.y)
}
// on the mark exactly, measured with the page beside it, never short of it (the motor, 15 Nov: a mark measured from far away came out half
// a pixel off, and the sections still reading the scroll chose the phase before)
const exact = (s: Stop) => {
  if (!s.el) return Math.min(s.y, maxY())
  return Math.min(Math.ceil(scrollY + s.el.getBoundingClientRect().top - 0.01), maxY())
}

// the lab's tape (vtape.js), when it runs: each decision, for the tests
const note = (s: string) => (window as unknown as { __vtMark?: (s: string) => void }).__vtMark?.('cenas ' + s)

// ---- where the page is, and the page's own moves ----
let current: Stop | null = null
let restUntil = 0
// the way the page came into its barrier: the rest holds strokes that would carry on that way, never one turning back
let restWay = 0
let selfY = -1
// The glass of desktop Safari's bar (Safari 27) shows the page's own content that has scrolled off above the viewport — in the flow, blurred
// and muted, in its place (left stays left); not a sticky or a fixed layer (measured, desk/cenas/tint README). The scenes are held (sticky),
// so the bar showed whatever lay in the flow above the stop: at the About's 13 the Method's end, its 11's cards to the sides (owner, 22 Nov:
// "consigo ver cards da cena anterior na barra… blur em background"). A strip of the page itself, laid just above the viewport at every move
// of the page — here, in the same frame — and painted with the top of the scene (entrance/sequence.ts): the bar shows the scene, as the
// iPhone's full screen does. Above every stage, under the bar's islands; never seen on the page (it is always above the viewport)
const FEED = 120
let feed: HTMLElement | null = null
const feedAt = (y: number) => {
  if (feed) feed.style.transform = `translate3d(0, ${Math.round(y) - FEED}px, 0)`
}
const place = (y: number) => {
  selfY = y
  scrollTo({ top: y, behavior: 'instant' })
  feedAt(scrollY)
}
// the way of the last move played (0 after a jump), and a stop that holds as a barrier once, for a passage turned back (request)
let lastWay = 0
let turnHold = false
const arrive = (s: Stop, how: How, way = 0) => {
  current = s
  if ((s.barrier || turnHold) && how === 'play') {
    restUntil = performance.now() + BARRIER_MS
    restWay = way
  }
  const held = turnHold && !s.barrier
  turnHold = false
  lastWay = how === 'play' ? way : 0
  scenes.forEach((sc) => sc.to(s.id, how))
  note(`at ${s.id} ${how}${held ? ' held' : ''}`)
}

// the entrance running: busy without saying until when. The About says its own since step 3 (about-stage.ts busyUntil), the Contact since
// step 4 (contact-client.tsx: read here as well, its passage held strokes BUSY_MAX)
const legacyBusy = () => document.documentElement.dataset.entrance === 'run'
let legacySince = 0
const busyUntil = (next: string, way: number, now: number) => {
  // turned back at a barrier: the rest was for strokes carrying on (lab, 16 Nov: a stroke back 0.4 s into the Work's passage was dropped)
  let until = way === restWay ? restUntil : 0
  scenes.forEach((sc) => (until = Math.max(until, sc.busyUntil(next))))
  if (legacyBusy()) {
    if (!legacySince) legacySince = now
    if (now - legacySince < BUSY_MAX) until = Math.max(until, now + BUSY_MAX)
  } else legacySince = 0
  return until
}

// ---- the glide (below the held scenes) ----
let raf = 0
let gliding = false
let target: Stop | null = null
let from = 0
let startAt = 0
let dur = 0
let curve = ease
let glideWay = 0
const frame = (now: number) => {
  raf = 0
  if (!gliding || !target) return
  const t = Math.min(1, (now - startAt) / dur)
  place(from + (target.y - from) * curve(t))
  if (t < 1) raf = requestAnimationFrame(frame)
  else {
    gliding = false
    const y = exact(target)
    const way = Math.sign(y - from)
    if (Math.abs(scrollY - y) >= 0.5) place(y)
    arrive({ ...target, y }, 'play', way)
  }
}
const stopGlide = () => {
  gliding = false
  cancelAnimationFrame(raf)
  raf = 0
}
let unjump = 0
/** go to a stop: at once and unseen between the held scenes, or for a jump; gliding otherwise */
const moveTo = (s: Stop, how: How, again = false) => {
  const at = current && Math.abs(current.y - scrollY) < 3 ? current : null
  const unseen = how === 'jump' || (!!at && heldBetween(at.id, s.id))
  target = s
  if (unseen) {
    stopGlide()
    if (how === 'jump') {
      // the sections still reading the scroll settle at once for a jump (lib/address.ts marks it the same way)
      const root = document.documentElement
      root.dataset.jump = 'cenas'
      clearTimeout(unjump)
      unjump = window.setTimeout(() => root.dataset.jump === 'cenas' && delete root.dataset.jump, 600)
    }
    const y = exact(s)
    const way = Math.sign(y - scrollY)
    place(y)
    arrive({ ...s, y }, how, way)
    return
  }
  from = scrollY
  startAt = performance.now()
  dur = glideMs(Math.abs(s.y - from))
  // carried on by another stroke mid-glide: from where it is, already moving — no second ease in
  curve = again ? easeOut : ease
  gliding = true
  if (!raf) raf = requestAnimationFrame(frame)
}

/** a jump of the site's own to a stop by its id (the Work's chapters, the Method's field and Talk to us) */
export function goTo(id: string, how: How) {
  if (!cenasOn()) return false
  const s = stops().find((x) => x.id === id)
  if (!s) return false
  glideWay = 0
  moveTo(s, how)
  return true
}

// ---- strokes ----
const nextFrom = (y: number, way: number, list: Stop[]) =>
  way > 0 ? list.find((s) => s.y > y + 2) : [...list].reverse().find((s) => s.y < y - 2)
let pending = 0
let pendingT = 0
const step = (way: number) => {
  const list = stops()
  if (gliding && target && way === glideWay) {
    // carried on: one stop more, never past a barrier
    if (target.barrier) return note(`${way} carried, barrier`)
    const next = nextFrom(target.y, way, list)
    if (next) moveTo(next, 'play', true)
    return
  }
  const y = gliding ? scrollY : current && Math.abs(current.y - scrollY) < 3 ? current.y : scrollY
  const next = nextFrom(y, way, list)
  glideWay = way
  if (next) moveTo(next, 'play', gliding)
}
const request = (way: number) => {
  // a move of someone else's not yet taken (a jump a moment ago): taken first, so the stroke goes on from where the page really is
  if (restT) adopt()
  const now = performance.now()
  const list = stops()
  const y = current && Math.abs(current.y - scrollY) < 3 ? current.y : scrollY
  const next = gliding && target && way === glideWay ? target : nextFrom(y, way, list)
  const until = busyUntil(next?.id ?? '', way, now)
  if (until > now) {
    if (until - now <= QUEUE) {
      pending = way
      clearTimeout(pendingT)
      pendingT = window.setTimeout(() => {
        const w = pending
        pending = 0
        if (w) request(w)
      }, until - now + 16)
      note(`${way} kept ${Math.round(until - now)}ms`)
    } else note(`${way} dropped ${Math.round(until - now)}ms`)
    return
  }
  // Turned back while the passage it began still plays (the visitor changed their mind): the page goes back where it was and holds there
  // as at a barrier, so the rest of that hand does not carry it on (owner, 16 Nov: the Method's light cut by a fast scroll back went on
  // through Artists to Weddings — "concordo"; lab: one stroke back stayed at Experiences, three went on to Weddings)
  if (current && lastWay && way === -lastWay) {
    const ahead = nextFrom(current.y, lastWay, list)
    // (a scene says which of its passages hold so: the Method's phase changes do not, 22 Nov — each plays its own way back)
    turnHold = !!ahead && [...scenes].some((sc) => (sc.turnBack ? sc.turnBack(ahead.id) : sc.busyUntil(ahead.id) > now))
  }
  step(way)
  // arrived at once (between the held scenes), or gliding there (it holds on arrival); nowhere to go, nothing to hold later
  if (!gliding) turnHold = false
}

// A new stroke (lib/strokes.ts): after a pause, the other way, a jump once the momentum has faded, or a momentum rising again — read in
// the events' own time, so that the events a busy browser joins into one are not taken for a hand (22 Nov)
let detect = strokeDetector()
const onWheel = (e: WheelEvent) => {
  const root = document.documentElement
  // a pinch (zoom) or a sideways swipe (back / forward in the history) is the browser's; the menu holds the page by itself (bar-client.tsx)
  if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || root.dataset.menu) return
  if (e.cancelable) e.preventDefault()
  if (!e.deltaY) return
  const px = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1
  // when the hand made it (the page's clock); a browser without it, when it came
  const now = performance.now()
  const t = Number.isFinite(e.timeStamp) && Math.abs(now - e.timeStamp) < 10000 ? e.timeStamp : now
  // how strong a stroke is cannot be read from its events (macOS accelerates strokes that follow one another, motor.ts): one stroke, one stop
  if (detect(t, e.deltaY * px)) request(Math.sign(e.deltaY))
}

const KEYS: Record<string, number> = { PageDown: 1, PageUp: -1, ArrowDown: 1, ArrowUp: -1, ' ': 1, End: 9, Home: -9 }
const editable = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || !!t.closest('dialog[open]'))
// Space on a focused control presses it (a question, a moment, the portrait): the browser's, never a stroke. Taken as one, a question
// stayed closed and the page went on to the Contact, a moment stayed as it was and the page went to Artists, the portrait took its
// colour and the page went to the Questions (lab, headless Chrome 1440 × 900, 26 Nov)
const control = (t: EventTarget | null) =>
  t instanceof Element && !!t.closest('button, summary, [role="button"], [role="checkbox"], [role="switch"], [role="tab"], [role="radio"]')
const onKey = (e: KeyboardEvent) => {
  if (!(e.key in KEYS) || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || editable(e.target) || document.documentElement.dataset.menu)
    return
  if (e.key === ' ' && control(e.target)) return
  e.preventDefault()
  let way = KEYS[e.key]
  if (e.key === ' ' && e.shiftKey) way = -1
  if (Math.abs(way) === 9) {
    const list = stops()
    const s = way > 0 ? list[list.length - 1] : list[0]
    glideWay = 0
    if (s) moveTo(s, 'jump')
    return
  }
  request(way)
}

// a move that is not the conductor's (the menu, Chapter One, an address, the scrollbar dragged, find in the page, the focus): once the page
// rests — at once for a jump of the site's own — it is put on the nearest stop, every scene at once in its place
let restT = 0
let seenJumps = 0
const adopt = () => {
  clearTimeout(restT)
  restT = 0
  seenJumps = siteJumps()
  if (gliding) return
  const list = stops()
  const y = scrollY
  const near = list.reduce<Stop | null>((b, s) => (!b || Math.abs(s.y - y) < Math.abs(b.y - y) ? s : b), null)
  if (!near) return
  const at = exact(near)
  if (Math.abs(at - y) >= 0.5) place(at)
  restUntil = 0
  arrive({ ...near, y: at }, 'jump')
}
const onScroll = () => {
  // whoever moved the page, the strip goes with it at once (a jump of the site's own scrolls before this frame is drawn)
  feedAt(scrollY)
  if (gliding) return
  // Within 2 px of where the conductor put the page: its own move — or the browser's last pixel of a stroke it cancelled, put back at
  // once. Chrome on a Mac moved the page 1 px as a stroke's momentum ended, every wheel event prevented (lab, real trackpad strokes with
  // momentum, 16 Nov: Weddings 1319 → 1320 in every run, Safari never; none without momentum or without a wheel). Left there, the held
  // entrance — and the arch's box in it — stood 1.2 px above the stage, and the photograph dropped a pixel as the stage took over
  const off = Math.abs(scrollY - selfY)
  if (selfY >= 0 && off < 2) {
    if (off >= 0.5) place(selfY)
    return
  }
  clearTimeout(restT)
  const jump = siteJumps() !== seenJumps || document.documentElement.dataset.jump !== undefined
  restT = window.setTimeout(adopt, jump ? 60 : 350)
}
// a change of size: the stops move with the scenes; the page goes back onto its own once the sections have measured again
let sizeT = 0
const onResize = () => {
  clearTimeout(sizeT)
  sizeT = window.setTimeout(() => {
    if (gliding || !current) return
    const s = stops().find((x) => x.id === current?.id)
    if (!s) return
    const y = exact(s)
    if (Math.abs(scrollY - y) >= 0.5) place(y)
    current = { ...s, y }
  }, 150)
}

/** start the conductor on a desktop; returns the way to stop it */
export function startConductor() {
  if (!cenasOn()) return () => {}
  const root = document.documentElement
  // data-cenas: the holds (hold.ts) stand down, the browser's snapping is off (globals.css)
  root.dataset.cenas = ''
  seenJumps = siteJumps()
  detect = strokeDetector()
  // desktop Safari only (its bar's glass): elsewhere nothing shows what is above the viewport
  if (/Apple/.test(navigator.vendor)) {
    feed = document.createElement('div')
    feed.id = 'c1-feed'
    feed.setAttribute('aria-hidden', 'true')
    feed.style.cssText = `position:absolute;top:0;left:0;right:0;height:${FEED}px;z-index:35;pointer-events:none;will-change:transform`
    document.body.prepend(feed)
    feedAt(scrollY)
  }
  addEventListener('wheel', onWheel, { passive: false })
  addEventListener('keydown', onKey)
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onResize)
  // where the page is now (a reload down the page, an address): onto its stop once the sections have laid out their marks
  const first = requestAnimationFrame(() => requestAnimationFrame(adopt))
  // the lab reads the conductor's state (desk tests): on this machine only — the published site carries no lab instruments (18 Nov)
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname))
    (window as unknown as { __cenas?: unknown }).__cenas = {
      stops: () => stops().map(({ id, y, barrier }) => ({ id, y, barrier })),
      current: () => current?.id ?? null,
      gliding: () => gliding,
      go: (id: string, how: How) => goTo(id, how),
    }
  return () => {
    cancelAnimationFrame(first)
    delete root.dataset.cenas
    removeEventListener('wheel', onWheel)
    removeEventListener('keydown', onKey)
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', onResize)
    clearTimeout(restT)
    clearTimeout(pendingT)
    clearTimeout(sizeT)
    stopGlide()
    feed?.remove()
    feed = null
  }
}
