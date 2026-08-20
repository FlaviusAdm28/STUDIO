import Image from 'next/image'
import { site, where } from '@content'

/**
 * **The studio's own pages, after the film.**
 *
 * Chapters I to III are one continuous shot in two pinned frames; Chapter IV is their last word. This is
 * what the film was for: the studio explaining itself, how the work happens, what people ask, and how to
 * write. Ordinary elements in ordinary flow. No pinned frame, no beat, no chapter numeral, no scroll
 * driver, and one timing in the whole file — a question answering. `decisions.md` §54.
 *
 * ## Why it is a publication rather than a fifth chapter
 *
 * `04-visual-language.md` §4 says type does two jobs — **to speak** and **to disappear** — and that
 * recognising them as two jobs is the decision. The film only ever needed the first: `decisions.md` §03
 * settled that the studio *speaks* on the homepage and never *reads* there, and every word above this
 * component is a few of them at display size, composed inside a photograph.
 *
 * These pages need the second, and that is the whole register change. A measure, a leading, paragraphs
 * somebody finishes without noticing they were reading, and a scale where nothing is ever as loud as the
 * film was. `04-visual-language.md` §5 — scale is currency, and the film already spent it.
 *
 * ## One composition, and two exceptions
 *
 * The questions and Contact are the same grid: a rail of small labels on the page's own left axis, and a
 * column of type beside it. It is the axis the mark in the head margin, the studio's type over the work and
 * the line under the plate already share, so the publication is not a new place — it is the same page,
 * printed plainly. They are also the only two sections that carry a rule.
 *
 * **About and the method are the exceptions, and for opposite reasons.** About has material in it: a
 * photograph takes the left half and the narrative sits beside it, so there is no rail, because there are no
 * marginal notes to put in one. The method has *no* material at all — its material is type, space and motion
 * — so it is not a page but a held frame, the one place in the publication where scroll position drives the
 * composition. Both keep the axis, the paper and the label, and nothing else.
 *
 * The rhythm is deliberate and it is not a decrescendo: a picture and a paragraph, then the one moment the
 * publication is spatial, then rows that answer when pressed, then a question and a line. By the end there is
 * almost nothing on the screen, which is what makes the last line the last line.
 *
 * ## What is not here
 *
 * No form. `04-visual-language.md` §10 — *forms are conversations*, and every additional field is
 * something we made a person do for our own convenience; the ask is a letter, so what is offered is an
 * address. No team cards, no logos, no counters, no numbered process, no service grid, no testimonials:
 * §11.3 forbids anything that argues for us, and the work is on the same page doing the demonstrating.
 */
