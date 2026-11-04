/**
 * Chapter One V5 — every word the site shows, and every photograph, section by section (README #59).
 * Components read this module and never hardcode copy.
 *
 * Source: `docs/design/v5/storyboard.md` → *Texto aprovado*, approved by the owner 24–28 Oct 2026.
 * Alt text: written for each image and checked against it, 29 Oct 2026 (the owner asked for the check).
 * Every entry is approved (the last drafts on 1 Nov 2026).
 * `{name}`, `{time}` and the like are filled on the page from the visitor's arrival.
 *
 * Photographs: `src` is the derivative's base path under `public/` (`npm run images` writes
 * `<src>-<width>.avif|jpg`, plus `-aura` and `-mono` where marked in `scripts/images.mjs`).
 */

export const studio = {
  name: 'Chapter One',
  sentence: 'Digital experiences built for moments worth remembering.',
} as const

/** The five sections, in reading order: the bar, the menu and the anchors. The entrance has no number (#21). */
export const sections = [
  { id: 'work', number: '01', label: 'Work' },
  { id: 'method', number: '02', label: 'Method' },
  { id: 'about', number: '03', label: 'About' },
  { id: 'questions', number: '04', label: 'Questions' },
  { id: 'contact', number: '05', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']

/** Entrance — "Through the letters" (E1–E4). */
export const entrance = {
  /** The dedication: `Weekday, D Month · HH:MM`, or `Welcome back · …` after more than 30 minutes away (#66). */
  welcomeBack: 'Welcome back',
  title: 'CHAPTER ONE',
  subtitle: 'Digital experiences built for moments worth remembering.',
  /**
   * The three blades (E4): each chapter's photograph in B&W; decorative — the link reads the chapter's name.
   * `frame` places the subject in the oblique shape (owner, 29 Oct: "melhor centradas"): `y` the height shown on the
   * desktop and `yTall` in the phone's thin band (object-position), `zoom` and `shift` bring a subject off to one side
   * toward the middle (|shift| ≤ (zoom − 1) / 2, or the photograph's edge shows).
   */
  blades: [
    {
      chapter: 'weddings',
      image: '/media/v5/work/weddings-before',
      mono: false,
      frame: { y: '85%', yTall: '66%', zoom: 1, shift: '0%' },
    },
    {
      chapter: 'artists',
      image: '/media/v5/work/artists-always',
      mono: true,
      frame: { y: '50%', yTall: '40%', zoom: 1.3, shift: '-15%' },
    },
    {
      chapter: 'experiences',
      image: '/media/v5/work/experiences-during',
      mono: true,
      frame: { y: '35%', yTall: '42%', zoom: 1, shift: '0%' },
    },
  ],
  video: {
    wide: '/media/v5/entrance/hero-1920.mp4',
    tall: '/media/v5/entrance/hero-720x1280.mp4',
    posterWide: '/media/v5/entrance/poster-wide',
    posterTall: '/media/v5/entrance/poster-tall',
  },
} as const

type Piece = { name: string; line: string }
type Moment = { moment: string; image: { src: string; alt: string }; pieces: readonly Piece[] }

/**
 * Work — three chapters, three moments each. **The first piece of each moment is the one shown**
 * (README #60); the others follow in the storyboard's order. Every line approved one by one, 26 Oct.
 * Artists and Experiences are illustrated with AI images: proposals, never client work.
 */
export const work = {
  chapters: [
    {
      id: 'weddings',
      numeral: 'I',
      word: 'Weddings',
      moments: [
        {
          moment: 'Before',
          image: {
            src: '/media/v5/work/weddings-before',
            alt: 'Seen from behind, a couple walk hand in hand down an empty road, she in a white suit and hat, under a wide pale sky.',
          },
          pieces: [
            { name: 'Wedding website', line: 'One complete site for your wedding: your story, the day and how to get there, the tables, the menu, and a live gallery that stays open after the day.' },
            { name: 'Save-the-date', line: 'Your date, announced in your own way, before anything else is decided.' },
            { name: 'Digital invitation', line: 'The invitation itself, written and shaped for the two of you, made to be opened on a phone: the words, the date, the place and the way there.' },
            { name: 'RSVP', line: 'Your guests reply in a minute: who is coming, what they would like to eat, and anything you should know.' },
          ],
        },
        {
          moment: 'On the day',
          image: {
            src: '/media/v5/work/weddings-day',
            alt: 'Seen from behind, a bride walks along a road, her long veil spread wide in the wind.',
          },
          pieces: [
            { name: 'Live photo gallery', line: 'Your guests add their photos as the day unfolds, and everyone sees them appear, together, in one place.' },
            { name: 'Seating plan', line: 'The tables, laid out as they are in the room, so everyone finds their place on their phone, as they arrive.' },
            { name: 'Day-of page', line: 'The day, hour by hour: when the ceremony begins, when dinner is served, and where everyone should be.' },
          ],
        },
        {
          moment: 'After',
          image: {
            src: '/media/v5/work/weddings-after',
            alt: 'At night, lit by a flash, a couple in white cross a street arm in arm, looking at each other.',
          },
          pieces: [
            { name: 'One year on', line: 'A year later, the day comes back: a page that opens on your anniversary, with the moments you chose to keep.' },
            { name: 'Private memory gallery', line: "Your photographer's and your guests' photos, kept together in a private place, and only you choose who sees them." },
            { name: 'Thank-you page', line: 'The last page of the day: a thank-you your guests will want to keep.' },
          ],
        },
      ],
    },
    {
      id: 'artists',
      numeral: 'II',
      word: 'Artists',
      moments: [
        {
          moment: 'Always',
          image: {
            src: '/media/v5/work/artists-always-photo',
            alt: 'In a plain sunlit studio, a woman in paint-marked trousers stands back from a large unfinished canvas, a hand at her chin.',
          },
          pieces: [
            { name: 'Portfolio', line: "Your work, shown the way you see it: an artist's site built around your pieces, not around a template." },
            { name: 'Online gallery', line: 'A gallery that never closes, where each piece can be seen up close and at its own pace.' },
          ],
        },
        {
          moment: 'For a moment',
          image: {
            src: '/media/v5/work/artists-moment-photo',
            alt: 'Two visitors in silhouette stand in a long white gallery, framed works along the wall, a wide window behind them.',
          },
          pieces: [
            { name: 'Digital exhibition', line: 'Your exhibition, opened to anyone, anywhere, for as long as it runs.' },
            { name: 'Release page', line: 'Your new work, announced with the same care you put into making it.' },
          ],
        },
        {
          moment: 'On record',
          image: {
            src: '/media/v5/work/artists-record',
            alt: 'Hands lay out photographic prints and an open book on a long wooden table, in warm light.',
          },
          pieces: [
            { name: 'Archive of works', line: 'Every work you have made, numbered and dated, in an archive that grows with you.' },
            { name: 'Press kit', line: 'The page you send before anyone asks: who you are, what you make, and how to reach you.' },
          ],
        },
      ],
    },
    {
      id: 'experiences',
      numeral: 'III',
      word: 'Experiences',
      moments: [
        {
          moment: 'Before',
          image: {
            src: '/media/v5/work/experiences-before-photo',
            alt: 'At night, a stone arch lit in warm yellow opens onto a courtyard where a few guests stand, a round table in front.',
          },
          pieces: [
            { name: 'Invitation & RSVP', line: 'The invitation and the reply in one gesture: your guests open it, read it, and accept.' },
            { name: 'Event website', line: 'Your event, given its own address and its own look, from the first announcement to the day itself.' },
            { name: 'Teaser page', line: 'A first glimpse, before anything is revealed: enough to make people curious, not enough to say it all.' },
          ],
        },
        {
          moment: 'During',
          image: {
            src: '/media/v5/work/experiences-during-photo',
            alt: 'A grand piano and its stool in a panelled room, surrounded by dozens of lit candles on the floor.',
          },
          pieces: [
            { name: 'On-site guide', line: "What is happening now, what comes next and where to find it, open on every guest's phone while they are there." },
            { name: 'Digital programme', line: 'Everything you would hand out on paper, made to be read on a phone and kept afterwards.' },
            { name: 'Live gallery', line: 'The event as it happens, in photos from everyone in the room, gathered while it is still going on.' },
          ],
        },
        {
          moment: 'After',
          image: {
            src: '/media/v5/work/experiences-after-photo',
            alt: 'A candlelit table set with wine glasses and white calla lilies in a vaulted room, seen close to the glasses.',
          },
          pieces: [
            { name: 'Thank-you page', line: 'A thank-you to everyone who came, with a moment from the event and a word on what comes next.' },
            { name: 'Memory archive', line: 'A record of the occasion, for the people who were there and for those who will ask about it.' },
            { name: 'Shared gallery', line: 'One link for every guest, with the official photos and their own, side by side.' },
          ],
        },
      ],
    },
  ] satisfies readonly { id: string; numeral: string; word: string; moments: readonly Moment[] }[],
  footer: 'Every project is proposed for its occasion.',
  /** The chapters' title is their navigation (#62). */
  chaptersLabel: 'Chapters',
  /** On the desktop the shown piece says where it is (#60). */
  onThePhotograph: 'on the photograph',
  /**
   * The nine pieces at work over the photographs (#43; the storyboard's words, approved with it). They are
   * demonstrations, composed with the visitor's own date, time and name — never a client's project. `{…}` are filled
   * on the page; the works in the archive are placeholders of a demonstration, not real works.
   */
  demos: {
    // Approved word by word (owner, 1 Nov). The richer pieces of the options page
    // (https://claude.ai/artifact/VpGPN2hkMejVzWXhvjZJuN). Titles of works, places, the evening's hours and lines are a
    // demonstration's examples, never real works.
    // the wedding website as its countdown (owner, 29 Oct: "gosto da contagem"): to 25 August (owner, 30 Oct), always the
    // next one; the year turns over by itself (work-client.tsx)
    website: {
      title: 'Our day, in',
      titleNamed: '{name} — our day, in',
      day: { month: 8, date: 25 },
      units: ['days', 'hours', 'min'],
      reply: 'Reply by RSVP',
    },
    gallery: {
      label: 'Live photo gallery',
      count: '{n} photographs, shared today',
      newest: 'Just now · {where}',
      places: ['Table 4', 'The terrace', 'Table 2', 'By the fountain', 'Table 7', 'The dance floor'],
    },
    yearOn: {
      label: 'One year on',
      line: 'Your day, a year later.',
      lineNamed: '{name}, your day, a year later.',
      open: 'Open your day',
    },
    portfolio: {
      title: 'Selected works',
      titleNamed: 'Works by {name}',
      info: 'Info',
      filters: ['All', 'Painting', 'Drawing', 'Prints'],
      works: ['Morning room', 'Study in amber', 'Light, west wall', 'Untitled'],
    },
    exhibition: {
      room: 'Room I of III',
      open: 'Open since {time}',
      number: 'No. 07',
      title: 'Light, west wall',
      medium: 'Oil on linen',
    },
    archive: {
      title: 'Archive',
      count: '4 works',
      works: [
        ['Untitled', 'Oil on linen'],
        ['Amber room', 'Oil on board'],
        ['Light study', 'Charcoal'],
        ['Untitled II', 'Oil on linen'],
      ],
      search: 'Search the archive',
    },
    invitation: {
      kicker: 'An invitation',
      kickerNamed: 'Dear {name}',
      title: 'An evening of music',
      date: '{weekday}, the {ordinal} of {month}',
      where: 'Doors at 20:00 · The courtyard',
      accept: 'Accept',
      accepted: 'See you there',
    },
    guide: {
      title: 'Tonight',
      titleNamed: '{name}, tonight',
      now: 'Now',
      next: 'Next · in 24 min',
      nowItem: 'Dinner in the courtyard',
      nextItem: 'Music on the terrace',
      nextWhere: 'Up the stairs, on your left',
      programme: ['Arrivals', 'Dinner', 'Music'],
    },
    thanks: {
      title: 'Thank you for coming.',
      titleNamed: 'Thank you for coming, {name}.',
      line: 'It was a night to remember.',
      link: 'The photographs',
    },
  },
} as const

export type ChapterId = (typeof work.chapters)[number]['id']

/** Method — "Made for whoever arrives" (states 7–11). The words inside the screens come with M6. */
export const method = {
  thesis: 'No templates. No copies.',
  makeItYours: 'Make it yours',
  nameLabel: 'Your name',
  cover: {
    title: 'Chapter One',
    untitled: 'Your first chapter',
    named: 'Chapter One · for {name}',
    begun: 'a first chapter, begun on {weekday}, the {ordinal} of {month}, at {timeInWords}',
  },
  close: 'Made once, for one moment.',
  closeNamed: 'For {name}.',
  steps: ['Conversation', 'Creative direction', 'Development with your feedback', 'Launch & aftercare'],
  screenWedding: {
    src: '/media/v5/method/screen-wedding',
    alt: 'On an empty road under a wide pale sky, a man in black and a woman in a white suit and lace veil stand face to face.',
  },
  /** The template every screen starts as (state 7): the same six times, the name in place of the title once written. */
  template: { logo: 'Logo', title: 'Your title', button: 'Button' },
  /** The six live screens (states 8–9, README #35, #49; words as in the approved storyboard). {weekday} {day} {month}
   *  {ordinal} {time} {timeInWords} {year} {name} are the visitor's own; without JavaScript the plain line is shown. */
  screens: {
    wedding: {
      label: 'Wedding website',
      nav: ['Our day', 'Story', 'RSVP'],
      title: 'The {ordinal} of {month}',
      named: '{name}',
      namedLine: 'the {ordinal} of {month}',
      plain: 'Our day',
      line: '{weekday} · {time}',
    },
    rsvp: {
      label: 'RSVP',
      kicker: 'RSVP',
      title: 'Will you join us?',
      named: '{name}, will you join us?',
      units: ['days', 'hrs', 'min', 'sec'],
      line: '{weekday}, at {timeInWords}',
      yes: 'Joyfully accept',
      no: 'Sadly decline',
    },
    portfolio: { label: 'Portfolio', title: 'Portfolio', line: 'Selected works · {year}', namedLine: 'Works · {year}' },
    exhibition: { label: 'Digital exhibition', kicker: 'Room I', title: 'Open since {time}', named: '{name} — Open since {time}', plain: 'Open now' },
    event: {
      label: 'Event website',
      kicker: '{weekday} {day} {mon}',
      title: 'Doors {time}',
      plain: 'Doors open',
      line: 'An evening of music',
      named: 'An evening for {name}',
      button: 'Get the guide',
    },
    guide: {
      label: 'On-site guide',
      kicker: 'Tonight',
      title: 'You are here',
      named: '{name}, you are here',
      rows: ['Arrivals', 'Dinner in the courtyard', 'You arrive', 'Music on the terrace'],
      arrives: '{name} arrives',
    },
  },
} as const

/** About (states 12–14). One photograph: the B&W is derived from the colour frame. */
export const about = {
  role: 'Founder · Chapter One',
  greeting: "I'm Flávio.",
  paragraphs: [
    'So much around us is made to look the same. Yet each of us lives, feels and creates in our own way.',
    'I have always loved art and the moments that stay with us. Chapter One is made from the start for each person and each moment, because no two lives are the same.',
  ],
  credit: 'Portrait — Helder Couto',
  colourHint: { hover: 'Hover for colour', hold: 'Hold for colour' },
  portrait: {
    src: '/media/v5/about/portrait',
    alt: 'Flávio, the founder of Chapter One, stands on a hillside in the sun.',
  },
  // the lit room behind the portrait (scripts/about-room.mjs): `-mono|col-wide|tall.png`. The AI workspace image is not used (README #50)
  room: {
    src: '/media/v5/about/room',
    alt: '', // decorative: the room behind the portrait
  },
} as const

/** Questions (states 15–18): the anchor, then eight questions (README #53). */
export const questions = {
  anchor: {
    q: 'What do you actually create?',
    a: 'We design and build digital experiences for weddings, artists and unique occasions, tailored to each project.',
  },
  rows: [
    {
      q: 'What does it cost?',
      a: 'There is no price list, because nothing here is made twice. A single piece, such as a save-the-date or an RSVP page, starts from €50. Larger experiences, like a complete wedding website, are quoted after a first conversation, around what you need.',
    },
    {
      q: 'How long does it take?',
      a: 'It depends on what we make together. A single piece usually needs about two weeks; a complete wedding website, around two months. If your date is close, talk to us and we will tell you honestly what is possible.',
    },
    {
      q: 'How does a project work?',
      a: 'Four steps: Conversation, Creative direction, Development with your feedback, and Launch & aftercare. We talk first, agree on a direction together, build it with you, and stay with you once it is live.',
    },
    {
      q: 'What do you need from me?',
      a: 'A first meeting, where we shape the project and sketch the first idea together. Then your feedback along the way: we show you the work as it grows, with regular check-ins whenever they help.',
    },
    {
      q: 'Do you work in English and outside Portugal?',
      a: 'Yes. We are based in Portugal and work in Portuguese and English, with people anywhere in the world.',
    },
    {
      q: 'Is it only digital?',
      a: 'Yes, we make digital experiences. If you would like printed pieces alongside them, we can recommend partners, and some custom graphic work can be arranged.',
    },
    {
      q: 'What about the domain and hosting?',
      a: 'It depends on the project. The domain is not included in the price. Maintenance is included for the first year, and we can also set everything up wherever you prefer.',
    },
    {
      q: 'Can you work with my existing team?',
      a: 'Absolutely. We can collaborate with your planner, photographer, venue or creative team to make sure everything works together.',
    },
  ],
} as const

/**
 * Contact (states 19–21) and the channels. *Talk to us* opens a direct message on Instagram —
 * `ig.me` verified by the owner on the Xiaomi, 28 Oct 2026 (README #72; iPhone still to test).
 * Telegram is in the colophon (#54); TikTok when it exists; email only when the owner gives one.
 */
export const contact = {
  ask: 'Is there something that deserves its own experience?',
  time: "You arrived at {arrived}. It's {now} now — a good moment to tell us about it.",
  cta: 'Talk to us',
  ctaNamed: 'Talk to us, {name}',
  message: 'https://ig.me/m/chapterone.studio.pt',
  colophon: {
    signature: 'Built around you.',
    signatureNamed: 'Built around {name}.',
    year: 'Chapter One · {year}',
    index: 'Index',
  },
  channels: [
    { label: 'Instagram', handle: '@chapterone.studio.pt', href: 'https://www.instagram.com/chapterone.studio.pt/' },
    // t.me is Telegram's public link form for the handle the owner gave (#54); accepted by the owner 29 Oct.
    { label: 'Telegram', handle: '@flavius28', href: 'https://t.me/flavius28' },
  ],
} as const

/** The bar and the menu (README #56, #67, #69, #71). */
export const nav = {
  menu: 'Menu',
  close: 'Close',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  hello: 'Hello, {name}.',
  yourTime: 'Your time · {time}',
  skipToContent: 'Skip to content',
} as const
