/**
 * The storyboard, resolved.
 *
 * `story.ts` states anchors and relationships, because that is how pacing is composed and judged.
 * The sequencer and the scroll driver need absolute numbers. This file is the one place that turns
 * one into the other, so the relationships are stated once and the absolutes are never written down
 * at all.
 *
 * Nothing here is editable. There is not a single timing in this file — every value below is derived
 * from `story.ts`, and if you want to change the piece, that is where you go.
 *
 * ## Why the chain runs forward
 *
 * A beat that is `after` another one is placed after that beat has completely **gone**, not after it
 * arrived. That is what makes a ripple edit safe: lengthening a hold moves everything downstream and
 * preserves every gap, and two beats can never overlap while every `after` is positive. It is also
 * how the act was described in prose before it was code — "a longer breath after the wedding" is a
 * gap between a departure and an arrival.
 *
 * ## What is asserted, and why
 *
 * Several things in the piece are true by intention rather than by construction, so they are checked in
 * development rather than trusted:
 *
 *   - the timestamp has cleared the frame at the exact instant the identity arrives. Both sides are
 *     authored — one as an anchor, one as a hold — so nothing structural keeps them equal.
 *   - every gap is positive. Chaining makes overlap impossible *while that holds*, and a negative
 *     offset is the one way back to two beats sharing a frame.
 *   - the two offsets measured *backwards* — the numeral's arrival and Chapter III's opening — cannot
 *     reach back past the beat they belong to.
 *   - the whole shot fits inside `BEATS`, so a ripple edit cannot push the tail of the shot past the
 *     end of the pinned frame where nobody would ever see it.
 *
 * Each is a failure `01-validation.md` names specifically: everything passes, and the work is worse
 * somewhere the compiler cannot see. A check is cheaper than a replay.
 *
 * Note what is *not* checked, because it cannot happen: the occasions running into the cream
 * transition. The cream is chained to the last occasion, so it moves with it. That was a real
 * constraint when positions were absolute, and the chain removed it rather than guarding it.
 */

import { clamp01, smoothstep, unsmoothstep } from './easings'
import {
  ACT_BEATS,
  BEATS,
  METHOD_BEATS,
  actStory as act,
  afterTheFilm,
  beat,
  chapterOneStory as one,
  methodStory as method,
  pace,
  shotStory as shot,
  type Beat,
} from './story'

/** Trims the float noise of adding two decimals, so a derived value is the number it should be. */
const r = (n: number): number => Math.round(n * 1e6) / 1e6

/** A resolved range, in whatever unit its section uses. */
export interface Span {
  readonly from: number
  readonly to: number
}

/** A resolved beat that arrives, sits, and leaves. */
export interface Cue {
  readonly enter: Span
  readonly exit: Span
  /** When it has completely gone — what the next beat chains from. */
  readonly gone: number
}

/** Resolves `{ at | after, fadeIn, hold, fadeOut }` against the point the previous beat vanished. */
const cue = (
  start: number,
  b: { readonly fadeIn: number; readonly hold: number; readonly fadeOut: number },
): Cue => {
  const lit = r(start + b.fadeIn)
  const leaves = r(lit + b.hold)
  const gone = r(leaves + b.fadeOut)
  return { enter: { from: start, to: lit }, exit: { from: leaves, to: gone }, gone }
}

/* ────────────────────────────── Chapter I · milliseconds ────────────────────────────── */

const timestampLit = r(one.timestamp.at + one.timestamp.fade)
const timestampOut = r(timestampLit + one.timestamp.hold)
const timestampGone = r(timestampOut + one.timestamp.fade)

/**
 * The absolute moments of Chapter I, in milliseconds of the sequence's own clock.
 *
 * `navigation` is absent on purpose: it is measured from when the subtitle *actually* landed, which
 * depends on the footage and is therefore only known at runtime. The sequencer applies
 * `story.navigation.afterSubtitle` to the real arrival.
 */
export const cues = {
  /** The timestamp appears. */
  timestamp: one.timestamp.at,
  /** Light begins entering the frame. */
  light: one.video.at,
  /** The timestamp has held long enough and begins leaving. */
  timestampOut,
  /** The footage rolls. */
  motion: r(one.video.at + one.video.rollsAfterLight),
  /** The identity arrives — as the timestamp finishes clearing the frame. */
  identity: one.chapterOne.at,
  /** The earliest the subtitle may arrive. The footage gate may hold it longer. */
  subtitle: r(one.chapterOne.at + one.subtitle.afterChapterOne),
  /** Derived reference point: when the timestamp has completely gone. */
  timestampGone,

  /**
   * Measured from where the subtitle *actually* landed, because that moment is footage-gated and only
   * known at runtime. Both in milliseconds of the sequence's own clock.
   */
  interfaceAfterSubtitle: one.navigation.afterSubtitle,

  /**
   * When the opening is over and the shot may begin.
   *
   * Not when the interface *arrives* — when it has finished arriving. Releasing the shot on the
   * interface's first frame would let a visitor who is already scrolling hard fade the navigation out
   * through the veil while it was still fading in, and never see the beat at all. That is skipping by
   * another name, and the opening is mandatory.
   *
   * Virtual milliseconds are the right unit for this even though the fade is a CSS duration: CSS
   * divides every Chapter I duration by `--haste` and the clock multiplies by exactly its reciprocal,
   * so a fade of `fade` virtual ms always takes `fade` virtual ms, whatever rate the clock is running.
   */
  introDoneAfterSubtitle: r(one.navigation.afterSubtitle + one.navigation.fade),
} as const

/**
 * The closest two beats of Chapter I ever get, in milliseconds of its own clock.
 *
 * Derived rather than declared, so it cannot go stale when a relationship in `story.ts` is retimed.
 * Beats that share an instant on purpose — the timestamp starting to leave as the footage rolls — are
 * one moment, not a gap of zero, so they are de-duplicated first.
 */
