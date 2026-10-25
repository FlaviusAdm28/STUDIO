/**
 * Chapter One V5 — every word the site shows lives here. Components read this module and never
 * hardcode copy. `docs/design/v5/pages.md` says where each entry is used.
 *
 * Provenance of the copy, so the design owner can see what is approved and what is a draft:
 * - **Approved (V4)**: the studio sentence, the questions, the studio lines and the contact question
 *   — carried verbatim from the V4 working tree (`D:\STUDIO\content\site.ts`, read only).
 * - **Approved (V5 brief)**: the chapter names, the Weddings moments and their pieces, the Artists and
 *   Experiences offers — the design owner's own lists from the V4/V5 briefs.
 * - **M1 draft**: short summaries and interface labels marked `draft` below. For review; nothing in
 *   them names a project, client, number or price.
 */

export const studio = {
  name: 'Chapter One',
  sentence: 'Digital experiences built for moments worth remembering.',
  /** The same sentence with its display line breaks authored (desktop); a phone lets it wrap. */
  sentenceLines: ['Digital experiences', 'built for moments', 'worth remembering.'],
  /** Approved (V4): the anchor answer, used as the opening's concrete explanation. */
  explanation:
    'We design and build digital experiences for weddings, artists and unique occasions, tailored to each project.',
} as const

/**
 * The three chapters, in reading order. `href` is the route; the numeral is part of the name.
 * `summary` (draft) is a list of nouns taken from the approved services answer, short enough for
 * the contents of the opening at 390px. `line` is the approved services sentence for that chapter.
 */
export const chapters = [
  {
    id: 'weddings',
    numeral: 'I',
    word: 'Weddings',
    href: '/weddings',
    summary: 'Websites, invitations, seating plans, live galleries',
    tag: 'The work',
    line: 'Wedding websites, digital invitations, save-the-dates, seating plans and live photo galleries.',
  },
  {
    id: 'artists',
    numeral: 'II',
    word: 'Artists',
    href: '/artists',
    summary: 'Portfolios, digital exhibitions, release pages',
    tag: 'A proposal',
    line: 'Bespoke portfolios, digital exhibitions, interactive showcases and websites for projects, releases or collections.',
  },
  {
    id: 'experiences',
    numeral: 'III',
    word: 'Experiences',
    href: '/experiences',
    summary: 'Exhibitions, performances, launches, occasions',
    tag: 'A proposal',
    line: 'Tailored digital concepts for exhibitions, performances, launches and other occasions that deserve something different.',
  },
] as const

export type ChapterId = (typeof chapters)[number]['id']

/**
 * Approved (V5 brief): Weddings is told by the moment each piece is used. `image` is the photograph
 * that stands for the moment (ids in `src/lib/images.ts`); `reveal` marks a colour master.
 */
export const weddingMoments = [
  { moment: 'Before', pieces: ['Save-the-date', 'Wedding website', 'Digital invitation', 'RSVP'], image: '024', reveal: true },
  { moment: 'On the day', pieces: ['Seating plan', 'Day-of page', 'Live photo gallery'], image: '157', reveal: true },
  { moment: 'After', pieces: ['Private memory gallery', 'Thank-you page', 'One year on'], image: '347', reveal: false },
] as const

/** Approved (V4/V5 briefs): what can be commissioned in the two proposal chapters. */
export const offers = {
  artists: ['Portfolios', 'Online galleries', 'Digital exhibitions', 'Release pages', 'Press kits', 'Archives of work'],
  experiences: ['Exhibitions', 'Performances', 'Openings and launches', 'Occasions without a category'],
} as const

/** Approved (V4): the studio section. */
export const studioSection = {
  label: 'Studio',
  headline: ['We stay close', 'to every detail.'],
  paragraph:
    'We work directly with our clients from the first conversation to the final detail, shaping every experience around the occasion itself.',
  lines: ['No templates.', 'No copies.', 'Nothing made to fit twice.'],
} as const

/**
 * The questions, carried verbatim from the V4 working tree (`publication.questions.rows`,
 * uncommitted on branch `v4`). The anchor is a title with an intro, not a disclosure; the six after
 * it are the disclosures, ordered as a prospective client asks.
 *
 * `bespoke` in the Artists line stays: it is the natural name of the category here (M0 brief).
 */
