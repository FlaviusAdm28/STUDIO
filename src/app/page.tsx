import { site } from '@content'
import Opening from './opening'
import Reveal from './reveal'
import ScrollStage from './scroll-stage'

/**
 * Which of the two reveals a piece of Chapter III belongs to.
 *
 * `data-emerges` is the composition the film unveils — it is lit by scroll position, in the instant the
 * word sets off for the corner. `data-reveal` is everything the visitor scrolls to afterwards, which
 * arrives once and stays. Only the first experience's head and its first step are the film's; a second
 * experience appended to `content/site.ts` is scrolled to like any other page, and this is the one line
 * that decides it. `decisions.md` §44 and §45.
 */
const unveiled = (byTheFilm: boolean) => (byTheFilm ? { 'data-emerges': '' } : { 'data-reveal': '' })

/**
 * One shot.
 *
 * The hero, the light going out of it, the chapter marker over the last of the image, a wait, the
 * statement. Then black, and nothing. Everything happens in a single pinned frame — nothing
 * scrolls past anything — so there is no section boundary anywhere to notice.
 *
 * Nothing follows the statement on purpose. The emptiness is the end of the shot.
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
          [data-reveal], [data-emerges] { opacity: 1 !important; transform: none !important; }
          /*
            These are measured against a pinned frame that does not exist here — the shot is laid out
            flat instead, so Chapter III simply follows it, its first page is simply there, and the
            marker simply stands at its corner. Left in, the chapter would be pulled up through the end
            of the film and its first page would be invisible, since nothing writes --studio without
            scripting. (No backticks in here — this block is a template literal.)
          */
          .chapter-three { margin-top: 0; }
          .marker { opacity: 1 !important; top: var(--mark-y); }
          /* Nothing sticks without a scroll to stick against; one column, read down. */
          .manifesto { position: static !important; }
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
        The marker, once the word has finished becoming it. Fixed rather than inside the shot, because
        from here on it is part of the page rather than part of the animation — it stays in the corner
        while Chapter III is read. The handoff from the travelling word is a step, not a cross-fade:
        the two are pixel-identical, and overlapping two 0.65-alpha inks would darken the marker for a
        frame.
      */}
      {/*
        Chapter III. Editorial, not cinematic: the marker in its own margin, a great deal of whitespace,
        and visuals that reach the edge of the page rather than sitting in containers.
      */}
      <div className="chapter-three">
        <p className="marker">
          <span className="marker-numeral">{site.mark.numeral}</span>
          <span className="marker-label">{site.mark.label}</span>
        </p>

        {/*
          Two halves that behave differently, and that is the whole idea. The manifesto is what the
          studio is, so it does not move: on a wide screen it holds the left column while the work goes
          by beside it. The work is what changes.

          One grid, so the two share a top edge and the emergence lights both of them as one thing.
        */}
        <div className="studio">
          {/*
            The manifesto, and the first step of the work, are the composition the film unveils — see
            `story.studioEmerges` and `decisions.md` §44. Both carry `data-emerges` rather than
            `data-reveal`: their light is scroll position, beginning in the instant the word sets off for
            the corner, so the mark reveals the Studio while it travels rather than announcing it after.

            Everything after the first step arrives by being scrolled to, one step at a time, which is
            what a publication does — `decisions.md` §43, a page arrives once and as a whole.

            The cost, stated where it is incurred: the work is in the same frame as the positioning
            sentence, and `05-storyboard.md` Beat 2 says that sentence is to be alone on the screen and
            not softened by a second sentence explaining it. A two-column chapter cannot honour that. It
            is a deliberate departure from a locked line, asked for and reaffirmed — `decisions.md` §45.
          */}
          <div className="manifesto" data-emerges>
            <p className="three-statement">
              {site.three.manifesto.statement.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <div className="manifesto-voice">
              <p className="manifesto-lead">{site.three.manifesto.lead}</p>
              <p className="manifesto-body">{site.three.manifesto.body}</p>
            </div>
          </div>

          {/*
            The work. A list of experiences, and today a list of one — appending the second is an entry
            in `content/site.ts` and nothing else.
          */}
          <div className="work">
            <p className="work-label" data-emerges>
              {site.three.work.label}
            </p>

            {site.three.work.experiences.map((experience, e) => (
              <section className="experience" key={experience.title} aria-label={experience.title}>
                <h2 className="experience-title" {...unveiled(e === 0)}>
                  {experience.title}
                </h2>

                <div className="experience-steps">
                  {experience.steps.map((step, i) => (
                    /*
                    One step, one arrival. The first step of the first experience is the film's — it
                    shares `data-emerges` with the manifesto — and every other is the observer's.
                  */
                    <figure className="step" key={step.name} {...unveiled(e === 0 && i === 0)}>
                      <figcaption className="step-name">{step.name}</figcaption>

                      {/*
                      The frame is the composition; what fills it is a detail. It carries the shape and
                      the clipping, and whatever goes inside is told to fill it — so a held frame today,
                      a real screenshot tomorrow and a live embed after that are the same layout and the
                      same rule. `plate: null` is the frame with nothing in it yet, which is an honest
                      state for a studio with one project rather than a broken one.
                    */}
                      <div className="step-plate" data-frame={step.frame}>
                        {step.plate !== null && step.plate.kind === 'motion' && (
                          <video
                            data-media="motion"
                            src={step.plate.src}
                            muted
                            loop
                            playsInline
                            preload="none"
                            aria-hidden="true"
                            tabIndex={-1}
                          />
                        )}
                        {step.plate !== null && step.plate.kind === 'still' && (
                          <video
                            data-media="still"
                            data-frame={step.plate.at}
                            src={step.plate.src}
                            muted
                            playsInline
                            preload="none"
                            aria-hidden="true"
                            tabIndex={-1}
                          />
                        )}
                      </div>
                    </figure>
                  ))}
                </div>

                {/*
                  The call to action belongs to the experience rather than to the page. It is an anchor
                  only once there is something to open; until then it is composed and inert, because a
                  link to nowhere is worse than a line that plainly has not been wired up yet.
                */}
                {experience.opens === null ? (
                  <p className="experience-open" aria-disabled="true" data-reveal>
                    {experience.cta}
                  </p>
                ) : (
                  <a className="experience-open" href={experience.opens} data-reveal>
                    {experience.cta}
                  </a>
                )}
              </section>
            ))}

            {/*
              The ending, and it belongs in this column rather than under both of them. It is the *work*
              that has run out, not the studio — so it is the last thing the column that tells the story
              says, with the manifesto still beside it. There is no experience after it to pretend about.

              Typography and nothing else. Remove `four` from `content/site.ts` and this goes with it,
              which is how it is meant to leave the day it stops being true.

              It also keeps the manifesto out of the marker's way, and that is not a coincidence worth
              leaving undocumented — see the comment on `.manifesto` in `globals.css`.
            */}
            {'four' in site && (
              <section className="future" data-reveal aria-label={site.four.label}>
                <p className="future-numeral">{site.four.numeral}</p>
                <h2 className="future-label">{site.four.label}</h2>
                <p className="future-lines">
                  {site.four.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
