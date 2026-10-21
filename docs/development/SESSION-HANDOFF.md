# CHAPTER ONE — CURRENT STATE · session handoff — 21 October 2026 (end of day)

## ▶ LATER ON 21 October 2026 · the top could not be reached again on an iPhone — fixed · share image updated · read this first

Self-contained; the section below (`35dd3ac` and before) still stands. One commit on `v3` after it, pushed
to `origin/v3`; **not** merged to `master`, nothing deployed.

### The bug (design owner, iPhone, Safari)

Menu → Contact, a fast scroll back up: the page stopped on Chapter II and no further scrolling up reached
the first screen.

**Cause** — `src/app/scroll-stage.tsx`, the film's origin. It follows the hand back up (`hand < origin →
origin = hand`, the case of somebody who scrolled during the opening) and had no floor. Two inputs put the
hand above the document's top for a few frames: WebKit's rubber-band (a negative `scrollY` while the page
bounces at the top) and the input spring passing its target when a fast scroll stops dead at 0. The origin
then stayed negative for good, so the page at rest at the top was `-origin` into the film and every further
pull up pushed it further. The jump to Contact is only what produces the long, fast flick and the large
bounce; it reproduces with no navigation at all. **B1 and B4 are not involved.**

**Fix** — two lines: `held = Math.max(0, hand)` while the opening runs, and
`origin = Math.max(0, hand); anchor(origin - inset, true)` where the origin follows the hand. Above the top
the shot is at its first frame anyway, so nothing else changes. Validated by the design owner in Safari on
the iPhone, on an isolated copy (`D:\STUDIO-fix-origin`, :3211, since removed); the integrated build was
not re-tested on the iPhone.

### Measured

| | Before | After |
|---|---|---|
| One 120px bounce at the top, simulated as WebKit reports it (Chrome, 390 and 1440) | `--origin` −70 to −89px, top at p 1.16–1.21 | `--origin` 0, p 1 |
| One 300px bounce | −191 to −199px, p 1.43–1.47 | 0, p 1 |
| Fast return from Contact, 150px/frame (spring only) | −0.2 to −0.5px | 0 |
| Xiaomi Mi 11 Lite, Chrome 155, CDP touch (Chrome's own fling, not a finger): start→Contact fast / slow, start→Work fast, INDEX→Contact, interrupted gestures | origin −0.17 / −0.36px in two scenarios, p 1.001 (invisible; Chrome never reports `scrollY` < 0) | 0 in all five, p 1 |
| Scrolled 2600px during the opening, then back up (the rule's own case) | origin 2600 → 1200 | identical |

On Android a drag down at the top is Chrome's pull-to-refresh: the page reloads and the opening plays again.
That is the browser's, not the site's.

Regression on the integrated build (:3000): the 11 viewports (320 … 1920: tagline, one line, no overflow,
narrative 1 → 14 → 1, the hero's links, the footage, 0 console errors), INDEX / rail landings at 7 sizes,
B4 (menu → Questions on touch, first row ~1.40s) and B1 (0 orphan frames, Chromium and WebKit) unchanged;
`six` against the build without the fix within run-to-run noise. `typecheck`, `lint`, `build` pass.

### Share image

`src/app/opengraph-image.alt.txt` (rendered as `og:image:alt` and `twitter:image:alt`) is now
*Chapter One — Your moments, made timeless.*, without the trailing newline the file used to carry into the
tag. `src/app/opengraph-image.jpg` was re-captured the way it was first made (`daa90cf`): the hero from the
site itself at 1200 × 630, the footage at ~7.5s, the scrollbar hidden for the capture only, JPEG 44.8KB
(was 49.3KB) — it showed *Where moments become digital.* Nothing else in the metadata changed.

### Still open

- The integrated build on a physical iPhone (the copy was validated there; the code is identical).
- The 15 October checks on a physical phone: the orphan answer (B1), menu → Questions and a real fast flick
  (B4).
- B2 and B5, untouched. The 768 × 1024 fast scroll in which no row of Questions arrives within 5s,
  unchanged and unexplained.
- ~~`docs/brand/open-decisions.md` §7 and C43 (the third face).~~ Done: §7 records C43 as an answered,
  approved exception (`99aefa6`).

## ▶ 21 October 2026 · the tagline is Tenor Sans, as wide as *Chapter* (C43) · B1 and B4 committed

Self-contained. It supersedes the 20 October section below **for the tagline's typography and for the Git
state**, and it supersedes the 15 October instruction not to commit B1/B4: the design owner asked on
21 October for B1 and B4 to be reviewed and committed if they were correct, and they were.

### Git — on `v3`, pushed to `origin/v3` (not merged to `master`, so **not in production**)

| Commit | What |
|---|---|
| `403bd36` | feat(hero): the tagline in Tenor Sans (C43), the phrase *Your moments, made timeless.*, the 12.5% larger phone title, the 300 / 800ms entry, the phone/tablet composition of 20 October (variant C) |
| `908821f` | fix(questions): B1 — an open answer follows its question out of the list |
| `5ee890e` | fix(scroll): B4 — a menu press is not a hurried hand |
| (this commit) | docs: this section |

Production is still `master` = `e09f09d`. Nothing was deployed. Each commit's tree was built:
`403bd36`'s is the review control (below), `908821f`'s was exported with `git archive` and built,
`5ee890e`'s is what :3000 serves.

### B1 and B4 — the review of 21 October

A control build (`D:\STUDIO-review-ctl`, :3209) was the working tree with **only** B1 and B4 reverted;
:3000 was the working tree with both. Same scripts as on 15 October (copied from that session's
scratchpad), Chrome headless/CDP, plus WebKit for B1.

- **B1** (orphan probe, rows 1/3/6, down and back): with B1 **0** orphan frames and max Δ 0 everywhere;
  without it 5–31 per row — 1920, 1440, 1280, 768, 390, 375 (Chromium) and 1440, 390 (WebKit).
- **B4** (`qnav3`, menu vs scroll, from the Work): first row after a menu press on touch **~1.40s**
  (control 2.3–2.9s) at 390, 375, 320, 768; ordinary scroll unchanged; a fast scroll (synthetic,
  120px / 16ms) still waits ~4.1–4.9s on touch, as the control does — `swift` holds for gestures;
  1440 unchanged (B5's 12ms rows, pre-existing). From Contact on touch the section now arrives whole
  (title, description and rows at ~0ms), as it already did on desktop; the control left the rows
  2.3–2.8s behind a title that was already there.
- **B1 + B4 together** (never run before today): `six` at 320, 360, 375, 768, 1440, 1920 — 49–85 driver
  values differ out of ~6,000 against **61–95 between two runs of the control itself** (noise); 0
  overflow, 0 errors, 0 failed requests, identical document heights. Both-way transitions at 390 and
  1440: 33–48 differ against 29–49 control-vs-control. Reduced motion: **0** values differ, both ways.
  `reach-check` (320, 375, 390, 402): identical. INDEX / rail from the Work to About, Method, Questions
  and Contact at 320, 390, 430 (phone index opens and closes), 768, 1024, 1440, 1920: identical landings,
  all in view, no errors.
- Variant C, reviewed again: the third Work headline breaks over two lines at 390 without touching
  anything (the slot's ghost is the longest *line* on purpose); on desktop it stays one line, unclipped.
  Contact's three phone lines reach full ink within 1.5s of arriving at the end of the page.

### The decision (design owner)

- **The phrase stays** `Your moments, made timeless.` (`site.openingLine`, unchanged; capitals by CSS).
  *Where moments become digital.* is not coming back.
- **The tagline is set in Tenor Sans 400** — the "hybrid" of the comparison rounds below. A departure
  from §5's two families, recorded as `docs/design/v2/implementation-reconciliation.md` **C43**.

### The tagline's final values (`.v2-sub`, `src/app/globals.css`; the font in `src/app/layout.tsx`)

- Face: `--v2-tagline` = `var(--font-tenor)`, falling back to Schibsted's stack. Used by `.v2-sub` only.
  `layout.tsx` loads `Tenor_Sans` (weight 400, Latin; the file the page loads is 10KB) as `--font-tenor`.
- Desktop (≥ 821): `font-size: clamp(0.6875rem, 0.8287vw, 1rem)`;
  `letter-spacing: clamp(0.15em, calc(0.15em + (100vw - 821px) * 0.0026), 0.26em)`; ink
  `rgb(242 236 224 / 0.62)` (was 0.58); `top: --y462 + 0.515 × title + 0.25em` (was + 0.15em).
  The line is as wide as *Chapter* (whose ink is 3.156 × the title's size).
- Phone (≤ 820): `font-size: min(calc(0.2077 * title), 0.6875rem)`; `letter-spacing: 0.15em`;
  `top: --y462 + 0.44 × title + 0.25em`. One line at 0.92 of the title's width.
- Unchanged: text, `uppercase`, weight 400, `line-height: 1.3`, `max-width`, entry (300ms after the
  name, 800ms fade, no fade under reduced motion), the title, everything else.

| Viewport | Size | Tracking | Width | ÷ *Chapter* | ÷ title | Gap to title |
|---|---|---|---|---|---|---|
| 320×700 | 9.63px | 0.15em | 217 | 1.48 | 0.92 | 22.1 |
| 360×800 | 9.86 | 0.15 | 222 | 1.48 | 0.92 | 23.4 |
| 390×844 | 10.02 | 0.15 | 226 | 1.48 | 0.92 | 23.4 |
| 430×932 | 10.25 | 0.15 | 231 | 1.48 | 0.92 | 23.8 |
| 768×1024 | 11 | 0.15 | 248 | 1.34 | 0.84 | 28.0 |
| 820×1180 | 11 | 0.15 | 248 | 1.31 | 0.82 | 28.6 |
| 821×900 | 11 | 0.15 | 248 | 1.31 | 0.82 | 33.2 |
| 1024×768 | 11 | 0.198 | 262 | 1.22 | 0.76 | 36.8 |
| 1280×800 | 11 | 0.258 | 280 | 1.04 | 0.65 | 43.5 |
| 1440×900 | 11.93 | 0.26 | 304 | 1.00 | 0.63 | 49.4 |
| 1920×1080 | 15.91 | 0.26 | 405 | 1.00 | 0.63 | 66.2 |

(Gap = the tagline's cap top below the title's baseline, px.)

### How it was chosen (isolated copies `D:\STUDIO-tagline-A` … `-G`, removed after the integration)

`tar` copies of `D:\STUDIO` without `node_modules`/`.next`/`.git`, a junction to `D:\STUDIO\node_modules`,
`next build --webpack`, one `next start` each, and comparison pages of side-by-side frames:

- Round 1 — A Jost 350, B Tenor Sans 400, C Lato Light 300 (after a 16-face specimen over the footage).
- D — production's exact setting with the new text: Schibsted 400, `1.125 × clamp(10px, 10/1440 vw, 14px)`
  (11.25px at 1440, 15 at 1920, 10 on a phone), 0.34em, ink 0.44, two lines on a phone.
- Round 2 — E (D refined, Schibsted 0.28em, ink 0.52), F (B enlarged, Tenor 0.15em, ink 0.58),
  **G (hybrid, Tenor 0.26em, ink 0.62) — chosen.**
- Rejected, not to be reintroduced without a new decision: A, B, C, D, E, F, and the Schibsted 16px
  setting that was on :3000 earlier on 21 October.

### Tests (21 October, Chrome by CDP against `next start`, the hybrid copy on :3207 and then :3000)

- 320, 360, 390, 430, 768, 820, 821, 1024, 1280, 1440, 1920: the phrase on one line, inside the frame
  and clear of the quick navigation; the title (Cormorant 300, size, ink, place) identical before and after;
  the footage playing; the whole page scrolled down and back, narrative position 1 → 14 monotonic both
  ways, no horizontal overflow; Work / Questions / Contact from the hero each reach their destination;
  0 console errors or warnings, 0 failed requests, the font files 200. :3000 and :3207 gave identical
  numbers at every viewport.
- Entry measured on :3000: the line starts 271–278ms after the name and reaches full ink 653ms later
  (unchanged).
- Legibility over four moments of the footage (warm sun at ~4, 7 and 10s; the dark landscape after the
  loop), 1440 and 390.
- `npm run typecheck`, `npm run lint`, `npm run build`: pass.

### Not verified / open

- iOS Safari and a physical phone (iPhone, Mi 11 Lite) — not tested.
- The no-scripting version was not re-checked (the change is CSS + a font).
- **Pre-existing, not changed:** the tagline steps ~4.6px further from the title between 820 and 821
  (28.6 → 33.2): the phone and desktop `top` formulas (0.44 / 0.515 × title) differ. Size, tracking and
  width do not step.
- `opengraph-image.alt.txt` still carries *Where moments become digital.* (from 20 October; needs the
  owner's word).
- ~~`docs/brand/open-decisions.md` §7 is not updated by C43 (the owner's file).~~ Done later the same
  day, at the owner's request (`99aefa6`).
- B1 and B4 were validated in emulation only: **no physical iPhone, no real finger flick on a phone.**
  The 768×1024 fast scroll in which no row reached 0.05 within 5s (15 October) is unchanged and still
  unexplained — identical with and without B4.
- B5 (desktop: rows before the title by the menu) and B2 (keeping an open answer visible) remain open
  and untouched.

### Next steps

1. On a physical iPhone and the Mi 11 Lite: the tagline (size, one line, entry), the orphan answer
   (open a question, keep scrolling to Contact), menu → Questions, and a fast flick into Questions.
2. The owner decides whether `v3` goes to production (merge to `master`); nothing was deployed.
3. `opengraph-image.alt.txt` (the old line) — needs the owner's word.
4. Resume the page-by-page evaluation.

## ▶ END OF 20 October 2026 · the hero is settled as it stands on :3000 — nothing from the explorations is integrated · read this first

Recorded at the end of 20 October 2026. Self-contained: the decision, what was explored and rejected, the
approved visual state, the real Git state, and what is open. Nothing below was committed.

### The decision (design owner, end of day)

- **Keep exactly the state of the main project, `D:\STUDIO`, as served by `next start` on :3000.** The hero
  keeps its original composition and the tagline **“Your moments, made timeless.”** with the typography,
  size, spacing, position and fade listed under *Approved visual state* below.
- **Integrate nothing from any of today's explorations.** None of them is an approved design decision.
- **No new global visual explorations.** The next session evaluates the site **page by page**. Do not reopen
  the hero's redesign unless the design owner explicitly asks for it.

### Explored today and rejected — do not integrate, do not reintroduce

All of these lived only in isolated copies (`tar` copy without `node_modules`/`.next`/`.git`, a read-only
junction to `D:\STUDIO\node_modules`, `next build --webpack`) and have been deleted.

- **Hero refinement in main** — a Liquid Glass quick navigation, a scroll cue (`hero-cue.tsx`,
  `TIMING.chapterOne.cue`) and an authored phone break of the tagline after the comma. Removed from main the
  same day; only the new tagline text survived, later re-styled (below).
- **Editorial index** (`D:\STUDIO-hero-index`, :3301) — rejected: "a conventional minimal editorial site".
- **Three hero concepts** (`D:\STUDIO-hero-concept-A/B/C`, :3302–3304): A *the title is the index* (a drum
  of destinations hanging from `One`), B *the hour* (the arrival minute kept + a map of the visit), C *the
  montage* (the tagline on its own card, settling on the footage's cut; credits; rack focus). Rejected.
- **Production-vs-local comparison variants** (`D:\STUDIO-cmp-*`, :3301–3306): B the footage entered at
  2.4s via a `#t=2.4` media fragment (the warm sun/silhouette shot first; measured in the file: landscape
  0–2.0s, dissolve 2.0–2.4s, warm 2.4–9.8s, dissolve back 9.8–10.3s), C the tagline in real Cormorant 300
  italic (0.25 / 0.36 of the title, ink 0.62), D `.env-hero { object-position: 32% center }` on desktop so
  `One` stops touching the silhouette, E = B + C + D. **All rejected.** The measurements stay true of the
  material if the question is ever asked again; the variants are not decisions.
