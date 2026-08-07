# 02 — The motion system

*Where every timing lives, why each beat owns its own, and why almost none of them are absolute.*
*Version 3 · 6 August 2026 · governed by `docs/brand/` (locked)*

---

## Purpose

Motion on this project is the product. `01-vision.md` puts feeling first — it is structure, and it is
built or it is missing — and `01-validation.md` makes the experience a gate rather than a review note.
A rhythm scattered across three components and a stylesheet cannot be tuned, only disturbed: you find
four of the five numbers, change them, and the fifth quietly disagrees.

So every timing lives in **`src/motion/story.ts`** and nowhere else. No component contains one. No
stylesheet declares one. And within that file, almost nothing is an absolute time — because an
absolute is a number you have to recompute every time something upstream moves.

## The two decisions this system is built on

### 1. Timings are per-beat and never shared

A design system wants `FAST` / `MEDIUM` / `SLOW` so that a hundred components stay consistent with
each other. This homepage is not a hundred components; it is one continuous narrative, and
`01-validation.md` asks of it whether a pause *holds* or *drags*. That question is asked of one beat
at a time.

So there is no shared duration ladder. `timestamp.fade` and `navigation.fade` are both 1000ms, and
they are **two separate numbers**. Tuning "A wedding." must not touch "An exhibition."

### 2. Anchors are absolute. Everything else states a relationship

A handful of moments are what they are because somebody decided so, and nothing else determines them.
Those are **anchors**, and they carry absolute values:

```ts
timestamp:  { at: 400,  fade: 1000, hold: 700 }   ⚓
video:      { at: 1600, fade: 3200, … }           ⚓
chapterOne: { at: 3100, fade: 1600 }              ⚓
heroWords / blackTransition / chapterTwoMarker     ⚓  (the shot's opening beats)
```

Every other beat states **what it does relative to the beat before it**:

```ts
subtitle:    { afterChapterOne: 1800, fade: 1200, … }
navigation:  { afterSubtitle: 1800, fade: 1000 }
wedding:     { after: 0.10, fadeIn: 0.1, hold: 0.11, fadeOut: 0.08 }
exhibition:  { after: 0.05, … }
```

`timeline.ts` resolves this into the absolute values the sequencer and the driver need. **You never
edit an absolute you could have expressed as a relationship, and you never recompute one by hand.**

Why: pacing is composed and judged as *intervals*. A pause is a gap between two things, not a
coordinate. "The navigation should arrive 1800ms after the subtitle" is the actual editorial thought;
`4900 + 1800 = 6700` is bookkeeping in service of it. And the subtitle's real arrival is
footage-gated, so its coordinate isn't even knowable in advance — only the interval is.

The payoff is a **ripple edit**. Give "A wedding." a longer hold and everything after it shifts to
make room, with every gap you composed preserved:

```
EDIT: wedding.hold 0.11 → 0.25      (one number)

wedding      2.6→2.89    →  2.6→3.03
exhibition   2.94→3.14   →  3.08→3.28
artist       3.16→3.36   →  3.3→3.5
final        3.4→3.66    →  3.54→3.8
cream        3.74        →  3.88
III Studio   6.46        →  6.6

gaps before: 0.05  0.02  0.04  0.08
gaps after:  0.05  0.02  0.04  0.08     ← every one preserved
```

> Version 1 proposed a shared duration ladder; version 2 replaced it with per-beat objects that still
> held absolute times. This version keeps the per-beat objects and replaces the absolutes with
> relationships. See `decisions.md` §29 and §30.

## Structure

```
src/motion/
  story.ts        THE STORYBOARD — anchors and relationships, in narrative order. Edit this.
  timeline.ts     resolves it into absolutes, and asserts the intentions a ripple edit can break
  easings.ts      shared — the curves
  scroll.ts       shared mechanism — how a resolved range becomes a value, and the track
  transitions.ts  shared mechanism — generates the stylesheet that carries the story into CSS
  index.ts        the public surface
```

