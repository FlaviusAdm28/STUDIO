/**
 * All language lives here, never in components.
 * `04-visual-language.md` §12 — words are part of the sensory system, not a separate discipline.
 */

export const site = {
  /** The title is the identity. There is no mark. */
  title: 'Chapter One',

  /** Arrives with the second shot of the footage. */
  openingLine: 'The digital chapter begins here.',

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
    /** The chapter marker. Uppercased in CSS rather than here, so it is read normally. */
    marker: 'Chapter II',
    statement: ['Every unforgettable moment', 'has another chapter.'] as const,

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
   * The opening statement is `02-positioning.md` §1 verbatim, broken into three authored lines —
   * `04-visual-language.md` §4, in a statement where the line ends is part of the composition.
   *
   * The showcase copy is deliberately temporary. It exists so that layout, measure and rhythm can be
   * judged against real sentences rather than greeked text, and it is drawn from the locked documents
   * so it is at least in the right voice while it waits to be replaced.
   */
  three: {
    statement: ['Digital experiences', 'built for moments', 'that only happen once.'] as const,

    showcases: [
      {
        /** Given in the brief as an example, and kept verbatim. */
        lead: 'We don’t build websites.',
        body: 'We create digital experiences that become part of the memory itself.',
      },
      {
        /** Drafted from `01-vision.md` — attention given in advance, deliberately, by someone. */
        lead: 'One occasion. One arrival.',
        body: 'Attention is what turns a moment into one, and it has to be given a year early, on purpose, by somebody. That is most of the work.',
      },
    ] as const,
  },
} as const
