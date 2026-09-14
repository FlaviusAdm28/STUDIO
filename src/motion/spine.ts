/**
 * **The V2 spine — where the film is.**
 *
 * `docs/design/v2/final-design-spec.pdf` §2 is a table of fourteen states and §3 a table of thirteen
 * junctions. This file is that table, transcribed. It is the canonical answer to *where the film is*,
 * and it is the only place in the project that knows a state exists.
 *
 * **It is not a second timing system, and it must never become one.** Nothing here is a duration, a
 * delay, an easing or a threshold — `story.ts` holds every one of those and goes on holding them. What
 * this adds is *identity*: which beats of which runway compose which V2 state, what carries across each
 * junction, and what the Ledger reads at every point. `timeline.ts` resolves the entry positions from
 * the spans the story already produces, so a state's position is derived from a beat rather than
 * authored beside it. Retime a beat and the spine follows; there is nowhere for the two to disagree.
 *
 * ## What is transcribed and what is derived
 *
 * `name`, `plate`, `exposure`, `ground`, `anchor` and the whole of `ledger` except `chapter` are §2's own
 * columns, verbatim. `verb`, `time` and the mechanism sentences in `junctions` are §3's. Everything else
 * — `runway`, `beats`, `composed` — is this project describing itself, and is marked as such.
 *
 * **`chapter` is derived**, and it is the one column §2 does not give in full: it names `chapter III` at
 * state 09 and the copy at state 01 reads *I of III*. The ticks below follow the film's own chapter
 * system — I at the hero, II from the marker to the close, III from the lockup onward — which is what
 * the film already says out loud at states 02 and 07.
 *
 * ## What this pass consumes, and what it only records
 *
 * C1–C3 established the architecture. The Ledger reads `active`, `chapter`, `unlit` and `index`, and the
 * driver reads the entry positions. **`plate`, `exposure`, `ground` and `ink` are recorded and consumed
 * by nothing** — they are the light system, which is C5, and writing them down now is what makes C5 a
 * transcription rather than a second reading of the spec. They are transcribed from the spec as locked
 * by §11 on 25 August 2026: three plates, and state 09 as the environment rather than the work surface.
 *
 * **`junctions[].time` is no longer one of those.** C8 ruled the quoted seconds are *weight, not
 * duration*, and `timeline.ts` now reads them: `junctionSpans` divides each by `SECONDS_TO_VH` into a
 * length on `p`, and `assertJunctions` holds it as a floor — a junction whose interval is shorter than
 * its authored movement would truncate the survivor, and that is reported.
 *
 * **Eight of the thirteen carry a weight now, not four.** §3 quotes seconds for 01 → 02, 05 → 06,
 * 07 → 08 and 13 → 14. For four of the nine it leaves as an em-dash, the storyboard's own beat sheets
 * give a total, and the design owner adopted those four on 30 August 2026 — 09 → 10 at 4.60s, 10 → 11
 * at 3.40s, 11 → 12 at 4.00s and 12 → 13 at 5.40s. They are marked `adopted` so the difference in
 * provenance stays visible; nothing else about them differs.
 *
 * `docs/design/v2/implementation-reconciliation.md` is the register these belong to.
 */

/* ══════════════════════════════════ The vocabulary ══════════════════════════════════ */

/**
 * The plates. §5, **locked by §11.2**: *"Three plates ship: `hero`, `venice`, `studio`."* They carry all
 * fourteen states — `hero` (01–04, 13, 14), `venice` (06–09), `studio` (10–12).
 *
 * **There is no `dawn_warm`.** Warm stone at state 13 is the hero plate's own sky band, enlarged and
 * graded — *"never as its own asset"* — which is exactly why the locked 13 → 14 can open the crop on the
 * same negative and arrive at Contact with no swap. `dawn_warm.png` exists in the storyboard package as
 * a pre-rendered still of that grade; it is **a derivative, not a source, and must not be referenced in
 * production code.** §11.2 states the cost of getting it wrong: *"If warm stone loads as a separate
 * image, states 13 and 14 become a swap and the locked 13 → 14 mechanism is void."*
 *
 * `none` is §2's own entry for states 04 and 05, which are given a ground value instead of a plate.
 * Whether those two frames are a plate at zero exposure or a ground with no plate is the one thing §11.2
 * left unsaid, and it belongs with the rest of the light system. `implementation-reconciliation.md` C5.
 */
