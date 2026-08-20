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
   * ⚓ "CHAPTER II". Its hold is the bridge — a long beat over the dimmed landscape, which is what
   * makes this a page turning rather than a section beginning. It arrives while the landscape is
   * still clearly there and the light is still going, so it belongs to Chapter I as much as to II.
   *
   * The anchor for everything below: every beat after this one is placed relative to it, in turn.
   *
   * **`hold` and `chapterTwoBecomesPhilosophy.whole` move together, by the same amount.** The
   * transformation is chained off this beat's arrival, so `whole` alone buys breathing room by spending
   * the stillness at the far end, and `hold` alone extends that stillness without buying any. Adding the
   * same number to both is what lengthens the *window* — more time before the mark rewrites itself, and
   * the finished mark standing exactly as long afterwards. `timeline.ts` checks the far end of that.
   *
   * Drives `--marker`.
   */
  chapterTwoMarker: { at: 0.28, fadeIn: 0.18, hold: 1.24, fadeOut: 0.14 },

  /**
   * `CHAPTER II` becoming `II Philosophy`, inside the marker's own hold.
   *
   * One gesture, not four: the word goes, the numeral sets off **while it is still going**, and the
   * topic arrives beside the numeral once it is at rest. The overlap is the whole reason this reads as
   * a mark being rewritten rather than as fade-out, pause, move, appear — so `numeralSetsOffWhenWordIs`
   * is stated as *how far gone the word is*, not as a delay, and `timeline.ts` solves the curve
   * backwards for the moment that produces it. The same trick as `litWhenTheMarkerLands`, and for the
   * same reason: what was decided is the overlap, and the offset is arithmetic.
   *
   * The gesture itself is 0.5735 beats from the word's first frame to the topic's last, and every part
   * of it is stated below as a proportion of the part before it — so it is the one thing in this beat
   * that does not move when the window around it is lengthened.
   *
   * Inside a `hold` of 1.14 that leaves `CHAPTER II` standing whole for 0.28 first, and `II Philosophy`
   * standing still for 0.286 afterwards — the same breath at each end, and each a little longer than the
   * statement that follows gets (0.28). The mark has to be a mark before it is allowed to leave, and it
   * now has to be one for a while before it is allowed to change.
   *
   * Drives `--mkword`, `--mknum` and `--mktopic`.
   */
  chapterTwoBecomesPhilosophy: {
    /**
     * How long `CHAPTER II` stands whole, once it has finished arriving, before anything changes.
     *
     * The breathing room, and the only number here that is a *duration* rather than a proportion of the
     * gesture. 0.28 rather than 0.14 because at 0.14 the mark had barely finished arriving before it
     * began rewriting itself — about one wheel notch of scroll, which read as the transformation being
     * the point of the beat rather than something that happens to a mark you have already read.
     *
     * It is the same length as the statement's hold, which is the shortest thing in the act that reads
     * as standing still. Raise it and `chapterTwoMarker.hold` by the same amount; see that beat.
     */
    whole: 0.38,

    /** How long the word takes to leave. Opacity and a blur together — see `blur`. */
    wordLeaves: 0.24,

    /**
     * How much of the word's departure has happened when the numeral sets off. The overlap.
     *
     * At 0.76 the word is three-quarters gone and unmistakably going, which is late enough that the
     * numeral's move reads as a consequence of it and early enough that the two are plainly one
     * gesture. Below about 0.6 they read as a cross-fade; at 1.0 the pause comes back.
     */
    numeralSetsOffWhenWordIs: 0.76,

    /**
     * How long the numeral takes to reach its place. Longer than the rest of the word's departure, so
     * the word is completely gone well before the numeral arrives — `timeline.ts` asserts it rather
     * than trusting the arithmetic.
     *
     * The distance is not here, and is not authored anywhere: `scroll-stage.tsx` measures where the
     * numeral would have to be for `II Philosophy` to be centred exactly where `CHAPTER II` was, from
     * the live layout. Philosophy is a great deal wider than Chapter, and by a different amount at
     * every size — so the one honest answer is the rendered one. Drives `--mk`.
     */
    numeralTravels: 0.2,

    /**
     * How far the word blurs as it goes, in pixels at its worst.
     *
     * Not an effect — the word is *losing focus* rather than dissolving, which is what stops a pure
     * opacity fade reading as a light being switched off. 3.5px at a marker of 15–22px is about a
     * sixth of the cap height: enough that the letterforms soften, little enough that it is never a
     * blur anybody would name. Above about 6px it becomes a decorative effect, which
     * `04-visual-language.md` §7 does not allow.
     */
    blur: 3.5,

    /**
     * How long after the numeral has settled before the topic arrives. Small on purpose — long enough
     * that the numeral is established first, short enough that this is still the same gesture.
     */
    topicAfterNumeral: 0.05,

    /** How long the topic takes to arrive. Opacity only; it does not move, because it is already home. */
    topicFade: 0.16,
  },

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

  /**
   * Where Chapter III's opening composition **stands** when the marker lands, as a fraction of the
   * frame from the top.
   *
   * Not a fade — a distance, and the only one the composition needs. Chapter III is pulled back into
   * the film's last frame far enough that its first page is a composed frame at the moment the marker
   * arrives in the corner: at 0.2 the statement's top is a fifth of the way down and the plate is
   * three-quarters inside the frame beneath it.
   *
   * It has to be here rather than with the rest of Chapter III, because it is measured against a beat
   * of the *shot* — where the page has reached by the time the marker lands. `timeline.ts` turns it
   * into two lengths, one for the page and one for the marker's landing corner, from this, `pin` and
   * `BEATS`, so no viewport distance is written down anywhere.
   *
   * **This is the value that puts the plate in the same frame as the statement**, which
   * `05-storyboard.md` Beat 2 forbids — see `decisions.md` §44. Lowering it toward 0.8 restores Beat 2
   * and empties the frame again; the brief asked for the opposite, on purpose.
   */
  chapterThreeStands: { atFrameFraction: 0.2 },

  /**
   * Chapter III's opening frame coming into existence, underneath the travelling word.
   *
   * It is the one value that reaches across the two runways, and what it now opens is **the object**:
   * the first third of the device's aperture is driven from inside the film, so the mark does not
   * announce the work, it starts uncovering it. `actStory.object.opensWithTheMark` is the share, and
   * `--aperture` in `globals.css` is where the two stages are added — the same two-stage construction
   * `--adusk` and `--aglow` use, with the first stage on the film's runway instead of the act's.
   *
   * **That is where this beat began, and it is where it has returned.** §44 had it opening a band of
   * footage sideways; §49 replaced the band with a device and welded the aperture to the claim's
   * departure instead, because a portrait object could not share a frame with a three-line claim; §51
   * removed the claim, so the aperture is the mark's again and nothing stands between the chapter's head
   * and its work.
   *
   * The chapter mark does not announce the Studio after the fact — it *unveils* it. So this begins in
   * the same instant the word sets off for the corner, and it is still arriving when the word gets
   * there: `litWhenTheMarkerLands` is what was actually decided, and `timeline.ts` solves the curve
   * backwards for the range that produces it. Raise it and the page is further along when the marker
   * arrives; the range shortens to suit, and the start stays welded to the travel.
   *
   * It is the one beat that deliberately outlasts the pinned frame. Everything else in the shot has to
   * finish inside `BEATS` or its tail is a beat nobody sees; this one drives the page *below* the pin,
   * which keeps scrolling, so its tail is the aperture still widening in a frame the visitor has
   * already arrived in. `timeline.ts` checks it starts inside the pin and that it cannot finish before
   * the marker lands.
   *
   * Drives `--studio`.
   *
   * **There is no `rise` any more.** It moved a claim eight pixels into place; the claim is gone, and an
   * object that is *uncovered* rather than delivered must not also drift. `decisions.md` §51.
   */
  studioEmerges: {
    /** How lit the page is at the instant the marker lands. The brief's number, and the only one. */
    litWhenTheMarkerLands: 0.75,
  },
} as const

