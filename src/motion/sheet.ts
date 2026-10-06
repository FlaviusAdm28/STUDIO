/**
 * ══════════════════════════════════════════════════════════════════════════════════════════════════
 * THE SHEET · J2B — INTEGRATION LAB · SANDBOX ONLY (D:\STUDIO-lab-sheet, :3050)
 * ══════════════════════════════════════════════════════════════════════════════════════════════════
 *
 * Not in the project, not approved for it, not frozen. `prototypes/the-sheet` (variant `j2b`) is the
 * visual reference; this is that choreography standing on the real driver, so that what follows it —
 * the photograph, the camera, the rail, the Work — is the real thing.
 *
 * **What this file owns.**
 *
 *   1. `SHEET` — the choreography's numbers, transcribed from the prototype's `CH` and `P2`. In the
 *      project these belong in `timing.ts` (`03-choreography.md`); they are here because this is a lab
 *      and `timing.ts` is not to be touched.
 *   2. `buildPrice` — distance → narrative position for states 01 → 05, re-priced to the sheet's own
 *      distances. The spine, `timeline.ts` and every one of its assertions are untouched: `p` still
 *      runs 01 → 14 over exactly the same values. Only how much scroll one unit of `p` costs changes,
 *      and only before the photograph. It is Model B's mechanism with a different table.
 *
 * **The seam.** The sheet's type is driven by scroll *distance* (in viewports, exactly as the
 * prototype was), and the environment is driven by `p`. The table below is what keeps the two in
 * step: it says where in the film's own light each moment of the page stands.
 *
 *   ?sheet=off      the current Opening, on this server (reference)
 *   ?sheet=bridge   the sheet, plus the bridge re-priced on coarse pointers (see `BRIDGE`)
 *   ?sheet=memory3  the bridge, plus `A memory.` giving its place to the Work's title (see `MEMORY3`)
 *   ?sheet=next     memory3, plus the film kept alive under the page and the last stretch re-priced (see `NEXT`)
 *
 * **Promoted on 6 October 2026: `next` is the site.** The lab's approved state
 * (`D:\STUDIO-lab-sheet`, `HANDOFF-SHEET-NEXT.md`) was brought into the project unchanged, and the one
 * thing that differs here is `variant` below: with no parameter the answer is `next`, where in the lab
 * it was the bare sheet. Nothing else was retuned. The other names still answer when asked for — they
 * are the references the approved one was judged against — and none of them is the default.
 */
import { prices, stateEntries } from './timeline'

/** Which sheet is asked for. No parameter is the approved one. */
const variant = (): string => new URLSearchParams(window.location.search).get('sheet') ?? 'next'

export const SHEET = {
  /* ── J2B, in viewports of scroll from the hero's first frame ─────────────────────────────────── */
  counts: 0.04,
  recede: [0.24, 0.9] as const,
  /* Fractions of the recede. */
  size: [0, 0.6] as const,
  rise: [0.18, 1] as const,
  wordInk: [0.24, 0.52] as const,
  closes: [0.56, 1] as const,
  swapAt: 0.74,
  cap: 0.9,
  track: 0.05,
  /* Ink, by position. The thesis begins before the head is named: chosen, not an accident (J2B). */
  writes: 0.78,
  heads: 0.94,
  lift: [1.12, 1.9] as const,
  occasions: [1.28, 1.5, 1.72] as const,
  chain: 350,
  thesisRests: 0.8,
  ladder: [0.52, 0.72, 1] as const,
  /* ── Leaving, on junction 05's own published position — the film's existing windows ────────── */
  releaseAt: 0.6 /*   the page lets go, all but `A memory.`   (`--q5-release-at`) */,
  deconAt: 0.818 /*   `A memory.` lets go                      (`--q5-decon-at`)   */,
} as const

/**
 * **Where the page stands in the film**, as [viewports of scroll, junction, published `--junction-at`].
 *
 * The first six rows are the sheet (2.0 viewports). The seventh is the page letting go and `A memory.`
 * standing alone. From the eighth on — the survivor coming apart, the photograph alone, the camera,
 * the rail, the Work — one viewport costs exactly what it costs in the project today.
 */
const TABLE: ReadonlyArray<readonly [vp: number, junction: number, at: number]> = [
  [0.0, 1, 0],
  [0.5, 1, 1] /*    the picture darkens while `Chapter II` stands and begins to recede */,
  [0.85, 2, 1] /*   the sun's pool closes as the line is filed */,
  [1.12, 3, 1] /*   the ember returns under the thesis and the head */,
  [1.4, 4, 1] /*    the light steps back as the page lifts */,
  [2.0, 5, 0.58] /* it rises over the occasions; all three stand */,
  [2.45, 5, 0.79] /* the page lets go; `A memory.` alone */,
]