```
                        ┌───────────────┐
                        │   story.ts    │   ← you edit this, and only this
                        └───────┬───────┘
                        ┌───────▼───────┐
                        │  timeline.ts  │   ← resolves relationships into absolutes
                        └───────┬───────┘
              ┌─────────────────┼─────────────────┐
      ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────────┐
      │  easings.ts  │  │  scroll.ts   │  │  transitions.ts  │
      └──────────────┘  └───────┬──────┘  └───────┬──────────┘
                                │                 │
                    scroll-stage.tsx        <style> in layout.tsx → globals.css reads it
                    opening.tsx · reveal.tsx
```

The components are mechanisms. They decide *whether* something has happened; `story.ts` decides
*when*, in relative terms; `timeline.ts` makes that absolute; CSS decides what it looks like. None of
the components holds a number.

## The two units

| | Chapter I | Everything after it |
|---|---|---|
| Unit | milliseconds | beats of scroll |
| Driven by | a `requestAnimationFrame` clock | scroll position, and nothing else |
| Can be accelerated | yes — `pace.haste` | no. There is no time to compress |
| Runs backwards | no. A beat happens once | yes, exactly as it runs forwards |

**A number must never move between the two sections.** They are not two ways of saying the same
thing; a beat of scroll has no duration. `1600` in Chapter I has nothing to do with `1.6` further
down. If you want a millisecond value below the Chapter I section, the design has changed, and that is
a brief rather than an edit.

Chapter III is on neither, **except its first page**. Every page after the first is an
`IntersectionObserver` and one duration — the film is over, and a publication does not perform.

The first page is part of the film: it comes into existence under the travelling word, from the instant
the word sets off, so the mark unveils the Studio rather than announcing it afterwards. That is two
statements about scroll *position* — welded to the travel's start, three-quarters lit when the mark lands
— and a duration cannot honour either, so it is a beat in beats like everything else in the shot, and it
reverses exactly. `decisions.md` §44, which also records what that trade costs.

## The shapes

```ts
{ at, fade, hold }              // ⚓ anchored: arrives at `at`, sits for `hold`, leaves
{ after, fadeIn, hold, fadeOut }//   chained: arrives `after` the previous beat has gone
{ at | after, fade }            //   a ramp: moves one way and stays there
```

`hold` and `after` are the two numbers to reach for. Every fade in Chapter II's cadence is the same
length on purpose — the motion vocabulary is meant to be identical across the four occasions — so the
rhythm lives entirely in how long each thing sits, and how long the silence after it lasts.

A departure is always *derived* (`at + fadeIn + hold`), never authored. There is no second number to
keep in step.

**`after` means "after the previous beat has completely gone", not "after it arrived."** That is what
makes the ripple safe: while every gap is positive, two beats can never share the frame.

## The beats

Every one is an object in `story.ts`, in narrative order. ⚓ marks an anchor.