/* ═══════════════════════ Chapter III · the act, in beats of scroll ═══════════════════════
   The third act of the same film, and it is timed the way the first two are: no clock, no duration,
   nothing but scroll position — so it runs backwards exactly as it runs forwards and stopping
   anywhere leaves a composed frame.

   It has **its own runway** (`actPin`) rather than more of the film's, because its length is decided
   by what it has to say rather than by anything in the shot. Its beats are numbered from the moment
   its frame reaches the top of the viewport, which is a little after the mark lands in the corner —
   the twenty viewport-hundredths in between are `chapterThreeStands`, and they are the settle.

   ## §53 — the work is the frame

   **There is no object in the act any more.** §49 put a device at the centre of it and §51 and §52
   composed around that device; the whole apparatus is gone — the frame, the glass, the screen ratio,
   the aperture's rounded corner, the veil, the pointer gate, the crossing, the annotation column, and
   the three fields of sampled colour that were standing in for light the work should have been making
   itself.

   What the aperture opens now is **the work**, full frame. Chapter I's material is footage and its type
   is composed inside it; Chapter II's is the same footage going dark; Chapter III's is the studio's own
   project, and its type is composed inside it in exactly the same way. Three chapters, one grammar.
   `decisions.md` §53.

   The project supplies **one composed moment of itself** — a route that fills whatever frame it is
   given, composes for it, never scrolls and carries no controls. The studio frames and narrates it and
   knows nothing else about it. `site.three.work.fragment`.

   ## The light does the narration

   The act has one Studio-level variable and it is the one the whole film is built on: how lit the room
   is. There are four states and the sequence is nothing but the movement between them.

     paper          the chapter's own ground, before the aperture
     lit            the work, whole, alone, at full strength — nothing said
     evening        `darkens.depth` — enough dark to carry white type over a photograph
     a trace        `deepens.depth` — the work receded, the studio's line the brightest thing
     paper again    the light returns as the frame acquires margins and becomes a plate

   Nothing else in the act changes. No colour is sampled, no field drifts, no glow is painted.

   Read down and you have it. Six movements, and the only pause in it is deliberate:

     0.00  the aperture is a third open already                     ⟵ opened by the travelling word
     0.10  the masthead's links arrive beside the settled mark
     0.62  the aperture reaches the frame's edges: the work is the whole screen, lit
     0.62  … and nothing happens. This is the moment, and it is the only stillness in the act.
     0.92  the room begins to go to evening
     1.22  the work is named, in the quiet band of its own frame
     1.78  the two lines leave and the room goes down to a trace with them
     2.06  "We don't build websites." — the only thing the studio says here
     2.56  the light comes back as the frame draws in: the film is printed into a plate
     2.79  the way out, on the paper, beneath it
     3.03  the act has said everything. `ACT_BEATS` releases the pin at 3.2, and what is left
           standing is the Work page: a plate, and one line under it.
   ═══════════════════════════════════════════════════════════════════════════════════════ */

