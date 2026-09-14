import { TIMING } from './timing'

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
 *
 * ## What is in here, in order
 *
 * **This is the central choreography configuration for the whole site.** Every value that decides
 * cinematic rhythm belongs in this file. `docs/development/03-choreography.md` is the convention, and
 * it is short: *a new animation, or a change to an existing one, is not finished until its parameters
 * are in here.*
 *
 *   §1  `beat`, `chapterOneStory`  Chapter I's arrival, in milliseconds. The only clock on the site.
 *   §2  `shotStory`                Chapter I → II, in beats of scroll: the black, the philosophy
 *                                  lockup, the four occasions, the cream transition, the sentence
 *                                  coming apart, the travelling word, Chapter III emerging.
 *   §3  `actStory`                 Chapter III's act: the mark, the room darkening, the object
 *                                  crossing aside, the annotation, the way out.
 *   §4  `methodStory`, `methodPin`, `methodArrival`, `SECONDS_TO_VH`
 *                                  The publication's held frame: the questions surfacing, the
 *                                  considerations accumulating, the gathering, the printing.
 *   §5  `persisting`, `relighting`, `afterTheFilm`
 *                                  The Environment's own lifetime, the Ledger's relighting, and the
 *                                  publication's clocked moments (About's arrival, a question
 *                                  opening, the Work aside).
 *   §6  `pace`, `rates`, `BEATS`, `pin`, `ACT_BEATS`, `actPin`
 *                                  Haste, reduced motion, and what a beat of each runway costs in
 *                                  scroll. Retimes nothing — only how far the hand travels.
 *   §7  `input`                    The spring between the wheel and the film.
 *   §8  `pricing`                  What a phase of a junction costs to cross.
 *   §9  `occasionsStory`           Junction 05 → 06: the three occasions and the sentence.
 *   §10 `atmosphere`               The light in the room, and the exposure at the turn.
 *
 * Sections 7 to 10 were composed on the B13 prototype and approved on 1 September 2026. Everything in
 * them is a fraction of a junction's own `0 → 1` unless it says otherwise, and nothing in them knows
 * about scroll — `pricing` alone decides what a fraction costs.
 */

/**
 * Chapter I's beats, in the order they happen.
 *
 * Compared as numbers by the sequencer, which only ever raises the value — so a beat cannot be
 * skipped and cannot arrive out of turn. **The ordinal order is therefore the clock's order**, and
 * `schedule` must be walked in the same one: the loop takes the last entry whose time has passed, so
 * a beat numbered before one that is due earlier would simply never fire. Two beats must also never
 * fall on the same millisecond, for the same reason — the later entry would silently swallow the
 * earlier. `LIGHT` sits 100ms in front of `TIMESTAMP_OUT` for exactly that.
 *
 * Nothing outside this file reads a beat by its number: `opening.tsx` compares the named constants,
 * and the only stylesheet that reads `data-beat` is the V2 layer's own gate.
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

     400   the time arrives, dead centre, the only thing on a black screen
     1000  it has settled, and holds
     1500  light begins arriving, and keeps arriving until 4700
     1600  the time begins to leave, as the image comes up behind it
     2000  the footage rolls — 500ms after the light, so the image is alive as it is lit
     2200  the time is gone, and the identity arrives in the same instant
     2850  the subtitle is allowed to arrive — if the footage agrees
     3600  the identity settles
     3850  the subtitle settles

   The footage was measured rather than guessed, and this is built around what it actually is:
   2880 × 1440, a 2:1 frame, 12.121s long, and palindromic. A landscape to 2.0s, a dissolve up
   finishing at 2.4s, the brighter shot to 9.8s, then a dissolve back to the landscape.
   ════════════════════════════════════════════════════════════════════════════ */

export const chapterOneStory = {
  /**
   * ⚓ The arrival time. **Dead centre, alone on black, and it leaves before the identity arrives.**
   *
   * A brief cinematic detail rather than metadata: it is the visitor's own moment, shown once as a
   * title card, and the studio's name then takes the screen it vacated. Design owner, 31 August 2026 —
   * *"TIME should be a brief cinematic detail, not metadata that stays beside the title."*
   *
   * `hold` is how long it sits at full before leaving; it takes `fade` to go, as it did to arrive. So
   * it is gone at `at + fade + hold + fade` = **2200**, which is the instant `chapterOne` arrives and
   * is meant to be. `timeline.ts` asserts that handover rather than trusting it.
   *
   * 600 rather than 1000 for the fade: this is a ~13px mark, and a fade calibrated for the 96px title
   * made its arrival unreadable as motion — it simply appeared. The 600ms hold is the perceptual beat
   * the mark needs to register as a statement rather than a preamble; measured in a visible Chrome,
   * 300ms read as a flicker.
   *
   * Drives `--fade-timestamp`.
   */
  timestamp: TIMING.chapterOne.timestamp,

  /**
   * ⚓ Light arriving on the photograph. The slowest thing in the sequence, and long enough that it
   * is still arriving when the identity begins — so the name emerges inside the light, not after it.
   *
   * Drives `--fade-video`.
   */
  video: TIMING.chapterOne.video,

  /**
   * ⚓ "Chapter One". The identity, and the visual centre — it takes the exact place the timestamp
   * occupied, so the studio's name arrives where the visitor's own moment was.
   *
   * An anchor rather than a relationship, because this is the moment the whole sequence is built
   * around. The timestamp is timed to have cleared the frame by exactly here.
   *
   * Drives `--fade-chapter-one`.
   */
  chapterOne: TIMING.chapterOne.chapterOne,

  /**
   * "The digital chapter begins here." The second level of the identity, not a caption.
   *
   * Drives `--fade-subtitle`.
   *
   * This is the one beat in Chapter I that the clock does not decide alone. It waits for the
   * footage's second shot as well, so the line lands on the brighter frame rather than on a
   * stopwatch — `afterChapterOne` and `waitsForFootageAt` together, whichever is later.
   */
  subtitle: TIMING.chapterOne.subtitle,

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
  navigation: TIMING.chapterOne.navigation,
} as const

/* ═══════════════════════ Chapter I → III · beats of scroll ═══════════════════════
   Nothing below has a duration. Read down and you have the shot.
   ═══════════════════════════════════════════════════════════════════════════════ */

