/**
 * The storyboard. **This is the file you edit.**
 *
 * Read it top to bottom and you have the pacing of the homepage, without doing any arithmetic.
 * Every beat either **anchors** itself to the clock, or states its **relationship** to the beat
 * before it. Nothing states an absolute time it could have derived, and nothing repeats a number
 * another beat already knows.
 *
 * ## Anchors and relationships
 *
 * **Anchors** are absolute. They are the handful of moments that are what they are because somebody
 * decided so, and that nothing else determines: when the timestamp appears, when the light starts
 * arriving, when the identity lands, where the chapter marker sits, where the shot begins.
 *
 * **Relationships** are offsets — `after`, `afterChapterOne`, `hold`, `bridge`. They say what a beat
 * does *relative to the one before it*, which is how the pacing was actually composed and how it is
 * actually judged: `01-validation.md` asks whether a pause holds or drags, and a pause is a gap
 * between two things, not a coordinate.
 *
 * `timeline.ts` resolves this into the absolute values the sequencer and the driver need. **You never
 * edit an absolute you could have expressed as a relationship**, and you never have to recompute one
 * when something upstream moves.
 *
 * The payoff is a ripple edit. Give "A wedding." a longer hold and everything after it shifts to make
 * room, with every gap you composed preserved — which is what a film editor means by an edit.
 *
 * ## The two units
 *
 *   Chapter I               milliseconds. Its own clock, which the visitor can accelerate.
 *   Everything after it     beats of scroll. No clock at all — a pure function of position, so it
 *                           runs backwards exactly as it runs forwards.
 *
 * A number must never move between them. `1600` in Chapter I has nothing to do with `1.6` below it.
 *
 * ## The shapes
 *
 *   { at, fade, hold }              anchored: arrives at `at`, sits for `hold`, leaves
 *   { after, fade, hold }           chained: arrives `after` the previous beat has gone
 *   { at | after, fade }            a ramp — moves one way across `fade` and stays there
 *
 * `hold` and `after` are the two numbers to reach for. Every fade in Chapter II's cadence is the same
 * length on purpose — the motion vocabulary is meant to be identical across the four occasions — so
 * the rhythm lives entirely in how long each thing sits, and how long the silence after it lasts.
 */

/**
 * Chapter I's beats, in the order they happen.
 *
 * Compared as numbers by the sequencer, which only ever raises the value — so a beat cannot be
 * skipped and cannot arrive out of turn.
 */
export const beat = {
  BLACK: 0,
  TIMESTAMP: 1,
  LIGHT: 2,
  TIMESTAMP_OUT: 3,
  MOTION: 4,
  IDENTITY: 5,
  LINE: 6,
  INTERFACE: 7,
} as const

export type Beat = (typeof beat)[keyof typeof beat]

/* ══════════════════════════ Chapter I · milliseconds ══════════════════════════
   The shape of the front of the sequence, in the order it happens. Each line is what the beat
   below says in code:

     400   the timestamp arrives
     1600  light begins arriving, and keeps arriving until 4800
     2100  the footage rolls — 500ms after the light, so the image is alive as it is lit
     2100  the timestamp has held long enough and begins leaving
     3100  it is gone, and the identity arrives in the same instant, with no pause between them
     4700  the identity settles
     4900  the subtitle is allowed to arrive — if the footage agrees

   The footage was measured rather than guessed, and this is built around what it actually is:
   2880 × 1440, a 2:1 frame, 12.121s long, and palindromic. A landscape to 2.0s, a dissolve up
   finishing at 2.4s, the brighter shot to 9.8s, then a dissolve back to the landscape.
   ════════════════════════════════════════════════════════════════════════════ */