| Beat | What it is | Placed by | Drives |
|---|---|---|---|
| ⚓ `timestamp` | The arrival time, and "where you are" | `at: 400`, `hold: 700` | `--fade-timestamp` |
| ⚓ `video` | Light arriving on the photograph | `at: 1600`, `rollsAfterLight: 500` | `--fade-video` |
| ⚓ `chapterOne` | "Chapter One" | `at: 3100` | `--fade-chapter-one` |
| `subtitle` | "The digital chapter begins here." | `afterChapterOne: 1800` + footage gate | `--fade-subtitle` |
| `navigation` | Work · Studio · Contact | `afterSubtitle: 1800` (of the *real* arrival) | `--fade-navigation` |
| ⚓ `heroWords` | The hero's words leaving | `at: 0`, `fade: 0.16` | `--veil` |
| ⚓ `blackTransition` | The dark, in two stages | `at: 0`, `depth`, `bridge`, `restFade` | `--dusk` |
| ⚓ `chapterTwoMarker` | "CHAPTER II" | `at: 0.28`, `hold: 1.0` = the bridge | `--marker` |
| `everyUnforgettableMoment` | The statement | `after: 0.12` — the wait on black | `--statement` |
| `wedding` | "A wedding." | `after: 0.10`, `hold: 0.11` | `--i1` |
| `exhibition` | "An exhibition." | `after: 0.05`, `hold: 0.02` | `--i2` |
| `artist` | "An artist." | `after: 0.02`, `hold: 0.02` | `--i3` |
| `finalPerformance` | "A final performance." | `after: 0.04`, `hold: 0.08` | `--i4` |
| `creamTransition` | Black → ivory, warmth then light | `after: 0.08` + three fades | `--warmth`, `--dawn` |
| `someMomentsDeserve` | The closing statement | `afterLight: 0.18` — against the light | `--close` |
| `leadLeaves` | "Some moments deserve" leaves | `hold: 0.43` | `--out1` |
| `anotherLeaves` | "another" leaves | `afterLead: 0.14` | `--out2` |
| `chapterTravels` | "chapter" travels to the corner | `alone: 0.41`, `fade: 0.74` | `--tm` |
| `periodLeaves` | The period leaves early | `afterTravelStarts: 0.08` | `--stop` |
| `iiiStudio` | "III" arrives, the word becomes "Studio" | `beforeTravelEnds: 0.1` | `--swap`, `--mark3`, `--handoff` |
| `chapterThreeStands` | Where Chapter III's first page has reached when the mark lands | `atFrameFraction: 0.2` | `--three-overlap`, `--three-stands` |
| `studioEmerges` | That page coming into existence under the travelling word | `litWhenTheMarkerLands: 0.75` | `--studio`, `--settle` |
| `studioBlocks` | Chapter III's *other* pages arriving — one per page | `fade` + observer | `--fade-studio-blocks` |
| `navHover` | The navigation answering a cursor | `fade` | `--fade-nav-hover` |

Plus three things that are not beats: `pace` (the haste multipliers), `pin` (how much scrolling the
story costs), and `BEATS` (how long the shot is allowed to be).

`iiiStudio` is the one offset that runs **backwards** — from the end of the travel, because the point is
that the numeral arrives while the word is nearly home. `timeline.ts` checks it cannot reach back past
the travel's start.

`chapterThreeStands` is the one beat that resolves into a **distance rather than an opacity**. It says
how far down the frame Chapter III's first page has reached by the time the mark lands, and
`timeline.ts` turns that into two lengths — the reach-back for the whole chapter and the marker's
landing corner — with the pinned part stated as a fraction of `--pin`, so one declaration is correct on
a wheel and on a thumb. Nothing about the shot's timing depends on it; see `decisions.md` §42 and §44.

`studioEmerges` is the one beat that deliberately **ends outside the pinned frame**. Everything else has
to fit inside `BEATS` or its tail is a beat nobody sees; this one drives the page *below* the pin, which
keeps scrolling. Its start is welded to the travel's start and its end is solved from
`litWhenTheMarkerLands` — the one number that was actually decided — by inverting the curve.

## The opening is mandatory

Scrolling cannot skip Chapter I. It can only make it run faster.

This was a bug, and an instructive one: the shot was a pure function of `scrollY`, so a visitor who
flicked on arrival was a full viewport into Chapter II before the timestamp had appeared. The intro's
clock sped up, but Chapter II arrived underneath it regardless. Three parts fix it, and all three are
needed.

### 1. The clock's rate follows the hand

`pace` no longer holds one hurried speed. It holds a range:

| | | |
|---|---|---|
| `haste` | 1.55 | the floor for any single intent — a click, a key, a touch |
| `urgent` | 3 | the fastest the opening will ever run |
| `urgentAt` | 3 px/ms | the scroll speed at which `urgent` is reached |
| `settle` | 0.85 | how much of the measured speed survives each frame |

Between standing still and `urgentAt` the rate scales smoothly, so scrolling faster really does make
the opening run faster rather than flipping it between two speeds. `settle` smooths the measurement —
a wheel arrives in impulses and a phone reports nothing between momentum samples, so a raw per-frame
delta is not a velocity — and it is also what eases the clock back down when the hand stops instead of
dropping it in one frame.

**Above about 4, fades start arriving on top of each other faster than the eye separates them, which
is skipping by another name.** That is why `urgent` is 3 and not higher.

