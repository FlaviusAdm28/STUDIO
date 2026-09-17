# Chapter One — working notes

Digital experiences built for moments worth remembering.

The homepage is **one continuous narrative, states 01 to 14**. It is not a page of sections, and — since
C8 was resolved on 25 August 2026 — it is **not a film and then a publication** either. That split
survives as a *change of register*, where type stops speaking and starts being read, and it does **not**
survive as a boundary in the sequence. Read the documents below before implementing anything; they are
not optional context.

> **C8, the driving rule, decided:** **scroll owns progression; time owns only what the visitor did not
> cause.** Progression through the fourteen states is one continuous scroll position. Three things hold
> a clock and nothing else may: the Hero's arrival (`chapterOneStory` — nothing has been caused yet),
> the Work aside (visitor-caused and off-runway), and interface response (`navHover`, `answer`, `about`,
> `work.arrives` — input-caused). Where V2 quotes seconds for a scroll-caused junction, those seconds
> are a **weight**, not a duration: they set proportion, and distance is what ships. There is one
> progression model, never thirteen timelines.
>
> **C8 is implemented, and C4 is implemented on top of it. Both are shipped infrastructure, not
> pending work.**
>
> **C8 — the collapse.** The three separately measured runways are **one continuous narrative position
> `p`**, spanning states 01 → 14. `--pin`, `--act-pin` and `--method-pin` survive as **per-segment
> prices on that position** — a beat of the method still costs less than a beat of the film — and no
> longer as coordinate systems with origins of their own. `timeline.ts`'s `narrativePositions` resolves
> all fourteen states onto `p`; the driver measures and writes, and decides nothing about the sequence.
>
> **C4 — the junctions.** All **thirteen junctions are resolved on that same position**, each as the
> interval between the two states it joins, tiling `p` end to end. `junctionAt` gives every junction
> its own `0 → 1`, affine in `p`, so a survivor crosses its whole junction as one continuous range —
> no coordinate bridge, no per-junction timeline, and `--frame-mark` is gone for good. The driver
> publishes `--junction` and `--junction-at`.
>
> **The 08 → 09 act offset is an internal offset, not a narrative boundary.** It sits inside that
> junction's interval and is *preserved* there deliberately: `p` advances at one rate across it — only
> the act's own view is scaled differently — so anything written on `p` crosses it continuously. The
> assertion ruled it, not a judgement call; `aperture` crosses that exact offset as one expression.
>
> What is described below is still the **pre-V2 presentation**, which C8 and C4 did not touch: they are
> the position model beneath it. `docs/design/v2/implementation-reconciliation.md` C8 and C4 are the
> record, including the two findings the design owner closed on 29 August 2026 — `SECONDS_TO_VH` stays
> at 20 with V2's authored weights intact, and state 14's reachability is deferred to the presentation
> rebuild.

> **C13, canonical, decided 7 September 2026 — it supersedes C12, C11 and C10.**
> `docs/design/v2/implementation-reconciliation.md` C13 is the record. Read it before touching
> junctions 04 → 09 or state 09.
>
> ```
> Chapter One → Chapter → II Philosophy → Every unforgettable moment deserves an experience.
>   → A wedding. → An artist. → A memory.
>     → the photograph, alone  → the composition opens · the rail → the Work
> ```
>
> **`A memory.` is the last typographic moment of the narrative.** After it there is **no type at all**
> until the rail: the photograph holds, the camera opens the frame, the navigation is written in the
> field it opens, and the same photograph becomes the Work's first experience.
>
> **Removed from the site, and not to be reintroduced in any form:**
> `Some moments deserve another chapter.` — and **not replaced by another conceptual line**, because the
> photograph and the reframe do that work · `chapter` as an intermediate state · `chapter → Studio` ·
> `Studio` as a display word · `Wedding Experience` as state 09's headline · `Other experiences →`.
>
> **The Work is an editorial carousel and scroll does not control it.** *WHAT WE ACTUALLY MAKE* (eyebrow)
> → **the queue** → the category (the protagonist, ~38px serif), with the photograph's identification
> small in the lower right and *See full experience →* under it only where the work has a URL. **Scroll
> owns entry and exit of the section; which category is showing is a clock** — `TIMING.work.queue`, which
> is what C8 reserves a clock for. **No dots, pagination, counters, thumbnails, cards or arrows**, and the
> exchange is the film's own dip so two categories are never legible together.
>
> **C14, decided 16 September 2026 (Q2 · *fila que roda*): the category word is the index.** The next
> categories stand as small words between the eyebrow and the headline; the first fills with time, is
> promoted when full, the row moves up and the category that was showing re-enters at the tail. The
> active category is never in the row, and the headline never travels. One representative work per
> category (`makes.categories`). `implementation-reconciliation.md` C14 is the record.
>
> Three approved departures from the Final Spec, all in C13: §2's states 06 and 07 carry no type; §2's
> state-09 board is re-composed; and §11.2's plate count is **four** — the Work's experiences need a
> ground of their own, and it lives in the Environment because `.v2` is at 0.84 by the time the Work is
> composed and anything drawn inside it composites over the ground instead of being one.

