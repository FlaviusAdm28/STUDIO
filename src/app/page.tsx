import { site, where } from '@content'
import WorkFragment from './fragment'
import Opening from './opening'
import Publication from './publication'
import Reveal from './reveal'
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
          .footage, .identity-title, .identity-line, .ways { opacity: 1 !important; }
          .ways { pointer-events: auto !important; }
          .moment { opacity: 0 !important; }
          .card { position: static; padding: 22vh 8vw; }
          .card-marker, .card-statement, .card-occasion, .card-close { opacity: 1 !important; }
          .close-lead, .close-another, .mark-word, .mark-stop { opacity: 1 !important; }
          /*
            No scroll, so the mark cannot rewrite itself. It reads as the chapter line it starts as,
            which is the same answer the travelling word gets below: the initial form, whole, and the
            part that only exists after a transformation left out rather than stacked on top of it.
          */
          .card-marker-word { opacity: 1 !important; filter: none !important; }
          .card-marker-mark { transform: none !important; }
          .card-marker-topic { display: none !important; }
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
            The head margin is a margin over a pinned frame, and there is no pinned frame here — so it
            stops being a fixed band and becomes what it is on paper anyway: the head of the chapter,
            printed once at the top of it. Nothing is clipped, because nothing is stepped into place.
          */
          .masthead { position: static; height: auto; padding: 0 var(--mark-x) 6vh;
            opacity: 1 !important; clip-path: none !important; }
          .masthead-nav { opacity: 1 !important; }
          .act-anchor { position: static; display: none; }
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
          .act-shot { clip-path: none; aspect-ratio: 16 / 10; background: var(--ground); }
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
            And About's arrival is staggered per element, gated on the attribute the observer writes — so
            without scripting the attribute never arrives and the room, the mark and the words would all
            stay at zero. This is the composed alternative: everything present, in order, with the
            sequence removed rather than the content. 05-storyboard.md §10.
          */
          .about-frame, .about-label, .about-opening, .about-text {
            opacity: 1 !important; transform: none !important; }
          /*
            And the method is a held frame driven by scroll position, so without scripting there is no frame
            and no choreography — only the first state of it, which is a label and one line. So it is told
            down the page instead: the invitation, then each question with what the studio hears in the
            answer beside it, then the resolution. The same things, in the same order, with the space and
            the convergence removed rather than the content. 05-storyboard.md §10.
          */
          .method { height: auto; }
          .method-stage { position: static; height: auto; display: grid; gap: 4vh;
            padding: 6vh var(--mark-x) 0; perspective: none; }
          .method-label { position: static; }
          .mgroup { position: static; display: block; }
          .mask, .mword, .mresolve { position: static; opacity: 1 !important;
            transform: none !important; }
          .mask { margin: 0 0 0.75vh; }
          .mword { display: inline-block; margin-right: 1.25em; font-size: 1.0625rem;
            color: var(--ink-quiet); }
          .mresolve { width: auto; }
          .mresolve-answer, .mresolve-lines { opacity: 1 !important; transform: none !important; }
        `}</style>
      </noscript>

      <ScrollStage />
      <Reveal />

      <section className="film">
        <div className="stage">
          <Opening />

          {/*
            Every card is centred in the same frame, and no two of them ever share it.

            The marker is in three parts because it does not stay one thing: `CHAPTER II` becomes
            `II Philosophy` while the visitor scrolls. `word` and the numeral are in normal flow, so
            the card centres `CHAPTER II` exactly as it always did and the resting frame is unchanged.
            `topic` hangs off the numeral's own right edge, out of flow — which is what keeps it from
            widening the line it is not part of yet, and what makes the numeral's travel measurable
            from the layout rather than authored.
          */}
          <div className="card" aria-hidden="true">
            <p className="card-marker">
              <span className="card-marker-word">{site.two.marker.word}</span>{' '}
              <span className="card-marker-mark">
                {site.two.marker.numeral}
                <span className="card-marker-topic">{site.two.marker.topic}</span>
              </span>
            </p>
          </div>

          <div className="card">
            <p className="card-statement">
              {site.two.statement.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>

          {site.two.occasions.map((line, i) => (
            <div className="card" key={line}>
              <p className="card-occasion" data-occasion={i + 1}>
                {line}
              </p>
            </div>
          ))}

          {/*
            Dawn sits after everything Act II says and before Act III's own words, so the light
            rises over the dark and covers it rather than replacing it. Warmth first, then light —
            the midpoint of a single cross-fade to ivory is a flat neutral grey.
          */}
          <div className="dawn-warmth" aria-hidden="true" />
          <div className="dawn" aria-hidden="true" />

          {/*
            Act III's sentence, in parts, because it is taken apart rather than removed. The lead
            leaves, then `another`, and `chapter` is left alone at the centre — and then that same
            element travels into the corner and becomes the marker. It is never swapped for a
            different element; only its size, its place and its purpose change.
          */}
          <div className="card card-act-three">
            <p className="card-close">
              <span className="close-lead">{site.two.close.lead}</span>
              <span className="close-tail">
                <span className="close-another">{site.two.close.another}</span>{' '}
                <span className="mark">
                  <span className="mark-word">{site.two.close.word}</span>
                  <span className="mark-label">{site.mark.label}</span>
                  <span className="mark-stop">{site.two.close.stop}</span>
                </span>
              </span>
            </p>
          </div>

          {/*
            The marker's slot: the numeral, then the empty anchor the word lands on. A flex row, so
            the anchor sits after the numeral automatically — the word's landing point accounts for
            "III" without a single number being written down, and stays right at any size.

            The anchor is invisible and measured rather than guessed: the script reads it and the
            word's natural position and derives the whole travel from the difference.
          */}
          <span className="mark-slot" aria-hidden="true">
            <span className="mark-numeral">{site.mark.numeral}</span>
            <span className="mark-anchor" />
          </span>
        </div>

      </section>

      {/*
        Chapter III. The third act of the same film rather than a publication after it: one frame,
        transformed by scroll, in the same vocabulary the first two acts used — opacity, one curve, and
        the dark coming up over a photograph. `decisions.md` §46.
      */}
      <div className="chapter-three">
        {/*
          Chapter III's head, and it is the marker the travelling word became rather than a navigation
          that arrives beside it.

          `.marker` is exactly what it was — same coordinates, same size, weight, tracking and ink —
          because at the instant of the handoff it has to be pixel-identical to the word that lands
          there. The handoff is a step, not a cross-fade: overlapping two 0.65-alpha inks would darken
          the mark for a frame. All that has changed is that the mark is now also a way back to the top
          of the chapter, and that a band of the page's own paper stands behind it.

          The band is not chrome. It is the page's head margin — `04-visual-language.md` §5, margins are
          silence — and it exists because the frame below it becomes a photograph: measured across the
          act, the ground behind this corner runs from paper at 241 through the plates' sky at 87–149
          to black and back, and no single ink survives that. §2 asks every element to exist lit and
          unlit; this one instead never leaves its own ground. `decisions.md` §47.

          The links arrive after the mark has settled, on the act's own runway — `actStory.navigation`.
        */}
        <header className="masthead">
          <a className="marker" href={`#${site.mark.to}`}>
            <span className="marker-numeral">{site.mark.numeral}</span>
            <span className="marker-label">{site.mark.label}</span>
          </a>

          <nav className="masthead-nav" aria-label={site.mark.label}>
            {site.mark.nav.map(({ word, to }) => (
              <a key={word} href={`#${to}`}>
                {word}
              </a>
            ))}
          </nav>
        </header>

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
        <section className="act" id={where.studio} aria-label={site.three.work.title}>
          {/*
            Where `#work` is. A place in the story rather than an element on a page: inside a pinned
            frame the work taking the screen is a scroll offset, so the anchor is put at that offset and
            `--work-at` is derived from the beat the aperture finishes. `transitions.ts`.
          */}
          <i className="act-anchor" id={where.work} aria-hidden="true" />

          <div className="act-stage">
            {/*
              The work itself, and it is the whole frame. `fragment.tsx` fetches it as the chapter
              approaches and does nothing else — the aperture, the light and the printing are all scroll,
              and all of them are `globals.css` reading the act's own properties.
            */}
            <WorkFragment />

            {/*
              **What the studio says, composed into the work.** Not a column beside it: the type stands in
              the quiet band the fragment declares, over the photograph, the way the timestamp stands
              inside the hero's own frame in Chapter I. `decisions.md` §53.

              Three things and one axis. The work's **name** arrives as the room goes to evening and stays,
              because the sentence after it is a reading of a named thing. Beneath it, one box holding two
              things that never share a frame: the two lines that say what the work is, and then — as the
              light goes down to a trace and takes them with it — the one sentence the studio says here.

              They are laid on the same grid cell rather than stacked absolutely, so the box is as tall as
              the taller of them and the name above sits in the same place whichever is lit.
            */}
            <div className="act-said">
              <p className="act-name">{site.three.work.title}</p>

              <div className="act-says">
                <p className="act-note">
                  {site.three.work.context.note.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>

                <p className="act-voice">{site.three.voice.lead}</p>
              </div>
            </div>

            {/*
              The way out, printed on the paper beneath the plate as the plate is printed. The only
              outward action in the chapter and the only thing in it that can be pressed — there is
              nothing to enter, because the work on screen is material and the experience is elsewhere.

              An anchor only once there is somewhere to go; until then it is composed and inert, because a
              link to nowhere is worse than a line that has plainly not been wired up yet.
            */}
            <div className="act-out">
              {site.three.work.url === null ? (
                <p className="act-open" aria-disabled="true">
                  {site.three.work.cta}
                </p>
              ) : (
                <a className="act-open" href={site.three.work.url} target="_blank" rel="noreferrer">
                  {site.three.work.cta}
                </a>
              )}
            </div>
          </div>
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
