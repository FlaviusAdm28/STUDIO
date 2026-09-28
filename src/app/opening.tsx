'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '@content'
import { beat, chapterOneStory, cues, maxAdvance, pace, rates, schedule, type Beat } from '@/motion'

/**
 * The opening sequence.
 *
 * Every arrival is a change in light rather than a movement. Nothing travels, nothing
 * scales, nothing is revealed letter by letter. `04-visual-language.md` §7.
 *
 * This file is the sequencer and nothing else — it decides *whether* a beat has arrived and
 * lets CSS decide what that looks like. Every number the sequence runs on is authored in
 * `src/motion/story.ts` as an anchor or a relationship, and resolved into the absolute `cues`
 * below by `src/motion/timeline.ts`. There are no timings here, by design.
 * `docs/development/02-motion-system.md`.
 *
 * ## The opening is mandatory
 *
 * Scrolling cannot skip it. It can only make it run faster, and the faster the hand moves the
 * faster it runs — but every beat still happens, in order, and none of them is ever crossed
 * invisibly. Three things together are what make that true rather than hoped for:
 *
 *   - **The clock's rate follows the scroll speed.** Not a switch between two speeds — a
 *     continuous ramp from natural pace up to `pace.urgent`, so the sequence answers the hand.
 *   - **`maxAdvance` bounds what one frame may add.** Derived from the closest two beats ever
 *     get, so however fast the clock runs, two of them can never fall due in the same frame.
 *   - **The shot does not begin until this is over.** `data-opening` on the root says so, and
 *     `scroll-stage.tsx` holds Chapter II at its first frame until it reads `done`. The page
 *     still scrolls the whole time — nothing is frozen, nothing is swallowed, nothing jumps.
 *
 * Only the *rate* is ever affected. With no interaction at all the sequence is unchanged, to the
 * millisecond.
 */

/**
 * **Where the footage is, and why it is not here.**
 *
 * The `<video>` used to be this component's own element, declared in the JSX below with the file path
 * beside it. `final-design-spec.pdf` §11.1 makes that impossible: *"One element, mounted at the Hero,
 * never unmounted, never re-sourced, never `display:none`"* — and an element inside the opening cannot
 * outlive the opening. It is `environment.tsx`'s now, and its path is `site.environment.hero`.
 *
 * **Nothing about the sequence moved with it.** This file still lights the footage, still starts it at
 * `MOTION`, and still gates the subtitle on it — it reaches the element instead of owning it. That is
 * the whole of the structural change C5 makes here, and it is deliberately the smallest one that lets
 * the video survive the frame it was born in. `implementation-reconciliation.md` C5.
 */
const HERO_PLATE = '.env-hero'

/*
  Named locally so the comparisons below read as the sequence rather than as property access.
  These are the imported beats, not a second copy of them.
*/
const { BLACK, TIMESTAMP, LIGHT, MOTION, IDENTITY, LINE, INTERFACE } = beat

