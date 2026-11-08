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