export const chapterOneStory = {
  /**
   * ⚓ The arrival time, and "where you are" beneath it. Dead centre, which is free only because it
   * lives while the room is still dark. It arrives first, leaves once, and never returns.
   *
   * `hold` is how long it sits at full before leaving; it takes `fade` to go, as it did to arrive.
   * So it is gone at `at + fade + hold + fade` — which is the instant `chapterOne` arrives, and is
   * meant to be. `timeline.ts` asserts that handover rather than trusting it.
   *
   * Drives `--fade-timestamp`.
   */
  timestamp: { at: 400, fade: 1000, hold: 700 },

  /**
   * ⚓ Light arriving on the photograph. The slowest thing in the sequence, and long enough that it
   * is still arriving when the identity begins — so the name emerges inside the light, not after it.
   *
   * Drives `--fade-video`.
   */
  video: {
    at: 1600,
    fade: 3200,
    /** The footage rolls this long after the light starts, so the image is alive as it is lit. */
    rollsAfterLight: 500,
  },

  /**
   * ⚓ "Chapter One". The identity, and the visual centre — it takes the exact place the timestamp
   * occupied, so the studio's name arrives where the visitor's own moment was.
   *
   * An anchor rather than a relationship, because this is the moment the whole sequence is built
   * around. The timestamp is timed to have cleared the frame by exactly here.
   *
   * Drives `--fade-chapter-one`.
   */
  chapterOne: { at: 3100, fade: 1600 },

  /**
   * "The digital chapter begins here." The second level of the identity, not a caption.
   *
   * Drives `--fade-subtitle`.
   *
   * This is the one beat in Chapter I that the clock does not decide alone. It waits for the
   * footage's second shot as well, so the line lands on the brighter frame rather than on a
   * stopwatch — `afterChapterOne` and `waitsForFootageAt` together, whichever is later.
   */
  subtitle: {
    /**
     * How long after the identity arrives. Its own fade sits inside the light's arrival, so raising
     * this pushes the line later without changing anything about the frame it lands on.
     */
    afterChapterOne: 1200,
    fade: 1200,

    /**
     * Where the dissolve finishes and the second shot is established, in seconds of the footage's
     * own time. Measured frame by frame — luminance rises from 76.1 to 88.4 between 1.95s and
     * 2.40s, then holds flat.
     *
     * A guard, not a trigger: the footage passes it at roughly 4500ms, before the clock is ready. Its
     * only job is to make it impossible for the line to land on the first shot if the footage starts
     * late. Footage seconds, not milliseconds — it is compared against `currentTime`.
     */
    waitsForFootageAt: 1.0,

    /**
     * A failsafe rather than a beat, and deliberately absolute: if the footage never plays at all,
     * the sequence still completes. Nothing narrative depends on it, so nothing should chain to it.
     */
    arrivesRegardlessAt: 12000,

    /** How long after the footage was due before a still-paused video counts as never going to play. */
    stallGrace: 2500,
  },

  /**
   * Work · Studio · Contact. Arrives last, and outside the frame wherever there is room, so the
   * interface is never part of the photograph.
   *
   * Relative to when the subtitle **actually landed**, not to when it was scheduled — the subtitle is
   * footage-gated, so its real arrival moves, and the interface has to keep its distance from the
   * thing that happened rather than from the plan. Long enough that it is plainly a separate thing
   * from the identity rather than the end of it.
   *
   * Drives `--fade-navigation`.
   */
  navigation: { afterSubtitle: 1000, fade: 1000 },
} as const

/* ═══════════════════════ Chapter I → III · beats of scroll ═══════════════════════
   Nothing below has a duration. Read down and you have the shot.
   ═══════════════════════════════════════════════════════════════════════════════ */

