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
  methodArrival,
  methodStory as method,
  pace,
  persisting,
  pricing,
  relighting,
  SECONDS_TO_VH,
  shotStory as shot,
  type Beat,
  type Price,
} from './story'
import { junctions, states, type Runway, type Verb } from './spine'
import { TIMING } from './timing'
import { site } from '@content'

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
 * **The composition is authored here now, and it was derived before** — design owner, 19 September 2026.
 * Twelve considerations used to be chained off four questions, three per question, `stagger` apart: one
 * shape repeated, and the positions fell where the chain put them. Nothing draws that shape any more
 * (C16), and the brief for what replaced it is a rhythm rather than a repetition — *"timings diferentes
 * e pequenas pausas entre elas. Não quero intervalos mecânicos iguais"* — which is a thing you write
 * down, not a thing you derive. So `method.composed` states every arrival and this resolves them.
 *
 * Everything downstream is still derived and none of it moved: the stillness is measured from the last
 * thing to arrive, the resolution from the stillness and the clearing from the resolution. Change a
 * line's `at` in `timing.ts` and the whole tail ripples exactly as it always did.
 *
 * The arrivals are **rises rather than cues** — they arrive and they stay. What takes the field away is
 * the convergence, one property over the whole of it, so no line carries an exit of its own. The
 * question is the exception and it is not in the field: `ask` stands through the convergence, because
 * it is one half of the composition the section resolves into.
 */
export const methodSpans = (() => {
  /** An authored `[at, over]` in beats, as the range the driver rises across. */
  const authored = ([at, over]: readonly [number, number]): Span => ({ from: at, to: r(at + over) })

  const words = method.composed.lines.map((line) => authored(line as readonly [number, number]))
  const notes = method.composed.notes.map((note) => authored(note as readonly [number, number]))

  /* The main composition's first two pieces, in the order they are read. `composed` argues both. */
  const answer = authored(method.composed.answer as readonly [number, number])
  const line = authored(method.composed.line as readonly [number, number])

  /*
    **The studio's question, authored with the field's last phrases** — design owner, 20 September
    2026. It was the one chained arrival in the section, derived off the room being complete plus a
    stillness; it is stated now, because what was decided about it is that it comes in *among* the
    closing phrases. Only the beat is authored — the fade is the question's own.
  */
  const ask: Span = { from: method.composed.ask, to: r(method.composed.ask + method.resolve.fade) }

  /**
   * **The last thing in the room fully lit, and the question is now one of them.**
   *
   * The seven lines, the margin note, and all three pieces of the composition: the whole of what the
   * studio puts in the frame. It used to exclude the question, because the question was derived from
   * it; with the question authored alongside the field there is nothing circular about counting it,
   * and counting it is the point — `gathered.holds` is the gap *after* the composition is complete.
   *
   * The colophon was here too until it was removed on 20 September 2026.
   */
  const gatheredFrom = [...words, ...notes, answer, line, ask].reduce(
    (latest, span) => Math.max(latest, span.to),
    0,
  )


  /*
    **The camera.** From the frame's first beat to the instant the composition begins to resolve, and no
    further — `method.drift.holdsPastTheResolution` is the authored zero that says so. A frame that is
    being written into should not also still be being walked through; the same argument the authored zero
    always made, against the beat that replaced the convergence.
  */
  const drift: Span = {
    from: 0,
    to: r(ask.from + method.drift.holdsPastTheResolution),
  }

  /*
    ── The clearing ──────────────────────────────────────────────────────────────────────────────
    What is left of the printing, and it is the stage that was never about paper: the composition leaves
    the room it was lit in. The room stays — Questions is written on the same photograph — so there is no
    return, no printed answer and no two lines on a page. `story.methodStory.printing`.
  */
  /*
    **Chained off the whole composition standing.** `gathered.holds` is the one suspension the section
    has left — the three pieces on the axis, the seven thoughts around them, the whole of it lit and
    nothing moving — and the clearing is what ends it. It was `sign.to + resolve.holds`; the signature
    is gone and `resolve.holds` with it.
  */
  const clearFrom = r(gatheredFrom + method.gathered.holds)
  /*
    **The leaving is played, and this span is its guarantee** — 26 September 2026. `leaves` is where the
    layered exit (`method.leaves`, a clock) is triggered; `clear` is what is left of the scrubbed clearing,
    the last quarter of the same window, so it still ends exactly where it always did.
  */
  const leaves = r(clearFrom - TIMING.method.leaves.leads)
  const clear: Span = {
    from: r(clearFrom + method.printing.clears * TIMING.method.leaves.guardAfter),
    to: r(clearFrom + method.printing.clears),
  }

  return {
    words: words as readonly Span[],
    /** The marginalia, which stands in the room with the field. */
    notes: notes as readonly Span[],
    /** The main composition, in the order it is read: the statement, its line, and the question last. */
    answer,
    line,
    ask,
    /** Where the room stands with nothing moving. Not a range — the assertions read it. */
    gatheredFrom,
    drift,
    /** Where the layered leaving is triggered. */
    leaves,
    clear,
    /** The last frame the section composes. `METHOD_BEATS` is checked against it. */
    endsAt: clear.to,
  }
})()

/**
 * **Where the room arrives, as the driver needs it.**
 *
 * `story.methodArrival` states the two edges as viewport heights above the frame's own lock, because that is
 * what somebody composing the entrance decides. The driver needs the same thing as a start and a length, so
 * the subtraction happens once, here, rather than in the loop.
 *
 * `over` is asserted positive below: an arrival that settles before it begins is a division that would hand
 * the driver an infinity and paint the room in one frame.
 */
export const methodEntrance = {
  begins: methodArrival.begins,
  over: r(methodArrival.begins - methodArrival.settles),
} as const

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
 * **Junction 13 → 14, resolved from seconds into fractions of its own distance.**
 *
 * This is the whole of C8's conversion, and it is four lines of arithmetic: divide every cue by
 * `persisting.total`. Nothing here is a duration, nothing is chained, and nothing is compared to a
 * clock. What comes out is a set of ranges on `0 → 1`, and the driver turns scroll position into that
 * `0 → 1` — so the junction runs backwards exactly as it runs forwards, and stopping anywhere holds a
 * composed frame.
 *
 * `length` is the only place seconds meet the world: `total × SECONDS_TO_VH`, in viewport-hundredths.
 * Change the constant and the hand travels further; every proportion below is untouched.
 */
