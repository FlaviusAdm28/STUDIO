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