export const shotStory = {
  /**
   * ⚓ Everything the hero says, leaving as one thing — so scrolling early cannot leave the title
   * fading in and out at once. Drives `--veil`.
   */
  heroWords: TIMING.shot.heroWords,

  /**
   * ⚓ The dark coming up over the footage, in two stages with a hold between them. The pause is the
   * whole point: it stops at `depth`, the marker arrives *there* — on the last of Chapter I rather
   * than on a blank screen — and only then does the rest of the light go.
   *
   * Drives `--dusk`.
   */
  blackTransition: TIMING.shot.blackTransition,

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
  /*
    **`at` is junction 01 → 02's own length, and it is V2's.**

    This anchor is where state 02 begins, so the distance between the hero and it *is* the junction —
    the displace happens across it, and nothing else decides how long the survivor has to cross the
    frame. It was **0.28**, which at 54.7vh a beat is 15.3vh: measured in a visible Chrome at 1440 × 760,
    the whole diagonal — the word crossing 470px and contracting from 96px to 11px — completed in 120px
    of scroll, about one notch of a wheel. Three frames, so it read as a cut rather than a movement.

    §3 authors this junction at **3.40s**, and C8 ruled those seconds are weight: `SECONDS_TO_VH` turns
    3.40 into 68vh, which at this runway's price is **1.244 beats**. That is what it is now. The design
    owner's decision of 29 August is the authority for taking V2's number over the build's: *the authored
    V2 values in the Final Spec remain authoritative; the 0.28 measurement is a V1 measurement only.*

    `BEATS` and `pin` grew by exactly this difference, so **every later beat keeps its own length and its
    own price** — they begin 0.964 beats further down the runway and are otherwise untouched.
  */
  chapterTwoMarker: TIMING.shot.chapterTwoMarker,

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
   * Inside a `hold` of 2.26 that leaves `Chapter II` standing whole for 0.86 first and `II Philosophy`
   * standing afterwards until the statement is due — a breath at each end, and both of them now longer
   * than one wheel notch, which is what they had to clear to be perceived at all. The mark has to be a
   * mark before it is allowed to leave, and it has to be one for a while before it is allowed to
   * change.
   *
   * Drives `--mkword`, `--mknum` and `--mktopic`.
   */
  chapterTwoBecomesPhilosophy: TIMING.shot.chapterTwoBecomesPhilosophy,

  /**
   * "Every unforgettable moment / has another chapter."
   *
   * `after` is the wait on black once the marker has gone — the silence that separates the page turn
   * from the statement. Drives `--statement`.
   */
  everyUnforgettableMoment: TIMING.shot.everyUnforgettableMoment,

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
  wedding: TIMING.shot.wedding,

  /** "An exhibition." Passing through, broadening rather than landing. Drives `--i2`. */
  exhibition: TIMING.shot.exhibition,

  /** "An artist." The same, and paired tightly to the one before it. Drives `--i3`. */
  artist: TIMING.shot.artist,

  /** "A final performance." Slowing again before the light comes back. Drives `--i4`. */
  finalPerformance: TIMING.shot.finalPerformance,

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
  creamTransition: TIMING.shot.creamTransition,

  /**
   * "Some moments deserve another chapter." Act III's first words.
   *
   * Placed against the *light* rather than the black, because the point is that it arrives while the
   * light is still coming up — so Act III is opening rather than opened. Drives `--close`.
   */
  someMomentsDeserve: TIMING.shot.someMomentsDeserve,

  /* ── Then the sentence is taken apart rather than removed ──────────────────────
     **The three beats below are V1's account of that and none of them draws anything any more.**
     What performs it is `TIMING.dock`, which spans junctions 06 → 07 → 08 as one gesture: the line is
     consumed a word at a time from the survivor outward while `chapter` escapes over it, on one
     `0 → 1`, starting on the same frame. These survive because `timeline.ts` chains state positions
     off them — see `iiiStudio` below, which is where that chain lands.
     ──────────────────────────────────────────────────────────────────────────── */

  /** "Some moments deserve" leaves. `hold` is how long the whole sentence sits first. Drives `--out1`. */
  leadLeaves: TIMING.shot.leadLeaves,

  /** "another" leaves, this long after the lead started going. Drives `--out2`. */
  anotherLeaves: TIMING.shot.anotherLeaves,

  /**
   * "chapter" travels to the corner, shrinking, and becomes the chapter marker. The slowest thing in
   * the whole shot, and the only element in the piece that moves — it earns it, because what changes
   * is what the word is *for*.
   *
   * `alone` is the breath before it goes: the word by itself at the centre, which is the beat that
   * makes the transformation legible. Drives `--tm`.
   */
  chapterTravels: TIMING.shot.chapterTravels,

  /** The period leaves this far into the travel — it belonged to the sentence, not to the marker. Drives `--stop`. */
  periodLeaves: TIMING.shot.periodLeaves,

  /**
   * **This beat no longer animates anything. It prices two junctions, and that is now its whole job.**
   *
   * It used to be *"III arrives beside the word and the word settles into Studio"*, driving `--swap`,
   * `--mark3` and `--handoff`. V1's travelling word is gone from the tree and the driver publishes
   * none of those three. What still reads it is `timeline.ts`'s `stateEntries`: **state 07 begins at
   * `iiiStudio.from` and state 08 at `iiiStudio.to`**, so this beat and nothing else decides how long
   * junction 06 → 07 and junction 07 → 08 are.
   *
   * That matters because those two junctions are where `TIMING.dock` now performs the whole of the
   * sentence → `chapter III` → `III WHAT WE ACTUALLY MAKE` → mark → rail sequence. At the old values
   * they were 2.16 beats and 0.20 — 3,280px against 320px at 1424 × 749 — and the gesture had to be
   * crammed into the short one and the junction after it. They are now **1.18 beats each**, because
   * the gesture's `0 → 1` divides by junction *count*: equal junctions are what make a window worth
   * the same number of pixels on either side of the boundary.
   *
   * `to` is unchanged, and `to` is both `handoffAt` and `endsAt` — so state 08, the act, the
   * publication and the length of the document are exactly where they were. **Only state 07 moves.**
   */
  iiiStudio: TIMING.shot.iiiStudio,

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
  chapterThreeStands: TIMING.shot.chapterThreeStands,

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
  studioEmerges: TIMING.shot.studioEmerges,
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
  navigation: TIMING.act.navigation,

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
  frame: TIMING.act.frame,

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
  quiet: TIMING.act.quiet,

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
  darkens: TIMING.act.darkens,

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
  annotation: TIMING.act.annotation,

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
  deepens: TIMING.act.deepens,

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
  belief: TIMING.act.belief,

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
  printing: TIMING.act.printing,

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
  wayOut: TIMING.act.wayOut,
} as const