export const persistSpans = (() => {
  const T = persisting.total
  /** A cue's absolute second, as a fraction of the junction. */
  const f = (seconds: number): number => r(seconds / T)
  /** A cue with a duration, as a range. */
  const span = (at: number, over: number): Span => ({ from: f(at), to: f(at + over) })

  /*
    §8's staggers stay a set of ranges rather than one range with a delay in it: each row gets its own
    span, so each is independently a pure function of position and the stagger reverses rather than
    replays. `releases` and `rules` below build them.
  */
  return {
    /** Nothing happens here, and that is the cue. §8's opening 400ms hold. */
    holdsUntil: f(persisting.holds),

    /**
     * **Where the list is told to let go** — the trigger; the release itself is a clock
     * (`persisting.releases.clock`), played by the driver.
     */
    lets: f(persisting.releases.asks),

    /**
     * **The light going down over the plate that is leaving**, and the light coming back up on the
     * one that arrives. The two ends of `contact.passage`, and the floor is whatever lies between
     * them — `dusk.to` to `dawn.from` — which is where the exchange has to sit.
     */
    dusk: span(persisting.dusk.at, persisting.dusk.over),
    dawn: span(persisting.dawn.at, persisting.dawn.over),

    /**
     * The plates changing places, the scrim crossing with them, and the rule's ink crossing with
     * both. One range, because §8 gives one and because they are one movement: *the ground turns
     * under the rule*.
     */
    crosses: span(persisting.crosses.at, persisting.crosses.over),

    /** The camera pushing toward the room's window as it darkens. `contact.passage.leaves`. */
    leaves: span(persisting.leaves.at, persisting.leaves.over),

    /** The same push on the hillside, landing on Contact's framing. `contact.passage.returns`. */
    returns: span(persisting.returns.at, persisting.returns.over),

    /**
     * The held-empty frame. Not a range anything fades across — a range in which **nothing is
     * scheduled**, which is why it is exported as a pair the assertions can check rather than as a
     * track entry. Its whole job is to be provably empty.
     */
    empty: span(persisting.empty.at, persisting.empty.over),

    /**
     * **The trigger for Contact's own composition**, as a point on the junction. Past it the frame
     * writes itself on `TIMING.contact.composes`; back past `empty.from` it lets go.
     */
    asks: f(persisting.asks),

    /** How far the junction runs, in viewport-hundredths. The one place seconds become distance. */
    length: r(T * SECONDS_TO_VH),

    /** The last thing the scroll decides. Asserted to fall inside the junction. */
    endsAt: f(persisting.asks),
  }
})()

/**
 * **Junction 12 → 13, resolved.** The storyboard's five beats as ranges on the junction's own `0 → 1`.
 *
 * Same construction as `persistSpans` and for the same reason: seconds in, fractions out, and the driver
 * turns scroll position into the `0 → 1`. Nothing here is a time and nothing is compared to one.
 *
 * The junction's interval on `p` is longer than the 5.40s weight — measured 3.22 beats against a priced
 * 1.97 — so the beats are laid on the **whole interval** rather than on the weight's share of it. That
 * preserves every proportion the storyboard authors and spends the distance the sequence actually has,
 * which is what keeps the studio on screen long enough to register.
 */
export const relightSpans = (() => {
  const T = relighting.total
  const f = (seconds: number): number => r(seconds / T)
  const span = (at: number, over: number): Span => ({ from: f(at), to: f(at + over) })
  return {
    /** Temperature, at constant exposure. */
    warms: span(relighting.warms.at, relighting.warms.over),
    /** Value, into blue. */
    blues: span(relighting.blues.at, relighting.blues.over),
    /** First light, and the one beat the plates cross inside. */
    lights: span(relighting.lights.at, relighting.lights.over),
    /** The heading, last. */
    settles: span(relighting.settles.at, relighting.settles.over),
    /** How far the junction runs, in viewport-hundredths — the weight, for the assertion to check. */
    length: r(T * SECONDS_TO_VH),
  }
})()

/**
 * **Where each of V2's fourteen states begins, in the unit its runway is priced in.**
 *
 * `spine.ts` says which state a beat composes; this says where that state starts. Every entry below is
 * an existing resolved span read at one end — **not one number is authored here**. Retime the beat and
 * the state moves with it, which is the whole reason the spine associates rather than duplicates.
 *
 * Three units, and the driver knows which is which from `runway`:
 *
 *   `shot`     beats down the film's pinned frame, from the shot's origin
 *   `act`      beats down Chapter III's frame, from its own top edge
 *   `method`   beats down the method's held frame, from its lock
 *   `flow`     `null` — an ordinary section, measured in the DOM. There is nothing to resolve.
 *
 * The film's own first state is 0 by definition: the shot begins at the hero and the hero is state 01.
 */
export const stateEntries: ReadonlyArray<{
  readonly id: number
  readonly runway: Runway
  readonly at: number | null
}> = states.map((state) => {
  const at = ((): number | null => {
    switch (state.id) {
      /* The shot's first frame. The hero is where the film starts, so this is 0 by construction. */
      case 1:
        return 0
      case 2:
        return spans.marker.enter.from
      /* Philosophy is the state where the topic has arrived beside the numeral, not where it sets off. */
      case 3:
        return spans.becomesTopicArrives.from
      case 4:
        return spans.statement.enter.from
      case 5:
        return spans.wedding.enter.from
      case 6:
        return spans.close.from
      case 7:
        return spans.iiiStudio.from
      /*
        The dock. V2 draws the index out of the decomposing numeral; this build reveals it at the
        instant the mark lands, which is the same moment and the beat that already gates the
        navigation. `spine.ts` records that the choreography between them is C4's.
      */
      case 8:
        return spans.handoffAt
      /* The work whole, lit and unnamed — the beat the aperture finishes. */
      case 9:
        return actSpans.frame.to
      /*
        The method's frame from its first beat; its resolution from the beat the composition is whole.

        **That is the question's arrival and it used to be the answer's** — 19 September 2026. The three
        pieces are read in order now (`TIMING.method.composed`) and the statement is the *first* of
        them, 0.34 of a beat into the frame: anchoring the state there would have put state 12 almost
        on top of state 11 and left junction 11 → 12 with nothing in it. §2's state 12 is a board — the
        answer, its line and the studio's question composed together — so the state begins where that
        board is complete, which is the last of the three to arrive.
      */
      case 11:
        return 0
      case 12:
        return methodSpans.ask.from
      default:
        return null
    }
  })()
  return { id: state.id, runway: state.runway, at }
})

/**
 * **A segment's place on `p`.** Where it begins, and how many of its own beats fit in one beat of `p`.
 *
 * A segment is not a runway. A runway was a coordinate system with its own zero; this is a *view* of the
 * one position — `local = (p − offset) × scale` — and the only reason it exists is that the act and the
 * method are deliberately priced differently from the film. Pricing is a property of the position, which
 * is the whole of what C8 changed.
 *
 * Both numbers are runtime facts. `offset` comes from layout and `scale` from `--pin` and its siblings,
 * which differ by pointer. So the driver measures them and hands them here; nothing is authored twice.
 */
export type Segment = {
  /** Where the segment begins, in beats of `p`. */
  readonly offset: number
  /** Local beats per beat of `p` — `perBeat / perSegmentBeat`. */
  readonly scale: number
}

/**
 * What the driver measures each time layout moves, and the only input this file's resolver takes.
 *
 * `flow` is already in beats of `p`: a state in ordinary flow has no beat to price, so its position is
 * its measured top converted through the same divisor everything else uses.
 */
