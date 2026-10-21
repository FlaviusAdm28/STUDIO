# Open decisions

*Working file. Not part of the locked set of five. Delete a line when it is answered and record the answer in the document it belongs to.*

---

## Blocking copy

1. **The studio name.** Everything downstream waits on it — wordmark, domain, the first word on the site.
2. **Voice: *we* or *I*.** The documents use *we*. A single-founder studio saying *I* is more credible and harder to scale later.
3. **Languages.** English only, or English and Portuguese. Changes type selection and every line length in the system.
4. **Geography.** Where we are from is either part of the work or it is noise. Decide before any copy names a city.

## Blocking positioning

5. **Weddings first, or all domains as equals.** `02-positioning.md` currently presents them as equals. Leading with weddings is a different studio and a different homepage — it changes the order of the storyboard.
6. **Price posture.** Published range, a "from" figure, or nothing.

## Blocking design

7. **The two typefaces — answered, with one approved exception.** `final-design-spec.pdf` §5 answers it: Cormorant Garamond 300 for every statement, Schibsted Grotesk for every label and micro-caps — two families, no others. **The exception is C43** (design owner, 21 October 2026): the hero's tagline, *Your moments, made timeless.*, is set in Tenor Sans 400, in capitals, and nothing else is. Set in Cormorant the line read as the same voice as the name; set in Schibsted capitals it read as interface. Tenor's slight stroke contrast and classical capitals answer the serif instead of labelling it, and keep the old cover's wide tracking. The record is `docs/design/v2/implementation-reconciliation.md` C43; in the build it is one token, `--v2-tagline`, read by the tagline alone. Kept here rather than deleted so the exception is visible beside the rule. Not an open question.
8. **The palette,** and whether an accent colour exists at all.
9. **Wordmark, or the name simply set in the display face.**
10. **Is dark the studio's resting state, or light?** This decides the homepage.

## Blocking the first build

11. **The first project.** One piece has to exist that can be shown end to end. If no client project qualifies, we make one and say openly that we did.
