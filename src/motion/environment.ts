/**
 * **The Environment, resolved.** What the one persistent photographic element is doing at a given
 * narrative position.
 *
 * `final-design-spec.pdf` §11.1, the locked Environment contract: *"One element, mounted at the Hero,
 * **never unmounted, never re-sourced, never `display:none`**. Sections change its grade, its transform
 * and its playbackRate — nothing else."* This file decides those changes, and it decides them as a
 * **projection of `spine.ts`** rather than as a system of its own.
 *
 * ## It holds no state, no timing and no numbers
 *
 * Everything below is read out of `states` in `spine.ts` — §2's own `plate`, `exposure` and `ground`
 * columns, transcribed during C1 and consumed here for the first time. The one input that is not in the
 * spine is **where each state sits**, and that is handed in by the driver, which already computes it
 * every frame for the Ledger. So there is no second state machine, no second clock, and nothing here
 * that could disagree with the sequence.
 *
 * `implementation-reconciliation.md` C5 is the register this belongs to.
 *
 * ## Three decisions inside the locked design, and each is stated where it is taken
 *
 *   **A `none` plate is the plate before it, held.** §2 gives states 04 and 05 a ground instead of a
 *   plate and §11.2 left it unsaid whether that is a plate at zero exposure or no plate at all. C5's
 *   preflight answered it from the junction: 04 → 05 is a **HOLD — no plate swap** — so `held` walks
 *   back to the last stated plate rather than clearing the frame. Derived from the junction, not
 *   authored here.
 *
 *   **A junction with no authored distance interpolates across the whole gap.** V2 quotes seconds for
 *   some junctions and C8 ruled those are weights rather than durations; none of them has been priced
 *   into a distance yet. So the only non-inventing reading of "state 05 is the hero and state 06 is
 *   venice" is that the change occupies the space between them. When C4 prices these junctions the
 *   interpolation narrows to whatever it prices; nothing here has to move.
 *
 *   **09 → 10 is the first junction narrowed that way** (16 September 2026): §3's *superimpose* is a
 *   passage around one shared light, and across the whole junction it stood as a half-and-half ghost for
 *   thousands of pixels. `crossWindows` below reads the window from `TIMING.about.superimpose`; every
 *   other junction still crosses across its whole gap.
 *
 *   **Exposure starts at state 06.** §2's column opens `.50 · .35 · .10` across states 01–03, and the
 *   film **already performs exactly that light** with `--dusk`, its own black over the footage, measured
 *   running 0.05 → 0.70 → 1.00 across those three states. Grading the plate as well would darken the
 *   hero twice and the hero is locked. So the environment does not grade where the film's own scrim is
 *   the light, and takes §2's column from state 06, where nothing else lights the plate. This is an
 *   engineering decision inside the locked design, not a reading of what the design is.
 */

import { clamp01, smoothstep } from './easings'
import { PLATE, states, type Plate } from './spine'
import { TIMING } from './timing'

/**
 * **Junctions whose plates cross inside a window rather than across their whole gap**, keyed by the
 * state the junction leaves. A fraction of that junction's own `0 → 1`; the numbers are `timing.ts`'s.
 */
const crossWindows: Readonly<Record<number, readonly [number, number]>> = {
  9: TIMING.about.superimpose as unknown as readonly [number, number],
  /*
    **10 → 11 · the room, some time later**, and it is an ordinary dissolve again.

    It has been three things: the whole junction, then a narrow dip deep enough to hide the difference
    between the plates, then a soft edge travelling across the frame. The travelling edge did hide the
    exchange — and it read as *a layer moving*, which is the one thing a photograph must never do. The
    design owner ruled it out on 18 September 2026: *"não quero que o utilizador perceba 'uma camada
    está a descer/subir'… quero que pareça luz e tempo, não uma técnica de composição."*

    What makes a plain dissolve work now, where it could not before, is that the two things it used to
    betray have both changed. The window on the right wall was the fault when it was the only rising
    luminance in a darkening frame; the room it arrives into is lit now, and its arrival is the point —
    *another quality of light is in the space*. And the person's ghost was a fault when it read as two
    photographs; against a room that is visibly the same room, it reads as the thing it is, which is
    somebody leaving.

    So the plates cross uniformly, in place, over most of the junction, inside a gentle fall and recovery
    of the light. Nothing travels. `TIMING.about.passage` argues the numbers.
  */
  10: TIMING.about.passage.cross as unknown as readonly [number, number],

  /*
    **13 → 14 is not here any more, and that is the point** — 22 September 2026.

    It was `TIMING.grounds.cross`, a window on **junction 13 → 14's own `0 → 1` on `p`**, while the
    room's ink came off on `persisting.crosses`, a window on the **persist track**. Two
    parameterisations of one movement, and the comments on both already said they should be one.

    They are one now, and it is the persist track — §8's own sheet, which is the only thing that
    describes this junction beat by beat. The driver hands that progress in (`leaving` below), so the
    plates, the scrim, the ink over the outgoing plate and the light itself all read one number. The
    exchange is still a dissolve with the incoming plate whole underneath; what is new is that it
    happens inside `contact.passage`'s floor rather than in the light.
  */
}

