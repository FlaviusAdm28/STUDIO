/*
  Whether a finger is on the screen, and whether a stroke has just ended — for the phone's stop-at-each-phase at the top of the Method
  (method-stage.ts).

  iOS fixes where a stroke comes to rest as the finger lifts, from the snap in force then: turned on later, while the page was already
  flying, a quick stroke from the Work ran past 7 (Simulator, finger strokes, 8 Nov). The Method takes such a stroke back to 7's mark once
  the finger is off, unseen under its held stage — only after a stroke: Safari putting the place back on a reload, or a jump, is left alone.
*/
import { holdPage, letGoPending } from './hold'
let down = false
let lifted = -1e9
let bound = false

const onStart = () => {
  down = true
}
const onEnd = (e: TouchEvent) => {
  down = e.touches.length > 0
  if (!down) lifted = performance.now()
}

/** start watching the finger (passive listeners, once for the page) */
export function watchFinger() {
  if (!bound) {
    bound = true
    addEventListener('touchstart', onStart, { passive: true })
    addEventListener('touchend', onEnd, { passive: true })
    addEventListener('touchcancel', onEnd, { passive: true })
  }
  // the listeners stay: they are the page's, shared, and cost nothing at rest
  return () => {}
}

/** a finger on the screen now */
export const fingerDown = () => down

/** a stroke's momentum may still be carrying the page: a finger on the screen, or lifted within this long. A touch begun during iOS's
 * momentum is not told to the page (no touchstart), so this is only a hint */
export const strokeLately = (ms = 2500) => down || performance.now() - lifted < ms