- Earlier the same day: a visual audit, three composition variants (`D:\STUDIO-var-*`, of which the mobile
  half of variant C *was* integrated — see below) and a three-typeface exploration (rejected, removed).

### Approved visual state of the hero (as on :3000, confirmed in the code)

- Text: `site.openingLine` = `'Your moments, made timeless.'` (`content/site.ts`). The markup is the
  original single span (`states.tsx` is unchanged from HEAD).
- `.v2-sub` (`src/app/globals.css`): Cormorant Garamond 300 (`--v2-serif`), sentence case
  (`text-transform: none`), `letter-spacing: 0.005em`, `line-height: 1.3`, colour
  `rgb(242 236 224 / 0.58)` (the element's own opacity is the fade's, 0 → 1).
  - Desktop size `clamp(1.5rem, 0.27 × title, 2.125rem)` — 24px at 1024, 25.9 at 1440, 34 at 1920.
  - Phone (≤ 820) size `min(0.41 × title, 1.5rem)` — 19.0 at 320, 19.8 at 390, 20.2 at 430, 24 at 768;
    one line, ~0.95 of the title's width (the line must never be wider than `Chapter One`).
  - Vertical place: `top: --y462 + 0.515 × title` on desktop, `+ 0.44 × title` on a phone.
- Title on a phone **12.5% larger**: the phone branch of `--v2-title-size` is `2.708vw + 37.7px` (was
  `2.407vw + 33.51px`), still crossing §2's `6.667vw` without a step, now at ~952px — 46.4 at 320, 48.3 at
  390, 58.5 at 768; unchanged from 952 up (96 at 1440, 128 at 1920). **`sheet.tsx` restates this curve**
  (`T = 0.02708·W + 37.7`) and must move with it. Widths 821–951 also grow slightly.
- Entry: `TIMING.chapterOne.subtitle` = `afterChapterOne 300`, `fade 800`, `waitsForFootageAt 0.55`
  (was 650 / 1000 / 1.0; measured the line now starts 300–306ms after the name), and
  `navigation.afterSubtitle 1450` (was 1000) so the interface and the end of the opening keep their
  instant (+1757ms after the name against +1743 before). Opacity only, shared `--curve`. Under
  `prefers-reduced-motion` the line has no fade (`.v2-sub { transition: none }`), it simply appears on its
  beat. The `story.ts` timeline comment was updated to 2500 / 3300.
- The rest of the hero is the original: footage, framing (`object-position: center`), the quick
  navigation (Work · Questions · Contact, tracked capitals, no glass), no scroll cue.

### Other pending (uncommitted) work in the same working copy — preserved, not part of the hero decision

- **B1 / B4** (15 October; still awaiting the design owner): `globals.css` `.ask[open] .ask-a` `both` →
  `backwards`; `scroll-stage.tsx` `if (navigated) pace = 0`.
- **Visual audit, variant C — mobile and tablet only (integrated 20 October; desktop ≥ 1024 identical to
  before)**: the Work block at 19% height on a phone with the authored break of *Experiences / beyond
  categories* (`site.ts` `lines`, `work-experiences.tsx` parts); Contact in three authored lines on a phone
  (`site.ts` `askParts`, `publication.tsx` parts); a 10px floor for the label register below 1024;
  `.v2-make-slot` floor 30px; About's text 17px on the narrow frame; touch press areas up to 1023 on a
  coarse pointer; a 768–820 composition for About and Questions.
- The 15, 16 and 19 October notes and this section of this file.

### Git — confirmed at the end of 20 October

- Branch `v3`, HEAD `8be24bc` = `origin/v3`. Production is `master` = `origin/master` = `e09f09d`.
- Working copy, 9 files modified, nothing staged, nothing untracked:
  `content/site.ts`, `docs/development/SESSION-HANDOFF.md`, `src/app/globals.css`,
  `src/app/publication.tsx`, `src/app/scroll-stage.tsx`, `src/app/sheet.tsx`,
  `src/app/work-experiences.tsx`, `src/motion/story.ts`, `src/motion/timing.ts`.
- Validation of the current state: `typecheck`, `lint` and `build` passed after the last code change
  (the final spacing edit was CSS only: lint + build re-run). Chrome (headless, real binary) at 320, 390,
  430, 768, 1024, 1440, 1920: tagline on one line, no horizontal overflow, 0 console errors, 1 → 14 → 1
  monotonic; checked visually in the owner's Chrome on :3000.

### Open / not done

- **Share metadata still says the old line**: `src/app/opengraph-image.alt.txt` is
  `Chapter One — Where moments become digital.` (rendered as `og:image:alt` / `twitter:image:alt`), and the
  share image itself may carry it. Not changed — needs the design owner's word.
- **Not tested on a physical phone** (iPhone or the Mi 11 Lite): the larger phone title, the tagline's size
  and spacing, the 300ms entry.
- Nothing of today is committed. Production is untouched.
- :3000 was restarted several times today from the assistant's session (`npm run start` in `D:\STUDIO`); the
  owner's own WebStorm-terminal `npm run start` was stopped once (it was serving a stale build). After a
  reboot, start it again with `npm run build && npm run start` if the build is not current.

### Next step

Resume the **page-by-page** evaluation of the site. The hero is settled as above; do not reopen its
redesign — no new hero concepts, no Liquid Glass, scroll cue, clock, index, credits or reframing — unless
the design owner explicitly asks.


## ▶ END OF 19 October 2026 · Opening II → Philosophy, the Work's scroll, the Index as three rules · read this first

Recorded at the end of 19 October 2026. This section is self-contained: it says what was committed,
what was deliberately left out, what was tested and how, and what is still open.

### Committed on `v3` (pushed to `origin/v3`; not merged to `master`, so not in production)

- **Opening, II → Philosophy** (`src/app/sheet.tsx`, `SHEET.headsAfterWriting` in `src/motion/sheet.ts`).
  The thesis and `Philosophy` were two position triggers 0.16 viewports apart, and the thesis writes on
  a 0.94s clock, so a hand at rest inside that band left `II` alone with the whole thesis, forward and
  backward. `Philosophy` is now also written 350ms after the thesis begins (position still heads it at
  once if the hand gets there first), on every pointer, and it is placed after the numeral's *current*
  glyphs and tracking rather than its landing place, so it never cramps into `IIPhilosophy` mid-move.
  Measured: time with `II` alone at rest, 1.0–1.6s before, 0ms after, phones and desktops.
