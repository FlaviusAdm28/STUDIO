import Link from 'next/link'
import { chapters, contact, media, offers, questions, studio, studioSection, ui, weddingMoments } from '@content'
import { ColourReveal } from './client/colour-reveal'
import { DeskDepth } from './client/desk-depth'
import { Drawing } from './drawing'
import { Picture } from './picture'

const [weddings, artists, experiences] = chapters
type Chapter = (typeof chapters)[number]

function Tag({ chapter }: { chapter: Chapter }) {
  return (
    <span className="obj-tag">
      <span className="numeral">{chapter.numeral}</span> {chapter.word}
      <span className="obj-tag-kind"> — {chapter.tag}</span>
    </span>
  )
}

/**
 * The landing is the studio's desk under its lamp. On it lie what the three chapters are made of: a
 * print of the work that exists (Weddings), two sheets of drawings for what can be made (Artists,
 * Experiences), a night print from the same day, and the index card that names them. Each object is
 * a way into its chapter; the card says the same in words, so nothing depends on reading the picture.
 *
 * Everything a first visit needs is there at once: the sentence, what the studio makes, the three
 * chapters and the way to get in touch. The prints develop in on arrival (CSS, under two seconds,
 * never the text), the desk shifts by depth under a fine pointer, and the wedding print shows its
 * colour when it is pointed at.
 */
export function Opening() {
  return (
    <section className="desk" aria-labelledby="opening-title">
      <DeskDepth className="wrap desk-stage">
        <div className="desk-light" aria-hidden="true" />
        <div className="desk-copy">
          <h1 id="opening-title" className="opening-title">
            {studio.sentenceLines.map((line) => (
              <span key={line} className="line">
                {line}{' '}
              </span>
            ))}
          </h1>
          <p className="opening-lede">{studio.explanation}</p>
        </div>

        {/* Duplicates of the index card's links for the hand; hidden from assistive tech and the tab order. */}
        <div className="desk-objects">
          <Link href={weddings.href} className="obj obj-weddings" tabIndex={-1} aria-hidden="true">
            <span className="obj-inner obj-print">
              <Picture id="main" mono priority alt="" sizes="(min-width: 960px) 24vw, 46vw" />
              <Picture id="main" alt="" sizes="(min-width: 960px) 24vw, 46vw" className="obj-colour" />
            </span>
            <Tag chapter={weddings} />
          </Link>
          <Link href={artists.href} className="obj obj-sheet-wrap obj-artists" tabIndex={-1} aria-hidden="true">
            <span className="obj-inner obj-sheet">
              <Drawing kind="exhibition" label="" />
            </span>
            <Tag chapter={artists} />
          </Link>
          <Link href={experiences.href} className="obj obj-sheet-wrap obj-experiences" tabIndex={-1} aria-hidden="true">
            <span className="obj-inner obj-sheet">
              <Drawing kind="occasion" label="" />
            </span>
            <Tag chapter={experiences} />
          </Link>
          <span className="obj obj-night" aria-hidden="true">
            <span className="obj-inner obj-print">
              <Picture id="335" alt="" sizes="(min-width: 960px) 14vw, 28vw" />
            </span>
          </span>
        </div>

        <div className="desk-card">
          <ChapterIndex />
          <p className="opening-contact">
            <a href="#contact">{contact.cta}</a>
            <span aria-hidden="true"> — </span>
            <a href={contact.instagram.profile} rel="noopener">
              {contact.instagram.handle}
            </a>
          </p>
        </div>
      </DeskDepth>
    </section>
  )
}