export type Measured = {
  readonly act: Segment
  readonly method: Segment
  readonly flow: ReadonlyMap<number, number>
}

/**
 * **Every state's position on the one continuous narrative position.**
 *
 * This is the resolver C8 asks for, and putting it here rather than in the driver is the point: state
 * entries are resolved against `p` in the same file that resolves the spans they are read from, so there
 * is exactly one place that knows how a state's authored beat becomes a position. The driver measures and
 * writes; it no longer decides.
 *
 * The arithmetic is unchanged from the three-origin driver and produces the same numbers to the last
 * decimal — `offset + at / scale` expands to `(segmentTop − origin) / vh / perSegmentBeat` — because C8
 * changed where a position comes from, never what it is.
 *
 * A state with no resolvable position returns `+Infinity`, which reads as *not yet reachable* everywhere
 * downstream: the driver's `p >= at` is false, so the state is simply never entered. That is the honest
 * answer while the page is measuring, and it is never a silent zero.
 */
export const narrativePositions = (
  m: Measured,
): ReadonlyArray<{ readonly id: number; readonly at: number }> =>
  stateEntries.map((entry) => {
    const at = ((): number => {
      if (entry.runway === 'flow') return m.flow.get(entry.id) ?? Number.POSITIVE_INFINITY
      if (entry.at === null) return Number.POSITIVE_INFINITY
      if (entry.runway === 'shot') return entry.at
      const segment = entry.runway === 'act' ? m.act : m.method
      if (!Number.isFinite(segment.offset) || segment.scale === 0) return Number.POSITIVE_INFINITY
      return segment.offset + entry.at / segment.scale
    })()
    return { id: entry.id, at }
  })

/* ─────────────────────────────── The thirteen junctions, on `p` ─────────────────────────────── */

/**
 * **A junction's extent on the one continuous position.**
 *
 * C8 put the fourteen states on one scalar. C4 is the other half of that sentence: the thirteen
 * *movements between* them, each as one continuous range on the same scalar, so a survivor can be a
 * pure function of `p` from the frame it leaves to the frame it arrives in.
 *
 * ## Where the extent comes from, and why nothing is authored
 *
 * **A junction occupies the interval between the two states it joins.** That is the only definition
 * that invents nothing: both endpoints are already resolved by `narrativePositions`, out of the same
 * relative beat model the storyboard has always held, so a junction cannot disagree with the sequence
 * and there is no second coordinate anywhere. It is also the reading the Environment already takes —
 * *"a junction with no authored distance interpolates across the whole gap between its two states"* —
 * made explicit and shared instead of assumed in one file.
 *
 * The thirteen therefore **tile `p` end to end**: junction *n* ends exactly where junction *n+1*
 * begins, with no gap between them and no overlap. `assertJunctions` holds that.
 *
 * ## The weight is V2's, and it is not the extent
 *
 * §3 quotes seconds for four of the thirteen — 3.40 · 4.20 · 2.90 · 3.60 — and C8 ruled what they are:
 * **weight, not duration.** They state proportion. `weight` carries them verbatim from the spine, and
 * `priced` is what that weight comes to on `p` through `SECONDS_TO_VH`, the one conversion constant C8
 * allows. Nine junctions quote nothing, and for those both fields are `null` — an absence, never a
 * guessed number.
 *
 * `priced` is a **claim to be checked against the extent**, never a source of it. Where a junction's
 * authored movement is longer than the interval it has to happen in, the movement would be truncated,
 * and that is a real fault the assertion reports rather than papers over.
 */
export type JunctionSpan = {
  /** §3's own numbering: the state it leaves and the state it arrives in. */
  readonly id: number
  readonly from: number
  readonly to: number
  /** The interval on `p`. */
  readonly at: number
  readonly ends: number
  readonly length: number
  /** §3's verb and survivor, carried so a reader of a span never has to hold the spine open too. */
  readonly verb: Verb
  readonly survivor: string
  /** §3's quoted seconds, where it quotes one. Weight, never duration. */
  readonly weight: number | null
  /** What that weight comes to in beats of `p`, through `SECONDS_TO_VH`. `null` where none is quoted. */
  readonly priced: number | null
}

/**
 * **The thirteen junctions, resolved onto `p`.**
 *
 * Takes the fourteen positions `narrativePositions` produced and the price of a beat, and returns one
 * span per junction. No state is read from anywhere else and no distance is authored here: this is a
 * projection of the same numbers the Ledger and the Environment already read.
 */
export const junctionSpans = (
  positions: ReadonlyArray<{ readonly id: number; readonly at: number }>,
  perBeat: number,
): readonly JunctionSpan[] => {
  const where = new Map(positions.map((s) => [s.id, s.at]))
  return junctions.map((junction, i) => {
    const at = where.get(junction.from) ?? Number.POSITIVE_INFINITY
    const ends = where.get(junction.to) ?? Number.POSITIVE_INFINITY
    /*
      `SECONDS_TO_VH` is viewport-hundredths per authored second and a beat of `p` costs `perBeat`
      viewports, so the conversion is the same one every other position on `p` goes through. It is the
      only arithmetic in this file that touches a second, and it produces a length rather than a time.
    */
    const priced =
      junction.time === null || !Number.isFinite(perBeat) || perBeat === 0
        ? null
        : (junction.time * SECONDS_TO_VH) / 100 / perBeat
    return {
      id: i + 1,
      from: junction.from,
      to: junction.to,
      at,
      ends,
      length: ends - at,
      verb: junction.verb,
      survivor: junction.survivor,
      weight: junction.time,
      priced,
    }
  })
}

/**
 * **The price of a junction, resolved into a mapping.**
 *
 * `story.ts` §8 authors what each phase of a junction costs; this turns that into the monotone curve
 * that turns *distance travelled* into *how far through the junction we are*. Built once at module
 * load, from a table, and then it is a lookup.
 *
 * The density is smoothed before it is integrated, and that is the whole reason this is not four lines
 * of arithmetic: a piecewise-constant price gives a piecewise-**linear** mapping, which puts a hard
 * kink in rendered velocity at every phase boundary. Measured, the largest second derivative of the
 * result with respect to distance is 0.012 with the blur and 0.450 without it.
 *
 * `cost` is what one unit of the junction costs relative to the default, so `mean` is how much longer
 * the junction becomes overall — the caller multiplies its own length by it.
 */
type Priced = { readonly mean: number; readonly through: (t: number) => number }

