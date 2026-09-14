'use client'

import { useEffect, useState } from 'react'
import { site, projects } from '@content'
import { TIMING } from '@/motion'


/**
 * **The Work — what the studio actually makes, one experience at a time.**
 *
 * Added 7 September 2026 on the design owner's direction; the record is
 * `docs/design/v2/implementation-reconciliation.md` C13.
 *
 * ## Why this holds a clock, and why that is not a violation
 *
 * `CLAUDE.md`'s driving rule is C8: **scroll owns progression; time owns only what the visitor did not
 * cause.** The visitor's progress *through* the page is scroll and stays scroll — this component does
 * not move the page, is not pinned, and publishes nothing the driver reads.
 *
 * What changes here is **which experience is on show**, and the visitor did not cause that. The design
 * owner ruled it explicitly: *"o scroll NÃO deve scrubbar o conteúdo do carousel."* Scrubbing the
 * content with the same gesture that scrolls the page makes the work a function of how fast someone
 * flicked, and makes the section unreadable in both directions. So it is a clock, and it joins the
 * three other things C8 allows one: the Hero's arrival, the Work aside, and interface response.
 *
 * ## It runs only while the Work is on screen
 *
 * It watches `data-work` on the root — the driver's own answer to *is this section composed* — with a
 * `MutationObserver`. The carousel advances while the Work is on screen and is otherwise stopped at its
 * first experience, so re-entering the section always begins on `venice`, the plate the film's own last
 * frame already is.
 *
 * **`--state` is the wrong gate and was the second attempt.** The Work is composed across the tail of
 * junction 08 → 09, where the state is still 8, so gating on state 9 left the clock stopped for eleven
 * seconds of parking inside the section. Measured in Chrome.
 *
 * **An `IntersectionObserver` cannot do this and was the first attempt.** `.v2` is a *fixed* layer, so
 * `.v2-work` intersects the viewport from the first frame of the session whatever the scroll position
 * is: the clock started at page load and the section opened on `Art experiences` instead of on the
 * photograph the film had just ended on. Measured in Chrome.
 *
 * Watching the state is not the carousel being scroll-driven. Scroll owns **entry and exit** of the
 * section, which is what the design owner reserved for it; which experience is showing is the clock's.
 *
 * ## What it is not
 *
 * **No dots, no pagination, no thumbnails, no cards, no slider arrows.** The design owner's list, and
 * it is a list of things that would make this a component. What the visitor sees is one line of type
 * changing under a label that does not, and a photograph changing under it — an exhibition moving to
 * the next room, not an interface advancing.
 *
 * `See full experience →` is a way **in**, never a way forward. It does not advance anything.
 */