export const PLATE = {
  HERO: 'hero',
  VENICE: 'venice',
  STUDIO: 'studio',
  NONE: 'none',
} as const

export type Plate = (typeof PLATE)[keyof typeof PLATE]

/**
 * The verb ledger. §1: twelve verbs across thirteen junctions, *"no mechanism is used twice for its
 * primary effect"*, plus the reversible aside for Work.
 *
 * `HOLD` is not one of the twelve. §3 gives junction 04 → 05 no verb at all — *"Open: plain hold vs a
 * short authored beat"* — and §10 says to build it as a hold, so it is named here to keep the chain
 * unbroken and excluded from the no-repeat rule below.
 */
export const VERB = {
  DISPLACE: 'displace',
  DISPLACE_AND_INHERIT: 'displace-and-inherit',
  EXPAND: 'expand',
  ACCUMULATE: 'accumulate',
  CHANGE_REGISTER: 'change register',
  DECOMPOSE: 'decompose',
  LIFT: 'lift',
  SUPERIMPOSE: 'superimpose',
  EXTINGUISH: 'extinguish',
  SURVIVE: 'survive',
  RELIGHT: 'relight',
  PERSIST: 'persist',
  HOLD: 'hold',
} as const

export type Verb = (typeof VERB)[keyof typeof VERB]

/**
 * The Ledger's five destinations, in §4's order — *"Work · About · Method · Questions · Contact"*.
 *
 * The order is the Ledger's own and is not alphabetical or by importance: it is the order the index is
 * drawn in at state 08, *"top to bottom, WORK lit first"*.
 *
 * **`studio` is not among them.** It survives in `content/site.ts` as the act's section id — somewhere
 * to point at — but it is no longer a destination: under V2 the film's position is carried by the
 * chapter ticks, not by a word in the index. **`work` is here and is not an anchor**: §6 makes it an
 * aside over the frame the visitor is already in. See `WORK_IS_AN_ASIDE`.
 */
export const DESTINATIONS = ['work', 'about', 'method', 'questions', 'contact'] as const

export type Destination = (typeof DESTINATIONS)[number]

export type Chapter = 'I' | 'II' | 'III'

/**
 * Which runway prices a state, in this build. **Not a V2 concept** — V2 knows states and junctions and
 * says nothing about what drives them (§10 hands *"scroll-vs-timeline driving of each junction"* to
 * engineering, and `implementation-reconciliation.md` C8 is where that is decided).
 *
 *   `shot`     the film's pinned frame — `shotStory` / `BEATS` / `--pin`
 *   `act`      Chapter III's pinned frame — `actStory` / `ACT_BEATS` / `--act-pin`
 *   `method`   the method's held frame — `methodStory` / `METHOD_BEATS` / `--method-pin`
 *   `flow`     ordinary document flow, measured in the DOM rather than priced
 */
export type Runway = 'shot' | 'act' | 'method' | 'flow'

/**
 * What the Ledger reads at a given state. §6's parameters, minus one.
 *
 * §6 lists six: *"ink … exposure … active destination, chapter, revealed and unlit"*. Five of them are
 * per-state and are here. **`revealed` is not**: it is *"reveal on pointer, Tab or interaction — never
 * scroll-pause"*, which is a property of visitor intent rather than of where the film is, so the rail
 * owns it and the spine has no opinion about it.
 */
export type LedgerState = {
  /** §2's Ledger column, as a fraction. `null` where the column gives a ground value instead. */
  readonly exposure: number | null
  /** Named at 13 and 14 only. Everywhere else the ink crosses with the ground. C5 consumes this. */
  readonly ink: string | null
  /** Which destination is lit. `null` before the index is drawn. */
  readonly active: Destination | null
  /** The chapter tick. Derived — see the file header. Withdraws while the Work aside is open. */
  readonly chapter: Chapter | null
  /** Before the dock: the rail is there and carries the mark alone. §2's *"mark only"*. */
  readonly unlit: boolean
  /** Whether the index — the five destinations — is drawn. §2's *"index drawn"*, from 08. */
  readonly index: boolean
}