export const questions = {
  label: 'Questions',
  anchor: {
    q: 'What do you actually create?',
    a: [
      'We design and build digital experiences for weddings, artists and unique occasions, tailored to each project.',
    ],
  },
  rows: [
    {
      q: 'What does it cost?',
      a: [
        'Every project is different. Pricing is tailored to your needs, the scope and the level of detail involved. Get in touch to discuss your idea and receive a personalised proposal.',
      ],
    },
    {
      q: 'What can you create for me?',
      a: [
        'Weddings — Wedding websites, digital invitations, save-the-dates, seating plans and live photo galleries.',
        'Artists — Bespoke portfolios, digital exhibitions, interactive showcases and websites for projects, releases or collections.',
        'Experiences — Tailored digital concepts for exhibitions, performances, launches and other occasions that deserve something different.',
      ],
    },
    {
      q: 'How does a project work?',
      a: [
        'We start with a conversation, agree on the creative direction, then develop the experience through feedback and refinements. Once everything is approved, we deliver the finished project and discuss any ongoing maintenance you may need.',
      ],
    },
    {
      q: 'How long does it take?',
      a: [
        "Timelines depend on the scope and complexity of each project. Once we define what you need, we'll agree on a realistic timeline before work begins.",
      ],
    },
    {
      q: 'Can you work with my existing team?',
      a: [
        'Absolutely. We can collaborate with your planner, photographer, venue or creative team to make sure everything works together.',
      ],
    },
    {
      q: 'What happens after the experience is live?',
      a: [
        "We'll make sure everything is ready for launch and show you how to manage your experience. Ongoing maintenance and support can be arranged around your needs.",
      ],
    },
  ],
} as const

/**
 * Instagram is the only contact channel until the design owner decides another. No form, address
 * or integration exists.
 *
 * - `profile` — verified 24 October 2026: HTTP 200, public profile *ChapterOne Studio*.
 * - `message` — intended destination, **not verified** (`ig.me` → `instagram.com/m/…` asks for a
 *   login). Not shown on the site until the design owner has tested it on a phone.
 */
export const contact = {
  cta: 'Start a project',
  /** Approved (V4). */
  ask: ['Is there something', 'that deserves its own experience?'],
  tell: 'Tell us about it.',
  /** Draft. */
  via: 'Write to us on Instagram',
  instagram: {
    label: 'Instagram',
    handle: '@chapterone.studio.pt',
    profile: 'https://www.instagram.com/chapterone.studio.pt/',
    message: 'https://ig.me/m/chapterone.studio.pt',
    messageVerified: false,
  },
} as const

/** Draft interface labels and image text. */
export const ui = {
  index: 'Index',
  contents: 'Contents',
  chapters: 'Chapters',
  openChapter: 'Open chapter',
  proposal: 'Proposal — a drawing, not a commissioned project',
  inPreparation: 'This chapter is being prepared.',
  backToIndex: 'Back to the index',
  credit: 'Photographs — Helder Couto',
  skipToContent: 'Skip to content',
  seeColour: 'See in colour',
  holdHint: 'Hold a photograph, or use its button, to see it in colour.',
  chapter: 'Chapter',
} as const

/** Alt text for the photographs and drawings (draft). */
export const media = {
  opening: {
    alt: 'A bride in a long white dress turns on an empty road at dusk, a scarf lifting in the wind.',
    caption: 'Photograph — Helder Couto',
  },
  weddings: {
    alt: 'A bride in a lace cap and a man behind her, both in profile with their eyes closed, in evening light.',
  },
  desk: {
    alt: 'A couple embrace in low golden light among pines; he kisses her forehead.',
    night: 'At night, a couple in white cross a street, lit by a flash.',
  },
  moments: {
    '024': 'From behind, a woman in a white suit and hat walks hand in hand with a man.',
    '157': 'A bride in a lace cap and a man behind her, both in profile with their eyes closed, in evening light.',
    '347': 'At night, a couple sit together on a stone wall, lit by a flash.',
  },
  plates: {
    art: 'A woman stands before a large abstract painting in a quiet room at dusk.',
    method: 'An empty desk under a lamp in a dark room; window light falls across the wall.',
    lamp: 'Someone works at a desk under a single lamp in a dark room.',
  },
  contact: {
    alt: 'A bride in a long white dress turns on an empty road at dusk, a scarf lifting in the wind.',
  },
  artists: { alt: 'Line drawing of a proposed online exhibition: one large work, its caption and a column of works.' },
  experiences: { alt: 'Line drawing of a proposed guide for an occasion on a phone: a programme, times and a small map.' },
} as const
