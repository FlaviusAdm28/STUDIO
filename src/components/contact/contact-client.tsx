'use client'

import { useEffect } from 'react'
import { fingerDown, watchFinger } from '@/lib/finger'

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
    // iOS Safari paints the Dynamic Island's band and the band under its bar with the page's colour (sequence.ts paintEdges). Through the
    // passage they are drawn here, a frame at a time, as the colour really at the screen's top: the paper (#dcd5c8, the Questions' edge),
    // its dim (#141412) over it, the room (#1b1c1a, the Contact's edge) over both. Left to a timed CSS fade they ran ahead of the paper:
    // the island went dark 0.35 s before it on the way in, and was light again a whole second before the paper on the way back (owner's
    // iPhone, 11 Nov 13:43, measured frame by frame). Costs what the fade did (the page's background repainted each frame, iOS only)
    const ios = CSS.supports('-webkit-touch-callout', 'none')
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    const PAPER = [220, 213, 200]
    const DIM = [20, 20, 18]
    const ROOM = [27, 28, 26]
    const edges = (d: number, r: number) => {
      const s = root.dataset.section
      if (!ios || (s !== 'questions' && s !== 'contact')) return
      const c = PAPER.map((p, i) => Math.round((p + (DIM[i] - p) * d) * (1 - r) + ROOM[i] * r))
      const colour = `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
      root.style.transition = 'none'
      document.body.style.transition = 'none'
      root.style.backgroundColor = colour
      document.body.style.backgroundColor = colour
      themeMeta?.setAttribute('content', colour)
    }
    // the storyboard's E (saida-mascara render, 'e'), at progress x
    const draw = (x: number) => {
      const rise = innerHeight * 0.04
      const a = ease(ramp(x, 0.62, 0.84))
      const b = ease(ramp(x, 0.82, 1))
      const d = 0.97 * ease(ramp(x, 0.06, 0.46))
      const r = ease(ramp(x, 0.42, 0.7))
      edges(d, r)
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
      const speed = hurry ? 4 : 1
      x = target > x ? Math.min(target, x + (dt / ON_MS) * speed) : Math.max(target, x - (dt / BACK_MS) * speed)
      if (x === target) {
        last = 0
        // the edges end exactly on the stop's own colour (x 0: the paper's, 1: the room's), the one sequence.ts holds for it
        edges(x ? 1 : 0, x ? 1 : 0)
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
      holding = false
      const y = scrollY
      root.style.scrollSnapType = 'none'
      delete root.dataset.cHold
      requestAnimationFrame(() => {
        scrollTo({ top: y, behavior: 'instant' })
        root.style.scrollSnapType = ''
      })
    }
    const go = (to: number) => {
      target = to
      if (reduce) {
        x = to
        edges(to, to)
        settle()
        return
      }
      if (!to && x > 0 && !holding && !jumping()) startHold()
      if (!runRaf && x !== target) {
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
    const place = () => {
      raf = 0
      if (!start || !questions) return
      const top = start.getBoundingClientRect().top
      const span = top - (questions.getBoundingClientRect().top + qLift)
      const f = span > 0 ? 1 - top / span : 1
      const was = root.classList.contains('c-dusk')
      const df = f - lastF
      lastF = f
      // the passage begins as soon as a stroke has taken the page a little way from either stop (0.15 of the way), towards the other, so
      // a slow one sees it answer at once: begun only with the Contact's start halfway up the screen, a slow or short stroke from the
      // Questions' stop moved nothing at all for half a screen (their paper and their questions are held there) and went back to it
      // (Simulator, 10 Nov). Between, the way the page is going decides; near a stop, the stop does (a jump, a finger resting there)
      let dusk = was
      if (f >= 0.85) dusk = true
      else if (f <= 0.15) dusk = false
      else if (df > 0.002) dusk = true
      else if (df < -0.002) dusk = false
      // gone on well past a stop while the passage runs: past the Contact's towards the colophon, or above the Questions' own
      hurry = dusk ? f > 1.25 : f < -0.25
      if (dusk !== was) {
        root.classList.toggle('c-dusk', dusk)
        // the bar reads the brightness behind it from the section there (data-lum): once the light is down it is the dark, not the
        // Questions' paper (their section is still the one under the bar)
        if (questions) questions.dataset.lum = dusk ? '0.1' : '0.8'
        go(dusk ? 1 : 0)
      }
    }
    const onScroll = () => {
      movedAt = performance.now()
      if (!raf) raf = requestAnimationFrame(place)
    }
    place()
    if (questions) questions.dataset.lum = root.classList.contains('c-dusk') ? '0.1' : '0.8'
    root.classList.add('c-live')
    const onResize = () => {
      qLift = lift()
      onScroll()
    }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onResize)

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
      cancelAnimationFrame(raf)
      cancelAnimationFrame(runRaf)
      cancelAnimationFrame(holdRaf)
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