/**
 * **The bridge, on a thumb only** — `?sheet=bridge`.
 *
 * Measured in this lab at 390 × 844: between the Opening's last ink (2.6 viewports) and the Work's first
 * (7.1) there are 4.5 viewports with no type, and on a portrait frame the camera's opening changes ~7% of
 * the screen per tenth of a viewport, against 32% on a desktop. The distance was priced for the larger
 * change. So, on coarse pointers only:
 *
 *   the survivor comes apart · the photograph alone   1.25 → 0.6 viewports   (junction 05, 0.79 → 1)
 *   the composition opens                             3.16 → 1.4 viewports   (junction 06)
 *
 * Nothing is retimed: both stretches run the same values of `p`, in the same order, over less scroll.
 * 07 → 08, the Work, and every fine pointer keep today's price.
 */
const BRIDGE: ReadonlyArray<readonly [vp: number, junction: number, at: number]> = [
  [2.45 + 0.6, 5, 1],
  [2.45 + 0.6 + 1.4, 6, 1],
]

/** Whether the bridge's price applies: asked for, and a thumb. */
export const bridgeOn = (): boolean => {
  if (typeof window === 'undefined') return false
  return (
    ['bridge', 'memory3', 'next'].includes(variant()) &&
    window.matchMedia('(pointer: coarse)').matches
  )
}

/**
 * **`A memory.` gives its place to `Wedding experiences`** — `?sheet=memory3`, study option 3.
 *
 * The photograph stays behind everything; the type conducts. When the page lets go, `A memory.` is not
 * left as a caption in the corner: the hand carries it up the axis into the Work's title slot, at the
 * title's own size, where it stands alone through the camera's opening. As the rail is written it
 * gives the slot up — out, then in, two inks in sequence and never together, exactly as `One` gave its
 * place to `II` — and `Wedding experiences` is written where it stood.
 *
 * Nothing of the Work is edited. The title that is written here is a stand-in owned by the page, set on
 * the real title's measured box; the real one rises underneath it on its own arrival, and the stand-in
 * is dropped once the real one is whole, where the two are indistinguishable.
 */
export const MEMORY3 = {
  /** The carry, on junction 05's published position: scroll-driven, so it stops and reverses with the hand. */
  promotes: [0.7, 0.92] as const,
  /**
   * Where the slot changes hands, on junction 06: the rail's wipe runs from ~0.62 of it, so at 0.93 the
   * head is two-thirds written — and the Work's own title does not begin to ink until ~0.08 of junction
   * 07, which leaves the word the time it needs to be gone first.
   */
  cedesAt: 0.93,
  /** Junction 07: where the page's stand-in is dropped, the real title being whole. */
  handsAt: 0.5,
} as const

export const memory3On = (): boolean => {
  if (typeof window === 'undefined') return false
  return ['memory3', 'next'].includes(variant())
}

/**
 * **`?sheet=next`** — memory3, and two things seen in a real browser on 5 October 2026.
 *
 * 1. **The last stretch, on a thumb.** Watched at 390 × 844 with real swipes: from the moment
 *    `A memory.` stands in the title's slot the photograph is, tile after tile, the same picture for
 *    ~1.4 viewports (the camera's opening is a slow push on a portrait crop); and once the title is
 *    written, ~1.3 viewports pass while two small labels and the identification fade in. Two waits.
 *    So, on coarse pointers only (second pass, after watching the first — 0.6 / 0.9 / 0.85 still held
 *    seven near-identical tiles under the word): the photograph coming up 0.6 → 0.45 viewports, the
 *    camera's opening 1.4 → 0.6, and the first half of junction 07 — the Work composing itself —
 *    1.57 → 0.85. The second half of 07, the Work, and every
 *    fine pointer keep today's price.
 * 2. **The film stays.** See `globals.css`, `[data-next='on']`: the four blacks that cover the footage
 *    from `II Philosophy` on are eased, never removed, so the film goes on under the page.
 */
const NEXT: ReadonlyArray<readonly [vp: number, junction: number, at: number]> = [
  [2.9, 5, 1] /*    the photograph comes up under the word          1.25 → 0.45 (bridge: 0.6) */,
  [3.5, 6, 1] /*    the camera opens; the word stands in the slot   3.16 → 0.6  (bridge: 1.4) */,
  [4.35, 7, 0.5] /* the title, the labels, the identification       1.57 → 0.85 */,
]