/* ═══════════════════ The method, in beats of its own scroll ═══════════════════
   **The third runway, and the only one outside the film.**

   The publication is ordinary flow everywhere except here. This one section is a held frame, because what
   it does cannot be done in flow: the studio's questions arrive one at a time, each brings considerations
   into the space around them, the considerations **accumulate**, and then all of them **converge** into one
   line. Accumulation needs a frame that stays still while it fills; convergence needs the filled frame to
   still be there when it collapses. `decisions.md` §55.

   **And the section now turns the publication's material over while it does it.** The paper darkens to the
   studio's own ink as the frame is approached, the whole of the piece is spoken in light on that ink, and
   then the paper comes back and the answer is printed on it. `decisions.md` §56. Two consequences for this
   file, and both are new:

     - The **arrival is not a beat.** It happens before the frame is held, over a distance the layout
       decides rather than the runway, so it is stated in viewport heights and lives in `methodArrival`
       below. Everything else here is beats, as before.
     - The **resolution happens twice** — once in the dark and once printed — and the beats between them are
       Chapter III's own printing, in the same order and for the same reason: the type has to leave *before*
       the paper comes back rather than through it. `actStory.printing.clears` is the precedent and the
       argument. Light type crossing to dark type through a ground crossing the other way passes through a
       frame where the two have the same luminance, and that frame is unreadable.

   It is still the **cheapest** runway on the site — 40.0vh a beat against the act's 55.0 — and that is the
   number §55 argued and this keeps. It is no longer the *shortest*, because the section now does more:
   `methodPin` says why.

   Read down and you have it:

    -0.86  the paper begins to darken, a long way above the frame          ┐ viewport heights,
    -0.05  the room is whole, and the frame has not locked yet             ┘ not beats
     0.00  `Method`, and one line: *Tell us what matters.*
     0.54  the first question, arriving out of the depth on the page's own axis
     0.62  the first three considerations, one after another, at their own distances
     1.07  the second question — the first has receded back into the space it came from
     1.60  the third
     2.13  the fourth
     2.55  twelve considerations stand in the space, and nothing moves. The one stillness here.
     2.83  the convergence: every word travels to the point the questions stood on, and fades
     3.11  `Your experience` comes forward out of that point, while the last of them is still arriving
     3.67  it has stood in the dark long enough
     3.89  the light type has gone, and the frame is a dark room with nothing in it
     4.33  the paper is back
     4.17  `Your experience`, printed in ink, arriving through the last of the paper's return
     4.53  and the two lines under it. This is the frame the section ends on.
     4.75  done. `METHOD_BEATS` releases the frame at 5.0 and the page carries on, on paper.
   ═════════════════════════════════════════════════════════════════════════════ */

export const methodStory = {
  /**
   * ⚓ `Tell us what matters.` — the invitation, alone in the room.
   *
   * The only anchor in the section, and the only thing in it that is not a consequence of something else:
   * it is the frame's first state, so it is at zero by definition.
   *
   * **Its hold came down from 0.20 to 0.18**, and the four words it lost were bought back by the room. The
   * invitation used to carry the whole entrance on its own — it was the first thing in the section and the
   * only thing on the frame for 24vh. It is not any more: by the time it arrives the visitor has already
   * watched the page turn dark around them, so the line no longer has to do the work of announcing that
   * something has begun. `decisions.md` §56.
   *
   * It leaves the way the questions leave, because it is the first of them — the studio asking to be told
   * rather than asking a question of its own. Drives `--minvite`.
   */
  opening: TIMING.method.opening,

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
  asking: TIMING.method.asking,

  /**
   * **The field moving under the hand, and the only thing here that is not a beat.**
   *
   * A parallax: the whole space drifts as the visitor scrolls, near words travelling further than far ones,
   * so the frame answers *every* notch of the wheel rather than only the ones a cue happens to fall on.
   * §55's field was still between arrivals, and a held frame that does nothing while you scroll is the exact
   * feeling of a prototype. `decisions.md` §56.
   *
   * **`linear` is load-bearing and it is the one place in the project that does not use the curve.** Every
   * other range here is a beat — a thing that arrives, and therefore eases. This is a camera. A camera that
   * eased in at the top of the runway and out at the bottom would read as an animation of the space rather
   * than as movement through it, and the easing would be most visible exactly where the visitor is most
   * likely to stop. So it is a straight ramp across the whole accumulation, and `scroll.ts` gives it the one
   * function in that file with no curve in it.
   *
   * It runs from the frame's first beat to the start of the convergence, and `holdsPastTheGathering` is
   * **zero so that the convergence is the whole answer to when it stops**. Once the field is collapsing,
   * `--mspread` owns every offset in it; a camera still travelling under that would be two movements over
   * one set of coordinates, and the words would arrive at the focus along curves instead of along the twelve
   * straight vectors the gathering is. The same kind of authored zero as `studioBlocks.threshold`.
   *
   * `globals.css` owns *how far* it drifts, because a distance in a frame is composition and it changes with
   * the screen — the division `--m-ask-z` is already under.
   *
   * Drives `--mdrift`.
   */
  drift: TIMING.method.drift,

  /**
   * **Twelve considerations, standing, with nothing happening.**
   *
   * The stillness, and it is the same beat the act has for the same reason: `03-design-principles.md` §3 —
   * a pause is allowed to be the entire design of a moment. This is the moment the section exists to
   * produce, and the visitor has to be given a frame of it before it is taken apart.
   *
   * Measured from the **last word being fully lit**, so it is a real gap rather than an overlap. Drives
   * nothing. It is the reason the gap is there.
   *
   * Nothing happening is not the same as nothing moving: `drift` is still running under it, so the frame is
   * alive for the whole of this pause without a single thing in it arriving or leaving. That is what makes
   * 0.28 beats of stillness a composition being looked at rather than a page that has stopped.
   */
  gathered: TIMING.method.gathered,

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
  converge: TIMING.method.converge,

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
   * **`holds` is new, and it is the beat §55 did not have.** The answer used to be the last thing that
   * happened and then the frame was released, so the composition it resolved into was never once seen
   * standing. Now it stands in the dark room, alone and lit, before anything is done to it. It is the same
   * argument `gathered.holds` makes about the field, made about the line the field became.
   *
   * Drives `--manswer`.
   */
  resolve: TIMING.method.resolve,

  /**
   * **The printing.** The room gives the page back, and the answer is printed on it.
   *
   * Three beats and they are Chapter III's, in Chapter III's order — `actStory.printing`, where the act
   * stops being a film by becoming a plate on paper. The reasoning transfers exactly, and one line of it is
   * not a preference but a fact about light:
   *
   * **`clears` first, and it is not stylistic.** The type in the room is paper-coloured on ink and the type
   * on the page is ink on paper. Cross-fading one into the other while the ground crosses the other way puts
   * both at the same luminance somewhere in the middle, and at that frame the answer is invisible — measured
   * at about 1.1:1. So the light type *leaves*, the paper *returns* to an empty frame, and the answer is
   * *printed*. `--asaid` exists in the act for this exact reason: the type has to leave before the paper
   * comes back rather than through it.
   *
   * `whenReturnedIs` welds the printing to the return the way `wayOut.whenPrintedIs` welds the act's last
   * line to its own: at 0.62 the ground is most of the way back to paper and finishes on paper exactly, so
   * the answer arrives *on* a page rather than on a ground still going light.
   *
   * `linesAfter` is the last thing in the section, and the two lines exist **only** here. In §55 they
   * arrived in the dark under the answer and then the section ended; putting them after the printing means
   * the frame the visitor leaves on is fuller than the frame they arrived at, which is what a resolution is.
   *
   * Drives `--mclear`, `--mreturn`, `--mprint` and `--mlines`.
   */
  printing: TIMING.method.printing,
} as const