/**
 * ── Junction 10 → 11 · the light, in four movements ───────────────────────────────────────────────
 *
 * **The one junction on the site whose exposure is not a mix between two states**, and the reason is in
 * `TIMING.about.passage`: the two studio plates are different enough that they can only be exchanged in
 * the dark, so the light has to go down *before* the exchange and come back up *after* it. A monotonic
 * mix from 1.02 to 0.12 never produces that frame — it is at half light exactly where the plates are at
 * half each.
 *
 * It holds, falls to the floor, stands there while the plates change places, and lifts to state 11's own
 * exposure. Both ends are the states' own values, so nothing either side of the junction moves: at 0 it
 * is `exposureOf(10)` exactly and at 1 it is `exposureOf(11)` exactly, and junctions 09 and 11 join it
 * without a step.
 *
 * **It is not a fade to black and it never reaches zero.** The floor is a real exposure with the
 * photograph's own lamp still in it; what it is, is the darkest the room gets before the morning.
 */
const PASSAGE = 10


/**
 * One value through the four movements: it holds at `lit`, falls to `bottom` over `down`, stands there,
 * and lifts to `rest` from `lifts`.
 *
 * The exposure and the contrast are the same *shape* but not the same *windows* — the softening trails
 * the light, and `TIMING.about.passage.soft` argues why at length. They share the lift, because by then
 * there is nothing left to bloom.
 */
const throughThePassage = (
  raw: number,
  down: readonly [number, number],
  lit: number,
  bottom: number,
  rest: number,
): number => {
  const { lifts } = TIMING.about.passage
  if (raw <= down[0]) return lit
  if (raw < down[1]) {
    return lit + (bottom - lit) * smoothstep(clamp01((raw - down[0]) / (down[1] - down[0])))
  }
  if (raw <= lifts) return bottom
  return bottom + (rest - bottom) * smoothstep(clamp01((raw - lifts) / (1 - lifts)))
}

/** Where a state sits on the one continuous position. The driver measures these; nothing here does. */
export type Placement = { readonly id: number; readonly at: number }

/**
 * **The plate a state shows, with `none` resolved by holding.**
 *
 * §2 gives states 04 and 05 no plate. Junction 04 → 05 is a **HOLD** and carries no plate swap, so what
 * stands behind those two frames is whatever stood behind state 03 — the hero — under the warm-dark
 * ground the film paints over it. Walking backwards is what makes that a consequence of the junction
 * rather than a second table.
 */
const held = (id: number): Plate => {
  for (let i = id; i >= 1; i -= 1) {
    const plate = states[i - 1].plate
    if (plate !== PLATE.NONE) return plate
  }
  return PLATE.HERO
}

/**
 * **Where §2's exposure column starts, and why it is not state 01.**
 *
 * The film's own `--dusk` is the light across states 01–05: measured, it runs 0.05 at state 01 to 1.00
 * from state 03, which is §2's `.50 · .35 · .10` performed as a scrim instead of as a grade. The
 * environment therefore leaves those states alone — a plate graded to .50 *underneath* a scrim already
 * at .70 is the hero at a quarter of its light, and `CLAUDE.md` locks the hero.
 */
const EXPOSURE_FROM = 6

/** §2's exposure for a state, with `null` carried forward from the last state that states one. */
const exposureOf = (id: number): number => {
  if (id < EXPOSURE_FROM) return 1
  for (let i = id; i >= EXPOSURE_FROM; i -= 1) {
    const value = states[i - 1].exposure
    if (value !== null) return value
  }
  return 1
}

