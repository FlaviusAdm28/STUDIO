'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '@content'
import { states, stateOf } from '@/motion/spine'
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
 * ## Option A — Re-setting
 *
 * Adopted 17 September 2026 on the design owner's direction, from `prototypes/the-folio` direction A.
 * `III — Studio` is gone and so are the leader rules; what stands in the margin is a **running header
 * with its folio, and the chapters that are not running listed under it**:
 *
 *     01
 *     Work
 *
 *     ABOUT
 *     METHOD
 *     QUESTIONS
 *     CONTACT
 *
 * The three registers are the Work section's own, turned into a column — the folio in the eyebrow's
 * voice, the chapter at reading size in Cormorant, the rest as tracked capitals. It reads as the same
 * publication rather than as navigation bolted onto one.
 *
 * ## It still has no opinions
 *
 * **Which chapter is running is the spine's, not this file's.** `scroll-stage.tsx` already publishes
 * `data-film-state` on the root — it was added for the Work's carousel — and `spine.ts`'s
 * `ledger.active` says which destination each state lights. So the rail watches one attribute and asks
 * the spine; it does not read scroll, hold a threshold, or know what a junction is. Nothing was added
 * to the driver for this.
 *
 * ## The one thing that makes the exchange possible
 *
 * The five keep one canonical order and the list is that order **with the running chapter taken out**.
 * Which means moving from one chapter to the next changes *exactly one row*: the row standing at the
 * arriving chapter's own index now holds the departing one, and the rest do not move, reflow or
 * redraw. Nothing has to travel across the composition for the exchange to read — three slots
 * substitute in place, and the whole apparent recomposition is three words changing on fixed axes.
 *
 * Each slot therefore holds **two settings on one origin**: the arriving one and the departing one.
 * `globals.css` makes the promoted word grow and the demoted word shrink, in both places at once, so
 * what is legible is a change of rank. `TIMING.publication.chapter` holds the durations; there is no
 * time in this file.
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
type Destination = (typeof site.ledger.destinations)[number]

/** A slot's two settings, and what each of them is doing. `globals.css` reads the roles. */
type Role = 'promote' | 'demote' | 'plain'
type Slot = { now: string; was: string | null; roleIn: Role; roleOut: Role; nonce: number }

/** The whole composition: which chapter is running, its two head slots, and the four rows. */
type Rail = {
  running: Destination | null
  folio: Slot | null
  title: Slot | null
  rows: ReadonlyArray<{ destination: Destination; slot: Slot }>
}

const EMPTY: Rail = { running: null, folio: null, title: null, rows: [] }

/**
 * One substitution. A slot that is already showing the right word is **returned unchanged** — same
 * object, same `nonce` — so React leaves its nodes alone and the three rows that did not change are
 * not re-created and cannot re-animate. That identity is what makes *only one row moves* true in the
 * DOM rather than only in the description.
 */
const step = (held: Slot | undefined | null, next: string, roleIn: Role, roleOut: Role): Slot => {
  if (held && held.now === next) return held
  return {
    now: next,
    was: held ? held.now : null,
    /* The first setting of a slot is an arrival, not an exchange, and carries no role. */
    roleIn: held ? roleIn : 'plain',
    roleOut: held ? roleOut : 'plain',
    nonce: (held?.nonce ?? 0) + 1,
  }
}

/** The first state that lights a destination — the dock, and the chapter the rail is born as. */
const FIRST_LIT = states.find((state) => state.ledger.active !== null)?.id ?? 0

/**
 * **Which chapter the film is in**, and before the dock the one it is about to be.
 *
 * `spine.ts`'s `ledger.active` is the only thing that decides this. The rail asks; it does not know.
 */
