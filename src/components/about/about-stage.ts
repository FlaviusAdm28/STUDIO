/*
  The About's passage (storyboard states 11 → 14; README #52, #65; interactions.md §4). The scroll chooses the phase — with a dead
  band, as the Method and the Work's chapters (#90) — and each change plays as Web Animations from wherever every layer is seen,
  never as CSS transitions (iOS cut those, #90, #91). Transform and opacity only.

  pre  the Method's 11 is seen: the dark room, one round light on "Made once, for one moment.", the steps and Talk to us. The About is
       laid over it, held and unseen
  12   the light finds you (transition B). The passage starts on a copy of the Method's 11, exactly as it is (#65), so it plays whole at
       its own pace whatever the scroll does: Talk to us leaves first, then the steps and (desktop) the screens, the sentence last; the
       light that was on the sentence glides down onto the portrait and gathers on it, and in it the portrait appears in black and white,
       fading to its edges in a circle; "I'm Flávio." small beneath it (~3.2 s)
  13   the room comes up: the circle of light opens to the whole photograph as it goes to its place, the name rises and becomes the title
       (one element, a measured transform), the room takes the portrait's atmosphere; the sentence comes after
  14   your story: the rule, the paragraph, the credit, 04 Questions ↓. Then the section lets go: the About is not a long held scene
  Back above 12, the light leaves the portrait for the sentence first; only then does the Method's 11 come back (storyboard, 4 Nov).

  Owner, 4 Nov, on the first build: the passage "super rápido", with no sense of a transformation (it was hurried after 0.18 screen of
  scroll, because it was played on the Method's own words and the Method lets its 11 go 0.3 screen after the trigger); the page could move
  around the photograph (a dead band just above the trigger where the stage was no longer held); the light cheap, in layers, at a low
  resolution (a dark layer with a hole, scaled ×3). Hence the copy, the stage held before the trigger, and the light as below.
*/
import { bandColour, hex, over, type Rgb } from '@/lib/top-colour'

export type Phase = 'pre' | '12' | '13' | '14'
const ORDER = ['12', '13', '14'] as const

// The section lies over the Method's last 1.6 screens (about.css). Its stage is held LEAD screens before the passage starts, so the dead
// band around the start never lets it move with the page; the passage starts half a screen after the Method shows its 11.
const LEAD = 0.3
// where each phase starts, in screens of scroll from the passage's start; let go at RELEASE (about.css: the section's height). A stroke of
// a finger is ~0.8 screen (the Method's phone steps, owner 3 Nov): one stroke never runs through two phases
const STARTS: Record<(typeof ORDER)[number], number> = { '12': 0, '13': 1, '14': 1.7 }
const RELEASE = 2.3
// on a phone ~1.1 screen a phase, as the Method's, the scroll stopping at each, and every animation a quarter slower (owner, iPhone,
// 7 Nov: too fast, phases passed without meaning to); about.css: the section's height
const STARTS_PHONE: Record<(typeof ORDER)[number], number> = { '12': 0, '13': 1.1, '14': 2.2 }
const RELEASE_PHONE = 2.9
const PHONE_TEMPO = 1.25
const BAND = 0.025
// 12 is played whole: reached, 13 waits for it; only this close to the end of the hold does it hurry, so it is never let go unfinished
const HURRY_BEFORE = 0.25
const HURRY_MS = 400

const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const GLIDE: Curve = [0.45, 0, 0.25, 1]
const GLIDE_EASE = `cubic-bezier(${GLIDE.join(', ')})`
type Curve = readonly [number, number, number, number]

// the storyboard's geometry (About v5, B; main storyboard, 4 Nov)
const DESK = { nameY: 0.7, nameScale: 0.41 }
// On a phone the portrait is born on the sentence it replaces: centred on "Made once, for one moment." as the Method's 11 shows it on this
// screen (measured; 40.8 % of the height at 390 × 844, 37.8 % at 320 × 640), and the name under it at the storyboard's distance (54.5 % under
// a centre at 33 %). At the storyboard's 9 % from the top (centre 33 %) it was born 8 % above the sentence and 11 % above its light, and the
// two did not read as one (owner, 4 Nov: "a foto devia nascer mais centrada com o texto Made once"). The desktop's portrait, 80 % of the
// height, keeps its place.
const PHONE = { nameBelow: 0.545 - 0.33, nameScale: 0.6, centre: 0.41 }
// the light gathered on the portrait at 12: this much larger than the circle the portrait fades to
const GATHER = 1.45
// the mask's solid part (about.css: #000 58 %)
const SOLID = 0.58

// an easing sampled: the circle opening is two scales, one the inverse of the other at every moment, so they are written as keyframes
const sampled = ([x1, y1, x2, y2]: Curve) => {
  const c = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
  const pts = Array.from({ length: 401 }, (_, i) => [c(x1, x2, i / 400), c(y1, y2, i / 400)] as const)
  return (x: number) => (pts.find(([px]) => px >= x) ?? pts[400])[1]
}
const glide = sampled(GLIDE)