### 2. `maxAdvance` makes a skipped beat unrepresentable

`pace.maxStep` bounds the *real* time one frame may contribute, which protects the clock from a slow
thread. It does nothing about a fast clock: at three times pace a dropped frame would advance the
sequence far enough to make two beats due at once, and they would appear together.

So `timeline.ts` derives a second cap on the *virtual* time a frame may add:

```
closestBeats  = the smallest gap between any two distinct Chapter I cues   (currently 500ms)
maxAdvance    = max(pace.maxStep, min(200, closestBeats / 3))              (currently 166.7ms)
```

Because it is derived from the schedule, it maintains itself when the storyboard is retimed. Because
it is floored at `pace.maxStep`, it never binds at natural pace — a frame can already contribute that
much, so capping below it would slow an opening nobody asked to hurry. And because it is a third of
the closest gap, **consecutive beats are always at least three frames apart, whatever the rate.**

If a retiming ever brings two cues close enough that the floor wins, you are told — see the
assertions below.

### 3. The shot begins where the opening ends

`opening.tsx` publishes `data-opening="running"` on the root and flips it to `done` when the
navigation has **finished** arriving — not when it starts. Releasing on the interface's first frame
would let a visitor already scrolling hard fade the navigation out through the veil while it was
still fading in, and never see the beat.

`scroll-stage.tsx` reads that, and derives the shot from `scrollY - origin` rather than `scrollY`:

- While the opening runs, the shot holds its first frame. **The page still scrolls normally** —
  nothing is frozen, no wheel or touch event is swallowed, nothing jumps.
- `origin` is taken lazily, on the first frame after `done`. So the shot starts at exactly its first
  frame however far the visitor got, and their next gesture carries straight on into Chapter II.
- `--origin` is added to `.film`'s height, so there is always a full `--pin` of scrolling beneath the
  visitor. They cannot reach the bottom while the opening is running and find the shot with no room
  left to play in. **While it is still moving** it is rounded up to whole viewports, because it is the
  one value that changes the document's *height* — writing it costs a layout of the whole page, and the
  moment it would be written most often is a hard flick, which is the worst moment to be relaying out.
  **Once the origin is fixed it is written exactly**, because the film's height is where the page below
  it begins: anything placed against a beat of the shot — `chapterThreeStands` is — would otherwise be up
  to a viewport out for a visitor who scrolled during the opening. `decisions.md` §42.
- Scrolling back up above the origin brings it down with you, so the stretch of scroll that did
  nothing collapses behind you. That is free of visual consequence by construction: above the origin
  the shot is already at its first frame, so moving the origin cannot change a value.

**With no interaction at all, none of this engages.** `origin` stays 0, `--origin` stays `0px`, and
the shot is `scrollY / vh / perBeat` exactly as before.

## What is asserted, and why

Three things are true by *intention* rather than by construction, so `timeline.ts` checks them in
development. Each is a failure `01-validation.md` names specifically: everything passes and the work is
worse somewhere the compiler cannot see.

| Assertion | What it catches |
|---|---|
| The timestamp is gone exactly when the identity arrives | Both sides are authored — one anchor, one hold — so nothing structural keeps them equal. Change `timestamp.hold` and you get a gap or an overlap where the handover should be seamless. |
| Every gap is positive | A negative `after` is the one route back to two beats sharing a frame the act was composed to keep empty. |
| `iiiStudio` cannot reach back past the travel's start | It is measured backwards, so it can place a beat before its parent. |
| Chapter III is 0.6–0.8 lit when the mark lands | The brief's own band. The range is solved for it, so this only fails if the travel moves under it or the authored value leaves the band. |
| `studioEmerges` starts inside the frame and ends after the mark lands | Its start is what makes the mark an unveiling rather than an announcement; its end being *later* is what leaves something to settle. |
| The shot fits inside `BEATS` | A ripple edit can push the tail of the shot past the end of the pinned frame, where nobody would ever see it. |
| Two Chapter I cues are never close enough for hurrying to show them together | `maxAdvance` cannot go below `pace.maxStep` without slowing the natural pace, so if a third of the closest gap is smaller than that, the no-skip guarantee weakens. Widen the gap, or lower `pace.urgent`. |

