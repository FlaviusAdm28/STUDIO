/**
 * All language lives here, never in components.
 * `04-visual-language.md` §12 — words are part of the sensory system, not a separate discipline.
 */

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

  /** Arrives last. `04-visual-language.md` §10 — words, and only what is needed. */
  nav: ['Work', 'Studio', 'Contact'] as const,

  /** `02-positioning.md` §1. Not on the page — this is the document's description. */
  sentence: 'Digital experiences built for moments that only happen once.',

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
   * The chapter marker. Not a heading — a quiet orientation mark in the corner of a page, the kind a
   * book puts in a running head. The word `chapter` becomes the second line of it.
   */
  mark: {
    numeral: 'III',
    label: 'Studio',
  },

  /**
   * Chapter III. The storytelling has finished; this is the studio.
   *
   * Two halves that behave differently. The **manifesto** is what the studio is, and it does not move:
   * on a wide screen it holds the left column while the work goes by beside it. The **work** is one
   * experience studied in depth, a step at a time — not a portfolio, not a grid, and not a set of
   * alternating sections. `decisions.md` §45.
   */
  three: {
    /**
     * The manifesto. The positioning sentence is `02-positioning.md` §1 verbatim in three authored
     * lines — `04-visual-language.md` §4, in a statement where the line ends is part of the
     * composition — and the two lines under it were given in the brief and are kept verbatim.
     */
    manifesto: {
      statement: ['Digital experiences', 'built for moments', 'that only happen once.'] as const,
      lead: 'We don’t build websites.',
      body: 'We create digital experiences that become part of the memory itself.',
    },

    /**
     * The work.
     *
     * `experiences` is a list on purpose, and it is a list of one. Appending the second — an
     * exhibition, an artist, a hotel — is an entry in this array and nothing else: no new component,
     * no new stylesheet rule, no new motion value. That is the whole architecture, and it is why there
     * are no invented projects sitting here to make the page look fuller than the studio is.
     */
    work: {
      /** Above the first experience. A running label for the half of the chapter that changes. */
      label: 'Selected Work',

      experiences: [
        {
          title: 'Wedding Experience',

          /**
           * Where the live experience opens. `null` until it exists — the call to action is then
           * composed but not clickable, which is honest, where a link to nowhere would not be.
           */
          opens: null,
          cta: 'Open experience',

          /**
           * The experience, a step at a time. Each step is a named frame; `plate` is what fills it.
           *
           * `frame` is the *shape* the step needs and is chosen per step rather than inherited —
           * `04-visual-language.md` §5. A phone screen in a landscape frame is a reshaped image, which
           * that section forbids outright, so `Mobile` declares its own.
           *
           * `plate: null` is an honest empty frame: the composition exists and the asset does not.
           * Five of the seven are that today. The two that are filled are the footage already in this
           * repository and are **stand-ins, to be read as stand-ins** — the same disclosure entry 41
           * made about the held frame it used. Replacing any of them, or swapping a screenshot for a
           * live embed, is a change to this line and to nothing else.
           */
          steps: [
            {
              name: 'Homepage',
              frame: 'screen',
              plate: { kind: 'motion', src: '/media/hero/video/hero_demo2.mov' },
            },
            { name: 'Timeline', frame: 'screen', plate: null },
            {
              name: 'Gallery',
              frame: 'screen',
              /** A held frame of the hero's own footage, so a still costs nothing to show. */
              plate: { kind: 'still', src: '/media/hero/video/hero_demo4.mov', at: 1.2 },
            },
            { name: 'RSVP', frame: 'screen', plate: null },
            { name: 'Countdown', frame: 'screen', plate: null },
            { name: 'Mobile', frame: 'phone', plate: null },
            { name: 'Final screen', frame: 'screen', plate: null },
          ],
        },
      ],
    },
  },

  /**
   * The ending, and it is deliberately an ending rather than a shortfall.
   *
   * There is one experience, so the chapter closes by saying so instead of padding itself out. Typography
   * and nothing else — no illustration, no device, no invitation.
   *
   * **Remove this key and the section stops rendering.** That is the intended way for it to go: when
   * there is a second experience it has stopped being true, and nothing else needs touching.
   */
  four: {
    numeral: 'IV',
    label: 'Future Chapters',
    lines: ['Some stories', 'haven’t been written yet.'] as const,
  },
} as const