export function runStage(about: HTMLElement, release: () => void) {
  const q = (s: string, root: ParentNode = about) => root.querySelector<HTMLElement>(s)
  const stage = q('.a-stage')
  const box = q('.a-box')
  const pt = q('.a-pt')
  const frame = q('.a-frame')
  const open = q('.a-open')
  const img = q('.a-img')
  const glow = q('.a-glow')
  const from = q('.a-from')
  const lit = q('.a-lit')
  const name = q('.a-name')
  const role = q('.a-role')
  const say = q('.a-say')
  const rule = q('.a-rule')
  const para = q('.a-para')
  const credit = q('.a-credit')
  const next = q('.a-next')
  const method = document.getElementById('method')
  if (!stage || !box || !pt || !frame || !open || !img || !glow || !from || !lit || !name || !role || !say || !rule || !para || !credit || !next)
    return () => {}

  let phase: Phase | null = null
  let kind: 'desk' | 'phone' = innerWidth >= 900 ? 'desk' : 'phone'
  const tempoOf = () => (kind === 'phone' ? PHONE_TEMPO : 1)
  const startsOf = () => (kind === 'phone' ? STARTS_PHONE : STARTS)
  const hurryAt = () => (kind === 'phone' ? RELEASE_PHONE : RELEASE) - HURRY_BEFORE
  // the scroll stops at each phase (method.css .a-snap): one mark a phase, just past its start and the dead band, and one at the end
  const marks: HTMLElement[] = []
  const placeMarks = () => {
    // the phases, and the way out below: the Questions at the screen's top (the section's end)
    // 12's mark 0.4 screen into it: just past its start it lay ~200 px from the Method's 11, and a stroke ran over one of the two (11 → 13,
    // 12 → 10; Xiaomi, CDP strokes, 7 Nov)
    // a desktop: in the middle of 13 and 14, and 12 close to its start (0.8 screen from the Method's 11), as the Method's marks
    const shares = kind === 'phone' ? Object.values(startsOf()).map((share) => (share || 0.4) + BAND * 2.4) : [0.25, 1.05, 1.75]
    const tops = [...shares.map((share) => (LEAD + share) * H), about.offsetHeight]
    tops.forEach((y, i) => {
      let m = marks[i]
      if (!m) {
        m = document.createElement('div')
        m.className = 'a-snap'
        m.setAttribute('aria-hidden', 'true')
        about.append(m)
        marks[i] = m
      }
      const top = `${Math.round(y)}px`
      if (m.style.top !== top) m.style.top = top
    })
  }
  // the stage's own screen: on iOS it reaches 70 px above it (about.css --a-lift), and everything is placed under that
  const lift = () => parseFloat(getComputedStyle(stage).paddingTop) || 0
  let H = stage.offsetHeight - lift() || innerHeight

  // ---- the places, measured: the portrait and the name in the light, the light on the portrait, how far the circle opens ----
  let nameFrom = 'none'
  let ptAt12 = 'none'
  let glowAt12 = 'none'
  // how far the light opens, across and down: an oval in the photograph's own proportion
  let K = { x: 3, y: 3 }
  // the photograph's half sides over the circle's radius (one of them is 1): the shape the light takes on its way (see opening)
  let A = { x: 1, y: 1.5 }
  const measure = () => {
    kind = innerWidth >= 900 ? 'desk' : 'phone'
    const pad = lift()
    H = stage.offsetHeight - pad || innerHeight
    const bw = box.offsetWidth
    const bh = box.offsetHeight
    const pw = pt.offsetWidth
    const ph = pt.offsetHeight
    // the portrait at 12: at the centre on the desktop (at its left at rest), lower on a phone (offsets: no transform is read)
    // landing on whole pixels: the box is centred on the stage at a fractional place, and offsets are rounded, so the exact place is read
    // (the transform the portrait has now taken out) and the move made to end on a whole pixel (see about.css .a-pt: the line at the edge)
    const pr = pt.getBoundingClientRect()
    const sr = stage.getBoundingClientRect()
    const now = new DOMMatrixReadOnly(getComputedStyle(pt).transform === 'none' ? undefined : getComputedStyle(pt).transform)
    const lx = pr.left - now.e - sr.left
    const ly = pr.top - now.f - (sr.top + pad)
    const wantX = kind === 'desk' ? sr.width / 2 - pr.width / 2 : lx
    // the sentence's centre in the Method's 11, as a share of its held screen (the same height as this one)
    const phrase = (() => {
      const c = document.querySelector('#method .m-close')
      const st = document.querySelector('#method .m-stage')
      if (!c || !st) return PHONE.centre
      const cr = c.getBoundingClientRect()
      const r = st.getBoundingClientRect()
      // the Method's held stage reaches 70 px above the screen on iOS (method.css --m-lift): the sentence's place is of the screen under
      // it — measured from the stage's own top, the portrait was born 70 px off the sentence and jumped (owner, iPhone, 4 Nov)
      const mlift = parseFloat(getComputedStyle(document.getElementById('method') ?? st).getPropertyValue('--m-lift')) || 0
      return r.height ? (cr.top - (r.top + mlift) + cr.height / 2) / (r.height - mlift) : PHONE.centre
    })()
    const wantY = kind === 'desk' ? ly : phrase * H - pr.height / 2
    const dx = Math.round(wantX) - lx
    const dy = Math.round(wantY) - ly
    ptAt12 = `translate(${dx.toFixed(3)}px, ${dy.toFixed(3)}px)`
    // the name, small, centred beneath the portrait (its own size and place: exact at any size)
    const scale = kind === 'desk' ? DESK.nameScale : PHONE.nameScale
    const nx = bw / 2 - (name.offsetWidth * scale) / 2 - name.offsetLeft
    const ny = (kind === 'desk' ? DESK.nameY * bh : (phrase + PHONE.nameBelow) * H) - name.offsetTop
    nameFrom = `translate(${nx.toFixed(1)}px, ${ny.toFixed(1)}px) scale(${scale})`
    // the circle the portrait fades to (closest side), and how far it opens: as an oval in the photograph's proportion, its solid
    // part reaching the four corners together. Opened evenly, a circle in a tall photograph hardened its sides long before its top and
    // bottom (a tube of light, 1440 × 900, 4 Nov)
    const r = Math.min(pw, ph) / 2
    A = { x: pw / 2 / r, y: ph / 2 / r }
    const end = (Math.SQRT2 / SOLID) * 1.02
    K = { x: end * A.x, y: end * A.y }
    // the light: from the sentence's (the layer's own place) to the portrait's centre at 12, gathered on it; never larger than it was
    const cx = lx + dx + pr.width / 2
    const cy = ly + dy + pr.height / 2
    const gr = glow.offsetWidth / 2
    const gx = glow.offsetLeft + gr
    const gy = glow.offsetTop + gr - pad
    const s = Math.min(1, (GATHER * r) / gr)
    glowAt12 = `translate(${(cx - gx).toFixed(1)}px, ${(cy - gy).toFixed(1)}px) scale(${s.toFixed(3)})`
  }

  // ---- flights: from where each layer is seen to where the phase wants it; kept on the element when they end ----
  const flights = new Map<Element, Animation>()
  const settle = (el: HTMLElement, to: Keyframe) => Object.entries(to).forEach(([p, v]) => el.style.setProperty(p, String(v)))
  type Flight = { el: HTMLElement; to: Keyframe; ms: number; delay: number; easing: string; instant: boolean; frames?: Keyframe[] }
  const fly = (el: HTMLElement, to: Keyframe, ms: number, delay = 0, easing = EASE): Flight => ({ el, to, ms, delay, easing, instant: false })
  // every starting point is read first, then every flight starts (reads between new animations made the browser recompute the page
  // between them: the Method's 122 ms frame, 2 Nov)
  const run = (list: Flight[], instant = false) => {
    const starts = list.map(({ el, to, frames }) => {
      if (instant || frames) return null
      const cs = getComputedStyle(el)
      const f: Keyframe = {}
      for (const p of Object.keys(to)) f[p] = p === 'transform' ? (cs.transform === 'none' ? 'none' : cs.transform) : cs.getPropertyValue(p)
      return f
    })
    list.forEach((f, i) => {
      const { el, to, ms, delay, easing } = f
      flights.get(el)?.cancel()
      flights.delete(el)
      if (instant || f.instant) return settle(el, to)
      const t = tempoOf()
      const a = el.animate(f.frames ?? [starts[i] ?? {}, to], { duration: ms * t, delay: delay * t, easing: f.frames ? 'linear' : easing, fill: 'both' })
      flights.set(el, a)
      a.onfinish = () => {
        settle(el, to)
        if (flights.get(el) === a) {
          a.cancel()
          flights.delete(el)
        }
      }
    })
  }
  const hurry = (ms = HURRY_MS) =>
    [...flights.values(), ...copyAnims].forEach((a) => {
      const t = a.effect?.getComputedTiming()
      const left = Number(t?.endTime ?? 0) - Number(a.currentTime ?? 0)
      if (left > ms) a.updatePlaybackRate(left / ms)
    })

  // ---- the circle of light opening (or closing): .a-open scales by k, .a-img by 1 / k at every moment, so the photograph stays still
  type Scale = { x: number; y: number }
  const ONE: Scale = { x: 1, y: 1 }
  const sc = (k: Scale) => `scale(${k.x.toFixed(4)}, ${k.y.toFixed(4)})`
  const inv = (k: Scale) => `scale(${(1 / k.x).toFixed(4)}, ${(1 / k.y).toFixed(4)})`
  // The way the light opens: first it stretches along the photograph's long side into the oval inscribed in it (its short sides still
  // soft), then it opens evenly to the corners, so the four edges harden together. Opened straight to an oval, the circle of 12 —
  // which already touches the short sides — hardened them first: straight sides under a round top (GPU, 1440 at 125 %, 4 Nov).
  // A point on the way is one number, L: the scale is L × A on each side, never less than 1.
  const along = (L: number): Scale => ({ x: Math.max(1, L * A.x), y: Math.max(1, L * A.y) })
  const where = (k: Scale) => Math.max(k.x > 1.0001 ? k.x / A.x : 0, k.y > 1.0001 ? k.y / A.y : 0, 1 / Math.max(A.x, A.y))
  const opening = (k0: Scale, k1: Scale, ms: number, delay: number): Flight[] => {
    const n = 32
    const a: Keyframe[] = []
    const b: Keyframe[] = []
    const L0 = where(k0)
    const L1 = where(k1)
    for (let i = 0; i <= n; i++) {
      const e = glide(i / n)
      const k = i === n ? k1 : along(L0 + (L1 - L0) * e)
      a.push({ offset: i / n, transform: sc(k) })
      b.push({ offset: i / n, transform: inv(k) })
    }
    return [
      { el: open, to: { transform: sc(k1) }, ms, delay, easing: 'linear', instant: false, frames: a },
      { el: img, to: { transform: inv(k1) }, ms, delay, easing: 'linear', instant: false, frames: b },
    ]
  }
  let openLater = 0
  const setOpen = (on: boolean, after = 0) => {
    clearTimeout(openLater)
    if (!on) return pt.removeAttribute('data-open')
    // once fully open the mask and the two scales go: the photograph is drawn as it is (about.css)
    openLater = window.setTimeout(() => {
      // the opening's own end must not write its scales back over this (it ended a frame later and did: the masked layer stayed
      // scaled ×2.5 × 3.8 over half the screen, 4 Nov)
      ;[open, img].forEach((el) => {
        flights.get(el)?.cancel()
        flights.delete(el)
        el.style.transform = 'none'
      })
      pt.setAttribute('data-open', '')
    }, after * tempoOf())
  }
  const closeFromOpen = () => {
    // back from the open photograph: the same picture as scales, then the mask comes back (seen the same)
    setOpen(false)
    open.style.transform = sc(K)
    img.style.transform = inv(K)
  }

  // ---- the copy of the Method's 11 (#65): its markup and its rules, out of its scroll, so the passage plays whatever the scroll does ----
  let copyAnims: Animation[] = []
  const copy = () => {
    from.replaceChildren()
    const src = method?.querySelector<HTMLElement>('.m-stage')
    if (!method || !src) return null
    const wrap = document.createElement('div')
    wrap.className = [...method.classList].filter((c) => c !== 'm-leaving').join(' ')
    for (const a of [...method.attributes]) if (a.name.startsWith('data-') && a.name !== 'data-edge') wrap.setAttribute(a.name, a.value)
    const clone = src.cloneNode(true) as HTMLElement
    // what is still moving in the Method is copied where it is seen now
    const all = [src, ...src.querySelectorAll<HTMLElement>('*')]
    const mine = [clone, ...clone.querySelectorAll<HTMLElement>('*')]
    src.getAnimations({ subtree: true }).forEach((a) => {
      const t = (a.effect as KeyframeEffect | null)?.target as HTMLElement | null
      const i = t ? all.indexOf(t) : -1
      if (i < 0) return
      const cs = getComputedStyle(t as HTMLElement)
      mine[i].style.opacity = cs.opacity
      mine[i].style.transform = cs.transform
    })
    mine.forEach((el) => {
      el.removeAttribute('id')
      el.removeAttribute('for')
    })
    clone.querySelectorAll('input, a, button').forEach((el) => el.setAttribute('tabindex', '-1'))
    wrap.append(clone)
    wrap.inert = true
    from.append(wrap)
    return clone
  }
  // the copy's words, and (desktop) its screens as one layer: [selector, gone, ms, delay out, delay back]
  const LEAVE: [string, string, number, number, number][] = [
    ['.m-cta', 'translateY(60%)', 600, 0, 300],
    ['.m-steps', 'translateY(40%)', 700, 150, 200],
    ['.m-screens', 'scale(1.04)', 1100, 150, 0],
    ['.m-close', 'translateY(-6%)', 900, 500, 0],
  ]
  // each leaves from, and comes back to, the opacity it rests at in the Method (the steps rest at 0.75: started from 1 they brightened for
  // a frame at the handover, 4 Nov)
  const rest = (el: HTMLElement) => getComputedStyle(el).opacity
  const wordsOut = (clone: HTMLElement) => {
    copyAnims.forEach((a) => a.cancel())
    copyAnims = LEAVE.flatMap(([sel, gone, ms, delay]) => {
      const el = q(sel, clone)
      const t = tempoOf()
      return el ? [el.animate([{ opacity: rest(el), transform: 'none' }, { opacity: 0, transform: gone }], { duration: ms * t, delay: delay * t, easing: EASE, fill: 'both' })] : []
    })
  }
  const wordsBack = (clone: HTMLElement, at: number) => {
    copyAnims.forEach((a) => a.cancel())
    copyAnims = LEAVE.flatMap(([sel, gone, ms, , back]) => {
      const el = q(sel, clone)
      const t = tempoOf()
      return el ? [el.animate([{ opacity: 0, transform: gone }, { opacity: rest(el), transform: 'none' }], { duration: ms * t, delay: (at + back) * t, easing: EASE, fill: 'both' })] : []
    })
  }
  const dropCopy = () => {
    copyAnims.forEach((a) => a.cancel())
    copyAnims = []
    from.replaceChildren()
  }

  // ---- holding the stage where it is while the light goes back (the scroll may already have carried the section below its hold) ----
  let letGo = 0
  // fixed exactly where it is seen (as the Method's, method-stage.ts), less its own margin: on iOS the stage's −70 px margin (the lift)
  // moved the fixed box up again, and going back from 12 to 11 the portrait and its light jumped 70 px up as the 11 came (owner's
  // recording, 7 Nov; Simulator: sticky −70 → fixed −140, −58 → −128 on a slow way back; now the same pixel)
  const hold = () => {
    if (!about.classList.contains('a-leaving'))
      stage.style.top = `${(stage.getBoundingClientRect().top - (parseFloat(getComputedStyle(stage).marginTop) || 0)).toFixed(1)}px`
    about.classList.add('a-leaving')
  }
  const unhold = () => {
    clearTimeout(letGo)
    about.classList.remove('a-leaving')
    stage.style.top = ''
  }
  const holdWhileLeaving = (ms: number) => {
    clearTimeout(letGo)
    hold()
    letGo = window.setTimeout(() => {
      unhold()
      dropCopy()
    }, ms * tempoOf())
  }
  let passageEnds = 0

  // every layer at the start of the passage: the room of 11 (its light on the sentence), the portrait unseen in its place in the dark
  const START: [HTMLElement, Keyframe][] = [
    [pt, { transform: ptAt12 }],
    [frame, { opacity: '0' }],
    [glow, { transform: 'none', opacity: '1' }],
    [name, { transform: nameFrom, opacity: '0' }],
    [lit, { opacity: '0' }],
    [role, { opacity: '0' }],
    [say, { opacity: '0', transform: 'translateY(5%)' }],
    [rule, { transform: 'scaleX(0)' }],
    [para, { opacity: '0' }],
    [credit, { opacity: '0' }],
    [next, { opacity: '0' }],
  ]
  const atStart = () => {
    run(START.map(([el, to]) => ({ ...fly(el, to, 0), instant: true })), true)
    // START uses the measures of now
    pt.style.transform = ptAt12
    name.style.transform = nameFrom
    setOpen(false)
    run([...opening(ONE, ONE, 0, 0)], true)
  }

  // ---- the page's edges (html, body, theme-color: around Safari's Dynamic Island, Chrome's bar on Android), read by the entrance script:
  // the colour of what is really at the top of the screen, from its picture (src/lib/top-colour.ts), when it is there. They were the
  // charcoal of the sections after the About, an artificial colour over the portrait's sky at 13 (owner, iPhone, 4 Nov) ----
  let edgeLater = 0
  const DARK_RGB: Rgb = [23, 24, 22] // the dark of 12 as seen (--a-dark and the grain), the Method's 11
  // the section's own dark, once the stage has gone up with the page
  const GONE: Rgb = [27, 28, 26]
  // the band the island sees: on iOS the 70 px above the screen (the lift), elsewhere the screen's top; across its middle
  const band = (r: DOMRect) => ({ x0: innerWidth * 0.3 - r.left, x1: innerWidth * 0.7 - r.left, y0: -lift() - r.top, y1: 4 - r.top })
  const posOf = (img: HTMLImageElement) =>
    getComputedStyle(img)
      .objectPosition.split(' ')
      .map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5)) as [number, number]
  // a phone at 13 and 14: the portrait across the top, as much of it as is seen there — through the circle of light while it opens
  // (.a-open's mask: solid to 58 % of its closest side, clear at 100 %, scaled by k), all of it once open; none once it has gone up
  const portraitTop = (): [Rgb, number] | null => {
    if (kind !== 'phone') return null
    const im = pt.querySelector<HTMLImageElement>(`${about.dataset.colour === 'on' ? '.a-col' : '.a-mono'} img`)
    if (!im) return null
    const r = im.getBoundingClientRect()
    if (r.bottom < 4 || r.top > 1) return null
    const c = bandColour(im, { w: r.width, h: r.height }, band(r), 'cover', posOf(im))
    if (!c) return null
    let seen = 1
    if (!pt.hasAttribute('data-open')) {
      const k = currentK()
      const ob = open.getBoundingClientRect()
      const rad = Math.min(open.offsetWidth, open.offsetHeight) / 2
      const y = lift() ? -lift() / 2 : 8
      const d = Math.hypot((innerWidth / 2 - (ob.left + ob.width / 2)) / (rad * k.x), (y - (ob.top + ob.height / 2)) / (rad * k.y))
      seen = Math.min(1, Math.max(0, (1 - d) / (1 - SOLID)))
    }
    seen *= parseFloat(getComputedStyle(frame).opacity) || 0
    return [c, seen]
  }
  // under it the lit room (.a-lit, drawn with fill), at its opacity now over the dark: it comes up over 1.2 s before the portrait
  // reaches the top (the edge stayed the dark of 12 under a room already grey, audit 402 × 874, 4 Nov)
  const roomTop = (): Rgb | null => {
    const im = lit.querySelector<HTMLImageElement>(`${about.dataset.colour === 'on' ? '.a-room-col' : '.a-room-mono'} img`)
    if (!im) return null
    const r = im.getBoundingClientRect()
    if (r.bottom < 4) return null
    const c = bandColour(im, { w: r.width, h: r.height }, band(r), 'fill', posOf(im))
    return c ? over(DARK_RGB, c, parseFloat(getComputedStyle(lit).opacity) || 0) : null
  }
  const edgeOf = (ph: Phase) => {
    if (ph === 'pre') return ''
    const ground = roomTop() ?? (ph === '12' ? DARK_RGB : GONE)
    const p = portraitTop()
    return hex(p ? over(ground, p[0], p[1]) : ground)
  }
  // set after a delay, then read again every 100 ms for a while where the top changes slowly
  let edgeFollow = 0
  const setEdge = (ph: Phase, delay = 0, follow = 0) => {
    clearTimeout(edgeLater)
    clearInterval(edgeFollow)
    edgeLater = 0
    edgeFollow = 0
    const put = () => {
      const e = edgeOf(ph)
      if (e) about.dataset.edge = e
      else delete about.dataset.edge
    }
    const go = () => {
      edgeLater = 0
      put()
      if (!follow) return
      const until = performance.now() + follow * tempoOf()
      edgeFollow = window.setInterval(() => {
        put()
        if (performance.now() < until) return
        clearInterval(edgeFollow)
        edgeFollow = 0
      }, 100)
    }
    if (delay) edgeLater = window.setTimeout(go, delay * tempoOf())
    else go()
  }
  // the portrait's colour changes the top too (its sky, the room): once it is mostly there
  const colourWatch = new MutationObserver(() => phase && phase !== 'pre' && phase !== '12' && setEdge(phase, 0, 1400))
  // let go at the end of the hold, the stage goes up with the page and the top is what follows it: read again as it moves (only then:
  // held, nothing at the top moves with the scroll)
  let edgeAt = NaN
  const edgeOnScroll = () => {
    if ((phase !== '13' && phase !== '14') || edgeLater || edgeFollow) return
    const t = Math.round(stage.getBoundingClientRect().top)
    if (t === edgeAt) return
    const moved = !Number.isNaN(edgeAt)
    edgeAt = t
    if (moved) setEdge(phase)
  }
  colourWatch.observe(about, { attributes: true, attributeFilter: ['data-colour'] })

  // for the bar's words (bar-client.tsx): the About is seen once its portrait is half there, and until it is half gone going back — by
  // the phase alone the bar said 03 About over the Method's 11 coming, and 02 Method over the portrait going (owner, iPhone, 6 Nov)
  let seenLater = 0
  const seen = (on: boolean, after = 0) => {
    clearTimeout(seenLater)
    const put = () => (on ? (about.dataset.seen = '') : delete about.dataset.seen)
    if (after) seenLater = window.setTimeout(put, after * tempoOf())
    else put()
  }
  const show = (to: Phase, instant = false) => {
    const was = phase
    phase = to
    about.dataset.phase = to
    clearTimeout(wake)
    // the portrait: in from 0.7 s over 1.7 s at the passage (half at 1.55 s), out from 0.1 s over 0.9 s going back (half at 0.55 s)
    if (to === 'pre') seen(false, instant || was === null ? 0 : 550)
    else seen(true, !instant && (was === 'pre' || was === null) && to === '12' ? 1550 : 0)
    // the top's colour as the top changes: followed while the room comes up and the photograph opens over the top (to 13, 14), and
    // while it closes off it (back to 12). By the clock alone it was early or late on one screen or the other: the photograph reaches the
    // top between 1.2 and 1.5 s at 390 × 844, and leaves it by 0.4 s, by 0.65 s on the iPhone's taller portrait (timed, 4 Nov)
    const moving = !instant && (((to === '13' || to === '14') && (was === '12' || was === 'pre')) || (to === '12' && (was === '13' || was === '14')))
    setEdge(to, 0, moving ? 1800 : 0)

    if (to === 'pre') {
      release()
      if (was === null || instant) {
        dropCopy()
        return
      }
      // back to the Method: the light leaves the portrait for the sentence first, then the Method's 11 comes back
      if (pt.hasAttribute('data-open')) closeFromOpen()
      const clone = method?.dataset.phase === '11' ? copy() : null
      if (clone) {
        clone.style.opacity = '1'
        wordsBack(clone, 900)
      }
      run([
        fly(name, { opacity: '0' }, 400),
        fly(role, { opacity: '0' }, 400),
        fly(say, { opacity: '0' }, 400),
        fly(credit, { opacity: '0' }, 400),
        fly(para, { opacity: '0' }, 400),
        fly(next, { opacity: '0' }, 400),
        fly(rule, { transform: 'scaleX(0)' }, 400),
        fly(lit, { opacity: '0' }, 900),
        fly(frame, { opacity: '0' }, 900, 100),
        fly(pt, { transform: ptAt12 }, 1000, 0, GLIDE_EASE),
        fly(glow, { transform: 'none', opacity: '1' }, 1500, 0, GLIDE_EASE),
        ...opening(currentK(), ONE, 900, 0),
      ])
      // the stage is unseen again only once all of it is back (about.css: clipped at pre, unless leaving), held where it is meanwhile
      holdWhileLeaving(2000)
      return
    }

    // 12, from the Method: the passage
    if (to === '12' && (was === 'pre' || was === null) && !instant) {
      unhold()
      atStart()
      // the copy only when the Method's 11 is what is seen: reached by a jump (the menu, an address) the Method is elsewhere or still on its
      // way — from its 9 the copy caught its screens in mid-flight, 4 Nov — and the passage starts from the dark room and its light alone
      const clone = !viaJump && method?.dataset.phase === '11' ? copy() : null
      if (clone) wordsOut(clone)
      else dropCopy()
      run([
        // the light leaves the sentence as it starts to go, and the portrait appears in it while the sentence is still leaving: the
        // room is never empty between them (storyboard rule 1; at 1.4 s it was, 4 Nov)
        fly(glow, { transform: glowAt12, opacity: '1' }, 2400, 300, GLIDE_EASE),
        fly(frame, { opacity: '1' }, 1700, 700, 'cubic-bezier(0.33, 0, 0.2, 1)'),
        fly(name, { opacity: '0.92' }, 1000, 2000),
      ])
      passageEnds = performance.now() + 3000 * tempoOf()
      dropLater(3100)
      return
    }
    if (to === '12') {
      // back from 13 (or a refresh here): the story goes first, then the photograph closes into the light at the centre
      if (pt.hasAttribute('data-open') || instant) closeFromOpen()
      run(
        [
          fly(role, { opacity: '0' }, 450),
          fly(say, { opacity: '0', transform: 'translateY(5%)' }, 450),
          fly(credit, { opacity: '0' }, 450),
          fly(rule, { transform: 'scaleX(0)' }, 450),
          fly(para, { opacity: '0' }, 450),
          fly(next, { opacity: '0' }, 450),
          fly(frame, { opacity: '1' }, 300),
          fly(lit, { opacity: '0' }, 1400, 200),
          fly(glow, { transform: glowAt12, opacity: '1' }, 1400, 300),
          fly(pt, { transform: ptAt12 }, 1500, 200, GLIDE_EASE),
          fly(name, { transform: nameFrom, opacity: '0.92' }, 1500, 200, GLIDE_EASE),
          ...opening(instant ? ONE : currentK(), ONE, 1500, 200),
        ],
        instant,
      )
      if (instant) dropCopy()
      return
    }

    // 13 and 14: the room comes up (from 12, from the Method in one stroke, or at once)
    const list: Flight[] = []
    if (was === null || was === 'pre' || was === '12' || instant) {
      const rush = was === 'pre' && !instant
      if (rush) {
        // straight from the Method, past 12: the copy goes at once, the room comes up
        atStart()
        dropCopy()
      }
      list.push(
        fly(frame, { opacity: '1' }, rush ? 700 : 300),
        fly(lit, { opacity: '1' }, 1800),
        fly(glow, { opacity: '0' }, 1600),
        fly(pt, { transform: 'none' }, 1600, 0, GLIDE_EASE),
        ...opening(instant ? K : currentK(), K, 1700, 0),
        fly(name, { transform: 'none', opacity: '1' }, 1600, 0, GLIDE_EASE),
        fly(role, { opacity: '0.7' }, 1100, rush ? 500 : 1200),
        fly(say, { opacity: '1', transform: 'none' }, 1100, rush ? 500 : 1200),
        // on a phone the credit sits under the portrait and comes with the room (storyboard 13); on the desktop with the story (14)
        ...(kind === 'phone' ? [fly(credit, { opacity: '0.6' }, 1000, 500)] : []),
      )
      setOpen(true, instant ? 0 : 1750)
      if (instant) dropCopy()
    }
    if (to === '13' && was === '14') {
      list.push(
        fly(rule, { transform: 'scaleX(0)' }, 450),
        fly(para, { opacity: '0' }, 450),
        fly(next, { opacity: '0' }, 450),
        ...(kind === 'desk' ? [fly(credit, { opacity: '0' }, 450)] : []),
      )
    }
    if (to === '14') {
      const after = was === '13' ? 0 : 1000 // straight from 12: the story waits for the room
      list.push(
        fly(rule, { transform: 'none' }, 1200, after + 300),
        fly(para, { opacity: '1' }, 1000, after + 200),
        fly(credit, { opacity: '0.6' }, 1000, after + (kind === 'desk' ? 500 : 400)),
        fly(next, { opacity: '0.7' }, 1000, after + 600),
      )
    }
    run(list, instant)
  }
  // how far the circle is open now (read from the transform it is seen with)
  const currentK = (): Scale => {
    if (pt.hasAttribute('data-open')) return K
    const t = getComputedStyle(open).transform
    const m = new DOMMatrixReadOnly(t === 'none' ? undefined : t)
    return { x: m.a || 1, y: m.d || 1 }
  }
  let dropTimer = 0
  const dropLater = (ms: number) => {
    clearTimeout(dropTimer)
    dropTimer = window.setTimeout(() => phase !== 'pre' && dropCopy(), ms * tempoOf())
  }

  // ---- the phase under the scroll, once a frame, with the dead band; 12's passage is played whole ----
  let wake = 0
  const progress = () => (-about.getBoundingClientRect().top - LEAD * H) / H
  // A jump (the menu, an address, the bar's name) is not a scroll: what it leaves or passes over is put in place at once. Played, the
  // way back from 14 held the About over the Method for 2 s after the menu had gone to 02 Method; only a landing on 12 plays its passage
  let lastP: number | null = null
  let viaJump = false
  let jumpAt = -1e9
  const choose = () => {
    const p = progress()
    // the stop at each phase lets go as the stage does (method.css): from 14 a stroke goes on to the Questions, never pulled back
    const free = p > (kind === 'phone' ? RELEASE_PHONE : RELEASE) - 0.3
    if (free !== 'free' in about.dataset) {
      if (free) about.dataset.free = ''
      else delete about.dataset.free
    }
    const jumped = lastP !== null && Math.abs(p - lastP) > 1.2
    lastP = p
    // a jump can arrive in two frames (just short of the start, then on it): it counts for a moment after it is seen (the copy of 11 was
    // still made on the second frame, from the Method's 9, 4 Nov)
    if (jumped) jumpAt = performance.now()
    viaJump = performance.now() - jumpAt < 400 || document.documentElement.dataset.jump !== undefined
    if (p < 0) {
      // the way back is held where it was only while the section is near: carried far up (the Work's smooth scroll to a chapter, a fling)
      // it covered the Work, dark, for its 2 s (menu, About → 01 Work, 4 Nov)
      if (about.classList.contains('a-leaving') && p < -1.2) {
        unhold()
        dropCopy()
      }
      if (jumped && phase !== 'pre') {
        unhold()
        show('pre', true)
        dropCopy()
        return
      }
      if (phase === null || (phase !== 'pre' && p < -BAND)) show('pre', phase === null)
      return
    }
    let at: (typeof ORDER)[number] = '12'
    ORDER.forEach((ph) => p >= startsOf()[ph] && (at = ph))
    if (phase === null) return show(at, true)
    if (jumped && at !== '12') return at !== phase && show(at, true)
    if (phase === 'pre') return show(at === '12' ? '12' : at)
    const cur = ORDER.indexOf(phase as (typeof ORDER)[number])
    const nxt = ORDER.indexOf(at)
    if (phase === '12' && nxt > cur && performance.now() < passageEnds) {
      // the passage first: 13 answers once it has ended; only near the end of the hold is it hurried. On a phone a stroke rests on the
      // next phase's mark (the snap), so reaching 13 is asked for: hurried at once — waiting the passage's 3.75 s there, a scroll went
      // on through 13 and 14 to the Questions with 12 still on stage (Xiaomi journey, 7 Nov)
      if (p >= hurryAt() || (kind === 'phone' && p >= startsOf()['13'] + BAND)) {
        hurry()
        passageEnds = Math.min(passageEnds, performance.now() + HURRY_MS)
      }
      clearTimeout(wake)
      wake = window.setTimeout(frameChoose, passageEnds - performance.now() + 30)
      return
    }
    if (nxt > cur) {
      let far = cur
      ORDER.forEach((ph, i) => i > cur && p >= startsOf()[ph] + BAND && (far = i))
      if (far !== cur) show(ORDER[far])
    } else if (nxt < cur && p < startsOf()[ORDER[cur]] - BAND) show(at)
    edgeOnScroll()
  }
  let raf = 0
  const frameChoose = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      choose()
    })
  }

  // ---- the keyboard: reaching the portrait or 04 Questions ↓ before 14 brings 14 (the browser scrolls after focus: next frame) ----
  const onFocus = () => {
    if (phase === '14') return
    requestAnimationFrame(() =>
      scrollTo({ top: scrollY + about.getBoundingClientRect().top + (LEAD + startsOf()['14'] + 0.08) * H, behavior: 'auto' }),
    )
  }
  stage.addEventListener('focusin', onFocus)

  // a real change of size measures again and puts everything in place at once (the address bar alone does not)
  let sized = innerWidth
  const onResize = () => {
    if (innerWidth === sized && Math.abs((stage.offsetHeight - lift() || innerHeight) - H) < 120) return
    sized = innerWidth
    measure()
    placeMarks()
    if (phase && phase !== 'pre') show(phase, true)
  }

  measure()
  placeMarks()
  about.classList.add('a-live')
  choose()
  addEventListener('scroll', frameChoose, { passive: true })
  addEventListener('resize', onResize)
  // the face changes the name's width: measured again once it is there
  document.fonts?.ready.then(() => {
    measure()
    if (phase && phase !== 'pre' && !flights.size) show(phase, true)
  })

  return () => {
    clearTimeout(wake)
    clearTimeout(edgeLater)
    clearInterval(edgeFollow)
    clearTimeout(seenLater)
    marks.forEach((m) => m.remove())
    delete about.dataset.free
    colourWatch.disconnect()
    delete about.dataset.edge
    delete about.dataset.seen
    clearTimeout(letGo)
    clearTimeout(openLater)
    clearTimeout(dropTimer)
    cancelAnimationFrame(raf)
    removeEventListener('scroll', frameChoose)
    removeEventListener('resize', onResize)
    stage.removeEventListener('focusin', onFocus)
    flights.forEach((a) => a.cancel())
    dropCopy()
    about.classList.remove('a-live', 'a-leaving')
    stage.style.top = ''
  }
}