The messages tell you which number to change and what to change it to. They are stripped from the
production build.

**Deliberately not asserted:** the occasions running into the cream transition. The cream is chained to
the last occasion, so it moves with it. That was a real constraint when positions were absolute — a
`wedding.hold` above 0.16 silently put two occasions on screen at once — and the chain removed it
rather than guarding it.

## Modifying a beat

### Make "A wedding." stay on screen longer

`src/motion/story.ts`:

```ts
/** "A wedding." The first audience, given room to resonate. Drives `--i1`. */
wedding: { after: 0.1, fadeIn: 0.1, hold: 0.11, fadeOut: 0.08 },
//                                       ↑ raise this
```

That is the whole edit. Everything after the wedding — the other three occasions, the cream
transition, Act III, the marker — shifts to make room, and every gap you composed is preserved. There
is no ceiling to remember and no second number to update.

If the shot then runs past `BEATS`, you are told, and the fix is to raise `BEATS`. That retimes
nothing: `pin` is what decides how much scrolling a beat costs, and the ratios are untouched.

### Change the silence after it

```ts
exhibition: { after: 0.05, … }   // ← the breath between the wedding and the exhibition
```

Holds and gaps are the two halves of Chapter II's rhythm, and both are now one number each.

### Everything else

| Want to | Edit |
|---|---|
| Move the subtitle closer to the title | `subtitle.afterChapterOne` |
| Give the navigation more separation | `navigation.afterSubtitle` |
| Change how long "Chapter One" takes to fade | `chapterOne.fade` |
| Move the identity itself | `chapterOne.at` — then `timestamp.hold`, which the assertion will tell you |
| Change how long the timestamp sits | `timestamp.hold` — same pairing, same warning |
| Change the subtitle's footage gate | `subtitle.waitsForFootageAt` |
| Change how dark the bridge gets | `blackTransition.depth` |
| Lengthen the bridge (the page turn) | `blackTransition.bridge` and `chapterTwoMarker.hold` |
| Make the cream transition slower | `creamTransition.lightFade` |
| Give "chapter" longer alone at the centre | `chapterTravels.alone` |
| Move where Chapter III's first page stands when the mark lands | `chapterThreeStands.atFrameFraction` — the reach-back follows. Raising it toward 0.8 restores `05-storyboard.md` Beat 2; see `decisions.md` §44 |
| Change how lit that page is when the mark lands | `studioEmerges.litWhenTheMarkerLands` — the range re-solves around it |
| Change how far it rises into place | `studioEmerges.rise`, in pixels. Zero is legitimate — read §44 first |
| Make Chapter III's other pages arrive sooner | `studioBlocks.arrivesShortOf` |
| Change how much scrolling the story costs | `pin.fine` / `pin.coarse` — retimes nothing |
| Change the floor for a click or a keypress | `pace.haste` — CSS follows automatically |
| Change how fast a hard scroll may make the opening | `pace.urgent` — and read the note on 4 |
| Change how hard you must scroll to reach that | `pace.urgentAt`, in px/ms |

The two rows that name a *pair* are the honest exceptions: the timestamp's departure and the identity's
arrival are two authored numbers that have to meet. The assertion tells you the other one and what to
set it to.

## Easing

```ts
easings.DEFAULT   // cubic-bezier(0.32, 0, 0.24, 1) — for anything timed in milliseconds
smoothstep        // x * x * (3 - 2 * x)            — for anything timed in scroll position
unsmoothstep      // the same curve, solved for its input — not a second curve
```

**Easing is shared, and there is one curve.** `globals.css` opens by saying so and
`04-visual-language.md` §7 is why: motion exists to make change comprehensible, so a curve with
character of its own competes with the thing it is meant to describe. A second curve is a second
voice.

This is the one place the system deliberately refuses variety. There is no `SMOOTH`, no `SOFT`, no
separate `CINEMATIC` — offering curves that nothing is allowed to use is how a ban becomes a trap for
whoever reads the module next. **Adding a curve needs a line in a locked document and an entry in
`decisions.md`.**