const distinct = [
  ...new Set([cues.timestamp, cues.light, cues.timestampOut, cues.motion, cues.identity, cues.subtitle]),
].sort((a, b) => a - b)

export const closestBeats: number = Math.min(
  ...distinct.slice(1).map((at, i) => r(at - distinct[i])),
  cues.interfaceAfterSubtitle,
)

/**
 * The most virtual time one frame may add, in milliseconds — the guarantee that **no beat is ever
 * skipped**, however hard the visitor is scrolling.
 *
 * `pace.maxStep` bounds the real time a frame contributes, which protects the clock from a slow
 * thread. It does nothing about a *fast clock*: at three times natural pace a dropped frame would
 * advance the sequence far enough to make two beats due at once, and they would appear together. Two
 * beats in one frame is a skip as far as anyone watching is concerned.
 *
 * A third of the closest gap, so consecutive beats are always at least three frames apart. Never below
 * `pace.maxStep`, because at natural pace a frame can already contribute that much and capping below
 * it would slow the opening nobody asked to hurry — that floor is what makes this invisible unless the
 * clock is actually running fast.
 */
export const maxAdvance: number = Math.max(pace.maxStep, Math.min(200, closestBeats / 3))

/* ──────────────────────────── The shot · beats of scroll ──────────────────────────── */

const marker = cue(shot.chapterTwoMarker.at, shot.chapterTwoMarker)
const statement = cue(r(marker.gone + shot.everyUnforgettableMoment.after), shot.everyUnforgettableMoment)

/*
  `CHAPTER II` becoming `II Philosophy`, entirely inside the marker's hold — so it is measured from
  `marker.enter.to`, the instant the mark has finished arriving, and nothing about it can move the
  statement or anything after it.

  The numeral's start is solved rather than authored: `unsmoothstep` gives the progress at which the
  word's fade has reached `numeralSetsOffWhenWordIs`, which is the overlap that was actually decided.
*/
const becomes = shot.chapterTwoBecomesPhilosophy
const wordFrom = r(marker.enter.to + becomes.whole)
const wordTo = r(wordFrom + becomes.wordLeaves)

const numeralFrom = r(wordFrom + becomes.wordLeaves * unsmoothstep(becomes.numeralSetsOffWhenWordIs))
const numeralTo = r(numeralFrom + becomes.numeralTravels)

const topicFrom = r(numeralTo + becomes.topicAfterNumeral)
const topicTo = r(topicFrom + becomes.topicFade)

const wedding = cue(r(statement.gone + shot.wedding.after), shot.wedding)
const exhibition = cue(r(wedding.gone + shot.exhibition.after), shot.exhibition)
const artist = cue(r(exhibition.gone + shot.artist.after), shot.artist)
const finalPerformance = cue(r(artist.gone + shot.finalPerformance.after), shot.finalPerformance)

const warmthFrom = r(finalPerformance.gone + shot.creamTransition.after)
const lightFrom = r(warmthFrom + shot.creamTransition.lightAfterWarmth)

const closeFrom = r(lightFrom + shot.someMomentsDeserve.afterLight)
const closeTo = r(closeFrom + shot.someMomentsDeserve.fade)

const leadFrom = r(closeTo + shot.leadLeaves.hold)
const anotherFrom = r(leadFrom + shot.anotherLeaves.afterLead)
const anotherTo = r(anotherFrom + shot.anotherLeaves.fade)

const travelFrom = r(anotherTo + shot.chapterTravels.alone)
const travelTo = r(travelFrom + shot.chapterTravels.fade)

const iiiFrom = r(travelTo - shot.iiiStudio.beforeTravelEnds)
const iiiTo = r(iiiFrom + shot.iiiStudio.fade)

/*
  Chapter III's first page comes into existence *while* the word travels, so the two share an instant:
  the emergence starts exactly where the travel starts. Its end is solved rather than authored — the
  range whose smoothstep passes `litWhenTheMarkerLands` at the moment the marker lands.
*/
const emergeFrom = travelFrom
const emergeTo = r(emergeFrom + (iiiTo - emergeFrom) / unsmoothstep(shot.studioEmerges.litWhenTheMarkerLands))

const duskFirst: Span = { from: shot.blackTransition.at, to: r(shot.blackTransition.at + shot.blackTransition.fade) }
const duskRestFrom = r(duskFirst.to + shot.blackTransition.bridge)

/**
 * The absolute shot, in beats. What the driver reads.
 *
 * Resolved once at module load — these are constants, not a function of anything at runtime.
 */
export const spans = {
  heroWords: { from: shot.heroWords.at, to: r(shot.heroWords.at + shot.heroWords.fade) } as Span,

  dusk: {
    depth: shot.blackTransition.depth,
    first: duskFirst,
    rest: { from: duskRestFrom, to: r(duskRestFrom + shot.blackTransition.restFade) } as Span,
  },

  marker,

  /**
   * The mark rewriting itself. Three overlapping ranges and one blur depth, all inside `marker`'s hold.
   *
   * `becomesBlur` is a distance rather than a fade, which is why it rides on the word's own range
   * instead of having one of its own: the word loses focus *as* it goes, not afterwards.
   */
  becomesWordLeaves: { from: wordFrom, to: wordTo } as Span,
  becomesNumeralTravels: { from: numeralFrom, to: numeralTo } as Span,
  becomesTopicArrives: { from: topicFrom, to: topicTo } as Span,
  becomesBlur: becomes.blur,

  statement,
  wedding,
  exhibition,
  artist,
  finalPerformance,

  warmth: { from: warmthFrom, to: r(warmthFrom + shot.creamTransition.warmthFade) } as Span,
  dawn: { from: lightFrom, to: r(lightFrom + shot.creamTransition.lightFade) } as Span,

  close: { from: closeFrom, to: closeTo } as Span,
  leadLeaves: { from: leadFrom, to: r(leadFrom + shot.leadLeaves.fade) } as Span,
  anotherLeaves: { from: anotherFrom, to: anotherTo } as Span,
  travel: { from: travelFrom, to: travelTo } as Span,
  periodLeaves: (() => {
    const from = r(travelFrom + shot.periodLeaves.afterTravelStarts)
    return { from, to: r(from + shot.periodLeaves.fade) } as Span
  })(),
  iiiStudio: { from: iiiFrom, to: iiiTo } as Span,

  /**
   * Chapter III's first page coming into existence under the travelling word. Starts with the travel;
   * outlasts the pinned frame on purpose, because what it drives is the page below it.
   */
  studioEmerges: { from: emergeFrom, to: emergeTo } as Span,

  /** Where the travelling word hands over to the fixed marker. A step, not a ramp. */
  handoffAt: iiiTo,

  /** Where the shot stops asking for scroll. */
  endsAt: iiiTo,
} as const