/** The index card: three rows, each a link to its chapter. Pointing at a row lifts its object on the desk. */
export function ChapterIndex() {
  return (
    <nav id="contents" className="contents" aria-labelledby="contents-title">
      <h2 id="contents-title" className="label">
        {ui.contents}
      </h2>
      <ol>
        {chapters.map((c) => (
          <li key={c.id}>
            <Link href={c.href} className="contents-row" data-ch={c.id}>
              <span className="numeral contents-numeral">{c.numeral}</span>
              <span className="contents-word">{c.word}</span>
              <span className="contents-summary">{c.summary}</span>
              <span className="contents-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function ChapterLink({ chapter }: { chapter: Chapter }) {
  return (
    <Link href={chapter.href} className="chapter-link">
      {ui.openChapter} {chapter.numeral} <span aria-hidden="true">→</span>
      <span className="visually-hidden"> {chapter.word}</span>
    </Link>
  )
}

/** The chapter's mark, title and line; the link follows here, or after what the chapter lists. */
function ChapterHead({ chapter, kind, link = true }: { chapter: Chapter; kind?: string; link?: boolean }) {
  return (
    <header className="chapter-head" data-develop>
      <p className="chapter-mark">
        <span className="numeral">{chapter.numeral}</span>
        <span className="label">
          {ui.chapter} {chapter.numeral}
          {kind ? ` · ${kind}` : ''}
        </span>
      </p>
      <h2 id={`ch-${chapter.id}`} className="chapter-title">
        {chapter.word}
      </h2>
      <p className="chapter-line">{chapter.line}</p>
      {link && <ChapterLink chapter={chapter} />}
    </header>
  )
}

/**
 * Weddings is a contact sheet of one day told in three moments. Before and On the day are colour
 * masters shown in the studio's black and white; holding either (or its button) brings the colour
 * back. After is a night frame the photographer delivered in black and white, and stays so.
 */
export function WeddingsChapter() {
  return (
    <section className="chapter chapter-weddings" aria-labelledby="ch-weddings">
      <div className="wrap">
        <ChapterHead chapter={weddings} />
        <div className="sheet">
          {weddingMoments.map((m, i) => {
            const alt = media.moments[m.image]
            return (
              <figure key={m.moment} className={`moment moment-${i + 1}`} data-develop>
                {m.reveal ? (
                  <ColourReveal
                    buttonLabel={ui.seeColour}
                    mono={<Picture id={m.image} mono alt={alt} sizes="(min-width: 960px) 30vw, 90vw" />}
                    colour={<Picture id={m.image} alt="" sizes="(min-width: 960px) 30vw, 90vw" />}
                  />
                ) : (
                  <div className="reveal">
                    <div className="reveal-frame">
                      <Picture id={m.image} alt={alt} sizes="(min-width: 960px) 24vw, 90vw" />
                    </div>
                  </div>
                )}
                <figcaption>
                  <span className="moment-name">{m.moment}</span>
                  <span className="moment-pieces">{m.pieces.join(' · ')}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>
        <p className="sheet-hint">{ui.holdHint}</p>
      </div>
    </section>
  )
}

/**
 * Artists and Experiences: a room, and over it the drawing of what could be made for it. The room is
 * atmosphere, not a project; the drawing is labelled a proposal. This is "the made and its drawing"
 * at its simplest — the place, and the plan for its digital counterpart.
 */
export function ProposalChapter({
  chapter,
  plate,
  drawing,
  label,
  items,
  side,
}: {
  chapter: Chapter
  plate: 'art' | 'method'
  drawing: 'exhibition' | 'occasion'
  label: string
  items: readonly string[]
  side: 'left' | 'right'
}) {
  return (
    <section className={`chapter chapter-proposal side-${side}`} aria-labelledby={`ch-${chapter.id}`}>
      <div className="plate" aria-hidden="true">
        <Picture id={plate} alt="" sizes="100vw" className="plate-picture" />
      </div>
      <div className="wrap proposal-grid">
        <div className="proposal-text">
          <ChapterHead chapter={chapter} kind={chapter.tag} link={false} />
          <ul className="offer-list" data-develop>
            {items.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <ChapterLink chapter={chapter} />
        </div>
        <figure className="proposal-sheet" data-develop>
          <div className="obj-sheet">
            <Drawing kind={drawing} label={label} />
          </div>
          <figcaption className="proposal-label">{ui.proposal}</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function Chapters() {
  return (
    <>
      <WeddingsChapter />
      <ProposalChapter
        chapter={artists}
        plate="art"
        drawing="exhibition"
        label={media.artists.alt}
        items={offers.artists}
        side="right"
      />
      <ProposalChapter
        chapter={experiences}
        plate="method"
        drawing="occasion"
        label={media.experiences.alt}
        items={offers.experiences}
        side="left"
      />
    </>
  )
}

/** The studio under its lamp — the image the current site made the studio's own. */
export function StudioSection() {
  return (
    <section id="studio" className="studio" aria-labelledby="studio-title">
      <div className="plate" aria-hidden="true">
        <Picture id="lamp" alt="" sizes="100vw" className="plate-picture" />
      </div>
      <div className="wrap studio-grid" data-develop>
        <p className="label">{studioSection.label}</p>
        <h2 id="studio-title" className="studio-title">
          {studioSection.headline.map((line) => (
            <span key={line} className="line">
              {line}{' '}
            </span>
          ))}
        </h2>
        <p className="studio-paragraph">{studioSection.paragraph}</p>
        <p className="studio-lines">
          {studioSection.lines.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </p>
      </div>
    </section>
  )
}

/** The one page meant to be read: paper, ink, native disclosures. */
export function QuestionList() {
  return (
    <section id="questions" className="questions" aria-labelledby="questions-title">
      <div className="wrap questions-grid">
        <p className="label">{questions.label}</p>
        <div>
          <h2 id="questions-title" className="questions-anchor">
            {questions.anchor.q}
          </h2>
          {questions.anchor.a.map((p) => (
            <p key={p} className="questions-intro">
              {p}
            </p>
          ))}
          <div className="questions-list">
            {questions.rows.map((row) => (
              <details key={row.q} className="question">
                <summary>{row.q}</summary>
                <div className="answer">
                  {row.a.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