export const actStory = {
  /**
   * ⚓ The navigation arriving beside the mark, once the mark has settled.
   *
   * An **anchor**, and the only one in the act, because nothing else determines it: it is measured from
   * the moment this frame reached the top of the viewport, which is the moment the mark stopped moving.
   * Everything else here is placed relative to the beat before it; this one is placed relative to the
   * settle, and the settle is where zero is.
   *
   * `at` rather than 0 so the mark stands alone for a breath first. The mark is what the travelling word
   * became, and the visitor has to be allowed to read it as that before it turns into a masthead.
   *
   * `timeline.ts` checks the far end: the whole masthead has to be standing on paper before the room
   * starts to go dark, or the links would arrive over a frame that is already becoming a photograph.
   *
   * Drives `--anav`.
   */
  navigation: { at: 0.1, fade: 0.28 },

  /**
   * **The aperture, and what it opens is the work.**
   *
   * The film's own gesture turned ninety degrees: Chapter II's band opened sideways because it was a
   * landscape, and this opens **vertically from the centre** — the frame's two edges retreating from its
   * middle until the work is the whole screen. The subject arrives first and the sky and the water
   * follow it, which is the right order for an unveiling.
   *
   * One axis at every size, deliberately. §52 had two rules for two orientations because it was
   * uncovering a portrait object; a frame is a frame, and turning the reveal on its side for a phone
   * would be a second idea for no narrative gain.
   *
   * **Its range starts at zero, and a third of it has already happened by then.** `opensWithTheMark` is
   * the share the *film* opens, under the travelling word — so the chapter's mark and the chapter's work
   * are one gesture and there is nothing between them. The two stages are added in `globals.css` as
   * `--aperture`, exactly the way `--adusk` adds its own two.
   *
   * `fade` is the longest single movement in the act and it should be: this is the whole screen becoming
   * somebody's work. Below about 0.45 it reads as a panel opening rather than a frame being uncovered.
   *
   * Drives `--aframe`.
   */
  frame: { opensWithTheMark: 0.34, fade: 0.62 },

  /**
   * **The moment the work is simply there.**
   *
   * The only stillness in Chapter III, and the one beat in the act that exists to have nothing in it.
   * The aperture has finished, the work is whole and at full strength, nothing has been named, nothing
   * is offered, and no light is moving. `03-design-principles.md` §3 — *a pause is allowed to be the
   * entire design of a moment*.
   *
   * It is short in **scroll** and unbounded in **time**, which is the distinction the whole system turns
   * on: the frame is held, so a visitor who wants to look can look for as long as they like, and one who
   * does not is three notches of a wheel from the next thing. `03-design-principles.md` §2 — we decide
   * the order, they decide the pace — and `04-visual-language.md` §11.2, which forbids holding anybody
   * in place to prove a moment was worth making.
   *
   * 0.30 is about a sixth of a screen on a wheel and a quarter on a thumb. Below about 0.2 the naming
   * treads on the reveal and the act has no breath in it at all.
   *
   * Drives nothing. It is a gap, and it is the reason the gap is here.
   */
  quiet: { holdsWhole: 0.3 },

  /**
   * The room going to evening.
   *
   * The same gesture that took the light off the hero at the end of Chapter I, over the same kind of
   * material, and it is here for the same reason: **type occupies the dark part of a composition**
   * (`decisions.md` §02), and until the light comes down there is no dark part. The studio dims the room
   * to speak about the work rather than laying a scrim over it — one is narrative, the other is
   * furniture.
   *
   * `depth` is 0.5 and it is a legibility number as much as a compositional one. The fragment's quiet
   * band is sky and lagoon, which measures around 180; at 0.5 it falls to 90 and white type reads about
   * 6:1 against it. It is also as far as the light may come down while the work is still plainly *lit* —
   * this is evening, not night, and night is the next beat.
   *
   * `beginsAfterTheQuiet` is a real gap rather than an overlap, and it is the only one in the act.
   * Everything else here overlaps because the act is one gesture; this joint is where the gesture is
   * deliberately interrupted, which is what makes the stillness before it legible as stillness.
   *
   * **One stage, not two, and that is a correction.** §52 carried a warm wash ahead of the black, because
   * a cross-fade between two *neutral* grounds passes through neutral grey at its midpoint and its ground
   * was paper. A photograph is not neutral: darkening golden-hour photography with black passes through
   * darker versions of its own colour, and the wash over it is a beige veil that lifts the shadows and
   * mutes everything — `04-visual-language.md` §3 backwards. Chapter I already says this in code: one black
   * layer over its footage, two over the dawn. `decisions.md` §53.
   *
   * Drives `--adusk`, with `deepens`.
   */
  darkens: {
    beginsAfterTheQuiet: 0,
    depth: 0.5,
    fade: 0.42,
  },

  /**
   * **The work being named, inside its own frame.**
   *
   * `site.three.work.title` and `work.context.note` — a name and two lines, and that is the whole schema
   * every future project gets. No index, no classification, no catalogue label; §52 took those out and
   * they are not coming back.
   *
   * **It is composed into the material, not set beside it.** This is the difference between Chapter III
   * and every version of it before this one: the type stands in the quiet band the fragment declares,
   * over the photograph, the way the timestamp stands inside the hero's own frame in Chapter I. There is
   * no column, no gutter and no card, because the frame has one subject and the annotation belongs to it.
   *
   * `arrivesWhenDuskIs` is stated as *how far through the darkening* it appears, not as a delay, because
   * what was decided is that the light and the language are one movement: the room dims and the work
   * acquires a name in the same gesture. At 0.8 the ground has lost four fifths of what it is going to
   * lose, which is where white type becomes legible over the fragment's brightest band. `timeline.ts`
   * solves the curve backwards for the offset and asserts the legibility.
   *
   * **One beat, two properties.** The title arrives on this range and **stays** (`--atitle`, a ramp),
   * because the studio's line is a reading of *this* work and a frame that says it with nothing named in
   * it is a manifesto rather than a reading. The two lines arrive on the same range and then give the
   * space up (`--anote`, a cue), because they are what the studio's own voice replaces.
   *
   * `hold` is short: two lines of eleven words are read in a glance, and the beat after this one is the
   * one worth spending scroll on.
   */
  annotation: { arrivesWhenDuskIs: 0.8, fadeIn: 0.3, hold: 0.26, fadeOut: 0.2 },

  /**
   * The room going down to a trace, **as the two lines leave**.
   *
   * The second stage of the same dark, and it rides the annotation's own departure rather than having a
   * position of its own — so what the visitor sees is not *text swapped for text* but the studio turning
   * the lights down and the description going with them. `04-visual-language.md` §7 asks what changed
   * before anything is allowed to move; what changed here is who is speaking, and a change of speaker in
   * a room is a change of light.
   *
   * `depth` is where the dark stops, and it stops short of black on purpose. At 0.88 the work is a trace
   * rather than a picture — the same value and the same word Chapter I's own dusk uses (`blackTransition
   * .depth`, 0.82, *"the landscape is a trace rather than a picture"*). **The work never leaves the
   * frame.** A black screen with a sentence on it would be the studio talking about a project that is no
   * longer there.
   *
   * Drives `--adusk`, with `darkens`.
   */
  deepens: { depth: 0.88, fade: 0.34 },

  /**
   * "We don't build websites." — `site.three.voice.lead`.
   *
   * **The only thing the studio says inside the film**, and it says it in the space the two lines
   * vacated, on a ground that has just gone down to a trace to make room for it. It cannot arrive before
   * the work has been shown and named; `timeline.ts` asserts that against the aperture's own completion
   * rather than trusting the arithmetic.
   *
   * `after` is the silence once the annotation has completely gone — short, because the darkening is
   * still finishing and the two are meant to be one movement.
   *
   * A ramp rather than a cue: it arrives and it stays until the film ends. It is the last thing said, and
   * the beat after it is the light coming back.
   *
   * **The second sentence is not here.** *We create digital experiences that become part of the memory
   * itself* explains, and an explanation is not a cinematic line — it belongs to About, where there is
   * room to be read rather than looked at. `decisions.md` §53.
   *
   * Drives `--alead`.
   */
  belief: { after: 0.08, fade: 0.24 },

  /**
   * **The film being printed.** One movement, and it is the register change rather than a transition
   * into one.
   *
   * Three things happen on this single range and they are one gesture: the light comes back, the frame
   * draws in until it has margins, and what is left standing is a plate on paper. The visitor watches the
   * film become the page.
   *
   * It is the second element in the whole piece that transforms, and it earns it on exactly the grounds
   * `04-visual-language.md` §7 gives the first one — the word `chapter` travelling into the corner. What
   * changes is what the thing is *for*: the work stops being the subject of a film and becomes a plate in
   * a publication. A cross-fade could not say that, because what changed is a relationship between the
   * work and the page it is on, and **the appearance of a margin is that relationship**. §52's crossing
   * object is gone, so the count is unchanged: two things move in Chapter One, and no more.
   *
   * The distance and the scale are **not here**, deliberately. `--plate-scale`, `--plate-x` and
   * `--plate-y` are in `globals.css`, because where a plate sits on a page is composition and it changes
   * with the screen — the same division `--object-cross` was under before it was deleted.
   *
   * `clears` is how much of the range the in-frame type takes to leave, and it is a legibility number.
   * The annotation and the studio's line are white and the ground is travelling to paper; measured, at
   * the midpoint of a return like this the ground and any single interpolated ink both read about 134 and
   * type disappears entirely for a sixth of a beat (`decisions.md` §52 records the version that was built
   * and thrown away). So the type leaves *ahead* of the light, while the ground is still 0.57 dark, which
   * is 7:1 for white. Chapter II's statement went before the dawn arrived rather than through it; this is
   * the same rule at the other end of the film.
   *
   * Drives `--aprint`, and takes `--adusk` and `--asaid` back down.
   */
  printing: { afterTheBelief: 0.26, fade: 0.4, clears: 0.4 },

  /**
   * "Open the full experience →" — `site.three.work.cta`, and the only outward action in the chapter.
   *
   * **It arrives on the paper, not in the film.** §51 offered it last over near-black and §52 moved it
   * beside the annotation; both were still inside the shot, and both meant the act ended on an offer.
   * This is the page's own line, printed under the plate as the plate is printed, and it is the one thing
   * on the Work page that can be pressed. There is nothing to compete with it — no word on a screen, no
   * second invitation, no duplicate verb. `decisions.md` §53.
   *
   * `whenPrintedIs` welds it to the printing: at 0.6 the margins have appeared and the light is most of
   * the way back, so the line arrives on a ground that is nearly paper and finishes on paper exactly.
   * Anything earlier is a line of ink on a ground still going light, which is the trough this act was
   * composed to avoid.
   *
   * Drives `--aopen`, and `--aoffer` — a step, because a hit area has no half state.
   */
  wayOut: { whenPrintedIs: 0.6, fade: 0.24 },
} as const

