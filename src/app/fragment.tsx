'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@content'
import { work as timings } from '@/motion'

/**
 * The work, and in Chapter III the work is the frame.
 *
 * There is no device, no plate, no card and no window. What the aperture opens is a document — one composed
 * moment of the studio's own project, filling the act's frame edge to edge, the way Chapter I's footage
 * fills the hero. `decisions.md` §53.
 *
 * ## What it loads, and what it is allowed to assume
 *
 * `site.three.work.fragment` is a URL and that is the entire contract. The project supplies a route that
 * fills whatever frame it is given, composes for it, never scrolls, carries no navigation and no controls,
 * and is silent. The studio frames it and narrates it and knows nothing else about it — no postMessage, no
 * handshake, no shared vocabulary, no colour protocol, and nothing in either repository that names the
 * other. Replacing the project is replacing that line.
 *
 * Because the fragment composes for the box it is given, this component does no arithmetic at all. The
 * iframe *is* the frame: `inset: 0` of the stage, at the stage's own size, with no scaling, no measured
 * viewport and no `ResizeObserver`. §52 needed all three because it was fitting a 390-wide document into a
 * drawn phone; a frame that composes has nothing to fit.
 *
 * ## Two things happen here and neither is a beat
 *
 * Everything narrative in Chapter III is scroll — the aperture, the stillness, the light, the naming, the
 * studio's line, the printing, the way out. All of it is a pure function of position, all of it reverses
 * exactly, and none of it is this file's business.
 *
 * What is here is **a request** and **an arrival**. The fragment is fetched when the chapter approaches, so
 * that what the aperture uncovers is a page already there rather than one arriving; and it fades up when it
 * paints, so the frame is never seen to fill in. Neither has a schedule to be synchronised with.
 *
 * ## It is material, not a document
 *
 * `pointer-events: none` in `globals.css`, throughout, and that is the whole of the nested-scroll answer.
 * The fragment has nothing to press and nothing to scroll, so a finger on it should reach the page
 * underneath — and the page then scrolls natively, with nothing locked and no event swallowed. §52 needed a
 * shield layer that stepped out of existence at the release; a picture needs no gate.
 */
export default function WorkFragment() {
  const work = site.three.work

  /**
   * Whether the chapter is close enough that the fragment should be fetched.
   *
   * The one piece of state in Chapter III, and it exists so the work is *there* rather than *arriving* by
   * the time the aperture reaches it. `timings.fetchedWithin` is the distance; `timeline.ts` turns it into
   * the observer's margin.
   */
  const [near, setNear] = useState(false)

  /** Whether it has painted. Drives one fade, and nothing else reads it. */
  const [arrived, setArrived] = useState(false)

  const frame = useRef<HTMLDivElement | null>(null)

  /**
   * The chapter approaching, in one observer.
   *
   * The frame's own box is the sentinel, because it *is* the act's frame: this element is `inset: 0` of the
   * pinned stage, so before the stage sticks its rect is the top of Chapter III. Nothing extra in the DOM
   * and nothing measured.
   *
   * Only the bottom margin is expanded — the chapter is the last thing in the document and is always
   * approached from above. `timings.rootMargin`, derived from `story.afterTheFilm.work.fetchedWithin`.
   *
   * Where there is no observer at all the fragment is fetched immediately. That is the honest fallback: one
   * document costs less than the chapter's centrepiece being an empty frame.
   */
  useEffect(() => {
    if (work.fragment === null) return
    const box = frame.current
    if (box === null || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }

    const watch = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setNear(true)
        watch.disconnect()
      },
      { rootMargin: timings.rootMargin, threshold: 0 },
    )

    watch.observe(box)
    return () => watch.disconnect()
  }, [work.fragment])

  return (
    <div className="act-frame" ref={frame} data-work={arrived ? 'here' : 'coming'}>
      {/*
        The aperture's own layer, and the only thing it does is clip. The printing transform lives on the
        parent, so the two never share a coordinate space — a clip is applied before its own element's
        transform, and nesting is what keeps the reveal and the contraction from interfering.
      */}
      <div className="act-shot">
        {/*
          The fragment. Fetched as the chapter approaches and never keyed on anything else, so it is
          mounted once and never remounted: the document behind the aperture is continuous from the moment
          it lands to the moment the visitor leaves the page.

          `title` is the work's own name, so a screen reader announcing the frame says what is in it.
          `loading` is deliberately absent — the observer above decides when this exists, and a second
          opinion from the browser's own lazy heuristic would only be able to delay it.
        */}
        {near && work.fragment !== null && (
          <iframe
            className="act-work"
            src={work.fragment}
            title={work.title}
            onLoad={() => setArrived(true)}
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}

        {/*
          **The light leaving the room and coming back, and it is inside the aperture on purpose.**

          It has to fall on the work and on nothing else. Outside the clip it would cover the whole stage,
          which means dimming the chapter's own paper before the aperture has opened anything and dimming
          the plate's margins while they are being printed — and a page whose margins darken is not a page
          being printed, it is a light being turned off in front of one.

          There is **one stage**, not two, and that is a correction rather than a simplification. Chapter I
          uses a single black layer over its footage and two layers for the dawn, and the difference is what
          the ground is: a cross-fade between two *neutral* grounds passes through neutral grey at its
          midpoint, and a photograph is not neutral. §52's act inherited the warm wash from a version whose
          ground was paper; over golden-hour photography the same wash is a beige veil that lifts the
          shadows and mutes the colour, which is `04-visual-language.md` §3 exactly backwards — the studio
          painting on the material it is supposed to be holding. Measured on screen and removed.
          `decisions.md` §53.
        */}
        <div className="act-dark" aria-hidden="true" />
      </div>
    </div>
  )
}
