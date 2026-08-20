# 02 — The motion system

*Where every timing lives, why each beat owns its own, and why almost none of them are absolute.*
*Version 4 · 13 August 2026 · governed by `docs/brand/` (locked)*

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
                  Four sections: Chapter I in milliseconds, then the shot, the act and the method in
                  beats of their own three runways.
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

### Three runways of scroll, not one

Beats of scroll are measured against **three** pinned frames, and they are numbered separately.

| | The shot | Chapter III's act | The method |
|---|---|---|---|
| Storyboard | `shotStory` | `actStory` | `methodStory` |
| Length | `BEATS` = 7.17 | `ACT_BEATS` = 3.2 | `METHOD_BEATS` = 3.8 |
| Runway | `pin` — 392vh / 588vh | `actPin` — 176vh / 264vh | `methodPin` — 160vh / 240vh |
| A beat costs | 54.7vh | 55.0vh | **42.1vh** |
| Zero is | where the opening finished | where the act's frame reached the top | where the method's frame is stuck under the head margin |
| Track | `track` | `actTrack` | `methodTrack` |
| Written on | `:root` | `:root` | **the section** |

They are separate because their lengths are decided by different things: the shot's by what it has to
show, the act's by what it has to say, the method's by what it has to assemble.

**Two of them weigh the same in the hand and the third deliberately does not.** A beat of the act costs what a
beat of the shot costs, because it is the same film. A beat of the method costs a fifth less, because it is
**not a chapter** — the publication is not cinema, and a held frame in it has to move faster under the hand
than the film does or it becomes one. Its whole length is thirteen notches of a wheel. `decisions.md` §46,
§53 and §55.

The method is also the one track whose properties are **not** written to `:root`. Nothing outside its own
frame reads them, and a root write invalidates style for the whole document — including the film and a
cross-origin iframe. `scroll-stage.tsx` says so where it does it.

**They are joined by scroll position and by exactly one value.** `studioEmerges` — a beat of the *shot* —
opens the first `actStory.frame.opensWithTheMark` of the aperture onto the work, before the act’s frame is even
pinned, so the chapter's mark starts uncovering its work rather than announcing it. The two stages are added
in `globals.css` as `--aperture`. Both positions are pure functions of `scrollY`, so the join holds no state
and reverses exactly. `decisions.md` §51.

Chapter III's **closing** is on neither: an `IntersectionObserver` and one duration. The act is over by
then, and a publication does not perform.

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
| `chapterThreeStands` | Where Chapter III's frame has reached when the mark lands | `atFrameFraction: 0.2` | `--three-overlap`, `--three-stands` |
| `studioEmerges` | That frame coming into existence under the travelling word — the first third of the object's aperture | `litWhenTheMarkerLands: 0.75` | `--studio` |
| `studioBlocks` | A page of the publication arriving | `fade`, `arrivesShortOf` + observer | `--fade-studio-blocks` |
| `navHover` | The navigation answering a cursor | `fade` | `--fade-nav-hover` |
| `answer` | A question in the publication opening | `fade` | `--fade-answer` |
| `about` | **About arriving**: the room, then the mark, then the words. The one composed arrival after the film, and the photograph is the only thing that moves | `image.settle: 14`, `label.afterImage`, `words.afterLabel`, `words.step` | `--fade-about-*`, `--about-settle`, `--in-about-*` |

Then Chapter III's act, on its own runway — `actStory`, in the order it happens:

| Beat | What it is | Placed by | Drives |
|---|---|---|---|
| ⚓ `navigation` | The masthead's links arriving beside the settled mark | `at: 0.1` | `--anav` |
| `frame` | **The aperture, and what it opens is the work** — the whole frame, uncovered vertically from its centre. Its range starts at 0 because a third of it is already open, driven by the film | `opensWithTheMark: 0.34`, `fade: 0.62` | `--aframe`, and `--aperture` with `--studio` |
| `quiet` | **The work alone, lit, and unexplained.** A gap, not a range — the only stillness in Chapter III, and the one beat that exists to have nothing in it | `holdsWhole: 0.3` | nothing |
| `darkens` | The room going to evening, **over** the work. One stage, because the ground beneath it is a photograph and not paper | `beginsAfterTheQuiet: 0`, `depth: 0.5`, `fade: 0.42` | `--adusk` |
| `annotation` | The work being named inside its own frame — a name that stays and two lines that give way | `arrivesWhenDuskIs: 0.8`, `fadeIn: 0.3`, `hold: 0.26` | `--atitle` (a ramp), `--anote` (a cue) |
| `deepens` | The room going down to a trace **as the two lines leave**. Rides the annotation's departure; has no position of its own | `depth: 0.88`, `fade: 0.34` | `--adusk` |
| `belief` | "We don't build websites." The only thing the studio says inside the film. A ramp | `after: 0.08`, `fade: 0.24` | `--alead` |
| `printing` | **The film being printed.** The light comes back, the frame draws in until it has margins, and what is left is a plate on paper | `afterTheBelief: 0.26`, `fade: 0.4`, `clears: 0.4` | `--aprint`, and `--adusk` and `--asaid` downward |
| `wayOut` | "Open the full experience →" — printed on the paper, sixty per cent through the printing. The only outward action in the chapter | `whenPrintedIs: 0.6`, `fade: 0.24` | `--aopen`, `--aoffer` |