/* ═══════════════════ The method, in beats of its own scroll ═══════════════════
   **The third runway, and the only one outside the film.**

   The publication is ordinary flow everywhere except here. This one section is a held frame, because what
   it does cannot be done in flow: the studio's questions arrive one at a time, each brings considerations
   into the space around them, the considerations **accumulate**, and then all of them **converge** into one
   line. Accumulation needs a frame that stays still while it fills; convergence needs the filled frame to
   still be there when it collapses. `decisions.md` §55.

   It is deliberately the **shortest and cheapest** runway on the site. The shot is 392vh at 54.7vh a beat
   and the act is 176vh at 55.0; this is 160vh at 43.2 — a fifth cheaper per beat than either, so it moves
   faster in the hand than the film does and cannot be mistaken for a fourth chapter. Nothing here is a
   ripple of anything in the film, and no number moves between the three.

   Read down and you have it:

     0.00  `Method`, and one line: *Tell us what matters.*
     0.58  the first question, arriving out of the depth on the page's own axis
     0.66  the first three considerations, one after another, at their own distances
     1.11  the second question — the first has receded back into the space it came from
     1.64  the third
     2.17  the fourth
     2.59  twelve considerations stand in the space, and nothing moves. The one stillness here.
     2.87  the convergence: every word travels to the point the questions stood on, and fades
     3.13  `Your experience` comes forward out of that point, while the last of them is still arriving
     3.49  and the two lines under it
     3.71  done. `METHOD_BEATS` releases the frame at 3.8 and the page carries on.
   ═════════════════════════════════════════════════════════════════════════════ */

