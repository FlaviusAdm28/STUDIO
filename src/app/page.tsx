import { site, where } from '@content'
import Environment from './environment'
import Ledger from './ledger'
import Opening from './opening'
import Publication from './publication'
import Reveal from './reveal'
import States from './states'
import ScrollStage from './scroll-stage'

/**
 * The film, and then the studio's own pages.
 *
 * **The film** is one continuous shot in two pinned frames. The hero, the light going out of it, the
 * chapter marker over the last of the image, a wait, the statement, the dark; then the light coming back,
 * the word travelling into the corner to become a mark, and the mark uncovering the work. Nothing ever
 * scrolls past anything inside it, so there is no section boundary anywhere to notice, and Chapter IV is
 * its last word: typography on paper, saying that there is one experience.
 *
 * **Then it releases into a publication** — `publication.tsx`, in ordinary document flow, at reading size.
 * That handover is the one thing this file composes rather than delegates, and it is composed out of three
 * absences: no pinned frame, no numeral, and nothing that performs. What marks it is the register — the
 * type stops speaking and starts being read. `decisions.md` §54.
 */
export default function Home() {
  return (
    <main>
      {/*
        Without scripting there is no scroll to time the shot with, so the shot is laid out flat
        instead: the hero composed as it ends, then the marker, then the statement, in that
        order. Not the shot with its parts removed — the same things, told down the page.
        `05-storyboard.md` §10.
      */}
      <noscript>
        <style>{`
          .film { height: auto; }
          .stage { position: static; height: auto; }
          .env-hero { opacity: 1 !important; }
          /*
            The V2 state layer is one held frame driven by scroll, and here there is no scroll to drive
            it. So it is told down the page instead: the hero as it ends, then the chapter, then the
            thesis, then the three occasions — the same things in the same order, with the transformation
            between them removed rather than the content. 05-storyboard.md §10.
          */
          .v2 { position: static; height: auto; display: grid; gap: 8vh;
            padding: 18vh 8vw; background: #050504; }
          .v2-scrim, .v2-dark { display: none; }
          .v2-time, .v2-title, .v2-sub, .v2-of, .v2-numeral, .v2-topic, .v2-thesis, .v2-stack {
            position: static; transform: none !important; opacity: 1 !important; }
          .v2-time { width: auto; height: auto; text-align: left; }
          .v2-time span { position: static; }
          .v2-time-blend { display: none; }
          .v2-time-floor { color: rgba(255,246,230,.66); }
          .v2-title { white-space: normal; font-size: clamp(2rem, 9vw, 5rem); }
          /*
            The survivor is a device of the transformation and there is no transformation here, so it
            stands down: the ghost stops being a spacer and says the word itself, which is what puts
            Chapter One back on one line. Without this the vehicle is still absolutely positioned —
            against whatever ancestor is left positioned once the stage goes static — and it lands as a
            second, stray Chapter over the top of the page.
          */
          .v2-ghost { visibility: visible; }
          .v2-word { display: none; }
          /*
            State 06's survivor stands down the same way, and for the same reason.

            The sentence and the word that escapes it have the identical construction: a hidden ghost
            holding the word's place in the line, and an absolutely positioned vehicle that carries
            the word — and the numeral's slot — out of it. With no scroll there is no escape to
            perform, so the vehicle is removed and the ghost says the word: the line reads
            "Some moments deserve another chapter." whole, in flow, in its place in the order.

            It also has to be told to lay out in flow, which the block above never covered. Left
            absolute while .v2 is static, .v2-some resolves against the initial containing block
            rather than against the frame, and the numeral's slot — 96px of tracked III at the
            sentence's own size — reached 46px past the right edge and gave the composed page a
            horizontal scrollbar. Measured at 752 x 873 against next start.
          */
          .v2-some { position: static; transform: none !important; opacity: 1 !important;
            width: auto; white-space: normal; text-align: left; }
          .v2-chapter-slot { position: static; }
          .v2-chapter-ghost { visibility: visible; }
          .v2-chapter { display: none; }
          /*
            One optical centre is a composition inside a frame, and there is no frame. The stack is a
            list instead, in arrival order, at the three sizes the spec gives it — the hierarchy is what
            survives, which is what the preservation order asks for.
          */
          .v2-occasion { position: static; transform: none !important; opacity: 1 !important;
            margin: 0 0 1.5vh; }
          /*
            The environment is one fixed element behind the page and the plates are chosen by a property
            nothing writes without scripting. So it holds its first frame: the hero, lit, which is the
            ground Chapter I is composed on. The other two layers are not drawn at all rather than drawn
            at an arbitrary presence — the same answer the leader rules get above.

            **And it stops being fixed.** Fixed, the footage stands behind the whole document, and the
            flat layout puts Chapter II's statement and its four occasions straight onto it — white type
            over a photograph, where the shot puts them on black. Absolute and one viewport tall, it is
            behind the hero and nothing else, the cards fall back onto the ground body paints, and the
            composed alternative is the one the shot actually composes. 05-storyboard.md §10 — the same
            things, told down the page, never the mechanism with its parts removed.
          */
          .environment { position: absolute; height: 100dvh; }
          .env-plate-hero { opacity: 1 !important; }
          .env-plate-venice, .env-plate-studio, .env-ground { display: none !important; }
          .card { position: static; padding: 22vh 8vw; }
          .card-close { opacity: 1 !important; }
          .close-lead, .close-another, .mark-word, .mark-stop { opacity: 1 !important; }
          /*
            No scroll, so the mark cannot rewrite itself. It reads as the chapter line it starts as,
            which is the same answer the travelling word gets below: the initial form, whole, and the
            part that only exists after a transformation left out rather than stacked on top of it.
          */
          .mark { transform: none !important; }
          .mark-label { display: none !important; }
          .mark-slot { display: none !important; }
          .dawn, .dawn-warmth { display: none; }
          .card-act-three { background: var(--paper); }
          [data-reveal] { opacity: 1 !important; transform: none !important; }
          /*
            These are measured against a pinned frame that does not exist here — the shot is laid out
            flat instead, so Chapter III simply follows it and the marker simply stands at its corner.
            Left in, the chapter would be pulled up through the end of the film and its opening frame
            would be invisible, since nothing writes --studio without scripting. (No backticks in
            here — this block is a template literal.)
          */
          .chapter-three { margin-top: 0; }
          /*
            The Ledger is a rail over a pinned frame, and there is no pinned frame here — so it stops
            being fixed and becomes what it is on paper anyway: the head of the page, printed once at the
            top of it. Nothing is clipped, because nothing is stepped into place, and the index is simply
            drawn: without scripting there is no state to be unlit at.

            The rules encode depth and depth is a scroll position, so they are not drawn at all rather
            than drawn at one arbitrary length. The words are the navigation; the rules were never it.
          */
          .ledger { position: static; height: auto; flex-direction: row; flex-wrap: wrap;
            align-items: baseline; gap: clamp(1rem, 3vw, 2rem);
            width: auto; padding: var(--mark-y) var(--mark-x) 6vh;
            opacity: 1 !important; clip-path: none !important; }
          /*
            The mark docks on a junction and there is no junction here, so it holds the one form it can
            be sure of: the three strokes stacked, at the head of the rail, which is where they spend
            the whole of the site that has scrolling. Nothing writes --dock without scripting, so the
            travel, the fall and the tracking all resolve to their own zero — this states the landed
            form rather than leaving them upright and mid-flight.
          */
          .rail-head { display: flex; align-items: baseline; gap: .6rem; width: auto; }
          .rail-title { width: auto; margin-top: 0; font-size: 1.25rem; }
          .rail-set { transform: none !important; }
          .mark-stroke { transform: translateY(calc(var(--s-n) * var(--mark-size) * 0.34))
            rotate(90deg) !important; }
          .ledger-index ul { flex-direction: row; flex-wrap: wrap;
            gap: clamp(1.375rem, 2.4vw, 2.25rem); }
          .ledger-index li { opacity: 1 !important; }
          .ledger-index ul { margin: 0; }
          .ledger-word { width: auto; }
          /*
            The register is opened by a press and there is nothing here to press with. So the way into
            the work is the line the act already prints on the paper beneath the plate, which is the same
            offer — and the aside, which exists to keep the film running underneath, has nothing to keep
            running. 05-storyboard.md §10: the composed alternative, not the mechanism with its parts
            removed. (No backticks in here — this block is a template literal.)
          */
          .register, .register-scrim { display: none; }
          /*
            The act is one frame transformed by scroll, and here there is no scroll to transform it. So it
            is told down the page instead: the work, what it is, what the studio says about it, the way
            out. The same things, in the same order, without the transformation between them — never the
            transformation with its parts removed. 05-storyboard.md §10.
          */
          .act { height: auto; }
          .act-stage { position: static; width: auto; height: auto; display: grid; gap: 6vh;
            padding: 10vh var(--mark-x); }
          /*
            The work as a plate on the page rather than a frame uncovered in a film. Its own ratio, at the
            measure, with nothing over it: no aperture, no printing transform, and no light moving. The
            fragment is not fetched without scripting, so the plate is the chapter's own ground — which
            05-storyboard.md §10 already asks the atmosphere to degrade to. (No backticks in here — this
            block is a template literal.)
          */
          .act-frame { position: static; transform: none; }
          .act-shot { position: static; clip-path: none; aspect-ratio: 16 / 10; background: var(--ground); }
          /*
            The light is a narrative state and this page has one state: paper. Nothing to darken, and no
            dark part for type to stand in — so the type is set in the page's own ink instead.
          */
          .act-dark { display: none; }
          .act-said { position: static; width: auto; max-width: 34rem; opacity: 1 !important; }
          .act-says { display: grid; gap: 3vh; }
          .act-note, .act-voice { grid-area: auto; opacity: 1 !important; }
          .act-name { opacity: 1 !important; }
          .act-out { position: static; clip-path: none; }
          .act-open { opacity: 1 !important; }
          /* The disabled state is a more specific selector, so it has to be named to be overridden. */
          .act-open, .act-open[aria-disabled='true'] { color: var(--ink-quiet); }
          .act-voice, .act-name, .act-note { color: var(--ink); text-shadow: none; }
          /*
            The publication is ordinary flow and needs almost nothing here: its pages are covered by the
            [data-reveal] rule above, and the questions are a native disclosure that opens without
            scripting. Two exceptions.

            The head margin is not fixed in this version, so an anchor landing must not leave room for a
            band that is not there. (No backticks in here — this is a template literal.)
          */
          .page { scroll-margin-top: 0; }
          /*
            Contact's anchor is offset past its own junction in the scripted version, because the
            section sits at the top of a held frame and the composition resolves below it. Without
            scripting there is no frame and no junction, so the section is simply where it is and
            the offset would overshoot it. Named rather than left to .page above, because both
            selectors match this element and the rule is worth being able to find.
          */
          .page-last { scroll-margin-top: 0; }
          /*
            Questions arrives on three separate systems now, and without a driver every channel in
            all three is its zero fallback: the anchor on --qa and --qa-body, and the two FAQ groups
            on --qi1..6 for the ink and --qr1..6 for the hairlines. So the row, its rule and its type are all put
            back at full ink, in place, with nothing to arrive: the disclosure itself is native and
            still opens on the press. The rule has to be named too, because it is drawn with scaleX
            and an unset channel leaves the line at zero length as well as zero ink.
          */
          .ask { opacity: 1 !important; pointer-events: auto !important; }
          .ask-q, .ask-a { opacity: 1 !important; }
          .ask::before { opacity: 1 !important; transform: none !important; }
          /* No driver, no reading zone to stand through: the list is ordinary flow again. */
          .asked { position: static; max-height: none; overflow: visible; }
          .asked-hold::after { display: none; }
          .closing-frame { pointer-events: auto !important; }
          /*
            Contact writes itself on a clock the driver plays, so without one every part of it is its
            zero fallback. The frame is put back composed and pressable, at rest.
          */
          .contact-line, .contact-note, .contact-begin { --c: 1 !important;
            opacity: 1 !important; transform: none !important; }
          .page-last * { pointer-events: auto; }
          .page-last { pointer-events: auto !important; }
          /*
            And it is written in the publication's ink, which without a driver never crosses to light:
            the closing frame stands on paper like every other section here, or the address and the
            folio are dark type on the dark environment beneath it.
          */
          .closing { background: var(--paper); height: auto; padding-top: 30vh; }
          /*
            No junction to hold, so the frame is in flow: the rule, the question standing on it in the
            room above, and the address and the folio in a box below it the height of the frame they
            would have had.
          */
          .closing-frame { position: static; }
          .page-last { position: relative; top: auto; height: 60vh; }
          /*
            And About is a frame written by scroll position: its composition stands fixed in the viewport
            and arrives on the junction's own progress, so without scripting it would be pinned and empty.
            This is the composed alternative: the section in flow, everything present, in order, with the
            sequence removed rather than the content. 05-storyboard.md §10.
          */
          .about { height: auto; }
          .about-stage { position: static; opacity: 1 !important; display: grid; gap: 6vh;
            padding: 6vh var(--mark-x) 10vh var(--page-x); }
          .about-claim, .about-evidence { position: static; }
          .about [data-in] { opacity: 1 !important; transform: none !important;
            letter-spacing: var(--a-base-track, normal) !important; }
          /*
            And the method is a held frame driven by scroll position, so without scripting there is no frame
            and no choreography — only the first state of it, which is one line. So it is told
            down the page instead: the invitation, then each question with what the studio hears in the
            answer beside it, then the resolution. The same things, in the same order, with the space and
            the convergence removed rather than the content. 05-storyboard.md §10.
          */
          .method { height: auto; padding-top: 0; background-image: none; }
          .method-stage { position: static; height: auto; display: grid; gap: 4vh;
            padding: 6vh var(--mark-x) 0; perspective: none; background-image: none; }
          /* .method-label went with the label itself on 20 September 2026; the section is named by
             its landmark now, and a landmark needs no rule here. */
          .mgroup { position: static; display: block; }
          /*
            Everything the frame places is absolutely positioned and gated on its own arrival, and with
            no driver every one of those arrivals is its zero fallback. So the whole composition is put
            back into flow and lit: the lines, the margin note, the question and its
            footnote. The tracking goes back to each element's own rest value for the same reason the
            opacity does — the arrival opens it, and here nothing arrives.
          */
          .mask-block, .mnote, .mword, .mresolve { position: static; opacity: 1 !important;
            transform: none !important; }
          .mword, .mnote, .mask, .mquiet {
            letter-spacing: var(--w-track, normal) !important; }
          .mask-block { width: auto; }
          .mask { margin: 0 0 0.75vh; max-width: 32ch; font-size: clamp(1.25rem, 4vw, 1.75rem);
            color: var(--ink); }
          .mword { display: inline-block; margin-right: 1.25em; font-size: 1.0625rem;
            color: var(--ink-quiet); text-shadow: none; }
          .mnote, .mquiet { color: var(--ink-quiet); }
          .mresolve { width: auto; }
          /*
            The room never arrives here, so nothing is ever turned over: --mroom stays 0, every colour in the
            section resolves to the ink it is mixed from, and the ground stays the paper the publication is
            printed on. The ramp is switched off rather than left at zero alpha, because a gradient nobody
            can see is still a paint. (No backticks in here — this block is a template literal.)
          */
          .mresolve-answer { opacity: 1 !important; transform: none !important;
            font-size: clamp(1.75rem, 5vw, 2.5rem); color: var(--ink); }
          .mresolve-lines { opacity: 1 !important; transform: none !important; }
          /*
            And junction 13 to 14 is a held frame with Contact composed around a pinned rule, so without
            scripting there is no frame, no pin and no junction — every one of its opacities would stay at
            its zero fallback and the whole of Contact would be absent, which it already was before the
            frame existed. So the closing composition stands down to ordinary flow: the container gives up
            its runway, the frame stops sticking, and the section goes back to being a page with the rule
            above it. Everything present, in order, with the sequence removed rather than the content.
            05-storyboard.md §10.
          */
          .closing { height: auto; }
          .closing-frame { position: static; }
          /*
            width:100% was 100% of the container *plus* the rule's own left margin, so the line ran past
            the right edge and the document scrolled sideways — 62px at 1440 before the publication took
            its own origin, 236 after. width:auto lets the block fill what is actually left beside the
            two margins, which is what the scripted rule computes as well.
            (No backticks in here — this stylesheet is a template literal.)
          */
          .persist { position: static; width: auto; height: 1px;
            margin: 0 var(--mark-x) 0 var(--page-x); }
          .page-last { position: static; display: grid; row-gap: var(--part-gap);
            padding: var(--band-close) var(--mark-x) clamp(3.5rem, 9vh, 6rem) var(--page-x); }
          .page-last > * { position: static; left: auto; right: auto; top: auto; width: auto;
            opacity: 1 !important; }
          /*
            The chapter entry is a row anchored to the rule in the scripted version; in flow it is
            simply a line with a mark at each end, and the rule above it is the page's own again.
            (No backticks in here -- this stylesheet is a template literal.)
          */
          .chapter-entry { display: flex; align-items: baseline; gap: 0.85rem; }
          .page-terms > .page-note { opacity: 1 !important; }
        `}</style>
      </noscript>

      {/*
        **The Environment, and it is first because it is behind everything.**

        §11.1, locked: one element, mounted at the Hero, never unmounted, never re-sourced, never
        `display:none`. It holds the hero footage — which is why the footage is no longer inside
        `opening.tsx` — and the two stills, and a state changes only how present each of them is.

        Document order is half of what puts it behind the film and the publication; `z-index` in
        `globals.css` is the other half. It is not a child of any chapter, for the same reason the
        Ledger is not: it outlives all of them.
      */}
      <Environment />

      <ScrollStage />
      <Reveal />

      {/*
        The Ledger, and it stands outside the film because it outlives it. V2 §6 gives it one lifetime —
        present from the first frame, unlit until the dock, *"never re-created"* — so it cannot be a child
        of a chapter. It was the masthead, which stepped into being at Chapter III and stopped at four
        words; `implementation-reconciliation.md` C2 is why it is one rail now.
      */}
      <Ledger />

      {/*
        **The V2 state layer, 01 → 09.** `states.tsx` composes the first nine of V2's fourteen states
        from `final-design-spec.pdf` §2 and the storyboard's own frames, driven by the two properties C4
        publishes and by Chapter I's clock.

        **It is a sibling of the runways rather than a child of one**, and fixed to the viewport like the
        Environment. States 01–05 are priced on the film's runway and 09 on the act's, so a layer living
        inside either could not reach the other — and V2 is one continuous film, not two pinned frames
        with a seam. The runways below are now what they always really were: distance. This is the frame.

        It replaced the whole V1 presentation of this stretch — the three cards, the dawn, the travelling
        word, Chapter III's paper act. They are gone from the tree rather than hidden behind an opacity:
        `CLAUDE.md`'s revamp principle is that V1 composition is replaced, not layered under.
      */}
      <States />

      <section className="film">
        <div className="stage">
          <Opening />
        </div>
      </section>

      {/*
        Chapter III. The third act of the same film rather than a publication after it: one frame,
        transformed by scroll, in the same vocabulary the first two acts used — opacity, one curve, and
        the dark coming up over a photograph. `decisions.md` §46.
      */}
      <div className="chapter-three">
        {/*
          The act. One frame, held, and **the frame is the work** — so nothing ever scrolls past anything
          and there is no boundary between the work arriving, the work being named, what the studio makes
          of it, and the page it becomes. The same construction as `.film`, on a runway of its own.

          Three layers, and the order is the choreography:

            the work        the aperture opens it, the light falls on it and lifts again inside the same
                            clip, and the printing draws the whole thing in. It is the ground. `fragment.tsx`.
            what is said    the studio's type, composed into the work's own quiet band, above it
            the way out     printed on the paper, once there is paper — the only thing that can be pressed
        */}
        {/*
          **There is no `#work` any more.** It was an anchor placed at the beat the aperture finishes,
          because inside a pinned frame a place in the story is a scroll offset. V2 §6 makes Work an
          aside rather than a destination — *"Clicking WORK does not navigate"* — so there is nothing to
          point at and `--work-at` went with it. `implementation-reconciliation.md` C2.
        */}
        {/*
          `data-segment` is the **position model's** hook and it is deliberately not a class. The driver
          used to find this frame by `.act`, which made one continuous narrative position depend on a
          V1 presentation selector — so replacing the composition would have silently detached the
          sequence from the page. The attribute says *this box is where the act's segment begins on `p`*,
          which stays true of whatever composition renders it. Same reason `[data-state]` marks the
          states in flow. `implementation-reconciliation.md` C8.
        */}
        <section
          className="act"
          data-segment="act"
          id={where.studio}
          aria-label={site.three.work.title}
        >
        </section>

        {/*
          Nothing follows the act inside Chapter III, and that is the point.

          `IV — Future Chapters` stood here — a numeral, a name and two lines saying that the rest has not
          been written yet. It was an honest ending for a page that ended here, and the wrong thing entirely
          once the studio's own pages exist: a chapter marker standing on the seam where the film is supposed
          to be releasing into a website, announcing an absence. The act's last frame is a plate on paper
          with one line under it, which is an ending; it does not need a second one. `decisions.md` §54.
        */}
      </div>

      {/*
        And here the film ends.

        Not with a transition into the publication — with the absence of one. Everything that made the last
        three screens a film is simply no longer present: the frame is not pinned, no property is being
        driven, nothing is numbered `V`, and the type is set to be read rather than looked at. The only
        thing carried across is the axis and the paper, because it is the same page.

        The mark in the head margin stays exactly where it has been since it landed — it is `position:
        fixed`, so from here on it is doing an ordinary sticky head's job without changing to do it, and
        every word in it now leads somewhere. `decisions.md` §54.
      */}
      <Publication />
    </main>
  )
}
