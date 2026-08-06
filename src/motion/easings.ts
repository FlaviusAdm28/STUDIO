/**
 * The curves.
 *
 * There is one CSS curve, and there is meant to be one. `globals.css` opens by saying so and
 * `04-visual-language.md` §7 is the reason: motion exists to make change comprehensible, so a
 * curve with character of its own is a curve competing with the thing it is supposed to
 * describe. A second curve would be a second voice.
 *
 * That is a design decision, not an oversight, so this file deliberately does not offer a
 * ladder of alternatives. `SMOOTH`, `SOFT` and a distinct `CINEMATIC` do not exist because
 * nothing is allowed to use them — see `docs/development/02-motion-system.md`, "Why there is
 * only one curve". Adding one is a brief, not a refactor.
 *
 * What does exist is two easings for two mechanisms:
 *
 *   DEFAULT     the CSS curve, for anything timed in seconds
 *   smoothstep  the JS curve, for anything timed in scroll position
 *
 * They are different functions because they solve different problems. A CSS transition eases
 * between two states over a duration. A scroll-driven value has no duration — it is evaluated
 * fresh at whatever position the page is at — so its easing has to be a plain function of
 * progress that can be called at any point, in any order, including backwards.
 */

/**
 * The one curve. Slow to start, long to settle, no character of its own.
 *
 * Held as a string rather than four numbers because every consumer is CSS. It reaches the
 * stylesheet as `--curve` — see `transitions.ts`.
 */
export const easings = {
  DEFAULT: 'cubic-bezier(0.32, 0, 0.24, 1)',
} as const

export type Easing = (typeof easings)[keyof typeof easings]

/** Progress, bounded. Anything outside the range is at one end of it. */
export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)

/**
 * The scroll curve. Smoothstep — zero slope at both ends, symmetrical between them.
 *
 * `01-validation.md`, Motion validation: a straight ramp reads as an effect being performed, an
 * eased one reads as light behaving like light. That difference is the whole distance between
 * this and switching sections, and it costs one multiplication.
 */
export const smoothstep = (x: number): number => x * x * (3 - 2 * x)