/**
 * **§2's ground for a state, and only where that column is actually a ground.**
 *
 * The column holds two different kinds of thing. At states 04 and 05 it is a colour — `#060605` and
 * `#050504` — the two frames §2 hands a ground *instead of* a plate. At state 13 it is a sentence:
 * *"hero · sky band, graded — ground 160–171, R−B +26, desaturated, near-still"*, which §11.2 is
 * explicit is **a grade of the hero plate and never its own asset**. A grade is not a layer, and
 * painting that string as a ground would put a `background` in front of the very plate it describes.
 *
 * So this reads a colour or nothing. State 13's treatment belongs to the hero plate's own grade and is
 * not implemented in this pass — see the file header and `implementation-reconciliation.md` C5.
 */
const groundOf = (id: number): string | null => {
  const ground = states[id - 1].ground
  return ground !== null && ground.startsWith('#') ? ground : null
}

/**
 * **State 08's pan.** §2's row for 08 reads *plate panned 20%*, and §3's 08 → 09 says which way — *"the
 * frame pans off the canal"*. C5's preflight P1 derived the physical direction from the plate that ships,
 * `public/media/projects/venice/venice.png` — the sun low over the canal at plate x 0.102, and open water
 * and sky filling 48–70% of every column across x 0.00–0.56, against the quay and the palazzo wall at
 * x 0.62–0.75 measuring five times darker — so the frame travels **right** and the plate translates
 * **left**; `globals.css` owns that sign and the 20%, because it is a distance in a
 * frame. This is only *how far along* the pan is.
 *
 * **It runs across 06 → 08 — design owner, 14 September 2026 — and the 20% is untouched.**
 *
 * It ran 07 → 08, which is one junction, and that is what made the entry into the Work feel like a
 * wait. Measured on the running page at 2560 × 1305: `A memory.` leaves at y 10600 and this pan did not
 * begin until **y 12937**. For 2,300px — nearly two viewports — the only things moving were the
 * exposure and a 1.6% scale, neither of which the eye reads as movement. The visitor was looking at a
 * photograph that appeared to be standing still, and the composition only began to open halfway to the
 * rail.
 *
 * Starting it at state 06 puts the whole of the opening on the gesture the rail is written in: the
 * photograph begins moving as the breath after `A memory.` ends, and it is still arriving as the
 * navigation is drawn in the field it has opened. **The distance, the direction and the endpoint are
 * exactly as they were** — §2's column says state 08 stands on a plate panned 20%, and it still does.
 * Only the runway changed, which is why this is an implementation latitude and not a design change:
 * §2 states where the pan has got to at 08, and never where it starts.
 *
 * `smoothstep` over the doubled runway also puts the pan's highest velocity at the junction boundary
 * and decelerating through the rail's arrival — so the composition opens decisively and is settling
 * while the navigation is written on it, rather than starting and stopping twice.
 *
 * **Nothing may translate the plate further left than this.** `.env-plate` is `100% + --env-pan-throw`
 * wide and this consumes the whole overhang at `1`; any additional leftward term would pull the plate's
 * right edge into the frame. That is why the camera carries no lateral term at all.
 */
const PAN_FROM = 6
const PAN_TO = 8

/**
 * **Warm stone at state 13, as an envelope on the hero plate — never as a plate of its own.**
 *
 * §11.2, locked: *"Warm stone is authored as the hero plate under the state-13 grade — enlarged onto its
 * sky band, exposure lifted to ground values 160–171 with R−B +26, desaturated, near-still — and never as
 * its own asset. `dawn_warm.png` must not be referenced in production code. If warm stone loads as a
 * separate image, states 13 and 14 become a swap and the locked 13 → 14 mechanism is void."*
 *
 * So this is not a plate and not a ground: it is **how much of the state-13 grade the hero layer is
 * wearing**, and `globals.css` owns what that grade is. It rises across 12 → 13 and falls across
 * 13 → 14, which is §11.2's own sentence about why the locked junction works — *"the locked 13 → 14 can
 * open the crop on the same negative and arrive at Contact with no swap"*. One negative throughout.
 *
 * **`near-still` is reached here and not by `playbackRate`.** P2, closed: the value is 1 for every state,
 * and a slow-motion value at 13 would be an invented design decision wearing an implementation's clothes.
 * What holds the sky band still is the enlargement — 6.4× of a frame moves 6.4× less across it.
 */
