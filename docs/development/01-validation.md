# 01 — Validation

*How work is finished. Applies to every implementation, without being asked for.*
*Version 1 · 4 August 2026 · governed by `docs/brand/` (locked)*

---

## Purpose

An implementation is not complete when the code runs. It is complete when the code is correct **and**
the experience has been checked.

This project sells how something feels. A change that compiles, passes every check and leaves the
work feeling worse has failed — it has simply failed somewhere the compiler cannot see.
`01-vision.md` puts it first: feeling is structure, and it is built or it is missing. So the
experience is a gate, not a review note.

Two habits follow from that, and they are the whole document in miniature.

**Measure before judging.** The eye is confident and wrong. On this project a background measured
low enough for white type and still read badly, because the number described luminance and the
problem was texture. A loop seam measured as a perfect zero difference, and the zero was an artifact
of sampling the same decoded frame twice. Numbers catch what the eye misses; the eye catches what the
numbers do not describe. Both, every time.

**Look after measuring.** A passing check is not evidence of quality. Screenshot the thing, at the
moment that matters, at the size a visitor will meet it.

## Required quality gates

Every task ends with all of these. Not most of them.

| Gate | Command | Why it is here |
|---|---|---|
| **Typecheck** | `npm run typecheck` | Catches the rename you finished and the reference you did not. |
| **Lint** | `npm run lint` | Catches effect and dependency mistakes that look fine and behave badly. |
| **Build** | `npm run build` | Only when the change touches config, routing, imports or anything the dev server is lenient about. |
| **Runtime** | Open it. Drive it. | The dev server compiling is not the feature working. |
| **Regression** | Replay from the top. | See below — this is the gate most often skipped and most often needed. |

→ *A green gate proves the absence of one class of error. It proves nothing about the work.*

## Responsive validation

Four viewports, every time:

- **Desktop** 1920 × 1080
- **Laptop** 1440 × 900
- **Tablet** 768 × 1024
- **Mobile** 390 × 844, portrait

…and, since V2, a fifth that is not a validation viewport at all:

- **Design reference** 1440 × 760 — the frame the approved desktop design was authored in

Never assume desktop behaviour scales. It routinely does not, and the failures are structural rather
than cosmetic — a value that caps at one width and not another, a hit area that is fine for a cursor
and unusable for a thumb, an inset that silently evaluates to zero.

Responsive means the *intended experience* survives, not that the layout got smaller. Where a
composition cannot survive being narrowed, it is recomposed. `04-visual-language.md` §5 is the
authority: an image is never reshaped to fit the space it lands in.

### The reference frame, and what it is not

**1440 × 760 is a coordinate and composition system.** Every coordinate in
`docs/design/v2/final-design-spec.pdf` is authored in px on it — `x196` the type margin, `x38` the
Ledger rail, `y529` the writing line. It is **not** a required production viewport, **not** a minimum
supported viewport, **not** a fixed browser resolution and **not** a production aspect ratio. Check
composition against it; ship against the four above.

Desktop is the visual authority for composition, hierarchy, typography intent, spacing relationships,
transition meaning, and environment and light treatment. Where a real viewport cannot accommodate a
desktop coordinate, size or composition, **adapt it — do not blindly preserve the geometry.**

**Preserve in this order.** It is an order, not a list:

| | Preserve | |
|---|---|---|
| 1 | narrative meaning | first, always |
| 2 | visual hierarchy | |
| 3 | transition mechanism | |
| 4 | typography hierarchy | |
| 5 | spatial relationships | |
| 6 | exact desktop coordinates | **last** — the first thing to give when the viewport cannot hold it |

Mobile adaptation is an **implementation requirement, not a new design direction.** It may not invent a
different visual language for narrow screens, redesign a section arbitrarily, alter the approved desktop
composition, create a second mobile concept, or drop a narrative beat to make a layout fit.

Where V2 marks something **"not yet designed at any breakpoint"** — §10 names the Ledger rail, the Hero
time and the Questions rows — **adapt conservatively from the desktop intent.** An absence of mobile
design is not permission to invent a visual system. Preserve hierarchy, preserve anchors, preserve
transition meaning, simplify geometry only where necessary, hold legibility and interaction.

The decision and its reasoning are `docs/design/v2/implementation-reconciliation.md` **C7**, closed
26 August 2026.

### When responsive behaviour makes an implementation incomplete

A correct desktop does not finish the work. **The implementation is incomplete if a narrower viewport**
clips content, creates overlap, becomes unreadable, introduces horizontal scrolling that was not asked
for, breaks an interaction, breaks the narrative sequence, or renders a transition meaningless. Report
it as incomplete rather than shipping it with a note.