/**
 * How long the method's frame is held, in beats — the same kind of assertion `BEATS` and `ACT_BEATS` are.
 *
 * 5.0 against a resolved tail of 4.75, so the slack is 0.25: about **10vh of the finished frame standing on
 * paper** before the page carries on. §55 left 0.07 here and that was right when the section ended on the
 * last thing it did; it is wrong now, because the last thing it does is print a composition and a printed
 * composition that is released the instant it finishes was never actually shown. This is the settle the
 * section did not used to need.
 */
export const METHOD_BEATS = TIMING.distance.methodBeats

/**
 * How much scrolling the method costs. **Still the cheapest beat on the site.**
 *
 * 200/300 comes out at 40.0vh a beat on a wheel and 60.0 on a thumb, against 55.0 for a beat of the act and
 * 54.7 for a beat of the shot. That gap is the point rather than an accident: this is not a chapter, so a
 * beat of it must not weigh what a beat of the film weighs, and the ratio between the two values is the
 * film's own (1.5), because a thumb is not a wheel here either.
 *
 * **It is no longer the shortest frame on the site, and that was the trade.** §55 held 160vh against the
 * act's 176 and made the total length part of the argument; the section now inverts the page's material,
 * resolves in the dark, prints the resolution back onto paper and hands over on a composed frame, which is
 * 1.2 beats of work §55 did not have to do. Buying it by making a beat cheaper still would have taken a
 * question's dwell under the 20vh that makes it readable at speed — the one number in the section that was
 * not for sale. So the price per beat holds at a fifth under the film's, and the frame is longer.
 * `decisions.md` §56.
 */
export const methodPin = TIMING.distance.method

/**
 * **Where the room arrives, in viewport heights of scroll above the frame's own lock.**
 *
 * The one distance in the section that is not a beat, and it is not a beat because it does not happen inside
 * the held frame. It happens on the way to it: the paper darkens while the visitor is still reading the page
 * above, and by the time the frame locks the room is already whole. `decisions.md` §56.
 *
 * **Beats would have been the wrong unit and would have failed silently.** The approach is a layout distance
 * — a viewport, less the head margin, plus the band — so it is the same length however the runway is priced.
 * Beats are not: `--method-pin` is half as long again for a thumb, so the identical stretch of scroll is 2.2
 * beats on a wheel and 1.4 on a thumb, and a range authored in beats to fit one of them runs off the end of
 * the other. Stated in viewport heights it is the same movement on both, which is what it is.
 *
 * `begins` at 0.86 puts the first of the darkening about 100px below the fold as the section approaches, so
 * it starts while About is still on the screen and its own photograph — a dark room at night, with one lamp
 * in it — is still in the frame. That continuity is the whole entrance: the room in the picture becomes the
 * room the visitor is in. `settles` at 0.05 finishes it just short of the lock, so the frame is never seen
 * to arrive and go dark; it is dark when it arrives.
 *
 * Drives `--menter`, which `globals.css` composes with `--mreturn` into `--mroom`.
 */
export const methodArrival = TIMING.method.arrival

/* ═══════════════════ Junction 13 → 14 · persist · the rule does not move ═══════════════════
   **The first junction authored under C8, and the prototype that decides the model.**

   V2 §3 gives this junction the verb `persist` and a survivor: the rule at y529. §8 gives it a beat
   sheet in seconds, and §7 gives it the one implementation requirement it calls non-negotiable — the
   closing rule *"must be owned by the page, not by the list. It is one DOM node that persists into
   Contact. If it is a child of the accordion, leaving Questions unmounts it, and the entire locked
   13 → 14 mechanism becomes a coincidence the visitor cannot verify."*

   ## Seconds here are weight, not duration

   C8: **scroll owns progression; time owns only what the visitor did not cause.** Nobody caused this
   junction except by scrolling into it, so it is distance. The seconds below are V2's, transcribed
   verbatim, and they are kept as seconds for exactly one reason: they are how the composition states
   its **proportions**. `timeline.ts` divides them by `total` and never uses them as time.

   Read them as a score, not a timer. The gap between `releases` and `crosses` is what matters; whether
   that gap is 900 milliseconds or 18 viewport-hundredths is the conversion's business.

   ## Why this junction was built first

   It is the most timeline-shaped thing in V2 — nine cues, two staggers and a held-empty frame — so if
   it survives as distance, the other twelve do trivially. `implementation-reconciliation.md` C8.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * How much scroll one authored second of a junction is worth, in viewport-hundredths.
 *
 * **The one conversion constant C8 allows, and the only number here that is not V2's.** Derived rather
 * than picked: the shot spends about 55vh on a beat, and V2's opening junction — 01 → 02, quoted at
 * 3.40s — corresponds to roughly 1.3 beats of the existing build, which is about 72vh, or ~21vh per
 * authored second. 20 is that rounded to a number worth tuning.
 *
 * It is deliberately a *single* constant. Two would make one junction's seconds mean something
 * different from another's, and the whole point of keeping V2's seconds is that they are comparable.
 *
 * Tuning this changes how far the hand travels and retimes nothing: every proportion below is preserved.
 */
export const SECONDS_TO_VH = TIMING.distance.secondsToVh

/**
 * Junction 13 → 14, in V2's own seconds. §8's beat sheet, transcribed.
 *
 * Every value is an absolute offset from the junction's first frame rather than a relationship to the
 * cue before it — which is the one place this file breaks its own rule, and deliberately. §8 authors
 * them as absolutes on a single sheet, and re-expressing them as chained relationships would be a
 * second reading of a locked document rather than a transcription of it. `timeline.ts` chains nothing
 * here; it divides.
 */
