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
import { fingerDown, strokeLately, watchFinger } from '@/lib/finger'
import { bandColour, hex, over, parseColour } from '@/lib/top-colour'
import { unsnapped } from '@/lib/unsnapped'

type Pos = readonly [number, number, number, number]
type Mode = 'on' | 'lift' | 'gone'
type Layout = { pos: Pos; o: number; z: number; mode: Mode; full?: boolean; cover?: boolean }

export const PHASES = ['pre', '7', '8a', '8b', '8c', '9', '10', '11'] as const
export type Phase = (typeof PHASES)[number]
// where each phase starts, as a share of the held scroll (5.6 screens): 7 the moment the stage is held (README #102: one trigger).
// In screens: 8a 1.15, 8b 1.6, 8c 2.05, 9 2.6, 10 3.25, 11 3.9 (owner, 2 Nov: from 7 to 11 no longer than this). 8a at 0.6 was tried
// and turned back (owner, desktop, 3 Nov). A scroll ran on through 11 (and 10) into the About (owner, 7 Nov): the scroll now stops at each
// phase (method.css); lengthened instead (5.6), the marks lay more than a screen apart and a trackpad stroke was pulled back
const DESK_SCENE = 4.7
const STARTS: Record<Exclude<Phase, 'pre'>, number> = {
  '7': 0,
  '8a': 1.15 / DESK_SCENE,
  '8b': 1.6 / DESK_SCENE,
  '8c': 2.05 / DESK_SCENE,
  '9': 2.6 / DESK_SCENE,
  '10': 3.25 / DESK_SCENE,
  '11': 3.9 / DESK_SCENE,
}
// On a phone (scene 7.8 screens, method.css): ~1.1 screen a step, and the scroll stops at each phase (the snap marks below). At ~0.8
// screen (3 Nov) a quick stroke still ran through phases, and the scene moved too fast (owner, iPhone, 7 Nov: "às vezes até passo setores
// sem querer"). In screens: 8a 1.5, 8b 2.6, 8c 3.7, 9 4.8, 10 5.9, 11 7.0
const PHONE_SCENE = 7.8
const STARTS_PHONE: Record<Exclude<Phase, 'pre'>, number> = {
  '7': 0,
  '8a': 1.5 / PHONE_SCENE,
  '8b': 2.6 / PHONE_SCENE,
  '8c': 3.7 / PHONE_SCENE,
  '9': 4.8 / PHONE_SCENE,
  '10': 5.9 / PHONE_SCENE,
  '11': 7.0 / PHONE_SCENE,
}
// and every animation a quarter slower on a phone (the same owner's note): durations and delays, and the timers tied to them
const PHONE_TEMPO = 1.25
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
  let FULL = 1
  let LVH = 0
  let lift = 0
  let tempo = 1
  // The scroll stops at each phase as a stroke ends, on a phone and a desktop (scroll-snap-stop, method.css): one mark a phase, placed just past its
  // start and the dead band, so where the scroll rests is that phase. Native: the compositor stops the fling, no script in the scroll
  let marks: HTMLElement[] = []
  // a phone: where the mark of Experiences lies above the scene (as placed), and a stroke back from the scene still moving
  let outAt = 0
  let backing = false
  // a stroke carried past 7 during this passage, taken back
  let pulled = false
  // iOS: the held stage is drawn behind Safari's island and under its bar (method.css, the iOS block), so the edges' colour shows there
  // only over the Work, where the light has not come yet (setEdge's moments below)
  let reaches = false
  let seenLater = 0
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
    const a = el.animate([f.from ?? {}, to], { duration: duration * tempo, delay: delay * tempo, easing: f.easing ?? EASE, fill: 'both' })
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
    tempo = kind === 'phone' ? PHONE_TEMPO : 1
    LVH = Math.max(H, stage.offsetHeight - lift)
    // the cards in the stage's shape, as before; the whole screen of 9 fills it (README #101, #103). A 9 : 16 card was tried and turned back
    // (owner, iPhone, 3 Nov: too short)
    AR = kind === 'phone' ? Math.min(9 / 16, Math.max(9 / 23, W / LVH)) : 9 / 19.5
    // The whole screen of 9 runs up behind Safari's island too (iOS): the card in its own shape, grown evenly to the screen's height and
    // the lift (~8 %, its sides past the screen's). In the screen's and the lift's own shape it was 70 px taller than the card of 10, a
    // layout: at 9 → 10 the card, its photograph and its cream panel jumped 70 px in the first frame, then a ~100 ms frame, then the move
    // (owner's iPhone, 12 Nov 23:51: "a animação para o your first chapter parece estar a dar um salto"; Simulator, 13 Nov)
    FULL = kind === 'phone' && lift ? ((LVH + lift) * AR) / F : 1
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
  const cardTransform = (card: HTMLElement, [x, y, w, r]: Pos) => {
    const bw = (Number(card.dataset.bw) * F) / 100
    const bh = bw / AR
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
  // when the light has passed the whole of a line of words (its text, not its box, which is as wide as the screen): found at its
  // middle, half the line came over the still dark Work ahead of the edge (owner's iPhone, 8 Nov: "No templates" read on the dark)
  const passedAll = (el: HTMLElement) => {
    const range = document.createRange()
    range.selectNodeContents(el)
    const r = range.getBoundingClientRect()
    const s = stage.getBoundingClientRect()
    // of the screen: on iOS the stage's top is 70 px above it (the lift)
    const x0 = r.left - s.left
    const x1 = r.right - s.left
    const y0 = r.top - s.top - lift
    const y1 = r.bottom - s.top - lift
    return Math.max(reachAt(x0, y0), reachAt(x1, y0), reachAt(x0, y1), reachAt(x1, y1))
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
      push = ph.animate([{ transform: from || 'none' }, { transform: `${from} scale(${PUSH})` }], { duration: PUSH_MS * tempo, easing: IN_OUT, fill: 'both' })
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
      }, (BACK_MS + 400) * tempo)
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
    // a little past the whole card (1 / 0.6 = 1.6667 exactly left the card's cream showing as a light line at its foot on a desktop,
    // owner, 7 Nov): the card clips the rest
    if (pic) fly(pic, { transform: on ? 'scale(1.68)' : 'none' }, 1200, 0, instant)
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
  // A desktop holds it only once the stage would really move: until the section's top comes near the screen's, the stage is held by
  // its sticky place (the same pixel). Fixed at once, each change of 7 and the way back was a layout, and in Safari a layout between a
  // stroke's end and its momentum put the page back on the mark the stroke began from (WebKit's resnap): from Experiences the page
  // shook between it and 7 and stayed (Safari 27.2, real trackpad, 12 Nov). Fixed later, the page is leaving the scene, with the stop off
  let holdLater = false
  const fixStage = () => {
    // fixed exactly where it is (the change comes ~2 % of a screen below the top, the dead band)
    stage.style.top = `${(Math.max(0, section.getBoundingClientRect().top) - lift).toFixed(1)}px`
    section.classList.add('m-leaving')
  }
  const holdWhileLeaving = (on: boolean) => {
    clearTimeout(letGo)
    holdLater = false
    if (!on) {
      if (section.classList.contains('m-leaving')) section.classList.remove('m-leaving')
      if (stage.style.top) stage.style.top = ''
      return
    }
    if (kind === 'desk' && section.getBoundingClientRect().top < -0.15 * H) holdLater = true
    else fixStage()
    letGo = window.setTimeout(() => holdWhileLeaving(false), (BACK_MS + 300) * tempo)
  }
  const holdIfMoving = () => {
    if (holdLater && section.getBoundingClientRect().top >= -0.15 * H) {
      holdLater = false
      fixStage()
    }
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
        { duration: 1060, iterations: 4, delay: delay * tempo },
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
      const tr = el.animate([{ transform: fromP ? fromP[i] : now.transform }, { transform: toP[i] }], { duration: ms * tempo, easing, fill: 'both' })
      // seen at once as it leaves, kept to its end, then as asked
      const op = el.animate([{ opacity: '1' }, { opacity: '1', offset: 0.97 }, { opacity: seen }], { duration: ms * tempo, fill: 'both' })
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
  let passageHold = 0
  // the hold let go: the page first on 7's mark, if a stroke's momentum left it elsewhere within 7 (iOS carried on after the pull back,
  // and the stop then took the page to 8a's mark, the nearer, Simulator, 8 Nov); with a finger on the screen, its stroke decides. By then
  // (2.3 s) the momentum is over
  const endHold = () => {
    const at7 = marks[0]?.getBoundingClientRect().top ?? 0
    if (phase === '7' && !fingerDown() && !jumping() && strokeLately(4000) && Math.abs(at7) > 2) scrollTo({ top: scrollY + at7, behavior: 'instant' })
    delete section.dataset.passage
  }
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
      const until = performance.now() + follow * tempo
      edgeFollow = window.setInterval(() => {
        put()
        if (performance.now() > until) clearInterval(edgeFollow)
      }, 100)
    }
    if (delay) edgeLater = window.setTimeout(go, delay * tempo)
    else go()
  }

  const show = (next: Phase, instant = false) => {
    holdWhileLeaving(next === 'pre' && phase !== null && phase !== 'pre' && !instant)
    batch(() => showNow(next, instant))
    // put in place at once (a jump, a refresh): what is at the top is read once the flights have settled. Read inside, before them, it was
    // the phase it left — the dark of 11 over a lit 7, after the menu from the About or the Questions (Simulator, 13 Nov)
    if (instant) setEdge(next)
  }
  const showNow = (next: Phase, instant = false) => {
    const from = phase
    phase = next
    section.dataset.phase = next
    section.dataset.lum = lumOf(next)
    // the passage, and its way back (README #102)
    const passage = from === 'pre' && next === '7' && !instant
    const goingBack = next === 'pre' && from !== null && from !== 'pre' && !instant
    // for the bar's words (bar-client.tsx): the Method is seen once the light has crossed the middle of the screen's top, and until it
    // leaves it going back — at phase 7 alone the bar said 02 Method over the whole Work for half a second (Simulator, 7 Nov)
    clearTimeout(seenLater)
    if (passage) seenLater = window.setTimeout(() => (section.dataset.seen = ''), reachAt(W / 2, 0) * tempo)
    else if (goingBack) seenLater = window.setTimeout(() => delete section.dataset.seen, leaveAt(W / 2, 0) * tempo)
    else if (next === 'pre') delete section.dataset.seen
    else section.dataset.seen = ''
    const n = cards.length
    cards.forEach((card, i) => {
      const L = layout(kind, next, i, n, featured)
      card.style.zIndex = String(L.z)
      // The whole screen's words at the top of the cream panel, clear of the bar (method.css .is-full): on at once (the first line stays
      // where it is), and off at 9 → 10 only once they have faded (becomeCover), so they never jump where they are seen
      clearTimeout(Number(card.dataset.fullOff) || 0)
      if (L.full) card.classList.add('is-full')
      else if (card.classList.contains('is-full')) {
        if (next === '10' && !instant) card.dataset.fullOff = String(window.setTimeout(() => card.classList.remove('is-full'), 420 * tempo))
        else card.classList.remove('is-full')
      }
      // and its menu comes down, clear of the island and the bar's islands (15cqw, and on iOS the lift): moved with the card, its words
      // one by one (the menu itself fades with the cover, becomeCover). Placed by the class, it jumped 53 px in the first frame of 8c → 9,
      // its words fully seen (Simulator, 13 Nov)
      const nav = card.querySelector<HTMLElement>('.s-wed-nav')
      if (nav && (card.dataset.navDown === '1') !== !!L.full) {
        card.dataset.navDown = L.full ? '1' : '0'
        const down = L.full ? 0.15 * card.offsetWidth + lift : 0
        nav.querySelectorAll<HTMLElement>(':scope > span').forEach((w) => fly(w, { translate: `0 ${down.toFixed(1)}px` }, MOVE, 0, instant))
      }
      // the whole screen: from the top, as tall as the screen with the bars away (grown evenly, FULL)
      const pos: Pos = L.full ? [L.pos[0], (100 * ((LVH + lift) / 2 - lift)) / H, L.pos[2] * FULL, L.pos[3]] : L.pos
      const to = { transform: cardTransform(card, pos), opacity: String(L.o) }
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
      // from its gathered place; or, turned back while still closing, from where it is: from the gathered place it jumped (Simulator,
      // a stroke down 0.1 s after a stroke up, 8 Nov)
      if (state === 'open') blade(OPEN(), SWEEP_MS, 'open', SWEEP_EASE, flights.has(wipe) ? undefined : gatheredAt())
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
    clearTimeout(passageHold)
    if (!passage) delete section.dataset.passage
    if (passage) {
      fly(head, { opacity: '1' }, 0, 0, true)
      wordsFound(lines.map(passedAll))
      blinkCaret(ASK_AT + 750)
      passageEnds = performance.now() + (ASK_AT + 750) * tempo
      hurried = false
      pulled = false
    } else if (goingBack) {
      fly(head, { opacity: '0' }, 400)
      // put back unseen once gone, ready for the light to find them again
      wordsSet(false, 400)
      blink?.cancel()
    } else {
      const wasSaid = from === '7' || !!from?.startsWith('8')
      // leaving the words for 9 they go before the featured screen grows over them (a quarter of a second; it reaches the field in
      // under 0.2 s), and under it (method.css): in a second, over the screen, they stayed as ghosts on its photograph (owner, 6 Nov,
      // bug 3; Simulator and Xiaomi, 7 Nov)
      fly(head, { opacity: said ? '1' : '0' }, wasSaid && !said ? 250 : 1000, 0, instant)
      if (said) wordsSet(true, 0, true)
      // the field coming back into view (back from 9, or arriving there): the caret blinks its few seconds again
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
  const placeMarks = () => {
    const travel = sceneTravel()
    const at = starts()
    // the phases, and the way out above: Experiences again, a third of a screen before the scene on a phone (where a stroke back comes to rest)
    // a desktop: each mark within its phase so that the marks lie at most 0.8 screen apart (10 → 11 at 0.9 held a 400 px stroke). Just past each start,
    // 7 and 8a were a screen apart, and a trackpad stroke under half of it was pulled back to 7 (Chrome, 450 px strokes, 7 Nov)
    // Each past its phase's start and the dead band (STARTS + BAND, choose): 8a's at 1.25 lay 16 px short of it, and a page resting
    // there stayed on 7 — a stroke during the light's passage, or a slow one, came to rest on 8a's mark with 7 still on stage, and the
    // next went on to 8b (Chrome and Safari, real trackpad, 3 of 3, 12 Nov: the "7 → 7 → 8b" of 11 Nov)
    const DESK_MARKS = [0.45, 1.3, 1.825, 2.325, 2.9, 3.5, 4.1].map((s) => s / DESK_SCENE)
    const shares = kind === 'phone' ? Object.values(at).map((share) => share + BAND * 1.6) : DESK_MARKS
    // Experiences' mark on a desktop just before the scene (0.05 screen), the same picture as at 0.3 (the stage is held through the lead:
    // screenshots identical): 7 comes in a stroke's first 50 px, while the finger is still on. At 0.3 it came 285 px on, where a stroke
    // of 300–360 px ends, and Safari, laying out the change between the finger's end and the momentum, put the page back on the mark the
    // stroke began from (WebKit's resnap after layout): Experiences again, 3 of 3 (Safari 27.2, real trackpad, 12 Nov)
    const out = kind === 'phone' ? 0.3 : 0.05
    const tops = [...shares.map((share) => lead() + share * travel), lead() - out * H]
    tops.forEach((y, i) => {
      let m = marks[i]
      if (!m) {
        m = document.createElement('div')
        m.className = 'm-snap'
        m.setAttribute('aria-hidden', 'true')
        section.append(m)
        marks[i] = m
      }
      const top = `${Math.round(y)}px`
      if (m.style.top !== top) m.style.top = top
      // which is which, for the hold of the passage (method.css): 7 and the way out stay while the light crosses
      m.dataset.at = i === 0 ? '7' : i === tops.length - 1 ? 'out' : ''
    })
    outAt = out * H
  }
  // a jump of the site's own (lib/address.ts marks it, lib/unsnapped.ts turns the stop off for it): never taken for a stroke
  const jumping = () => document.documentElement.dataset.jump !== undefined || document.documentElement.style.scrollSnapType === 'none'
  // the jump itself, for a moment (lib/address.ts, work-client.tsx land: data-jump, 600 ms): the snapping stays off longer, and a stroke in
  // that time is the visitor's
  const leap = () => document.documentElement.dataset.jump !== undefined
  const choose = (): void => {
    const STARTS = starts()
    const top = sceneTop()
    // the scene just below: the stop-at-each-phase is on already (method.css), so a stroke from Experiences rests on 7. Turned
    // on only at 7, a stroke ran through it to 8a and the light's passage was cut (Xiaomi, CDP strokes, 7 Nov)
    // A phone: between the mark of Experiences and the scene (just short of the mark, outAt), and while a stroke back from the scene is still
    // moving (so it rests on that mark, not in the Work); off once it rests, so the next stroke up is free. Kept on at the mark itself (0.7
    // screen, ad808d9, and while the light closed) it was the only mark in reach and the page stuck at Experiences (owner's iPhone, 7 and
    // 8 Nov). Turned off by the finger as it took the page up, iOS missed the change 2 times in 6 (Simulator, 8 Nov): at rest it is off.
    // A quick stroke from there, the stop turned on only as it flies by, may run past 7: it is taken back (below, the passage's hold).
    // A desktop as approved (addc06d, 8 Nov), and on from the mark of Experiences itself, so a stroke from there starts with the stop on:
    // turned on in its flight (0.2 screen into it), Safari took the page back to that mark, again and again — from the Work, strokes
    // of 200–450 px stayed at Experiences, and the menu's 02 Method landed there for good (Safari 27.2, real trackpad, 12 Nov); with
    // that mark put out of reach it ran past 7 to 8a. A stroke up from the mark turns it off at once and goes on into the Work, free.
    // Kept on in the scene too: taken off as 7 came, in the stroke's first 0.33 s, Safari took the page from 7 back to Experiences in one
    // frame, 2 times in 4 (the marks had not moved)
    if (top <= 0 || top > 0.7 * H) backing = false
    const near = kind === 'phone' ? top > 0 && (top < outAt - 12 || backing) : top <= outAt + 3
    if (near !== 'near' in section.dataset) {
      if (near) section.dataset.near = ''
      else delete section.dataset.near
    }
    if (top > 0) {
      if (phase === null || (phase !== 'pre' && top > H * 0.02)) {
        if (phase !== null && kind === 'phone' && !jumping()) {
          backing = true
          section.dataset.near = ''
        }
        show('pre', phase === null || leap())
      }
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
      // a jump of the site's own (the menu, an address) lands with the scene in place: nothing built while it is watched (owner, 13 Nov:
      // "deve apenas navegar para a zona da página sem mais nada a construir" — the light swept the studio after the menu had gone)
      if (leap()) return show(at, true)
      show('7')
      // reached by the keyboard (the field focused from above): the field is there at once, not after the light
      if (document.activeElement === section.querySelector('#m-name')) hurry()
      // On a phone a stroke onwards while the light crosses rests on 7 again (method.css: only the marks of 7 and Experiences are there
      // meanwhile): the light is never cut. Hurried, it went to 8a in 0.3 s (owner's iPhone, 8 Nov, bug B); waited for, 8a came seconds
      // after the stroke, by itself, with the page already a phase on (addc06d: "partido", owner, 8 Nov). From the thesis stepping back,
      // a stroke goes on, hurrying the rest (the field coming forward). Only when the page is at 7: set for a jump or Safari putting the
      // place back on a reload (landing past 7), even for a moment, the browser took the page to 7's mark, the only one left (Simulator, 8 Nov)
      if (at === '7' && kind === 'phone') {
        section.dataset.passage = ''
        passageHold = window.setTimeout(endHold, ASK_AT * tempo)
      }
      if (at !== '7') later(passageEnds - performance.now())
      return
    }
    const cur = order.indexOf(phase as Exclude<Phase, 'pre'>)
    const nxt = order.indexOf(at)
    if (nxt > cur) {
      // the passage is played whole: 8 answers once it has ended. Hurried by a scroll onwards (0.3 s, 3 Nov), the light was cut and 8a came
      // at once — with the stop at each phase a stroke onwards is not a wish to skip it (owner, iPhone, 7 Nov). The keyboard still hurries it
      // carried past 7 while the light crosses (a quick stroke from the Work, its stop turned on only as it flew by): back to 7's mark once
      // the finger is off, unseen under the held stage; iOS's momentum may carry on from there (it does, Simulator, 8 Nov), so the hold's
      // end takes it to 7's mark again (endHold) — left there, the page went on to 8a by itself as the hold ended
      if (phase === '7' && kind === 'phone' && 'passage' in section.dataset && !pulled && !jumping() && !fingerDown() && strokeLately() && marks[0]) {
        // once a passage: a later stroke the finger begins during iOS's momentum is not told to the page (no touchstart), and taken back
        // again and again it fought the finger (Simulator, 8 Nov)
        pulled = true
        scrollTo({ top: scrollY + marks[0].getBoundingClientRect().top, behavior: 'instant' })
        return
      }
      if (phase === '7' && performance.now() < passageEnds) {
        // a phone hurries what is left once the light has crossed (data-passage gone): until then the stroke rests on 7 again
        if (kind === 'phone' && !('passage' in section.dataset)) hurry()
        return later(passageEnds - performance.now() + 20)
      }
      let far = cur
      order.forEach((ph, i) => i > cur && p >= STARTS[ph] + BAND && (far = i))
      if (far !== cur) show(order[far], leap())
    } else if (nxt < cur && p < STARTS[order[cur]] - BAND) show(at, leap())
  }

  // The first lights-on decoded the studio and every card's photograph in one frame: 182 ms on the Xiaomi (2 Nov). They are
  // decoded ahead, once, while the Method is still a screen away (the photographs are lazy: they are asked for here).
  const ahead = new IntersectionObserver(
    (es) => {
      if (!es[es.length - 1].isIntersecting) return
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
  placeMarks()
  placeKey()
  section.classList.add('m-live')
  choose()
  // a stroke back has come to rest when the scroll has been still a moment (scrollend where there is one; iOS fires scroll events through
  // its momentum and the snap's own glide)
  let still = 0
  const rested = () => {
    clearTimeout(still)
    if (!backing) return
    backing = false
    choose()
  }
  const onScroll = () => {
    holdIfMoving()
    choose()
    if (!backing) return
    clearTimeout(still)
    still = window.setTimeout(rested, 180)
  }
  addEventListener('scrollend', rested)
  cleanups.push(() => removeEventListener('scrollend', rested))
  cleanups.push(watchFinger())
  addEventListener('scroll', onScroll, { passive: true })
  cleanups.push(() => removeEventListener('scroll', onScroll))
  // a real change of size measures again and puts everything in place at once (the address bar alone does not)
  let sized = `${innerWidth}`
  const onResize = () => {
    if (`${innerWidth}` === sized && Math.abs(window.innerHeight - H) < 120) return
    sized = `${innerWidth}`
    measure()
    marks.forEach((m) => m.remove())
    marks = []
    placeMarks()
    placeKey()
    if (phase) show(phase, true)
  }
  addEventListener('resize', onResize)
  cleanups.push(() => removeEventListener('resize', onResize))
  // the keyboard: the field lives in 7–8, Talk to us in 11; reaching either elsewhere brings its phase
  // on the next frame: the browser scrolls the focused element into view after the focus event, and undid this
  // (measured: the field focused from 11 stayed on 11)
  // a jump of the site's own: the phone's stop off meanwhile (lib/unsnapped.ts), or a mark would take it
  const to = (share: number) =>
    requestAnimationFrame(() => {
      unsnapped(() => scrollTo({ top: sceneTop() + scrollY + share * sceneTravel(), behavior: 'auto' }))
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
    clearTimeout(still)
    clearTimeout(letGo)
    clearTimeout(edgeLater)
    clearInterval(edgeFollow)
    clearTimeout(seenLater)
    clearTimeout(passageHold)
    delete section.dataset.passage
    marks.forEach((m) => m.remove())
    delete section.dataset.near
    delete section.dataset.edge
    delete section.dataset.seen
    cleanups.forEach((c) => c())
    flights.forEach((a) => a.cancel())
    spillAnims.forEach((a) => a.cancel())
    blink?.cancel()
    push?.cancel()
    section.classList.remove('m-live')
  }
}