export type State = {
  readonly id: number
  /** §2, verbatim. */
  readonly name: string
  /** §2, verbatim. C5 consumes these four; nothing does today. */
  readonly plate: Plate
  readonly exposure: number | null
  readonly ground: string | null
  readonly ledger: LedgerState
  /** §2's anchor column, verbatim. The type's place in the 1440 × 760 frame. C6 and C7 consume it. */
  readonly anchor: string
  /** This build, not V2. Which runway prices the state. */
  readonly runway: Runway
  /**
   * This build, not V2. The `story.ts` objects that time this state today, by name.
   *
   * **Association, not ownership.** Nothing here retimes anything; `timeline.ts` asserts that every
   * name resolves to a real beat, so a rename in the story cannot leave the spine pointing at nothing.
   */
  readonly beats: readonly string[]
  /** Whether V2's composition for this state is built. One state is not. */
  readonly composed: boolean
  /** Why, where the answer is not obvious. */
  readonly note?: string
}

export type Junction = {
  readonly from: number
  readonly to: number
  readonly verb: Verb
  /** §1's second law: *"Each junction carries exactly one element across and repurposes it."* */
  readonly survivor: string
  /** §3's mechanism sentence, abridged to what the survivor does. */
  readonly mechanism: string
  /**
   * **The junction's weight in V2's own seconds.** Weight, never duration — C8 ruled that, and
   * `timeline.ts` divides it by `SECONDS_TO_VH` into a length on `p` (`JunctionSpan.priced`).
   *
   * `assertJunctions` reads it as a **floor**: it complains when the authored movement is longer than
   * the interval it has to happen in, because that junction would be truncated. It is not a target and
   * never sets a distance — an interval longer than its weight is a junction with room to spare.
   *
   * Two provenances, and `adopted` is what tells them apart.
   */
  readonly time: number | null
  /**
   * **Set where `time` is the storyboard's rather than §3's.**
   *
   * §3's table quotes seconds for four junctions and an em-dash for the other nine. For four of those
   * nine the storyboard's own beat sheets do give a total, and the design owner adopted those totals as
   * weights on 30 August 2026 — the same standing 01 → 02's 3.40s already has.
   *
   * The flag exists so the file cannot quietly claim §3 says something it does not. Absent means §3
   * quotes it; `true` means the storyboard does and the owner adopted it.
   */
  readonly adopted?: true
  /** Whether this build performs the junction as V2 states it. */
  readonly asStated: boolean
  readonly note?: string
}

/* ══════════════════════════════════ The fourteen states ══════════════════════════════════ */

