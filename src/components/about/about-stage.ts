/*
  The About's passage (storyboard states 11 → 14; README #52, #65; interactions.md §4). The scroll chooses the phase — with a dead
  band, as the Method and the Work's chapters (#90) — and each change plays as Web Animations from wherever every layer is seen,
  never as CSS transitions (iOS cut those, #90, #91). Transform and opacity only.

  pre  the Method's 11 is seen: the dark room, one round light on "Made once, for one moment.", the steps and Talk to us. The About is
       laid over it, held and unseen
  12   the light finds you (transition B): the Method's words leave, Talk to us first, then the steps, the sentence last (#65); in the
       same light, at the centre, the portrait appears in black and white — it was already in the dark room; the light, as large as the
       sentence's, glides down onto it — and "I'm Flávio." small beneath it. On a phone the light comes up to the portrait (~2.3 s)
  13   the room comes up: the portrait goes to its place, the name rises and becomes the title (one element, a measured transform), the
       room takes the portrait's atmosphere; the sentence comes after
  14   your story: the rule, the paragraph, the credit, 04 Questions ↓. Then the section lets go: the About is not a long held scene
  Back above 12, the light leaves the portrait for the sentence first; only then does the Method's room come back (storyboard, 4 Nov).
*/
export type Phase = 'pre' | '12' | '13' | '14'
const ORDER = ['12', '13', '14'] as const

// The section lies over the Method's last OVERLAP screens (about.css): its top reaches the top of the screen 0.3 screen before the
// Method lets its 11 go, so the passage covers the Method while it is still held.
// Where each phase starts, in screens of scroll from there (held for HELD screens, about.css): one stroke of a finger is ~0.8 screen
// (the Method's phone steps, owner 3 Nov), so 13 and 14 are a stroke apart, not two in one.
const STARTS: Record<(typeof ORDER)[number], number> = { '12': 0, '13': 0.5, '14': 0.95 }
const BAND = 0.025
// scrolled this far into 12 before its passage ends, it ends quickly (the Method lets go at 0.3)
const HURRY_AT = 0.18
const HURRY_MS = 300

const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const GLIDE = 'cubic-bezier(0.45, 0, 0.25, 1)'

// the storyboard's geometry (About v5, B; main storyboard, 4 Nov)
const DESK = {
  // the name in the light: centred under the portrait, 70 % down the frame, at 0.41 of its size
  nameY: 0.7,
  nameScale: 0.41,
  // the light at 12 is the frame's centre; it starts on the sentence's light (method.css .m-dark: 46vw at 50 % 44 %), a little larger
  pool: { r: 0.46, y: 0.44 },
  grow: 1.13,
}
const PHONE = {
  nameY: 0.545,
  nameScale: 0.6,
  // the portrait in the light: 9 % down the screen, so the light comes up to it from the sentence's
  ptY: 0.09,
  pool: { r: 0.62, y: 0.44 },
  grow: 1.08,
}