`unsmoothstep` is not a third entry in that list. It is `smoothstep` read the other way, so that a beat
can be authored by the thing that was decided — *three-quarters lit when the mark lands* — instead of by
the range that happens to produce it. Nothing eases with it; it only resolves a range.

The two that exist are two because they are different mechanisms, not different voices. A CSS
transition eases between two states over a duration. A scroll-driven value has no duration — it is
evaluated fresh at whatever position the page is at — so its easing must be a plain function of
progress, callable at any point, in any order, backwards included.

## Adding a beat

**To Chapter II** (scroll-driven) — no component is involved:

1. `story.ts`: add the object in narrative order, stating its `after` relative to the beat above it.
   Say in a comment what it says and what it drives.
2. `timeline.ts`: chain it — `cue(r(previous.gone + yours.after), yours)` — and rechain whatever
   followed the beat it now sits in front of.
3. `scroll.ts`: one line in `track` naming the custom property. Then consume it in `globals.css`.

The property's value on the first frame comes from evaluating the track at scroll position zero, so
there is no default to write down and none to forget.

**To Chapter I** (millisecond-timed):

1. `story.ts`: add the beat to `beat` in order, and its object — relative to the beat before it unless
   it is genuinely an anchor.
2. `timeline.ts`: resolve it into `cues`, and add a line to `schedule`.
3. `transitions.ts`: publish its fade as `--fade-<beat-name>`.
4. `opening.tsx`: gate a `data-present` attribute on the new beat. `globals.css`: transition on it.

**Is it an anchor or a relationship?** Ask what happens when the beat before it moves. If this beat
should move with it, it is a relationship. If it should stay exactly where it is, it is an anchor — and
that is a claim worth a comment explaining why.

**To Chapter III:** add `data-reveal` to the **page**, not to the elements on it. The observer picks it
up and the existing fade applies.

A page is the unit here, because Chapter III is a publication: it comes into existence as one thing when
the visitor turns to it, and the statement, plate and copy on it do not each get their own arrival. Three
reveals for one page is three answers to `04-visual-language.md` §7's only question — *what changed?* —
when the answer is one: the chapter arrived. `decisions.md` §43.

The first page is the exception and carries `data-emerges` instead: the film reveals that one, as a beat
of the shot, so `Reveal` only watches it in order to know when to start loading its footage. Nothing else
should ever need that attribute — it exists because that page is inside the film's own frame.

Before adding anything, the question `04-visual-language.md` §7 asks: has the *meaning* changed? If
nothing has changed in meaning, nothing moves. And `01-validation.md`: if a reviewer can name the
animation, it is too loud.

## Derived, not duplicated

Per-beat numbers are independent **by intention**. That is different from two numbers that are
*required* to agree, and those are always computed from one origin.

Everything currently derived rather than written down:

- **Every absolute time.** `cues` and `spans` in `timeline.ts` — the sequencer gets 4900ms for the
  subtitle without anyone having typed 4900.
- **Every departure.** `at + fadeIn + hold` — a beat that arrives and leaves has one number for how
  long it stays, not two for when it starts and stops going.
- **The four `--haste` values.** `1`, `0.645`, `0.45`, `0.29` used to be literals in a stylesheet kept
  in step with two constants in a component by a comment asking whoever edited one to remember the
  other. Nothing enforced it, and the symptom would have been fades overlapping slightly wrongly:
  visible, and almost impossible to attribute. Now `rates` is the only origin and `transitions.ts`
  publishes `1 / rate`.
- **The shot's eighteen first-frame values.** The track evaluated at zero, not eighteen defaults
  maintained by hand.
- **The observer's `rootMargin`.** `studioBlocks.arrivesShortOf` is a number, and the string is built
  from it — because the same number decides where Chapter III's opening sits. The observer's threshold
  and that placement have to agree, so only one of them is authored.
