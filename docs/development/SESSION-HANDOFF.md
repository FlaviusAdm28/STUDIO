# Session handoff — 28 September 2026

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

## 2 · Pending for the next session — in this order

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