/**
 * **NEXT, second iteration — one transition, and `A memory.` drives it.**
 *
 * Watched in a real browser: the photograph was whole by the time the word reached the title's slot,
 * and then the word stood parked over it; and the exchange read as one line fading out and another
 * fading in. So, in `next` only:
 *
 *   the carry      `A memory.` travels to the title's geometry — and grows to the title's new size —
 *                  across the whole stretch that used to be a wait, as one eased move of the hand;
 *   the opening    the veil over the photograph lifts on that same move, a little behind it, so the
 *                  picture is born while the word travels and is present when the word arrives;
 *   the rewriting  the line is overwritten in place: one edge crosses the slot left to right, and what
 *                  is behind it is `Wedding experiences`, what is ahead of it still `A memory.` — one
 *                  ink at every point of the line, never two, never none.
 */
export const NEXT_MOVE = {
  /** The carry, as [junction, published position] at each end; converted to scroll per pointer. */
  from: [5, 0.62] as const,
  to: [6, 0.5] as const,
  /**
   * How far into the carry the veil begins to lift (it ends with the carry). Zero, after watching 0.12
   * with an eased-in carry: the word stood nearly still on a dark frame for the first 0.4 viewports —
   * the wait had only been moved earlier. The word now leaves at once (the carry eases OUT, not in) and
   * the picture opens on the same stretch, a little behind it.
   */
  opensFrom: 0,
  /**
   * On a wheel the carry runs a little further into the camera's opening: watched at 1440 × 900, with
   * 0.5 the word was all but settled a full viewport before the line was rewritten.
   */
  toFine: [6, 0.62] as const,
  /**
   * **The photograph's lateral lead**, as a share of the pan it is the beginning of. The camera's own
   * pan does not start until state 06 — halfway through the carry — so the picture used to stand still
   * sideways while the word rose. It now begins to travel with the word, on the same stretch, in the
   * direction the pan will take it; the lead is then absorbed by the pan (shown = lead + (1 − lead) ×
   * pan), so the Work's own framing is where it always was. ~22px on a phone, ~43px at 1440 (raised from 16 / 35, which could be measured but hardly seen).
   */
  lead: { coarse: 0.28, fine: 0.15 },
  /** Junction 06: where the line is rewritten. The rail's wipe begins at ~0.62 of it. */
  rewritesAt: 0.82,
  /** Junction 07: where the page's line is dropped for the Work's own, which is whole there. */
  handsAt: 0.5,
} as const

export const nextOn = (): boolean => {
  if (typeof window === 'undefined') return false
  return variant() === 'next'
}

const stateAt = (id: number): number => {
  const at = stateEntries.find((s) => s.id === id)?.at
  if (at === null || at === undefined) throw new Error(`Sheet: state ${id} has no beat on the shot`)
  return at
}