const STONE_FROM = 12
const STONE_PEAK = 13
const STONE_TO = 14

const stoneAt = (p: number, placed: ReadonlyArray<Placement>): number => {
  /*
    **No layer wears the grade any more, so it is not worn** — design owner, 19 September 2026. State 13
    stands on the method's own plate (`spine.ts`), which is the room the two states before it stand on;
    warm stone was a grade *of the hero plate*, and the hero plate is not present at 13 to be graded.

    This is read off the state rather than deleted, so the mechanism comes back with the state if the
    design owner ever puts warm stone back: §11.2's whole argument — one negative, a grade and never an
    asset — is intact above and is still what this file would do.

    It also has to be zero rather than merely invisible. `--env-stone` is what tells the rail its ink has
    crossed to the page's near-black (`--rail-stone`, `--rail-on`), and Questions is read in the film's
    own light ink on a photograph: a rail turning dark over a dark room is the one thing this would
    break that nobody would think to look for.
  */
  if (states[STONE_PEAK - 1].plate !== PLATE.HERO) return 0

  const at = (id: number): number | undefined => placed[id - 1]?.at
  const from = at(STONE_FROM)
  const peak = at(STONE_PEAK)
  const to = at(STONE_TO)
  if (from === undefined || peak === undefined) return 0
  if (!Number.isFinite(from) || !Number.isFinite(peak) || peak <= from) return 0
  if (p <= peak) return smoothstep(clamp01((p - from) / (peak - from)))
  if (to === undefined || !Number.isFinite(to) || to <= peak) return 1
  return 1 - smoothstep(clamp01((p - peak) / (to - peak)))
}

/** What the Environment reads. Every value a pure function of position; nothing is remembered. */
export type EnvironmentValues = ReadonlyArray<readonly [name: string, value: string]>

/**
 * **The two states either side of a position, and how far between them it is.**
 *
 * The same walk the driver does for `--state`, kept here rather than shared because the driver wants
 * *which state* and this wants *the pair*. Positions arrive already monotonic — `assertNarrative` is the
 * guarantee — so the first entry not yet passed is the one ahead.
 */
const span = (
  p: number,
  placed: ReadonlyArray<Placement>,
): {
  readonly from: number
  readonly to: number
  readonly t: number
  /** Where in the junction's own gap the position is, before any cross window narrows it. */
  readonly raw: number
} => {
  let lo = 0
  for (let i = 0; i < placed.length; i += 1) {
    if (Number.isFinite(placed[i].at) && p >= placed[i].at) lo = i
  }
  const hi = Math.min(lo + 1, placed.length - 1)
  const a = placed[lo].at
  const b = placed[hi].at
  if (hi === lo || !Number.isFinite(a) || !Number.isFinite(b) || b <= a) {
    return { from: placed[lo].id, to: placed[hi].id, t: 0, raw: 0 }
  }
  const raw = clamp01((p - a) / (b - a))
  const [w0, w1] = crossWindows[placed[lo].id] ?? [0, 1]
  return {
    from: placed[lo].id,
    to: placed[hi].id,
    t: smoothstep(clamp01((raw - w0) / (w1 - w0))),
    raw,
  }
}

/** A number read at both ends of the span and mixed. The one curve, applied once, in one place. */
const mix = (a: number, b: number, t: number): number => a + (b - a) * t

/**
 * **How far the pan has run**, as a fraction of its 20%. Derived from where states 07 and 08 sit rather
 * than from an authored distance, for the reason `span` gives.
 */
const panAt = (p: number, placed: ReadonlyArray<Placement>): number => {
  const from = placed[PAN_FROM - 1]?.at
  const to = placed[PAN_TO - 1]?.at
  if (from === undefined || to === undefined) return 0
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return 0
  return smoothstep(clamp01((p - from) / (to - from)))
}

/**
 * **The Environment at a position.** Six properties, written on the root by the driver and read by
 * `environment.tsx`'s layers in `globals.css`.
 *
 * Three of them are the plates' presence and they are the whole of *which photograph is behind the
 * page*. They are never a swap: a plate leaves by fading and the next arrives by fading over the same
 * span, so at every junction the outgoing and incoming plates are both present — which is exactly what
 * §3 asks for at 09 → 10 (*superimpose*) and what makes 05 → 06 an emergence rather than a cut. The
 * element behind each of them is mounted once for the session and never re-sourced.
 */