export default function Publication() {
  const { about, method, questions, contact } = site.publication

  return (
    <div className="publication">
      {/*
        ── About ─────────────────────────────────────────────────────────────────────────────────────
        **The room the work is made in, and ninety-five words beside it.**

        The first thing after the film, and there is nothing between them: no sentence handing over, no
        numeral, no second hero. What says the film is over is that the frame has stopped being held and
        there is a photograph and a paragraph on a page. `decisions.md` §54.

        Two columns and no rail — this is the one section that does not use the label-and-prose grid,
        because it has material in it and the material is half the composition. The photograph takes the
        left and slightly more than half the width; the studio's account of itself sits to the right of it,
        top-aligned, reading down. `04-visual-language.md` §5 — asymmetry by default.

        The three parts arrive in order and it is the only composed arrival in the publication: the room,
        then the mark, then the words. `story.afterTheFilm.about`.
      */}
      {/*
        **No rule above this one**, and it is the only section without one. Two reasons, and they agree.

        A rule is the publication's section mark, spanning the page it belongs to — and About is wider than
        the three type sections, because half of it is a photograph. Measured at 1440: its rule ran 1286
        where the method's runs 1232, and two rule lengths on one page read as an accident rather than as a
        decision.

        And it is the first thing after the film, so it has nothing above it to be separated from. What
        separates it is the largest band of silence on the site. An opening spread carries no rule; the
        first one appears at the method, and from there they are all the same length.
      */}
      <section className="page about" id={where.about} data-reveal>
        <div className="about-spread">
          {/*
            The photograph, on the film's own black. The ground is what the frame holds before the bytes
            arrive and if they never arrive at all — a dark plate on paper, which is what the act ends as,
            so nothing is ever seen to be empty and nothing shifts. `05-storyboard.md` §10.

            `width` and `height` are the file's real dimensions and `aspect-ratio` in the stylesheet is
            derived from the same 3:2, so the box is reserved before the image loads. Lazy, because it is
            six screens down and §11 will not have media delaying anything in front of it.
          */}
          <figure className="about-frame">
            {/*
              `next/image` rather than a bare `<img>`, and it is a delivery decision rather than a design
              one: the file is a 1.8MB PNG of a photograph, and this serves it as WebP at the width the
              composition actually asks for — about 150KB on a phone. The file itself is untouched.

              `sizes` states the composition so the right width is chosen: about half the spread above
              1080, the full column below it, which is exactly what the stylesheet does. Lazy by default,
              which is what we want six screens down.
            */}
            <Image
              className="about-image"
              src={about.portrait.src}
              width={about.portrait.width}
              height={about.portrait.height}
              alt={about.portrait.alt}
              sizes="(max-width: 1080px) 92vw, 46vw"
            />
          </figure>

          {/*
            One narrative, and no headings inside it. The label is the section's name and the sentence under
            it is the first line of the story rather than a statement about it — `04-visual-language.md` §4,
            type that disappears, which is what an account of yourself has to be set in.
          */}
          <div className="about-words">
            <h2 className="page-label about-label">{about.label}</h2>

            <p className="about-opening">{about.opening}</p>

            {about.text.map((paragraph) => (
              <p className="about-text" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/*
        ── The method ────────────────────────────────────────────────────────────────────────────────
        **The studio's questions, and what it hears in the answers.** The one held frame outside the film,
        and the only section of the publication driven by scroll position rather than by arriving.

        There is no prose here and no process. Four questions surface out of the space one at a time, each
        brings three considerations with it, twelve accumulate at their own distances, and then every one of
        them converges into the point the questions stood on — which is where the answer comes forward. The
        visitor is taken through the method instead of being told about it. `decisions.md` §55.

        **The DOM order is the reading order.** Every word is real text in the order the studio would say it
        — question, then what it hears — so a screen reader gets the whole method as a sequence of questions
        and answers, and the spatial composition is entirely the stylesheet's business. Nothing here is
        interactive and nothing is a control.
      */}
      <section className="method" aria-labelledby="method-label">
        {/*
          One viewport, held for `--method-pin` and no longer. Everything in it is absolutely positioned
          against the frame, and `globals.css` owns every coordinate — a position in a frame is composition,
          and it is recomposed rather than scaled on a phone.

          The driver writes this section's twenty properties **on this element** rather than on the root, so a
          frame of the method's choreography does not re-resolve style for the whole document.
        */}
        <div className="method-stage">
          {/*
            The section's name, and the one thing in the frame that never moves. It stands for the whole of
            the section the way the mark stands in the head margin — a running label rather than a heading,
            which is also why there is no rule above it: a hairline that never scrolls is chrome.
          */}
          <h2 className="page-label method-label" id="method-label">
            {method.label}
          </h2>

          {/*
            What the studio says before it asks anything. It is the first of the questions rather than a
            heading over them, so it arrives and leaves exactly as they do — out of the space, and back into
            it.
          */}
          <p className="mask" data-ask="0">
            {method.invite}
          </p>

          {method.asking.map((asked, q) => (
            /*
              One group: the question, and the three considerations it brings. A layer of its own so the DOM
              can keep the reading order while the stylesheet places everything — and it carries
              `preserve-3d` rather than an opacity of its own, because an opacity here would flatten the
              perspective the whole composition is built in.
            */
            <div className="mgroup" key={asked.question}>
              <p className="mask" data-ask={q + 1}>
                {asked.question}
              </p>

              {asked.hears.map((word, w) => (
                <span className="mword" data-w={q * 3 + w + 1} key={word}>
                  {word}
                </span>
              ))}
            </div>
          ))}

          {/*
            The resolution, and it arrives **through** the convergence rather than after it: it comes forward
            out of the same point the twelve words are collapsing into, while the last of them is still
            arriving. Then the two lines, once it has landed.
          */}
          <div className="mresolve">
            <p className="mresolve-answer">{method.answer}</p>
            <p className="mresolve-lines">
              {method.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/*
        ── The questions ─────────────────────────────────────────────────────────────────────────────
        The change of register, and it is structural as well as typographic: the rows leave the rail and
        run the full width of the page, flush to the axis, separated by the same hairline the sections
        are. Nothing here is composed to be looked at — it is a list somebody scans.

        `<details>` and `<summary>`, native. `04-visual-language.md` §10 — understood before it is used,
        nothing inherited, and it always answers: the row opens on the press with no script involved, so
        it works before hydration, without JavaScript, and from the keyboard. The mark is a `+` that
        becomes a `−`, drawn in CSS, and the only thing that fades is the ink of the answer.
      */}
      <section className="page page-asked" id={where.faq} data-reveal>
        <hr className="page-rule" />

        <div className="page-part">
          <h2 className="page-label">{questions.label}</h2>
          <p className="page-note">{questions.note}</p>
        </div>

        <div className="asked">
          {questions.rows.map((row) => (
            <details className="ask" key={row.q}>
              <summary className="ask-q">{row.q}</summary>
              <div className="ask-a prose">
                {row.a.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/*
        ── Contact ───────────────────────────────────────────────────────────────────────────────────
        One question, three conditions, one line to press, and the thing left behind.

        The question is asked of the reader rather than answered at them, and the three conditions under
        it include the one that sends people away — `05-storyboard.md` §8 Beat 6 asks for a qualifier that
        makes some people not write, on purpose, and names *a headline and a button* as the failure mode.

        `write.address` is `null` until somebody decides one, and the line is then composed and inert
        rather than a link to nowhere — the same state `three.work.cta` uses in the film, and the same
        reasoning: a press that cannot be honoured is worse than a line that has plainly not been wired.
      */}
      <section className="page page-last" id={where.contact} data-reveal>
        <hr className="page-rule" />

        <div className="page-part">
          <h2 className="page-label">{contact.label}</h2>
          <p className="page-ask">{contact.ask}</p>
        </div>

        {contact.terms.map((term) => (
          <Passage key={term.label} label={term.label} text={[term.text]} />
        ))}

        <div className="page-part">
          <p className="write">
            {contact.write.address === null ? (
              <span className="write-line" aria-disabled="true">
                {contact.write.cta}
              </span>
            ) : (
              <a className="write-line" href={`mailto:${contact.write.address}`}>
                {contact.write.cta}
              </a>
            )}
          </p>
        </div>

        {/*
          The last thing on the site. `05-storyboard.md` §3 — most people leave without acting, that is the
          normal outcome, and what they carry away is the real product of the sequence. So the page ends on
          one sentence and the studio's name under it, and nothing tries to keep anybody here.
        */}
        <div className="page-part">
          <p className="page-exit">{contact.close}</p>
        </div>

        <hr className="page-rule" />

        <p className="colophon">{site.title}</p>
      </section>
    </div>
  )
}

/**
 * A label in the rail and its prose beside it. The publication's only structural unit.
 *
 * A grid of its own rather than two items in the section's grid, so the label and the paragraphs it
 * belongs to are one row on a wide screen and one tight pair on a narrow one — with the gap between a
 * label and its own text set once, and the gap between passages set once, and neither able to become the
 * other. `01-validation.md`: a composition that cannot survive being narrowed is recomposed, not reflowed.
 */
function Passage({ label, text }: { label: string; text: readonly string[] }) {
  return (
    <div className="page-part">
      <h3 className="page-label">{label}</h3>
      <div className="prose">
        {text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}