const price = (table: readonly Price[] | undefined): Priced | null => {
  if (table === undefined || table.length === 0) return null
  const n = pricing.resolution
  const density = new Float64Array(n)
  for (let i = 0; i < n; i += 1) {
    const u = (i + 0.5) / n
    let cost = 1
    for (const [from, to, c] of table) {
      if (u >= from && u < to) {
        cost = c
        break
      }
    }
    density[i] = cost
  }

  /* Edge-clamped Gaussian, so the integral is preserved and the ends are not dragged toward 1. */
  const sd = pricing.blur * n
  const reach = Math.ceil(3 * sd)
  const kernel: number[] = []
  let weight = 0
  for (let k = -reach; k <= reach; k += 1) {
    const v = Math.exp(-0.5 * (k / sd) * (k / sd))
    kernel.push(v)
    weight += v
  }
  const smoothed = new Float64Array(n)
  for (let i = 0; i < n; i += 1) {
    let acc = 0
    for (let k = -reach; k <= reach; k += 1) {
      acc += density[Math.min(n - 1, Math.max(0, i + k))] * kernel[k + reach]
    }
    smoothed[i] = acc / weight
  }

  const cumulative = new Float64Array(n + 1)
  for (let i = 0; i < n; i += 1) cumulative[i + 1] = cumulative[i] + smoothed[i]
  const total = cumulative[n]
  for (let i = 0; i <= n; i += 1) cumulative[i] /= total

  return {
    mean: total / n,
    /** Distance through the junction, 0 → 1, to position in the junction, 0 → 1. */
    through: (t: number): number => {
      if (t <= 0) return 0
      if (t >= 1) return 1
      let lo = 0
      let hi = n
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (cumulative[mid] <= t) lo = mid
        else hi = mid
      }
      const c0 = cumulative[lo]
      const c1 = cumulative[lo + 1]
      return (lo + (c1 > c0 ? (t - c0) / (c1 - c0) : 0)) / n
    },
  }
}

/**
 * The priced junctions, by the state they run from. Twelve of the thirteen have no table and cost 1.00
 * everywhere, which is exactly what they all did before — adding a table in `story.ts` §8 is how one of
 * them gets its own rhythm, and nothing here has to be told about it.
 */
export const prices: ReadonlyMap<number, Priced> = new Map(
  ([[5, pricing.five]] as ReadonlyArray<readonly [number, readonly Price[]]>)
    .map(([from, table]) => [from, price(table)] as const)
    .filter((entry): entry is readonly [number, Priced] => entry[1] !== null),
)

/**
 * **A junction's own `0 → 1`, from the one continuous position.**
 *
 * The whole of what C4 hands a survivor. It is **monotone and continuous** in `p` over the entire
 * interval and clamped outside it — so it runs backwards exactly as it runs forwards, holds a composed
 * frame wherever it is stopped, and has no state to leave behind. There is no second clock, no
 * per-junction timeline and no segment-local coordinate anywhere in it: a survivor built on this
 * crosses whatever lies inside its interval without knowing that anything is there.
 *
 * **It was affine until junction 05 was priced.** A priced junction spends more distance on its holds
 * than on its transitions — `story.ts` §8 — so the mapping from distance to position is a curve rather
 * than a ratio. What the affineness was ever protecting is untouched: this still reads `p` and nothing
 * else, it is still continuous everywhere, and it is still monotone, so a survivor written on it still
 * crosses an internal segment offset as one movement.
 */
export const junctionAt = (span: JunctionSpan, p: number): number => {
  if (!(span.length > 0) || !Number.isFinite(span.at)) return 0
  const t = clamp01((p - span.at) / span.length)
  return prices.get(span.from)?.through(t) ?? t
}

/**
 * **The thirteen junctions, checked** — everything C4 claims, in one place.
 *
 * Nothing here is a tolerance and nothing is a preference. Each check is a structural property that is
 * either true of the model or is a real fault, and each says which.
 */
export const assertJunctions = (
  spans: readonly JunctionSpan[],
  boundaries: ReadonlyArray<{ readonly name: string; readonly at: number }>,
): void => {
  if (process.env.NODE_ENV === 'production') return
  const say = (what: string, detail: string) =>
    console.error(`[junction] ${what}\n           ${detail}`)

  /* 1 — thirteen of them, and every one resolves to a real interval. */
  if (spans.length !== 13) {
    say(
      `${spans.length} junctions resolved, not 13.`,
      'V2 §3 authors thirteen. One that does not resolve is a movement the film can never perform.',
    )
    return
  }

  for (const span of spans) {
    if (!Number.isFinite(span.at) || !Number.isFinite(span.ends)) {
      say(
        `Junction ${span.from} → ${span.to} does not resolve.`,
        `it runs ${span.at} → ${span.ends} on p. Both endpoints are state positions, so an infinite one ` +
          'means a state has not been placed — the junction has nowhere to happen.',
      )
      continue
    }

    /* 6 — no zero-width and no negative range. A junction with no extent is a cut. */
    if (!(span.length > 0)) {
      say(
        `Junction ${span.from} → ${span.to} has ${span.length === 0 ? 'no width' : 'negative width'}.`,
        `it runs ${span.at.toFixed(3)} → ${span.ends.toFixed(3)} on p. A junction is a movement; one ` +
          'with no distance to happen over is a cut, and §1 has no verb for a cut.',
      )
    }

    /* 2 — §1's second law, held per junction rather than per table. */
    if (span.survivor.trim() === '') {
      say(
        `Junction ${span.from} → ${span.to} carries nothing across.`,
        '§1: each junction carries exactly one element across and repurposes it.',
      )
    }

    /*
      A quoted weight is a claim about how much movement the junction contains. If that movement is
      longer than the interval it has to happen in, the junction is truncated — the survivor would
      still be crossing when the next state begins.
    */
    if (span.priced !== null && span.length > 0 && span.priced > span.length) {
      say(
        `Junction ${span.from} → ${span.to} is shorter than the movement V2 authors for it.`,
        `§3 quotes ${span.weight}s, which is ${span.priced.toFixed(3)} beats of p through SECONDS_TO_VH; ` +
          `the interval between states ${span.from} and ${span.to} is ${span.length.toFixed(3)}. ` +
          'The weight is V2\'s and the interval is the build\'s, so this is the build spending less ' +
          'distance on the movement than the design asks for — a retime of the beats between those two ' +
          'states, not an edit here.',
      )
    }
  }

  /* 5 — the thirteen tile p, in order, with no gap and no overlap between consecutive junctions. */
  for (let i = 1; i < spans.length; i += 1) {
    const previous = spans[i - 1]
    const here = spans[i]
    if (!Number.isFinite(previous.ends) || !Number.isFinite(here.at)) continue
    if (previous.ends !== here.at) {
      say(
        `Junction ${here.from} → ${here.to} does not begin where ${previous.from} → ${previous.to} ends.`,
        `${previous.from} → ${previous.to} ends at ${previous.ends.toFixed(3)} and ${here.from} → ` +
          `${here.to} begins at ${here.at.toFixed(3)}. The thirteen tile p end to end; a gap is a stretch ` +
          'of the film belonging to no junction, and an overlap is two movements claiming one distance.',
      )
    }
  }

  /*
    4 — **no junction split by a narrative boundary**, and this is the check that decides the 08 → 09
    case rather than anybody deciding it by eye.

    What makes a boundary dangerous is not that it exists. Under one continuous position `p` advances
    at one rate for the whole document, so a value written as a function of `p` crosses any number of
    boundaries without noticing them — that is precisely what C8 bought, and `aperture` is the working
    proof. What would split a junction is a **segment-local coordinate**, which is clamped at its own
    offset: below it the local value is pinned at zero, so anything driven from it is flat for the first
    part of the junction and only then begins to move.
    *
    So the test is not *is a boundary inside this junction* but *is this junction's own progress a
    function of anything that is clamped inside it* — and `junctionAt` answers that by construction: it
    reads `p` and nothing else. A boundary inside an interval is therefore reported as what it is, an
    **internal offset**, and is a fault only for a survivor that is not built on `p`.
  */
  for (const span of spans) {
    if (!Number.isFinite(span.at) || !(span.length > 0)) continue
    for (const boundary of boundaries) {
      if (!Number.isFinite(boundary.at)) continue
      if (boundary.at > span.at && boundary.at < span.ends) {
        console.info(
          `[junction] The ${boundary.name} segment offset sits inside junction ${span.from} → ` +
            `${span.to} (${span.at.toFixed(3)} → ${span.ends.toFixed(3)} on p, offset at ` +
            `${boundary.at.toFixed(3)}).\n` +
            '           This is an internal offset, not a narrative boundary: p advances at one rate ' +
            'across it, and `junctionAt` is affine in p over the whole interval. A survivor written on ' +
            'p crosses it continuously. Only a survivor driven from that segment\'s own clamped ' +
            'coordinate would be split — see `aperture`, which crosses this exact offset as one value.',
        )
      }
    }
  }
}