export const shotStory = {
  /**
   * ⚓ Everything the hero says, leaving as one thing — so scrolling early cannot leave the title
   * fading in and out at once. Drives `--veil`.
   */
  heroWords: { at: 0, fade: 0.16 },

  /**
   * ⚓ The dark coming up over the footage, in two stages with a hold between them. The pause is the
   * whole point: it stops at `depth`, the marker arrives *there* — on the last of Chapter I rather
   * than on a blank screen — and only then does the rest of the light go.
   *
   * Drives `--dusk`.
   */
  blackTransition: {
    at: 0,
    fade: 0.5,

    /**
     * How far the dark gets before it waits for the marker.
     *
     * At 0.82 the footage's mean falls to about 16 and the sun's glow to about 44 — the landscape is
     * a trace rather than a picture, which is what the bridge needs: enough left that Chapter I is
     * still there, little enough that it is plainly going.
     */
    depth: 0.82,

    /** The bridge — how long the dark waits at `depth`. This is the beat the page turns on. */
    bridge: 0.54,

    /** How long the rest of the light takes once it resumes. The marker stays through it. */
    restFade: 0.28,
  },

  /**
   * ⚓ "CHAPTER II". Its hold is the bridge — a full beat over the dimmed landscape, which is what
   * makes this a page turning rather than a section beginning. It arrives while the landscape is
   * still clearly there and the light is still going, so it belongs to Chapter I as much as to II.
   *
   * The anchor for everything below: every beat after this one is placed relative to it, in turn.
   *
   * Drives `--marker`.
   */
  chapterTwoMarker: { at: 0.28, fadeIn: 0.18, hold: 1.0, fadeOut: 0.14 },

  /**
   * "Every unforgettable moment / has another chapter."
   *
   * `after` is the wait on black once the marker has gone — the silence that separates the page turn
   * from the statement. Drives `--statement`.
   */
  everyUnforgettableMoment: { after: 0.12, fadeIn: 0.26, hold: 0.28, fadeOut: 0.24 },

  /* ── The four occasions ────────────────────────────────────────────────────────
     One at a time, on an uneven cadence — long, short, short, medium — so the act has a shape
     rather than a metronome.

     Every fade is 0.10 in and 0.08 out across all four: the vocabulary is identical, and the rhythm
     is entirely in `hold` and `after`. The gaps carry the same intent as the holds — a longer breath
     after the wedding, almost none between the middle pair so they read as one widening gesture, and
     a slightly longer one before the last.

     Because each is chained to the one before, they can no longer overlap: raising a `hold` moves
     everything after it — including the cream transition — and keeps every gap you composed. When
     positions were absolute, `wedding.hold` above 0.16 silently put two occasions on screen at once.
     That is now impossible, and `timeline.ts` checks the one thing that could bring it back: a gap
     going negative.
     ──────────────────────────────────────────────────────────────────────────── */

  /** "A wedding." The first audience, given room to resonate. Drives `--i1`. */
  wedding: { after: 0.1, fadeIn: 0.1, hold: 0.3, fadeOut: 0.08 },

  /** "An exhibition." Passing through, broadening rather than landing. Drives `--i2`. */
  exhibition: { after: 0.05, fadeIn: 0.1, hold: 0.1, fadeOut: 0.08 },

  /** "An artist." The same, and paired tightly to the one before it. Drives `--i3`. */
  artist: { after: 0.02, fadeIn: 0.1, hold: 0.1, fadeOut: 0.08 },

  /** "A final performance." Slowing again before the light comes back. Drives `--i4`. */
  finalPerformance: { after: 0.04, fadeIn: 0.1, hold: 0.2, fadeOut: 0.08 },

  /**
   * The light coming back — black to ivory, and slower than the dusk that took it away, because
   * light arriving should be gentler than light leaving.
   *
   * Two stages so it never passes through neutral grey: warmth first, lightness over it. Measured at
   * the midpoint of a single cross-fade it was rgb(129,128,124) — dead centre of neutral, which reads
   * as a screen dimming rather than as light arriving. This is also the order it happens outside: the
   * sky gets warm before it gets bright.
   *
   * Drives `--warmth` and `--dawn`.
   */
  creamTransition: {
    /** The last of the black — the wait after the final occasion has gone. */
    after: 0.08,
    /** How long the warmth takes to arrive. */
    warmthFade: 0.28,
    /** How long after the warmth starts before the lightness follows it. Never zero, or it goes grey. */
    lightAfterWarmth: 0.18,
    /** How long the lightness takes. The longest ramp in the shot. */
    lightFade: 0.44,
  },

  /**
   * "Some moments deserve another chapter." Act III's first words.
   *
   * Placed against the *light* rather than the black, because the point is that it arrives while the
   * light is still coming up — so Act III is opening rather than opened. Drives `--close`.
   */
  someMomentsDeserve: { afterLight: 0.18, fade: 0.32 },

  /* ── Then the sentence is taken apart rather than removed ──────────────────────
     The lead goes, `another` follows shortly after, and `chapter` is left alone at the centre long
     enough to be noticed as a word rather than as the end of a sentence — which is what makes the
     next part read as the same thing continuing instead of something new beginning.
     ──────────────────────────────────────────────────────────────────────────── */

  /** "Some moments deserve" leaves. `hold` is how long the whole sentence sits first. Drives `--out1`. */
  leadLeaves: { hold: 0.43, fade: 0.2 },

  /** "another" leaves, this long after the lead started going. Drives `--out2`. */
  anotherLeaves: { afterLead: 0.14, fade: 0.22 },

  /**
   * "chapter" travels to the corner, shrinking, and becomes the chapter marker. The slowest thing in
   * the whole shot, and the only element in the piece that moves — it earns it, because what changes
   * is what the word is *for*.
   *
   * `alone` is the breath before it goes: the word by itself at the centre, which is the beat that
   * makes the transformation legible. Drives `--tm`.
   */
  chapterTravels: { alone: 0.41, fade: 0.74 },

  /** The period leaves this far into the travel — it belonged to the sentence, not to the marker. Drives `--stop`. */
  periodLeaves: { afterTravelStarts: 0.08, fade: 0.25 },

  /**
   * "III" arrives beside the word and the word settles into "Studio", together, leaving `III Studio`
   * on one line in the corner.
   *
   * Placed from the *end* of the travel: it begins while the word is nearly home, so it reads as an
   * annotation arriving beside something almost at rest rather than as a second animation. There is
   * still a little movement left to carry the swap, which is what stops it reading as a substitution.
   *
   * Drives `--swap` and `--mark3`, and its end is where the travelling word hands over to the fixed
   * marker — a step, not a ramp, because the two are pixel-identical and cross-fading them would
   * stack two 0.65-alpha inks and darken the marker for a frame. Drives `--handoff`.
   */
  iiiStudio: { beforeTravelEnds: 0.1, fade: 0.2 },
} as const