export const states: readonly State[] = [
  {
    id: 1,
    name: 'Hero',
    plate: PLATE.HERO,
    exposure: 0.5,
    ground: null,
    ledger: { exposure: 0.2, ink: null, active: null, chapter: 'I', unlit: true, index: false },
    anchor: '96px serif, x196, baseline y462',
    runway: 'shot',
    beats: ['chapterOneStory', 'shotStory.heroWords', 'shotStory.blackTransition'],
    composed: true,
    note: "The Hero time treatment (§9) is a change inside this state and belongs with C5's light work.",
  },
  {
    id: 2,
    name: 'Chapter II',
    plate: PLATE.HERO,
    exposure: 0.35,
    ground: null,
    ledger: { exposure: 0.16, ink: null, active: null, chapter: 'II', unlit: true, index: false },
    anchor: 'numeral origin x756',
    runway: 'shot',
    beats: ['shotStory.chapterTwoMarker'],
    composed: true,
  },
  {
    id: 3,
    name: 'Philosophy',
    plate: PLATE.HERO,
    exposure: 0.1,
    ground: null,
    ledger: { exposure: 0.16, ink: null, active: null, chapter: 'II', unlit: true, index: false },
    anchor: '“Philosophy” rests on x756; II travels 196px to x560',
    runway: 'shot',
    beats: ['shotStory.chapterTwoBecomesPhilosophy'],
    composed: true,
    note: 'The junction into this state is the one V2 calls the grammar every later junction obeys, and it is already built — `surveyMark()` measures the travel rather than authoring it.',
  },
  {
    id: 4,
    name: 'Thesis',
    plate: PLATE.NONE,
    exposure: null,
    ground: '#060605',
    ledger: { exposure: 0.16, ink: null, active: null, chapter: 'II', unlit: true, index: false },
    anchor: '64px serif, x196, centred vertically; ember at 68% / 32%',
    runway: 'shot',
    beats: ['shotStory.everyUnforgettableMoment'],
    composed: true,
    note: 'The integrity audit recorded this state as unbuilt. It is not: `site.two.statement` is §4’s thesis copy verbatim.',
  },
  {
    id: 5,
    name: 'The occasions',
    plate: PLATE.NONE,
    exposure: null,
    ground: '#050504',
    ledger: { exposure: 0.16, ink: null, active: null, chapter: 'II', unlit: true, index: false },
    anchor: 'three depths: 40px / 32px / 25px, 30% → 86%',
    runway: 'shot',
    beats: [
      'shotStory.wedding',
      'shotStory.exhibition',
      'shotStory.artist',
      'shotStory.finalPerformance',
    ],
    composed: false,
    note: 'Four occasions in fades; V2 has three, arriving toward the viewer in depth. A re-composition of one state — C4 for the depth, and a copy pass for the count.',
  },
  {
    id: 6,
    name: 'Some moments deserve another chapter.',
    plate: PLATE.VENICE,
    /*
      **0.62, not §2's 0.13 — the design owner's direction of 6 September 2026.**

      At 0.13 the plate is a texture: the campanile, the water and the couple are all below the point
      where the eye reads them as a photograph, and the line standing on it is about a *moment*. Erasing
      the moment in order to say the sentence is the wrong trade, and it was the single clearest
      difference between this build and the promotion prototype the direction was chosen from.

      0.62 is that prototype's own held value — the room is unmistakably down while the type is the
      subject, and the photograph is unmistakably there. Nothing else in the column moves for it: the
      Ledger's own exposure at this state is untouched, and 05 → 06 still arrives on the same junction.
    */
    exposure: 0.62,
    ground: null,
    ledger: { exposure: 0.22, ink: null, active: null, chapter: 'II', unlit: true, index: false },
    anchor: '52px serif, centred; warm source upper right',
    runway: 'shot',
    beats: ['shotStory.creamTransition', 'shotStory.someMomentsDeserve', 'shotStory.leadLeaves'],
    composed: false,
    note: 'V2: *the black acquires a photograph rather than brightening into paper.* This build goes to cream. C5.',
  },
  {
    id: 7,
    name: 'Chapter III',
    plate: PLATE.VENICE,
    /* 0.74 rather than 0.48, carrying 06's new floor forward so the opening between the two states is
       the same shape it was — the scene comes alive across 06 → 08 rather than climbing out of black. */
    exposure: 0.74,
    ground: null,
    ledger: { exposure: 0.24, ink: null, active: null, chapter: 'III', unlit: true, index: false },
    anchor: 'lockup origin x752; held 2.8s',
    runway: 'shot',
    beats: [
      'shotStory.anotherLeaves',
      'shotStory.chapterTravels',
      'shotStory.periodLeaves',
      'shotStory.iiiStudio',
    ],
    composed: false,
    note: 'Reached by travel here, and the travel now stops in the centre of the frame rather than at the rail — design owner\'s direction, 3 September 2026. §2\'s own exposure of .09 (darker than state 06) is superseded by the same direction: the photograph opens up substantially as the title card forms, so the chapter is read against a world becoming visible rather than a darkening one. Not yet true exposure — that stays state 09\'s alone.',
  },
  {
    id: 8,
    name: 'The Ledger',
    plate: PLATE.VENICE,
    /* 0.835 — the promotion's own settled value, and the last stop of `TIMING.dock.exposure`. The film's
       curve drives the plate across junctions 06 → 08; this is what the Environment hands back to at the
       far end, so the two meet without a step. State 09 keeps §2's 1 and is still the brightest state. */
    exposure: 0.835,
    ground: null,
    ledger: { exposure: null, ink: null, active: 'work', chapter: 'III', unlit: false, index: true },
    anchor: 'strokes stack at x38 y236; rules extend downward',
    runway: 'shot',
    beats: ['shotStory.chapterThreeStands'],
    composed: false,
    note: 'The one state with no composition of its own. The index is drawn here, and in this pass it is drawn at the beat that already reveals the navigation — the decompose choreography (§3, 2.90s) is C4. Exposure raised from §2\'s .19, design owner\'s direction 3 September 2026: the reveal completes as the menu writes itself in, so the room is nearly at its final light by the time the index is legible. True 1.00 is still reserved for state 09.',
  },
  {
    id: 9,
    name: 'The work',
    plate: PLATE.VENICE,
    exposure: 1,
    ground: null,
    ledger: { exposure: 0.32, ink: null, active: 'work', chapter: 'III', unlit: false, index: true },
    anchor: '80px serif, x196, bottom 74; brightest state on the site',
    runway: 'act',
    beats: ['actStory.frame', 'actStory.quiet', 'actStory.darkens', 'actStory.annotation'],
    composed: false,
    /*
      **§11.1 draws the boundary this row used to sit on.** State 09 is *the film* — the continuous
      environment element at the venice plate, brought to true exposure by the 08 → 09 lift, with
      nothing mounted, swapped or fetched to reach it. §2 names the row *The work — Wedding Experience*
      and §11.1 says that row is to be read with it.

      The **live work surface is not one of the fourteen states**: it exists only inside the reversible
      Work aside, above an environment that keeps running beneath it and is never unmounted. This build
      has it the other way round — an aperture onto a live cross-origin fragment standing *as* the
      state — which §11.1 forbids in as many words: *"no second surface, no iframe, no additional media
      element."* That is C5's to correct, and it is now a locked rule rather than an open reading.
    */
    note: 'State 09 is the environment at venice, true exposure. The live work belongs in the Work aside, above it — §11.1. This build mounts a fragment as the state instead, which the contract forbids. C5.',
  },
  {
    id: 10,
    name: 'About',
    plate: PLATE.STUDIO,
    exposure: 1.02,
    ground: null,
    ledger: { exposure: 0.58, ink: null, active: 'about', chapter: 'III', unlit: false, index: true },
    anchor: '104px at x196 · second principle 46px at x838',
    runway: 'flow',
    beats: ['afterTheFilm.about'],
    composed: true,
  },
  {
    id: 11,
    name: 'Method',
    plate: PLATE.STUDIO,
    exposure: 0.12,
    ground: null,
    ledger: { exposure: 0.08, ink: null, active: 'method', chapter: 'III', unlit: false, index: true },
    anchor: '62px serif, x196, bottom 142; seven overheard lines 15 → 36px',
    runway: 'method',
    beats: ['methodStory.opening', 'methodStory.asking', 'methodStory.gathered'],
    composed: false,
    note: 'Twelve considerations behind four questions; V2 has seven overheard lines. Same class of composition, different content — a copy pass.',
  },
  {
    id: 12,
    name: 'Your experience',
    plate: PLATE.STUDIO,
    exposure: 0.2,
    ground: null,
    ledger: { exposure: 0.14, ink: null, active: 'method', chapter: 'III', unlit: false, index: true },
    anchor: '104px serif, x196, y262 — largest type on the site',
    runway: 'method',
    beats: ['methodStory.converge', 'methodStory.resolve', 'methodStory.printing'],
    composed: true,
    note: 'C3. Built, verbatim, as the method’s payoff — `publication.method.answer`. Its Ledger stays on Method, so it is a state and not a destination, which is exactly what the archived doctrine asked for.',
  },
  {
    id: 13,
    name: 'Questions',
    /* Not a fourth plate: the hero plate's own sky band under the state-13 grade. §11.2. */
    plate: PLATE.HERO,
    exposure: null,
    ground: 'hero · sky band, graded — ground 160–171, R−B +26, desaturated, near-still',
    ledger: {
      exposure: 1,
      ink: '#171613',
      active: 'questions',
      chapter: 'III',
      unlit: false,
      index: true,
    },
    anchor: '64px heading y86; seven 76px rows from y213',
    runway: 'flow',
    beats: ['afterTheFilm.answer'],
    composed: true,
    note: 'Eight rows against V2’s seven, and different copy. The mechanism — progressive disclosure on + / −, nothing above a row moving — is §7 as written. The ground is a grade of the hero plate and never a second image; loading one voids the locked 13 → 14. §11.2.',
  },
  {
    id: 14,
    name: 'Contact',
    plate: PLATE.HERO,
    exposure: 0.72,
    ground: null,
    ledger: {
      exposure: 0.8,
      ink: '#f2e9dc',
      active: 'contact',
      chapter: 'III',
      unlit: false,
      index: true,
    },
    anchor: '92px serif y152; writing line y529',
    runway: 'flow',
    beats: [],
    composed: true,
    note: '§7’s non-negotiable — the eighth rule at y529 owned by the page and persisting into Contact — is the 13 → 14 junction and belongs with C4.',
  },
]

