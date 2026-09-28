# Design V2 — implementation reconciliation

*The decision register for conflicts between the approved design (V2) and the build as it stands.*
*Opened 25 August 2026. Read `README.md` in this directory first.*

---

## Standing

**This is an active register, not an archive.** It records V2 reconciliation and engineering decisions
for the build, and entries in it are still open: consult it before implementing, and do not treat a
closed entry as a design source.

**It cannot override `final-design-spec.pdf`.** The PDF is rank 1 in `README.md`'s hierarchy and the
only written design authority. This file ranks below all four design references and holds no design
authority of its own: what it contains is either V2's own rule applied to the build, or an engineering
decision taken *within* the locked design, never a decision about what the design is.

**Where an entry records a past conflict, the resolved V2 decision in the Final Spec wins.** An entry
is a record of how the build came to disagree with V2 and what was done about it — it is not a standing
argument for the build's side. If this file and the Final Spec appear to differ, the Final Spec is
right and this file is out of date; report it rather than implementing against it.

Historical entries are kept as written, including the reasoning that was later overruled. That is the
point of a register.

## What this document is

The integrity audit found eight design contradictions between `docs/design/v2/` and the existing
project. This file turns those eight into a register: **C1–C8, one entry each, stating the V2 rule,
the existing project rule, why they conflict, and what kind of decision is outstanding.**

> **C8 is resolved — 25 August 2026.** Scroll owns progression; time owns only what the visitor did not
> cause. With it, C1's open question closed too: **the film/publication split does not survive as a
> narrative boundary.** One continuous spine, 01 → 14, one progression model. C4, C6 and C7 are
> untouched and still open; C7 is now the only entry waiting on a decision rather than on work.

> **C7 is resolved — 26 August 2026, by the design owner.** **1440 × 760 is the canonical design
> reference frame, not a production viewport**, and below it the implementation adapts the approved
> composition in a stated order of preservation — narrative meaning first, exact desktop coordinates
> last. With it, **no entry in this register is waiting on a decision.** C4, C5 and C6 are open work,
> not open questions.

> **The Environment contract is locked.** `final-design-spec.pdf` §11 — *Environment contract — two
> reconciliations* — closes the two ambiguities this register raised against C5: the state-09 boundary
> (§11.1) and the plate count (§11.2). It ends *"Nothing else is open. Thirteen junctions authored,
> twelve distinct verbs, fourteen states, all copy final."* C5's entry below is updated accordingly;
> nothing in C4, C6, C7 or C8 changed.

> **C1, C2 and C3 were resolved and implemented on 25 August 2026.** Their entries below are kept as
> written — the conflict each records is the reason the architecture is what it is — and each now
> carries a **Status** line saying what was built and what was deliberately left to C4–C8. C4 to C8 are
> untouched and still open.

**Nothing here is resolved unless V2 already resolves it.** Where an entry is marked
`DESIGN OVERRIDES EXISTING CODE`, that is not a judgement made in this file — it is V2's own standing
rule applied: *"Where an archived document and V2 disagree, V2 is correct and the archived document is
out of date."* Every other entry is left open on purpose. Do not implement against an open entry.

### The four classifications

| Classification | Meaning |
|---|---|
| **DESIGN OVERRIDES EXISTING CODE** | V2 states the answer. The existing rule is superseded and the code has to move. No decision is outstanding; only work. |
| **IMPLEMENTATION GAP** | V2 specifies something that simply does not exist in the build yet. No conflict of intent — an absence. |
| **OPEN DESIGN DECISION** | V2 does not decide it, or decides it inconsistently. Needs the design owner. |
| **TECHNICAL DECISION NEEDED** | V2 explicitly delegates it to engineering (`final-design-spec` §10, *"Implementation detail — engineering's call, within the locked design"*). Needs an engineering decision, not a design one. |

An entry may carry a primary classification and a secondary one; where it does, both are stated and
the part each governs is named.

### The canonical source has been read — 25 August 2026

**This limit is lifted.** When this register was opened, `final-design-spec.pdf` was ten image-only
pages that could not be read here, and every V2 rule below was quoted from `Final Spec - III
Studio.dc.html` inside `storyboard.zip`. That is no longer the case. The PDF was revised on 25 August
2026 to **twelve** pages and has been read in full: it still carries no text layer, but its pages
render to PNG with `npx pdf-to-img` (this machine has no `poppler`, so `pdftoppm` and `pdftotext` are
not available — `pdftotext` returns twelve form-feeds and nothing else).

**Rank 1 has now been checked against rank 2, and they diverge.** The canvas copy inside the archive
is the specification as it stood on 24 August; the PDF was revised on 25 August and the canvas was
not. The PDF governs. The canvas is superseded — see `README.md`, which records the four points on
which it is out of date, and which explains why the archive was deliberately not rewritten.

Every V2 rule quoted below has been re-read against the PDF.

---

## C1 — Section inventory: fourteen states specified, nine built

**The V2 rule.** §2 is a *"Complete chronological sequence"* of **fourteen states** with **thirteen
junctions**, each with a plate, an exposure, a Ledger condition and a type anchor: 01 Hero · 02 Chapter
II · 03 Philosophy · 04 Thesis · 05 The occasions · 06 Some moments · 07 Chapter III · 08 The Ledger ·
09 The work · 10 About · 11 Method · 12 Your experience · 13 Questions · 14 Contact.
`implementation-map.md` carries the same fourteen and the same thirteen junctions.

**The existing project rule.** The homepage is *"a film and then a publication"* — Chapters I–III as
one continuous shot in two pinned frames, then the studio's own pages in ordinary flow. What V2 calls
states 02–06 are **beats inside Chapter II** in `src/motion/story.ts`, not states with junctions
between them. Built as named things: hero, Chapter II, Chapter III's act, About, Method, Questions,
Contact — nine of the fourteen. **Thesis (04)**, **The Ledger (08)** and **Your experience (12)** do
not exist in any form.

**Why they conflict.** Two different units of composition. V2's unit is the *state*, and its grammar
lives in the thirteen junctions *between* states — each junction carries one element across (C4). The
build's unit is the *beat*, and its grammar is a beat's relationship to the beat before it inside one
pinned frame. Promoting five beats to five states is not a re-timing; it changes what the piece is made
of, and it is upstream of C2, C3, C4 and C8.

**Classification.** `DESIGN OVERRIDES EXISTING CODE` for the inventory and the order — V2 §2 states
them and `implementation-map.md` indexes them. `IMPLEMENTATION GAP` for the three unbuilt states, each
of which V2 specifies completely enough to build (subject to C2 and C3).

> **Decided, 25 August 2026 — the film/publication split does NOT survive as a narrative boundary.**
> This entry recorded it as the largest open scope question. The answer is that V2's sequence runs
> unbroken from 01 to 14 and the build must too: **one continuous narrative spine, one progression
> model, one scroll position.** The split may survive as a *change of register* — type that speaks
> becoming type that disappears, ordinary flow, reading size — but not as a boundary in the sequence,
> and not as a second runway. Internal components and files may stay separate where that is
> technically useful; they may not create competing progression models. Settled with C8.

**Status — implemented, 25 August 2026.** `src/motion/spine.ts` holds `states[14]` and `junctions[13]`,
transcribed from V2 §2 and §3, with every state associated to the `story.ts` beats that already compose
it and `timeline.ts` resolving each state's entry from an existing span — not one timing was authored.
Thirteen of the fourteen states already had material; the audit's *Thesis unbuilt* was wrong, and only
state 08 has no composition of its own. `composed: false` and a `note` record what each unfinished state
still owes, which is C4's or C5's work in every case. **The film/publication split is unchanged** — the
spine spans it, which is what turns it into a pricing boundary rather than a narrative one.

---

## C2 — The Ledger has no place to land

**The V2 rule.** §6: *"A single persistent rail, 132px, present from state 08 onward and never
re-created."* It carries the three-stroke mark, the chapter numerals I / II / III, the five
destinations and an optional note, with parameters `ink`, `exposure`, `active`, `chapter`, `revealed`,
`unlit`. The rail is padded from `x38`. **Rule length encodes depth** — the active destination's leader
is longest; unvisited destinations show no rule at all. State 08 draws the index out of the numeral top
to bottom, WORK lit first, by the `decompose` verb (2.90s). And §6's last clause: *"The Ledger is the
door. The route into Work is an aside carried on the leader rule, and it is reversible: leaving Work
returns the rail to the state it was in, with the film still running."*

**The existing project rule.** There is no rail. Chapter III's masthead is the marker the travelling
word became, standing in the page's own head margin; navigation is `where` in `content/site.ts` — five
destinations of two kinds (`studio` and `work` are positions in the film; `about`, `faq` and `contact`
are sections of the publication), with the `#` written on one side and the `id` on the other.
`CLAUDE.md` also forbids inventing a navigation entry.

**Why they conflict.** V2's five destinations are *Work · About · Method · Questions · Contact*. The
build's five are *studio · work · about · faq · contact*. The counts match and the sets do not: V2
gives **Method** a destination, and the build states *"there is no destination for the method on
purpose"*; V2 has no `studio` destination; `faq` and *Questions* are the same section under two names.
Beyond naming, the rail is a persistent stateful element spanning states 08–14, which the current
architecture has nowhere to put — it crosses the film/publication boundary that C1 leaves open.

**Classification.** `IMPLEMENTATION GAP` — V2 specifies the Ledger completely and nothing corresponds
to it; this is an absence, not a disagreement. `DESIGN OVERRIDES EXISTING CODE` for the destination
set, including Method's destination, which V2 restores.

> **Not decided here:** the rail below the reference frame. §10 lists *"Mobile placements for the
> Ledger rail, the Hero time and the Questions rows"* as **not yet designed at any breakpoint** — C7.

**Status — implemented, 25 August 2026.** `src/app/ledger.tsx` is one persistent rail carrying the mark,
the chapter ticks and V2's five destinations, each with a leader rule whose length encodes depth. The
masthead is gone, and `mark.nav`, `#work` and `--work-at` with it. Work is an aside and not a
destination: one boolean, published as `data-aside`, with the register drawn out of the margin along the
rule and the film dimmed two stops beneath rather than replaced. `where` is section ids only now.

**Left open on purpose.** The rail's ground is still the measured paper band of `decisions.md` §47; V2 §6
replaces it with ink that crosses with the ground, which is C5. The 132px column and the 520px register
are V2's own numbers, but the rail's padding stays `--mark-x` rather than §5's x38 — the travelling word
still lands on the mark, and C7 has the reference frame open. **Below 900px the rail lies down into the
masthead's old composition, preserved rather than designed** (§10: mobile placements *not yet designed at
any breakpoint*). Two behaviours are not built, both C4: pointer-proximity intent at 230px, and the 2.90s
decompose that draws the index.

---

## C3 — "Your experience" is the entry the build removed

**The V2 rule.** State 12, *Your experience*, sits between Method and Questions: `studio` plate,
exposure `.20`, *"104px serif, x196, y262 — largest type on the site"*. Copy (§4): **"Your
experience / Built around what makes yours unique."** It is the far side of junction 11 → 12, verb
`survive`: *"One word survives the question and is still in the answer: yours → Your. The field
converges into one line."*

**The existing project rule.** `CLAUDE.md`: *"The work is **one** experience… a second experience is a
second act and a brief rather than an entry"* (archived `decisions.md` §46). `content/site.ts:253`
records a section removed on the same grounds — *"Chapter III is the last chapter. Nothing replaces
this, and nothing should"* — with the copy kept in `archive/design/copy-drafts.md`.

**Why they conflict.** Nominally: V2 adds a state where the build deliberately removed one. The two
may not actually be the same object — the removed section announced a *second piece of work*, while
V2's state 12 is the **answer to the Method question**, the resolution of `yours → Your`, and adds no
second project. But the objection on record is doctrinal (*no second entry*), it is stated in
`CLAUDE.md` as a rule rather than as an observation, and it currently reads as forbidding V2 state 12
by name.

**Classification.** `DESIGN OVERRIDES EXISTING CODE`. The objection lives in
`archive/design/decisions.md` §46 and in `CLAUDE.md`'s account of the pre-V2 build; V2's own rule is
that an archived document does not override it. State 12 is in the approved sequence, in §4's copy and
on both ends of a locked junction (§10 does not list 11 → 12 as open).

**Status — confirmed as V2 state 12, 25 August 2026.** No redesign, and nothing in the method was
touched. The state is named in the spine, its Ledger stays on **Method** exactly as §2 has it, and the
`yours → Your` convergence is the existing `--mgather` machinery, untouched. The survivor is still two
elements rather than one; it cannot become one until V2's state 11 copy lands, and the junction record
says so.

---

## C4 — The motion laws are head-on incompatible

**The V2 rule.** §1, three laws:

1. **Release in place** — *"Before any move, the outgoing state falls to zero where it stands. Nothing
   translates out, nothing slides, nothing reflows."*
2. **One element survives** — *"Each junction carries exactly one element across and repurposes it — a
   numeral, a word, a rule. The survivor is never re-created."*
3. **Exposure carries continuity** — *"Grounds change by grade on one photograph, never by swapping a
   background."*

Plus a **verb ledger**, *"no mechanism is used twice for its primary effect"*: `displace ·
displace-and-inherit · expand · accumulate · change register · decompose · lift · superimpose ·
extinguish · survive · relight · persist` — twelve verbs across thirteen junctions, plus the reversible
Work aside. And literal travel: 02 → 03, *"II travels 196px left and 'Philosophy' inherits the
coordinate it vacated, x756. Moves overlap. The grammar every later junction obeys."*

