import { site } from '@content'
import Opening from './opening'
import Reveal from './reveal'
import ScrollStage from './scroll-stage'

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
          .mark { transform: none !important; }
          .mark-label { display: none !important; }
          .mark-slot { display: none !important; }
          .dawn, .dawn-warmth { display: none; }
          .card-act-three { background: var(--paper); }
          .marker { opacity: 1 !important; }
          [data-reveal] { opacity: 1 !important; }
        `}</style>
      </noscript>

      <ScrollStage />
      <Reveal />

      <section className="film">
        <div className="stage">
          <Opening />

          {/* Every card is centred in the same frame, and no two of them ever share it. */}
          <div className="card" aria-hidden="true">
            <p className="card-marker">{site.two.marker}</p>
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

        <section className="three-opening" data-reveal>
          <p className="three-statement">
            {site.three.statement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </section>

        {/* Motion. A moving photograph — no controls, no chrome, no frame. */}
        <section className="showcase" data-reveal aria-label="Selected work">
          <div className="showcase-text">
            <p className="showcase-lead">{site.three.showcases[0].lead}</p>
            <p className="showcase-body">{site.three.showcases[0].body}</p>
          </div>
          <div className="showcase-visual">
            <video
              data-media="motion"
              src="/media/hero/video/hero_demo2.mov"
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
        </section>

        {/*
          Stillness, and the composition reverses. Alternating the two is the rhythm — a page of moving
          images is a showreel, not a publication.
        */}
        <section className="showcase showcase--reverse" data-reveal aria-label="Selected work">
          <div className="showcase-visual">
            {/*
              A held frame, and deliberately from the footage the hero already loaded — so the still
              costs nothing at all rather than pulling another 36MB down to show one image. It is a
              stand-in: this wants a real photograph, shot for the purpose and delivered as an image.
            */}
            <video
              data-media="still"
              data-frame="1.2"
              src="/media/hero/video/hero_demo4.mov"
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          <div className="showcase-text">
            <p className="showcase-lead">{site.three.showcases[1].lead}</p>
            <p className="showcase-body">{site.three.showcases[1].body}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