- **The Work's scroll** (`LAND.c` in `src/motion/sheet.ts`). On a thumb, a fourth row `[4.2, 8, 0]`:
  the second half of junction 07 (Work whole → state 08, where the phone's Index is drawn) went from
  1.56 to 0.45 viewports at 390 × 844 — the "three micro-scrolls" before the Index. On a wheel the
  rows are now `[4.875, 7, 0.5], [5.365, 8, 0]`: the whole of 07 costs 0.78 of what it did, which
  removed a 0.78× drop in the camera's speed at state 07 and keeps one speed across the hand-over at
  07.5 (1.00× measured at 768, 1440, 1920); Work whole → camera still is 0.56 viewports (was ~1.1).
  Junction 08 → 09, the Work standing before About, is unchanged on both (0.66 vp wheel, 0.9 thumb).
- **The phone's Index is three rules that turn into a ×** — `implementation-reconciliation.md` **C42**,
  which revises C24's visible control and accessible names (C24 kept, marked as revised).
  `src/app/ledger.tsx` (the picture; the control is still the whole head line), `content/site.ts`
  (`opens` "Abrir navegação" / `closes` "Fechar navegação", `lang` pt-PT), `src/app/globals.css` (the
  rules, sized in `.rail-title`'s own em: 1.10 × 0.52em), `TIMING.ledger.icon.turns` 280ms in
  `src/motion/timing.ts`, published as `--index-turns` by `src/motion/transitions.ts`.

### Deliberately NOT committed (still uncommitted in the working copy)

- **B1** (`src/app/globals.css`, `.ask[open] .ask-a` — `both` → `backwards`) and **B4**
  (`src/app/scroll-stage.tsx`, `if (navigated) pace = 0`). Not part of this work, and the 15 October
  notes say they go nowhere without the design owner's approval. They were staged out by hunk; the
  working copy still has them.
- **The 15 and 16 October sections of this file.** They were uncommitted notes from earlier sessions;
  they are still in the working copy, below this section. In short, as they record: production =
  `master` = `e09f09d` (AUD-002/003), domain aliasing and a post-deploy visual pass not confirmed.

### Tested on 19 October, and how

- `npm run typecheck`, `npm run lint`, `npm run build` (Next 16.3.8, Turbopack): pass, no warnings. The
  repository has no automated tests. The committed snapshot (without B1/B4) was also checked on its own.
- **Chrome, CDP emulation**, against `next start`: 320, 360, 390, 414, 430 (touch) and 768, 1440, 1920
  (mouse) — the whole site from the first frame to Contact and back, settled steps with frames, a fast
  continuous pass: 0 console errors, 0 exceptions, 0 failed requests, no horizontal overflow, fonts and
  images loaded, state 14 reached and the reverse pass monotonic. The Work's camera speed, the Index's
  entry and the reverse at all eight widths; the icon's open / close / Escape / keyboard / reduced
  motion at the five phone widths; rail destinations and Tab order at 1440; reduced motion at 390 and
  1440; the no-script page at 390 and 1440.
- **The owner's Mi 11 Lite 5G** (M2101K9G, Android 13, Chrome 155.0.8059.81), over USB: `adb reverse`
  of the phone's `localhost:3000` to the PC's `next start` (removed afterwards), driven through
  `D:\STUDIO-tools\mobile-lag\phone.mjs`. Whole site forward and back, the icon, an Index link to
  Questions, a question opened: no errors. **Touch was CDP-injected, not a finger** (MIUI blocks `adb
  input`). Frame times there (p50 22ms, p95 33–44ms, 20 + 12 frames over 50ms) include the
  instrumentation's own cost and were not compared with the baseline.

### Not tested

A finger on the phone; iOS Safari; Firefox and Mi Browser; a real screen reader; a trackpad. Smoothness
was judged from frame sequences, strips and measured speeds, not from watching continuous motion (the
comparison videos are in the session scratchpad only).

### Known, open, not changed

- **The no-script page** overlaps About's faded type with the Questions rows and shows dark gradient
  bands — identical on production (`e09f09d`), so not from this work. Out of scope until asked.
- Rhythm candidates outside the Work, not changed: Method's composed frame stands still for 1.1–1.8
  viewports; Questions' list for 0.9–1.5; Questions → Contact is a fast exchange (~0.24 viewports) with
  the studio empty for a moment.
- An old `next start` from this repository was found listening on `:3000` (started 11:22 on 19 Oct, not
  by this session) while `.next` was rebuilt several times: restart it before testing against it.

### Next steps, in this order

1. Validate on the phone **by hand** (finger) and on the iPhone: the Work's scroll, the Index rules,
   II → Philosophy.
2. Decide B1/B4 with section C of the 15 October notes (uncommitted; in the working copy of this file).
3. Production only on request: merge `v3` into `master` (no force), then confirm the domain's
   deployment and replay production from the first frame.

## ▶ END OF 16 October 2026 · AUD-002/AUD-003 in production · read this first

Recorded at the end of 16 October 2026 from the git commands and the GitHub deployments API run in that
session. No code was changed, no test was run, and B1/B4 were not touched. **This section supersedes the
*Repository* facts in section A of 15 October below; everything else there (B1–B5, the next steps in C,
servers in D) still stands.**

### Confirmed (observed in git or on the GitHub API)

- **`master` = `origin/master` = `e09f09d`.** Local `master` was fast-forwarded from `dd53786` to
  `v3` (`git fetch . v3:master`, no checkout, no merge commit) and pushed with `git push origin
  master:master` — `dd53786..e09f09d`, no force. Commits published: `c46c121` (AUD-003, *perf(work):
  reduce queue fill writes on dense screens*) and `e09f09d` (AUD-002, *perf(scroll): avoid forced layout
  reads in frame driver*).
- **`v3` = `origin/v3` = `e09f09d`.** `v3` was **not** pushed on 16 Oct — the two AUD commits were already
  on `origin/v3` before the merge (the 15 Oct note *"both AUD commits are local only"* was out of date).
- **`v2` = `origin/v2` = `dd53786`**, unchanged. No branch or worktree was created, moved or removed.
- **Vercel built production for `e09f09d`:** GitHub deployment `7124446416`, environment `Production`,
  created 2026-10-16T16:43:25Z, status **`success`**, deployment URL
  `https://studio-r4qalgj98-flavio15.vercel.app`. (Earlier, `e09f09d` also had a Preview deployment,
  `7103976757`, from the `v3` push on 15 Oct.)
- **The main domain `https://studio-pi-ivory.vercel.app/` answers HTTP 200** (a `curl -I` after the
  deployment reported success). That is all that was checked on it.
- **Uncommitted in `v3`, not in any commit, not in production:** `src/app/globals.css` (B1),
  `src/app/scroll-stage.tsx` (B4), and this file. Nothing staged, no stash.

### Inferred, NOT confirmed

- **Production Branch = `master`.** Not read from Vercel's settings (no Vercel CLI, no `.vercel/`, no `gh`
  on this machine). Inferred from the deployment history: pushes to `v2`/`v3` produce *Preview*, and the
  only *Production* deployments (`8b2802d`, `dd53786`, `e09f09d`) followed pushes to `master`.
- **That the main domain serves `e09f09d`.** A 200 proves the domain is up, not which deployment it is
  aliased to. Not checked in the Vercel dashboard, not compared by content.
- Note, unexplained: the GitHub API reports `production_environment: false` on deployment `7124446416`
  even though its environment is `Production`. Not investigated.

### Not done

- **No post-deploy validation** of production: no visual pass, no replay from the first frame, no
  iPhone/Xiaomi check. AUD-002/003 were validated before the merge (production audit,
  `docs/development/production-audit-2026-10-14.md`); production itself has not been looked at since.
- **B1 and B4 remain unvalidated together** — section B/C of 15 October below is unchanged and is still
  the plan for them.

### Next steps, in this order

1. **Confirm production:** in the Vercel dashboard, check that `studio-pi-ivory.vercel.app` points to the
   deployment of `e09f09d` (and, while there, that the Production Branch is `master`). Then replay
   production from the first frame on desktop and on the iPhone/Xiaomi (memory: audit production
   directly, on the real URL).
2. **Rollback, if production is wrong:** the previous production is `dd53786` (deployment `7068328100`);
   promote it back in Vercel. Older rollback point `8b2802d`. Do not force-push `master`.
3. **Then resume B1/B4** with section C of 15 October below (steps 1–7): confirm the diffs, menu vs scroll
   comparison, regression on B1 + B4, iPhone. No commit, push or deploy of B1/B4 without the design
   owner's approval.
4. When committing locally later, this file's uncommitted changes go in a separate docs commit.

## ▶ END OF 15 October 2026 · Questions: the orphan answer and the menu entry · read this first

Verified against the repository, the processes and the test outputs at ~23:35 on 15 October 2026, not
from conversation memory. Distinguishes **done**, **done but not fully validated**, **pending**,
**deferred** and **awaiting a decision**.

### A · Repository

- **Branch `v3`, HEAD `e09f09d`** (*perf(scroll): avoid forced layout reads in frame driver (AUD-002)*),
  on top of `c46c121` (AUD-003) and `dd53786` (= production = `master` = `v2`). Both AUD commits are
  local only. *(Superseded 16 Oct: both are on `origin/v3` and `origin/master`, and in production — see above.)*
- **Uncommitted (working tree), nothing staged, no stash:**
  - `src/app/globals.css` — the orphan-answer fix (B1), modified 22:09.
  - `src/app/scroll-stage.tsx` — the menu-entry driver fix (B4), modified 23:13.
  - `docs/development/SESSION-HANDOFF.md` — this file (the two Questions bullets under *END OF 14 October*
    were also added today and are uncommitted).
- **No commit, push, merge or deploy was made for any of today's Questions work.** Production is still
  `dd53786`; rollback point still `8b2802d`.
- **Worktrees** (`git worktree list`, unchanged by today's work): `D:\STUDIO` (`v3`), the comparison build
  `D:\STUDIO-v3-control-e09` (detached at `e09f09d`, its own `node_modules`, built 15 Oct 15:03 — has
  **neither** of today's fixes), `D:\STUDIO-v3-control` (`dd53786`), and the older diagnostic worktrees
  (`STUDIO-ios-*` at `8b2802d`, `STUDIO-menu` / `STUDIO-nav` at `b6fc788`, `STUDIO-next-upgrade`,
  `STUDIO-tools/mobile-lag/wt-*`). Do not remove any of them.
- **Servers running at the end of the day** (`next start -H 0.0.0.0`, checked with
  `Get-NetTCPConnection`):
  - `http://192.168.1.241:3000` — `D:\STUDIO` working tree. Build `.next/BUILD_ID` at **23:14:32**, after
    both edits (globals.css 22:09, scroll-stage.tsx 23:13), so it serves **B1 + B4 together** — not only
    the orphan fix.
  - `http://192.168.1.241:3001` — `D:\STUDIO-v3-control-e09`, `e09f09d`, **without** B1 and B4: the
    comparison version.

### B · Work and decisions of 15 October

**B1 · Questions — the orphan answer. DONE (approved, implemented, desktop/emulation validated); iPhone
NOT yet validated.**
- **Symptom:** an opened answer stayed alone at full ink after its question and the rest of the list had
  been released on the way to Contact.
- **Cause:** `.ask[open] .ask-a { animation: answer … both }`. The forwards fill held the answer at the
  keyframe's `to { opacity: var(--q) }` — the arrival value — so it ignored `--rel` and `--qf` for the
  rest of the section's life.
- **Fix:** `both` → `backwards` (`src/app/globals.css`, `.ask[open] .ask-a`, with the reasoning in a
  comment; the keyframe comment updated). After the 180ms the answer is back on its own `.ask-a` rule.
- **Tests run (scripts in the 15 Oct session scratchpad,
  `C:\Users\35191\AppData\Local\Temp\claude\D--STUDIO\2f9dbf4c-fb1e-44aa-bd2c-02d03da582cb\scratchpad\`):**
  - Orphan probe (`qfix.mjs` / `qopen.mjs`), rows 1, 3, 6: **before** orphan frames 5–31 per row in every
    viewport (1920×1080, 1440×900, 1280×720, 768×1024, 390×844, 375×667; Chromium) and in WebKit
    (1440×900, 390×844); **after** 0 orphan frames, max Δ 0, everywhere. Results:
    `qfix-{before,after}-{chromium,webkit}.json`. Re-run after B4 at 23:33 (1920, 1440, 1280, 768, 390):
    still 0.
  - `six` (320×640 … 1920×1080): overflow 0, problems 0, failed 0, before and after. `six-diff`
    before/after differs in 39–67 values per viewport, the same order as before/before2 (27–64) — i.e.
    run-to-run noise, method-word values. Captures: `D:\STUDIO-tools\ios-1013\out\six-qa-{before,after,before2}-*`.
  - `reach-check` 320×640, 375×667, 390×844, 402×754: :3000 identical to :3001.
  - Both-way transitions (`trans-rm{a,b}.json`, 390×844 and 1440×900): problems 0.
  - Reduced motion, 390×844 and 1440×900, down and up: 0 values differ.
  - **These regression runs were made at 22:26–22:44, i.e. on B1 alone, before B4 existed.**
- **Still needed:** visual check on the real iPhone (iOS Safari cannot be tested from here).

**B2 · Keeping an open answer fully visible while it is read. DEFERRED by the design owner — do NOT
implement.** Diagnosis and measurements are in the *Backlog* bullet under *END OF 14 October* below.
Reason for not proceeding: on desktop/tablet the only acceptable future study is a minimal adjustment of
the list's **internal** scroll (`.asked`); on a phone any fix must scroll the page, which *is* the
timeline — it would touch the scroll engine and the mobile composition. Do not resume without a new
approval.

**B3 · Questions by the menu on a phone — diagnosis.** An in-page link (the rail's *Questions*) moves the
page thousands of pixels in one frame; the driver's `pace` read it as a full-speed thumb, so on touch
(`thumb.matches && !calm.matches`) every window widened to `swift` and the rows waited for
`rowsAfterLock` 1.25 below a landing priced at 0.7. Measured at 390×844: first row **2.9s** after the
press, against ~0.8s arriving by ordinary scroll.

**B4 · The driver fix. AUTHORISED (minimal change) and IMPLEMENTED in the working tree; partially
validated; NOT committed.** `src/app/scroll-stage.tsx`, in the `pace` block (~line 1016):
`if (navigated) pace = 0` — while `navigated` (the press, until the page has arrived, the same flag that
`noFasterThan` and the spring already use) `pace` is neutralised; real gestures still reach `swift`.
- **Evidence so far** (`qnav3.mjs`, output in the 15 Oct session's `tasks\bk3f9yer9.output`; BEFORE = a
  build without B4, AFTER = :3000 with B4; the origin is a script argument and was not printed, so the
  BEFORE port is not recorded):
  | | 390×844 | 375×667 | 320×640 | 768×1024 | 1440×900 |
  |---|---|---|---|---|---|
  | menu from Work, first row — before | 2629ms | 2655 | 2484 | 2910 | 12 |
  | menu from Work, first row — after | **1400** | **1400** | **1401** | **1401** | 12 |
  | ordinary scroll, first row (after) | 777 | 965 | 883 | 666 | 470 |
  | fast scroll, first row — before / after | 4541 / 4775 | 4737 / 4670 | 4599 / 4820 | none / none | 508 / 493 |
  - Menu → Questions on touch: rows now follow the title (~1.30s) and description (~1.54s) at ~1.40s
    instead of ~2.6–2.9s. Fast scroll still waits ~4.6–4.8s on touch → **`swift` preserved for gestures.**
  - Menu from Contact (touch): before, title/description at once and rows at ~2.6–2.9s; after, everything
    at once (~1–3ms). Desktop unchanged. Worth a look on the phone — it is a consequence of the fix, not a
    separate change.
  - 768×1024 fast scroll: no row reached 0.05 within the 5s window, **before and after alike** — not
    caused by B4; unexplained, note only.
  - The "fast scroll" here is a **synthetic** Playwright scroll, not a real finger.
  - `next build` completed for :3000 (BUILD_ID 23:14:32) and B1's orphan probe was re-run on that build
    (still 0).
- **NOT yet run on B1 + B4:** standalone `typecheck` and `lint`, `six` / `six-diff`, `reach-check`, both-way
  transitions, reduced motion, the exit to Contact, a real fast flick on a phone, the iPhone. Do not mark
  B4 approved until these exist.

**B5 · Desktop — the rows arrive before the title by the menu. OPEN, OUT OF SCOPE, awaiting the design
owner's decision.** At 1440×900 the six rows are at full ink ~12ms after the press while the title and
description play their own ~1.3–1.5s clock (confirmed again by `qnav3`, before and after B4 — B4 does
not touch it). Cause and measurement: the *Open, separate problem* bullet under *END OF 14 October*
below. Not changed.

### C · Next steps, in this order

1. **Confirm the driver's state:** `git diff -- src/app/scroll-stage.tsx` must show exactly the one
   `if (navigated) pace = 0` block with its comment (it did at 23:35, 15 Oct). It is already implemented —
   do not re-implement or extend it.
2. **Menu vs scroll comparison** with `qnav3.mjs` (`node qnav3.mjs <origin> <LABEL>`, env `VIEWS`,
   `MODES=menu,scroll`, `START=work|bottom`) on :3001 vs :3000 at 390×844, 375×667, 320×640, 768×1024,
   1440×900, from the Work and from Contact; plus a **real** fast flick on the Xiaomi/iPhone to confirm
   `swift` still holds for gestures.
3. **Regression on B1 + B4:** exit to Contact, the orphan probe, `six` + `six-diff`, `reach-check`,
   reduced motion, both-way transitions, `npm run typecheck`, `npm run lint`, `npm run build`.
4. Restart the test server if needed (section D) and **validate on the real iPhone**: the orphan answer
   (open a question, keep scrolling to Contact), menu → Questions, and a fast flick into Questions.
5. **Later, the design owner decides** whether B5 (desktop entry order) is worth investigating.
6. **Do not resume B2** (open-answer visibility) without a new approval.
7. Only after the design owner has seen the evidence: a local commit on `v3` (B1 and B4 as separate
   commits). No push, merge or deploy unless asked.

### D · Servers and resuming

- **Assume nothing is running after a reboot.** Check:
  `Get-NetTCPConnection -State Listen -LocalPort 3000,3001` and, for each `OwningProcess`,
  `Get-CimInstance Win32_Process -Filter "ProcessId=<pid>" | Select CommandLine` — the command line shows
  which directory is being served.
- **Is the build current?** Compare `D:\STUDIO\.next\BUILD_ID`'s time with
  `git diff --stat` / the mtime of `src/app/globals.css` and `src/app/scroll-stage.tsx`. If the build is
  newer than every source change (true at the end of 15 Oct: 23:14:32 vs 23:13:48), **do not rebuild** —
  just start it. If any source is newer, run `npm run build` first; `next start` serves whatever `.next`
  holds and will otherwise serve stale code.
- **Start** (from each directory, in the background): `D:\STUDIO` → `npx next start -H 0.0.0.0 -p 3000`;
  `D:\STUDIO-v3-control-e09` → `npx next start -H 0.0.0.0 -p 3001` (its build is from 15 Oct 15:03 at
  `e09f09d`, no rebuild needed). Then `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` →
  200. Never use `next dev` for these comparisons.
- **The iPhone and the PC must be on the same local network.** At the end of 15 Oct the PC was
  `192.168.1.241` on Ethernet (network `NOS-24B4-5`, Private profile). DHCP can change it (it was
  `.228` / `.233` on 14 Oct): confirm with `Get-NetIPAddress -AddressFamily IPv4` before giving the phone a
  URL.
- **Evidence of the day** (do not delete): the session scratchpad above (`qprobe`, `qdebug*`, `qshots/`,
  `qoverflow`, `qfix*`, `qopen`, `qvis`, `qnav`, `qnav2`, `qnav3`, `trans-rm*`, and `tasks\*.output`), and
  `D:\STUDIO-tools\ios-1013\out\six-{aud002,fh,qa}-*`. Because the scratchpad lives in `%TEMP%`, the
  whole of it (`scratchpad\` and `tasks\`) was **copied** on 15 Oct 23:40 to
  **`D:\STUDIO-tools\questions-1015\`** — use that copy; the original was left in place. `qnav3.mjs` needs
  `D:\STUDIO-tools\browser-automation` (Playwright) as before.

---

## ▶ END OF 14 October 2026 · production promoted, production audit, branch `v3`

- **Production = `master` = `origin/master` = `v2` = `origin/v2` = `dd53786`** (Vercel deployment
  `7068328100`, success, live at `https://studio-pi-ivory.vercel.app/`). `v2` was fast-forwarded into
  `master` from `8b2802d`, which stays the rollback point. The sections below were written before the
  promotion: where they say production is `8b2802d`, read `dd53786`.
- **Production audit:** `docs/development/production-audit-2026-10-14.md` — AUD-001 … AUD-009, measured
  on the public domain (Xiaomi real, Chrome and WebKit desktop, emulated networks), with the backlog and
  what stays frozen.
- **`v3`** is a new local branch created from `dd53786` for measured performance work, one finding at a
  time in this order: AUD-003 → AUD-002 → AUD-001 (property by property). `master` and `v2` are not
  touched by it. Nothing of `v3` is committed or pushed until the design owner has seen each step's
  measurements.
- **Backlog · Questions — keep the open question fully visible while it is read. Deliberately deferred
  (design owner, 15 October 2026): do not implement now.** On short frames an opened answer can be
  partly cut. Measured: on the desktop and tablet the list scrolls inside its own box with no scrollbar
  (`.asked`, `max-height` + `overflow-y: auto`), so rows 5–6 lose 10–65px at 1440 × 900, 1366 × 768,
  1280 × 720, 1024 × 768 and 768 × 1024; on a phone it is the viewport (375 × 812: 16px; 375 × 667: up to
  93px; 320 × 640: up to 171px), and the iPhone with Safari's bar showing is suspected but not measured
  (`--asked-top` is priced on `100lvh`). Future study for desktop/tablet: a minimal adjustment of the
  list's **internal** scroll only, never the page. On a phone any fix has to scroll the page, which is the
  timeline — it would touch the scroll engine and the choreography.
- **Open, separate problem · Questions by the menu on the desktop: the rows arrive before the title.**
  Measured at 1440 × 900 (15 October 2026): after the rail's *Questions* the six rows are at full ink in
  the first frame, while the anchor's title and description still play their own ~1.3–1.5s clock — the
  order is rows, title, description instead of title, description, rows. Cause: a press lands the rows
  (`navigated` forgets their latches, `scroll-stage.tsx`, navigation QA of 27 September) and off a thumb
  nothing makes them wait for the description. Recorded only; not changed.
- **15 Oct 2026 — AUD-002 approved and committed locally on `v3`; not pushed, not deployed.** The frame
  driver (`scroll-stage.tsx`, `read()`) now reads `window.innerHeight` once, before it writes anything,
  and reuses it in the five reads that came after writes — on Android each of those forced a style
  recalculation of `.publication` / `#method`. Measured on the real Xiaomi, control vs candidate, both
  directions at 400 / 1200 / 4000 px/s: those forced recalculations go to 0; style per frame lower in all
  12 cases (−7 % to −27 %), fps higher in all (Questions ↑ +9 %, style −20 %). Tests (typecheck, lint,
  build, `timeline.ts` assertions in dev, `six`, `reach-check`, both-way transitions) and the visual
  review (Xiaomi, 1440, 390) equal to the control. A `--junction-at` anomaly seen once at 1440 did not
  reproduce; its cause is not proven. **Still pending:** the visual review was sampled, gestures were
  synthetic, iPhone / iOS Safari not tested. The 14 Oct asymmetry (68–74 ms/frame up) did not reproduce.
  Details: the audit document's AUD-002 section. AUD-001 has not started.
- **15 Oct 2026 — AUD-003 approved (with `devicePixelRatio >= 2`) and committed locally on `v3`; not
  pushed, not deployed.** Measured on the real Xiaomi (DPR 2.75), control vs variant, 2 alternated runs
  each: **−68 % style recalculations, −27.4 % main thread, −73.6 % queue writes** at rest; exchanges,
  fill timing, taps, Enter and reduced motion equivalent to the control, 0 errors. **Still pending:** a
  visual check of the fill edge by eye on the Xiaomi, and the iPhone / iOS Safari. Details: the audit
  document's AUD-003 section. AUD-002 has not started.
- **AUD-003 (as of 14 Oct) — implemented, validated on desktop, NOT approved and NOT committed.** The queue's fill is
  written only when its edge moves a whole device pixel, and only where `devicePixelRatio >= 2` (design
  owner's decision; DPR 1 keeps the original every-change writes). Validated against the control build:
  typecheck, lint, build, `timeline.ts` assertions; Work at rest (DPR 1 identical to the original, DPR 2
  −85 % recalculations / −47 % main thread in emulation); edge motion captures at DPR 1 and 2.75; word
  presses, keyboard, exchange, reduced motion; `six`, navigation, menu focus, iOS branch, Questions,
  Contact — all equal to the control. Measurements, visual comparison and limitations: the audit
  document's AUD-003 section.
- **Not validated in this variant:** the Xiaomi (locked during the session — the first variant's −67 %
  recalculations / −25 % main thread there carries over only by construction) and the iPhone.
- **Next step (design owner's decision):** either approve and make a local commit on `v3`, or first measure
  on the Xiaomi unlocked (`work-rest.mjs phone 3301` vs `3302`). No push of `v3` was asked for.
- **AUD-002 has not started.**
- **Working state at the end of 14 Oct:** branch `v3` at `dd53786` with three uncommitted changes —
  `src/app/work-experiences.tsx` (modified), `docs/development/SESSION-HANDOFF.md` (modified),
  `docs/development/production-audit-2026-10-14.md` (new, untracked). The control build for comparisons is
  `D:\STUDIO-v3-control` (detached at `dd53786`, its own `node_modules`, built). The measurement scripts are
  outside the repo, in the session scratchpad (`v3/`, `prod/`); the tools they use are in `D:\STUDIO-tools`.

## ▶ LATER ON 14 October 2026 · Next.js 16.3.8 (`1210f07`)

**Git.** `v2` = `origin/v2` = `1210f07` *fix: update Next.js to 16.3.8*, three commits ahead of
`master` = `origin/master` = production (`8b2802d`): `b6fc788`, `fbb4a5d` and `1210f07`. **Nothing has
been merged to `master` or deployed.** The section below this one describes the first two and still
stands in full — every frozen decision in it is unchanged.

**Why.** A read-only audit of `fbb4a5d` found `next@16.2.12` affected by published advisories, one of
them critical. 16.3.8 is the first release that fixes all of them (GHSA-p293-qw3h-jr36,
GHSA-2xp9-vwfh-vxw4, GHSA-vcvr-r3jv-pc5j, GHSA-cjq9-62q9-8jv4, GHSA-4jqv-mc3x-m676, GHSA-mcj8-r9mp-w47p,
GHSA-f87g-xv8r-7p7x, GHSA-39w2-rjm5-chcv) and brings postcss 8.5.23 and sharp 0.35.5; 16.4.0 was a
week-old feature release with nothing more to fix. Real exposure in production was low — the site is
static on Vercel and uses neither `next/image` nor `next/og` — but `next dev` and `next start` on this
Windows machine were exposed, and the transitive packages were behind.

**What changed — three files, nothing in `src/`, `content/` or the stylesheet:**

| File | Change |
|---|---|
| `package.json` | `next` and `eslint-config-next` 16.2.12 → 16.3.8, exact pins kept |
| `package-lock.json` | only the Next tree (`next`, `@next/*`, `sharp` and `@img/*`, `postcss`, `@swc/helpers`, `nanoid`, `source-map-js`) and `fastq` |
| `next.config.ts` | `agentRules: false` — from 16.3, `next dev` writes an agent-rules block into `CLAUDE.md` whenever it runs under an AI agent and restores it on every start; the option is documented and only disables that write (verified: `next dev` in this copy leaves `CLAUDE.md` untouched) |

**How it was validated.** In an isolated worktree first (`D:\STUDIO-next-upgrade`, its own
`node_modules`), then again on `D:\STUDIO` before the commit, each time against the `fbb4a5d` build
served beside it:

- typecheck, lint, build; `timeline.ts`'s assertions in `next dev` — pass;
- the served CSS and the motion style are byte-identical to `fbb4a5d`'s; the visible HTML is the same;
- 320 / 360 / 375 / 390 / 768 / 1440 / 1920 in Chrome: 0 console errors, 0 failed requests, 0 overflow,
  states 1 → 14 → 1, the same document heights and the same landing positions as the baseline;
- `six`: the differences against the baseline (55–81 values a viewport) lie inside the baseline's own
  run-to-run noise (55–79) and are the same clock-driven properties;
- in-page navigation (Chrome and WebKit, phone and desktop): one document load, same landings;
  menu focus, the Index glass, Questions' reach (92 / 14 / 0 / 0), Contact by mouse / keyboard / touch /
  hybrid (0 fields different), the iOS branch (0 writes to `currentTime`), the Opening's beats — equal
  to the baseline;
- **Xiaomi Mi 11 Lite, on the isolated copy:** Chrome 155 by synthetic touch (full walk, menu, Contact
  including leaving Chrome and coming back — footage always running); Firefox 157 and Mi Browser 14.65
  by the self-running script (`element.click()`, not a finger);
- **iPhone, Safari, on the isolated copy: the design owner by hand — satisfactory.**

**`npm audit`.** `--omit=dev`: 5 (1 critical, 4 high) → **0**. Full tree: 12 → 7 high, all in the ESLint
toolchain (`brace-expansion`, `braces`, `js-yaml` through `eslint` and `eslint-config-next`) —
development only, never shipped, deliberately not touched.

**Vercel.** A push to `v2` does build a preview. For `1210f07`: GitHub deployment `7067890044`,
environment *Preview*, status **success** (14 October, 14:17 UTC),
`https://studio-b2pzbc5go-flavio15.vercel.app`. The preview sits behind Vercel Authentication: from
this machine it redirects to `vercel.com/login`, so what it serves was not inspected here — open it
signed in. (`fbb4a5d`'s own Vercel status still reads *pending* on GitHub; `b6fc788`'s is *success*.)

**Known, unchanged, not in this round's scope:**

- **Mi Browser — pre-existing, not a priority.** It intermittently refuses the hero's `play()` with
  `NotAllowedError: play() can only be initiated by a user gesture`: 1 run in 7 on 14 October (and once
  in five on the earlier builds), no trigger found — same origin, new origin, cold and warm starts all
  played. The refused run reported a duration of 12.121 s against 12.145 s in every run that played.
  The video's behaviour was not changed for it.
- **WebKit desktop:** after a mouse *click* on Contact's sentence the footage sometimes does not
  advance for 0.6 s once released — already in the 13 October measurements, the same before and after
  the update. Not checked on a Mac.
- **The old worktrees share packages.** `STUDIO-ios-*`, `STUDIO-menu` and `STUDIO-nav` have
  `node_modules` joined to `D:\STUDIO\node_modules`, so they now run Next 16.3.8 against a
  `package.json` that says 16.2.12; serving one of their old builds may need its own `npm ci`.
  `D:\STUDIO-next-upgrade` has its own `node_modules` and is kept as it is.
- **On Windows, stopping `npx next start` leaves the `next` child on its port** — and that child holds
  the SWC binary, so a later `npm ci` fails with `EPERM`. Start servers as
  `node node_modules/next/dist/bin/next start -p <port>`.

**Before `v2` can be promoted — only when the design owner asks:**

1. open the `1210f07` preview signed in and pass it once by hand (iPhone, Android, desktop);
2. merge `v2` into `master` (fast-forward from `8b2802d`) and let Vercel build production;
3. replay production from the first frame on the iPhone and the Xiaomi, and confirm Vercel's status;
4. keep `8b2802d` named as the rollback.

## ▶ WHERE WE ARE — 14 October 2026 · the round of phone fixes

**The site is live and this branch is ahead of it.** Production is `master` at `8b2802d` (Vercel).
`v2` carries three commits production does not have: `b6fc788` (13 October), `fbb4a5d` (the one this
section was written with) and `1210f07` (the Next.js update, above). **Nothing has been merged to
`master` or deployed since `8b2802d`** — that is the design owner's decision to take, not a step that is
owed.

**What the first two commits are.** A round of defects found on real phones after the launch, each fixed in
an isolated copy, validated by the design owner on the device, and only then consolidated:

| Area | What changed | Register |
|---|---|---|
| Rail on iOS | the running chapter no longer shifts on Work → About; the title's ink is no longer cut by WebKit's mask (the *k* of *Work*) | comments in `globals.css` |
| Safari's bar | fixed frames hang from the top on iOS; no black band while the bar retracts | comments in `globals.css` |
| Opening on iOS | nothing writes the footage's `currentTime` there; the subtitle's gate reads presented frames and play time as well as the clock | C37 |
| Opening, light | state 01 at .15 of the grade instead of .50 (`--os-first`) — the owner's choice of four | C38 |
| Questions on a thumb | runway redistributed (page length unchanged); order title → description → list; staged entry and exit that widen with the hand | `TIMING.questions.thumb` |
| Contact | on any device with a coarse pointer the sentence never re-rates or pauses the footage; mouse and keyboard on a desktop unchanged | C37 |
| Rail, focus | no box; a rule under the word, drawn only while the keyboard is in use (`data-keyed`) | C39 |
| In-page links | answered by the page (`scrollIntoView`), not by fragment navigation — Safari iOS was reloading the document | C40 |
| Index glass | no refraction in Gecko, so Firefox draws the pane | C41 |

**Frozen by the design owner in this round — do not change without being asked** (the items frozen on
1–2 October, listed further down, all still stand):

- **In-page navigation does not use native anchors (C40).** The address does not name the section and
  Back does not walk the sections; both were accepted. Restoring `href` navigation brings the iOS
  reload back.
- **Contact on touch (C37).** The sentence does not control the footage on phones, tablets or
  touch-screen laptops. Hover and keyboard on a pointer-only desktop are as C36 left them.
- **Nothing seeks the footage on iOS (C37).** Not the opening's first-frame nudge and not Contact's
  arrival cue. On that engine an unfinished seek leaves the element seeking for good.
- **`--os-first: 0.15` (C38).** The scrim is untouched; from state 02 the exposure column is §2's.
- **Questions on a thumb** as shipped in `b6fc788`: distances, order, `thumb.opens`, `swift`.
- **The rail's box-based fixes** (`.rail-folio` min-width, `--rail-rise`) and the iOS top-hung frames.
- **The rail's focus indicator (C39)** and the Gecko exclusion for the refraction (C41).

**Validated, and by whom.** Do not restate the owner's validation as a test run from a workstation.

| Where | What | By |
|---|---|---|
| iPhone, Safari 27 (402 × 874) | menu clipping, black band, opening, Questions, footage running in Contact, menu navigation without reload, glass, focus lines gone | design owner, by hand |
| Mi 11 Lite, Chrome 155 | menu navigation, full scroll, Contact touches, no overflow or console errors | synthetic touch through DevTools, and the design owner by hand |
| Mi 11 Lite, Firefox 157 | glass (photographed), menu navigation by a self-running script (`element.click()`, not a finger) | script here; design owner by hand |
| Mi 11 Lite, Mi Browser 14.65 | menu navigation by the same script, five runs | script here |
| Chrome 154 and WebKit 26.6, desktop | six viewports, Contact by mouse / keyboard / touch / hybrid, menu by mouse and keyboard, focus indicator | automated here |

**Known limitations and open items — none needs code now:**

- **Mi Browser, once in five runs:** the footage stayed paused for the whole run and the Opening and
  Contact stood on black. Not reproduced in four further runs, warm or cold, on this build or on
  production's. Cause unknown; not attributable to this round.
- **Opening on iOS, first half second (C38):** the footage has no frame until about 0.1s after it is
  played. Imitated in Chrome it is a single step of 8–14 levels in the sky; at `.15` it was not
  measured. The owner has not reported seeing it. A fix exists in outline (prime the first frame with
  play-then-pause instead of a seek) and touches the iOS start the owner validated — only on request.
- **A second tap about 0.35s after choosing a destination** goes to the page under the finger, the
  menu having closed; while it closes the Index still accepts a tap on another word. Observed, left.
- **Questions → Contact and back at speed** are dominated by Contact's own light step and its
  all-at-once release — Contact's approved design, not touched.
- **Desktop still has the old order in Questions**; the new order is the thumb's only.
- **Safari on a Mac in a narrow window:** whether it draws the refraction was not checked (C41).
- **Not installed on the test phone:** Edge, Samsung Internet. **iPad:** never tested.
- ~~**Vercel:** whether a push to `v2` builds a preview was not checked.~~ It does — see the Next.js
  section above.

**How the work was done, and should be done again.** One isolated git worktree per fix under `D:\`
(`STUDIO-ios-v3` … `STUDIO-ios-v9`, `STUDIO-menu`, `STUDIO-nav`), served on a port of its own for the
owner's phone, integrated only after the owner's word. The copies, the recordings and the tools are
kept on that machine and are not part of the repository:

- tools and evidence: `D:\STUDIO-tools\ios-1013\` (its `README.md` is the index; `out\` holds the
  owner's recordings as frames, device tapes, photographs and every patch);
- the running log of the whole round, in Portuguese: `D:\STUDIO-tools\mobile-lag\out\SESSION-STATE.md`.

A worktree needs `node_modules` joined to the main copy's and `npx next build --webpack` (Turbopack
refuses the junction) — or its own `npm ci`, which lets Turbopack build (`D:\STUDIO-next-upgrade`). The
owner's phone reaches the machine at `192.168.1.228` (`192.168.1.233` later on 14 October — check
`ipconfig`); **every port other
than 3000 was temporary and has been shut down** — start one again when a copy needs showing.
`http://localhost:3000` is the main copy's dev server. Production is the Vercel deployment of `master`.

**Next, only if the design owner asks:** merge `v2` into `master` and deploy; the iOS first-frame step;
the aesthetic exploration of the Opening parked on 2 October.

## Git — 14 October 2026

`v2` = `origin/v2` = `1210f07`, three commits ahead of `master` = `origin/master` = production
(`8b2802d`): `b6fc788` *fix: consolidate approved mobile, video and opening refinements*, `fbb4a5d`
*fix: finalize mobile navigation and browser compatibility* (C39–C41 and the *phone fixes* section),
and `1210f07` *fix: update Next.js to 16.3.8*.

---

# Previous handoff — 1 October 2026, updated end of 2 October 2026

## ▶ WHERE WE ARE — end of 2 October 2026 · read this first

**State.** Every correction and validation item that was open is closed or explicitly parked. Nothing is
half-done in the working tree. The next phase — **only when the design owner asks for it** — is a separate
*aesthetic exploration* of the Opening (including whether `CHAPTER → Chapter II` can be made more
elegant). No aesthetic work has started.

**Frozen — do not change behaviour, values or timings without the design owner reopening it** (details
under *KEEP / FROZEN* below and in `docs/design/v2/implementation-reconciliation.md`):

- the Opening as approved on 30 September — One Sun B2, the quick menu, the tagline, *I of III* removed;
- zone 05, the occasions played (**C28**); 04 → 05, the thesis leaves on a clock (**C29**, `leaveAt` 0.50);
  03 → 04, the thesis arrives on a clock (**C30**, `arriveAt` 0.68); 01 → 02, `Chapter` changes face in
  one frame (**C31-A**; C31-B tested and rejected; no C31-C);
- the mobile reading grid phase 1 and the Method's closing group; Questions B, D-gate, rest height and
  hysteresis (**C27**); Method → Questions (C25); Questions → Contact (C26 / S1);
- the keyboard fixes during the opening (link activation cancelled, quick menu `tabIndex={-1}`,
  `.publication` `inert` while it runs);
- the pointer-change fix (`matchMedia('(pointer: coarse)')` → `onResize`);
- the rail between 768 and 900px — head and index on one line, the running chapter named only in the
  head (variant B).

**Open — nothing that needs code now:**

- iOS Safari / WebKit and a physical touch device: **INCONCLUSIVE**, never validated here. Chrome's
  emulation is not a Safari result. Validate on a real iPhone and iPad when one is available; do not
  report it as validated otherwise. Risks worth watching there (hypotheses, not findings): a pointer change
  on an iPad with a trackpad (now handled by the pointer fix, unproven on iOS), `mask-clip: no-clip` on
  the rail, inertial scrolling against the driver's spring, `inert` and `overflow-x: clip` (iOS ≥ 16).
- Housekeeping that needs a yes: `D:\STUDIO-buildcheck` still exists (irreversible delete, not done).
- Deferred for the aesthetic phase: Venice → Work's static frame; the end of the page after Contact;
  Contact's listening pause possibly on the landscape. Debt deferred on purpose: thresholds of One Sun,
  C9, C30, C31 in `globals.css` rather than `timing.ts`; inert `.v2-of` / `.v2-ember` rules.

**Do not:** reopen any frozen item above without new evidence and the owner's request; re-tune C28–C31;
make Questions B scroll-pure; reintroduce a cross-fade or a clock on the `Chapter` exchange; bring back
the second `NN ·` in the 768–900 rail; treat Chrome emulation as an iOS result; run four heavy Chromes at
once (≈22GB measured — two at a time is the safe maximum on this machine).

**Next step:** wait for the design owner. If they open the aesthetic phase, start with a read-only audit
and previews in an isolated copy (as C31 did: `:3000` untouched, previews on `:3001+`), never in the main
project, and promote only what they approve.

**Git:** last commit `ce463dd`; nothing staged, committed or pushed. Working tree: 13 modified files —
`content/site.ts`, `docs/design/v2/implementation-reconciliation.md`, `docs/development/SESSION-HANDOFF.md`,
`src/app/globals.css`, `src/app/opening.tsx`, `src/app/page.tsx`, `src/app/scroll-stage.tsx`,
`src/app/states.tsx`, `src/motion/scroll.ts`, `src/motion/story.ts`, `src/motion/timeline.ts`,
`src/motion/timing.ts`, `src/motion/transitions.ts` (earlier sessions' uncommitted work plus this
session's C29–C31, the keyboard fixes, the pointer fix and the 768–900 rail).

**Tooling lessons (outside the repo, `D:\STUDIO-tools\browser-automation`):** apply the viewport inside
each script's own CDP session and guard `innerWidth` — a shared or freshly launched browser can drop the
emulation and silently measure a desktop layout; gate measurements on the driver's own position
(`--junction` + `--junction-at`), never on `scrollY`, which runs ahead of the input spring; real touch
is `Input.dispatchTouchEvent` (`synthesizeScrollGesture` does not scroll under mobile emulation); the
controller is a background job with a 2h limit — restart it with the maximum timeout; isolated workers
use their own profile, CDP/API ports and output folder (`run-*.sh`).

**PERFORMANCE BASELINE.** A auditoria de performance realizada em produção (4 de Outubro de 2026) está
arquivada em `docs/development/AUDIT-2026-10-SCROLL-PERFORMANCE.md`. Nenhuma das suas recomendações foi
implementada.

**SCROLL JOURNEY AUDIT.** A auditoria da distribuição do scroll (quantos gestos a jornada exige, mapa por
segmento, mobile vs desktop, três estratégias e uma recomendação) está arquivada em
`docs/development/AUDIT-2026-10-SCROLL-JOURNEY.md`. É só diagnóstico: nada foi implementado.

---

*The sections below are the detailed record — the 1 October session and the 2 October additions — kept
as written.*

**Scope of the 1 October session:** mobile composition below 768px (a common reading grid, the Method's closing
group) and the whole Questions-on-short-screens problem (B, D-gate, rest height, hysteresis), plus a
CDP browser-automation workflow for real CSS viewports. **Everything below is approved and frozen by
the design owner unless listed under *Open*. Do not reopen without new evidence.**

## Git

Nothing staged, committed or pushed. All of this is in the working tree, on top of the earlier sessions'
uncommitted work (see the 30 September handoff below).

## Opening 04 → 05 · the thesis leaves on a clock — FROZEN 2 October 2026 (C29)

Moved from PENDING. The design owner approved `leaveAt` 0.50 (over 0.45, which was measured first) and
froze 04 → 05 as implemented. The record, with the full battery, is
`docs/design/v2/implementation-reconciliation.md` **C29**; it is listed under KEEP / FROZEN below.
The only change after the 1 October battery was `leaveAt` 0.45 → 0.50, plus comments in
`timing.ts`, `globals.css` and `scroll-stage.tsx` (no behaviour). Not validated: iOS Safari, a physical
touch device. Tooling: `D:\STUDIO-tools\browser-automation` — `audit0405.mjs` (now 31 stops, incl.
4.48–4.52), `compare-050.mjs` (0.45 vs 0.50), 0.45 results kept in `after045/`, 0.50 results in
`audit0405-*.json`, `zone05-*.json`, `opening-*-after.json`. Run the controller with the 2h background
limit: at the 30-minute default it was stopped mid-battery.

## Opening 01 → 02 · `Chapter` changes face in one frame — APPROVED / FROZEN 2 October 2026 (C31)

The passage `Chapter One → Chapter II` read as a scene change. The C31 audit proved the cause: the
survivor's Cormorant → Schibsted exchange was a cross-fade over `--k-travel` .88 → .90 that now costs
32–44px of scroll (the comment said ~10px; the junction has grown to 2283–3227px), with the word large
and nearly still — a stop held both faces half-lit, slow scroll showed a double image, the x-height
jumped 40–50%, and the serif stood spaced at ~0.37em before it. Two previews were compared by the
design owner: **C31-A** (one-frame step at .95, serif tracking `0.2em × k`, mark 400 → 500, mark
tracking 0.0744em → 0.42em) — **approved**; **C31-B** (late micro-cross-fade .94 → .96) — rejected:
longer double image on slow scroll than the baseline, and a stop again held both faces. C31-A was
promoted to `src/app/globals.css` exactly (four declarations in the survivor's block); comment-stripped
the file is identical to the approved preview. Validation after promotion: typecheck / lint / build
pass; 1440×900, 390×844, 375×812, 320×640 compared against the preview at 27 settled positions
(exchange, 02 → 03, thesis arrival and leaving, zone 05) — identical; one natural gesture showed 0
frames with both faces lit. The record is `implementation-reconciliation.md` **C31**. Not validated:
iOS Safari, a physical touch device. The previews (:3001, :3002, in this session's scratchpad) were
evaluation-only and are not needed any more.

**C30 is documented** (cleanup pass, 2 October 2026): the thesis' arrival on a clock (03 → 04,
`TIMING.memories.thesisArrives`, `arriveAt` 0.68) has its entry in `implementation-reconciliation.md`,
and the code comments in `timing.ts`, `scroll-stage.tsx` and `globals.css` call it approved / frozen.

## KEEP / FROZEN (design owner, 1 October 2026 · 04 → 05, 03 → 04, 01 → 02, the keyboard and pointer fixes and the 768–900 rail added 2 October 2026)

- **Mobile reading grid, phase 1** (`globals.css`, block *"The mobile reading grid · phase 1"*, all
  inside `max-width: 767.98px` / `700px`): F `--g-floor` (head line + breath), A `--g-anchor` = F + 7vh,
  P `--g-foot` = 7vh. About's claim + paragraph from A and its secondary group ending on P; the Method's
  main block on A (`--m-main-y = A − --masthead`, `.method-stage` clips x only); Questions'
  `--asked-top` upper bound = A. `--masthead` is untouched.
- **Method closing group** (portrait ≤ 700px): lines 1–5 step down from A (`--g-field-top`,
  `--g-field-step`, `--wi`); lines 6, 7 and the note hang from P with `--g-close`; line 6 never stands
  above 4px under the book (845/1024 of the plate). At 320×640 / 375×667 lines 6–7 sit tight (3px /
  ~5px between glyphs) — accepted, do not re-tune.
- **Questions B** (`scroll-stage.tsx` + `.asked[data-asked-reaches]`): where the list cannot stand
  whole, it reads through 1:1, `--asked-reach = clamp(0, y − from, excess)`, masked above the line it
  stands on.
- **D-gate:** B does not start until `.publication[data-anchor]` is `held`; then it starts at 0, 1:1.
  Its start therefore depends on when the anchor is held — accepted explicitly; do not try to make B
  100% scroll-pure again; do not reopen the 320×640 / 375×667 anchor question.
- **#2 · rest height vs actual height — APPROVED.** `--asked-h` is the list at rest (rendered height
  minus what open answers add: a closed `details` is exactly its summary + borders); the excess still
  uses the real height. Opening an answer no longer moves the list (was 40.6 / 56.8 / 42.1px at
  360×780 / 375×812 / 390×844), the lock no longer moves, and the six questions no longer un-write when
  an answer opens near the FAQ point (or right after an INDEX landing).
- **#1 · hysteresis — APPROVED.** `askedReachStart` (the start the base and the D-gate set) and
  `askedReachFrom` (the effective start). `place()` re-anchors only when the excess grows, and only
  `askedReachFrom` runs ahead; `read()` hands the run-ahead back whenever the list stands at its
  ceiling, where both starts give the same reach, so it is unseen.
- **Validation of #1/#2 (CDP, settled samples, reverse vs clean path):** scenario A (open at reach 0 →
  read → close → reverse) and scenario B (scroll to the ceiling → open → read → close → reverse):
  320×640 ≤ 0.2px, 375×667 ≤ 0.1px in both (were −92px / −14px). 360×780, 375×812, 390×844: rest
  height, top and lock constant, 0 differences, no regressions. Desktop 1440×889 unchanged (landing
  27697, top 99, no B). Typecheck, lint and build pass.
- **Desktop 1440×889** validated as unchanged by every change above.

- **Opening zone 05 — the occasions are played (C28) — FROZEN.** `A wedding.` → `An artist.` →
  `A memory.` trigger at the old ramps' positions and draw on `play()` (0.6s), chained (each waits
  for the one before to arrive), with `--o1-guard` keeping the stack dark while the thesis can be lit
  (jp4 0.6 → 0.7) and clearing it before the photograph (jp5 0.86 → 0.9). Environment, geometry and
  junction distances unchanged. Validated 1440 / 390 / 375 / 320 (stops, 300–6000px/s, reverse,
  flicks). Not validated on iOS Safari. Do not change its behaviour or timings.

- **Opening 04 → 05 — the thesis leaves on a clock (C29) — FROZEN 2 October 2026.** The thesis'
  leaving is played: trigger at `--jp4` **0.50** (`TIMING.memories.thesisPlays.leaveAt`), **0.6s**,
  scroll guard **0.55 → 0.60** (`--th-guard`), clean frame **0.60 → 0.70**, `A wedding.` from 0.70
  exactly as zone 05 froze it; reverse symmetric (the thesis returns from 0.50); the hold 0 → 0.30 and
  the arrival in 03 → 04 untouched. Battery 1440 / 390 / 375 / 320 (stops forward + reverse, 300 /
  900 / 1500 / 6000px/s, reverse 300 / 900 / 6000, flicks): no partial stop in 04 → 05, overlap
  thesis × `A wedding.` 0ms, clean frame intact, zone 05 identical to its frozen reference,
  geometry / distances / environment unchanged, typecheck / lint / build pass. Empty before
  `A wedding.` at 300px/s: 162 / 256 / 188 / 178px (scrubbed 163 / 225 / 184 / 177). Accepted, **not to
  be optimised**: 390's slow forward empty (+31px over scrubbed), the slow reverse empty (0.56–0.88s),
  and fast reverse (6000px/s) showing the thesis in motion for 145–327ms without ever reaching full
  ink. Not validated on iOS Safari or a physical touch device. Do not change its behaviour or timings.

- **Opening 03 → 04 — the thesis arrives on a clock (C30) — APPROVED / FROZEN 2 October 2026.**
  `TIMING.memories.thesisArrives`: trigger `--jp3` **0.68**, **0.6s**, floor **0.82 → 0.87** (whole
  before state 04), ceiling **0.63 → 0.68** (gone before the clean frame and the pair), written as
  `--k3-ink` on `.v2-thesis` so C29's rule is untouched; reverse symmetric. 0.75 tried and rejected
  (empty frame too long). No partial stop; 0ms overlap with `II Philosophy`; C29 and zone 05 identical.
  Accepted: the empty frame at rest 0.60 → 0.68 (160–224px) and fast reverse from 05 showing the
  thesis to ~0.3–0.5 in motion. The pair's own partial stops (`--jp3` 0.46 → 0.60) were left out of
  scope. Do not change its behaviour or timings.

- **Opening 01 → 02 — `Chapter` changes face in one frame (C31-A) — FROZEN 2 October 2026.** In the
  survivor's block of `globals.css`: `--swap` is a one-frame step at `--k-travel` **0.95**, `--swap-out`
  runs 0.95 → 1; `.v2-word-serif` tracks `0.2em × --k-travel`; `.v2-word-mark` weight `400 → 500` on
  `--swap-out` and tracking `0.0744em → 0.42em` (width-matched to the serif at the step). The travel,
  the numeral (inks from .96), 02 → 03 and everything else unchanged. No cross-fade, no clock, no
  further smoothing — the design owner rejected the micro-cross-fade (C31-B) and asked for no C31-C.
  Do not change its behaviour or values.

- **Keyboard during the opening — FIXED / FROZEN 2 October 2026** (accessibility corrections, not
  design): `opening.tsx` cancels in-page link activation while `data-opening` is `running` and makes
  `.publication` `inert` until `done`; the quick menu's links are `tabIndex={-1}` (`states.tsx`). Details
  and validation under *Open*, items 1–3.

- **Pointer change re-prices the page — FIXED / FROZEN 2 October 2026.** `scroll-stage.tsx` creates
  `matchMedia('(pointer: coarse)')` beside the `resize` listener and runs the existing `onResize` on its
  `change`; the listener is removed in the same cleanup. The runways (`--pin`, `--act-pin`,
  `--method-pin`, `--about-pin`, `--asked-*`) are priced by `@media (pointer: coarse)`, and a pointer
  change fires no `resize`, so the document used to end at state 9. Validated at 1440 / 390 / 375 / 320:
  coarse → fine and fine → coarse re-price at once (document height equal to a fresh load in that mode),
  full passes 1 → 14 and 14 → 1, 0 console errors, ordinary resizes unchanged; typecheck / lint / build
  pass.

- **The rail between 768 and 900px — head and index on one line (variant B) — APPROVED / FROZEN
  2 October 2026**, chosen by the design owner from a live preview of three variants (A: index under the
  head; B: index beside it; C: index on a fixed column). Composition:

        01 Work     ABOUT   METHOD   QUESTIONS   CONTACT
        02 About    WORK   METHOD   QUESTIONS   CONTACT
        03 Method    WORK   ABOUT   QUESTIONS   CONTACT

  The head stays on the left; the index starts one word-gap after it, so its start follows the
  chapter's name; the running chapter is not drawn again in the index — its number lives in the head
  only. Index logic, order, navigation and `data-hold` are unchanged, and the running line stays in the
  accessibility tree with `aria-current`. Implementation: one block in `src/app/globals.css`,
  `@media (min-width: 768px) and (max-width: 900px)` — `.ledger-rail` becomes a row (baseline,
  `column-gap: clamp(1.125rem, 5vw, 1.75rem)`, the index's own column gap, 28px here) and the running
  line (`li:has(> .ledger-word[aria-current])`) leaves the layout with the existing `.a11y` pattern.
  Validated at 768 / 800 / 840 / 900 on Work, About, Method, Questions and Contact (identical to the
  preview: Work's index at x 150 / 152 / 154 / 158), navigation by click works, 767 and 390 still show the
  mobile INDEX (C24), 901 and 1440 the desktop column with its `NN ·` mark; typecheck / lint / build pass.
  Do not bring back the second `NN ·` here and do not move this composition to other widths.

## Known limitation (accepted, do not fix in this phase)

If an answer is opened while the list is at its ceiling and closed before the list touches the ceiling
again (i.e. the visitor scrolled back up while it was open), the temporary run-ahead is only handed
back when the ceiling is reached again. Until then the reach on that path is lower than the clean path.

## Open (inventory of the cleanup pass, 2 October 2026)

**Fixed 2 October 2026 (accessibility / behaviour corrections, not design decisions):**

1. ~~**The keyboard skips the mandatory opening by activating a link.**~~ **FIXED.** `opening.tsx`
   cancels an in-page link's (`a[href^="#"]`) `click` in the capture phase while `data-opening` is
   `running` — Enter on a focused link is a `click`, which `pointer-events: none` never stopped.
   Verified at 1440: Tab to the Ledger + Enter during the opening → no hash, `scrollY` 0, the opening
   finishes by itself; after `done`, Tab + Enter navigates exactly as before (`#about`, state 9).
2. ~~**The quick menu is focusable inside `aria-hidden="true"`.**~~ **FIXED.** `tabIndex={-1}` on its
   three links (`states.tsx`): no longer keyboard stops, before or after the opening; still navigate by
   pointer and touch once the opening is done (`#questions`, state 13, at 1440 and 390); absent from the
   accessibility tree; the Ledger keeps its own focus order.

3. ~~**Keyboard focus during the opening runs the page away.**~~ **FIXED** (design owner chose `inert`
   over blocking Tab). With the opening `running`, Tab past the Ledger (1440) or straight away on a
   phone focused the publication's controls — Questions' `summary`, Contact's links — and the browser
   scrolled to them while the shot's origin followed the scroll: `scrollHeight` 32,015 → 1,064,315 on
   one Tab, ~+1M px per further Tab, a phone parked near y 5.2M. Now `opening.tsx` makes
   `.publication` — which holds all eleven of those controls and none of the opening — `inert` when it
   writes `running` (blurring focus first if it were already inside) and lifts it on the frame it writes
   `done` (and on unmount); it lifts only an `inert` it set. No key is intercepted; the Ledger keeps its
   focus order; without scripting nothing is written. Verified at 1440 and 390: ten Tabs during the
   opening never reach the publication and `scrollHeight` stays 32,015 / 42,020 with `scrollY` 0; Enter
   on a Ledger link during the opening does nothing; after `done` Tab enters the publication normally,
   the height does not move, Enter on the Ledger navigates (`#about`), the quick menu stays out of the
   Tab order. (At 390 the Ledger's destinations are reachable only through INDEX, as before.)

**Validation items — audited 2 October 2026 (all closed except iOS):**

- ~~Transient `[narrative]` / `[junction]` console errors at the instant a viewport is resized/emulated~~
  — **not transient: a real bug, FIXED 2 October 2026.** The errors (`[narrative] State 10–14 is past
  the end of the document`) marked a pointer change from coarse to fine with no size change: the runways
  are priced by `@media (pointer: coarse)` in `transitions.ts`, the driver re-priced only on `resize`,
  and the end of the document stayed at state 9 until a reload (silently, when only the pointer
  changed). `scroll-stage.tsx` now listens to `matchMedia('(pointer: coarse)')` and runs the existing
  `onResize` on `change`. Verified at 1440 / 390 / 375 / 320: coarse → fine, fine → coarse and coarse →
  fine again each re-price at once (`--pin` 2508vh ↔ 1672vh, document height equal to a fresh load in
  that mode), the end reaches state 14, a full pass runs 1 → 14 and back, 0 console errors on any
  change; ordinary resizes unchanged; e2e at 1440 and 390 (14 states both ways, landings, Questions)
  and the opening's keyboard guard unchanged.
- ~~701–767px: not validated in that range.~~ **CLOSED 2 October 2026** — tested at 701 / 720 / 740 /
  760 / 767 / 768 (×889), plus 740×600 and 740×1200: no broken state; e2e crosses the 14 states both
  ways with no errors; every INDEX landing on its state with its content visible; Questions stable when
  answers open; no overflow beyond the scrollbar. The e2e CHECKs there are false positives:
  `.v2-work-type` is a full-frame container (its ink sits at y 394–417, the head line at 73) and
  `.v2-title × .v2-thesis` is the invisible ghost title. The 768 breakpoint is intentional.
- ~~Desktop horizontal overflow (~10px).~~ **CLOSED** — the difference is exactly the scrollbar:
  `.stage` (sticky, `width: 100vw`) at 1440 and 1920; the Environment's wider plates do not count. Wheel
  `deltaX`, Shift + wheel and arrow keys leave `scrollX` 0; only a programmatic `scrollTo` reaches 10.
  Structural and harmless; `overflow-x: clip` stays as it is.
- ~~≤ 900px rail `data-hold` awaits visual confirmation.~~ **CLOSED** — `data-hold` is not a delay and
  does not depend on height: it reserves, unseen, the running word's width so the other words never
  shift, and only matters where the index lies in a row (768–900px). It never drew the second `01`.
  That composition has since been replaced in that range (*KEEP / FROZEN*, rail 768–900). Do not reopen
  without new visual evidence.
- iOS Safari / WebKit and a physical touch device — **INCONCLUSIVE**: no Safari, WebKit or device here;
  Chrome emulation does not count as a Safari result.

**Housekeeping, needs a yes:** `D:\STUDIO-buildcheck` (a build copy from 26 September) still exists;
deleting it is irreversible, so it was not done.

**Deferred on purpose — visual, for the aesthetic phase:** Venice → Work's static frame while the
carousel changes; the end of the page after Contact with no response; Contact's listening pause
possibly landing on the landscape and the ⅓s silhouette overlap as the still dissolves in.

**Debt, deferred on purpose:** thresholds of One Sun, C9, C30 and C31 live in `globals.css` rather than
`timing.ts`; inert `.v2-of` / `.v2-ember` rules. Content decisions (`open-decisions.md`): Instagram
handle, the placeholder phone number.

**Closed in this pass (verified, removed from the list):** the running header's clipping (the fix is in
`.ledger-rail`'s `clip-path` / `mask-clip`; 0 clipped exchanges in every direction at 1440 / 390 / 375 /
320, measured 1 October); the Questions INDEX landing at 390 (lands on state 13, `04 Questions`, list
visible, at 320 / 375 / 390 / 768 / 1440 / 1920); 768 with mobile emulation (no longer reproduces:
`scrollWidth` 768, scale 1); the `--asked-h` comment (now states the rest height); the mobile grid and the
Method closing group (now in `implementation-reconciliation.md`); C30's missing entry and its
"experiment" comments. The e2e tool's overlap CHECKs at states 7–8 are false positives (invisible
`.v2-ghost` / `.v2-ident-ghost` spacers).

## Validation workflow (use this, not the Device Toolbar)

`D:\STUDIO-tools\browser-automation` (outside the repo): `node control.mjs` launches/reuses a visible
second Chrome (own profile, `--remote-debugging-port=9222`, background throttling disabled) on
`http://localhost:3000/` and serves `http://127.0.0.1:9333`: `/viewport?w=&h=&dpr=&touch=&mobile=`,
`/eval` (POST a JS expression), `/shot?name=`, `/goto`, `/status`, `/reset`, `/quit`. Keep the
controller running (CDP emulation lasts only while it holds the session; a background job is stopped
after 2h — restart it, it reattaches). Phones: `dpr=2&touch=1&mobile=1`; 768/1440: `mobile=0`.
Batteries used this session are in that folder (`questions-*.js`).

---

# Previous handoff — 30 September 2026

**Scope of the session:** the opening (load → Work) was redesigned and approved in a preview (One Sun · B2 ·
quick menu · tagline · no "I OF III"), promoted to the main project, and a global audit was run. One
concrete problem remains open (Questions on short screens). **Read this section first. Do not reopen
anything listed as frozen without new evidence.**

## Estado dos ambientes

- **:3000 = projeto principal** (`D:\STUDIO`, `next dev`). Now contains the approved opening (see
  *Alterações promovidas*). Was not changed after promotion; the audit and this handoff did not touch
  behaviour.
- **:3001 = sandbox / referência.** A copy of the project outside the repo:
  `C:\Users\35191\AppData\Local\Temp\claude\D--STUDIO\5774b372-0bf0-4546-b6c9-3b8aeb4c338f\scratchpad\preview-opening`
  (own `node_modules`, served with `npx next dev -p 3001` from that folder). The approved state is
  `http://localhost:3001/?sun=b`. **Keep :3001 available as the reference** until the main project is
  confirmed. If the machine restarts, :3001 must be started again from that folder; if the folder is
  gone, :3000 already holds the approved state and is the reference.
- In :3001 only: `src/app/sun-variant.tsx` reads `?sun=a|b|b1|b2` (A = minimal, B = approved, B1/B2 =
  test exits). `?sun=b` already uses the B2 exit. None of this is in :3000.

## Estado aprovado da abertura (design owner, 30 September 2026)

Approved:
- **Quick menu** WORK · QUESTIONS · CONTACT on the title's axis, bottom band of the hero, where
  "I OF III" stood. Arrives on Chapter I's `INTERFACE` beat (`--fade-navigation`), leaves with the
  tagline (`.v2-leaves`), clickable only when `data-opening='done'` (the opening stays mandatory).
  Rail register (Schibsted, uppercase, 0.24em, `clamp(9px, 9.5/1440·100vw, 13px)`), 60% ink,
  hover/focus = full ink + the Index's 1px rule. 44px+ touch targets. Work → `#studio`,
  Questions → `#questions`, Contact → `#contact`.
- **"I OF III" removed**, not replaced by any counter.
- **Tagline**: 1.125× the existing fluid rule above 820px (15px at 1920, 11.25px at 1440); unchanged
  below 820px (larger breaks the mobile column into one word per line).
- **One Sun, variant B, B2 exit.** The image disappears; the light survives:
  - 01 → 03: the uniform black (`.v2-grade`) is a radial falloff centred on the footage's own sun
    (≈43.5% / 36% of the video, mapped through `object-fit: cover`), so the pool of light around the
    sun darkens less and narrows as "Philosophy" forms.
  - `.v2-light`: one independent warm light (wide soft ellipse, horizon light) from Chapter II to
    "A memory.": merges with the real sun on the figure shot, reads as a source behind the horizon on the
    landscape shot, takes over as the picture goes, **drops quickly as "Philosophy" disperses (B2: holds
    to 0.38 of junction 03 → 04, down to 25% by 0.48, back to full by 0.95)**, returns as the ember while
    the thesis resolves, steps back up-right, rises over the occasions, leaves with the dark as Venice
    opens. Intensities B: 0.06 / 0.12 / 0.07 / 0.11. The old ember (`.v2-ember`) is removed.
- **Video runs normally** — no seek, no loop inside the sun shot, no hold. (A forced 2.7–9.6s loop was
  tried and rejected: visible pose jumps.)
- Intended reading, confirmed: **sol → luz → desaparecimento → preto → ember/tese.**
- **Validated in the real, visible Chrome** (not only headless): 1440 and 375 at slow / normal / fast
  wheel scroll; B2 does not read as a pulse; no legible oval on black; thesis clean; Venice still a
  reveal. Earlier headless captures were used only for comparisons B0/B1/B2.

Rejected along the way (do not retry): contrast-crush of the footage (posterised the halo into a ring);
forced video loop; variant A (too faint on mobile); B0 (legible oval when Philosophy disperses); B1
(weaker sun → light continuity).

## O que está congelado — não mexer sem nova evidência

Opening · One Sun/B2 · Philosophy → thesis · thesis → occasions · A memory. → Venice · Work → About ·
About · About → Method · Method (Option 1 compression and the healthy `gathered.holds`) ·
Method → Questions / C25 · Questions → Contact / C26 / S1 · Contact's guard (`contactGuard`).

## Alterações promovidas para :3000 (working tree, uncommitted)

- `content/site.ts` — `site.nav` is now Work / Questions / Contact (it was an unused
  Studio/About/Contact list); new `site.navLabel = 'Quick navigation'`; `site.chapterOf` removed.
- `src/app/states.tsx` — `<p class="v2-of">` replaced by `<nav class="v2-nav">` built from `site.nav`;
  `<div class="v2-ember">` removed; `<div class="v2-light">` added right after `.v2-warm` (above the
  grounds, under all type).
- `src/app/globals.css` — one section appended at the end, *"The opening, as approved in the preview ·
  30 September 2026"*: tagline, `.v2-nav` / `.v2-nav-word`, the One Sun falloff (`.v2-grade`,
  `.v2-scrim-flat`, `--os-*` on `:root`) and `.v2-light` with B values and the B2 exit fixed. The old
  `.v2-of` / `.v2-ember` rules were left in place, inert.
- `src/app/page.tsx` — no-script CSS list: `.v2-of` → `.v2-nav`.

Not in the product: `?sun` does not exist; `sun-variant.tsx` is preview-only; B1/B2 are not separate
variants; the video is not forced to the sun shot; the headless capture scripts (in the scratchpad
`cap/` folder) are not part of the project.

Known debts of the promotion (decisions, not bugs to fix silently):
- The quick menu lives inside `.v2`, which is `aria-hidden="true"`: links take keyboard focus but are
  not announced by screen readers. Fixing it means changing `.v2`'s structure.
- CLAUDE.md asks new animation parameters to live in `src/motion/timing.ts`; the light's thresholds
  (0.35, 0.45, 0.38, 0.48, 0.95…) are in CSS because timing was out of scope.
- ~~Not yet recorded in `docs/design/v2/implementation-reconciliation.md`~~ — recorded 2 October 2026
  (*Approved states recorded here for completeness*). The accessibility debt above and the keyboard
  link bug were fixed on 2 October 2026, with the focus runaway beside them (*Open* at the top, items 1–3).

## Validação atual

- `npm run typecheck` **PASS** · `npm run lint` **PASS** · `npm run build` **PASS**.
- Dev console: no `[motion]` assertion failures (only the pre-existing informational `[junction]` note).
- Visual validation in the real Chrome at **1920, 1440, 375, 320**: every opening transition, and
  Venice → Work.
- **:3000 matches the approved :3001** — computed values of `.v2-light` / `.v2-grade` /
  `.v2-scrim-flat` are identical at nine positions of the sequence at 1920.

## Auditoria global (:3001, 30 September 2026)

| Zona | Estado |
|---|---|
| Opening → Chapter One | KEEP |
| Chapter One → II → Philosophy | KEEP |
| Philosophy → thesis | KEEP |
| thesis → occasions → A memory. → Venice | KEEP |
| Venice → Work | WATCH (Work frame static ~2,000px at 1920 while the carousel changes every 8s; a normal scroller sees one category) |
| Work → About | KEEP |
| About | KEEP |
| About → Method | KEEP |
| Method | KEEP |
| Method → Questions (C25) | KEEP |
| Questions → Contact (C26/S1) | KEEP (small reverse steps: Contact leaves before the room returns) |
| Fim da página | WATCH (~600–750px after Contact is composed with no response; felt when reversing from the bottom) |
| Quick menu / INDEX | work (mobile INDEX → Questions lands composed); ~~investigate accessibility~~ fixed 2 Oct 2026 (see *Open* at the top) |

Audit limits: 768/375/360/320 were iframes (mouse pricing, not touch); no real touch, no iOS Safari.

## ~~ÚNICO PROBLEMA PRIORITÁRIO ATUAL — Questions em ecrãs baixos~~ — RESOLVED 1 October 2026 (C27; B, D-gate, rest height, hysteresis). Kept as history; this and *Próximo passo* / *Próxima sessão* below are superseded.

The Questions list (heading, body, six rows) stands in a held frame; on short viewports the last rows
sit below the fold for the whole hold, and the list then leaves without ever moving up.

| Viewport | Altura útil | Pergunta 6 termina | Resultado |
|---|---|---|---|
| 320×640 | ~638 | ~765 | only 4 rows visible (row 5 starts at 624) |
| 375×667 | ~665 | ~709 | only 5 rows visible |
| 360×780 | ~778 | ~754 | all visible |
| 375×812 | ~810 | ~786 | all visible, tight |

Measured with the list at rest (≈600px after `#questions`' top), rows = `#questions summary`. Problem: the
last questions ("Can you work with the people already involved?", "What happens after the experience
is live?") are cut / never reachable at low heights. Real mobile browsers lose more height to their
toolbars, and opening an answer pushes later rows further down.

## PRÓXIMO PASSO EXATO

**Não implementar nada ainda.** First a specific technical audit of Questions to find the cause:
- how the list is positioned; the available height;
- which element is held (sticky / clamp / anchor), clipping;
- the runway (`distance.asked`, `askedLead`, `askedHold`, `--closing-pin`);
- `--jclear`, `--asked-fits`, `--asked-lands` and the other Questions variables
  (`TIMING.questions.*`, `src/app/scroll-stage.tsx` around the anchor / `afterLock` / `--qin`);
- why 375×667 fails and 360×780 does not.

Then decide whether the right answer is **A)** more runway, **B)** an internal shift of the list,
**C)** a low-height adaptation, or **D)** another structural solution — and only then implement the
smallest possible change, validating 1920 / 1440 / 768 / 375×812 / 375×667 / 360 / 320 in the real
Chrome, forward and reverse, and C26 unchanged.

Also still open from the 28 September handoff (below), not re-verified this session: the running
header's clipping during some rail exchanges (item 1). Item 2 (Questions destination at 390) looked
correct in this session's mobile INDEX → Questions test at 375×812, but was not re-measured at 390×844.

## Estado Git

No stage · no commit · no push · no reset · no checkout · no stash. Everything is in the working tree
(`git status`: content/site.ts, docs/design/v2/implementation-reconciliation.md, src/app/globals.css,
src/app/page.tsx, src/app/scroll-stage.tsx, src/app/states.tsx, src/motion/scroll.ts,
src/motion/story.ts, src/motion/timeline.ts, src/motion/timing.ts, src/motion/transitions.ts — the
non-opening files carry earlier sessions' uncommitted work: Method Option 1, C25, C26/S1, askedLead).

## Próxima sessão

1. Read this section.
2. Do not reopen anything frozen.
3. Start with the technical audit of Questions on short screens.
4. Do not change code until the cause is identified.

---

# Previous handoff — 28 September 2026

**Scope: the Ledger's index (the rail's chapter list).** The approved version of
`prototypes/the-folio-mark-motion` (served on :3030) is now implemented in the main project.

**Git:** nothing committed, staged or pushed. Everything below is in the working tree.

## 1 · Current state

- **The main rail is updated with the approved 3030 version.** The index is **all five chapters in
  canonical order on fixed lines** (WORK · ABOUT · METHOD · QUESTIONS · CONTACT); the running chapter's
  line reads **`NN ·`** (its folio and a typographic point) where its word stands. The running header
  (folio + chapter in Cormorant) is unchanged.
- **The approved `NN ·` animation is implemented.** Leaving: the point lifts first, then the folio,
  drifting ≈3px (0.3em) in the direction of travel. Arriving, after the exchange's lag: the folio is set,
  then the point. Words keep the existing promote/demote exchange. Timings are
  `TIMING.publication.mark` in `src/motion/timing.ts` (420 / 60 / 260 / 760 / 200 / 520 ms), published by
  `src/motion/transitions.ts` as `--rail-mark-*`; the CSS is in `src/app/globals.css` (search
  `The folio mark`). The component change is `src/app/ledger.tsx` (`compose`, `RailSlot`, `SettingOf`).
- **One addition beyond the 3030 prototype, for ≤ 900px:** lying down, the index is a row, and `NN ·` is
  narrower than its word, so the running line holds its word's width invisibly (`data-hold` + `::after`).
  Words never move at 390 or 768; the cost at 390 is a gap after the mark and CONTACT on the second
  reserved row. Needs the design owner's visual confirmation.
- **localhost:3000 verified in visible Chrome** (1920 × 889, plus 390 × 844 and 768 × 1024 frames): every
  transition both ways matches 3030's timeline; normal/reverse scroll stays in sync; line positions move
  0.00px in every test; never a stuck or duplicated mark (up to 3 fading only at 120ms clicks); hover
  ~200ms in/out, running line inert; no console errors.
- **typecheck, lint and build pass.**
- **Prototypes kept separate and untouched:** :3010 `prototypes/the-persistence`, :3020
  `prototypes/the-folio-mark`, :3030 `prototypes/the-folio-mark-motion` (all untracked). Serve with
  `node prototypes/server.mjs <dir> <port>`.

## 2 · Pending for the next session — in this order (superseded: 1 and 2 verified closed on 1 October 2026; see *Open* at the top)

1. **Fix the running header's clipping during some exchanges.** Pre-existing. Leaving a long chapter
   name for a shorter one, the departing header word is cut at the rail's right edge: Questions → About
   42px ("Questic"), Contact → Work 15px, Method → Work 10px. Cause: `.ledger-rail`'s reveal `clip-path`
   clips at the rail box, which shrinks to the arriving word. Likely fix: horizontal slack in that
   clip-path (or a stable rail width).
2. **Fix the Questions destination at 390px, then verify 768 / 1440 / 1920.** Regression from this
   session's earlier `--asked-lands` change (`.asked-hold` scroll-margin in `globals.css`, value
   `TIMING.questions.faq.afterLock`). At 390 × 844 the new landing (y 27295) falls past the start of the
   13 → 14 passage, so the jump puts the passage at its end: the rail says **05 Contact**, Contact's
   footage shows, and neither the Questions list nor Contact's composition is on screen. The old landing
   (y 27008) was correct; the threshold lies between y 27100 and 27200. Likely fix: clamp the landing so
   it always stays before the passage's start.
3. **Then a final visual pass** of the menu and every transition.

---

# Previous handoff — 26 September 2026

**Scope: Contact, and the passage Questions → Contact.** The record is
`docs/design/v2/implementation-reconciliation.md` **C23**, which supersedes C22. Nothing else was touched.

**Git:** nothing committed, staged or pushed.

## 1 · What Contact is now

```
hello@chapterone.com            ← upper left, --page-x, at --mark-y (under the masthead ≤ 900px)
+351 910 000 000
WHATSAPP · TELEGRAM · INSTAGRAM          [ footage, full-bleed, native speed ]

Is there something
that deserves its own experience?        ← --c-room is 52vw − --page-x now
Tell us where it begins.                 ← breathes at rest; the only interaction
──────────                               ← --c-foot off the bottom edge; does not breathe
```

Measured at 1920 × 889: note 259 × 53, question 259–1001 × 560–696, sentence 729–773, line 775 (220px at rest → 742 listening).

## 2 · Three models, and none of them overlaps another

- **Scroll owns the passage** (`TIMING.environment.persisting`, 5.3s → 106vh).
- **A clock owns Contact's arrival** (`TIMING.contact.composes`: question → sentence → note).
- **A hand owns time** (`TIMING.contact.listens`, `src/app/contact-listen.tsx`): `--listen` and
  `data-listen` on the root, the footage's `playbackRate`, and nothing else.

## 3 · Validation

| | |
|---|---|
| typecheck · lint | **pass** |
| build | **pass** — on a copy at `D:\STUDIO-buildcheck` (dev was serving :3000). **Delete that folder**; the tool could not. |
| console | no `[motion]` assertions |
| 1920 × 889 (visible Chrome) | passage wheeled through several times; rest, breath (left edge fixed at 258.66), hover, mid-way reversal, press/hold, Esc, leaving Contact while held |
| 1440 × 900 · 768 × 1024 · 390 × 844 | composed, no collision; ≤ 900 the note drops under the masthead |
| no scripting (`next start`, sandboxed frame) | composed on paper, in flow, at rest tracking |

**Not verified:** iOS Safari; hover/tap on a real touch device.

## 3b · Second pass, the same day (design owner review)

- Slow motion 1 → 0.3 → **pause** (`TIMING.contact.listens`); `opening.tsx` `roll()` respects
  `data-still`, which is what had been undoing any pause.
- Questions' release is a **clock** (`persisting.releases.clock`): anchor → rows in pairs → hairlines;
  `--jclear` is the scroll's guarantee. Passage floor 0.8, no contrast softening; the footage is cued to
  0.3s at the crossing so its own dissolve brings the figure in (`TIMING.contact.arrives`).
- Contact: exposure 1, scrim 0; contacts at y 102 (1920 × 889).
- Measured in Chrome: rate 1 → .95 → .85 → .7 → .55 → .45 → .3 → paused (frame stable over 1s);
  release pause → .3 → 1. 30.5 fps at rate 1, 8.5 at 0.3.

## 3c · Third pass (design owner review)

- Contacts under the line, ~14 / ~10px, protected by a faint wide `text-shadow` only.
- Hover draws the scene in (brightness 0.91, contrast 1.10); rate 1 → 0.3 → pause, measured.
- The sentence is a plain `mailto:` link; no hold, nothing listens for the click.
- Method leaves in layers on `TIMING.method.leaves` (main → thoughts → note → empty room).
- Passage floor 1; `.env-room` veil leaves on `dusk`, before the crossing (`scroll-stage.tsx`).

## 3d · Fourth pass

- Method leaves in layers over ~5.3s; Questions waits for the empty room (`methodRested`).
- 13 → 14 is **played** once started (`passageOn` / `passageAt` in `scroll-stage.tsx`), rewinds on the
  way back; Contact asks only once the closing frame has locked.
- Hold frame 4.4s via `.env-hero-still`; light 0.83 / 1.13 / 1.06; contacts 16 / 11.5px, hover ×1.13.
- Known: when the live footage is in another pose of the figure, the two silhouettes overlap for ~⅓s
  as the chosen frame dissolves in.

## 4 · Open

- Instagram has no handle in the project and renders inert.
- The listening pause lands wherever the loop is — possibly on the landscape rather than the figure.
- WhatsApp / Telegram derive from the placeholder number.
- The 10px horizontal overflow (`100vw` elements against the scrollbar) is pre-existing.

---

# Session handoff — 24 September 2026

**Scope: Contact, and the passage Questions → Contact.** Direction B, *"Chapter One, outra vez"* —
the record is `docs/design/v2/implementation-reconciliation.md` **C22**. Nothing else was touched: not
the Hero, About, Method, Questions, Work, the rail, the type system or any other transition.

**Git:** nothing committed, staged or pushed.

## 1 · What Contact is now

```
05 Contact  (rail, unchanged)
                          [ sky · figure · free ]
Is there something                                  ← the hero's axis, left of the figure
that deserves its own experience?                     one statement, 1 : 0.88
─────────────────                                   ← Questions' closing rule, carried through
hello@chapterone.com    +351 910 000 000            ← the tagline's place
WHATSAPP · TELEGRAM
                                        YOUR CHAPTER ← the folio, in `I of III`'s corner
```

Measured at 1920 × 889: question 259–854 × 477–598 (55 / 48px), rule 259–723 at y619, folio right edge
1859, foot 838 — the same as state 01's folio.

## 2 · The two models, and they must not be mixed again

- **Scroll owns the passage** (`TIMING.environment.persisting`, the persist track): rows release →
  dusk to a 0.30 floor → the rule shortens in the dark → plates cross → camera returns (6%) with the
  dawn → the frame holds empty with one rule → `asks`.
- **A clock owns Contact** (`TIMING.contact.composes`, `play()` in `scroll-stage.tsx`, `data-contact`
  off/playing/held on `.publication`). Past `asks` it plays and holds; small reverse flicks hold; back
  past `empty.from` it releases all at once and replays on return. `--jhead`, `--jtell`, `--jres*` and
  `--jgo` are gone.

## 3 · Validation

| | |
|---|---|
| typecheck · lint | **pass** |
| build | **pass** — run on a temporary copy of the tree, because the dev server on :3000 was running |
| console | no `[motion]` assertions; two new ones guard the passage (camera stopped before the empty frame; rule resized before the plates cross) and one the trigger |
| 1920 × 889 | passage stepped frame by frame; play/hold/release/replay sampled with the scroll still |
| 1920 × 1080 · 1440 × 900 · 768 × 1024 · 390 × 844 | composed, no horizontal scroll, question clear of the figure; ≤ 820px lowers the rule to 610/760 |
| no scripting (`next start`, sandboxed frame) | Contact composed on paper, in flow |

**Not verified:** iOS Safari. Hover on touch is answered by `@media (hover: none)`, not tested on a device.

## 4 · Open

- WhatsApp / Telegram derive from the placeholder number `+351 910 000 000`.
- At 1440 the question is 36px — the room left of the figure allows no more at `--page-x` 246.

---

# Session handoff — 19 September 2026

**Scope of this session: the Method — its composition and its rhythm — and the environment from the
Method through Questions into Contact.** The film (states 01 → 09) and the Work were not touched, so the
C13 box under *7 September* below is still current for them. Read this section first; it is the newer one.

**Git:** nothing committed, staged or pushed. Every change is in the working tree.

---

## 1 · Current state

**About → Method is approved and frozen.** The passage — About's release, the light going down and back
up, the two studio plates dissolving — is not to be re-opened. Measured at 1920 × 889: About's
composition is gone 1,200px above the Method's top, the room lights over the last 600, and nothing of
the Method's own type exists before the section's top.

**The Method's environment is `method.png`.** It is a plate in the Environment (`.env-plate-method`,
beneath the studio plate) under a fixed veil of the room's ink (`.env-room`, driven by `--m-room-at`).
The section paints no ground of its own — a ground drawn on `.method`'s own box travels up the screen
over a fixed photograph, which is the fault that produced it.

**Method → Questions stays in the same room.** State 13 stands on the method plate (`spine.ts`), and
`TIMING.grounds` gives states 12 and 13 the same veil and the same ink, so **nothing at all changes
across junction 12 → 13**. This is a recorded departure from §2, which gives state 13 warm stone.

**Questions → Contact is where the environment changes.** The plates dissolve and the room's ink lifts
together, both on §8's own `persisting.crosses` window (`environment.ts` and `scroll-stage.tsx` read the
same two numbers). The warm-stone grade is retired for as long as state 13 is not on the hero plate.

