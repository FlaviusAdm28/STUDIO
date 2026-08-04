'use client'

import { useEffect } from 'react'

/**
 * The shot, timed in scroll rather than seconds.
 *
 * Scroll position is the only input. The footage keeps looping underneath, never paused, never
 * sought, its own timeline given no say in anything — all this decides is how much of it is
 * still lit.
 *
 * The dark comes up in two stages, and the pause between them is the whole point. It stops at
 * DIM, holding the landscape at the edge of visible, and the marker arrives *there* — on the
 * last of Chapter I rather than on a blank screen. Only after that does the rest of the light
 * go, and the marker is what stays while it does. That is a page turning rather than a section
 * beginning.
 *
 * Distances are in viewport heights of scrolling. Read down the list and you have the shot:
 *
 *   0.00 → 0.16   the hero's words leave
 *   0.28 → 0.46   the marker arrives while the landscape is still clearly there, and the light is
 *                 still going — so it belongs to Chapter I as much as to Chapter II
 *   0.00 → 0.50   the light goes down to DIM, and stops there
 *   0.50 → 1.04   the marker holds over what is left of the landscape — the bridge
 *   1.04 → 1.32   the rest of the light goes. The marker stays through it.
 *   1.32 → 1.46   the marker alone, on black
 *   1.46 → 1.60   the marker leaves
 *   1.60 → 1.72   a wait
 *   1.72 → 1.98   the statement arrives, holds to 2.26, gone by 2.50
 *
 * Then four occasions, one at a time, on an uneven cadence — long, short, short, medium — so the act
 * has a shape rather than a metronome. See the note on the `--i` lines below for why each is the
 * length it is:
 *
 *   2.60 → 2.89   a wedding, allowed to resonate
 *   2.94 → 3.14   an exhibition, passing through
 *   3.16 → 3.36   an artist, paired tightly to it
 *   3.40 → 3.66   a final performance, slowing again
 *
 * And then the light comes back:
 *
 *   3.66 → 3.74   the last of the black
 *   3.74 → 4.36   dawn. Black gives way to ivory over 0.62 beats — slower than the dusk that took
 *                 it away, because light arriving should be gentler than light leaving.
 *   4.10 → 4.42   the closing statement arrives while the light is still coming up, so Act III is
 *                 opening rather than opened
 *   4.42 → 4.85   it holds
 *
 * Then it is taken apart rather than removed, and its last word becomes the chapter marker:
 *
 *   4.85 → 5.05   "Some moments deserve" leaves
 *   4.99 → 5.21   "another" leaves, shortly after
 *   5.21 → 5.62   "chapter." alone at the centre. Breathing.
 *   5.62 → 6.36   it travels to the corner, shrinking. The slowest movement in the shot.
 *   5.70 → 5.95   the period leaves early — it belonged to the sentence, not to the marker
 *   6.26 → 6.46   "III" arrives beside it and the word settles into "Studio", together, leaving
 *                 `III Studio` on one line in the corner
 *   6.46 → 7.00   the marker holds. Chapter III's space is open.
 *
 * Every value is eased. A straight ramp reads as a fade being performed; an eased one reads as
 * light behaving like light, which is the whole difference between this and switching sections.
 *
 * Every value is also a pure function of scroll position, so the shot runs backwards exactly as
 * it runs forwards, and stopping anywhere holds that frame.
 */

/**
 * The shot is authored in *beats*, not in viewport heights, and it is 5 beats long.
 *
 * How much physical scrolling a beat costs is a separate question, answered once by `--pin` in
 * globals.css and read back below. Nothing here is timed in seconds, so compressing the scroll
 * distance changes no duration and no easing — it only changes how far the hand has to travel to
 * move through the same sequence. The ratios between every beat stay exactly as they were.
 *
 * When the shot grew from 2.5 beats to 5, `--pin` doubled with it — 140vh to 280vh, 210 to 420 on
 * touch. A beat therefore still costs exactly what it cost before, which is what keeps every
 * distance in Act I and the transition into Act II byte for byte unchanged.
 */
