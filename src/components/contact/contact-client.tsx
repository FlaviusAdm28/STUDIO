'use client'

import { useEffect } from 'react'
import { cenasOn, registerScene, type How } from '@/lib/conductor'
import { fingerDown, onWheelStroke, watchFinger } from '@/lib/finger'
import { bandColour, hex, over, SAFARI_BAR_LIFT, underSafariBar, type Rgb } from '@/lib/top-colour'

// the room's own dark (contact.css .contact, .c-veil)
const ROOM_RGB: Rgb = [27, 28, 26]

type Props = {
  film: { wide: string; tall: string }
  time: string
  cta: string
  ctaNamed: string
  signature: string
  signatureNamed: string
}

/*
  What the Contact does once the page is live (states 19–21):
  - the film: the entrance's own file (the same URL, so the browser's cache serves it), asked for only as the Contact comes near, played
    only while the Contact is on the screen and paused when it leaves. Never with reduced motion or Save-Data: the poster stays.
  - the line of the times: the arrival kept by the entrance script (window.__c1) and the clock, written as the Contact comes near and
    kept to the minute while it is seen.
  - the name given in the Method (Make it yours): Talk to us, Ana · Built around Ana.
  - the passage (E of the storyboard saida-mascara, revising #106): the light going down, the film coming on, the question coming in.
*/
export function ContactClient({ film, time, cta, ctaNamed, signature, signatureNamed }: Props) {
  useEffect(() => {
    const section = document.getElementById('contact')
    if (!section) return
    const video = section.querySelector<HTMLVideoElement>('.c-film')
    const line = section.querySelector<HTMLElement>('.c-time')
    const word = section.querySelector<HTMLElement>('.c-cta-w')
    const sig = section.querySelector<HTMLElement>('.c-sig-w')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const filmOk = !!video && !reduce && !connection?.saveData
    // driven by the conductor (lib/conductor.ts, `?cenas`; step 4, 22 Nov): told which stop the page is on, never reading the scroll for the
    // passage (below, registerScene)
    const driven = cenasOn()
    const c1 = () => (window as Window & { __c1?: { arrival?: { time: number }; name?: string } }).__c1

    const pad = (n: number) => String(n).padStart(2, '0')
    const hhmm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`
    let shown = ''
    const write = () => {
      const arrival = c1()?.arrival?.time
      if (line) {
        const text = time.replace('{arrived}', hhmm(new Date(arrival ?? Date.now()))).replace('{now}', hhmm(new Date()))
        if (text !== shown) {
          shown = text
          line.textContent = text
          line.hidden = false
        }
      }
      const name = c1()?.name
      if (word) word.textContent = name ? ctaNamed.replace('{name}', name) : cta
      if (sig) sig.textContent = name ? signatureNamed.replace('{name}', name) : signature
    }

    // near: a screen away — the film asked for, the words written
    let loaded = false
    const near = new IntersectionObserver(
      (es) => {
        if (!es[es.length - 1].isIntersecting) return
        write()
        if (filmOk && video && !loaded) {
          loaded = true
          video.muted = true
          video.src = matchMedia('(orientation: portrait)').matches ? film.tall : film.wide
          video.addEventListener('playing', () => section.classList.add('c-playing'), { once: true })
        }
      },
      { rootMargin: '100% 0px 100% 0px' },
    )
    near.observe(section)

    // the scene's way up as the colophon comes in (contact.css, a phone): the colophon covers its own height of the screen at the page's end,
    // so the line, the action and the handle go up by what they would leave under it, and a little air
    const now = section.querySelector<HTMLElement>('.c-now')
    const colophon = section.querySelector<HTMLElement>('.colophon')
    const measure = () => {
      if (!now || !colophon) return
      // from the scene's top (the scene is the line's positioned parent): where the action and the handle end; the screen's height is
      // CSS's (100svh, the smallest)
      section.style.setProperty('--c-below', `${Math.round(now.offsetTop + now.offsetHeight)}px`)
      section.style.setProperty('--c-colo', `${Math.round(colophon.offsetHeight)}px`)
    }
    const sized = new ResizeObserver(measure)
    if (colophon) sized.observe(colophon)
    if (now) sized.observe(now)
    measure()

    // the passage, E of the storyboard saida-mascara (owner, 10 Nov; revises #106): the questions go, the paper's light goes down where it
    // is to near black, then the film comes on over the dark (the Contact a layer of its own, in front: on an iPhone that is what Safari
    // takes under the Dynamic Island and its bar), then the question, then the line and Talk to us. One progress, 0 (the Questions) to 1
    // (the Contact), drives every layer by the storyboard's own ramps, so a turn midway carries on from where it is and the layers never
    // mix out of order. It runs on by the clock once a stroke has taken the Contact's start past the middle of the screen (back once it is
    // below 0.7 of it: the gap keeps a resting finger from flipping it): 3 s on (the storyboard's), 1.2 s back; and four times as fast while
    // the page has gone on well past either stop, so the colophon never comes up over a passage half done, nor the About over a paper
    // half dark. Drawn a frame at a time by this script, opacity and a short rise: neither CSS transitions (iOS cut them here) nor Web
    // Animations (begun in the stop's momentum, iOS kept them at 0, Simulator, 10 Nov)
    const root = document.documentElement
    const questions = document.getElementById('questions')
    const start = section.querySelector('.c-start')
    const dim = questions?.querySelector<HTMLElement>('.q-dim')
    const box = questions?.querySelector<HTMLElement>('.q-box')
    const room = section.querySelector<HTMLElement>('.c-room')
    const ask = section.querySelector<HTMLElement>('.c-ask')
    const words = section.querySelector<HTMLElement>('.c-now')
    const layers = [dim, box, room, ask, words].filter(Boolean) as HTMLElement[]
    const ON_MS = 3000
    // back 1.2 s (was 2 s): the questions are there as the page comes to rest. At 2 s the page rested at the Questions' stop at 1.0 s and
    // their questions came at 1.8 s: ~0.75 s of empty paper, where a second stroke took the page on to the About and the Questions were
    // never seen (owner, 11 Nov: "passo do contact para o about e ele fecha logo o questions"; measured in the Simulator, finger strokes)
    const BACK_MS = 1200
    const clamp = (v: number) => Math.min(1, Math.max(0, v))
    const ramp = (x: number, a: number, b: number) => clamp((x - a) / (b - a))
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    // the site's own ease for words coming in (questions.css --q-ease, cubic-bezier(0.2, 0.7, 0.2, 1)): quick to start, a long settle.
    // The Contact's words came in on the in-and-out ease above, three times the mean speed at their middle, and read as abrupt next to the
    // rest of the site (owner, 13 Nov: "muito bruscas e não smooth elegante como o resto do site")
    const settleIn = (() => {
      const [x1, y1, x2, y2] = [0.2, 0.7, 0.2, 1]
      const at = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
      return (x: number) => {
        if (x <= 0 || x >= 1) return Math.min(1, Math.max(0, x))
        let lo = 0
        let hi = 1
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2
          if (at(x1, x2, mid) < x) lo = mid
          else hi = mid
        }
        return at(y1, y2, (lo + hi) / 2)
      }
    })()
    // iOS Safari paints the Dynamic Island's band and the band under its bar with the page's colour (sequence.ts paintEdges). Through the
    // passage they are drawn here, a frame at a time, as the colour really at the screen's top: the paper (#dcd5c8, the Questions' edge),
    // its dim (#141412) over it, the room (#1b1c1a, the Contact's edge) over both. Left to a timed CSS fade they ran ahead of the paper:
    // the island went dark 0.35 s before it on the way in, and was light again a whole second before the paper on the way back (owner's
    // iPhone, 11 Nov 13:43, measured frame by frame). Costs what the fade did (the page's background repainted each frame, iOS only)
    const ios = CSS.supports('-webkit-touch-callout', 'none')
    // and desktop Safari, whose tab bar takes the page's colour at once (sequence.ts tinted, 22 Nov): led by the dusk's timed glide there,
    // the bar went dark 0.27 s before the paper, its first frame a step of 59 (on screen, Safari 27.2)
    const desk = !ios && matchMedia('(hover: hover) and (pointer: fine)').matches
    const tinted = desk && /Apple/.test(navigator.vendor)
    // The bar's islands take their darkness from the brightness behind them (bar-client.tsx, data-lum). Flipped at the dusk's start, the
    // Questions' brightness said the room's 0.5 s before the paper went dark: the islands cleared over a paper still light, and desktop
    // Safari, whose tab bar takes them in, cleared with them, 185 → 222, before going dark (on screen, 22 Nov). On a desktop it follows
    // the dusk as drawn (the phone keeps the flip: the islands read again at every change, 24 hit tests, on the Xiaomi)
    const lumAt = (d: number, r: number) => {
      if (!desk || !questions) return
      const v = (0.8 + (0.1 - 0.8) * Math.max(d, r)).toFixed(2)
      if (questions.dataset.lum !== v) questions.dataset.lum = v
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    const PAPER = [220, 213, 200]
    const DIM = [20, 20, 18]
    const ROOM = [27, 28, 26]
    // the room at the screen's top: the poster through the veil (contact.css). A phone's Chrome across the top's middle; desktop Safari
    // across the whole width, in eight parts — its tab bar spans the window (see the edge read where the page settles, below)
    const poster = section.querySelector<HTMLImageElement>('.c-poster img')
    const veil = section.querySelector<HTMLElement>('.c-veil')
    const roomTop = (): Rgb | null => {
      if (!poster || !veil) return null
      const r = poster.getBoundingClientRect()
      const v = veil.getBoundingClientRect()
      if (r.top > 0 || r.bottom < 4) return null
      const parts = tinted ? 8 : 1
      const sum = [0, 0, 0]
      for (let i = 0; i < parts; i++) {
        const x0 = tinted ? (innerWidth * i) / parts : innerWidth * 0.3
        const x1 = tinted ? (innerWidth * (i + 1)) / parts : innerWidth * 0.7
        const c = bandColour(poster, { w: r.width, h: r.height }, { x0: x0 - r.left, x1: x1 - r.left, y0: -r.top, y1: 4 - r.top })
        if (!c) return null
        // the veil's dark there: radial-gradient(70% 60% at 50% 45%), 0.72 at its centre to 0.9 at its rim (contact.css)
        const d = Math.hypot(((x0 + x1) / 2 - v.left - 0.5 * v.width) / (0.7 * v.width), (-v.top - 0.45 * v.height) / (0.6 * v.height))
        over(c, ROOM_RGB, 0.72 + 0.18 * Math.min(1, d)).forEach((x, k) => (sum[k] += x / parts))
      }
      return [sum[0], sum[1], sum[2]]
    }
    // desktop Safari: the room as it is at the top, across the width (roomTop), where its passage ends — the flat room was ~10
    // levels under the top there, the film's sky through the veil (on screen, 23 Nov)
    let deskRoom: Rgb | null = null
    const edges = (d: number, r: number) => {
      const s = root.dataset.section
      if (!(ios || tinted) || (s !== 'questions' && s !== 'contact')) return
      const end = (tinted && deskRoom) || ROOM
      const c = PAPER.map((p, i) => Math.round((p + (DIM[i] - p) * d) * (1 - r) + end[i] * r))
      const css = (v: number[]) => `#${v.map((x) => x.toString(16).padStart(2, '0')).join('')}`
      const colour = css(c)
      // the strip of the page above the viewport that desktop Safari's glass shows (lib/conductor.ts feed): painted here too, or the bar
      // kept the colour the passage began with — 61 over the Contact's 36, and 185 over the Questions' paper on the way back (on screen)
      const feed = document.getElementById('c1-feed')
      // desktop Safari: body and the strip 8 levels darker, so its bar is the colour itself (lib/top-colour.ts underSafariBar, sequence.ts);
      // without the strip none at the Questions (the About's dark above the viewport does it there, sequence.ts barInk), in with the room
      const ink = tinted ? css(underSafariBar(c, feed ? SAFARI_BAR_LIFT : SAFARI_BAR_LIFT * r)) : colour
      root.style.transition = 'none'
      document.body.style.transition = 'none'
      root.style.backgroundColor = colour
      document.body.style.backgroundColor = ink
      themeMeta?.setAttribute('content', colour)
      if (feed) feed.style.background = ink
    }
    // the storyboard's E (saida-mascara render, 'e'), at progress x
    const draw = (x: number) => {
      // the question over ~0.9 s of the 3, its line and the action after it (~0.8 s), each rising a little — as the Questions' words come
      // (0.9 s and 0.6 s, a 5 % rise): it was 0.66 s and 0.54 s, from 4 % of the screen (~30 px)
      const rise = innerHeight * 0.02
      const a = settleIn(ramp(x, 0.56, 0.86))
      const b = settleIn(ramp(x, 0.72, 0.98))
      const d = 0.97 * ease(ramp(x, 0.06, 0.46))
      const r = ease(ramp(x, 0.42, 0.7))
      edges(d, r)
      lumAt(d, r)
      if (box) box.style.opacity = String(1 - ease(ramp(x, 0, 0.2)))
      if (dim) dim.style.opacity = String(d)
      if (room) room.style.opacity = String(r)
      if (ask) {
        ask.style.opacity = String(a)
        ask.style.translate = `0 ${((1 - a) * rise).toFixed(1)}px`
      }
      if (words) {
        words.style.opacity = String(b)
        words.style.translate = `0 ${((1 - b) * rise).toFixed(1)}px`
      }
      layers.forEach((el) => (el.style.visibility = 'visible'))
    }
    // at rest the CSS holds the state (.c-dusk): the script's own values go
    const settle = () => layers.forEach((el) => ['opacity', 'translate', 'visibility'].forEach((k) => el.style.removeProperty(k)))
    let x = root.classList.contains('c-dusk') ? 1 : 0
    let target = x
    let last = 0
    let runRaf = 0
    let hurry = false
    const run = (now: number) => {
      runRaf = 0
      const dt = Math.min(64, last ? now - last : 16)
      last = now
      // on the way back, the stretch between the question gone (0.56) and the questions back (0.2) — the room fading, the paper lighting —
      // three times as fast: at the pace of the rest it was ~0.5 s of dark with nothing in it (owner's iPhone, 12 Nov 23:52; Simulator,
      // 0.6 s between the question gone and the questions back, 13 Nov). The same order of the layers; back ~0.9 s in all (owner, 13 Nov)
      const empty = target < x && x > 0.2 && x < 0.56 ? 3 : 1
      const speed = (hurry ? 4 : 1) * empty
      x = target > x ? Math.min(target, x + (dt / ON_MS) * speed) : Math.max(target, x - (dt / BACK_MS) * speed)
      if (x === target) {
        last = 0
        // the edges end exactly on the stop's own colour (x 0: the paper's, 1: the room's), the one sequence.ts holds for it
        edges(x ? 1 : 0, x ? 1 : 0)
        lumAt(x ? 1 : 0, x ? 1 : 0)
        delete root.dataset.cRun
        settle()
        return
      }
      draw(x)
      runRaf = requestAnimationFrame(run)
    }
    // the hold of the way back (method.css, data-c-hold): while the light comes up again on the Questions a stroke back rests on their stop,
    // as at the Method's 7, the About's 12 and 14. Without it a second stroke within the 1.2 s took the page on to the About and the
    // Questions were never seen (owner's iPhone, 12 Nov: "como não há paragem obrigatória no questions eu posso acabar por parar no about";
    // Simulator, two finger strokes 0.6–1.4 s apart: 14 every time). It ends at the first rest once the way back is over: by the clock
    // alone a trackpad's long momentum outlived it and went on to 14 (Safari 27.2). And it lets go with the snapping off for a frame and
    // the page put where it is: Safari on a Mac keeps the stop it rests on by its rank among the marks, and the Questions' stop was the
    // 1st while those above were gone — given them back as they were, it went to the 1st of all, the Method's (Safari 27.2, 4 of 4)
    watchFinger()
    let holding = false
    let movedAt = 0
    let holdRaf = 0
    const startHold = () => {
      holding = true
      root.dataset.cHold = ''
      if (!holdRaf) holdRaf = requestAnimationFrame(watchHold)
    }
    // a jump of the site's own (the menu, an address: lib/unsnapped.ts, lib/address.ts) is never held: begun from the Contact to the About,
    // the hold took it to the Questions' stop as the snapping came back (Chrome and Safari, 12 Nov)
    const jumping = () => root.dataset.jump !== undefined || root.style.scrollSnapType === 'none'
    const watchHold = (now: number) => {
      holdRaf = 0
      if (!holding) return
      if (jumping()) {
        holding = false
        delete root.dataset.cHold
        return
      }
      // a finger resting on the screen is a stroke not yet over
      if (runRaf || now - movedAt < 250 || fingerDown()) {
        holdRaf = requestAnimationFrame(watchHold)
        return
      }
      letGo()
    }
    const letGo = () => {
      holding = false
      const y = scrollY
      root.style.scrollSnapType = 'none'
      delete root.dataset.cHold
      requestAnimationFrame(() => {
        scrollTo({ top: y, behavior: 'instant' })
        root.style.scrollSnapType = ''
      })
    }
    // the hold of the way in (method.css, data-c-on): while the light goes down a stroke onwards rests on the Contact's stop again, as the
    // way back's rests on the Questions'. It ends at the first rest once the way in is over (a finger on the glass, or a trackpad's
    // momentum, is a stroke not yet over), or at once if the way turns back. Only marks below the page come and go: no snapping off for it
    let onward = false
    let onRaf = 0
    const endOn = () => {
      onward = false
      cancelAnimationFrame(onRaf)
      onRaf = 0
      delete root.dataset.cOn
    }
    const watchOn = (now: number) => {
      onRaf = 0
      if (!onward) return
      if (jumping() || target !== 1) return endOn()
      if (runRaf || now - movedAt < 250 || fingerDown()) {
        onRaf = requestAnimationFrame(watchOn)
        return
      }
      endOn()
    }
    // Both holds also let go at a new stroke of a wheel or a trackpad once their way is over (lib/finger.ts onWheelStroke): with strokes one
    // after another the page never rested, and each stroke was taken back to the same stop — onwards to the Contact's ~7 s (Chrome, 14 Nov:
    // "vários scroll normal não abriram o built around you"), back to the Questions' 5 s, one stroke up even pulled forward to it (Chrome
    // and Safari: "não foi possível fechar o questions"). The stroke under way as the way ends (its momentum) is still held, as before. A
    // finger is left as it was (phone, approved): a touch begun during iOS's momentum is not told to the page
    const offWheel = onWheelStroke(() => {
      if (runRaf || jumping()) return
      if (onward) endOn()
      if (holding) letGo()
    })
    const go = (to: number, now = false) => {
      target = to
      // reduced motion, and a jump of the site's own (the menu, an address: data-jump; or one the conductor says): the light is down, or up,
      // at once — a jump lands on the scene as it rests (owner, 13 Nov: "deve apenas navegar para a zona da página sem mais nada a
      // construir"; the menu to 05 Contact played the light going down and the question 1.3–2 s after it had gone)
      if (reduce || now || root.dataset.jump !== undefined) {
        cancelAnimationFrame(runRaf)
        runRaf = 0
        last = 0
        delete root.dataset.cRun
        x = to
        // a jump's edges are painted for where it goes (sequence.ts): painted here, the paper's stone stayed over the Work or the Method
        // after the menu from the Contact (Simulator, 13 Nov)
        if (reduce) edges(to, to)
        settle()
        return
      }
      // the holds are the browser's snapping's (the conductor's page has none: it holds the strokes itself, busyUntil below)
      if (driven) {
        // nothing to hold
      } else if (to && x < 1 && !onward && !jumping()) {
        onward = true
        root.dataset.cOn = ''
        if (!onRaf) onRaf = requestAnimationFrame(watchOn)
      } else if (!to && onward) endOn()
      if (!driven && !to && x > 0 && !holding && !jumping()) startHold()
      if (!runRaf && x !== target) {
        if (tinted) deskRoom = roomTop() ?? deskRoom
        // sequence.ts leaves the edges to the passage while this is set (not in its watched attributes: setting it changes nothing there)
        root.dataset.cRun = ''
        draw(x)
        last = 0
        runRaf = requestAnimationFrame(run)
      }
    }
    let raf = 0
    // how far the page is from the Questions' stop (0) to the Contact's (1): the Contact's start is at the screen's top at its stop, and as
    // far below it at the Questions' (on an iPhone the Questions stop 70 px further, their --q-lift)
    const lift = () => (questions ? parseFloat(getComputedStyle(questions).getPropertyValue('--q-lift')) || 0 : 0)
    let qLift = lift()
    let lastF = NaN
    // 21, played: the colophon comes in and the scene draws up for it (contact.css --c-in, 0 → 1 eased) in their own time as the page goes
    // on to its end, and back as it leaves. Drawn by the scroll they went at the speed of the stroke — on a phone iOS's stop, most of its
    // way in its first tenth of a second — and read as abrupt (owner, 13 Nov: "o texto do contact … e o colofão todo"). A frame at a time
    // here, as the passage: iOS cuts CSS transitions begun in the stop's momentum (above)
    const IN_MS = 1100
    const OUT_MS = 700
    let cin = 0
    let cinTarget = 0
    let cinRaf = 0
    let cinLast = 0
    let cinRead = false
    const paintIn = () => section.style.setProperty('--c-in', settleIn(cin).toFixed(4))
    const runIn = (now: number) => {
      cinRaf = 0
      const dt = Math.min(64, cinLast ? now - cinLast : 16)
      cinLast = now
      cin = cinTarget > cin ? Math.min(1, cin + dt / IN_MS) : Math.max(0, cin - dt / OUT_MS)
      paintIn()
      if (cin !== cinTarget) cinRaf = requestAnimationFrame(runIn)
      else cinLast = 0
    }
    const watchIn = () => {
      if (!colophon) return
      const top = colophon.getBoundingClientRect().top
      // in as soon as it shows at the screen's foot, out once it is all below it again (at a fifth of a screen in, it had slid up unseen
      // for ~0.6 s of the stroke, Simulator, 13 Nov)
      const next = top < innerHeight * 0.97 ? 1 : top > innerHeight ? 0 : cinTarget
      // the first reading, and with reduced motion: in place at once (a reload at the page's end)
      if (!cinRead || reduce) {
        cinRead = true
        cin = cinTarget = next
        paintIn()
        return
      }
      if (next === cinTarget) return
      cinTarget = next
      if (!cinRaf) cinRaf = requestAnimationFrame(runIn)
    }
    const place = () => {
      raf = 0
      watchIn()
      // with the conductor the passage is told (registerScene): only the colophon follows the page, which the conductor glides to the end
      if (driven || !start || !questions) return
      const top = start.getBoundingClientRect().top
      const span = top - (questions.getBoundingClientRect().top + qLift)
      const f = span > 0 ? 1 - top / span : 1
      const was = root.classList.contains('c-dusk')
      const df = f - lastF
      lastF = f
      // the passage begins as soon as a stroke has taken the page a little way from either stop (0.15 of the way; with a finger still on
      // the glass, halfway, below), towards the other, so
      // a slow one sees it answer at once: begun only with the Contact's start halfway up the screen, a slow or short stroke from the
      // Questions' stop moved nothing at all for half a screen (their paper and their questions are held there) and went back to it
      // (Simulator, 10 Nov). Between, the way the page is going decides; near a stop, the stop does (a jump, a finger resting there)
      // With a finger on the glass, only halfway — where the page will rest on the other stop: a slow drag to read an open answer passed
      // the 0.15 and the questions faded out and back as the stop took the page back (owner's iPhone, 12 Nov 23:53; Simulator, 220 pt drag
      // held before lifting: the questions down to 0.01, 13 Nov). Once the finger is off, the way the page goes decides, as before
      // (owner, 13 Nov). A mouse or a trackpad has no finger here: as before
      let dusk = was
      if (fingerDown()) {
        if (!was && f >= 0.5) dusk = true
        else if (was && f < 0.5) dusk = false
      } else if (f >= 0.85) dusk = true
      else if (f <= 0.15) dusk = false
      else if (df > 0.002) dusk = true
      else if (df < -0.002) dusk = false
      // gone on well past a stop while the passage runs: past the Contact's towards the colophon, or above the Questions' own
      hurry = dusk ? f > 1.25 : f < -0.25
      if (dusk !== was) {
        root.classList.toggle('c-dusk', dusk)
        // the bar reads the brightness behind it from the section there (data-lum): once the light is down it is the dark, not the
        // Questions' paper (their section is still the one under the bar)
        if (questions && !desk) questions.dataset.lum = dusk ? '0.1' : '0.8'
        go(dusk ? 1 : 0)
      }
    }
    const onScroll = () => {
      movedAt = performance.now()
      if (!raf) raf = requestAnimationFrame(place)
    }
    // with the conductor, it says where the page is once it has laid out its stops (a reload down the page: a jump there); the colophon
    // reads its place now (a reload at the page's end: the conductor need not move the page, and no scroll would come)
    if (driven) watchIn()
    else place()
    if (questions) questions.dataset.lum = root.classList.contains('c-dusk') ? '0.1' : '0.8'
    root.classList.add('c-live')
    // The page's end as Safari brings its bar out: the screen 40 px shorter, the page has 40 px more to go. The page's last stop follows
    // the screen's height (about-stage.ts footMark) and the browser takes the page there itself: the colophon goes up with the bar and a
    // stroke more has nothing left to move (owner's iPhone, 12 Nov 23:53: "um 3.º scroll que puxa tudo para cima"; 13 Nov: the colophon
    // as a footer, going up with the bar). Taken there from here too (scrollTo, 13 Nov), it cut into the browser's own way there, and
    // iOS kept the next tap to end a scroll that was over: the menu opened at the second tap (owner's iPhone, 14 Nov; Simulator: 0
    // events at the first tap with it, 15 without)
    const onResize = () => {
      qLift = lift()
      onScroll()
    }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onResize)

    // Driven by the conductor (step 4, 22 Nov), as the About: the light is down at the Contact's stop and below (the page's end), up above
    // it — played, or at once for a jump. The page goes from the Questions' stop to the Contact's at once, unseen (conductor.ts HELD): the
    // paper, the questions and the Contact's room and scene are held on the screen between the two (measured at 26 viewports, 22 Nov), so
    // the passage answers the stroke itself instead of a 0.6–1 s glide of nothing moving. It says how long its passage must still play:
    // on the way in, a stroke on to the colophon waits until the line and Talk to us are seen (SEEN, as the Method's phase changes: owner,
    // 22 Nov, "no 10 espera pelas 3"); on the way back, a stroke on up waits until the questions are back. A stroke the other way turns the
    // passage back from where it is (it was made so). Its barriers (the Questions, the Contact) are the conductor's
    const SEEN = 0.95
    // the passage's x at which a layer is seen (its value SEEN): the words (b, 0.72–0.98, settleIn) on the way in, the box (1 − its fade,
    // 0–0.2, ease) on the way back
    const solve = (f: (t: number) => number, v: number) => {
      let lo = 0
      let hi = 1
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2
        if (f(mid) < v) lo = mid
        else hi = mid
      }
      return (lo + hi) / 2
    }
    const IN_SEEN = 0.72 + 0.26 * solve(settleIn, SEEN)
    const BACK_SEEN = 0.2 * solve(ease, 1 - SEEN)
    // ms from x down to `to` on the way back: the empty stretch (0.2–0.56) three times as fast (run)
    const backMs = (from: number, to: number) => {
      const fast = Math.max(0, Math.min(from, 0.56) - Math.max(to, 0.2))
      return BACK_MS * (from - to - fast + fast / 3)
    }
    const belowContact = (stop: string) => stop === 'contact' || stop === 'end'
    const unregister = driven
      ? registerScene({
          name: 'contact',
          to: (stop: string, how: How) => {
            const dusk = belowContact(stop)
            // The box of questions where it was at the Questions' stop while it fades: put on the Contact's stop at once, it was pushed up
            // by its section's end where the closed list is taller than the screen (a window under 900 px: 22 px at 375 × 667, 37 at
            // 320 × 640), where the screen goes over its frame (64 px at 1024 × 768 before questions.css held it). At the Questions' stop it
            // rests on its sticky top; at rest at the Contact it is gone (settle clears this)
            if (box) {
              box.style.removeProperty('translate')
              if (dusk && how === 'play' && x < 0.2) {
                const dy = parseFloat(getComputedStyle(box).top) - box.getBoundingClientRect().top
                if (dy > 0.5) box.style.translate = `0 ${dy.toFixed(1)}px`
              }
            }
            if (dusk === root.classList.contains('c-dusk')) return
            root.classList.toggle('c-dusk', dusk)
            go(dusk ? 1 : 0, how === 'jump')
          },
          busyUntil: (next: string) => {
            if (!runRaf) return 0
            const now = performance.now()
            if (target === 1 && next === 'end' && x < IN_SEEN) return now + (IN_SEEN - x) * ON_MS
            if (target === 0 && !belowContact(next) && x > BACK_SEEN) return now + backMs(x, BACK_SEEN)
            return 0
          },
        })
      : () => {}

    // The colour at the screen's top for Chrome's bar on Android (theme-color, entrance/sequence.ts: data-edge): the poster through the
    // veil, where the page has settled. The room's flat #1b1c1a was 13–23 levels darker than what is there — the film's sky lets ~15 %
    // through at the top (Xiaomi, 13 Nov: the bar #1b1c1a over #2a2a25 at the stop, #222521 at the end). Not on an iPhone: there the
    // same colour is also the band under Safari's bar, over the colophon's own #1b1c1a. The film moves over its poster; the poster is
    // its frame, read once per stop. The warm light (.c-veil's first gradient) is low in the room and never reaches the top.
    // Desktop Safari too, across the whole width in eight parts: its tab bar spans the window (the flat room was ~10 levels under the top's
    // 31 … 37 there, on screen, 23 Nov); a phone's Chrome across the top's middle
    let edgeLater = 0
    const readEdge = () => {
      if (root.dataset.section !== 'contact') return
      const c = roomTop()
      if (!c) return
      if (tinted) deskRoom = c
      section.dataset.edge = hex(c)
    }
    const onSettle = () => {
      clearTimeout(edgeLater)
      edgeLater = window.setTimeout(readEdge, 150)
    }
    // only where the colour is seen: a phone's Chrome (theme-color) and desktop Safari (its tab bar); Chrome's desktop toolbar never takes it
    if (!ios && (tinted || matchMedia('(hover: none) and (pointer: coarse)').matches)) {
      addEventListener('scroll', onSettle, { passive: true })
      poster?.addEventListener('load', onSettle)
      onSettle()
    }

    // seen: the film plays, the minute is kept — once the Contact's start is on the screen
    let clock = 0
    const seen = new IntersectionObserver((es) => {
      const e = es[es.length - 1]
      clearInterval(clock)
      if (e.isIntersecting) {
        write()
        clock = window.setInterval(write, 15000)
        if (filmOk && video?.src) video.play().catch(() => {})
      } else video?.pause()
    }, { rootMargin: '0px 0px -15% 0px' })
    // from the Contact's own start, well into the screen (the passage on): the section begins two screens earlier, under the Questions'
    // paper, where the film played unseen behind it; and at the Questions' own stop the start lies a few pixels above the screen's foot
    // (Xiaomi, 10 Nov)
    seen.observe(start ?? section)

    return () => {
      near.disconnect()
      seen.disconnect()
      sized.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onResize)
      removeEventListener('scroll', onSettle)
      poster?.removeEventListener('load', onSettle)
      clearTimeout(edgeLater)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(runRaf)
      cancelAnimationFrame(holdRaf)
      cancelAnimationFrame(cinRaf)
      offWheel()
      unregister()
      box?.style.removeProperty('translate')
      section.style.removeProperty('--c-in')
      endOn()
      settle()
      root.classList.remove('c-live', 'c-dusk')
      delete root.dataset.cRun
      delete root.dataset.cHold
      clearInterval(clock)
      video?.pause()
    }
  }, [film, time, cta, ctaNamed, signature, signatureNamed])
  return null
}