export const methodStory = {
  /**
   * ⚓ `Tell us what matters.` — the invitation, alone on paper.
   *
   * The only anchor in the section, and the only thing in it that is not a consequence of something else:
   * it is the frame's first state, so it is at zero by definition.
   *
   * It leaves the way the questions leave, because it is the first of them — the studio asking to be told
   * rather than asking a question of its own. Drives `--minvite`.
   */
  opening: { at: 0, fadeIn: 0.18, hold: 0.20, fadeOut: 0.16 },

  /**
   * **The four questions, and what each of them brings into the space.**
   *
   * One shape for all four, because they are one gesture repeated — `04-visual-language.md` §7, the motion
   * vocabulary is identical and the rhythm lives in the holds. What differs between them is only what they
   * bring: three considerations each, at three different distances.
   *
   * **A question is never simply faded in.** It comes forward out of the depth as it arrives and returns
   * into it as it goes — one range driving opacity *and* z, the same construction `--mkword` and `--mkblur`
   * share in Chapter II. So the questions are not switched on and off in front of the visitor; they surface
   * out of the same space the considerations are accumulating in, and go back into it. The distance is
   * composition and lives in `globals.css` (`--m-ask-z`), the way the plate's own distance does.
   *
   * Drives `--mq1` … `--mq4`, and `--mw1` … `--mw12`.
   */
  asking: {
    /** The wait on empty paper after the invitation has gone. Short — the studio is not pausing, it is asking. */
    after: 0.04,

    /**
     * One question. `hold` is the whole of the rhythm, and it is set against something already proven on
     * this site rather than guessed: a question is present for 0.5 beats, which at this runway's price is
     * **21vh of scroll — the same budget Chapter II gives each of its four occasions** (0.48 beats at 55vh
     * a beat, 26vh), for the same kind of thing, a single line that has to be read once.
     *
     * The 0.22 was bought rather than added: `opening.hold` gave up 0.04 and `gathered.holds` 0.02, so the
     * dwell on every question went up a tenth and the runway did not move. Below about 0.14 the fourth
     * question is unreadable at speed.
     */
    fadeIn: 0.14,
    hold: 0.22,
    fadeOut: 0.14,

    /**
     * The gap between one question going and the next arriving. Almost nothing, on purpose: the questions
     * are a single line of thought, and a real pause between them would make each one a separate beat.
     */
    between: 0.03,

    /**
     * The considerations a question brings with it.
     *
     * `afterQuestion` is measured from the question's **arrival**, not its departure, so the words appear
     * while the question is still legible — that is the whole point of them: they are what the studio
     * hears in the answer, so they have to be in the frame with the thing that asked.
     *
     * `stagger` is the interval between the three. Small enough that they read as one answer arriving and
     * uneven enough that it is not a metronome — the third word is 0.14 behind the first, which at this
     * runway's price is about 6vh.
     */
    words: { afterQuestion: 0.08, fadeIn: 0.2, stagger: 0.07 },
  },

  /**
   * **Twelve considerations, standing, with nothing happening.**
   *
   * The stillness, and it is the same beat the act has for the same reason: `03-design-principles.md` §3 —
   * a pause is allowed to be the entire design of a moment. This is the moment the section exists to
   * produce, and the visitor has to be given a frame of it before it is taken apart.
   *
   * Measured from the **last word being fully lit**, so it is a real gap rather than an overlap. Drives
   * nothing. It is the reason the gap is there.
   */
  gathered: { holds: 0.28 },

  /**
   * **The convergence.** Every word travels to the point the questions stood on, and goes out as it arrives.
   *
   * One property for the whole field (`--mgather`), because it is one gesture: each word's own offset from
   * that point is multiplied by what is left of it, so twelve elements collapse on twelve different vectors
   * without a single one of them being animated separately. `globals.css` owns the offsets, because where a
   * word stands in a frame is composition and it changes with the screen.
   *
   * `fade` is the longest single movement in the section and it should be — it is the whole argument of the
   * piece performed in one range: many considerations becoming one thing. Below about 0.3 it reads as the
   * words being cleared away rather than gathered up.
   */
  converge: { fade: 0.46 },

  /**
   * **`Your experience` — the resolution, arriving out of the point everything collapsed into.**
   *
   * `whenConvergedIs` is stated as *how far through the convergence it appears* rather than as a delay,
   * because what was decided is the overlap: the line has to be arriving while the last words are still
   * coming in, or the frame empties first and the answer is a heading appearing on paper instead of the
   * consequence of the movement. The same construction as `annotation.arrivesWhenDuskIs` in the act.
   *
   * At 0.6 the field is 60% gathered — most of the words are inside the last few per cent of their travel
   * — and the line comes forward through them. `timeline.ts` asserts that it cannot start before the
   * convergence does.
   *
   * Drives `--manswer` and `--mlines`.
   */
  resolve: {
    whenConvergedIs: 0.6,
    fade: 0.26,
    /** The two authored lines under it, once the answer has landed. */
    linesAfter: 0.1,
    linesFade: 0.22,
  },
} as const

