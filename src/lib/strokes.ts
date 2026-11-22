/*
  A new stroke of a wheel or a trackpad, for the conductor (conductor.ts: one stroke, one stop). A trackpad sends no pause between a
  stroke's momentum and the next stroke, so a new one is read from the events themselves:
  - gap   the wheel quiet GAP ms
  - way   the other way round (more than a tremor: 1–3 px the other way are a trackpad's own, 14–15 Nov)
  - jump  a momentum faded under 40 % of its peak, then an event 2.5× the one before (the motor's rule, 14 Nov)
  - rise  a momentum only falls: two rises in a row to twice its lowest is a hand again — strokes begun gently as the last momentum ran
          out, "1 3 1 7 11 12 15 25" (owner's rounds, 15–16 Nov)

  Read in the events' own time (e.timeStamp, when the hand made them), since 22 Nov. A browser busy drawing joins the wheel events that
  came meanwhile into one, their sum (Safari after each of the Method's phase changes: frames of 38–95 ms, `220 220 220` → `660`; Chrome
  under load: `23 23 → 61` 25 ms on), and the jump and the rise read the sum as a hand: one stroke up from the Method's 9 went to 8c and
  on to 8b, a momentum's tail took the page from 11 to the About's 12 by itself (lab, real trackpad strokes, Safari). A joined event
  carries what it stands for over as long — its speed is the stroke's speed — so a jump or a rise counts only if the stroke really goes
  faster: a jump against the ~40 ms before it (from the finger's touch, if there was one: after a pause, an event smaller than the one
  before — a joined one is larger), a rise against the speed at its lowest. And neither within AGAIN ms of the stroke's own start, the
  same way: a hand does not begin again that soon (the owner's quickest strokes ~0.3 s apart), and a stroke's start with its values
  uneven ("19 7 40 8 36", Chrome) counted three times in 58 ms.
  A pause shorter than GAP is a silence, not a sum, when the event after it does not carry its time's worth of the stroke: a stroke begun
  again there counts (its first event large, read over the pause it looked slow).
  Measured (22 Nov), the rule before → this: the lab's 31 runs with real trackpad strokes in Chrome and Safari (532 strokes made) 541 → 532
  found, every run exact; every lab profile once (43 → 45 of 45); 76 made-up cases, joined events of 2–7 inside a momentum and strokes
  again after 30–280 ms of silence, 50 → 70 right (the 6 left, a strong momentum cut by a silence and a stroke begun at once as fast,
  missed by both: a finger starts small); the owner's own recorded rounds 678 → 450 strokes found, the 228 gone all a second detection
  within 150 ms or a joined event inside a momentum, 444 of the 450 on the same event as before (5 one event sooner, 1 24 ms later).
  The bench: docs/development/ios-lab/desk/cenas/passadas/ (bench.mjs).
*/
export type Fresh = false | 'gap' | 'way' | 'jump' | 'rise'

const GAP = 300
// the stroke's speed before a jump, over this long (ms)
const BEFORE = 40
// a jump: this many times the speed before it; a rise: this many times the speed at its lowest
const FASTER = 1.6
const FROM_LOW = 2
// no stroke again the same way within this long of the last one's start (ms)
const AGAIN = 150
// a pause in the hand's own time this long, then an event this much smaller: the finger touched, the momentum stopped
const TOUCH_MS = 20
const TOUCH_DROP = 0.7

/** a stroke detector of its own: give it each wheel event's own time (ms) and its delta in px (signed); it says whether a new stroke
 * begins there, and by which rule */
export function strokeDetector() {
  let at = -1e9
  let way0 = 0
  let peak = 0
  let prev = 0
  let falling = false
  let trough = Infinity
  let lowSpeed = Infinity
  let rises = 0
  let startAt = -1e9
  // the stroke's recent events, its own way (time, px, the time each stands for), for the speed before a jump
  const recent: [number, number, number][] = []
  return (t: number, delta: number): Fresh => {
    const a = Math.abs(delta)
    if (!a) return false
    const way = Math.sign(delta)
    // this event's speed, px per ms over the time it stands for (never shorter than a trackpad's 8 ms: a jitter of the clock is not speed)
    const speed = a / Math.max(8, t - at)
    rises = a > prev ? rises + 1 : 0
    if (falling) trough = Math.min(trough, a)
    if (falling && way === way0) lowSpeed = Math.min(lowSpeed, speed)
    const gap = t - at > GAP
    const turned = a > 3 && way0 !== 0 && way !== way0
    let jump = a > 15 && a > 2.5 * prev && prev < 0.4 * peak
    let rise = falling && rises >= 2 && a > 8 && a >= 2 * trough
    if (!gap && !turned) {
      if (jump && recent.length) {
        const last = recent[recent.length - 1][0]
        let from = last - BEFORE
        for (let k = recent.length - 1; k > 0; k--) {
          const [t1, x1] = recent[k]
          const [t0, x0] = recent[k - 1]
          if (t1 - t0 >= TOUCH_MS && x1 <= TOUCH_DROP * x0) {
            from = Math.max(from, t0)
            break
          }
        }
        // over the time those events stand for: a joined one among them stands for longer than the window (lab, Safari: -507 over 60 ms
        // counted in 40 made the stroke before twice as fast, and the next joined event passed for a hand)
        const inWindow = recent.filter(([rt]) => rt > from)
        const before = inWindow.reduce((s, [, x]) => s + x, 0) / Math.max(8, inWindow.reduce((s, [, , d]) => s + d, 0))
        // A long span that does not carry its own time's worth of the stroke is a silence, not a sum: a stroke begun again after a pause
        // (shorter than GAP), its first event already large — read over the pause it looked slow, and was lost (lab, 0.24 s, 22 Nov)
        const span = t - last
        const silence = span > 16 && a < 0.5 * before * span
        if (!silence && a / Math.max(4, span) < FASTER * before) jump = false
      }
      if (rise && speed < FROM_LOW * lowSpeed) rise = false
      if (t - startAt < AGAIN) jump = rise = false
    }
    const fresh: Fresh = gap ? 'gap' : turned ? 'way' : jump ? 'jump' : rise ? 'rise' : false
    if (gap || turned) recent.length = 0
    if (way === way0 || fresh) {
      recent.push([t, a, Math.min(100, Math.max(4, t - at))])
      while (recent.length && t - recent[0][0] > 200) recent.shift()
    }
    at = t
    if (a > 3 || fresh) way0 = way
    if (fresh) {
      peak = 0
      falling = false
      trough = Infinity
      lowSpeed = Infinity
      rises = 0
      startAt = t
    }
    peak = Math.max(peak, a)
    if (!falling && t - startAt > 150 && a < 0.3 * peak) {
      falling = true
      trough = a
      lowSpeed = speed
    }
    if (fresh || a > 3 || way === way0) prev = a
    return fresh
  }
}
