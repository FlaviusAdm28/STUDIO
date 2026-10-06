/**
 * ══════════════════════════════════════════════════════════════════════════════════════════════════
 * MODEL B — EDITORIAL · PROTOTYPE · SANDBOX ONLY (D:\STUDIO-lab-modelB, :3001)
 * ══════════════════════════════════════════════════════════════════════════════════════════════════
 *
 * `docs/development/AUDIT-2026-10-SCROLL-JOURNEY.md` §12–13. Not in master, not approved, not frozen.
 *
 * **What this is.** A re-pricing of the Opening, 01 → the photograph, and nothing else. Every state,
 * junction, window, ramp, clock and trigger position is untouched: they are all functions of the
 * narrative position `p`, and `p` still runs 01 → 14 over exactly the same values. What changes is
 * **how much scroll one unit of `p` costs**, phase by phase — the same idea as `memories.pricing`
 * ("THIS IS THE LENGTH DIAL. Changing these retimes nothing"), applied across junctions instead of
 * inside one.
 *
 * Two mechanisms, both here, both switchable from the URL so the lab can compare on one server:
 *
 *   1. `warp`  — distance → `p`. A phase with factor 0.4 costs 40% of the scroll it costs today.
 *                The runway is physically shorter by `cut` beats (`--b-cut` on `.film`).
 *   2. `pace`  — a floor on how fast `p` may cross the occasions, in seconds. C28 plays the three
 *                phrases on 0.6s clocks, chained; a flick outruns them (C28's own record: at 6000px/s
 *                only `A wedding.` is seen). Shortening the zone makes that worse, so the narrative
 *                position is not allowed through the zone faster than the clocks can draw it. The
 *                page scrolls freely; the frame is pinned, so the lag is not visible as a mismatch.
 *
 *   ?modelb=off   the current build's behaviour, on this server (reference)
 *   ?modelb=all   Model B on fine pointers too (default: coarse only)
 *   ?pace=off     the warp without the floor
 */
import { prices, stateEntries } from './timeline'

/** A phase: junction, from and to as *published* `--junction-at` values, and its cost factor. */
type Phase = readonly [junction: number, from: number, to: number, factor: number, what: string]

/**
 * **The price list.** Factor = Model B distance ÷ current distance.
 *
 * Authored from the audit's measurements at 390×844 (current viewports → target viewports), and
 * deliberately not uniform: the lowest-consequence phases are cut hardest, reading is cut least, and
 * from the survivor coming apart onwards — the bridge, Venice, the Work — nothing is touched.
 */
export const PHASES: readonly Phase[] = [
  /*  j   from   to     factor   what, and current → target at 390×844 (viewports)            */
  [1, 0.0, 1.0, 0.52, 'Chapter One → Chapter II · the survivor travels · 3.87 → ~2.0'],
  [2, 0.0, 1.0, 0.31, 'Chapter II → II Philosophy · lowest consequence in the film · 3.87 → ~1.2'],
  [3, 0.0, 0.6, 0.5, 'the pair expands and releases · 2.00 → ~1.0'],
  [3, 0.6, 1.0, 0.45, 'clean frame, the thesis arrives (C30) and stands · 1.33 → ~0.6'],
  [4, 0.0, 0.5, 0.6, 'the thesis is read (C29 leaves at 0.50) · 1.18 → ~0.7'],
  [4, 0.5, 0.7, 0.64, 'the clean frame before the occasions · 0.47 → ~0.3'],
  [4, 0.7, 1.0, 0.63, '`A wedding.` arrives (C28) · 0.71 → ~0.45'],
  [5, 0.0, 0.214, 0.41, '`A wedding.` stands — a hold priced for a scrubbed phrase · 1.09 → ~0.45'],
  [5, 0.214, 0.429, 0.65, '`An artist.` · 1.10 → ~0.7'],
  [5, 0.429, 0.79, 0.54, '`A memory.`, the release, the survivor alone · 1.86 → ~1.0'],
  [5, 0.79, 1.0, 1.0, 'the survivor comes apart · the photograph alone · UNTOUCHED'],
]

/** How far a change of price is smoothed, in beats of `p` — so velocity has no kink at a phase edge. */
const BLUR = 0.03
const N = 4096

/**
 * **The floor under the occasions**, in seconds per phase, on published `--junction-at` values.
 * Three arrivals at 0.6s each, chained (C28), need 1.8s to exist at all; this allows 3.0s for the
 * zone, so each phrase stands whole for a moment before the next one takes its place.
 *
 * **And the thesis** — first pass of the lab, 390×844: with no floor a flick left the first sentence
 * of the site at full ink for 0.58s (2.04s in the current build). It is the same rule the hero
 * already keeps (`opening.tsx`: scrolling hurries the opening and can never skip it), extended to
 * the four things in the prologue that are read.
 */
type Floor = readonly [junction: number, from: number, toJunction: number, to: number, seconds: number]
export const FLOORS: readonly Floor[] = [
  [3, 0.68, 4, 0.5, 1.4] /*     the thesis: C30's arrival (0.6s) and a moment to read it */,
  [4, 0.7, 5, 0.214, 0.9] /*    `A wedding.` */,
  [5, 0.214, 5, 0.429, 1.0] /*  `An artist.` */,
  [5, 0.429, 5, 0.79, 1.1] /*   `A memory.` */,
]
/** After the floor lets go, how `p` rejoins the hand: one time constant, in seconds. */
const CATCH_UP = 0.2