/* ══════════════════════════════════ The thirteen junctions ══════════════════════════════════ */

export const junctions: readonly Junction[] = [
  {
    from: 1,
    to: 2,
    verb: VERB.DISPLACE,
    survivor: '“Chapter”',
    mechanism: '“One” releases, “Chapter” holds and the numeral II takes its place — the name is the system.',
    time: 3.4,
    asStated: true,
  },
  {
    from: 2,
    to: 3,
    verb: VERB.DISPLACE_AND_INHERIT,
    survivor: 'the numeral II',
    mechanism: 'II travels 196px left and “Philosophy” inherits the coordinate it vacated, x756. Moves overlap.',
    time: null,
    asStated: true,
    note: 'Built. `chapterTwoBecomesPhilosophy` overlaps the moves and `surveyMark()` measures the distance from the rendered layout.',
  },
  {
    from: 3,
    to: 4,
    verb: VERB.EXPAND,
    survivor: 'the label',
    mechanism: 'The label expands into the sentence that defines it.',
    time: null,
    asStated: false,
    note: 'Both frames exist; the expansion between them does not. C4.',
  },
  {
    from: 4,
    to: 5,
    verb: VERB.HOLD,
    survivor: 'the ground',
    mechanism: 'Both frames are type on warm dark with the negative beneath at −6, so material continuity already holds.',
    time: null,
    asStated: true,
    note: 'V2 leaves this open by choice and §10 says to build it as a hold. It is a hold.',
  },
  {
    from: 5,
    to: 6,
    verb: VERB.ACCUMULATE,
    survivor: 'the residue of the stack',
    mechanism: 'The occasions stack and leave a trace; the sentence is written over the residue.',
    time: 4.2,
    asStated: false,
    note: 'The occasions leave rather than accumulate here. C4.',
  },
  {
    from: 6,
    to: 7,
    verb: VERB.CHANGE_REGISTER,
    survivor: 'the word “chapter”',
    mechanism: '“chapter.” changes register in place and becomes the Chapter III lockup. No travel.',
    time: null,
    asStated: false,
    note: 'The survivor is right and the mechanism is not: this build travels the word into the corner. Of the two transforms in the piece, 02 → 03 is exactly V2 and this one is exactly not. C4, and the travel stays until then — it is what currently delivers the mark.',
  },
  {
    from: 7,
    to: 8,
    verb: VERB.DECOMPOSE,
    survivor: 'the numeral III',
    mechanism: 'The numeral decomposes into three strokes which stack into the mark; the index is drawn out of it top to bottom, rule length encoding depth.',
    time: 2.9,
    asStated: false,
    note: 'C4. The index is drawn in this pass; the decomposition that draws it is not.',
  },
  {
    from: 8,
    to: 9,
    verb: VERB.LIFT,
    survivor: 'the negative',
    mechanism: 'Exposure lift only — the negative was always there. The frame pans off the canal.',
    time: null,
    asStated: false,
    note: 'C5.',
  },
  {
    from: 9,
    to: 10,
    verb: VERB.SUPERIMPOSE,
    survivor: 'the light source',
    mechanism: 'Double exposure on a shared light source: the sun becomes the lamp, one light belonging to two environments.',
    /* Storyboard turn 14: four beats to 4.60s, of which 1.80s is the wordless plate cross. */
    time: 4.6,
    adopted: true,
    asStated: false,
    note: 'C5.',
  },
  {
    from: 10,
    to: 11,
    verb: VERB.EXTINGUISH,
    survivor: 'the room',
    mechanism: 'The lamp goes out and the room goes with it. No surface change, no cut.',
    /* Storyboard turn 11: 3.40s, exposure only — one continuous ramp on one element. */
    time: 3.4,
    adopted: true,
    asStated: false,
    note: 'C5.',
  },
  {
    from: 11,
    to: 12,
    verb: VERB.SURVIVE,
    survivor: 'the word “yours”',
    mechanism: 'One word survives the question and is still in the answer: yours → Your. The field converges into one line.',
    /* Storyboard turn 26: six frames to 4.00s, with the timing table that names its easings. */
    time: 4.0,
    adopted: true,
    asStated: false,
    note: 'C3. The convergence and the answer are built; the survivor is not yet one element — the questions do not contain the word until V2’s state 11 copy lands. The pattern exists already: `.mark` is one element that is a word in a sentence and then a mark in a corner.',
  },
  {
    from: 12,
    to: 13,
    verb: VERB.RELIGHT,
    survivor: 'the room',
    mechanism: 'One room, one continuous relight: night → blue hour → first light. No background swap at any point.',
    /* Storyboard turn 15: five beats to 5.40s — the longest of the four, and the only one that relights. */
    time: 5.4,
    adopted: true,
    asStated: false,
    note: 'C5.',
  },
  {
    from: 13,
    to: 14,
    verb: VERB.PERSIST,
    survivor: 'the rule at y529',
    mechanism: 'The rule does not move. The list releases around it, the ground turns under it, and the conversation is written on the same line.',
    time: 3.6,
    asStated: false,
    note: 'C4, and §7’s implementation requirement with it: the rule must be one DOM node owned by the page, not a child of the list.',
  },
]

