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
    /** The camera. Never eased, and it must not run past the convergence. */
    drift: { holdsPastTheGathering: 0 },
    gathered: { holds: 0.28 },
    /** Twelve considerations collapsing into the point the questions stood on. */
    converge: { fade: 0.46 },
    resolve: { whenConvergedIs: 0.6, fade: 0.26, holds: 0.3 },
    /** Three stages, and they must not overlap or the answer cannot be read. */
    printing: {
      clears: 0.22,
      thenWaits: 0.04,
      returns: 0.4,
      whenReturnedIs: 0.62,
      printFade: 0.26,
      linesAfter: 0.1,
      linesFade: 0.22,
    },
    /** The approach, in viewport heights rather than beats — it is a layout distance. */
    arrival: { begins: 0.86, settles: 0.05 },
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
     * **About released in place**, early in 10 → 11 — the type leaves the wall before the method's room
     * goes dark around it (`method.arrival`), so the lamp goes out on an empty room.
     */
    release: [0.04, 0.3],

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
  grounds: {
    /*
      **The scrim crosses in the empty frame, never under type.**

      Three of the five crossings below flip the ink from dark to light or back, and a ground and its type
      cannot cross at the same time: light type over a ground going light passes through a frame measuring
      about 1.1:1, where nothing can be read. It is the identical failure `actStory.printing.clears` was
      built to avoid, and the answer is the same one — separate the two in time.

      Here that is free, because at a junction the outgoing section has already gone and the incoming one
      has not arrived: `arriving.empty` holds the frame empty until 0.18. So the whole cross is spent
      inside [0.04, 0.16] — begun after the junction has visibly started, finished before the first line
      of the next section appears. Nothing is ever on screen while the ground is mid-cross.
    */
    cross: [0.04, 0.16],

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
      { state: 11, veil: 0.55, ink: 1.0 } /* studio .12  — the method's own dark room       */,
      { state: 12, veil: 0.6, ink: 1.0 } /*   studio .20 — the payoff, still in the room     */,
      { state: 13, veil: 1.0, ink: 0.0 } /*  warm stone  — §2's ground 160–171, dark ink     */,
      { state: 14, veil: 0.62, ink: 1.0 } /* hero .72     — the dawn threshold, light ink    */,
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
    /** The plate persisting through the film. */
    persisting: {
      holds: 0.4,
      releases: { at: 0.4, over: 0.9, stagger: 0.04 },
      crosses: { at: 1.3, over: 0.9 },
      empty: { at: 2.2, over: 0.3 },
      headline: 2.6,
      tells: 2.8,
      arrives: 0.2,
      resizes: { at: 2.9, over: 0.3 },
      resolves: { at: 3.2, over: 0.04, stagger: 0.12, count: 4 },
      total: 3.6,
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

    /** The method. A beat costs less here on purpose — the publication is not cinema. */
    method: { fine: '750vh', coarse: '1125vh' },
    methodBeats: 5.0,

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