function runningAt(state: number, all: readonly Destination[]): Destination | null {
  const active = stateOf(state)?.ledger.active
  const named = all.find((d) => d.id === active)
  if (named) return named

  /*
    **Before the dock there is no running chapter, and the rail is still the chapter it is about to
    be.** V2 §6 gives the Ledger one lifetime — *"present from frame one, unlit until the dock, never
    re-created"* — and returning `null` here broke it: the markup did not exist until state 08, and
    `--rail-draw` reaches 1 at state 08. So the wipe that is supposed to draw the rail ran from y 12800
    to y 13800 against an empty DOM, and the finished block appeared at y 15200 in a single frame.
    Measured in Chrome; it is the same fault the `--handoff` step had, and the same 1,400px of authored
    reveal spent behind a closed shutter.

    Falling back to the first chapter that is ever named puts the rail in the document from the first
    frame, which is where §6 says it belongs. It is invisible and unclickable until the dock draws it —
    `.ledger-rail`'s `clip-path` gates hit-testing as well as paint — and the chapter it is born as is
    the one state 08 is about to make running, so nothing is claimed that does not come true.
  */
  return all.find((d) => stateOf(FIRST_LIT)?.ledger.active === d.id) ?? all[0] ?? null
}

/**
 * **The composition, as a pure function of the previous one and the running chapter.**
 *
 * The list is the canonical order with the running chapter taken out, so the row that changes is the
 * arriving chapter's own index and the rest are returned untouched.
 *
 * The roles are read off the **words**, not off the direction of travel, and that is what makes an
 * arbitrary jump behave as correctly as a step: a row whose arriving word is the one that just left
 * the header is a demotion wherever it came from, and a row whose departing word is the one now in the
 * header is a promotion. Any other row that happens to change — which only occurs when the film skips
 * chapters — is neither, and exchanges on ink alone.
 */
function compose(prev: Rail, running: Destination | null, all: readonly Destination[]): Rail {
  if (!running) return prev.running === null ? prev : EMPTY

  const listed = all.filter((d) => d.id !== running.id).slice(0, 4)
  const wasHeader = prev.running?.word ?? null

  return {
    running,
    folio: step(prev.folio, running.folio, 'promote', 'demote'),
    title: step(prev.title, running.word, 'promote', 'demote'),
    rows: listed.map((destination, i) => {
      const held = prev.rows[i]?.slot
      return {
        destination,
        slot: step(
          held,
          destination.word,
          wasHeader !== null && destination.word === wasHeader ? 'demote' : 'plain',
          held?.now === running.word ? 'promote' : 'plain',
        ),
      }
    }),
  }
}

/**
 * One slot. Two settings on one origin, the box declared by the column rather than by the word, so a
 * longer setting can leave while a shorter one arrives and nothing in the composition twitches.
 *
 * The caller keys it on `nonce`, and that is what restarts the animation: React replaces the whole
 * slot, so both CSS animations begin at their first frame again and a fast pass through several states
 * cannot leave one half-played.
 */
function RailSlot({ slot, className }: { slot: Slot; className: string }) {
  /*
    **The departing setting is removed once it has gone, not left at zero.** An element at `opacity: 0`
    is still text: find-in-page matches it, a text extraction reads it, and a rail that has been through
    five chapters would otherwise hold ten words where five are drawn. The slot is keyed on `nonce` by
    its caller, so this resets to `false` the moment the slot changes again.
  */
  const [spent, setSpent] = useState(false)

  return (
    <span
      className={`rail-slot ${className}`}
      data-swap={slot.was === null ? undefined : ''}
      data-in={slot.roleIn}
      data-out={slot.roleOut}
    >
      <span className="rail-set rail-in">{slot.now}</span>
      {slot.was !== null && !spent && (
        <span
          className="rail-set rail-out"
          aria-hidden="true"
          onAnimationEnd={() => setSpent(true)}
        >
          {slot.was}
        </span>
      )}
    </span>
  )
}