/**
 * **The fourteenth row of §3, and the only junction the visitor causes.**
 *
 * §3: *"aside · reversible · The route into Work: an aside carried on the leader rule from the Ledger.
 * The Ledger is the door and the film does not stop."* The storyboard's t27 is the whole of it:
 *
 *   *"Work is not a page you go to. It is the film, paused and indexed… Clicking WORK does not navigate;
 *   it pulls the register out of the margin along that rule, over the frame the visitor was already in."*
 *
 * Four things it fixes, and each is why a value below exists:
 *
 *   the affordance is the rule    WORK's leader grows 16 → 70px on intent — *"not a button"*
 *   the register rides the rule   70 → 520px, drawn out of the margin left to right, 1.30s
 *   the film dims, never leaves   two stops down and held there, so stepping aside is visible
 *   the ticks withdraw            *"Work is not a chapter — it is the index"*; the absence is the cue
 *
 * **§11.2 locks what "never leaves" means.** One environment element for the whole session — mounted at
 * the Hero, never unmounted, never re-sourced, never `display:none`, ***including while this aside is
 * open***. The live work surface is an additive layer *above* the environment: it mounts on entering the
 * aside and unmounts on leaving, and it is never part of the fourteen-state sequence.
 *
 * **`dim` is derived rather than authored.** Two stops is a quarter of the light, so what is left over
 * the film is 0.25 and the scrim over it is the rest. Nothing about any state's own exposure changes;
 * this is the aside's own scrim and it is the only light value in this pass.
 */
