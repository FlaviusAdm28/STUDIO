/**
 * Shared mechanism for the scroll-driven part of the story.
 *
 * No timings here, and no relationships either — every number comes from `story.ts` by way of
 * `timeline.ts`. This file holds only the machinery that turns a resolved range into a value, and the
 * assembled list the driver walks.
 *
 * The three-way split is the point. `story.ts` is edited to change the piece, `timeline.ts` resolves
 * it, and this decides how a range becomes an opacity — which is a much rarer thing to want to change.
 */

import { clamp01, smoothstep } from './easings'
import { BEATS } from './story'
import { type Cue, type Span, spans } from './timeline'

/** Eased rise from 0 to 1 across a range. */
export const rise = (s: number, span: Span): number =>
  smoothstep(clamp01((s - span.from) / (span.to - span.from)))

/** Eased fall from 1 to 0 across a range. */
export const fall = (s: number, span: Span): number => 1 - rise(s, span)

/** A beat's opacity: whichever of its arrival and its departure is further along. */
export const show = (s: number, c: Cue): number => Math.min(rise(s, c.enter), fall(s, c.exit))

/** A custom property, and the value it should have at a given scroll position in beats. */
export type Track = ReadonlyArray<readonly [name: string, at: (s: number) => number]>

/**
 * The shot, assembled.
 *
 * The driver in `scroll-stage.tsx` walks this and writes each value; it contains no numbers of its own
 * and knows nothing about what any of them mean. Every entry is independent and none of them read each
 * other, which is what makes the whole shot evaluable at any position, in any order, backwards
 * included.
 *
 * To retime a beat, edit `story.ts`. This list only says which property each beat drives.
 */
export const track: Track = [
  ['--veil', (s) => fall(s, spans.heroWords)],

  /* Two stages with a hold between them. The marker arrives during the hold. */
  [
    '--dusk',
    (s) => spans.dusk.depth * rise(s, spans.dusk.first) + (1 - spans.dusk.depth) * rise(s, spans.dusk.rest),
  ],

  ['--marker', (s) => show(s, spans.marker)],

  /*
    `CHAPTER II` rewriting itself into `II Philosophy`, inside the marker's own hold. Three independent
    functions of position, which is what makes it one continuous gesture forwards *and* backwards: there
    is no state to unwind, so scrolling back up interpolates the same three numbers the other way.

    `--mkblur` is the word losing focus as it goes, so it rides the *same* range as its own opacity
    rather than having one of its own — one range, two properties, and therefore no way for the softening
    and the fading to drift apart under a retiming. It is a distance rather than a fade, so CSS gives it
    its unit; see `story.chapterTwoBecomesPhilosophy.blur`.
  */
  ['--mkword', (s) => fall(s, spans.becomesWordLeaves)],
  ['--mkblur', (s) => spans.becomesBlur * rise(s, spans.becomesWordLeaves)],
  ['--mknum', (s) => rise(s, spans.becomesNumeralTravels)],
  ['--mktopic', (s) => rise(s, spans.becomesTopicArrives)],

  ['--statement', (s) => show(s, spans.statement)],

  ['--i1', (s) => show(s, spans.wedding)],
  ['--i2', (s) => show(s, spans.exhibition)],
  ['--i3', (s) => show(s, spans.artist)],
  ['--i4', (s) => show(s, spans.finalPerformance)],

  ['--warmth', (s) => rise(s, spans.warmth)],
  ['--dawn', (s) => rise(s, spans.dawn)],

  ['--close', (s) => rise(s, spans.close)],
  ['--out1', (s) => fall(s, spans.leadLeaves)],
  ['--out2', (s) => fall(s, spans.anotherLeaves)],
  ['--tm', (s) => rise(s, spans.travel)],
  ['--stop', (s) => fall(s, spans.periodLeaves)],
  ['--swap', (s) => rise(s, spans.iiiStudio)],
  ['--mark3', (s) => rise(s, spans.iiiStudio)],

  /* A step, not a ramp — see `story.iiiStudio`. */
  ['--handoff', (s) => (s >= spans.handoffAt ? 1 : 0)],

  /*
    Chapter III's first page, coming into existence under the travelling word. `--studio` is its light;
    `--settle` is how much of its rise is still to come, so CSS multiplies rather than subtracts. Both
    read the same range, because they are one movement — see `story.studioEmerges`.
  */
  ['--studio', (s) => rise(s, spans.studioEmerges)],
  ['--settle', (s) => fall(s, spans.studioEmerges)],
]

/**
 * How many decimal places a written value keeps.
 *
 * Four is past the point any of them is a different colour on screen, and short enough that the
 * driver's write-only-on-change comparison is comparing short strings.
 */
export const PRECISION = 4

export { BEATS }
