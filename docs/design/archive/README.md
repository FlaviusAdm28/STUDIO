# Design archive — superseded material

*Nothing in this directory is authoritative. Nothing in it may override V2.*

The approved design is **V2**, in `docs/design/v2/`. Read `docs/design/v2/README.md` first.

These documents are kept because they record how the work got here — the explorations, the
drafts, the experiments and the decisions that turned out wrong. They are history, not
instruction. Where an archived document and V2 disagree, **V2 is correct and the archived
document is simply out of date.** That is not a conflict to be resolved; it is what an archive is.

## What is here, and what it was

### `design/`

| File | What it was |
|---|---|
| `decisions.md` | The running decision log, §01–§56, opened 4 August 2026. The reasoning behind the pre-V2 build, entry by entry. Cited throughout `CLAUDE.md` and `content/site.ts` by section number. |
| `chapter-three-review.md` | A review of Chapter III's architecture, 13 August 2026. Its own header: *"Review only. Nothing here has been implemented, and nothing here is a decision."* |
| `copy-drafts.md` | Copy written for beats that were removed when the page became one continuous shot. Kept so the writing is not lost. Referenced by nothing. |

### `brand/`

| File | What it was |
|---|---|
| `05-storyboard.md` | The pre-V2 storyboard — the seven-state emotional blueprint and the homepage interpretation built from it. **Superseded by the V2 storyboard.** Archived so that only one document is called the storyboard. |
| `design-system-inputs.md` | Specific decisions removed from `04-visual-language.md` when it was reduced to philosophy. Its own first line: *"intentionally disposable… nothing here is considered a rule."* |
| `vision.md` | An early draft — a slogan fragment and a list of footage search terms. Superseded by `01-vision.md`, which stays in `docs/brand/`. |

## What is still live, and is not here

Archiving is scoped to obsolete *design iterations*. These were deliberately left in place:

- `docs/brand/01-vision.md`, `02-positioning.md`, `03-design-principles.md`, `04-visual-language.md`
  — brand foundation and design philosophy. They govern V2; V2 does not replace them.
- `docs/brand/open-decisions.md` — questions still open. Active.
- `docs/development/01-validation.md`, `02-motion-system.md` — technical documentation describing
  the code as it stands. Active.

## Citations into this directory

`CLAUDE.md` and `content/site.ts` cite `decisions.md` and `05-storyboard.md` by section number in
their comments. Those citations still resolve — the sections are unchanged, only the path moved.
They record why the existing code is the way it is. **They are not an argument against V2.**
