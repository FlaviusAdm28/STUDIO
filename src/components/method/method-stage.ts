/*
  The Method's held scene (storyboard states 6 → 11; README #37, #45, #47, #48, #94; interactions.md §3).
  The scroll chooses the phase — with a dead band, so a finger resting near a change never flips it (as the Work's
  chapters, #90) — and each phase change plays as Web Animations from wherever every layer is seen, never as CSS
  transitions (iOS cut those, #90, #91). Transform and opacity only.

  pre  the Work's Experiences is seen beneath; the six template screens (three on a phone) wait in the studio, unseen
  7    the passage (README #102), one trigger, played whole (~2.8 s): the guide's photograph moves in a little and one oblique
       edge of light (12°) crosses the screen from the hour's side (morning from the left, day from the middle outwards,
       evening and night from the right), leaving the studio lit; it finds the screens in their places and the words as it
       passes them; then No templates. No copies. steps back and Make it yours comes forward, its caret blinking a few
       seconds, then still. Scrolled on before it ends, it ends quickly (0.3 s) and only then does 8 answer. Back, the
       light goes back the way it came (0.8 s)
  8a–c a template lifts and leaves, a live screen beneath: two by two on the desktop, one by one on a phone (a deck)
  9    all different; the chapter chosen at the entrance is featured (on a phone it opens to the whole screen)
  10   they gather into the cover of the visitor's chapter
  11   the light goes down: on the desktop the screens move aside, quiet; on a phone they leave; one sentence stays
  The positions are the storyboard's (v46, cardLayout): [centre x %, centre y %, width % of the stage width, turn].
*/
import { bandColour, hex, over, parseColour } from '@/lib/top-colour'

type Pos = readonly [number, number, number, number]
type Mode = 'on' | 'lift' | 'gone'
type Layout = { pos: Pos; o: number; z: number; mode: Mode; full?: boolean; cover?: boolean }

export const PHASES = ['pre', '7', '8a', '8b', '8c', '9', '10', '11'] as const
export type Phase = (typeof PHASES)[number]
// where each phase starts, as a share of the held scroll (4.7 screens): 7 the moment the stage is held (README #102: one trigger).
// In screens: 8a 1.15, 8b 1.6, 8c 2.05, 9 2.6, 10 3.25, 11 3.9 (owner, 2 Nov: from 7 to 11 no longer than this). 8a at 0.6 was tried
// and turned back (owner, desktop, 3 Nov)
const STARTS: Record<Exclude<Phase, 'pre'>, number> = {
  '7': 0,
  '8a': 0.245,
  '8b': 0.34,
  '8c': 0.436,
  '9': 0.553,
  '10': 0.691,
  '11': 0.83,
}
// On a phone (scene 6.2 screens, method.css): the steps evened out at ~0.8 screen — 8a to 8c were 0.57 each and one stroke of a finger
// ran through two (owner, Xiaomi, 3 Nov). In screens: 8a 1.3, 8b 2.1, 8c 2.9, 9 3.7, 10 4.55, 11 5.4
const PHONE_SCENE = 6.2
const STARTS_PHONE: Record<Exclude<Phase, 'pre'>, number> = {
  '7': 0,
  '8a': 1.3 / PHONE_SCENE,
  '8b': 2.1 / PHONE_SCENE,
  '8c': 2.9 / PHONE_SCENE,
  '9': 3.7 / PHONE_SCENE,
  '10': 4.55 / PHONE_SCENE,
  '11': 5.4 / PHONE_SCENE,
}
const BAND = 0.025
// the stage is held this many screens before the scene starts (method.css): the light comes and goes on a stage already held
const LEAD = 0.5
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const IN_OUT = 'cubic-bezier(0.55, 0, 0.25, 1)'
const MOVE = 1100
// the passage (README #102; storyboard "A luz, os cartões e as palavras", C2): the light's sweep, the way back, a hurried end
const SWEEP_MS = 1500
type Curve = readonly [number, number, number, number]
const SWEEP: Curve = [0.45, 0, 0.3, 1]
const SWEEP_EASE = `cubic-bezier(${SWEEP.join(', ')})`
const BACK: Curve = [0.55, 0, 0.25, 1]
const BACK_MS = 800
const HURRY_MS = 300
// the page's edges cross-fade this long (entrance/sequence.ts, while in the Method)
const EDGE_FADE = 300
// after the light: the thesis steps back, Make it yours comes forward
const ASK_AT = SWEEP_MS + 350
// the thesis stepped back: 0.7, not the storyboard's 0.42 — measured against the four grounds, 0.42 fell to 1.9 : 1 in the evening;
// 0.7 keeps 3 : 1 (large text) at every hour
const DIM = 0.7
// Make it yours comes forward by the thesis stepping back, at its own size: scaled 1.4 (and 1.1) the name field came out far larger than
// its label and the caret out of line (owner, 3 Nov); the field's measures are set in method.css
// the photograph moving in under the light (variant 5's push)
const PUSH = 1.14
const PUSH_MS = 1800
const TAN = Math.tan((12 * Math.PI) / 180)
// the share of its time at which an easing reaches a share of its way (sampled: a passage needs no more)
const timeOf = ([x1, y1, x2, y2]: Curve) => {
  const c = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
  const pts = Array.from({ length: 201 }, (_, i) => [c(x1, x2, i / 200), c(y1, y2, i / 200)] as const)
  return (p: number) => (pts.find(([, y]) => y >= Math.min(1, Math.max(0, p))) ?? pts[200])[0]
}
const sweepTime = timeOf(SWEEP)
const backTime = timeOf(BACK)