/* ═════════════════════════ Chapter III, and the interface ═════════════════════════
   On neither clock. The film is over; this is a publication, and a publication does not perform.
   ════════════════════════════════════════════════════════════════════════════════ */

export const afterTheFilm = {
  /**
   * Chapter III's blocks arrive by being scrolled to and then stay. Shown once and then forgotten, so
   * nothing re-fades on the way back up.
   *
   * Drives `--fade-studio-blocks`. Deliberately outside the haste multiplier — there is no sequence
   * left to hurry by here, and nothing for a multiplier to keep in proportion.
   */
  studioBlocks: {
    fade: 1100,
    /** A little short of the bottom edge, so a block is already arriving rather than already here. */
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.01,
  },

  /**
   * The navigation answering a cursor. Interface feedback, not narrative — so it is fast, and it is
   * outside the haste multiplier: an interface that answered at a different speed depending on how
   * somebody scrolled two minutes earlier would be responding to the wrong thing.
   *
   * Drives `--fade-nav-hover`.
   */
  navHover: { fade: 240 },
} as const

/* ═══════════════════════════════ Pace, and cost ═══════════════════════════════ */

/** How the story's clock runs. Not a beat — a multiplier on all of Chapter I at once. */
export const pace = {
  /**
   * How much faster the remaining choreography runs once the visitor asks for it. Every beat still
   * happens, in order, with all its intervals in proportion — the clock speeds up, the sequence does
   * not change.
   *
   * 1.55 rather than 1.8, because hurrying also releases the footage gate on the subtitle, and that
   * removes about 750ms of waiting on top of the faster clock. At 1.8 the compound effect reached
   * 2.3× for a visitor interacting late. At 1.55 the observed speed-up stays between 1.7× and 2.0×
   * wherever the interaction lands.
   */
  haste: 1.55,

  /**
   * The fastest the opening will ever run, as a multiple of its natural clock — for somebody who is
   * not just asking to move on but scrolling hard.
   *
   * The opening is **mandatory**: scrolling cannot skip it, only hurry it. So this is the number that
   * decides how short "hurried" is allowed to be. At 3 the whole sequence takes about a third of its
   * natural length, which is fast enough to feel answered and slow enough that every beat is still a
   * separate event you could name. Above about 4 the fades start arriving on top of each other faster
   * than the eye separates them, which is skipping by another name.
   */
  urgent: 3,

  /**
   * The scroll speed at which `urgent` is reached, in pixels per millisecond.
   *
   * Between standing still and this, the clock scales smoothly — so scrolling faster really does make
   * the opening run faster, rather than flipping it between two speeds. A wheel notch is roughly
   * 100px, so continuous wheeling sits near 3; a hard flick on a phone peaks well above it and pins
   * the clock at `urgent`.
   */
  urgentAt: 3,

  /**
   * How much of the measured scroll speed survives each frame.
   *
   * Raw per-frame deltas are far too noisy to drive a clock with — a wheel is a series of impulses,
   * not a velocity, and a phone reports nothing at all between momentum samples. This smooths them
   * into something continuous, and is also what makes the clock ease back down when the hand stops
   * rather than dropping to natural pace in one frame.
   */
  settle: 0.85,

  /** Reduced motion: the same sequence on a clock that runs faster still. Not one with beats removed. */
  reduced: 0.45,

  /**
   * Mechanism, not rhythm — you should not need to touch this.
   *
   * The most *real* time a single frame may contribute, in milliseconds. Without it the clock is only
   * as smooth as the main thread: a stall stops the frame loop, the next frame arrives with a delta of
   * seconds, and several beats become due at once. Measured in one such stall, the light, the identity
   * and the subtitle all arrived in the same millisecond. Capping the step means a stall pauses the
   * story instead of fast-forwarding it.
   *
   * This bounds the *input*. `maxAdvance` in `timeline.ts` bounds the *output*, which is what keeps
   * the guarantee when the clock is running fast rather than when the thread is slow.
   */
  maxStep: 50,
} as const

