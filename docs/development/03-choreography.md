# Choreography — the central configuration

**Every value that decides cinematic rhythm lives in `src/motion/timing.ts`.**

One file. Open it, change a number, save, refresh — that is the whole loop. You should never have to
search the implementation for a duration, a delay, a hold, an easing threshold or a scroll distance;
if you find one outside that file, it is a fault to fix, not a place to edit.

## The two files, and which one you want

| | |
|---|---|
| **`src/motion/timing.ts`** | **the numbers.** Grouped by chapter, unit noted on every group. This is what you edit. |
| `src/motion/story.ts` | **the reasoning.** Every value wrapped in why it is what it is, what was measured, and what breaks if it moves. Read it when you want to know *why* something is 0.3 rather than 0.4. It imports `TIMING` and declares no number of its own. |

`timeline.ts` resolves them into the absolute values the driver and the sequencer need. `globals.css`
and the components read the resolved values; they declare none.

Verified live: changing `distance.shot.fine`, `chapterOne.timestamp.fade` and
`memories.sentence.window` in `timing.ts` moved the document height, `--fade-timestamp` and
`--q5-some-at` on the running page — three values, three different code paths.

---

## The rule

> **A new animation or transition is not finished until its choreography parameters are in
> `src/motion/timing.ts`. Changing the timing of an existing one means changing it there** — and
> its reasoning belongs in `src/motion/story.ts` beside the export that reads it.
>
> A timing value written into a component, a stylesheet, a driver or a resolver is a regression, and
> it should be reported as one whether or not it looks correct on screen.

This is not tidiness. Three things depend on it and each of them breaks quietly without it:

- **The ripple edit.** Beats state their relationship to the beat before them, so giving one a longer
  hold moves everything after it and preserves every gap that was composed. A number written somewhere
  else does not move, and the composition silently comes apart around it.
- **The assertions.** `timeline.ts` checks that the shot fits its runway, that no gap has gone
  negative, that the thirteen junctions resolve, that no segment boundary splits one. It can only check
  what it can see.
- **Judging it.** `01-validation.md` asks whether a pause holds or drags. A pause is a gap between two
  things. If half the gap is in a stylesheet, nobody can answer the question by reading.

## What is in the file, in order

| § | export | what it times |
|---|---|---|
| 1 | `beat`, `chapterOneStory` | Chapter I's arrival, in **milliseconds** — the first of the two clocks on the site |
| 2 | `shotStory` | Chapter I → II: the black, the philosophy lockup, the occasions, the cream transition, the sentence coming apart, the travelling word, Chapter III emerging |
| 3 | `actStory` | Chapter III's act: the mark, the room darkening, the object crossing aside, the annotation, the way out |
| 4 | `methodStory`, `methodPin`, `methodArrival`, `SECONDS_TO_VH` | the publication's held frame: the questions surfacing, the considerations accumulating, the gathering, the printing |
| 5 | `persisting`, `relighting`, `afterTheFilm` | the Environment's lifetime, the Ledger's relighting, and the publication's clocked moments — About's arrival, a question opening, the Work aside |
| 6 | `pace`, `rates`, `BEATS`, `pin`, `ACT_BEATS`, `actPin` | haste, reduced motion, and what a beat of each runway costs in scroll |
| 7 | `input` | the spring between the wheel and the film |
| 8 | `pricing` | what a phase of a junction costs to cross |
| 9 | `occasionsStory` | junction 05 → 06: the three occasions and the sentence |
| 10 | `atmosphere` | the light in the room, and the exposure at the turn |
| 11 | `arriving` | how a section of the publication arrives — the empty frame, the three channels, the stagger |
| 12 | `grounds` | what each state from 09 to 14 stands on: how much scrim, and which ink is read on it |
| 13 | `dock` | junctions 06 → 07 → 08: the photograph alone, the camera opening the composition, and the rail written in the field it opens. **No type** |
| 14 | `work` | state 09: the section arrives, leaves before the ground crosses, and the experiences change on their own clock |
| — | `about` | state 10 (C15): where in 09 → 10 the plates dissolve, the camera's settle, the scroll thresholds that start About's groups and the **milliseconds** that resolve them, and its release in 10 → 11 |

### §13 `dock` — the photograph, the camera, the rail

> **Rebuilt 7 September 2026. The record is `docs/design/v2/implementation-reconciliation.md` § C13,
> which supersedes C12, C11 and C10.**
>
> **There is no type in this gesture.** Not a sentence, not a survivor, not a name. If a table entry, a
> comment or a document asks for one here, it predates C13.