**The main composition is three pieces, and they arrive in the order they are read:**

```
YOUR EXPERIENCE                          78px   About's headline scale
Built around what makes yours unique.    30px   About's principle register
What makes it yours?                     17px   About's reading register
```

Measured at 1920 × 889, `We stay close` and `Your experience` both land at **261 × 167** — same axis,
same vertical. The question is the only derived arrival in the section: it is chained off the stillness
(`gathered.holds`), because what was decided about it is that it is asked *after the room has spoken*.

**The ambient phrases stay when the composition arrives.** Nothing removes them; the only exit in the
section is the whole frame clearing at the end (`--mclear`), into the room Questions is written on.

**They arrive in three bursts, with different delays inside each and quiet between.** Measured at
1920 × 889, from the section's top:

```
   0 –  500   burst A · three phrases, arriving with the light
 500 –  900   YOUR EXPERIENCE, among them
1400 – 1800   burst B · two phrases
1800 – 2200   Built around what makes yours unique.
2400 – 3000   burst C · two phrases, the second margin note, the signed process
3000 – 3400   the room stands, nothing moves
3400 – 4000   What makes it yours?
4000 – 4400   the whole frame stands
4400 – 4600   it clears into the room
```

**The direction is good and the section is not finished.** What it wants next is small adjustments of
composition, spacing and rhythm — not architecture.