export default function Ledger() {
  const [open, setOpen] = useState(false)
  const door = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  /*
    ── Which chapter is running ──────────────────────────────────────────────────────────────────

    One attribute, watched. `data-film-state` is the driver's own answer to *where is the film*, and it
    is written guarded — only when the number actually changes — so this observer fires once per state
    and not sixty times a second. `spine.ts` turns that into a destination; this file does not decide
    the sequence, it renders it. Nothing was added to the driver for any of this.
  */
  const [filmState, setFilmState] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    const read = () => setFilmState(Number(root.dataset.filmState ?? 0))
    read()
    const watch = new MutationObserver(read)
    watch.observe(root, { attributes: true, attributeFilter: ['data-film-state'] })
    return () => watch.disconnect()
  }, [])

  const { destinations, register } = site.ledger

  /*
    ── The composition, adjusted when the film moves ─────────────────────────────────────────────

    A slot's previous setting is the only history the rail keeps, and it has to be *state* rather than
    a ref: React's own rule is that history read during render is a fault, and it is right — a ref read
    while rendering can hand back a value from a render that was thrown away.

    So this is React's documented **adjust-state-during-render** pattern: the last state this component
    composed for is held beside the composition, and when the film has moved the next composition is
    derived from the previous one and set immediately. React re-renders before anything is painted, so
    there is no extra frame and no flash of a stale rail. Deriving it in an effect instead would be a
    cascading render, which is the other thing the linter is right about.
  */
  const [rail, setRail] = useState<Rail>(EMPTY)
  const [composedFor, setComposedFor] = useState(-1)

  if (composedFor !== filmState) {
    setComposedFor(filmState)
    setRail((prev) => compose(prev, runningAt(filmState, destinations), destinations))
  }

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

  const work = site.three.work

  return (
    <>
      {/*
        ── THE RAIL · Option A, Re-setting ───────────────────────────────────────────────────────

        One block, one lifetime, and it is drawn once — `.ledger-rail`'s wipe on `--rail-draw` is
        unchanged from the mark it replaces, so the rail still arrives at the dock, top to bottom, and
        still cannot be clicked before it has been drawn. What arrives is different; when it arrives is
        not, and that was deliberate: 07 → 08 is §3's *decompose*, and the composition standing in for
        the index does not change the junction's verb.

        Before the dock `stateOf(...).ledger.active` is `null` for every state, so there is no running
        chapter and the rail renders nothing at all. That is the same silence the mark used to keep,
        arrived at from the spine rather than from an opacity.
      */}
      <div className="ledger">
        <div className="ledger-rail">
          {rail.running && rail.folio && rail.title && (
            <p className="rail-head">
              {/*
                The folio, in the eyebrow's register. It orients and it is never read first — the same
                voice `WHAT WE ACTUALLY MAKE` is in, doing the same job on the other side of the frame.
              */}
              <RailSlot key={rail.folio.nonce} slot={rail.folio} className="rail-folio" />

              {/*
                The running chapter, at reading size in the serif.

                **It is a door only where the door is.** §6's Work is not a place — `to` is `null` and
                pressing it pulls the register out over the film — so when Work is the running chapter
                the header *is* that press, and there is nowhere else for it to be. Every other chapter
                is where the visitor already is, and a link to it would point at itself; so it is set as
                type and nothing more. The one word that can be pressed here is the one word that has
                somewhere to go.
              */}
              {rail.running.to === null ? (
                <button
                  ref={door}
                  className="rail-title rail-door"
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpen((was) => !was)}
                >
                  <RailSlot key={rail.title.nonce} slot={rail.title} className="rail-title-slot" />
                </button>
              ) : (
                <span className="rail-title" aria-current="true">
                  <RailSlot key={rail.title.nonce} slot={rail.title} className="rail-title-slot" />
                </span>
              )}
            </p>
          )}

          {rail.running && (
            <nav className="ledger-index" aria-label={site.mark.label}>
              <ul>
                {rail.rows.map(({ destination, slot }, i) => (
                  <li key={`slot-${i}`}>
                    {destination.to === null ? (
                      <button
                        ref={door}
                        className="ledger-word"
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpen((was) => !was)}
                      >
                        <RailSlot key={slot.nonce} slot={slot} className="rail-word-slot" />
                      </button>
                    ) : (
                      <a className="ledger-word" href={`#${destination.to}`}>
                        <RailSlot key={slot.nonce} slot={slot} className="rail-word-slot" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
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