## The design is V2

**`docs/design/v2/` is the authoritative design source.** Everything in that directory is
authoritative; nothing outside it is. Where an archived document and V2 disagree, **V2 is correct and
the archived document is out of date** — that is not a conflict to resolve, it is what an archive is.
Implementation must preserve the approved visual direction; do not redesign, reinterpret or invent
alternatives without explicit instruction.

### This is a revamp, not a preservation project — approved 29 August 2026

**V2 is a clean rebuild of the presentation layer.** The Final Spec and the Final Visual Master define
the target. **The existing code is an implementation source, not a visual authority.**

**Preserve validated infrastructure that V2 depends on**, and do not rewrite it without cause:

- the spine and state model (`src/motion/spine.ts`);
- relative scroll progression — one position, per-beat relationships, purity on scroll;
- `timeline.ts`'s resolution and **every one of its assertions**;
- easing and transition mechanisms that still apply (`easings.ts`, `scroll.ts`, `transitions.ts`);
- Ledger mechanisms that remain valid — one lifetime, the projection of state, `data-aside`;
- accessibility mechanisms that remain valid — focus return, `inert`, the reduced-motion answers,
  and the no-scripting composed alternative as a *principle*;
- the project model (`projects`, `activeProject`, `site.environment`);
- the persistent Environment architecture (`environment.tsx`, `motion/environment.ts`).

**Do not preserve V1 presentation merely because it exists and renders.** V1-only visual composition
may be replaced wholesale where that produces a cleaner and more reliable V2 implementation — page
composition, opening composition, publication composition, Chapter III's composition, section-owned
grounds, card layouts, the old navigation presentation, the old About inset, the old Method 3D
composition, and V1 visual selectors and CSS.

Prefer **V2 design → clean component structure → validated existing mechanisms** over **V1 composition
→ incremental CSS patching → layers fighting each other.**

Evaluate every component by one question: **does V2 actually need this?** If not, it can be replaced or
retired once its dependencies are safely removed. Removing a dependency safely is still required; a
clean revamp is not a licence to delete something another part of the build is still reading.

Two limits, and they are not softened by any of the above: **do not rewrite validated motion or state
infrastructure unnecessarily**, and **do not invent design behaviour V2 does not state.**

### How to read the rest of this file

Everything below is **an accurate account of the pre-V2 build**, and from 29 August 2026 it is
**historical implementation constraint, not authority for the rebuild.** Read it the way you read the
archive: it records what was tried, what was measured and why the code is the way it is. Much of it is
still worth having — the measurements especially, which cost real work to obtain and are true of the
material whatever composition sits on top of it. **None of it locks a V2 composition, and none of it is
a reason to keep a V1 one.** Where a rule below contradicts V2, **V2 wins**; the open conflicts are
registered in `docs/design/v2/implementation-reconciliation.md`.

## Read first, every time