// (the phone's deck: its height placed under the field by measure())
const T: Record<'desk' | 'phone', readonly Pos[]> = {
  desk: [14, 28.4, 42.8, 57.2, 71.6, 86].map((x) => [x, 69, 11, 0] as const),
  // 55 % of the width (owner, 3 Nov, from a side-by-side of 58 / 55 / 52; README #101 had 58, the first 46)
  phone: [
    [50, 64, 55, -3],
    [50, 65, 55, 0],
    [50, 66, 55, 3],
  ],
}
// (the phone's first card of 8 kept clear of the field by measure(), from its own place)
const U_PHONE_FIRST: Pos = [26, 56, 40.8, -6]
const U: Record<'desk' | 'phone', readonly Pos[]> = {
  desk: [
    [13, 60, 11.5, -3],
    [27, 67, 10, 2],
    [41.5, 59, 11, -1],
    [57, 62, 13, 0],
    [72.5, 66, 11, 2],
    [86.5, 59, 10.5, -2],
  ],
  // grown as the deck (× 58 / 46, README #101) and lower than before (47 / 58 / 80): Make it yours must stay readable while one
  // writes (2 Nov); the first card's top was over it
  // 55 / 58 of the sizes they had with the deck at 58 % (owner, 3 Nov)
  phone: [
    [26, 56, 40.8, -6],
    [52, 64, 42.7, 2],
    [74, 77, 40.8, 4],
  ],
}
const SIDES: readonly Pos[] = [
  [8, 46, 7.5, -4],
  [17, 62, 8, 2],
  [25, 42, 6.5, -2],
  [75, 60, 6.5, 2],
  [83, 42, 8, -2],
  [92, 58, 7.5, 3],
]
const gathered = (kind: 'desk' | 'phone', [x, y, w, r]: Pos): Pos => [50 + (x - 50) * 0.45, 46 + (y - 46) * 0.45, (kind === 'phone' ? Math.min(w, 34) : w) * 0.55, r]
// 10: the others, quiet, in places symmetrical about the cover — gathered by their own place, the featured one leaving its
// spot left two on one side and one on the other (owner, 2 Nov). Desktop: four around it, the fifth behind it; phone: one each side.
const GATHER: Record<'desk' | 'phone', readonly Pos[]> = {
  desk: [...[0, 1, 4, 5].map((i) => gathered('desk', U.desk[i])), [50, 47, 6, 0]],
  phone: [0, 2].map((i) => gathered('phone', U.phone[i])),
}
const KEY_K: Record<Phase, number> = { pre: 0, '7': 0, '8a': 0.3, '8b': 0.45, '8c': 0.6, '9': 0.85, '10': 1, '11': 1 }
const SHEET: Record<Mode, { transform: string; opacity: number }> = {
  on: { transform: 'none', opacity: 1 },
  lift: { transform: 'translate(10%, -36%) rotate(-10deg)', opacity: 0.5 },
  gone: { transform: 'translate(16%, -130%) rotate(-14deg)', opacity: 0 },
}

// The sheet lifting (8) rests lower than the storyboard's 36 %: with Make it yours larger (#102) and the phone's cards at 58 % and
// as tall as the screen allows (#101), at 36 % it rested over the thesis on a phone and over the field on the desktop (measured,
// 3 Nov). On a phone it moves aside instead, turning the other way (at 320 × 640 any rise reached the field); half seen, then it leaves
const LIFT: Record<'desk' | 'phone', { transform: string; opacity: number }> = {
  desk: { transform: 'translate(10%, -24%) rotate(-10deg)', opacity: 0.5 },
  phone: { transform: 'translate(28%, -3%) rotate(5deg)', opacity: 0.5 },
}

function layout(kind: 'desk' | 'phone', phase: Phase, i: number, n: number, featured: number): Layout {
  // 0.001, not 0: drawn (and kept) before the scene, so the lights coming on do not wait for the first paint (Xiaomi, 2 Nov).
  // The screens wait in their places: the light finds them there (README #102)
  if (phase === 'pre') return { pos: T[kind][i], o: 0.001, z: n - i, mode: 'on' }
  if (phase === '7') return { pos: T[kind][i], o: 1, z: n - i, mode: 'on' }
  if (phase === '8a' || phase === '8b' || phase === '8c') {
    const step = phase === '8a' ? 1 : phase === '8b' ? 2 : 3
    const shown = kind === 'phone' ? step : step * 2
    const lifting = kind === 'phone' ? 1 : 2
    if (i < shown) return { pos: U[kind][i], o: 1, z: 9 + i, mode: 'gone' }
    if (i < shown + lifting) return { pos: T[kind][i], o: 1, z: 8, mode: 'lift' }
    return { pos: T[kind][i], o: 1, z: n - i, mode: 'on' }
  }
  if (phase === '9') {
    // the whole screen, under the bar (owner, 2/11, README #96)
    if (i === featured && kind === 'phone') return { pos: [50, 50, 100, 0], o: 1, z: 20, mode: 'gone', full: true }
    const [x, y, w, r] = U[kind][i]
    return i === featured ? { pos: [x, y, w * 1.18, 0], o: 1, z: 20, mode: 'gone' } : { pos: [x, y, w, r], o: 0.7, z: i + 1, mode: 'gone' }
  }
  // the featured screen becomes the cover, in the cover's place; the others gather, quiet (README #96)
  if (phase === '10')
    return i === featured
      ? { pos: kind === 'phone' ? [50, 46, 60.7, 0] : [50, 48, 17, 0], o: 1, z: 20, mode: 'gone', cover: true }
      : { pos: GATHER[kind][i < featured ? i : i - 1], o: 0.16, z: i + 1, mode: 'gone' }
  if (kind === 'phone') {
    // the cover leaves where it is, in the middle: it settles smaller and fades, making room for the sentence (owner, iPhone, 3 Nov:
    // it went off to one side); the others leave from where they were gathered
    if (i === featured) return { pos: [50, 44, 46, 0], o: 0, z: 20, mode: 'gone', cover: true }
    const [x, y, w] = U.phone[i]
    return { pos: [x, y - 4, Math.min(w, 34), 0], o: 0, z: i + 1, mode: 'gone' }
  }
  return { pos: SIDES[i], o: 0.6, z: 10 + i, mode: 'gone' }
}