Three of those offsets are solved **backwards**, and each is a place the brief asked for an *overlap*
rather than a sequence: the mark starting the aperture, the work being named inside the darkening, and the
way out arriving inside the printing. In each case what is authored is how far through the previous movement
the next one starts, and `unsmoothstep` turns that into the offset — the same trick
`numeralSetsOffWhenWordIs` uses.

**One joint in the act is deliberately not an overlap.** `quiet.holdsWhole` is a real gap, and it is what
makes the stillness before the light moves legible as stillness. `timeline.ts` asserts it, because every
other joint is chained and a gap that goes to zero under a retiming somewhere else is silent.

**One thing in the act moves, and it is the frame.** `printing` translates and scales it into a plate, and
that supersedes §49's *nothing moves* and §51's crossing object, which is deleted. What earns it is
`04-visual-language.md` §7 — what changes is what the thing is *for*, from the subject of a film to a plate
in a publication, and **the appearance of a margin is that relationship**. So the count is unchanged: two
elements transform in the whole piece, the travelling word and this. `decisions.md` §53.

**The distance is deliberately not in the storyboard.** One beat drives one property; `globals.css` decides
how far the frame draws in and where it lands (`--plate-scale`, `--plate-x`, `--plate-y`), because where a
plate sits on a page is composition and it changes with the screen.

## There is no third unit any more

**There was one, and it is gone.** §50 timed the studio's two sentences in milliseconds inside the device,
on a schedule of its own that met the act's scroll at one position. §51 put the sentences back on the page as
beats, so **every narrative value in the whole piece is either Chapter I's clock or a beat of scroll**, and
Chapter III is beats alone. `screenplay`, `asksAt`, `--speaks-at`, the sentinel and the observer are deleted.

The distinction §50 drew was right and its conclusion was not. *A sentence being spoken happens to the
visitor* — but what makes that true is that the sentence must not be something they have to *finish*, and the
answer to that is a sentence short enough to read in a glance, not a clock. Four words and one line at 34px
need no schedule. What it bought back is the order the brief actually wanted: the studio speaks **after** the
visitor has had the work under their hand, which a schedule started by arrival could not produce.
`decisions.md` §51.

What is left in `afterTheFilm.work` is not a storyboard, and §53 cut it to two values. `fetchedWithin` is a
**distance** — how far ahead of the viewport the fragment is requested, so that what the aperture uncovers is
a page already there rather than one arriving. `arrives` is one **duration**, and its whole job is that the
frame is never seen to fill in. Neither has a schedule to be synchronised with anything, and `arrives` sits
beside the sequence for the same reason `navHover` does: it answers a load event rather than continuing a
sequence, so it is outside `--haste`.

**Everything else that used to be here is gone.** `experience.patience` and `experience.spill` existed for a
device with a screen in it — a wait to bound and a light for the screen to throw into a room. There is no
device, nothing is asked for and nothing is waited on: a frame that is not carrying the work is carrying the
chapter's own ground, which `05-storyboard.md` §10 already treats as a composed alternative rather than a
failure. `atmosphere.drift` went with the three fields it moved, and with it the only motion in the piece
nobody asked for and the only one `prefers-reduced-motion` had to remove outright. `decisions.md` §53.

Plus five things that are not beats: `pace` (the haste multipliers), `pin` and `actPin` (how much
scrolling each frame costs), and `BEATS` and `ACT_BEATS` (how long each is allowed to be).

`iiiStudio` is the one offset that runs **backwards** — from the end of the travel, because the point is
that the numeral arrives while the word is nearly home. `timeline.ts` checks it cannot reach back past
the travel's start.

`chapterThreeStands` is the one beat that resolves into a **distance rather than an opacity**. It says
how far down the frame Chapter III's first page has reached by the time the mark lands, and
`timeline.ts` turns that into two lengths — the reach-back for the whole chapter and the marker's
landing corner — with the pinned part stated as a fraction of `--pin`, so one declaration is correct on
a wheel and on a thumb. Nothing about the shot's timing depends on it; see `decisions.md` §42 and §44.