/*
  ── THE RAIL OVER A PHOTOGRAPH ──────────────────────────────────────────────────────────────────

  The Ledger stands in one corner for the whole film and the plates behind that corner are not one
  ground. Sampled in Chrome at 1920 × 889 inside the rail's own 120 × 226 rectangle:

                 lum     mid     floor
      studio     0.008   0.006   0.004    near black, all of it
      hero       0.180   0.088   0.023    night footage with a little sky in the corner
      artist     0.255   0.037   0.002    a wall seam runs down the middle of the index
      venice     0.453   0.019   0.003    a dark canal with the water's specular column across it
      selected   0.735   0.189   0.092    **lit everywhere** — its darkest 5% is brighter than
                                          venice's median

  **`mid` and `lum` are different questions and the last row is why.** Venice and selected both have
  bright highlights behind the rail, but venice is a dark photograph with a bright band in it and
  selected is simply a lit room. A wash dark enough to put cream type on selected has to move the whole
  box, and at that strength it is findable as a patch of shadow over the window — measured, and the one
  outcome the direction of 17 September 2026 rules out by name.

  So the two are treated as the different problems they are:

  **A bright band in a dark frame** is the wash's job. `railFieldFor(lum)` drops the highlight far
  enough for cream to hold, and because the rest of the box is already dark the wash has nothing to
  move and cannot be seen.

  **A lit frame** is the *ink's* job. The rail is printed in the page's own near-black instead — which
  is not a new device: `globals.css` already crosses `--rail-ink` between that black and the film's
  cream, and has since C5. All that is new is a third thing that can ask for the crossing.
  `railLitFor(mid)` asks it.

  **And when the ink crosses, the wash crosses with it.** Dark ink does not want a darkened ground; it
  wants the shadows lifted off the floor so the bottom of the box clears too. So the same pool becomes
  warm paper instead of warm black, at `railLiftFor(floor)` — over a backlit room that reads as bloom,
  which is what a backlit room does. The photograph is left brighter than it was rather than darker,
  and nothing is laid over it that it would not have done itself.

  The crossing sits between 0.10 and 0.17 of median luminance, which is empty: the four dark plates
  are at 0.006 to 0.088 and selected is at 0.189. So every *plate* resolves to one ink or the other and
  never to the grey in between; only a scroll-blend of two plates can land mid-crossing, and at that
  moment the ground itself is mid too.
*/

/** Dark ink wants the ground below this; it is where 4.5:1 lands for cream at the caption register. */
const FIELD_TARGET = 0.15

/**
 * **Where the treatment stops being invisible**, and a judgement rather than a calculation. The curve
 * asks 0.51 of the selected plate; at that value the pool is findable. It no longer binds — selected
 * crosses the ink now instead — but it stays as the guarantee that no future plate can buy contrast by
 * putting a shadow on the photograph.
 */
const FIELD_CEILING = 0.4

/** Dark ink on a lit ground needs the ground above this — 4.5:1 against `rgb(15 14 12)`. */
const LIFT_TARGET = 0.2

/** And the lift has its own ceiling, for the same reason the wash does. */
const LIFT_CEILING = 0.34

/** Linear ramp, clamped. */
const ramp = (x: number, a: number, b: number): number =>
  x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a)

const srgb = (luminance: number): number => luminance ** (1 / 2.2)

/**
 * **Which ink the rail is printed in**, from the median luminance behind it: 0 is the film's cream, 1
 * is the page's near-black. `globals.css` feeds it into `--rail-stone`, beside the two terms that were
 * already there.
 */
export const railLitFor = (median: number): number => ramp(median, 0.1, 0.17)

/** The dark wash a ground of this highlight luminance needs, or nothing if it needs nothing. */
export const railFieldFor = (luminance: number): number => {
  if (luminance <= 0) return 0
  const a = 1 - srgb(FIELD_TARGET) / srgb(luminance)
  return a <= 0 ? 0 : Math.min(a, FIELD_CEILING)
}

