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
 * Three things in the piece are true by intention rather than by construction, so they are checked in
 * development rather than trusted:
 *
 *   - the timestamp has cleared the frame at the exact instant the identity arrives. Both sides are
 *     authored — one as an anchor, one as a hold — so nothing structural keeps them equal.
 *   - every gap is positive. Chaining makes overlap impossible *while that holds*, and a negative
 *     offset is the one way back to two beats sharing a frame.
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

import {
  BEATS,
  afterTheFilm,
  beat,
  chapterOneStory as one,
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

  /** Where the travelling word hands over to the fixed marker. A step, not a ramp. */
  handoffAt: iiiTo,

  /** Where the shot stops asking for scroll. */
  endsAt: iiiTo,
} as const

/* ──────────────────────────── Chapter III, and the interface ──────────────────────────── */

export const studioBlocks = afterTheFilm.studioBlocks
export const navHover = afterTheFilm.navHover

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

  /* And the whole shot has to fit the pinned frame, or its tail is a beat nobody sees. */
  if (spans.endsAt > BEATS) {
    complain(
      'The shot no longer fits.',
      `it ends at ${spans.endsAt} beats and BEATS is ${BEATS}. Raise BEATS — that retimes nothing, ` +
        `since pin only changes how far the hand travels — or shorten a hold.`,
    )
  }
}
