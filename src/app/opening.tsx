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

/*
  H.264 in a QuickTime container. Declared with `src` and deliberately without a
  `type="video/quicktime"` source hint — Chrome reports no support for that MIME and would
  discard the file unplayed, where given the bytes directly it demuxes and plays it.
*/
const FOOTAGE = '/media/hero/video/hero_demo4.mov'

/*
  Named locally so the comparisons below read as the sequence rather than as property access.
  These are the imported beats, not a second copy of them.
*/
const { BLACK, TIMESTAMP, LIGHT, TIMESTAMP_OUT, MOTION, IDENTITY, LINE, INTERFACE } = beat

function localTime(): string {
  return new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

export default function Opening() {
  const [beat, setBeat] = useState<number>(BLACK)
  const [hasted, setHasted] = useState(false)

  /**
   * Frozen at arrival. This is not a clock — it is the minute somebody got here, and a
   * digit turning over would make it a widget asking to be watched.
   */
  const [arrival, setArrival] = useState<string>('')

  const video = useRef<HTMLVideoElement | null>(null)
  const shell = useRef<HTMLDivElement | null>(null)

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
    if (el === null || !el.paused) return
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
    setHasted(true)
  }, [])

  useEffect(() => {
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
        shell.current?.style.setProperty('--haste', haste)
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
      if (lineAt.current !== null && t >= lineAt.current + cues.introDoneAfterSubtitle) {
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
      /* Never leave the shot held by a sequencer that no longer exists. */
      root.dataset.opening = 'done'
    }
  }, [hurry, roll])

  /* Nudges the first frame into being decoded so the reveal has something to reveal. */
  const onMeta = useCallback(() => {
    const el = video.current
    if (el !== null && el.paused && el.currentTime === 0) el.currentTime = 0.04
  }, [])

  const timestampPresent = beat >= TIMESTAMP && beat < TIMESTAMP_OUT

  return (
    <div className="opening" ref={shell} data-hasted={hasted}>
      <div className="frame">
        {/*
          Muted, and it stays muted — `04-visual-language.md` §8, sound never starts on its
          own. The footage was cut to loop, so it simply loops: native `loop`, no seam
          handling, and nothing laid over the video at the restart.
        */}
        <video
          ref={video}
          className="footage"
          data-lit={beat >= LIGHT}
          src={FOOTAGE}
          onLoadedMetadata={onMeta}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/*
          The dark that comes up over the footage as one chapter becomes the next. Driven only
          by scroll position — see scroll-stage.tsx — and with no transition of its own, because
          anything that eased on its own here would be a second, competing clock.
        */}
        <div className="dusk" aria-hidden="true" />

        {/*
          Everything the hero says, held in one layer so the dissolve can take it away without
          touching the opening sequence's own reveal. The two multiply instead of fighting: the
          sequence decides whether a thing has arrived, this decides how much of the hero is
          left. Scrolling early therefore cannot leave the title fading in and out at once.
        */}
        <div className="veil">
          <div className="moment" data-present={timestampPresent} aria-hidden={!timestampPresent}>
            <span className="moment-time">{arrival}</span>
            <span className="moment-caption">{site.timeCaption}</span>
          </div>

          <div className="identity">
            <h1 className="identity-title" data-present={beat >= IDENTITY}>
              {site.title}
            </h1>
            <p className="identity-line" data-present={beat >= LINE}>
              {site.openingLine}
            </p>
          </div>

          <nav className="ways" data-present={beat >= INTERFACE} aria-hidden={beat < INTERFACE}>
            {site.nav.map((word) => (
              <a key={word} href={`#${word.toLowerCase()}`}>
                {word}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