/** The light lift a ground of this floor needs before dark ink clears its darkest corner. */
export const railLiftFor = (floor: number): number => {
  const g = srgb(floor)
  if (g >= 0.95) return 0
  const a = (srgb(LIFT_TARGET) - g) / (0.95 - g)
  return a <= 0 ? 0 : Math.min(a, LIFT_CEILING)
}

/** What each of the Environment's own plates measures. The Work's plate carries its own, in content. */
const PLATE_RAIL: Record<Plate, { lum: number; mid: number; floor: number }> = {
  [PLATE.HERO]: { lum: 0.18, mid: 0.088, floor: 0.023 },
  [PLATE.VENICE]: { lum: 0.453, mid: 0.019, floor: 0.003 },
  [PLATE.STUDIO]: { lum: 0.008, mid: 0.006, floor: 0.004 },
  /* Sampled the same way. It is the studio plate's own corner, so it reads as the studio plate does. */
  [PLATE.METHOD]: { lum: 0.012, mid: 0.008, floor: 0.005 },
  [PLATE.NONE]: { lum: 0, mid: 0, floor: 0 },
}

/**
 * **How far junction 13 → 14 has got, on its own sheet.**
 *
 * The one junction on the site whose progress is not read off `p`. §8 authors it beat by beat and
 * the driver runs that sheet from the persistent rule's own position, so *this* is the number every
 * part of the exchange has to share — `TIMING.environment.persisting` argues why at length.
 *
 * `cross` is how far the plates have changed places; `dip` is how far the light is down. `leave` is how
 * far the camera has pushed into the room toward its window, and `back` how much of the same push is
 * still to run on the hillside — 1 while it stands wider than Contact's framing, 0 once it has landed.
 * All four are already eased where they are computed, so nothing here curves them a second time.
 */
export type Leaving = {
  readonly cross: number
  readonly dip: number
  readonly leave: number
  readonly back: number
}

/** The state junction 13 → 14 leaves. */
const LEAVING = 13

