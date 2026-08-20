# Chapter One — working notes

Digital experiences built for moments worth remembering.

The homepage is **a film and then a publication**, in that order, and the two halves are held to
different rules. Chapters I–III are one continuous shot in two pinned frames, driven by scroll position;
everything after Chapter IV is the studio's own pages in ordinary flow, at reading size, with one timing
in all of it. Neither half is a page of sections. Read the two documents below before implementing
anything; they are not optional context.

## Read first, every time

| Document | Standing |
|---|---|
| `docs/development/01-validation.md` | **Mandatory.** How work is finished. Consult before starting, satisfy before reporting complete. |
| `docs/development/02-motion-system.md` | **Mandatory before touching motion.** Every timing is a per-beat object in `src/motion/story.ts`, relative to the beat before it. Nothing in a component or stylesheet. |
| `docs/brand/01-vision.md` … `05-storyboard.md` | **Locked.** Never modify. Every design decision must be defensible from a line in one of them. |
| `docs/design/decisions.md` | Running log. Add an entry for any decision worth tracing, including the ones that turned out wrong. |
| `docs/brand/open-decisions.md` | Unanswered questions. The typeface is still one of them. |
| `docs/brand/design-system-inputs.md` | Disposable. Nothing in it is a rule. |
| `docs/design/copy-drafts.md` | Removed copy, kept only so it is not lost. Referenced by nothing. |

## Non-negotiables

- **Validation is part of the task.** Typecheck, lint, build where applicable, runtime, regression.
  Four viewports: 1920×1080, 1440×900, ~768, ~390 portrait. Never assume desktop scales. A Chrome window
  on Windows will not go below ~500 wide: drive 390 in a same-origin frame of that size, which evaluates
  media queries against its own viewport. Test the no-scripting version against `next start`, never
  `next dev` — dev injects the stylesheet with JavaScript and reports a failure that is not real.
- **The hero is locked.** `src/app/opening.tsx` and its styles are approved. Changes to it are
  regressions unless a brief says otherwise.
- **Replay the homepage from the first frame** before calling anything complete. Never improve one
  chapter by weakening another.
- **State what was not verified**, and why. iOS Safari cannot be tested from this environment.
- **A technically correct change that weakens the narrative is incomplete.** Report it as incomplete.

## Where things live

- `content/site.ts` — all language, all navigation destinations (`where`), Chapter III's structure, and
  the publication (`site.publication`).
  A destination is a section *name*; `page.tsx` writes the `#` on one side and the `id` on the other, so
  the two cannot drift. **All five destinations now lead somewhere**, and to two different kinds of place:
  `studio` and `work` are positions in the film, `about`, `faq` and `contact` are sections of the
  publication. There is no destination for the method on purpose. `decisions.md` §54. The work is **one**
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
- **Three runways of scroll, numbered separately** — the shot (`shotStory` / `BEATS` / `pin`), Chapter III's
  act (`actStory` / `ACT_BEATS` / `actPin`) and the method (`methodStory` / `METHOD_BEATS` / `methodPin`).
  One driver, one curve, one unit. The first two are joined by scroll position and by `studioEmerges`, which
  opens the first third of the aperture from inside the film. Do not move a number between any of them.
  **A beat of the film costs ~55vh and a beat of the method costs 42** — that gap is the point: the method is
  not a chapter and must not weigh like one. `decisions.md` §55.
- `src/app/opening.tsx` — the hero. Its own clock, accelerated in proportion to how hard the visitor
  scrolls. **The opening is mandatory**: scrolling hurries it and can never skip it, and neither can a
  link — the hero's navigation does not navigate while `data-opening` reads `running`. It publishes
  `data-opening` on the root to say whether it is still running; `scroll-stage.tsx` watches that
  attribute and fixes the shot's origin the instant it flips.
- Chapter III's masthead is the marker the travelling word became, standing in the page's own head
  margin. `.act-stage` begins below it, so the mark is never over a photograph. `decisions.md` §47.
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
- `src/app/experience.tsx` — the room's colour and the object at the centre of Chapter III: a device with
  the studio's real work running inside it, loaded from `site.three.work.url` on the visitor's own press and
  never before. It owns **one** piece of state — whether the visitor has asked — and no timing, no position
  and no beat; the stylesheet places it and the act's beats uncover it. Whether the work consents to being
  framed is `work.embeds`, a **measured header written down** — it cannot be discovered at runtime, and
  `decisions.md` §49 records the two attempts that proved it.
- The room's colour is three gradient fields on long closed transform loops, and that is the whole of the
  atmosphere. **Never sample the work's pixels and never add a per-frame loop for it** — the work is
  cross-origin, so its pixels are unreadable, and the cost is the thing the effect exists without.
  `decisions.md` §51.
- `public/media/hero/video/` — footage. H.264 in a QuickTime container; Chrome plays it only when
  handed the bytes without a `type` hint.
- `src/app/publication.tsx` — **everything after the film**: About, the method, the questions, Contact.
  Ordinary flow and ordinary elements everywhere **except the method**, which is a held frame on its own
  runway. No numeral anywhere in it, and two clocked timings in all of it (`afterTheFilm.about`, About's
  arrival; `afterTheFilm.answer`, a question opening).
  The film ends by everything cinematic ceasing at once rather than by a transition being added — the frame
  stops being pinned, the numerals stop, the scale drops, and the type stops being looked at and starts being
  read. **Nothing announces it**: there is no chapter after III, no closing section, and no sentence handing
  over. Do not give this half a second ground, and do not give any of it a beat except the one section that
  already earns one. `decisions.md` §54 and §55.
- **One grid for the two sections that are type**, and no break in it: a rail of labels on `--mark-x` and a
  column beside it. The questions and Contact use it; they are also the only two sections with a rule.
  **About and the method are the exceptions.** About is a photograph on the left and one narrative on the
  right — no rail, wider than the rest (`--about-w`), because half of it is material — and it arrives on a
  clock: the room, then the mark, then the words, with the photograph the only thing that moves.
  `decisions.md` §54.
- **The method is a held frame, and the only spatial composition on the site.** Four questions surface out of
  a `perspective` space one at a time, each brings three considerations, twelve accumulate at their own
  distances, and `--mgather` collapses every one of them into the point the questions stood on — where the
  answer comes forward. **Four authored numbers per word** (`--wx --wy --wd --wr`) and one arrival; `--wd`
  drives distance, size and ink together, so a word cannot be far away and loud. Everything is in one
  coordinate table in `globals.css`, tuned by eye, with a second table for phones. `decisions.md` §55.
- **Three traps in that section, all silent.** An `opacity` (or `filter`, or `overflow`) on any wrapper
  between the frame and the words flattens the 3D scene and the perspective is gone — so the convergence
  multiplies each word's own opacity instead. A `ch` limit is measured in the *wrapper's* font size, not its
  children's. And a stuck element's rect reports its sticky offset rather than where it came from, so the
  runway is measured from `.method` and never from the stage.
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
  by construction rather than by testing.
- Motion is opacity and one curve. Nothing travels, scales, blurs or reveals letter by letter.
- Comments explain *why*, and record what was measured. The numbers are the argument.