/**
 * The clock's **resting** rate — what it runs at when nobody has asked for anything.
 *
 * The single origin of the haste arithmetic. The sequencer starts here and multiplies up as the visitor
 * scrolls, between `haste` and `urgent`; whatever rate it lands on, it publishes the reciprocal to CSS
 * as `--haste`, so every duration in Chapter I is divided by exactly the factor the clock was
 * multiplied by and the fades keep their proportion to the gaps between them.
 *
 * There is no table of hurried rates any more, because the hurried rate is continuous.
 */
export const rates = {
  base: 1,
  reduced: 1 / pace.reduced,
} as const

/**
 * How long the shot is allowed to be, in beats.
 *
 * Not a target the beats add up to — an assertion about them. `timeline.ts` checks that the resolved
 * shot fits, so a ripple edit that pushed the marker past the end of the pinned frame is a build-time
 * complaint rather than a beat nobody ever sees.
 */
export const BEATS = 7

/**
 * How much scrolling the story costs. Retimes nothing — every ratio above is preserved, and only the
 * distance the hand has to travel changes.
 *
 * A thumb is not a wheel. A wheel notch moves about 100px, so the fine value is roughly fifteen
 * deliberate steps; a flick on a touch screen carries 800 to 2000px of momentum, which would take the
 * whole shot in one gesture and the visitor would never see the dissolve, the marker or the statement
 * arrive. Touch gets a longer runway for the identical choreography. Keyed to the pointer rather than
 * to width, because a large tablet has the same thumb.
 */
export const pin = {
  fine: '392vh',
  coarse: '588vh',
} as const