/**
 * **A segment boundary may never fall inside a junction** — checked, for the junctions that have a
 * distance to fall inside.
 *
 * The rule exists because a boundary used to be the edge of a coordinate system: a value could not be a
 * function of position across one without a hand-welded bridge, and `--frame-mark` was that bridge. Under
 * one continuous position a boundary costs nothing to cross — `aperture` crosses the act's and is one
 * expression — so what is left to protect is narrower and sharper: **a junction that has been priced into
 * a distance must not be interrupted by a change of price part-way through it.**
 *
 * Only junctions with an authored distance are checked, because only they have an inside. Twelve of the
 * thirteen have none yet: C8 ruled V2's quoted seconds are weight rather than duration, and C4 is what
 * turns a weight into a distance. As C4 prices them this assertion tightens on its own — every newly
 * priced junction becomes a new interval to check, and nothing here has to be told about it.
 */
export const assertSegments = (
  positions: ReadonlyArray<{ readonly id: number; readonly at: number }>,
  boundaries: ReadonlyArray<{ readonly name: string; readonly at: number }>,
  /** Junctions with an authored distance: the state they open on, and how long they run on `p`. */
  priced: ReadonlyArray<{ readonly from: number; readonly length: number }>,
): void => {
  if (process.env.NODE_ENV === 'production') return
  const where = new Map(positions.map((s) => [s.id, s.at]))

  for (const junction of priced) {
    const opens = where.get(junction.from)
    if (opens === undefined || !Number.isFinite(opens) || !Number.isFinite(junction.length)) continue
    const closes = opens + junction.length
    for (const boundary of boundaries) {
      if (!Number.isFinite(boundary.at)) continue
      if (boundary.at > opens && boundary.at < closes) {
        console.error(
          `[narrative] The ${boundary.name} segment boundary falls inside junction ` +
            `${junction.from} → ${junction.from + 1}.\n` +
            `            The junction runs ${opens.toFixed(3)} → ${closes.toFixed(3)} on p and the ` +
            `boundary is at ${boundary.at.toFixed(3)}. A junction is one movement; changing the price of ` +
            'a beat part-way through one makes its second half travel at a different rate than its first.',
        )
      }
    }
  }
}

/**
 * **Where the segments sit on `p`, and the check that they still tile it in order.**
 *
 * C4 collapsed three independently measured positions into one. What is left of the three is not three
 * positions but three **views** of one: the act and the method are still priced differently — a beat of
 * the method deliberately costs less than a beat of the film — so each has an offset on `p` and a scale.
 * `local = (p − offset) × scale`, which is exactly the arithmetic the driver used to do from three
 * separate DOM origins, re-expressed through a single scalar.
 *
 * Both numbers are runtime facts: the offsets come from layout and the scales from `--pin` and its
 * siblings, which change with the pointer. So this cannot be asserted at module load, and the driver
 * hands it over once per measurement instead.
 *
 * **What is worth asserting is the thing C4 is for:** that all fourteen states fall on one continuous
 * position, strictly in order. Before the collapse that sentence could not even be written down — the
 * states lived in three incomparable scalars, and "state 9 comes after state 8" was true only because
 * of how the page happened to be laid out.
 */
export const assertNarrative = (
  positions: ReadonlyArray<{ readonly id: number; readonly at: number }>,
): void => {
  if (process.env.NODE_ENV === 'production') return
  const say = (what: string, detail: string) =>
    console.error(`[narrative] ${what}\n            ${detail}\n            Fix it in src/motion/story.ts.`)

  if (positions.length !== states.length) {
    say(
      `${positions.length} of ${states.length} states resolved to a position.`,
      'Every state has to sit somewhere on p. One that does not is a state the Ledger can never light ' +
        'and the film can never reach.',
    )
    return
  }

  for (let i = 1; i < positions.length; i += 1) {
    const previous = positions[i - 1]
    const here = positions[i]
    if (!(here.at > previous.at)) {
      say(
        `State ${here.id} does not come after state ${previous.id} on p.`,
        `${previous.id} resolves to ${previous.at.toFixed(3)} and ${here.id} to ${here.at.toFixed(3)}, ` +
          'both in beats of the film. The sequence is one continuous position now, so this is a real ' +
          'ordering fault rather than two runways disagreeing — a beat moved past one it used to follow, ' +
          'or a segment offset is wrong.',
      )
    }
  }
}

/**
 * **Every state has to be somewhere the visitor can actually get to.**
 *
 * `assertNarrative` checks the fourteen are in order on `p`; it cannot check that they are *reachable*,
 * because how far `p` goes is a runtime fact — `(maxScroll − origin) / vh / perBeat`, and only the
 * driver knows the document's height. So this is the other half of that check, and the driver hands the
 * furthest position over once per measurement.
 *
 * **Why it exists.** State 14 spent an unknown length of time unreachable and nothing said so. Contact
 * carried `data-state` while hanging absolutely off a *sticky* frame, so any re-measure taken with that
 * frame stuck recorded its position one `--rule-y` past the end of the document. `narrativePositions`
 * answered with a perfectly ordinary finite number, `assertNarrative` saw fourteen states in strict
 * order and said nothing, and the last third of junction 13 — §8's whole `detail` channel — simply never
 * ran. A position that is finite, ordered and *past the end of the scroll* is the one fault the existing
 * assertions were blind to, and it is the class of fault a sticky ancestor produces every time.
 *
 * `+Infinity` is not reported: that is `narrativePositions`' own honest answer while the page is still
 * measuring, and the driver already holds the audit until the origin is fixed.
 */
