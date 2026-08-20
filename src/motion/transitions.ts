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
import { ACT_BEATS, actPin, chapterOneStory as one, methodPin, pin, rates } from './story'
import { about, actSpans, answer, chapterThree, navHover, studioBlocks, work } from './timeline'
import { actTrack, methodTrack, PRECISION, track } from './scroll'

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

/** A fraction of the viewport, as a `dvh` length — the unit `.film`'s own height is built from. */
const ofFrame = (fraction: number): string => `${Math.round(fraction * 1e6) / 1e4}dvh`

/** Trims the float noise of a derived fraction, so what reaches CSS is the number it should be. */
const r = (n: number): number => Math.round(n * 1e6) / 1e6

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
    The publication's interface timing: a question answering. Outside --haste for the reason `navHover` is,
    and faster than it, because a press must never feel slower than a hover — `story.afterTheFilm.answer`.
  */
  ['--fade-answer', `${answer.fade}ms`],

  /*
    About arriving — the photograph, the mark, then the words, one after another. The delays are resolved in
    `timeline.ts` from the relationships in `story.afterTheFilm.about`; none of them is authored twice, and
    the three word delays come from one `step`.

    `--about-settle` is a distance rather than a duration, so CSS gives it its unit — the same construction
    `--mkblur` uses for the word losing focus in Chapter II.
  */
  ['--fade-about-image', `${about.image.fade}ms`],
  ['--about-settle', `${about.image.settle}px`],
  ['--fade-about-label', `${about.label.fade}ms`],
  ['--in-about-label', `${about.label.in}ms`],
  ['--fade-about-words', `${about.words.fade}ms`],
  ...about.words.in.map((ms, i) => [`--in-about-words-${i + 1}`, `${ms}ms`] as const),

  /*
    How long the work takes to appear once the fragment has painted. The one value in the chapter driven by
    a load event rather than by scroll position — `story.afterTheFilm.work.arrives`.
  */
  ['--fade-work', `${work.arrives}ms`],

  /*
    The value before the sequencer's first frame, and the value it keeps if nobody ever hurries. From
    then on the sequencer writes `--haste` inline on `.opening` every time the rate changes, because the
    rate is now continuous rather than one of a few fixed steps — see `opening.tsx`. Inline wins over
    anything here, so this is a starting point rather than a competing opinion.
  */
  ['--haste', haste(rates.base)],

  ['--pin', pin.fine],

  /*
    Chapter III's act gets a runway of its own rather than more of the film's — `story.actPin`. A beat
    of it is priced within a fiftieth of a beat of the shot, on purpose: it is the third act of the
    same film, so it has to weigh the same in the hand.
  */
  ['--act-pin', actPin.fine],

  /*
    The method's runway — the third and the shortest, and the only one that is not the film's. Its beats are
    deliberately cheaper than either of theirs: `story.methodPin` argues the numbers.
  */
  ['--method-pin', methodPin.fine],

  /*
    Where `#work` is, as a length down the act's own runway.

    The navigation's destinations are places in the *story*, and inside a pinned frame a place in the
    story is a scroll offset rather than an element — so the anchor is put at a beat and the beat is the
    only thing authored.

    **The beat the aperture finishes** — the work whole, lit, alone, and nothing yet said about it.
    Somebody who asks for the work gets exactly that frame, which is the strongest one in the chapter and
    the only one with nothing else in it.

    Derived from `actSpans.frame.to`, so retiming the aperture moves the destination with it.
  */
  ['--work-at', `calc(var(--act-pin) * ${r(actSpans.frame.to / ACT_BEATS)})`],

  /*
    The share of the aperture the **film** opens, under the travelling word — the one value that reaches
    across the two runways. `globals.css` adds the two stages into `--aperture`, exactly the way it adds
    `--adusk`'s two, so neither driver has to know the other exists.

    `story.actStory.frame.opensWithTheMark`, and `decisions.md` §53.
  */
  ['--frame-mark', `${actSpans.apertureWithTheMark}`],

  /*
    Where Chapter III begins — inside the film's last frame rather than beneath it, so the mark unveils
    the page it introduces instead of announcing an empty one. `story.chapterThreeStands`.

    Distances, not durations. `--three-stands` is where the page's top edge has reached by the time the
    marker lands; `--three-overlap` is how far back that puts the whole chapter, and it carries the
    `--pin` term so it follows the pointer when the runway is longer for a thumb.
  */
  ['--three-stands', ofFrame(chapterThree.standsAt)],
  [
    '--three-overlap',
    `calc(100dvh + var(--pin) * ${chapterThree.overlapOfPin} - var(--three-stands))`,
  ],

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
  [...track, ...actTrack, ...methodTrack].map(
    ([name, at]) => [name, at(0).toFixed(PRECISION)] as const,
  )

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

/* A thumb is not a wheel: the identical choreography over a longer runway. Both frames. */
@media (pointer: coarse) {
  :root {
    --pin: ${pin.coarse};
    --act-pin: ${actPin.coarse};
    --method-pin: ${methodPin.coarse};
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

    /*
      The one distance in the piece that a reduced-motion request is actually about, so it is the one thing
      this block removes: About's photograph arrives in light rather than from below. Not a beat taken out —
      the arrival still happens, on the same clock, in the same order. Everything else here is opacity, and
      opacity is what somebody asking for less movement is not asking about.
    */
    --about-settle: 0px;
  }
}
`
}