- **Where Chapter III begins, and where the marker lands on a phone.** Both come from
  `100vh + pin · (1 − b/BEATS)` evaluated at the handover, so both are derived from
  `chapterThreeStands` rather than two viewport distances somebody measured once at one screen size.
- **The end of Chapter III's emergence.** Solved from `litWhenTheMarkerLands` by inverting the curve —
  `unsmoothstep` — because what was decided is how lit the page is when the mark lands, and the range
  that produces it is arithmetic. Retime the travel and it re-solves.

**Two numbers that must agree: one is computed. Two numbers that merely happen to match: leave them
alone.** Telling those apart is the whole judgement this system asks of you. Where it genuinely cannot
be computed — the timestamp's departure meeting the identity's arrival, which are an anchor and a hold
approaching the same instant from opposite directions — it is asserted instead.

## What must never be hardcoded again

In any component, or any stylesheet:

- ✗ A duration or delay — `transition: opacity 1100ms`, `setTimeout(…, 400)`
- ✗ A `cubic-bezier`, or any easing other than reading `var(--curve)`
- ✗ A scroll threshold, `rootMargin`, or `IntersectionObserver` option
- ✗ A beat, a cue point, or a scroll range
- ✗ A rate, multiplier or reciprocal
- ✗ Any custom-property *declaration* in `globals.css` that the motion system owns. Read them with
  `var()`; never declare them — a declaration there is a second opinion about the same number.

And in `story.ts` itself:

- ✗ An absolute time for a beat whose position depends on the beat before it. If you find yourself
  adding two numbers in your head to work out what to type, the number you want is the offset.
- ✗ A value already derivable from another — a departure beside a hold, a `to` beside a `from` and a
  fade.

The test for a component or stylesheet: **if changing the feel of the site would mean editing this
line, it does not belong here.** The test for `story.ts`: **if you had to do arithmetic to write the
number, write the arithmetic's input instead.**

## What deliberately does not exist

Named so nobody adds them by pattern-matching against what a motion system usually has.

- **No shared duration ladder.** See *The two decisions this system is built on*.
- **No absolute-time storyboard.** Positions are relationships. Only anchors carry a coordinate.
- **No blur tokens.** `globals.css` forbids blur outright — nothing blurs, so there is nothing to
  time.
- **No scale or move duration tokens.** Exactly one element transforms: the word `chapter` travelling
  into the corner. It is scroll-driven, so it has a range (`story.chapterTravels`) and no duration.
  `04-visual-language.md` §7 is why it is the only one — it earns the movement because what changes is
  what the word is *for*. Nothing else on the site changes purpose.
- **No spring or physics config.** Springs have character. See *Easing*.
- **No stagger helper.** Chapter II's cadence is four beats with deliberately unequal holds — long,
  short, short, medium. A stagger helper would make that rhythm expressible only as a metronome, which
  is the thing it was composed to avoid.

An empty token is not neutral. It is an invitation.

## Two things outside `pace.haste`, on purpose

`studioBlocks` and `navHover` are **not** multiplied by `--haste`.

The film is over by Chapter III, so there is no sequence left to hurry and nothing for a multiplier to
keep in proportion. And an interface that answered at a different speed depending on how the visitor
scrolled two minutes earlier would be responding to the wrong thing.

This matches the behaviour before the system existed, where both were hardcoded and therefore outside
it by accident. It is now outside it on purpose, and written down.

## Validation

`01-validation.md` applies unchanged. One gate is specific to this system:

**A change intended to be invisible must be shown to be invisible.** The refactors that produced this
module were verified by sweeping the resolved timeline against the pre-refactor formulas at 0.001-beat
resolution across the whole shot — 131,418 comparisons of the exact strings that reach CSS — and again
live in the browser at real scroll positions, plus every resolved absolute checked against its original
literal, every CSS transition re-measured, and all four viewports replayed.

That is what makes a relationship refactor safe at all: expressing 4900 as `3100 + 1800` is only
correct if it still resolves to 4900, and the sweep is what says so.

If you move a number on purpose, that sweep is *expected* to fail. If you move code and not numbers,
it must not. Keep the two kinds of change in separate commits, so the sweep can tell you which one you
made.
