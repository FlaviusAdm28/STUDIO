/*
  Holding the page still — one way for the whole site (v5-scroll-strategy.md, phase 3 step 1: the scroll conductor's first piece).

  Safari on a Mac crashed and reloaded the page ("a problem repeatedly occurred") when the page got its scrollbar back — `overflow: hidden`
  taken off the root — while a trackpad's momentum was still running: WebCore::ScrollAnimationMomentum::updateScrollExtents, from
  didAddScrollbar (SIGSEGV at 0x40; three reports, 14 Nov 01:54, 15 Nov 12:55 and 14:49). The holds were the wheel governor's (finger.ts)
  and the Work's passage (work-client.tsx, holdFor). The governor already let go only once the wheel had been quiet for 150 ms; the Work's
  passage let go by the clock (1.6 s, 1.2 s back), and a strong stroke's momentum runs longer than that.

  So the page is held by `overflow: hidden` (the gutter kept, so nothing shifts sideways) and **let go only once the wheel has been quiet**:
  no wheel event for QUIET ms, whatever the holder's clock says — never while wheel events still arrive. Letting go at a new stroke's first
  event (read as one inside a momentum) crashed it again, in that very event: the governor measured its stops (getBoundingClientRect), the
  layout gave the page its scrollbar back with the momentum running (owner, Safari, 15 Nov 17:48). The 12:55 crash was the same inside a
  wheel listener (scrollY), the 14:49 one at the next rendering after the Work's passage let go by the clock.

  Holding by the events instead (no overflow at all) was tried and measured (15 Nov, lab, real trackpad events): Safari lets a page cancel
  a stroke's later events only if it cancelled the first, and the governor lets the first one move the page to its stop — the rest came
  uncancellable (`cancelable` false), the momentum carried the page 26 px past Weddings, the Work's passage took that for a stroke back and
  the two fought for the page for a second, 60 scrollTo's, ending at the top (3 strokes of ~60 lost Weddings, against 1 before). That way
  needs the conductor to move the page itself from a stroke's first event (phase 3 step 2).

  Holds are counted: the page is free once every one has let go (the governor and the Work's passage can hold at once).
*/
const QUIET = 200
let wheelAt = -1e9
let watching = false
const heard = () => {
  wheelAt = performance.now()
}
const holders = new Set<symbol>()
let freeT = 0
const free = () => {
  freeT = 0
  if (holders.size) return
  const wait = QUIET - (performance.now() - wheelAt)
  if (wait > 0) {
    freeT = window.setTimeout(free, wait + 16)
    return
  }
  const root = document.documentElement
  root.style.removeProperty('overflow')
  root.style.removeProperty('scrollbar-gutter')
}

/** the holders have all let go but the page is still held, waiting for the wheel to be quiet (finger.ts: a stroke begun meanwhile cannot
    move the page itself, so the governor takes it to its stop) */
export const letGoPending = () => !holders.size && freeT !== 0

/** hold the page still until the returned function is called (calling it again does nothing); the page is let go once the wheel is quiet */
export function holdPage(): () => void {
  // with the motor (motor.ts) the browser never moves the page on a desktop: nothing to hold, and no overflow ever taken on or off
  if (document.documentElement.dataset.motor !== undefined) return () => {}
  if (!watching) {
    watching = true
    addEventListener('wheel', heard, { passive: true })
  }
  const id = Symbol()
  clearTimeout(freeT)
  freeT = 0
  const root = document.documentElement
  root.style.scrollbarGutter = 'stable'
  root.style.overflow = 'hidden'
  holders.add(id)
  return () => {
    if (holders.delete(id) && !holders.size && !freeT) free()
  }
}
