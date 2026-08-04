This document is intentionally disposable.

Nothing here is considered a rule.

Everything here must be validated by real work.

Any decision that repeatedly proves itself may later become part of the design system.

Everything else is allowed to disappear.


# Design system inputs

*Working file. Not part of the locked set of five, and not a foundation document.*
*Date opened: 4 August 2026*

---

These are the specific decisions that were removed from `04-visual-language.md` when it was reduced to philosophy. They are kept because most of them are good, not because they are settled.

Each is written against the line in `04` it has to be defensible from. When the design system is built, that line is the argument — and if a decision here cannot be traced back to one, it is a preference and should be dropped rather than inherited.

Nothing in this file governs anything. It is an input.

## Typography

Defensible from **§4** — *type does two jobs, to speak and to disappear.*

- Two families. One with a voice, for statements. One quiet, for anything read at length. A third only ever a monospace, and only if it earns a role.
- A short scale used widely. Fewer sizes, larger jumps between them. Three sizes on one screen is a lot.
- Set for reading: measure capped, leading rises as size falls, body copy never letter-spaced.
- Statements set large enough that a line break is a design decision. Line breaks in display type authored, not left to the browser.
- Type never animated letter by letter.

Selection criteria for the two families, in order: it holds at 100px and at 15px · it has a real italic · it covers the languages we commit to · it is licensable for client projects without renegotiation.

## Colour

Defensible from **§3** — *the interface leaves the material as the most saturated thing present.*

- Near-neutral, single temperature. A small set of related tones, not a spectrum.
- One accent, meaning state only. Open question whether an accent exists at all, or focus is expressed through weight and space.
- No gradients as decoration. A gradient is acceptable only as light behaving like light.

## Motion

Defensible from **§7** — *motion makes change comprehensible.*

- One signature curve for narrative movement, one utility curve for response. No third.
- Response under a fifth of a second.
- Opacity and transform only. If an effect needs to animate layout, it is the wrong effect.
- At most one ambient looping element per page, and only in the project layer.
- Curves and durations are tuned against real content, never chosen in the abstract.

## Composition

Defensible from **§5** — *margins are silence · a frame is chosen, not inherited · scale is currency.*

- Margins grow with the viewport rather than staying fixed.
- Wide, letterboxed frames for narrative images. Tall frames for people. Ratios chosen per beat and held.
- An image is never cropped by CSS to fit a container. Where a beat needs a different shape on mobile, that is a separately composed frame.
- Roughly one edge-to-edge moment per page.

## Imagery

Defensible from **§6** — *the subject is real · what is left out of a frame is part of the frame.*

- Available light. No stock, no mockups, no device frames, no laptop-in-hands.
- Moving image is silent, short, and does not announce its loop.
- Faces used sparingly. A back, a hand, an empty chair carries more.

## Chrome

Defensible from **§10** — *understood before it is used · nothing is inherited · state is designed.*

- No icon set. Words, or nothing.
- No pill buttons, no card shadows, no hover lift. Corners square unless there is a reason.
- Navigation minimal, and does not follow the visitor down the page unless it earns it.
- Few fields, plain questions, real sentences.

## Specific bans

Defensible from **§11**, category 1 unless noted.

Parallax used to demonstrate parallax · custom cursors · anything that reveals letter by letter · bouncing "scroll" arrows · animated gradients as backgrounds (category 4) · loading screens that exist to be looked at (category 2) · scroll-triggered counters, testimonial carousels, logo walls (category 3).

Revisable. When a technique stops appearing, the line for it goes.

## Sound

Defensible from **§8** — *it never starts on its own.*

- One control, always reachable. The choice is remembered.