**The existing project rule.** `CLAUDE.md` Conventions: *"Motion is opacity and one curve. Nothing
travels, scales, blurs or reveals letter by letter."* `src/motion/` implements exactly that — one
curve, opacity only, with two stated exceptions in the whole piece (the travelling word, and the
object crossing in Chapter III's act).

**Why they conflict.** V2's law 1 and the build's convention agree about *releases* and disagree about
everything else. V2 requires arrivals that translate, inherit coordinates, overlap, decompose,
accumulate, superimpose and converge, and requires **twelve distinct mechanisms** where the build has
deliberately reduced itself to one. This is not a difference in values; it is a difference in what a
transition is. It decides whether `story.ts`, `timeline.ts` and `scroll.ts` survive V2 or are replaced.

**Classification.** `DESIGN OVERRIDES EXISTING CODE`. §1 and §3 are locked in §10 (*"Sequence · 14
states"*, and each named junction listed *Locked — design closed, do not revisit*). The opacity-only
convention is a build convention recorded in `CLAUDE.md`, not a brand rule from `docs/brand/`, and V2
supersedes it.

> **Delegated, not decided:** §10 grants engineering *"easing curves not quoted here… unquoted
> intermediate curves are yours, provided nothing translates during a release"*, and the
> reduced-motion path (*"hold each state and cross the exposure only"*). Those are C8's business.

---

## C5 — Ground and light system

**The V2 rule.** Law 3: *"Grounds change by grade on one photograph, never by swapping a background.
Three plates carry all fourteen states."* §2 gives a per-state exposure column (`.50 · .35 · .10 · — ·
— · .13 · .09 · .19 · 1.00 true · 1.02 · .12 · .20 · ground 160–171 · .72`) and a stated light shape:
*"01 dusk → 03 trough → 06–07 warm dark → 09 peak, true exposure → 11 deepest value on the site → 13
first light → 14 dawn threshold."* §5 fixes the colour: warm dark grounds `#050504` → `#060605`, light
ink `#f2ece0` / `#fdf6e8` / `#f7efe2`, warm stone at ground values `160–171` with R−B `+26`, ink
`#171613`, worst case `7.15 : 1`; gold `#c9a86a` is documentation only and does not ship. And the
video: *"One element, mounted at the Hero, **never unmounted, never re-sourced, never display:none**.
Sections change its grade, its transform and its playbackRate — nothing else."*

**The existing project rule.** Four grounds, not one graded plate: the hero's video, the film's black,
the publication's `--paper` / `--ink`, and the method's ink room — which `CLAUDE.md` permits as *"the
only exception there is"*, explicitly forbidding the publication a second ground. Chapter III's room
takes its colour from `work.colours` via three gradient fields, and its centre is a live `iframe`
device, not a plate. Colour tokens are declared in `globals.css` and no exposure model exists anywhere.

**That device is now a violation rather than a difference.** §11.1's implementation rule is explicit:
*"no second surface, no iframe, no additional media element… A work surface that replaces the
environment — or an environment paused, hidden or re-sourced to make room for it — breaks the law and
the 08 → 09 lift together."* The live work belongs in the Work aside, above an environment that keeps
running beneath it.

**Why they conflict.** V2 replaces the ground model wholesale: one continuously graded photographic
element from state 01 to state 14, where the build has four separate materials whose separateness is
the argument. The `never unmounted` clause also constrains Chapter III directly — the current act
mounts a device, and the current publication has no video in it at all.

**Classification.** `DESIGN OVERRIDES EXISTING CODE` for the light system, the exposure column, the
single-video rule (§10: *"Type, colour, grid, light — Two families, two grounds, one video"*, locked)
**and, since 25 August 2026, the whole Environment contract of §11** — the plate count, the state-09
boundary and the never-unmounted rule are all locked and none of them is a decision any more.

> **Closed by §11.2, 25 August 2026 — the locked Environment contract.** This entry recorded that law
> 3 said three plates while §5 named four, and left the count as an `OPEN DESIGN DECISION`. The PDF now
> answers it: *"Three plates ship: `hero`, `venice`, `studio`."* Warm stone at state 13 is **the hero
> plate's own sky band**, enlarged and graded to ground values 160–171 with R−B +26, desaturated and
> near-still — *"never as its own asset."* §2's row for 13 now reads `hero · sky band, graded`, §5 lists
> three with the derivative named, and §10's open production-plates item lists three.
>
> **`dawn_warm.png` must not be referenced in production code.** It is *"a derivative, not a source"* —
> a pre-rendered still kept as a storyboard convenience. §11.2 states the consequence of getting this
> wrong: *"If warm stone loads as a separate image, states 13 and 14 become a swap and the locked
> 13 → 14 mechanism is void."* The storyboard already read it this way before it was canonised —
> *"`assets/dawn_warm.png` is the same hero sky band relit warm: mean 139, R−B +16"* — which is why
> §11.2 rules that the storyboard needs no correction.
>
> **One thing here is still open and it is smaller than it was.** §2 gives states 04 and 05 grounds
> (`none · #060605`, `none · #050504`) rather than plates, and §5's ranges assign `hero` to 01–04 while
> naming no plate for 05 at all. Whether those two frames are a plate at zero exposure or a ground with
> no plate is not stated. It is a detail of the light system rather than a count, and it belongs with
> the rest of C5.

---

## C6 — The typeface is specified in V2 and still open in the repo

**The V2 rule.** §5: *"Two families, no others."* **Cormorant Garamond 300** for every statement —
104px (About, Your experience), 96px (Chapter One), 92px (Contact), 80px (the work), 64px (thesis,
Questions heading), 62px (Method), 52px (Some moments), 46px (second principle), 31px (question rows),
21px ("Tell us about it."). **Schibsted Grotesk** for every label and micro-caps: 16–17px body,
11–12.5px chapter lockups at `.42em`, 9–10px marks at `.20–.34em`. *"Monospace never ships — it is
storyboard annotation only."*

**The existing project rule.** The typeface is an **open question**. `docs/brand/open-decisions.md` §7
is unanswered; `globals.css:63` declares nothing and says so (*"Undecided. `open-decisions.md` §7 is
still open, so nothing here pretends otherwise"*); the type stack is the system stack; and `--read` is
deliberately named apart from `--voice` so that choosing a reading face cannot silently retype the hero.

**Why they conflict.** Not a disagreement about which faces — a disagreement about whether the question
is answered. Every V2 type anchor (`96px serif, x196, baseline y462`) is unbuildable while the repo
holds the face open, and the `--read` / `--voice` separation exists to protect a decision V2 has now
made in one place for both.

**Classification.** `DESIGN OVERRIDES EXISTING CODE`. V2 §5 states the answer and §10 locks it.
**This closes `open-decisions.md` §7** — the one open question in `docs/brand/` that V2 resolves.
`open-decisions.md` is live and governs V2, so it should be updated to record that §7 is answered and
by what; that edit is not this register's to make, and `docs/brand/` is locked.

> **Consequence, not decided here:** the `--read` / `--voice` split still has work to do — V2 assigns
> Cormorant to the film *and* to About, Questions and Contact, which is the exact coupling the split
> was built to prevent. Whether the two variables survive as one face in two roles is a build question
> once the faces land.

---

## C7 — Coordinate authority

**The V2 rule.** *"Coordinates are given in the storyboard's **1440 × 760** reference frame and scale
linearly to the production canvas."* `x196` is the type margin, `x38` the Ledger rail, right margin 196
for body measures and 38 for corner marks; chapter origins `x756` (II) and `x752` (III); Questions rows
76px on 1px hairlines at `212 / 289 / 366 / 443 / 520 / 597 / 674 / 751`; Contact writing line `y529`;
the Hero time at `right 104 · top 196 · box 520 wide`. Everything in the spec is authored in px on that
frame.

**The existing project rule.** Four viewports are mandatory — 1920×1080, 1440×900, ~768, ~390 portrait
— and *"never assume desktop scales."* Line breaks are authored **for 320, not for 1440** (measured:
0.476em glyph width at weight 300, so a display line over 24 characters wraps on a 320 frame). The
method's word coordinates are **fractions of the frame**, not `vw`/`vh`, because the frame is the
viewport less the head margin. Chapter III's composition is solved from one rectangle's height and one
column's width for exactly this reason.

**Why they conflict.** *Scales linearly* is the failure mode the four-viewport rule was written
against. At 390 wide, a linear scale of the 1440 frame puts the type margin at 53px, the Ledger rail at
36px and the question rows at 20.6px — and the 24-character display line becomes an accident. The two
rules cannot both hold.

**Classification.** `OPEN DESIGN DECISION`. V2 does not resolve it: §10 lists *"Mobile placements for
the Ledger rail, the Hero time and the Questions rows — **not yet designed at any breakpoint**"*, and
the linear-scale clause is stated for *"the production canvas"*, which is a desktop-width statement
rather than a breakpoint policy. **Nothing below the reference frame is designed.** Do not derive it;
it needs the design owner.

> **Decided by the design owner — 26 August 2026. C7 is closed.** The entry above is kept as written;
> the conflict it records is real and the resolution is what follows. **1440 × 760 is the canonical
> design reference frame — a coordinate and composition system, and nothing else.** It is *not* a
> required production viewport, not a minimum supported viewport, not a fixed browser resolution and
> not a production aspect ratio. This is the clause C7 could not settle: *scales linearly to the
> production canvas* describes how the approved desktop composition was authored, not a breakpoint
> policy, and it was never a licence to scale the frame down a phone.
>
> **Desktop is the visual authority** for composition, hierarchy, typography intent, spacing
> relationships, transition meaning, and environment and light treatment. Where a real viewport cannot
> accommodate a desktop coordinate, size or composition, **the implementation adapts it** — it does not
> blindly preserve the geometry.
>
> **The order of preservation, and it is an order:**
>
> | | Preserve | |
> |---|---|---|
> | 1 | narrative meaning | first, always |
> | 2 | visual hierarchy | |
> | 3 | transition mechanism | |
> | 4 | typography hierarchy | |
> | 5 | spatial relationships | |
> | 6 | exact desktop coordinates | **last** — the first thing to give when the viewport cannot hold it |
>
> **Mobile adaptation is an implementation requirement, not a new design direction.** It may not invent
> a different visual language for narrow screens, redesign a section arbitrarily, alter the approved
> desktop composition, create a second mobile concept, or drop a narrative beat to make a layout fit.
>
> **Where V2 marks something *"not yet designed at any breakpoint"*, adapt conservatively from the
> desktop intent.** The absence of a mobile design is not permission to invent a visual system. Prefer
> preserving hierarchy, preserving anchors, preserving transition meaning, simplifying geometry only
> where necessary, and holding legibility and interaction. This is the standing answer for §10's three
> named gaps — the Ledger rail, the Hero time and the Questions rows.
>
> **Validation viewports.** 1440 × 760 is the design reference and remains the visual authority. The
> rest are implementation validations: 1440 × 900 and 1920 × 1080 desktop, 768 × 1024 tablet,
> 390 × 844 narrow mobile. Every major state and every junction, at each of them.
>
> **An implementation is incomplete if the desktop is correct and a narrow viewport clips content,
> overlaps, becomes unreadable, scrolls horizontally when it should not, breaks an interaction, breaks
> the narrative sequence, or renders a transition meaningless.** Responsive behaviour is part of the
> implementation and never optional polish.

**What this settles, and what it legitimises.** The two rules C7 said *cannot both hold* now hold in
sequence rather than in competition: the 1440 frame is authority for composition, the four-viewport
rule is authority for what ships, and the priority order above is the joint between them. Three things
the build already does stop being conflicts and become the rule stated:

- the method's word coordinates as **fractions of the frame** rather than `vw`/`vh`;
- display line breaks **authored for 320, not 1440** (the measured 24-character limit);
- Chapter III's composition **solved from one rectangle's height and one column's width**.

C2's *"below 900px the rail lies down into the masthead's old composition, preserved rather than
designed"* is likewise compliant as it stands — it preserves hierarchy and anchors and invents nothing.
It is now a conservative adaptation on purpose rather than a gap waiting on C7.

**Still V2's own, and not closed by this:** the *designed* mobile placements for the Ledger rail, the
Hero time and the Questions rows. This decision says how to proceed without them; it does not draw
them. If the design owner later draws them, they supersede whatever was adapted conservatively.

---

## C8 — Timing authority, and what drives each junction

**The V2 rule.** Absolute clock values are quoted inline and, where quoted, fixed: 01 → 02 `3.40s`,
05 → 06 `4.20s`, 07 → 08 `2.90s`, 13 → 14 `3.60s`, state 07 *"held 2.8s"*, and §8's beat sheet for
Contact — *"0.40s release in place, 900ms, 40ms stagger… 2.20s environment lands and **holds empty for
300ms**… 2.90s rule shortens and thins… Total 3.60s."* The Hero time: *"in 1.20s → 1.90s, opacity
only."* §10 then delegates: *"Scroll-vs-timeline driving of each junction, and the input threshold that
starts it"* is **engineering's call, within the locked design** — as are unquoted intermediate curves
and the reduced-motion path.

**The existing project rule.** `docs/development/02-motion-system.md` and `CLAUDE.md`: every timing is
a per-beat object in `src/motion/story.ts` stating its *relationship* to the beat before it; only
anchors carry an absolute; *"never hardcode a duration, delay, easing or threshold anywhere else, and
never write an absolute you could derive."* Three runways of scroll, numbered separately, with a beat
of the film priced at ~55vh and a beat of the method at 40. Chapter I's opening is the one clocked
thing on the site.

**Why they conflict.** Less than the others, and differently. The *architecture* is compatible — V2's
quoted seconds become anchors `story.ts` carries, which is what `story.ts` is for. What V2 does not
address is the **scroll-versus-clock split**: its junction model is written in seconds throughout,
while the build converts almost everything to distance and treats a clocked value after Chapter I as a
defect. Three runways and their per-beat prices have no counterpart anywhere in V2, and §10 hands the
question back rather than answering it.

**Classification.** ~~`TECHNICAL DECISION NEEDED`~~ — **RESOLVED**. V2 §10 delegated it explicitly
(*"Scroll-vs-timeline driving of each junction, and the input threshold that starts it"*), and it was
settled on 25 August 2026 as the hybrid model below. `DESIGN OVERRIDES EXISTING CODE` still holds for
the quoted durations: where V2 names a time, that time is the source — now as a weight rather than a
duration wherever the junction is scroll-caused.

**Status — RESOLVED, 25 August 2026. The hybrid model, under one rule:**

> ### Scroll owns progression. Time owns only what the visitor did not cause.
>
> Not a compromise between two systems — a causality test with three outcomes, and every timing in the
> project resolves to exactly one of them.

**Time owns three things, and nothing else may hold a clock.**

| Clock | Why it is time and not distance |
|---|---|
| `chapterOneStory` — the Hero's arrival | Time is the causal agent because nothing has been caused yet. Existing arrival timing is unchanged. Scroll *hurries* it and can never skip it. |
| `WORK_IS_AN_ASIDE` — 1.30s out, 0.90s back | Visitor-caused and **off-runway**: it happens over whatever frame is showing. Clocked for its own reversible open/close choreography only. |
| Interface response — `navHover`, `answer`, `about`, `work.arrives` | Input-caused. A question opening must answer the press, not depend on where the page is. |

Anything else asking for a duration is in the wrong category and is re-tested against the rule.

**Scroll owns everything else.** Progression through the fourteen states is driven by **one continuous
scroll position `p`**, spanning 01 → 14. `p` does not begin until `data-opening` reads `done`.

**Quoted V2 seconds become authored relative weights.** Where a junction is scroll-caused, §3's seconds
are the unit of *proportion*, not of duration: 01 → 02 at `3.40s` and 07 → 08 at `2.90s` occupy scroll
distances in that ratio, resolved through one conversion constant. **Seconds are how the designer
expressed relative weight; distance is what ships.** Timings still live in `story.ts` and `spine.ts` and
nowhere else — that rule is untouched.

**Thirteen independent timelines are forbidden.** A junction is `{ from, to, verb, survivor, weight }`
resolved onto `p`. There is one progression model, not thirteen.

**Why not the alternatives.** *Fully scroll* has no way to run the Hero, which must play on arrival
before anything has been scrolled, and no home for the off-runway aside. *Fully clock* has to build
explicit reverse playback for thirteen junctions across twelve mechanisms, gives the Ledger a playhead
to track instead of a position to read, turns §10's reduced-motion path — *"hold each state and cross
the exposure only"* — into thirteen rewritten timelines, and needs the *"input threshold"* §10 only ever
hypothesised. Under scroll, reversal is correct by construction, the Ledger is a projection, reduced
motion is one switch, and no threshold exists because position is the input.

**What this obliges, and it is the real work:** the three separately-priced runways collapse into one
continuous position. **A runway boundary may never fall inside a junction** — a survivor has to cross
it. Files may stay separate where that is useful; they may not create a second progression model.

> **Prototype 13 → 14 first.** It is the most timeline-shaped thing in V2 — nine cues, a 40ms stagger, a
> 120ms stagger and *"holds empty for 300ms"*. As distance the empty hold becomes a stretch of scroll a
> visitor can dwell in, which is arguably stronger than what was asked for; the staggers are ~1.5vh
> each. If a stagger reads wrong in practice the fallback is narrow and is written down now rather than
> improvised: **a stagger among sibling elements may be clocked once its junction has been entered by
> position, provided its total is under ~200ms and it cannot leave a partial state on reverse** — that
> is a response, not a progression. If 13 → 14 holds as distance, every other junction holds trivially.

---

## C5 / C6 preflight — the last four decisions, closed 27 August 2026

*Four questions stood between the closed register and the start of C5 and C6. The design owner answered
all four on 27 August 2026. **Nothing here is implemented** — this section records decisions and the
evidence they were taken against, and C5 and C6 remain unstarted work.*

Two of the four are design intent stated by the owner and recorded verbatim; two are engineering
decisions taken *within* the locked design, which is all this register is ever allowed to hold. Each is
marked.

### P1 — State 08, the Venice pan · **CLOSED** · design intent

**The decision.** State 08 pans the `venice` plate **horizontally**, at a **20% target magnitude at the
canonical design reference frame**. The semantic direction is **away from the canal**, from §3's 08 → 09
mechanism — *"the frame pans off the canal."* The physical left/right is **derived from the asset's own
composition and is never invented**.

**Derived, and here is the derivation.** `public/media/projects/venice/venice.png`, measured by column
profile of the decoded PNG.

> **The plate was replaced on 27 August 2026, after this entry was first written, and the derivation was
> re-run against the file that ships.** The first master was a gondola on the basin at San Giorgio
> Maggiore with the couple facing the camera; it is kept as `venice_old.png`. What ships is the Grand
> Canal at Santa Maria della Salute at sunset. **The direction is unchanged and the evidence for it is
> stronger** — and the replacement closes the consent question this entry recorded, because the two
> figures in it are walking away and carry no likeness.

| feature | measured |
|---|---|
| the sun, low over the canal | brightest block **mean L 242 at plate x 0.102, y 0.211** |
| brightest eighth of the frame — the lit water and sky | **x 0.12 – 0.25**, mean L 126 |
| open canal and the sky over it, as a fraction of each column | **48 – 70% across x 0.00 – 0.56**, then 13% · 0.3% · 0.5% · 12% · 15% · 18% · 0% |
| the water surface itself (y 0.44 – 0.72) | peaks **60.7% at x 0.38 – 0.44**, essentially zero past x 0.75 |
| darkest eighth of the frame — the quay and the palazzo wall | **x 0.62 – 0.75**, mean L 21 |
| the two figures, walking away | inside that dark band, x ≈ 0.56 – 0.81 |

The canal — the water, the sun on it, the moored gondolas and the Salute above them — is the **left** of
the plate; the quay, the architecture and the figures are the **right**, and they are five times darker.
Therefore **the frame travels rightward across the plate and the plate translates left.**

Checked against the alternative rather than asserted — three 80%-wide windows over the whole frame:

| 80%-wide window | mean L | canal + sky |
|---|---|---|
| **frame pans left** — window x 0.00 – 0.80 | 82.8 | 42.3% |
| no pan — window x 0.10 – 0.90 | 74.1 | 37.6% |
| **frame pans right** — window x 0.20 – 1.00 | **60.6** | **30.3%** |

Panning right takes the canal out of frame; panning left walks *into* more water and more moored
gondolas, and the mechanism would read as its own opposite.

**The magnitude does not move, and the responsive rule already covers what happens when it cannot be
paid.** C7, closed 26 August 2026: where a viewport has insufficient geometric room for the full 20%,
**adapt conservatively — the maximum available pan, preserving visual hierarchy and focal subject.**
That is the closed rule applied, not a new one. **20% is not to be replaced with a different desktop
value.**

**The room is genuinely short, and C5 solved it by manufacturing the room.** The plate is 1536 × 1024
against the 2560 minimum its own specification asked for, and at the 1440 × 760 reference frame `cover`
scales it to 1440 × 960 — the width fits *exactly* and there is **no horizontal slack at all**. C5 gives
the venice layer a width of `100% + 20vw` and translates it by the same distance, so the pan always has
precisely its own 20% to travel and C7's *maximum available* clause never has to bind at any viewport.
The cost is a resample of a 1536px source — about 1.13× at 1440 and 1.5× at 1920. The 20% did not move.
`public/media/projects/venice/README.md` carries the full measurement.

### P2 — `playbackRate` · **CLOSED** · implementation rule within the locked design

**The decision.** **`playbackRate = 1` by default, for every state.** No state-specific `playbackRate`
value is authored by the design, and none is to be invented.

**State 13 in particular.** §11.2 describes warm stone at 13 as the hero plate's own sky band *"enlarged
and graded to ground values 160–171 with R−B +26, desaturated and near-still."* **Near-still is reached
by the approved environment treatment — exposure, transform and crop — and not by slowing playback.** A
slow-motion value at 13 would be an invented design decision wearing an implementation's clothes.

This sits inside C5's own quotation of §11.1, which lists `playbackRate` among the three things a
section may change: *"Sections change its grade, its transform and its playbackRate — nothing else."*
The permission exists in the contract; the design exercises it nowhere, so the value is 1 everywhere
until the design says otherwise. `playbackRate` appears nowhere in `src/` today.

### P3 — About composition, state 10 · **CLOSED** · design intent, from the Final Visual Master

**The decision.** State 10 About uses the **Studio environment plate** at
`/public/media/studio/image19aug26.png` (1536 × 1024). The About typography sits **above** it. There is
**no independent photograph inset, no `.about-frame`, and no surviving second image layer.** The
approved Final Visual Master composition is preserved.

**The anchors, and they are in the master.** Read from `Final Visual Master - III Studio.dc.html`
inside `final-visual-master.zip`, the state-10 board, on the 1440 × 760 frame:

| element | value |
|---|---|
| headline | 104px Cormorant Garamond 300, **x196**, y126, 900 wide |
| its paragraph | 16px, x200, y376, on a **474** measure |
| second principle | 46px Cormorant Garamond 300, **x838**, y496 |
| its lines | 14.5px, x841, y576 |
| hairline | **y452**, from x838 to the right edge, `rgba(239,233,220,.15)` |
| Ledger | exposure **.58**, `About` active |

The master's own annotation states the intent: *"Two typographic groups, staggered and unequal:
headline 104px at x196 with its 16px paragraph on a 474 measure, second principle 46px at x838 with
14.5px lines beneath it, hairline at y452."*

**The plate is the environment and it is full-bleed.** The master draws it as `object-fit: cover`,
`object-position: 52% 50%`, `brightness(1.02) saturate(.9)`, under a 94° gradient and one warm radial —
a graded ground behind type, which is exactly Law 3 and exactly §11.1's never-unmounted element. It is
not a picture placed in a column.

**This supersedes the existing About implementation.** `src/app/publication.tsx` renders a
`<figure className="about-frame">` holding a `next/image` inset, and `globals.css` styles it. Under the
Final Visual Master that figure, its styles and the second image layer all go. **Not done here — C6.**

**It also closes half of documentation blocker 5.** The master's own amber note reads *"The studio still
is the weakest plate (455 × 302) — states 10–12 need the real still or master footage before visual
QA."* `image19aug26.png` at 1536 × 1024 **is** that still, it is already in the repo and it is already
referenced by `about.portrait`. The storyboard-grade `studio_about.png` must not ship.

> **Two things C6 will meet, neither of them a decision and neither taken here.** The master's About
> copy — *"We stay close to every detail."* / *"Built exclusively for you."* — is not the copy in
> `site.about`, which is a first-person narrative. And the master's gradient is darkest at the left,
> where the 104px headline sits, while `image19aug26.png` carries its lamp and its subject left of
> centre. Both are composition work against the locked master, to be resolved when C6 runs.

### P4 — The Venice project binding · **CLOSED** · done, and it is the only code change in this pass

`projects.venice.plate` in `content/site.ts` was `null` — a composed absence, because the plate had not
been produced. The production plate now exists, so the record states it:

```
plate: '/media/projects/venice/venice.png'
```

**The project model is unchanged.** One field moved from `null` to a path. The file is named for the
project rather than the `plate.png` the README specified in advance; the record follows the asset.
Nothing reads this field yet — C5 will be the first — so the change is inert at runtime.

**One departure from the specification the plate was held to**, recorded rather than argued: it is
1536px wide against a stated 2560 minimum (P1 above). The second departure recorded when this entry was
written — identifiable private individuals in the frame — **went away with the replacement plate of 27
August 2026**, whose two figures are walking away and carry no likeness. The specification's *subject: a
place* clause is met by the plate that ships. `public/media/projects/venice/README.md` carries both the
measurement and the change.

### Preflight status after these four

**LOCKED**

- Hero master
- Studio plate
- Venice plate
- Environment architecture
- 04 → 05 hold
- 05 → 06 Venice arrival
- State 08, 20% horizontal pan
- State 08 direction — away from the canal, left/right derived from the asset
- `playbackRate = 1` by default
- About composition
- The responsive validation rule

**BLOCKING** — none.

**OPEN DESIGN** — none.

**Everything remaining in C5 and C6 is work.** Not one item above is waiting on somebody who is not the
implementer, and an implementation difficulty is not a reopened decision.

---

## C5 — the Environment, implemented 27 August 2026

*Architecture only. The four preflight decisions above were the input; this records what was built, the
two engineering decisions taken inside the locked design, and the two things the environment can now
express that nothing on the page can yet see.*

### What ships

**One element, `src/app/environment.tsx`, mounted once and behind everything.** Fixed to the viewport at
`z-index: 0`, with the film, Chapter III and the publication each at 1 and the Ledger and its aside at
3–5. It holds three plate layers — the hero footage, the venice still, the studio still — a ground layer
for §2's two ground states, and nothing else. It is a server component with no state, no timing, no
scroll position and no junction logic.

**The hero video moved into it and nothing else about Chapter I moved.** `opening.tsx` still owns the
clock, `data-lit`, the play at `MOTION`, the footage gate on the subtitle and `--haste`; it reaches the
element by `.env-hero` instead of declaring it. `.stage` and `.opening` gave up their own black, because
a black rectangle in front of the environment is a lid on it.

**`src/motion/environment.ts` is the projection**, and it is a projection rather than a system: every
number is read out of `spine.ts`'s §2 columns, and the only other input is where each state sits, which
the driver already computes each frame for the Ledger. No second state machine, no second clock.

**The live work left Chapter III for the aside.** §11.1 forbids a work surface standing as the
environment; `fragment.tsx` is the aside's surface now, mounted by the Ledger when Work is opened and
unmounted when it is closed, above an environment that keeps running. Nothing is fetched before the
press. The film underneath is untouched, so *the film resumes where it was left* stays true by
construction.

**About's inset photograph is retired.** The same file is the environment's studio plate; the section is
one column of narrative at the publication's own measure. Composing the type over the plate is C6.

### The two engineering decisions

**Exposure starts at state 06, not state 01.** §2's column opens `.50 · .35 · .10` across states 01–03,
and the film already performs exactly that light with `--dusk` — measured at 0.0524 · 0.7014 · 1.0000 at
those three states. A plate graded to .50 *underneath* a scrim already at .70 is the hero at a quarter of
its light, and the hero is locked. So the environment does not grade where the film's own scrim is the
light, and takes §2's column from state 06 where nothing else lights the plate. Stated in
`src/motion/environment.ts` where it is taken.

**A junction with no authored distance interpolates across the whole gap between its two states.** V2
quotes seconds for some junctions; C8 ruled those are weights rather than durations and none has been
priced into a distance. Spanning the gap is the only reading that invents nothing. When C4 prices these
junctions the interpolation narrows to whatever it prices, and nothing in the environment has to move.

### What it can express and the page cannot yet show

Both are recorded so they are not re-discovered as bugs. **Neither is the environment's doing** — in each
the environment is measurably correct and something in front of it is opaque.

**States 06–08: the film's dawn.** §2 puts the venice plate behind *Some moments*, *Chapter III* and the
Ledger at exposures .13 · .09 · .19. The build reaches those states with `--dawn` at 0.76 · 1.00 · 1.00 —
the film's own light, which ends the shot on paper. That is junction 05 → 06, already recorded here as
`asStated: false` and already C4's. Removing the dawn is a redesign of the film's ending and was not
done.

**State 09: Chapter III's paper.** The aperture no longer opens a black box around an iframe, but what
stands behind it is `.act-stage` and `.chapter-three`, both opaque paper. Making the aperture a window
onto the environment means deciding where the act's page lives once its ground is a photograph — which
is composition, is not one of C5's locked four, and is C6's. Chapter III therefore opens on its own
black, which is §49's gesture and the ground `05-storyboard.md` §10 already asks it to degrade to.

**State 13's grade is not implemented.** §11.2 specifies *ground 160–171, R−B +26, desaturated,
near-still* on the hero plate's sky band. The plate identity is correct — state 13 is the hero layer, the
same element and the same source as state 01, so the locked 13 → 14 is a change on one negative — but
matching a target mean luminance is a measurement against real footage, which is visual QA rather than
architecture. §2's ground column at 13 is a sentence describing that grade and not a colour, and
`environment.ts` reads only colours from it, so nothing paints a string.

### Verified, by measurement

Chrome over CDP at 1440 × 760, 1440 × 900, 1920 × 1080, 768 × 1024 and 390 × 844.

| gate | result |
|---|---|
| all fourteen states reachable, strictly in order | 14/14, monotonic, every viewport |
| correct plate present per state | correct at all 14 states, every viewport |
| horizontal overflow | 0 at every state, every viewport |
| console errors | none |
| environment never unmounted, re-sourced or `display:none` | walked the whole document both ways in 48px steps: same DOM node, same three sources, zero mutations, never hidden |
| video elements on the page | one |
| `playbackRate` | 1 |
| Hero 01–04 unchanged | 225 box readings and 500 driven-property readings against the pre-C5 build: **0 differences**; states 02–05 pixel-identical |
| state 01 pixel difference | the footage's own playhead — two frames of it 0.47s apart differ by more (mean 2.02 against 0.83) |
| state 08 pan | layer 1728px on a 1440 frame, translated −288px = exactly 20%, leftward |
| Work aside | 0 iframes closed → 1 open → 0 closed; environment visible at `z-index: 0` beneath the register at 4, its video still running; returns to the identical scroll position |

---

## C4 — the thirteen junctions on the continuous position, implemented 29 August 2026

*Built on C8's collapse, which shipped before this pass: the three separately measured runways are one
continuous narrative position `p`, and `--pin` / `--act-pin` / `--method-pin` survive as per-segment
**prices** on that position rather than as coordinate systems of their own.*

**What ships.** Each junction is resolved as the interval between the two states it joins —
`junctionSpans` in `src/motion/timeline.ts`, from the same fourteen positions `narrativePositions`
already produces. The thirteen tile `p` end to end, `junctionAt` gives each one its own `0 → 1` affine
in `p`, and the driver publishes `--junction` and `--junction-at`. No distance is authored, no second
clock exists, and no survivor needs a coordinate bridge. Verified at five viewports: thirteen junctions
entered, zero non-monotonic steps, and **241,276 driven values identical to the pre-C4 build**.

**08 → 09 is not split.** The act segment offset (7.536) does sit inside the junction's interval
(7.170 → 8.160). The assertion decided it rather than anybody deciding by eye: `p` advances at one rate
across the offset — only the act's *view* is scaled differently — so a survivor written on `p` crosses
it continuously, and `--junction-at` was measured rising monotonically straight through it at every
viewport. It is recorded as an **internal offset, not a narrative boundary**, and preserved as such.
`aperture` already crosses that exact offset as one expression.

### A — `SECONDS_TO_VH` stays at 20 · **CLOSED 29 August 2026** · design owner

**The decision.** **`SECONDS_TO_VH = 20` is kept**, and V2's authored weights stand exactly as §3
quotes them — 01 → 02 `3.40s`, 05 → 06 `4.20s`, 07 → 08 `2.90s`, 13 → 14 `3.60s`. **01 → 02 and
07 → 08 are not to be retimed** against the interval the current build happens to spend on them.

**What prompted it, recorded as a V1 measurement and nothing more.** The constant's own docstring in
`src/motion/story.ts` derives `20` from *"01 → 02 … corresponds to roughly 1.3 beats of the existing
build"*. C4 measured that interval on the build as it stands and it is **0.28 beats**
(`shotStory.chapterTwoMarker.at`), 4.6× smaller — so three junctions assert that the build spends less
distance than the authored weight asks for: 01 → 02 has 15.3vh against 68vh, 07 → 08 has 10.9vh against
58vh, and 13 → 14 has 68vh against 72vh at two viewports.

**Why the measurement does not move the design.** **0.28 is a measurement of the V1 presentation, and
the V1 presentation is not a timing authority** — `CLAUDE.md`'s revamp principle of 29 August 2026. A
number read off the composition that is being replaced cannot re-derive a constant that converts the
approved design's weights. The authored seconds are V2's and they stay; the intervals are the build's
and the V2 presentation rebuild is what will make them pay the weight.

**Consequence, deliberate.** The three assertions go on firing until the rebuild lays those junctions
out. They are not faults in C4 and they are not to be silenced: **they are the rebuild's to-do list,
stated in numbers.** The wording of the message — *"a retime of the beats between those two states"* —
reads against the V1 build and should be re-read as *the rebuild has not yet paid this weight*.

### B — State 14's reachability, deferred · **CLOSED 29 August 2026** · design owner

**The decision.** State 14 is unreachable at maximum scroll — its entry needs 36px more document than
exists at 1440 × 760, and junction 13 → 14 therefore reaches only 0.94 · 0.85 · 0.77 · 0.87 · 0.98
across the five viewports. This is a **pre-existing V1 presentation and layout constraint**, and it is
**deferred to the V2 presentation rebuild**.

**Not to be worked around.** Do not move state 14, do not add page height solely to make it reachable,
do not change the scroll model, and **do not weaken the assertion** — it is correctly reporting that
the one junction §7 calls non-negotiable cannot presently be completed. It is a layout answer, not a
position-model one, and C4 is closed without it.

---

## The V2 presentation, states 01 → 09 — the transition register, 29 August 2026

*What was built for each junction, and where every number in it came from. The rule this section exists
to enforce: **a design-authored value is never silently replaced.** Where one was not implemented
literally, it is named here with the reason, and where the departure is more than geometric it is
flagged for a decision rather than recorded as an adaptation.*

### The four classifications

| | Meaning |
|---|---|
| **A · Design-authored** | The Final Spec, the Final Visual Master or the storyboard states it. Implemented as given. |
| **B · Implementation adaptation** | A geometric or mechanical difference that **preserves the approved visual reading** — a coordinate expressed as a fraction, a contraction done by `scale` rather than `font-size`, a survivor moved out of a flow line so it can travel. Acceptable without a decision. |
| **C · Responsive adaptation** | C7's order of preservation applied below the reference frame. Narrative meaning, hierarchy and mechanism preserved; exact coordinates given up last. |
| **D · Browser-measured correction** | A shaping value with no authored counterpart, derived by watching the transition in Chrome — which parts of a junction each element occupies, so that nothing is drawn over anything. |

**A change in narrative meaning, hierarchy, survivor, transition mechanism or visual language is none of
these.** Four such departures exist and are flagged below; none was taken silently and none is settled.

### Junction by junction

| # | verb · survivor | A — authored | B / C / D — as built |
|---|---|---|---|
| **01 → 02** | displace · *"Chapter"* | **3.40s**; hero .50 → .35; 96px serif x196 baseline y462; numeral origin x756; lockup 11px / .42em | **A adopted, and it had not been.** The junction was 15.3vh; §3's 3.40s through `SECONDS_TO_VH` is **68vh = 1.244 beats**, and `chapterTwoMarker.at` now carries it (`BEATS` 7.17 → 8.14, `pin` 392 → 446vh, so every later beat keeps its own length and price). **B**: the survivor is positioned against the title's origin rather than held in the flow line, with an invisible ghost holding its width, so `One` can release in place; contraction by `scale`; baseline placed by a measured 0.76em ascent. **D**: `One` releases over the first **0.28** and the numeral arrives from **0.45** — measured, because the survivor is wider in flight than at rest and swept through both. |
| **02 → 03** | displace + inherit · *the coordinate x756* | *"Philosophy" rests on x756*; *moves overlap*; ~~II travels 196px to x560~~ **superseded — see F8** | **B**: read as **five phases of the one junction** — see the entry below. **C · flagged** — see F3. **A departed — see F6 and F7.** |
| **03 → 04** | expand · *the label* | Tracking opens to **1.9em**; thesis 64px serif x196, centred vertically; ember 68% / 32%; ground `#060605` | **D**: the sentence resolves from **0.35** rather than from the junction's first frame — it was legible at 4% while the label still stood, which reads as two things sharing a frame rather than one becoming the other. |
| **04 → 05** | hold · *the ground* | Ground `#060605` → `#050504`; the negative continues beneath at **−6** | **B**: the ground is a layer over the plates rather than under them, so the hold is a hold and not a swap. **D**: the thesis clears over the first **0.45** and the stack arrives after **0.55** — a hold is not a cross-fade, and both had been legible in one frame. |
| **05 → 06** | accumulate · *the residue* | **4.20s**; **46px / 100%, 31px / 34%, 22px / 12%** on one optical centre; occasions at *t 0.00 · hold 0.90s* and *t 0.90 → 1.60s*; venice .13; warm source upper right | **A throughout.** The three slots and the arrival rhythm are V2's own, converted to fractions of the junction (**0.214 → 0.381**, **0.429 → 0.595**). **D**: the stack clears from **0.78** so its resolved frame stands for about a fifth of the junction — it had existed for 2.5% of it. **D**: this layer's ground hands over to the Environment at **0.75**, late, so *the black acquires a photograph* rather than brightening through a lit hero on the way. |
| **06 → 07** | change register · *the word "chapter"* | *changes register in place — **no travel***; lockup origin **x752**; chapter line 9px / .30em, 46px under; venice .09 | **B**: the register change is `scale` + tracking on one node, in place. **A departed — see F1 and F2.** |
| **07 → 08** | decompose · *the numeral* | **2.90s**; mark at **x38 y236**; index drawn out of the numeral, rule length encodes depth, WORK lit first; venice panned 20%, .19 | **B**: the index is drawn on this junction's own progress rather than on `actStory.navigation`, a V1 beat belonging to a runway that has not started — it left the rail carrying the mark alone at a state §2 says is *index drawn*. **A unpaid — see F4.** |
| **08 → 09** | lift · *the photograph* | Exposure to **1.00 true**; *the frame pans off the canal*; **80px serif x196, bottom 74**; nothing mounted, swapped or fetched | **A throughout** — C5's Environment performs the lift and the 20% pan; this pass only stopped painting over it. **D**: the work's type arrives from **0.35** of the lift. |

### 02 → 03 read as five phases · **B** · design owner's direction, 29 August 2026

> **Superseded, 29 August 2026 (later the same day), by *The lockup solved as one
> composition* below.** The phase table and the two endpoints in this subsection are kept as the
> record of how the junction was read before the browser pass; where they disagree with that
> subsection, that subsection is what ships.

*The composition was right and the time was wrong.* Three elements were animating across one interval,
so no frame plainly showed which was carrying the narrative — *"technically coherent but visually too
crowded."* The junction is now read as a sequence of moments, each a range of its own `--jp2`. No second
timeline, no state machine, no delay that is not a position on `p`.

| phase | range | what stands |
|---|---|---|
| **1 · Settled** | 0.00 → 0.18 | `Chapter II`, one centred composition, held long enough to be read. Philosophy absent. |
| **2 · Release** | 0.18 → 0.40 | Chapter fades **where it stands** — it never travels. II stable. |
| **3 · Reposition** | 0.44 → 0.68 | The survivor moves, **alone in the frame**, 196px to x560. |
| **4 · The survivor withdraws** | 0.68 → 0.82 | II recedes to a trace once it has landed. |
| **5 · Philosophy enters** | 0.82 → 1.00 | On the coordinate the numeral vacated, as its own gesture. |

**The hold is V2's own proportion, not chosen.** The storyboard sheets junction 03 → 04 as *"Settled ·
t 0.00s · held 0.40s"* against a junction running to 2.19s — **0.18** of it. The site authors perceptible
holds at the head of a junction and this one had none.

#### The two endpoints, corrected against the running page — **B**

The phases were right and both **endpoints** were wrong. Watched in a visible Chrome at 1440 × 760:

**State 02 was not one lockup.** `Chapter` arrived as Cormorant title-case scaled down from the hero's
96px and `II` stood beside it as Schibsted micro-caps — two faces, two cases, 19px apart. The geometry
was already correct (§2's lockup origin x666 puts the numeral on 756, and it did), but a space between
two typefaces reads as a **break** rather than as tracking, and a serif at 11px sits optically lighter
than the sans beside it, which is why the word read as undersized.

§5 settles it: statements are Cormorant, **chapter lockups are Schibsted micro-caps at .42em**. So the
survivor now **carries two renderings of itself inside one node** and crosses between them in the last
quarter of its travel — at a tenth of its size, in motion, where the exchange cannot be seen. One
element, one position, one scale, one tracking; only the ink changes, which is what a register change
is. **This closes F2 for this survivor**: the lockup is set in the face and case §5 gives it.

**State 03 read as a void.** The numeral sat at the 0.10 trace introduced by the phase-4 direction, 180px
from a full-brightness label. One bright mark and one ghost that far apart is not a composition, and it
was the trace — not the distance — that made the separation read as emptiness. **F6 is reverted**: §2's
board draws the numeral at `#fdfbf4`, full, beside Philosophy at state 03, and the storyboard keeps its
release in the *next* junction. The survivor lands and holds, and the pair reads as `II  PHILOSOPHY` —
two marks on one baseline, same face, same case, same tracking, at the authored anchors.

#### The narrow frame — **C**

Left aligned and stacked, never the desktop's horizontal geometry squeezed into it. The mechanism is
unchanged — the word releases, the numeral survives, the label takes the coordinate it vacates — and only
the axis it is handed along turns from horizontal to vertical. `Chapter` **releases upward**, so the
release is a direction rather than only a dimming, and the stack is tightened so the numeral and the
label read as one compact composition. Measured at 390 × 844: `II` at y398 and `PHILOSOPHY` at y418,
both on x31, no clipping and no overflow.

#### Verified

Real wheel input in a visible Chrome at **1440 × 760, 1440 × 900, 1920 × 1080, 768 × 1024, 390 × 844**:
**no collisions, zero horizontal overflow**, three forward passes identical, the reverse retracing the
forward frame for frame. Settles at the authored anchors, scaling with the frame — 1440: `n555 · t751`;
1920: `n741 · t1003`; narrow: both on the page's own margin. C4 and C8 untouched; only junction 07 → 08's
standing assertion fires.

#### The lockup solved as one composition — **B** · design owner's direction, 29 August 2026

> **Superseded, 29 August 2026 (later the same day), by *02 → 03 rebuilt from the intended behaviour*
> below.** Kept as the record of the pass before it; where the two disagree, that subsection ships.

**This supersedes the phase table and the two endpoints above.** The narrative idea was not reopened —
`Chapter II → II Philosophy` on the desktop, `Chapter II → II / Philosophy` on the narrow frame — but the
frame it actually produced was still wrong in four ways. Watched in a visible Chrome, wheel-scrolled
through the whole junction and back, at 1440 × 760 and 390 × 844:

| # | What the browser showed | Measured |
|---|---|---|
| 1 | **`Chapter II` was not one lockup.** The word landed as Schibsted at .82em of the survivor's size against a numeral set at 11px, and the two were cap-top aligned rather than sharing a baseline — so the numeral read as raised and the word as undersized. | cap heights **6.53 against 8.00**; baselines **1.3px** apart |
| 2 | **`Chapter` duplicated.** The two renderings cross-faded over 28% of junction 01 → 02 at different widths, so for a sixth of the junction the frame held two half-lit Chapters of different size on one origin. | **145px of scroll**; box widths 67.7 against 82.6 at the settle |
| 3 | **The group was not on the frame's centre.** The survivor's landing was written in `vw` and every anchor around it as a percentage of `.v2`. The scrollbar is the difference. | ~**10px** off centre at 1440 |
| 4 | **`II Philosophy` stood in the sentence.** §2 centres both this pair and state 04's thesis, so Philosophy was drawn over *Every unforgettable moment* through the whole hand-off; on a phone the pair sat on top of the wrapped sentence. | lockup baseline **y384** inside the thesis' second line |

**The answers are one idea: the lockup is a composition, so it is solved as one.** §3's mechanism is
untouched — `One` releases, `Chapter` releases in place, the numeral survives and repositions, the label
inherits the coordinate the numeral vacates.

**1 · One size, one baseline.** The survivor's size change is now the `font-size` itself rather than a
`scale()`, so its landing can be *stated* (`--lockup`, §5's 11px on the reference frame) instead of being
whatever 11/96 of the title resolves to at a width where the two clamps disagree. The numeral is set from
the same property. Word and numeral are therefore the same face, case, size and tracking at every
viewport by construction, and `line-height: 1` on both with the numeral centred on its line puts them on
one baseline with **no measured baseline offset** — verified identical at 1440, 1920 and 390.

**2 · The exchange of renderings is one point, and it is width-neutral.** A cross-fade is what read as a
duplicated Chapter. Measured: `CHAPTER` in Schibsted advances **4.569** of its size and `Chapter` in
Cormorant **3.215**, so across seven letters the mark is **.1935em per letter wider at any size**. The
mark carries that as negative tracking at the instant it takes over and gives it back over the rest of
the travel. Verified on the running production build at jp1 0.772: **166.58px against 166.61px** — the
box cannot jump. The exchange sits at **.88 of junction 01 → 02 and costs .02 of it**, about ten pixels
of scroll, where the word is at 21px and still moving at full rate. What is left afterwards is the
tracking opening to §5's .42em, which is the authored gesture anyway.

**3 · The group is centred, and that turns out to be §2's own anchor.** Three advances, measured in units
of `--lockup` with .42em tracking on — `CHAPTER` **7.10**, `II` **1.16**, and the **1.7** separation the
lockup already carried (19px against 11px type) — make the lockup **9.96 marks** wide. Centred on the
frame that puts the survivor on **x660** and the numeral on **x757** at 1440, against §2's authored
**x666** and **x756**. *The board was drawing a centred lockup.* So the centre is what is written down
and §2's anchors are what check it. Verified: group centre **715.0** against a frame centre of **715.0**
at 1440 × 760 and 1440 × 900, and **955.0 / 955.0** at 1920 × 1080. Those three advances are font
metrics; if `open-decisions.md` §7 ever answers the typeface, they are the numbers to re-measure and
nothing else in the block is a constant.

**4 · State 03 is the same lockup, lifted off the sentence — a deviation from §2, recorded.** §2 centres
this pair *and* state 04's thesis vertically, and the two cannot both be centred without being drawn over
each other. The pair now rises out of the frame's centre as part of the numeral's own reposition — one
gesture, left and up, not two. Measured on the reference frame: the thesis inks its first line at **y322**
and the pair's baseline lands at **y262**, leaving **60px** clear. **This is the only authored coordinate
this pass gives up, and it is a vertical one.** §2's x756 for the label is kept, and the numeral steps
back beside it by its own advance and one lockup separation — 38px of travel to the left at 1440, leaving
the lockup's own 1.7em gap. The design owner's 29 August direction that the pair stay compact is
unchanged; only the void beneath it is new.

**The phases, restated.** The hold at the head is unchanged and so is the order. The withdrawal to a
trace is gone (F6, already reverted). The label was moved earlier, from 0.82 → 1.00 to **0.72 → 0.90**,
so the pair has a tenth of the junction to *stand settled* before 03 → 04 begins — that tail is the
breathing space before the sentence.

| phase | range | what stands |
|---|---|---|
| **1 · Settled** | 0.00 → 0.18 | `Chapter II`, one centred lockup, held long enough to be read |
| **2 · Release** | 0.18 → 0.40 | `Chapter` fades **where it stands**; on the narrow frame it releases *upward* |
| **3 · Reposition** | 0.44 → 0.68 | the survivor moves alone — left and up in one range |
| **4 · Inheritance** | 0.72 → 0.90 | `Philosophy` arrives on the coordinate the numeral vacated |
| **5 · Settled** | 0.90 → 1.00 | `II PHILOSOPHY`, standing |

**One structural change, and it is a coordinate decision.** `.v2-word` used to live inside `.v2-title`
and be carried to the lockup by a `transform`. A transform cannot state a percentage of the *frame*, so
its landing had to be written in `vw` while every anchor around it is a percentage of `.v2` — which is
finding 3. It is now a **sibling** of the title, so its `left` and `top` are percentages of the same box
as everything else and the landing can be derived rather than guessed. It is still one element and it
still stands exactly on the ghost at state 01. The no-scripting alternative follows it: the ghost stops
being a spacer and says the word itself, and the vehicle stands down — without that the survivor stayed
absolutely positioned against whatever ancestor is left positioned once the stage goes static, and landed
as a stray second `Chapter`.

**The narrow frame — C.** Left aligned and stacked, and every difference is a variable rather than a
restated position: `--lockup-x` becomes the page margin instead of the centre, the numeral's state-03
coordinate becomes that margin too, and the label arrives *beneath* it rather than beside it. `Chapter`
still releases upward. Measured at 390 × 844: state 02 reads `CHAPTER II` on one line from x31 with the
lockup's own 17px gap; state 03 stacks `II` on y300 over `PHILOSOPHY` on y322, and the sentence inks from
y401 — **75px** of air. At 768 × 1024 the same stack clears the sentence by **79px**.

#### Verified — this pass

Real wheel input in a visible Chrome, forward and reverse through the whole junction, at **1440 × 760,
1440 × 900, 1920 × 1080, 768 × 1024, 390 × 844**. One lockup at state 02 with coherent size, baseline and
weight; **no duplicated Chapter at any position**; one persistent numeral; no collision with state 04's
sentence at any width; no clipping and no horizontal overflow; the reverse retraces the forward.
Typecheck, lint and `next build` clean, and the no-scripting alternative checked against `next start`
with scripting disabled — `Chapter One`, then `II`, then `Philosophy`, then the thesis, in flow and in
order. C4, C8, `timeline.ts` and every assertion untouched; 03 → 04 and everything after it untouched.

**Found and not fixed, because it is not this junction.** In the no-scripting alternative the whole V2
film is painted over by the Environment: `page.tsx`'s `<noscript>` block sets `.v2 { position: static }`,
and `z-index` has no effect on a static element, so `.v2`'s `z-index: 1` stops applying while
`.environment` stays absolutely positioned and paints above it. The elements are all present, in flow and
in the right order — they are simply behind the video. It predates this pass and belongs to the
Environment's own noscript composition.

#### 02 → 03 rebuilt from the intended behaviour — **B** · design owner's direction, 29 August 2026

**This supersedes every 02 → 03 subsection above.** The junction had accumulated five successive
correction layers in `globals.css`, each patching the one before it, and the frame they produced had
drifted from the design. The design owner restated the intended behaviour and directed a rebuild of the
presentation only — C4, C8, the continuous position, the junction model and every later transition
untouched. The five layers are gone; **one block in `globals.css` now owns the junction and there is no
other.**

**The intended behaviour, as stated.**

| | |
|---|---|
| State 02 | `Chapter II` — one centred lockup, **title case**, one visual scale, one baseline |
| 02 → 03 | `Chapter` disappears **where it stands**; the numeral survives and moves **left**; `Philosophy` enters **from the right** |
| State 03 | `II Philosophy` — one centred pair, compact gap, **on the frame's centre** |

Nothing else moves, nothing travels vertically, and no element is ever rendered twice visibly.

**What the browser actually showed before the rebuild.** Watched in a visible Chrome at 1440 × 760,
wheel-scrolled through the whole junction and back.

| # | The frame | Measured |
|---|---|---|
| 1 | **State 02 read `CHAPTER  II`.** The survivor's landing rendering carried `text-transform: uppercase` — a case change the design never asked for — at `font-size: 0.82em`, a compensation for a cap-height difference. | word rendered **9px** against the numeral's **11**; baselines **1.3px** apart |
| 2 | **`II PHILOSOPHY` was lifted off the centre**, to clear state 04's thesis. | baseline **y257** on a 760 frame, 122px above centre |
| 3 | **`II PHILOSOPHY` was not centred.** The label held §2's x756 and the numeral stepped back beside it, so the *pair* centred elsewhere. | pair centre **x800** against a frame centre of **x715** |

**1 · The typography is fixed at the source, not compensated for.** The `uppercase` and the `0.82em` are
both gone. The survivor's landing rendering is the same word at `1em` in the numeral's own family, and
word and numeral are set from one property (`--lockup`) at `line-height: 1` on the same box top — so the
lockup is one size and one baseline **by construction**, with no measured offset anywhere in the block.
Verified: both at 11px, ink tops and bottoms identical, at 1440 × 760, 1440 × 900 and 1920 × 1080.

**2 · Both compositions are centred as groups, against the frame the visitor sees.** `.v2` is fixed at
`inset: 0`, so `50%` of it is the centre of the client box with the scrollbar already excluded. Three ink
advances turn that centre into a left edge for each element — measured on the running page at
`font-size: 100px` as the range rect of the text, with the trailing letter-space subtracted so they are
optical widths and not box widths:

| | | in units of its own size |
|---|---|---|
| `Chapter` | Schibsted, **title case**, .42em | 666.219 − 42 = 624.219 → **6.2422** |
| `II` | Schibsted, upper, .42em | 158.078 − 42 = 116.078 → **1.1608** |
| `Philosophy` | Schibsted, upper, .44em | 1070.328 − 44 = 1026.328 → **10.2633**, restated as **11.6628** of `--lockup` at §5's 12.5/11 label size |

The lockup is **9.10 marks** wide and the pair **14.52**. Centred at 1440 that puts the word's ink on
**x665** and the numeral's on **x752**, against §2's authored **x666** and **x756** — *the board was
drawing a centred lockup*, so the centre is what is written down and §2's anchors are what check it.
Verified: ink centre **714.99** against a frame centre of **715.00** at 1440 × 760 and 1440 × 900, and
**954.99 / 955.00** at 1920 × 1080, at both endpoints. Those three advances are font metrics; if
`open-decisions.md` §7 ever answers the typeface they are the numbers to re-measure, and nothing else in
the block is a constant.

**3 · The vertical lift is gone — §2's centre is restored, and F7 is opened below.** Both compositions
hold the frame's centre and the survivor's travel is lateral only. Measured across the whole junction at
every viewport: the numeral's box top is **a single value** — it cannot drift.

**4 · The gap is the site's own and it is the same in both compositions.** 1.7 marks ink to ink — the
separation the `Chapter II` lockup already carried, 19px against 11px type. Measured **18.70px** at 1440
in both state 02 and state 03, **24.9px** at 1920.

**The phases, restated as the sequence the direction gives.** Strictly in order, so nothing is ever drawn
over anything and each phase is plainly the thing carrying the narrative while it runs.

| phase | range on `--jp2` | what stands |
|---|---|---|
| **1 · Settled** | 0.00 → 0.20 | `Chapter II`, one centred lockup, held long enough to be read |
| **2 · Release** | 0.20 → 0.44 | `Chapter` disappears **where it stands**; on the narrow frame it releases *upward* |
| **3 · Reposition** | 0.44 → 0.70 | the survivor moves **left**, alone in the frame — 117px at 1440 |
| **4 · Entry** | 0.70 → 0.92 | `Philosophy` enters **from the right**, by one lockup separation, onto the pair |
| **5 · Settled** | 0.92 → 1.00 | `II Philosophy`, standing on the centre |

**The exchange of renderings is kept, and it is width-neutral at the point it happens.** The survivor
still holds two renderings of itself and crosses between them at **.88 of junction 01 → 02, over .02 of
it** — about ten pixels of scroll, at 21px, in motion. Re-measured for title case: `Chapter` advances
**3.2161** of its size in Cormorant and **3.7222** in Schibsted, so the mark carries **−0.0844em** per
letter gap at the instant it takes over and gives it back over the rest of the travel. Verified by sweep:
across 200 samples of junction 01 → 02, **three** hold both renderings above 3% opacity, at **identical
left** and within **1.25px** of each other's width. There is no frame in which two Chapters can be seen.

**The narrow frame — C.** Untouched by the desktop rebuild, and every difference is a variable rather
than a restated position. State 02 is still the horizontal lockup, **left aligned on the page's own
margin** rather than centred; `Chapter` releases *upward*; the numeral survives on the margin and does
not step aside; the label arrives *beneath* it rather than from the right. Measured at 390 × 844: state
02 reads `Chapter II` on one line, x31→98 and x111→126; state 03 stacks `II` on y293 over `PHILOSOPHY` on
y314, both on x31, no clipping and no horizontal overflow.

#### Verified — this pass

Real wheel input in a visible Chrome at **1440 × 760**, forward through the whole junction and back, on
the first frame of a fresh load: state 02 reads `Chapter II` in title case as one lockup; `Chapter`
disappears in place; the numeral survives and moves left alone; `Philosophy` enters from the right; the
pair settles as `II PHILOSOPHY` on the centre; the reverse retraces the forward. **1440 × 900,
1920 × 1080 and 390 × 844** were driven in same-origin frames of exactly those sizes — real layout, real
metrics — and measured at both endpoints and across 100 samples of the junction: centring, gap, baseline,
no vertical drift, no overlap between the numeral and the label at any position, monotonic leftward
travel. Typecheck, lint and `next build` clean. The composed no-scripting alternative is unaffected: the
`<noscript>` block hides `.v2-word` and reveals `.v2-ghost` and sets the numeral and the label static, all
of which still override this block, and the markup order is unchanged — checked against the served
production HTML from `next start`. C4, C8, `timeline.ts` and every assertion untouched; 03 → 04 and
everything after it untouched.

**F7 · State 03 stands over state 04's sentence during the hand-off — found, not fixed, and it is not
this junction.** §2 centres this pair *and* the thesis vertically, and the two cannot both be centred
without meeting. The previous pass answered that by lifting the pair 122px; the design owner's direction
is that state 03 sits on the frame's centre, so the lift is gone and the collision is back — during
junction 03 → 04 `II PHILOSOPHY` fades out between the thesis' two lines, on top of *Every unforgettable
moment*. Seen in Chrome at 1440 × 760. **The fix is one line and it belongs to 03 → 04**: the pair's
release is currently `1 − --jp3`, spread across the whole of the next junction, while the thesis inks from
`--jp3` 0.35. Clearing the pair by 0.30 — `clamp(0, calc(1 - --jp3 / 0.30), 1)` on both `.v2-numeral` and
`.v2-topic` — puts it out of the frame before the sentence arrives, and preserves §3's *"the numeral fades
without moving"*. It was not applied because this pass was scoped to 02 → 03 and directed to stop there.

---

### Flagged — not implementation adaptations

**F1 · State 07's lockup origin x752 is not implemented.** §2 anchors it there. §3 requires the survivor
to change register *in place, with no travel*, and §2 also composes state 06's sentence as **centred** —
so the word it survives out of does not stand on x752, and the three statements cannot all be literal.
The mechanism was kept and the coordinate given up: the numeral docks to the survivor, so the lockup
forms in reading order wherever the word stood. **Geometric, and it preserves the reading — but it
discards an authored coordinate, so it is recorded rather than absorbed.**

**F2 · PARTLY CLOSED, 29 August 2026.** The **Chapter II** survivor now lands in §5's own face and case:
it carries two renderings of itself inside one node and crosses between them in the last quarter of its
travel, at a tenth of its size and in motion. One element, one position, one scale — only the ink
changes. **What remains open is the 06 → 07 survivor**, the word *chapter* becoming the Chapter III
lockup, which still keeps its case; the same construction would close it and has not been applied
because that junction is out of the current scope. The entry below stands for that one.

**F2 (as recorded) · The word-survivors stay in title case.** The storyboard sets the Chapter II lockup, the mid-travel
word and the Chapter III lockup in **caps**. `text-transform` cannot interpolate and a case flip
mid-travel pops, so both survivors keep their case and carry the register change through size and
tracking alone. **This is typographic register — visual language, not geometry.** It needs a decision:
accept the lower case, or author a point in each junction where the case is allowed to change.

**F3 · On viewports ≤ 820px the numeral does not travel.** §3's mechanism for 02 → 03 is *II travels
196px left*; `--ii-travel` is **0** on the narrow frame and the label arrives beneath the numeral on one
axis instead. C7 permits adapting coordinates, and one coordinate is still handed on — but **a travel
removed is a change of mechanism at that breakpoint**, not a coordinate given up, so it is flagged.
The desktop travel is unchanged. (The bug this replaced was worse and is not the reason: the travel had
been a fixed desktop distance in `vw`, which put the numeral at **x −43 / −22**, off the frame.)

**F4 · Junction 07 → 08 does not pay its authored weight, and state 07 is barely viewable.** §3 quotes
**2.90s = 58vh**; the build spends **10.9vh**, so state 07 lasts about 80px of scroll and a sampler
stepping 300px misses it entirely. `assertJunctions` reports it on every load and is the standing record.
01 → 02 has now been paid; 05 → 06 and 13 → 14 pass; **07 → 08 is the only junction still short.**

**F6 · ~~The numeral's release has moved from 03 → 04 into 02 → 03.~~ REVERTED, 29 August 2026.**
Watched at 1440 × 760, the trace was what made §2's authored 196px separation read as a void: one mark
at 0.10 and one at 0.98, 180px apart, is not a composition. The numeral lands and **holds at full**
through state 03, as §2's board draws it, and junction 03 → 04 keeps its own release. Phase 4's intent —
that the viewer sees the identifier finish its role — is carried by the survivor being visibly *done*:
still, alone, having stopped, while the label arrives. The entry below is kept as written, because the
reasoning it records is why the revert was the right answer.

**F6 (as recorded) · The numeral's release moved from 03 → 04 into 02 → 03.** The storyboard gives junction
03 → 04 a frame captioned *"'II' releases · the label is left alone"*, described as *"the numeral fades
without moving — the same release that opened both earlier junctions, now applied to the thing that
arrived last."* Its settled state 03 has the numeral at **full**. The owner's phase 4 asks for the
release inside 02 → 03 instead, so that the viewer sees the identifier finish its role before Philosophy
arrives. **This relocates an authored gesture between junctions and changes what state 03's board shows.**

**Reverted.** Watched at 1440 × 760, the trace was what made §2's authored 196px separation read as a
void: one mark at 0.10 and one at 0.98, 180px apart, is not a composition. The numeral now lands and
holds at full through state 03, as the board draws it, and 03 → 04 keeps its own release intact. The
phase-4 direction is met by the survivor being visibly *finished* — still, alone, having stopped — rather
than by it dimming.

**F7 · §3's *"moves overlap"* no longer holds for 02 → 03.** The mechanism sentence ends *"Moves
overlap."* Phase 3 and phase 5 are now sequential — the owner's direction was explicit that Philosophy
must enter *"as a new authored gesture"* and not overlap the departing numeral. The inheritance still
reads as one hand-off because the coordinate is visibly vacated and then taken, but **the simultaneity
§3 asks for is gone.** Recorded, not absorbed.

**F8 · CLOSED 29 August 2026 · design owner · A — the separation is superseded.** §2's board separates
the numeral and the label by 196px. The design owner's final visual decision replaces it: **state 03 is
one compact typographic lockup, `II Philosophy`.** This is a change to the approved composition, taken by
the owner, and it supersedes the Final Visual Master on this one relationship — it is **not** an
implementation adaptation and is recorded here as the authored value it now is.

**What changed is only the final horizontal relationship.** §3 names this junction's survivor as *the
coordinate itself* — *"'Philosophy' inherits the coordinate it vacated, x756"* — and the instruction was
to keep the survivor, so **the axis is untouched** and the label still rests on x756. The numeral is
placed against the axis and stepped back by its own width plus one lockup gap, which is why it carries
no coordinate of its own and holds at every width.

**The gap is derived from the composition, not authored anew — B.** It is the separation the `CHAPTER II`
lockup already carries two frames earlier: measured on the running page at 1440 × 760 as **19px against
11px type**, so **1.7em** of the numeral, expressed in `em` so it scales with the type rather than with
the frame. State 03 now has the same internal rhythm as state 02. Measured after the change: II at
715..732 against Philosophy at 751 — the identical 19px the earlier lockup has.

**The choreography is unchanged.** Chapter still releases in place, the numeral still survives and
repositions, Philosophy still enters only once the coordinate has been released. The reposition is now
the numeral **stepping aside so the label can take the axis** rather than crossing the frame to do it.

**Mobile is unchanged — C.** The narrow frame stacks rather than locks up: `II` above, `PHILOSOPHY`
beneath, both left aligned on the page's own margin, `--ii-travel: 0`. One correction was needed to keep
it: the desktop travel is declared later in the sheet than the media query that first zeroed it, and at
equal specificity the last declaration wins wherever both match — without restating the override the
numeral landed at x29 on 768 and at **x −2** on 390, off the frame. **D.**

**Verified** by real wheel input in a visible Chrome at all five viewports: no collisions, zero
horizontal overflow, three forward passes identical, the reverse retracing the forward frame for frame.
Settles at `n715 · t751` (1440), `n955 · t1003` (1920), and both on the page margin at 768 and 390.

**F8 (as recorded before the decision) · The 196px separation at state 03 is the approved composition.**
The direction of 29 August was *"II + Philosophy must form one compact lockup — do not create the large
empty separation"*, together with *"keep the approved anchors, II ≈ x560, Philosophy ≈ x756."* **Those
cannot both hold: 196px is the distance between those two anchors.** The Final Visual Master draws
state 03 as `II` at `left:560px` and `Philosophy` at `left:756px`, on one baseline, both at full — and
the separation is load-bearing, because x756 is *the axis the whole film runs on* and the numeral has
stepped off it so the label can hold it.

What was in this implementation's gift has been done: both marks are now at full, in one face, one case
and one tracking, on one baseline, so the pair reads as a composition rather than as a mark beside a
void. **Closing the distance itself would change the approved final composition and has not been done.**
If the board's separation is to be reduced, that is a change to the Final Visual Master, not to this
build.

**F5 · State 09's copy is short of the board.** The Final Visual Master carries *Raquel & Flávio*,
*28 · 08 · 2027 — VENICE* and *Other experiences →*. The project record deliberately carries only
*Wedding Experience* — `content/site.ts` records that the spec uses the project's own name rather than
the couple's, because whose wedding it is belongs to the project. What exists is rendered and nothing was
invented; the board's remaining three lines have no source.

---

## C5 · State 13's warm stone and the Ledger's ink · **CLOSED 30 August 2026** · design owner

*Taken while implementing junction 12 → 13. It is a decision about presentation, not about the source
photography, and it is recorded here because it resolves an apparent conflict inside §11.2.*

### The apparent conflict

§11.2 asks for state 13's ground to be the hero plate's own sky band, graded to **160–171**, with a
**worst case of 7.15 : 1** against the Ledger's ink `#171613`. Read as *the darkest pixel of the band*,
those two cannot both hold on the live footage: reaching 7.15 : 1 against the darkest cloud requires the
whole band above L≈168, which is a flat colour field rather than the *"lit room, not a sheet of paper"*
§11.2 also requires. At one point the measured worst case was 1.33 : 1.

**The spec is not in conflict — the reading was.** Against the *band* the figures are self-consistent:

| ground | ink `#171613` | ratio |
|---|---|---|
| 160 | `#171613` | 6.86 : 1 |
| 171 | `#171613` | 7.81 : 1 |

7.15 : 1 is the **mid-band** figure. §11.2 means the ink against the ground's stated value, not against
its darkest pixel.

### What actually failed

This build's own composite, for two reasons neither of which is the photograph:

1. The shipped grade measures a mean of **158.3**, a little under the band.
2. **The rail's ink carries alpha.** `rgba(24, 23, 20, .9)` composites to an effective 37 over the
   stone — **5.71 : 1**. The alpha was the shortfall, not the hue.

And the destinations were not crossing at all: they were still wearing the film's light ink,
`rgb(242 236 224 / .86)`, over a light ground. §6 requires the opposite — *"ink (crosses dark ↔ light
with the ground, never on its own clock)"*.

### The decision

**Hold the photographic grade; take the contrast out of the ink.** The design owner chose this over
flattening the sky band further, on the priority order: preserve the Hero's photographic quality, preserve
the 12 → 13 choreography, achieve the ratio through ink treatment, and do not let the environment become a
flat colour field.

The rail's ink now crosses on `--env-stone` — the same envelope the plate's grade rides, so it is the
ground's clock and not its own, as §6 requires. Solid, and darkened from §2's swatch to hold the authored
ratio against the ground that actually ships:

| role | state 13 ink | measured |
|---|---|---|
| mark, ticks, active word | `rgb(15 14 12)` — §2's own 23:22:19 warmth, scaled | **7.44 : 1** |
| inactive destinations, leader rules | `rgb(54 52 45)` | **4.80 : 1** |

Verified at 1440 × 760, 1440 × 900, 1920 × 1080, 768 × 1024 and 390 × 844 — identical at all five.

**§2's `#171613` is untouched in `spine.ts`.** It remains the transcription of §2's own column; the values
above are the presentation layer meeting the authored *ratio* on the measured ground, which is what
§11.2's number is for. Nothing about the plate, the grade or the choreography changed to get it.

**Not done, and not this decision's to make:** state 14's ground. The paper returns across 13 → 14 so
Contact stays on paper exactly as junction 13 → 14 was validated; §2's `hero · .72` for state 14 would
need Contact's ink to cross to `#f2e9dc`, and that is a change to a locked junction.

---

## C7 · The mobile choreography for 01 → 02 and 02 → 03 · **APPROVED 30 August 2026** · design owner

*A **design direction**, recorded before implementation so it cannot be lost between transitions. The
01 → 02 half is already satisfied by the build; **the 02 → 03 half is approved and deliberately NOT
implemented** — 01 → 02 is being closed first. Nothing in this entry has been built.*

### Why it exists

C7 permits adapting coordinates below the reference frame in a stated order of preservation. What the
build did with that permission at 02 → 03 was to **stack** the pair vertically. Watched in a visible
Chrome at 390 × 844 and 768 × 1024, that adaptation reads as three disconnected regions rather than one
composition, and the design owner rejected it. Measured, before any change:

| | 390 × 844 | 768 × 1024 |
|---|---|---|
| `Chapter` releases by | translating **up 20px** while all else is static | same |
| `II` travels | **83px left, 121px up** | **83px left, 148px up** |
| mid-junction frame | one 10px numeral alone in an empty frame | same |
| final pair | `II` y295 / `PHILOSOPHY` y316 — **two lines** | y359 / y380 — two lines |

The numeral makes the longest journey of anything in the junction. (F3's note that *"the numeral does
not travel"* on the narrow frame is true only of `--ii-travel`; the numeral moves regardless, because
`--pair-x` and `--num-y1` differ from where the lockup leaves it.)

### The approved mobile choreography

**01 → 02 — already satisfied, no work outstanding.**

    Chapter One
    → "One" releases
    → "Chapter" remains stationary
    → "II" enters directly into the Chapter II composition — it does NOT travel from
      the position "One" occupied
    → "Chapter II" settles as one left-aligned mobile lockup on the content axis

**02 → 03 — approved, NOT implemented.**

    "Chapter II" holds first
    → "Chapter" releases IN PLACE (the −20px translate is removed)
    → "II" remains on the same horizontal axis
    → "II" does NOT travel vertically
    → "Philosophy" enters FROM THE RIGHT
    → final composition is "II Philosophy" on ONE line
    → the final pair remains on the mobile content axis

**No vertical stacking is required at any supported width.** Measured ink at 390 (client 380, lockup
10px): `II` 11.6 + gap 17 + `Philosophy` 103 = **131.6px**, 35% of the frame, 217px spare. Same at 768.

### The hold

**0.32 of the 02 → 03 junction is the approved target** — 144px at 390, about 1.4 wheel notches. The
owner's reason is recorded as stated: *"a deliberate perceptual pause before the next choreography."*
It replaces the current 0.20, which is 90px — under one wheel notch, so a normal scroll passes through
the moment Chapter II is meant to register without stopping.

### What this direction preserves, and why it is not an invention

The desktop law is *a coordinate is vacated and inherited*. This is that law in mobile geometry:
`Chapter` vacates the content axis, `II` takes it, `Philosophy` enters to its right. Hierarchy, semantic
sequence and visual continuity are unchanged; only the geometry is the narrow frame's own.

### Scope when it is built

Every value involved is **already overridden inside `@media (max-width: 820px)`** — `--pair-x`,
`--topic-x`, `--topic-in`, `--num-y1`, `--topic-y`, and `.v2-word`'s mobile `translateY`. The phase
structure (`--k-release`, `--k-move`, `--k-topic`) is reused unchanged; only the hold's share moves.
**Desktop cannot be affected**, and was measured to confirm the contrast: centred pair, `II` steps
754 → 635, `Philosophy` enters from the right by one lockup gap, both on `50%`, one line.

### Open, and deliberately not folded in

On the narrow frame `II` fades in at its final line from about 40% of 01 → 02 while `Chapter` is still
travelling up to meet it, so it floats up to **44px above** the word — the mobile form of the orphaned
numeral recorded against 01 → 02. It is not part of this direction and remains open.

---

## Transition QA · states 01 → 04 · **30 August 2026** · implementer

**A QA pass, not a decision.** Nothing here was implemented and nothing was reopened by it. It records
what a visible Chrome actually showed, under real mouse-wheel scrolling, from the Hero through the frame
in which *Every unforgettable moment / deserves an experience.* has entered and settled. One finding is
blocking and is registered as such; the rest are ranked beneath it.

### Scope, and a correction to the scope as it was asked for

The statement is **state 04**, reached across **junction 03 → 04** — the fourth frame of the film. A
review scoped as *"Hero → … → Chapter III → the Ledger → the Work → the statement"* is scoped past it:
those are states 07 → 09 and they come **after** the statement, not before it. The pass therefore covers
**states 01 → 04 and junctions 01 → 02, 02 → 03, 03 → 04**, and stops where the statement settles.
Everything from state 05 onward was not inspected.

Tested in the order desktop → tablet → mobile: **1440 × 760, 1920 × 1080, 768 × 1024, 390 × 844**. Each
viewport hard-refreshed, the opening allowed to complete untouched, then traversed one wheel notch at a
time with stops inside every junction, reversed to the top, and traversed once fast.

**Junction lengths measured**, which is the frame the rest of this entry is read against:

| | 01 → 02 | 02 → 03 | **03 → 04** | frame |
|---|---|---|---|---|
| 1440 × 760 | 520px | 410px | **290px** | 1430 |
| 1920 × 1080 | 740px | 580px | **420px** | 1910 |
| 768 × 1024 | 700px | 550px | **400px** | 758 |
| 390 × 844 | 580px | 450px | **330px** | 380 |

03 → 04 is the shortest of the three at every viewport and it carries the thesis.

### 03 → 04 · **BUG · CRITICAL · BLOCKING** · all four viewports

**`II PHILOSOPHY` is drawn inside the statement for the whole junction.** Not near it, not behind it —
through it, on the line break.

| viewport | thesis | line break | the pair | overshoot past the thesis |
|---|---|---|---|---|
| 1440 × 760 | x195→907, y307–453 | y380 | y374–386, x667→978 | **71px** |
| 1920 × 1080 | x260→1195, y444–636 | y540 | y532–548, x890→1312 | **117px** |
| 768 × 1024 | x61→462, y471–553 | y512 | y506, x90→378 | — |
| 390 × 844 | x31→309, y394–450 | y422 | y416–428, numeral at **x31** | 38px |

`overlap: true` at **every** sampled progress at **every** viewport. The two are simultaneously legible
across roughly jat 0.35 → 0.85 — about 145px, **1.5 wheel notches** at 1440:

| jat | thesis ink | label ink |
|---|---|---|
| 0.53 | 0.28 | 0.47 |
| 0.63 | 0.44 | 0.37 |
| 0.70 | 0.54 | 0.30 |

**It deepens as the frame narrows.** At 1920 the label sits in the interline space and reads as a stray
third line. At 768 and 390 the interline space is smaller than the label's own set height, so the glyphs
**interleave** with the descenders of *unforgettable* and the ascenders of *deserves*. At 390 the numeral
lands on **x31**, which is the statement's own left margin, so `II` sits on the first characters of both
lines. Visible at 1:1, not only under magnification.

> **The root-cause paragraph and the proposed correction below are SUPERSEDED by C9 (31 August 2026).** They cite finding #4 of *"The lockup solved as one composition"*, which is itself superseded, and they propose restoring a vertical lift that two standing design-owner directions removed. **The measurements in this entry stand and were re-confirmed on 31 August; the diagnosis does not.** C9 records what was actually wrong — the junction had no release schedule — and what shipped.

**Root cause — the state 03 pair is at the frame's centre instead of the recorded composition.**
`--num-y0`, `--num-y1` and `--topic-y` all resolve to `--lockup-y: 50%`, and state 04's thesis is also
centred at 50%. Two compositions on one centre cannot both be centred without being drawn over each
other — which is the exact sentence this register already wrote.

**This is a regression against a closed decision in this document.** Finding #4 of the 02 → 03 pass
recorded the fault — *"`II Philosophy` stood in the sentence… Philosophy was drawn over* Every
unforgettable moment *through the whole hand-off; on a phone the pair sat on top of the wrapped
sentence"* — and its answer, recorded and closed:

> **State 03 is the same lockup, lifted off the sentence — a deviation from §2, recorded.** The pair now
> rises out of the frame's centre as part of the numeral's own reposition — one gesture, left and up, not
> two. Measured on the reference frame: the thesis inks its first line at **y322** and the pair's baseline
> lands at **y262**, leaving **60px** clear.

**Only the left half of that gesture ships.** The CSS beside those properties asserts the opposite of the
decision in as many words — *"the survivor's travel is lateral and nothing else — the numeral holds 50%
through the junction, so the group can never drift up or down."*

**On the narrow frames this is a regression introduced by C7 above, and the implementer's to own.** The
stacked adaptation C7 replaced set `--num-y1: calc(300 / 844 * 100%)` — 35.5% — which put the pair at
y295 / y316 against a thesis inking at y394: **66px clear**, decision #4 satisfied on the narrow frame.
C7 removed those overrides so the pair inherits `50%`, and at 390 it now stands at y416–428, inside the
sentence. 768 regressed the same way, being under the same breakpoint. **Desktop was already colliding
independently and has never satisfied decision #4.**

The approved C7 choreography is not implicated and is not reopened: `Chapter` releasing in place, one
continuous lateral move, `Philosophy` entering from the right, one line, the 0.32 hold — all correct and
all unaffected by the height the line stands at. What C7 lost is a **vertical** coordinate that was never
part of the approved direction. It was not caught because 02 → 03 was QA'd in isolation and stopped at
state 03 without crossing into the next junction.

**The recorded state 03 lift must be restored before 03 → 04 can be called valid.** Restoring it makes
the numeral's reposition the one gesture the decision describes — left *and* up, inside the move that
already happens — and costs the approved choreography nothing.

### 03 → 04 · the tail before the sentence · **DESIGN IMPROVEMENT · Moderate** · all viewports

Secondary to the above and worth doing with it. **The composition the whole of 02 → 03 exists to produce
survives for a third of a wheel notch.** Measured window in which the label stands at full ink and the
thesis is still at zero:

| viewport | clean window | wheel notches |
|---|---|---|
| 390 × 844 | **32px** | **0.32** |
| 1440 × 760 | 33px | 0.33 |
| 768 × 1024 | 53px | 0.53 |
| 1920 × 1080 | 56px | 0.56 |

The tail was authored — *"the pair has a tenth of the junction to stand settled before 03 → 04 begins —
that tail is the breathing space before the sentence"* — but in practice the label only reaches full ink
at 0.92–0.94 and 03 → 04 begins expanding it at the boundary, so almost none of it survives. The
asymmetry is the point: the design owner approved a **1.44-notch** deliberate pause *before* this
composition, and it is dissolved **0.32 of a notch** after it arrives.

Proposed, and not implemented: hold the label's expansion off the first ~0.20 of 03 → 04. The thesis
already waits until 0.35 for ink; it is the label that begins moving on the junction's first frame. This
is the cheaper half of the fix and turns the tail into roughly one full notch. **Do not add a pause
anywhere else** — the head of 02 → 03 is correct, and 01 → 02's travel is long enough at 520–740px.

### 01 → 02 · three findings, all still open, none newly discovered

- **C2 · the orphaned numeral · BUG · High · all viewports.** Confirmed desktop-wide, not a narrow-frame
  artefact. The numeral is **pinned at x754–772 for the entire junction** and only fades up from 0.45,
  while the survivor travels x301 → x653 past it: 415px apart at jat 0.50, 365px at 0.58, 265px at 0.73,
  101px at 0.99. For more than half the junction the frame holds two marks of different size at different
  vertical centres that do not read as a lockup assembling. §3 says the numeral *takes the place `One`
  vacated*; nothing takes a place, because it was never anywhere else. **Still blocked on ambiguity H** —
  whether it arrives on the coordinate `One` vacated or at §2's authored x756. No proposal until that is
  ruled.
- **C3 · linear travel · open.** Velocity snaps 0 → full at 0.28 and stops dead at 1.00. Unblocked and
  self-contained.
- **C4 · the release is too short · open.** 145px, ~1.45 wheel notches.

### 02 → 03 · **ACCEPT · closed, and it stays closed**

The approved C7 mobile choreography is correct and was re-verified here under real wheel at 390 and 768
inside the full run: 0.32 hold with `Chapter II` stationary across two full notches, `Chapter` releasing
in place, the numeral travelling 82.9px left with **zero** vertical movement, `Philosophy` entering 17px
from the right, `II PHILOSOPHY` settling on one line. Desktop unchanged — hold 0.20, release 0.44,
reposition 0.70, label 0.92, group centre 715.0 against a frame centre of 715.0 at 1440 and 955.0 / 955.0
at 1920. **No change.** The 03 → 04 finding above is about the height this composition stands at, not
about this junction's choreography.

### Hero vertical rhythm on portrait frames · **DESIGN IMPROVEMENT · Moderate · tablet and mobile only**

Lowest priority of the three improvements here. Every y coordinate is a percentage of a 760-tall
reference frame while the type clamps, so on a portrait frame the voids inflate and the content does not:

| viewport | dateline → title | subline → ordinal |
|---|---|---|
| 1440 × 760 | 151px · 20% | 182px · 24% |
| 768 × 1024 | **300px · 29%** | 293px · 29% |
| 390 × 844 | **244px · 29%** | 237px · 28% |

The hero reads as two thin bands of content adrift in a tall rectangle rather than as a composed frame.
Nothing clips and nothing is broken. Proposed, not implemented: on frames taller than ~1.2:1, tighten the
dateline-to-title band toward the desktop's ~20% rather than letting it scale with the frame. No new
visual language. **Desktop is correct and must not be touched.**

Two narrow-frame items already logged elsewhere stand unchanged: the ordinal at **10px** from the right
edge against the title's 31px left margin, and the title → subline gap, which reads correctly at 11px
after the previous pass's fix.

### Checked and accepted — recorded so they are not re-investigated

- **No clipping, no wrapping, no overflow, no horizontal scroll** at any of the four viewports anywhere
  through state 04. Nothing is cut off and no element leaves its frame.
- **Scroll purity holds.** Forward and reverse are **bit-identical** across 13 sampled positions spanning
  the whole run at 1440 — state, junction, progress, `--dusk`, and every element's opacity and x. The
  hero restores completely on reverse at every viewport, including after a fast 12-notch traversal.
- **State 01 matches §2 at every viewport.** Once the scrollbar is accounted for: title x194.6 against an
  authored 196, time right margin **103.3** against 104, ordinal right margin **37.7** against 38. The
  time and the ordinal do **not** share a right margin — that is §2's own authored pair, checked before
  flagging, and it is not drift.
- **State 04 settles correctly.** 64px Cormorant at x194.6, vertical centre exactly 380 = 50% of the
  frame, warm ember upper right, per §2. The composition is clean *once the label has gone*.
- **The Hero metadata releases as one curve.** The time *appears* to hold while the subline and ordinal
  fade; measured, all four are on one release and reach zero together at jat 0.29. The time only reads
  brighter because its `mix-blend-mode: overlay` couples it to the plate, and the plate brightens to a
  sunrise at exactly that moment. Correct as built. Worth knowing that the release is not perceptually
  uniform; not worth changing.
- **Console is clean on a clean load** — only the known F4 (`Junction 7 → 8 is shorter…`) and the
  informational 08 → 09 offset note. The `13 → 14` line and the CSS-chunk exception appear **only** during
  a Turbopack HMR reload, when the page is running a partially-applied stylesheet; they do not occur on a
  fresh load at 390 or 1440. The `message channel closed` exceptions are the browser extension, not the
  page.

### What this pass leaves standing

| item | class | severity | scope |
|---|---|---|---|
| State 03 pair drawn through the statement | **BUG** | **Critical** — diagnosed wrongly here; ruled and closed by **C9** | all four viewports |
| C2 · the orphaned numeral at 01 → 02 | **BUG** | High · blocked on ambiguity H | all four viewports |
| C3 · linear travel at 01 → 02 | **BUG** | Moderate | all four viewports |
| C4 · the release at 01 → 02 is 1.45 notches | **BUG** | Low | all four viewports |
| A tail after state 03 settles | **DESIGN IMPROVEMENT** | Moderate — folded into **C9** | all four viewports |
| The label expands past the statement's measure | **DESIGN IMPROVEMENT** | Moderate | all four viewports |
| Hero vertical rhythm on portrait frames | **DESIGN IMPROVEMENT** | Moderate | tablet and mobile only |
| 02 → 03, all four viewports | **ACCEPT** | — | closed |
| State 01 and state 04 compositions | **ACCEPT** | — | closed |
| Clipping / overflow / purity / console | **ACCEPT** | — | none found |

---

## C9 · Junction 03 → 04 · the expand retimed, and the collision closed · **APPROVED 31 August 2026** · design owner

*A **ruling**, and the implementation it authorises. It closes the Critical · blocking finding of the
30 August QA pass and the Moderate tail finding beside it, in one change to the presentation layer.*

### The premise the QA pass got wrong, corrected here

The 30 August QA entry named its root cause *"the state 03 pair is at the frame's centre instead of the
recorded composition"* and proposed **restoring the vertical lift** — the pair rising *left and up* out of
the frame's centre, clearing the thesis by 60px. It cited finding #4 of *"The lockup solved as one
composition"* as the decision being regressed against.

**That citation resolves into a superseded subsection.** #4's own header reads *"Superseded, 29 August
2026 (later the same day), by 02 → 03 rebuilt from the intended behaviour below."* The subsection that
superseded it states the opposite in as many words:

> State 03 · `II Philosophy` — one centred pair, compact gap, **on the frame's centre**.
> *"Nothing else moves, nothing travels vertically."*
> *"**3 · The vertical lift is gone** — §2's centre is restored, and F7 is opened below."*

and C7, approved the following day, says the same of the narrow frame: *"`II` does **NOT** travel
vertically."* Restoring the lift would therefore reverse **two** standing design-owner directions, not
restore one. The QA entry could not have done that on its own terms either — it opens *"A QA pass, not a
decision. Nothing here was implemented and **nothing was reopened by it**."*

**The design owner has ruled, 31 August 2026: the lift stays gone.** State 03 is centred; the approved C7
mobile choreography is unchanged; 01 → 02 and 02 → 03 are not touched. **The QA entry's root-cause
paragraph and its proposed correction are wrong and are superseded by this section.** Its *measurements*
stand — they were re-confirmed against resolved layout at 1440 × 760 on 31 August and match to a tenth of
a pixel.

### What was actually wrong

Not a coordinate. **Junction 03 → 04 was never given a release schedule.** Three expressions, unchanged
since the junction was first built, put two centred compositions on the screen at once:

```
.v2-numeral   opacity: … * (1 - var(--jp3))                          the pair fades across the WHOLE junction
.v2-topic     opacity: var(--k-topic) * (1 - var(--jp3))             the same
.v2-thesis    opacity: clamp(0, (var(--jp3) - 0.35) / 0.65, 1) * …   the sentence inks from a third of it
```

Both compositions resolve on `50%` — `--lockup-y` for the pair (`--num-y0`, `--num-y1`, `--topic-y` all
inherit it) and `top: 50%` for the thesis. So for **jp3 0.35 → 1.00, 65% of the junction**, both are lit
on one y-band. Measured on a real 1440 × 760 frame (client 1430), resolved layout:

| element | x | y | note |
|---|---|---|---|
| `.v2-thesis` | 194.6 → 906.8 | **307.0 → 453.0** | 64px / lh 1.14; the two lines meet at **y380.0** |
| `.v2-numeral` | 754.2 → 771.6 | **374.5 → 385.5** | |
| `.v2-topic` | 685.3 → 819.1 | **373.8 → 386.3** | at rest tracking |

The pair's ink band **straddles the line break dead centre**. The collision is static geometry, not a
timing artefact: it is present in resolved layout before the driver runs.

### Why F7 alone was not enough, and what option (ii) is

F7 — recorded by the 29 August pass and deliberately left unbuilt — clears the pair by `--jp3` 0.30
against a thesis inking from 0.35. It removes the collision in two values and changes no coordinate.

**But `spine.ts` gives this junction the verb `EXPAND`, the survivor `the label`, and the mechanism *"The
label expands into the sentence that defines it."*** The expand is `.v2-topic`'s
`letter-spacing: 0.44em + 1.46em * var(--jp3)`, authored across the whole junction. Clear the label at
0.30 and **70% of the expand runs invisibly** — the survivor of an expand junction stops surviving before
the thing it expands into arrives. F7 buys a clean frame at the cost of the junction's own verb.

**The ruling is option (ii): F7 *and* the expand retimed, so the two read as one gesture.**

    II PHILOSOPHY  ·  settled, standing
    → the label expands, visibly, at full ink through the meaningful part of its travel
    → the pair clears as the expand completes — one gesture, not expand-then-fade
    → a clean frame
    → the statement resolves

**The junction is strictly sequential, and that is forced rather than chosen.** Both compositions are
centred and neither may move, so overlap in *time* is overlap in *space*. There is no schedule that lets
the sentence arrive while the label is still lit. This is the same rule `actStory.printing.clears`
already states for Chapter III's own type — *the type clears, the empty room lightens, the answer is
printed* — and it is stated here for the same reason.

### The schedule

Declared once, on `--jp3`, in a block that owns this junction and no other — the shape the 02 → 03
rebuild established after five correction layers had to be torn out.

| phase | range on `--jp3` | what stands |
|---|---|---|
| **1 · Settled** | 0.00 → 0.16 | `II PHILOSOPHY` stands. The tail 02 → 03 was authored to produce and never got. |
| **2 · Expand** | 0.16 → 0.50 | the label tracks out, at full ink — the junction's own verb, performed where it can be seen |
| **3 · Release** | 0.34 → 0.52 | the pair clears, **beginning inside the expand's second half** so the two are one movement |
| **4 · Clear** | 0.52 → 0.56 | neither composition is lit |
| **5 · The statement resolves** | 0.56 → 0.88 | the thesis inks |
| **6 · Settled** | 0.88 → 1.00 | state 04 stands |

**Three things this changes and one it deliberately does not.** The pair gains a settled head; the expand
happens at full ink instead of behind a fade; the sentence reaches full ink at **0.88** rather than at the
junction boundary, so state 04 has a settled tail of its own before 04 → 05 begins eroding it. What is
**not** changed is the `(1 - clamp(0, --jp4 / 0.45, 1))` factor that clears the thesis — that belongs to
04 → 05 and this pass is scoped to stop at 03 → 04.

**One schedule at every width.** C7's re-proportioning was junction 02 → 03's hold, and is untouched.
03 → 04 measures 330px at 390 × 844 against 290px at 1440 × 760 — proportionally *more* room on the
phone, not less — so the phases need no narrow-frame override and none is added.

### Scope

`.v2-numeral` and `.v2-topic` keep their 01 → 02 and 02 → 03 factors **verbatim** — the numeral's
`clamp(0, (--jp1 - 0.45) / 0.55, 1)` arrival and the label's `--k-topic` entry — and only the junction-3
release factor beside them changes. `--lockup-y`, `--num-y0`, `--num-y1`, `--topic-y`, `--pair-x`,
`--topic-x`, `--topic-in` and every phase variable of 02 → 03 are untouched. `spine.ts`, `timeline.ts`,
`story.ts`, C4, C8 and every assertion are untouched. No coordinate moves at any viewport.

### Open, and reported rather than silently fixed

- **The junction may still be too short.** It carries `time: null` in `spine.ts` — no authored weight — so
  it takes a default share and lands at 290px at 1440, the shortest of the first three while carrying the
  thesis. Six phases on 290px is ~48px each. If it reads rushed after this change, **the answer is a
  weight, not a re-proportioning**, and it is the design owner's to give. C8 permits it; eight junctions
  carry one already.
- **State 04's reading time is decided by 04 → 05, not here.** `.v2-thesis` begins clearing at `--jp4` 0,
  so before this change the sentence was at full ink for a single frame at the junction boundary. Inking
  by 0.88 gives it a tail inside junction 3; whether it needs one inside junction 4 as well is 04 → 05's
  question and is not opened here.
- **The label still expands past the statement's ink.** §3's *expands into the sentence that defines it*
  invites the tracked-out label landing on the statement's own measure rather than on an authored 1.90em.
  That would be a new design decision and is not taken.

---

## Summary

| # | Conflict | Classification |
|---|---|---|
| C1 | Fourteen states specified, nine built | **DESIGN OVERRIDES EXISTING CODE** (inventory, order) + **IMPLEMENTATION GAP** (Thesis, Ledger, Your experience) |
| C2 | The Ledger has no place to land | **IMPLEMENTATION GAP** + **DESIGN OVERRIDES EXISTING CODE** (destination set) |
| C3 | "Your experience" is the entry the build removed | **DESIGN OVERRIDES EXISTING CODE** |
| C4 | The motion laws are head-on incompatible | **DESIGN OVERRIDES EXISTING CODE** |
| C5 | Ground and light system | **DESIGN OVERRIDES EXISTING CODE** — plate count and Environment contract locked by §11 |
| C6 | Typeface specified in V2, open in the repo | **DESIGN OVERRIDES EXISTING CODE** — closes `open-decisions.md` §7 |
| C7 | Coordinate authority below 1440 | **RESOLVED 26 Aug 2026** — 1440 × 760 is a design reference frame, not a production viewport; adapt in the stated order of preservation |
| C8 | Timing authority, scroll versus clock | **RESOLVED 25 Aug 2026** — hybrid: scroll owns progression, time owns only what the visitor did not cause |
| P1–P4 | C5 / C6 preflight — Venice pan, `playbackRate`, About composition, Venice binding | **CLOSED 27 Aug 2026** — see the preflight section above |
| C5 | The Environment, built | **IMPLEMENTED 27 Aug 2026** — architecture only; see the C5 section above for what it expresses and what still stands in front of it |
| C8 | The three runways collapsed | **IMPLEMENTED** — one continuous narrative position `p`; the pins survive as per-segment prices, not coordinate systems |
| C4 | The thirteen junctions on `p` | **IMPLEMENTED 29 Aug 2026** — junctions resolved as intervals on `p`, `--junction` / `--junction-at` published; 08 → 09's offset ruled internal; findings A and B closed by the design owner above |
| — | Junction 02 → 03, the lockup | **IMPLEMENTED 29 Aug 2026** — one centred lockup, one size and one baseline, a width-neutral exchange of renderings in place of the cross-fade, and state 03 lifted clear of state 04's sentence; §2's vertical centre for state 03 is the one authored coordinate given up |
| — | The V2 presentation, states 01 → 09 | **IMPLEMENTED 29 Aug 2026** — see the transition register above. Every value classified A / B / C / D; **eight flagged (F1–F8); F8 closed by the owner, F6 reverted, F2 partly closed, the rest unsettled** |

**No entry now needs somebody who is not the implementer.** C7's breakpoints were the last of the eight,
and the design owner answered them on 26 August 2026. Four of the eight closed — C5's plate count by
§11.2, C8 by the hybrid decision, C1's film/publication question with it, and C7 by the responsive
adaptation rule — and the four preflight questions closed on 27 August 2026 with the plates in hand.
**Everything outstanding is work, not decisions.**

---

## Documentation blockers still standing

1. ~~**The canonical source cannot be read.**~~ **Cleared, 25 August 2026.** The PDF is twelve pages,
   still image-only, but its pages render with `npx pdf-to-img` and it has been read in full. There is
   no `poppler` on this machine, so `pdftotext` returns twelve form-feeds and `pdftoppm` is absent —
   whoever picks this up next should use the same route rather than concluding the file is unreadable.
2. ~~**C5's plate count is contradictory inside V2.**~~ **Closed by §11.2.** Three plates ship;
   `dawn_warm.png` is a derivative and must not appear in production code. What survives is smaller:
   states 04 and 05 are grounds without a plate and §5 names no plate for 05 — recorded in C5.
3. **`open-decisions.md` §7 is answered but still recorded as open** (C6), and its §7 still points at
   `design-system-inputs.md`, which is now `docs/design/archive/brand/design-system-inputs.md`.
   `docs/brand/` is locked and was not edited.
4. **`docs/development/01-validation.md:4` and `02-motion-system.md:4`** both read *"governed by
   `docs/brand/` (locked)"*. The path still resolves, but its contents changed underneath the claim —
   `05-storyboard.md`, `design-system-inputs.md` and `vision.md` left that directory for the archive.
   Soft; recorded so it is not discovered twice.
5. **Two open items V2 itself declares, neither blocking the build.** Junction 04 → 05 is undecided by
   choice — *"Build it as a hold; a beat can be added later without touching either state."* And the
   production plates: `studio_about.png` at 455 × 302 is storyboard-grade only, so states 10–12 and the
   Hero time treatment need the real still or master footage **before visual QA, not before
   implementation starts**.

---

## C10 · The promotion prototype adopted into the film · **APPROVED 6 September 2026** · design owner

The design owner reviewed the build against three prototypes of this stretch — `prototypes/promotion`
(3001), `prototypes/the-synthesis` (3002) and `prototypes/the-threshold` (3003) — and chose **3001, the
promotion**, as the direction for junctions 06 → 08. This records what that costs against V2 and what it
does not touch.

### The one place it contradicts §2

**§2's exposure column for states 06 and 07 is re-authored.** The column gives `0.13` at state 06 and
`0.48` at 07; the build now carries `0.62` and `0.74`. State 08 moves from `0.85` to `0.86`, which is
inside rounding, and **state 09 keeps §2's `1` and is still the brightest state on the site.**

The reason is not a preference. At `0.13` the venice plate is a texture rather than a photograph — the
campanile, the water and the couple are all below the point where the eye reads them as an image — and
the line standing on it is *"Some moments deserve another chapter."* Erasing the moment in order to say
the sentence is the wrong trade, and it was the clearest single difference between this build and the
prototype the direction was chosen from. `0.62` is that prototype's own held value: the room is
unmistakably down while the type is the subject, and the photograph is unmistakably there.

**Nothing else in the column moves.** The Ledger's own exposure at each of these states is untouched,
the plate identities are untouched, and 05 → 06 still arrives on the same junction.

### What was adopted, and what it replaced

| | |
|---|---|
| `chapter` → `Studio` | the survivor is promoted rather than joined by a numeral. The `chapter III` lockup is retired; the numeral is held back to the rail (`TIMING.dock.numeral`) |
| the exchange | a fade out, a held frame and a fade in — `TIMING.dock.dip`, 100 / 30 / 100 px. Measured overlap between the two words is **0px** |
| the deck | §5's micro-caps replaced by the serif at 500 / .075em / full ink, at 31 / 52 of the card |
| the rail's grade | new — `.v2-rail-grade`, `TIMING.dock.grades`. Without it `Questions` and `Contact` sit on the sun's specular track |
| the consumption | **left to right**, and the full stop rides `another` rather than leading. The old right-to-left order put a word-shaped hole in the middle of the sentence |

### Two faults found and fixed on the way

- **The index never finished arriving.** `draws.at` was `0.962` with a `0.005` stagger and `0.028` over,
  so the fifth row resolved to `1.010` and was clamped: `Contact` stood at `0.71` of its ink for the rest
  of the film. `0.952` is the largest value that closes the arithmetic exactly.
- **The sentence's hole**, above.

### The camera, adopted whole

`TIMING.dock.camera` carries the prototype's own move: a slow push that begins only once the statement
has been read, and a recompose that opens the framing to the left so the rail has a field to land in.
Both terms complete at `opens[1]` and clamp, so the index is drawn onto a frame that has already
stopped.

**It is added to §2's pan rather than replacing it.** `--env-pan` is §2's *plate panned 20%* and §3's
*"the frame pans off the canal"*; the push and the recompose are a scale and a percentage translate on
the same layer. The three compose in one transform on `.env-plate-venice`.

**The card no longer rides the pan.** It used to carry `--env-pan-throw × --env-pan × --release` so the
camera could travel off it; the prototype's card holds still and fades instead, and that term is gone
from `.v2-chapter`, `.v2-three-line` and the veil.

### The exposure is a curve, not a column

`TIMING.dock.exposure` holds the prototype's five stops — held down while the type is the subject, one
dip for the breath before the mark, opening as the scene comes alive, and settling 2.9% darker as the
frame comes to rest. The driver resolves them and `.env-plate-venice` spends them as
`brightness/contrast/saturate`, overriding `--env-exposure` for the length of this gesture.

**A column cannot say "dip".** That is the whole reason this is not expressible as §2's per-state
values, and it is why states 06 and 08 now carry this curve's own first and last luminance — so the
Environment hands over to it and back again without a step.

### The pair steps out of the line

`TIMING.dock.pairs`, and `place()` measures the delta off the rendered line. Without it `another
chapter.` stands a quarter of the frame right of centre for the whole of its hold, because the sentence
is centred as a whole and half of it has just left.

**`--word-dx` needs no compensation for it**, and assuming it did was a fault worth recording: the
delta is latched lazily, on the first frame after `--settle` reaches 1, which is long after `--pairs`
has finished — so it already measures from the slot as the line has carried it. Subtracting the pair's
travel spent it twice and put the survivor 426px right of the card. Measured on the running page.

### The rail's head is type — `III — Studio`

The three drawn strokes, their measured cap height and character advance, the per-stroke falls, the
stack and the reposition are all retired. The head was a numeral that lay down into a horizontal bar
group in the corner — the most generic interface object there is, set on a cinematic photograph, saying
*menu* where the film had spent seven hundred viewport heights earning *chapter*.

The numeral steps back a value and the tie further still: at equal ink the head reads as two words of
the same rank, which makes the numeral a title, and it is a running head rather than a title.

**This is the *"Chapter III entry / menu concept"*** that `CLAUDE.md` and the 1 September handoff
reserved for its own exploration. The reservation is lifted by this decision. It changes the Ledger for
states 08 through 14, and the mobile masthead was re-checked at 388 with it.

### Still open

**Whether §2's 20% pan should stay now that the push is there.** The two compose and read well together,
but the prototype never had the pan and the frame now carries more camera than either reference did.
Not decided here.

---

## C11 · One composition, 04 → 09 · **APPROVED 7 September 2026** · design owner

**This entry supersedes C10 wherever the two disagree, and it supersedes parts of §2 and §3. It is the
current approach. A future session must not restore what is listed under *Superseded* below.**

The design owner directed that the stretch from the three occasions to the work be built and read as
**one cinematic composition** rather than as a sequence of states that each animate:

```
A wedding. / An artist. / A memory.
  → Some / moments / deserve another chapter.
    → chapter
      → Studio
        → the rail
          → Work
            → Wedding Experience
```

### The five decisions

**1 · `chapter` ends the narrative.** It is held alone on the photograph and then it leaves. There is
no `chapter → Studio`: no morph, no letter transformed, no word displaced to make another, and no new
mechanism substituted for the morph. `TIMING.dock.holdsWord` is that hold and nothing may be scheduled
inside it.

**2 · `Studio` is an independent composition.** It arrives on an empty frame after the breath, at the
size it had in the sentence, and it never grows, never shrinks and never travels to the rail. The rail's
head is separate type that lights in the margin the recompose opens (`TIMING.dock.lights`).

**3 · The sentence is a left-aligned column and `chapter` is its anchor.** §2 sets state 06 as *52px
serif, centred*; it is now three authored lines placed so that **the surviving word** stands on the
frame's centre (`--anchor-dx` / `--anchor-dy`). `Studio` is centred on the same point, so the two
compositions share one axis and the exchange displaces nothing.

**4 · *What we actually make* belongs to the work.** It is removed from the studio's arrival entirely
and not replaced. It is now the label over the work's categories — `site.three.work.makes` — where one
category is on screen at a time, exchanged on the film's own out/breath/in grammar. **No dots, arrows,
pagination or slider**: it must read as an editorial revision of one line, never as a component
advancing. No per-category destination is invented while the work behind them does not exist.

**5 · The work's block breathes.** *Wedding Experience* and its two lines are lifted off the floor of
the frame, and state 09 holds at full ink through the first 45% of junction 09 → 10 (`TIMING.work.holds`)
instead of fading linearly across all ~4,100px of it.

### Superseded — do not restore

| Decision | Was | Standing |
|---|---|---|
| `chapter → Studio` by promotion | C10, 5–6 September 2026 | **OBSOLETE.** `chapter` ends the narrative; `Studio` is a separate entry |
| The survivor's travel to a centred card | `TIMING.dock.settles` / `registers` | **OBSOLETE.** Nothing travels; the word is set on the anchor it ends on |
| The pair re-centring the line | `TIMING.dock.pairs` | **OBSOLETE.** A consequence of centring, and the centring is gone |
| *What we actually make* as the Studio's deck | §2 state 07, C10 | **OBSOLETE.** It is the work's label — `site.three.work.makes` |
| The deck's wipe and its `backdrop-filter` veil | `TIMING.dock.deck` | **OBSOLETE.** Retired with the line they served |
| The numeral beside the name, assembling | `TIMING.dock.numeral` / `assembles` | **OBSOLETE.** The head is type and has been since C10 |
| The strokes' reposition, fall and stack | `TIMING.dock.reposition` / `falls` / `stacks` / `gap` | **OBSOLETE.** They were already unconsumed; they are now also wrong |
| §2's *centred* sentence at state 06 | `final-design-spec.pdf` §2 | **Superseded for this state.** The column is the approved composition |
| State 09 fading across the whole junction | `1 − --jp9` | **OBSOLETE.** `--work-holds` |

### What this costs against V2, stated plainly

Two departures from the Final Spec, both directed by the design owner in this session:

- **§2's state-06 sentence is a column, not a centred line.** The copy is untouched; the setting is not.
- **§2's state-07 second line is gone from that state.** The copy is untouched and still on the site; it
  is over the work instead.

Everything else §2 and §3 specify for 06 → 09 is unchanged: the plate identities, the pan, the exposure
curve C10 authored, the Ledger's own column, and state 09 as the venice plate at true exposure.

### Still open, carried forward from C10

**Whether §2's 20% pan should stay now that the push is there.** Unchanged by this entry and still not
decided.

---

## C12 · `Studio` is removed from the sequence, and the photograph is the bridge · **CANONICAL — 7 September 2026** · design owner

> **THIS IS THE CURRENT DECISION FOR JUNCTIONS 04 → 09. It supersedes C11, C10 and, where they
> disagree, `final-design-spec.pdf` §2 and §3.**
>
> **A future session must not reintroduce `Studio` between `chapter` and the rail**, in any form, for
> any reason, however an older document phrases it. If a document asks for it, that document is out of
> date and this entry is what corrects it.

### The architecture, and it is the whole of it

```
A wedding. / An artist. / A memory.
  → Some / moments / deserve another chapter.
    → chapter
      → the photograph, alone            ← no type of any kind
        → the composition opens · the rail is written
          → Work
```

### 1 · `Studio` is not in this sequence

**It is removed, not corrected, not delayed, not relocated, and not replaced by a better transition.**

- There is no `chapter → Studio`. No morph, no letter transformed, no word displaced to make another.
- **No new mechanism was invented to fill the gap.** What follows `chapter` is the photograph and then
  the camera; nothing was added to compensate for the removal, and nothing may be.
- There is no `Studio` held back to appear later in this stretch.
- **`chapter` is the last typographic moment of the narrative.** After it, the experience passes
  directly into the studio's structure through the rail.

The studio's name still exists on the site, **once**: `site.mark.label`, the Ledger's running head
`III — Studio`, set as type at 15px in the margin the recompose opens. Verified on the running page —
across 64 sample points from the first frame to the last, the only element that ever paints the word is
`.mark-lab`, and it first appears at junction 07 @ 0.76, which is `TIMING.dock.lights`. Nothing travels
there and no word hands over to it: a running head is a different act from a title.

### 2 · The bridge from `A memory.` to `Some moments deserve another chapter.`

**The photograph is the link, and the reason it did not read as one was structural.**

The passage went through a blackout. `atmosphere.dip` took the frame to **28%** of its level and held a
floor of near-black between the fall and the rise; the ground handover was hidden *inside* that floor,
on the reasoning that it "is not watched"; and the sentence formed on the way back up. So the visitor
saw `A memory.` go, the screen go dark, and the light return with a different sentence already standing
on a photograph that had arrived unseen. **Two states with a cut between them** — which is exactly the
reset that was reported.

Three changes, all of them subtractions or re-timings. **No effect was added.**

| | was | is |
|---|---|---|
| `atmosphere.dip.depth` | 0.72 — the frame to 28% | **0.26**, and **no floor**: `fall` ends where `rise` begins |
| `atmosphere.groundSwap` | `[0.896, 0.958]`, **consumed by nothing** | **`[0.700, 0.845]`, and it is consumed** |
| `memories.deconstruction` | `[0.818, 0.907]`, inside the blackout | **`[0.790, 0.858]`**, over a photograph that is there |
| `memories.sentence` | `[0.907, 0.968]` | **`[0.900, 0.962]`** |
| the beat between them | `THE DIP FLOOR`, priced 2.0 of near-black | **THE BRIDGE**, priced **3.0** — with the arrival holds |

**The handover was a literal in the stylesheet.** `--v2-handover: (--jp5 − 0.75) / 0.25` — choreography
written into `globals.css`, invisible to `timing.ts` and to `timeline.ts`'s assertions, while
`groundSwap` sat in the choreography file unread. The driver publishes `--q5-swap-at` /
`--q5-swap-over` now and the literal is gone. That is a `CLAUDE.md` non-negotiable repaid, and it is
also what made the beat editable at all.

**What the visitor sees, measured in Chrome at 1456 × 800:**

| junction 05 | |
|---|---|
| 0.59 → 0.79 | `A memory.` at full ink while the plate rises **under it**, 0.65 → 0.88 |
| 0.83 | the word at 0.41, the light easing, the plate at 0.90 |
| **0.86 → 0.90** | **the photograph alone. No type. ~280px** |
| 0.93 | the sentence at 0.46, forming on the same photograph |

### 3 · A second reset, found while validating this one

**The sentence's column was not anchored during its own arrival.** `--anchor-dx` was measured only once
`junction >= TIMING.dock.from` (06), but the sentence arrives across junction **05** — so for the whole
of that arrival the stylesheet fell back to 0, the column stood with its top-left corner on the frame's
centre instead of its survivor, and junction 06 then snapped it left.

Measured before the fix: `deserve another chapter.` ran from x 720 to x 1210, across the couple, and
then jumped to x 470. The measurement is pure layout and needs no gate; it is taken on the first frame
the element exists.

### 4 · Work

Unchanged from C11 in intent, and lifted again in composition.

- **`What we actually make` belongs to the work** and does not return to the moment before it. One
  category at a time, exchanged on the film's own out/breath/in grammar. **No dots, arrows, pagination
  or slider.**
- **The `Wedding Experience` block was still too low at 196/760 and is at `268/760`.** Its baseline now
  sits just above the frame's middle, at the height `chapter` and the sentence stood at — so the eye
  does not travel down the frame between the narrative ending and the work being named. The continuity
  is vertical as well as photographic, and the bottom third of the plate is left empty.

### Superseded — do not restore

| | Standing |
|---|---|
| `Studio` as a display word anywhere between `chapter` and the rail | **OBSOLETE.** C12 §1 |
| `chapter → Studio` by promotion, morph or any replacement mechanism | **OBSOLETE.** C12 §1 |
| `TIMING.dock.dip.in` and `--comes` — a second word arriving after the breath | **OBSOLETE.** `leaves` is the exit; nothing arrives |
| `TIMING.dock.holdsLockup` / `releases` / `--release` — holding and releasing the name | **OBSOLETE.** `holdsFrame` is the photograph |
| `content/site.ts` `two.close.becomes` | **REMOVED** |
| `.v2-studio` | **REMOVED** |
| A blackout at the chapter turn, and a ground swap hidden inside it | **OBSOLETE.** C12 §2 |
| `--v2-handover` as a literal in `globals.css` | **OBSOLETE.** It is `atmosphere.groundSwap` |
| C11's *"`Studio` is an independent composition"* | **SUPERSEDED.** It is not in the sequence at all |

### What this costs against V2

Three departures from the Final Spec, all directed by the design owner:

- §2's state-06 sentence is a **column**, not a centred line (C11, unchanged).
- §2's state-07 second line is **not in that state** (C11, unchanged).
- **§2's state 07 has no display word at all.** The lockup is gone and the state is the photograph
  between the narrative and the structure.

The copy is untouched in every case. The plate identities, the pan, C10's exposure curve, the Ledger's
own column and state 09 as the venice plate at true exposure are all unchanged.

### Still open, carried forward

**Whether §2's 20% pan should stay now that the push is there.** Untouched by this entry.

---

## C13 · `A memory.` ends the narrative; the Work is an editorial carousel · **CANONICAL — 7 September 2026** · design owner

> **THIS IS THE CURRENT DECISION FOR JUNCTIONS 04 → 09 AND FOR STATE 09.**
> It supersedes C12, C11 and C10 in full, and — where they disagree — `final-design-spec.pdf` §2, §3,
> §4 and §11.2.
>
> **Three words are gone from the site and must not return in any form:**
> `Some moments deserve another chapter.` · `chapter` as a state · `Studio` as a display word.
> **Two more are gone from state 09:** the `Wedding Experience` headline and `Other experiences →`.

### The sequence, and it is one composition

```
Chapter One → Chapter → II Philosophy → Every unforgettable moment deserves an experience.
  → A wedding. → An artist. → A memory.
    → the photograph, alone            ← no type of any kind
      → the composition opens · the rail is written
        → the Work
```

**`A memory.` is the last typographic moment of the narrative.** It stays centred, because that
composition works. It leaves, the photograph holds on its own, the camera opens the frame, the rail is
written in the field it opens, and the same photograph takes on its second job as the Work's first
experience. **The image and the reframe do the work the sentence used to do in words.**

### The Work

```
WHAT WE ACTUALLY MAKE      eyebrow · sans · uppercase · editorial tracking · never the protagonist
Wedding experiences        the category · serif · 38px at the reference frame · the protagonist
See full experience →      the offer · smaller · normal case · a way IN, never a way forward

                                              Raquel & Flávio        ← lower right, small,
                                              28 · 08 · 2027 — VENICE   discreet, a caption
```

and, on its own clock:

```
WHAT WE ACTUALLY MAKE
Art experiences
See full experience →
                                              Cibele
                                              ABSTRACT / 2026
                                              PORTO & MADRID
```

**The photograph is the protagonist and is never covered.** The 80px `Wedding Experience` headline said
in the frame's largest type what the category above it already said, and it lay across the couple.

### Scroll does not control the carousel

**Scroll owns entry and exit of the section. The carousel has its own clock** —
`TIMING.work.carousel.holds`, 9 seconds — which is exactly what C8 reserves a clock for: *time owns only
what the visitor did not cause.* The visitor causes their progress through the page; they do not cause
which experience is on show.

The clock runs only while the section is composed (`data-work` on the root, written by the driver) and
**resets to `venice` when it is not**, so arriving in the Work always lands on the photograph the film
just ended on.

**No dots, no pagination, no thumbnails, no cards, no slider arrows.** The exchange is the film's own
dip — out, a gap carrying nothing, in — so two categories are never legible together.

### The two experiences

| | category | photograph | identification |
|---|---|---|---|
| `venice` | Wedding experiences | the film's own last frame | Raquel & Flávio · 28 · 08 · 2027 — VENICE |
| `artist` | Art experiences | `public/media/projects/artist/art.png` | Cibele · Abstract / 2026 · Porto & Madrid |

There is no third until there is a third project. `projects.<id>.category` is what the carousel shows;
`title` stays the project's own name for the Work aside.

### Superseded — do not restore

| | Standing |
|---|---|
| `Some moments deserve another chapter.` | **OBSOLETE.** Removed from `content/site.ts` (`two.close`), the markup and the stylesheet. Do not replace it with another conceptual line |
| `chapter` as an intermediate state | **OBSOLETE.** `A memory.` ends the narrative |
| `chapter → Studio`, by morph or any mechanism | **OBSOLETE** (was C10, C11) |
| `Studio` as a display word in this sequence | **REMOVED** (C12, and still true) |
| `Wedding Experience` as state 09's headline | **REMOVED.** §2's own row for state 09 is superseded |
| `Other experiences →` | **REMOVED.** The section offers a way in, not a way sideways |
| Scroll choosing the category (`--make1..3` scrubbed by `--jp9`) | **OBSOLETE.** The carousel is a clock |
| `Performances`, `Exhibitions` as categories | **OBSOLETE.** They were words with nothing behind them |
| C12's `holdsFrame`, `becomesAt`, `leaves` in `TIMING.dock` | **REMOVED** with the word they timed |
| §11.2's *"three plates ship"* | **SUPERSEDED.** Four — the Work's experiences need a ground of their own |

### What this costs against V2

- **§2's states 06 and 07 carry no type at all.** The sentence and the lockup are both gone.
- **§2's state-09 board is re-composed.** The headline and the fourth line are removed; the category, the
  offer and the identification replace them.
- **§11.2's plate count moves from three to four.** `env-plate-experience` is the Work's, and it is the
  one plate `motion/environment.ts` does not decide — the carousel does.

The copy that survives is untouched. The plate identities for states 01–09, the pan, C10's exposure
curve, the Ledger's own column and state 09 as the venice plate at true exposure are all unchanged.

### Faults found in the visible browser, and fixed

Every one of these was invisible to the typecheck and the DOM, and was found by looking:

1. **The category rendered `Wedding Experience`** — the project's name, not the plural category. Added
   `projects.<id>.category`.
2. **The carousel started on `Art experiences`.** An `IntersectionObserver` on `.v2-work` fires from the
   first frame of the session, because `.v2` is a **fixed** layer. Replaced with `data-work`.
3. **The clock never ran.** Gating on `--state === 9` was wrong: the Work is composed across the tail of
   junction 08 → 09, where the state is still 8. Eleven seconds parked in the section and the category
   never changed.
4. **Two categories legible at once for 780ms.** A cross-fade. Replaced with the film's dip.
5. **The venice plate showed through the artist's photograph** — the Salute's domes across a studio
   wall. `.v2` is at **0.84** by the time the Work is composed, so a plate drawn inside it composites
   over the ground instead of being one. The experiences' plate moved to the Environment.
6. **The rail went dark on a lit photograph.** `grounds.cross` takes the page to the publication's ink
   across [0.04, 0.16] of junction 09 → 10 and cannot move (`arriving.empty` needs the paper first), and
   the Work was holding to 0.45. The Ledger measured `srgb 0.059 0.055 0.047` on a lit studio wall.
   `TIMING.work.release` takes the Work out by 0.06, ahead of the cross.
7. **The category never appeared while scrolling.** Its scroll-driven arrival and its clock-driven
   exchange were on one element, and the exchange's 680ms delay swallowed the arrival. Split: the
   arrival is on `.v2-make-slot`, the exchange on `.v2-make-word`.
8. **The rail lost its burn on the artist plate**, then **the Work's own type washed out** when the
   grade was moved to compensate. Resolved by ordering: Environment plates → `.v2-rail-grade` → type.
9. **`See full experience →` vanished on Art**, taking the block's third row with it and changing the
   composition's height with the content. It renders inert instead, as `contact.write.address` does.
10. **The identification was at 0.6 of its ink** when the section was otherwise complete — its arrival
    ran past the block's own envelope. All four arrivals now close inside `arrives.block`.

### Still open, carried forward

**Whether §2's 20% pan should stay now that the push is there.** Untouched by this entry.

---

## C14 · The Work's categories are a queue of words · **CANONICAL — 16 September 2026** · design owner

> **THIS IS THE CURRENT DECISION FOR HOW STATE 09 IS NAVIGATED.** It supersedes C13's *arrows and a
> count* (the 14 September amendment) and reinstates a clock on the section. Everything else in C13
> stands: the sequence into the Work, the photograph as the bridge, the dip, the caption in the corner.
>
> Chosen by the design owner from four explorations (Q1–Q4) as **Q2 · *fila que roda***, and implemented
> as explored: *"não quero mais uma ronda de exploração de alternativas."*

### The composition

```
WHAT WE ACTUALLY MAKE          eyebrow · unchanged
ART   EXHIBITION   …           the queue · the category words, in the eyebrow's register
Wedding experiences            the active category · the headline · left-aligned, never travels

                                              Raquel & Flávio
                                              28 · 08 · 2027 — VENICE
                                              See full experience →     only where the work has a URL
```

**The category word is the index.** The active category is the headline and is **not** in the queue, so
the small word (a category preparing) and the headline (the category standing) are never the same claim
at once. The next category stands first, directly above the headline, and **fills from the left with
time** — the word itself, not a mark beside it.

### The cycle — `TIMING.work.queue`, milliseconds

1. The first word fills across `holds` (8 000).
2. When it is full it is **promoted**: it leaves the row on the dip's own `out`, as the headline leaves.
3. The row **moves up** across `moves` (420) while the frame is empty; the category that was showing
   re-enters at the tail. The promoted word is placed at the tail without a transition, unseen.
4. Headline, caption and photograph change on the dip's own signal (`carousel.exchange.at`).
5. Once the new headline has arrived (`out + gap + in`), the next word starts to fill.

**A press completes the word** (`completes`, 320) and promotes it; the queue carries on from there.
Hovering or focusing the row holds the clock. Under `prefers-reduced-motion` the queue does not advance
on its own; the words stay pressable.

### Why a clock again, and why C8 still allows it

The 14 September ruling removed the 9-second interval because a control made the choice the visitor's.
The design owner has now asked for autoplay with the words as the control. C8's licence holds: which
category stands is not the visitor's until they press a word, and **scroll never changes it** — scroll
only decides whether the section is composed (`data-work`), and the clock runs only while it is. Leaving
the section stops the clock and empties the fill; the category shown is kept.

### Model

`site.three.work.makes.categories` — `{ word, headline, work }`, in queue order. **One representative
work per category**; a newer work replaces it by changing `work`. The first must stand on the plate the
film ends on (venice), or the entry becomes a swap. `projects.<id>.category` is removed — the headline
belongs to the category, not to the project.

### What changed in the build

| | |
|---|---|
| `makes.experiences`, `makes.step` | **REMOVED** → `makes.categories` |
| `projects.<id>.category` | **REMOVED** → `makes.categories[].headline` |
| `.v2-step*`, `01 / 02`, `←` `→` | **REMOVED** |
| `See full experience →` under the headline, inert on Art | **MOVED** into the caption (`.v2-ident-open`), **absent** without a URL |
| `TIMING.work.arrives.cta` / `--wk-cta` | **RENAMED** `arrives.index` / `--wk-index` — the queue arrives with the eyebrow |
| `TIMING.work.queue` | **NEW** — `holds`, `moves`, `completes`; `--fade-queue-move` |

### Verified in Chrome, 16 September 2026

Autoplay Wedding → Art → Wedding with photograph, caption and offer changing in the gap; a promoted word
leaving in ~380 ms and the row recomposing after it; a press completing in ~320 ms and promoting; hover
holding the clock; leaving the section emptying the fill and keeping the category. Four categories were
exercised with two temporary entries (removed): Wedding → Art → Exhibition, the queue rotating, no
overflow at 1440, 768 or 390 (widest row ends at x 326 of 388). A clean load reaches all fourteen states
with no console errors; the arrival order into the Work is label and queue, then category, then caption.

### Still open

- **WCAG 2.2.2** asks for a way to pause content that moves on its own for more than five seconds. Hover
  and focus hold the clock and reduced motion stops it; there is **no explicit pause control**, because
  the design owner ruled out additional UI. Carried forward.
- **A row wider than the frame** (roughly six or more categories at 390) runs past the edge and fades
  rather than wrapping. Not yet seen with real content.

### Addendum · a third category · 16 September 2026 · design owner

`Selected Projects` joins the queue as a record and an entry, with nothing else changed in the mechanism:

| word (queue) | headline | work | caption |
|---|---|---|---|
| Weddings | Wedding experiences | `venice` | Raquel & Flávio · 28 · 08 · 2027 — VENICE · *See full experience →* |
| Artists | Art experiences | `artist` | Cibele · Abstract / 2026 · Porto & Madrid |
| Selected Projects | Experiences beyond categories | `selected` (`public/media/projects/selected/selected.png`) | SELECTED · A collection of singular projects · Made in Porto · Shared with the world |

The queue words are the design owner's plural forms (*Weddings*, *Artists*); the two existing headlines
are unchanged. The Selected caption has three levels, so `context.label` is an **optional** line above the
name, set in the metadata's own style — no new style. No URL was given, so no offer is drawn.

Verified in Chrome at 1920 and 390: Weddings → Artists → Selected Projects → Weddings in autoplay, the plate,
headline and caption changing in the gap; a press on *Selected Projects* promoting it; at 390 the longest
headline ends at x 290 of 388 and the row fits without overflow.

---

## C15 · About is a frame, and 09 → 10 is a superimpose · **16 September 2026** · design owner brief

> **The current composition of state 10 and of junction 09 → 10.** Supersedes C6's pending
> *"composing the type over the plate"* and the paper scrim About stood on. The Work, Q2, the categories
> and 01 → 09 are untouched.

**The brief.** About read as a conventional page laid over a photograph — a milky scrim, a column of
paragraphs, a heading — and the passage from the Work was broken: the scrim arrived as a pale band
scrolling up over the studio, and the ink flipped from light to dark at the state boundary with the
words still on screen.

### What it is now

```
ABOUT                                          We work directly with our clients…   ← evidence
We stay close                                  ——
to every detail.          ← the claim          Built exclusively for you.
                                               NO TEMPLATES. · NO COPIES. · NOTHING MADE TO FIT TWICE.
            [ the studio plate: the man at his desk, one lamp — no scrim ]
```

- **No scrim.** `TIMING.grounds` state 10 is `veil 0, ink 1`: the film's light ink on the dark room, so
  nothing in the register changes from the Work and the Ledger keeps its ink.
- **A frame, not a page.** `.about` keeps its height as runway (82vh; 85vh below 820 — the heights it
  already had, so every junction after it costs what it cost). `.about-stage` is fixed in the viewport,
  written onto the plate on `arriving`'s grammar with About's own windows (`TIMING.about.arrives`), and
  **released in place** early in 10 → 11 (`TIMING.about.release`) — §3's *extinguish*. The method's
  approach is unchanged.
- **§2's two groups, staggered and unequal.** The claim on the Work's own left axis, the eyebrow in the
  Work's eyebrow register; the evidence as a narrow column at x838, the refusals in the caption register.
  Both above the figure and clear of the lamp. Headline authored in two lines.
- **09 → 10 is §3's superimpose, narrowed.** The plates used to cross across the whole junction
  (~5,300px at 1920 × 889 — a half-and-half ghost). They now dissolve inside `TIMING.about.superimpose`
  [0.06, 0.34]: the studio rises over venice, which stays whole until it is covered, so the frame never
  dips. The headline resolves inside it (§3's *headline at 30%*). `motion/environment.ts` `crossWindows`.
- **The camera arrives.** The studio comes in 4% close on the lamp and settles to rest across
  `TIMING.about.settle`; scale is 1 before and after, so the method and the relight are unchanged.
- **A phone** keeps the claim high and puts the evidence on the dark of the figure's shirt; the studio
  plate is framed at 26% so the man and the lamp are both in the portrait crop.

### Retired

`.about-spread`, `.about-words`, `.about-opening`, the About scrim (`--ground-near/far` on `.about`), the
observer-driven clock arrival (`data-reveal` on About; `TIMING.publication.about` is now read by nothing).

### Verified in Chrome, 16 September 2026

1920 × 889, 1440 × 900, 768 × 1024 and 390 × 844: no overflow, no horizontal scroll; the arrival runs
label + headline → paragraph → rule → principle → refusals and is whole before state 10; the stage is at
0 by 10 → 11 @ 0.3 and the method arrives as before.

**Not verified:** the no-scripting version against `next start` (the composed alternative is written in
`page.tsx`'s noscript block but was not opened with scripting disabled); iOS Safari.

### C15 amendment · 16 September 2026 · design owner

1. **Work → About no longer depends on the active work.** The experience plate left with the Work's
   *type* (`--work-holds`), so any category but Weddings dissolved back to venice before the studio
   arrived. Now the studio plate stacks **beneath** venice and the experience plate
   (`environment.tsx`), stands whole as the window opens, and the Work's ground clears off it: the
   experience plate carries `--env-venice`, and venice's image steps aside while an experience covers it.
   Verified with Weddings, Artists and Selected Projects — each dissolves from its own photograph.
2. **`Built exclusively / for you.` is two authored lines** (`about.principle`), and every About line is
   an unbreakable box; the paragraph arrives without tracking. Its height was constant at every frame
   of slow and fast scroll at 1920, 1440 and 390.
3. **Scroll starts, time resolves.** The driver writes `data-about` (how many of About's three groups
   `TIMING.about.arrives.at` the hand has passed); each group resolves on its own curve
   (`arrives.ms`) and is released on `leaves` when scrolled back. The camera's settle — the tree moving
   as the type lands — and the release stay on scroll.
4. **Breathing room.** The groups sit inside the camera's settle and the last one is written by ~0.6 of
   09 → 10; the frame is then still for ~1,000px (1,050 at 1920 × 889, 1,025 at 1440, 975 at 390)
   before state 10's darkening and release.

---

## C16 · The method is an editorial composition, not a space · **18 September 2026** · design owner brief

**Status: implemented for states 11 and 12's composition. The About → Method *transition* is explicitly
deferred and nothing in it was touched — see "What was deliberately not done" below.**

### The brief

Six instructions, taken from the design owner's direction of 18 September 2026:

1. *"Pensa no Method como uma composição editorial dentro do quarto vazio. Não como uma lista de frases
   centradas num background. As frases devem parecer pensamentos/fragmentos que habitam o espaço."*
2. *"criando profundidade visual através de escala, posição e hierarquia tipográfica, **NÃO** através de
   parallax."*
3. Micro-annotations in caps — *"pequenas notas de margem / indicações editoriais relacionadas com o
   processo"* — discreet, typographically refined, and **few**: *"poucas são melhores."*
4. `OBSERVE · UNDERSTAND · SHAPE · PRESERVE` as a signature of the process, *"não uma checklist de
   agência"*, never a large title.
5. *"Quero REDUZIR a animação actual do Method… A composição deve ser suficientemente forte para
   funcionar quase parada… Evita stagger excessivo. Evita que cada frase tenha uma animação própria."*
6. *"O About e o Method devem parecer dois momentos do mesmo filme"* — presence and absence, person and
   space, proximity and process, legible without reading a word.

### What this supersedes

**`decisions.md` §55 and §56 — the spatial field — are retired.** The section carried a `perspective`
and a `perspective-origin`; twelve considerations stood at twelve real depths inside it, three of them
deliberately occluding each other, every one rotated toward the focus, with a differential parallax
camera underneath. It was measured, it was tuned by eye, and instruction 2 rules out its central device
by name.

**It is also a return to V2 rather than a departure from it.** §4 authors state 11 as *"seven overheard
lines, in sequence and rising in scale: 15 · 16 · 17 · 18 · 21 · 26 · 36px — so the field is
chronological as well as spatial"*, and §2's anchors put the question at *62px serif, x196, bottom 142*
and the answer at *104px serif, x196, y262*. Nothing in the Final Spec asks for a third dimension here.
The space was V1's, underneath a composition V2 had already authored flat.

### What was built

**The field.** Seven lines, flat, placed as fractions of the frame, set in Cormorant 300, rising 15 →
36px on §4's ladder with the ink running with it (0.96 → 0.52 — the faintest still measures 5.5:1, the
floor §56 held). Both ends of the ladder are clamped independently so the ratio degrades rather than
collapses: 2.40:1 at 1440 and above, 2.12:1 at 1100, 1.85:1 at 768, never under 13px.

**Composed against the photograph.** The lamp (x 0.13–0.24, y 0.53–0.86 of the frame), the desk (below
0.82), the plant (x 0.56–0.80) and the rail (left of 0.10) are the fixed obstacles; every line stands in
the upper wall band, the panel between the lamp and the plant, or the right quarter. The bottom-left
corner is left empty because the studio's question arrives there.

**Two margin notes** — `Overheard, not directed` and `Kept exactly as it happened` — in the micro-caps
register the rail and About's three refusals already use, at 0.44 ink (4.7:1). Two, not more.

**The signature** — four words at the foot of the frame on the page's axis, hairline-separated, in the
register every label on the site shares. A colophon, not a list: `<p>` and `<span>`, never an `<ol>`,
because a list element tells a screen reader this is a numbered procedure.

**One axis.** `--v2-x` is V2's x196, and the method's question, answer, signature and first note now
stand on it. The section used to take `--page-x` (246), so the two halves of one passage were composed
50px apart. `.about-stage` still declares the same expression under its own name; collapsing the two
touches About and belongs with the transition work.

**One arrival grammar.** Everything in the frame resolves the way About and Contact do — the tracking
closes, the ink rises inside it, six pixels of settle land last. That is instruction 6 as a mechanism
rather than as a resemblance.

**The movement, reduced.** Seven lines arrive in **three** reveals (`--mw1`, `--mw4`, `--mw7`), the notes
and the signature in a fourth (`--mw10`), the question last (`--mw12`). The convergence no longer
gathers: the field is released in place, with ten pixels of lift, on `--mgather`. The camera survives at
a quarter of its size **with no differential** — one plane, about 17 × 20px across the whole
accumulation — which keeps the frame answering the wheel without being a parallax.

**No beat was authored, re-priced or invented.** Every span above already existed in `methodSpans`; what
changed is how many things consume them. `--mw2/3/5/6/8/9/11`, `--minvite` and all four question cues are
still resolved and published and are now read by nothing. **Open:** rebuilding `methodSpans` to match
what is drawn is a separate change with its own assertions to re-argue.

### One defect found and fixed, and it was not in the brief

**The method's resolution was unreadable, and had been.** `--page-ink` is a function of position, and
state 12 is placed **inside** the method's held frame — so `TIMING.grounds.cross` turned the page from
the studio's ink to Questions' warm stone about 400px into junction 12, while the frame was still held
and `--manswer` was still rising. Measured at 1440 × 749: ink 1.00 at 3,600px into the section, 0.00 at
4,000px. `Your experience` therefore resolved **light on a ground that had already gone light** — the
~1.1:1 frame `story.methodStory.printing` exists to prevent, arriving from outside the section rather
than from its own beats. The three-stage printing then ran on a page that had already been given back,
and the rail crossed to dark ink over a room that was still dark.

`scroll-stage.tsx` now composes `--page-ink` with the method's own `--mroom` at the point it is written:
the page stays the studio's ink until `printing.returns` gives it back, and then falls to paper on the
section's own curve. Outside the method the second term is zero. The veil is deliberately left alone —
junction 12 still takes it 0.60 → 1.00 across the resolution, which with the ink held is the room going
fully dark around the answer, and that is `resolve.holds` performed rather than contradicted. It is
composed in the driver rather than scoped to `.method` because a section-scoped override cannot reach
the Ledger.

### What was deliberately not done

**The About → Method transition is untouched, on the design owner's instruction of 18 September 2026.**

> **Superseded the same day by C17.** The design owner confirmed both photographs as they are and
> reversed the approach: the difference between the two rooms became the subject rather than something
> to be corrected or hidden. The diagnosis below is what C17 was built against and is kept for that.

The diagnosis stands and is recorded here so the work can resume against it:

- Junction 10 → 11 is **903px at 1440 × 749** — about 1.1 viewports — and six things happen inside it at
  once: About's type leaves (`jp10` 0.04 → 0.30), the page veil crosses 0 → 0.55 in **108px**, the studio
  plate dissolves 1 → 0, the exposure falls 1.02 → 0.12 on the same curve, the method's room gradient
  runs 0 → 0.98, and the method plate stands at full presence underneath from the first frame.
- **The two plates are not the same room.** Measured on the files: `method.png` is **+60% mean
  luminance** (33.3 against `image19aug26.png`'s 20.7), warmer (R mean +18.7) and higher in contrast, and
  it carries a **hard-edged daylight window projected on the right wall that does not exist in the other
  plate** — the per-cell difference reaches 50–76 levels of 255 across the right quarter. The desk
  contents, the chair and the plant differ as well. At the middle of the junction the frame is a
  half-and-half average of two visibly different photographs, and the right quarter *brightens* while
  everything else darkens, which is the moment the eye reads a second image arriving.
- **The design owner is re-shooting the plate** to the About frame's own camera, perspective, furniture,
  lamp position, scale, colour temperature and light, with the absence of the person as the only
  narrative change and no new light source. The transition is to be re-implemented and re-validated
  against the new plate; the deep-exposure staging offered as an alternative was declined.

### Verified in Chrome, 18 September 2026

`npm run typecheck`, `npm run lint` and `npm run build` clean.

Composition measured element by element at **1920 × 985**, **1440 × 749**, **768 × 929**, **390 × 844**
and **844 × 390** (landscape): no horizontal overflow at any of them, and no box intersects another at
the fully composed frame. Two collisions were found this way and fixed rather than left: at 390 the
first margin note was written over `.method-label` (moved to the right margin) and the field ran through
the question's band (the column now stops at 0.55); at 844 × 390 the field and the question landed on the
same rows (the frame is now read as two columns, the field left of the right-hand page).

The section's three moments were seen at 1440: the field complete with the question standing, the answer
alone and light in a fully dark room, and the answer printed dark on paper with its line beneath it.

**Not verified:** iOS Safari, which cannot be tested from this environment.

---

## C17 · About → Method is a passage of time in one room · **18 September 2026** · design owner brief

**This supersedes C16's deferral.** C16 recorded that the transition was paused pending a re-shot plate.
The design owner has since confirmed both photographs as they are — `image19aug26.png` and
`method.png` — and reversed the approach: *"Em vez de esconder essas diferenças, quero usá-las como
parte da narrativa."* The two rooms are not continuous, and that is now the subject rather than the
fault.

    ABOUT   a pessoa está presente · o estúdio está habitado · a luz é quente e baixa
    METHOD  a pessoa já saiu · o espaço permanece · a luz mudou · entrou outra atmosfera no quarto

    "o mesmo espaço, algum tempo depois" — and never "acabou uma secção e carregou outra imagem"

### What was making it artificial

Three findings, all seen in Chrome at 1440 × 749 before anything was changed.

**1 · The window drew itself, and that is the frame the eye catches.** `method.png` carries a
hard-edged daylight window on the right wall that `image19aug26.png` does not have — 50 to 76 levels of
255 across the right quarter. With the plates crossing over the whole junction in falling but still
substantial light, that window is **the only thing in the frame whose luminance is rising while
everything else falls**. It is legible as a positive shape by **jp10 ≈ 0.35** and unmistakable at
**0.44**. That, and not the person going transparent, is the moment the brain says *another photograph*.

**2 · The light and the exchange were on the same curve, so the darkness was never used.** Exposure ran
1.02 → 0.12 and the plate mix ran 0 → 1 across the identical span, which guarantees that the frame is at
half light exactly where the plates are at half each. There was no frame that was dark *and* not
mid-exchange. Narrowing the window alone could not have fixed this: the light has to go first.

**3 · Nothing was ever still.** About's type released over `[0.04, 0.30]` and the page veil crossed
0 → 0.55 in **108px**, both on top of a photograph that was already changing. And the whole passage was
**840px — about 1.1 viewports**, nine wheel notches for the entire thing.

### The choreography

**Four movements on junction 10 → 11, and the plates are exchanged in the one where nothing can be
seen.** `TIMING.about.passage` holds every number and argues each of them.

    0.00 → 0.22   the room stands. About's type leaves it (`release`, now ending exactly at `holds`)
                  and nothing else in the frame moves at all.
    0.22 → 0.54   the light goes down, 1.02 → 0.09. The person loses definition because the light
                  leaves them, which is what happens to a silhouette when a room goes dark.
    0.40 → 0.58   the image loses its definition with it — contrast 1 → 0.30. It **trails** the light
                  rather than sharing its window; see below.
    0.60 → 0.72   the still frame. The plates change places inside it.
    0.74 → 1.00   the empty room comes up to state 11's own exposure and the contrast returns with it.
                  The new light — the window on the right — arrives as part of that rise rather than
                  as a shape that draws itself.

**The floor is a grade, not a level, and that is the whole mechanism.** The first build put the exchange
at an exposure of 0.04, which does hide 70 levels of difference — and measured **2.66 mean luminance out
of 255** in Chrome. That is the black screen the brief rules out, and it was also pointless: state 11's
own room composites at about 15, so a floor that deep makes the second half a further darkening instead
of the empty room coming up.

So the exposure falls to `floor` **and the contrast falls to `softens` with it**. That is the brief in
its own words — *"a pessoa começa a perder definição; a imagem torna-se mais silenciosa"* — and it is
what actually happens in the room being photographed: a space lit by one lamp is a high-contrast space,
and when that lamp is the thing going out, what collapses first is the modelling, not the average. The
image goes quiet before it goes dark.

It is also the arithmetic that works. What has to disappear is the *difference* between the plates,
which after `contrast(c) brightness(b)` is `70 · c · b`; what has to stay is the *field*, which is
`(127.5 − 107.5 · c) · b`. Darkness alone puts both on one lever. Splitting them lets the difference fall
to under two levels while the field holds at **9.4 measured on the running page** — three and a half
times brighter than the black floor it replaces, with the lamp still reading against it.

**`contrast()` is applied before `brightness()`** — it pivots on mid-grey, so it has to act on the
plate's full range and be taken down afterwards. `globals.css` owns the order, on `.env-plate` and again
on `.env-plate-studio`, which redeclares `filter` and is the plate the passage takes the light out of.
§11.1 permits the *grade* to change, and a contrast is a grade; `--env-contrast` is **1 at every other
state and junction on the site**, so nothing else pays for it.

**And the softening trails the light, which took a second pass to find.** Run on one window, the crush
lifts the blacks faster than the brightness takes them down, and on a plate this dark — mean 24 of 255,
so nearly every pixel is a long way below the mid-grey pivot — the lift wins for the first third of the
fall. Composited frame by frame off the real plates: the room went **+43% brighter** between 0.24 and
0.36 and the right quarter nearly four times brighter, before it began to go down at all. A grey bloom,
which is the exact opposite of *a atmosfera começa a escurecer muito subtilmente*, and the spot
screenshots did not show it — only the dense trace did. Starting the crush at 0.40 puts it entirely
inside the second half of the fall, where there is no longer enough brightness left for the lift to
show. Re-composited: **0.0% bloom**, monotone throughout, residual ripple across the floor under one
level of 255.

**The passage was given room to be a passage.** `.about`'s `height: 82vh` was a scroll distance written
into a stylesheet — the one thing `03-choreography.md` does not allow — and it was buying the whole
four-movement sequence 840px. It is now `TIMING.distance.about` at **175vh**, published as `--about-pin`
beside the three held-frame runways and carrying the same 1.5 for a thumb. At 1440 × 749 the junction is
**1,550px, about two viewports**; each movement has 340 to 500px of its own. It retimes nothing — every
number in `TIMING.about` is a fraction of this junction — and About's own composition is untouched,
because `.about-stage` is fixed in the viewport and arrives on junction 09 → 10.

**Nothing was added.** No parallax, no 3D, no transform, no blur, no particles, no new element and no new
animation. The passage is two graded numbers on one photographic element and the opacity of one plate.

### Verified in Chrome, 18 September 2026

`npm run typecheck`, `npm run lint`, `npm run build` clean. The only console assertion is the
pre-existing junction 13 → 14 shortfall (0.398 against 0.405), which is between Questions and Contact and
is not touched by any of this.

**Measured on the running page at 1440 × 749**, rendered-frame luminance of 255:

    jp10   exposure  contrast  plates      frame mean   right quarter
    0.05     1.020     1.00    studio        25.60          6.78
    0.39     0.526     1.00    studio        11.82          3.23      ← used to peak at +43% here
    0.56     0.090     0.30    98 / 2         8.78          7.76
    0.62     0.090     0.30    54 / 46        9.38          8.89      ← the exchange, mid
    0.75     0.090     0.32    0 / 100       11.27          9.62
    0.89     0.110     0.77    method        13.21         12.09
    1.00     0.120     1.00    method        15.00         15.19

The right quarter — where the two photographs differ most — moves **1.9 levels across the entire
exchange**, and its maximum is pinned at 39 in all three frames of it: the window does not draw itself
anywhere. From the floor to state 11 the frame rises monotonically 8.8 → 15.0, so the empty room comes
*up*.

**Seen, not only measured.** At 0.39 the room is quiet with the person still one solid silhouette, one
plant, no window and no doubling anywhere. At 0.62 the frame is a soft dark room with a warm centre and
no trace of two pictures in it. At 0.89 the empty room is resolving — lamp, desk edge, and the window
arriving as light on the right. At 1.00 the Method's own composition begins on it.

**Reversal is exact.** Parked at y 19200 from above and from below, once the input spring settles, every
published value is identical to four decimal places — the passage is a pure function of position, as
everything else on this site is.

**390 × 844**, driven in a same-origin frame: the same four movements over 1,830px, floor frame at mean
10.27 with no black screen and no doubling, and the empty room arriving with the rail and the label. No
horizontal overflow.

**The no-scripting version** against `next start` with scripts disabled: About renders whole in flow and
the Method follows it on paper. `--env-contrast` falls back to 1 and `--about-pin` to 175vh, and the
noscript block's own `height: auto` overrides the runway as it did before.

**Not verified:** iOS Safari, which cannot be tested from this environment.

### The Method, unchanged

C16's composition is exactly as it was — the seven lines on §4's ladder, the two margin notes, the
signature, the question at `bottom 142` on the axis, the three reveals, the flat field. Re-measured after
the runway change at 1440 × 749: **zero collisions, no overflow**. Nothing in the section reads the
junction that was re-choreographed.

---

## C18 · Twilight, and a composition that was already there · **18 September 2026** · design owner brief

Two corrections to C17 and C16, both from watching the passage on video. The concept, the photographs
and About are untouched.

### 1 · The floor was right in kind and too deep

*"há um intervalo demasiado negro entre About e Method… Pensa em crepúsculo, não blackout."*

C17 put the plate exchange at `floor: 0.09 · softens: 0.30`. That hid the exchange and overshot the
passage: composited off the real plates, the frame spent **614px under a mean of 12 and 476px under 10**
— most of a viewport of near-black between the two rooms.

**The correction is a different point on the same trade, not a shallower dip.** What has to stay small
is the *ratio* of the two plates' difference to the field they sit in, and after `contrast(c)
brightness(b)` that ratio is `70·c / (127.5 − 107.5·c)` — it depends on the **contrast alone**. So
crushing further and lifting the light hides the exchange *better* while leaving the room brighter:

    floor · softens    field    Δ/field    under 12    under 10
    0.090 · 0.30        9.5      0.220       614px       476px
    0.115 · 0.22       13.2      0.148       107px         0px

The room now settles at **13.2 against state 11's own 15.0**, a real fall from About's 25.7 and a gentle
recovery, and it never goes below 10 at any frame. The darkest stretch is **107px instead of 614**, and
the still frame itself is 217px instead of 310. `holds` 0.22 → 0.20, `falls` 0.54 → 0.56, `lifts` 0.74 →
0.70, `soft` [0.40, 0.58] → [0.42, 0.575], `cross` [0.60, 0.72] → [0.58, 0.685]. About's `release` ends
at `holds` as before.

### 2 · The Method was building itself

*"o Method começa demasiado vazio e depois vai adicionando frases progressivamente… parece uma animação
de loading"* · *"o espaço já estava assim; eu é que comecei a reparar nele."*

C16 gave the section five arrivals on its own clock — three reveals of the field on `--mw1`, `--mw4` and
`--mw7`, the notes and signature on `--mw10`, the question on `--mw12` — spread across about 2,900px of
runway, all of it *after* the junction had finished. So the visitor arrived in an empty room and watched
it be written. That is also half of why the dark read as a blackout: there was nothing on the far side of
it for almost two viewports.

**The composition now arrives on About's own junction, and what reveals it is the room's light.**
`TIMING.method.composed` is `[0.46, 0.72]` of junction 10 → 11 — it closes before the empty room has
finished coming up — and every element is already multiplied by `--mlit`, which rises with `--menter`
across the same stretch. Measured on the page, the composition's opacity **equals `--menter` at every
frame**. There is no arrival to watch: the type is lit because the room is lit.

  - **`--mfield`** carries the seven lines *and* the signature, in one movement. No grouping attribute,
    no stagger — §5 of the brief: *OBSERVE — UNDERSTAND — SHAPE — PRESERVE deve já pertencer à
    composição*, and a colophon is part of the page it is printed on.
  - **`--mnoticed`** is the only thing that happens afterwards and it carries three elements — the two
    margin notes and the studio's question. They are not a second arrival of the composition; they are
    what you find in it once you have taken it in, which is what a margin note is. It reads `--mw1`, the
    earliest span the method's clock has, so it lands about a viewport after the room.

Nothing else in the section reads a beat until the convergence. `--minvite`, all four question cues and
`--mw2 … --mw12` are published and read by nothing; rebuilding `methodSpans` to match what is drawn
stays open, as C16 left it.

**The layout is untouched** — the seven lines, their ladder, their coordinates, the two notes, the
signature and the question are exactly as C16 composed them. Only how they gain presence changed.

### Verified, 18 September 2026

`npm run typecheck`, `npm run lint`, `npm run build` clean.

**1440 × 749**, the junction measured at 1,540px:

    jp10    exposure  contrast  studio  method  menter  field  notes/question
    0.244     0.983     1.00     1.00    0.00    0.00    0.00      0.00
    0.374     0.591     1.00     1.00    0.00    0.00    0.00      0.00
    0.504     0.174     0.56     1.00    0.00    0.00    0.00      0.00
    0.634     0.115     0.22     0.47    1.00    0.05    0.03      0.00   ← the exchange, dead centre
    0.765     0.116     0.31     0.00    1.00    0.45    0.45      0.00
    0.895     0.119     0.78     0.00    1.00    0.89    0.89      0.00

Rendered-frame luminance of 255 across the exchange, measured on the page: **12.29 → 12.62 → 13.31**,
with the right quarter — where the two photographs differ most — moving **11.64 → 11.89 → 12.44** and
its maximum pinned at 37 throughout. So the window never draws itself, at a floor 31% brighter than
C17's. Seen at 0.635: a soft dark room with the desk and the wall still legible and no trace of two
pictures in it.

The composition is **whole 100px past the method's flow top** — as the room finishes coming up — and the
notes and the question land at +900 to +1100. Nothing between them.

**390 × 844**: the same four movements, the same floor (0.115 · 0.27 at jp10 0.747), the composition's
opacity again equal to `--menter` at every frame, the notes and question at about +900, and state 14
reachable at the document's last pixel.

**Not verified:** the final visual pass at normal and slow scroll speed, and iOS Safari. The Chrome
window went `visibilityState: hidden` partway through this session — occluded by another window — which
stops `requestAnimationFrame` and makes the compositor return stale frames to a screenshot. Every number
above was taken with the driver snapped deterministically (`read()` with no timestamp, which takes the
exact frame rather than the eased one), and the luminance measurements were taken while the window was
still in front; the moving picture has not been re-watched since.

---

## C19 · The Method is a photograph again, and the crossing is spatial · **18 September 2026** · design owner brief

*"A transição está demasiado escura… A fotografia do METHOD deve ser tão visualmente presente e legível
quanto a fotografia do ABOUT. A magia deve estar na TRANSIÇÃO entre as duas fotografias. Não em escurecer
o Method."*

Phase 1 only: the photograph, the light and the atmosphere. **The Method's words and layout are not
touched** — C16's composition and C18's arrival are exactly as they were, by instruction.

### What was hiding the photograph — and it was not the exposure

Three layers multiplied, and the exposure was the smallest of them. Decomposed off the real plate at
1440 × 749 (the model reproduces the measured state-11 frame to within 1.5%):

    layer                                        mean     sd
    the plate, graded  brightness(0.12)           4.55    3.17
      + .method background  --mground 0.45       12.85    1.74
      + [data-ground]::before  --page-veil 0.55  15.17    0.79
    ────────────────────────────────────────────────────────────
    ABOUT for comparison  exposure 1.02, no veils 23.76   22.81

**The photograph had 3% of its own range left on screen, against About's 102% — 34× weaker — and 3% of
About's rendered detail.** And the two flat ink veils cost more than the exposure did: after
`brightness(0.12)` the picture still had a standard deviation of 3.17, and the veils took it to 0.79,
removing three quarters of what was left while *raising* the mean from 4.6 to 15.2. That is why it read
as a flat grey wash rather than as a dark room. **The veils were not darkening the photograph, they were
replacing it with their own tone.**

    --mground    `.method`'s own background-image, `--mroom × 0.45`   →  0.10
    --page-veil  `[data-ground]::before`, TIMING.grounds.states[11]   →  0.12  (12: 0.60 → 0.14)
    exposure     §2's column, spine.ts state 11                       →  0.80  (12: 0.20 → 0.86)

**0.80 is the brightest grade that keeps every one of the seven lines above 4.5:1 without moving a
single word.** Checked line by line against the local ground each one actually sits on: worst 4.59:1
(`Nobody planned that.`, which sits on the window). At 0.88 that line drops to 4.35 and fails, so 0.80 is
the ceiling the existing composition allows. The plate keeps 63% of its range and renders at 73% of
About's detail. §2 authored the .12 column when the Method was a flat ink room with type in it; it is a
photograph now, and the design owner has ruled the column.

### Why the crossing had to stop being a dissolve

**A uniform crossfade between these two plates cannot be hidden at a brightness worth looking at.** The
difference relative to the field is `70·c / (127.5 − 107.5·c)` — it depends on the **contrast alone**, so
darkening only moves both terms together. Composited off the real plates at the midpoint, a uniform
dissolve has exactly two outcomes and both were seen:

  - **at full light** — the person is a translucent blob, the plant is doubled and the window is fully
    drawn. This is what raising the grade alone would have shipped.
  - **crushed enough to hide all three** — a featureless grey with the room gone. This is what C17 and
    C18 shipped, and it is the complaint.

So the plates are exchanged **across the frame instead of across time**. The departing plate is cleared
left to right behind an edge two thirds of the frame wide, and the direction is the narrative: the person
is centre-left and is the one thing that is *supposed* to vanish, so they go first, over an empty desk
that has already resolved behind them; the window's daylight on the right wall is the **last** thing to
arrive, which is what makes it read as light reaching across the room rather than as a picture being
swapped.

**It is not a wipe.** Five stops across the band at the smoothstep alphas (0, .156, .5, .844, 1) — the
same approximation the rail's legibility field uses, because a two-stop ramp leaves a shoulder the eye
finds. At `--env-cross: 0` the band's far edge sits at 0% and the plate is whole; at 1 its near edge sits
at 100% and the plate is gone. There is no frame in which a line exists to be seen.

`--env-cross` is published by `environment.ts` and is *how far along* the travel is; `globals.css` owns
the band's width, because how far a thing travels across a frame is composition — the same division
`--env-pan` is under. Junction 10 → 11 is now the one junction where plate presence is **not** an
opacity: both plates stand at full strength across the whole of it and the mask decides what is seen
where. The two steps that creates are invisible by construction — the method plate reaches 1 while the
mask is completely opaque, and the studio plate reaches 0 after it is completely clear. The rail reads a
`share()` of the frame rather than the opacity, so its legibility field still measures the ground.

### And the dip is small now, because it is no longer doing the hiding

`floor` 0.09 → **0.62**, `softens` 0.22 → **0.86**, and the windows widened. With the crossing spatial,
the light only has to do what it says: go down, and come back. 0.62 against About's 1.02 and state 11's
0.80 is about two thirds of a stop — the room quieting, and no more. `softens` is the last of the old
device, kept because a little less definition helps the person let go, and because it is one number
rather than a mechanism.

    jp10   exposure  contrast  sweep   what is on screen
    0.00     1.02      1.00     0.00   About, whole — wall, lamp, person, desk, plant, books
    0.31     0.84      0.99     0.03   the same room, the light going down, nothing else moved
    0.55     0.62      0.86     0.48   the person dissolving; the empty desk already resolved behind
    0.79     0.65      0.88     0.95   the room empty, the window's light arriving on the right
    1.00     0.80      1.00     1.00   Method, whole — and the window is the new light, not a shape

### Verified, 18 September 2026

`npm run typecheck`, `npm run lint`, `npm run build` clean. Live values at **1440** and at **390 × 844**
match the composited prediction at every sampled frame; both plates present across the junction with the
mask deciding; `--page-veil` 0.12, `--mground` 0.10, exposure resolving to 0.80 at state 11 and 0.86 at
state 12.

**Judged visually on the real pixels, but rendered rather than watched.** The Chrome window went
`visibilityState: hidden` — occluded by another window, and Windows refused every programmatic attempt to
raise it — which stops `requestAnimationFrame` and makes the compositor hand stale frames to a
screenshot; two screenshots taken at the same scroll position came back showing different moments, which
is how it was caught. So every frame above was composited off the two real PNGs through the exact filter
chain the stylesheet applies, in order, and looked at as an image. That is what rejected the uniform
crossfade and the deep dip and chose the sweep.

**Outstanding:** the passage has not been watched in motion at normal or slow scroll speed since this
change, and the seven lines have not been seen sitting on the brighter room. Both need the window in the
foreground. iOS Safari cannot be tested from this environment.

---

## C20 · The Method's words are revealed in three waves · **18 September 2026** · design owner brief

Phase 2. **C19's transition is approved and frozen** — the photograph, the exposure, the sweep, the
grading and the layers are untouched here, and so are the layout, the positions, the sizes and the copy.
Only when each element gains its presence changed.

*"as palavras estavam aqui e estão a revelar-se à medida que entro."*

### What was wrong, and it was not a matter of taste

C18 put the whole field on one window, `composed: [0.46, 0.72]` of junction 10 → 11. Measured on the
running page, that was not "a little too static" — it was **no entrance at all**:

    jp10   --menter   line op   translateY
    0.695    0.204     0.185       0
    0.825    0.674     0.674       0
    0.955    0.992     0.992       0

Every element had **identical opacity at every frame, exactly equal to `--menter`**, and `translateY`
read **0 at every sample**. The reason: the window closed at jp10 0.72, and `--menter` — which is what
lights the room and therefore the type on it — is only **0.20** there. The six-pixel settle and the
tracking were real, and both were spent while the type was four fifths invisible. What was left on
screen was one uniform fade of the whole field. *"as palavras simplesmente estão lá."*

### The three waves

Both field windows now sit **inside the range where the room is lit** (jp10 0.62 → 1.00), so the
movement happens where it can be seen. `TIMING.method.composed`:

    wave 1  near   jp10 [0.70, 0.93]   the three largest lines on the ladder
    wave 2  far    jp10 [0.79, 0.99]   the four smallest, a breath later
    wave 3  --mw1  (method beat)       the two margin notes, the signature, the question

**The wave travels along the ladder, not along the copy.** `near` carries `Did you see that?`, `That
wasn't meant to happen.` and `It's starting.` — the three the eye lands on first — and `far` the four
smallest, which are found after. That is how a page is actually read, and it means the grouping is
already authored: it is `--wd`, the same number that decides each line's size and ink. No line has a
window of its own. **Within a wave nothing staggers: two moments in the field, not seven.**

The 0.09 between them is about 140px at 1440 — countable only if you are scrolling deliberately slowly.

**The signature moved from wave 1 to wave 3**, on instruction: the third wave is *apenas os detalhes
secundários — micro-anotações, OBSERVE — UNDERSTAND — SHAPE — PRESERVE, pergunta*. C18 had it arriving
with the field on the argument that a colophon belongs to its page; it still does, but the visitor is no
longer asked to read it at the same moment as the page.

**Movement:** opacity, the publication's own tracking channel, and `--arr-rise` — **6px**, inside the
4–8 the brief allows, and the same value About and Contact settle on. Nothing else. No new mechanism,
no new property, no per-element timing.

### One thing worth knowing about the settle

`.method-stage` sticks at `methodTop + 64`, and junction 10 → 11 ends at about `methodTop + 92` — so for
most of waves 1 and 2 **the held frame is still travelling into its lock**, and the six pixels are
concurrent with the stage's own scroll rather than read against a still frame. What carries the wave
there is the opacity difference, which is large and plainly visible. The settle reads as a settle in the
last stretch before the lock and fully in wave 3, which resolves inside the held frame.

Moving waves 1 and 2 later, into the held frame, would need a channel between `--jp10` and `--mw1` that
`methodSpans` does not currently resolve — which is the rebuild C16 left open and this does not reopen.

### Verified in Chrome, 18 September 2026 — window visible, in motion

`npm run typecheck`, `npm run lint`, `npm run build` clean.

**1440 × 749**, settled frames:

    jp10   --menter   NEAR op / ty    FAR op / ty     wave 3
    0.700    0.217     0    / 6.9     0    / 6.4        0
    0.793    0.558     0.23 / 4.5     0.01 / 6.3        0
    0.891    0.883     0.73 / 1.9     0.45 / 3.3        0
    0.957    0.994     0.99 / 0.9     0.83 / 1.4        0
    1.000    1.000     1    /  —      1    /  —         0
    +880px   (held)    1               1               0.55

**In motion, both speeds, sampled every frame of a real driven scroll.** A hard flick (900px in 420ms,
37 frames): NEAR leads FAR throughout — 0.18/0, 0.47/0.21, 0.87/0.58 — so the wave survives being
rushed and is over in under half a second, which reads as one arrival with depth in it. A deliberate
slow pass (900px in 4s, 568 frames): the gap holds at 0.25–0.30 of opacity through the middle of the
reveal — 0.13/0, 0.36/0.11, 0.67/0.38, 0.98/0.73 — so the two stages are plainly separate without ever
being countable as seven.

**Seen, not only measured.** At jp10 0.83 the three near lines are surfacing 3.5px low while the four
far ones are barely-there ghosts and the room is fully legible beneath them — attention finding a
composition, not elements loading. At 0.91 the near lines are standing and the far ones are still
resolving. At `methodTop + 880` the field is whole and the marginalia, the signature and the question
are resolving over it at 0.55.

**390 × 844**: identical behaviour — NEAR 0.06/FAR 0 at jp10 0.739, NEAR 0.71/FAR 0.43 at 0.887, settle
7px → 0.5px, wave 3 at 0.81 by `methodTop + 900`.

**Not verified:** iOS Safari, which cannot be tested from this environment.

---

## C21 · The Method's composition, and Questions in the room · **19 September 2026** · design owner brief

Three briefs in one session, recorded together because they are one section. The implementation is in
the tree; `docs/development/SESSION-HANDOFF.md` (19 September) is the operating summary.

### What was decided

**The field arrives in bursts, on the section's own beats.** Seven separate starts spread across
About's junction became three clusters on the method's runway — *"o scroll funciona como TRIGGER de
pequenas sequências autónomas… densidade maior, não velocidade maior"*. No arrival got faster. The
channel moved because a junction's `0 → 1` is priced and equal fractions of it are unequal distances;
a beat of this section is 150vh wherever you stand in it.

**The main composition is three pieces on About's own ladder**, arriving in the order they are read:
`YOUR EXPERIENCE` (78px), `Built around what makes yours unique.` (30px), `What makes it yours?` (17px).
The fourth piece — *Nobody is asked to answer. The studio is listening.* — is no longer drawn; the copy
is kept in `content/site.ts` and says so.

**The field is not cleared when the composition arrives.** `--mgather` and `--mkeep` are retired —
*"pensamentos espalhados pela sala + uma composição principal que emerge entre eles"*.

**Questions is read in the Method's room, and the environment changes at Contact.**

### Three departures from V2, and this is the record of them

1. **§2 gives state 13 `hero · sky band, graded`.** It stands on the method plate instead, so that
   `About → Method → Questions` is one room and `Questions → Contact` is the one change of environment.
   §11.2 is not violated: nothing new is loaded, and warm stone is still never an asset. The grade is
   retired for as long as state 13 is not on the hero plate (`environment.ts`, `stoneAt`).
2. **§2's *x196, y262* for state 12** is given up with the two-anchor composition it belonged to. The
   axis (`x196`) is kept and is what both sections share; the block stands on About's own vertical.
3. **State 12's entry is the question's arrival, not the answer's.** The statement is the *first* of the
   three pieces now; anchoring the state there would leave junction 11 → 12 with nothing in it. §2's
   state 12 is a board, so the state begins where that board is complete.

### What is open

The section's composition and rhythm are not finished — the direction is approved and small adjustments
of spacing and timing are expected. Nothing about the architecture is open.

---

## C22 · Contact is the hero's frame returned, and it writes itself · **24 September 2026** · design owner brief

The design owner stopped the Contact work, asked for a design evaluation against Questions, and chose
**direction B, *"Chapter One, outra vez"***: the site closes on the footage, axis, folio system and
image–text relationship of state 01, and the question passes to the visitor. The implementation is in
the tree; `docs/development/SESSION-HANDOFF.md` (24 September) is the operating summary.

### What was decided

```
state 01                         state 14
Chapter One                      Is there something / that deserves its own experience?
Where moments become digital.    hello@… · +351 …  /  WHATSAPP · TELEGRAM
I of III                         YOUR CHAPTER
```

- **The composition is state 01's.** The question stands on the hero's axis (`--page-x`, 259 at 1920,
  the same as `--x196`), in the dark ground left of the figure, one statement in two lines at 1 : 0.88.
  The address takes the tagline's place under the rule. **YOUR CHAPTER is the folio**, in `.v2-of`'s
  own corner (`38 / 1440` right, `44 / 760` from the foot) and register. No centred card, no panel.
- **The figure is the constraint.** `--c-room` is the ground between the axis and her (44.5% of the
  width at desktop); the question is sized to it and the rule shortens to 78% of it.
- **Questions' closing rule survives the whole passage** and is the line Contact is written on — §7's
  node, restored. `persisting.retires` (22 September) is removed.
- **Scroll owns the passage; a clock owns Contact.** TRIGGER → PLAY → HOLD, the model Questions and the
  Method already run. The persist track ends by *asking* (`persisting.asks`); the headline, the address
  and the folio play on `TIMING.contact.composes` and hold. Back past `persisting.empty` the whole
  composition releases at once (0.5s) — it is never played backwards — and re-entering replays it.

### The passage, 13 → 14

The rows release in place → the lamp's light goes down to a floor of **0.30** (was 0.16, which read as
black) with the contrast softened → the rule, alone in the room, shortens to Contact's measure → the
plates cross in the soft floor under it → the hillside arrives **6% closer** than state 01 and the camera
eases back to the hero's exact framing while the light comes up (`persisting.returns`,
`contact.passage.returns`, `--env-return`) → the frame holds empty with one rule → Contact is asked for.

### Departures, and this is the record of them

1. **§8 scheduled the headline and the lines under it on the junction's sheet.** They are a clock now,
   by the design owner's instruction. This extends C8's list of clocks by one: Contact's arrival.
2. **§8's y152 headline is given up.** The question stands on the rule, where state 01's title stands.
3. **§8's rule measure (1048 → 732)** keeps its wide end; the narrow end is the question's measure.
4. **Narrow frames (≤ 820px) lower the rule to 610 / 760.** A portrait crop puts the figure across the
   middle with her feet at ~0.64 of the height; §8's y529 put the question across her legs at 390.
   C7's order: the desktop coordinate gives way.
5. **§4's `Tell us about it.` and the three terms stay undrawn** (unchanged from 22 September).

### What is open

- WhatsApp and Telegram are composed from `direct.phone`, which is still the reserved pattern
  `+351 910 000 000`; they are only as real as that number.
- iOS Safari not verified.

## C23 · Contact is the last cinematic moment, and a hand slows the world · **26 September 2026** · design owner brief

Supersedes C22 wherever they disagree. `docs/development/SESSION-HANDOFF.md` (26 September) is the
operating summary.

### What was decided

```
hello@chapterone.com                 ← upper left, on the question's axis: a small editorial note
+351 910 000 000
WHATSAPP · TELEGRAM · INSTAGRAM

                                     [ the footage, full-bleed, at its own speed ]
Is there something
that deserves its own experience?
Tell us where it begins.             ← the frame's only interaction; the text breathes
──────────                           ← its line, which does not
```

- **`YOUR CHAPTER` is removed** from the markup and from `content/site.ts`, and nothing replaces it.
- **The footage runs at its own speed at rest.** C22's found frame (`TIMING.contact.still` — seek, slow
  motion, stop) is retired, and with it C22's departure from §11.1's *"an environment paused"*.
- **A hand on *Tell us where it begins.* is the one thing that changes time** — `--listen`, 0 → 1 on
  `TIMING.contact.listens` (2.2s in, 1.6s out, from wherever it is). It opens the sentence and
  recomposes it into *We're listening.*, grows the line to the question's measure, slows the footage
  from 1 to 0.07, turns the light very slightly (brightness +5%, contrast −7%, saturation −12%) and
  gives the contacts presence. Input-caused, so it is a clock C8 already allows. A press holds it; Esc,
  a second press, or leaving Contact lets it go. `src/app/contact-listen.tsx`.
- **At rest only the sentence breathes** — tracking and ink, `TIMING.contact.breathes` (5.4s). The left
  axis is measured stable; the line reads `--listen` only.
- **Questions' closing rule no longer crosses into Contact.** `persisting.resizes`, `--jsize` and their
  two assertions are removed; the rule releases on the list's eighth span and is not drawn, because
  pinned at `--rule-y` it stood ~200px under the last row with nothing to bridge.

### The passage, 13 → 14, retimed

Hold 0.8s (was 0.4) → the list releases → dusk to a floor of **0.42** (was 0.30) → the plates cross in
it → the hillside comes up at its own speed → a 0.4s empty frame → `asks`. The camera push into the
room and across the hillside is halved (`leaves` 0.05, `returns` 0.04). `total` 5.3s.

### Departures

1. **§2's state-14 exposure, 0.72 → 0.9**, and `.closing`'s scrim 0.86 → 0.48. Compared in Chrome at
   1920 × 889 on both halves of the loop: at 0.72 under the scrim the landscape half was one
   grey-green mass. The question stands over the ground, the darkest part of the frame, and loses
   nothing.
2. **`--c-room` 57vw → 52vw.** At native speed the wind takes the dress to ~1078px at 1920; at 57 the
   question mark stood on the hem.
3. **§7's survivor is given up**, by instruction: Questions' last line is Questions'.

### What is open

- Instagram is written and inert: the project has no handle and none was invented
  (`direct.reach[2].handle`).
- WhatsApp and Telegram still derive from the reserved `+351 910 000 000`.
- iOS Safari, and hover on a real touch device, not verified.

### Second pass, the same day · design owner review

- **The line stays under the sentence** — confirmed by the design owner after seeing it.
- **Slow motion: 1 → 0.3, then pause.** 0.07 showed ~2 frames a second of the 30fps file and read as
  lag. The rate now falls 1 → 0.75 → 0.5 → 0.3 on the gesture's curve (`listens.slowest`, reached at
  `slowAt` 0.8), runs slow briefly, and the footage is **paused** on a whole frame; leaving plays it at
  0.3 and brings it back up. The rate moves in 0.05 steps. `opening.tsx`'s per-frame `roll()` was
  resuming any pause, so it now respects `data-still` on the footage.
- **Questions' release is a clock.** Spread over scroll it fitted in two wheel notches and read as one
  block. Past `persisting.releases.asks` it plays on `releases.clock`: the anchor first, the six rows in
  pairs, each row's hairline a beat after its words; back above, the list returns at once. `--jclear`
  (on the breath) guarantees nothing of the list meets the crossing.
- **No grey veil.** `contact.passage.floor` 0.42 → 0.8 and `softens` 0.5 → 1 — light down with contrast
  out was the grey. The plates cross over a longer window in near-full light.
- **The film's own transformation ends the passage.** At the instant the crossing opens (hero still at
  0) the footage is taken to 0.3s of the file (`contact.arrives`): its moving sky comes through the room,
  and its own dissolve brings the figure in while Contact is written.
- **Contact without a global filter:** state 14 exposure 1, `.closing` scrim 0. Legibility is the type's
  own halo on the note; the question stands on the ground.
- Contacts lowered by `clamp(1.75rem, 5.5vh, 3.75rem)`; hover growth 6% → 4%.

Open: the pause lands wherever the loop is at the end of the gesture, so it may hold on the landscape
rather than the figure.

### Third pass, the same day · design owner review

- **The contacts are back in the lower-left block**, under the sentence's line and on its axis — third
  in the hierarchy, smaller than ever (Cormorant ~14px, micro-caps ~10px at 1920), no rule between.
  Legibility is the type's own: a wide, faint, all but unoffset black `text-shadow` (14px at 0.42 plus a
  2px hairline layer). No scrim.
- **The hover draws the scene in** instead of lifting it: brightness 1 → 0.91, contrast 1 → 1.10, colour
  untouched.
- **The press is an ordinary `mailto:` link** (`hello@chapterone.com`, subject *Where it begins*). The
  button that held the listening and paused the footage for good is gone; that hold read as the page
  having locked. Verified: the page is never unloaded and the footage returns to rate 1 when the hand
  leaves.
- **Method → Questions leaves in layers** (`TIMING.method.leaves`, a clock, triggered `leads` 0.3 of a
  beat before the old clearing): the main composition in read order (0 – 1.1s), the seven thoughts at
  scattered moments (0.7 – 2.05s), the note last (to 2.1s), then the room empty — about 600px of scroll
  with no type — before Questions writes itself. `--mclear` remains only as the guarantee over the last
  fifth of `printing.clears`.
- **Questions → Contact has no light dip at all** (`passage.floor` 1). The grey was the room's flat veil
  (`.env-room`) lying over the arriving footage; it now leaves on the breath, before the plates cross,
  so the crossing is two clean photographs and the window's light is seen falling across the hills.

### Fourth pass, the same day · judged by eye, not by numbers

- **Method → Questions:** the leaving is spread over ~5.3s (`TIMING.method.leaves`) — the composition
  first (statement → line → question, 0.2s apart), then the seven thoughts one every 0.45s in scattered
  order, each drifting 4–7px sideways (`--mdx*`), the note last — triggered 0.8 of a beat before the old
  clearing. Questions' anchor now waits for the empty room to stand `emptyHolds` (1.1s) unless the
  Method's frame is already past its guarantee (a jump from the rail never waits).
- **Questions → Contact is played, not scrubbed.** The scroll only starts it (`persisting.startsBefore`,
  0.62 of a viewport before the closing frame locks, while the list still stands — `distance.asked`
  +50vh gives it the room); the sheet then runs in real seconds (7.4s) and rewinds over 1.6s. Order:
  the rows' words in pairs from the bottom up with the anchor's answer → each hairline 0.55s after its
  words → *What do you actually create?* alone, then gone → a moment of room with no type → the veil
  lifts → the footage crosses in → Contact writes itself once the frame has locked. The rail names
  Contact from the end of the crossing. State 14's page veil is 0 (it was laying Questions' scrim over
  the arriving footage).
- **Contacts:** 16px / 11.5px at 1920; hover growth 1 → 1.13.
- **Hold frame:** 4.4s of the hero file (`listens.holdAt`) — her profile against the sun. A second,
  never-played copy of the footage (`.env-hero-still`) is parked there and the live footage dissolves
  into it over `--listen` 0.55 → 0.9 as it slows (1 → 0.3 → pause); leaving reverses it.
- **Light:** brightness 1 → 0.83, contrast 1 → 1.13, saturation 1 → 1.06 on both footage layers.

---

## C24 · On a phone the Ledger is one line, and its index opens as a page · **28 September 2026** · design owner decision

**What this replaces, and where.** C2 and C7 left the Ledger's mobile placement "not yet designed at
any breakpoint". Until now the rail therefore lay down into the masthead's old composition, "preserved
rather than designed", as a row of type rather than a menu trigger. The archived `decisions.md` gave
the reason: "two lines of type need no learning and nothing to open."

Measured at 390 × 844, that row had become a band 211px tall, a quarter of the frame. It stood over
the film from state 08 to the end, over Contact's footage, and Questions' type was legible through it.

This entry is the designed placement that C7 said would supersede that adaptation. It applies below
768px only. At 768px and wider nothing changes, including the lying-down row between 768 and 900px.

**Closed.** The head band holds one line. On the left are the running folio and chapter, exactly as
they are now. On the right, on the same baseline, is the word "Index", set in the index's own
register, with a 1px rule beneath it as wide as the word. The rule is the affordance: V2 §6, "the
affordance is the rule, not a button."

The whole line is a single button, the full width of the frame and at least 44px tall, so the chapter
name opens the index as well as the word does. Pressed and focused, its ink rises as the rail's does
today, and the exchange to "Close" begins on the press itself. The band carries no ground of its own;
the rail's existing halo and adaptive ink carry it, as they do on the desktop.

**Open.** The Ledger stands up at the scale of a page. The five chapters appear in canonical order,
set in the running header's face, each row at least 56px tall, placed in the lower 60% of the frame.
The running chapter's line reads "NN ·", as it does on the desktop, and is not a link.

The ground is the current register's own scrim laid over the frame, dimming the film rather than
replacing it, as the Work register already does. "Index" becomes "Close" in the same place, through
the rail's own exchange, and the list is drawn by the rail's own wipe. No new motion verb is
introduced.

**Behaviour.** The control is present from state 08, as the rail is. It is absent before state 08 and
while the opening runs, so the opening stays mandatory.

The head line and the index together form one modal region, following the Work register's pattern:
role "dialog" with aria-modal "true". The button carries aria-expanded and aria-controls, and the
chapter links sit inside a nav element. While the region is open, everything outside it is inert, and
the page's scroll is held.

Focus order while open. Focus begins on the first chapter link. The order is the chapter links in
canonical order, skipping the running line, and then the Close button. Tab from the last element moves
to the first chapter link, and Shift+Tab from the first chapter link moves to the Close button. Focus
never leaves the region while it is open, and the index cannot be dismissed by moving focus.

The index closes three ways: by pressing Close, by pressing Escape, or by choosing a chapter, which
closes the index and navigates in the same press through the same anchor as before. In all three cases
focus returns to the head button, which then reads "Index" again.

Opening the index adds no history entry. Under reduced motion the index opens and closes at once. The
timings live in `TIMING.ledger.index`.

**Copy and accessible names.**

- Visible text: `ledger.index.open` is "Index"; `ledger.index.close` is "Close".
- Head button, closed: "Index — current chapter: {chapter}", for example "Index — current chapter:
  Questions".
- Head button, open: "Close index".
- Modal region: "Index".
- Chapter navigation: its current accessible name, "Studio".
- Running line: "{chapter}", with aria-current "location", as now.
- Chapter links: their chapter names, as now.

**Why this answers §10 rather than contradicting it.**

- Understood before it is used: the control is a word, never a symbol.
- Present when wanted, quiet when not: it is one line until someone asks for more.
- Nothing is inherited: there is no icon, no drawer and no borrowed motion; it is the Ledger itself,
  moving with the rail's own verbs.
- State is designed: closed, open, pressed, focused and absent are each specified above.

**Unchanged.** The presentation from 768px up. The order of the five chapters and their destinations.
The running "NN ·" mark. The mandatory opening. The rail's arrival at state 08.

**Validation.**

1. Layout at 320, 360, 390 and 430px: the closed line is no taller than 90px; the button spans the
   frame and is at least 44px tall; open rows are at least 56px tall; there is no horizontal scroll and
   no clipping, closed or open.
2. Legibility: "Index", "Close" and the chapter name meet a 4.5:1 contrast ratio on the ground behind
   them in every state from 08 to 14. Any state that fails is reported, not compensated silently.
3. Destinations: each of the five is reached from every state from 08 to 14, and the index is closed
   on arrival.
4. Input: the index opens and closes by touch, by Enter and Space on the button, and by Escape.
5. Focus containment: on opening, focus sits on the first chapter link. Repeated Tab and Shift+Tab, one
   full cycle beyond each end, keep focus on the Close button or a chapter link at every step. Content
   outside the region is inert and cannot be reached by Tab.
6. Focus return: after Close, after Escape and after choosing a chapter, focus is on the head button
   and its name reads "Index — current chapter: {chapter}".
7. Scroll hold: the page does not move while the index is open, and resumes from the same position
   after closing without navigating.
8. States: before state 08 and during the opening, the control is absent and cannot be reached.
9. Motion: under reduced motion the index opens and closes at once, with nothing mid-transition.
10. Navigation mechanisms: a jump to Contact made from mid-passage behaves as it does today, and the
    running mark's exchange still plays on arrival.
11. Desktop: at 768, 1440 and 1920, a layout snapshot of every element shows zero difference from
    before.
12. Build: typecheck, lint and build pass, and the console shows no errors on a clean load.
13. Not verifiable from this environment, and stated as such: iOS Safari, a physical device, and a
    real screen reader.
