/**
 * All language lives here, never in components.
 * `04-visual-language.md` §12 — words are part of the sensory system, not a separate discipline.
 */

/**
 * Where a link goes. Section names, not hrefs — `page.tsx` writes the `#` on one side and the `id` on
 * the other, so a destination and the thing it points at cannot drift apart.
 *
 * **These are section ids, and they are no longer the same list as the Ledger's destinations.** V2 §6
 * gives the Ledger five: *Work · About · Method · Questions · Contact*. Two of them are not ordinary
 * anchors and that is the whole point of the difference:
 *
 *   `work`      is not here at all. §6 makes it an **aside** — *"Clicking WORK does not navigate; it
 *               pulls the register out of the margin along that rule, over the frame the visitor was
 *               already in."* There is nothing to point at, so there is no id and no `#work`.
 *   `studio`    is here and is **not** a destination. It is the act's own id, somewhere for the mark to
 *               lead back to; under V2 the film's position is carried by the chapter ticks instead.
 *
 * `method` gains an id. `decisions.md` §54 argued it should have no destination — that is the pre-V2
 * build's reasoning and V2 supersedes it, which `implementation-reconciliation.md` C2 records.
 * `faq` is now `questions`: §4 calls the section Questions and the Ledger says so.
 */
export const where = {
  studio: 'studio',
  about: 'about',
  method: 'method',
  questions: 'questions',
  contact: 'contact',
} as const

/**
 * **The projects, and there is one.** The reusable record for a piece of the studio's work — everything
 * the site needs to know about a project, in one place, keyed by id.
 *
 * The act was always composed for exactly one project (`05-storyboard.md` §8 Beat 3 — *one project, not a
 * grid, not a carousel*) and it still is. What this adds is not a second project; it is the **shape** a
 * second project would arrive in, so that arriving is a record rather than a refactor.
 *
 * ## The plate and the experience are different things, and confusing them breaks the Environment
 *
 *   `plate`           a photograph. The **Environment's ground** for V2 states 06–09 — graded, panned and
 *                     held behind the film's own typography. It is a picture of the project's world.
 *   `fragment`        a route the project authored for the studio: one composed moment of the real thing,
 *                     full bleed, no chrome, no navigation. What Chapter III's held frame shows.
 *   `experienceUrl`   the whole project, at its own size, in its own context. What the Work aside opens.
 *
 * `final-design-spec.pdf` §11.1 is unambiguous about why the first of those cannot be either of the
 * others: state 09 is *"the continuous environment element, venice plate, brought to true exposure"*, and
 * *"a work surface that replaces the environment… breaks the law and the 08 → 09 lift together."* A live
 * project is never the ground it stands on.
 *
 * ## Adding the next project
 *
 * A record here, a directory at `public/media/projects/<id>/`, and the plate in it. Nothing else: no beat,
 * no distance and no selector anywhere in the project names a wedding. `decisions.md` §49 and §51.
 *
 * **Selecting between projects is not built.** `activeProject` below is the whole of it — one pointer,
 * because there is one project. The Environment and the Work aside will read the active project rather
 * than a hardcoded id when C5 and Work navigation are implemented; until then this is the single source
 * for the values the act already uses.
 */
