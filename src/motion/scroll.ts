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
import { ACT_BEATS, BEATS, METHOD_BEATS } from './story'
import { actSpans, methodSpans, type Cue, type Span, spans } from './timeline'

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
    Chapter III coming into existence under the travelling word — and what it opens is **the work**. This is
    the first stage of the aperture; the act's own `--aframe` is the second, and `globals.css` adds them. See
    `story.studioEmerges` and `story.actStory.frame.opensWithTheMark`.
  */
  ['--studio', (s) => rise(s, spans.studioEmerges)],
]

/**
 * Chapter III's act, assembled — the second pinned frame.
 *
 * A separate list because it is driven by a separate position: the shot's beats are measured from
 * where the opening ended, and these from where the act's own frame reached the top of the viewport.
 * Same mechanism, same curve, same rule that every entry is an independent function of position.
 *
 * One of the act's values is deliberately **not** here. The first third of the aperture is `--studio`,
 * which belongs to the shot — it is what the travelling word unveils, so it is timed against the word
 * rather than against this frame. See `story.studioEmerges`.
 */
export const actTrack: Track = [
  /*
    The masthead's links arriving beside the mark. The mark itself is not here — it is handed over by
    the film, as a step, and from that instant it is simply the head of the page. `--handoff`.
  */
  ['--anav', (s) => rise(s, actSpans.navigation)],

  /*
    The aperture, opening vertically from the frame's own centre — the film's gesture turned ninety
    degrees. The **second** stage of it: the mark opened the first, on the other runway, and
    `globals.css` adds the two into `--aperture`.
  */
  ['--aframe', (s) => rise(s, actSpans.frame)],

  /*
    The room going to evening and then down to a trace, in two stages with the work's own name between
    them — and then the light coming back on the printing. One property with one meaning: *how dark the
    room is*, and by the end of the act the answer is none again.

    Multiplying by the printing's fall rather than adding a third stage is what keeps that true. See
    `story.actStory.darkens`, `deepens` and `printing`.
  */
  [
    '--adusk',
    (s) =>
      (actSpans.dusk.depth * rise(s, actSpans.dusk.first) +
        (actSpans.dusk.deep - actSpans.dusk.depth) * rise(s, actSpans.dusk.rest)) *
      fall(s, actSpans.printing.all),
  ],


  /*
    The work being named, off **one** range: the title arrives and stays (`--atitle`), the two lines arrive
    and then give the space to the studio's own voice (`--anote`). See `actSpans.annotation`.
  */
  ['--atitle', (s) => rise(s, actSpans.title)],
  ['--anote', (s) => show(s, actSpans.annotation)],

  /* The one thing the studio says inside the film. A ramp — it arrives and it stays. */
  ['--alead', (s) => rise(s, actSpans.belief)],

  /*
    **Whether anything the studio says is lit at all**, and it is the whole block rather than any one thing
    in it: the name, the two lines, and the sentence. It sits on `.act-said` and every child's own opacity
    multiplies through it by nesting.

    It exists because the type has to leave *before* the paper comes back rather than through it. See
    `story.actStory.printing.clears`.
  */
  ['--asaid', (s) => fall(s, actSpans.printing.clears)],

  /*
    **The printing.** The frame drawing in until it has margins and is a plate on a page — the second and
    last thing in the whole piece that transforms, and the register change performed rather than announced.

    One property for the movement; `globals.css` decides how far and to where, because where a plate sits on
    a page is composition and it changes with the screen. `story.actStory.printing`.
  */
  ['--aprint', (s) => rise(s, actSpans.printing.all)],

  /* The way out, printed on the paper beneath the plate. The only outward action in the chapter. */
  ['--aopen', (s) => rise(s, actSpans.wayOut)],

  /*
    And whether it exists to be pressed. A step, because a hit area has no half state — an element at zero
    opacity is still clickable and still in the tab order, and this one sits in a frame that is pinned for
    the whole act. It steps at the beat the line begins to exist, when its opacity is still zero, so the
    step cannot be seen. The same construction `--handoff` uses for the masthead.
  */
  ['--aoffer', (s) => (s >= actSpans.wayOut.from ? 1 : 0)],
]

/**
 * **The method, assembled — the third held frame, and the only one outside the film.**
 *
 * Same mechanism, same curve, same rule that every entry is an independent function of position. Two things
 * make it different from the two tracks above, and both are deliberate:
 *
 * The **questions** and the **resolution** drive one property each that `globals.css` reads *twice* — once as
 * opacity and once as a distance in z — so a question surfaces out of the space as it arrives and sinks back
 * into it as it leaves, on a single range. Chapter II's `--mkword` / `--mkblur` pair does the same thing with
 * two properties; here one is enough, because the second reading is `1 - value`.
 *
 * The **considerations** are twelve rises with no exits. Nothing takes a word away individually: `--mgather`
 * multiplies every offset in the field by what is left of it, so twelve elements collapse toward one point on
 * twelve different vectors from a single number.
 *
 * These values are written on the **section**, not on the root — see `scroll-stage.tsx`.
 */
export const methodTrack: Track = [
  ['--minvite', (s) => show(s, methodSpans.invite)],

  ...methodSpans.questions.map(
    (asked, i) => [`--mq${i + 1}`, (s: number) => show(s, asked)] as const,
  ),

  ...methodSpans.words.map((span, i) => [`--mw${i + 1}`, (s: number) => rise(s, span)] as const),

  ['--mgather', (s) => rise(s, methodSpans.gather)],
  ['--manswer', (s) => rise(s, methodSpans.answer)],
  ['--mlines', (s) => rise(s, methodSpans.lines)],
]

/**
 * How many decimal places a written value keeps.
 *
 * Four is past the point any of them is a different colour on screen, and short enough that the
 * driver's write-only-on-change comparison is comparing short strings.
 */
export const PRECISION = 4

export { ACT_BEATS, BEATS, METHOD_BEATS }