export default function WorkExperiences() {
  const { makes } = site.three.work
  const [at, setAt] = useState(0)
  const [live, setLive] = useState(false)

  /*
    Whether the film is standing in state 09 — the Work. `data-film-state` is written by the driver and
    is the only thing this component reads about the page; see the note above for why an
    `IntersectionObserver` gives the wrong answer on a fixed layer.

    Leaving the state resets to the first experience, so arriving in the Work always lands on the image
    already on screen — never mid-cycle, and never on a photograph the visitor has not been walked into.
  */
  useEffect(() => {
    const root = document.documentElement
    const read = () => {
      const here = root.dataset.work === 'on'
      setLive(here)
      if (!here) setAt(0)
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['data-work'] })
    return () => mo.disconnect()
  }, [])

  /*
    The clock. One interval, cleared whenever the section leaves — so nothing is running while the
    visitor is elsewhere on the page, and a reduced-motion visitor gets the first experience and no
    cycle at all.
  */
  useEffect(() => {
    if (!live) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    const id = window.setInterval(
      () => setAt((n) => (n + 1) % makes.experiences.length),
      TIMING.work.carousel.holds,
    )
    return () => window.clearInterval(id)
  }, [live, makes.experiences.length])

  /*
    ── The ground ────────────────────────────────────────────────────────────────────────────────

    **The photograph is the Environment's, not this component's.** `--exp-src` and `--exp-at` are
    written on the root and `.env-plate-experience` draws them; the carousel decides *which* experience,
    and the Environment stays the one thing that owns the ground.

    The first experience is `venice`, which the Environment is already showing at state 09 — so this
    layer stays transparent for it. That is what makes the entry into the Work a bridge and not a
    cross-fade: there is nothing to fade into, because the photograph the section arrives on is the
    photograph the film ended on.

    Drawing it inside the film layer was the first attempt and it was wrong: `.v2` is at 0.84 by the
    time the Work is composed, so the plate composited over the ground rather than being one and venice
    showed through. Measured in Chrome.
  */
  useEffect(() => {
    const root = document.documentElement
    const id = makes.experiences[at] as keyof typeof projects
    const first = at === 0
    root.style.setProperty('--exp-at', first ? '0' : '1')
    if (!first) root.style.setProperty('--exp-src', `url(${projects[id].plate})`)
  }, [at, makes.experiences])

  return (
    <>
      {/*
        ── The editorial block ──────────────────────────────────────────────────────────────────────
        label → idea → action, and the hierarchy is the reading order.

        The label and the offer are fixed. Only the middle line changes, which is what makes this read
        as one line of type being revised rather than as a slide advancing.
      */}
      <div className="v2-work-type">
        <div className="v2-make">
        <p className="v2-make-label">{makes.label}</p>

        {/*
          The category, and it is the protagonist. A stack rather than a sequence: every experience is
          absolutely positioned on the same origin, so the block's height is the tallest of them and the
          label above and the offer below cannot shift when it changes. Laying them out in flow would
          make the composition a function of which word happens to be lit.
        */}
        <span className="v2-make-slot">
          {/*
            An invisible copy of the longest category, in flow, so the slot has a real box before any
            live one is lit. The same construction the sentence's survivor used, and for the same
            reason: layout must not depend on state.
          */}
          <span className="v2-make-ghost" aria-hidden="true">
            {makes.experiences
              .map((id) => projects[id as keyof typeof projects].category)
              .reduce((a, b) => (b.length > a.length ? b : a))}
          </span>
          {makes.experiences.map((id, i) => (
            <span
              key={id}
              className="v2-make-word"
              data-lit={at === i ? '1' : '0'}
              aria-hidden={at === i ? undefined : true}
            >
              {projects[id as keyof typeof projects].category}
            </span>
          ))}
        </span>

        {/*
          The offer. One line for the whole section — a way into the experience that is showing, never a
          way to the next one.

          **It stands on every experience and is inert where there is no work behind it yet.** Dropping
          the line entirely was the first attempt and it was wrong twice over: the block lost its third
          row whenever `Art experiences` was showing, so the composition changed height and rhythm with
          the content, and the section stopped saying the same thing about both. `contact.write.address`
          and `three.work.url` set the convention — the line renders composed and does not promise a
          press it cannot honour.
        */}
        {(() => {
          const url = projects[makes.experiences[at] as keyof typeof projects].experienceUrl
          return url === null ? (
            <p className="v2-make-cta" data-inert="">
              {makes.cta}
            </p>
          ) : (
            <a className="v2-make-cta" href={url} target="_blank" rel="noreferrer">
              {makes.cta}
            </a>
          )
        })()}
      </div>

        {/*
        ── The identification ───────────────────────────────────────────────────────────────────────
        Who and what the photograph is. Lower right, small, and deliberately not competing with the
        block on the left: a caption on a picture rather than a title over it.

        It carries the experience that is showing, so the metadata and the image can never disagree —
        the old composition read `context` off `activeProject` and would have kept a wedding's date
        under a painter's photograph.
      */}
        <div className="v2-ident">
        {makes.experiences.map((id, i) => {
          const project = projects[id as keyof typeof projects]
          return (
            <div key={id} className="v2-ident-set" data-lit={at === i ? '1' : '0'}>
              <p className="v2-ident-name">{project.context.identity}</p>
              {project.context.meta.map((line) => (
                <p className="v2-ident-line" key={line}>
                  {line}
                </p>
              ))}
            </div>
          )
        })}
        </div>
      </div>
    </>
  )
}