const BEATS = 7

/**
 * How far the dark gets before it waits for the marker.
 *
 * At 0.82 the footage's mean falls to about 16 and the sun's glow to about 44 — the landscape is
 * a trace rather than a picture, which is what the bridge needs: enough left that Chapter I is
 * still there, little enough that it is plainly going.
 */
const DIM = 0.82

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)
const smooth = (x: number): number => x * x * (3 - 2 * x)

/** Eased rise from 0 to 1 as `s` crosses `from` → `to`. */
const rise = (s: number, from: number, to: number): number => smooth(clamp01((s - from) / (to - from)))

/** Eased fall from 1 to 0. */
const fall = (s: number, from: number, to: number): number => 1 - rise(s, from, to)

export default function ScrollStage() {
  useEffect(() => {
    const root = document.documentElement

    /*
      How many viewport heights of scrolling one beat costs, taken from `--pin` so the pinned height
      and the timeline can never disagree. Change `--pin` and the whole shot compresses or opens out
      with it, in proportion, without a single breakpoint above being touched.

      Re-read rather than captured once: `--pin` is longer for touch pointers, and a tablet that gets
      rotated or a window dragged between screens can cross that boundary while the page is open. A
      stale value would leave the timeline and the pinned height disagreeing, which is the one way
      this can visibly break.
    */
    /**
     * Written values, remembered.
     *
     * Setting a custom property on the root invalidates style for the whole document, and this writes a
     * dozen of them. That was free while the page was three elements deep; once Chapter III existed it
     * became twelve full style recalculations per frame on a large tree, and the main thread stopped
     * keeping up.
     *
     * Almost nothing changes between one frame and the next, and past the end of the shot nothing
     * changes at all — so comparing first and writing only on a real change takes the usual cost from
     * twelve invalidations a frame to none.
     */
    const written = new Map<string, string>()

    let perBeat = 1
    const price = () => {
      const pin = parseFloat(getComputedStyle(root).getPropertyValue('--pin'))
      perBeat = (Number.isFinite(pin) ? pin / 100 : BEATS) / BEATS
    }
    price()

    /**
     * The word's journey, measured rather than authored.
     *
     * Two points and a ratio: where the word sits naturally inside the sentence, where the corner is,
     * and how much smaller the marker is than the sentence. The corner is declared once in CSS and
     * everything else is derived, so the travel is correct at any viewport and needs no per-size
     * numbers — including the phone, where the sentence is 24px and the reduction is therefore much
     * gentler than the 56px desktop case.
     *
     * `--tm` is forced to 0 before reading, because the element being measured is the one being
     * transformed and its natural position is only observable untransformed.
     */
    const survey = () => {
      const word = document.querySelector<HTMLElement>('.mark')
      const corner = document.querySelector<HTMLElement>('.mark-anchor')
      if (word === null || corner === null) return
      root.style.setProperty('--tm', '0')
      written.delete('--tm')
      const from = word.getBoundingClientRect()
      const to = corner.getBoundingClientRect()
      const big = parseFloat(getComputedStyle(word).fontSize)
      const small = parseFloat(getComputedStyle(corner).fontSize)
      root.style.setProperty('--mx', `${(to.left - from.left).toFixed(2)}px`)
      root.style.setProperty('--my', `${(to.top - from.top).toFixed(2)}px`)
      root.style.setProperty('--ms', (big > 0 ? small / big : 1).toFixed(4))
    }
    survey()

    let frame = 0

    const read = () => {
      frame = 0
      /* Scroll in viewport heights, then in beats — so the shot is the same on any screen. */
      const s = window.scrollY / window.innerHeight / perBeat

      const set = (name: string, value: number) => {
        const next = value.toFixed(4)
        if (written.get(name) === next) return
        written.set(name, next)
        root.style.setProperty(name, next)
      }

      set('--veil', fall(s, 0, 0.16))
      /* Two stages with a hold between them. The marker arrives during the hold. */
      set('--dusk', DIM * rise(s, 0, 0.5) + (1 - DIM) * rise(s, 1.04, 1.32))
      set('--marker', Math.min(rise(s, 0.28, 0.46), fall(s, 1.46, 1.6)))
      set('--statement', Math.min(rise(s, 1.72, 1.98), fall(s, 2.26, 2.5)))

      /*
        Four occasions, one at a time, and deliberately not four equal beats.

        Every fade is the same length — 0.10 in, 0.08 out — so the motion vocabulary is identical
        across all four. What differs is how long each one is allowed to sit at full, which is where
        the rhythm actually lives:

          a wedding            0.11 at full   the first audience, given room to resonate
          an exhibition        0.02           passing through, broadening rather than landing
          an artist            0.02           the same, and paired tightly to the one before it
          a final performance  0.08           slowing again before the light comes back

        The gaps carry the same intent: a longer breath after the wedding, almost none between the
        middle pair so they read as one widening gesture, and a slightly longer one before the last.

        The set still begins at 2.60 and ends at 3.66. It has to — the dawn starts at 3.74 and
        nothing about it moves.
      */
      set('--i1', Math.min(rise(s, 2.6, 2.7), fall(s, 2.81, 2.89)))
      set('--i2', Math.min(rise(s, 2.94, 3.04), fall(s, 3.06, 3.14)))
      set('--i3', Math.min(rise(s, 3.16, 3.26), fall(s, 3.28, 3.36)))
      set('--i4', Math.min(rise(s, 3.4, 3.5), fall(s, 3.58, 3.66)))

      /*
        The light comes back in two stages so it never passes through neutral grey: warmth first,
        lightness over it. Act III opens while the light is still arriving.
      */
      set('--warmth', rise(s, 3.74, 4.02))
      set('--dawn', rise(s, 3.92, 4.36))
      set('--close', rise(s, 4.1, 4.42))

      /*
        Act III's sentence is taken apart rather than removed. The lead goes, `another` follows it
        shortly after, and `chapter` is left alone at the centre long enough to be noticed as a word
        rather than as the end of a sentence — which is what makes the next part read as the same
        thing continuing instead of something new beginning.
      */
      set('--out1', fall(s, 4.85, 5.05))
      set('--out2', fall(s, 4.99, 5.21))

      /*
        Then it travels. The move is the slowest thing in the whole shot at 0.74 beats, the period
        leaves early because it belonged to the sentence, and the word settles into `Studio` while
        still moving — a word changing during motion is far less visible than one changing at rest.
      */
      set('--tm', rise(s, 5.62, 6.36))
      set('--stop', fall(s, 5.7, 5.95))
      /*
        The numeral and the word's settle share one range, and it starts only once the travel is 94%
        done — an annotation arriving beside something almost at rest, rather than a second animation.
        There is still a little movement left to carry the swap, which is what stops it reading as a
        substitution.
      */
      set('--swap', rise(s, 6.26, 6.46))
      set('--mark3', rise(s, 6.26, 6.46))

      /*
        And then the marker stops belonging to the shot. A step rather than a ramp: the travelling word
        and the fixed marker are pixel-identical, so switching between them is invisible — while
        cross-fading them would stack two 0.65-alpha inks and darken the marker for a frame.
      */
      set('--handoff', s >= 6.46 ? 1 : 0)
    }

    const onScroll = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(read)
    }

    const onResize = () => {
      price()
      survey()
      onScroll()
    }

    /*
      Coming back through history is the one case the inline script in layout.tsx cannot cover: a
      page restored from the back/forward cache is reinstated whole, scroll position included, and
      `scrollRestoration` has no say over that. This returns those visitors to the beginning too.

      Safe with respect to the hero: on a cached restore the opening sequence finished long ago, so
      the scroll event this fires has nothing left to accelerate.
    */
    const rewind = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      window.scrollTo(0, 0)
      read()
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('pageshow', rewind)

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pageshow', rewind)
    }
  }, [])

  return null
}
