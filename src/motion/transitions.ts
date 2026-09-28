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
import { TIMING } from './timing'
import {
  aboutPin,
  actPin,
  askedHold,
  askedLead,
  chapterOneStory as one,
  closingSettle,
  METHOD_BEATS,
  methodPin,
  pin,
  rates,
} from './story'
import { about, answer, chapterThree, methodSpans, navHover, persistSpans, studioBlocks, work } from './timeline'
import { actTrack, aperture, methodTrack, PRECISION, track } from './scroll'
import { DESTINATIONS, WORK_IS_AN_ASIDE, depthOf, stateOf, states } from './spine'
import { environmentValues } from './environment'

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
    ── The rail's chapter exchange · `TIMING.publication.chapter` ──────────────────────────────────

    The promoted word grows and the demoted word shrinks, in both places at once, so the exchange is
    legible as a change of **rank** and never as something crossing the frame. Three durations and two
    scales; `globals.css` holds the scales because they are composition, and `timing.ts` holds these
    because they are time.

    Outside `--haste`, like every other interface duration: the opening's impatience has nothing to do
    with the rail.
  */
  ['--rail-out', `${TIMING.publication.chapter.out}ms`],
  ['--rail-in', `${TIMING.publication.chapter.in}ms`],
  ['--rail-lag', `${TIMING.publication.chapter.lag}ms`],
  /* The folio mark changing page — `TIMING.publication.mark`. The drift is composition, in `globals.css`. */
  ['--rail-mark-out', `${TIMING.publication.mark.out}ms`],
  ['--rail-mark-out-after', `${TIMING.publication.mark.outAfter}ms`],
  ['--rail-mark-point-out', `${TIMING.publication.mark.pointOut}ms`],
  ['--rail-mark-in', `${TIMING.publication.mark.in}ms`],
  ['--rail-mark-point-after', `${TIMING.publication.mark.pointAfter}ms`],
  ['--rail-mark-point-in', `${TIMING.publication.mark.pointIn}ms`],
  /* The index on a phone opening and closing — `TIMING.ledger.index`, C24. */
  ['--index-opens', `${TIMING.ledger.index.opens}ms`],
  ['--index-closes', `${TIMING.ledger.index.closes}ms`],

  /*
    ── The Work's carousel · `TIMING.work.carousel` ────────────────────────────────────────────────

    The one clock in the film, and C8 is what allows it: *time owns only what the visitor did not
    cause.* The visitor causes their progress through the page and that stays scroll; they do not cause
    which experience is on show. `work-experiences.tsx` argues it in full.

    **The type exchanges on the film's own dip, not on a cross-fade.** `--fade-exp-out` empties the
    outgoing word and `--fade-exp-in` fills the incoming one after `--wait-exp-in` — which is the out
    plus the gap — so the two are never legible together. Cross-fading them held both categories
    readable for 780ms, measured in Chrome.

    **The photograph is exchanged inside the dim, not across it.** `--fade-exp-plate` is short and the
    component makes the change `carousel.exchange.at` into the gap, so the cross-fade both starts and
    finishes while the room is down and the two works are never seen dissolving through each other. It
    used to run 1,250ms from the press in full light, which finished the picture 550ms before the new
    category had arrived.

    Outside `--haste`, like every other interface duration: the visitor cannot hurry an exhibition.
  */
  ['--fade-exp-plate', `${TIMING.work.carousel.exchange.over}ms`],
  ['--fade-exp-out', `${TIMING.work.carousel.out}ms`],
  ['--fade-exp-in', `${TIMING.work.carousel.in}ms`],
  ['--wait-exp-in', `${TIMING.work.carousel.out + TIMING.work.carousel.gap}ms`],
  /** How far the room goes down while the work is changed — `.env-experience-dim` reads it. */
  ['--exp-dim', `${TIMING.work.carousel.dim}`],
  /*
    The queue (C14). The promoted word leaves on `--fade-exp-out`, with the headline; the row then moves
    up across `--fade-queue-move` and the returning word writes itself in over the same span. The fill is
    not a transition — `work-experiences.tsx` writes it every frame from the clock.
  */
  ['--fade-queue-move', `${TIMING.work.queue.moves}ms`],

  /*
    About (state 10). Scroll starts each group (`data-about`, written by the driver) and these durations
    resolve it; the settle and the release are fractions of `--jp9` and `--jp10`, turned into ramps by one
    `clamp()` each. `TIMING.about` argues every number; the superimpose window is read by
    `motion/environment.ts`, not here.
  */
  ['--fade-about-statement', `${TIMING.about.arrives.ms.statement}ms`],
  ['--fade-about-support', `${TIMING.about.arrives.ms.support}ms`],
  ['--fade-about-detail', `${TIMING.about.arrives.ms.detail}ms`],
  ['--step-about', `${TIMING.about.arrives.ms.stagger}ms`],
  ['--fade-about-leave', `${TIMING.about.arrives.ms.leaves}ms`],
  ['--about-settle-at', `${TIMING.about.settle[0]}`],
  ['--about-settle-over', `${TIMING.about.settle[1] - TIMING.about.settle[0]}`],
  ['--about-push', `${TIMING.about.push}`],
  ['--about-here-at', `${TIMING.about.presence[0]}`],
  ['--about-here-over', `${TIMING.about.presence[1] - TIMING.about.presence[0]}`],
  ['--about-release-at', `${TIMING.about.release[0]}`],
  ['--about-release-over', `${TIMING.about.release[1] - TIMING.about.release[0]}`],

  /*
    **The method's composition.** Every arrival is a range on the section's own runway and the driver
    resolves them all (`methodTrack`), so nothing about *when* anything arrives is published here —
    including the three pieces of the main composition, which now each have a channel of their own.
    What is left is the one number the stylesheet cannot derive: how far a line settles.

    `--m-lag` went with the derivation it existed for. The line under the statement used to be the
    statement's own arrival, trailed by a breath; it is authored as its own beat now, between the
    second burst of the field and the third.
  */
  ['--m-rise', `${TIMING.method.composed.rise}px`],

  /* Each thought's sideways step as it leaves the room — `TIMING.method.leaves.thoughts.drift`. */
  ...TIMING.method.leaves.thoughts.drift.map((px, i) => [`--mdx${i + 1}`, `${px}px`] as const),

  /*
    The publication's interface timing: a question answering. Outside --haste for the reason `navHover` is,
    and faster than it, because a press must never feel slower than a hover — `story.afterTheFilm.answer`.
  */
  ['--fade-answer', `${answer.fade}ms`],

  /*
    Contact's sentence at rest: one breath, in tracking and a little ink. The listening itself is not
    a CSS duration — it is one value run by `contact-listen.tsx` on `TIMING.contact.listens`, because the
    footage's rate has to follow it frame by frame and a transition cannot tell script where it is.
  */
  ['--contact-breath', `${TIMING.contact.breathes}ms`],

  /*
    The one camera move of 13 → 14: how far it pushes into the room, and how much wider than Contact's
    framing the hillside arrives. `--env-leave` and `--env-return` say how much of each has run.
    `TIMING.contact.passage`.
  */
  ['--env-leave-by', `${TIMING.contact.passage.leaves}`],
  ['--env-return-by', `${TIMING.contact.passage.returns}`],

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
    Where the rail's *Method* lands, as a fraction of `--method-pin`: just past the composition being
    complete — `TIMING.method.lands`. `globals.css` turns it into the anchor's offset.
  */
  [
    '--method-lands',
    `${((methodSpans.gatheredFrom + TIMING.method.lands.afterGathered) / METHOD_BEATS).toFixed(4)}`,
  ],

  /*
    **About's runway, which is the whole of junction 10 → 11.** Not a held frame like the three above —
    About's composition is fixed in the viewport and this is simply how far the visitor travels while
    the room goes from having somebody in it to not. It is here rather than as a `height` in
    `globals.css` because it is a scroll distance, and `TIMING.distance.about` argues the number.
  */
  ['--about-pin', aboutPin.fine],

  /*
    Questions' reading zone — the scroll space the composition stands through before the junction that
    releases it. `story.askedHold` argues it; `globals.css` spends it as the section's own foot.
  */
  ['--asked-hold', askedHold.fine],
  /*
    Where the rail's *Questions* lands, in viewport heights past the list's lock: the point the FAQ
    sequence fires — `TIMING.questions.faq.afterLock`. `globals.css` turns it into the anchor's offset.
  */
  ['--asked-lands', `${TIMING.questions.faq.afterLock}`],
  /*
    How far Questions stands inside the Method's trailing frame. One number on both pointers — it
    covers a frame height and a head margin, which do not change with the runway's price.
    `story.askedLead` argues it.
  */
  ['--asked-lead', askedLead],

  /*
    ── Contact, and both halves of it ──────────────────────────────────────────

    `--closing-pin` is junction 13 → 14's own runway and it is **not a number anybody chose**:
    `persistSpans.length` is §8's sheet converted once, `total × SECONDS_TO_VH`. It was written out
    as `72vh` in `globals.css`, which is the same value twice — and when the sheet was retimed on
    22 September the stylesheet would have kept the old length and the frame would have let go
    a third of the way through the junction.

    `--closing-settle` is the pause after it, so the frame stands finished for a moment rather than
    ending in the frame it composes. `story.ts` argues both; `globals.css` only spends them.
  */
  ['--closing-pin', `${persistSpans.length}vh`],
  ['--closing-settle', `${closingSettle}vh`],

  /*
    **The Work aside.** `story.WORK_IS_AN_ASIDE` — V2 §3's fourteenth row, and the only junction on the
    site the visitor causes rather than the film.

    Two durations and a scrim, and none of them belongs to a beat: the aside is not on any runway,
    because it happens over whatever frame the visitor was already in. The way back is faster than the
    way out on purpose — §3's t27 gives 1.30s out and 0.90s back.

    `--aside-dim` is two stops of light removed from the film, derived rather than chosen. It is the one
    light value written outside a state, and it changes no state's own exposure: *"the film is dimmed,
    never replaced."*

    **There is no `--work-at` any more.** It put an anchor at the beat the aperture finishes, because
    inside a pinned frame a place in the story is a scroll offset. §6 makes Work an aside rather than a
    destination, so there is no longer anywhere to point.
  */
  ['--aside-out', `${WORK_IS_AN_ASIDE.out}ms`],
  ['--aside-back', `${WORK_IS_AN_ASIDE.back}ms`],
  ['--aside-dim', `${r(WORK_IS_AN_ASIDE.dim)}`],

  /*
    **`--frame-mark` is gone.** It published the share of the aperture the film's own mark opens, so that
    `globals.css` could add two runways' properties together — the one weld on the site. C4 gave the
    sequence a single continuous position, `scroll.ts`'s `aperture` adds the two stages there, and the
    stylesheet reads one number. Nothing about the composition changed; the arithmetic moved.
  */

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
const firstFrame = (): ReadonlyArray<readonly [string, string]> => [
  ...[...track, ...actTrack, ...methodTrack].map(
    ([name, at]) => [name, at(0).toFixed(PRECISION)] as const,
  ),
  /*
    The aperture is no longer a track entry — it is one value composed from two views of `p` — so it is
    asked for its first frame directly, for the same reason everything else here is: the page has to
    paint correctly before the driver has run once.
  */
  ['--aperture', aperture(0, 0).toFixed(PRECISION)] as const,

  /*
    **The Environment at state 01**, asked for the same reason everything else here is asked: the page has
    to paint correctly before the driver has run once, and a hero that appeared a frame late — or a plate
    that flickered in — would be exactly the thing `05-storyboard.md` §6 Beat 0 forbids.

    The placement handed in is any monotonic one, because at `p = 0` the walk lands exactly on the first
    state and mixes nothing. What comes out is state 01's own row of §2 and cannot drift from it.
  */
  ...environmentValues(
    0,
    states.map((state, i) => ({ id: state.id, at: i })),
    (n) => n.toFixed(PRECISION),
  ),
]

/**
 * The Ledger at the film's first state, asked rather than transcribed.
 *
 * Same reason as `firstFrame`: the driver writes these and the page has to paint before it has run
 * once. Asking `spine.ts` what state 01 is cannot drift from what the driver will write a frame later,
 * where a hand-kept copy of *unlit, no index, chapter I* certainly could.
 */
const firstState = (): ReadonlyArray<readonly [string, string]> => {
  const at = 1
  const { unlit, index } = stateOf(at).ledger
  return [
    ['--state', `${at}`],
    ['--lunlit', unlit ? '1' : '0'],
    ['--lindex', index ? '1' : '0'],
    ...DESTINATIONS.map((destination, i) => [`--l${i + 1}`, `${depthOf(destination, at)}`] as const),
  ]
}

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

${declare(firstState(), '  ')}
}

/* A thumb is not a wheel: the identical choreography over a longer runway. Both frames. */
@media (pointer: coarse) {
  :root {
    --pin: ${pin.coarse};
    --act-pin: ${actPin.coarse};
    --method-pin: ${methodPin.coarse};
    --about-pin: ${aboutPin.coarse};
    --asked-hold: ${askedHold.coarse};
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
