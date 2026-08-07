/**
 * The motion system.
 *
 * Every timing in the project lives here and nowhere else. No component holds a duration, delay,
 * easing or threshold, and `globals.css` declares none of them — it only reads them.
 *
 *   story.ts        THE STORYBOARD. Anchors and relationships, in narrative order.
 *                   This is the file you edit, and the only one.
 *
 *   timeline.ts     resolves the storyboard into the absolute values the sequencer and driver need,
 *                   and asserts the three intentions a ripple edit could break silently
 *   easings.ts      shared — the curves
 *   scroll.ts       shared mechanism — how a resolved range becomes a value, and the track
 *   transitions.ts  shared mechanism — generates the stylesheet that carries the story into CSS
 *
 * Three rules, and they are the whole design:
 *
 *   1. Timings are per-beat and never shared. Tuning "A wedding." must not touch "An exhibition."
 *   2. A beat states its relationship to the previous beat rather than an absolute it could derive.
 *      Absolutes belong to anchors only.
 *   3. Easing and mechanism are shared and never per-beat.
 *
 * Import from `@/motion`:
 *
 *   import { beat, cues, pace, schedule, story } from '@/motion'
 *
 * The standard is `docs/development/02-motion-system.md`.
 */

/* The storyboard. `story` is the editable surface; the rest is its supporting cast. */
export {
  beat,
  chapterOneStory,
  shotStory,
  afterTheFilm,
  pace,
  rates,
  pin,
  BEATS,
} from './story'
export type { Beat } from './story'

/* Resolved absolutes. Read these; never write them down. */
export {
  cues,
  spans,
  schedule,
  studioBlocks,
  navHover,
  chapterThree,
  closestBeats,
  maxAdvance,
} from './timeline'
export type { Span, Cue } from './timeline'

export { easings, clamp01, smoothstep, unsmoothstep } from './easings'
export type { Easing } from './easings'

export { rise, fall, show, track, PRECISION } from './scroll'
export type { Track } from './scroll'

export { motionCss } from './transitions'
