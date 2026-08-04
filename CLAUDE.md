# Chapter One — working notes

Digital experiences built for moments that only happen once.

This is a narrative homepage, not a page of sections. Read the two documents below before
implementing anything; they are not optional context.

## Read first, every time

| Document | Standing |
|---|---|
| `docs/development/01-validation.md` | **Mandatory.** How work is finished. Consult before starting, satisfy before reporting complete. |
| `docs/brand/01-vision.md` … `05-storyboard.md` | **Locked.** Never modify. Every design decision must be defensible from a line in one of them. |
| `docs/design/decisions.md` | Running log. Add an entry for any decision worth tracing, including the ones that turned out wrong. |
| `docs/brand/open-decisions.md` | Unanswered questions. The typeface is still one of them. |
| `docs/brand/design-system-inputs.md` | Disposable. Nothing in it is a rule. |
| `docs/design/copy-drafts.md` | Removed copy, kept only so it is not lost. Referenced by nothing. |

## Non-negotiables

- **Validation is part of the task.** Typecheck, lint, build where applicable, runtime, regression.
  Four viewports: 1920×1080, 1440×900, ~768, ~390 portrait. Never assume desktop scales.
- **The hero is locked.** `src/app/opening.tsx` and its styles are approved. Changes to it are
  regressions unless a brief says otherwise.
- **Replay the homepage from the first frame** before calling anything complete. Never improve one
  chapter by weakening another.
- **State what was not verified**, and why. iOS Safari cannot be tested from this environment.
- **A technically correct change that weakens the narrative is incomplete.** Report it as incomplete.

## Where things live

- `content/site.ts` — all language. Never hardcode words in a component.
- `src/app/opening.tsx` — the hero. Its own clock, in beats, accelerated on visitor intent.
- `src/app/scroll-stage.tsx` — the Chapter I → II shot. Scroll position is the only input.
- `src/app/globals.css` — one curve, opacity only, `--pin` sets the shot's physical length.
- `public/media/hero/video/` — footage. H.264 in a QuickTime container; Chrome plays it only when
  handed the bytes without a `type` hint.

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