export const persisting = {
  /** §8: *"0.00s hold 400ms"*. Nothing arrives. The junction opens by not opening. */
  holds: TIMING.environment.persisting.holds,

  /**
   * §8: *"0.40s release in place, 900ms, 40ms stagger, all seven other rules included"*.
   *
   * *Release in place* is §1's first law — the outgoing state falls to zero **where it stands**, so the
   * rows do not slide, reflow or collapse. The stagger is what makes the release read as a list letting
   * go rather than a section switching off.
   */
  releases: TIMING.environment.persisting.releases,

  /**
   * §8: *"1.30s crop opens on the same negative, wash lifts, ground darkens to the Contact grade, rule
   * ink crosses, 900ms"*.
   *
   * **The ink crosses with the ground, never on its own clock** — §8's table says so in as many words.
   * One property drives both, which is why there is one cue here and not two.
   */
  crosses: TIMING.environment.persisting.crosses,

  /**
   * §8: *"2.20s environment lands and **holds empty for 300ms** — ground, Ledger, one rule"*.
   *
   * **The cue under test.** As distance this stops being 300 milliseconds and becomes a stretch of
   * scroll in which the frame is composed and empty: a visitor who stops there holds it for as long as
   * they like, and one who is moving fast passes through it. That is a better reading of *"holds
   * empty"* than a timer gives, and it is the thing this prototype exists to prove.
   */
  empty: TIMING.environment.persisting.empty,

  /**
   * §8: *"2.60s headline, then 'Tell us about it.' at 2.80s directly above the rule"*.
   *
   * `over` is the gap between them rather than an authored fade: §8 gives the two arrivals and no
   * duration, and 0.20s is exactly what separates them — so the headline finishes arriving in the
   * instant the line beneath it begins. Derived from the sheet, not chosen.
   */
  headline: TIMING.environment.persisting.headline,
  tells: TIMING.environment.persisting.tells,
  arrives: TIMING.environment.persisting.arrives,

  /**
   * §8: *"2.90s rule shortens and thins"* — measure 1048 → 732, **right edge only**, and weight 2px → 1px.
   * §8's table calls both *"animated once, at 2.90s"*: the left origin and the y never animate at all.
   *
   * `over` is again the gap to the next cue — 2.90 to 3.20 — so the survivor has finished changing
   * before anything resolves on top of it. Nothing in §8 authors a duration here either.
   */
  resizes: TIMING.environment.persisting.resizes,

  /**
   * §8: *"3.20s section label, arrow and the three lines, 120ms stagger"*, against *"Total 3.60s"*.
   *
   * **Four slots, not five, and the sheet is what decides that.** Read literally as five staggered
   * things, the last would start at `3.20 + 4 × 0.12 = 3.68s` — past the total §8 states. Four slots put
   * the last at `3.20 + 3 × 0.12 = 3.56s`, and the 40ms left over is its arrival. So the label and the
   * arrow come together and the three lines follow, which is also the only grouping that reads: an arrow
   * is part of the line it belongs to, not a fifth thing arriving on its own.
   *
   * The first version of this file had five slots and `timeline.ts` refused it — the assertion exists
   * because this is exactly the kind of misreading that survives review and shows up as a junction that
   * quietly runs past its own end.
   */
  resolves: TIMING.environment.persisting.resolves,

  /** §8: *"Total 3.60s"*. Everything above is divided by this and nothing is compared to it. */
  total: TIMING.environment.persisting.total,
} as const

