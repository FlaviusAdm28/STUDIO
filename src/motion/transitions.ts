/**
 * The bridge to CSS. Shared mechanism — no timings here, they all come from `story.ts`.
 *
 * Most of this project's motion is performed by CSS: transitions on opacity, and custom properties
 * the scroll driver writes every frame. CSS cannot import a TypeScript module, so something has to
 * carry the values across, and this is it — one generated stylesheet, rendered into the document by
 * `layout.tsx`.
 *
 * The direction matters. **`story.ts` is the source and CSS is the consumer**, never the other way
 * round. `globals.css` declares none of these values and only reads them, so there is nowhere for a
 * stylesheet and the story to hold two different opinions about the same number. That was a real
 * failure mode here: `--haste` used to be four literals in a stylesheet, kept in step with two
 * constants in a component by a comment asking whoever edited one to remember the other.
 *
 * One custom property per beat that fades, named for the beat. Nothing is shared — `--fade-timestamp`
 * and `--fade-navigation` are both 1000ms and are two separate properties, because moving one must
 * never move the other.
 */

import { easings } from './easings'
import { chapterOneStory as one, pin, rates } from './story'
import { navHover, studioBlocks } from './timeline'
import { PRECISION, track } from './scroll'

/**
 * The multiplier CSS applies to every duration in Chapter I, for a given clock rate.
 *
 * The reciprocal, exactly. The sequencer multiplies its clock by the rate; CSS divides every duration
 * by the same number. So the fades keep their proportions to each other and to the gaps between them:
 * nothing overlaps that did not overlap before, and no beat is skipped. The choreography is identical
 * — only its mapping to real seconds changes.
 *
 * Three decimal places reproduces the four values this replaced — 1, 0.645, 0.45, 0.29 — exactly.
 */
const haste = (rate: number): string => (1 / rate).toFixed(3)

/**
 * One property per beat that fades. Constant, or switched by a media query.
 */
const settings: ReadonlyArray<readonly [string, string]> = [
  ['--curve', easings.DEFAULT],

  /* Chapter I. Each of these is multiplied by --haste where it is consumed. */
  ['--fade-timestamp', `${one.timestamp.fade}ms`],
  ['--fade-video', `${one.video.fade}ms`],
  ['--fade-chapter-one', `${one.chapterOne.fade}ms`],
  ['--fade-subtitle', `${one.subtitle.fade}ms`],
  ['--fade-navigation', `${one.navigation.fade}ms`],

  /* Chapter III and the interface. Deliberately outside --haste — see story.ts. */
  ['--fade-studio-blocks', `${studioBlocks.fade}ms`],
  ['--fade-nav-hover', `${navHover.fade}ms`],

  /*
    The value before the sequencer's first frame, and the value it keeps if nobody ever hurries. From
    then on the sequencer writes `--haste` inline on `.opening` every time the rate changes, because the
    rate is now continuous rather than one of a few fixed steps — see `opening.tsx`. Inline wins over
    anything here, so this is a starting point rather than a competing opinion.
  */
  ['--haste', haste(rates.base)],

  ['--pin', pin.fine],

  /*
    Where the shot starts, in pixels. Zero until the visitor scrolls during the opening; the driver
    writes it, and `.film` adds it to its height so the shot always has its full runway however far
    they got. See `scroll-stage.tsx`.
  */
  ['--origin', '0px'],
]

/**
 * The shot's first frame, evaluated rather than transcribed.
 *
 * The page has to paint correctly before the scroll driver has run once, which means every property
 * the driver writes needs a value in advance. Those used to be eighteen hand-maintained defaults in a
 * stylesheet, and the only thing keeping them equal to the story was that somebody had checked once.
 * Asking the story what it is at scroll position zero cannot drift.
 */
const firstFrame = (): ReadonlyArray<readonly [string, string]> =>
  track.map(([name, at]) => [name, at(0).toFixed(PRECISION)] as const)

const declare = (pairs: ReadonlyArray<readonly [string, string]>, indent: string): string =>
  pairs.map(([name, value]) => `${indent}${name}: ${value};`).join('\n')

/**
 * The generated stylesheet.
 *
 * Rendered by `layout.tsx` with `precedence`, which hoists it into the head alongside `globals.css` —
 * so `--pin` and the rest resolve on the first paint rather than a frame later.
 *
 * Nothing here collides with `globals.css`. Every declaration below was removed from that file when it
 * moved here, so cascade order between the two is not load-bearing in either direction.
 */
export function motionCss(): string {
  return `/* Generated from src/motion/story.ts — edit the story, not this. */
:root {
${declare(settings, '  ')}

${declare(firstFrame(), '  ')}
}

/* A thumb is not a wheel: the identical choreography over a longer runway. */
@media (pointer: coarse) {
  :root {
    --pin: ${pin.coarse};
  }
}

/*
  Reduced motion is the same choreography on a faster clock, not one with beats taken out.

  Only the resting value needs to be here. Somebody who asks to move on gets a clock whose rate varies
  with how hard they are scrolling, and the sequencer publishes its reciprocal inline on \`.opening\` as
  it changes — \`03-design-principles.md\` §2, we decide the order, they decide the pace.
*/
@media (prefers-reduced-motion: reduce) {
  :root {
    --haste: ${haste(rates.reduced)};
  }
}
`
}