---

## 2 · Decisions that must not be reopened

- **Do not redesign About.**
- **Do not reopen About → Method.**
- **No white or paper ground in Questions.** It is read on the room, in light ink.
- **Do not clear the ambient phrases when the main composition appears.** They are the scene the
  composition is born among.
- **Do not return to the previous three-group system** for the field without an explicit reason.

---

## 3 · Next step

**Open the Method in Chrome and look at it before changing anything.** Then make small adjustments to
composition, spacing and timing only. Do not rebuild the architecture, and do not re-derive the
measurements above — they are in the table in §1.

---

## 4 · Visual context

The Method has to read as an **editorial continuation of About**:

```
We stay close
to every detail.
```

Axis, scale and the feel of the composition must dialogue with that screen. That is why the three
pieces are set at About's own ladder (78 → 30 → 17) on About's own axis and vertical, and why the
statement lands while the room is still filling rather than after it.

---

## 5 · Where this session's numbers live

- `TIMING.method.composed` — every arrival in the frame: the seven lines, the two margin notes, the
  signature, and the first two pieces of the main composition. The question is derived in
  `timeline.ts` from `gathered.holds`.
- `TIMING.method.resolve` — the question's own fade, and how long the finished frame stands.
- `TIMING.distance.method` / `methodBeats` — **540vh over 3.6 beats**; they move together or the price
  of a beat changes. A beat of this section is 150vh wherever you stand in it.