/* ═══════════════════ Junction 12 → 13 · relight · one room, one lightening ═══════════════════
   **The storyboard's turn 15, transcribed, and the order of its channels is the whole mechanism.**

   §3 gives this junction the verb `relight` and a survivor: the room. §10 marks it LOCKED. The
   storyboard gives it five beats and one sentence that decides everything below:

     *"The order of operations is the whole argument: temperature moves first, then value, then type.
     Warm → neutral at constant exposure, then neutral → blue at rising exposure, then blue → lit, and
     only then does ink appear."*

   Read as one ramp it is a fade to another background, which is the one thing §11.2 forbids. Read as
   three channels in order it is a room being relit — and that is why each beat below moves exactly one
   thing and holds the others.

   The seconds are weight, not duration, exactly as `persisting`'s are: `timeline.ts` divides them by
   `total` and the junction's own `0 → 1` carries them. The design owner adopted 5.40s as this
   junction's weight on 30 August 2026.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
export const relighting = {
  /**
   * Beat 2, *"the warmth recedes"*: saturation .70 → .28 and the amber source drains to a trace,
   * **at constant exposure**. *"Nothing gets darker or lighter here — only warmer to neutral."*
   *
   * Separating temperature from brightness is what stops the next beat reading as a fade: by the time
   * light moves, the warmth is already gone.
   */
  warms: TIMING.environment.relighting.warms,

  /**
   * Beat 3, *"night opens"*: the black opens into blue rather than lifting into grey — a deep cool
   * charcoal around L26, where the studio's shelves and the edge of the desk are just perceptible
   * again. Value rises here and colour does not.
   */
  blues: TIMING.environment.relighting.blues,

  /**
   * Beat 4, *"first light"*: light enters from the upper right — the same corner dawn enters at
   * Contact — and the hero's own sky band comes up *through* the studio, which is still present.
   * The plates cross **inside this beat** and nowhere else, which is what makes it a relight rather
   * than a swap.
   */
  lights: TIMING.environment.relighting.lights,

  /**
   * Beat 5, *"Questions, settled"*: the heading resolves inside the light and never before it —
   * *"type never arrives before the environment can hold it"*.
   */
  settles: TIMING.environment.relighting.settles,

  /** The storyboard's own total, and the weight the owner adopted. Everything above divides by it. */
  total: TIMING.environment.relighting.total,
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
  studioBlocks: TIMING.publication.studioBlocks,

  /**
   * The navigation answering a cursor. Interface feedback, not narrative — so it is fast, and it is
   * outside the haste multiplier: an interface that answered at a different speed depending on how
   * somebody scrolled two minutes earlier would be responding to the wrong thing.
   *
   * Drives `--fade-nav-hover`.
   */
  navHover: TIMING.publication.navHover,

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
   * Drives `--fade-studio-image`, `--studio-settle`, `--fade-studio-label`, `--in-studio-label`,
   * `--fade-studio-words` and the three `--in-studio-words-*` that `timeline.ts` derives from `step`.
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
    image: TIMING.publication.about.image,

    /** The mark, once the photograph is most of the way there. Opacity only — it is already home. */
    label: TIMING.publication.about.label,

    /**
     * The words. Three blocks — the opening sentence and the two paragraphs — arriving one after another
     * on the same fade, `step` apart, so the text is read into existence rather than switched on.
     *
     * `step` is small on purpose: at 240ms the blocks are plainly sequential and the whole paragraph is
     * still one gesture. Above about 400 it becomes a list of things appearing, which is what the brief
     * for this section rules out.
     */
    words: TIMING.publication.about.words,
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
  answer: TIMING.publication.answer,

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
  work: TIMING.publication.work,
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
  haste: TIMING.pace.haste,

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
  urgent: TIMING.pace.urgent,

  /**
   * The scroll speed at which `urgent` is reached, in pixels per millisecond.
   *
   * Between standing still and this, the clock scales smoothly — so scrolling faster really does make
   * the opening run faster, rather than flipping it between two speeds. A wheel notch is roughly
   * 100px, so continuous wheeling sits near 3; a hard flick on a phone peaks well above it and pins
   * the clock at `urgent`.
   */
  urgentAt: TIMING.pace.urgentAt,

  /**
   * How much of the measured scroll speed survives each frame.
   *
   * Raw per-frame deltas are far too noisy to drive a clock with — a wheel is a series of impulses,
   * not a velocity, and a phone reports nothing at all between momentum samples. This smooths them
   * into something continuous, and is also what makes the clock ease back down when the hand stops
   * rather than dropping to natural pace in one frame.
   */
  settle: TIMING.pace.settle,

  /** Reduced motion: the same sequence on a clock that runs faster still. Not one with beats removed. */
  reduced: TIMING.pace.reduced,

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
  maxStep: TIMING.pace.maxStep,
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
export const BEATS = TIMING.distance.shotBeats

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
export const pin = TIMING.distance.shot

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
export const ACT_BEATS = TIMING.distance.actBeats

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
export const actPin = TIMING.distance.act
/* ══════════════════════════════════════════════════════════════════════════════════════════════════
   §7 · THE INPUT LAYER · how the hand reaches the film
   ══════════════════════════════════════════════════════════════════════════════════════════════════

   Not choreography, but the thing every piece of choreography is sampled through, so it belongs in
   the same file as the beats it delivers.

   **A wheel notch moves the page by its full 100px in ONE frame.** Measured by dispatching real wheel
   events through Chrome's input pipeline and recording every wheel event, scroll event and animation
   frame:

       single notch              per-frame scroll delta:  0  100  0  0
       six rapid notches         0 100 0×17 100 0×14 100 0×20 100 0×15 100 0×18 100
       three notches, 350ms      3 frames of movement, 207 stalled frames

   Every other frame moves exactly zero, and it is identical with `--enable-smooth-scrolling` forced
   on, so the browser is not ramping it and there is nothing native to fight. The choreography was
   never stepped; it was being sampled at 100px intervals.

   So the driver renders from a **smoothed** position that follows the real one as a critically damped
   second-order system. Exponential smoothing is the obvious choice and it is wrong here: its velocity
   is (target − shown)/tau, so the instant the target jumps 100px the velocity jumps from zero — a step
   in velocity at the start of every notch, which is the micro-jump at the beginning of a movement. A
   second-order system answers a target jump with a step in ACCELERATION, so position stays C¹.

   Critically damped specifically: no overshoot, so a notch cannot bounce past and back, and the
   approach to rest is asymptotic, so there is no hard stop either. Retargeting mid-flight is
   continuous by construction, and reversal decelerates through zero rather than snapping.

   **It bends the purity rule, by a measured amount.** Scroll-driven state is a pure function of scroll
   position; a spring makes the PATH BETWEEN positions a function of history. It converges and snaps
   exactly to the real position, so every RESTING state is unchanged and only the transit is smoothed.
   Reverse purity still measures 0 mismatches — but it takes about 700ms of quiet to get there, because
   the last 400ms of that is closing a sub-pixel gap.
   ══════════════════════════════════════════════════════════════════════════════════════════════════ */

export const input = {
  /**
   * The spring's natural frequency, in radians per second. **This is the whole feel of the wheel.**
   *
   * Higher is tighter and faster, lower is calmer and longer. At 16 a single notch is visually
   * finished in about 300ms and exact after ~700ms; the largest single-frame movement falls from
   * 100px to 4.6px, and a notch spreads across 87 frames instead of one.
   */
  omega: TIMING.input.omega,

  /**
   * How much lag it takes to double `omega`, in pixels, and the ceiling on that.
   *
   * A single notch is answered calmly and a fast spin firmly, so the trail cannot run away and the
   * page can never feel like it is ignoring the hand. Continuous in the lag, so it introduces no
   * discontinuity of its own — physically a stiffening spring, not a mode switch.
   */
  stiffenAt: TIMING.input.stiffenAt,
  stiffenMax: TIMING.input.stiffenMax,

  /**
   * Above this, in pixels, the position snaps instead of springing. A jump this large is not a wheel
   * gesture — it is a scrollbar track-click, Home/End, or a restored scroll position — and springing a
   * thousand pixels reads as the page catching up.
   */
  snapAbove: TIMING.input.snapAbove,

  /** When the spring is this close and this slow, it converges exactly and the loop stops. */
  settleWithin: TIMING.input.settleWithin,
  settleBelow: TIMING.input.settleBelow,
} as const

/* ══════════════════════════════════════════════════════════════════════════════════════════════════
   §8 · SEGMENT PRICING · how much scroll a beat of a junction costs
   ══════════════════════════════════════════════════════════════════════════════════════════════════

   `--junction-at` was linear in scroll, so every phase of a junction got distance in exact proportion
   to its share of that junction. Measured on the approved prototype, that made **every hold shorter
   than two wheel clicks**:

       "A wedding." is discovered      277px    2.8 notches
       breathes                        140px    1.4 notches
       "An artist." is discovered      339px    3.4 notches
       breathes                        154px    1.5 notches
       "A memory." is discovered       372px    3.7 notches
       breathes — the longest rest     165px    1.7 notches

   All three holds together came to 529px — **5.3 notches for every breath in the sequence** — and only
   **25% of the distance across the three memories was hold**, against 75% movement. There was no phase
   where the film was simply being.

   So each phase carries a **price**, and the position is the inverse of the cumulative price. This is
   the same idea as `pin`, `actPin` and `methodPin` — per-segment prices on one position, a beat of the
   method costing less than a beat of the film — applied *inside* a junction rather than between
   runways. **It retimes nothing.** Every share, every easing and every phase boundary is unchanged;
   only the physical cost of crossing them moves.

   Give-ways stay at 1.00 deliberately: the cascade should still be quick. It is the LEAVING that
   should be cheap and the BEING that should be expensive.

   ── Two things measured rather than assumed ────────────────────────────────────────────────────────

   **The blur earns its place.** A piecewise-constant price gives a piecewise-LINEAR position, which
   puts a hard kink in rendered velocity at every phase boundary. Most boundaries are quiet — the
   type's easings start and end at zero velocity — but the arrivals deliberately open *inside* the
   give-way before them, so some are not. Measured, the largest second derivative of position with
   respect to scroll is **0.012 with the blur and 0.450 without it — thirty-seven times higher.**

   **The blur bleeds, so the prices are set against the measurement.** The holds are narrow (0.050 to
   0.059 of the junction) relative to the blur, so a meaningful part of their price leaks into the
   cheap phases either side; at the arithmetic prices the holds came back **12% short**. The numbers
   below are tuned against the measured result, not the arithmetic one.
   ══════════════════════════════════════════════════════════════════════════════════════════════════ */