`A memory.` ends the narrative in junction 05. This gesture opens on a frame that already carries no
type, and its whole job is what the film does instead of speaking: **hold the photograph, open the
composition, write the navigation in the field the recompose makes.**

| key | phase |
|---|---|
| `holdsFrame` | **the photograph, alone.** Nothing is scheduled inside it |
| `camera.push` · `camera.opens` | the push, and the recompose that opens the frame to the left |
| `exposure` | C10's five-stop curve, unchanged |
| `grades` | the burn that keeps the index off the sun's specular track |
| `lights` | the rail's head, `III — Studio`, as type in the margin the recompose opened |
| `stills` | **nothing happens.** Authored as a window so it cannot be tuned away |
| `draws` | the five leader rules extend downward, Work first |

**Two rules, and neither is negotiable.**

*Nothing travels.* There is no survivor and no destination. The camera moves; nothing else does.

*The holds are the point.* `holdsFrame` and `stills` are authored as windows rather than left as gaps
between other channels, because a beat of nothing that exists only by accident is a beat that gets
tuned away.

**`from` and `spans` are the two numbers that are not fractions** — 06, and two. `j` divides by junction
*count*, so both junctions have to be the same length; `shot.iiiStudio` prices them at 1.18 beats each
for that reason and no other.

**Nothing is measured.** `--word-dx`, `--rail-x`, `--num-offset`, `--dock-h`, `--anchor-dx` and the rest
all served movements that no longer exist. `place()` reads no boxes for this gesture.

### What was retired, and why it must not come back

- **`sentence`, `anotherLeaves`, `holdsWord`, `becomesAt`, `leaves`** — the consumption of
  `Some moments deserve another chapter.`, the survivor `chapter` held alone, and its exit. The sentence
  is removed from the site: the photograph and the reframe say what it said.
- **`settles`, `registers`, `pairs`** — a survivor travelling to a centred card, and the correction that
  re-centred the line it left.
- **`deck` and its veil** — *What we actually make* drawn under a name, over a `backdrop-filter` band.
  The sentence belongs to the work now (§14); a blurred panel behind type is not editorial.
- **`numeral`, `assembles`, `reposition`, `falls`, `stacks`, `gap`, `holdsLockup`, `releases`,
  `subject`, `entry`, `holdsSubject`** — the `chapter III` lockup and the three strokes migrating to the
  rail. The head is type and has been since C10.

### §14 `work` — state 09, and the queue that lives in it

**The photograph the film ends on is the Work's first experience**, so nothing is swapped to enter the
section: the image acquires a new job rather than being replaced.