/* ──────────────────────── Chapter III's act · beats of its own frame ──────────────────────── */

/*
  Numbered from the instant the act's frame reaches the top of the viewport. Nothing here knows about the
  shot's beats and nothing in the shot knows about these — the two are separate runways, joined by scroll
  position and by exactly one value: `--studio`, which opens the first third of the aperture before this
  frame is even pinned.

  Three offsets are solved backwards, and each is a place the brief asked for an *overlap* rather than a
  sequence: the annotation arriving inside the darkening, the way out arriving inside the printing, and the
  aperture's own first stage belonging to the film. In each case what is authored is how far through the
  previous movement the next one starts, and `unsmoothstep` turns that into the offset.

  One joint in the act is deliberately **not** an overlap. `quiet.holdsWhole` is a real gap between the
  aperture finishing and the light beginning to move, and it is the only stillness in Chapter III.
*/
const navigation: Span = { from: act.navigation.at, to: r(act.navigation.at + act.navigation.fade) }

/*
  The aperture. Its range starts at zero because a share of it — `opensWithTheMark` — has already been
  opened by the film, under the travelling word: `shotStory.studioEmerges`, on the other runway. The two
  stages are added in CSS as `--aperture`, exactly the way `--adusk` adds its own two, so neither driver
  needs to know the other exists.
*/
const frameFrom = 0
const frameTo = r(frameFrom + act.frame.fade)

/* The stillness. Not a range — a gap, and the only one here. */
const quietTo = r(frameTo + act.quiet.holdsWhole)

const darkFrom = r(quietTo + act.darkens.beginsAfterTheQuiet)
const darkTo = r(darkFrom + act.darkens.fade)

/*
  The work being named, inside the darkening rather than after it. `arrivesWhenDuskIs` is how far through
  the light's own movement the type appears, solved backwards — so the room dimming and the work acquiring
  a name are one gesture, and the legibility assertion below holds it to a ground dark enough to carry
  white.
*/
const annotation = cue(
  r(darkFrom + act.darkens.fade * unsmoothstep(act.annotation.arrivesWhenDuskIs)),
  act.annotation,
)

/*
  The second stage of the dark rides the annotation's **departure**, so the description leaves with the
  light rather than being swapped for the next sentence. It has no position of its own, and that is the
  point: there is nothing here for a retiming to knock out of step.
*/
const deepFrom = annotation.exit.from
const deepTo = r(deepFrom + act.deepens.fade)

const beliefFrom = r(annotation.gone + act.belief.after)
const beliefTo = r(beliefFrom + act.belief.fade)

/*
  The printing. One range carrying three things — the light coming back, the frame drawing in to a plate,
  and the in-frame type leaving ahead of both. `clears` is the share of it the type takes, and it is a
  legibility number: see `story.actStory.printing`.
*/
const printFrom = r(beliefTo + act.printing.afterTheBelief)
const printTo = r(printFrom + act.printing.fade)
const clearsTo = r(printFrom + act.printing.fade * act.printing.clears)


/* The way out, printed on the paper as the paper returns. */
const outFrom = r(printFrom + act.printing.fade * unsmoothstep(act.wayOut.whenPrintedIs))
const outTo = r(outFrom + act.wayOut.fade)

/**
 * Chapter III's act, resolved. What the driver reads for the second pinned frame.
 *
 * One composition transforming, and the composition is the work: the aperture finishes what the film's mark
 * started, the work is alone and lit for a beat, the room goes to evening and the work is named inside its
 * own frame, the light goes down to a trace and the studio says the one thing it says here, and then the
 * light comes back as the frame draws in and is printed into a plate with the way out beneath it.
 */
