'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '@content'

/**
 * The opening sequence.
 *
 * Every arrival is a change in light rather than a movement. Nothing travels, nothing
 * scales, nothing is revealed letter by letter. `04-visual-language.md` §7.
 *
 *   0  the ground, alone
 *   1  the timestamp
 *   2  light begins to enter the frame
 *   3  the timestamp leaves, and never returns
 *   4  the identity
 *   5  the photograph begins to move
 *   6  the line — triggered by the footage itself, not by a stopwatch
 *   7  the interface, last
 *
 * The footage was measured rather than guessed, and the sequence is built around what it
 * actually is: 2880 × 1440, a 2:1 frame, 12.121s long, and palindromic. A landscape to
 * 2.0s, a dissolve up finishing at 2.4s, the brighter shot to 9.8s, then a dissolve back
 * down to the landscape for the last two seconds.
 */

/*
  H.264 in a QuickTime container. Declared with `src` and deliberately without a
  `type="video/quicktime"` source hint — Chrome reports no support for that MIME and would
  discard the file unplayed, where given the bytes directly it demuxes and plays it.
*/
const FOOTAGE = '/media/hero/video/hero_demo4.mov'

const BLACK = 0
const TIMESTAMP = 1
const LIGHT = 2
const TIMESTAMP_OUT = 3
const MOTION = 4
const IDENTITY = 5
const LINE = 6
const INTERFACE = 7

/**
 * Where the dissolve finishes and the second shot is fully established, in seconds of the
 * footage's own time. Measured frame by frame — luminance rises from 76.1 to 88.4 between
 * 1.95s and 2.40s, then holds flat.
 *
 * This is a guard, not a trigger. The footage passes it at roughly 4500ms, before the gate
 * below, so the gate is what admits the line. Its only job is to make it impossible for the
 * line to land on the first shot if the footage starts late or stalls.
 */
const SECOND_SHOT_AT = 2.4

/** Milliseconds from mount. One place, so the sequence can be read as a whole. */
const AT_TIMESTAMP = 400
const AT_LIGHT = 1600
const AT_TIMESTAMP_OUT = 2100
const AT_MOTION = 2100
const AT_IDENTITY = 3100

const SCHEDULE: ReadonlyArray<readonly [number, number]> = [
  [TIMESTAMP, AT_TIMESTAMP],
  [LIGHT, AT_LIGHT],
  [TIMESTAMP_OUT, AT_TIMESTAMP_OUT],
  [MOTION, AT_MOTION],
  [IDENTITY, AT_IDENTITY],
]

/**
 * The shape of the front of the sequence, and why these numbers:
 *
 *   1600  light begins arriving, and keeps arriving until 4800
 *   2100  the footage rolls — 500ms after the light, so the image is alive as it is lit
 *   2100  the timestamp begins leaving, and is gone by 3100
 *   3100  the identity begins the instant the timestamp has gone, with no pause between
 *         them. Its whole fade sits inside the light's arrival, so the name comes up with
 *         the first landscape rather than after it.
 *   4700  the identity settles
 *
 * The line is then admitted by the footage rather than by this clock: it waits for the
 * dissolve at 3.6s of the footage's own time, which falls at roughly 5700ms, so the second
 * level arrives with the second shot.
 */
const LINE_NOT_BEFORE = 4900

/** If the footage never plays at all, the sequence still completes. */
const LINE_REGARDLESS = 12000

/* Long enough that the interface is plainly a separate thing from the identity. */
const AFTER_LINE = 1800

/**
 * How much faster the remaining choreography runs once the visitor asks for it. Every step
 * still happens, in order, with all its intervals in proportion — the clock speeds up, the
 * sequence does not change.
 *
 * 1.55 rather than 1.8, because hurrying also releases the footage gate on the line, and
 * that removes about 750ms of waiting on top of the faster clock. At 1.8 the compound effect
 * reached 2.3× for a visitor interacting late in the sequence. At 1.55 the observed speed-up
 * stays between 1.7× and 2.0× wherever the interaction lands.
 */
const HASTE = 1.55

/** Reduced motion: the same sequence on a clock that runs faster still. */
const REDUCED = 0.45

/**
 * The most virtual time a single frame may add, in milliseconds.
 *
 * Without this the clock is only as smooth as the main thread. A stall — a background tab,
 * a slow decode, another tab hogging the CPU — stops the frame loop, and the next frame
 * arrives with a delta of seconds. The clock leaps, and several steps become due at once:
 * measured in one such stall, the light, the identity and the line all arrived in the same
 * millisecond. The order held, but three steps appearing together is a skip as far as anyone
 * watching is concerned.
 *
 * Capping the step means a stall pauses the sequence instead of fast-forwarding it. Somebody
 * who leaves the tab and comes back sees the choreography from where it stopped, which is
 * the whole point of having one.
 */
const MAX_STEP = 50

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

  /**
   * The sequence runs on its own clock rather than on wall time, and interaction changes
   * the clock's *rate* instead of its contents. Every interval between steps keeps its
   * proportion, so the choreography cannot be reordered, shortened or skipped — only
   * played faster. Nothing is ever revealed out of turn.
   */
  const elapsed = useRef(0)
  const rate = useRef(1)
  const base = useRef(1)
  const lineAt = useRef<number | null>(null)

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
   */
  const hurry = useCallback(() => {
    if (rate.current !== base.current) return
    rate.current = base.current * HASTE
    setHasted(true)
  }, [])

  useEffect(() => {
    /* Reduced motion is the same choreography on a faster clock, not a different one. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    base.current = reduced ? 1 / REDUCED : 1
    if (rate.current === 1) rate.current = base.current

    let previous = performance.now()
    let raf = 0

    const tick = (now: number) => {
      elapsed.current += Math.min(now - previous, MAX_STEP) * rate.current
      previous = now
      const t = elapsed.current

      let target = BLACK
      for (const [value, ms] of SCHEDULE) if (t >= ms) target = value

      if (target >= IDENTITY && t >= LINE_NOT_BEFORE) {
        const el = video.current
        /*
          The footage gate holds the line back until the second shot at normal pace, which
          is the choreography as approved. Once the visitor has asked to move on, waiting
          on the video would stall the tail of the sequence, so the gate is released — and
          the line is measurably more legible over the first shot than the second anyway.
        */
        const footageReady =
          rate.current !== base.current ||
          t >= LINE_REGARDLESS ||
          el === null ||
          el.error !== null ||
          (el.paused && t > AT_MOTION + 2500) ||
          el.currentTime >= SECOND_SHOT_AT
        if (footageReady) {
          if (lineAt.current === null) lineAt.current = t
          target = LINE
        }
      }
      if (lineAt.current !== null && t >= lineAt.current + AFTER_LINE) target = INTERFACE

      setBeat((current) => (target > current ? target : current))
      if (target >= TIMESTAMP) setArrival((current) => (current === '' ? localTime() : current))
      if (target >= MOTION) roll()

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
    }
  }, [hurry, roll])

  /* Nudges the first frame into being decoded so the reveal has something to reveal. */
  const onMeta = useCallback(() => {
    const el = video.current
    if (el !== null && el.paused && el.currentTime === 0) el.currentTime = 0.04
  }, [])

  const timestampPresent = beat >= TIMESTAMP && beat < TIMESTAMP_OUT

  return (
    <div className="opening" data-hasted={hasted}>
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