function localTime(): string {
  return new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

export default function Opening() {
  const [beatNow, setBeat] = useState<number>(BLACK)

  /**
   * Frozen at arrival. This is not a clock — it is the minute somebody got here, and a
   * digit turning over would make it a widget asking to be watched.
   */
  const [arrival, setArrival] = useState<string>('')

  /**
   * The environment's hero plate, adopted on the first frame. Not a `ref` React fills in — the element
   * belongs to `environment.tsx` and outlives this component — but everything that reads it below is
   * unchanged, so the sequence is written against the same thing it always was.
   */
  const video = useRef<HTMLVideoElement | null>(null)

  /**
   * The sequence runs on its own clock rather than on wall time, and interaction changes
   * the clock's *rate* instead of its contents. Every interval between steps keeps its
   * proportion, so the choreography cannot be reordered, shortened or skipped — only
   * played faster. Nothing is ever revealed out of turn.
   */
  const elapsed = useRef(0)
  const rate = useRef<number>(rates.base)
  const base = useRef<number>(rates.base)
  const lineAt = useRef<number | null>(null)

  /**
   * Whether the visitor has asked to move on at all, by any means.
   *
   * Separate from the rate, which now moves continuously: the footage gate on the subtitle needs to
   * know that somebody is waiting, and a rate that has eased back down after a flick would say no.
   */
  const urged = useRef(false)

  /** Smoothed scroll speed, in pixels per millisecond. What the clock's rate is drawn from. */
  const drive = useRef(0)

  const roll = useCallback(() => {
    const el = video.current
    /*
      `data-still` is a stop somebody asked for — Contact's listening, `contact-listen.tsx` — and this
      runs every frame for the life of the page, so without the check it undid that pause on the next
      frame. The opening's own start is untouched: nothing sets it before Contact.
    */
    if (el === null || !el.paused || el.dataset.still !== undefined) return
    const attempt = el.play()
    if (attempt !== undefined) attempt.catch(() => undefined)
  }, [])

  /**
   * Somebody who wants to move faster gets the same sequence, sooner. Not the end state,
   * and not fewer steps. `03-design-principles.md` §2 — we decide the order, they decide
   * the pace — and the condition that everyone gets a composed version rather than the
   * same thing with parts removed.
   *
   * This is the floor for any single expression of intent — a click, a key, a touch. Scrolling goes
   * further than this on its own, in proportion to how fast the hand is moving.
   */
  const hurry = useCallback(() => {
    urged.current = true
  }, [])

  useEffect(() => {
    /*
      Adopt the environment's hero plate. By the time an effect runs the document is committed whole, so
      this finds the element whether `environment.tsx` mounted before or after this component — sibling
      order in the tree decides nothing.

      The metadata nudge is what it always was: it pushes the first frame into being decoded so the
      reveal at `LIGHT` has something to reveal. It is attached here rather than declared as a prop
      because the element is no longer this file's to declare, and it is fired immediately where the
      metadata has already arrived — an element mounted earlier may be past the event by now.
    */
    const plate = document.querySelector<HTMLVideoElement>(HERO_PLATE)
    video.current = plate
    const nudge = () => {
      if (plate !== null && plate.paused && plate.currentTime === 0) plate.currentTime = 0.04
    }
    if (plate !== null) {
      if (plate.readyState >= 1) nudge()
      else plate.addEventListener('loadedmetadata', nudge, { once: true })
    }

    /* Reduced motion is the same choreography on a faster clock, not a different one. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    base.current = reduced ? rates.reduced : rates.base
    if (rate.current === rates.base) rate.current = base.current

    /*
      The shot reads this. It holds Chapter II at its first frame while the opening runs, so scrolling
      hurries the opening instead of arriving underneath it. Set before the first frame, so there is no
      window in which the shot believes it is free.
    */
    const root = document.documentElement
    root.dataset.opening = 'running'

    let previous = performance.now()
    let seen = window.scrollY
    let published = ''
    let raf = 0

    const tick = (now: number) => {
      /*
        Two caps, and they do different jobs. `maxStep` bounds the real time one frame may contribute,
        so a stall pauses the sequence rather than fast-forwarding it. `maxAdvance` bounds the virtual
        time it may add once the rate is applied, so a fast clock can never make two beats due in the
        same frame. Neither binds at natural pace — see `maxAdvance`'s note in `timeline.ts`.
      */
      const step = Math.min(now - previous, pace.maxStep)
      previous = now

      /*
        How hard the hand is moving, smoothed. Raw per-frame deltas are impulses rather than a velocity
        — a wheel arrives in notches and a phone reports nothing between momentum samples — so the
        clock is drawn from an average that also eases back down when the hand stops.
      */
      const y = window.scrollY
      const moved = Math.abs(y - seen)
      seen = y
      if (step > 0) {
        drive.current = drive.current * pace.settle + (moved / step) * (1 - pace.settle)
      }

      /*
        The rate. A single intent puts a floor under it; scrolling raises it in proportion to speed, up
        to `pace.urgent`. Whichever asks for more wins, so a click during a flick never slows anything.
      */
      const urge = Math.min(drive.current / pace.urgentAt, 1)
      const scrolling = 1 + urge * (pace.urgent - 1)
      const intent = urged.current ? pace.haste : 1
      rate.current = base.current * Math.max(intent, scrolling)

      /*
        CSS divides every Chapter I duration by this, so the fades keep their proportion to the gaps
        between them at any rate. A transition already running is unaffected by a change here — which
        is what we want: each beat fades at the rate that was current when it began.
      */
      const haste = (1 / rate.current).toFixed(3)
      if (haste !== published) {
        published = haste
        root.style.setProperty('--haste', haste)
        /*
          And on the hero plate, which is a sibling of this frame rather than a child of it and so cannot
          inherit the value. One extra write on one leaf element, on the frames the rate actually changes:
          without it the footage's own fade would keep the resting rate while every other beat sped up,
          which is the one proportion `--haste` exists to hold.
        */
        plate?.style.setProperty('--haste', haste)
      }

      elapsed.current += Math.min(step * rate.current, maxAdvance)
      const t = elapsed.current

      /* Typed as a beat rather than a number, so nothing but a real beat can be assigned here. */
      let target: Beat = BLACK
      for (const [value, ms] of schedule) if (t >= ms) target = value

      if (target >= IDENTITY && t >= cues.subtitle) {
        const el = video.current
        /*
          The footage gate holds the line back until the second shot at normal pace, which
          is the choreography as approved. Once the visitor has asked to move on, waiting
          on the video would stall the tail of the sequence, so the gate is released — and
          the line is measurably more legible over the first shot than the second anyway.
        */
        const footageReady =
          urged.current ||
          t >= chapterOneStory.subtitle.arrivesRegardlessAt ||
          el === null ||
          el.error !== null ||
          (el.paused && t > cues.motion + chapterOneStory.subtitle.stallGrace) ||
          el.currentTime >= chapterOneStory.subtitle.waitsForFootageAt
        if (footageReady) {
          if (lineAt.current === null) lineAt.current = t
          target = LINE
        }
      }
      /* Measured from when the subtitle actually landed, not from when it was scheduled. */
      if (lineAt.current !== null && t >= lineAt.current + cues.interfaceAfterSubtitle) {
        target = INTERFACE
      }

      setBeat((current) => (target > current ? target : current))
      if (target >= TIMESTAMP) setArrival((current) => (current === '' ? localTime() : current))
      if (target >= MOTION) roll()

      /*
        And the shot is released — once the interface has finished arriving, not when it began. A
        visitor already scrolling hard would otherwise fade the navigation out through the veil while it
        was still fading in, and never see the beat at all.
      */
      /*
        Guarded, and the guard is load-bearing rather than tidiness. `tick` runs for the life of the
        component, so writing this unconditionally set the attribute on **every frame forever** — and
        setting an attribute to the value it already holds still produces a MutationRecord. The shot's
        driver observes `data-opening` to take the origin the instant the opening reports it is over, so
        it was being woken sixty times a second and forced to draw an exact frame each time. That was
        invisible while the driver had no state; it silently defeated the input spring, which was
        snapped back to the raw scroll position on every frame it tried to run.

        The flip still happens on exactly the same frame it always did.
      */
      if (
        root.dataset.opening !== 'done' &&
        lineAt.current !== null &&
        t >= lineAt.current + cues.introDoneAfterSubtitle
      ) {
        root.dataset.opening = 'done'
      }

      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)

    /*
      Every way of asking to move on is treated identically — a scroll is a click as far as
      this sequence is concerned. `scroll` is listened for alongside `wheel` because dragging
      the scrollbar, or any programmatic scroll, fires neither `wheel` nor `keydown`; and
      `focusin` alongside `keydown` so arriving by keyboard counts without a keypress.
    */
    const intent = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'focusin', 'scroll'] as const
    intent.forEach((event) => window.addEventListener(event, hurry, { passive: true }))

    return () => {
      window.cancelAnimationFrame(raf)
      intent.forEach((event) => window.removeEventListener(event, hurry))
      plate?.removeEventListener('loadedmetadata', nudge)
      /* Never leave the shot held by a sequencer that no longer exists. */
      root.dataset.opening = 'done'
    }
  }, [hurry, roll])

  /**
   * **The image arriving, and it is still Chapter I's beat.**
   *
   * `data-lit` was a prop on this file's own `<video>`; the element moved and the beat did not, so it is
   * written on it instead. It is not the plate's *presence* — that is `--env-hero`, which the
   * environment owns — and the two multiply by nesting, so the opening's reveal and the sequence's
   * choice of plate can never contend for one property.
   *
   * Deliberately not cleared on unmount: the environment outlives the opening, and the hero it is
   * holding has been lit since `LIGHT`.
   */
  useEffect(() => {
    video.current?.setAttribute('data-lit', String(beatNow >= LIGHT))
  }, [beatNow])

  /**
   * **The arrival time, written into the frame the V2 layer composes.**
   *
   * §2 state 01: *"Time embedded in the plate… read once at mount."* The composition is
   * `states.tsx`'s and the minute is this file's, so the string is put into the two nodes that carry it
   * — the blend layer and its floor — exactly the way `data-lit` is put on a plate this file no longer
   * owns. Frozen at arrival: a digit turning over would make it a widget asking to be watched.
   */
  useEffect(() => {
    if (arrival === '') return
    const line = `It’s ${arrival} ${site.timeCaption}.`
    document.querySelectorAll<HTMLElement>('[data-time]').forEach((node) => {
      node.textContent = line
    })
  }, [arrival])

  /**
   * **The beat, published.** `states.tsx` renders Chapter I's frame and this file decides when each part
   * of it has arrived, so the beat goes on the root and the stylesheet reads it — the same division
   * `data-opening` is already under, and the reason no timing lives in the presentation layer.
   */
  useEffect(() => {
    document.documentElement.dataset.beat = String(beatNow)
  }, [beatNow])

  /*
    **This component renders nothing, and that is the point.** It was the hero's composition and its
    clock; V2 rebuilt the composition in `states.tsx`, and what is left here is every mechanism that
    composition depends on — the mandatory opening, `data-opening`, the rate and `--haste`, the footage
    gate, the plate's own `data-lit`, and the minute. `CLAUDE.md`: recompose the frame, keep the four.
  */
  return null
}