| Document | Standing |
|---|---|
| `docs/design/v2/README.md` | **Read first.** How the approved design package is organised and which reference wins. |
| `docs/design/v2/final-design-spec.pdf` | **Canonical.** The approved design. Wins over every other reference. |
| `docs/design/v2/storyboard.zip` | **Authoritative.** Visual, motion and navigation reference. |
| `docs/design/v2/implementation-map.md` | **Authoritative.** The implementation index — order of sections and the transitions between them. |
| `docs/design/v2/implementation-reconciliation.md` | The decision register for conflicts between V2 and the existing build. Open items are unresolved; do not resolve one in code. |
| `docs/development/01-validation.md` | **Mandatory.** How work is finished. Consult before starting, satisfy before reporting complete. |
| `docs/development/02-motion-system.md` | **Mandatory before touching motion.** Every timing is a per-beat object in `src/motion/story.ts`, relative to the beat before it. Nothing in a component or stylesheet. |
| `docs/development/03-choreography.md` | **Mandatory before adding or retiming any animation.** `src/motion/timing.ts` is the central choreography configuration for the whole site — the numbers; `story.ts` carries the reasoning. A new animation is not finished until its parameters are in it. |
| `docs/brand/01-vision.md` … `04-visual-language.md` | **Locked.** Never modify. They govern V2 rather than being replaced by it; every design decision must be defensible from a line in one of them. |
| `docs/brand/open-decisions.md` | Unanswered questions. The typeface is still one of them. Active. |
| `docs/design/archive/README.md` | **Historical.** What is in the archive and what each document was. |

### The archive, and the citations into it

Every superseded design document lives in `docs/design/archive/` and **none of it is authoritative**:

| Archived document | Was |
|---|---|
| `docs/design/archive/design/decisions.md` | The pre-V2 decision log, §01–§56. |
| `docs/design/archive/design/chapter-three-review.md` | A review of Chapter III's architecture. Never a decision. |
| `docs/design/archive/design/copy-drafts.md` | Removed copy, kept so it is not lost. Referenced by nothing. |
| `docs/design/archive/brand/05-storyboard.md` | The pre-V2 storyboard. **Superseded by the V2 storyboard.** |
| `docs/design/archive/brand/design-system-inputs.md` | Disposable. Nothing in it was ever a rule. |
| `docs/design/archive/brand/vision.md` | An early draft, superseded by `docs/brand/01-vision.md`. |

Comments in this file, in `content/site.ts`, in `src/app/globals.css` and throughout `src/` cite
`decisions.md` and `05-storyboard.md` by bare filename and section number. **Those citations resolve
into `docs/design/archive/`** — the sections are unchanged, only the path moved. They record why the
existing code is the way it is; they do not override V2.

## Non-negotiables

- **Choreography lives in one file, and adding to it is part of the task.** `src/motion/timing.ts` is
  the central configuration — ten numbered sections covering every animation on the site, from Chapter
  I's milliseconds to the input spring and the junction prices. **A new animation or transition is not
  finished until its choreography parameters are in it, and retiming an existing one means editing it
  there.** A duration, delay, hold, easing threshold or scroll distance written into a component, a
  stylesheet, the driver or a resolver is a regression and should be reported as one — it defeats the
  ripple edit, it is invisible to `timeline.ts`'s assertions, and it makes the pacing unreadable.
  `docs/development/03-choreography.md` is the convention and the section index.
- **Validation is part of the task.** Typecheck, lint, build where applicable, runtime, regression.
  Four viewports: 1920×1080, 1440×900, 768×1024, 390×844 portrait. Never assume desktop scales. A Chrome
  window on Windows will not go below ~500 wide: drive 390 in a same-origin frame of that size, which
  evaluates media queries against its own viewport. Test the no-scripting version against `next start`,
  never `next dev` — dev injects the stylesheet with JavaScript and reports a failure that is not real.
- **1440×760 is the design reference frame, not a viewport.** V2's coordinates are authored on it and
  it is the visual authority for composition — but it is not a production viewport, not a minimum, not a
  fixed resolution and not an aspect ratio. Where a real viewport cannot hold a desktop coordinate,
  **adapt**, preserving in this order: narrative meaning, visual hierarchy, transition mechanism,
  typography hierarchy, spatial relationships, and **exact desktop coordinates last**. Mobile is an
  implementation requirement, never a second design: no separate mobile visual language, no arbitrary
  redesign, no beat dropped to make a layout fit. Where V2 says *not yet designed at any breakpoint*
  (§10: the Ledger rail, the Hero time, the Questions rows), adapt conservatively from the desktop
  intent — an absence of mobile design is not permission to invent a system. This is why the method's
  word coordinates are fractions of the frame, why display line breaks are authored for 320, and why
  Chapter III is solved from one rectangle and one column. `implementation-reconciliation.md` C7,
  closed 26 August 2026; the gates are `docs/development/01-validation.md`.