`studioEmerges` is the one beat that deliberately **ends outside the pinned frame**. Everything else has
to fit inside `BEATS` or its tail is a beat nobody sees; this one drives the frame *below* the pin, which
keeps scrolling. Its start is welded to the travel's start and its end is solved from
`litWhenTheMarkerLands` — the one number that was actually decided — by inverting the curve.

It is also the one beat that reaches **across** the two runways: it opens the first
`actStory.frame.opensWithTheMark` of the aperture onto the work, which lives in the act’s frame. That is what
makes the mark an unveiling of the work rather than an introduction to it — by the time the visitor's frame
reaches the top of the viewport the work is already a third uncovered, and nothing stands between the
chapter's head and its work. `decisions.md` §44, §46 and §51.

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
| Every gap in the act is positive | Same rule as the shot's, same reason: chaining prevents overlap only while that holds. |
| The masthead is standing whole before the room goes dark | The chapter's head assembles on the ground it belongs to. Later and it is still arriving over a frame that has already become a photograph. |
| The act's five solved overlaps are inside 0–1 | Outside that band each of them stops being an overlap and becomes a sequence, which is the thing the act was composed not to be. |
| The screen is lit before the object crosses | Nothing structural orders them — the screen is solved on the aperture and the crossing is chained to its end. Crossed, a black slab of glass moves aside and lights once it gets there, which reads as a panel being repositioned. |
| **The studio does not speak before the work has been shown** | §51's own requirement, and the order the chapter turns on. `lead` is chained to the annotation and the annotation to the crossing, so a short enough crossing would put the belief on screen while the device was still a slot. |
| The frame is four-fifths dark by the time the first white type arrives | The one assertion in the piece that is a *safety* property. Everything in the aside is white and the ground under it is paper until the room goes down. `decisions.md` §02. |
| The act fits inside `ACT_BEATS` | As below, for the other frame. |
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
| Move where Chapter III's frame stands when the mark lands | `chapterThreeStands.atFrameFraction` — the reach-back follows. `decisions.md` §44 |
| Change how lit that frame is when the mark lands | `studioEmerges.litWhenTheMarkerLands` — the range re-solves around it, and the aperture's first stage with it |
| Give the mark longer alone before its navigation | `actStory.navigation.at` |
| Change how the masthead's links arrive | `actStory.navigation.fade` |
| Change how much of the aperture the chapter's mark opens | `actStory.frame.opensWithTheMark` — spent inside the settle, so it is about a fifth of a screen of scrolling however large it is |
| Change how slowly the work is uncovered | `actStory.frame.fade` |
| **Give the work longer alone before anything is said** | `actStory.quiet.holdsWhole` — the only stillness in the act, the frame a visitor is most likely to stop in, and where `#work` points. Short in scroll, unbounded in time |
| Change how far the room goes down to speak over the work | `actStory.darkens.depth` — the legibility assertion will tell you if it goes too shallow, and it is measured against the fragment's own quiet band |
| Change how long the light takes to get there | `actStory.darkens.fade` |
| Change when the work is named inside its frame | `actStory.annotation.arrivesWhenDuskIs` — an overlap, not a delay: the room dimming and the work acquiring a name are one gesture |
| Give the two lines longer to be read | `actStory.annotation.hold` |
| Change how far the room goes down for the studio | `actStory.deepens.depth` — deeper than `darkens.depth` and short of 1, or the work goes out of its own frame |
| Change how the light gets there | `actStory.deepens.fade` — it rides the two lines leaving, so this is also how long they take to go |
| Change the silence before the studio speaks | `actStory.belief.after` |
| Change how the sentence arrives | `actStory.belief.fade` |
| Change the silence before the film is printed | `actStory.printing.afterTheBelief` |
| Change how long the printing takes | `actStory.printing.fade`. **How far and to where is `globals.css`** — `--plate-scale`, `--plate-x`, `--plate-y` — because that is composition |
| Change when the in-frame type leaves during it | `actStory.printing.clears` — a legibility number, not a rhythm one. The assertion says why |
| Change when the way out is printed | `actStory.wayOut.whenPrintedIs` — it is ink on paper, so it cannot arrive before the ground is most of the way back |
| Change how far ahead the fragment is fetched | `afterTheFilm.work.fetchedWithin`, in viewports. The observer's margin is derived from it |
| Change how the work appears once it has painted | `afterTheFilm.work.arrives` |
| Make Chapter III's closing arrive sooner | `studioBlocks.arrivesShortOf` |
| Change how much scrolling the story costs | `pin.fine` / `pin.coarse` — retimes nothing |
| Change how much scrolling the act costs | `actPin.fine` / `actPin.coarse` — retimes nothing |
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

