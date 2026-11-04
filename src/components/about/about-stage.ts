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
export type Phase = 'pre' | '12' | '13' | '14'
const ORDER = ['12', '13', '14'] as const

// The section lies over the Method's last 1.6 screens (about.css). Its stage is held LEAD screens before the passage starts, so the dead
// band around the start never lets it move with the page; the passage starts half a screen after the Method shows its 11.
const LEAD = 0.3
// where each phase starts, in screens of scroll from the passage's start; let go at RELEASE (about.css: the section's height). A stroke of
// a finger is ~0.8 screen (the Method's phone steps, owner 3 Nov): one stroke never runs through two phases
const STARTS: Record<(typeof ORDER)[number], number> = { '12': 0, '13': 1, '14': 1.7 }
const RELEASE = 2.3
const BAND = 0.025
// 12 is played whole: reached, 13 waits for it; only this close to the end of the hold does it hurry, so it is never let go unfinished
const HURRY_AT = RELEASE - 0.25
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
      return r.height ? (cr.top - r.top + cr.height / 2) / r.height : PHONE.centre
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
      const a = el.animate(f.frames ?? [starts[i] ?? {}, to], { duration: ms, delay, easing: f.frames ? 'linear' : easing, fill: 'both' })
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
    }, after)
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
      return el ? [el.animate([{ opacity: rest(el), transform: 'none' }, { opacity: 0, transform: gone }], { duration: ms, delay, easing: EASE, fill: 'both' })] : []
    })
  }
  const wordsBack = (clone: HTMLElement, at: number) => {
    copyAnims.forEach((a) => a.cancel())
    copyAnims = LEAVE.flatMap(([sel, gone, ms, , back]) => {
      const el = q(sel, clone)
      return el ? [el.animate([{ opacity: 0, transform: gone }, { opacity: rest(el), transform: 'none' }], { duration: ms, delay: at + back, easing: EASE, fill: 'both' })] : []
    })
  }
  const dropCopy = () => {
    copyAnims.forEach((a) => a.cancel())
    copyAnims = []
    from.replaceChildren()
  }

  // ---- holding the stage where it is while the light goes back (the scroll may already have carried the section below its hold) ----
  let letGo = 0
  const holdWhileLeaving = (ms: number) => {
    clearTimeout(letGo)
    about.classList.add('a-leaving')
    letGo = window.setTimeout(() => {
      about.classList.remove('a-leaving')
      dropCopy()
    }, ms)
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

  const show = (to: Phase, instant = false) => {
    const was = phase
    phase = to
    about.dataset.phase = to
    clearTimeout(wake)

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
      clearTimeout(letGo)
      about.classList.remove('a-leaving')
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
      passageEnds = performance.now() + 3000
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
    dropTimer = window.setTimeout(() => phase !== 'pre' && dropCopy(), ms)
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
        clearTimeout(letGo)
        about.classList.remove('a-leaving')
        dropCopy()
      }
      if (jumped && phase !== 'pre') {
        clearTimeout(letGo)
        about.classList.remove('a-leaving')
        show('pre', true)
        dropCopy()
        return
      }
      if (phase === null || (phase !== 'pre' && p < -BAND)) show('pre', phase === null)
      return
    }
    let at: (typeof ORDER)[number] = '12'
    ORDER.forEach((ph) => p >= STARTS[ph] && (at = ph))
    if (phase === null) return show(at, true)
    if (jumped && at !== '12') return at !== phase && show(at, true)
    if (phase === 'pre') return show(at === '12' ? '12' : at)
    const cur = ORDER.indexOf(phase as (typeof ORDER)[number])
    const nxt = ORDER.indexOf(at)
    if (phase === '12' && nxt > cur && performance.now() < passageEnds) {
      // the passage first: 13 answers once it has ended; only near the end of the hold is it hurried
      if (p >= HURRY_AT) {
        hurry()
        passageEnds = Math.min(passageEnds, performance.now() + HURRY_MS)
      }
      clearTimeout(wake)
      wake = window.setTimeout(frameChoose, passageEnds - performance.now() + 30)
      return
    }
    if (nxt > cur) {
      let far = cur
      ORDER.forEach((ph, i) => i > cur && p >= STARTS[ph] + BAND && (far = i))
      if (far !== cur) show(ORDER[far])
    } else if (nxt < cur && p < STARTS[ORDER[cur]] - BAND) show(at)
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
      scrollTo({ top: scrollY + about.getBoundingClientRect().top + (LEAD + STARTS['14'] + 0.08) * H, behavior: 'auto' }),
    )
  }
  stage.addEventListener('focusin', onFocus)

  // a real change of size measures again and puts everything in place at once (the address bar alone does not)
  let sized = innerWidth
  const onResize = () => {
    if (innerWidth === sized && Math.abs((stage.offsetHeight - lift() || innerHeight) - H) < 120) return
    sized = innerWidth
    measure()
    if (phase && phase !== 'pre') show(phase, true)
  }

  measure()
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
  }
}