/** Published `--junction-at` → fraction of the junction's distance. Junction 05 is priced; the rest are affine. */
const distanceOf = (junction: number, at: number): number => {
  const priced = prices.get(junction)
  if (priced === undefined || at <= 0) return Math.max(0, at)
  if (at >= 1) return 1
  let lo = 0
  let hi = 1
  for (let i = 0; i < 48; i += 1) {
    const mid = (lo + hi) / 2
    if (priced.through(mid) < at) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

const pOf = (junction: number, at: number): number => {
  const a = stateAt(junction)
  const b = stateAt(junction + 1)
  return a + (b - a) * distanceOf(junction, at)
}

const anchorsOf = (table: typeof TABLE) => table.map(([vp, junction, at]) => [vp, pOf(junction, at)] as const)
/** The price last built — what turns a place in the film back into a place under the hand. */
let current: { pts: ReadonlyArray<readonly [number, number]>; perBeat: number; cut: number } | null = null

/** A place in the film ([junction, published position]) as viewports of scroll, at the current price. */
export const vpAt = (junction: number, at: number): number => {
  if (current === null) return 0
  const p = pOf(junction, at)
  const { pts, perBeat, cut } = current
  const [, lastP] = pts[pts.length - 1]
  if (p >= lastP) return (p - cut) * perBeat
  for (let i = 1; i < pts.length; i += 1) {
    if (p <= pts[i][1]) {
      const [d0, p0] = pts[i - 1]
      const [d1, p1] = pts[i]
      return (d0 + ((p - p0) / (p1 - p0 || 1)) * (d1 - d0)) * perBeat
    }
  }
  return (p - cut) * perBeat
}

const ANCHORS = anchorsOf(TABLE)
const ANCHORS_BRIDGE = anchorsOf([...TABLE, ...BRIDGE])
const ANCHORS_NEXT = anchorsOf([...TABLE, ...NEXT])

/**
 * **The landing, re-priced** — `?sheet=next`, 6 October 2026.
 *
 * Measured from `A memory.` standing alone (2.10 viewports) to the hand-over, where the Work is whole:
 * 2.29 viewports on a phone and 4.30 at 1440. The last stretch had only ever been re-priced for a
 * thumb (`NEXT`), so on a wheel the word climbed 185px of screen across 2.3 viewports of scroll; and on
 * both, the word then stood parked in the slot while only the rail was drawn.
 *
 * Nothing is retimed: the same values of `p`, in the same order, over less scroll — `NEXT`'s own
 * mechanism with shorter rows, and rows for a wheel as well. Rows are [viewports, junction, position].
 *
 *            phone, to the hand-over      1440, to the hand-over
 *   a        2.29 viewports (was)         4.30 viewports (was)
 *   b        1.89   −17%                  3.45   −20%
 *   c        1.69   −26%   ← in use       2.95   −31%   ← in use
 *   d        —                            2.50   −42%
 *
 * **`c` is the one in use.** Watched with real gestures at 390 × 844 and 1440 × 900, slow, normal and
 * flick, forward and back: the sequence reads as it did, and at a normal hand the word still stands
 * ~0.35–0.45s in the slot before it is rewritten. `d` was rejected: on a flick the photograph was
 * whole while the word had not yet left its place (the word reached the slot 0.04s before the
 * rewriting), and the hand-over waited a third of a second for the line — it appeared, it did not
 * land. `&land=a|b|d` are kept for comparison only.
 */
const LAND: Record<string, { coarse: typeof TABLE; fine: typeof TABLE }> = {
  a: { coarse: NEXT, fine: [] },
  b: {
    coarse: [[2.85, 5, 1], [3.33, 6, 1], [3.95, 7, 0.5]],
    fine: [[3.1, 5, 1], [4.7, 6, 1], [5.55, 7, 0.5]],
  },
  c: {
    coarse: [[2.82, 5, 1], [3.24, 6, 1], [3.75, 7, 0.5]],
    fine: [[3.0, 5, 1], [4.25, 6, 1], [5.05, 7, 0.5]],
  },
  d: {
    coarse: [[2.82, 5, 1], [3.24, 6, 1], [3.75, 7, 0.5]],
    fine: [[2.95, 5, 1], [3.85, 6, 1], [4.6, 7, 0.5]],
  },
}

/** Which landing price applies: `next` only, `c` unless the lab asks for another. */
const landOn = (): string | null => {
  if (typeof window === 'undefined' || !nextOn()) return null
  const land = new URLSearchParams(window.location.search).get('land')
  return land !== null && land in LAND ? land : 'c'
}

/** Junction 05's published position at `p` — what the page's leaving is triggered by. */
export const at5 = (p: number): number => {
  const a = stateAt(5)
  const b = stateAt(6)
  if (p <= a) return 0
  if (p >= b) return 1
  const f = (p - a) / (b - a)
  return prices.get(5)?.through(f) ?? f
}

/** Any junction's published position at `p`. */
export const atOf = (junction: number, p: number): number => {
  const a = stateAt(junction)
  const b = stateAt(junction + 1)
  if (p <= a) return 0
  if (p >= b) return 1
  const f = (p - a) / (b - a)
  return prices.get(junction)?.through(f) ?? f
}

/**
 * The price for one pointer. `perBeat` is viewports per beat of `p` at the runway's current price, so
 * the sheet costs the same number of viewports on a wheel and on a thumb while everything after it
 * keeps its own pricing.
 */
export const buildPrice = (perBeat: number) => {
  const land = landOn()
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const anchors =
    land !== null
      ? anchorsOf([...TABLE, ...(coarse ? LAND[land].coarse : LAND[land].fine)])
      : bridgeOn()
        ? nextOn()
          ? ANCHORS_NEXT
          : ANCHORS_BRIDGE
        : ANCHORS
  const pts = anchors.map(([vp, p]) => [vp / perBeat, p] as const)
  const [lastD, lastP] = pts[pts.length - 1]
  /** How much shorter the runway is, in beats of `p`. `.film` loses exactly this much height. */
  const cut = lastP - lastD
  current = { pts, perBeat, cut }
  /** Scroll distance (beats at the current price) → narrative position. Monotone and continuous. */
  const warp = (distance: number): number => {
    if (distance <= 0) return pts[0][1]
    if (distance >= lastD) return distance + cut
    for (let i = 1; i < pts.length; i += 1) {
      if (distance <= pts[i][0]) {
        const [d0, p0] = pts[i - 1]
        const [d1, p1] = pts[i]
        return p0 + ((distance - d0) / (d1 - d0)) * (p1 - p0)
      }
    }
    return distance + cut
  }
  return { warp, cut }
}

/** The lab's switch. */
export const sheetOn = (): boolean => {
  if (typeof window === 'undefined') return false
  return variant() !== 'off'
}

/** What the driver hands the page each frame: scroll in viewports past the hero, and where the film is. */
export type SheetFrame = (viewports: number, p: number, stamp: number) => void
declare global {
  interface Window {
    __sheet?: SheetFrame
  }
}