/*
  A new stroke of a wheel or a trackpad (14 Nov): a trackpad sends no pause between a stroke's momentum and the next stroke, so a new one is
  a wheel event after a pause (300 ms), the other way, or speeding up again once the momentum had faded (under 40 % of its peak, then 2.5×
  the event before). Read from the owner's desktop round (Chrome 157 and Safari 27.2, 14 Nov: rec-strokes.mjs split their 18 marks' strokes
  the way the hand made them). The holds that end at the page's first rest (contact-client.tsx) let go at one: with strokes one after
  another the page never rested and every stroke was taken back to the same stop.
*/
let wheelBound = false
let wheelAt = -1e9
let wheelWay = 0
let wheelPeak = 0
let wheelPrev = 0
const strokeListeners = new Set<() => void>()
// the stroke's one stop (governWheel): where this stroke may go, found at its start; null: nowhere (no stop ahead)
let governed = false
let stop: number | null = null
let strokeWay = 0
const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches && !CSS.supports('-webkit-touch-callout', 'none')
const SNAPS = '.w-pass-snap, .m-snap, .a-snap'
const nextStop = (way: number) => {
  const y = scrollY
  let best: number | null = null
  for (const el of document.querySelectorAll<HTMLElement>(SNAPS)) {
    if (getComputedStyle(el).scrollSnapAlign.startsWith('none')) continue
    const at = Math.round(el.getBoundingClientRect().top + y)
    if (way * (at - y) > 2 && (best === null || way * (at - best) < 0)) best = at
  }
  return best
}
const onWheel = (e: WheelEvent) => {
  // an event that moves nothing (a trackpad's phase marks on some setups: deltaY 0) says nothing of the stroke — counted, it reset the
  // stroke's peak and the next real event was not seen as a new stroke, so the one before's stop held the page where it was (lab, 14 Nov:
  // posted events; the owner's Chrome and Safari recordings have none, 0 of 8624 and 11616)
  if (!e.deltaY) return
  const now = performance.now()
  const a = Math.abs(e.deltaY)
  const way = Math.sign(e.deltaY)
  const fresh = now - wheelAt > 300 || (a > 3 && way !== 0 && way !== wheelWay) || (a > 15 && a > 2.5 * wheelPrev && wheelPrev < 0.4 * wheelPeak)
  wheelAt = now
  if (a > 3 && way !== 0) wheelWay = way
  if (fresh) wheelPeak = 0
  wheelPeak = Math.max(wheelPeak, a)
  // a tremor the other way round is not the stroke slowing down: taken as its last event, the next one "rose" from it and the same stroke
  // was read as a new one, stop after stop (lab, posted strokes with a 1 px event the other way round every six: Weddings → the Method's
  // 7 in one stroke, 15 Nov). The owner's trackpads make them only where a stroke the other way round begins, never inside one
  if (fresh || a > 3 || way === wheelWay) wheelPrev = a
  if (fresh) strokeListeners.forEach((f) => f())
  if (!governed || !way) return
  const root = document.documentElement
  // only where the page stops at marks (scroll-snap mandatory), and never in a jump of the site's own or with the menu open. While this
  // holds the page the snapping is off (globals.css): the hold is this stroke's own and goes on — read as "no marks" it let go, and the
  // stroke's momentum leaked through in steps, 165 ms apart, to the next mark but one (Chrome 157, 14 Nov)
  const held = root.dataset.wheelHeld !== undefined
  if ((!held && !getComputedStyle(root).scrollSnapType.includes('mandatory')) || root.dataset.jump !== undefined || root.dataset.menu) {
    stop = null
    return
  }
  // the stop is found for the stroke's way, and a clear event the other way round (more than a tremor) finds it again
  if (fresh || (a > 3 && way !== strokeWay)) {
    release()
    stop = nextStop(way)
    strokeWay = way
  }
  // A trackpad's stray event the other way round (1–3 px; 13 in the owner's Chrome round of 15 Nov, 36 and 56 in those of 14 Nov) says
  // nothing of where the stroke goes. Measured with its own sign, "past the stop" came out true for it: the page was put on the stop at
  // once, and a second one took it on to the next — a slow 100 px stroke from Weddings went to Artists and to Experiences in 30 ms
  // (lab, the owner's stroke replayed, 15 Nov). It is held where the stroke is held, and otherwise left to move its few pixels
  if (way !== strokeWay) {
    if (held || stop === null) hold(e)
    return
  }
  const px = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1
  // two of the stroke's events ahead: a wheel event that cannot be cancelled moves the page before this sees it, and past Weddings by a
  // few pixels the Work took that for a stroke back and went on to the top (Chrome, a strong stroke up from Artists, 14 Nov)
  const to = scrollY + 2 * e.deltaY * px
  if (stop === null) hold(e)
  else if (strokeWay * (to - stop) >= 0) {
    hold(e)
    // short of it, or already past it (a wheel event that could not be cancelled moved the page first): at the stop
    if (Math.abs(stop - scrollY) > 1) scrollTo({ top: stop, behavior: 'instant' })
    landed(stop, now)
  } else if (letGoPending()) {
    // The page still held from the stroke before (hold.ts lets go only once the wheel is quiet) cannot move under this one, so the stroke
    // is taken to its stop — a new stroke only, and only once the page has been DWELL ms on the stop it is on. Taken there at every new
    // stroke, strokes one after another went stop to stop at once: the owner's chain from the top crossed the whole Method to the About's
    // 12 (lab, 15 Nov 17:52; the 8c before), and kept scrolling the owner went from the Work to the About "without seeing the Method"
    // (owner, Safari, 15 Nov). A stroke sooner than that does nothing, as one during a passage does
    hold(e)
    if (fresh && now - landedAt >= DWELL && Math.abs(stop - scrollY) > 1) {
      scrollTo({ top: stop, behavior: 'instant' })
      landed(stop, now)
    }
  }
}
// when the page was put on the stop it is on (by the governor)
const DWELL = 600
let landedAt = -1e9
let landedOn: number | null = null
const landed = (at: number, now: number) => {
  if (at === landedOn) return
  landedOn = at
  landedAt = now
}
// Held for the rest of the stroke by holdPage (hold.ts: overflow, let go only once the wheel is quiet — Chrome lets a page cancel only a
// trackpad stroke's first wheel event, Safari only the later ones of a stroke whose first it cancelled, and the first has to move the page
// to its stop), with <html data-wheel-held> turning the snapping off meanwhile (globals.css). Let go once the stroke is over (no wheel for
// 150 ms) or a new one begins
let heldUntil = 0
let letGo: (() => void) | null = null
const release = () => {
  clearTimeout(heldUntil)
  letGo?.()
  letGo = null
  delete document.documentElement.dataset.wheelHeld
}
const hold = (e: WheelEvent) => {
  if (e.cancelable) e.preventDefault()
  letGo ??= holdPage()
  document.documentElement.dataset.wheelHeld = ''
  clearTimeout(heldUntil)
  heldUntil = window.setTimeout(release, 150)
}
const bindWheel = () => {
  if (wheelBound) return
  wheelBound = true
  // not passive: governWheel may hold a stroke (the browser waits for this before it scrolls: a few lines, no layout but at a stroke's start)
  addEventListener('wheel', onWheel, { passive: false })
}

/** call `f` at each new stroke of a wheel or a trackpad; returns the way to stop */
export function onWheelStroke(f: () => void) {
  bindWheel()
  strokeListeners.add(f)
  return () => {
    strokeListeners.delete(f)
  }
}

/*
  One stroke, one stop, for a wheel or a trackpad on a desktop (14 Nov): where the page stops at marks (scroll-snap mandatory: the Work
  from the top to Experiences, the Method, the About, the Questions, the Contact), a stroke goes as far as the next mark ahead of where it
  began and no further; with no mark ahead (the page's end, the top, a hold that took the marks ahead away) it does not move the page.
  scroll-snap-stop: always was not enough: a strong stroke of a trackpad ran past marks and came back — Chrome from the Method's 9 to 11,
  Safari from the Method's 11 to the page's end during 12's passage (its marks ahead taken away) and back to 12, and at the page's end
  Safari's elastic edge took the page 223 px past it (owner's desktop round and the two recordings after the first correction, 14 Nov).
  Not on touch screens (no wheel there) nor on an iPad (its trackpad is left to iOS).
*/
export function governWheel() {
  // the motor (motor.ts, `?motor`) drives the page itself: nothing to govern
  if (!fine() || document.documentElement.dataset.motor !== undefined) return () => {}
  bindWheel()
  governed = true
  return () => {
    governed = false
    release()
  }
}