const stateAt = (id: number): number => {
  const at = stateEntries.find((s) => s.id === id)?.at
  if (at === null || at === undefined) throw new Error(`Model B: state ${id} has no beat on the shot`)
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

/** A published junction position, as beats of `p`. */
export const pOf = (junction: number, at: number): number => {
  const a = stateAt(junction)
  const b = stateAt(junction + 1)
  return a + (b - a) * distanceOf(junction, at)
}

/** Where the re-pricing ends: the photograph. Past this `p` costs exactly what it costs today. */
const W = stateAt(6)

const cumulative = (() => {
  const rows = PHASES.map(([j, from, to, factor]) => [pOf(j, from), pOf(j, to), factor] as const)
  const density = new Float64Array(N)
  for (let i = 0; i < N; i += 1) {
    const p = ((i + 0.5) / N) * W
    let f = 1
    for (const [a, b, factor] of rows) {
      if (p >= a && p < b) {
        f = factor
        break
      }
    }
    density[i] = f
  }
  /* Edge-clamped Gaussian, as `timeline.ts`'s `price` does it: the integral is preserved. */
  const sd = (BLUR / W) * N
  const reach = Math.ceil(3 * sd)
  const kernel: number[] = []
  let weight = 0
  for (let k = -reach; k <= reach; k += 1) {
    const v = Math.exp(-0.5 * (k / sd) * (k / sd))
    kernel.push(v)
    weight += v
  }
  const out = new Float64Array(N + 1)
  for (let i = 0; i < N; i += 1) {
    let acc = 0
    for (let k = -reach; k <= reach; k += 1) {
      acc += density[Math.min(N - 1, Math.max(0, i + k))] * kernel[k + reach]
    }
    out[i + 1] = out[i] + (acc / weight) * (W / N)
  }
  return out
})()

/** How much shorter the runway is, in beats of `p`. `.film` loses exactly this much height. */
export const cut: number = W - cumulative[N]

/** Scroll distance (beats of the current price) → narrative position `p`. Monotone, continuous, C¹. */
export const warp = (distance: number): number => {
  if (distance <= 0) return 0
  const total = cumulative[N]
  if (distance >= total) return distance + cut
  let lo = 0
  let hi = N
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (cumulative[mid] <= distance) lo = mid
    else hi = mid
  }
  const c0 = cumulative[lo]
  const c1 = cumulative[lo + 1]
  return ((lo + (c1 > c0 ? (distance - c0) / (c1 - c0) : 0)) / N) * W
}

const zones = FLOORS.map(([j0, a0, j1, a1, seconds]) => {
  const from = pOf(j0, a0)
  const to = pOf(j1, a1)
  return { from, to, rate: (to - from) / seconds }
})

/**
 * One frame of `p` chasing its target. Outside the floored zones it is free; inside one it may not
 * exceed the zone's rate, in either direction — the same film backwards. `lagging` says the last frame
 * was held back, so the free stretch that follows is rejoined on a time constant rather than jumped.
 */
export const pace = (shown: number, target: number, dt: number, lagging: boolean): number => {
  if (shown === target) return target
  const dir = target > shown ? 1 : -1
  let p = shown
  let budget = dt
  for (let guard = 0; guard < 16 && p !== target; guard += 1) {
    const zone = zones.find((z) => (dir > 0 ? p >= z.from && p < z.to : p > z.from && p <= z.to))
    if (zone === undefined) {
      let edge = dir > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
      for (const z of zones) {
        if (dir > 0 && z.from > p) edge = Math.min(edge, z.from)
        if (dir < 0 && z.to < p) edge = Math.max(edge, z.to)
      }
      const dest = dir > 0 ? Math.min(target, edge) : Math.max(target, edge)
      if (lagging) {
        /* Rejoin, do not jump: an exponential approach, so it lands without a step in velocity. */
        p += (dest - p) * (1 - Math.exp(-budget / CATCH_UP))
        if (Math.abs(dest - p) < 1e-4) p = dest
        return p
      }
      p = dest
      continue
    }
    if (budget <= 0) break
    const end = dir > 0 ? Math.min(target, zone.to) : Math.max(target, zone.from)
    const need = Math.abs(end - p) / zone.rate
    if (need <= budget) {
      p = end
      budget -= need
    } else {
      p += dir * zone.rate * budget
      budget = 0
    }
  }
  return p
}

/** The lab's switches. Read once per `price()`, in the browser. */
export const modelBMode = (): { warp: boolean; pace: boolean } => {
  if (typeof window === 'undefined') return { warp: false, pace: false }
  const q = new URLSearchParams(window.location.search)
  const mode = q.get('modelb')
  const on = mode === 'off' ? false : mode === 'all' ? true : window.matchMedia('(pointer: coarse)').matches
  return { warp: on, pace: on && q.get('pace') !== 'off' }
}
