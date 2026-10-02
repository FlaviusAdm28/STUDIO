# CHAPTER ONE — CURRENT STATE · session handoff — 1 October 2026, updated end of 2 October 2026

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