/** chosen: read when the scene begins — the blade is clicked after this script starts (#45). */
export function runStage(section: HTMLElement, chosen: () => string, lumOf: (phase: Phase) => string) {
  const stage = section.querySelector<HTMLElement>('.m-stage')
  const studio = section.querySelector<HTMLElement>('.m-studio')
  const key = section.querySelector<HTMLElement>('.m-key')
  const head = section.querySelector<HTMLElement>('.m-head')
  const thesis = section.querySelector<HTMLElement>('.m-thesis')
  const field = section.querySelector<HTMLElement>('.m-field')
  const caret = section.querySelector<HTMLElement>('.m-caret')
  const cover = section.querySelector<HTMLElement>('.m-cover')
  const end = section.querySelector<HTMLElement>('.m-end')
  const wipe = section.querySelector<HTMLElement>('.m-wipe')
  const wipeB = section.querySelector<HTMLElement>('.m-wipe-b')
  const wipeIn = section.querySelector<HTMLElement>('.m-wipe-in')
  const night = section.querySelector<HTMLElement>('.m-night')
  const spillL = section.querySelector<HTMLElement>('.m-spill-l')
  const spillR = section.querySelector<HTMLElement>('.m-spill-r')
  if (!stage || !studio || !key || !head || !thesis || !field || !cover || !end || !wipe || !wipeB || !wipeIn || !night) return () => {}
  const lines = [...thesis.children] as HTMLElement[]
  const phoneQuery = matchMedia('(max-width: 899px)')
  const cleanups: (() => void)[] = []
  let kind: 'desk' | 'phone' = phoneQuery.matches ? 'phone' : 'desk'
  let cards: HTMLElement[] = []
  let featured = 0
  let phase: Phase | null = null
  // the light's place: waiting open and unseen (painted ahead), gathered on the hour's side, open
  let bladeAt: 'ahead' | 'shut' | 'open' | null = null
  let W = 0
  let H = 0
  // On a phone the cards have the shape of the visitor's own screen (README #101: a fixed 9 : 19.5 left the whole screen of 9 at
  // 360 px on a 392 px Xiaomi), within a phone's range; the scene lives in a frame that wide, never wider than the screen (a tablet
  // upright keeps a phone's shape, centred by ox). The desktop's framed phones stay 9 : 19.5
  let AR = 9 / 19.5
  let ARF = 9 / 19.5
  let LVH = 0
  let lift = 0
  // iOS: the held stage is drawn behind Safari's island and under its bar (method.css, the iOS block), so the edges' colour shows there
  // only over the Work, where the light has not come yet (setEdge's moments below)
  let reaches = false
  let F = 0
  let ox = 0
  // the side the hour's light comes from (README #102): the light's own side in method.css (--m-kx)
  let dir: 'ltr' | 'mid' | 'rtl' = 'mid'
  // the flights in hand, by element: a new one starts from what the old one shows, then the old one goes
  const flights = new Map<Element, Animation>()
  // the light's spill, each with its transform and its opacity apart (one flight per element cannot hold both timings)
  const spillAnims: Animation[] = []
  // A phase change starts many flights at once. Each reads where its element is, and reads interleaved with new animations
  // made the browser recompute the page between them (a 122 ms frame at 9 → 10 on the Xiaomi, 2 Nov): so a phase change
  // queues its flights, reads every starting point first, then starts them all.
  type Flight = { el: HTMLElement; to: Keyframe; duration: number; delay: number; instant: boolean; from?: Keyframe; easing?: string }
  let queue: Flight[] | null = null
  const start = (f: Flight) => {
    const { el, to, duration, delay, instant } = f
    flights.get(el)?.cancel()
    flights.delete(el)
    const settle = () => Object.entries(to).forEach(([p, v]) => el.style.setProperty(p, String(v)))
    if (instant) return settle()
    const a = el.animate([f.from ?? {}, to], { duration, delay, easing: f.easing ?? EASE, fill: 'both' })
    flights.set(el, a)
    a.onfinish = () => {
      settle()
      if (flights.get(el) === a) {
        a.cancel()
        flights.delete(el)
      }
    }
  }
  const read = (f: Flight) => {
    if (f.instant || f.from) return
    const cs = getComputedStyle(f.el)
    f.from = {}
    for (const p of Object.keys(f.to)) f.from[p] = p === 'transform' ? (cs.transform === 'none' ? 'none' : cs.transform) : cs.getPropertyValue(p)
  }
  const fly = (el: HTMLElement, to: Keyframe, duration = MOVE, delay = 0, instant = false, from?: Keyframe, easing?: string) => {
    const f: Flight = { el, to, duration, delay, instant, from, easing }
    if (queue) return void queue.push(f)
    read(f)
    start(f)
  }
  const batch = (work: () => void) => {
    queue = []
    // the queue is let go whatever happens: left open by an error, every later flight would wait in it and the scene would stand still
    try {
      work()
    } finally {
      const all = queue
      queue = null
      all.forEach(read)
      all.forEach(start)
    }
  }

  // the cards' sizes: each drawn at the largest it will be, so it is never scaled up (a raster grown is blurred)
  const measure = () => {
    kind = phoneQuery.matches ? 'phone' : 'desk'
    W = stage.clientWidth
    H = window.innerHeight
    // The whole screen of 9 is as tall as the held stage (--screen): on Android 100lvh, so it still fills the screen once Chrome's
    // address bar has gone (owner, Xiaomi, 3 Nov); on iOS 100lvh + 130 px, as every held scene, so it runs on under Safari's floating
    // bar to the screen's foot (100lvh alone left a band of the studio at the foot, owner, iPhone, 3 Nov)
    // on iOS the stage reaches 70 px above the screen (method.css --m-lift): every measure against it is of the screen under that
    lift = parseFloat(getComputedStyle(section).getPropertyValue('--m-lift')) || 0
    reaches = lift > 0
    LVH = Math.max(H, stage.offsetHeight - lift)
    // the cards in the stage's shape, as before; the whole screen of 9 fills it (README #101, #103). A 9 : 16 card was tried and turned back
    // (owner, iPhone, 3 Nov: too short)
    AR = kind === 'phone' ? Math.min(9 / 16, Math.max(9 / 23, W / LVH)) : 9 / 19.5
    // the whole screen of 9 runs up behind Safari's island too (iOS): its shape is the screen's and the lift's
    ARF = kind === 'phone' && lift ? W / (LVH + lift) : AR
    F = kind === 'phone' ? Math.min(W, LVH * AR) : W
    // The deck of 7 where it was (64–66 % of the screen) — unless that puts it over Make it yours: after a refresh in 8 on iOS the screen
    // was measured shorter and the cards rose over the field (owner, iPhone, 3 Nov). Then it goes down just enough: its top 30 px under
    // the field's foot (taken from the layout, no transforms; the turned cards' corners rise ~12 px)
    if (kind === 'phone') {
      const fieldFoot = head.offsetTop + field.offsetTop + field.offsetHeight
      const half = (0.55 * F) / AR / 2
      const y = Math.max(65, ((fieldFoot + 30 + half) / H) * 100)
      T.phone = [
        [50, y - 1, 55, -3],
        [50, y, 55, 0],
        [50, y + 1, 55, 3],
      ]
      // and the first card of 8 the same way (its top 34 px under the field: it turns −6°, its corner rises more)
      const [ux, uy, uw, ur] = U_PHONE_FIRST
      const uHalf = (uw * F) / 100 / AR / 2
      U.phone = [[ux, Math.max(uy, ((fieldFoot + 34 + uHalf) / H) * 100), uw, ur], U.phone[1], U.phone[2]]
    }
    ox = (W - F) / 2
    // written only when they change: measured again at every passage, rewriting them each time restyled the whole section (Xiaomi,
    // quick strokes over the seam, 3 Nov)
    const put = (el: HTMLElement, k: string, v: string) => el.style.getPropertyValue(k) !== v && el.style.setProperty(k, v)
    put(section, '--mw', `${W}px`)
    put(section, '--m-ar', AR.toFixed(4))
    put(section, '--m-ar-full', ARF.toFixed(4))
    const light = document.documentElement.dataset.light
    dir = light === 'morning' ? 'ltr' : light === 'evening' || light === 'night' ? 'rtl' : 'mid'
    cards = [...section.querySelectorAll<HTMLElement>('.m-card')].filter((c) => kind === 'desk' || c.hasAttribute('data-phone'))
    featured = Math.max(0, cards.findIndex((c) => c.dataset.chapter === chosen()))
    cards.forEach((card, i) => {
      const widths = PHASES.map((p) => layout(kind, p, i, cards.length, featured).pos[2])
      const bw = String(Math.max(...widths))
      if (card.dataset.bw !== bw) card.dataset.bw = bw
      put(card, '--bw', `${(Math.max(...widths) * F) / 100}px`)
    })
  }
  const centreOf = ([x, y]: Pos) => [ox + (x * F) / 100, (y * H) / 100] as const
  const cardTransform = (card: HTMLElement, [x, y, w, r]: Pos, full = false) => {
    const bw = (Number(card.dataset.bw) * F) / 100
    const bh = bw / (full ? ARF : AR)
    return `translate(${(ox + (x * F) / 100 - bw / 2).toFixed(1)}px, ${((y * H) / 100 - bh / 2).toFixed(1)}px) rotate(${r}deg) scale(${(w / Number(card.dataset.bw)).toFixed(4)})`
  }
  // the light: placed at its first place, moved by transform (#94)
  const keyBase = () => {
    const cs = getComputedStyle(section)
    const side = parseFloat(cs.getPropertyValue('--m-kx')) || 50
    const high = parseFloat(cs.getPropertyValue('--m-ky')) || 18
    return { side, high }
  }
  const placeKey = () => {
    const { side, high } = keyBase()
    if (kind === 'phone') {
      const kx = Math.min(80, Math.max(20, side))
      const w = 1.5 * 0.92 * F
      Object.assign(key.style, { left: `${ox + (kx * F) / 100}px`, top: `${0.22 * H}px`, width: `${w}px`, height: `${w}px`, aspectRatio: 'auto' })
    } else {
      Object.assign(key.style, { left: `${(side * W) / 100}px`, top: `${(high * H) / 100}px`, width: `${1.1 * 0.92 * W}px`, height: `${1.4 * 0.92 * H}px` })
    }
  }
  const keyTransform = (k: number) => {
    const { side } = keyBase()
    const grow = (0.92 + 0.35 * k) / 0.92
    if (kind === 'phone') {
      const kx = Math.min(80, Math.max(20, side))
      return `translate(-50%, -50%) translate(${(((50 - kx) * k * 0.55) / 100) * F}px, ${0.3 * k * H}px) scale(${grow.toFixed(4)})`
    }
    return `translate(-50%, -50%) translate(${(((50 - side) * k * 0.6) / 100) * W}px, ${(12.8 * k * H) / 100}px) scale(${grow.toFixed(4)})`
  }

  // The light's edges, on the top line, in parts of the width (each edge leans: its foot is H · tan 12° to the left). Open: past
  // both sides of the screen. Gathered: a band of no width on the hour's side (left, right, or the middle), where it comes from.
  const OPEN = (): readonly [number, number] => [-0.04, 1.04 + (TAN * H) / W]
  const gatheredAt = (): readonly [number, number] => {
    const [a, b] = OPEN()
    if (dir === 'ltr') return [a, a]
    if (dir === 'rtl') return [b, b]
    const c = 0.5 + (TAN * H) / (2 * W)
    return [c, c]
  }
  // when the sweep's edge reaches a point of the screen (px), in ms from its start; and when, going back, it leaves it
  const shareOf = (x: number, y: number, back: boolean) => {
    const [o0, o1] = OPEN()
    const [c] = gatheredAt()
    const need = (x + TAN * y) / W
    // the share of the edge's way at which it crosses the point: forward from the hour's side, back towards it
    const fwd = dir === 'ltr' ? (need - o0) / (o1 - o0) : dir === 'rtl' ? (o1 - need) / (o1 - o0) : need >= c ? (need - c) / (o1 - c) : (c - need) / (c - o0)
    return back ? 1 - fwd : fwd
  }
  const reachAt = (x: number, y: number) => Math.round(SWEEP_MS * sweepTime(shareOf(x, y, false)))
  const leaveAt = (x: number, y: number) => Math.round(BACK_MS * backTime(shareOf(x, y, true)))
  // a screen's corners (its turn is small: the box is near enough)
  const cornersOf = ([x, y, w]: Pos) => {
    const [cx, cy] = centreOf([x, y, w, 0])
    const hw = (w * F) / 200
    const hh = hw / AR
    return [[cx - hw, cy - hh], [cx + hw, cy - hh], [cx - hw, cy + hh], [cx + hw, cy + hh]] as const
  }
  const midOf = (el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    const s = stage.getBoundingClientRect()
    // of the screen: on iOS the stage's top is 70 px above it (the lift)
    return [r.left + r.width / 2 - s.left, r.top + r.height / 2 - s.top - lift] as const
  }

  // The Work's photograph of the guide moves in a little under the light, from the transform the Work gave it (it rests while the
  // Method is over it). A plain animation, replacing: one adding to the Work's own transform ran on the main thread, the photograph
  // repainted on every frame (Xiaomi, 3 Nov: the passage at 73 fps and a first frame of 376 ms; 82–87 fps without it). Back out, it
  // is let go, and the Work's own transform is the photograph's again
  let push: Animation | null = null
  const pushPhoto = (on: boolean) => {
    if (on && !push) {
      const ph = document.querySelector<HTMLElement>('#work .w-ch[data-c="experiences"] .w-stack')
      if (!ph) return
      const base = getComputedStyle(ph).transform
      const from = base === 'none' ? '' : base
      push = ph.animate([{ transform: from || 'none' }, { transform: `${from} scale(${PUSH})` }], { duration: PUSH_MS, easing: IN_OUT, fill: 'both' })
      const mine = push
      mine.onfinish = () => {
        // finished going back: let go
        if (mine.playbackRate < 0 && push === mine) {
          mine.cancel()
          push = null
        }
      }
      return
    }
    if (!push) return
    // Back after the light has covered the screen: the photograph is let go at once, unseen under the light, before the light
    // uncovers it. Played back while seen, it cost the way back ~20 fps on the Xiaomi (59–67, against 79–81 without it, 3 Nov)
    if (!on && performance.now() >= passageEnds) {
      // to its resting size at once (a layer moved, nothing redrawn); the animation itself goes once the light has gone and nothing
      // moves: ended at once, the photograph was redrawn in the first frame of the way back (133–177 ms, Xiaomi, 3 Nov)
      const mine = push
      mine.pause()
      mine.currentTime = 0
      window.setTimeout(() => {
        if (push === mine && mine.playState === 'paused') {
          mine.cancel()
          push = null
        }
      }, BACK_MS + 400)
      return
    }
    push.updatePlaybackRate(on ? 1 : -PUSH_MS / BACK_MS)
    push.play()
  }

  // 9 → 10, one object (README #96): the featured screen's photograph grows to the whole card while the rest of the screen
  // goes; the veil and the cover's words come over it, one by one. Back again, the reverse.
  const becomeCover = (card: HTMLElement, on: boolean, instant: boolean) => {
    card.classList.toggle('is-cover', on)
    // the photograph grows by scale, from its frame (the top 60 %) to the whole card: transforms only (method.css)
    const pic = card.querySelector<HTMLElement>('.s-wed-ph picture')
    if (pic) fly(pic, { transform: on ? 'scale(1.6667)' : 'none' }, 1200, 0, instant)
    card.querySelectorAll<HTMLElement>('.m-scr > :not(picture):not(.s-wed-ph), .s-wed-nav').forEach((el) =>
      fly(el, { opacity: on ? '0' : '1', transform: on ? 'translateY(30%)' : 'translateY(0)' }, on ? 700 : 800, on ? 0 : 300, instant),
    )
    const cv = card.querySelector<HTMLElement>('.m-cv')
    if (!cv) return
    fly(cv, { opacity: on ? '1' : '0' }, 700, on ? 350 : 0, instant)
    ;[...cv.children].forEach((el, i) =>
      fly(el as HTMLElement, { opacity: on ? '1' : '0', transform: on ? 'translateY(0)' : 'translateY(30%)' }, 900, on ? 600 + i * 180 : 0, instant),
    )
  }

  // Back above the scene, the stage is no longer held (its section's top is below the screen's): the light going back slid down
  // with the scroll (owner, 2 Nov). While it goes the stage is held in place, fixed, then sticky again.
  let letGo = 0
  const holdWhileLeaving = (on: boolean) => {
    clearTimeout(letGo)
    // fixed exactly where it is (the change comes ~2 % of a screen below the top, the dead band)
    stage.style.top = on ? `${(Math.max(0, section.getBoundingClientRect().top) - lift).toFixed(1)}px` : ''
    section.classList.toggle('m-leaving', on)
    if (on)
      letGo = window.setTimeout(() => {
        section.classList.remove('m-leaving')
        stage.style.top = ''
      }, BACK_MS + 300)
  }

  // the words of 7 and 8: the two lines of the thesis, then the thesis stepping back and Make it yours coming forward. Before the
  // scene they wait unseen, so the light can find them; anywhere else they are simply in their final state
  const LINE_ON = { opacity: '1', transform: 'translateY(0)' }
  const LINE_OFF = { opacity: '0', transform: 'translateY(10px)' }
  const thesisOn = () => ({ opacity: String(DIM), transform: 'translateY(-6%) scale(0.86)' })
  const THESIS_OFF = { opacity: '1', transform: 'none' }
  const fieldOn = () => ({ opacity: '1', transform: 'translateY(0)' })
  const fieldOff = () => ({ opacity: '0', transform: 'translateY(10px)' })
  // the passage: each line as the light reaches it, then the thesis steps back and the invitation comes forward
  const wordsFound = (lineAt: number[]) => {
    lines.forEach((l, i) => fly(l, LINE_ON, 500, lineAt[i]))
    fly(thesis, thesisOn(), 700, ASK_AT)
    fly(field, fieldOn(), 600, ASK_AT + 150)
  }
  // anywhere else: set (at once, or after a delay, unseen under the head fading)
  const wordsSet = (on: boolean, delay = 0, instant = false) => {
    lines.forEach((l) => fly(l, on ? LINE_ON : LINE_OFF, 1, delay, instant))
    fly(thesis, on ? thesisOn() : THESIS_OFF, 1, delay, instant)
    fly(field, on ? fieldOn() : fieldOff(), 1, delay, instant)
  }
  // the caret waits in the field: it blinks a few seconds (4.2 s: nothing blinks on its own longer than 5 s), then stays still
  let blink: Animation | null = null
  const blinkCaret = (delay: number) => {
    blink?.cancel()
    // on 530 ms, off 530 ms, four times, then on: written as keyframes. A two-keyframe step easing with 'alternate' never showed
    // the off half (a step eases the directed progress: going back it stayed on), and the caret never blinked (owner, 3 Nov)
    blink =
      caret?.animate(
        [{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }],
        { duration: 1060, iterations: 4, delay },
      ) ?? null
  }

  // the light's spill on its moving edges (README #100): seen while it moves, gone when gathered (a sliver of it would stay on screen)
  const spill = (to: readonly [number, number], ms: number, easing: string, seen: string, fromAt?: readonly [number, number]) => {
    spillAnims.forEach((a) => a.cancel())
    spillAnims.length = 0
    const place = ([a, b]: readonly [number, number]) => [
      `translateX(${(a * W - 0.05 * W).toFixed(1)}px) skewX(-12deg)`,
      `translateX(${(b * W).toFixed(1)}px) skewX(-12deg)`,
    ]
    const toP = place(to)
    const fromP = fromAt ? place(fromAt) : null
    ;[spillL, spillR].forEach((el, i) => {
      if (!el) return
      const settle = () => {
        el.style.transform = toP[i]
        el.style.opacity = seen
      }
      if (!ms) return settle()
      const now = getComputedStyle(el)
      const tr = el.animate([{ transform: fromP ? fromP[i] : now.transform }, { transform: toP[i] }], { duration: ms, easing, fill: 'both' })
      // seen at once as it leaves, kept to its end, then as asked
      const op = el.animate([{ opacity: '1' }, { opacity: '1', offset: 0.97 }, { opacity: seen }], { duration: ms, fill: 'both' })
      spillAnims.push(tr, op)
      op.onfinish = () => {
        settle()
        tr.cancel()
        op.cancel()
      }
    })
  }
  // the three boxes of the light move together, on one timing and one easing, so the room never moves
  const blade = (to: readonly [number, number], ms: number, seen: string, easing: string, fromAt?: readonly [number, number]) => {
    const edgesOf = ([a, b]: readonly [number, number]) => [
      { transform: `translateX(${(a * W).toFixed(1)}px) skewX(-12deg)` },
      { transform: `translateX(${((b - a) * W - 3 * W).toFixed(1)}px)` },
      { transform: `translateX(${(3 * W - b * W).toFixed(1)}px) skewX(12deg)` },
    ]
    const [a, b, c] = edgesOf(to)
    const f = fromAt ? edgesOf(fromAt) : null
    const now = !ms
    fly(wipe, { ...a, opacity: seen === '0.001' ? '0.001' : '1' }, ms, 0, now, f ? { ...f[0], opacity: '1' } : undefined, easing)
    fly(wipeB, b, ms, 0, now, f?.[1], easing)
    fly(wipeIn, c, ms, 0, now, f?.[2], easing)
    spill(to, ms, easing, seen === '0.001' ? '0.001' : seen === 'open' ? '1' : '0', fromAt)
  }

  // the passage's end: until then a scroll onwards hurries it (HURRY_MS) and 8 waits. Hurried once, its end is fixed: hurried again
  // by every scroll event, a finger still moving (or iOS's momentum) pushed the end on and on, and the scene stood at 7 through the
  // whole Method (owner, iPhone, 3 Nov)
  let passageEnds = 0
  let hurried = false
  const hurry = () => {
    if (hurried) return
    hurried = true
    // the caret's few seconds start once the field is there (owner, 3 Nov: a finger still scrolling hurried the passage and the
    // caret never blinked)
    if (blink) blinkCaret(HURRY_MS)
    const all = [...flights.values(), ...spillAnims, ...(push ? [push] : [])]
    all.forEach((a) => {
      if (a.playState !== 'running' || a.playbackRate <= 0) return
      const endAt = Number(a.effect?.getComputedTiming().endTime ?? 0)
      const left = endAt - Number(a.currentTime ?? 0)
      if (left > HURRY_MS) a.updatePlaybackRate((a.playbackRate * left) / HURRY_MS)
    })
    passageEnds = Math.min(passageEnds, performance.now() + HURRY_MS)
  }

  // The page's edges (html, body, theme-color: what Safari shows around the Dynamic Island, Chrome's bar on Android), read by the entrance
  // script (README #103): the colour of what is really at the top of the screen, read from the picture drawn there (src/lib/top-colour.ts),
  // at the moment it is there. Fixed values measured in Chrome at 390 × 844 were wrong on the iPhone (its scenes 130 px taller, the studio
  // cut otherwise), and the 9's came before its picture (owner, iPhone, 4 Nov)
  let edgeLater = 0
  // only if a picture cannot be read: the values measured on 3 Nov (390 × 844)
  const FULL_EDGE: Record<string, string> = { weddings: '#a1b2bb', artists: '#a7a49c', experiences: '#191d24' }
  // the band the island sees, across its middle: elsewhere the screen's top; on iOS the 70 px above it (the lift), which in the studio
  // is its own top mirrored (method.css: .m-mirror), so the studio's first 70 px; the 9's photograph runs up there itself
  const band = (left: number, top: number, above = false) =>
    lift && !above
      ? { x0: W * 0.3 - left, x1: W * 0.7 - left, y0: -top, y1: lift - top }
      : { x0: W * 0.3 - left, x1: W * 0.7 - left, y0: -lift - top, y1: 4 - top }
  let roomImg: HTMLImageElement | null = null
  // the studio's top: its room as cover-drawn in the studio's box, and the hour's light (.m-key) over it at the top's middle
  const studioTop = (ph: Phase) => {
    const cs = getComputedStyle(section)
    const fallback = cs.getPropertyValue('--m-edge').trim()
    const room = roomImg ? bandColour(roomImg, { w: W, h: stage.offsetHeight - lift }, band(0, 0)) : null
    if (!room) return fallback
    const kc = parseColour(cs.getPropertyValue('--m-key'))
    if (!kc) return hex(room)
    const k = KEY_K[ph]
    const { side, high } = keyBase()
    const grow = (0.92 + 0.35 * k) / 0.92
    let d: number
    if (kind === 'phone') {
      const kx = Math.min(80, Math.max(20, side))
      const r = ((1.5 * 0.92 * F) / 2) * grow
      const cx = ox + (kx * F) / 100 + (((50 - kx) * k * 0.55) / 100) * F
      const cy = 0.22 * H + 0.3 * k * H
      d = Math.hypot(W / 2 - cx, (lift ? lift / 2 : 8) - cy) / r
    } else {
      const rx = ((1.1 * 0.92 * W) / 2) * grow
      const ry = ((1.4 * 0.92 * H) / 2) * grow
      const cx = (side * W) / 100 + (((50 - side) * k * 0.6) / 100) * W
      const cy = (high * H) / 100 + (12.8 * k * H) / 100
      d = Math.hypot((W / 2 - cx) / rx, ((lift ? lift / 2 : 8) - cy) / ry)
    }
    // closest-side, the light's colour to transparent at 72 %; at the light's own opacity now (it goes out at 11, comes back from it)
    const a = kc[3] * Math.max(0, 1 - d / 0.72) * (parseFloat(getComputedStyle(key).opacity) || 0)
    return hex(over(room, [kc[0], kc[1], kc[2]], a))
  }
  // the dark of 11 (.m-end and its .m-dark) over the studio, at its opacity now: it comes in over 1.8 s and goes in 0.7 s back, and the
  // edge set to it at once was dark over the still-lit studio for a second and a half (audit, 390 × 844, 4 Nov)
  const DARK_11: [number, number, number] = [23, 24, 22]
  const studioOrDark = (ph: Phase) => {
    const base = studioTop(ph)
    const a = parseFloat(getComputedStyle(end).opacity) || 0
    if (a >= 0.99) return hex(DARK_11)
    const b = parseColour(base)
    return a <= 0.01 || !b ? base : hex(over([b[0], b[1], b[2]], DARK_11, a))
  }
  // 9 on a phone: the featured screen to the edges — its own photograph at the top, or its ground where it has none
  const featuredTop = () => {
    const card = cards[featured]
    if (!card) return ''
    for (const img of card.querySelectorAll<HTMLImageElement>('img')) {
      const r = img.getBoundingClientRect()
      if (r.left > W / 2 || r.right < W / 2 || r.top > 1 || r.bottom < 4) continue
      const [px, py] = getComputedStyle(img)
        .objectPosition.split(' ')
        .map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5))
      const c = bandColour(img, { w: r.width, h: r.height }, band(r.left, r.top, true), 'cover', [px, py])
      if (c) return hex(c)
    }
    const ground = getComputedStyle(card.querySelector('.m-scr') ?? card).backgroundColor
    return ground && !ground.startsWith('rgba(0, 0, 0, 0') ? ground : (FULL_EDGE[card.dataset.chapter ?? ''] ?? '')
  }
  const edgeOf = (ph: Phase) =>
    ph === 'pre' ? '' : ph === '9' && kind === 'phone' ? featuredTop() : studioOrDark(ph)
  // followed for a while where what is at the top changes slowly (the dark of 11, the light going out): read again every 100 ms
  let edgeFollow = 0
  const setEdge = (ph: Phase, delay = 0, follow = 0) => {
    clearTimeout(edgeLater)
    clearInterval(edgeFollow)
    edgeLater = 0
    const put = () => {
      const v = edgeOf(ph)
      if (v) section.dataset.edge = v
      else delete section.dataset.edge
    }
    const go = () => {
      edgeLater = 0
      put()
      if (!follow) return
      const until = performance.now() + follow
      edgeFollow = window.setInterval(() => {
        put()
        if (performance.now() > until) clearInterval(edgeFollow)
      }, 100)
    }
    if (delay) edgeLater = window.setTimeout(go, delay)
    else go()
  }

  const show = (next: Phase, instant = false) => {
    holdWhileLeaving(next === 'pre' && phase !== null && phase !== 'pre' && !instant)
    batch(() => showNow(next, instant))
  }
  const showNow = (next: Phase, instant = false) => {
    const from = phase
    phase = next
    section.dataset.phase = next
    section.dataset.lum = lumOf(next)
    // the passage, and its way back (README #102)
    const passage = from === 'pre' && next === '7' && !instant
    const goingBack = next === 'pre' && from !== null && from !== 'pre' && !instant
    const n = cards.length
    cards.forEach((card, i) => {
      const L = layout(kind, next, i, n, featured)
      card.style.zIndex = String(L.z)
      card.classList.toggle('is-full', !!L.full)
      // the whole screen: from the top, as tall as the screen with the bars away
      const pos: Pos = L.full ? [L.pos[0], (100 * ((LVH + lift) / 2 - lift)) / H, L.pos[2], L.pos[3]] : L.pos
      const to = { transform: cardTransform(card, pos, !!L.full), opacity: String(L.o) }
      // the light finds each screen in its place once it has passed the whole of it (never seen over what is still unlit); going
      // back, each is gone before the edge uncovers its first corner
      if (passage) fly(card, to, 350, Math.max(...cornersOf(L.pos).map(([x, y]) => reachAt(x, y))))
      else if (goingBack) fly(card, to, 180, Math.max(0, Math.min(...cornersOf(L.pos).map(([x, y]) => leaveAt(x, y))) - 200))
      // the cover leaving at 11 goes quicker than the sentence comes (1.8 s): their words never read over each other (390 × 844, 3 Nov)
      else fly(card, to, next === '11' && L.cover ? 550 : MOVE, 0, instant)
      const sheet = card.querySelector<HTMLElement>('.m-sheet')
      const sh = L.mode === 'lift' ? LIFT[kind] : SHEET[L.mode]
      if (sheet) fly(sheet, { transform: sh.transform, opacity: String(sh.opacity) }, 1000, 0, instant || passage || goingBack)
      if (!!L.cover !== card.classList.contains('is-cover')) becomeCover(card, !!L.cover, instant)
    })
    const lit = next !== 'pre'
    // The light (README #102): before the scene it waits open at 0.1 %, so the room is painted ahead (the Xiaomi otherwise painted
    // it as the light came, 78–100 ms); it comes from the hour's side, gathered there, and goes back to it
    fly(studio, { opacity: '1' }, 0, 0, true)
    const state = next === 'pre' ? (from === null || bladeAt === 'ahead' ? 'ahead' : 'shut') : 'open'
    if (instant || from === null) blade(state === 'shut' ? gatheredAt() : OPEN(), 0, state === 'ahead' ? '0.001' : state, SWEEP_EASE)
    else if (state !== bladeAt) {
      if (state === 'open') blade(OPEN(), SWEEP_MS, 'open', SWEEP_EASE, gatheredAt())
      else blade(gatheredAt(), BACK_MS, 'shut', IN_OUT)
    }
    bladeAt = state
    // The edges (one colour, Safari's status area around the Dynamic Island): they change as the light's edge passes the island, the
    // middle of the screen's top, in a short cross-fade centred there (EDGE_FADE, entrance/sequence.ts) — at the end of the sweep they
    // came late, the island dark beside the lit studio (owner, iPhone, 3 Nov). Back, as the edge leaves it.
    const island = (t: number) => Math.max(0, t - EDGE_FADE / 2)
    // the whole screen of 9 reaches the top only as its flight ends: its colour then, not before its picture is there (owner, iPhone, 4 Nov)
    const landing = next === '9' && kind === 'phone' && !instant ? MOVE + 60 : 0
    // and then followed while the light (1.6 s) and the dark of 11 (1.8 s) settle: set once, the edge kept the light as it was at that
    // moment, and changed again when something else read it (owner, iPhone, 4 Nov: "a cor de cima da ilha muda e fica errada")
    const settling = instant || goingBack || landing ? 0 : 1900
    // On the iPhone the held studio is drawn behind the island and under the bar itself (method.css, the iOS block): the edges' colour
    // shows only where the light has not come yet, over the Work, cut there. Changed as the light passed the middle, the whole strip
    // went beige over the dark Work while the light was still crossing (owner, iPhone, 7 Nov; Simulator, magenta: the unlit side is
    // html's colour, the lit side the studio). So on the way in: the Work's colour until the light covers both strips to their corners.
    // On the way back the stage is fixed while the light closes (holdWhileLeaving), and Safari draws nothing fixed behind the island:
    // the top strip is one colour again, so it changes as the light leaves the island, as before (Simulator, magenta, 7 Nov).
    const corners = [reachAt(0, 0), reachAt(W, 0), reachAt(0, H), reachAt(W, H)]
    const passed = reaches ? Math.max(...corners) : island(reachAt(W / 2, 0))
    setEdge(next, passage ? passed : goingBack ? island(leaveAt(W / 2, 0)) : landing, settling)
    // the photograph moves in with the light, and back out with it
    if (passage) pushPhoto(true)
    else if (goingBack) pushPhoto(false)
    // the night under the light: only once it covers the screen (Experiences stays seen until the light reaches it); off at once back
    fly(night, { opacity: lit ? '1' : '0' }, 1, passage ? SWEEP_MS : 0, instant || (!passage && !lit))
    fly(key, { transform: keyTransform(KEY_K[next]), opacity: lit && next !== '11' ? '1' : '0' }, 1600, 0, instant)
    // the words: found by the light, then the invitation; elsewhere simply there (7, 8) or not
    const said = next === '7' || next.startsWith('8')
    if (passage) {
      fly(head, { opacity: '1' }, 0, 0, true)
      wordsFound(lines.map((l) => reachAt(...midOf(l))))
      blinkCaret(ASK_AT + 750)
      passageEnds = performance.now() + ASK_AT + 750
      hurried = false
    } else if (goingBack) {
      fly(head, { opacity: '0' }, 400)
      // put back unseen once gone, ready for the light to find them again
      wordsSet(false, 400)
      blink?.cancel()
    } else {
      fly(head, { opacity: said ? '1' : '0' }, 1000, 0, instant)
      if (said) wordsSet(true, 0, true)
      // the field coming back into view (back from 9, or arriving there): the caret blinks its few seconds again
      const wasSaid = from === '7' || !!from?.startsWith('8')
      if (said && !wasSaid) blinkCaret(instant ? 0 : 900)
      else if (next === 'pre') wordsSet(false, 0, true)
    }
    fly(
      cover,
      {
        transform: `translate(-50%, -50%) scale(${next === '10' ? 1 : next === '11' ? 0.2 : 0.86})`,
        opacity: next === '10' ? '1' : '0',
      },
      1000,
      0,
      instant,
    )
    fly(end, { opacity: next === '11' ? '1' : '0' }, next === '11' ? 1800 : 700, 0, instant)
  }

  // the phase under the scroll, with the dead band; the passage is played whole, or hurried, before 8 may answer
  let wake = 0
  const later = (ms: number) => {
    clearTimeout(wake)
    wake = window.setTimeout(choose, Math.max(0, ms))
  }
  // the scene's own scroll: from LEAD screens into the section to its end
  // read from the bar's mark, which method.css places LEAD screens in (the CSS screen, which on a phone is not innerHeight)
  const mark = section.querySelector<HTMLElement>('.m-start')
  const lead = () => mark?.offsetTop ?? LEAD * H
  const sceneTop = () => section.getBoundingClientRect().top + lead()
  const sceneTravel = () => section.offsetHeight - (stage.offsetHeight - lift) - lead()
  const starts = () => (kind === 'phone' ? STARTS_PHONE : STARTS)
  const choose = (): void => {
    const STARTS = starts()
    const top = sceneTop()
    if (top > 0) {
      if (phase === null || (phase !== 'pre' && top > H * 0.02)) show('pre', phase === null)
      return
    }
    const travel = sceneTravel()
    const p = Math.min(1, -top / travel)
    const order = PHASES.slice(1) as Exclude<Phase, 'pre'>[]
    let at: Exclude<Phase, 'pre'> = '7'
    order.forEach((ph) => p >= STARTS[ph] && (at = ph))
    if (phase === null) return show(at, true)
    if (phase === 'pre') {
      measure()
      show('7')
      // reached by the keyboard (the field focused from above): the field is there at once, not after the light
      if (document.activeElement === section.querySelector('#m-name')) hurry()
      if (at !== '7') later(passageEnds - performance.now())
      return
    }
    const cur = order.indexOf(phase as Exclude<Phase, 'pre'>)
    const nxt = order.indexOf(at)
    if (nxt > cur) {
      if (phase === '7' && performance.now() < passageEnds) {
        hurry()
        return later(passageEnds - performance.now() + 20)
      }
      let far = cur
      order.forEach((ph, i) => i > cur && p >= STARTS[ph] + BAND && (far = i))
      if (far !== cur) show(order[far])
    } else if (nxt < cur && p < STARTS[order[cur]] - BAND) show(at)
  }

  // The first lights-on decoded the studio and every card's photograph in one frame: 182 ms on the Xiaomi (2 Nov). They are
  // decoded ahead, once, while the Method is still a screen away (the photographs are lazy: they are asked for here).
  const ahead = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      ahead.disconnect()
      const light = document.documentElement.dataset.light ?? 'day'
      const room = new Image()
      room.src = `/media/v5/method/room-${light}-${kind === 'phone' ? 'tall' : 'wide'}.${light === 'night' ? 'png' : 'avif'}`
      room
        .decode()
        .then(() => {
          // the studio's colour can now be read from its own picture
          roomImg = room
          // not over an edge still to come (the passage's, as the light reaches the island)
          if (phase && phase !== 'pre' && phase !== '11' && !edgeLater) setEdge(phase)
        })
        .catch(() => {})
      cards.forEach((card) =>
        card.querySelectorAll('img').forEach((img) => {
          img.loading = 'eager'
          img.decode().catch(() => {})
        }),
      )
    },
    { rootMargin: '100% 0px' },
  )
  ahead.observe(section)
  cleanups.push(() => ahead.disconnect())

  measure()
  placeKey()
  section.classList.add('m-live')
  choose()
  const onScroll = () => choose()
  addEventListener('scroll', onScroll, { passive: true })
  cleanups.push(() => removeEventListener('scroll', onScroll))
  // a real change of size measures again and puts everything in place at once (the address bar alone does not)
  let sized = `${innerWidth}`
  const onResize = () => {
    if (`${innerWidth}` === sized && Math.abs(window.innerHeight - H) < 120) return
    sized = `${innerWidth}`
    measure()
    placeKey()
    if (phase) show(phase, true)
  }
  addEventListener('resize', onResize)
  cleanups.push(() => removeEventListener('resize', onResize))
  // the keyboard: the field lives in 7–8, Talk to us in 11; reaching either elsewhere brings its phase
  // on the next frame: the browser scrolls the focused element into view after the focus event, and undid this
  // (measured: the field focused from 11 stayed on 11)
  const to = (share: number) =>
    requestAnimationFrame(() => {
      scrollTo({ top: sceneTop() + scrollY + share * sceneTravel(), behavior: 'auto' })
    })
  const input = section.querySelector('#m-name')
  const onField = () => phase !== '7' && !phase?.startsWith('8') && to(starts()['7'] + 0.05)
  const onEnd = () => phase !== '11' && to(starts()['11'] + 0.08)
  input?.addEventListener('focus', onField)
  end.addEventListener('focusin', onEnd)
  cleanups.push(() => {
    input?.removeEventListener('focus', onField)
    end.removeEventListener('focusin', onEnd)
  })

  return () => {
    clearTimeout(wake)
    clearTimeout(letGo)
    clearTimeout(edgeLater)
    clearInterval(edgeFollow)
    delete section.dataset.edge
    cleanups.forEach((c) => c())
    flights.forEach((a) => a.cancel())
    spillAnims.forEach((a) => a.cancel())
    blink?.cancel()
    push?.cancel()
    section.classList.remove('m-live')
  }
}
