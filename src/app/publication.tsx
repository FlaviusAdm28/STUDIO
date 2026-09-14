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
    /* `data-junction-host` is where junction 13 -> 14 writes its properties; see `data-segment` in
       `page.tsx` for why the position model no longer reaches for a presentation class. */
    <div className="publication" data-junction-host>
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
      <section className="page about" id={where.about} data-state={10} data-reveal data-ground>
        <div className="about-spread">
          {/*
            **The photograph is not drawn here any anymore, and About is not missing one.**

            It was an inset: a 3:2 figure on the left of this spread, on the film's own black, arriving on
            its own clock. C5's preflight P3 closed the composition against the Final Visual Master —
            *State 10 About uses the Studio environment plate; the photograph is the environment, the
            typography sits above it, no independent inset, no `.about-frame`, no surviving second image
            layer* — and §11.1 forbids the second surface that keeping both would be.

            The same file is the environment's studio plate now: `site.environment.studio`, mounted once
            for the session by `environment.tsx` and present across states 10 to 12.

            **Composing the type over it is C6 and is not done here.** What this pass owed the section was
            the retirement of the duplicate layer; the headline at x196, the second principle at x838 and
            the hairline at y452 are the next brief's. Until then the narrative stands on the page's own
            paper, which is what it has always been set to be read on.
          */}

          {/*
            One narrative, and no headings inside it. The label is the section's name and the sentence under
            it is the first line of the story rather than a statement about it — `04-visual-language.md` §4,
            type that disappears, which is what an account of yourself has to be set in.
          */}
          <div className="about-words">
            <h2 className="page-label about-label">{about.label}</h2>

            {/*
              **V2's two groups, in V1's single column.** §4: a 104px headline with its 16px paragraph, and
              a 46px second principle with three 14.5px lines beneath it. The Final Visual Master stages
              them at x196 and x838 with a hairline at y452 — none of which is here, because none of it is
              this pass. The classes are the ones that already existed, so the section is legible at the
              publication's own measure and nothing in the stylesheet moved.
            */}
            <p className="about-opening" data-arrive>{about.headline}</p>

            <p className="about-text" data-arrive="support">{about.paragraph}</p>

            <p className="about-opening" data-arrive="detail" style={{ ["--a-n" as string]: 0 }}>
            {about.principle}
          </p>

            <p className="about-text about-lines">
              {about.lines.map((line, i) => (
                <span key={line} data-arrive="detail" style={{ ["--a-n" as string]: i + 1 }}>
                  {line}
                </span>
              ))}
            </p>
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
      <section
        className="method"
        data-ground
        data-segment="method"
        id={where.method}
        aria-labelledby="method-label"
      >
        {/*
          One viewport, held for `--method-pin` and no longer. Everything in it is absolutely positioned
          against the frame, and `globals.css` owns every coordinate — a position in a frame is composition,
          and it is recomposed rather than scaled on a phone.

          The driver writes this section's twenty properties **on this element** rather than on the root, so a
          frame of the method's choreography does not re-resolve style for the whole document.
        */}
        <div className="method-stage" data-segment-frame>
          {/*
            The section's name, and the one thing in the frame that never moves. It stands for the whole of
            the section the way the mark stands in the head margin — a running label rather than a heading,
            which is also why there is no rule above it: a hairline that never scrolls is chrome.
          */}
          <h2 className="page-label method-label" id="method-label">
            {method.label}
          </h2>

          {/*
            **The seven overheard lines, and this is a holding render rather than the composition.**

            §4 sets them in sequence, rising 15 · 16 · 17 · 18 · 21 · 26 · 36px, at x196 with the question
            at bottom 142 — a chronological field, and none of that exists yet. What they are placed in is
            the field this section already had: seven of the twelve `.mword` slots, at coordinates and
            opacities that were tuned for a different composition. It is legible and it is driven, and it
            is not V2. The scale ladder and the placement are the composition phase's.

            The four questions and their twelve considerations that stood here are gone with the copy —
            `content/site.ts` records why.
          */}
          <div className="mgroup">
            {method.overheard.map((line, i) => (
              <span className="mword" data-w={i + 1} key={line}>
                {line}
              </span>
            ))}
          </div>

          {/* 62px at x196, bottom 142 in V2. Here it is the field's own question slot. */}
          <p className="mask" data-ask="1">
            {method.question}
          </p>

          {/* And the one line that says nothing is being asked of anybody. */}
          <p className="mask" data-ask="2">
            {method.note}
          </p>

          {/*
            The resolution, and it arrives **through** the convergence rather than after it: it comes forward
            out of the same point the twelve words are collapsing into, while the last of them is still
            arriving. Then the two lines, once it has landed.
          */}
          <div className="mresolve">
            <p className="mresolve-answer">{method.answer}</p>
            {/* One line now, where V1 authored two. §4 sets it as a single 17px line. */}
            <p className="mresolve-lines">
              <span data-arrive="support">{method.line}</span>
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
      <section className="page page-asked" id={where.questions} data-state={13} data-reveal data-ground>
        <hr className="page-rule" />

        <div className="page-part">
          {/*
            The heading, and V2 gives it no words of its own: §2's anchor is a 64px heading at y86 and the
            board says *seven rows, one heading*, but §4 authors no string for it. So the state's own name
            stands there and the line that used to explain the section is gone with the eight rows it
            described — `content/site.ts` records that this is flagged rather than invented.
          */}
          <h2 className="page-label" data-arrive>{questions.label}</h2>
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
      {/*
        **The persistent rule — junction 13 → 14's survivor, and §7's one non-negotiable.**

        *"The eighth rule — the closing rule at y529 in the scrolled last-row state — must be **owned by
        the page, not by the list**. It is one DOM node that persists into Contact. If it is a child of
        the accordion, leaving Questions unmounts it, and the entire locked 13 → 14 mechanism becomes a
        coincidence the visitor cannot verify."*

        It was two coincidences until now: a `border-bottom` on the last `<details>`, and a separate
        `<hr>` at the top of Contact. Two lines that happened to look alike. This is one line that is
        the same line — the list's closing rule *and* Contact's writing line, never re-created, never
        re-laid-out.

        §8's table is what makes that checkable rather than decorative: `y` and the left origin are
        **never animated**; only the measure and the weight animate, once, and only at the right edge.
        So the survivor's position in the document never changes and the eye has nothing to lose track
        of. `globals.css` drives it from `--jcross` and `--jsize`; nothing else may touch it.
      */}
      {/*
        ── The closing frame ─────────────────────────────────────────────────────────────────────────
        **Junction 13 → 14 happens in a held frame, and §8's own table is what requires one.**

            property      QUESTIONS   CONTACT   RULE
            y             529         529       never animated

        A document element has the same viewport `y` in two different states, without being animated,
        only if the viewport does not move between those states. The storyboard says it three more ways:
        *"one rule, one coordinate, no travel"*, *"nothing translates at any point in the 3.60s"*, and
        *"the list releases **around** it, the ground turns **under** it"*.

        Before this, the junction was spent as ordinary page scroll: the rule travelled y529 → y −18 and
        left the frame, and the document ran out 140px before the junction ended — so the survivor's one
        authored gesture in its whole life, shortening and thinning at 2.90s, had never once run, and
        *"Tell us about it."*, the label, the arrow and the three lines never arrived at any viewport.
        Measured at five: 61–74% of the junction was reachable.

        **The frame is the site's own idiom, not a new one.** The film holds `--pin`, Chapter III holds
        `--act-pin`, the method holds `--method-pin`; this holds `--closing-pin`. What is different is
        only what it is anchored to: the frame's top edge **is the rule**, so sticking it at §8's y529
        pins the survivor at the authored coordinate by construction rather than by arithmetic. Nothing
        measures it and nothing can drift.

        Contact is composed *around* that pinned line, at §8's own offsets — the headline above it, the
        writing line resolving onto it, the three lines settling below. One rule, one coordinate, and the
        list lets go around it.
      */}
      {/*
        **`data-state={14}` is on the container, not on Contact, and that is the sticky trap.**

        `place()` measures a flow state as `getBoundingClientRect().top + scrollY`. Contact is
        `position: absolute` inside `.closing-frame`, which is `position: sticky` — so once the frame is
        stuck, Contact's rect reports the frame's *held* offset rather than where it came from, and every
        re-measure taken low on the page recorded state 14 one `--rule-y` too far down the document.

        Measured at 1610 × 832: re-measured at the top of the page, state 14 resolves at document 31140 —
        reachable, and junction 13 completes at exactly 1.0000 with `--closing-settle` to spare.
        Re-measured at the foot, it resolves at 31940, which is 579px past the last scrollable pixel
        (31361): the driver can never reach it, `--state` stalls at 13, junction 13 stops at 0.6612, and
        the last third of Contact's arrival — §8's `detail` channel, the label, the arrow and the three
        lines — never runs. Whether the site had an ending depended on where the visitor happened to be
        standing when layout last moved.

        `offsetTop` is no escape: it is measured against the same sticky `offsetParent` and carries the
        same 800px shift. The only stable answer is an element that is not inside the frame.

        `.closing` is that element — `position: relative`, in ordinary flow, and its top *is* Contact's
        flow top to the pixel, because the frame is the first thing in it and Contact hangs off the
        frame at offset 0. This is the rule CLAUDE.md already draws for the method: **the runway is
        measured from the section, never from the stage.** Contact keeps its `id`, and its own
        `scroll-margin-top` still lands the anchor; only the measurement moved.
      */}
      <div className="closing" data-ground data-state={14} data-segment="closing">
        <div className="closing-frame" data-segment-frame>
          <hr className="persist" data-junction="13-14" />

          <section className="page page-last" id={where.contact}>
            <div className="page-part">
              <h2 className="page-label" data-arrive="detail" style={{ ["--a-n" as string]: 0 }}>
                {contact.label}
              </h2>
              <p className="page-ask" data-arrive>
                {contact.ask}
              </p>
            </div>

            {/*
              **Second, not last — §8's order, and it is the reason the rule reads as a writing line.**
              *"2.80s 'Tell us about it.' directly above the rule"*, and the geometry underneath it:
              block top y468 + 21px type + 16px gap = **y529**, the rule. So this block sits immediately
              above the survivor and nothing may come between them. It used to be third, below the three
              conditions, which put two blocks between the sentence and the line it is written on.
            */}
            <div className="page-part">
              <p className="write" data-arrive="support">
            {/*
              **The line carries a mark now, not a word.** V1 put *Write to us* here and made it the link;
              §8 gives the row an arrow bottom-aligned above a 1px rule and no text at all. Still composed
              and inert while `address` is null — the line stands and does not offer a press it cannot
              honour.
            */}
            {contact.write.address === null ? (
              <span className="write-line" aria-disabled="true">
                {contact.write.mark}
              </span>
            ) : (
              <a
                className="write-line"
                href={`mailto:${contact.write.address}`}
                aria-label={contact.ask}
              >
                {contact.write.mark}
              </a>
            )}
          </p>
            </div>

            {/*
              **Three lines, and they settle last.** §4 sets them as micro-caps with no label and no
              paragraph — each is the whole of its claim. §8 puts them below the rule, on the right
              margin, arriving on the last of the staggered slots.
            */}
            <div className="page-part page-terms">
              {contact.terms.map((term, i) => (
                <p className="page-note" key={term} data-arrive="detail" style={{ ["--a-n" as string]: i + 1 }}>
                  {term}
                </p>
              ))}
            </div>

            {/*
              **Nothing closes the page now.** V1 ended on `01-vision.md`’s pull-quote — *What happens
              once deserves more than information.* — as the last thing on the site. §8 lists what
              resolves in state 14 and a closing line is not among them: ground, Ledger, one rule, the
              headline, *"Tell us about it."*, then the section label, the arrow and the three lines.
              The rule is the ending, and the studio’s name under it is the colophon rather than a
              sentence.
            */}
            <p className="colophon">{site.title}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

/*
  **`Passage` is gone with the three labelled terms.** It paired a label in the rail with its prose
  beside it, and Contact’s *Write if · Not if · What happens next* were the only three things that
  used it. §4 replaces those with three micro-caps lines carrying no label and no paragraph, so there
  is nothing left for it to compose — the sections’ own labels and the questions’ rows never did.
*/