export const WORK_IS_AN_ASIDE = {
  /** The state the aside indexes. Asserted below to be the state whose destination is `work`. */
  indexes: 9,
  /** §3 t27, frame 2. */
  out: 1300,
  /** §3 t27, frame 4 — *"the way back"*, and deliberately faster than the way out. */
  back: 900,
  /** Two stops down: `2 ** -2` of the light left on the film, so this much scrim over it. */
  dim: 1 - 2 ** -2,
} as const

/* ══════════════════════════════════ Reading the spine ══════════════════════════════════ */

/** A state by its V2 number. Ids are 1-based and contiguous, which the assertions hold. */
export const stateOf = (id: number): State => states[id - 1]

/**
 * Where each destination's own state is, so *visited* is a fact about the film's position rather than
 * something remembered.
 *
 * §6: *"unvisited destinations show no rule at all"*. A destination is visited once the film has reached
 * the state it names — which is a pure function of scroll position, so nothing is stored and coming back
 * up the page is exact in reverse. Derived from `ledger.active` rather than written down twice.
 */
export const destinationState: Readonly<Record<Destination, number>> = Object.fromEntries(
  DESTINATIONS.map((destination) => [
    destination,
    states.find((state) => state.ledger.active === destination)?.id ?? 0,
  ]),
) as Readonly<Record<Destination, number>>

/** The chapter tick as a number, for the driver: 0 none, 1 I, 2 II, 3 III. */
export const tickOf = (chapter: Chapter | null): number =>
  chapter === null ? 0 : chapter === 'I' ? 1 : chapter === 'II' ? 2 : 3

/**
 * What the Ledger shows for a destination at a given state: 0 unvisited, 1 visited, 2 active.
 *
 * The three values are the rule's own length — §6, *"rule length encodes depth. The active destination's
 * leader is longest; unvisited destinations show no rule at all."* The stylesheet multiplies one unit by
 * this and declares nothing else.
 */
export const depthOf = (destination: Destination, at: number): number => {
  const state = stateOf(at)
  if (state === undefined || !state.ledger.index) return 0
  if (state.ledger.active === destination) return 2
  return at >= destinationState[destination] ? 1 : 0
}

/* ─────────────────────────────── The intentions, checked ─────────────────────────────── */

