/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *  TIMING — **this is the file you edit to change the pacing of anything on the site.**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * Every number that decides how long something takes, how long it waits, or how far you have to
 * scroll to get through it, is in this one file. Change a number, save, refresh — that is the whole
 * loop. Nothing else has to be touched.
 *
 * `story.ts` reads these values and wraps each one in the explanation of *why* it is what it is;
 * `timeline.ts` resolves them; the driver and the stylesheet consume the result. So this file is the
 * numbers and `story.ts` is the reasoning — if you want to know why a value is 0.3 rather than 0.4,
 * that is where it is written down.
 *
 * ── THE FOUR UNITS, AND THEY NEVER MIX ──────────────────────────────────────────────────────────
 *
 *   ms        MILLISECONDS. Real time. Only Chapter I's arrival and the publication use a clock.
 *   beats     BEATS OF SCROLL. Not time — position. 1 beat is a unit of the runway it belongs to,
 *             and what a beat costs in actual scrolling is set in `distance` below. Runs backwards
 *             exactly as it runs forwards.
 *   fraction  A SHARE OF ONE JUNCTION, 0 → 1. Used by the memories and the atmosphere. Knows
 *             nothing about scroll; `memories.pricing` decides what a share costs to cross.
 *   vh / px   ACTUAL DISTANCE. Only in `distance` and `input`.
 *
 * **A number must never be moved between units.** `1600` in Chapter I has nothing to do with `1.6`
 * in the shot.
 *
 * ── TIMING VERSUS PACING, WHICH ARE DIFFERENT EDITS ─────────────────────────────────────────────
 *
 * **Timing** is the proportions — every group except `distance` and `memories.pricing`. Change one
 * and the shape of the sequence changes.
 *
 * **Pacing** is `distance` and `memories.pricing`. Changing those **retimes nothing** — every
 * proportion is preserved and only how far the hand has to travel changes.
 *
 * If the complaint is *"this is too fast"* or *"this is too long"*, it is almost always a pacing
 * edit. Reach for `distance` or `memories.pricing` first.
 *
 * ── HOW TO READ A BEAT ──────────────────────────────────────────────────────────────────────────
 *
 *   { at, fade, hold }        arrives at `at`, takes `fade` to arrive, sits for `hold`, then leaves
 *   { after, fade, hold }     the same, but `after` is measured from when the PREVIOUS beat has gone
 *   { at | after, fade }      a ramp — moves once across `fade` and stays there
 *   [from, to]                a window on a junction's own 0 → 1
 *
 * `after` and `hold` are the two you will reach for most. Because beats are chained, raising a
 * `hold` moves everything after it and keeps every gap that was composed — a ripple edit. You never
 * have to recompute anything downstream.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */

export const TIMING = {
  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     CHAPTER I · the opening — **MILLISECONDS**

     The only clock on the site. The visitor can hurry it (see `pace`) but never skip it. Raising a
     number here makes the opening longer in real seconds.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  chapterOne: {
    /** The arrival time, alone on black. Gone at at+fade+hold+fade = 2200, when the name arrives. */
    timestamp: { at: 400, fade: 600, hold: 600 },

    /**
     * Light arriving on the photograph. The slowest thing in the sequence.
     *
     * `at` was 1500 and is 1450 because of the no-skip guarantee, not for any reason of composition.
     * The beats resolve to 400 · 1500 · 1600 · 2000 · 2200 · 2850, so the closest gap was the 100ms
     * between light arriving and the timestamp beginning to leave. `maxAdvance` needs a third of that
     * gap to stay at or above `pace.maxStep` (50ms) or a fast clock can land the two in one frame —
     * two beats in one frame is a skip, and the opening is mandatory. 150ms is the smallest gap that
     * satisfies it, and 50ms is the whole of the change.
     *
     * It is spent *here* rather than on the timestamp because every other way to widen the gap moves
     * `timestampOut`, and that breaks the handover the sequence is built on: the timestamp is gone at
     * at+fade+hold+fade = 2200, the exact instant the name arrives. Light starting 50ms into a 3200ms
     * ramp is invisible; the name arriving before the timestamp has cleared is not.
     */
    video: { at: 1450, fade: 3200, rollsAfterLight: 500 },

    /** The studio name. Takes the screen the timestamp vacated. */
    chapterOne: { at: 2200, fade: 1400 },

    /** The line under the name. Gated on the footage, with a fallback if it never loads. */
    subtitle: {
      afterChapterOne: 650,
      fade: 1000,
      waitsForFootageAt: 1.0,
      arrivesRegardlessAt: 12000,
      stallGrace: 2500,
    },

    /** The interface arriving last. When this finishes, the film is released. */
    navigation: { afterSubtitle: 1000, fade: 1000 },
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     CHAPTER I → II · the shot — **BEATS OF SCROLL**

     The film. What a beat costs in real scrolling is `distance.shot`, not here.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  shot: {
    /** The hero's words leaving as the shot begins. */
    heroWords: { at: 0, fade: 0.16 },

    /** The black arriving over the photograph, and the bridge into Chapter II. */
    blackTransition: { at: 0, fade: 1.244, depth: 0.7, bridge: 0.642, restFade: 0.333 },

    /** The Chapter II marker. */
    chapterTwoMarker: { at: 1.45, fadeIn: 0.18, hold: 2.26, fadeOut: 0.14 },

    /** The marker becoming the Philosophy lockup — the travelling word and the numeral. */
    chapterTwoBecomesPhilosophy: {
      whole: 0.86,
      wordLeaves: 0.24,
      numeralSetsOffWhenWordIs: 0.76,
      numeralTravels: 0.2,
      blur: 3.5,
      topicAfterNumeral: 0.05,
      topicFade: 0.16,
    },

    /** "Every unforgettable moment / deserves an experience." */
    everyUnforgettableMoment: { after: 0.12, fadeIn: 0.26, hold: 0.28, fadeOut: 0.24 },

    /* The four occasions of the V1 composition, on an uneven cadence: long, short, short, medium.
       Every fade is identical on purpose — the rhythm lives entirely in `hold` and `after`.
       NOTE: V2's three-occasion state is `memories` below; these still drive the V1 shot. */
    wedding: { after: 0.1, fadeIn: 0.1, hold: 0.3, fadeOut: 0.08 },
    exhibition: { after: 0.05, fadeIn: 0.1, hold: 0.1, fadeOut: 0.08 },
    artist: { after: 0.02, fadeIn: 0.1, hold: 0.1, fadeOut: 0.08 },
    finalPerformance: { after: 0.04, fadeIn: 0.1, hold: 0.2, fadeOut: 0.08 },

    /** Black to ivory. Two stages so it never passes through neutral grey. */
    creamTransition: { after: 0.08, warmthFade: 0.28, lightAfterWarmth: 0.18, lightFade: 0.44 },

    /** "Some moments deserve another chapter." — arrives while the light is still coming up. */
    someMomentsDeserve: { afterLight: 0.18, fade: 0.32 },

    /*
      Then the sentence is taken apart rather than removed.

      **These four price the run-up to state 07 and animate nothing** — see `iiiStudio` below for what
      that means and why. `hold` and `alone` were 0.43 and 0.41; they are shorter here only so that
      `iiiStudio.beforeTravelEnds` can reach back far enough to put state 07 at the halfway point of
      the dock's two junctions without exceeding `chapterTravels.fade`, which `timeline.ts` asserts.
    */
    leadLeaves: { hold: 0.3, fade: 0.2 },
    anotherLeaves: { afterLead: 0.14, fade: 0.22 },

    /** "chapter" travels to the corner and becomes the marker. `alone` is the breath before it goes. */
    chapterTravels: { alone: 0.1, fade: 0.74 },
    periodLeaves: { afterTravelStarts: 0.08, fade: 0.25 },

    /**
     * **These two numbers no longer time an animation. They price two junctions, and that is now
     * their whole job** — 2 September 2026.
     *
     * V1's travelling word is gone from the tree; nothing in the driver publishes `--tm`, `--stop`
     * or `--swap` any more. What still reads this beat is `timeline.ts`'s `stateEntries`: **state 07
     * begins at `iiiStudio.from` and state 08 at `iiiStudio.to`**, so these two numbers decide the
     * length of junction 06 → 07 and of junction 07 → 08 and nothing else.
     *
     * They were `0.10 / 0.20`, which gave 06 → 07 **2.16 beats** and 07 → 08 **0.20** — measured at
     * 1424 × 749, 3,280px against 320px. The whole of `dock` below had to happen in that 320px plus
     * the junction after it; the register change had the 3,280 to itself and spent it standing still.
     * The gesture now begins at junction 06, so the two junctions it spans have to be worth crossing.
     *
     * **`0.64 / 1.18` makes them the same length — 1.18 beats each.** That is the whole criterion, and
     * it is `dock.spans`' arithmetic rather than a taste: the gesture's `j` is
     * `(junction − from + at) / spans`, which gives each junction an equal share of `0 → 1` **by
     * count, not by length**. Two junctions of unequal distance would therefore make a window mean
     * one number of pixels below 0.5 and a different one above it, which is exactly the weighting the
     * old table had to be hand-corrected for. Equal junctions make `j` linear in pixels end to end,
     * and a window can then be moved anywhere in the table without changing what it is worth.
     *
     * `to` is unchanged at 2.36 beats past `close.from`, and `to` is `handoffAt` **and** `endsAt` — so
     * state 08, the act, the publication and the length of the document are all exactly where they
     * were. **Only state 07 moves.**
     *
     * `beforeTravelEnds` may not exceed `chapterTravels.fade` (0.74) or `iiiStudio` would start
     * before the travel it is measured back from; `timeline.ts` asserts it, and 0.64 is inside it.
     * That assertion is also why the three beats above had to come in: `from` cannot reach earlier
     * than `chapterTravels`' own start, so the run-up had to be shortened for state 07 to land on the
     * halfway point.
     */
    iiiStudio: { beforeTravelEnds: 0.64, fade: 1.18 },

    /** Where Chapter III stands inside the film's last frame. */
    chapterThreeStands: { atFrameFraction: 0.2 },
    studioEmerges: { litWhenTheMarkerLands: 0.75 },
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     JUNCTION 05 → 06 · the three memories and the sentence — **FRACTIONS of that junction, 0 → 1**

     "A wedding." → "An artist." → "A memory." → "Some moments deserve another chapter."

     Nothing here knows about scroll. `pricing` alone decides what a fraction costs to cross, which
     is why making the sequence longer or shorter is a separate edit from changing its shape.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  memories: {
    /** The three arrivals. `track` is how far the tracking opens, in em; `rise` is the settle, in px. */
    arrivals: [
      { from: 0.025, to: 0.124, track: 0.085, rise: 7 },
      { from: 0.198, to: 0.319, track: 0.07, rise: 5.5 },
      { from: 0.408, to: 0.541, track: 0.055, rise: 4 },
    ],

    /** Where the three channels sit inside an arrival, as fractions of it. Tracking, ink, settle. */
    channels: { trackUntil: 0.92, inkFrom: 0.14, inkTo: 0.72, riseFrom: 0.26 },

    /** The stack. `y` on the 760 reference frame, `size` in px, `ink` the share of full. */
    ladder: [
      { y: 380, size: 46, ink: 1 },
      { y: 306, size: 31, ink: 0.36 },
      { y: 252, size: 22, ink: 0.15 },
    ],

    /** The two exchanges. Position leads, ink lags; the second is cascaded. */
    giveWays: {
      first: { move: [0.174, 0.252], ink: [0.201, 0.268] },
      second: {
        nearMove: [0.374, 0.456],
        farMove: [0.386, 0.478],
        nearInk: [0.398, 0.47],
        farInk: [0.411, 0.492],
      },
    },

    /** The first two release in place, leaving the survivor alone. */
    release: { first: [0.6, 0.678], second: [0.609, 0.687] },

    /** The survivor's moment — a little scale, a little tracking, a lift in ink. */
    emphasis: {
      window: [0.732, 0.778],
      scale: 0.035,
      track: 0.012,
      inkFrom: [233, 229, 220],
      inkTo: [246, 242, 234],
    },

    /**
     * **The survivor comes apart, outermost word first — and it does it over a photograph that is
     * already there.**
     *
     * Re-authored 7 September 2026, design owner (C12). It ran 0.818 → 0.907, which put it inside the
     * blackout: see `atmosphere.groundSwap` for what was wrong and why the photograph is the bridge.
     * It now runs while the plate is rising and finishes **well before** the sentence begins, so there
     * is a real frame of image with no type in it between the two lines.
     */
    deconstruction: { window: [0.79, 0.858], endsLead: 0.24, drift: 0.1 },

    /**
     * **The final sentence, and it arrives onto a photograph rather than out of a blackout.**
     *
     * `0.900`, and the 0.042 of junction between it and the end of `deconstruction` is the point of
     * this whole passage: `A memory.` is gone, the sentence has not begun, and what is on screen is the
     * Grand Canal at its own exposure. That gap is priced at 2.4 below — the most expensive phase in
     * the junction after the three holds — because it is a beat and not a seam.
     *
     * **It used to be 0.907 for a different reason and that reason is retired.** The note here argued
     * 0.907 was needed so the survivor was gone before the sentence began, since `.v2-some` cross-fades
     * at full width rather than growing out of the survivor's footprint. That is still true and still
     * why the two do not overlap — but the number is now set by the bridge rather than by the
     * collision, and it is the bridge that has to be protected if either moves.
     *
     * `from` is the growth's start scale and is unused until `.v2-some` grows from the footprint.
     */
    sentence: { window: [0.9, 0.962], from: 0.44, wordLead: 0.2 },

    /* ───────────────────────────────────────────────────────────────────────────────────────────
       PRICING — **what each phase costs to scroll through.** THIS IS THE LENGTH DIAL.

       Changing these retimes nothing: every window above keeps its exact shape and only the
       distance you have to travel to cross it changes. 1.00 is the default cost.

       Raise a number to spend MORE scroll on that phase, lower it to spend less. A hold at 3.00
       gets three times the distance of a phase at 1.00. Give-ways are deliberately kept at or below
       1.00 — the *leaving* should be cheap and the *being* should be expensive; that contrast is
       what reads as deliberate rather than slow.

       **These are B14's values, approved 1 September 2026.** The arrivals and the dead ending are
       cut and the three holds are left alone — the longest does not move at all. In the prototype
       this took junction 05 → 06 from 49 wheel notches to 38 at an arrival:hold ratio of 0.75.
       ─────────────────────────────────────────────────────────────────────────────────────────── */
    pricing: [
      /*  from     to     cost    what it is                                      */
      [0.0, 0.025, 1.3], /*   the frame after the statement has gone                  */
      [0.025, 0.124, 0.85], /* "A wedding." is discovered  */
      [0.124, 0.174, 2.9], /*  HOLD  */
      [0.174, 0.198, 0.85], /*  "A wedding." begins to give way  */
      [0.198, 0.319, 0.85], /* "An artist." is discovered  */
      [0.319, 0.374, 2.9], /*  HOLD  */
      [0.374, 0.408, 0.85], /*  the cascade  */
      [0.408, 0.541, 0.9], /* "A memory." is discovered  */
      [0.541, 0.6, 3.2], /*    HOLD — the longest  */
      [0.6, 0.675, 0.95], /*   the first two release  */
      [0.675, 0.732, 1.3], /*  STILL · the survivor alone  */
      [0.732, 0.778, 1.1], /* the survivor is given its moment  */
      [0.778, 0.79, 1.2], /*   STILL · held on the survivor, the plate already rising under it  */
      [0.79, 0.858, 1.05], /*  the survivor comes apart over a photograph that is already there  */
      /*
        **THE BRIDGE.** `A memory.` is gone, the sentence has not begun, and the Grand Canal is on
        screen at its own exposure with nothing written on it. It is priced above every phase in this
        junction except the three holds, because it is the beat the passage turns on — the thing that
        makes the two sentences one continuous shot rather than two states with a cut between them.

        It replaced `THE DIP FLOOR`, which was 2.0 of near-black doing the same structural job and
        doing it by taking the picture away. Do not cheapen it and do not reintroduce a floor.

        **3.0, not 2.4.** At 2.4 the beat measured ~200px in Chrome at 1456 × 800 — two notches of a
        wheel, which is a gap rather than a hold. It is priced with the three arrival holds now (2.9,
        2.9, 3.2), because it is the same kind of thing: a frame the sequence stops on.
      */
      [0.858, 0.9, 3.0],
      [0.9, 0.962, 1.15], /*   the sentence forms  */
      [0.962, 1.0, 1.4], /*    STILL · fully readable  */
    ],

    /**
     * How far the price is smoothed before it is used, as a fraction of the junction. Without it
     * every phase boundary puts a kink in the velocity. 0.010 is about 49px of scroll.
     * `resolution` is a mechanism, not a feel — leave it alone.
     */
    pricingBlur: 0.01,
    pricingResolution: 4096,
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     THE ATMOSPHERE · the light in the room and the exposure at the turn
     **FRACTIONS of junction 05 → 06**, plus strengths
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  atmosphere: {
    /** The source: three offset terms of one falloff. `rx` in vw; `aspect` turns it into vh. */
    source: {
      aspect: 1.7,
      falloff: 3.6,
      stops: 17,
      terms: [
        { rx: 31.36, at: [1.6, -1.2], alpha: 0.58 },
        { rx: 53.76, at: [-1.4, 1.3], alpha: 0.44 },
        { rx: 73.92, at: [3.2, -3.0], alpha: 0.24 },
      ],
    },

    /** Film grain, proportional to the exposure. It is what lets the light be large without banding. */
    grain: { tile: 160, mean: 0.0744, maskRx: 80, maskRy: 90 },

    /** Overall brightness of the light. The intended 0.100 divided by (1 − grain.mean). */
    exposure: 0.10152,

    /** How far the room opens on a breath, and how much peak it gives back doing it. */
    breathScale: 0.085,
    breathDim: 0.13,

    /** Where the room rests. `warmth` above 1 pushes the amber past where it began. */
    states: [
      { x: 68.0, y: 32.0, scale: 1.0, ink: 1.0, warmth: 1.0 } /*  as 04 → 05 leaves it  */,
      { x: 67.2, y: 31.2, scale: 1.0, ink: 0.985, warmth: 1.02 } /* A wedding.          */,
      { x: 65.0, y: 33.4, scale: 0.955, ink: 0.84, warmth: 0.46 } /* An artist.         */,
      { x: 63.4, y: 30.6, scale: 1.045, ink: 1.045, warmth: 1.14 } /* A memory.         */,
      { x: 62.8, y: 29.8, scale: 1.035, ink: 0.985, warmth: 1.1 } /* into the handover  */,
      { x: 62.8, y: 29.8, scale: 1.14, ink: 1.1, warmth: 1.22 } /*   the new room       */,
    ],

    /** When the room moves between those states. The gaps between them are authored stillness. */
    stateRamps: [
      [0.01, 0.15],
      [0.176, 0.362],
      [0.376, 0.582],
      [0.64, 0.79],
      [0.902, 0.985],
    ],

    /**
     * The breaths. Each opens before its give-way and closes after the phrase has settled.
     * The fourth is negative on purpose — the room gathers inward as the exposure falls.
     */
    breaths: [
      { open: [0.168, 0.252], close: [0.262, 0.352], amount: 1.0 },
      { open: [0.368, 0.478], close: [0.488, 0.586], amount: 1.32 },
      { open: [0.708, 0.752], close: [0.752, 0.796], amount: 0.42 },
      { open: [0.812, 0.874], close: [0.9, 0.964], amount: -0.8 },
    ],

    /**
     * **The exposure at the chapter turn, and it is a breath in the light rather than a blackout.**
     *
     * Re-authored 7 September 2026, design owner (C12). It was `depth: 0.72` — the frame taken to 28%
     * of its level — with a floor of near-black held between the fall and the rise, and the ground swap
     * hidden inside that floor *"so it is not watched."*
     *
     * **That is exactly what made this passage read as a page reset.** `A memory.` went, the screen
     * went dark, and the light came back with a different sentence already standing on a photograph
     * that had arrived unseen. Two states with a cut between them, which is the one thing this
     * sequence must not be.
     *
     * `0.26` is a quarter of the old depth: enough to be felt as the light easing off the last word,
     * far too little to erase the picture. **There is no floor** — `fall` ends exactly where `rise`
     * begins, so the frame turns around rather than sitting at the bottom of the move. And it turns at
     * 0.84, which is where `groundSwap` finishes: the light comes back *as the photograph settles*, so
     * the two read as one movement rather than as a recovery from one.
     *
     * The photograph is the bridge. It must never be taken away in order to build one.
     */
    dip: { depth: 0.26, fall: [0.762, 0.84], rise: [0.84, 0.908] },

    /**
     * **When the black ground gives way to the photograph — and it is watched, on purpose.**
     *
     * Re-authored 7 September 2026, design owner (C12), and **it is consumed now.** It was
     * `[0.896, 0.958]` and read by nothing: the real handover was a literal in `globals.css` —
     * `--v2-handover: (jp5 − 0.75) / 0.25` — which is choreography written into a stylesheet, invisible
     * to this file and to `timeline.ts`'s assertions. The driver publishes `--q5-swap-at` /
     * `--q5-swap-over` from here and the literal is gone.
     *
     * **It runs early and long on purpose.** The plate begins rising at 0.700, while `A memory.` is
     * still standing at full ink and being given its moment, and it is complete at 0.845 — before the
     * survivor has finished coming apart. So the visitor watches the image arrive **under the last
     * word**, and then watches the word leave off it.
     *
     * That is the bridge between the two sentences and it is the whole of the mechanism: no morph, no
     * parallax, no blur, no added element. One photograph, revealed while there is still type standing
     * on it, so that when the type goes the frame is already somewhere rather than nowhere.
     */
    groundSwap: [0.7, 0.845],
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     CHAPTER III · the act — **BEATS OF SCROLL** (its own runway; see `distance.act`)
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  act: {
    navigation: { at: 0.1, fade: 0.28 },
    /** The mark uncovering the device. */
    frame: { opensWithTheMark: 0.34, fade: 0.62 },
    /** The breath before the room goes dark. */
    quiet: { holdsWhole: 0.3 },
    /** The room going dark around the object. */
    darkens: { beginsAfterTheQuiet: 0, depth: 0.5, fade: 0.42 },
    /** The object crossing aside with the annotation beside it. */
    annotation: { arrivesWhenDuskIs: 0.8, fadeIn: 0.3, hold: 0.26, fadeOut: 0.2 },
    deepens: { depth: 0.88, fade: 0.34 },
    /** The studio's two sentences. */
    belief: { after: 0.08, fade: 0.24 },
    printing: { afterTheBelief: 0.26, fade: 0.4, clears: 0.4 },
    /** The way out, arriving last. */
    wayOut: { whenPrintedIs: 0.6, fade: 0.24 },
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     THE METHOD · the publication's held frame — **BEATS OF SCROLL** (see `distance.method`)
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  method: {
    opening: { at: 0, fadeIn: 0.18, hold: 0.18, fadeOut: 0.14 },
    /** The four questions surfacing, each bringing three considerations. */
    asking: {
      after: 0.04,
      fadeIn: 0.14,
      hold: 0.22,
      fadeOut: 0.14,
      between: 0.03,
      words: { afterQuestion: 0.08, fadeIn: 0.2, stagger: 0.07 },
    },
    /** The camera. Never eased, and it stops when the studio's question closes the composition. */
    drift: { holdsPastTheResolution: 0 },

    /**
     * ── TRIGGER → PLAY → HOLD ─────────────────────────────────────────────────────────────────
     *
     * **Scroll triggers a beat of this section; the beat then plays on its own clock** — design owner,
     * 20 September 2026: *"SCROLL = TRIGGER DOS BEATS. TEMPO REAL = ANIMAÇÃO DENTRO DE CADA BEAT…
     * Pensa em cada beat como TRIGGER → PLAY → HOLD e não SCROLL → SCRUB."*
     *
     * **This is a departure from C8 and it is deliberate.** `implementation-reconciliation.md` C8 reads
     * *"scroll owns progression; time owns only what the visitor did not cause"* and reserves a clock
     * for three things — the Hero's arrival, the Work aside and interface response. This is a fourth,
     * taken by the design owner with the reason stated: every wheel notch was re-scrubbing the
     * percentage of an arrival that was already in flight, so a large serif statement fading in was
     * being stepped by the hand instead of being watched. **What C8 still owns is untouched: scroll
     * decides *when* each beat fires, in the beat it was always authored at.** Nothing about the order,
     * the placement or the narrative timings moved — only what drives the 0 → 1 once it has started.
     *
     * **The camera and the clearing are not played and must not be.** `--mdrift` is the visitor's own
     * movement through the space (`ramp`, never eased) and `--mclear` is the section handing over to
     * Questions; both stay pure functions of scroll, which is also what keeps Method → Questions
     * exactly as it was.
     *
     * `perBeat` is the one number: a beat of this section's authored `over` becomes this many seconds
     * of real time. Authoring it once rather than a duration per channel is what preserves the relative
     * pacing the section was tuned with — the statement is the longest arrival in the frame because its
     * `over` is the widest, and it stays that way.
     *
     *     the statement   over 0.65  ->  2.21s
     *     the line        over 0.36  ->  1.22s
     *     the question    over 0.40  ->  1.36s
     *     a phrase        over 0.26  ->  0.88s
     *
     * **Reversal is symmetric**, which is what keeps *replay from the first frame* honest: scrolling
     * back above a beat's trigger plays it out over the same duration rather than snapping it off, and
     * coming down again plays it in. Nothing is remembered between crossings.
     *
     * **Reduced motion takes the end of the beat, not the play.** Somebody who has asked for less
     * motion gets the triggered state immediately; the trigger itself is still scroll's.
     */
    play: { perBeat: 3.4 },
    /**
     * **The whole composition standing, and it is the section's conclusion** — design owner,
     * 20 September 2026: *"A conclusão do Method deve ser simplesmente a composição principal + uma
     * pequena suspensão antes de Questions."*
     *
     * It was 0.28 and it was the gap *before* the question — the room complete, nothing moving, and
     * then the studio asking. The question is authored with the field now (`composed.ask`), so there
     * is nothing left to wait for and this is the gap on the other side of it: three pieces on the
     * axis, seven thoughts around them, the whole of it lit and still, before the frame clears.
     *
     * 1.11 was what the frame had: `composed.ask` closes at 2.22, the clearing needs `printing.clears`
     * before `METHOD_BEATS` at 3.6, and this was the distance between them. Removing the signature and
     * bringing the question forward half a beat freed it, and the composition is what the section is
     * for, so the composition is what holds it.
     *
     * **1.13, and the ceiling is the pin and not a preference** — design owner, 21 September 2026,
     * after watching the recording: *"A transicao ainda parece que o Method esta a ser puxado /
     * deslocado para cima antes de Questions aparecer… Quero que o Method faca um CLEAR / RELEASE no
     * proprio lugar."*
     *
     * It was moved to 1.41 the day before, to spend 0.30 of a beat on the section's trailing viewport
     * and shorten the empty stretch after it. **That was wrong and the recording caught what the
     * numbers could not.** `.method-stage` is sticky inside `.method`, and `.method` is padding + pin
     * + the stage's own height: once the pin runs out the stage is no longer held, and the last
     * viewport of the box is the frame being carried up the screen by ordinary page scroll. Measured
     * in Chrome at 1920 x 889, with 1.41:
     *
     *     w -1.00   stageY   99   --mclear 0.10     the pin ends here; the frame starts moving
     *     w -0.90   stageY   10   --mclear 0.50     half the ink left, the frame 89px up
     *     w -0.80   stageY  -79   --mclear 0.90     178px up
     *
     * So the composition was performing its exit *while being dragged out of frame* — `uma pagina
     * sobe`, exactly what the brief rules out. Nothing in the clearing moved it; the section did.
     *
     * **1.13 puts the whole clearing back inside the pin.** It resolves at beat 3.55 against
     * `METHOD_BEATS` 3.6, so the last of the ink is gone while the frame is still held at y 99 and the
     * exit happens in the plane it was composed in.
     *
     * **The empty stretch after it is structural and this number cannot reach it.** It is the
     * trailing viewport — ~889px in which the photograph is fixed (`.env-room`), the rail is fixed,
     * and the only thing moving is an empty stage. Removing it means shortening `.method-stage`,
     * which is the frame the composition is placed in.
     */
    gathered: { holds: 1.13 },
    /**
     * **The question's own fade, and that is all this is now.**
     *
     * `holds` is gone with the chaining. The question used to be the one arrival in the section that
     * was derived — *asked after the room has finished speaking* — and `resolve.holds` was how long
     * the finished frame then stood. The design owner reversed the first on 20 September 2026 (the
     * question arrives **with** the field's last phrases, `composed.ask`), which left `gathered.holds`
     * as the only gap between the composition being complete and the frame clearing. Two names for one
     * suspension is one more than the section has.
     */
    resolve: { fade: 0.4 },
    /**
     * **What is left of the printing, which is the clearing** — design owner, 19 September 2026.
     *
     * There were four stages: the light type cleared, the paper came back, the answer was printed on
     * it and the two lines followed. Three of them are gone, and the reason is the section after this
     * one: *"Não quero a passagem Method → Questions para branco… Questions deve começar e continuar
     * inicialmente sobre o mesmo method.png."* The paper's return is what took the room away, and it
     * took it away while the section's own last frame was still on screen — measured on the running
     * page, `--mreturn` was at 1 with most of a viewport of the method still to scroll.
     *
     * So the room does not give the page back at all. The type clears into it, the room stands, and
     * Questions is written on the same photograph. The one stage that survives is the one that was
     * never about paper: the composition has to *leave* before anything else is written where it
     * stood. `clears` is that, and it is untouched.
     *
     * **The no-scripting version is unaffected**, which is the test of whether this was a material
     * change or a beat: `--mroom` is still 0 at rest, so the section still resolves to the
     * publication's own ink on its own paper with nothing running.
     */
    printing: { clears: 0.22 },
    /**
     * ── The Method leaving, in layers · design owner, 26 September 2026 ──────────────────────────
     *
     * *"Neste momento o conteúdo está a desaparecer demasiado como um único bloco… Explora uma saída por
     * camadas: composição principal; pequenos pensamentos; ambiente vazio; pequeno hold; Questions
     * começa… passagem de um pensamento para outro, não de desmontagem de um componente."*
     *
     * TRIGGER → PLAY, the model the section's arrivals already run: the scroll decides the frame the
     * leaving begins on (the start of `printing.clears`, after the composition has stood for
     * `gathered.holds`) and then it plays. Clock seconds:
     *
     *     0.00 – 1.10   the main composition, the statement first, the question last — read order
     *     0.70 – 2.05   the seven thoughts, each at its own moment: not in their order on the page
     *     1.30 – 2.10   the margin note, with the last of them
     *     2.10 –        the room, empty, breathing — until Questions is written in it
     *
     * `--mclear`, the old scrubbed clearing, stays as the guarantee over the last quarter of
     * `printing.clears` only — so a flick still leaves the room empty inside the pin, and an ordinary
     * hand never meets it.
     */
    leaves: {
      /*
       * **Fourth review, 26 September 2026** — *"Ainda vejo a saída do Method demasiado como um único
       * bloco… os pequenos pensamentos desaparecem individualmente, com pequenos atrasos claramente
       * perceptíveis… a sensação de que os pensamentos estão a abandonar a sala um a um."* The third
       * pass had every thought leaving inside ~1.3s, overlapping; the eye grouped them. Now:
       *
       *     0.00 – 1.40   the composition, statement → line → question, 0.2s apart
       *     1.30 – 4.90   the seven thoughts, one every 0.45s, never in their order on the page, each
       *                   drifting 4–7px sideways as it thins
       *     4.30 – 5.30   the margin note, last
       *     5.30 – 6.40   the room, empty (`emptyHolds`) — and only then may Questions begin
       */
      main: { at: 0, over: 1.0, stagger: 0.2 },
      /**
       * One delay per thought, in `overheard` order — 0.45s apart, scattered, so each leaving is seen on
       * its own. `drift` is each one's sideways step as it goes, in px; never more than 8.
       */
      thoughts: {
        at: 1.3,
        over: 0.9,
        delays: [0.9, 2.25, 0, 1.8, 0.45, 2.7, 1.35],
        drift: [-6, 5, 7, -5, 6, -7, 4],
      },
      notes: { at: 4.3, over: 1.0 },
      /** The empty room, held, before Questions may write itself. Clock seconds. */
      emptyHolds: 1.1,
      /** Back above the trigger, everything returns at once over this. */
      returns: 0.6,
      /** The share of `printing.clears` the scrolled guarantee waits before it begins. */
      guardAfter: 0.8,
      /**
       * **How far before the old clearing the leaving is triggered, in beats of the section.** The
       * composition stands complete for a third of a beat and then begins to leave; 0.8 of the 1.13
       * suspension is spent on the leaving so it has ~1,400px of held frame to happen in at 1920 × 889,
       * and the scrolled guarantee is met only by a flick.
       */
      leads: 0.8,
    },
    /** The approach, in viewport heights rather than beats — it is a layout distance. */
    arrival: { begins: 0.86, settles: 0.05 },
    /**
     * **Where the rail's *Method* lands, in beats after the composition is complete** — QA, 26
     * September 2026. It landed on the section's top, before any beat had fired, so a press on
     * *Method* opened on an empty room. Just past `gatheredFrom` every arrival has been triggered and
     * plays in, and the leaving (`leaves`, 0.33 beats later) has not begun.
     */
    lands: { afterGathered: 0.08 },

    /**
     * ── The field, in bursts · design owner, 19 September 2026 ────────────────────────────
     *
     * *"Quero que o scroll funcione mais como TRIGGER de pequenas sequências autónomas. Dentro de cada
     * sequência podem entrar 2–4 frases com pequenos delays diferentes entre elas… Densidade maior, não
     * velocidade maior."*
     *
     * **Nothing here got faster.** Every arrival still opens over 0.24 to 0.30 of a beat — 36 to 45vh,
     * the same as the version before it — and no line is hurried. What changed is where they *start*:
     * seven starts spread evenly across 2.6 beats became **three clusters** with real quiet between
     * them. Measured at 1440 × 900, where a beat of this section is 1,350px:
     *
     *     burst A   3 lines   starts 107 and 147px apart    the room filling
     *     ·         573px of nothing
     *     burst B   2 lines   starts 134px apart            the afternoon turning
     *     ·         586px of nothing
     *     burst C   2 lines   starts 94px apart             the two largest, and the moment it starts
     *
     * A wheel notch is about 100px and a flick is most of a viewport, so one advance of the hand lands
     * inside a burst and two or three thoughts appear with different small delays between them — and the
     * next advance is quiet. That is the density the brief asks for, and it costs the section **2,240px
     * of field against 4,100** at the same viewport.
     *
     * **The delays inside a burst are all different**, which is the other half of *"não quero intervalos
     * mecânicos iguais"* applied one level down: 0.08 and 0.11 inside A, 0.10 inside B, 0.07 inside C.
     *
     * The order is still the copy's — `site.ts` authors the seven as one afternoon and the array's order
     * is the chronology — and the bursts respect it, so the ladder rises with the sequence: the three
     * smallest, then the middle pair, then the two largest.
     */
    composed: {
      /**
       * Seven arrivals, `[at, over]` in beats of this section, in three bursts.
       *
       *   A -0.10  Is everyone here?  -0.02  Nobody planned that.   0.09  Wait — look at this.
       *   B  0.92  Leave it like that.                              1.02  Did you see that?
       *   C  1.62  That wasn’t meant to happen.                     1.69  It’s starting.
       *
       * **The first burst opens inside the light rather than after it.** Its three windows start above
       * the section's own top, where `--menter` is still climbing — measured, 0.73 at −200px and 0.99 at
       * the top — and every line in the frame is multiplied by that light, so they arrive *with* the
       * room instead of into a room that is already finished. It also buys the composition below its
       * anchor 300px sooner: the statement lands at 0.22, while these three are still settling.
       */
      lines: [
        [-0.1, 0.26],
        [-0.02, 0.24],
        [0.09, 0.28],
        [0.92, 0.24],
        [1.02, 0.28],
        [1.62, 0.26],
        [1.69, 0.3],
      ],

      /**
       * The one margin note, and it belongs to the last line it is true of, inside the third burst.
       *
       * It was two. `Overheard, not directed` arrived at 0.43, with the tail of the first burst, and
       * was removed on 20 September 2026 — `content/site.ts` carries the argument. Nothing else moved:
       * the survivor keeps the window it was authored with.
       */
      notes: [[1.78, 0.26]],

      /*
        **OBSERVE — UNDERSTAND — SHAPE — PRESERVE is removed** — design owner, 20 September 2026, and
        it is not replaced and not rebuilt with other words: *"A ideia do 'método' já está a ser
        comunicada pela própria cena e pelas frases ambientais. Não precisamos de a explicar
        novamente."* `composed.sign` and the `--msign-in` track are gone with it.
      */


      /*
        ── The main composition, in the order it is read ─────────────────────────────────────

        **The three pieces arrive in their own order, and that is the whole of this brief** — design
        owner, 19 September 2026:

            YOUR EXPERIENCE                          first — it establishes the subject
            Built around what makes yours unique.    after — the idea developing
            What makes it yours?                     last — the question, the conclusion

        It was the other way round: the question opened the section and the answer resolved above it at
        the end. That produced the right *frame* and the wrong *reading* — the eye met a small question
        first and the statement arrived as an afterthought over it.

        **They are interleaved with the field and not blocked against it.** Each piece lands between
        bursts, so the composition is built while the room goes on speaking rather than in a pause cut
        out of it: the statement inside the first burst's tail, the line between the second and the
        third, the question after all seven are standing. *A composição principal deve nascer ENTRE
        essas frases, não substituir a cena.*
      */

      /**
       * **`Your experience`, and it is the first thing in the Method** — design owner, 20 September
       * 2026: *"YOUR EXPERIENCE deve começar a entrar IMEDIATAMENTE quando saímos do About e entramos
       * no Method… a primeira âncora visual do Method, equivalente ao papel que 'We stay close to every
       * detail' tinha no About."*
       *
       * It was 0.22 — about 300px into the held frame, *after* the first three thoughts had opened. The
       * reading that produced was room → phrases → wait → subject, and the brief rules it out by name.
       *
       * **It opens at the lock, and that is a position and not a delay** — design owner,
       * 20 September 2026: *"A entrada acontece NO PRÓPRIO EIXO/POSIÇÃO FINAL… sem subir do fundo…
       * deve parecer que a frase está a ser revelada no espaço, e não que está a ser deslocada para o
       * espaço."*
       *
       * **The frame is `sticky` and it is still travelling on the approach**, which is what the design
       * owner was seeing. Measured at 1920 × 889: `.method-stage` locks at `methodTop + 78`, and only
       * there does the block stand at its authored 261 × 167. At the old `−0.37` the statement was
       * revealed **556px before that**, so it was uncovered at y 723 and carried up the screen to 167 by
       * the frame beneath it. Nothing in the animation moved it — the room did — and no amount of
       * easing inside the beat could have fixed that, because the travel was the page scrolling.
       *
       * So zero is the lock: the phrase is revealed at the axis it keeps, at the size it keeps, and the
       * only thing that changes is how much of it there is. `globals.css` fixed the other half of the
       * same fault — its tracking was animated, which contracted it 80px horizontally as it arrived.
       *
       * **This gives up being born *during* the room's lighting, and the two cannot both be had.**
       * `--menter` finishes within 50px of the lock, so anything revealed while the room is still
       * coming up is by construction revealed while the frame is still rising. The design owner chose
       * the axis, and the axis is the thing About and this section share.
       *
       * `over` is unchanged and is now only a duration: 0.65 beats through `play.perBeat` is 2.21s, the
       * longest arrival in the frame, which is what keeps it the anchor.
       */
      answer: [0, 0.65],

      /**
       * **The line, as the idea developing.** It opens after the statement has stood alone for a beat
       * and lands between the second burst and the third, which is what keeps the composition from
       * reading as one block being typed out: something else has happened in the room in between.
       */
      line: [1.18, 0.36],

      /**
       * **`What makes it yours?`, and it arrives with the last of the field** — design owner,
       * 20 September 2026: *"deve entrar juntamente com as frases finais do campo de pensamentos…
       * a pergunta que fecha a composição depois de o espaço já estar povoado. Não a antecipar."*
       *
       * **It is authored now and it used to be the one chained arrival.** It was derived off the whole
       * room being lit plus `gathered.holds` of stillness — *asked after the room has spoken* — which
       * put it at 2.32, a third of a beat after the last phrase had finished. The design owner replaced
       * that relationship with this one: it comes in *among* the closing phrases rather than after a
       * pause cut out for it.
       *
       * 1.82 sits inside the third burst — `That wasn't meant to happen.` opens at 1.62 and
       * `It's starting.` at 1.69 — so the question and the last two things overheard in the room are
       * one moment. With `resolve.fade` it closes at 2.22, the last thing in the section to arrive.
       *
       * Only the beat is authored: the fade is `resolve.fade`, which is the question's own and is the
       * slowest arrival in the frame.
       */
      ask: 1.82,

      /**
       * The settle, in pixels, and it is the whole of the movement. The brief allows 4 to 6 and asks
       * for nothing vertical to be *evident*; 5 is inside it and a pixel under the 6 the publication
       * settles on elsewhere, because these lines arrive one at a time and a travel that reads as a
       * gesture on a whole composition reads as a slide on a single line.
       */
      rise: 5,
    },
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     THE DOCK · junctions 06 → 07 → 08 — **FRACTIONS of the whole gesture's own 0 → 1**

     **The sentence becomes a centred title card, and only then does the title card become the studio.**

     Revised 3 September 2026 on the design owner's direction: the survivor no longer travels to the
     rail at all. It travels to the viewport's own centre, stands there as `CHAPTER III` long enough to
     be read, and the rail is a second, separate hand-off that happens after — carried by the numeral
     alone, once the card has said what it has to say. It runs, in order:

       0.00  "Some moments deserve another chapter." stands
       0.07  the sentence begins to be consumed from the right — AND `chapter` sets off, same frame
       0.14  the survivor begins to contract, already in flight
       0.38  it lands centred in the viewport, at the lockup's size, in the same instant
       0.47  `III` is revealed beside it — it does not travel, it was always going to appear there
       0.515 `CHAPTER III` stands centred, complete, motionless
       0.555 `What We Actually Make` fades in beneath it, still centred, nothing else moving
       0.63  `chapter` releases; the centred card's job is done
       0.665 the numeral leaves the card and travels — alone — to the rail's own axis
       0.825 the three strokes fall and stack into the mark
       0.90  nothing happens
       0.95  the index is drawn out of the mark, WORK first

     Two rules hold the whole table together and neither is negotiable:

     **The consumption and the escape are one action.** They start on the same frame and overlap for
     their whole length. There must never be a frame in which the sentence is coming apart and the
     survivor is standing still, and never one in which the survivor moves through an empty frame.

     **Movement first, transformation underneath it.** The word leaves at the size it had in the
     sentence and contracts while travelling. It never becomes a small label and then moves.

     Design owner's direction, 2 September 2026: the rail carries a three-stroke mark and the five
     destinations, and nothing else. `III Studio` is gone as a wordmark and the `I / II / III` ticks are
     gone with it — the ticks froze at state 08 and never moved again, so they were a position marker
     that marked nothing for eight of the fourteen states, and the numeral was on the rail twice.

     **Why this can be one continuous movement rather than a cross-fade.** The numeral is set in
     Schibsted Grotesk, whose uppercase `I` is a plain bar with no serifs. `III` in that face already
     *is* three strokes side by side. So the mark is not a new object that replaces the numeral — it is
     the same three strokes, lying down and stacked. Nothing is substituted at any frame.

     The phases below tile the gesture. Each is a window on the gesture's own `0 → 1`, which spans
     `spans` junctions from `from`, and every one of them is a fraction so that re-pricing a junction
     re-times nothing.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  dock: {
    /**
     * **Which junction the gesture begins on, and how many it spans** — 06, and two of them, so it
     * runs 06 → 07 → 08 and stops exactly where state 08, "The Ledger", begins.
     *
     * It used to start at **07**, and that one number is most of what was wrong with this transition.
     * The register change — the word contracting and tracking out — was the only thing on junction
     * 06 → 07, driven straight off `--jp6`; the travel and everything after it were on this gesture,
     * which began a junction later. So the two halves of one transformation were on two different
     * progression variables and could not overlap **by construction**: the word had finished becoming
     * a label before it was allowed to move. Measured at 1424 × 749, the shrink had 3,280px and the
     * travel had 230px of the same sequence.
     *
     * Starting here puts the consumption of the sentence, the survivor's escape and its contraction
     * on **one** `0 → 1`, which is the only way they can be one movement.
     *
     * It also takes the gesture *out* of junction 08 → 09, which it used to end inside. 08 → 09 is
     * the exposure lift, so the lockup, the identity and the rail were all being performed on top of
     * state 09 arriving — the work's title was fading up under `chapter III`. It no longer is.
     *
     * Every window below is a fraction of the whole gesture, so re-pricing a junction re-times
     * nothing.
     *
     * **`j` divides by junction count, so the junctions have to be the same length.** `shot.iiiStudio`
     * is set to make them 1.18 beats each — about 1,780px apiece at 1424 × 749 — so one unit of `j` is
     * the same number of pixels on both sides of the boundary and a window can be moved anywhere in
     * the table without changing what it is worth. The old note here, about a window that changed its
     * on-screen length by a factor of three if it crossed 0.5, is retired with the pricing that caused
     * it. **If either junction is ever re-priced, re-price the other to match.**
     */
    from: 6,
    spans: 2,

    /* ── 0 · The sentence stands ───────────────────────────────────────────────────────────────── */

    /**
     * **Nothing happens here, and the junction has to start with it.**
     *
     * `.v2-some` finishes arriving inside junction 05 → 06, a few pixels before this gesture begins,
     * so without a window of its own the sentence would be complete for one frame and then already
     * coming apart. This is the frame the design owner froze: *"Some moments deserve another
     * chapter."*, whole and readable, standing on the plate. ~250px at 1424 × 749.
     *
     * It is a consequence of `sentence.at` and `settles[0]` rather than a channel — both start at
     * 0.07 and nothing else is scheduled before them.
     */

    /* ── 1 · There is no type in this gesture ────────────────────────────────────────────────────── */

    /*
      **`sentence`, `anotherLeaves`, `holdsWord`, `becomesAt`, `leaves` and `holdsFrame` are all gone —
      7 September 2026, design owner (C13).**

      They timed a sentence being consumed, a survivor held alone, its exit, and the breath after it.
      **None of those things exists.** `Some moments deserve another chapter.` is removed from the site,
      the survivor `chapter` with it, and `Studio` before them. The narrative ends on `A memory.` in
      junction 05, and this gesture begins on a frame that already carries no type.

      What is left is what the gesture was always really for: **the camera, the light, and the rail.**
      The photograph holds, the composition opens, and the navigation is written in the field the
      recompose makes. `docs/design/v2/implementation-reconciliation.md` C13.

      Do not add a channel here for a word. If a document asks for one it predates C13.
    */

    /**
     * **The photograph, alone, before anything moves.**
     *
     * The gesture opens on a held frame: `A memory.` has gone in the junction before this, the plate is
     * at its own exposure, and nothing is scheduled. It is the breath between the narrative ending and
     * the composition opening, and it is authored as a window so it cannot be tuned away by accident —
     * the same discipline `stills` is under.
     *
     * It used to be 0.575 → 0.63, wedged between a word leaving and the camera. With the word gone it
     * starts at zero, because there is nothing before it to wait for.
     *
     * **0.10, and the number is set by where `A memory.` actually goes rather than by this window
     * alone.** The breath does not begin here: the last occasion is gone by y 10600 and this gesture
     * does not start until y 11071, so the tail of junction 05 already contributes ~470px of held
     * photograph. Measured at 2560 × 1305. At 0.18 the two together came to **1,140px in which
     * literally no channel moved** — nearly a full viewport of scroll, which stops reading as a held
     * frame and starts reading as a page that has stopped responding.
     *
     * At 0.10 the total is ~840px, about two thirds of a viewport: long enough that the stillness is
     * unmistakably deliberate, short enough that the hand is not asking whether anything is wrong. The
     * light then begins before anything moves, which is the order the passage wants — the photograph
     * comes alive first and the composition answers it.
     */
    holdsFrame: [0.0, 0.02],

    /* ── 4 · The camera opens the composition ────────────────────────────────────────────────────── */

    /*
      **`holdsLockup` and `releases` are gone — 7 September 2026, C12.**

      They held the studio's name on the photograph and then let the camera move off it. There is no
      name in this frame, so there is nothing to hold and nothing to release. `holdsFrame` above is what
      replaced them, and it is a third of their length: the beat after `chapter` is a **breath**, not a
      second title card.

      `--release` went with them and is published by nothing.

      **What follows `chapter` is the recompose.** It used to begin at 0.745 — 590px after the word had
      gone at 1424 × 749, an empty stretch with nothing happening in it. It begins at 0.63 now, straight
      out of `holdsFrame`, so the frame stops carrying type and immediately starts opening. That is the
      continuity the sequence turns on: the narrative ends, and the composition answers it.
    */

    /* ── 5 · The rail is written in the field the camera opened ──────────────────────────────────── */

    /**
     * **The rail's head lights — `III — Studio`, as type, in the corner.**
     *
     * This is the only place the studio's name appears in the sequence, and it is **not an arrival from
     * the frame**: nothing travelled here, nothing shrank into it, and no word handed over to it. It is
     * the chapter's running head, written at its own rank in the margin the recompose opened — the same
     * way a book sets a running head, which is a different act from setting a title.
     *
     * C12 removed the display `Studio` entirely, and this is what makes that removal possible: the
     * studio is named where its structure is, once, and the film ends on `chapter`.
     *
     * It opens after the still and completes just before the index begins to draw beneath it, so the
     * head is standing before its own contents arrive.
     */
    /*
      **`lights` is gone — 14 September 2026, design owner.** It was the rail's head fading in on its
      own window, which made `III — Studio` a separate event between the camera stopping and the index
      being drawn: *"não quero luz → espera → câmara → espera → pan → espera → rail."* The head is
      inside the rail's own wipe now (`.ledger-rail`), so it is drawn out of the margin immediately
      before the five destinations and the whole navigation arrives as one movement.

      `--lights` is published by nothing and read by nothing.
    */

    /*
      **`reposition`, `holdsSubject`, `falls`, `stacks` and `gap` are gone — 7 September 2026.**

      All five served the three drawn strokes and the deck. See the note under section 3 for why they
      are removed rather than left as debt: they described `Studio`'s identity migrating into the corner
      of the frame, and that is precisely the mechanism this decision retires.
    */

    /* ─────────────────────────────────────────────────────────────────────────────────────────────
       THE CAMERA · the promotion's, ported whole — 6 September 2026

       ONE move, monotonic, never looping. It starts only after the statement has been read, so at no
       point is there a push that begins and ends under type the visitor is still reading, and both
       terms complete at `opens[1]` and are clamped there — the runway before the index even begins is
       already still, and the whole hold after it is still.

       The stop is not a cut: `easeInOut` is a cubic whose derivative is zero at x = 1, so the frame
       coasts the last of the distance and settles onto its final position.

       `push` is the slow close on the couple; `opens` is the recompose — the framing opens to the left
       and the couple drifts right, which is what makes room for the rail without anything being moved
       out of the way. Percentages of the frame, and the nodal point is left of the couple so that the
       left field spreads outward and leaves.
       ───────────────────────────────────────────────────────────────────────────────────────────── */
    camera: {
      /**
       * **One term, and it is a settle rather than a move** — design owner, 14 September 2026.
       *
       * This was two terms, `push` and `opens`, and between them they carried **10.6% of scale and a
       * reversal of direction**: `x` ran `0 → −0.5 → +1.3`, so the frame drifted left for 2,650px of
       * scroll and then swung right for 540px. Measured on the running page at 2560 × 1305.
       *
       * **The reversal was the whole fault.** §2's own 20% pan (`environment.ts`'s `panAt`, states 07 →
       * 08) translates the plate **left by up to 512px** across exactly this stretch. The recompose
       * pushed it **right by 40px** against that, on a different schedule — two lateral systems, in
       * opposite directions, neither of them finishing where the other did. That is why the passage read
       * as effects rather than as a shot: it *was* two cameras.
       *
       * **So the lateral move is §2's pan alone, and this is what is left.** No `x`, no `y`, and a scale
       * that exists to let the frame come to rest rather than to get closer to anything. 1.6% across
       * 1,050px is about 0.4px of growth per wheel notch — below the threshold where the eye reads a
       * zoom, which is precisely the point: *"pode existir um ligeiro push/reframe, mas não quero um
       * zoom perceptível."*
       *
       * **It closes at 0.84, with the light and with the rail's head**, and that is `stills`' constraint
       * rather than a preference: the still runs [0.84, 0.88] and nothing this gesture owns may move
       * inside it. It was 0.86 on the first pass of this rewrite — two hundredths *inside* the still,
       * so the beat of nothing had the camera and the exposure still running through its first half.
       * Caught by reading the table back against itself.
       *
       * So the move, the light and the name all come to rest on the same frame, and then nothing
       * happens for 150px before the index is drawn. §2's own pan is still coasting underneath — it is
       * derived from where states 07 and 08 sit and is not this gesture's to stop — but `smoothstep`'s
       * derivative is zero at 1, so what it is doing there is arriving, not moving.
       *
       * **This also answers C10's open question** (*"should §2's 20% pan stay now that the push is
       * there?"*) in the only direction that is not a design decision: the pan is V2's, authored in §2's
       * own column, and the push was the addition. The addition goes.
       */
      opens: [0.02, 0.82],
      scale: { open: 0.016 },
    },

    /**
     * **The exposure, and it is the promotion's curve rather than a state column.**
     *
     * Held down while the type is the subject, one dip for the breath before the mark, then opening as
     * the scene comes alive — and THE LAST MOVE GOES DOWN. It used to run up with contrast to 1.04,
     * which put the photograph at its loudest at the exact moment the type had to be read and the room
     * had to feel resolved. Reversed: the plate settles 2.9% darker and a touch flatter as the frame
     * comes to rest, and holds there. Rooms you enter get quieter, not brighter.
     *
     * `sat` is derived from the luminance rather than authored, so it eases off by itself and there is
     * no second move to keep in step.
     */
    exposure: {
      /**
       * **The light rises once and never turns back** — design owner, 14 September 2026.
       *
       * It used to be five stops with **three changes of direction**: `0.62 → 0.52 → 0.86 → 0.835`, and
       * then state 09's own lift took it to `1.0` — so the photograph got darker, then much brighter,
       * then darker again, then brighter, inside one passage in which nothing was being said. Each turn
       * is a separate event to the eye, and four of them is most of what made this stretch read as a
       * sequence of effects.
       *
       * **The dip had a reason and the reason is gone.** It was *"the breath before the mark"* — the
       * frame going quiet before `chapter` was set on it. C13 removed the word; the dip stayed behind and
       * was left dipping for a title card that no longer arrives.
       *
       * So: one monotonic rise, `0.62 → 0.835`, beginning as the breath ends and settling with the
       * camera at 0.84, which is where `stills` begins. **State 09 then continues the same movement** to true exposure — the Environment
       * lifts `0.835 → 1.0` across junction 08 → 09 — so from `A memory.` to the Work the light does one
       * thing, in one direction, across the whole passage. The scene coming alive is the bridge, and it
       * is now a single gesture rather than a flicker.
       *
       * **The endpoints are `spine.ts`'s and must stay its.** States 06 and 08 carry `0.62` and `0.835`,
       * which is what lets `--film-at` ramp the curve in and out without a step at either shoulder. Moving
       * either end of this table means moving that state's exposure in the same commit.
       *
       * `con` follows the luminance up and stops climbing where the light does; `sat` is derived from the
       * luminance rather than authored, so it cannot disagree with it.
       */
      stops: [
        { at: 0.02, lum: 0.62, con: 0.96 },
        { at: 0.46, lum: 0.75, con: 0.97 },
        { at: 0.82, lum: 0.835, con: 0.985 },
      ],
      sat: { from: 0.74, to: 1, over: [0.52, 1.0] },
    },

    /* ── 6 · Stillness, and then the rail is written ───────────────────────────────────────────── */

    /**
     * **The frame in which nothing happens, and it is the most important beat here.**
     *
     * Authored as its own window rather than left as the gap between two others, so it cannot be tuned
     * away by accident. A menu that appears at the end of a movement reads as an interface; a menu that
     * appears after a pause reads as an offer. Nothing may be scheduled inside this range.
     *
     * It was 0.04 of a gesture whose second half was in a 1,120px junction — 90px, less than one
     * wheel notch, which is not a pause, it is a rounding error. At 0.055 of the repriced gesture it
     * is **~197px**, and the hand actually stops.
     */
    /**
     * **The rail's own grade**, and the reason the index is legible on this plate at all.
     *
     * Ported from the promotion prototype on the design owner's direction, 6 September 2026. Without it
     * `Questions` and `Contact` land on the sun's specular track on the water — the brightest thing in
     * the frame — and read only because *this* crop happens to be dark under them. That is a coincidence
     * of one photograph, and `three.work` is meant to be swappable.
     *
     * It opens as the card releases and is complete as the rail lights, so the density arrives with the
     * structure it exists to protect and never lies on a frame that is still being read.
     */
    grades: [0.16, 0.32],

    /*
      **`stills` is gone with the beat it protected.** It held a frame of nothing between the head and
      the index so that the navigation *"reads as an offer rather than as an interface"*. That argument
      assumed the head and the index were two arrivals; they are one now, so there is nothing to hold a
      pause between. The breath in this passage is the one after `A memory.`, and it is the only one.
    */

    /**
     * **Draw.** The subject line lifts and the five leader rules extend downward out of the mark in its
     * place, WORK first, each word arriving behind its own rule.
     *
     * The last row starts at `at + 4 × stagger` and takes `over`, so the five must finish by 1.0 —
     * **and at 0.962 they did not.** 0.962 + 4 × 0.005 + 0.028 is 1.010, so the fifth row's ramp was
     * clamped a third of the way through and `Contact` arrived at 0.71 of its ink and stayed there for
     * the rest of the film. Measured on the running page before the fix; the note above claimed the
     * arithmetic closed and it never did.
     *
     * 0.952 is the largest `at` that closes it: 0.952 + 0.020 + 0.028 = 1.000 exactly. `stills` follows
     * it down, so the beat of nothing before the index still runs right up to the first row.
     */
    /**
     * **The index is drawn, and now it actually is** — design owner, 14 September 2026.
     *
     * This was `{ at, over, stagger }`: five per-row opacity ramps, each 0.0252 of the gesture, 0.0072
     * apart, closing at 0.916. **Every one of them was spent behind a closed shutter.**
     *
     * `.ledger-index` carries `clip-path: inset(calc((1 - var(--handoff)) * 100%) 0 0 0)`, and
     * `--handoff` is a **step** — `stateEntries` puts state 08 at `spans.handoffAt`, so it goes 0 → 1 in
     * one frame. Measured on the running page at 2560 × 1305: at y 14795 the clip was `inset(100%)` and
     * the index invisible with all five rows already at full ink; at **y 14805 — ten pixels later** — the
     * clip was `inset(0%)` and the whole navigation was standing, complete, at once.
     *
     * So the index had **three** arrival mechanisms — a block fade on `--jp7`, five staggered row ramps,
     * and a clip — and the visitor saw none of them. What they saw was a pop. It is the hardest
     * discontinuity in the passage and the one thing here that is a plain defect rather than a taste.
     *
     * **One mechanism replaces all three, and it is the one §3 authored.** 07 → 08 is *decompose*: the
     * index is *drawn out of the mark, top to bottom*. That is a wipe, so this window drives the clip
     * directly — `--rail-draw` — and the rows keep no opacity of their own. The navigation grows
     * downward out of the head that was just written above it, which is what makes it read as part of
     * the composition rather than as a panel laid over the photograph.
     *
     * It closes exactly at 1.0, which is the instant `--handoff` steps and state 08 begins. The step
     * survives — it still gates *reachability*, which is what it was added for — but it can no longer be
     * seen, because the index is already whole when it fires.
     */
    draws: [0.3, 0.6],
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     THE LEDGER'S OWN SYNC — **viewport heights**

     Added 20 September 2026, design owner: *"O menu/rail esquerdo está a mudar de capítulo demasiado
     tarde em relação à experiência visual… quero que o capítulo mude quando a nova secção passa a ser
     visualmente dominante."*

     **This is the only thing in the file that moves a state without moving what the state looks like.**
     `--state` is unchanged and so is `data-film-state`: the grounds, the plates, the exposures, the
     rail's own ink and the Work's carousel all keep reading the film's real position. What leads is a
     separate walk of the same table, published as `data-rail-state`, and the only thing that reads it
     is which of the five words the Ledger lights.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  ledger: {
    /**
     * **How far ahead of a state's own entry the rail may name its chapter, in viewport heights.**
     *
     * A state begins where its section begins, which is correct for everything that stands *on* the
     * ground and wrong for the one thing that describes it. Measured at 1920 x 889:
     *
     *   ABOUT -> METHOD     About's composition is released 1,200px above `.method`'s top and the room
     *                       lights over the last 600 — so the Method owns the screen from about
     *                       y 22,800, and the rail was still saying ABOUT until y 23,450.
     *   METHOD -> QUESTIONS the held frame is **completely cleared at y 28,000** (`--mclear` reaches 1)
     *                       and `.questions` does not begin until y 29,247 — so the rail said METHOD
     *                       for 1,150px of a room with nothing of the Method left in it.
     *
     * 0.58 of a viewport is 516px at that frame, which lands both: the Method is named at y 22,934,
     * with the room lighting and About gone; Questions is named at y 28,634, with its heading in the
     * lower third of the frame and the Method's own composition a third of a screen behind it.
     *
     * It is a distance and not a fraction of a junction, because what it is measured against is how
     * far up the screen the incoming section has come — which is a viewport, in any frame.
     */
    lead: 0.58,

    /**
     * **Which chapter changes lead, and it is one of the five now.**
     *
     * It was `[11, 13]`. **State 13 is removed** — design owner, 21 September 2026, watching the
     * recording: *"o menu ja muda para QUESTIONS e ficamos demasiado tempo apenas com a fotografia
     * vazia… Isto parece atraso/loading, nao um hold intencional."*
     *
     * The lead was doing to Questions exactly what it was built to stop the Method doing, from the
     * other side. Measured at 1920 x 889: the Method's frame clears at y 28,000 and the Questions
     * composition cannot be revealed until its list locks at y 29,247, because until then the whole
     * section is still being carried up the screen (`questions.anchor.afterLock`). That is 1,247px of
     * empty room whatever the rail says. With the lead, the rail named QUESTIONS at y 28,634 and then
     * stood over **613px of nothing** — a chapter announced and not delivered, which reads as a page
     * that has not loaded. Without it the rail names Questions at the state's own entry, y 29,163,
     * and the composition begins 84px later: a breath, not a wait.
     *
     * **The empty room is not removed and is not this number's to remove.** It is the distance
     * between the Method's tail and the Questions section, and it belongs to both of them. What
     * changes is only which chapter is named while the visitor crosses it — and the Method's own
     * name over the end of the Method's own runway is the honest answer.
     *
     * ABOUT -> METHOD is untouched and keeps the lead for the reason above it: the Method owns the
     * screen from y 22,800 and its section does not begin until 23,450, so there the rail really was
     * naming a chapter that had already gone.
     *
     * The three that were never here are still left alone deliberately. State 08 is the dock: the
     * rail is *born* there, inside a composition `TIMING.dock` times to the frame, and leading it
     * would light the index before the numeral it is drawn out of. State 10 and state 14 are ordinary
     * flow sections whose composition begins where the section does, so there is no gap between
     * arriving and being dominant for a lead to close.
     */
    leads: [11],

    /**
     * **The index on a phone, opening and closing** — C24, 28 September 2026. Interface response, so a
     * clock is allowed (C8: *time owns only what the visitor did not cause*, and interface response is
     * named there beside `navHover`). Milliseconds.
     *
     * `opens` is the ground coming up and the list being drawn by the rail's own wipe. It is shorter
     * than a chapter exchange (`publication.chapter`, 660 out · 1020 in) because it answers a press and
     * the visitor is waiting on it, and long enough that the wipe reads as the rail drawing itself top
     * to bottom rather than as a cut. `closes` is shorter still: the visitor has already chosen, and the
     * page they chose is what they are waiting for.
     *
     * Reduced motion takes neither — the index is simply there, and simply gone.
     */
    index: { opens: 520, closes: 320 },
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     STATE 09 · THE WORK — **fractions of junction 09 → 10 (`--jp9`)**

     Added 7 September 2026, design owner. Two things live here, and both exist because state 09 had
     no life of its own: the film arrived at *Wedding Experience* and then spent the whole of junction
     09 → 10 — **~4,100px at 1424 × 749, 15% of the document** — fading out, with nothing changing in
     the frame except the ink coming off it. The longest stretch on the site was also the emptiest.

     `holds` gives the state its own still frame before the film starts to leave, and `makes` gives it
     the one thing that changes inside it.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  work: {
    /**
     * **The Work leaves before the paper arrives, and that is the constraint that sets this number.**
     *
     * Junction 09 → 10 is where the film hands over to the publication: `grounds.cross` runs the veil
     * and the ink across **[0.04, 0.16]** of it, and it cannot move — `arriving.empty` is 0.18, so the
     * paper has to be there before About writes its first line on it.
     *
     * The Work used to hold to **0.45** of that junction, which put it a third of the way past the
     * cross. Measured in Chrome at state 09: the Ledger's ink had already gone to the publication's
     * near-black (`srgb 0.059 0.055 0.047`) while the section was still being read on a photograph, so
     * `Work`, `About` and `Method` were dark type on a lit studio wall and effectively gone. The
     * carousel did not cause that — it exposed it, because it is the first thing that gives the visitor
     * a reason to stop inside this stretch.
     *
     * So the section is out across **[0, 0.06]**, ahead of the cross rather than through it. It costs
     * the Work nothing: the section arrives across the last two thirds of junction 08 → 09 and the film
     * is pinned, so stopping anywhere holds the frame — and what plays there is a clock, not scroll.
     */
    release: [0.0, 0.06],

    /**
     * **How the Work's own type arrives**, as fractions of junction 08 → 09 — the lift that brings the
     * plate to true exposure.
     *
     * Three windows, in reading order, and they are deliberately not simultaneous: **label → idea →
     * action.** The eyebrow is the frame the section is read in, so it is there first; the category is
     * the protagonist and takes the middle; the offer is a consequence of having read the category and
     * arrives after it, never with it.
     *
     * The design owner asked for that precedence explicitly — *"See full experience → deve entrar
     * depois da categoria, não necessariamente no mesmo instante"* — and it is the only sequencing in
     * the section. Everything after this is the carousel's clock.
     */
    arrives: {
      /**
       * **The context arrives while the photograph is still opening, not after it has finished** —
       * design owner, 14 September 2026.
       *
       * The complaint this answers was not that the movement was too long: *"o problema é o movimento
       * estar a acontecer durante demasiado tempo SEM CONTEXTO."* The section used to open at 0.78 of
       * junction 07 → 08 — y 12750 is where it opens now, and it was y 14500 — so the visitor scrolled
       * through the whole of the composition opening with nothing on screen to say what it was opening
       * *into*.
       *
       * **The order the design owner authored is the order this produces**, and the last line of it is
       * the one that decides these numbers:
       *
       *     photograph begins to open → rail begins → WHAT WE ACTUALLY MAKE → Wedding experiences
       *       → *the photograph finishes settling* → stable
       *
       * The Work's own block therefore completes at ~y 13626 while §2's pan runs to y 14803: the type
       * lands and the camera then settles under it, which is a shot resolving rather than two things
       * queueing. The light settles later still, and the lift to true exposure later again, so nothing
       * in the passage ends on the same frame as anything else.
       *
       * `from` is junction 06 — the section now opens in the same junction the rail is drawn in, so the
       * two overlap by design rather than waiting for each other. `spans` still runs to the end of
       * junction 08 → 09, so every window closes inside the exposure lift.
       */
      from: 6,
      opensAt: 0.9,
      spans: 2.1,

      /**
       * **The section's own presence, and it is the envelope the three lines arrive inside.**
       *
       * It was a literal in `globals.css` — `clamp(0, (--jp8 − 0.35) / 0.65, 1)` — which is choreography
       * written into a stylesheet, and it was also too late: reaching full only at the very end of the
       * junction left the Work at its own strength for a razor-thin band of scroll, and the carousel's
       * gate (which is this same product) never opened. Measured in Chrome — `data-work` stayed `off`
       * at every sample through the section.
       *
       * Complete by 0.75, so the section stands at full ink for the last quarter of junction 08 → 09 and
       * across the start of 09 → 10 before `release` takes it out. The driver publishes it as
       * `--work-in` and the stylesheet reads it; neither holds a second opinion about the number.
       */
      /**
       * **Brought forward so the composition has time to stand still** — design owner, 14 September 2026.
       *
       * It was `[0.35, 0.75]`, and that left the Work complete at y 15789 with `release` already taking
       * it out again at y 16118. Measured on the running page: **329px — a quarter of a viewport — was
       * the entire stretch in which the destination of the whole film stood finished and unchanging.**
       * The passage arrived and immediately began leaving, which is the opposite of settling.
       *
       * `release` cannot move — `grounds.cross` runs [0.04, 0.16] of junction 09 → 10 and `arriving.empty`
       * needs the paper before About writes on it — so the room is made at this end instead. Complete at
       * 0.5 gives **657px**, twice what it had, and it costs the arrival nothing: the junction's own
       * exposure lift is still running, so the type arrives into a frame that is still coming up to true
       * exposure and the light finishing last is what closes the passage.
       */
      block: [0.0, 0.26],

      /*
        **They overlap now, and that is the point.** The four windows used to run nearly end to end —
        0.35→0.47, 0.44→0.58, 0.56→0.68, 0.62→0.74 — which is a chain of four separate arrivals, and it
        read as four elements each doing its own animation. Overlapped, the same reading order survives
        as *emphasis inside one arrival*: the eyebrow is the frame the section is read in so it is there
        first, the category follows close enough to be the same gesture, and the offer and the caption
        settle under them.

        All four still close inside `block`, which stays the rule rather than a preference: anything
        still arriving after the envelope is full is arriving into a frame that has stopped changing.
      */
      label: [0.0, 0.11],
      /**
       * **The queue arrives with the eyebrow it continues** — C14, 16 September 2026. It is the index of
       * the statement above it, so it is there before the category it names the successor of. This was
       * `cta`: the offer moved into the caption (it opens the *work*, not the category) and arrives with
       * `identity` now.
       */
      index: [0.0, 0.11],
      /** *"Pode entrar ligeiramente depois do eyebrow, mas de forma muito subtil."* */
      category: [0.05, 0.17],
      /** The identification, last and quietest — a caption settles after its picture. */
      identity: [0.16, 0.24],
    },

    /**
     * ── THE QUEUE · **MILLISECONDS** — the one clock in the film, and what it is allowed to own ──
     *
     * C14, design owner, 16 September 2026 (Q2 · *fila que roda*). **The category words are the index,
     * and the next one fills with time.** When it is full it is promoted: it leaves the row as the
     * headline leaves the frame, the row moves up while the frame is empty, the category that was
     * showing re-enters at the tail, and the content changes on the dip's own signal.
     *
     * **This reinstates the clock the 14 September ruling removed, and C8 is still what allows it.**
     * *Scroll owns progression; time owns only what the visitor did not cause.* Which category stands
     * is not the visitor's until they press a word — and pressing one does not stop the queue, it
     * promotes that word and the queue carries on from there. Scroll still never changes the category:
     * it decides only whether the section is composed (`data-work`), and the clock runs only while it is.
     *
     * The exchange itself is unchanged — `carousel` below is still the film's dip.
     */
    queue: {
      /**
       * **How long one category stands, which is how long its successor takes to fill.** 8 seconds —
       * the value the design owner watched in the Q2 exploration. Long enough to read the headline,
       * look at the photograph and reach the caption; the filling word is what says there is more.
       */
      holds: 8000,
      /**
       * **The row moving up**, and the returning word writing itself in at the tail while it does. It
       * begins when the promoted word has left (`carousel.out`), so the row recomposes in an empty frame
       * rather than under a word that is still leaving.
       */
      moves: 420,
      /**
       * **A pressed word completes before it is promoted.** The press shows the rule the clock follows —
       * a word enters when it is full — rather than cutting past it. Short, because it answers a press.
       */
      completes: 320,
    },

    /**
     * **The exchange between one category and the next — the film's own dip.** `out`, a gap carrying
     * nothing, `in`: two categories are never legible at once, and the photograph changes inside the
     * dim rather than across it. Interface response, like `navHover` and `answer`, and in milliseconds
     * for the same reason. The queue above decides *when*; this decides *how*.
     */
    carousel: {
      /**
       * **How far the room goes down while the work is changed.** Black over the frame, and 0.55 rather
       * than 1: a blackout is a cut between films, and these are two works in one exhibition. At 0.55
       * the photograph is still faintly there — the room has dimmed, it has not been emptied — which is
       * what keeps the section one place rather than two.
       */
      dim: 0.55,

      /** The type leaves and the light goes down together. */
      out: 380,
      /** The frame carries no type and is at the dim floor. **The photograph is exchanged here.** */
      gap: 240,
      /** The light returns on the new work and the type is written onto it. */
      in: 420,

      /**
       * **Where inside the gap the work is exchanged, and how long the photograph takes to do it.**
       * `at` is measured from the **start of the gap**, not from the press.
       *
       * The old exchange was a 1,250ms cross-dissolve beginning on the press, and it is most of why this
       * read as a component. Measured frame by frame in Chrome: at the moment the outgoing category had
       * finished leaving, the picture was already **46%** changed, and by the time the incoming category
       * began it was at **84%**. The image changed itself in full light and the words then updated to
       * describe it — the causality of a caption following a slideshow, not of a film cutting to another
       * subject.
       *
       * **Everything that changes changes here, on one signal**: the photograph, the category, the
       * caption and the indicator. 60ms after the type has finished leaving, so the switch cannot race
       * the transition that hid it, and `over` closes at exactly `gap` — the cross-fade is finished
       * before the room begins to come back up, so it is never seen as a cross-fade at all.
       *
       * What the eye reads is a dim frame that held one work and now holds another. That is a cut.
       */
      exchange: { at: 60, over: 180 },
    },
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     STATE 10 · ABOUT — **fractions of junctions 09 → 10 (`--jp9`) and 10 → 11 (`--jp10`)**

     Rebuilt 16 September 2026 on the design owner's brief. §3's verb for 09 → 10 is **superimpose** —
     *"the sun becomes the lamp, one light belonging to two environments; the plates cross; the light
     never goes out"* — and its keyframe has the headline resolving at 30% of the junction, while both
     rooms are present. 10 → 11 is **extinguish**, *"About released in place"*.

     So About is no longer a block of page that scrolls up over the photograph. It is written into the
     frame, like the Work: the section keeps its height as runway, and its composition stands in the
     viewport, arriving on the publication's own grammar (`arriving`) and released in place here.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  about: {
    /**
     * **Where in 09 → 10 the two rooms cross.** It used to be the whole junction — ~5,300px at
     * 1920 × 889 — so venice and the studio stood half-and-half for thousands of pixels and read as a
     * ghost rather than as one light. The cross now begins as the Work leaves (`work.release` ends at
     * 0.06) and completes as the headline settles, so the double exposure is a passage, not a state.
     */
    superimpose: [0.06, 0.34],

    /**
     * **About's reading order, and it is scroll that starts each group and time that resolves it** —
     * design owner, 16 September 2026.
     *
     * The groups used to be pure functions of `--jp9`: opacity, tracking and settle all dragged pixel by
     * pixel, so nothing ever *settled* — it only stopped when the hand stopped. Now scroll decides
     * **when** (`at`, a fraction of 09 → 10, published as `data-about` on the root) and each group
     * resolves on its own curve (`ms`). Crossing back under a threshold releases the group on `leaves`.
     * The camera and the release stay on scroll: they are the space, and the space answers the hand.
     *
     * **The groups are spread across the camera's settle**, so the room answers each one as it lands —
     * that relation between the type on the left and the tree moving on the right is the design owner's,
     * and it is kept by placing the thresholds inside `settle`, not by animating the tree.
     *
     * **The breathing room is the distance after the last group.** The last group is written by ~0.6,
     * the camera finishes settling at `settle[1]`, and the frame is then wholly still until state 10,
     * where the method's room begins to darken and `release` takes the type. Measured at 1920 × 889:
     * ~1,000px of stillness, about a viewport.
     */
    arrives: {
      at: { statement: 0.18, support: 0.38, detail: 0.56 },
      ms: { statement: 1500, support: 1300, detail: 1000, stagger: 140, leaves: 450 },
    },

    /**
     * **The camera coming to rest in the studio.** A push of `push` (a fraction of the frame) that
     * settles to nothing across this window, centred on the lamp — the room is arrived in rather than
     * switched to. Complete before the details land, so nothing is read on a moving frame for long.
     */
    settle: [0.06, 0.82],
    push: 0.04,

    /**
     * **About released in place**, early in 10 → 11 — the type leaves the wall before the light does, so
     * what the visitor is left looking at when the room starts to go down is the room and the person in
     * it, with nothing written on them.
     *
     * It ends exactly where `passage.holds` begins — 18 September 2026. It used to end at 0.30 and the
     * plate dissolve started at 0.00, so About's own sentences were being taken off a photograph that
     * was already changing underneath them. Nothing in the frame was ever still.
     */
    release: [0.04, 0.2],

    /**
     * ── Junction 10 → 11 · the passage of time in one room ──────────────────────────────
     *
     * **Both frames are photographs and both are meant to be looked at** — design owner, 18 September
     * 2026. The two plates are not continuous and that is the subject, not the fault: About is the room
     * with somebody in it under one warm lamp; Method is the same room after they have gone, with
     * another quality of light in it. The junction is the time between.
     *
     *     0.00 → holds   the room stands. About's type has just left it.
     *     holds → falls  the light goes down — 1.02 to `floor`. A change of light, not an extinction.
     *     soft           the image loses a little of its definition with it, and only a little.
     *     cross          the empty room is uncovered, left to right, behind a very soft edge.
     *     lifts → 1.00   the light comes back to state 11's own, and the window's daylight with it.
     *
     * ── Why the crossing is spatial and not a dissolve ────────────────────────────────────
     *
     * **A uniform crossfade between these two plates cannot be hidden at a brightness worth looking
     * at.** What has to disappear is the difference between them, and after `contrast(c) brightness(b)`
     * that difference relative to the field is `70·c / (127.5 − 107.5·c)` — it depends on the contrast
     * alone. Composited off the real plates at the midpoint: at full light the person is a translucent
     * blob, the plant is doubled and the window is fully drawn; crushed far enough to hide all three,
     * the frame is a featureless grey and the room is gone. Those were the only two outcomes a uniform
     * dissolve had, and the second one is what shipped.
     *
     * So the plates are exchanged **across the frame instead of across time**. `cross` is when the
     * uncovering travels, `globals.css` owns how wide and how soft its edge is, and the direction is the
     * narrative: **left to right**, so the person — centre-left, and the one thing that is *supposed* to
     * vanish — dissolves first, the empty desk is already resolved behind it, and the window's light on
     * the right wall is the **last** thing to arrive. Rendered frame by frame: at no point are two
     * coherent photographs superimposed, there is no doubled plant, and the new light reads as light
     * reaching across the room rather than as a picture being swapped.
     *
     * It is not a wipe and it must never become one: the edge is two thirds of the frame wide with a
     * smoothstep across it, so there is no line to see anywhere in its travel, and it spans most of the
     * junction so nothing about it is quick.
     *
     * ── And the dip is now small, because it is no longer doing the hiding ────────────────────
     *
     * `floor` was 0.09 and `softens` 0.22 — a well deep enough to make 70 levels of difference
     * invisible, and deep enough that the passage read as *"um intervalo demasiado negro"*. With the
     * crossing spatial, the light has nothing to hide and only has to do what it says: go down, and come
     * back. 0.62 against About's 1.02 and state 11's 0.80 is about two thirds of a stop — the room
     * quieting, and no more than that. `softens` 0.86 is the last of the old device, kept because a
     * little less definition helps the person let go and because it is one number, not a mechanism.
     *
     * `contrast()` pivots on mid-grey, so it is applied **before** `brightness()`; the other order
     * would pull a dark frame up toward grey. `globals.css` owns the order.
     */
    passage: {
      holds: 0.14,
      falls: 0.5,
      lifts: 0.74,
      floor: 0.72,
      /**
       * What is left of the room's contrast at the bottom — the one lamp's modelling, gone. Below about
       * 0.25 the frame stops reading as a room at all and becomes a flat fog; above about 0.35 the
       * window on the right wall is findable again. 0.30 is the middle of that, measured.
       */
      softens: 0.86,
      /**
       * When the image loses its definition, against `[holds, falls]` for when it loses its light. It
       * starts late and finishes late, for the reason argued above, and it reaches the floor before the
       * plates begin to change places.
       */
      soft: [0.34, 0.58],
      /**
       * Where the two plates change places. It opens after `soft` has closed and shuts before `lifts`
       * opens, so the exchange runs entirely inside the still frame and never while either the light or
       * the definition is moving. Measured across it on the real plates: the worst single pixel moves
       * 4.6 levels of 255 and the right quarter's mean — where the two photographs differ most — moves
       * **1.9**.
       */
      cross: [0.2, 0.88],
    },

    /**
     * **Where the stage may exist at all, on scroll.** The groups resolve on a clock, so a jump away —
     * the rail's *Work*, the head back to the top — would leave them fading for `leaves` over whatever
     * the visitor jumped to. The stage is therefore also gated by position: absent before this window of
     * 09 → 10 and present after it, closing before the first group starts (`arrives.at.statement`).
     */
    presence: [0.08, 0.16],
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     THE PUBLICATION'S GROUND — **per state: how much veil, and which ink**

     §2 gives states 10 to 14 real plates — studio 1.02, studio .12, studio .20, warm stone, hero .72 —
     and `environment.ts` performs all of them correctly. They were invisible because the publication
     painted an **opaque paper over the top of them**, so the whole second half stood on a flat cream
     surface while the film above it stood on photographs. That is most of why it read as a different
     website.

     **The decision: the paper is not a ground, it is a veil, and its density follows the plate.** Where
     the plate is bright the veil stays and holds the dark ink legible; where the plate is dark the veil
     clears and the ink crosses to §2's light ink. Nothing new is invented — that is §1's third law,
     *exposure carries continuity*, applied to the page instead of only to the film.

     `veil` 0 shows the photograph whole, 1 is the paper the publication used to be.
     `ink`  0 is the publication's dark ink, 1 is §2's light ink (#f2e9dc at Contact).
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     QUESTIONS · state 13 — **fractions of junction 12 → 13, then seconds**

     Added 20 September 2026, design owner: *"A entrada actual de Questions está demasiado 'bloco de
     página': a estrutura inteira aparece de uma vez e quebra a linguagem cinematográfica que
     construímos no Method… Quero que Questions pareça uma composição que se vai formando, não uma
     lista que está a ser revelada pelo scroll."*

     The section had no arrival of its own at all. Only its label carried `data-arrive`; the seven rows
     stood at `opacity: 1` from the frame the section scrolled in, which is why it read as a page rather
     than as a composition. What replaces that is the Method's own grammar — **scroll triggers a moment,
     the moment plays on a clock** (`TIMING.method.play` argues the model and records the departure from
     C8; this is the same one, in the same room).
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  /* ──────────────────────────────────────────────────────────────────────────────────
     QUESTIONS · **THREE NARRATIVE MOMENTS, AND THREE AUTONOMOUS SYSTEMS**

     Design owner, 21 September 2026, and this table replaces everything that was here before rather
     than adjusting it: *"Nao tentes resolver isto apenas alterando q1/q2/q3, nth-child ou offsets. A
     ANCHOR precisa de um canal/estado de animacao proprio… A anchor NAO deve participar no mesmo
     driver temporal das FAQs."*

         Questions
           |-- anchor      autonomous reveal -> HOLD
           |-- faq group 1 autonomous reveal -> HOLD      three rows, read as one composition
           |-- faq group 2 autonomous reveal -> HOLD      three rows, read as one composition

     **A beat is a narrative state and not a wheel event** — *"UM BEAT != UM EVENTO DE MOUSE WHEEL."*
     It was six triggers for six rows, one per gesture, which is what made the section read as a list
     being fed in rather than as a composition being revealed. There are three moments now and there
     will not be more: scroll crosses the runway and fires the next state, and the state plays itself.

     Every position below is in **viewport heights from the section's own top**, negative above it. It
     is a layout distance and not a fraction of a junction, for the reason `methodArrival` is: what
     decides when something should appear is where it stands on the screen, and that is the same
     movement on any frame.
     ───────────────────────────────────────────────────────────────────────────────── */
  questions: {
    /**
     * **Where the lock stands when the list is not held** — mobile QA, 28 September 2026. A fraction of
     * the viewport, from its top.
     *
     * Everything below is measured from the lock, and the lock is the list reaching the head margin,
     * where it stands (`position: sticky`). Below 700px — and on a short landscape frame — the list is
     * in ordinary flow and never stands, so that moment is the list *leaving*: measured at 390 × 844 on
     * touch, the whole list crossed the screen unwritten (an empty room under a rail saying Questions),
     * its anchor began only at the lock, and the passage to Contact started 145px later and released it
     * while it was still arriving. The chapter was never read in normal scroll.
     *
     * So where nothing stands, the lock is the list **entering** the frame: its top at 0.85 of the
     * viewport. The anchor is written as it comes into view, the questions follow `faq.afterLock`
     * later while the list is in the upper half, and all of it is read before the passage. Where the
     * list is sticky this value is not read at all.
     */
    flowLock: 0.85,

    /**
     * ── BEAT 1 · THE ANCHOR ──────────────────────────────────────────────────────
     *
     * **The section's opening, and it is not a question in a list.** `What do you actually create?`
     * with its answer under it: one editorial block that is already composed where it belongs and
     * simply gains presence. The principle is the Method's statement — nothing arrives, nothing
     * travels, nothing is dragged, and scroll decides only the frame it begins on.
     *
     * It shares no array, no loop, no channel and no numbering with the rows. `globals.css` gives it a
     * register of its own as well (`.page-lead`'s rung, 24 → 40px against the rows' 17 → 20), so the
     * hierarchy is typographic as well as temporal.
     */
    anchor: {
      /**
       * **Where it fires, and it is measured from the lock rather than from the section's top.**
       *
       * Design owner, 21 September 2026, after watching the recording rather than the numbers: *"the
       * entire Questions composition is still moving upward from below as the section enters… They
       * must NOT be inside any transform/translate/moving track that is being driven by scroll."*
       *
       * **The track was `.asked` itself.** It is `position: sticky` under the head margin, so on the
       * approach it is still travelling with the page — the list is in ordinary flow until its top
       * reaches `--masthead`, and only then does it stand. Measured at 1920 × 889: the anchor's old
       * trigger at −0.78 uncovered it at **y 800**, and the page then carried it up **700px** to the
       * y 99 it keeps. Nothing in the animation moved it; the section did — every element reported
       * `transform: none` and an unchanging *document* position the whole way, which is why measuring
       * the document rather than the screen missed it completely.
       *
       * **So zero is the lock**, exactly as `TIMING.method.composed.answer` resolved the identical
       * fault for the Method's statement one section earlier: the phrase is revealed at the axis it
       * keeps, at the size it keeps, and the only thing that changes is how much of it there is.
       *
       * The driver measures the lock (`scroll-stage.tsx`, `askedLock`) rather than taking a number
       * from here, because where it falls is the sum of two `clamp()`s — the head margin and the
       * section's own band — and so moves with the viewport. At 1920 × 889 it is `where13` 0.064; a
       * constant authored here would be right on one frame and wrong on the rest.
       *
       * 0 is *at* the lock. Nothing may be negative: above the lock the composition is still moving.
       */
      afterLock: 0,

      /**
       * **The longest arrival in the section and nothing else comes near it.** The Method's statement
       * is 2.21s and is the anchor of that frame; this is the same role in a quieter register. Slower
       * is most of what presence is.
       */
      over: 1.5,

      /**
       * **The answer, which is the second half of the same moment.** It resolves behind the question
       * rather than with it — About's own order one section earlier: the claim, then its evidence.
       * `leads` is a third of the question's arrival, so the two overlap for most of their length and
       * read as one block coming up, never as two things animated in turn. The pair ends at 1.7s.
       */
      body: { leads: 0.5, over: 1.2 },

      /**
       * **The HOLD, and it is what makes this a moment rather than the head of a list.**
       *
       * In viewport heights after `at`, so the first group cannot fire before `at + hold`. It is
       * stated here, on the anchor, rather than as a gap inside the rows' own table: the list does not
       * get to decide how long the thing above it is allowed to stand.
       *
       * 0.34 is ~300px at 889. The anchor's own arrival runs 1.7s end to end, so the block is finished
       * and completely still well before anything else is asked.
       *
       * **It has to equal `faq.afterLock` exactly**, and `timeline.ts` asserts it does. It was 0.36
       * against a trigger of 0.34 — two numbers written in separate edits that never matched — and
       * the assertion had been reporting it on every load since. The 0.02 was worth nothing visually;
       * an assertion nobody reads is worth less.
       */
      hold: 0.34,
    },

    /**
     * ── BEAT 2 · THE FAQ SEQUENCE ────────────────────────────────────────────────
     *
     * **One trigger, one sequence, six entries** — design owner, 21 September 2026: *"um unico avanco
     * de scroll dispara UMA sequencia autonoma de todas as FAQs... FAQ 1 -> 2 -> 3 -> pequeno respiro
     * -> 4 -> 5 -> 6 -> tudo completo -> HOLD."*
     *
     * **The groups are gone as a structure and survive only as a breath.** It was `size: 3` and
     * `groups: 2` with a gap between them, which is two compositions; the brief asks for one build
     * with a pause in the middle of it. So there are six rows, one interval between each, and one
     * longer interval after the third. Nothing here is a scroll position except the trigger.
     */
    faq: {
      /**
       * **Where the sequence fires, in viewport heights after the lock.** 0.34 is
       * `anchor.afterLock + anchor.hold`, so the anchor has stood before anything is asked. The origin
       * is the lock because above it the whole list is still being carried up the screen, and anything
       * revealed there is revealed on the move (`anchor.afterLock`).
       *
       * It is the only position in the sequence. Everything below is time.
       */
      afterLock: 0.34,

      /** How many rows it writes, in document order. `timeline.ts` checks it against the copy. */
      rows: 6,

      /**
       * **The interval between entries, in seconds** — *"aproximadamente 200-300ms de intervalo entre
       * entradas, nao varios segundos"*, and 0.25 is the middle of that.
       *
       * **0.165, and the rows now overlap on purpose** — design owner, 21 September 2026: *"As
       * entradas devem sobrepor-se… NAO esperar que uma termine para comecar a seguinte… Quero que o
       * olho perceba: a lista esta a formar-se."*
       *
       * It was 0.25 against a 0.52s row, which left each line almost finished before the next began —
       * `pergunta 1 carregou / pergunta 2 carregou`. At 0.165 against 0.45s there are **between two
       * and three lines in flight at any moment**, so what the eye follows is the list forming rather
       * than six arrivals in a queue. The whole build is 1.38s where it was 2.12s.
       */
      stagger: 0.165,

      /**
       * **The breath, and where it falls.** One longer interval after the third row, so the six still
       * read as three and three without either half being a moment the scroll has to ask for.
       *
       * **0.11 now, not 0.35.** The brief authors the intervals directly — *"~150-180ms… ~250-300ms…
       * ~150-180ms"* — so the breath is only what lifts the middle gap above the others: 0.165 + 0.11
       * is 0.275s against 0.165 everywhere else. At 0.35 it was a 0.6s hole, which read as the
       * sequence stopping to load the second half.
       *
       *     0.000  0.165  0.330   · breath ·   0.605  0.770  0.935     complete at 1.385s
       */
      breath: 0.11,
      breathAfter: 3,

      /**
       * ── How a row is revealed ────────────────────────────────────────────────
       *
       * **The row is ruled first and written second**, which is how a page is set and is the same
       * grammar the Method uses one section earlier: the room lights, and then type resolves in it.
       * The ground arrives before the thing standing on it, so the reveal has a direction without
       * anything travelling.
       *
       *     0ms    the hairline begins to draw from the axis outward
       *     120ms  the question's ink begins, in the space the rule has just opened
       *     280ms  the rule is at full measure and full ink
       *     450ms  the row is finished and still
       *
       * **450ms is the brief's own** — *"Cada linha pode ter ~400-500ms de reveal"* — and against a
       * 0.165 interval it is what puts two to three lines in flight at once. It was 660ms, then 520;
       * the row is not the thing that shrank most, the waiting between rows is.
       *
       * **Why the rule and not the type carries the gesture.** The type cannot move: nothing may
       * travel, and tracking is ruled out both by the brief and by the Method's own measurement — an
       * animated `letter-spacing` contracted its statement 80px horizontally and read as the phrase
       * being moved into place. A rule has no such problem, because a rule *is* a length: drawing it
       * is the one thing in this composition that can be a gesture without being a movement.
       */
      rule: { over: 0.28, leads: 0.12 },

      /** Seconds the question's ink takes once it has begun, `rule.leads` after its row opens. */
      over: 0.33,
    },
  },

  grounds: {
    /*
      **The scrim crosses in the empty frame, never under type.**

      Three of the five crossings below flip the ink from dark to light or back, and a ground and its type
      cannot cross at the same time: light type over a ground going light passes through a frame measuring
      about 1.1:1, where nothing can be read. It is the identical failure `actStory.printing.clears` was
      built to avoid, and the answer is the same one — separate the two in time.

      **It was [0.04, 0.16] and that was wrong for the one junction it is visible on** — design owner,
      21 September 2026: *"Contact comeca a aparecer demasiado cedo, enquanto Questions ainda esta
      visualmente presente... Nao quero qualquer coexistencia prolongada das duas composicoes."*

      The old window rested on *"at a junction the outgoing section has already gone"*, which is true
      of every section that leaves before its junction and **false of Questions**: §7's persistent rule
      makes the list release *in place, during* 13 → 14 (`environment.persisting.releases`, 0.4 → 1.3
      of that table's 3.6, so 0.111 → 0.361 of the junction and ~0.42 with the stagger). The ground
      therefore finished crossing at 0.16 with the six questions still at about 86% ink — Contact's
      photograph standing under Questions' composition, which is exactly the coexistence reported.

      **This is the only junction where the window does anything.** `states` below carries veil 0 and
      ink 1.0 for states 9 through 13; the single crossing on the site is 13 → 14, 0 → 0.62. So moving
      it costs nothing anywhere else — checked state by state rather than assumed.

      **The two run on different progress variables, which is why the first correction missed.** The
      release is on the persist track (`persistTrack`, its own span in viewport-hundredths); this
      window is on `--junction-at`. Measured in Chrome at 1920 x 889, on the `--junction-at` scale the
      whole tail reads:

          0.78 -> 0.88   the list releases in place  (--jrel1 .. --jrel7)
          0.88 -> 0.95   the rule's ink crosses      (--jcross)
          ~0.98          Contact's headline is written
          1.00           state 14

      So [0.88, 0.97] is the only window that is after Questions and before Contact. It runs with
      `--jcross`, which is what §8 asks for — the ink crosses *with the ground, not on its own clock* —
      and it finishes in the empty frame before the headline.

      **And it is what gives the section its reading hold.** The sequence is complete at w 0.4 after
      the lock and the ground now waits until w 1.95: about 1,380px in which the composition stands
      finished and absolutely nothing changes. With the old window the ground began turning at w 0.85,
      which left 400px of stillness and then 934px of Contact's photograph under Questions' full
      composition — the *coexistencia prolongada* that was reported.
    */
    /*
      ⚠ **And 13 → 14 does not read this any more** — 22 September 2026. Everything argued above is
      the record of how the window got to [0.88, 0.97] and why it had to be after the release and
      before the headline; all of it is still true of the *order*. What changed is the unit.

      The plates now change places on §8's own sheet (`environment.persisting`), because the passage
      that hides the exchange — the light going down, the plates passing in the dark, the light
      coming back up — has to be one movement with them, and §8 is the only thing that describes
      this junction beat by beat. The scrim and the ink cross with the plates or the hero arrives
      wearing Questions' register, so `scroll-stage.tsx` crosses this pair on `leaving.cross` too.

      It is kept, at its measured value, because it is still the default for every other state in
      the table — all of which cross by zero, so it does nothing anywhere else, exactly as the note
      above says. Changing it is now a change to nothing; changing `persisting` is the lever.
    */
    cross: [0.88, 0.97],

    /*
      **`veil` is how much scrim, `ink` is which material it is made of** — 0 is the publication's paper
      under dark ink, 1 is the studio's own ink under light. One number chooses the register and the same
      number chooses the type, so the two can never disagree.

      A section paints this in the direction its own composition needs (`--ground-near` / `--ground-far`
      in `globals.css`): dense where the type is, gone where §2's plate is the material. That is why About
      can be an essay AND a photograph rather than an essay fogging one.
    */
    states: [
      /* state                      veil   ink   §2's plate                                     */
      { state: 9, veil: 0.0, ink: 1.0 } /*   venice 1.00 — the film's own last frame       */,
      /*
        **About stands on the photograph, not on paper** — design owner, 16 September 2026. It was
        `veil 1, ink 0`: a paper scrim beside the figure with dark ink on it, which read as a milky panel
        laid over the room and flipped to light ink at the state boundary with the text still on screen.
        The studio plate is a dark room lit by one lamp; the type is written onto its wall in the film's
        own light ink, so 09 → 10 changes nothing in the register at all and the Ledger keeps its ink.
      */
      { state: 10, veil: 0.0, ink: 1.0 } /*  studio 1.02 — the room, and the type on its wall */,
      /*
        **0.12 and 0.14, where these were 0.55 and 0.60 — design owner, 18 September 2026.**

        They were the larger half of what was hiding the Method's photograph. Decomposed off the real
        plate: after `brightness(0.12)` the picture still had a standard deviation of 3.17; `--mground`
        took it to 1.74 and this scrim took it to **0.79** — the two flat ink layers removed three
        quarters of what the exposure had left, and *raised* the mean from 4.6 to 15.2 while doing it.
        That is why it read as a flat grey wash rather than as a dark room: the veils were not darkening
        the photograph, they were replacing it with their own tone.

        A twelfth is still a scrim — it holds the register and keeps the ink consistent — and it leaves
        the photograph on screen. `implementation-reconciliation.md` C19.
      */
      /*
        **0 — the method paints no scrim.** Its room is `.env-room`, fixed in the Environment, because
        this scrim is drawn on `.method`'s own 6,500px box and slid 900px up the screen across the
        passage. The ink register is unchanged; only where it is painted moved.
      */
      { state: 11, veil: 0.0, ink: 1.0 } /*  studio .80 — the room, and the light in it       */,
      /*
        **Nothing crosses here any more, so there is no window to hold back.** State 12 carried
        `cross: [0.52, 0.78]` — its own late crossing, authored on 18 September so that the room would
        carry into Questions' entrance before the page turned. Questions *is* the room now, so 12 and 13
        are the same ground and the same ink, and a window over a crossing of zero is a number that
        cannot be read off the page.
      */
      { state: 12, veil: 0.0, ink: 1.0 } /*  studio .80 — the room, and the light in it      */,
      /*
        **Questions stands in the room** — design owner, 19 September 2026: *"Questions deve começar e
        continuar inicialmente sobre o mesmo method.png / mesmo ambiente da sala… Só quero abandonar
        essa atmosfera quando entrarmos em CONTACT."*
        §2's own column gives this state warm stone under dark ink, and that is the departure: it is
        recorded on the state itself (`spine.ts`, state 13) rather than twice. Here it means the veil
        and the ink simply do not move across 12 → 13 — the longest run of type on the site is written
        in the film's own light ink on the photograph the method resolved on.
      */
      { state: 13, veil: 0.0, ink: 1.0 } /*  the same room, and the same light in it         */,
      /*
        **And the change of environment is here**, which is the other half of the same instruction:
        `ABOUT → METHOD → QUESTIONS` is one room and `QUESTIONS → CONTACT` is the one place it is left.
        The scrim arrives with the hero plate underneath it; the room's own ink comes off on the same
        junction (`scroll-stage.tsx`, `--m-room-at`).
      */
      /*
        **Veil 0 from the fourth review, 26 September 2026.** 0.62 was the depth of Contact's own foot
        scrim, which is 0 now (`.closing`, `--ground-far`) — so the one thing it still did was lay
        Questions' section scrim over the arriving footage while the passage ran, seen in Chrome as the
        landscape arriving dull. The footage is clean from the first frame it is on screen.
      */
      { state: 14, veil: 0, ink: 1.0 } /* hero 1        — no veil, light ink                */,
    ],
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     HOW A PUBLICATION STATE ARRIVES — **FRACTIONS of that state's own junction, 0 → 1**

     States 10 to 14 had no entrance at all: the ground changed underneath them exactly as §2 and §3
     specify, and then the type was simply *there* at full opacity. That is what made the second half
     read as a stack of sections rather than as the same film continuing.

     **The grammar is §8's, generalised.** The spec writes Contact's arrival out beat by beat — *the
     environment lands and holds empty for 300ms · headline · then "Tell us about it." · then the rule
     shortens · then the section label, arrow and the three lines on a 120ms stagger* — and that order
     is not particular to Contact. It is the studio's way of writing a page: **the room first and empty,
     then the statement, then the line that answers it, then the details last.** Every publication state
     now arrives that way, so Contact is the pattern rather than the exception.

     **The type resolves rather than fades**, using the film's own three channels from junction 05 — the
     tracking opens and closes, the ink rises inside that movement and finishes before it, and a small
     settle lands last. A phrase is *found* rather than switched on, which is the one thing that makes
     the publication feel like the same piece of work as the film above it.

     Nothing here translates: §1's first law is release in place, and an entrance that slid would break
     the only rule the whole film keeps.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  arriving: {
    /** The room is held empty this far into the junction before anything is written on it. §8's 300ms. */
    empty: 0.18,

    /** The statement — the largest type in the state. */
    statement: [0.18, 0.54],

    /** The line that answers it. Opens inside the statement's window and closes after it. */
    support: [0.34, 0.7],

    /** Label, marks, rules and lists. Last, and the only part that carries a stagger. */
    detail: [0.52, 0.88],

    /** Between successive details — §8's 120ms, as a share of the junction. */
    stagger: 0.055,

    /** How far the tracking opens before it closes, in em, and the settle in px. */
    track: 0.055,
    rise: 6,
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     THE PUBLICATION · after the film — **MILLISECONDS**
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  publication: {
    /** The studio blocks arriving on an observer rather than on scroll. */
    studioBlocks: { fade: 1100, arrivesShortOf: 0.12, threshold: 0 },
    /** Interface response. */
    navHover: { fade: 240 },

    /**
     * **The rail's chapter exchange** — the Ledger's running header changing over.
     *
     * ## Why it holds a clock at all
     *
     * C8: *scroll owns progression; time owns only what the visitor did not cause.* Which chapter is
     * running **is** scroll — `spine.ts`'s `ledger.active`, a fact about where the film is. But the
     * exchange is a **substitution**, not a progression: at the state boundary one word stops being the
     * header and another starts, and there is no continuous quantity between `Work` and `About` for
     * scroll to drive. So this is `about`'s own shape, which CLAUDE.md already lists among the things
     * allowed a clock: **scroll starts it, time resolves it.**
     *
     * ## The numbers
     *
     * The design owner approved the transformation watched at **0.33× in the prototype review**, and
     * was explicit that 0.33 is not a duration: it is the authored Option A timing slowed to a third,
     * and the *feel* is what is approved — slow, precise, and long enough to see the rank change
     * happen rather than notice that it has.
     *
     * So these are Option A's authored 220 / 340 / 90 at that third. It reads as deliberate rather than
     * as lag because nobody is waiting on it: this fires from scrolling through the film, not from a
     * press, so the visitor is already moving and the rail resolves behind them. Every other interface
     * response on the site — `navHover` at 240, `answer` at 180 — is input-caused and stays quick.
     *
     * **If it ever feels long in use, halve `out` and `in` together and leave `lag` at a quarter of
     * `in`.** That ratio is the mechanism: the departing setting is most of the way gone before the
     * arriving one commits, which is what stops the two words being legible at once.
     */
    chapter: { out: 660, in: 1020, lag: 270 },

    /**
     * **The folio mark changing page** — the running chapter's line in the index, `NN ·`.
     *
     * Design owner, 28 September 2026, approved in `prototypes/the-folio-mark-motion` (3030): the index
     * is all five chapters on fixed lines, and the running one reads its folio and a point where its word
     * stands. The words keep `chapter`'s exchange exactly; the mark is not exchanged like a word, it is
     * re-set on another page:
     *
     *   leaving   the point lifts first (`pointOut`), the folio follows `outAfter` later (`out`)
     *   arriving  after `chapter.lag` the folio is set (`in`), and `pointAfter` later its point (`pointIn`)
     *
     * Both drift ≈3px in the direction of travel as they fade — the amplitude is composition and lives in
     * `globals.css` beside the exchange's scales. One curve, no spring, no scale. The arrival waits the
     * exchange's own lag, so the mark settles while the word it replaces is already on its way into the
     * head: one change, read in order.
     */
    mark: { out: 420, outAfter: 60, pointOut: 260, in: 760, pointAfter: 200, pointIn: 520 },
    /** About's arrival: the room, then the mark, then the words. */
    about: {
      image: { fade: 1500, settle: 14 },
      label: { afterImage: 500, fade: 800 },
      words: { afterLabel: 220, fade: 1000, step: 240 },
    },
    /** A question opening. */
    answer: { fade: 180 },
    /** The Work aside — visitor-caused, so it holds a clock. */
    work: { fetchedWithin: 1.5, arrives: 900 },
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     THE ENVIRONMENT · its own lifetime — **BEATS OF SCROLL**
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  environment: {
    /**
     * ── Junction 13 → 14 · §8's sheet, and the one change of environment in the second half ──────
     *
     * **Retimed on 22 September 2026, and lengthened from 3.60s to 6.10s.** Design owner: *"Rever
     * também a transição actual Questions → Contact. Quero que seja mais smooth, cinematográfica…
     * Não quero divisão vertical, rectângulos, hard cuts, duas imagens claramente empilhadas,
     * overlays pretos pesados, sensação de mudança de página."*
     *
     * ## What was wrong, measured in Chrome at 1440 × 905
     *
     * Two photographs were legible in one frame. The studio's lamp and its lit window stood inside
     * the hillside and the dawn sky at 0.34 of the crossing, with the window's bright column reading
     * as a vertical edge down the right of the composition — *exactly* the two faults reported. That
     * is what a plain dissolve does when the two plates are a dark interior lit by one lamp and an
     * open landscape under a rising sky: they share no value anywhere, so every intermediate frame
     * is a double exposure.
     *
     * It is the identical problem `TIMING.about.passage` solved for 10 → 11, and the answer is the
     * same one: **the light goes down, the plates change places in the dark, and the light comes back
     * up on the other one.** What it needed that it did not have is distance — the whole junction was
     * 72vh, of which the list's own release took a third and the exchange got about 120px.
     *
     * ## What the 6.10s bought on 22 September — superseded by the 24 September sheet below
     *
     *     0.00 – 0.40   nothing. §8's opening hold.
     *     0.40 – 1.58   the list releases in place, eight rows 40ms apart
     *     1.65 – 2.30   `dusk` — the room's light goes down over the plate that is leaving
     *     2.30 – 2.85   `crosses` — the plates change places, **inside the dark**
     *     2.30 – 3.05   the floor: nothing but a dark frame
     *     3.05 – 4.30   `dawn` — the light comes up on the hero, and it is the footage returning
     *     1.65 – 2.20   `resizes` — §8's one authored gesture, while the room's light is going down
     *     2.30 – 2.85   `retires` — the rule goes with the room, on the frames the plates cross
     *     4.75 – 5.10   the held-empty frame: the ground and the Ledger
     *     5.20          the statement
     *     5.45          the card
     *     5.94 – 6.10   the address, then the two other ways to reach it, 120ms apart
     *
     * **`dusk` and `dawn` are not a scrim.** They are the Environment's own exposure, which is what
     * *a change of light* is; a black sheet laid over the frame is the *overlay preto pesado* the
     * direction rules out, and it would flatten the photograph instead of darkening it. The floor is
     * `contact.passage.floor` and it is a real exposure with the sky still in it, not a blackout.
     *
     * **The sheet runs on the persist track and so does the exchange.** `environment.ts` used to
     * cross the plates on `grounds.cross`, which is a fraction of junction 13 → 14 on `p`, while the
     * room's ink came off on `crosses`, which is a fraction of *this* table — two parameterisations
     * of one movement, and the comments on both already said they should be one. They are one now:
     * the driver hands the Environment this track's own progress, and every part of the exchange —
     * the plates, the scrim, the ink over the outgoing plate and the light itself — reads it.
     *
     * The one thing that still cannot: **the persist track is longer than the junction's own tail.**
     * The track opens `--rule-y` above state 14 and state 14 is reached at about 0.48 of it, so the
     * second half of §8's sheet plays after the state has changed. That is correct rather than a
     * compromise — the state is *Contact*, and Contact writing itself is what the sheet describes.
     */
    /*
     * ── 24 September 2026 · Contact is the hero's frame returned, and it writes itself ────────────
     *
     * Design owner, direction B, *"Chapter One, outra vez"*: *"O scroll NÃO deve scrubbar a animação
     * interna do Contact. O scroll apenas controla a transição… TRIGGER → PLAY → HOLD."*
     *
     * So this sheet is **the passage and nothing after it**. It ends by *asking* (`asks`), and what the
     * question does after that is `TIMING.contact.composes`, on a clock.
     *
     * ## Second pass, the same day — one camera move, and one frame at the end of it
     *
     * Design owner, after watching the first pass: *"a transição parece uma sequência de crossfades em
     * vez de uma única decisão cinematográfica… o footage continua a mudar depois de a composição já ter
     * aparecido."* Both were true, and the second was the footage's own doing: the hero loop is 12.1s of
     * *landscape → the figure dissolving in → the figure → the landscape dissolving back*, so whatever
     * the page did the world kept changing shots behind the composition.
     *
     * So the passage is now **one forward camera move**: the studio is pushed toward its own window
     * while the lamp dies (`leaves`), the outside world dissolves in under the same push, and the push
     * carries on across the hillside until it lands on Contact's own framing (`returns`) — and stops.
     * The footage is taken into the figure's shot while it is still hidden and brought to rest at that
     * landing (`TIMING.contact.still`), so the frame Contact is written on is found once and held.
     *
     *     0.00 – 0.40   nothing. §8's opening hold.
     *     0.40 – 1.58   the list releases in place, eight rows 40ms apart
     *     1.50 – 2.30   `dusk` — the lamp's light goes down, never to black
     *     1.50 – 2.90   `leaves` — the camera pushes toward the room's window as it darkens
     *     1.60 – 2.20   `resizes` — alone in the darkening room, the rule finds Contact's measure
     *     2.30 – 2.90   `crosses` — the plates change places in the soft floor, under the rule
     *     2.30 – 4.50   `returns` — the same push, on the hillside, landing on Contact's framing
     *     3.00 – 4.50   `dawn` — the light comes up on the footage the site opened on
     *     4.60 – 5.50   the held-empty frame: the footage comes to rest, one rule, the Ledger
     *     5.50          `asks` — once the footage is still, Contact is written on it, on its clock
     *
     * **The rule survives the whole passage, which is §7 restored rather than departed from.** The one
     * object that crosses from the studio into the open is Questions' closing rule, never re-created,
     * and the line the visitor is left to write on.
     */
    /*
     * ── 26 September 2026 · the rule is Questions' again, and the passage is one breath ───────────
     *
     * Design owner: *"Atualmente existe uma animação envolvendo a última linha no fundo de Questions.
     * Essa animação já não faz sentido para o novo conceito… Questions termina → pequeno hold/silêncio
     * → o conteúdo de Questions desaparece naturalmente → o mesmo mundo visual continua → Contact
     * emerge."* So `resizes` is gone: the closing rule releases in place with the rows it closes (the
     * eighth span of the fan was always its), and Contact draws its own line under its own sentence.
     *
     *     0.00 – 0.80   nothing — Questions has ended and the frame is allowed to stand
     *     0.80 – 1.98   the list and its rule let go in place
     *     1.90 – 2.70   `dusk` — the lamp goes down, to a softer floor than before
     *     1.90 – 3.30   `leaves` — a small push toward the window, half of what it was
     *     2.70 – 3.30   `crosses` — the plates change places inside that floor
     *     2.70 – 4.80   `returns` — the same small push, landing on Contact's framing
     *     3.30 – 4.80   `dawn` — the footage the site opened on, at its own speed
     *     4.80 – 5.20   the frame stands — no longer waiting for the footage to stop
     *     5.20          `asks`
     */
    /*
     * ── 26 September 2026, second pass · the list dissolves, and the film changes state ──────────
     *
     * Design owner, after seeing the first pass: *"as Questions desaparecem demasiado como um único
     * bloco… o anchor/pergunta principal desaparece primeiro; depois os elementos dissolvem-se em
     * pequenos grupos… as linhas/estrutura desaparecem naturalmente… usa o próprio movimento do vídeo…
     * o mesmo espaço/filme mudou de estado"*, and *"o tratamento atual cria uma espécie de filtro
     * cinzento/escuro… Não gosto desse efeito."*
     *
     *     0.00 – 0.60   Questions has ended; nothing moves
     *     0.60 – 1.10   the anchor — the question the section opened on — goes first
     *     0.85 – 1.67   the six rows, in three pairs: the words first, each row's hairline a beat after
     *     1.80 – 2.50   `dusk` — a breath of light, never a grey floor (`contact.passage`)
     *     1.80 – 3.30   `leaves` — the room drifts toward its window
     *     2.50 – 3.50   `crosses` — the window's world comes through: the footage, from its first shot
     *     3.50 – 4.40   `dawn` — the light is back, and the footage is already moving on its own
     *     4.40 – 4.80   the frame stands
     *     4.80          `asks` — and the footage's own dissolve brings the figure in as Contact writes
     */
    /*
     * ── Fourth review, 26 September 2026 · the sheet is played, and the order is the argument ─────
     *
     * *"Não consigo perceber claramente uma nova animação de saída das Questions… detalhe → estrutura →
     * pergunta → silêncio → Contact, e não Questions → fade all → Contact."* Seen in the recordings:
     * whatever this sheet said, a wheel carried the hand through it in a second and the eye saw one
     * fade. So **the scroll now only starts it** (`starts`, a fraction of the junction's scroll) and the
     * sheet plays in real seconds — the closing frame is held to the end of the document, so nothing
     * on the page moves while it does. Back above the junction it rewinds over `rewinds`.
     *
     *     0.00 – 0.30   Questions has ended; nothing moves
     *     0.30 – 2.05   detail — the rows' words leave in pairs from the bottom up, with the anchor's
     *                   answer; each row's hairline half a second after its words (structure)
     *     2.05 – 3.30   *What do you actually create?* stands alone
     *     3.30 – 4.20   and goes
     *     4.20 – 4.70   silence — the room, no type
     *     4.40 – 5.00   the room's veil lifts (`dusk`, which is no longer a darkening)
     *     5.00 – 6.20   `crosses` — the footage comes in through the room, moving
     *     6.80 – 7.30   the frame stands; `asks` — Contact writes itself while the footage's own
     *                   dissolve brings the figure in
     */
    persisting: {
      /**
       * **Where the passage is started: this many viewports before the closing frame locks** — while
       * the list is still standing under the head margin, at the start of the extra stretch
       * `distance.asked` gives it, so the list lets go in place rather than on its way off the top.
       */
      startsBefore: 0.62,
      /** Back above the junction, the whole passage runs backwards over this. Seconds. */
      rewinds: 1.6,
      holds: 0.3,
      /**
       * **The list letting go**, played on its own clock from `asks` (a second of the sheet). Clock
       * seconds inside. Back above it the list returns at once over `clock.returns`. The breath
       * (`dusk`) clears anything still standing, so nothing of the list can meet the crossing.
       */
      releases: {
        asks: 0.3,
        clock: {
          /**
           * The six rows' words, in pairs from the bottom up: `stagger` inside a pair, `groupGap`
           * between pairs — detail leaving in three visible steps.
           */
          rows: { at: 0, over: 0.7, per: 2, stagger: 0.15, groupGap: 0.45 },
          /** The anchor's answer is detail too, and goes with the first pair. */
          body: { at: 0.2, over: 0.8 },
          /** Each row's hairline outlives its words by this much: the structure goes second. */
          ruleLags: 0.55,
          /** *What do you actually create?* — the last thing standing, alone, and then gone. */
          question: { at: 3.0, over: 0.9 },
          /** Coming back up into Questions: the list returns at once, over this. */
          returns: 0.5,
        },
      },
      /** A breath of the room's light, once the list has let go. */
      dusk: { at: 4.4, over: 0.6 },
      /**
       * **The camera drifting toward the room's window.** It opens with the breath and closes with the
       * crossing, so the studio is being walked out of for exactly as long as it is on screen.
       * `contact.passage.leaves` is how far.
       */
      leaves: { at: 4.4, over: 1.6 },
      /**
       * **The exchange, longer than it was and in near-full light.** The footage is taken to its first
       * shot the instant this opens (`contact.arrives`), so what comes through the room is the moving
       * sky and the ridges — the film's own weather — rather than a still being laid over a still.
       * `timeline.ts` asserts it stays between the breath's two halves.
       */
      crosses: { at: 5.0, over: 1.2 },
      /** The light coming back up, on the footage the site opened on. */
      dawn: { at: 6.2, over: 0.6 },
      /**
       * **The same push, continued on the hillside, and it lands on Contact's framing.** The world
       * arrives a little wider than Contact holds it — `contact.passage.returns` — and the camera goes
       * on moving forward, in the direction it was already moving through the room, until it is
       * exactly the found frame. It opens on the frame the plate becomes present and stops before the
       * frame stands empty: the composition is written on a frame that has landed.
       */
      returns: { at: 5.0, over: 1.8 },
      /**
       * §8's held-empty frame. Shorter than it was: it no longer waits for the footage to come to
       * rest, because the footage no longer does. `timeline.ts` asserts nothing the scroll drives is
       * scheduled inside it.
       */
      empty: { at: 6.8, over: 0.5 },
      /** Where Contact is asked to write itself, on the played sheet. */
      asks: 7.3,
      total: 7.4,
    },
    /** The Ledger relighting. */
    relighting: {
      warms: { at: 0.6, over: 1.4 },
      blues: { at: 2.0, over: 1.2 },
      lights: { at: 3.2, over: 1.4 },
      settles: { at: 4.6, over: 0.8 },
      total: 5.4,
    },
  },


  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     CONTACT · state 14 — **the change of environment into it**

     One block, because Contact is one composition. The frame's own order is §8's sheet
     (`environment.persisting`) and its arrival is §arriving's shared windows; neither is repeated
     here. What is here is the *passage* — how dark the frame gets while the two plates pass each
     other, which is a property of those two photographs and of nothing else on the site.

     **There is no second scene and there is no `talk` block any more** — design owner, 22 September
     2026: *"Quero que o Contact seja UMA ÚNICA PÁGINA / UMA ÚNICA COMPOSIÇÃO CONTÍNUA… Neste
     momento Contact parece dividido em dois ecrãs/páginas diferentes."* The form, its runway
     (`distance.talk`), its settle and its hand-over went with it. What it was carrying — the
     address, the number and the two marks — is written under the rule in this frame instead, and
     arrives on the staggered slots §8 already gives the things that settle last.
     ────────────────────────────────────────────────────────────────────────────────────── */
  contact: {
    /**
     * ── The change of environment, and it is a change of light ────────────────────────────────
     *
     * **Where the two plates pass each other**, as `TIMING.about.passage` is for 10 → 11. The
     * windows are not here: they are `persisting.dusk`, `persisting.crosses` and `persisting.dawn`,
     * because a junction's order belongs in the junction's own sheet. What is here is *how far
     * down* the light goes and *how much definition* the frame loses on the way, which is a
     * property of these two photographs rather than of the sequence.
     */
    passage: {
      /**
       * **What is left of the light at the bottom, as a multiplier on §2's own exposure.**
       *
       * The frame at state 13 is the studio at .86 and at state 14 the hillside at .72, and they
       * share no value: the studio is one lamp and a lit window in a dark room, the hero is an open
       * landscape under a rising sky. Decomposed off the two plates, a plain dissolve keeps both
       * sets of highlights legible down to about a fifth of the light; below that the lamp and the
       * window stop being findable and what is left is a dark frame with a little sky in it.
       *
       * **0.30 now, where it was 0.16** — 24 September 2026: *"Não quero simplesmente: Questions
       * desaparece → preto → Contact aparece."* At 0.16 the floor read as black in Chrome at 1920 ×
       * 889; at 0.30 the room is still a room when the lamp goes down and the hillside is already a
       * sky when it comes up. What keeps the two plates from reading as one double exposure is the
       * contrast (`softens`) and the one line that crosses unchanged in front of both — seen frame by
       * frame, the lamp gives way to the figure rather than being laid over her.
       */
      /*
       * **0.42 from 26 September 2026** — *"Evitar… black screens… overlays pretos pesados… A
       * transição deve parecer mais uma mudança de respiração/luz"*. Raised with the contrast still
       * taken down, so the exchange stays hidden in the soft floor rather than in the dark.
       */
      /*
       * **0.8 from the second pass, 26 September 2026** — *"o tratamento atual cria uma espécie de
       * filtro cinzento/escuro perceptível durante a passagem… Não gosto desse efeito."* The grey was
       * this floor under `softens`: light taken down and contrast taken out together is exactly what a
       * grey veil looks like. What is left is a breath — a fifth of the light, contrast untouched.
       */
      /*
       * **1 from the third review** — *"Primeiro testa sem overlay global… Não quero que o vídeo
       * pareça artificialmente escurecido ou dessaturado."* No dip at all: the plates carry their own
       * exposure across the crossing, and the room's veil is gone before it (`scroll-stage.tsx`).
       */
      floor: 1,
      /**
       * And the definition, for the reason `about.passage.softens` gives: at the floor the two
       * plates still differ most in their *edges* — the window frame, the lamp's cone, the ridge
       * line — and taking the contrast down is what stops those reading as a second picture behind
       * the first.
       */
      /* 1 — no longer softened. See `floor`: taking the contrast out is what read as a grey filter. */
      softens: 1,
      /**
       * **How far the camera pushes into the studio as it leaves it**, as a scale on the method plate
       * about its window (`persisting.leaves`). The room is walked toward its one source of outside
       * light while that light is all that is left of it.
       */
      /* Halved on 26 September 2026 — *"evitar grandes movimentos"*. A drift, not a push. */
      leaves: 0.05,
      /**
       * **How much wider than Contact's framing the hillside arrives**, as a fraction of that framing.
       * `persisting.returns` closes it to 0, so the push that began in the room carries on across the
       * hillside and lands on the found frame. Small on purpose: at this much the move reads as the
       * same walk continuing, not as a zoom.
       */
      returns: 0.04,
    },

    /**
     * ── The footage keeps its own time · C22's found frame is retired ─────────────────────────────
     *
     * Design owner, 26 September 2026: *"No estado normal/repousado do Contact, o vídeo deve correr à
     * velocidade normal/nativa. Não deve começar lento nem pausado. Só o hover sobre 'Tell us where it
     * begins.' pode iniciar a desaceleração do vídeo."* So there is no seek, no slow motion through the
     * passage and no stop: the footage the site opened on arrives at its own speed and stays there
     * until a hand asks it to slow (`listens`). §11.1's *"an environment paused"* is honoured again at
     * rest; the only time the world loses speed is when the visitor causes it — which is the one kind
     * of clock C8 allows.
     */

    /**
     * ── Contact writing itself · TRIGGER → PLAY → HOLD ───────────────────────────────────────────
     *
     * Scroll decides only the frame the composition begins on (`persisting.asks`); everything below is
     * seconds from that frame, played by the driver's `play()` and held. Same verb for every part: the
     * ink rises inside a tracking that closes.
     *
     * **26 September 2026 — the composition is two corners of one frame.** Lower left, the question and
     * the one line that answers it; upper left, on the same axis, the studio's contacts as a small
     * editorial note. `YOUR CHAPTER` is removed. The note arrives last and quietest, so the question is
     * read first and the contacts are found rather than announced.
     *
     *     0.00 – 1.70   the question's first line
     *     0.28 – 1.98   its second line
     *     1.20 – 2.60   Tell us where it begins. — and its line, drawn from the axis
     *     2.00 – 3.60   the contacts, upper left — and then only the sentence breathes
     */
    composes: {
      /** Each part's own arrival: when, after the trigger, and over how long. Seconds. */
      question: { at: 0, over: 1.7, lineLeads: 0.28 },
      begins: { at: 1.2, over: 1.4 },
      note: { at: 2.0, over: 1.6 },
      /**
       * **Letting go, and it is not the arrival played backwards.** When the hand goes back past the
       * start of the empty frame (`persisting.empty`, so the light is about to go down again), the
       * whole composition releases at once over this, and the passage is the scroll's again.
       * Coming back down plays the arrival from the start.
       */
      releases: 0.5,
      /**
       * The same letting go when it is caused by the closing frame unlocking on the way back up — QA,
       * 26 September 2026. The composition is then being carried down the screen, so it goes in half
       * the time rather than being seen travelling.
       */
      unlocks: 0.25,
    },

    /**
     * ── The sentence at rest · it breathes, the line does not ────────────────────────────────────
     *
     * *"É o TEXTO que respira em repouso. A linha NÃO respira… muito lenta, aproximadamente 4–6
     * segundos por ciclo."* One cycle, in ms. Tracking and a little ink only — nothing that scales
     * from a centre, so the left axis the whole composition stands on never moves.
     */
    breathes: 5400,

    /**
     * ── The footage arriving · the film's own dissolve is the last step of the passage ─────────
     *
     * *"Usa o próprio movimento/transformação do vídeo como parte da transição."* The hero loop opens on
     * the cold ridges under moving cloud and brings the figure in by its own dissolve at about 2.0 –
     * 3.0s of the file. So the footage is taken to `seekTo` at the one instant it is still invisible —
     * the frame `persisting.crosses` opens — and from then on runs at its own speed: the moving sky is
     * what comes through the room, and the figure dissolves in while Contact is being written.
     *
     * Not a hold and not a rate: a cue on the file, which is why it is seconds of the file.
     */
    arrives: { seekTo: 0.3 },

    /**
     * ── We're listening · the hand slows the world ─────────────────────────────────────────────
     *
     * **TRIGGER → SLOW PLAY → HOLD, and the trigger is a hand, not the scroll.** Pointer over *Tell us
     * where it begins.* (or focus) runs one value, `--listen`, 0 → 1 on a clock; everything the
     * direction lists reads it — the sentence opening and becoming *We're listening.*, the line
     * growing to the question's measure, the footage losing speed, the light turning very slightly,
     * the contacts gaining presence. Leaving runs it back from wherever it is, never from the end.
     * A press holds it at 1: the answer has been given, and the contacts are the ways to write.
     *
     * Input-caused, so a clock is what C8 reserves for it. Seconds.
     */
    listens: {
      /**
       * Rest → listening. Long enough that the slowing is watched, not noticed afterwards — 2.8 from
       * the fourth review, so the line's growth and the frame arriving read as slow, not as a switch.
       */
      opens: 2.8,
      /** Listening → rest when the hand leaves. Soft, never a reset. */
      closes: 1.9,
      /**
       * **The frame the world comes to rest on**, seconds of the hero file — fourth review, 26 September
       * 2026: *"escolhe um frame… visualmente forte — preferencialmente um momento em que a figura esteja
       * bem composta contra o sol."* Chosen in Chrome at 1920 × 889 against 5.3, 6.2, 7.2 and 8.3: at 4.4
       * she is in profile beside the sun, hair lifted, the silhouette whole and clean, and the dress
       * nowhere near the question. The later poses fold in on themselves or flare toward the type.
       */
      holdAt: 4.4,
      /**
       * **The slowest the footage runs before it stops**, as a playback rate — and then it stops.
       *
       * Second pass, 26 September 2026: *"O comportamento atual de 1.0 → 0.07 não funciona… parece que
       * está a saltar frames/lag."* It was: the source is a 30fps file, and at 0.07 Chrome shows a new
       * frame every half second — slow motion becomes stepping. Below about a third, every rate reads
       * as a fault rather than as time slowing. So the rate falls 1 → 0.3 on the curve and the footage
       * is paused there, on a whole frame: NORMAL → slowing → slow → STILL. Leaving plays it at 0.3 and
       * brings it back up the same curve.
       */
      slowest: 0.3,
      /** How far into the gesture (on `--listen`) the rate reaches `slowest`; the rest runs slow. */
      slowAt: 0.8,
      /**
       * Updates to the rate are made in steps of this, not every frame. Each change re-times Chrome's
       * media clock; forty a second is enough on its own to make the footage hitch.
       */
      rateStep: 0.05,
    },

  },
  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     DISTANCE · **HOW FAR THE HAND TRAVELS.** vh, and beat counts.

     **This is the length dial for the whole site, and it retimes nothing.** Every proportion above
     is preserved; only how much scrolling it takes changes. `fine` is a mouse wheel, `coarse` is a
     thumb — a flick carries far more momentum than a notch, so touch gets a longer runway for the
     identical choreography.

     The `*Beats` numbers are ceilings that `timeline.ts` asserts against: raising one retimes
     nothing either, it just makes each beat cheaper, because the beats share a fixed runway.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  distance: {
    /**
     * Chapter I → II.
     *
     * **3.75x its former 446vh, and that is the approved B14 pacing arriving in the film.** Junction
     * 05 → 06 measured 1020px (10.2 wheel notches) at 446vh against the prototype's 3823px (38.2), so
     * the holds were there in shape but had no distance to happen over. This is the only lever that
     * gives them distance, and it **retimes nothing** — every proportion above is untouched.
     *
     * All three runways are scaled by the same factor on purpose. A beat of the film and a beat of
     * the act are deliberately the same weight in the hand (55vh each before, 205vh each now) and a
     * beat of the method deliberately less (40 → 150). Scaling one alone would break that parity.
     *
     * **This is the number to dial if the site is too long.** Halving all three halves the site and
     * keeps every proportion.
     */
    shot: { fine: '1672vh', coarse: '2508vh' },
    /**
     * The shot's last cue resolves at 9.36 beats, so the pinned frame has to be at least that long or
     * its tail is a beat nobody sees (`timeline.ts`, 'The shot no longer fits'). Raised from 8.14 to
     * the smallest value that clears it, plus the 0.04 the sibling assertions carry as margin.
     * **This retimes nothing** — every proportion above is a relationship, and `distance.shot` alone
     * decides how far the hand travels.
     */
    shotBeats: 9.4,

    /** Chapter III's act. Priced so a beat weighs the same in the hand as a beat of the film. */
    act: { fine: '660vh', coarse: '990vh' },
    actBeats: 3.2,

    /**
     * The method. A beat costs less here on purpose — the publication is not cinema.
     *
     * **540 where it was 750, and the price of a beat is untouched at 150vh.** The two numbers move
     * together or the whole section is retimed: `perMethodBeat` is `method / methodBeats`, and it is
     * 1.5 viewports either way. What came off is the distance the section no longer spends — the field
     * arrives in three bursts rather than seven separate starts (`method.composed`), and the
     * convergence that used to run for half a beat is gone with it, so the choreography resolves at
     * 3.34 beats where it resolved at 4.75.
     *
     * Leaving 750 here would have bought the same section 1.4 beats — about two viewports — of held
     * frame with nothing scheduled in it, which is the dead scroll the brief is complaining about,
     * moved to the end.
     */
    method: { fine: '540vh', coarse: '810vh' },
    methodBeats: 3.6,

    /**
     * **About's runway, which is the whole of junction 10 → 11** — and therefore the length of the
     * passage from the room with somebody in it to the room without.
     *
     * It was `height: 82vh` in `globals.css`, which is a scroll distance written into a stylesheet and
     * the one thing `docs/development/03-choreography.md` does not allow. Measured at 1440 × 749 it
     * bought the junction **840px — about 1.1 viewports** for four movements, which is nine wheel
     * notches for the whole passage: the light went down and came back up inside a single flick.
     *
     * 175vh gives about 1,530px, a little over two viewports, so each movement of `about.passage` has
     * 300 to 430px of its own. **It retimes nothing** — every number in `about` is a fraction of this
     * junction, so the proportions are untouched and only the distance they are spent over changes.
     *
     * About's own composition is unaffected: `.about-stage` is fixed in the viewport and arrives on
     * junction 09 → 10, which this does not touch.
     *
     * The 1.5 ratio for a thumb is the one the three runways above already share.
     */
    about: { fine: '175vh', coarse: '262vh' },

    /**
     * **Questions' reading zone** — design owner, 20 September 2026: *"Depois de todas as perguntas
     * estarem completamente carregadas, NÃO quero que o scroll avance imediatamente para Contact…
     * Quero uma pausa suficientemente longa para a composição ser apreciada, não apenas alguns pixels."*
     *
     * It is not a runway and nothing is held in a frame across it: it is plain scroll space at the foot
     * of the section, which is the whole mechanism. `.closing-frame` follows Questions in ordinary flow,
     * so this pushes the junction that releases the rows away from the moment they finish arriving —
     * and until that junction begins, `--jrel1` … `--jrel7` are 1 by construction. Nothing animates, so
     * stopping anywhere in here leaves the composition exactly as it is.
     *
     * **Measured, the hold was about 250px.** The seven rows were complete 100px above the section's
     * top and `--jrel1` had already begun to fall 150px below it; the composition was gone by +400. It
     * arrived and then immediately dissolved, which is the fault this closes.
     *
     * 150vh is 1.5 viewports, which at 1920 × 889 takes the release from +150 to about +1,480 and
     * leaves roughly 1,300px in which nothing at all changes. 1.5× on a thumb, as every other distance
     * here is.
     */
    /*
     * **+50vh from the fourth review, 26 September 2026.** The passage 13 → 14 now starts while the
     * list is still standing (`persisting.startsBefore`), and this is the stretch it stands through:
     * seen in Chrome, the list unstuck ~150px before the closing frame locked, so by the time the
     * passage began *What do you actually create?* had already left the top of the screen — and it is
     * meant to be the last thing standing.
     */
    asked: { fine: '200vh', coarse: '300vh' },

    /**
     * **How far Questions stands inside the Method's trailing frame** — design owner, 21 September
     * 2026, reporting the same fault for the third time: *"o ecra passa muito tempo em scroll vazio
     * sem nada ate chegar ao Questions."*
     *
     * ── What the distance is made of, measured in Chrome at 1920 x 889 ───────────────────────
     *
     *     28,278   the Method's last ink is gone, its frame still held at y 99
     *     28,366   the pin runs out and the empty frame starts travelling
     *     29,247   `.method`'s box ends
     *     29,286   Questions' list reaches the head margin and the anchor may begin
     *              ─────  1,008px, of which 889 is the frame's own height plus the head margin
     *
     * **That 889 is structural and no timing can reach it.** `.method-stage` is sticky inside
     * `.method`, so a sticky element's range is its parent's content less its own height: the last
     * frame-height of the box is the held frame scrolling out, and it cannot be removed without
     * taking the same distance out of the runway. Two whole rounds were spent trying to close it from
     * the timings — moving the clearing into that stretch only made the composition *drag* out of
     * frame, which is the fault the design owner rejected next (`method.gathered.holds`).
     *
     * **So the overlap is the answer, and it is honest rather than a trick.** Nothing is drawn in
     * that stretch: `.env-room` is fixed, the rail is fixed, and the only thing moving is an empty
     * stage. Questions standing in it changes nothing about what the Method does — the Method still
     * clears entirely in place, at y 99, with its frame held — and lets the list reach its lock while
     * the empty frame slides away behind it.
     *
     * 70vh is 622px at this frame, which leaves **~386px** between the Method's last ink and the
     * anchor's first: a breath, which is what the passage wanted, instead of a viewport of nothing.
     *
     * **It is one number in viewport heights and not a fine/coarse pair**, because what it has to
     * cover is one frame height plus one head margin — a layout distance, the same on a wheel and a
     * thumb, for the reason `methodArrival` is. `--method-pin` being half as long again on touch does
     * not make the trailing frame any taller.
     */
    askedLead: '70vh',

    /**
     * **The settle at the end of junction 13 → 14**, and it was `--closing-settle: 24vh` in
     * `globals.css` — a scroll distance written into a stylesheet, which is the one thing
     * `docs/development/03-choreography.md` does not allow. Moved here unchanged in value and
     * published as the same property, so nothing about the composition moved with it.
     *
     * What it is: the junction finishes with Contact composed and the rule on its writing line, and
     * ending the document there would mean the visitor arrives at the composition and the page stops
     * in the same frame. The frame stays stuck for this much longer — long enough to read four lines,
     * short enough that it never reads as empty scroll — and *then* the second composition begins.
     *
     * It is a plain number of viewport-hundredths rather than a fine/coarse pair: the driver needs it
     * to know where the second composition's own distance opens, and a reading pause is the same
     * pause on a wheel and a thumb.
     */
    closingSettle: 24,

    /** How V2's quoted seconds become distance, for the junctions that carry a weight. */
    secondsToVh: 20,
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     INPUT · the spring between the wheel and the film — **px and rad/s**

     A wheel notch moves the page 100px in a single frame. This smooths that into a continuous
     movement without adding lag you can feel.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  input: {
    /** **The whole feel of the wheel.** Higher is tighter and faster, lower is calmer and longer. */
    omega: 16,
    /** How much lag doubles `omega`, in px, and the ceiling — so a fast spin is answered firmly. */
    stiffenAt: 700,
    stiffenMax: 1.6,
    /** Above this many px it snaps instead: a scrollbar click or Home/End is not a wheel gesture. */
    snapAbove: 1200,
    /** When it is this close and this slow, it converges exactly and stops. */
    settleWithin: 0.05,
    settleBelow: 0.5,
  },

  /* ─────────────────────────────────────────────────────────────────────────────────────────────
     PACE · haste and reduced motion — **multipliers and ms**

     Only Chapter I. Scrolling during the opening hurries it; it can never skip it.
     ───────────────────────────────────────────────────────────────────────────────────────────── */
  pace: {
    /** How much faster the opening runs once the visitor asks. Every beat still happens, in order. */
    haste: 1.55,
    /** The ceiling, for someone scrolling hard, and how fast they must scroll to reach it. */
    urgent: 3,
    urgentAt: 3,
    /** How much of the previous frame's speed is kept — higher is smoother, slower to react. */
    settle: 0.85,
    /** The clock for somebody who asked for less motion. */
    reduced: 0.45,
    /** The most real time one frame may contribute, so a stall pauses rather than fast-forwards. */
    maxStep: 50,
  },
} as const
