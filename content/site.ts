/**
 * All language lives here, never in components.
 * `04-visual-language.md` §12 — words are part of the sensory system, not a separate discipline.
 */

/**
 * Where the navigation goes. Section names, not hrefs — `page.tsx` writes the `#` on one side and the
 * `id` on the other, so a destination and the thing it points at cannot drift apart.
 *
 * **All five now lead somewhere, and they lead to two different kinds of place.** `studio` and `work`
 * are positions in the *film*: `studio` is Chapter III's opening frame and `work` is the beat inside it
 * where the aperture has finished and the work is whole, lit and unnamed. `about`, `faq` and `contact`
 * are sections of the *publication* that follows the film — ordinary elements in ordinary flow, each
 * carrying its own `id`, each with `scroll-margin-top` for the sticky head. `decisions.md` §54.
 *
 * There is deliberately no destination for the method. It is read on the way from About to the
 * questions, in one pass, and a navigation word for it would be a fourth entry in a locked masthead —
 * `04-visual-language.md` §11, nothing invented to fill a navigation.
 */
export const where = {
  studio: 'studio',
  about: 'about',
  work: 'work',
  faq: 'faq',
  contact: 'contact',
} as const

export const site = {
  /** The title is the identity. There is no mark. */
  title: 'Chapter One',

  /** Arrives with the second shot of the footage. */
  openingLine: 'Where moments become digital.',

  /**
   * Beneath the timestamp. Deliberately not a city — the sentence notes that the
   * time belongs to whoever is reading it, and settles nothing about geography.
   */
  timeCaption: 'where you are',

  /**
   * Arrives last. `04-visual-language.md` §10 — words, and only what is needed.
   *
   * Three, where Chapter III's masthead carries five: this is the hero, and the hero's job is not to
   * offer a way around itself. Studio is the one that goes anywhere today.
   */
  nav: [
    { word: 'Studio', to: where.studio },
    { word: 'About', to: where.about },
    { word: 'Contact', to: where.contact },
  ] as const,

  /**
   * The positioning sentence. Not on the page as one line — this is the document's description, and
   * It is now the *only* place this sentence exists. Chapter III used to open on it, composed into three
   * authored lines; the chapter opens on the work instead, so there is no second copy to keep in step.
   * `decisions.md` §51.
   *
   * No longer `02-positioning.md` §1 verbatim — see `decisions.md` §48.
   */
  sentence: 'Digital experiences built for moments worth remembering.',

  /**
   * Chapter II. The whole of it, and it is meant to be the whole of it.
   *
   * The statement's two lines are authored, not left to the measure —
   * `04-visual-language.md` §4, in a statement where the line ends is part of the composition.
   *
   * Note: *unforgettable* is on the banned list in §12. Kept verbatim because it was specified,
   * and flagged rather than quietly changed.
   */
  two: {
    /**
     * The chapter marker, in the three parts it is made of, because it does not stay one thing:
     * `Chapter II` becomes `II Philosophy` while the visitor scrolls. The word leaves, the numeral
     * moves to where the whole mark was centred, and the topic arrives beside it.
     *
     * `word` is uppercased in CSS rather than here, so it is read normally. `topic` is not — it is
     * set the way `mark.label` is, because by then the mark is speaking in the same voice as the one
     * in Chapter III's corner: a numeral and a name, not a running head.
     */
    marker: {
      word: 'Chapter',
      numeral: 'II',
      topic: 'Philosophy',
    },
    statement: ['Every unforgettable moment', 'deserves an experience.'] as const,

    /**
     * Four occasions, one at a time, on a tighter cadence than the statement before them. Concrete
     * nouns and nothing else — `04-visual-language.md` §12. They name the kind of moment the studio
     * works on without explaining it, which is the job `05-storyboard.md` gives Beat 2's second line.
     */
    occasions: ['A wedding.', 'An exhibition.', 'An artist.', 'A final performance.'] as const,

    /**
     * Act III opens on this, as the light arrives. Then it is taken apart rather than removed: the
     * lead goes, *another* goes, and *chapter* is left alone before becoming the chapter marker.
     *
     * Split into parts because each leaves at its own moment. The full sentence still reads
     * "Some moments deserve another chapter." and the line break is still authored.
     *
     * Note: it closes on *another chapter*, which is how the Act II statement closes too. The phrase
     * lands twice in one act. Flagged rather than changed, since both lines were specified.
     */
    close: {
      lead: 'Some moments deserve',
      another: 'another',
      word: 'chapter',
      stop: '.',
    },
  },

  /**
   * The chapter marker, and what stands beside it once it has landed.
   *
   * Not a heading — a quiet orientation mark in the corner of a page, the kind a book puts in a running
   * head. The word `chapter` becomes it, and then it becomes Chapter III's masthead: the mark is the
   * way back to the top of the chapter, and the four words beside it are the rest of the studio.
   *
   * The order is the order the studio would say them in — who we are, what we made, what you will ask,
   * how to reach us. It is not alphabetical and it is not by importance.
   */
  mark: {
    numeral: 'III',
    label: 'Studio',
    /** The mark itself is a way back to the beginning of the chapter. */
    to: where.studio,
    nav: [
      { word: 'About', to: where.about },
      { word: 'Work', to: where.work },
      { word: 'FAQ', to: where.faq },
      { word: 'Contact', to: where.contact },
    ] as const,
  },

  /**
   * Chapter III. The storytelling has not finished — it has a third act, and this is what it says.
   *
   * One frame, transformed by scroll, and **the frame is the work**: the chapter's own mark opens an aperture
   * onto one composed moment of the studio's project, the work is alone and lit for a beat, the room goes to
   * evening and the work is named inside its own frame, the light goes down to a trace and the studio says
   * the one thing it says here, and then the light comes back as the frame draws in and is printed into a
   * plate on the page. There is no device, no annotation column and no atmosphere. `decisions.md` §53.
   */
  three: {
    /**
     * What the studio says, and it is now one sentence rather than two.
     *
     * Four words, on a frame that has just gone down to a trace to make room for them, and they are the
     * whole of the studio's voice inside the film. Given in the brief and verbatim.
     *
     * **`body` has left this object, and that is the point of §54.** *We create digital experiences that
     * become part of the memory itself* was held here — unused — against the day About existed, because
     * `04-visual-language.md` §4 separates type that **speaks** from type that **disappears** and an
     * explanation read inside a cinematic frame is the second kind in the wrong place. About exists, so the
     * sentence is in it: `publication.about.pull`, the one line in the essay that speaks. It is not copied
     * here as well — a sentence with two homes has two chances to be edited into disagreement.
     * `decisions.md` §53 and §54.
     */
    voice: {
      lead: 'We don’t build websites.',
    },

    /**
     * The work. One project, and the act is composed for exactly one — `05-storyboard.md` §8 Beat 3,
     * *one project, not a grid, not a carousel*.
     *
     * **Everything the act knows about the project is in this object, and it is now five lines.** §49 needed
     * eleven, because the act had a device in it: a viewport width to lay a document out at, a header read
     * written down, a word for the way in, a word for waiting, a word for failing, three sampled colours and
     * a fourth for the screen's spill. All of it went with the device. What is left describes a *shot* and a
     * *destination*, and nothing about how either is presented. `decisions.md` §53.
     *
     * Replacing the project is replacing these lines. Not one beat, distance or selector in the act refers
     * to a wedding.
     */
    work: {
      title: 'Wedding Experience',

      /**
       * **The fragment: one composed moment of the project, and the whole of what Chapter III shows.**
       *
       * Not the project's homepage, not a crop of it, and not a picture of it. A route the project itself
       * authored for exactly this: real HTML, its own type, its own photography, its own motion, composed to
       * fill whatever frame it is given from 9:19.5 through 21:9, with no navigation, no controls, no scroll
       * and no sound. `05-storyboard.md` §8 Beat 3 asked for *a fragment of the actual experience — a real
       * moment from it, behaving the way it behaves* and made it a construction requirement decided before
       * the piece is made; this is that, delivered.
       *
       * The contract is this URL and nothing else. There is no protocol, no message passing and no shared
       * code — the studio frames what it is given and narrates it.
       *
       * `null` is a composed path rather than a failure: the aperture opens onto the chapter's own ground,
       * the light still moves, and the type is still legible on it. `05-storyboard.md` §10 — *the atmosphere
       * degrades to type and ground, and type and ground alone still have to pass the five-second test*.
       */
      fragment: 'https://casamento-chi-ruby.vercel.app/studio-fragment',

      /**
       * **The whole experience, at its own size, in its own context.** The one outward action in the
       * chapter, offered on the paper once the film has been printed.
       *
       * Deliberately the only one. §51 had a word inside the device that entered the work and a line beside
       * it that left with it — the same verb twice, two hundred pixels apart, and a distinction the visitor
       * could not see in advance. There is nothing to enter now: the fragment is material, the experience is
       * elsewhere, and one line says so.
       *
       * `null` is honest and composes: the line stands and does not promise a press it cannot honour.
       */
      url: 'https://casamento-chi-ruby.vercel.app/',

      /**
       * **What the work is, in the fewest words the chapter can manage.** Set into the quiet band of the
       * work's own frame as the room goes to evening — the way the timestamp is set inside the hero's
       * photograph in Chapter I, and for the same reason: the type belongs to the material.
       *
       * A name and two lines, and that is the schema every future project gets — a wedding, an exhibition,
       * an artist, a final performance. §52 removed the index and the classification and recorded why: an
       * index numbers a set and this set has one member, and a classification is a portfolio card's
       * furniture on the one page meant not to be one.
       */
      context: {
        /*
          Two lines, and they are sized to *hold* as two lines: 33 and 32 characters, against the 37 the
          band fits at its narrowest wide width and the 38 it fits at 320. Measured, not estimated — the
          first draft's second line was 47 characters and wrapped to three, which turns two composed lines
          into an accidental paragraph. `04-visual-language.md` §4.
        */
        note: ['A mobile-first wedding experience.', 'Opened on the day. Kept after it.'] as const,
      },

      /**
       * The words on the one line that leaves. The arrow is a mark and is drawn in CSS.
       *
       * *Open* rather than *Explore*, because there is nothing here to explore any more — the work is
       * already on screen, and what this does is take the visitor to the whole of it. `04-visual-language.md`
       * §12, plain and specific: it says what pressing it does.
       */
      cta: 'Open the full experience',
    },
  },

  /*
    `four` — **`IV — Future Chapters` is gone, and there is no fifth chapter either.**

    It said, in typography, that there is one experience and the rest has not been written. That was an
    honest ending for a page which ended there, and once the studio's own pages exist it is the wrong thing
    in the wrong place: a chapter numeral standing between the film and About, announcing an absence, on the
    seam where the film is supposed to be releasing into a website. Removed on the owner's review of §54.

    **Chapter III is the last chapter.** Nothing replaces this, and nothing should: the copy is kept in
    `docs/design/copy-drafts.md`, where removed writing goes, and the day a second experience exists it is a
    second act and a brief rather than a section apologising for not existing yet. `decisions.md` §54.
  */

  /**
   * ══ The publication ══════════════════════════════════════════════════════════════════════════
   *
   * **Everything after the film, and it is deliberately not a fifth chapter.** The film is three acts and
   * a closing; what follows is the studio's own pages, in ordinary flow, at reading size. No numeral, no
   * marker, no pinned frame, no beat. `decisions.md` §54.
   *
   * The register change is the whole design of it. Chapter I to IV is type that **speaks** — a few words
   * at display size, composed inside a photograph. From here on it is type that **disappears** — a measure,
   * a leading, and paragraphs somebody should finish without noticing they were reading.
   * `04-visual-language.md` §4 says that recognising these as two different jobs is the decision; the film
   * only ever needed the first, `decisions.md` §03 said so, and §54 records that the site now needs both.
   *
   * Four sections, and no turn into them:
   *
   *   about     the room the work is made in, and one narrative beside it. Ninety-five words.
   *   method    how the work happens. Four plain answers and a consequence — never a numbered process.
   *   questions the practical ones, in the plainest form the page has. A change of register again.
   *   contact   one question, three conditions, one line to press, and the thing left behind.
   *
   * **There was a `fold` here, and it is gone.** One sentence stood between the film and About, at reading
   * size, saying plainly what the rest of the page held — a table of contents in a line, and the thing that
   * performed the change of register. Removed on the owner's review of §54, and the reasoning is better than
   * the sentence was: **the change of rhythm has to communicate that the film is over, not a sentence
   * announcing it.** A photograph and a paragraph after a pinned frame says it without being told.
   * `03-design-principles.md` §3 — silence is material, and this is a place to spend it.
   *
   * **Language.** `04-visual-language.md` §12 — plain, specific, unhurried, concrete nouns, no
   * superlatives. And a rule of its own here: the film has already spent *moment*, *experience*, *memory*
   * and *chapter*, so these pages earn their keep by being specific instead of repeating them. Where one
   * of those words does appear it is doing work no other word does (About's last clause, and Contact's
   * closing line, which is `01-vision.md`'s own).
   */
  publication: {
    /**
     * ── About ─────────────────────────────────────────────────────────────────────────────────
     *
     * **A photograph of the room the work is made in, and ninety-five words beside it.**
     *
     * This was an essay: a display statement, five labelled passages, a pulled line and a closing line —
     * about three hundred words under headings called *How it began* and *Why it exists*. It was accurate
     * and it read like a company page, which is the one thing About cannot be. Rebuilt on the owner's
     * review: the picture does most of the work, the writing is one continuous narrative, and the section
     * is over before anybody decides whether to keep reading. `decisions.md` §54.
     *
     * What the words have to carry, in this order and without a heading for any of them: **who is behind
     * it** (the first person, and the photograph), **how it came to exist** (what was watched happening),
     * **what the studio believes** (feeling is built, or it is missing), and **why it works differently**
     * (it starts with the occasion rather than the screen).
     *
     * **Voice.** `I` for the account, `we` for the studio, and the turn between them is the second
     * paragraph — `decisions.md` §08 exactly: the founding is the founder's, the work is the studio's, and
     * a first-person line never appears in the same breath as a claim about the work.
     *
     * ⚠ `opening` and `text[0]` are the only copy on this site that assert something only the founder can
     * confirm. They are written from `01-vision.md` §*Why we had to exist*, which describes this exact
     * observation, but the specifics are the founder's to keep or replace. Nothing else here claims a fact
     * about a person, a client or a business.
     */
    about: {
      label: 'About',

      /**
       * The room, at night, with one lamp in it — supplied for this section and not to be swapped for a
       * decoration. It is the studio's own material and it is doing three things no sentence here could:
       *
       *   it answers *who is behind it* without a portrait, a name or a biography. The person is turned
       *   away and small in the frame, which is `03-design-principles.md` §5 — we are not the subject;
       *   it is a **dark plate on paper**, which is exactly what the film ends as, so the publication's
       *   first page and the film's last frame are the same kind of object;
       *   it says *this is work done at a desk, at night, by one person*, which is the studio's whole
       *   claim about how few projects it takes, made without claiming it. §11.3 — nothing argues for us.
       *
       * `width` and `height` are the file's real dimensions, written down so the frame can be reserved
       * before the bytes arrive — `05-storyboard.md` §6 Beat 0, nothing shifts once an asset lands.
       *
       * `alt` describes the photograph plainly. It is not a caption and there is no caption: the picture
       * is not evidence of anything and does not need labelling.
       */
      portrait: {
        src: '/media/about/image19aug26.png',
        width: 1536,
        height: 1024,
        alt: 'A desk at night under one lamp: somebody at work, seen from behind.',
      },

      /**
       * The first line, and it is a sentence rather than a statement.
       *
       * Set larger than the paragraphs under it and in the same voice as them — a standfirst, not a
       * heading, so the narrative starts at the top and runs to the end without a label interrupting it.
       * Which is also why it is allowed to wrap: it is prose, and `04-visual-language.md` §4's rule about
       * authored breaks applies to composed lines, not to the first sentence of a paragraph.
       */
      opening: 'I spent years making things for the parts of life that repeat.',

      /**
       * The rest of it. Two paragraphs, and the second is where the voice becomes the studio's.
       *
       * It closes on *digital experiences that become part of the memory itself* — the sentence given in the
       * brief, verbatim, but as the **last clause of a narrative** rather than as a slogan set on its own.
       * It held a display line of its own for one revision and read as a motto over a paragraph; here it is
       * the conclusion of an argument the two paragraphs before it have already made. `decisions.md` §54.
       */
      text: [
        'Then I watched a room being made ready for one afternoon — a year of decisions about light, about the order things would happen in — and the page every guest would see first had been filled in from a template in a morning. It carried the facts and none of the feeling.',
        'Chapter One is for the other kind of day. We start with the occasion rather than the screen: what it means, and what somebody should still have of it a year later. Digital experiences that become part of the memory itself.',
      ] as const,
    },

    /**
     * ── The method ────────────────────────────────────────────────────────────────────────────
     *
     * **The studio's questions, and what it hears in the answers.**
     *
     * This was four labelled moves and a consequence — *How we start · What we do · What you do · What we
     * argue about* — which is `05-storyboard.md` §8 Beat 5 delivered as written, and it was prose about a
     * method. It has been rebuilt so that the visitor **goes through** the method instead of reading a
     * description of it: the questions arrive one at a time, each brings the considerations the studio hears
     * in the answer, twelve of them accumulate in the space, and then all twelve converge into one line.
     * `decisions.md` §55, and the moves are kept in `copy-drafts.md`.
     *
     * Nothing here explains itself. There is no sentence saying *we listen*, *every project is unique* or
     * *we do not use templates* — `04-visual-language.md` §11.3, nothing argues for us, and the argument is
     * the composition. The one claim in the section is the last line, and by the time it arrives the visitor
     * has watched it being assembled.
     *
     * **The words are the language; where each one stands is not.** `globals.css` owns every coordinate,
     * because a position in a frame is composition and it changes with the screen — the same division the
     * plate and the act's own type are under.
     */
    method: {
      label: 'Method',

      /**
       * What the studio says before it asks anything. Four words, and they are the whole of its voice here.
       *
       * An invitation rather than a claim: the section is about listening, so the first thing on the frame
       * hands the floor to whoever is reading. 21 characters, inside the 24 a 320 frame holds.
       */
      invite: 'Tell us what matters.',

      /**
       * **The four questions, and the three considerations each one brings.**
       *
       * Every question is one the studio actually asks in a first conversation, and each is traceable:
       * *what is the moment* is `02-positioning.md` §3's first test; *who will be standing there* is §5's
       * uncomfortable condition in its own words — the person arriving, not the person paying; *what should
       * it feel like* is §3's second test; *what should remain* is `01-vision.md`'s *something that outlives
       * the day*.
       *
       * `hears` is what the studio takes from the answer, and every one is a **concrete noun**
       * (`04-visual-language.md` §12). They are not categories, services or values: they are the things a
       * real occasion is actually made of, and three of them — silence, pace, colour — are the studio's own
       * instruments, which is the quiet admission that the answer to *what should it feel like* is a set of
       * decisions rather than an adjective.
       *
       * Twelve is the number the frame holds at three distances without the composition becoming a list.
       * Adding a fifth question means a fifth line in the coordinate table in `globals.css` and nothing else.
       */
      asking: [
        { question: 'What is the moment?', hears: ['Time', 'Place', 'Light'] as const },
        { question: 'Who will be standing there?', hears: ['People', 'Names', 'Distance'] as const },
        { question: 'What should it feel like?', hears: ['Silence', 'Pace', 'Colour'] as const },
        { question: 'What should remain?', hears: ['Detail', 'Photographs', 'Memory'] as const },
      ] as const,

      /**
       * **The resolution**, given in the brief and used verbatim.
       *
       * Sentence case rather than capitals, and that is typography rather than copy: the studio speaks in
       * sentences everywhere, and `.card-marker` already sets the precedent that case is decided in the
       * stylesheet rather than in the words. Capitals here would import the register of a title card into the
       * one section that is not a chapter.
       *
       * `lines` are two authored lines — `04-visual-language.md` §4, where the line ends is part of the
       * composition — and 12 and 24 characters, so they hold at 320 as two.
       */
      answer: 'Your experience',
      lines: ['Built around', 'what makes yours unique.'] as const,
    },

    /**
     * ── The questions ─────────────────────────────────────────────────────────────────────────
     *
     * **A deliberate change of register, and the plainest thing on the site.** No statement at display size,
     * no rail composition, no reveal beyond the page's own: a label, one line saying what this is, and rows.
     * `04-visual-language.md` §10 — chrome is understood before it is used, and a row that opens when it is
     * pressed needs no learning.
     *
     * Every answer is drawn from something already decided. The three tests are `02-positioning.md` §3; the
     * wrong-studio answer is §4, which asks for exactly that sentence in the first ten minutes; one agreed
     * direction is `04-visual-language.md` §6; *the date does not move* is §7 of positioning read back.
     *
     * **Two questions are deliberately absent.** What it costs — `open-decisions.md` §6 has not been
     * answered, and a price posture invented here would be the first unsupported claim on the page. And how
     * fast a letter is answered, for the same reason: a reply time is a promise, and nobody has made it yet.
     */
    questions: {
      label: 'Questions',
      note: 'The practical ones. If yours is not here, ask it in the letter.',

      rows: [
        {
          q: 'What kind of work do you take?',
          a: [
            'Three things have to be true. It happens once. How it feels matters more than what it says. And there is something real to build from — a place, a person, a body of work. If all three hold, the field does not matter.',
          ] as const,
        },
        {
          q: 'Is this only for weddings?',
          a: [
            'No. A wedding is the project we can show end to end today. An exhibition, a release, an opening, a season, a private dinner — each one passes the same three tests, and each would be built from its own material rather than from this one.',
          ] as const,
        },
        {
          q: 'What if we only need a website?',
          a: [
            'Then we are the wrong studio, and we will say so in the first ten minutes. Somebody who wants a website will be better served, and considerably happier, elsewhere.',
          ] as const,
        },
        {
          /*
            Short because it is a row rather than a sentence: the long form — *the identity and the
            photographer we already have* — is 67 characters and took three lines on a 390 phone, which
            makes an index look like a paragraph. The specifics moved into the answer, where they belong.
          */
          q: 'Can you work with what we already have?',
          a: [
            'Yes, and it is the better starting point. An identity, a photographer, a name you have already chosen — we work from what exists rather than replacing it. What we ask for is one direction, agreed before anything is made and held across every part of it, including the parts nobody planned for.',
          ] as const,
        },
        {
          q: 'How long does it take?',
          a: [
            'It depends on the date, and the date does not move. Agreeing what the occasion means and the order things happen in takes the time; building is the shortest part of it. In the first conversation we say what is honestly possible before your date — and if the answer is nothing worth making, we say that instead.',
          ] as const,
        },
        {
          q: 'What happens after the day?',
          a: [
            'It stays. The work is made to be opened afterwards, and that is usually the part people go back to. Photographs arrive late, names change, something is added a year later — who does that, and how, is written down before we start rather than raised at the end.',
          ] as const,
        },
        {
          q: 'Who will we be talking to?',
          a: ['The person doing the work. There is nobody in between, and nobody to brief.'] as const,
        },
        {
          q: 'How does it start?',
          a: [
            'One letter, saying what is happening, when, and for whom. There is nothing to prepare.',
          ] as const,
        },
      ] as const,
    },

    /**
     * ── Contact ───────────────────────────────────────────────────────────────────────────────
     *
     * The end of the page, and it resolves rather than sells. `05-storyboard.md` §8 Beat 6: an ask with a
     * qualifier attached, the qualifier being the intake filter written as a human sentence, and it should
     * make some people not write, on purpose. Its failure mode, named there, is *a headline and a button*.
     *
     * `ask` is a question rather than an instruction, and it is the test from `02-positioning.md` §1 turned
     * back on the reader — *only happen once* is something they apply to themselves. It is the largest type
     * in the publication and it is still smaller than anything the film said.
     *
     * `close` is `01-vision.md`'s pull-quote, and it is the last thing on the site: `05-storyboard.md` §3
     * *Departure* — most people leave without acting, what they carry away is the real product, and it is a
     * state we design rather than an outcome we absorb.
     */
    contact: {
      label: 'Contact',
      ask: 'Is there something that only happens once?',

      terms: [
        {
          label: 'Write if',
          text: 'it happens once, how it feels matters more than what it says, and there is something real to build from — a place, a person, a body of work.',
        },
        {
          label: 'Not if',
          text: 'the date matters more than the result. We will say so in the first ten minutes, and you will be better served elsewhere. It costs us work, and we would rather it cost us that.',
        },
        {
          label: 'What happens next',
          text: 'It reaches a person, not a form. The first conversation is about the occasion — where it is, who is coming, and what you want people to still have of it afterwards. It is not about pages.',
        },
      ] as const,

      /**
       * The way to write, and the only pressable line outside the film.
       *
       * ⚠ `address` is `null` because nobody has decided one: the studio name resolves nothing about a
       * domain (`open-decisions.md` §1) and inventing an address here would be the one broken promise on
       * the page. `null` is the same composed, inert state `three.work.url` uses — the line stands, in the
       * page's quiet ink, and does not offer a press it cannot honour. Fill this in and it becomes a
       * `mailto:` link; nothing else changes.
       */
      write: {
        cta: 'Write to us',
        address: null as string | null,
      },

      close: 'What happens once deserves more than information.',
    },
  },
} as const