- **A correct desktop does not finish the work.** An implementation is incomplete if a narrower viewport
  clips, overlaps, becomes unreadable, scrolls sideways unasked, breaks an interaction, breaks the
  narrative sequence, or empties a transition of its meaning. Report it as incomplete.
- **The hero's *mechanisms* are load-bearing; its V1 composition is not locked.** This bullet used to
  read *"the hero is locked — changes to `src/app/opening.tsx` are regressions"*. That was the pre-V2
  rule and the revamp principle supersedes it: **`opening.tsx` may be recomposed where V2 requires it**,
  and state 01 on the hero plate at §2's own exposure is such a requirement. What survives is not the
  layout but the behaviour, and these are still regressions if lost: the opening is **mandatory** —
  scrolling hurries it and can never skip it, and neither can a link; it keeps **its own clock**,
  accelerated in proportion to how hard the visitor scrolls (`--haste`); it publishes `data-opening` on
  the root, which is what fixes the shot's origin the instant it flips; and the footage is the
  Environment's element, driven from here and never re-owned. Recompose the frame; do not quietly drop
  one of those four.
- **Replay the homepage from the first frame** before calling anything complete. Never improve one
  chapter by weakening another.
- **State what was not verified**, and why. iOS Safari cannot be tested from this environment.
- **A technically correct change that weakens the narrative is incomplete.** Report it as incomplete.

## Where things live

> **Standing, from 29 August 2026.** This section is **an account of the pre-V2 build, not a
> specification for the V2 one.** It is here so you can find things, understand why a mechanism is
> shaped the way it is, and avoid re-discovering something that was already measured. Where an entry
> describes **infrastructure** — the spine, the timeline and its assertions, the driver's purity, the
> Environment, the project model, the Ledger's lifetime — it still governs. Where an entry describes
> **V1 composition** — the cards, the act's frame, the publication's grid, the method's 3D field, the
> section-owned grounds — it is history: it does not lock a V2 composition and it is not a reason to
> keep a V1 one. The measurements inside those entries stay true of the material and are worth reading
> before you re-solve the same problem; the compositions they justified are replaceable.

- `content/site.ts` — all language, all navigation destinations (`where`), Chapter III's structure, and
  the publication (`site.publication`).
  A destination is a section *name*; `page.tsx` writes the `#` on one side and the `id` on the other, so
  the two cannot drift. **`where` is section ids and `ledger.destinations` is the Ledger's five, and they
  are no longer the same list.** `work` is not an id at all — V2 §6 makes it an aside rather than a place,
  so there is no `#work` and no `--work-at`. `studio` is an id and not a destination: it is the act's own,
  and the film's position is carried by the chapter ticks. `method` has an id now, and `faq` is
  `questions`. `decisions.md` §54 argued the method should have no destination; V2 supersedes that —
  `docs/design/v2/implementation-reconciliation.md` C2. The work is **one**
  experience: the
  act is a single continuous choreography with the studio's own sentences inside it, so a second
  experience is a second act and a brief rather than an entry. `decisions.md` §46. Never hardcode
  words in a component.
  `three.work` is **everything the act knows about the project** — its name, the URL, the viewport it was
  drawn for, whether it consents to being framed, the colours the room takes from it, and the annotation
  (`work.context`: an index, a label and two authored lines). Swapping the project is these lines and nothing
  else: not one beat, distance or selector in the act refers to a wedding. `decisions.md` §49 and §51.
- `src/motion/story.ts` — the storyboard. One object per narrative beat, stating its *relationship*
  to the beat before it; only anchors carry an absolute. `timeline.ts` resolves it. Never hardcode a
  duration, delay, easing or threshold anywhere else, and never write an absolute you could derive.
  Timings are per-beat and never shared; easing and mechanism are shared and never per-beat.
  `globals.css` reads these values and declares none.
