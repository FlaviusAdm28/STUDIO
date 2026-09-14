# Design V2 — the approved design

*This directory is the single source of truth for the design of this project.*
*Approved 24 August 2026.*

---

## The rule

**V2 is the approved design.** Everything in this directory is authoritative. Nothing outside it is.

**Archived design documents must NOT override V2.** Where an archived document and V2 disagree, V2 is
correct and the archived document is out of date. Do not resolve the disagreement — apply V2.

Implementation must preserve the approved visual direction. Do not redesign, reinterpret or invent
alternatives without explicit instruction.

## The package

| File | Standing | What it is |
|---|---|---|
| `final-design-spec.pdf` | **Canonical.** | The final design specification, and the canonical *written* source. Where any two references disagree, this one wins — including against every copy of it inside an archive. It carries **§11, the locked Environment contract**. |
| `storyboard.zip` | Authoritative | The **storyboard: visual, motion and navigation reference**. What the work looks like, how it moves, and the route through it. |
| `final-visual-master.zip` | Authoritative, as a companion | The **consolidated visual companion**, derived from the corrected Final Spec: all fourteen states and thirteen junctions rendered in one document. A way of *seeing* the approved design whole. **Not** a specification, and never read as one. |
| `implementation-map.md` | Authoritative, as an index | The **implementation index** — chronological order of sections and the transitions between them. |

### Hierarchy

When two authoritative references disagree, resolve in this order:

**Rank 1 — `final-design-spec.pdf`.** The canonical written source. It is **the only written design
authority**, and it overrides older copies of itself inside archives — both of them (see below).
Any question of what the design *is* is answered here.

**Rank 2 — `storyboard.zip`.** The authoritative storyboard, and the visual and motion reference:
what the work looks like, how it moves, and — through `Ledger.dc.html` — structure, order and route,
within what the spec allows.

**Rank 3 — `final-visual-master.zip`.** The consolidated visual companion, derived from the corrected
Final Spec. It shows the whole film in one document at production coordinates. It is **not an
alternative to, and not a replacement for, the Final Spec**: where it and the PDF appear to differ,
the PDF is right and the companion is being read past its role. Use it to see; use the PDF to know.

**Rank 4 — `implementation-map.md`.** An index, not an argument. It is last on purpose: it points at
the three above and **never overrules any of them**. If it contradicts the spec, it is wrong.

### A note on the archives

There are **two** archives in this package, and neither is a written source:

| Archive | Files | Standing |
|---|---|---|
| `storyboard.zip` | 129 | Rank 2. The approved storyboard package as exported on 24 August 2026. |
| `final-visual-master.zip` | 131 | Rank 3. A superset of the above — the same storyboard and Ledger canvases, byte for byte — plus the consolidated `Final Visual Master - III Studio.dc.html`. |

Between them they carry four canvases:

| Canvas | In | Standing |
|---|---|---|
| `Storyboard - Sunset & the Ledger.dc.html` | both | Authoritative. The visual and motion reference. |
| `Ledger.dc.html` | both | Authoritative. The navigation reference. |
| `Final Visual Master - III Studio.dc.html` | `final-visual-master.zip` | Authoritative as a **visual companion**. Rebuilt from the corrected Final Spec. Never the spec itself. |
| `Final Spec - III Studio.dc.html` | both, and the two copies differ | **SUPERSEDED AS A WRITTEN SOURCE, in both archives. Do not implement the specification from either.** |

…together with `assets/`, `frames/` and `uploads/`. Open an archive; read the canvas that matches the
role you need — but **read the spec from the PDF, never from an archive.**

#### Why the `Final Spec` canvas is superseded in both archives

There are two files named `Final Spec - III Studio.dc.html` in this directory, one in each archive, and
**they are not the same file.** Neither is the written authority:

| | in `storyboard.zip` | in `final-visual-master.zip` |
|---|---|---|
| Exported | 24 August 2026 | 26 August 2026 |
| Says | four plates, state 13 on `dawn_warm`, no §11 | three plates, state 13 `hero · sky band, graded`, §11 present |
| Standing | **Superseded** — out of date on every point below | **Superseded as a written source** — it agrees with the PDF on the points below, but it is a canvas copy inside a visual archive, not the specification |

The copy in `storyboard.zip` is the specification as it stood when that package was exported on
24 August 2026. The PDF was revised on 26 August 2026 and the canvas was not, so the two now disagree.
**The PDF governs; that canvas is out of date on every point below.**

The copy in `final-visual-master.zip` is closer — it carries the same corrections the PDF carries — and
that is exactly why it needs saying plainly: **agreeing with the spec does not make a canvas the spec.**
The current PDF is the only written design authority. A corrected copy in an archive is still a copy,
it can go stale again the next time the PDF is revised, and nothing may be implemented from it. It is
not a competing specification and must not be read as one.

| Point | The superseded canvas says | `final-design-spec.pdf` says |
|---|---|---|
| Plates | *"Four plates carry all fourteen states"* — `hero.png`, `venice.png`, `studio_about.png`, `dawn_warm.png` | §5: **three** — `hero`, `venice`, `studio`. Warm stone at 13 is a grade of the hero plate. |
| State 13's plate | `dawn_warm` | §2: `hero · sky band, graded` |
| Open items | *"Of the four plates…"* | §10: *"Of the three plates…"* |
| §11 | absent | **§11 · Environment contract — locked** |

`storyboard.zip` was deliberately **not** rewritten. It is the package as approved, its 129 files are
intact, and the superseded canvas is kept because it records what the specification said before §11
closed it — the same reason `docs/design/archive/` exists at all. The spec's own wording corrections
are scoped to itself: §11.1 says *"None to the storyboard"* and §11.2 *"This spec only, now applied…
The storyboard needs no correction — its state-13 frames are storyboard stills and are labelled as
such."* Both of those are about the **storyboard** canvas, which is correct as drawn and is not
touched by any of this.

## What is not here

**`docs/design/archive/`** holds every superseded design iteration — the pre-V2 decision log, the
Chapter III review, removed copy, the pre-V2 storyboard, and the disposable design-system inputs.
It is history. See `docs/design/archive/README.md`.

**`docs/brand/`** holds the brand foundation — vision, positioning, experience principles and visual
language — plus the still-open questions. These are not superseded by V2; they govern it. A V2
decision should still be defensible from a line in one of them.

**`docs/development/`** holds validation and the motion system. These describe how work is finished
and how the code is organised. They are technical documentation, not design, and V2 does not replace
them.

## Reading order for an implementer

1. This file.
2. `final-design-spec.pdf` — the whole of it. It is the only written design authority.
3. `implementation-map.md` — for order and transitions.
4. `storyboard.zip` — for the frames and the route. **Not** for the specification: the `Final Spec`
   canvas inside it is superseded, and the PDF is the spec.
5. `final-visual-master.zip` — for the whole film seen at once, states 01–14 and the thirteen
   junctions in one document. A companion to the PDF, read **after** it and never instead of it. Its
   own `Final Spec` canvas is superseded as a written source, like the one in `storyboard.zip`.
6. `docs/development/01-validation.md` — before reporting anything complete.