if (process.env.NODE_ENV !== 'production') {
  const complain = (what: string, detail: string) =>
    console.error(`[spine] ${what}\n        ${detail}\n        Fix it in src/motion/spine.ts.`)

  /* §2 is fourteen states, numbered. A gap or a repeat would silently mis-place everything after it. */
  if (states.length !== 14) {
    complain(
      `The spine has ${states.length} states.`,
      'V2 §2 is a complete chronological sequence of fourteen. Adding or removing one is a design change, not an edit.',
    )
  }
  states.forEach((state, i) => {
    if (state.id !== i + 1) {
      complain(
        `State ${i + 1} is numbered ${state.id}.`,
        'Ids are 1-based, contiguous and in §2’s order; `stateOf` indexes on that and everything reading the spine trusts it.',
      )
    }
  })

  /* §3 is thirteen junctions, and they have to chain: every state is arrived at exactly once. */
  if (junctions.length !== 13) {
    complain(
      `The spine has ${junctions.length} junctions.`,
      'V2 §3 authors thirteen, one between each consecutive pair of states. The Work aside is the fourteenth row and is not one of them.',
    )
  }
  junctions.forEach((junction, i) => {
    if (junction.from !== i + 1 || junction.to !== i + 2) {
      complain(
        `Junction ${i + 1} runs ${junction.from} → ${junction.to}.`,
        `it should run ${i + 1} → ${i + 2}. The chain is what makes the sequence continuous; a junction that skips a state leaves that state with nothing arriving at it.`,
      )
    }
    if (junction.survivor.trim() === '') {
      complain(
        `Junction ${junction.from} → ${junction.to} carries nothing across.`,
        '§1’s second law: each junction carries exactly one element across and repurposes it. A junction with no survivor is a crossfade between unrelated frames, which is the one thing the site never does.',
      )
    }
  })

  /*
    §1: *"no mechanism is used twice for its primary effect"* — twelve verbs across thirteen junctions.
    `hold` is excluded because it is not one of the twelve; it is what 04 → 05 does while it is open.
  */
  const used = new Map<Verb, number>()
  for (const junction of junctions) {
    if (junction.verb === VERB.HOLD) continue
    const first = used.get(junction.verb)
    if (first !== undefined) {
      complain(
        `The verb “${junction.verb}” is used twice.`,
        `${first} → ${first + 1} and ${junction.from} → ${junction.to} both claim it. §1’s verb ledger allows each mechanism one primary effect, and thirteen junctions divide twelve verbs and one hold exactly.`,
      )
    } else {
      used.set(junction.verb, junction.from)
    }
  }

  /* Five destinations, each lit by exactly one state, or the rail has a word that never lights. */
  for (const destination of DESTINATIONS) {
    const lit = states.filter((state) => state.ledger.active === destination)
    if (lit.length === 0) {
      complain(
        `Nothing ever makes “${destination}” active.`,
        '§6 gives the Ledger five destinations and the index lights the one the film is standing in. A destination no state claims is a word with no state behind it.',
      )
    }
  }

  /* The index cannot be drawn before the dock, and cannot be undrawn after it. §2’s Ledger column. */
  states.forEach((state) => {
    if (state.ledger.index === state.ledger.unlit) {
      complain(
        `State ${state.id} is both ${state.ledger.unlit ? 'unlit and drawn' : 'lit and undrawn'}.`,
        'Before the dock the rail carries the mark alone (§2: *mark only*); from 08 the index is drawn and never re-created. The two are the same edge.',
      )
    }
    if (state.ledger.index && state.ledger.active === null) {
      complain(
        `State ${state.id} draws the index with nothing active.`,
        'From 08 onward §2 names an active destination for every state. An index with nothing lit tells the visitor where they are not.',
      )
    }
  })

  /* The dock happens once. Two edges would mean the index is re-created, which §6 forbids outright. */
  const docks = states.filter(
    (state, i) => state.ledger.index && (i === 0 || !states[i - 1].ledger.index),
  )
  if (docks.length !== 1) {
    complain(
      `The index is drawn ${docks.length} times.`,
      '§6: the rail is *never re-created*. There is one dock — state 08 — and after it the index is continuous to the end of the film.',
    )
  } else if (docks[0].id !== 8) {
    complain(
      `The index is drawn at state ${docks[0].id}.`,
      '§2 draws it at 08, which is the state named after it. Moving the dock moves what the decompose junction produces.',
    )
  }

  /* The aside indexes the state whose destination it opens from, or the door leads somewhere else. */
  if (stateOf(WORK_IS_AN_ASIDE.indexes)?.ledger.active !== 'work') {
    complain(
      `The Work aside indexes state ${WORK_IS_AN_ASIDE.indexes}, which is not the work.`,
      '§3’s aside is the route into Work and nothing else. Point it at the state whose Ledger has `work` active.',
    )
  }
}
