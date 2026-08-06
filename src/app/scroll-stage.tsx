'use client'

import { useEffect } from 'react'
import { BEATS, PRECISION, track } from '@/motion'

/**
 * The shot, timed in scroll rather than seconds.
 *
 * Scroll position is the only input. The footage keeps looping underneath, never paused, never
 * sought, its own timeline given no say in anything — all this decides is how much of it is
 * still lit.
 *
 * This file is the driver and nothing else. It converts scroll position into beats, walks the
 * track, and writes what it is told; it holds no timings, no easing and no opinion about what any
 * value means. The shot itself — every beat, every hold, every range, and the reasoning behind
 * each of them — is `src/motion/story.ts`. To change the choreography, edit that; nothing here
 * needs to be touched to add, remove or retime a cue.
 *
 * Every value is a pure function of scroll position, so the shot runs backwards exactly as it
 * runs forwards, and stopping anywhere holds that frame.
 *
 * ## Where the shot begins
 *
 * Not at scroll position zero — at wherever the page happens to be when the opening finishes.
 *
 * The opening is mandatory, so scrolling during it must hurry it rather than arrive underneath it.
 * That means the shot cannot be a function of raw `scrollY`: somebody who flicks hard on arrival
 * would otherwise be a full viewport into Chapter II before the timestamp had appeared, which is
 * exactly the bug this exists to prevent.
 *
 * So the shot is a function of `scrollY - origin`, and `origin` is fixed at the first frame after
 * `data-opening` reads `done`. Three consequences, all of them wanted:
 *
 *   - Nothing is frozen and nothing is swallowed. The page scrolls normally throughout; the shot
 *     simply is not listening yet.
 *   - There is no jump at the handover. `origin` is taken *at* that moment, so the shot starts at
 *     exactly its first frame however far the visitor had scrolled, and their next gesture carries
 *     straight on into Chapter II.
 *   - The shot keeps its full runway. `--origin` is added to the pinned height, so however far the
 *     visitor scrolled during the opening there is always a whole shot's worth of scrolling left
 *     below them — and they can never reach the bottom while the opening is still running.
 *
 * The cost is a stretch of scroll above the shot that does nothing, for a visitor who scrolled a
 * long way during the opening and then scrolls back up. What they find there is the hero, held at
 * its first frame, which is a frame worth looking at.
 */
export default function ScrollStage() {
  useEffect(() => {
    const root = document.documentElement

    /**
     * Written values, remembered.
     *
     * Setting a custom property on the root invalidates style for the whole document, and this
     * writes eighteen of them. That was free while the page was three elements deep; once Chapter
     * III existed it became eighteen full style recalculations per frame on a large tree, and the
     * main thread stopped keeping up.
     *
     * Almost nothing changes between one frame and the next, and past the end of the shot nothing
     * changes at all — so comparing first and writing only on a real change takes the usual cost
     * from eighteen invalidations a frame to none.
     */
    const written = new Map<string, string>()

    /*
      How many viewport heights of scrolling one beat costs, taken from `--pin` so the pinned
      height and the timeline can never disagree. Change `pin` in the motion module and the whole
      shot compresses or opens out with it, in proportion, without a single beat being touched.

      Re-read rather than captured once: `--pin` is longer for touch pointers, and a tablet that
      gets rotated or a window dragged between screens can cross that boundary while the page is
      open. A stale value would leave the timeline and the pinned height disagreeing, which is the
      one way this can visibly break.
    */
    let perBeat = 1
    const price = () => {
      const pin = parseFloat(getComputedStyle(root).getPropertyValue('--pin'))
      perBeat = (Number.isFinite(pin) ? pin / 100 : BEATS) / BEATS
    }
    price()

    /**
     * The word's journey, measured rather than authored.
     *
     * Two points and a ratio: where the word sits naturally inside the sentence, where the corner
     * is, and how much smaller the marker is than the sentence. The corner is declared once in CSS
     * and everything else is derived, so the travel is correct at any viewport and needs no
     * per-size numbers — including the phone, where the sentence is 24px and the reduction is
     * therefore much gentler than the 56px desktop case.
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

    /**
     * Where the shot starts, in pixels. `null` until the opening has finished.
     *
     * Taken lazily, on the first frame after the opening is done, rather than tracked and frozen. That
     * is what makes the handover exact: whatever the visitor did while the opening ran, the shot's
     * first frame is the frame they are looking at when it ends.
     */
    let origin: number | null = null

    /*
      Written whenever it changes, and added to the pinned height in CSS. While the opening runs this
      follows the visitor down the page, so there is always a full shot's worth of scrolling beneath
      them — they cannot reach the bottom and find the shot with no room left to play in.

      Rounded up to whole viewports rather than tracked to the pixel. This is the one value in the system
      that changes the document's *height*, so writing it costs a layout of the whole page rather than a
      paint — and the moment it would be written most often is a hard flick during the opening, which is
      the worst possible moment to be relaying out. Rounding up keeps the guarantee (the value is always
      at least the scroll position, so there is always a full `--pin` beneath) while relaying out once
      per viewport travelled instead of once per frame.
    */
    const anchor = (px: number) => {
      const vh = window.innerHeight
      const next = `${Math.ceil(px / vh) * vh}px`
      if (written.get('--origin') === next) return
      written.set('--origin', next)
      root.style.setProperty('--origin', next)
    }

    const read = () => {
      frame = 0
      const y = window.scrollY

      /*
        The opening is mandatory. Until it is over the shot holds its first frame — the page still
        scrolls, and `opening.tsx` turns that scrolling into a faster opening instead.

        Scroll is measured in viewport heights, then in beats, so the shot is the same on any screen.
      */
      let s = 0
      if (root.dataset.opening === 'running') {
        origin = null
        anchor(y)
      } else {
        if (origin === null) {
          origin = y
          anchor(y)
        } else if (y < origin) {
          /*
            Scrolling back up above where the shot began, which only happens to somebody who scrolled a
            long way during the opening. The origin follows them, so the stretch of scroll that did
            nothing collapses behind them instead of being there for good.

            Free of visual consequence by construction: above the origin the shot is already at its
            first frame, so moving the origin cannot change a single value. All it changes is how far
            they have to scroll to get back to Chapter II — from "however far I flicked" to "not at
            all", which is the answer they would expect.
          */
          origin = y
          anchor(y)
        }
        s = Math.max(0, y - origin) / window.innerHeight / perBeat
      }

      for (const [name, at] of track) {
        const next = at(s).toFixed(PRECISION)
        if (written.get(name) === next) continue
        written.set(name, next)
        root.style.setProperty(name, next)
      }
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
      /*
        A restored page keeps its heap, so `origin` survives with it — and a visitor who had scrolled a
        long way during the opening would come back to a shot that only starts a thousand pixels down.
        Releasing it lets the next read anchor at the top, where we have just put them.
      */
      origin = null
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