- **Three runways of scroll, numbered separately — and C8 has ruled that they must become one.** The shot
  (`shotStory` / `BEATS` / `pin`), Chapter III's act (`actStory` / `ACT_BEATS` / `actPin`) and the method
  (`methodStory` / `METHOD_BEATS` / `methodPin`). One driver, one curve, one unit. The first two are joined
  by scroll position and by `studioEmerges`, which opens the first third of the aperture from inside the
  film. Do not move a number between any of them **while they still exist**.

  **They are a pricing device, not a narrative one, and V2 needs a survivor to cross every junction.**
  Today exactly one value crosses a boundary (`--frame-mark`) and it took a documented special case;
  thirteen junctions would need thirteen. So the runways collapse into **one continuous position**, with
  per-segment pricing a property of that position, and **a runway boundary may never fall inside a
  junction**. Files may stay separate where that is useful; they may not hold a second progression model.
  Not yet done — it is the precondition for C4.
  **A beat of the film costs ~55vh and a beat of the method costs 40** — that gap is the point: the method is
  not a chapter and must not weigh like one. The method's frame is now the *longest* held frame on the site
  (200vh against the act's 176) and still the cheapest per beat; the price is the argument, not the total.
  `decisions.md` §55 and §56.
- `src/app/opening.tsx` — the hero. Its own clock, accelerated in proportion to how hard the visitor
  scrolls. **The opening is mandatory**: scrolling hurries it and can never skip it, and neither can a
  link — the hero's navigation does not navigate while `data-opening` reads `running`. It publishes
  `data-opening` on the root to say whether it is still running; `scroll-stage.tsx` watches that
  attribute and fixes the shot's origin the instant it flips.
- **The Ledger is the navigation, and it is one rail with one lifetime.** `src/app/ledger.tsx`: the
  head — `III — Studio`, **set as type and not as anything a word turned into** — the chapter ticks, the
  five destinations with leader rules whose length encodes depth, and the Work aside. Present from the
  first frame, unlit until the dock at V2 state 08, *never re-created*. It replaced the masthead, which was the same idea revealed once at Chapter III.
  `.act-stage` still begins below the head margin, so the mark is never over a photograph
  (`decisions.md` §47), and the rail keeps that band until C5 gives it V2's crossing ink.
- **Where the film is, is `src/motion/spine.ts`** — V2's fourteen states and thirteen junctions,
  transcribed. Identity, never timing: it associates each state with the beats in `story.ts` that already
  compose it, and `timeline.ts` resolves each state's entry from an existing span. The driver writes
  `--state` and the Ledger's properties from it and nothing else reads a state. `plate`, `exposure`,
  `ink` and the junctions' quoted seconds are recorded and consumed by nothing — they are C5's and C8's.
- **Chapter III's act is one object, a room, and one annotation beside it.** There is no claim and no hero
  statement: the chapter's own mark starts uncovering the device, the room goes dark *around* it while it
  stays lit, the work's colour reaches into that dark, the object crosses aside with the studio's annotation
  written beside it in the same movement, that annotation becomes the studio's two sentences, and the way
  out arrives last. The dark is beneath the object on purpose: what the beat takes away is the room.
  `decisions.md` §49 and §51.
- **The object is the one thing in the act that moves, and it never scales.** `actStory.crossing` drives
  `--across`; `globals.css` decides whether that is a translation left or a lift upward, because that is
  composition and it changes with the screen. This supersedes §49's *nothing moves* on that one point only.
- **Chapter III is beats, and nothing else.** §50's second clock is gone: the studio's sentences are on the
  page again, so every narrative value in the piece is either Chapter I's milliseconds or a beat of scroll.
  What is left in `afterTheFilm.experience` is a **press and its consequences** — a fade, a patience and a
  spill — and `afterTheFilm.atmosphere.drift` is weather. Neither is a storyboard. `decisions.md` §51.
- **The screen waits to be asked.** One word (`work.invite`) on black glass, and nothing is fetched before
  the press. `work.embeds` alone decides whether the press loads the work in place or opens it in its own
  window, and the two offers on the page must never look alike: *Explore* enters the work inside the device,
  *Explore experience →* leaves with it.
- `src/app/scroll-stage.tsx` — the Chapter I → II shot. Driven by `scrollY - origin`, where the origin
  is fixed the moment the opening finishes — so scrolling during the intro cannot arrive underneath it.
- `src/app/globals.css` — one curve, opacity only. The curve, `--pin`, `--act-pin` and the two distances
  that place Chapter III inside the film's last frame all come from `src/motion`; nothing here declares
  them. The one exception is the act's *composition* (`--screen-h` and everything derived from it, down to
  `--object-hem`, `--object-cross` and `--aside-w`) — sizes and places in a frame that change with the
  screen, not timings. Everything there is solved from the height of one rectangle and the width of one
  column, so the act has two numbers to tune and both are argued where they are declared. `--aperture` is
  the one value that is *composed* there rather than read: it adds the aperture's two stages.