**To Chapter III's act** (scroll-driven, on the act's own runway) — the same three steps as Chapter II,
against `actStory`, `actSpans` and `actTrack`. Ask first whether the beat is really the act's: anything
that has to happen *as the mark lands* belongs to the shot, because that is where the mark is.

**To the method** (scroll-driven, on the third runway) — the same three steps again, against `methodStory`,
`methodSpans` and `methodTrack`. Two things are different and both are deliberate: its properties are written
on the **section** rather than on the root, because nothing outside its own frame reads them; and its beats
are priced a fifth cheaper than the film's, because it is not a chapter and must not weigh like one. If a beat
you are adding wants to be *slower* than the film, it is probably in the wrong section. `decisions.md` §55.

**To Chapter III's closing, or to the publication below it:** add `data-reveal` to the **block**, not to
the elements in it. The observer picks it up and the existing fade applies.

A page is the unit here, because what follows the act is a publication: it comes into existence as one
thing when the visitor turns to it. Three reveals for one page is three answers to
`04-visual-language.md` §7's only question — *what changed?* — when the answer is one: the chapter ended.
`decisions.md` §43.

**The publication has two timings and wants no more.** About, the method, the questions and Contact are
ordinary flow: no pinned frame, no beat, no driven property. `afterTheFilm.answer` is a question opening and
`afterTheFilm.about` is About arriving — a photograph, a mark and three blocks of words, staggered, with one
14px settle on the picture and opacity everywhere else.

Anything that wants a third should be asked §7's question first, and the two that exist are the shape of a
good answer to it: a press *is* a change, and a section where the studio shows you the room the work is made
in *is* a change. **Three elements each fading upward because the visitor scrolled is not** — that is the
generic reveal, and *what changed?* there is answered by *nothing; somebody scrolled*. `decisions.md` §54.

`data-emerges` is gone. It existed for one element — Chapter III's claim, which the film lit rather than the
act — and the claim is gone with it. What the film now reveals is the object's aperture, and that is a share
of a property (`--aperture`) rather than an element with an attribute on it. `decisions.md` §51.

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
- **No scale or move duration tokens.** Everything that transforms is scroll-driven, so each has a range and
  none has a duration: the word `chapter` travelling into the corner (`story.chapterTravels`), Chapter III's
  frame being printed into a plate (`actStory.printing`), and the method's field converging into one point
  (`methodStory.converge`). The last of those moves twelve elements from **one** number, because each carries
  its own offset in the stylesheet and the beat only says how much of it is left — see `decisions.md` §55.
  The one exception is About's photograph, which is on a clock rather than on scroll, and its 14px settle is a
  distance in `story.afterTheFilm.about` rather than a token.
  `04-visual-language.md` §7 is why there are only two — each earns the movement because what changes is
  what the thing is *for*: a word stops ending a sentence and becomes an orientation mark; an object stops
  being the subject of an empty frame and becomes half of a spread. Nothing else on the site changes
  purpose. Nothing scales, and the object's *distance* is composition (`globals.css`), not a timing.
- **No spring or physics config.** Springs have character. See *Easing*.
- **No stagger helper.** Chapter II's cadence is four beats with deliberately unequal holds — long,
  short, short, medium. A stagger helper would make that rhythm expressible only as a metronome, which
  is the thing it was composed to avoid.

An empty token is not neutral. It is an invitation.

## Five things outside `pace.haste`, on purpose

`studioBlocks`, `navHover`, `work.arrives`, `answer` and `about` are **not** multiplied by `--haste`.

The film is over by Chapter III, so there is no sequence left to hurry and nothing for a multiplier to
keep in proportion. And an interface that answered at a different speed depending on how the visitor
scrolled two minutes earlier would be responding to the wrong thing. `work.arrives` answers a load event,
which is a network rather than a sequence; `answer` answers a press, in the publication, and is the fastest
thing in the project because a press must never feel slower than a hover; `about` is an arrival on a page
nobody is being held on, so there is nothing for a visitor to hurry past.

The first two match the behaviour before the system existed, where both were hardcoded and therefore outside
it by accident. All five are now outside it on purpose, and written down.

**`about` is also the one thing `prefers-reduced-motion` changes**, and it changes a *distance*, not a beat:
`--about-settle` goes to zero, so the photograph arrives in light instead of from below, in the same order and
on the same clock. Everything else in the piece is opacity, and opacity is not what such a request is about.

**There is nothing left for `prefers-reduced-motion` to remove.** `atmosphere.drift` was the one thing in the
piece that moved without being asked, and it was the one exception to the rule that reduced motion is the same
choreography on a faster clock rather than one with beats taken out. §53 deleted the fields it moved, so the
exception is gone with them and the rule holds everywhere. `decisions.md` §53.

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