| key | unit | phase |
|---|---|---|
| `arrives.block` | fraction of jp8 | the section's own presence — the envelope the three lines arrive inside |
| `arrives.label` / `index` / `category` / `identity` | fraction of jp8 | **label and queue → category**, then the caption. All four close inside `block` |
| `release` | fraction of jp9 | the section leaves **before the ground crosses** |
| `queue` | **milliseconds** | C14: `holds` (how long a category stands — its successor's fill), `moves` (the row moving up), `completes` (a pressed word filling) |
| `carousel` | **milliseconds** | the exchange itself — the film's dip, and where in it the content changes |

**`release` is a constraint, not a taste.** `grounds.cross` takes the veil and the ink to the
publication's paper across [0.04, 0.16] of junction 09 → 10 and cannot move — `arriving.empty` needs the
paper standing before About writes on it. A section still being read on a photograph while the page's
ink has gone dark is a section whose navigation has disappeared: measured in Chrome, the Ledger was at
`srgb 0.059 0.055 0.047` on a lit studio wall. The Work is out by 0.06, ahead of the cross.

**The carousel is the one clock in the film, and C8 is what allows it.** *Scroll owns progression; time
owns only what the visitor did not cause.* The visitor causes their progress through the page — that
stays scroll — and does not cause which experience is on show. It joins the Hero's arrival, the Work
aside and interface response.

Three things it must never become: **scroll-driven** (the content would be a function of how hard
someone flicked, and would run backwards on the way up); **a component** (no dots, pagination,
thumbnails, cards or slider arrows); or **a cross-fade** (two categories legible at once). The exchange
is `dock.dip`'s own grammar — out, a gap, in — and the type leads the photograph.

**Four things the driver publishes and one it must not.** `--work-in`, `--work-holds`, `--wk-*` and
`data-work` are the section's entry, exit and presence. **Which experience is showing is not published
and cannot be**: `work-experiences.tsx` owns it.

### The three gates that were wrong, in order

Kept because each one looks correct and is not:

1. **`IntersectionObserver` on `.v2-work`.** `.v2` is a *fixed* layer, so the section intersects the
   viewport from the first frame of the session — the clock started at page load.
2. **`--state === 9`.** The Work is composed across the tail of junction 08 → 09, where the state is
   still 8 — the clock stayed stopped for eleven seconds of parking inside the section.
3. **`shown > 0.9`.** The band was a few hundred pixels wide and the gate never opened at any sample.

`data-work` is the driver's own answer to *is this section composed*, at a 0.6 threshold.

## The units, and they never mix

```
Chapter I            milliseconds. Its own clock, which the visitor can accelerate.
The Work's queue     milliseconds. Its own clock, which the visitor cannot hurry.
Everything else      beats of scroll. No clock at all — a pure function of position, so it
                     runs backwards exactly as it runs forwards.
```

`1600` in Chapter I has nothing to do with `1.6` below it. A number must never be moved between them.

**The second clock arrived on 7 September 2026 (C13) and it is not an exception to C8 — it is what C8
reserves.** *Scroll owns progression; time owns only what the visitor did not cause.* The visitor
causes their progress through the page, and that is still scroll; they do not cause which of the
studio's experiences is on show. It joins the Hero's arrival, the Work aside and interface response.

Sections 9 to 12 use a third thing that is neither: **a fraction of a junction's own `0 → 1`.** Those
values know nothing about scroll. `pricing` alone decides what a fraction costs to cross, which is why
retiming and repacing are separate edits.

## The shapes

```
{ state, veil, ink }        a ground (§12): which plate, how much scrim over it, which ink on top
{ at, fade, hold }          anchored: arrives at `at`, sits for `hold`, leaves
{ after, fade, hold }       chained: arrives `after` the previous beat has gone
{ at | after, fade }        a ramp — moves one way across `fade` and stays there
[from, to]                  a window on a junction's own 0 → 1
[from, to, cost]            a priced span of a junction (§8)
```

**Anchors are absolute** — the handful of moments that are what they are because somebody decided so.
**Everything else states a relationship.** Never write an absolute you could have expressed as a
relationship, and never recompute one when something upstream moves.

## Adding a new animation

1. Add a section to `story.ts`, in the numbered order, with a heading comment in the same style: what
   it times, and **why each number is what it is.** Record what was measured. The numbers are the
   argument.
2. Export it from `src/motion/index.ts`.
3. Resolve it in `timeline.ts` if it needs resolving, and add an assertion if there is a structural
   property that could silently break.
4. Consume it — from the driver as a published custom property, or from a component. Do not inline the
   value at the point of use.
5. Add a row to the table above.

## Pacing versus timing

These are different edits and the file keeps them apart.

- **Timing** is §§1–5 and 9–10: the proportions of the choreography. Changing one changes the shape of
  the sequence.
- **Pacing** is §6 and §8: `pin`, `actPin`, `methodPin` and `pricing`. Changing one retimes *nothing* —
  every proportion is preserved and only the distance the hand travels changes.

If the complaint is *"this is too fast"*, it is almost always a pacing edit, not a timing one. Measured
on junction 05: every hold was shorter than two wheel notches, and the fix was pricing the holds, not
slowing anything down.

## What is deliberately still outside the file

Recorded so the exceptions stay short and nobody has to rediscover why.

- **Composition — sizes, positions and coordinates — is `globals.css`'s.** A size in a frame changes
  with the screen, and that is layout rather than rhythm. `--screen-h`, `--object-hem`, `--aside-w`,
  the method's word coordinates and the occasion ladder's px sizes are all composition.
- **CSS transition durations** come from `transitions.ts`, which is generated from the same story
  values — a mechanism rather than a second source.
- **Junction ramps still written as literals in `globals.css`.** Roughly thirty-five
  `clamp(0, calc((var(--jpN) - A) / B), 1)` expressions still carry `A` and `B` inline. They are
  choreography and they belong in §8/§9. They are listed here rather than silently left: moving one
  means publishing it as a custom property from the driver, and they should be moved as each junction
  is composed rather than in one sweep that nobody can review.