- **`experience.tsx` is gone, and C5 split what it owned in two.** `final-design-spec.pdf` §11.1 forbids a
  work surface standing as the environment, so the device is no longer the centre of Chapter III.
  `src/app/environment.tsx` owns the ground — one element, three plates, mounted once for the session and
  never unmounted — and `src/app/fragment.tsx` owns the live work, mounted by `src/app/ledger.tsx` only
  while the Work aside is open and unmounted when it closes. Nothing is fetched before the press. Neither
  file owns a timing, a position or a beat. Whether the work consents to being framed is still
  `work.embeds`, a **measured header written down** — it cannot be discovered at runtime, and
  `decisions.md` §49 records the two attempts that proved it.
  `docs/design/v2/implementation-reconciliation.md` C5.
- The room's colour is three gradient fields on long closed transform loops, and that is the whole of the
  atmosphere. **Never sample the work's pixels and never add a per-frame loop for it** — the work is
  cross-origin, so its pixels are unreadable, and the cost is the thing the effect exists without.
  `decisions.md` §51.
- `public/media/hero/video/` — footage. H.264 in a QuickTime container; Chrome plays it only when
  handed the bytes without a `type` hint.
- `src/app/publication.tsx` — **everything after the film**: About, the method, the questions, Contact.
  Ordinary flow and ordinary elements everywhere **except the method**, which is a held frame on its own
  runway, on its own ground. No numeral anywhere in it, and two clocked timings in all of it
  (`afterTheFilm.about`, About's arrival; `afterTheFilm.answer`, a question opening).
  The film ends by everything cinematic ceasing at once rather than by a transition being added — the frame
  stops being pinned, the numerals stop, the scale drops, and the type stops being looked at and starts being
  read. **Nothing announces it**: there is no chapter after III, no closing section, and no sentence handing
  over. Do not give any of it a beat except the one section that already earns one, and do not give this half
  a second *page* — the method's room is the publication's own ink standing in for its paper for 200vh, not a
  new ground, and it is the only exception there is. `decisions.md` §54, §55 and §56.
- **One grid for the two sections that are type**, and no break in it: a rail of labels on `--mark-x` and a
  column beside it. The questions and Contact use it; they are also the only two sections with a rule.
  **About and the method are the exceptions.** ~~About is a photograph on the left and one narrative on
  the right, arriving on a clock.~~ **Superseded by C15 (16 September 2026):** About is a *frame* — the
  studio plate with no scrim, the claim and its evidence written on the wall in light ink, fixed in the
  viewport, arriving on `--jp9` and released in place in 10 → 11. 09 → 10 is a narrowed superimpose.
  `implementation-reconciliation.md` C15 and `TIMING.about`.
- **The method is a held frame, the only spatial composition on the site, and the one place the publication
  turns its material over.** The paper darkens to the studio's own ink on the approach, four questions surface
  out of a `perspective` space one at a time, each brings three considerations, twelve accumulate at their own
  distances, and `--mgather` collapses every one of them into the point the questions stood on — where the
  answer comes forward. Then the frame clears, the paper returns, and the answer is printed on it.
  `decisions.md` §55 and §56.
- **The room is `--ink` at full strength and its type is `--paper`: two materials with their roles exchanged,
  not a third ground.** Every colour in the section is a `color-mix` on `--mroom`, which is 0 at rest — so the
  publication's own ink on paper is what the section resolves to before the driver runs and without scripting.
  The Ledger stays paper throughout and the navigation is untouched. Never give this section a numeral, a
  marker or the film's black.
- **The printing is three stages and they must not overlap.** Light type crossing to dark type while the ground
  crosses the other way passes through a frame measuring ~1.1:1, where the answer cannot be read at all. So the
  type clears, the empty room lightens, and the answer is printed — `actStory.printing.clears`'s own reasoning,
  and `timeline.ts` asserts it. The two authored lines exist only on paper.
- **Depth is four things and only one is scale**: 2.9:1 of drawn type, three deliberate occlusions, the camera
  (`--mdrift`), and an ink falloff of 0.96 → 0.52. §55 had scale alone at 1.35:1 and it was invisible. Occlusion
  needs the halo on `.mword` to read — type has no ground of its own, so without it a far word interleaves its
  glyphs with a near one and looks like a bug.
- **`--mdrift` is the one range in the project with no curve.** It is a camera, not a beat: `ramp` in
  `scroll.ts`, straight, so the field moves at the rate the hand moves. Never ease it, and never let it run past
  the convergence — `drift.holdsPastTheGathering` is an authored zero.
- **Four authored numbers per word** (`--wx --wy --wd --wr`) and one arrival; `--wx` and `--wy` are **fractions
  of the frame**, not `vw`/`vh`, because the frame is the viewport less the head margin. `--wd` drives distance,
  size, ink *and* how much of the camera a word takes, so a word cannot be far away and loud, or far away and
  fast. Everything is in one coordinate table in `globals.css`, tuned by eye, with a second table for phones.
- **The room's arrival is stated in viewport heights, not beats** (`methodArrival`), because the approach is a
  layout distance and is the same length however the runway is priced — `--method-pin` is half as long again
  for a thumb. It is the only value the driver computes outside a track. The ramp is painted in `.method`'s own
  `padding-top` and never inside the held frame; the section's height carries that padding so the runway is
  unchanged, and `scroll-stage.tsx` adds it back when it measures the lock.
- **Four traps in that section, all silent.** An `opacity` (or `filter`, or `overflow`) on any wrapper
  between the frame and the words flattens the 3D scene and the perspective is gone — so the convergence
  multiplies each word's own opacity instead. A `ch` limit is measured in the *wrapper's* font size, not its
  children's. A stuck element's rect reports its sticky offset rather than where it came from, so the runway is
  measured from `.method` and never from the stage. And a gradient painted on the held frame is inside the
  viewport that gets held — the room's ramp belongs in the band above it, or the top of the room never stops
  fading to paper.
- **Do not add a light to the room.** It was built and removed: on this ink, an alpha low enough to be a room
  rather than a spotlight is a delta of about twelve values, and twelve values over seven hundred pixels bands
  visibly every sixty. Eight bits is eight bits. The room is flat ink and the depth is carried by things that
  were measured. `decisions.md` §56.
- **Type after the film is type that disappears.** `--read` is the reading face and the single place
  `open-decisions.md` §7 lands when it is answered; it is deliberately named apart from `--voice` so that
  choosing a reading face cannot silently retype the hero. Nothing in the publication is ever as loud as
  anything in the film.
- **Author a line break for 320, not for 1440.** Measured: the glyph width here is 0.476em at weight 300,
  so a display line over **24 characters** wraps on a 320 frame and an authored composition becomes an
  accident. Both statements in the publication were re-broken for this. `decisions.md` §54.
- **`publication.contact.write.address` is `null` until somebody decides one.** The line renders composed
  and inert, exactly as `three.work.url` does in the film. Never invent an address, a price or a reply
  time — `open-decisions.md` §1 and §6 are still open, and the questions are written around both.

## Commands

```
npm run dev        # localhost:3000
npm run typecheck
npm run lint
npm run build
```

## Conventions

- Scroll-driven state is a pure function of scroll position, so reversal and interruption are correct
  by construction rather than by testing. **This one is infrastructure and it still governs.**
- ~~Motion is opacity and one curve. Nothing travels, scales, blurs or reveals letter by letter.~~
  **Superseded — this was V1's vocabulary.** V2 §1 authors **twelve distinct verbs across thirteen
  junctions**, no mechanism used twice for its primary effect, and several of them do travel, expand or
  lift (`src/motion/spine.ts` carries the ledger). Build the verb the junction specifies. What survives
  of the old rule is its restraint: one shared curve, no decoration, and nothing that moves without a
  junction asking it to.
- Comments explain *why*, and record what was measured. The numbers are the argument.