/** One priced span of a junction: from, to, and what a unit of it costs relative to the default. */
export type Price = readonly [from: number, to: number, cost: number]

export const pricing = {
  /**
   * How far the price is smoothed before it is integrated, as a fraction of a junction. 0.010 is about
   * 49px of scroll at junction 05's length — far wider than a frame, far narrower than any phase.
   */
  blur: TIMING.memories.pricingBlur,

  /** Samples used to build the cumulative price. 4096 puts the inversion error far below one pixel. */
  resolution: TIMING.memories.pricingResolution as number,

  /**
   * **Junction 05 → 06 — the occasions, and the handoff into the sentence.**
   *
   * The one junction whose choreography has been composed and approved beat by beat. The other twelve
   * are unpriced and cost 1.00 everywhere, which is exactly what they did before; adding a table here
   * is how one of them gets its own rhythm.
   *
   * Measured result at the prices below, in wheel notches, against what they were:
   *
   *     "A wedding." is discovered      2.8 → 3.7      breathes            1.4 → 3.8
   *     "An artist." is discovered      3.4 → 4.4      breathes            1.5 → 4.2
   *     "A memory." is discovered       3.7 → 4.8      the longest rest    1.7 → 4.8
   *     still · the survivor alone      1.6 → 4.0      the dip floor       0.8 → 2.1
   *
   * "A wedding." settled to "A memory." settled goes from 11.7 notches to **19.4**, and hold-to-
   * movement across that stretch from **25:75 to 41:59**. No uniform lengthening could have changed a
   * ratio — it would only have made the arrivals long while the holds still were not holds.
   */
  five: TIMING.memories.pricing as readonly Price[],
} as const

/* ══════════════════════════════════════════════════════════════════════════════════════════════════
   §9 · JUNCTION 05 → 06 · the occasions, and the sentence they become
   ══════════════════════════════════════════════════════════════════════════════════════════════════

   The approved choreography, as a fraction of the junction's own 0 → 1. Everything here was composed
   and judged on the prototype and carried across unchanged; the prices in §8 decide what each costs to
   cross, and nothing here knows about scroll.

   **An arrival is three channels on three clocks.** A phrase does not fade in at its final position —
   that is the definition of an element being animated rather than a thing being found. It RESOLVES:
   the tracking closes first and runs longest, the ink rises after the tracking and finishes before it
   so the phrase is legible before it is settled, and the vertical settle starts last and ends last.
   Three staggered channels mean no two things in the frame are ever on the same clock, which is what
   stops an exchange reading as one switch.

   **And the three are not the same gesture three times.** Each arrival is longer than the last, each
   rest is longer than the last, and each phrase arrives MORE RESOLVED than the one before — the
   tracking opens less and the settle is shorter. The sequence becomes more certain as it goes, so
   "A memory." lands hardest and the emphasis it is given next is the top of a build rather than a new
   idea.

   **A give-way is position leading ink.** The outgoing phrase's move begins well before the incoming
   has arrived, and its ink only starts falling once the move is underway and finishes after it. At the
   moment the new phrase is inking, the old one is TRAVELLING at nearly full presence — two different
   kinds of change, not two opacities crossing, which is what removes "fade out → fade in".
   ══════════════════════════════════════════════════════════════════════════════════════════════════ */

export const occasionsStory = {
  /**
   * The three arrivals. `from`/`to` is the window on the junction; `track` is how far the tracking is
   * opened at the start, in em; `rise` is the vertical settle in pixels.
   *
   * **inOutQuart on the tracking, not outQuint.** Measured, outQuint spent 90% of its travel in the
   * first 38% of the window — the tracking was down to 0.43px of 4.0 while the phrase was still only
   * 30% inked, so the "discovered" cue was over before there was anything to see. An ease-in-out HOLDS
   * the phrase open while it inks and resolves it afterwards.
   */
  arrivals: TIMING.memories.arrivals,

  /**
   * Where the channels sit inside an arrival's window, as fractions of it. The tracking runs to 0.92
   * of the window; the ink runs from 0.14 to 0.72; the settle runs from 0.26 to the end.
   */
  channels: TIMING.memories.channels,

  /**
   * §4's stack: one optical centre at three sizes, each new occasion displacing the previous upward.
   * `y` is on the 760 reference frame, `size` in px, `ink` the share of full.
   */
  ladder: TIMING.memories.ladder,

  /**
   * The two exchanges. Position leads, ink lags, and the second is **cascaded** — the nearer phrase
   * leads and the older one starts 0.012 later and takes longer, so the stack never moves as a block.
   *
   * **inOutQuart on the travel.** outQuint put 90% of the displacement inside 76px — under a wheel
   * notch — which reads as a jump, not a move.
   */
  giveWays: TIMING.memories.giveWays,

  /** The first two release in place, cascaded, leaving the survivor alone at the centre. */
  release: TIMING.memories.release,

  /**
   * The survivor's moment: it is given a little scale, a little tracking and a lift in ink, and
   * nothing else in the frame moves while it happens.
   */
  emphasis: TIMING.memories.emphasis,

  /**
   * The survivor comes apart — **outermost word first**. `endsLead` is how much of the window the
   * outermost word is given ahead of the innermost; `drift` is how far each word travels outward as it
   * goes, as a share of its own offset from the centre.
   */
  deconstruction: TIMING.memories.deconstruction,

  /**
   * The sentence grows out of the survivor's own footprint rather than arriving over it. `from` is the
   * scale it starts at; `wordLead` staggers the words outward from the centre.
   *
   * **`from` is a footprint match and it is currently wrong.** 0.44 was chosen against
   * "A final performance.", which measured 370px at the survivor's size; the sentence at full width is
   * 812px, and 0.44 × 812 = 357px. "A memory." measures **197px**, so the sentence now begins 81%
   * wider than the thing it is supposed to grow out of. The matching value is **0.243**. Left at 0.44
   * because the text change was approved and this was not; it is one number when it is.
   */
  sentence: TIMING.memories.sentence,
} as const

