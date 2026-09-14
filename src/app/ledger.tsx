'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '@content'
import WorkFragment from './fragment'

/**
 * **The Ledger.** One persistent rail, and the site's whole navigation.
 *
 * V2 §6: *"A single persistent rail, 132px, present from state 08 onward and never re-created."* The
 * storyboard is more precise about the front of it — *"present from frame one, unlit until the dock"* —
 * and §2's Ledger column settles the two: through states 01–07 the rail carries the **mark alone**, and
 * at state 08 the **index is drawn**. Both are true of this element, because it is one element from the
 * first frame to the last and only its state changes.
 *
 * It replaces the masthead, which was the same idea with a shorter life: a band that stepped into
 * existence at Chapter III and carried four words. `implementation-reconciliation.md` C2.
 *
 * ## It has no opinions
 *
 * Everything the rail shows is a projection of **where the film is**. `scroll-stage.tsx` writes the
 * state and the properties derived from it — `--lunlit`, `--lindex`, the three chapter ticks and the
 * five destination depths — and this file renders five words and reads none of them. There is no
 * timing here, no position, and no threshold: `src/motion/spine.ts` decides what a state means and
 * `globals.css` decides what it looks like.
 *
 * ## The one piece of state on the site
 *
 * The Work aside, and it is the only thing in the project that is not a pure function of scroll
 * position. V2 is explicit that this is the exception rather than an oversight — §3's fourteenth row is
 * the only junction *"caused by the visitor"*:
 *
 *   *"Work is not a page you go to. It is the film, paused and indexed… Clicking WORK does not
 *   navigate; it pulls the register out of the margin along that rule, over the frame the visitor was
 *   already in."*
 *
 * So it is one boolean, held here and published as `data-aside` on the root, and everything else —
 * the rule extending, the register riding out on it, the film dimming two stops, the chapter ticks
 * withdrawing — is the stylesheet reading that one attribute. Nothing about the film changes: it is
 * still a pure function of scroll beneath the scrim, which is what makes *"the film resumes where it
 * was left"* true by construction rather than by bookkeeping.
 */
export default function Ledger() {
  const [open, setOpen] = useState(false)
  const door = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  /*
    Published on the root rather than kept here, because what reacts to it is the film — the scrim over
    it, and the ticks withdrawing from a rail that is a sibling of neither. One attribute, read by the
    stylesheet, in exactly the way `data-opening` is.
  */
  useEffect(() => {
    const root = document.documentElement
    root.dataset.aside = open ? 'open' : 'closed'
    return () => {
      delete root.dataset.aside
    }
  }, [open])

  /*
    Escape closes, and focus goes back to the word that opened it. The way back is the way in reversed,
    which is what `reversible` means in §3's own row.
  */
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      door.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const { destinations, register } = site.ledger
  const work = site.three.work

  return (
    <>
      {/*
        The rail. Its mark stands at `--mark-x` / `--mark-y` — exactly where the masthead's did, and
        exactly where `.mark-anchor` is — because the travelling word lands on it and the handoff is a
        step rather than a cross-fade. The travel is measured from the rendered layout rather than
        authored, so the rail could move and the word would follow; it does not move, and this is why.
      */}
      <div className="ledger">
        {/*
          **The mark is the chapter's running head, set as type — `III — Studio`.**

          Adopted from the promotion prototype on the design owner's direction, 6 September 2026. It was
          three drawn strokes that `TIMING.dock` lay down and stacked into a mark: the numeral became a
          horizontal bar group in the corner, which reads as the most generic interface object there is
          set on a cinematic photograph. It said *menu* where the film had spent seven hundred viewport
          heights earning *chapter*.

          Type says both. `III` files the page, `Studio` names who made it, and neither has to be
          decoded. The numeral is the chapter's own, still taken from `site.mark.numeral` so the count is
          never written down here.

          **The numeral steps back a value and the tie further still.** At equal ink the head reads as
          two words of the same rank, which makes the numeral a title — and it is not a title, it is the
          running head a book puts in the corner. The studio is the protagonist of its own arrival, and
          a dash is punctuation.

          `site.mark.label` is no longer only an accessible name: it is the word on the rail. The link
          keeps its own name from the visible text, so the `a11y` span is gone with the strokes.
        */}
        <a className="marker" href={`#${site.mark.to}`}>
          <span className="mark-num" aria-hidden="true">
            {site.mark.numeral}
          </span>
          <span className="mark-tie" aria-hidden="true">
            {'—'}
          </span>
          <span className="mark-lab">{site.mark.label}</span>
        </a>

        <nav className="ledger-index" aria-label={site.mark.label}>
          <ul>
            {destinations.map((destination) => (
              <li key={destination.id}>
                {/*
                  The leader rule, and it is the affordance rather than decoration. §6: *"Rule length
                  encodes depth. The active destination's leader is longest; unvisited destinations show
                  no rule at all."* Its length is `--l1` … `--l5`, written by the driver from the spine.
                */}
                <i className="ledger-rule" aria-hidden="true" />
                {destination.to === null ? (
                  <button
                    ref={door}
                    className="ledger-word"
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpen((was) => !was)}
                  >
                    {destination.word}
                  </button>
                ) : (
                  <a className="ledger-word" href={`#${destination.to}`}>
                    {destination.word}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/*
        **The register.** Not a page — the film, paused and indexed, drawn out of the margin over the
        frame the visitor was already in.

        One entry, and it is Chapter III's own work: *Featured — plays as Chapter III* means these are
        the same project, so nothing about it is described twice. The second slot is schema only and is
        not drawn — *"never as an empty card"* — which is V2 arriving at `decisions.md` §46's conclusion
        from the other side.
      */}
      <button className="register-scrim" type="button" aria-label={register.back} onClick={close} />

      <div
        className="register"
        role="dialog"
        aria-modal="true"
        aria-label={register.label}
        inert={!open}
      >
        <p className="register-label">{register.label}</p>
        <p className="register-note">{register.note}</p>

        {/*
          **The live work, and it lives here and nowhere else.**

          `final-design-spec.pdf` §11.1: the work surface is an additive layer *above* an environment
          that keeps running beneath it and is never unmounted, and it *"is not a step in the
          fourteen-state sequence"*. So it is mounted by the aside being open and unmounted by it being
          closed — which is what `{open && …}` says, and the whole of what makes *"mounts when Work is
          opened, unmounts when Work is closed"* true without anything being remembered.

          Nothing is fetched before the press. The film underneath is untouched: it is still a pure
          function of scroll position beneath the scrim, which is why *"the film resumes where it was
          left"* is true by construction rather than by bookkeeping.
        */}
        {open && <WorkFragment />}

        <div className="register-entry">
          <p className="register-featured">{register.featured}</p>
          <p className="register-title">{work.title}</p>
          <p className="register-context">
            {work.context.note.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          {/*
            The one outward action, and it is the same offer the act makes on the paper beneath the
            plate — one line, one destination, composed and inert while there is nowhere to go.
          */}
          {work.url === null ? (
            <p className="register-open" aria-disabled="true">
              {work.cta}
            </p>
          ) : (
            <a className="register-open" href={work.url} target="_blank" rel="noreferrer">
              {work.cta}
            </a>
          )}
        </div>

        <button className="register-back" type="button" onClick={close}>
          {register.back}
        </button>
      </div>
    </>
  )
}