export const assertReachable = (
  positions: ReadonlyArray<{ readonly id: number; readonly at: number }>,
  furthest: number,
): void => {
  if (process.env.NODE_ENV === 'production') return
  if (!Number.isFinite(furthest)) return

  for (const state of positions) {
    if (!Number.isFinite(state.at)) continue
    if (state.at <= furthest) continue
    console.error(
      `[narrative] State ${state.id} is past the end of the document.\n` +
        `            it resolves to ${state.at.toFixed(3)} on p and the furthest the visitor can scroll ` +
        `is ${furthest.toFixed(3)}, so the state is never entered and the junction into it never ` +
        `finishes.\n` +
        '            A finite position past the end usually means the element carrying `data-state` was ' +
        'measured through a sticky ancestor — measure the section, never the stage.',
    )
  }
}

/**
 * Chapter I's clocked beats in the order they are due, for the sequencer to walk.
 *
 * Only the beats on a fixed clock are here. The subtitle and the interface are not: the first is gated
 * on the footage and the second on when the first actually landed, so neither has a time that can be
 * written down in advance.
 *
 * **The order is the clock's, and it has to be.** `opening.tsx` walks this list and keeps the last
 * entry whose time has passed, so an entry out of chronological order would be overwritten by the one
 * before it and its beat would never fire — and two entries sharing a millisecond would do the same.
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
        `Chapter I's own dusk leaves the landscape at 0.70.`,
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
  /*
    **The frame is released at `METHOD_BEATS` and the section ends one viewport later**, because
    `.method` is the pin plus the held frame's own height: a sticky element's range is its parent's
    content box less itself, so the last viewport of the box is the frame scrolling out of view. The
    driver's `m` is not clamped at `METHOD_BEATS`, so a span may legitimately resolve inside that tail
    — and since 21 September 2026 the clearing does, deliberately (`TIMING.method.gathered.holds`).

    So what is checked is the **section**, not the pin: the composition has to finish leaving before
    Questions' own top, with a breath left over. `tail` is one viewport in this runway's beats, and
    `perMethodBeat` is what a beat costs.
  */
  /*
    **Measured on `coarse`, because that is the binding case.** The tail is one viewport whatever the
    runway costs, so in *beats* it shrinks as a beat gets more expensive: a beat is 150vh on a wheel
    and 225vh on a thumb, which makes the same viewport 0.67 beats and 0.44. Checking `fine` would
    pass a clearing that ran off the end of the section on touch.
  */
  const methodPerBeat = Math.max(
    parseFloat(TIMING.distance.method.fine),
    parseFloat(TIMING.distance.method.coarse),
  ) / TIMING.distance.methodBeats
  const methodTail = r(100 / methodPerBeat)
  const methodEnds = r(METHOD_BEATS + methodTail)
  const methodBreath = r(methodEnds - methodSpans.endsAt)
  if (methodSpans.endsAt > methodEnds) {
    complain(
      'The method is still clearing when Questions begins.',
      `it resolves at ${methodSpans.endsAt} beats and the section ends at ${methodEnds} ` +
        `(${METHOD_BEATS} of pin plus ${methodTail} of trailing frame). The two compositions would be ` +
        `on screen together. Lower gathered.holds, or raise METHOD_BEATS — methodPin follows it.`,
    )
  } else if (methodBreath < 0.1) {
    complain(
      'The method clears with nothing between it and Questions.',
      `${methodBreath} beats stand between the clearing finishing and the section ending — about ` +
        `${Math.round(methodBreath * methodPerBeat * 8.89)}px ` +
        `at 1920 x 889. The passage needs a breath, not a cut: lower gathered.holds.`,
    )
  }

  /*
    **The question has to arrive among the field's last phrases, not after them.**

    This replaces the assertion that guarded the opposite rule. Until 20 September 2026 the question
    was derived off the room being complete plus `gathered.holds`, and what was checked was that the
    stillness before it was real. The design owner reversed the relationship — *"deve entrar juntamente
    com as frases finais do campo de pensamentos… não a antecipar"* — so what is worth checking is the
    overlap: the question opens inside the third burst, and it is still the last thing to finish.

    It is authored now, so nothing derives it back into place if the beat is moved; this is the only
    thing standing between `composed.ask` and the two readings it must not have — asked before the room
    has anything in it, or asked into a room that has already finished.
  */
  const thirdBurst = methodSpans.words[5]?.from ?? 0
  const fieldLit = methodSpans.words.reduce((latest, span) => Math.max(latest, span.to), 0)
  if (methodSpans.ask.from < thirdBurst) {
    complain(
      'The studio asks before the room has finished speaking.',
      `composed.ask opens at ${methodSpans.ask.from} and the field's last burst does not begin until ` +
        `${thirdBurst}. The question closes a composition the space is already populated with; ahead of ` +
        `that burst it is asked into a room still filling up.`,
    )
  }
  if (methodSpans.ask.from > fieldLit) {
    complain(
      'The question waits for the room instead of arriving with it.',
      `the field is fully lit at ${fieldLit} and composed.ask does not open until ` +
        `${methodSpans.ask.from}. It is meant to come in among the closing phrases, not after them — ` +
        `that pause was the old chained reading and the design owner replaced it.`,
    )
  }

  /*
    **The statement lands while the room is still filling**, which is what makes it the anchor rather
    than a heading over a finished frame: *a composição principal deve nascer ENTRE essas frases.*
  */
  if (methodSpans.answer.to >= methodSpans.gatheredFrom) {
    complain(
      'The statement arrives after the room has finished filling.',
      `composed.answer closes at ${methodSpans.answer.to} and the last of the room is lit at ` +
        `${methodSpans.gatheredFrom}. It is meant to be born among the field, not after it.`,
    )
  }

  /*
    **The two printing assertions are gone with the printing.** They checked that the light type cleared
    before the paper started coming back, and that the answer was printed inside that return — the
    ~1.1:1 frame `story.methodStory.printing.clears` argues at length. There is no return: the room the
    composition is lit in is the room Questions is written in, so nothing crosses and there is nothing
    to keep apart. The clearing itself is still asserted by `endsAt` above.
  */

  /*
    The room has to have somewhere to arrive over. `methodArrival` is the one distance in the section stated
    in viewport heights, so it cannot be caught by the beat checks above — and an arrival that settles before
    it begins divides by zero in the driver and paints the whole room in a single frame.
  */
  if (methodEntrance.over <= 0) {
    complain(
      'The room has no distance to arrive over.',
      `methodArrival.begins is ${methodArrival.begins} and settles is ${methodArrival.settles}, which ` +
        `leaves ${methodEntrance.over} viewport heights. The paper would go dark in one frame.`,
    )
  }

  /*
    Every gap in the section, for the reason the shot's and the act's are checked: chaining makes overlap
    impossible only while all of them are positive, and two questions in one frame is the one failure that
    would look like a bug rather than a retiming.
  */
  const methodGaps: ReadonlyArray<readonly [string, number]> = [
    ['gathered.holds', method.gathered.holds],
    ['drift.holdsPastTheResolution', method.drift.holdsPastTheResolution],
    /*
      And every authored gap in the composition, which is where the chaining moved to: the arrivals are
      stated rather than derived now, so two of them landing on the same frame is an ordering mistake
      this file can still catch. Each entry is the distance from one arrival to the next, in order.
    */
    ...method.composed.lines.slice(1).map(
      (line, i) =>
        [`composed.lines[${i + 1}]`, r(line[0] - method.composed.lines[i][0])] as const,
    ),
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
    ── Questions · three moments, two triggers, and the frame they all happen in ─────────────

    Everything in this section is a distance after the **lock**, where `.asked` stops being carried up
    the screen and stands. Nothing in this file can see the lock — it is a rendered position the
    driver measures — so what is checked here is that the offsets authored against it are positive,
    ordered, and small enough to fit in the frame the lock creates.

    **There are two triggers and three moments**, which is deliberate: the FAQ sequence is fired once
    and its second group is a delay in seconds rather than a place, so a visitor who stops scrolling
    still sees the composition finish.
  */
  const askAnchor = TIMING.questions.anchor
  const askFaq = TIMING.questions.faq

  /*
    **Nothing may be revealed above the lock.** A negative offset puts a beat back on the approach,
    where the list is still travelling with the page — which is the exact fault this origin replaced,
    and it would come back silently as a minus sign.
  */
  for (const [name, at] of [
    ['anchor.afterLock', askAnchor.afterLock],
    ['faq.afterLock', askFaq.afterLock],
  ] as ReadonlyArray<readonly [string, number]>) {
    if (at < 0) {
      complain(
        'A Questions beat fires before the composition has stopped moving.',
        `questions.${name} is ${at}. The origin is the sticky lock, so anything negative is on the ` +
          `approach — where the whole list is still being carried up the screen by page scroll, and ` +
          `whatever is revealed there is revealed on the move.`,
      )
    }
  }

  /*
    **The HOLD is the hierarchy.** If the FAQ sequence fires before `anchor.afterLock + anchor.hold`,
    the anchor stops being the section's opening and becomes the head of a list again — which is what
    the separation exists to prevent, and it would arrive as a one-character edit nobody re-measured.
  */
  const askHeld = r(askFaq.afterLock - askAnchor.afterLock)
  if (askHeld < askAnchor.hold) {
    complain(
      'The FAQ sequence fires before the anchor has held.',
      `questions.anchor.afterLock is ${askAnchor.afterLock} and hold is ${askAnchor.hold}, so ` +
        `nothing may fire before ${r(askAnchor.afterLock + askAnchor.hold)}. faq.afterLock is ` +
        `${askFaq.afterLock}, which leaves ${askHeld} viewport heights — the anchor would still be ` +
        `arriving when the list starts.`,
    )
  }

  /*
    **The breath has to be one**, and it is a duration rather than a distance now, so the only thing
    that can go wrong is it being absent: at zero the six rows run at one flat interval and the three
    and three the section is composed in stop existing.
  */
  if (askFaq.breath <= 0) {
    complain(
      'The FAQ sequence has no breath in it.',
      `questions.faq.breath is ${askFaq.breath}s. Without it the six rows arrive at one interval and ` +
        `read as a single cascade rather than as two halves of one build.`,
    )
  }

  /*
    **And the breath has to fall inside the sequence.** `breathAfter` at 0 or at `rows` puts it before
    the first row or after the last, where it is a delay on the whole thing rather than a pause in it.
  */
  if (askFaq.breathAfter <= 0 || askFaq.breathAfter >= askFaq.rows) {
    complain(
      'The FAQ breath falls outside the sequence.',
      `questions.faq.breathAfter is ${askFaq.breathAfter} and there are ${askFaq.rows} rows. It has ` +
        `to divide them, not precede or follow them.`,
    )
  }

  /*
    **The rows are meant to overlap, and there is still a ceiling.** Since 21 September 2026 the
    interval is deliberately shorter than a row — *"As entradas devem sobrepor-se… a lista esta a
    formar-se"* — so two to three lines in flight is the intended reading, not a fault. What is worth
    catching is the far end: past four the six stop being a sequence at all and arrive as one block,
    which is the thing the stagger exists to prevent.
  */
  const askRow = r(askFaq.rule.leads + askFaq.over)
  const askInFlight = r(askRow / askFaq.stagger)
  if (askInFlight > 4) {
    complain(
      'The FAQ rows overlap too far to read as a sequence.',
      `a row takes ${askRow}s and they open ${askFaq.stagger}s apart, so ${askInFlight} are arriving ` +
        `at once. Shorten faq.over, or widen the stagger.`,
    )
  }

  /*
    **Every beat has to fit inside the stuck frame, with reading left over.**

    The lock lasts exactly as long as `distance.asked` — the foot drawn under the list is what the
    sticky element has to travel in, so when it runs out the composition starts scrolling away again.
    A beat authored past it would fire on a frame that is moving, which is the fault the lock exists
    to remove, arriving from the other end.
  */
  const askZone = parseFloat(TIMING.distance.asked.fine) / 100
  const askReading = r(askZone - askFaq.afterLock)
  if (askReading <= 0) {
    complain(
      'The FAQ sequence fires after the reading zone has run out.',
      `questions.faq.afterLock is ${askFaq.afterLock} and distance.asked is ${askZone} viewport ` +
        `heights. The list is only stuck for that far; past it the composition is travelling again.`,
    )
  } else if (askReading < 0.4) {
    complain(
      'Questions has almost no reading zone left.',
      `${askReading} viewport heights stand between the FAQ trigger and the end of the lock. The ` +
        `section exists to be read standing still; lengthen distance.asked or bring the trigger in.`,
    )
  }

  /*
    **Every row has to belong to a group.** `faq.size` and `faq.groups` multiply out to how many
    questions the section can reveal, and `content/site.ts` decides how many there are. A question
    with no channel would simply never arrive — invisible, pressable by nothing, and silent.
  */
  const askRows = site.publication.questions.rows.length - 1
  if (askRows !== askFaq.rows) {
    complain(
      'The FAQ sequence does not cover the questions.',
      `content/site.ts has ${askRows} questions under the anchor and questions.faq.rows is ` +
        `${askFaq.rows}. Every row needs a channel, or it never arrives — invisible, pressable by ` +
        `nothing, and silent.`,
    )
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

  /*
    ── Junction 13 → 14 ────────────────────────────────────────────────────────────────────────
    Three things about the first junction authored as distance, none of them true by construction.
  */
  if (persistSpans.endsAt > 1) {
    complain(
      'Junction 13 → 14 does not fit its own distance.',
      `its last cue finishes at ${persistSpans.endsAt} of the junction and the sheet is ${persisting.total}s ` +
        `long. Raise persisting.total, or bring asks forward — the junction cannot end after it has ended.`,
    )
  }

  /*
    The held-empty frame is the cue under test, and it is the one cue that is defined by *absence*. If
    anything is scheduled inside it, it is no longer empty and the junction has quietly lost the beat
    §8 named. Checked rather than trusted, because a later edit to any neighbouring cue could reach
    into it without touching this line.
  */
  {
    const inside = (x: number) => x > persistSpans.empty.from && x < persistSpans.empty.to
    const scheduled: ReadonlyArray<readonly [string, Span]> = [
      ['crosses', persistSpans.crosses],
      ['leaves', persistSpans.leaves],
      ['returns', persistSpans.returns],
    ]
    for (const [name, span] of scheduled) {
      if (inside(span.from) || inside(span.to)) {
        complain(
          'Something happens inside the held-empty frame.',
          `${name} runs ${span.from}–${span.to} and the empty hold is ${persistSpans.empty.from}–` +
            `${persistSpans.empty.to}. §8 asks for a frame with the ground, the Ledger and one rule in ` +
            `it and nothing else; a cue that reaches into it removes the pause the junction turns on.`,
        )
      }
    }
  }

  /*
    **The exchange happens in the dark, and nowhere else.** `contact.passage` is the answer to two
    photographs that share no value anywhere — the studio's one lamp against the hillside's sky — and
    the whole of that answer is that the plates pass each other while the light is at its floor. If
    the crossing ever reached outside `[dusk.to, dawn.from]` the frame would carry both pictures at
    once for as far as it overhung, which is the double exposure this passage was built to remove.
  */
  if (persistSpans.crosses.from < persistSpans.dusk.to || persistSpans.crosses.to > persistSpans.dawn.from) {
    complain(
      'The plates change places outside the dark.',
      `crosses runs ${persistSpans.crosses.from}–${persistSpans.crosses.to} and the floor is ` +
        `${persistSpans.dusk.to}–${persistSpans.dawn.from}. Move crosses inside it, or open dusk ` +
        'earlier and dawn later — a crossing seen in light is two photographs in one frame.',
    )
  }

  /*
    And the light has to be back before anything is written on it. §8 gives Contact a held-empty frame
    and then a headline; a dawn still rising under the headline would be the environment arriving
    *after* the type it is the ground for, which is the one order this junction cannot have.
  */
  if (persistSpans.dawn.to > persistSpans.empty.from) {
    complain(
      'The light is still coming up when the frame is meant to be standing empty.',
      `dawn ends at ${persistSpans.dawn.to} and the empty hold opens at ${persistSpans.empty.from}. ` +
        '§8 asks for the environment to land and then hold; finish the lift before the hold.',
    )
  }

  /*
    **The two assertions about the rule's resize are retired with the resize** — 26 September 2026.
    The closing rule no longer carries into Contact (`TIMING.environment.persisting` says why); it
    releases in place with the rows, which the empty-frame assertion above already covers.
  */

  /*
    And the camera has to have stopped before the frame stands empty. The composition is written on a
    frame that has landed; a return still easing under the held-empty beat would be the ground moving
    in the one stretch §8 defines as nothing happening.
  */
  if (persistSpans.returns.to > persistSpans.empty.from) {
    complain(
      'The camera is still returning when the frame is meant to be standing empty.',
      `returns ends at ${persistSpans.returns.to} and the empty hold opens at ${persistSpans.empty.from}. ` +
        'Let the camera land first; Contact is written on a frame that has stopped moving.',
    )
  }

  /*
    **One camera, not two.** The push into the room and the push across the hillside are the same move
    on two plates, so the second must begin before the first has stopped — otherwise the camera halts
    in the dark and starts again, which is exactly the sequence of separate gestures this replaced.
  */
  if (persistSpans.returns.from > persistSpans.leaves.to) {
    complain(
      'The camera stops between the room and the hillside.',
      `leaves ends at ${persistSpans.leaves.to} and returns opens at ${persistSpans.returns.from}. ` +
        'Open the second half of the push before the first one lands.',
    )
  }

  /*
    **The trigger comes after the empty frame, never inside the passage.** Contact's composition plays on
    a clock once it is asked for; asked for early, it would be writing over a ground still arriving —
    and it releases below `empty.from`, so the two thresholds have to leave the empty frame between them
    or a small reverse flick would release and re-trigger the composition in the same breath.
  */
  if (persistSpans.asks < persistSpans.empty.to) {
    complain(
      'Contact is asked for before the frame has stood empty.',
      `asks is ${persistSpans.asks} and the empty hold ends at ${persistSpans.empty.to}. ` +
        '§8 lands the environment, holds it empty, and only then writes on it.',
    )
  }

  /*
    ── The spine against the story ───────────────────────────────────────────────────────────────
    `spine.ts` associates each V2 state with the beats that compose it, by name. Names are the one
    thing the compiler cannot check, so a rename in the story would leave the spine quietly pointing
    at a beat that no longer exists — and the state would keep claiming to be built.
  */
  const storyObjects: Readonly<Record<string, object>> = {
    chapterOneStory: one,
    shotStory: shot,
    actStory: act,
    methodStory: method,
    afterTheFilm,
  }
  for (const state of states) {
    for (const path of state.beats) {
      const [root, key] = path.split('.')
      const base = storyObjects[root]
      if (base === undefined) {
        complain(
          `State ${state.id} names the story object “${root}”, which does not exist.`,
          'The spine associates states with beats by name. Either the object was renamed or the spine ' +
            'is pointing at something that was never there.',
        )
      } else if (key !== undefined && !Object.prototype.hasOwnProperty.call(base, key)) {
        complain(
          `State ${state.id} names the beat “${path}”, which does not exist.`,
          `${root} has no ${key}. Renaming a beat means renaming it in src/motion/spine.ts too — that ` +
            'is the whole price of the spine associating rather than duplicating.',
        )
      }
    }
  }

  /*
    States are a sequence, so their entry positions have to run forwards within a runway. Across
    runways they cannot be compared — three prices, three origins — but inside one, a state that
    begins before the state before it would put the film in two places at once.
  */
  const seen = new Map<Runway, { id: number; at: number }>()
  for (const entry of stateEntries) {
    if (entry.at === null) continue
    const previous = seen.get(entry.runway)
    if (previous !== undefined && entry.at < previous.at) {
      complain(
        `State ${entry.id} begins before state ${previous.id} on the same runway.`,
        `${entry.id} enters at ${entry.at} and ${previous.id} at ${previous.at}, both in beats of the ` +
          `${entry.runway}. Every entry is read from a resolved span, so this means a beat moved past ` +
          'one it used to follow — fix the beat, not the spine.',
      )
    }
    seen.set(entry.runway, { id: entry.id, at: entry.at })
  }
}