export const actSpans = {
  /** The masthead's links arriving beside the mark the travelling word became. */
  navigation,

  /** The aperture, opening vertically from the frame's own centre. */
  frame: { from: frameFrom, to: frameTo } as Span,

  /**
   * The share of that aperture the **film** opens, under the travelling word — the one value that reaches
   * across the two runways. `globals.css` adds the two stages; `transitions.ts` publishes this.
   */
  apertureWithTheMark: act.frame.opensWithTheMark,

  /**
   * Where the stillness ends. Not a range and nothing drives it — it is here so the assertions can hold
   * the gap open, and so `transitions.ts` can put `#work` at the beat the work is whole.
   */
  quietTo,

  /**
   * The dark, in two stages, with the work's own name between them — the same shape as the dusk at the end
   * of Chapter I.
   *
   * One stage each rather than a leading warm wash: the ground under them is a photograph, not paper.
   * `story.actStory.darkens`.
   */
  dusk: {
    depth: act.darkens.depth,
    deep: act.deepens.depth,
    first: { from: darkFrom, to: darkTo } as Span,
    rest: { from: deepFrom, to: deepTo } as Span,
  },

  /**
   * The work being named, arriving inside the darkening.
   *
   * One range, two lives. The **title** rides `annotation.enter` and stays — `--atitle` — because the
   * studio's line is a reading of this work and the frame that carries it has to still say which. The two
   * lines are the cue: they arrive with the name and give the space up to the studio's own voice.
   */
  annotation,

  /** The work's name, arriving with its two lines and staying until the printing takes it. */
  title: annotation.enter,

  /** "We don't build websites." A ramp: it arrives and it stays until the film ends. */
  belief: { from: beliefFrom, to: beliefTo } as Span,

  /**
   * The printing: the light returning, the frame drawing in, and the type leaving ahead of both.
   *
   * `all` is what the contraction and the light both run across. `clears` is the in-frame type leaving,
   * which finishes first by construction.
   */
  printing: {
    all: { from: printFrom, to: printTo } as Span,
    clears: { from: printFrom, to: clearsTo } as Span,
  },

  /** The way out, on the paper, beneath the plate. */
  wayOut: { from: outFrom, to: outTo } as Span,

  /**
   * Where the act stops asking for scroll — the film has been printed. The beats between here and
   * `ACT_BEATS` are the plate standing, and nothing happens in them; see `ACT_BEATS`.
   */
  endsAt: outTo,
} as const

/* ─────────────────────────────── The method, resolved ─────────────────────────────── */

/**
 * The method's own runway, resolved from `methodStory`.
 *
 * Four questions of identical shape, twelve considerations chained off them, one stillness, one
 * convergence and one resolution. Every position below is derived: the only absolute in the section is the
 * invitation's `at`, which is zero because it is the frame's first state.
 *
 * The words are resolved as **rises rather than cues** — they arrive and they stay. What takes them away is
 * the convergence, which is one property over the whole field rather than twelve departures, so no word
 * carries an exit of its own.
 */
export const methodSpans = (() => {
  const invite = cue(method.opening.at, method.opening)

  /* Each question chains off the one before it having completely gone. */
  const questions: Cue[] = []
  const words: Span[] = []
  let at = r(invite.gone + method.asking.after)

  for (let q = 0; q < 4; q += 1) {
    const asked = cue(at, method.asking)
    questions.push(asked)

    /*
      The considerations arrive from the question's own **arrival**, not from its departure, so they are in
      the frame with the thing that asked. Three of them, `stagger` apart.
    */
    for (let w = 0; w < 3; w += 1) {
      const from = r(asked.enter.from + method.asking.words.afterQuestion + w * method.asking.words.stagger)
      words.push({ from, to: r(from + method.asking.words.fadeIn) })
    }

    at = r(asked.gone + method.asking.between)
  }

  /** The last word fully lit — where the stillness is measured from. */
  const gatheredFrom = words.reduce((latest, span) => Math.max(latest, span.to), 0)

  const gatherFrom = r(gatheredFrom + method.gathered.holds)
  const gather: Span = { from: gatherFrom, to: r(gatherFrom + method.converge.fade) }

  /*
    The resolution's start is solved from the overlap rather than authored as a delay: `whenConvergedIs` is
    how far through the convergence it appears, and the curve is inverted to find the beat that produces it
    — the same trick `annotation` uses against the darkening, and `iiiStudio` against the travel.
  */
  const answerFrom = r(
    gather.from + unsmoothstep(method.resolve.whenConvergedIs) * (gather.to - gather.from),
  )
  const answer: Span = { from: answerFrom, to: r(answerFrom + method.resolve.fade) }

  const linesFrom = r(answer.to + method.resolve.linesAfter)

  return {
    invite,
    questions: questions as readonly Cue[],
    words: words as readonly Span[],
    /** Where the twelve stand with nothing moving. Not a range — the assertions read it. */
    gatheredFrom,
    gather,
    answer,
    lines: { from: linesFrom, to: r(linesFrom + method.resolve.linesFade) } as Span,
    /** The last frame the section composes. `METHOD_BEATS` is checked against it. */
    endsAt: r(linesFrom + method.resolve.linesFade),
  }
})()

/* ──────────────────────────── Chapter III, and the interface ──────────────────────────── */

export const studioBlocks = {
  ...afterTheFilm.studioBlocks,

  /**
   * What the observer is actually given.
   *
   * Derived from `arrivesShortOf` rather than written beside it, because `chapterThree` below places
   * Chapter III's opening so that this margin is crossed at a chosen beat of the shot. The observer's
   * threshold and that placement are two numbers that must agree, so only one of them is authored.
   */
  rootMargin: `0px 0px -${r(afterTheFilm.studioBlocks.arrivesShortOf * 100)}% 0px`,
} as const

export const navHover = afterTheFilm.navHover

/** A question answering, in the publication. `story.afterTheFilm.answer`. */
export const answer = afterTheFilm.answer

/**
 * About arriving: the photograph, the mark, then the words.
 *
 * The delays are **resolved here**, never written down. Each states its relationship to the thing before it
 * in `story.afterTheFilm.about` — the mark waits on the image, the words wait on the mark, and each block of
 * words waits one `step` on the block above — and this turns that into the three absolute delays CSS needs.
 * Retime the image and everything after it moves with it, keeping every interval that was composed.
 */
export const about = {
  image: afterTheFilm.about.image,
  label: { ...afterTheFilm.about.label, in: afterTheFilm.about.label.afterImage },
  words: {
    ...afterTheFilm.about.words,

    /**
     * One delay per block, in the order they arrive. Derived from `step` rather than listed, so the cadence
     * is one number and the number of blocks is the content's business — `about.text` can grow by a
     * paragraph without a timing being touched.
     */
    in: [0, 1, 2].map(
      (n) =>
        afterTheFilm.about.label.afterImage +
        afterTheFilm.about.words.afterLabel +
        n * afterTheFilm.about.words.step,
    ),
  },
} as const

