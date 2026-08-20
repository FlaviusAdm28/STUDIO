'use client'

import { useEffect } from 'react'
import { ACT_BEATS, BEATS, METHOD_BEATS, PRECISION, actTrack, methodTrack, track } from '@/motion'

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
 *     below them — and they can never reach the bottom while the opening is still running. It is also
 *     where the page below the film begins, which is why it is written *exactly* the moment the origin
 *     stops moving; see `anchor`.
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
    let perActBeat = 1
    let perMethodBeat = 1
    const price = () => {
      const read = (name: string) => parseFloat(getComputedStyle(root).getPropertyValue(name))
      const pin = read('--pin')
      perBeat = (Number.isFinite(pin) ? pin / 100 : BEATS) / BEATS
      const actPin = read('--act-pin')
      perActBeat = (Number.isFinite(actPin) ? actPin / 100 : ACT_BEATS) / ACT_BEATS
      const methodPin = read('--method-pin')
      perMethodBeat = (Number.isFinite(methodPin) ? methodPin / 100 : METHOD_BEATS) / METHOD_BEATS
    }
    price()

    /**
     * Where Chapter III's act begins, in pixels down the document.
     *
     * The act is the second pinned frame, and its beats are measured from the moment its own top edge
     * reaches the top of the viewport — not from the shot's origin, because its length is decided by
     * what it has to say rather than by anything in the film.
     *
     * Measured rather than derived, for the same reason the word's travel is: the answer depends on
     * `--pin`, `--origin` and the reach-back all at once, and the rendered layout already knows it.
     * Cached rather than read every frame — a `getBoundingClientRect` in the scroll loop forces a
     * synchronous layout of the whole document, which is the cost this driver was rewritten to avoid.
     * It can only move when the viewport changes or when `--origin` is written, and both say so.
     */
    let actTop = Number.POSITIVE_INFINITY

    /**
     * Where the method's frame begins, and **where its values are written**.
     *
     * The method is the third held frame and the only one outside the film. Its beats are measured from the
     * moment its own frame is stuck under the head margin, which is `.method`'s top less the sticky offset —
     * `.method` is measured rather than the stage, because a stuck element's rect no longer reports where it
     * came from, and a resize while the section is stuck would read the sticky offset back as its position.
     *
     * **Its twenty properties are written on the section rather than on the root.** Setting a custom property
     * on `:root` invalidates style for the whole document; these are read by nothing outside this section, so
     * writing them here keeps a frame of the method's own choreography from re-resolving the film, the
     * publication and a cross-origin iframe along with it. The rest of the driver still writes to the root,
     * because the shot's properties are read in both the film and Chapter III. `decisions.md` §55.
     */
    let methodTop = Number.POSITIVE_INFINITY
    let methodStage: HTMLElement | null = null

    const place = () => {
      const stage = document.querySelector<HTMLElement>('.act')
      actTop = stage === null ? Number.POSITIVE_INFINITY : stage.getBoundingClientRect().top + window.scrollY

      const method = document.querySelector<HTMLElement>('.method')
      methodStage = method === null ? null : method.querySelector<HTMLElement>('.method-stage')
      if (method === null || methodStage === null) {
        methodTop = Number.POSITIVE_INFINITY
        return
      }
      const held = parseFloat(getComputedStyle(methodStage).top)
      methodTop =
        method.getBoundingClientRect().top +
        window.scrollY -
        (Number.isFinite(held) ? held : 0)
    }
    place()

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

    /**
     * How far the chapter numeral has to move, measured rather than authored.
     *
     * `CHAPTER II` becomes `II Philosophy`, and the two have to be centred on the same axis or the mark
     * appears to slide sideways as well as rewrite itself. Nothing about that distance can be written
     * down: `Philosophy` is much wider than `Chapter`, by a different amount at every size, and it is
     * set at a different tracking again — so the honest answer is the rendered one.
     *
     * Both compositions are measured by their **ink**, not by their boxes. Tracked-out type carries a
     * trailing letter-space after its last glyph, which is half a tracking unit of phantom width on the
     * right of each line; centring the boxes would centre that phantom and put both lines visibly left
     * of where they belong. The stylesheet already solves this for the resting line with `text-indent`,
     * and the same subtraction is what makes the moved line agree with it.
     *
     * The reference is the resting line's own optical centre rather than the card's, so this asks only
     * "where is `CHAPTER II` centred" and never has to know how the card centred it — the safe-area
     * padding, the measure, the viewport all stay the stylesheet's business.
     *
     * `--mknum` is forced to 0 first, for the same reason `survey` forces `--tm`: the element being
     * measured is the element being transformed, and its natural position is only observable untransformed.
     */
    const surveyMark = () => {
      const line = document.querySelector<HTMLElement>('.card-marker')
      const chapter = document.querySelector<HTMLElement>('.card-marker-word')
      const numeral = document.querySelector<HTMLElement>('.card-marker-mark')
      const topic = document.querySelector<HTMLElement>('.card-marker-topic')
      if (line === null || chapter === null || numeral === null || topic === null) return

      root.style.setProperty('--mknum', '0')
      written.delete('--mknum')

      /* The phantom width on the right of each line: whatever tracking its last element carries. */
      const trail = (el: HTMLElement) => {
        const px = parseFloat(getComputedStyle(el).letterSpacing)
        return Number.isFinite(px) ? px : 0
      }

      const from = chapter.getBoundingClientRect()
      const mark = numeral.getBoundingClientRect()
      const name = topic.getBoundingClientRect()

      /* `CHAPTER II` as it rests, and `II Philosophy` as it would sit if the numeral never moved. */
      const resting = (from.left + mark.right - trail(numeral)) / 2
      const rewritten = (mark.left + name.right - trail(topic)) / 2

      root.style.setProperty('--mk', `${(resting - rewritten).toFixed(2)}px`)
    }
    surveyMark()

    let frame = 0

    /**
     * Where the shot starts, in pixels. `null` until the opening has finished.
     *
     * Taken lazily, on the first frame after the opening is done, rather than tracked and frozen. That
     * is what makes the handover exact: whatever the visitor did while the opening ran, the shot's
     * first frame is the frame they are looking at when it ends.
     */
    let origin: number | null = null

    /**
     * Where the visitor was the last time the shot looked, while the opening was still running.
     *
     * The origin is taken from **this** rather than from the scroll position that happens to be
     * current when the opening is found to be over, and the difference is not pedantry. Nothing calls
     * `read` between frames, so the first read after the opening ends is whatever event woke it — and
     * if that event is an anchor jump to Chapter III, taking the origin there would put the shot's
     * first frame under the visitor's feet and move Chapter III a whole film further down. Measured:
     * a click on the hero's `Studio` in the last second of the opening left the page at 4066 with the
     * origin set to 4065 and the chapter at 8131, having gone nowhere.
     *
     * Zero unless somebody scrolled, which is the case this exists to keep exact.
     */
    let held = 0

    /*
      Written whenever it changes, and added to the pinned height in CSS. While the opening runs this
      follows the visitor down the page, so there is always a full shot's worth of scrolling beneath
      them — they cannot reach the bottom and find the shot with no room left to play in.

      **While it is still moving** it is rounded up to whole viewports rather than tracked to the pixel.
      This is the one value in the system that changes the document's *height*, so writing it costs a
      layout of the whole page rather than a paint — and the moment it would be written most often is a
      hard flick during the opening, which is the worst possible moment to be relaying out. Rounding up
      keeps the guarantee (the value is always at least the scroll position, so there is always a full
      `--pin` beneath) while relaying out once per viewport travelled instead of once per frame.

      **Once the shot's origin is fixed it is written exactly**, and that matters rather than being
      tidiness. The rounded value can exceed the real origin by nearly a viewport, and the film's height
      is where the page below it starts — so anything positioned against a beat of the shot would be that
      far out for a visitor who scrolled during the opening. Chapter III's overlap is exactly that, and
      a hand-driven replay found it: the shot's origin was 1111px and `--origin` said 1974px, which put
      the chapter 87vh lower than the beat it is placed against and handed the dead moment straight back.

      Exact is also *more* correct about the guarantee, not less: at `scrollY === origin` there is then
      precisely one `--pin` left beneath. Rounding was only ever a way to avoid relaying out on a value
      that changed every frame, and this one has stopped changing.
    */
    const anchor = (px: number, exact = false) => {
      const vh = window.innerHeight
      const next = `${exact ? px : Math.ceil(px / vh) * vh}px`
      if (written.get('--origin') === next) return
      written.set('--origin', next)
      root.style.setProperty('--origin', next)
      /*
        `--origin` is the one value that changes the document's height, so it is also the one thing
        that can move the act. Re-measuring here rather than every frame is what keeps the layout it
        costs rare: at most once per viewport travelled during the opening, and once when the origin
        is finally fixed.
      */
      place()
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
        held = y
        anchor(y)
      } else {
        if (origin === null) {
          origin = held
          anchor(held, true)
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
          anchor(y, true)
        }
        s = Math.max(0, y - origin) / window.innerHeight / perBeat
      }

      /*
        The act's own frame, on its own runway. Zero until its top edge reaches the top of the
        viewport, which is a little after the mark lands in the corner — the settle in between is
        `chapterThreeStands`, and during it the shot is still the thing driving the composition.

        Two positions, one hand: both are pure functions of `scrollY`, so the join has no state in it
        and reversing through it is the same arithmetic backwards.
      */
      const a = Math.max(0, y - actTop) / window.innerHeight / perActBeat

      for (const [source, at] of [
        [s, track],
        [a, actTrack],
      ] as const) {
        for (const [name, value] of at) {
          const next = value(source).toFixed(PRECISION)
          if (written.get(name) === next) continue
          written.set(name, next)
          root.style.setProperty(name, next)
        }
      }

      /*
        The method, on its own runway and written on its own element. Three positions, one hand: each is a
        pure function of `scrollY`, so the joins hold no state and reversing through them is the same
        arithmetic backwards.
      */
      if (methodStage !== null) {
        const m = Math.max(0, y - methodTop) / window.innerHeight / perMethodBeat
        for (const [name, value] of methodTrack) {
          const next = value(m).toFixed(PRECISION)
          if (written.get(name) === next) continue
          written.set(name, next)
          methodStage.style.setProperty(name, next)
        }
      }
    }

    const onScroll = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(read)
    }

    const onResize = () => {
      price()
      place()
      survey()
      surveyMark()
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
      held = 0
      read()
    }

    /*
      The origin is taken the instant the opening reports it is over, rather than whenever the page next
      happens to move.

      Lazily was correct while the only way to move was to scroll. It stopped being correct the moment
      the hero's navigation could jump to Chapter III: `--origin` is part of the film's height, so
      rewriting it *after* a jump moves the destination out from under the visitor. Scrolled 100px during
      the opening and then clicked `Studio`, the rounded origin (986) was replaced by the exact one (100)
      and the chapter rose 886px — landing them 1.7 beats into an act they had asked to see the start of.

      Fixed at the flip, `--origin` is exact and settled before any link can be pressed, and every
      anchor resolves against a layout that is no longer going to change.
    */
    const released = new MutationObserver(read)
    released.observe(root, { attributeFilter: ['data-opening'] })

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('pageshow', rewind)

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      released.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pageshow', rewind)
    }
  }, [])

  return null
}
