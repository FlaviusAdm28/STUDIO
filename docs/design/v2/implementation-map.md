# Design V2 — Implementation Map

*The implementation index for the approved design. Read `README.md` in this directory first.*

---

## Source of truth

The design is **V2**. The following four files, all in `docs/design/v2/`, are the **only** authoritative
design references. The ranking is `README.md`'s and is identical to it:

| Rank | File | Role |
|---|---|---|
| 1 | `final-design-spec.pdf` | **Canonical written source, and the only written design authority.** Wins over everything, including every superseded copy of itself inside an archive. Carries §11, the locked Environment contract. |
| 2 | `storyboard.zip` | **Authoritative storyboard** — visual / motion / navigation reference. |
| 3 | `final-visual-master.zip` | **Consolidated visual companion**, derived from the corrected Final Spec: all fourteen states and thirteen junctions in one document. Not an alternative to the Final Spec and not a replacement for it. |
| 4 | `implementation-map.md` | Implementation index — this file. |

### Hierarchy, stated explicitly

When two of the four disagree, resolve **downward from 1**:

1. **`final-design-spec.pdf` is canonical.** Any question of what the design *is* is answered here,
   and nowhere else.
2. **`storyboard.zip`** governs what it looks like, how it moves, and — through its `Ledger.dc.html`
   canvas — structure, order and route, within what the spec allows.
3. **`final-visual-master.zip`** shows the approved design whole, at production coordinates, rebuilt
   from the corrected Final Spec. It is a companion for *seeing*: where it and the PDF appear to
   differ, the PDF is right. It is not a competing specification.
4. **`implementation-map.md`** is an index into the three above. It is last on purpose: it points,
   it does not overrule. If this file contradicts the spec, this file is wrong.

There are **two** archives in the package, not one. `storyboard.zip` (129 files) holds
`Storyboard - Sunset & the Ledger.dc.html` and `Ledger.dc.html` — both authoritative — plus `assets/`,
`frames/` and `uploads/`. `final-visual-master.zip` (131 files) is a superset of it: the same two
canvases byte for byte, plus `Final Visual Master - III Studio.dc.html`, the consolidated companion.

**Each archive also contains a `Final Spec - III Studio.dc.html`, the two copies differ, and neither is
a written source.** The copy in `storyboard.zip` is the specification as it stood when that package was
exported on 24 August 2026; the PDF was revised on 26 August and that canvas was not, so it still says
four plates, still gives state 13 the `dawn_warm` plate, and has no §11 at all. The copy in
`final-visual-master.zip` is the 26 August one and carries the same corrections the PDF carries — but a
canvas that agrees with the spec is still not the spec, and it can go stale again at the next revision.
**Neither may be implemented from. Read the spec from the PDF.** See `README.md`.

## Historical / non-authoritative material

Every superseded design document now lives in **`docs/design/archive/`** — including the three
previously listed here:

- `archive/design/decisions.md`
- `archive/design/chapter-three-review.md`
- `archive/design/copy-drafts.md`

and also `archive/brand/05-storyboard.md`, `archive/brand/design-system-inputs.md` and
`archive/brand/vision.md`.

**Archived documents must NOT override V2.** Where an archived document and V2 disagree, V2 is
correct and the archived document is out of date. Do not use any of them to override the final
design specification unless explicitly instructed. See `docs/design/archive/README.md`.

### Not archived, and not superseded

- `docs/brand/01-vision.md`, `02-positioning.md`, `03-design-principles.md`, `04-visual-language.md`,
  `open-decisions.md` — brand foundation and open questions. These **govern** V2 rather than being
  replaced by it.
- `docs/development/01-validation.md`, `02-motion-system.md` — active technical documentation.

## Rule

The design is approved.

Implementation must preserve the approved visual direction.
Do not redesign, reinterpret or invent alternatives without explicit instruction.

---

## Chronological order

01 Hero
02 Chapter II
03 Philosophy
04 Thesis
05 Occasions
06 Some moments deserve another chapter
07 Chapter III
08 Ledger
09 The work
10 About
11 Method
12 Your Experience
13 Questions
14 Contact

## 13 transitions

01 → 02 Hero → Chapter II
02 → 03 Chapter II → Philosophy
03 → 04 Philosophy → Thesis
04 → 05 Thesis → Occasions
05 → 06 Occasions → Some moments
06 → 07 Some moments → Chapter III
07 → 08 Chapter III → Ledger
08 → 09 Ledger → The work
09 → 10 The work → About
10 → 11 About → Method
11 → 12 Method → Your Experience
12 → 13 Your Experience → Questions
13 → 14 Questions → Contact

## State 09, and what is not in this list

`final-design-spec.pdf` §11.1 — the **locked Environment contract** — draws a boundary that this index
has to carry, because an index abbreviates and this is the one place abbreviating goes wrong.

**State 09 is the film.** It is the continuous environment element at the `venice` plate, brought to
true exposure by the 08 → 09 `lift`: *"It is a state of the environment, and nothing is mounted,
swapped or fetched to reach it."* §2 names the row *The work — Wedding Experience*, and §11.1 says
that row *"is to be read with"* §11.1. This list previously read `09 Wedding Experience`, which
abbreviated to the wrong half.

**The live work surface is not one of the fourteen states.** It exists only inside the reversible Work
aside (§6), entered from the Ledger's leader rule — *"not a step in the fourteen-state sequence"*. It
composites *above* the environment, which keeps running beneath at its own grade and is never
unmounted, including while the aside is open. So the aside appears nowhere in the fourteen and nowhere
in the thirteen; it is §3's own fourteenth row, and it is caused by the visitor rather than by the film.

**One environment element for the whole session** — mounted at the Hero, never unmounted, never
re-sourced, never `display:none`. §11.1: *"no second surface, no iframe, no additional media element…
A work surface that replaces the environment — or an environment paused, hidden or re-sourced to make
room for it — breaks the law and the 08 → 09 lift together."*