/**
 * How long the method's frame is held, in beats — the same kind of assertion `BEATS` and `ACT_BEATS` are.
 *
 * 3.8 against a resolved tail of 3.73, so the slack is 0.07: about 3vh, which is the composition standing
 * finished for the last of the hand's movement before the page carries on. There is no settle to buy here —
 * the section ends on type, on paper, in flow, and the thing below it is another page of the same
 * publication.
 */
export const METHOD_BEATS = 3.8

/**
 * How much scrolling the method costs. **The shortest held frame on the site, and the cheapest beat.**
 *
 * 160/240 comes out at 42.1vh a beat on a wheel and 63.2 on a thumb, against 55.0 for a beat of the act and
 * 54.7 for a beat of the shot. That gap is the point rather than an accident: this is not a chapter, so a
 * beat of it must not weigh what a beat of the film weighs. The whole section is 160vh of held frame where
 * Chapter III is 176 and Chapter I is 392, and the ratio between the two values is the film's own (1.5),
 * because a thumb is not a wheel here either.
 */
export const methodPin = {
  fine: '160vh',
  coarse: '240vh',
} as const

/* ═════════════════════════ Chapter III's closing, and the interface ═════════════════════════
   On neither clock. The act is over; what is left is a publication, and a publication does not
   perform.
   ════════════════════════════════════════════════════════════════════════════════════════════ */