- `TIMING.grounds.states` — the veil and ink per state, including Questions standing in the room.
- `globals.css` owns every position and size (`.mmain`, `--m-main-y`, the seven `--wx/--wy/--wd`).

`timeline.ts`'s assertions now check the reading order of the three pieces and that the statement lands
before the room finishes filling. They fire in the console; take them seriously.

---

## 6 · Validation at handoff

| | |
|---|---|
| `npm run typecheck` · `npm run lint` · `npm run build` | **pass** |
| Console | **no `[motion]` assertions** |
| 1920 × 889 | measured frame by frame through the whole section |
| 1440 × 900 · 768 · 701 · 390 × 844 · 844 × 390 | geometry measured, no collisions — **before the last ordering pass**, which changed only arrival channels and no layout property |

**Not verified:** iOS Safari. The no-scripting pass against `next start` was not re-run this session;
the section's rest state is unchanged (`--mroom` is 0 without the driver).

---

# Session handoff — 7 September 2026

> ## ⛔ READ THIS FIRST — the canonical shape of the film
>
> **`docs/design/v2/implementation-reconciliation.md` § C13** is the current decision for junctions
> 04 → 09 and for state 09. It supersedes C12, C11 and C10 in full, and — where they disagree —
> `final-design-spec.pdf` §2, §3, §4 and §11.2.
>
> ```
> Chapter One → Chapter → II Philosophy → Every unforgettable moment deserves an experience.
>   → A wedding. → An artist. → A memory.
>     → the photograph, alone            ← no type of any kind
>       → the composition opens · the rail is written
>         → the Work
> ```
>
> **`A memory.` is the last typographic moment of the narrative.** After it the photograph holds on its
> own, the camera opens the frame, and the same photograph becomes the Work's first experience.
>
> ### The Work
>
> ```
> WHAT WE ACTUALLY MAKE        eyebrow · sans · uppercase · not the protagonist
> Wedding experiences          the category · serif · 38px · the protagonist · this is what changes
> See full experience →        a way IN, never a way forward
>                                            Raquel & Flávio          ← lower right, small
>                                            28 · 08 · 2027 — VENICE
> ```
>
> then, on its own clock: `Art experiences` · the Cibele photograph · `Cibele / Abstract / 2026 /
> Porto & Madrid`.
>
> **Scroll owns entry and exit of the section; the carousel is a clock** (`TIMING.work.carousel`,
> 9 seconds), gated on `data-work` and reset to `venice` on leaving. **No dots, pagination, thumbnails,
> cards or slider arrows.**
>
> ### Obsolete — do not restore, whatever an older document says
>
> - **`Some moments deserve another chapter.`** Removed from the copy, the markup and the stylesheet.
>   **Do not replace it with another conceptual line** — the photograph and the reframe do that work.
> - **`chapter` as an intermediate state**, and `chapter → Studio` by morph or any other mechanism.
> - **`Studio` as a display word** anywhere in this sequence. The name appears once: the Ledger's
>   running head `III — Studio`.
> - **`Wedding Experience` as state 09's 80px headline** — it repeated the category above it and covered
>   the couple.
> - **`Other experiences →`**.
> - **Scroll choosing the category.** `--make1..3` scrubbed by `--jp9` is gone.
> - **`Performances` / `Exhibitions`** as categories. Two experiences ship, both with real photographs
>   and real people; there is no third until there is a third project.
> - A blackout at the chapter turn, and a ground swap hidden inside it (C12, still true).
> - `--v2-handover` as a literal in `globals.css` (C12, still true).
>
> ### Approved departures from the Final Spec, all recorded in C13
>
> §2's states 06 and 07 carry **no type at all** · §2's state-09 board is re-composed · §11.2's plate
> count is **four**, because the Work's experiences need a ground of their own.
>
> ### Where the numbers are
>
> `TIMING.dock` — the camera, the light, the grade, the rail. **No type channels.**
> `TIMING.work` — `arrives` (the section's own entry), `release` (out before the ground crosses),
> `carousel` (the clock). `src/app/work-experiences.tsx` owns the clock and argues why it may have one.
>
> Everything below this box predates C13. Where it and C13 disagree, **C13 is current.**

---

## 6 September 2026 — historical, superseded in part by C11, C12 and C13

**This section is the state of the tree at the end of 6 September**, kept because its measurements and
its operating rules are still true. Read the box above first.

It **replaces** the handoff of 1 September. Where the two disagree, this one is current — most of all on
one point: the *"Chapter III entry / menu concept"* the old handoff reserved is **no longer reserved.**
The design owner opened it and it is built.

---

## 0 · Git — nothing was committed, staged or pushed

```
branch    master
HEAD      dc0ea5e  "CHAPTER III 1st DEMO TRY ABOUT 1st DEMO TRY METHOD 1st DEMO TRY"
```

**Every change is in the working tree only.** `HEAD` has not moved. The index does contain staged
entries — the `docs/design/archive/**` renames, the V2 package, the media moves — and those were
**already staged before this session began**. No file edited in this or the previous session was staged.

**Untracked files that have never been committed. Do not lose them; `git diff` does not show them:**

```
src/motion/timing.ts          src/app/states.tsx
src/motion/spine.ts           src/app/ledger.tsx
src/motion/environment.ts     src/app/environment.tsx
docs/development/03-choreography.md
docs/development/SESSION-HANDOFF.md   ← this file
prototypes/**                 ← all four prototypes, see §2
```

---

## 1 · The decision this session exists to record

**The design owner reviewed the build against three prototypes and chose `prototypes/promotion`
(3001) as the direction for junctions 06 → 08. It is now implemented in the main build.**

The full record is **`docs/design/v2/implementation-reconciliation.md` § C10** — read it before changing
anything in this stretch. It states what was adopted, the one place it contradicts §2, and what is still
open.

**The one contradiction with V2:** §2's exposure column for states 06 and 07 is re-authored — `0.13 →
0.62` and `0.48 → 0.74`, with 08 at `0.835`. State 09 keeps §2's `1` and is still the brightest state.
At `0.13` the plate is a texture rather than a photograph, and the line standing on it is about a
*moment*.

---

## 2 · The running applications

**`localhost:3000` is the main build.** `npm run dev` (Next 16.2.12, Turbopack).

**Four prototypes**, all static and outside the Next build. They are review harnesses, not the app:

```
node prototypes/server.mjs promotion      3001   ← THE CHOSEN DIRECTION. Do not edit.
node prototypes/server.mjs the-synthesis  3002   a blend of 3000 and 3001; rejected
node prototypes/server.mjs the-threshold  3003   a different art direction; not chosen
node prototypes/server.mjs the-index      3004   older, unrelated
```

`server.mjs` aliases `/media` onto `public/media`, so the prototypes use the real Venice plate. `H`
toggles the HUD in 3001, 3002 and 3003; `←/→` step.

### Operating rules that cost real time to learn

- **Never run `npm run build` while the dev server is running.** The production build writes into the
  same `.next` the dev server is reading and poisons it. Stop dev, build, `rm -rf .next`, restart.
- **Test the no-scripting version against `next start`, never `next dev`.**
- **Only the foreground Chrome tab animates.** Chrome suspends `requestAnimationFrame` in background
  tabs, so the driver stalls and `--state` freezes at 1. Opening 3001 beside 3000 freezes whichever is
  behind. This is the browser, not the build — but it makes side-by-side comparison misleading, and it
  makes *scripted* measurement of a background tab impossible (`await requestAnimationFrame` never
  resolves and the eval times out). **To measure 3000, close every other tab first.**
- **The input spring needs ~290ms to settle before a measurement is true.** `TIMING.input` smooths the
  wheel, so `scrollTo` then read-immediately gives the driver's *previous* position. Measured: at 90ms
  a sample had `j` going *down* while `y` went up. Anything under ~250ms produces phantom faults.

---

## 3 · What was implemented, this session and the one before it

All of it is junctions 06 → 08 unless stated.

### The promotion — `chapter` becomes `Studio`

- The survivor is promoted rather than joined by a numeral. The `chapter III` lockup is retired and the
  numeral is held back to the rail (`TIMING.dock.numeral`, now `[0.82, 0.84]`).
- The exchange is a fade out, a held frame and a fade in — `TIMING.dock.dip`, **100 / 30 / 100 px**,
  authored in pixels because a breath is a duration the hand feels. Measured overlap between the two
  words is **0px**.
- `Studio` is centred on its **ink mass**, not its box: `−0.0327em` / `+0.0397em`, from a canvas
  integration recorded in `states.tsx`. Do not re-derive it.

### The camera

`TIMING.dock.camera` — a push that begins only after the statement has been read, and a recompose that
opens the framing left. Scale `1 → 1.106`, translate `−0.5% → +1.3%`. Both clamp at `opens[1]`, so the
index draws onto a frame that has stopped. **It is added to §2's own 20% pan, not instead of it.**

### The exposure is a curve, not a column

`TIMING.dock.exposure`, five stops: held `0.62` → dip `0.52` → open `0.86` → settle `0.835`.
**A per-state column cannot say "dip"** — that is the whole reason this is not expressible in §2.

**`--film-at` is the gate, and it is load-bearing.** `j` is clamped, so without it the curve governs the
whole site: measured, the plate was pinned at `0.62` through junction 05 where the column asked `0.79`,
and pinned at `0.835` from junction 08 onward, so state 09 never reached `1`. The gate ramps the blend
in and out over the shoulder of the neighbouring junctions — the luminance needs no ramp (states 06 and
08 carry the curve's endpoints) but **contrast and saturation do**, or they step.

### The sentence

- **Consumed left to right**, and the full stop rides `another` rather than leading. The old
  right-to-left order put a word-shaped hole in the middle of the line: `Some moments deserve ⎵ chapter`.
- **The pair steps out and centres** — `TIMING.dock.pairs`, delta measured off the rendered line in
  `place()`. Without it `another chapter.` stands a quarter of the frame right of centre.

### The rail

- **The head is type — `III — Studio`.** The three drawn strokes, their measured cap height and
  character advance, the per-stroke falls, the stack and the reposition are all retired. It was a
  hamburger on a cinematic photograph.
- **`.v2-rail-grade`** — an 82° burn with the top eighth released, `TIMING.dock.grades`. Without it
  `Questions` and `Contact` sit on the sun's specular track on the water.

### The deck

Serif at 500 / `.075em` / full ink, at `31 / 52` of the card, with the veil behind it carrying the
deck's own wipe converted into its coordinates.

---

## 4 · Faults found and fixed — and the three that were my own measurement errors

| Fault | Fix |
|---|---|
| **The film's curve governed the whole site.** See `--film-at` above. State 09 never reached exposure 1. | Gated and ramped |
| **The sentence had a hole in the middle.** Right-to-left consumption took `another` second. | Left to right; the stop rides `another` |
| **The index never finished arriving.** `draws.at 0.962` + `4 × 0.005` + `0.028` = `1.010`, so the fifth row clamped and `Contact` stood at **0.71** of its ink for the rest of the film. The comment claimed the arithmetic closed; it never did. | `0.952`, the largest value that closes it exactly |
| **The pair travelled the wrong way** — sign error, the survivor ended 840px off | `-50% + pair-dx`, not `−` |
| **The pair was spent twice** | See below |

**`--word-dx` needs no compensation for the pair's travel, and assuming it did was the expensive
mistake.** The delta is latched *lazily*, on the first frame after `--settle` reaches 1 — long after
`--pairs` has finished — so it already measures from the slot as the line has carried it. Measured:
`--word-dx` is **6.64px** against the pair's **−425.94**. Subtracting the pair put the survivor 426px
right of the card.

**Three "bugs" that were faults in my own probe. Do not repeat them:**

1. Measuring `.v2-chapter` (which carries `1 − release`) instead of `.v2-chapter-word` (which carries
   `1 − goes`) and concluding both words were lit at once.
2. Sampling with 90ms waits — see the input spring, §2.
3. Reading `--i1..5` to decide whether the index is visible. **`--lindex` is the gate**, and it only
   opens at state 08. At `j = 0.95` the draw channels are complete and the index is still correctly
   hidden.

---

## 5 · Validation status at handoff

| | |
|---|---|
| `npm run typecheck` | **pass** |
| `npm run lint` | **pass** |
| `npm run build` | **not run this session** — dev was serving throughout |
| Console | **no assertion errors.** Only the documented `[junction]` INFO about the act offset |
| Geometry sweep, 33 points across the dock | **0 faults** — survivor lands on the card, `Studio` sits on its box, nothing clips, no overlap |
| Camera and exposure | sampled point by point against 3001; they match |
| 1920 / 388 | **pass** — head fits at 99px in a 376 frame, masthead re-checked with the new head |

**Not verified:** iOS Safari. And `npm run build` — run it before any release.

**The `data-gptw` hydration error in the console is a Chrome extension** writing on `<body>`, not the
app.

---

## 6 · Known issues that remain

1. **10px of horizontal scroll at 388.** Pre-existing — `env-plate-venice` is 120% wide by design and
   `v2-topic` overflows. Not caused by any of this work.
2. **Junction 13 is short.** Contact's whole arrival happens in the last ~1.5% of the document.
3. **11 → 12 has no survivor.** *yours* → *Your* should be one element crossing; today they are two.
4. **`.v2-work-label` duplicates `.v2-work-title`** on state 09 — the same string drawn twice.
5. **~35 junction ramps are still CSS literals** in `globals.css`. They are choreography and belong in
   `timing.ts` §8/§9. Move them as each junction is composed, not in one sweep.
6. **State 14's reachability** — deferred to the presentation rebuild, design owner, 29 August.

---

## 7 · The open question, and it is the design owner's

**Should §2's 20% pan stay now that the push is there?**

3001 never had the pan — only the push. The main build now carries **both**, and they compose well, but
the frame has more camera than either reference did. Reducing `--env-pan-throw` is the lever. Recorded
at the end of C10 and deliberately not decided.

---

## 8 · Recommended next steps

1. **Replay the whole homepage from the first frame** before anything else. The measurements say it is
   correct; they do not say it is good.
2. **Answer §7.**
3. **Run `npm run build`** — it has not been run since the camera, the exposure curve and the rail head
   went in.
4. Then the known issues in §6, cheapest first: the duplicated work label (4), junction 13's price (2).

---

## 9 · Where the numbers live

> **`src/motion/timing.ts` is the central choreography configuration for the whole site.**

- **`timing.ts` holds the numbers. `story.ts` holds the reasoning** and declares no number of its own.
- **A new animation is not finished until its parameters are in `timing.ts`**, and retiming one means
  editing it there. A duration, delay, hold, easing threshold or scroll distance written into a
  component, a stylesheet, the driver or a resolver **is a regression** — it defeats the ripple edit, it
  is invisible to `timeline.ts`'s assertions, and it makes the pacing unreadable.
- `docs/development/03-choreography.md` is the convention and the section index.
- Deliberate exceptions: **composition** (sizes, positions, coordinates) is `globals.css`'s; CSS
  transition durations come from `transitions.ts`; and the ~35 junction ramps in §6.5 are listed debt.
