import { site, where } from '@content'
import ContactListen from './contact-listen'

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

  /*
    **The anchor is the first question and it is no longer one of the rows.** Destructured here rather
    than indexed at the call site so the tuple stays the single source for *which* question opens the
    section: reordering `site.ts` reorders this, and there is no `0` written anywhere to disagree with
    it. `rows` is a readonly tuple of seven, so `anchor` is never `undefined`.
  */
  const [anchor, ...secondary] = questions.rows

  return (
    /* `data-junction-host` is where junction 13 -> 14 writes its properties; see `data-segment` in
       `page.tsx` for why the position model no longer reaches for a presentation class. */
    <div className="publication" data-junction-host>
      {/*
        ── About · state 10 ──────────────────────────────────────────────────────────────────────────
        **The room the work is made in, and the studio's account of itself written on its wall.**

        Rebuilt 16 September 2026 on the design owner's brief: it read as a page laid over a photograph —
        a milky panel, a column of paragraphs, a heading. It is a frame now, composed like the Work.

        **The section is runway; the composition is in the viewport.** `.about` keeps the height it had,
        so junctions 09 → 10 and 10 → 11 cost what they cost; `.about-stage` stands fixed in the frame
        and is written onto the studio plate on the publication's own arrival grammar (`--jp9`), then
        released in place early in 10 → 11 (`TIMING.about.release`). Nothing scrolls across the room.

        Two groups, staggered and unequal — §2's own description of the state:

          the claim        the eyebrow and the headline, high on the left, on the dark of the wall
          its evidence     the paragraph, a hairline, the second principle and three short refusals,
                           in a narrow column on the right, above the figure and clear of the lamp

        No scrim. The plate is a dark room and the type is the film's light ink on it.
      */}
      <section className="page about" id={where.about} data-state={10} aria-label={about.label}>
        {/*
          `data-in` names the group an element belongs to — statement, support or detail — and `--i` its
          place in that group. The driver's `data-about` says which groups the hand has reached; each one
          then resolves on its own curve (`TIMING.about.arrives`). Every line is its own element and never
          wraps, so nothing reflows while its tracking closes.
        */}
        <div className="about-stage">
          <div className="about-claim">
            {/*
              **The eyebrow is gone** — design owner, 20 September 2026, and it is not replaced. `About`
              stood here at `--i` 0, over the headline, and the rail already names the chapter three
              pixels away. The headline keeps the `--i` values it was authored with — 1 and 2, not 0 and
              1 — so removing the label above it does not quietly move About's arrival; the section's
              name now reaches a screen reader through the landmark's `aria-label` instead.
            */}
            <p className="about-headline">
              {about.headline.map((line, i) => (
                <span key={line} data-in="statement" style={{ ["--i" as string]: i + 1 }}>
                  {line}{' '}
                </span>
              ))}
            </p>
          </div>

          <div className="about-evidence">
            <p className="about-text" data-in="support" style={{ ["--i" as string]: 0 }}>
              {about.paragraph}
            </p>
            <i className="about-rule" aria-hidden="true" data-in="detail" style={{ ["--i" as string]: 0 }} />
            <p className="about-principle">
              {about.principle.map((line, i) => (
                <span key={line} data-in="detail" style={{ ["--i" as string]: i + 1 }}>
                  {line}{' '}
                </span>
              ))}
            </p>
            <ul className="about-lines">
              {about.lines.map((line, i) => (
                <li key={line} data-in="detail" style={{ ["--i" as string]: i + 3 }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/*
        ── The method ────────────────────────────────────────────────────────────────────────────────
        **What is said in the room on the day, and the studio's one question after it.** The held frame
        outside the film, and the only section of the publication driven by scroll position.

        **Recomposed 18 September 2026 on the design owner's brief**, and the brief is three things:
        the section is an *editorial composition inside the empty room* rather than lines centred on a
        background; a very few marginal annotations and a signed process belong in it; and the movement
        comes down until the composition would hold almost still. `implementation-reconciliation.md`
        C16 is the record.

        What went with that brief is V1's spatial field: the `perspective` space, the twelve
        considerations at twelve depths, the three occlusions, the rotations and the parallax camera.
        §3 asks for depth *através de escala, posição e hierarquia tipográfica, NÃO através de
        parallax*, which is also what §4 authors — seven lines rising 15 → 36px and nothing about a
        third dimension. So the field is flat, the depth is typographic, and the only thing left moving
        is the reveal itself.

        **The DOM order is the reading order** — the room first, its margin notes, the process, then the
        question and the answer — so a screen reader gets the section as prose in the order the studio
        would say it, and the composition is entirely the stylesheet's business. Nothing here is
        interactive and nothing is a control.
      */}
      {/*
        **No `data-ground`.** The room is `.env-room`, fixed in the Environment. This section's scrim was
        drawn on its own 6,500px box, so it slid up the screen over a fixed photograph — and because
        `--page-veil` crosses to 1.0 on junction 12 → 13 while the viewport is still inside this section,
        it also turned the room into a full-strength wash and then into white paper before Questions had
        arrived. That is the *"fundo branco"* the design owner ruled out on 18 September 2026. The ink
        register is untouched; only the painting moved.
      */}
      <section
        className="method"
        data-segment="method"
        id={where.method}
        aria-label={method.label}
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
            **The running label is gone** — design owner, 20 September 2026, and it is not replaced. It
            stood at the head of the frame and said `Method` while the rail said `Method` on the same
            screen, a few pixels to its left. The section's name reaches a screen reader through the
            landmark's `aria-label` now, which is where a name belongs when nothing needs to be drawn.
          */}

          {/*
            ── The field · §4's seven overheard lines, composed ────────────────────────────────────

            **This is the composition now, where it used to be a holding render.** §4 sets them *"in
            sequence and rising in scale: 15 · 16 · 17 · 18 · 21 · 26 · 36px — so the field is
            chronological as well as spatial"*, and that is what `globals.css` now places: seven lines
            distributed across the frame, growing as the afternoon goes on, with the largest of them —
            `It's starting.` — the last thing written in the room before the studio asks its question.

            **They arrive as one field** — design owner, 18 September 2026: *as sete frases devem surgir
            como um campo/composição, não como sete entradas independentes*, and *o espaço já estava
            assim; eu é que comecei a reparar nele*. There is no grouping attribute and no stagger;
            `globals.css` gives all seven the same arrival, which is About's own junction rather than a
            beat of this section, so what reveals them is the room's light.

            The order of the array is the chronology and is therefore copy; the scale ladder, the
            positions and the three groupings are composition and live in the stylesheet.
          */}
          <div className="mgroup">
            {method.overheard.map((line, i) => (
              <span className="mword" data-w={i + 1} key={line}>
                {line}
              </span>
            ))}
          </div>

          {/*
            **One note in the margin of the field**, and it was two. Micro-caps, at the register About's
            three refusals and the rail are set in, placed against the field rather than against the
            page. It is an annotation and not a label: nothing here can be pressed and nothing is a
            heading. `Overheard, not directed` was removed on 20 September 2026 and is not replaced —
            `content/site.ts` argues why. The map is unchanged, so the survivor is `data-n` 1 now and
            `globals.css` carries its position on that selector.
          */}
          {method.annotations.map((note, i) => (
            <p className="mnote" data-n={i + 1} key={note}>
              {note}
            </p>
          ))}

          {/*
            **OBSERVE — UNDERSTAND — SHAPE — PRESERVE is gone** — design owner, 20 September 2026, and
            it is not replaced and not rebuilt in other words: *"A ideia do 'método' já está a ser
            comunicada pela própria cena e pelas frases ambientais."* The section's conclusion is the
            composition itself, standing, and then the room clearing into Questions.
          */}

          {/*
            ── The main composition ───────────────────────────────────────

            **Three pieces of one editorial composition** — design owner, 19 September 2026:
            *"YOUR EXPERIENCE / Built around what makes yours unique. / What makes it yours?… As três
            peças devem parecer partes da mesma composição editorial, não três textos independentes."*

            They used to be four, and before that two ends of a room — §2 anchors the question at
            *x196, bottom 142* and the answer at *x196, y262*. The studio's note that stood under them
            (*Nobody is asked to answer…*) is not drawn any more; `content/site.ts` records the copy and
            says so.

            **The order they are read in is not the order they arrive in.** The question is written last
            and arrives first — before the section's own top, while the room is still coming up to light
            — so there is a new idea in About's own territory immediately, rather than after the field.
            The answer and its line resolve above it out of the stillness, with the field standing.
            One element, one arrival: the question is not duplicated anywhere.

            The stack is About's, which is the reference the brief gives and the section immediately
            before this one: statement, second voice, and a quieter line under both. `globals.css` owns
            every size and the one axis they share.
          */}
          <div className="mmain">
            <p className="mresolve-answer">{method.answer}</p>
            <p className="mresolve-lines">
              <span>{method.line}</span>
            </p>
            <p className="mask">{method.question}</p>
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
      <section
        className="page page-asked"
        data-state={13}
        data-reveal
        data-ground
        aria-label={questions.label}
      >
        {/*
          **The label is gone** — design owner, 20 September 2026, and it is not replaced: *"O menu/rail
          lateral já identifica o capítulo."* It was `questions.label` in the section's own head, which
          said `QUESTIONS` while the rail said `QUESTIONS` on the same screen. The copy is still in
          `site.ts` because the landmark's accessible name is made from it.
        */}
        {/*
          **The section's rule is gone** — design owner, 20 September 2026, with the hairline that stood
          above the first row. Nothing is drawn above the anchor now: *"Quero que a primeira pergunta
          seja a primeira âncora real da composição."*
        */}

        {/*
          ── The rows, and each one is its own small revelation ────────────────────────

          Three moments — the anchor, then two groups of three — fired at the distances
          `TIMING.questions` authors **after the list's sticky lock**, which is the one place every
          element in this section already stands at its final screen position. Two channels on each
          row: `--g{n}r{i}` draws the hairline out from the axis and `--g{n}i{i}` brings the question's
          ink up in the space it opened. Scroll only fires them; both then play on their own clocks and
          hold, and the hand cannot scrub either one.

          They used to stand at full ink from the frame the section scrolled into view, which is what
          read as a page rather than as a composition.

          **The first row is not a row at all.** *"'What do you actually create?' deixa de ser um
          accordion. É uma âncora editorial. Sem +, sem -, sem resposta, sem `<details>`."* It is a block
          of type standing at the head of the list — nothing to press, nothing to open, nothing to
          close — so the section is *introduced* rather than answered before it is touched.

          `content/site.ts` still carries its answer and is untouched: what was removed is the
          disclosure, not the copy.
        */}
        {/*
          **The reading zone is this box, and the list stands inside it.** The hold used to be padding on
          the section, and that does not work: `.page-asked` is a grid and `.asked` is one of its items,
          so the item's grid area is exactly its own content and a sticky child has no room to travel.
          Measured — the composition scrolled straight out of the zone meant for reading it.

          The box carries the distance as its own foot, so its height is the list plus the hold, and the
          list can stand against the head margin for exactly that far. `globals.css` owns both.
        */}
        {/*
          `data-asked-frame` is the box the list stands in and `data-asked-list` is the list itself.
          The driver needs both to find the sticky lock: the frame's top is where the list would sit
          in ordinary flow (the frame is never stuck, so its rect is honest), and the list's own
          computed `top` is the head margin it stands under. Attributes rather than class selectors,
          like every other thing this driver measures.
        */}
        {/*
          **The rail's *Questions* lands here, on the list's lock** — QA, 26 September 2026. On the
          section it landed ~700px above the lock, on the Method's empty room with the rail still on
          METHOD, and nothing was written until the hand scrolled on. The section keeps `data-state`
          and its own `scroll-margin-top`, so the state measurement is untouched — the `#contact`
          arrangement exactly.
        */}
        <div className="asked-hold" data-asked-frame id={where.questions}>
        <div className="asked" data-asked-list>
          {/*
            **The anchor.** The same class the rows carry, so it keeps the list's own hairline logic,
            its release at 13 → 14 — and `.ask-anchor` takes away the two things a disclosure has that
            this does not: the mark and the cursor. It stays the first child of `.asked`, which is
            what keeps the column, the axis and §1's release exactly as they were.

            **Its arrival is not the list's.** It is not `--q1`, it is not in `arrive.at`, and it is
            not played by the loop below: `TIMING.questions.anchor` states it and the driver gives it
            a pass of its own. It is revealed where it stands, nothing about it travels, and the six
            below cannot begin until it has held.
          */}
          {/*
            **Its own channels, and neither is a row's.** `--qa` resolves the question and `--qa-body`
            brings its answer up behind it. Nothing here is indexed, nothing here is `--qN`, and there
            is no rule channel because nothing is drawn above the first row.

            **They are not restated on this element and must not be.** The rows re-point a generic
            `--q` at their own `--qN`, because six rows share one stylesheet rule and each needs a
            different number. There is one anchor, so `globals.css` reads the driver's names directly
            and they inherit from `.publication`. Writing `--qa: var(--qa, 0)` here would be a
            self-reference: the property is invalid at computed-value time, `var()` takes the
            fallback, and the anchor renders at zero opacity for ever — which is exactly what it did.
          */}
          <div className="ask ask-anchor">
            <p className="ask-q">{anchor.q}</p>
            {/*
              **The answer is back, and it is fixed editorial content** — design owner, 21 September
              2026: *"A resposta/texto que já existe para essa pergunta deve voltar imediatamente
              abaixo dela. É conteúdo editorial fixo, não accordion."* Same copy, same class, same
              measure and same foot as when it was a disclosure's body; what it no longer is, is
              something that can be opened or closed. `site.ts` was never touched.
            */}
            <div className="ask-a prose">
              {anchor.a.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          {secondary.map((row, i) => {
            /*
              The row's place in the sequence, and it is only its document order: there are no groups
              to belong to any more. `TIMING.questions.faq` decides when each one opens, including the
              breath that still makes the six read as three and three.
            */
            const n = i + 1
            return (
            <details
              className="ask"
              key={row.q}
              /*
                **One open at a time, and the browser does it.** `name` makes a native exclusive
                accordion: opening one closes its sibling, pressing the open one closes it and leaves
                none open, and every bit of that survives without scripting and without hydration —
                which is the whole reason this section was built on `<details>` in the first place.

                None of them is open to begin with, where the first row used to be: the anchor answers
                nothing now, so an open row underneath it would be a second door.
              */
              name="asked"
              /*
                **The row points its three generic locals at its own channels.** `--qr` draws the
                hairline, `--q` brings the question's ink up in the space it opened, and `--q-hit` is
                what keeps a row that has not arrived from being pressable.

                The index is the row's place in the sequence and nothing else — the anchor is not in
                this numbering, and neither is any grouping. Set here rather than through an
                `nth-child` table in the stylesheet, so document order is the only thing that has to
                line up with the driver.
              */
              style={{
                ["--q" as string]: `var(--qi${n}, 0)`,
                ["--qr" as string]: `var(--qr${n}, 0)`,
                ["--q-hit" as string]: `var(--qh${n}, auto)`,
              }}
            >
              <summary className="ask-q">{row.q}</summary>
              <div className="ask-a prose">
                {row.a.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </details>
            )
          })}
        </div>
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

          {/*
            ── Contact · the last frame of Chapter One ────────────────────────────────────────────

            **26 September 2026.** The footage full-bleed and at its own speed, and two corners of one
            axis: the contacts upper left as a small editorial note, and lower left the question and the
            one sentence that answers it. `YOUR CHAPTER` is removed, and nothing stands in for it.

                hello@chapterone.com                       ← a note, not a panel
                +351 910 000 000
                WhatsApp · Telegram · Instagram

                Is there something
                that deserves its own experience?
                Tell us where it begins.                   ← the frame's only interaction
                ──────────                                 ← its line, which does not breathe

            **Scroll does not write any of this.** The persist track brings the frame to the hillside and
            asks; the channels below are `play()`ed by the driver on `TIMING.contact.composes` and hold.
            What happens under the hand is `contact-listen.tsx`, on a clock of its own.
          */}
          <section className="page page-last" id={where.contact}>
            {/*
              The rail carries `Contact` lit for the whole state, so the label is written for the
              landmark and drawn nowhere — `.a11y` is the project's one screen-reader-only pattern.
            */}
            <h2 className="page-label a11y">{contact.label}</h2>

            {/*
              **The question and its answer, lower left.** One block whose width is the question's own,
              so the line under the sentence can grow to exactly that measure.
            */}
            <div className="contact-compose">
              <p className="contact-ask">
                {contact.ask.map((line, i) => (
                  <span
                    className="contact-line"
                    key={line}
                    style={{ ['--c' as string]: `var(--c-q${i + 1}, 0)` }}
                  >
                    {line}
                  </span>
                ))}
              </p>
              <ContactListen
                begins={contact.begins}
                listening={contact.listening}
                href={
                  contact.write.address === null
                    ? null
                    : `mailto:${contact.write.address}?subject=${encodeURIComponent(contact.subject)}`
                }
              />
              {/*
                **The contacts, under the line** — design owner, 26 September 2026, second review:
                *"prefiro os contactos junto da composição principal, no canto inferior esquerdo"*. Third
                in the hierarchy. Every one is its own way to write and every one reads `site.ts`, so the
                printed line and its link can never point at two places. WhatsApp
                and Telegram are composed from the one number the studio has given; Instagram has no
                handle in the project, so it is written and inert until one is.
              */}
              <div
                className="contact-note"
                id="contact-note"
                style={{ ['--c' as string]: 'var(--c-note, 0)' }}
              >
                <p className="contact-note-lines">
                  {contact.write.address === null ? (
                    <span className="contact-link" aria-disabled="true">
                      {contact.direct.email}
                    </span>
                  ) : (
                    <a
                      className="contact-link"
                      href={`mailto:${contact.write.address}?subject=${encodeURIComponent(
                        contact.subject,
                      )}`}
                    >
                      {contact.direct.email}
                    </a>
                  )}
                  <a className="contact-link" href={`tel:${contact.direct.phone.dials}`}>
                    {contact.direct.phone.reads}
                  </a>
                </p>
                <p className="contact-note-reaches">
                  {contact.direct.reach.map((one, i) => {
                    const href =
                      one.via === 'whatsapp'
                        ? `https://wa.me/${contact.direct.phone.dials.replace('+', '')}`
                        : one.via === 'telegram'
                          ? `https://t.me/${contact.direct.phone.dials}`
                          : one.handle === null
                            ? null
                            : `https://instagram.com/${one.handle}`
                    return (
                      <span key={one.word}>
                        {i > 0 && (
                          <span className="contact-between" aria-hidden="true">
                            {contact.direct.between}
                          </span>
                        )}
                        {href === null ? (
                          <span className="contact-link" aria-disabled="true">
                            {one.word}
                          </span>
                        ) : (
                          <a className="contact-link" href={href} target="_blank" rel="noreferrer">
                            {one.word}
                          </a>
                        )}
                      </span>
                    )
                  })}
                </p>
              </div>
            </div>

            {/*
              `contact.tell`, `contact.terms` and the colophon stay in `content/site.ts` and are not
              drawn — design owner, 22 September 2026: after About, the Method and seven questions, three
              more claims at the threshold is the studio arguing after the argument is finished.
            */}
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