export const afterTheFilm = {
  /**
   * What is left of Chapter III once the act has finished — the closing — arriving by being scrolled
   * to and then staying. Shown once and then forgotten, so nothing re-fades on the way back up.
   *
   * Drives `--fade-studio-blocks`. Deliberately outside the haste multiplier — there is no sequence
   * left to hurry by here, and nothing for a multiplier to keep in proportion.
   */
  studioBlocks: {
    fade: 1100,

    /**
     * How far short of the bottom edge a page begins arriving, as a fraction of the viewport — so a
     * page is already on its way in rather than already here.
     *
     * A number rather than the `rootMargin` string it used to be, because `timeline.ts` builds the
     * string from it — and because the same number decides where Chapter III's closing sits, so only one
     * of the two is authored.
     */
    arrivesShortOf: 0.12,

    /**
     * Zero, so that `arrivesShortOf` is the *whole* answer to when a block arrives.
     *
     * It was 0.01, which sounds like nothing and is not: a ratio threshold is a fraction of the
     * block's own area, so the taller the block the further past the line it has to travel before it
     * counts as arriving. At zero the trigger is the top edge crossing the line and nothing else,
     * whatever the block turns out to be.
     */
    threshold: 0,
  },

  /**
   * The navigation answering a cursor. Interface feedback, not narrative — so it is fast, and it is
   * outside the haste multiplier: an interface that answered at a different speed depending on how
   * somebody scrolled two minutes earlier would be responding to the wrong thing.
   *
   * Drives `--fade-nav-hover`.
   */
  navHover: { fade: 240 },

  /**
   * **About arriving**, and it is the one composed arrival in the publication.
   *
   * Everything else down there is a page appearing (`studioBlocks`) or an interface answering. This is a
   * small sequence: the photograph, then the mark, then the words — in that order, because the room is the
   * subject and the studio's account of itself is a reading of it. `04-visual-language.md` §7: motion
   * exists to make change comprehensible, and what changed is that the studio has shown you where the work
   * is made.
   *
   * It is on a clock rather than on scroll, and it is **not** a beat: nothing here is pinned, nothing is
   * driven, and stopping mid-scroll leaves it finished rather than half way. Outside `--haste` with the
   * other three — the film is over, and there is no sequence left to hurry.
   *
   * The whole arrival is 2.2s and it is meant to be the slowest quiet thing on the site. Anything faster
   * read as three elements fading in; this reads as a light going on in a room that was already there.
   *
   * Drives `--fade-about-image`, `--about-settle`, `--fade-about-label`, `--in-about-label`,
   * `--fade-about-words` and the three `--in-about-words-*` that `timeline.ts` derives from `step`.
   */
  about: {
    /**
     * The photograph. The longest fade in the publication, and the only thing in it that travels.
     *
     * `settle` is that travel, in pixels: the image arrives from **below** its resting place and comes to
     * rest, which is the difference between a picture appearing and a picture being set down. 14px against
     * an image 440 tall is about three per cent of it — enough that the arrival has a direction, little
     * enough that nobody can name the movement. Above about 24px it becomes a slide, which is the generic
     * scroll reveal this exists instead of.
     *
     * The film has two things that transform and both earn it by changing purpose
     * (`04-visual-language.md` §7). This is neither of those and it is not in the film; it is an entrance
     * in a publication, asked for so that About is not static, and it is kept to the smallest movement
     * that still reads as one. `decisions.md` §54.
     */
    image: { fade: 1500, settle: 14 },

    /** The mark, once the photograph is most of the way there. Opacity only — it is already home. */
    label: { afterImage: 500, fade: 800 },

    /**
     * The words. Three blocks — the opening sentence and the two paragraphs — arriving one after another
     * on the same fade, `step` apart, so the text is read into existence rather than switched on.
     *
     * `step` is small on purpose: at 240ms the blocks are plainly sequential and the whole paragraph is
     * still one gesture. Above about 400 it becomes a list of things appearing, which is what the brief
     * for this section rules out.
     */
    words: { afterLabel: 220, fade: 1000, step: 240 },
  },

  /**
   * **A question answering.** The one timing the publication needs, and the only one it will ever need.
   *
   * Interface feedback rather than narrative, so it is on a clock and outside the haste multiplier for the
   * reason `navHover` is: the film is over, there is no sequence left to hurry, and a row that opened at a
   * different speed depending on how somebody scrolled two minutes earlier would be answering the wrong
   * thing. `04-visual-language.md` §10 — *it always answers*, and §7 — *someone acted: the answer arrives
   * before anyone wonders whether it will.*
   *
   * 180ms, and it is deliberately the fastest thing in the project. `navHover` is 240 for a cursor passing
   * over a word, which is a state changing; this is a press, which is a question being answered, and a
   * press must never feel slower than a hover. The row itself does not animate at all — the height is the
   * browser's, instantly, and only the ink of the answer arrives — so this is a fade over type that is
   * already in place rather than a panel performing an opening. Nothing measures, nothing is scripted, and
   * there is no height to interpolate.
   *
   * Drives `--fade-answer`.
   */
  answer: { fade: 180 },

  /**
   * **The work, and the two things about it that are not beats.**
   *
   * Everything narrative in Chapter III is scroll: the aperture, the stillness, the light going to
   * evening and then to a trace, the naming, the studio's line, the printing, the way out. All of it is a
   * pure function of position and reverses exactly.
   *
   * What is left here is *when a document is requested* and *how it appears when it arrives*. Neither is
   * storytelling — one is a network and the other is the absence of a flash — and there is no schedule
   * for either to be synchronised with.
   *
   * **§53 deleted the rest of this object**, and it is worth saying what went and why. `patience` and
   * `spill` existed for a device with a screen in it: a wait to bound, a state machine to hold, and a
   * light for the screen to throw into the room. There is no device, nothing is asked for, and nothing is
   * waited on — the frame is either carrying the work or it is carrying the chapter's own ground, and the
   * second of those is a composed alternative rather than a failure state (`05-storyboard.md` §10: *the
   * atmosphere degrades to type and ground, and type and ground alone still have to pass the five-second
   * test*). `atmosphere.drift` went with the fields it moved. `decisions.md` §53.
   */
  work: {
    /**
     * How far ahead of the viewport the fragment is fetched, in viewport heights.
     *
     * A **distance**, not a beat and not a threshold: the observer's `rootMargin` is built from it in
     * `timeline.ts`, so the string is derived and this number is the only thing authored — the same
     * construction `studioBlocks.arrivesShortOf` uses, and for the same reason.
     *
     * 1.5 viewports. The act's own frame is about six viewports down the document, so nothing is
     * requested until the visitor is well into Chapter II and a visitor who never gets there never pays
     * for it at all — `05-storyboard.md` §11 will not have media delaying the first meaningful thing on
     * screen. At the observed speeds through the end of the film, one and a half viewports of travel is
     * comfortably longer than the fragment's own first paint, so what the aperture uncovers is a page
     * that is already there rather than one that is arriving.
     */
    fetchedWithin: 1.5,

    /**
     * How long the fragment takes to appear once it has painted, in milliseconds.
     *
     * Not a beat and not part of the sequence: it answers a load event, so it is on a clock, and it is
     * outside `--haste` on the same grounds `navHover` is. Its whole job is that the frame is never seen
     * to be empty and then suddenly full — the aperture may already be open when the document lands, and
     * a document appearing in one frame inside a frame that is not moving is the one thing that would
     * draw attention to the mechanism.
     *
     * 900ms: slower than an interface answering and faster than anything in the act, so it reads as the
     * light coming up on something already there rather than as a page loading.
     *
     * Drives `--fade-work`.
     */
    arrives: 900,
  },
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
 *
 * **Raising this retimes nothing** — every ratio in the storyboard is preserved and `pin` alone decides
 * how far the hand travels. What it does change is the price of a beat: the shot's beats share a fixed
 * runway, so at 7.14 each one costs 392/7.14 rather than 392/7 viewport-hundredths. Two per cent less,
 * across everything, which buys the longer marker window out of the whole film rather than asking the
 * visitor to scroll further for it.
 *
 * 7.14 rather than a rounder 7.25 for one reason worth recording: the slack between the shot's tail and
 * this ceiling is not dead frame. `chapterThree.overlapOfPin` is `1 − endsAt/BEATS`, so it is exactly how
 * far Chapter III reaches back under the film's last frame. At 7.14 the tail lands at 7.07 and that
 * reach-back stays 0.0098 of `pin`, against 0.0100 before — 0.08vh, which is nothing. At 7.25 it would
 * have become 0.0248, pulling Chapter III about 6vh further up into a frame the brief did not ask to
 * recompose. The ceiling is deliberately snug, and the assertion is what makes that safe.
 */
export const BEATS = 7.17

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

/**
 * How long Chapter III's act is allowed to be, in beats. The same kind of assertion `BEATS` is, about
 * a different frame: `timeline.ts` checks the act fits, so a ripple edit that pushed a beat past the end
 * of the act's pinned frame is a build-time complaint rather than a beat nobody reaches.
 *
 * **It is also where the film ends, and that is a second job worth naming.** The act's frame is pinned for
 * exactly this many beats; at this position the sticky frame reaches the bottom of its box and starts
 * moving with the document, which is the instant the page stops being a held frame and becomes a page. By
 * then the printing has finished, so what scrolls away is not a film being interrupted — it is the Work
 * page leaving the top of the screen, which is what any page does.
 *
 * **6.4 → 4.7 → 3.2.** The choreography ends at 3.03 and the slack above it is 0.17, about 9vh on a
 * wheel — the plate and its one line, standing, for as long as it takes the hand to move. §52 removed a
 * claim, a second sentence and a crossing; §53 removed the object itself, and with it the aperture's
 * portrait geometry, the screen's own beat, the atmosphere's two ranges and the annotation's column. Six
 * movements where there were eleven, and the act is now shorter than either of the two chapters it
 * follows. `decisions.md` §53.
 */
export const ACT_BEATS = 3.2

/**
 * How much scrolling the act costs. Its own runway rather than more of the film's, because its length
 * is decided by what it has to say and the film's by what it has to show.
 *
 * The ratio between the two values is the film's own (1.5), and the price of a beat comes out at 55.0vh
 * on a wheel and 82.5vh on a thumb — exactly what a beat of the shot costs, for the first time. That is
 * deliberate and it is the only reason these are not rounder numbers: the act is the third act of the
 * same film, so a beat of it has to weigh the same in the hand as a beat of the first two.
 *
 * **440/660 → 352/528 → 258/388 → 176/264.** Every step is the same edit: fewer beats at the same price,
 * never a cheaper beat. What it buys is the number that actually matters on a phone — **the pinned
 * distance between arriving at Chapter III and scrolling a website falls from 528vh to 264vh**, and the
 * whole homepage from 1116vh of held frame to 852. Chapter III is no longer the longest thing on the site.
 * `decisions.md` §53.
 */
export const actPin = {
  fine: '176vh',
  coarse: '264vh',
} as const