export const projects = {
  venice: {
    /** The id, and it is also the asset directory: `public/media/projects/venice/`. */
    id: 'venice',

    /**
     * The display name. §2's row for state 09 reads *The work — Wedding Experience*, so this is the
     * spec's own name for it rather than the couple's names: the studio shows what it makes, and whose
     * wedding it is belongs to the project and not to the studio's homepage.
     */
    title: 'Wedding Experience',

    /**
     * **The Environment plate — produced and supplied, 27 August 2026.** It carries V2 states 06–09:
     * *Some moments deserve another chapter* (06, exposure .13), *Chapter III* (07, .09), the Ledger
     * writing itself (08, .19, plate panned 20%), and *the work* (09, exposure 1.00, the brightest
     * state on the site). It is a picture of the project's world, never the project — §11.1: state 09
     * is *"the continuous environment element, venice plate, brought to true exposure"*.
     *
     * The file is `venice.png` rather than the `plate.png` the README specified in advance. The name
     * is the delivered master's, and the record follows the asset rather than the asset being renamed
     * to follow a record. `public/media/projects/venice/README.md` carries the specification, what was
     * measured in the delivered file, and where it departs from what was asked for.
     *
     * **One departure from that specification, measured and accepted when the plate was locked.** It is
     * 1536 × 1024 against a stated minimum of 2560, and at the 1440 × 760 reference frame `cover` leaves
     * **no horizontal slack at all**. C5 manufactures the room instead of finding it: `globals.css` gives
     * the venice layer a width of `100% + 20vw`, so state 08's locked 20% pan always has exactly its own
     * distance to travel. The cost is a resample of a 1536px source, and C7 puts exact pixels last.
     *
     * **The pan direction is derived from this file and is not free.** The plate was replaced on 27 August
     * 2026 — the first master is kept as `venice_old.png` — and the derivation was re-run against the one
     * that ships. Measured by column profile: the canal, the sun on the water, the moored gondolas and
     * Santa Maria della Salute above them occupy plate x 0.00–0.56 at 48–70% open water and sky; the quay,
     * the palazzo wall and the two walking figures occupy the right, and x 0.62–0.75 is the darkest eighth
     * of the frame at mean luminance 21 against the lit water's 126. §3's 08 → 09 is *"the frame pans off
     * the canal"*, so **the frame travels right across the plate and the plate translates left**. Panning
     * the other way walks into more water and more gondolas and the mechanism inverts.
     */
    plate: '/media/projects/venice/venice.png',

    /**
     * **How this plate reads behind the rail** — three measurements, written down.
     *
     * Sampled in Chrome at 1920 × 889 inside the Ledger's own rectangle (120 × 226 at x41 y266) under
     * the same `cover` crop the Environment paints, as relative luminance:
     *
     *   `lum`   `0.6 · p85 + 0.4 · p95` — the highlights, which are what break cream type at the
     *           caption register. The mean says nothing useful: it is dominated by the dark half of
     *           the box and cannot tell you whether `CONTACT` survives a bright band crossing it.
     *   `mid`   the median — whether the box is *mostly* lit or mostly dark. This is what decides
     *           which ink the rail is printed in, and it is a different question from `lum`: venice
     *           has a bright top and a median of 0.019, so it is a dark ground with a highlight in it.
     *   `floor` the 5th percentile — the darkest corner the type has to clear **once the ink is dark**.
     *
     * None of it can be discovered at runtime: the plates are painted through a filter chain, behind
     * other plates, at an exposure that is a function of scroll, and sampling a canvas every frame to
     * find out would cost more than the thing it pays for. Measured once and recorded, exactly as
     * `three.work.embeds` is. **A new plate needs its own three numbers**;
     * `src/motion/environment.ts` turns them into the ink and the field, and argues both curves.
     */
    rail: { lum: 0.453, mid: 0.019, floor: 0.003 },


    /**
     * The composed moment Chapter III holds. Measured live and returning 200 — the project authored this
     * route for exactly this purpose, and the contract is the URL and nothing else.
     */
    fragment: 'https://casamento-chi-ruby.vercel.app/studio-fragment',

    /** The whole experience. The one outward action in the chapter. */
    experienceUrl: 'https://casamento-chi-ruby.vercel.app/',

    /**
     * **Whether the project consents to being framed, and it is a measured header written down.** It
     * cannot be discovered at runtime — a frame that refuses to load does so silently and after the
     * visitor has already pressed. `decisions.md` §49 records the two attempts that proved it.
     *
     * Measured 26 August 2026: the response carries **no `X-Frame-Options` and no
     * `Content-Security-Policy: frame-ancestors`** — only `server: Vercel`. So it embeds. Re-measure if
     * the project is redeployed behind different headers; this line is a fact with a date on it, not a
     * capability the code can trust forever.
     */
    embeds: true,

    /**
     * What the work is, in the fewest words the chapter can manage. Two lines, sized to *hold* as two
     * lines — 33 and 32 characters against the 37 the band fits at its narrowest wide width and the 38 it
     * fits at 320. Measured, not estimated. `04-visual-language.md` §4.
     */
    context: {
      note: ['A mobile-first wedding experience.', 'Opened on the day. Kept after it.'] as const,
      /**
       * **Who and what, in the fewest lines the corner can hold** — C13, 7 September 2026.
       *
       * These were `couple` and `occasion`, set beneath state 09's 80px *Wedding Experience* headline.
       * That headline is retired: it repeated the category standing above it (*Wedding experiences*)
       * and it covered the couple in the photograph. What is left is the identification of the picture
       * — small, editorial, in the lower right — and it is the same two fields every experience carries
       * so the corner does not have to know which project it is showing.
       */
      identity: 'Raquel & Flávio',
      meta: ['28 · 08 · 2027 — VENICE'] as const,
    },
  },

  /**
   * **The second experience — Cibele, 7 September 2026, design owner (C13).**
   *
   * The record that made the shape real. `projects` said above that a second project should arrive as a
   * record rather than a refactor; this is that claim being tested, and it held: the only things added
   * are the fields the carousel reads.
   *
   * **The plate is the experience's own photograph, not a ground for the film.** venice is both — it
   * carries states 06–09 *and* it is experience one — because the film happens to end on the world the
   * first project lives in. This one is only ever the second card of the Work, so it is never mounted by
   * `motion/environment.ts` and never graded by a state.
   */
  artist: {
    id: 'artist',

    /** The project's own name, for the aside. The Work section shows its category, in `makes.categories`. */
    title: 'Art Experience',

    /** `public/media/projects/artist/art.png`, supplied 7 September 2026. */
    plate: '/media/projects/artist/art.png',

    /**
     * **How this plate reads behind the rail** — three measurements, written down.
     *
     * Sampled in Chrome at 1920 × 889 inside the Ledger's own rectangle (120 × 226 at x41 y266) under
     * the same `cover` crop the Environment paints, as relative luminance:
     *
     *   `lum`   `0.6 · p85 + 0.4 · p95` — the highlights, which are what break cream type at the
     *           caption register. The mean says nothing useful: it is dominated by the dark half of
     *           the box and cannot tell you whether `CONTACT` survives a bright band crossing it.
     *   `mid`   the median — whether the box is *mostly* lit or mostly dark. This is what decides
     *           which ink the rail is printed in, and it is a different question from `lum`: venice
     *           has a bright top and a median of 0.019, so it is a dark ground with a highlight in it.
     *   `floor` the 5th percentile — the darkest corner the type has to clear **once the ink is dark**.
     *
     * None of it can be discovered at runtime: the plates are painted through a filter chain, behind
     * other plates, at an exposure that is a function of scroll, and sampling a canvas every frame to
     * find out would cost more than the thing it pays for. Measured once and recorded, exactly as
     * `three.work.embeds` is. **A new plate needs its own three numbers**;
     * `src/motion/environment.ts` turns them into the ink and the field, and argues both curves.
     */
    rail: { lum: 0.255, mid: 0.037, floor: 0.002 },


    /**
     * No fragment and no experience URL yet: the work behind this card is not built. Both are `null`
     * rather than a placeholder, exactly as `three.work.url` and `contact.write.address` are — the
     * composition renders the offer inert instead of inventing a destination. `decisions.md` §49.
     */
    fragment: null,
    experienceUrl: null,
    embeds: false,

    context: {
      note: null,
      /**
       * **Who and what, in the fewest lines the corner can hold.** The first line is the name at the
       * identity's own weight; the rest are the metadata under it. Two here and one for venice, because
       * a painter's work is dated and placed and a wedding is dated and placed on one line.
       */
      identity: 'Cibele',
      meta: ['Abstract / 2026', 'Porto & Madrid'] as const,
    },
  },

  /**
   * **The third category's work — Selected Projects, 16 September 2026, design owner (C14).**
   *
   * Arrives as a record, as the two before it did. Its plate is the experience's own photograph, like the
   * artist's: never mounted by `motion/environment.ts`, never graded by a state.
   */
  selected: {
    id: 'selected',

    /** The project's own name, for the aside. The Work section shows its category, in `makes.categories`. */
    title: 'Selected Projects',

    /** `public/media/projects/selected/selected.png`, supplied 16 September 2026. */
    plate: '/media/projects/selected/selected.png',

    /**
     * **How this plate reads behind the rail** — three measurements, written down.
     *
     * Sampled in Chrome at 1920 × 889 inside the Ledger's own rectangle (120 × 226 at x41 y266) under
     * the same `cover` crop the Environment paints, as relative luminance:
     *
     *   `lum`   `0.6 · p85 + 0.4 · p95` — the highlights, which are what break cream type at the
     *           caption register. The mean says nothing useful: it is dominated by the dark half of
     *           the box and cannot tell you whether `CONTACT` survives a bright band crossing it.
     *   `mid`   the median — whether the box is *mostly* lit or mostly dark. This is what decides
     *           which ink the rail is printed in, and it is a different question from `lum`: venice
     *           has a bright top and a median of 0.019, so it is a dark ground with a highlight in it.
     *   `floor` the 5th percentile — the darkest corner the type has to clear **once the ink is dark**.
     *
     * None of it can be discovered at runtime: the plates are painted through a filter chain, behind
     * other plates, at an exposure that is a function of scroll, and sampling a canvas every frame to
     * find out would cost more than the thing it pays for. Measured once and recorded, exactly as
     * `three.work.embeds` is. **A new plate needs its own three numbers**;
     * `src/motion/environment.ts` turns them into the ink and the field, and argues both curves.
     */
    rail: { lum: 0.735, mid: 0.189, floor: 0.092 },


    /** No destination yet, so the caption carries no offer — `null` rather than a placeholder. */
    fragment: null,
    experienceUrl: null,
    embeds: false,

    context: {
      note: null,
      /**
       * **A line above the name**, set in the metadata's own register — the design owner's copy has three
       * levels here (*SELECTED* / the name / where it is made), where a person's work has two. Optional:
       * the other captions do not carry one.
       */
      label: 'Selected',
      identity: 'A collection of singular projects',
      meta: ['Made in Porto', 'Shared with the world'] as const,
    },
  },
} as const

