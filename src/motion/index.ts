/* The one file to edit to change any pacing on the site. */
export { TIMING } from './timing'

/**
 * The motion system.
 *
 * Every timing in the project lives here and nowhere else. No component holds a duration, delay,
 * easing or threshold, and `globals.css` declares none of them — it only reads them.
 *
 *   story.ts        THE STORYBOARD. Anchors and relationships, in narrative order.
 *                   This is the file you edit, and the only one.
 *
 *   spine.ts        THE V2 SPINE. Fourteen states and thirteen junctions, transcribed from the
 *                   approved design. Identity, never timing — it says *where the film is* and
 *                   associates each state with the beats that already compose it.
 *
 *   environment.ts  THE ENVIRONMENT, PROJECTED. Which of the three plates is behind the page at a
 *                   given position, how lit it is, and how far the state-08 pan has run. Reads the
 *                   spine's own §2 columns and the positions the driver already measures; holds no
 *                   state, no clock and no numbers of its own.
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
  actStory,
  afterTheFilm,
  atmosphere,
  input,
  occasionsStory,
  pace,
  pricing,
  rates,
  methodStory,
  pin,
  actPin,
  methodPin,
  methodArrival,
  BEATS,
  ACT_BEATS,
  METHOD_BEATS,
} from './story'
export type { Beat, Price } from './story'

/* The V2 spine. Where the film is — states, junctions, and what the Ledger reads. */
export {
  DESTINATIONS,
  PLATE,
  VERB,
  WORK_IS_AN_ASIDE,
  depthOf,
  destinationState,
  junctions,
  stateOf,
  states,
  tickOf,
} from './spine'
export type { Chapter, Destination, Junction, LedgerState, Plate, Runway, State, Verb } from './spine'

/* The Environment — which plate is behind the page, and how lit. A projection of the spine. */
export { environmentValues } from './environment'
export type { EnvironmentValues, Leaving, Placement } from './environment'

/* Resolved absolutes. Read these; never write them down. */
export {
  cues,
  spans,
  actSpans,
  methodSpans,
  methodEntrance,
  schedule,
  studioBlocks,
  navHover,
  answer,
  about,
  work,
  chapterThree,
  closestBeats,
  maxAdvance,
  stateEntries,
  narrativePositions,
  junctionSpans,
  junctionAt,
  persistSpans,
  relightSpans,
  assertNarrative,
  assertReachable,
  assertSegments,
  assertJunctions,
} from './timeline'
export type { Span, Cue, Segment, Measured, JunctionSpan } from './timeline'

export { easings, clamp01, smoothstep, unsmoothstep } from './easings'
export type { Easing } from './easings'

export {
  rise,
  fall,
  show,
  ramp,
  aperture,
  track,
  actTrack,
  methodPlayed,
  methodTrack,
  persistTrack,
  relightTrack,
  PRECISION,
} from './scroll'
export type { Track } from './scroll'

export { motionCss } from './transitions'