What to check at each size: type scale and its ratios, alignment against the axes it should share,
text wrapping — including authored line breaks, which a narrow measure will quietly undo — media
cropping, safe areas, and the physical distance any scroll-driven sequence requires.

→ *A phone is not a small desktop. It has a different pointer, a different gesture, a different
viewport that changes size while you use it, and a thumb over the bottom third of the screen.*

## Interaction validation

Every feature is driven by hand before it is called done:

Mouse wheel · trackpad · touch · slow scroll · fast scroll · scroll stopped mid-sequence · scroll
reversed · refresh · window resize · orientation change.

The narrative stays coherent under all of them. Specifically: nothing is skipped, nothing arrives out
of order, nothing sticks in a half state, and stopping anywhere leaves a frame worth looking at.

Two rules earned the hard way:

**Scroll-driven state must be a pure function of scroll position.** Then reversal and interruption
are correct by construction rather than by testing. Anything that accumulates or latches will
eventually disagree with where the page actually is.

**A thumb is not a wheel.** A wheel notch moves about 100px. A flick carries 800 to 2000px of
momentum. A sequence tuned to a wheel can pass entirely within one thumb movement, and the visitor
will never know it existed.

## Motion validation

Review every animation for timing, rhythm, easing, the scroll distance it occupies, visual
continuity, whether it can be interrupted, whether it plays backwards, and whether it responds.

Motion here is cinematic or it is a defect. The difference is legible: a straight ramp reads as an
effect being performed, an eased one reads as light behaving like light. `04-visual-language.md` §7
is the constraint — motion exists to make change comprehensible, and if nothing has changed in
meaning, nothing moves.

→ *If a reviewer can name the animation, it is too loud. They should only be able to name what
changed.*

## Regression validation

Before a task is complete, replay the homepage from the first frame at normal speed.

Confirm none of these has quietly degraded: the hero, typography, navigation, the footage and its
loop, previously built chapters, the scroll choreography, responsive behaviour, existing
interactions.

**Never improve one chapter by weakening another.** A change that is local in the code is rarely
local in the experience — a variable renamed for one element, a container resized for one purpose, a
selector that outranks something it was never meant to touch.

→ *The regression is almost never in the thing you changed. It is in the thing that shared a name,
an axis or an ancestor with it.*

## Experience validation

The homepage is one continuous narrative, not a set of sections that happen to be adjacent.

Validate the emotional flow, not only the technical result. Ask what a visitor feels at each moment
and whether the order still earns it. **A technically correct implementation that weakens the
narrative is incomplete**, and should be reported as incomplete rather than shipped with a note.

Where something cannot be judged from measurement — whether a pause holds or drags, whether a reveal
feels inevitable or contrived — say so plainly and name the specific thing a person needs to sit and
watch. Do not present a number as if it settled a question it cannot reach.

## Completion criteria

A task is complete only when all of these are true:

✓ Code quality passes — typecheck, lint, build where applicable
✓ Runtime behaves correctly, driven by hand
✓ Responsive validation passes at all four viewports, and the composition still reads against the
  1440 × 760 reference frame
✓ No narrow viewport clips, overlaps, scrolls sideways, or empties a transition of its meaning
✓ Interaction validation passes
✓ Regression validation passes
✓ The complete homepage has been replayed from the beginning

Anything unverified is stated as unverified, with the reason. An environment that cannot test iOS
Safari does not get to imply it did.

## Known failure modes

Real ones from this project. Every one passed every automated check.

- `overflow-x: hidden` on the root makes it a scroll container and defeats `position: sticky` in
  every descendant. `clip` trims without becoming scrollable.
- `env(safe-area-inset-*)` evaluates to zero unless `viewport-fit=cover` is set. Padding written
  against it does nothing, silently.
- `width: 100%` stops at the content box and leaves the scrollbar gutter uncovered — a dark strip
  down the edge of a full-bleed element on every screen.
- A CSS variable read once at mount goes stale the moment a media query it depends on changes.
- `.parent p` outranks `.child-class`. Name elements explicitly rather than reaching for them
  through their ancestors.
- A `<noscript>` block referencing a renamed class fails invisibly, because nothing that renders
  normally ever executes it.
- A programmatic `scrollTo` fires a `scroll` event, which any intent handler will treat as the
  visitor asking for something.
- A `requestAnimationFrame` clock that adds the raw frame delta will leap after any stall, firing
  several steps in the same millisecond. Clamp the step.
- Two elements can be centred on different axes if one is sized in `vw` and the other in `%`.
- Sampling a video every animation frame reads the same decoded frame twice and reports a
  difference of zero. Wait for the decode before comparing.

## Final principle

Never optimise an isolated component. Evaluate it inside the whole visitor journey.

Visitors experience a story. They do not experience sections.