/**
 * The work: when the fragment is fetched, and how long it takes to appear once it has painted. Not beats —
 * a request and a network. `story.afterTheFilm.work`.
 */
export const work = {
  ...afterTheFilm.work,

  /**
   * What the fetch observer is actually given.
   *
   * Built from `fetchedWithin` rather than written beside it, for the reason `studioBlocks.rootMargin` is:
   * the number is a distance somebody decided, and the string is the shape the DOM wants it in.
   *
   * Only the bottom edge is expanded. The chapter is always approached from above the *first* time — the
   * publication that now follows it is reached through it — so a top margin would only widen the window for
   * somebody coming back up from Contact, where the frame has already been fetched and nothing is waiting.
   */
  rootMargin: `0px 0px ${r(afterTheFilm.work.fetchedWithin * 100)}% 0px`,
} as const

/**
 * Where Chapter III begins, expressed against the frame the marker lands in.
 *
 * The film's last frame is held for the whole of `pin`, and Chapter III used to start underneath its
 * bottom edge — so the marker landed in the corner and the visitor then scrolled through a viewport
 * and a half of empty paper before the first thing the marker introduced could begin to arrive.
 * `story.chapterThreeStands` closes that by pulling Chapter III back **into** the last frame, far
 * enough that its first page is a composed frame at the instant the marker arrives.
 *
 * Fractions rather than lengths, because the distance depends on `pin` — longer for a thumb than for a
 * wheel — and CSS is where the two meet. `transitions.ts` states them against `var(--pin)`, so they
 * follow the pointer without either side knowing the other's numbers.
 *
 * The arithmetic, once: at beat `b` the top of Chapter III sits `100vh + pin · (1 − b/BEATS) − overlap`
 * below the top of the viewport. Set `b` to the handover and that expression to `stands · 100vh`, and
 * the overlap falls out. The same expression evaluated at the handover *is* `stands`, which is why the
 * marker's own reach-back is that and nothing more.
 */
export const chapterThree = {
  /** How far down the frame the page's top edge is when the marker lands. The authored value. */
  standsAt: shot.chapterThreeStands.atFrameFraction,

  /** The pinned part of the reach-back: how far the shot still has to run when the marker lands. */
  overlapOfPin: r(1 - iiiTo / BEATS),

  /**
   * How far into its emergence the chapter actually is when the marker lands — resolved, so the checks
   * below can hold the brief to its own number rather than trusting the range.
   *
   * What that fraction *opens* is the object's aperture, at `actSpans.apertureWithTheMark` of its width.
   */
  litWhenTheMarkerLands: r(smoothstep((iiiTo - emergeFrom) / (emergeTo - emergeFrom))),
} as const

/**
 * Chapter I's clocked beats in the order they are due, for the sequencer to walk.
 *
 * Only the beats on a fixed clock are here. The subtitle and the interface are not: the first is gated
 * on the footage and the second on when the first actually landed, so neither has a time that can be
 * written down in advance.
 */
export const schedule: ReadonlyArray<readonly [beat: Beat, at: number]> = [
  [beat.TIMESTAMP, cues.timestamp],
  [beat.LIGHT, cues.light],
  [beat.TIMESTAMP_OUT, cues.timestampOut],
  [beat.MOTION, cues.motion],
  [beat.IDENTITY, cues.identity],
]

/* ─────────────────────────────── The intentions, checked ─────────────────────────────── */