/**
 * The project the site is showing. One pointer, and it is not a selection system — there is one project,
 * and `05-storyboard.md` §8 Beat 3 composed the act for exactly one.
 */
export const activeProject = projects.venice

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
   * **The opening's quick navigation** — design owner, 30 September 2026, approved in the preview. It
   * replaces V2 §2's *I of III*, which is removed and not replaced by another counter: the narrative is one
   * continuous sequence (C8), and the Ledger carries orientation from state 08.
   *
   * It is an escape hatch of the opening, not a second navigation: it arrives on Chapter I's last beat
   * (`INTERFACE`), leaves with the tagline on 01 → 02, and is never on screen with the Ledger. Three
   * intents in page order — see the work, settle the questions, get in touch. About and Method are
   * narrative and are meant to be arrived at, not skipped to. Work lands where the rail's Work does.
   */
  nav: [
    { word: 'Work', to: where.studio },
    { word: 'Questions', to: where.questions },
    { word: 'Contact', to: where.contact },
  ] as const,

  /** The quick navigation's accessible name. */
  navLabel: 'Quick navigation',

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
   * **The Environment — one element, three plates, the whole session.**
   *
   * `final-design-spec.pdf` §11.1, locked: *"One element, mounted at the Hero, never unmounted, never
   * re-sourced, never `display:none`. Sections change its grade, its transform and its playbackRate —
   * nothing else."* §5, locked by §11.2: *"Three plates ship: `hero`, `venice`, `studio`."*
   *
   * These are the three, and this is the only place their files are named. `src/app/environment.tsx`
   * mounts them and `src/motion/environment.ts` decides which is present; neither knows a path.
   *
   * **There is no fourth.** Warm stone at state 13 is the hero plate's own sky band, enlarged and
   * graded — *"never as its own asset"* — and §11.2 states the cost of getting that wrong: *"If warm
   * stone loads as a separate image, states 13 and 14 become a swap and the locked 13 → 14 mechanism is
   * void."* `dawn_warm.png` exists in the storyboard package as a derivative and must never be
   * referenced here.
   *
   * **The venice plate comes from the project record**, not from a path written down twice. Swapping the
   * project swaps the plate — `projects` above, and `activeProject`.
   */
  environment: {
    /**
     * **The hero, and it is the footage.** Mounted at state 01 and never unmounted, so it is the same
     * element at states 13 and 14 that it was at state 01 — which is the whole of what makes the locked
     * 13 → 14 a change of crop on one negative rather than a swap.
     *
     * H.264 in a QuickTime container, declared with `src` and deliberately without a
     * `type="video/quicktime"` source hint — Chrome reports no support for that MIME and would discard
     * the file unplayed, where given the bytes directly it demuxes and plays it. This line moved here
     * from `opening.tsx` when the video stopped belonging to the opening; nothing else about it changed.
     *
     * `rate` is §11.1's third permitted channel and it is **1 everywhere**. C5's preflight P2 closed it:
     * no state-specific value is authored by the design, and state 13's near-still is reached by the
     * approved crop and grade rather than by slowing playback.
     */
    hero: {
      src: '/media/hero/video/hero_demo4.mov',
      rate: 1,
    },

    /**
     * **The venice plate — the ground for states 06–09.** From the active project, so the act, the Work
     * aside and the environment all name one record. `public/media/projects/venice/README.md` carries
     * what was measured in it and the two places it departs from the specification it was held to.
     *
     * `null` is a composed absence rather than a failure: the layer is simply not drawn, the film's own
     * grounds still stand, and nothing is ever seen to be broken.
     */
    venice: {
      src: activeProject.plate,
      alt: '',
    },

    /**
     * **The studio plate — the ground for states 10–12**, and the real still rather than the
     * storyboard-grade `studio_about.png` the Final Visual Master flags as the weakest plate in the
     * package.
     *
     * The room, at night, with one lamp in it. It answers *who is behind it* without a portrait, a name
     * or a biography — the person is turned away and small in the frame, which is
     * `03-design-principles.md` §5, we are not the subject.
     *
     * **It used to be an inset photograph inside About** and it is not one any more: C5's preflight P3
     * closed the composition — *the Studio photograph is the environment, About's typography sits above
     * it, no independent inset, no second image layer*. `width` and `height` are the file's real
     * dimensions, kept because a box that knows its ratio before the bytes arrive is `05-storyboard.md`
     * §6 Beat 0. `alt` is empty and `aria-hidden` is on the layer: the environment is a ground, not
     * content, and the page below it says everything that is said.
     */
    studio: {
      src: '/media/studio/image19aug26.png',
      width: 1536,
      height: 1024,
      alt: '',
    },

    /**
     * **The studio plate's second moment — the room once the person has left.**
     *
     * Same camera, same lamp, same wall, same plant, same books; the chair is pushed in and there is a
     * pen pot and a closed notebook on the desk. It is deliberately the *same frame* rather than a
     * second photograph of the same subject, because the whole of the About → Method passage is one
     * dissolve between them: anything that moved would stop being a moment passing and start being a
     * cut. Identical dimensions for the same reason.
     */
    method: {
      src: '/media/studio/method.png',
      width: 1536,
      height: 1024,
      alt: '',
    },
  },

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
     * **State 05 — the occasions, and there are three of them.**
     *
     * `final-design-spec.pdf` §4 reads *A wedding. · An artist. · A final performance.* There were
     * four, and *An exhibition.* is the one V2 does not carry.
     *
     * **The third is now *A memory.*** — design owner, 1 September 2026, approved on the B13 prototype
     * and carried here with it. It is the only word in the trio that names the *kind of thing* the
     * other two are rather than another occasion, which is what turns a list into a sequence and lets
     * *Some moments deserve another chapter.* answer it. Nothing else about the state changed: the
     * order, the sizes, the shares, the prohibitions and the choreography are all as approved.
     *
     * Concrete nouns and nothing else —
     * `04-visual-language.md` §12 — naming the kind of moment the studio works on without explaining it.
     *
     * **The order is load-bearing and the sizes are not here.** §4 composes them as **one optical centre
     * at three sizes** — 46px / 100%, 31px / 34%, 22px / 12% — where *each new occasion displaces the
     * previous one upward on that centre; the earlier occasions remain as residue*, and that residue is
     * what junction 05 → 06 then writes over. So the array's order is the stack's order, first to last,
     * and the three sizes and shares belong to `globals.css` for the same reason every other coordinate
     * does: a size in a frame is composition and it changes with the screen.
     *
     * §4 states four prohibitions on that composition and they are recorded here because they are the
     * shape of the copy rather than a note about the styling: **no lateral or side entry, no depth
     * scaling, no horizontal spreading, no per-occasion x offset.** *The three occasions never separate
     * horizontally.*
     */
    occasions: ['A wedding.', 'An artist.', 'A memory.'] as const,
    /*
      ── `close` is REMOVED — 7 September 2026, design owner (C13) ────────────────────────────────

      **`Some moments deserve another chapter.` is gone from the site.** Not disabled, not held back,
      not replaced by another conceptual line: **removed**, together with the survivor `chapter` it
      resolved onto and the `Studio` that once followed it.

      The reasoning, in the design owner's own terms: *the photograph and the spatial transition do
      that work.* The sentence explained in words that the visitor was entering another chapter, at the
      exact moment the film had a photograph, a camera move and a whole new section available to say it.
      It was the piece telling the visitor what the piece was about to do.

      **`A memory.` is the last typographic moment of the narrative** (`occasions` above). After it the
      photograph holds alone, and then it takes on its second job: the first experience of the Work.

      **Do not reintroduce a sentence here.** If a future session finds a document asking for one —
      §2's state-06 copy, §3's 06 → 07, C10, C11 or C12 — it is out of date, and
      `implementation-reconciliation.md` C13 is what supersedes it.
    */
  },

  /**
   * The chapter marker — the Ledger's running head, and the thing its rail is built around.
   *
   * Not a heading: a quiet orientation mark in the corner of a page, the kind a book puts in a running
   * head. It stays for the rest of the site.
   *
   * **Nothing becomes it.** This used to read *"the mark the travelling word becomes"* and *"the word
   * `chapter` becomes it"*, from when the sentence's survivor was carried into the corner and set down
   * as an identity. It is not: `chapter` ends the narrative and leaves, and this head is written in the
   * margin the camera opens, as type, at its own rank. C12, 7 September 2026.
   *
   * **`nav` has gone to `ledger` below.** The four words that used to stand beside it are now the
   * Ledger's index, which is a different object with a different lifetime — see there.
   *
   * **The mark is drawn, not set, from 2 September 2026.** It used to render as the two words
   * `III Studio`. It is now one stroke per character of `numeral` — three strokes, lying down and
   * stacked — because that is what the numeral already is: `III` in Schibsted Grotesk is three plain
   * bars, so the mark and the chapter numeral are the same three objects at two moments of one
   * movement. `TIMING.dock` is that movement.
   *
   * **`label` is no longer drawn.** `Studio` was never the studio's name — the studio is `title`
   * above, *Chapter One*, which signs the foot of the page as a colophon does — so as a wordmark it
   * named neither the chapter nor the studio. It survives here as the mark's **accessible name**, which
   * three bars cannot supply on their own, and as the index's.
   */
  mark: {
    /** Drawn as one stroke per character. The chapter's numeral *is* the mark. */
    numeral: 'III',
    /** Not rendered as type. The accessible name of the mark and of the index it heads. */
    label: 'Studio',
    /** The mark itself is a way back to the beginning of the chapter. */
    to: where.studio,
  },

  /**
   * ── The Ledger ────────────────────────────────────────────────────────────────────────────
   *
   * **The rail, and it is one object with one lifetime.** V2 §6: *"A single persistent rail, 132px,
   * present from state 08 onward and never re-created."* The storyboard is more precise about the front
   * of it — *"present from frame one, unlit until the dock"* — and §2's Ledger column settles the two:
   * the rail carries the **mark alone** through states 01–07 and the **index is drawn at 08**.
   *
   * It replaces the masthead. Same object — a persistent mark and the rest of the studio — in the place
   * V2 puts it, with its state read from the spine rather than from a beat that reveals it once.
   *
   * **The words are §4's, in §4's order**, which is the order the index is drawn in at state 08: *"top
   * to bottom, WORK lit first."* Not alphabetical, not by importance — by the order the numeral gives
   * them up.
   *
   * **`to: null` on Work is the design, not an omission.** §6: *"The Ledger is the door. The route into
   * Work is an aside carried on the leader rule, and it is reversible."* It does not navigate, so it has
   * no href; `ledger.tsx` renders it as the one control on the rail. Everything else is an ordinary
   * anchor to an ordinary section.
   *
   * `id` is the spine's own destination name — `src/motion/spine.ts` — so what the rail lights and what
   * the film says are the same five strings, checked by the compiler.
   */
  ledger: {
    /*
      **The chapter ticks are gone, 2 September 2026 — design owner's direction.**

      They were `['I', 'II', 'III']`, the film's position drawn under the mark. Two things were wrong
      with them and both are in `spine.ts`. First, `ledger.chapter` reads `III` for states 07 through
      14 — eight of the fourteen — so the ticks were drawn from the dock onward and then never changed
      again: a position marker that marked nothing for the whole time it was on screen. Second, the mark
      above them was the numeral `III` as well, five lines away and at a heavier weight, so the rail
      carried the same glyph twice meaning two different things and the eye read it as a fault before it
      read it as a system. They were `aria-hidden` throughout, which is the build admitting it could not
      name their purpose.

      The rail now has one semantic purpose — **where you can go** — and the film's position is carried
      by the mark, which *is* the chapter numeral. See `TIMING.dock`.
    */
    /**
     * **The five chapters, and their folios.**
     *
     * The folio is the section's own number in the running order, and it is here rather than derived
     * from the array index for the reason every other word on the site is here: the day a chapter is
     * added, removed or re-ordered, the numbering is a decision somebody takes in the content and not
     * a side effect of a loop. It is set in the eyebrow register beside the running header — the same
     * voice `WHAT WE ACTUALLY MAKE` is in — and is never spoken as *chapter*.
     *
     * The order is the running order. `spine.ts`'s `ledger.active` names which of them the film is in,
     * and `ledger.tsx` promotes that one out of this list into the header.
     */
    destinations: [
      /*
       * **Work navigates, like every other chapter** — design owner, 26 September 2026: *"The rail is a
       * chapter navigation system. Clicking any chapter in the rail must navigate to that chapter."* It
       * was `null` and opened the Work aside over the frame the visitor was in (§6). Its destination is
       * the act the Work is written on (`#studio`), which lands on the Work composed and held.
       */
      { id: 'work', word: 'Work', folio: '01', to: where.studio },
      { id: 'about', word: 'About', folio: '02', to: where.about },
      { id: 'method', word: 'Method', folio: '03', to: where.method },
      { id: 'questions', word: 'Questions', folio: '04', to: where.questions },
      { id: 'contact', word: 'Contact', folio: '05', to: where.contact },
    ] as const,

    /**
     * **The index on a phone** — `implementation-reconciliation.md` C24, design owner, 28 September
     * 2026. Below 768px the head is one line and this word opens the Ledger as a page; the same place
     * reads `close` while it is open. A word and never a symbol: §10, *understood before it is used*.
     *
     * The button's accessible name is `named` followed by the running chapter's own word while closed
     * (*Index — current chapter: Questions*), and `closeNamed` while open. `label` names the open region.
     */
    index: {
      open: 'Index',
      close: 'Close',
      named: 'Index — current chapter:',
      closeNamed: 'Close index',
      label: 'Index',
    },

    /**
     * **The register — what the Work aside opens onto.**
     *
     * *"Work is not a page you go to. It is the film, paused and indexed."* So the register is an index
     * with one entry, and the entry is **the film's own work**: §2 state 09 and this are the same
     * project, which is what *Featured — plays as Chapter III* means. There is no second copy of it
     * here — `three.work` is the only place the project is described.
     *
     * **`n = 1`, and the second slot is schema only.** *"No second experience exists yet. This half is
     * drawn only when a real occasion fills it — never as an empty card."* That is V2 reaching the same
     * conclusion the pre-V2 build reached at `decisions.md` §46, from the other direction: the day a
     * second occasion exists it is a row in an index, and until then nothing is drawn.
     *
     * ⚠ The register's own copy is partial. §3's t27 also carries *Register · 2027*, *n = 1 · the frame
     * is the occasion*, *One occasion in the register* and *We take three a season*; the last is a claim
     * about how much work the studio takes and is the owner's to make, in the same way
     * `contact.write.address` is. They land with the copy pass. `back` is the one string here that V2
     * does not give in words.
     */
    register: {
      label: 'Work',
      note: 'One occasion. Shown whole.',
      featured: 'Featured — plays as Chapter III',
      back: 'Back to the film',
    },
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
    /*
      **`line` is gone from here — 7 September 2026, design owner.**

      It carried *What we actually make* as the Studio card's second line, and the Studio's arrival no
      longer has a second line at all: `chapter` ends the narrative, and what follows it is the name
      standing alone on the photograph. A deck under the name made the arrival a lockup — a title and a
      tagline — at the exact moment the piece had stopped being a title card.

      **The sentence itself was not retired, it moved.** It belongs to the work now, as the label over
      the categories the studio actually makes: `work.makes` below. Saying *what we actually make* and
      then showing the work is the same sentence doing a job; saying it under the studio's name was a
      claim with nothing under it.
    */

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
      /*
        **These four values now come from `projects` above, and that is the only change here.** The act
        reads `three.work` exactly as it did; what moved is where the strings live, so that a second
        project is a record rather than a search through this file. Same values, same types, no behaviour.
        Swapping the project is `activeProject`, once C5 and Work navigation read it.
      */
      title: activeProject.title,

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
      fragment: activeProject.fragment,

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
      url: activeProject.experienceUrl,

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
        note: activeProject.context.note,

          /*
          **The identification of the photograph, and it is no longer four lines under a headline.**

          C13, 7 September 2026. §4 gave state 09 *Wedding Experience · Raquel & Flávio · 28 · 08 · 2027
          — VENICE · Other experiences →*. The headline repeated the category now standing above it and
          covered the couple; the fourth line was a way sideways the section does not offer. What
          survives is the identification, small and in the corner, and it is the same two fields on
          every experience so the corner never knows which project it is showing.
        */
        identity: activeProject.context.identity,
        meta: activeProject.context.meta,
      },

      /*
        **`more` — *Other experiences →* — is REMOVED.** C13, 7 September 2026.

        §4 set it as state 09's fourth line, a way sideways out of the work. The section offers a way
        *in* now (`makes.cta`, *See full experience →*) and the experiences change on their own clock,
        so a second offer pointing outward was both a duplicate and a contradiction.
      */

      /**
       * **What the studio actually makes — and it is the whole of state 09 now.**
       *
       * Re-authored 7 September 2026, design owner (C13). It was a `label` over a list of three
       * category *words* — `Wedding experiences`, `Performances`, `Exhibitions` — with one shared offer
       * under them, scrubbed by scroll position. Two things were wrong with that and both are fixed
       * here:
       *
       *   - **The categories were words, not experiences.** Nothing stood behind `Performances`, so the
       *     line was a claim the page could not pay. There are two now and each one has a real
       *     photograph, a real person and real metadata; there is no third until there is a third
       *     project.
       *   - **Scroll chose the category.** Scroll owns the visitor's progress through the page — it
       *     must not double as a control for the content standing on it. The queue has its own
       *     clock (`TIMING.work.queue`), which is exactly what C8 reserves a clock for: *time owns
       *     only what the visitor did not cause.*
       *
       * ## The composition it feeds — C14, 16 September 2026 (Q2 · *fila que roda*)
       *
       * ```
       *   WHAT WE ACTUALLY MAKE      eyebrow · label · never moves, never changes
       *   ART   EXHIBITION   …       the queue · the category words themselves, small; the first one fills
       *   Wedding experiences        the category · the protagonist · left-aligned, never travels
       *
       *                                                       Raquel & Flávio      ← lower right,
       *                                                       28 · 08 · 2027 — VENICE  small, discreet
       *                                                       See full experience →   only with a URL
       * ```
       *
       * **The category word is the index.** The active category is the headline and is *not* in the
       * queue; the next one stands first and fills with time; when it is full it is promoted, the row
       * moves up and the category that was showing re-enters at the tail. No dots, no counter, no
       * arrows, no bars — the words are the whole of the navigation.
       *
       * **The offer is the work's, not the category's**, so it stands in the corner with the work it
       * opens and is simply absent where there is no work to open (`experienceUrl: null`).
       *
       * ## The categories
       *
       * **A category is a word, its headline and one representative work.** The homepage shows one work
       * per category; a newer work replaces the representative by changing `work` and nothing else. The
       * work is a `projects` record and nothing here restates it: the photograph is its `plate`, and the
       * corner reads `context.identity`, `context.meta` and `experienceUrl`. Adding a category is one
       * entry here.
       *
       * **The first is Wedding on `venice`, and that is what makes the entry into the Work a bridge rather
       * than a cut.** The film's own last frame *is* its photograph, so the section does not arrive on a
       * new image. Nothing is swapped to enter the Work.
       */
      makes: {
        label: 'What we actually make',
        cta: 'See full experience →',
        /* In order — this is the queue's order. The first must be the plate the film ends on. */
        categories: [
          { word: 'Weddings', headline: 'Wedding experiences', work: 'venice' },
          { word: 'Artists', headline: 'Art experiences', work: 'artist' },
          { word: 'Selected Projects', headline: 'Experiences beyond categories', work: 'selected' },
        ] as const,
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
    `docs/design/archive/design/copy-drafts.md`, where removed writing goes, and the day a second experience exists it is a
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
     * ── About · state 10 ──────────────────────────────────────────────────────────────────────
     *
     * **Two typographic groups, staggered and unequal, over the studio plate.**
     *
     * `final-design-spec.pdf` §4, verbatim, and the Final Visual Master's state-10 board is the
     * composition: *"Two typographic groups, staggered and unequal: headline 104px at x196 with its 16px
     * paragraph on a 474 measure, second principle 46px at x838 with 14.5px lines beneath it, hairline at
     * y452."* Each group owns the copy beneath it; neither is a heading over the other.
     *
     * **This replaces the narrative that was here.** About was a first-person account — *I spent years
     * making things for the parts of life that repeat* and two paragraphs after it — written against
     * `01-vision.md` §*Why we had to exist* and rebuilt twice. V2 does not carry it: the section is two
     * claims and their evidence, in the studio's own voice throughout, and the founder's account is not
     * one of the fourteen states. It is not kept alongside — a sentence with two homes has two chances to
     * be edited into disagreement, and §10 locks *all copy, verbatim per §4*.
     *
     * The photograph is the environment now and not an inset — C5's preflight P3, and
     * `site.environment.studio`.
     */
    about: {
      /**
       * The Ledger's word for this state, and the section's accessible name.
       *
       * **V2's board draws no printed label.** §6 gives About a destination in the rail and §2's row 10
       * gives the state two typographic groups and nothing else — so this is what a screen reader and the
       * rail call the state, not a word set above the headline. Whether it is drawn at all is C6's.
       */
      label: 'About',

      /**
       * The first group. 104px at x196 — one of the two largest sizes on the site, the other being state
       * 12's payoff at the same size and the same axis.
       *
       * **Two authored lines** — 16 September 2026. At display size the sentence is a composition, and
       * where it breaks is part of it (`04-visual-language.md` §4): the claim, then what it is close to.
       */
      headline: ['We stay close', 'to every detail.'] as const,

      /**
       * What stands under it: 16px on a 474 measure, which is 55 characters of reading type at the
       * board's own size. One sentence, because the headline is the claim and this is its evidence.
       */
      paragraph:
        'We work directly with our clients from the first conversation to the final detail, shaping every experience around the occasion itself.',

      /**
       * The second group, and it is deliberately the smaller one — 46px at x838, half the width of the
       * page away from the first. §4's *second principle*: the asymmetry is the composition.
       *
       * **Two authored lines** — design owner, 16 September 2026. Left to the measure it wrapped to two
       * lines and then to one while its tracking closed, and a statement that reflows mid-arrival reads
       * as an accident rather than as a decision.
       */
      principle: ['Built exclusively', 'for you.'] as const,

      /**
       * And its three lines, at 14.5px. Authored as three, not wrapped into three: the board sets them
       * with explicit breaks, and `04-visual-language.md` §4 is that in a statement where the line ends
       * is part of the composition. 14, 11 and 27 characters, so they hold as three at any width.
       *
       * *No templates* is `04-visual-language.md` §11.3 said in the studio's own words rather than
       * argued — nothing here explains why, because the section above it already did.
       */
      lines: ['No templates.', 'No copies.', 'Nothing made to fit twice.'] as const,
    },
    /**
     * ── The method · states 11 and 12 ─────────────────────────────────────────────────────────
     *
     * **Seven overheard lines, in sequence, and then the payoff.**
     *
     * `final-design-spec.pdf` §4, verbatim, and the Final Visual Master's state-11 board is the
     * composition: *"Seven overheard lines, in sequence and rising in scale: 15 · 16 · 17 · 18 · 21 · 26 ·
     * 36px — so the field is chronological as well as spatial."* They are not the studio speaking. They
     * are what is said in the room on the day, in the order it is said, and the last of them is the moment
     * the occasion starts.
     *
     * **This replaces the four questions and their twelve considerations.** The section was the studio
     * asking — *What is the moment? · Who will be standing there? · What should it feel like? · What
     * should remain?* — each bringing three words the studio hears in the answer, twelve accumulating in a
     * `perspective` space and converging into one line. That was `decisions.md` §55 and §56, it was
     * measured and tuned by eye, and V2 does not carry it: seven lines in one sequence, rising, on the
     * studio plate at exposure .12 — the deepest value on the site.
     *
     * **Nothing here explains itself**, which is the one thing the two versions agree on. There is no
     * sentence saying *we listen* or *every project is unique*: `04-visual-language.md` §11.3, nothing
     * argues for us. The studio's only words in state 11 are the question and the line under it, and the
     * line says plainly that no answer is wanted.
     *
     * **The words are the language; the scale ladder is not.** 15 → 36px belongs to `globals.css`, for the
     * same reason every other coordinate does. What is here is the seven lines and their order, because
     * the order *is* the chronology and it is therefore copy.
     */
    method: {
      /**
       * The Ledger's word for both states. §2 keeps *Method active* through state 12 as well — the payoff
       * is the method's own resolution and not a sixth destination.
       */
      label: 'Method',

      /**
       * **State 11 — the seven lines, in the order they are heard.**
       *
       * Read straight through they are one afternoon: the room filling, something going wrong, somebody
       * noticing, the decision to leave it, the thing nobody planned being seen, and then it beginning.
       * The scale rising with the sequence is what makes the field chronological rather than a list, so
       * the array's order is not a preference.
       *
       * The typographic apostrophes are deliberate — the same ones every other authored line here uses.
       */
      overheard: [
        'Is everyone here?',
        'Nobody planned that.',
        'Wait — look at this.',
        'Leave it like that.',
        'Did you see that?',
        'That wasn\u2019t meant to happen.',
        'It\u2019s starting.',
      ] as const,

      /**
       * **The studio's one question, and it is the second line of the main composition.**
       *
       * §2 anchors it at *62px serif, x196, bottom 142* — the foot of the frame, under the field it
       * answers. It is not there any more: the design owner asked on 19 September 2026 for this and
       * the answer below to be *"UMA composição editorial principal"*, so the two stand together on
       * About's own axis and vertical, at 44px under the answer's 78. `globals.css`, `.mmain`.
       *
       * §3's *survive* is why they are adjacent at all — the question's last word is the answer's
       * first — so `question` and `answer` are one mechanism and must be edited together.
       */
      question: 'What makes it yours?',

      /**
       * **Not drawn, and kept so it is not lost** — design owner, 19 September 2026.
       *
       * It was the fourth piece of the main composition, in micro-caps under the question: the only
       * thing in the section that told the visitor what was happening, which was that nothing was being
       * asked of them. The brief reduced the composition to three — *"Simplifica o conteúdo para apenas
       * estas três peças"* — and a fourth voice is exactly what it was.
       *
       * It stays here rather than being deleted for the reason `docs/design/archive` keeps removed copy:
       * the words were authored and the next brief may want them. Nothing renders it.
       */
      note: 'Nobody is asked to answer. The studio is listening.',

      /**
       * **State 12 — the payoff**, and the first line of the composition the question is the second of.
       *
       * §2 sets it at *104px at x196, y262*; it is set at About's own headline scale on About's own
       * vertical instead, which is the same axis and the same voice one section later — the reference
       * the 19 September brief gives by name. It is still the largest type on the site and it is still
       * reached by §3's *survive*: *"One word survives the question and is still in the answer: yours
       * → Your."*
       */
      answer: 'Your experience',

      /**
       * One 17px line beneath it. **One**, where the previous version authored two — `Built around` /
       * `what makes yours unique.` — because the board sets it as a single line and the break was V1's own
       * composition rather than the spec's.
       */
      line: 'Built around what makes yours unique.',

      /**
       * **One marginal annotation, and it was two** — design owner, 20 September 2026.
       *
       * It is a note in the margin of the field rather than a label on it: the brief asks for
       * *pequenas notas de margem / indicações editoriais relacionadas com o processo*, discreet,
       * *poucas são melhores*. It is set in the micro-caps register the rail and About's three
       * refusals already use, and it says what the field **is** rather than what the studio does —
       * `04-visual-language.md` §11.3, nothing here argues for us.
       *
       * **`Overheard, not directed` is removed and is not replaced.** It stood at the head of the
       * field, level with `Is everyone here?`, as that field's caption. The design owner took it out
       * on 20 September 2026 and asked for nothing in its place: the field says what it is by being
       * overheard, and a note explaining that was the one piece of type in the frame that described
       * the composition instead of belonging to it. `globals.css` keeps the surviving note's own
       * position; the field's line 1 is unchanged and now stands uncaptioned, which is the point.
       *
       * **No full stop**, where `about.lines` carry them: those are statements and this is an
       * annotation. A marginal note that punctuates itself is a sentence that has wandered out of the
       * column.
       *
       * It sits beside the last line it is true of. `globals.css` places it.
       */
      annotations: ['Kept exactly as it happened'] as const,

      /*
        **`Observe · Understand · Shape · Preserve` is removed** — design owner, 20 September 2026.

        It was the process signed rather than listed, four words in micro-caps at the foot of the
        frame. It is gone from the copy as well as from the frame, and it is deliberately **not**
        recorded here as a line that is kept but not drawn — the way `about.quiet` is — because what
        was decided is not that it should be silent: *"REMOVER COMPLETAMENTE. Não substituir por outro
        texto. Não tentar reconstruir essa ideia com novas palavras. A ideia do 'método' já está a ser
        comunicada pela própria cena e pelas frases ambientais."*
      */
    },
    /**
     * ── The questions · state 13 ──────────────────────────────────────────────────────────────
     *
     * **Seven pairs, locked and verbatim.** `final-design-spec.pdf` §13, *THE SEVEN PAIRS, LOCKED*, and
     * §10 lists *all copy · verbatim per §4, including the seven Q&A pairs and Contact* among the closed
     * decisions. Nothing here is written, chosen or ordered by this file; it is transcribed.
     *
     * **This replaces the eight rows that were here.** They were traceable — the three tests from
     * `02-positioning.md` §3, the wrong-studio sentence from §4, *the date does not move* from §7 — and
     * two questions were deliberately absent because `open-decisions.md` §1 and §6 were unanswered. V2
     * answers both in the open: row 4 states plainly that **there is no fixed package**, and row 5 that
     * the timeline is set against the date. So the absences are closed by the copy rather than worked
     * around, and the eight rows are not kept alongside the seven.
     *
     * **The interaction is §7 and it is not an accordion.** Seven rows of 76px from y213 on 1px hairlines,
     * question 31px, marker + / − at 19px on the right margin, progressive disclosure: a row opens on +
     * and closes on −, the answer sets beneath the question in the row's own measure, **multiple rows may
     * be open**, no row animates position, and nothing above a row moves. §7 also carries the one
     * non-negotiable in the document — the eighth rule at y529 is **owned by the page and not by the
     * list**, because if it is a child of the accordion then leaving Questions unmounts it and the locked
     * 13 → 14 becomes a coincidence the visitor cannot verify.
     *
     * **§4 gives no heading string for this state.** §2's anchor is *64px heading y86* and the board says
     * *seven rows, one heading* — but no words for it. `label` therefore still reads *Questions*, which is
     * §2's own name for the state and §6's word for the destination, and it is flagged rather than
     * invented: nothing in V2 authorises a headline here.
     */
    questions: {
      label: 'Questions',

      /**
       * **The seven pairs, §13 verbatim.** Each answer is one paragraph, which is how §13 sets them — the
       * array is the shape the row's measure needs and not an invitation to split one.
       */
      rows: [
        {
          q: 'What do you actually create?',
          a: [
            'We design and build digital experiences for occasions that happen once — weddings, exhibitions, performances, openings. That ranges from an immersive website to something built entirely around the occasion itself.',
          ] as const,
        },
        {
          q: 'Do I need a website?',
          a: [
            'Not always. Sometimes a website is exactly right. Sometimes the occasion needs something else. We work that out with you before anything is designed.',
          ] as const,
        },
        {
          q: 'How does a project start?',
          a: [
            'With a conversation about the occasion — what is happening, who it is for, and what people should leave with. Format comes after that, not before.',
          ] as const,
        },
        {
          q: 'How are projects priced?',
          a: [
            'There is no fixed package. Cost depends on what we are making and how far it goes — a focused site and a full experience are different pieces of work.',
          ] as const,
        },
        {
          q: 'How long does it take?',
          a: [
            'Weeks for something focused, longer for something built from nothing. We set the timeline against the date that matters, because in this work that date usually cannot move.',
          ] as const,
        },
        {
          q: 'Can you work with the people already involved?',
          a: [
            'Yes. Planners, photographers, curators and producers are often already in place. We can work alongside them, or take the digital experience from first idea to launch.',
          ] as const,
        },
        {
          q: 'What happens after the experience is live?',
          a: [
            'It arrives ready to share. We can also continue to host, maintain and update it after launch, when needed.',
          ] as const,
        },
      ] as const,
    },
    /**
     * ── Contact · state 14 ────────────────────────────────────────────────────────────────────
     *
     * **One question, one ruled line, three lines on the right margin.** `final-design-spec.pdf` §4,
     * marked *LOCKED, VERBATIM*, and §8 is its geometry: 92px serif at y152, the copy block at y468, and
     * the writing line resolving to **exactly y529** — the same rule that closed the Questions, which
     * never moved. *A threshold, not a bright page.*
     *
     * **This replaces the ask, the three terms and the closing line that were here.** The section was an
     * ask with a qualifier attached — *Is there something that only happens once?* — followed by three
     * labelled passages (*Write if · Not if · What happens next*) written as the intake filter in human
     * sentences, and a pull-quote from `01-vision.md` as the last thing on the site. V2 does not carry any
     * of it: the question is different, the qualifier becomes three micro-caps lines with no labels and no
     * paragraphs, and there is no closing line at all. §8 is explicit about what the state contains —
     * ground, Ledger, one rule, the headline, *"Tell us about it."*, then the section label, the arrow and
     * the three lines. Nothing else resolves in it.
     *
     * **The three lines are not the old terms shortened.** They are a different claim: the old ones said
     * who should write and who should not; these say how the studio works. Both were approved in their own
     * turn, and §10 closes it — *all copy, verbatim per §4*.
     */
    contact: {
      /** §6's word for the destination, and the section label §8 settles last. */
      label: 'Contact',

      /**
       * 92px serif at y152 — the largest type in the publication, and still quieter than anything the film
       * said. A question rather than an instruction, and the reader is the one who answers it.
       */
      /**
       * **Two authored lines** — design owner, 22 September 2026: *"Is there something / that
       * deserves its own experience?… Duas linhas apenas."*
       *
       * The words are §4's, verbatim and unchanged; what is authored is where the line ends, which
       * `04-visual-language.md` §4 makes part of the composition rather than part of the copy. It is
       * stored as an array for the same reason `about.headline` is: a break the stylesheet chooses is
       * a break that moves with the measure, and this one is the composition.
       *
       * It was one string under `text-wrap: balance` inside a 22ch measure, which gave four short
       * lines stacked in the top-left corner — a paragraph rather than a statement.
       *
       * ⚠ The second line is 33 characters. `decisions.md` §54 measured that a display line over 24
       * wraps on a 320 frame, so below about 900 these two become three or four and that is correct:
       * the authored break is the desktop composition, and a phone is not that frame.
       */
      ask: ['Is there something', 'that deserves its own experience?'] as const,

      /**
       * 21px Cormorant, and it is the writing line's own words rather than a subtitle to the question.
       *
       * §8 fixes it to the pixel and the arithmetic is worth keeping here because it is the reason this
       * string cannot be lengthened into two lines: the copy block sits at y468, this line's 21px on a 1.14
       * box is 24, the gap is 16, the arrow's 16px on 1.30 is a 21px row — 468 + 24 + 16 + 21 = **529**.
       * *The line is the constant, the block top is the variable.*
       */
      tell: 'Tell us about it.',

      /**
       * **Three lines, micro-caps, on the right margin, and they settle last.** §4 sets them in caps and
       * they are stored in caps because that is how the spec quotes them — the one place on this site
       * where case is not left to the stylesheet, and it is flagged rather than silently normalised.
       *
       * No labels and no paragraphs: each line is the whole of its claim.
       */
      terms: [
        'ONE EXPERIENCE AT A TIME',
        'DIRECTLY WITH THE PEOPLE BUILDING IT',
        'CLEAR COMMUNICATION, FROM START TO FINISH',
      ] as const,

      /**
       * The writing line itself.
       *
       * **There is no *Write to us* any more.** V1 put a word on this line and made it the link; §8 gives
       * the row an **arrow**, bottom-aligned in a 21px row so its 1px rule lands on the row's lower edge,
       * and no text. The affordance is the rule and the mark.
       *
       * `mark` is here rather than in a component because nothing in `src/` may hold an authored
       * character — it is a mark and not language, which is why it is one field and not a sentence.
       *
       * `address` was `null` for the whole of V2 and is answered below — see the field's own note.
       */
      write: {
        /**
         * **The mark is not drawn any more, and the address is printed instead** — design owner,
         * 22 September 2026: *“A ideia é que o email seja o principal ponto de contacto.”*
         *
         * §8 gave this row an arrow and no text because there was no address to print: `address` was
         * `null`, `open-decisions.md` §1 was open, and a mark was the only honest affordance left. The
         * address is decided now and it is written on the page under the rule, so the arrow would be a
         * second way to reach the one thing already legible two lines below it. The field stays because
         * it is the address the printed line links to, and `mark` stays because removing a mark from
         * content is not how a mark comes back.
         *
         * ⚠ It is carried exactly as it was written down. `direct.phone` below is plainly a reserved
         * pattern rather than a line anybody answers; both are the design owner's to correct, and
         * inventing a different one here would be the fault this field was `null` to avoid.
         */
        mark: '→',
        address: 'hello@chapterone.com' as string | null,
      },

      /**
       * ── The one line that answers the question ───────────────────────────────────────────────
       *
       * **26 September 2026 — `YOUR CHAPTER` is removed**, and nothing replaces it as a title or a
       * call to action. What stands under the question is one sentence on one line, and it is the
       * frame's only interaction: *"A interação é a experiência."*
       *
       * `begins` is what it says at rest. `listening` is what it becomes while a hand is on it — the
       * sentence recomposing itself rather than a label swapped — and what it stays once pressed,
       * when the contacts above are the ways to write.
       */
      begins: 'Tell us where it begins.',
      listening: "We're listening.",

      /** What a letter written from this frame is filed under. */
      subject: 'Where it begins',

      /**
       * ── How to reach the studio, written under the line ──────────────────────────────────────
       *
       * **Not a form and not a second composition** — design owner, 22 September 2026: *“Não quero um
       * formulário tradicional neste momento… Não quero uma segunda ‘página’ ou segundo ecrã dentro de
       * Contact.”* One frame: the question, the line, and what is written on it.
       *
       * There are no keys and no colons. The address and the number are two lines of type on the
       * studio's own rule, and the two places that number is already reachable follow them.
       */
      direct: {
        email: 'hello@chapterone.com',
        /** What is read, and what is dialled. A number is printed with spaces and dialled without. */
        phone: { reads: '+351 910 000 000', dials: '+351910000000' },
        /**
         * **Both reach the number above, and neither is an invented destination.** The design owner
         * was explicit — *“se não tivermos, não inventes números/IDs”* — so there is no handle and no
         * second number here: each link is composed from `phone.dials` where it is used, which is the
         * one contact the studio has given. `wa.me` takes the digits; Telegram takes them with the `+`.
         *
         * ⚠ Which means both are only as real as that number is, and it is a reserved pattern. They
         * resolve the moment it is replaced, and nothing here has to change with it.
         */
        reach: [
          { word: 'WhatsApp', via: 'whatsapp' },
          { word: 'Telegram', via: 'telegram' },
          /*
           * **Instagram is named and has no destination** — design owner, 26 September 2026, lists it
           * among the contacts; the project has no handle, and *"não inventar URLs"*. It renders
           * composed and inert, exactly as `write.address` did while it was `null`, and becomes a
           * link the moment `handle` is written here.
           */
          { word: 'Instagram', via: 'instagram', handle: null as string | null },
        ] as const,
        /** The mark between them. A mark and not language, which is why it is a field. */
        between: '·',
      },
    },
  },
} as const