/* ══════════════════════════════════════════════════════════════════════════════════════════════════
   §10 · THE ATMOSPHERE · the light in the room, and the exposure at the turn
   ══════════════════════════════════════════════════════════════════════════════════════════════════

   **The light does not travel. It breathes, and it drifts a little while it does.**

   Two independent channels, and keeping them independent is the whole architecture. THE STATE is where
   the light is, how gathered it is at rest, how strong and how warm — four eased ramps with real
   stillness between them, and it settles. THE BREATH is a transient opening and closing keyed to the
   typography's own give-way and arrival windows, not indexed by the state at all, and it returns to
   zero every time.

   **Why the breath is the primary gesture.** A frame-sized field that TRANSLATES lets the eye name what
   moved and where it went, which is what reads as an animated graphic; measured on the version that did
   it, the right third of the frame lost 35% of its light while the left third gained 370%. An expansion
   has no direction. There is nothing to track and nowhere for it to have gone.

   **And it is why the light can be large without washing the frame.** The field is at its broadest only
   DURING a transition and gathers between them, so the frame is directional whenever a phrase is being
   read and open only in the moments one is being released. Largeness happens exactly when nobody is
   reading. As it expands its peak comes down, so it recedes in definition as it grows in extent and the
   frame gets *less* contrasty at the moment the typography is doing its most legible work.

   ── The ending, and why it is an exposure move ─────────────────────────────────────────────────────

   Measured on the version before it, the frame's mean luminance sat flat at 9.3 → 9.0 → 8.8 → 9.0 →
   8.0 → 8.9 → 9.7 → 9.8 across the whole handoff. **Nothing in the exposure marked the chapter turn**,
   and the band the type lives in went 13.1 → 6.2 — the payoff arrived lit *worse* than the setup.

   So: **the room draws its breath in, and what comes back up is a different room.** A dip over the
   whole frame, the type included, because that is what an exposure change is and anything less is a
   website transition. The change of ground happens across the floor and the early rise, so the viewer
   crosses a threshold of darkness instead of watching two grounds cross-dissolve. The fall starts at
   0.812 and the survivor does not come apart until 0.818 — six thousandths in which, once and only
   once, the atmosphere is the cause and the type follows.
   ══════════════════════════════════════════════════════════════════════════════════════════════════ */

export const atmosphere = {
  /**
   * The source. Three offset terms of ONE falloff — a compact core, a body pulled down and left, a
   * shoulder pushed up and right — on one element with one opacity and one temperature.
   *
   * **Why three and not one.** A gradient spanning N code values over D pixels puts one 8-bit contour
   * every D/N pixels; measured on a single-term version, 17.3 levels over a 660px radius banded every
   * 26–28px and every contour was a closed concentric ellipse. Dimming makes it WORSE — fewer levels
   * over the same distance is a *wider* band. Because these three have different centres, no two
   * iso-luminance curves in the sum are concentric, and a ring is recognisable *because* it is
   * concentric.
   *
   * `rx` is in vw, the aspect turns it into vh, `at` offsets the term's centre in vw/vh, `alpha` is
   * its share of the composite.
   */
  source: TIMING.atmosphere.source,

  /**
   * The grain, and it is material rather than machinery. Black at alpha a over backdrop b resolves to
   * b(1 − a), so the modulation is multiplicative on the exposure — proportional to the light and
   * vanishing in the black, exactly as grain in a photograph is a property of exposure rather than a
   * layer over the print.
   *
   * It is what buys the size: with it the measured contour run-length is 1px at any extent, so extent
   * is free to be chosen for the composition alone. `mean` is a flat darkening and is compensated in
   * `exposure` below. Masked to the light's support so the unlit frame is untouched.
   */
  grain: TIMING.atmosphere.grain,

  /** The absolute exposure. The intended 0.100 divided by (1 − grain.mean) — keep the compensation. */
  exposure: TIMING.atmosphere.exposure,

  /** How far the room opens on a breath, and how much of its peak it gives back doing it. */
  breathScale: TIMING.atmosphere.breathScale,
  breathDim: TIMING.atmosphere.breathDim,

  /**
   * The room's settled states. `x`/`y` in vw/vh, `scale` the gathered size, `ink` relative to
   * `exposure`, `warmth` a `saturate()`.
   *
   * **Warmth above 1 is why the ending is not a return.** "A wedding." is warm at 1.02 and the last
   * state is warmer still at 1.22 — the amber is pushed past where it began rather than back to it.
   * With a position 5.2vw left, a larger gathered size and more light, there is no channel on which
   * the last state matches the first.
   */
  states: TIMING.atmosphere.states,

  /**
   * When the room moves between those states. **Real stillness between them is authored**: 0.150–0.176,
   * 0.362–0.376, and 0.586–0.640, the longest. Ramp 4 ends at 0.790 so the drift is finished before the
   * pause rather than grinding on underneath it, and ramp 5 settles at 0.985 — *after* the sentence has
   * settled at 0.961, so the atmosphere arrives behind the words and comes to rest last.
   */
  stateRamps: TIMING.atmosphere.stateRamps,

  /**
   * The breaths: `open` then `close`, and an amplitude. Each opens BEFORE its give-way and closes AFTER
   * the phrase has settled — the room answers, it never accompanies.
   *
   * **The three are not the same breath**: 1.00 / 1.32 / 0.42 and three different durations, because
   * three identical breaths are a loop. The fourth is the only one with a NEGATIVE amplitude — the room
   * gathers inward as the exposure falls, so at the floor there is a small dense ember alive in the
   * dark rather than a wide flat field, and that ember is the thread the frame is carried across on.
   */
  breaths: TIMING.atmosphere.breaths,

  /**
   * The exposure dip. One parameter and three windows; the hold between the fall and the rise is
   * simply the gap between them, a floor rather than a keyframe.
   *
   * Measured: the frame falls to 26% of its pre-dip level, holds, and returns to 157%, and the sentence
   * lands on a ground of 15.4 where it used to get 6.2.
   */
  dip: TIMING.atmosphere.dip,

  /**
   * When the black ground gives way to the photograph. Retimed into the dip so it is no longer an event
   * you watch — it is what has happened by the time the exposure comes back.
   */
  groundSwap: TIMING.atmosphere.groundSwap,
} as const