export function runStage(about: HTMLElement, release: () => void) {
  const stage = about.querySelector<HTMLElement>('.a-stage')
  const box = about.querySelector<HTMLElement>('.a-box')
  const pt = about.querySelector<HTMLElement>('.a-pt')
  const frame = about.querySelector<HTMLElement>('.a-frame')
  const dark = about.querySelector<HTMLElement>('.a-dark')
  const spot = about.querySelector<HTMLElement>('.a-spot')
  const lit = about.querySelector<HTMLElement>('.a-lit')
  const name = about.querySelector<HTMLElement>('.a-name')
  const q = (s: string) => about.querySelector<HTMLElement>(s)
  const role = q('.a-role')
  const say = q('.a-say')
  const rule = q('.a-rule')
  const para = q('.a-para')
  const credit = q('.a-credit')
  const next = q('.a-next')
  // the Method's 11, which the passage starts on exactly as approved (#65): its own words leave, in order
  const method = document.getElementById('method')
  const close = method?.querySelector<HTMLElement>('.m-close')
  const steps = method?.querySelector<HTMLElement>('.m-steps')
  const cta = method?.querySelector<HTMLElement>('.m-cta')
  if (!stage || !box || !pt || !frame || !dark || !spot || !lit || !name || !role || !say || !rule || !para || !credit || !next)
    return () => {}

  let phase: Phase | null = null
  let kind: 'desk' | 'phone' = innerWidth >= 900 ? 'desk' : 'phone'
  let H = stage.offsetHeight || innerHeight

  // ---- the places, measured: the name's flight from under the portrait, the portrait in the light, the light on the sentence ----
  let nameFrom = 'none'
  let ptAt12 = 'none'
  let spotFrom = 'none'
  // the screen's small height (svh): the phone's measure is capped by it (about.css --p)
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none'
  const measure = () => {
    kind = innerWidth >= 900 ? 'desk' : 'phone'
    H = stage.offsetHeight || innerHeight
    const g = kind === 'desk' ? DESK : PHONE
    const bw = box.offsetWidth
    const bh = box.offsetHeight
    // the box in the stage, and the portrait in the box (offsets: no transform is read)
    const bx = box.offsetLeft
    const by = box.offsetTop
    // the portrait at 12: at the centre on the desktop (at its left at rest), lower on a phone
    const dx = kind === 'desk' ? bw / 2 - (pt.offsetLeft + pt.offsetWidth / 2) : 0
    const dy = kind === 'desk' ? 0 : PHONE.ptY * bh
    ptAt12 = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
    // the name, small, centred beneath the portrait (its own size and place, measured: exact at any size)
    const s = g.nameScale
    const nx = bw / 2 - (name.offsetWidth * s) / 2 - name.offsetLeft
    const ny = g.nameY * bh - name.offsetTop
    nameFrom = `translate(${nx.toFixed(1)}px, ${ny.toFixed(1)}px) scale(${s})`
    // the hole of the light: 17 % of the storyboard's frame on the desktop (1 --u = the box's width / 100), 42 % of the phone's
    document.body.appendChild(probe)
    const svh = probe.offsetHeight || innerHeight
    probe.remove()
    const unit = kind === 'desk' ? bw / 100 : Math.min(innerWidth / 100, (0.4615 * svh) / 100)
    const hole = (kind === 'desk' ? 17 : 42) * unit
    spot.style.setProperty('--a-hole', `${hole.toFixed(1)}px`)
    // the light: from the sentence's (its centre and size on the stage, a little larger) onto the portrait's centre at 12
    const cx = bx + pt.offsetLeft + dx + pt.offsetWidth / 2
    const cy = by + pt.offsetTop + dy + pt.offsetHeight / 2
    const r = g.pool.r * innerWidth * g.grow
    spotFrom = `translate(${(stage.offsetWidth / 2 - cx).toFixed(1)}px, ${(g.pool.y * H - cy).toFixed(1)}px) scale(${(r / hole).toFixed(3)})`
  }

  // ---- flights: from where each layer is seen to where the phase wants it; kept on the element when they end ----
  const flights = new Map<Element, Animation>()
  const extra: Animation[] = []
  const settle = (el: HTMLElement, to: Keyframe) => Object.entries(to).forEach(([p, v]) => el.style.setProperty(p, String(v)))
  type Flight = { el: HTMLElement; to: Keyframe; ms: number; delay: number; easing: string }
  const fly = (el: HTMLElement, to: Keyframe, ms: number, delay = 0, easing = EASE, instant = false) => ({ el, to, ms, delay, easing, instant })
  // every starting point is read first, then every flight starts (reads between new animations made the browser recompute the page
  // between them: the Method's 122 ms frame, 2 Nov)
  const run = (list: (Flight & { instant: boolean })[]) => {
    const from = list.map(({ el, to, instant }) => {
      if (instant) return null
      const cs = getComputedStyle(el)
      const f: Keyframe = {}
      for (const p of Object.keys(to)) f[p] = p === 'transform' ? (cs.transform === 'none' ? 'none' : cs.transform) : cs.getPropertyValue(p)
      return f
    })
    list.forEach(({ el, to, ms, delay, easing, instant }, i) => {
      flights.get(el)?.cancel()
      flights.delete(el)
      if (instant) return settle(el, to)
      const a = el.animate([from[i] ?? {}, to], { duration: ms, delay, easing, fill: 'both' })
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
    [...flights.values(), ...extra].forEach((a) => {
      const t = a.effect?.getComputedTiming()
      const left = Number(t?.endTime ?? 0) - Number(a.currentTime ?? 0)
      if (left > ms) a.updatePlaybackRate(left / ms)
    })
  let passageEnds = 0

  // ---- the Method's words: they leave in order and come back, as the About's own flights; nothing of the Method is kept ----
  const methodWords: [HTMLElement | null | undefined, string, number, number][] = [
    [cta, 'translateY(60%)', 450, 0],
    [steps, 'translateY(40%)', 550, 100],
    [close, 'translateY(-6%)', 700, 350],
  ]
  const wordsOut = () =>
    methodWords.forEach(([el, t, ms, delay]) => {
      if (!el) return
      const a = el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: t }], { duration: ms, delay, easing: EASE, fill: 'both' })
      extra.push(a)
    })
  const wordsBack = (delay: number) => {
    extra.forEach((a) => {
      a.updatePlaybackRate(1)
      const el = (a.effect as KeyframeEffect | null)?.target as HTMLElement | null
      if (!el) return a.cancel()
      // from where they are seen, back to rest
      const cs = getComputedStyle(el)
      const b = el.animate([{ opacity: cs.opacity, transform: cs.transform }, { opacity: 1, transform: 'none' }], { duration: 900, delay, easing: EASE })
      a.cancel()
      b.onfinish = () => b.cancel()
    })
    extra.length = 0
  }

  // ---- holding the stage where it was while the light goes back (above 12 the section moves down with the page) ----
  let letGo = 0
  const holdWhileLeaving = (ms: number) => {
    clearTimeout(letGo)
    about.classList.add('a-leaving')
    letGo = window.setTimeout(() => about.classList.remove('a-leaving'), ms)
  }

  const show = (to: Phase, instant = false) => {
    const from = phase
    phase = to
    about.dataset.phase = to
    const L: ReturnType<typeof fly>[] = []
    const add = (...f: ReturnType<typeof fly>[]) => L.push(...f.map((x) => ({ ...x, instant })))
    const k = ORDER.indexOf(to as (typeof ORDER)[number])

    if (to === 'pre') {
      if (from === null || instant) {
        add(fly(stage, { opacity: '0' }, 0))
      } else {
        // back to the Method: the light leaves the portrait for the sentence first, then the room hands back to the Method's
        add(
          fly(spot, { transform: spotFrom }, 1600, 0, GLIDE),
          fly(frame, { opacity: '0' }, 900, 150),
          fly(name, { opacity: '0' }, 500),
          fly(stage, { opacity: '0' }, 900, 550),
        )
        holdWhileLeaving(1500)
        wordsBack(550)
      }
      release()
      return run(L)
    }

    // the layers of 12 — set where the passage starts when it comes from the Method
    const fromMethod = from === 'pre' && !instant
    if (fromMethod) {
      clearTimeout(letGo)
      about.classList.remove('a-leaving')
      // where the passage starts, at once: the portrait in its place in the dark, the light as large as the sentence's
      run([
        fly(pt, { transform: ptAt12 }, 0, 0, EASE, true),
        fly(frame, { opacity: '1' }, 0, 0, EASE, true),
        fly(dark, { opacity: '1' }, 0, 0, EASE, true),
        fly(spot, { transform: spotFrom }, 0, 0, EASE, true),
        fly(name, { transform: nameFrom, opacity: '0' }, 0, 0, EASE, true),
        fly(lit, { opacity: '0' }, 0, 0, EASE, true),
        // back up from 13 or 14 in one stroke, the story is still there: it goes at once, under the Method's room
        fly(role, { opacity: '0' }, 0, 0, EASE, true),
        fly(say, { opacity: '0', transform: 'translateY(5%)' }, 0, 0, EASE, true),
        fly(rule, { transform: 'scaleX(0)' }, 0, 0, EASE, true),
        fly(para, { opacity: '0' }, 0, 0, EASE, true),
        fly(credit, { opacity: '0' }, 0, 0, EASE, true),
        fly(next, { opacity: '0' }, 0, 0, EASE, true),
      ])
      wordsOut()
      passageEnds = performance.now() + 2300
    }

    if (k === 0) {
      if (fromMethod) {
        add(
          fly(stage, { opacity: '1' }, 800, 900),
          fly(spot, { transform: 'none' }, 1800, 200, GLIDE),
          fly(name, { opacity: '0.92' }, 1000, 1300),
        )
      } else {
        // back from 13: the words go first, then the portrait returns to the light
        add(
          fly(stage, { opacity: '1' }, 0),
          fly(role, { opacity: '0' }, 450),
          fly(say, { opacity: '0', transform: 'translateY(5%)' }, 450),
          fly(credit, { opacity: '0' }, 450),
          fly(rule, { transform: 'scaleX(0)' }, 450),
          fly(para, { opacity: '0' }, 450),
          fly(next, { opacity: '0' }, 450),
          fly(lit, { opacity: '0' }, 1200, 200),
          fly(dark, { opacity: '1' }, 1200, 200),
          fly(frame, { opacity: '1' }, 300),
          fly(spot, { transform: 'none' }, 0),
          fly(pt, { transform: ptAt12 }, 1300, 200, GLIDE),
          fly(name, { transform: nameFrom, opacity: '0.92' }, 1300, 200, GLIDE),
        )
      }
      return run(L)
    }

    // 13 and 14: the room comes up (when arriving at 13 from 12, or straight to 14 from a jump)
    if (instant || from === null || from === 'pre' || from === '12') {
      const rush = from === 'pre' && !instant // reached 13 while 12 had not been seen: no delays
      add(
        fly(stage, { opacity: '1' }, rush ? 500 : 0),
        fly(frame, { opacity: '1' }, 0),
        fly(lit, { opacity: '1' }, 1600),
        fly(dark, { opacity: '0' }, 1400),
        fly(pt, { transform: 'none' }, 1400, 0, GLIDE),
        fly(name, { transform: 'none', opacity: '1' }, 1500, 0, GLIDE),
        fly(role, { opacity: '0.7' }, 1000, rush ? 400 : 1300),
        fly(say, { opacity: '1', transform: 'none' }, 1100, rush ? 400 : 1300),
        // on a phone the credit sits under the portrait and comes with the room (storyboard 13); on the desktop with the story (14)
        ...(kind === 'phone' ? [fly(credit, { opacity: '0.6' }, 1000, 400)] : []),
      )
    }
    if (to === '13' && from === '14') {
      add(
        fly(rule, { transform: 'scaleX(0)' }, 450),
        fly(para, { opacity: '0' }, 450),
        fly(next, { opacity: '0' }, 450),
        ...(kind === 'desk' ? [fly(credit, { opacity: '0' }, 450)] : []),
      )
    }
    if (to === '14') {
      const after = from === '13' ? 0 : 900 // straight from 12: the story waits for the room
      add(
        fly(rule, { transform: 'none' }, 1200, after + 300),
        fly(para, { opacity: '1' }, 1000, after + 200),
        fly(credit, { opacity: '0.6' }, 1000, after + (kind === 'desk' ? 500 : 400)),
        fly(next, { opacity: '0.7' }, 1000, after + 600),
      )
    }
    run(L)
  }

  // ---- the phase under the scroll, once a frame, with the dead band; 12's passage is played whole, or hurried ----
  let wake = 0
  const progress = () => -about.getBoundingClientRect().top / H
  const choose = () => {
    const p = progress()
    if (p < 0) {
      if (phase === null || (phase !== 'pre' && p < -BAND)) show('pre', phase === null)
      return
    }
    let at: (typeof ORDER)[number] = '12'
    ORDER.forEach((ph) => p >= STARTS[ph] && (at = ph))
    if (phase === null) return show(at, true)
    if (phase === 'pre') return show(at)
    const cur = ORDER.indexOf(phase as (typeof ORDER)[number])
    const nxt = ORDER.indexOf(at)
    // scrolled on before the passage has covered the Method, or towards 13 while it plays: it ends quickly, and only then does 13 answer
    if (phase === '12' && performance.now() < passageEnds && (p >= HURRY_AT || nxt > cur)) {
      hurry()
      passageEnds = Math.min(passageEnds, performance.now() + HURRY_MS)
      if (nxt > cur) {
        clearTimeout(wake)
        wake = window.setTimeout(frameChoose, HURRY_MS + 20)
      }
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
    requestAnimationFrame(() => scrollTo({ top: scrollY + about.getBoundingClientRect().top + (STARTS['14'] + 0.08) * H, behavior: 'auto' }))
  }
  stage.addEventListener('focusin', onFocus)

  // a real change of size measures again and puts everything in place at once (the address bar alone does not)
  let sized = innerWidth
  const onResize = () => {
    if (innerWidth === sized && Math.abs((stage.offsetHeight || innerHeight) - H) < 120) return
    sized = innerWidth
    measure()
    if (phase) show(phase, true)
  }

  measure()
  about.classList.add('a-live')
  choose()
  addEventListener('scroll', frameChoose, { passive: true })
  addEventListener('resize', onResize)
  // the face changes the name's width: measured again once it is there
  document.fonts?.ready.then(() => {
    measure()
    if (phase) show(phase, true)
  })

  return () => {
    clearTimeout(wake)
    clearTimeout(letGo)
    cancelAnimationFrame(raf)
    removeEventListener('scroll', frameChoose)
    removeEventListener('resize', onResize)
    stage.removeEventListener('focusin', onFocus)
    flights.forEach((a) => a.cancel())
    extra.forEach((a) => a.cancel())
    about.classList.remove('a-live', 'a-leaving')
  }
}
