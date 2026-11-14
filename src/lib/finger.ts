/*
  Whether a finger is on the screen, and whether a stroke has just ended — for the phone's stop-at-each-phase at the top of the Method
  (method-stage.ts).

  iOS fixes where a stroke comes to rest as the finger lifts, from the snap in force then: turned on later, while the page was already
  flying, a quick stroke from the Work ran past 7 (Simulator, finger strokes, 8 Nov). The Method takes such a stroke back to 7's mark once
  the finger is off, unseen under its held stage — only after a stroke: Safari putting the place back on a reload, or a jump, is left alone.
*/
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
  const now = performance.now()
  const a = Math.abs(e.deltaY)
  const way = Math.sign(e.deltaY)
  const fresh = now - wheelAt > 300 || (a > 3 && way !== 0 && way !== wheelWay) || (a > 15 && a > 2.5 * wheelPrev && wheelPrev < 0.4 * wheelPeak)
  wheelAt = now
  if (a > 3 && way !== 0) wheelWay = way
  if (fresh) wheelPeak = 0
  wheelPeak = Math.max(wheelPeak, a)
  wheelPrev = a
  if (fresh) strokeListeners.forEach((f) => f())
  if (!governed || !way) return
  const root = document.documentElement
  // only where the page stops at marks (scroll-snap mandatory), and never in a jump of the site's own or with the menu open
  if (!getComputedStyle(root).scrollSnapType.includes('mandatory') || root.dataset.jump !== undefined || root.dataset.menu) {
    stop = null
    return
  }
  if (fresh) {
    release()
    stop = nextStop(way)
  }
  const px = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1
  // two of the stroke's events ahead: a wheel event that cannot be cancelled moves the page before this sees it, and past Weddings by a
  // few pixels the Work took that for a stroke back and went on to the top (Chrome, a strong stroke up from Artists, 14 Nov)
  const to = scrollY + 2 * e.deltaY * px
  if (stop === null) hold(e)
  else if (way * (to - stop) >= 0) {
    hold(e)
    // short of it, or already past it (a wheel event that could not be cancelled moved the page first): at the stop
    if (Math.abs(stop - scrollY) > 1) scrollTo({ top: stop, behavior: 'instant' })
  }
}
// Held for the rest of the stroke by <html data-wheel-held> (globals.css: overflow hidden), as the Work's passage holds the page: Chrome
// lets a page cancel only a trackpad stroke's first wheel event, and that one has to move the page to its stop. Let go once the stroke
// is over (no wheel for 150 ms) or a new one begins
let heldUntil = 0
const release = () => {
  clearTimeout(heldUntil)
  delete document.documentElement.dataset.wheelHeld
}
const hold = (e: WheelEvent) => {
  if (e.cancelable) e.preventDefault()
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
  if (!fine()) return () => {}
  bindWheel()
  governed = true
  return () => {
    governed = false
    release()
  }
}