export const environmentValues = (
  p: number,
  placed: ReadonlyArray<Placement>,
  round: (n: number) => string,
  /** §8's own sheet for 13 → 14, handed in by the driver; `null` anywhere else on the page. */
  leaving: Leaving | null = null,
): EnvironmentValues => {
  const s = span(p, placed)

  /*
    **13 → 14 takes its progress from §8's sheet and not from `p`.** Everywhere else `raw` is where
    the position sits in the junction's gap and `t` is that narrowed by the plates' own window. Here
    the window is the sheet, the driver has already resolved it, and `raw` is the dip — which is what
    the passage below is a function of.

    **It holds through state 14 as well as state 13, and that is not tidiness.** The persist track is
    longer than the junction's own tail: state 14 is reached at about 0.48 of it, so `span()` reports
    `from = 14` for the whole second half of §8's sheet — the light coming back up, the frame holding
    empty, the headline. Read off the state alone, the passage would end at the bottom of the dip and
    the dawn would never be performed; measured in Chrome at 1440 × 849 before this, the exposure was
    back at §2's 0.72 one frame after the state changed, 200px before the lift was meant to finish.

    So while the track is engaged the pair is 13 → 14 whatever the state says, and the sheet decides
    how far between them the frame is. Below the track it is 13 → 14 at a cross of 1, which resolves
    to exactly state 14's own values — so nothing steps at the far end either.
  */
  const engaged = leaving !== null && (s.from === LEAVING || s.from === LEAVING + 1)
  const from = engaged ? LEAVING : s.from
  const to = engaged ? LEAVING + 1 : s.to
  const t = engaged && leaving !== null ? leaving.cross : s.t
  const raw = engaged && leaving !== null ? leaving.dip : s.raw

  /*
    A windowed junction is a **dissolve**, not a mix: the incoming plate stacks *beneath* the outgoing
    one (`environment.tsx`), stands whole as soon as the window opens, and the outgoing ground clears off
    it across the window. Mixing both at `t` put two half-opaque plates over black, and the frame dipped
    at the middle of 09 → 10, where §3 says the light never goes out.

    Clearing the *upper* layer is what makes the junction independent of which Work is showing: the
    stylesheet multiplies the Work's experience plate by this same presence, so whichever ground the
    Work stood on is the one that dissolves.
  */
  const dissolves = from in crossWindows || engaged
  const plate = (which: Plate): number => {
    const a = held(from) === which ? 1 : 0
    const b = held(to) === which ? 1 : 0
    if (dissolves && a === 0 && b === 1) return t > 0 ? 1 : 0
    return mix(a, b, t)
  }

  /*
    A measurement of the ground, blended by how present each plate is and scaled by §2's exposure. The
    same shape as `plate()` above, over the numbers rather than over the presences.
  */
  const { holds, falls, floor, softens, soft } = TIMING.about.passage

  /*
    **And the one at Contact, which is the same idea with a different shape.** About's passage is
    four movements read off one position; this one is already *two numbers* by the time it arrives —
    the driver resolved the fall and the lift out of §8's sheet — so the light is simply §2's own
    crossing taken down by however far the dip has gone. At `dip` 0 it is exactly the mix, which is
    what makes the two ends of the junction unchanged; at 1 it is `contact.passage.floor` of it.
  */
  const exposure = engaged
    ? mix(exposureOf(from), exposureOf(to), t) *
      (1 - raw * (1 - TIMING.contact.passage.floor))
    : from === PASSAGE
      ? throughThePassage(raw, [holds, falls], exposureOf(from), floor, exposureOf(to))
      : mix(exposureOf(from), exposureOf(to), t)

  /*
    **The room's contrast, and it is 1 everywhere except the one passage that needs it.** §11.1 permits
    the *grade* to change and this is a grade; nothing else on the site asks for it, so nothing else
    pays for it. `globals.css` applies it before the brightness — see `TIMING.about.passage`.
  */
  const contrast = engaged
    ? 1 - raw * (1 - TIMING.contact.passage.softens)
    : from === PASSAGE
      ? throughThePassage(raw, soft as unknown as readonly [number, number], 1, softens, 1)
      : 1
  const weigh = (of: 'lum' | 'mid' | 'floor'): number =>
    (Object.keys(PLATE_RAIL) as Array<keyof typeof PLATE_RAIL>).reduce(
      (sum, which) => sum + plate(which as Plate) * PLATE_RAIL[which][of],
      0,
    ) * exposure

  /* The ground is §2's own colour and it steps rather than mixes — two named greys one value apart. */
  const ground = groundOf(t < 0.5 ? from : to) ?? groundOf(from) ?? groundOf(to)

  return [
    /*
      What the rail needs over whatever is standing behind it: which ink to be, how much dark wash, and
      how much light lift. All three are blended by the same presences the plates are drawn at, and the
      luminances are taken down by §2's own exposure — a plate at a third of a stop is a third as bright
      behind the type. `work-experiences.tsx` supplies the Work's own plate separately; `globals.css`
      composes the two and gates all of it on the rail existing at all.
    */
    ['--env-lit', round(railLitFor(weigh('mid')))],
    ['--env-field', round(railFieldFor(weigh('lum')))],
    ['--env-lift', round(railLiftFor(weigh('floor')))],
    ['--env-hero', round(plate(PLATE.HERO))],
    ['--env-venice', round(plate(PLATE.VENICE))],
    ['--env-studio', round(plate(PLATE.STUDIO))],
    ['--env-method', round(plate(PLATE.METHOD))],
    ['--env-exposure', round(exposure)],
    ['--env-contrast', round(contrast)],
    /*
      ── The one camera move of 13 → 14, and the frame it lands on ──

      `--env-leave` pushes the method plate toward its window while the room darkens; `--env-return` is
      what is left of the same push on the hillside. Both are 0 everywhere but the junction that
      performs them.

      `--env-frame` is **Contact's framing of the footage**, and it is a state, not a motion: 1 from
      state 13 on — where the hero is hidden until the plates cross, so it can be reframed unseen — and
      0 before it, so the hero at state 01 is untouched by construction. `globals.css` says what the
      framing is, because it is composition and changes with the screen.
    */
    ['--env-leave', round(engaged && leaving !== null ? leaving.leave : 0)],
    ['--env-return', round(engaged && leaving !== null ? leaving.back : 0)],
    ['--env-frame', s.from >= LEAVING ? '1' : '0'],
    ['--env-pan', round(panAt(p, placed))],
    ['--env-stone', round(stoneAt(p, placed))],
    [
      '--env-ground-at',
      round(mix(groundOf(from) === null ? 0 : 1, groundOf(to) === null ? 0 : 1, t)),
    ],
    ['--env-ground', ground ?? 'transparent'],
  ]
}