if (process.env.NODE_ENV !== 'production') {
  const complain = (what: string, detail: string) =>
    console.error(`[motion] ${what}\n         ${detail}\n         Fix it in src/motion/story.ts.`)

  /*
    The identity is meant to arrive in the instant the timestamp finishes clearing the frame — "with
    no pause between them". Both sides are authored (one as an anchor, one as a hold), so nothing
    structural keeps them equal.
  */
  if (cues.timestampGone !== cues.identity) {
    complain(
      'The timestamp does not hand over to the identity cleanly.',
      `timestamp is gone at ${cues.timestampGone}ms, the identity arrives at ${cues.identity}ms — ` +
        `a ${cues.identity - cues.timestampGone}ms ${cues.identity > cues.timestampGone ? 'gap' : 'overlap'}. ` +
        `Either set chapterOne.at to ${cues.timestampGone}, or set timestamp.hold to ` +
        `${cues.identity - one.timestamp.at - 2 * one.timestamp.fade}.`,
    )
  }

  /*
    No two beats may share the frame. Chaining makes that structurally impossible *while every gap is
    positive* — which is exactly why the gaps are what gets checked. A negative one is the only way
    back to the overlap the chain was built to prevent, and it is an easy typo.
  */
  const gaps: ReadonlyArray<readonly [string, number]> = [
    ['chapterTwoBecomesPhilosophy.whole', becomes.whole],
    ['chapterTwoBecomesPhilosophy.topicAfterNumeral', becomes.topicAfterNumeral],
    ['everyUnforgettableMoment.after', shot.everyUnforgettableMoment.after],
    ['wedding.after', shot.wedding.after],
    ['exhibition.after', shot.exhibition.after],
    ['artist.after', shot.artist.after],
    ['finalPerformance.after', shot.finalPerformance.after],
    ['creamTransition.after', shot.creamTransition.after],
    ['leadLeaves.hold', shot.leadLeaves.hold],
    ['anotherLeaves.afterLead', shot.anotherLeaves.afterLead],
    ['chapterTravels.alone', shot.chapterTravels.alone],
    ['periodLeaves.afterTravelStarts', shot.periodLeaves.afterTravelStarts],
  ]
  for (const [name, value] of gaps) {
    if (value < 0) {
      complain(
        `${name} is negative.`,
        `at ${value} the beat starts before the one before it has gone, and the two share a frame ` +
          `the act was composed to keep empty.`,
      )
    }
  }

  /*
    Three things about the mark rewriting itself, none of them true by construction.

    The overlap first: the numeral sets off from a point solved inside the word's fade, so it is only an
    overlap while that fraction is inside the range. At 0 the numeral leads and at 1 the pause is back —
    both are legal arithmetic and neither is the gesture.

    Then the other end of it: the word has to be *completely* gone by the time the numeral arrives, or
    the frame that is meant to read `II` alone still has a ghost of `CHAPTER` beside it.

    And last, all of it has to fit inside the marker's hold with the finished mark standing still at the
    end of it. This is the one that a ripple edit breaks silently — the transformation is measured from
    the marker's own arrival, so shortening the hold shortens the stillness and nothing else complains.
  */
  if (becomes.numeralSetsOffWhenWordIs <= 0 || becomes.numeralSetsOffWhenWordIs >= 1) {
    complain(
      'The mark does not overlap itself.',
      `numeralSetsOffWhenWordIs is ${becomes.numeralSetsOffWhenWordIs}. Outside 0 to 1 there is no ` +
        `overlap at all: the numeral either leads the word out or waits for it, and the transformation ` +
        `reads as fade, pause, move, appear. The brief asks for 0.7 to 0.8.`,
    )
  }

  if (numeralTo < wordTo) {
    complain(
      'The word is still there when the numeral arrives.',
      `the word is gone at ${wordTo} and the numeral lands at ${numeralTo}. Raise numeralTravels above ` +
        `${r(wordTo - numeralFrom)} so the numeral is alone in the frame the moment it settles.`,
    )
  }

  const stillness = r(marker.exit.from - topicTo)
  if (stillness < shot.everyUnforgettableMoment.hold) {
    complain(
      'II Philosophy does not stand still long enough.',
      `it finishes at ${topicTo} and the marker starts leaving at ${marker.exit.from} — ${stillness} ` +
        `beats of stillness, against the ${shot.everyUnforgettableMoment.hold} the statement after it ` +
        `gets. A mark has to be a mark before it leaves. Lengthen chapterTwoMarker.hold, or shorten the ` +
        `transformation.`,
    )
  }

  /*
    The numeral is placed backwards from the end of the travel, so it is the one offset that can push a
    beat *earlier* than its parent — far enough and it would start before the word began moving.
  */
  if (shot.iiiStudio.beforeTravelEnds > shot.chapterTravels.fade) {
    complain(
      'iiiStudio starts before the travel does.',
      `beforeTravelEnds is ${shot.iiiStudio.beforeTravelEnds} but the travel only lasts ` +
        `${shot.chapterTravels.fade} beats, so the marker would arrive before the word set off.`,
    )
  }

  /*
    The whole point of the emergence is that it is *unfinished* when the marker lands — the mark unveils
    the page rather than announcing a finished one. Both ends of that are worth holding: lit enough to
    have plainly begun, and not so lit that there is nothing left to settle.

    The range is solved from `litWhenTheMarkerLands`, so this normally cannot fail — it fails if the
    travel is retimed such that the solved range would have to start before the travel does, or if the
    authored value leaves the band the brief asked for.
  */
  if (chapterThree.litWhenTheMarkerLands < 0.6 || chapterThree.litWhenTheMarkerLands > 0.8) {
    complain(
      'Chapter III is the wrong amount lit when the marker lands.',
      `it resolves to ${chapterThree.litWhenTheMarkerLands} and the brief asks for 0.6 to 0.8. ` +
        `Set studioEmerges.litWhenTheMarkerLands inside that band — it is solved for exactly, so the ` +
        `authored value is the resolved one unless the travel moved under it.`,
    )
  }

  /*
    It has to begin inside the pinned frame, because what it is synchronised with — the word setting off
    for the corner — happens there. Its *end* may be outside, and is: that is the composition settling
    into a page the visitor is already reading, which is why `spans.endsAt` does not include it.
  */
  if (spans.studioEmerges.from < 0 || spans.studioEmerges.from > BEATS) {
    complain(
      'Chapter III starts emerging outside the pinned frame.',
      `it begins at ${spans.studioEmerges.from} beats and the frame is ${BEATS} long, so the visitor ` +
        `would never see it start — and it is meant to start in the instant the word sets off.`,
    )
  }

  if (spans.studioEmerges.to <= spans.handoffAt) {
    complain(
      'Chapter III finishes emerging before the marker lands.',
      `it ends at ${spans.studioEmerges.to} and the marker lands at ${spans.handoffAt}. The page is ` +
        `meant to still be arriving as the mark arrives; finishing first makes the mark an announcement ` +
        `rather than an unveiling.`,
    )
  }

  /*
    The no-skip guarantee has a floor it cannot go below. `maxAdvance` is never allowed under
    `pace.maxStep`, because dropping below it would slow the natural pace — so if a third of the
    closest gap is smaller than that, the clamp wins and consecutive beats can land closer together
    than three frames when the clock is running hard.
  */
  if (closestBeats / 3 < pace.maxStep) {
    complain(
      'Two beats are close enough that hurrying could show them together.',
      `the closest gap is ${closestBeats}ms, so three frames apart needs a cap of ` +
        `${(closestBeats / 3).toFixed(1)}ms, but the cap cannot go below pace.maxStep (${pace.maxStep}ms) ` +
        `without slowing the natural pace. Widen the gap, or lower pace.urgent.`,
    )
  }

  /*
    The act's own gaps. Same rule, same reason: chaining makes overlap impossible only while every one
    of them is positive.
  */
  const actGaps: ReadonlyArray<readonly [string, number]> = [
    ['navigation.at', act.navigation.at],
    ['quiet.holdsWhole', act.quiet.holdsWhole],
    ['darkens.beginsAfterTheQuiet', act.darkens.beginsAfterTheQuiet],
    ['annotation.hold', act.annotation.hold],
    ['belief.after', act.belief.after],
    ['printing.afterTheBelief', act.printing.afterTheBelief],
  ]
  for (const [name, value] of actGaps) {
    if (value < 0) {
      complain(
        `actStory.${name} is negative.`,
        `at ${value} the beat starts before the one before it has gone, and two things share a frame ` +
          `the act was composed to keep to one.`,
      )
    }
  }

  /* The solved overlaps are only overlaps while the fraction is inside the range. */
  const overlaps: ReadonlyArray<readonly [string, number]> = [
    ['frame.opensWithTheMark', act.frame.opensWithTheMark],
    ['annotation.arrivesWhenDuskIs', act.annotation.arrivesWhenDuskIs],
    ['printing.clears', act.printing.clears],
    ['wayOut.whenPrintedIs', act.wayOut.whenPrintedIs],
  ]
  for (const [name, value] of overlaps) {
    if (value <= 0 || value >= 1) {
      complain(
        `actStory.${name} is not an overlap.`,
        `it is ${value}, and outside 0 to 1 there is no overlap at all — the two movements become a ` +
          `sequence, which is the thing the act was composed not to be.`,
      )
    }
  }

  /*
    The masthead has to be standing whole on paper before the room starts to go dark. The mark lands, the
    links arrive beside it, and only then does the frame become a photograph — otherwise the chapter's head
    is still assembling over an image, which reads as a menu fading in on top of a film rather than as the
    head of a page.
  */
  if (navigation.to > darkFrom) {
    complain(
      'The masthead is still arriving when the room starts to go dark.',
      `the links finish at ${navigation.to} and the dark begins at ${darkFrom}. Lower navigation.at, ` +
        `shorten navigation.fade, or lengthen quiet.holdsWhole.`,
    )
  }

  /*
    **The work is alone, whole and lit, with nothing being said, for a real stretch of scroll.** This is
    §53's own requirement and the one thing in Chapter III that exists to be empty, so it is the one most
    easily lost to a retiming somewhere else — every other beat in the act is chained, and a gap that goes
    to zero is silent.

    A tenth of a beat is the floor rather than the target: below about 0.2 the naming treads on the reveal,
    and `quiet.holdsWhole` says why the authored value is 0.3.
  */
  if (r(actSpans.quietTo - actSpans.frame.to) < 0.1) {
    complain(
      'The work is never alone.',
      `the aperture finishes at ${actSpans.frame.to} and the light starts moving at ${actSpans.quietTo} — ` +
        `${r(actSpans.quietTo - actSpans.frame.to)} beats of stillness. Raise quiet.holdsWhole; the pause ` +
        `is the only thing in the act that is there to be empty.`,
    )
  }

  /*
    **The frame has to be dark enough to carry white type before any is set on it**, and this is the one
    assertion in the piece that is a *safety* property rather than a composition one. Everything the studio
    says in the act is set in white, over somebody else's photograph, whose quiet band measures around 180.

    0.35 is the floor: at 0.35 that band falls to 117 and white at 0.92 alpha reads 4.6:1, which is the
    minimum for type this size. It currently resolves to 0.4 — 108, and 5.3:1. `decisions.md` §02.
  */
  const darkAtAnnotation = r(
    actSpans.dusk.depth * smoothstep(clamp01((annotation.enter.from - darkFrom) / (darkTo - darkFrom))),
  )
  if (darkAtAnnotation < 0.35) {
    complain(
      'The work is named on a frame that is still too light to carry the type.',
      `the ground is ${darkAtAnnotation} dark when the first white type arrives at ${annotation.enter.from}. ` +
        `Raise annotation.arrivesWhenDuskIs or darkens.depth — white type over a lit photograph is ` +
        `unreadable, not quiet.`,
    )
  }

  /*
    The dark arrives in two stages and the second has to be *deeper* than the first, or the room brightens
    when the studio starts speaking — which is the opposite of the gesture. And it has to stop short of
    black: at 1 the work is gone from its own frame and the studio is talking about something that is no
    longer there.
  */
  if (act.deepens.depth <= act.darkens.depth || act.deepens.depth >= 1) {
    complain(
      'The room does not go down for the studio to speak.',
      `darkens.depth is ${act.darkens.depth} and deepens.depth is ${act.deepens.depth}. The second has to ` +
        `be deeper than the first and short of 1 — the work stays in the frame as a trace, the way ` +
        `Chapter I's own dusk leaves the landscape at 0.82.`,
    )
  }

  /*
    **The studio does not interpret work the visitor has not been shown.** §53's own requirement, and the
    order the whole chapter turns on: the work is whole, lit, alone and named long before the first sentence
    exists. Not true by construction — `belief` is chained to the annotation and the annotation to the
    darkening, so a short enough quiet and a fast enough dusk would put the line on screen while the
    aperture was still opening.
  */
  if (beliefFrom <= actSpans.frame.to) {
    complain(
      'The studio speaks before the work has been shown.',
      `the aperture finishes at ${actSpans.frame.to} and the sentence begins at ${beliefFrom}. Raise ` +
        `quiet.holdsWhole, annotation.hold or belief.after — nothing is claimed until the work has been ` +
        `looked at.`,
    )
  }

  /*
    **The type is gone before the paper is back.** The printing takes the ground from a trace to paper, and
    everything in the frame is white — so any type still standing at the midpoint of that return is type on
    a ground of its own luminance. `decisions.md` §52 records the interpolated ink that was built and thrown
    away; this is the assertion that replaced it.

    0.5 is a wide floor. At 0.57, where it resolves, white reads 7:1 against the ground on the last frame it
    exists.
  */
  const darkWhenClear = r(actSpans.dusk.deep * (1 - smoothstep(act.printing.clears)))
  if (darkWhenClear < 0.5) {
    complain(
      'The in-frame type is still lit when the paper comes back.',
      `the ground is only ${darkWhenClear} dark by the time the type has gone. Lower printing.clears — ` +
        `white type cannot cross a ground travelling to paper, and the frame in the middle of that has ` +
        `nothing legible in it.`,
    )
  }

  /*
    And the other side of the same range: the way out is *ink on paper* rather than white on dark, so it must
    not arrive until the ground is most of the way back. At 0.6 through the printing the paper is 60% back
    and the line reads 5:1; earlier than about 0.45 it is ink on a ground still dark enough to swallow it.
  */
  if (act.wayOut.whenPrintedIs < 0.45) {
    complain(
      'The way out is printed before there is paper to print it on.',
      `wayOut.whenPrintedIs is ${act.wayOut.whenPrintedIs}. The line is set in the page's own ink, so it ` +
        `needs the ground to have come most of the way back — 0.45 is the floor and the brief asks for 0.6.`,
    )
  }

  /* ── The method's own intentions ────────────────────────────────────────────────────────── */

  /*
    It has to fit. Same assertion as `BEATS` and `ACT_BEATS`, and the same failure it prevents: a ripple edit
    that pushes the resolution past the end of the held frame is a beat nobody ever reaches.
  */
  if (methodSpans.endsAt > METHOD_BEATS) {
    complain(
      'The method does not fit inside its own frame.',
      `it resolves at ${methodSpans.endsAt} beats and the frame is released at ${METHOD_BEATS}. Raise ` +
        `METHOD_BEATS to at least ${r(methodSpans.endsAt + 0.05)} — methodPin follows it, and nothing is retimed.`,
    )
  }

  /*
    **The field has to stand still before it is taken apart.** The accumulation is what the section is for,
    and a convergence that begins while the last words are still arriving is a shuffle rather than a
    gathering. `gathered.holds` is the gap and it is a real one — the words are chained off the questions and
    the convergence off the words, so a short enough hold closes it silently.
  */
  const standing = r(methodSpans.gather.from - methodSpans.gatheredFrom)
  if (standing < 0.15) {
    complain(
      'The considerations never stand still.',
      `the last one is lit at ${methodSpans.gatheredFrom} and the convergence starts at ` +
        `${methodSpans.gather.from} — ${standing} beats of stillness. Raise gathered.holds; that pause is ` +
        `the composition the whole section is built to produce.`,
    )
  }

  /*
    And the resolution must arrive **inside** the convergence rather than after it. If it starts once the
    field has gone, the frame empties and one more line appears on paper — which is the failure the brief for
    this section names: the answer has to be the consequence of the movement, not a heading following it.
  */
  if (methodSpans.answer.from <= methodSpans.gather.from || methodSpans.answer.from >= methodSpans.gather.to) {
    complain(
      'The resolution is not inside the convergence.',
      `the field gathers from ${methodSpans.gather.from} to ${methodSpans.gather.to} and the answer begins ` +
        `at ${methodSpans.answer.from}. Keep resolve.whenConvergedIs between 0 and 1 — everything before it ` +
        `has to still be moving when it comes forward.`,
    )
  }

  /*
    Every gap in the section, for the reason the shot's and the act's are checked: chaining makes overlap
    impossible only while all of them are positive, and two questions in one frame is the one failure that
    would look like a bug rather than a retiming.
  */
  const methodGaps: ReadonlyArray<readonly [string, number]> = [
    ['asking.after', method.asking.after],
    ['asking.hold', method.asking.hold],
    ['asking.between', method.asking.between],
    ['asking.words.afterQuestion', method.asking.words.afterQuestion],
    ['gathered.holds', method.gathered.holds],
    ['resolve.linesAfter', method.resolve.linesAfter],
  ]

  for (const [name, gap] of methodGaps) {
    if (gap < 0) {
      complain(
        'A gap in the method is negative.',
        `methodStory.${name} is ${gap}. Every offset in the section is a wait; a negative one puts two ` +
          `things in the frame at once.`,
      )
    }
  }

  /*
    The film has to be printed before the pin releases, and the slack that is left has to be a settle rather
    than a wait. §51's was 0.62 beats and §52 called it the dead tail, so the number is held from both sides.
  */
  const settle = r(ACT_BEATS - actSpans.printing.all.to)
  if (settle <= 0) {
    complain(
      'The frame is still being printed when the pin releases.',
      `the printing finishes at ${actSpans.printing.all.to} and the frame is released at ${ACT_BEATS}. ` +
        `Shorten printing.fade, or raise ACT_BEATS — the film has to be over before the page starts ` +
        `moving again.`,
    )
  } else if (settle > 0.4) {
    complain(
      'The act ends on a wait rather than a settle.',
      `${settle} beats pass between the film being printed and the pin releasing — about ` +
        `${Math.round(settle * 55)}vh on a wheel with nothing happening in it. Lower ACT_BEATS toward ` +
        `${r(actSpans.printing.all.to + 0.2)}; actPin follows, and nothing is retimed.`,
    )
  }


  /* The act has to fit its own frame, for the same reason the shot has to fit the film's. */
  if (actSpans.endsAt > ACT_BEATS) {
    complain(
      'The act no longer fits.',
      `it ends at ${actSpans.endsAt} beats and ACT_BEATS is ${ACT_BEATS}. Raise ACT_BEATS — that retimes ` +
        `nothing, since actPin alone decides how far the hand travels — or shorten a hold.`,
    )
  }

  /* And the whole shot has to fit the pinned frame, or its tail is a beat nobody sees. */
  if (spans.endsAt > BEATS) {
    complain(
      'The shot no longer fits.',
      `it ends at ${spans.endsAt} beats and BEATS is ${BEATS}. Raise BEATS — that retimes nothing, ` +
        `since pin only changes how far the hand travels — or shorten a hold.`,
    )
  }
}
