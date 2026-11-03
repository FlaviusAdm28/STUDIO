'use client'

import { useEffect } from 'react'
import type { work } from '@content'
import { lensMap } from '@/lib/lens'
import { press } from '@/lib/press'

type Props = {
  /** One moment, in seconds: the word fills in this time (#73). */
  moment: number
  /** The photograph alone before its piece shows (#73). */
  photo: number
  demos: (typeof work)['demos']
  chapters: readonly string[]
}

/*
  The Work's stage (README #43, #44, #60, #62, #73). The scroll chooses the chapter (three steps under a held stage),
  time chooses the moment (4 s: the photograph, then its piece at work), a chosen moment holds; the stage pauses under
  the pointer or the focus; reduced motion holds the first moment. Changing chapter, the title moves the way the
  storyboard does (FLIP): the arriving chapter grows and slides into the large place. States on the section:
  data-ch (0–2), and on each chapter data-m (the moment) and data-demo (its piece showing).
*/
// The arriving chapter's words wait 0.3 s and fade in over 1 s on a fast ease (work.css, #73): by 0.45 s they are mostly there.
const CHAPTER_WORD_LEAD_MS = 450
// A moment chosen by tap: the word and the moment's 6 s wait for the pile to settle; started at the tap, the word was filling while
// the cards were still moving (owner, 2 Nov). The next card in the pile comes forward on its spring (170 ms + 950 ms, change());
// a card from the back crosses the pile (1.7 s) and is within 2 px of its place at 1.55 s (measured, 1440, 2 Nov).
const CHOSEN_LEAD_MS = { next: 1120, fromBack: 1550 }
// where a card rests in the pile (work.css): shown, behind it, furthest back; and the spring of its change
const PILE = [
  'translate3d(0, 0, 0) scale(1)',
  'translate3d(4.5%, -2%, 0) scale(0.97)',
  'translate3d(9%, -4%, 0) scale(0.94)',
]
const DIM = [0, 0.42, 0.68]
const LIFT = 'translate3d(0, 0, 0) scale(1.015)'
// the way back: up and to the side, shrinking, on the line to the back of the pile; straight to the side, then back, it read
// as two movements (owner, 31 Oct)
const SIDE = 'translate3d(30%, -10%, 0) scale(0.9)'
const OUT = 'cubic-bezier(0.4, 0, 0.3, 1)'
const BACK = 'cubic-bezier(0.45, 0, 0.2, 1)'
// a damped spring sampled into linear(), so that the compositor can run it
const spring = (damping: number, stiffness: number) => {
  const w = Math.sqrt(stiffness)
  const z = damping / (2 * w)
  const wd = w * Math.sqrt(1 - z * z)
  const points = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40
    return (1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t))).toFixed(4)
  })
  points[40] = '1'
  return `linear(${points.join(', ')})`
}
const SPRING = spring(15, 90)
// where the crossing card is gone: faster, so the two photographs mix for less time (owner, 1 Nov; was 0.44, README #82)
const FADED = 0.26

export function WorkClient({ moment, photo, demos, chapters }: Props) {
  useEffect(() => {
    const section = document.getElementById('work')
    if (!section) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = matchMedia('(max-width: 899px)')
    const root = document.documentElement
    const articles = [...section.querySelectorAll<HTMLElement>('.w-ch')]
    const steps = [...section.querySelectorAll<HTMLElement>('.w-step')]
    const cleanups: (() => void)[] = []
    // the press under a finger: the chapter names and the moments (owner, 3 Nov, option A)
    cleanups.push(press(section, '.w-nav-ch, .w-mom'))
    const listen = <T extends EventTarget>(t: T, k: string, f: EventListener, o?: AddEventListenerOptions) => {
      t.addEventListener(k, f, o)
      cleanups.push(() => t.removeEventListener(k, f, o))
    }

    // ---- the demonstrations' slots: the visitor's own date, time and (later, from the Method) name ----
    const c1 = (window as Window & { __c1?: { arrival?: { time: number }; name?: string } }).__c1
    const now = new Date(c1?.arrival?.time ?? Date.now())
    const name = c1?.name
    const pad = (n: number) => String(n).padStart(2, '0')
    const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' })
    const month = now.toLocaleDateString('en-GB', { month: 'long' })
    const d = now.getDate()
    const ordinal = `${d}${d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'}`
    const fill = (slot: string, text: string) =>
      section.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`).forEach((el) => (el.textContent = text))
    fill('time', hhmm)
    fill('short-date', `${weekday}, ${d} ${month.slice(0, 3)}`)
    // the countdown of the website: the next time the day comes round, at 16:00, read again at every count: the moment it
    // passes, the next year's takes over, and it never rests at zero. Minutes round up: the last one reads 1, not 0.
    const { month: dayMonth, date: dayDate } = demos.website.day
    const countdown = () => {
      const at = Date.now()
      const year = new Date(at).getFullYear()
      const thisYear = new Date(year, dayMonth - 1, dayDate, 16)
      const day = thisYear.getTime() > at ? thisYear : new Date(year + 1, dayMonth - 1, dayDate, 16)
      fill(
        'wedding-date',
        `${day.toLocaleDateString('en-GB', { weekday: 'long' })}, ${day.getDate()} ${day.toLocaleDateString('en-GB', { month: 'long' })}`,
      )
      const left = Math.ceil((day.getTime() - at) / 6e4)
      const parts = [Math.floor(left / 1440), Math.floor(left / 60) % 24, left % 60]
      parts.forEach((v, i) => fill(`countdown-${i}`, pad(v)))
    }
    countdown()
    const counting = window.setInterval(countdown, 15000)
    fill('year-on', `${d} ${month} ${now.getFullYear() + 1}`)
    fill('open-since', demos.exhibition.open.replace('{time}', hhmm))
    fill(
      'long-date',
      demos.invitation.date.replace('{weekday}', weekday).replace('{ordinal}', ordinal).replace('{month}', month),
    )
    section.querySelectorAll<HTMLElement>('[data-slot="year"]').forEach((el) => {
      el.textContent = String(now.getFullYear() - Number(el.dataset.back ?? 0))
    })
    section.querySelectorAll<HTMLElement>('[data-slot="guide-time"]').forEach((el) => {
      const off = Number(el.dataset.offset ?? 0)
      el.textContent = off === 0 ? hhmm : `${pad((now.getHours() + off + 24) % 24)}:00`
    })
    if (name) {
      fill('website-title', demos.website.titleNamed.replace('{name}', name))
      fill('year-on-line', demos.yearOn.lineNamed.replace('{name}', name))
      fill('portfolio-title', demos.portfolio.titleNamed.replace('{name}', name))
      fill('invitation-kicker', demos.invitation.kickerNamed.replace('{name}', name))
      fill('guide-title', demos.guide.titleNamed.replace('{name}', name))
      fill('thanks', demos.thanks.titleNamed.replace('{name}', name))
    }

    // the live gallery counts its photographs as they arrive (in step with their delays in work.tsx: 0.3 s + 0.32 s each)
    let ticks: number[] = []
    // the piece leaving inside its card (change)
    let carried: { piece: HTMLElement; home: Node | null; next: Node | null } | null = null
    const gallery = (dm: HTMLElement, on: boolean) => {
      const count = dm.querySelector('[data-slot="gallery-count"]')
      const newest = dm.querySelector('[data-slot="gallery-newest"]')
      if (!count || !newest) return
      ticks.forEach(clearTimeout)
      ticks = []
      count.textContent = '0'
      newest.textContent = ''
      if (!on) return
      demos.gallery.places.forEach((where, i) =>
        ticks.push(
          window.setTimeout(
            () => {
              count.textContent = String(i + 1)
              newest.textContent = demos.gallery.newest.replace('{where}', where)
            },
            650 + i * 320,
          ),
        ),
      )
    }

    // ---- the lens of the pieces' glass, the bar's own; drawn when a piece has a size ----
    if (CSS.supports('backdrop-filter', 'url(#dm-lens-0) blur(1px)')) {
      const sizes = new Map<string, string>()
      const glasses = [...section.querySelectorAll<HTMLElement>('.dm-glass[data-lens]')]
      const lens = () =>
        glasses.forEach((el) => {
          const k = el.dataset.lens ?? ''
          const w = Math.round(el.offsetWidth)
          const h = Math.round(el.offsetHeight)
          if (!w || !h || sizes.get(k) === `${w}x${h}`) return
          sizes.set(k, `${w}x${h}`)
          const map = document.querySelector(`#dm-lens-${k} .w-lens-map`)
          map?.setAttribute('href', lensMap(w, h, parseFloat(getComputedStyle(el).borderTopLeftRadius)))
          map?.setAttribute('width', String(w))
          map?.setAttribute('height', String(h))
        })
      lens()
      section.classList.add('w-lens')
      const resized = new ResizeObserver(lens)
      glasses.forEach((el) => resized.observe(el))
      cleanups.push(() => resized.disconnect())
    }

    // ---- the moments of the chapter on the stage ----
    let ch = -1
    let jumping = false
    let m = 0
    let held = false // a moment chosen by the visitor
    let lead = 0 // ms the first moment waits on a chapter change, so its word starts filling once it is seen (#89)
    let paused = false // the pointer or the focus on the stage
    let visible = false
    let timer = 0
    // The stage lies under the entrance from the top of the page, "on screen" for the observers, and it used to turn there
    // unseen: back at the top a piece was on, and the next landing showed it for an instant before the moment began again
    // (owner, 31 Oct; on: 1 at the top, 3 s after arriving). It works only once the passage has landed.
    const passHeld = !reduce && !!document.querySelector('.e-hold')
    const onStage = () => !passHeld || root.dataset.pass === 'done'
    const show = (demo: boolean, restartFill: boolean) => {
      const a = articles[ch]
      if (!a) return
      a.dataset.m = String(m)
      a.dataset.demo = String(demo)
      // only the piece shown animates; the others are reset at once, so quick changes never leave pieces moving behind
      a.querySelectorAll<HTMLElement>('.w-dm').forEach((d) => {
        const on = (demo && Number(d.dataset.j) === m) || d === carried?.piece
        if (on !== d.classList.contains('on')) gallery(d, on)
        d.classList.toggle('on', on)
      })
      a.querySelectorAll<HTMLButtonElement>('.w-mom').forEach((b) => {
        const on = Number(b.dataset.j) === m
        b.setAttribute('aria-pressed', String(on && held))
        b.classList.toggle('on', on)
        // a moment left behind goes dark at once (#61: the ones passed are not lit); only the current one fills
        if (!on) b.classList.remove('filling')
        // the word fills again from empty: a new animation each moment
        if (on && restartFill && onStage()) {
          b.style.setProperty('--fill-lead', `${lead}ms`)
          b.classList.remove('filling')
          void b.offsetWidth
          b.classList.add('filling')
        }
      })
    }
    const stop = () => {
      clearTimeout(timer)
    }
    // The change of photograph, inside the pile (owner, 31 Oct): the card lifts a little and goes back on the diagonal, clearing
    // as it goes; the pile closes up on a spring, as iOS moves things; and the card comes back in along the same line, with
    // no stop between. Card, its film of dark and its piece move as one thing, on one clock: on separate timings the owner
    // saw them leave in phases. It changes layer while invisible: solid, that change showed as a jump. Transform and
    // opacity only. data-m changes at once: the animations hold the old places until they end on the same values as work.css.
    let swapTimer = 0
    let swapEnd = 0
    let flying: Animation[] = []
    let swapped: HTMLElement[] = []
    // back in its place, once the card has faded: until then it stays lit, as it was
    const drop = () => {
      if (!carried) return
      const { piece, home, next } = carried
      carried = null
      home?.insertBefore(piece, next)
      piece.classList.remove('on')
      gallery(piece, false)
    }
    const landed = () => {
      drop()
      clearTimeout(swapTimer)
      clearTimeout(swapEnd)
      flying.forEach((f) => f.cancel())
      flying = []
      swapped.forEach((p) => p.style.removeProperty('z-index'))
      swapped = []
    }
    const change = (j: number) => {
      const a = articles[ch]
      landed()
      const from = m
      m = j
      a.dataset.m = String(j)
      const place = (card: HTMLElement, shown: number) => (Number(card.dataset.j) - shown + 3) % 3
      const cards = [...a.querySelectorAll<HTMLElement>('.w-ph')]
      cards.forEach((card) => {
        const start = place(card, from)
        const end = place(card, j)
        const dim = { pseudoElement: '::after', fill: 'both' as const }
        if (Math.abs(start - end) < 2) {
          // the film of dark on the card's own clock and curve: it is part of the card
          const timing = { duration: 950, delay: 170 + end * 50, easing: SPRING }
          flying.push(
            card.animate([{ transform: PILE[start] }, { transform: PILE[end] }], { ...timing, fill: 'both' }),
            card.animate([{ opacity: DIM[start] }, { opacity: DIM[end] }], { ...dim, ...timing }),
          )
          return
        }
        // the one that crosses the pile: going back, or, when a moment is skipped, coming from the back to the front
        const going = start === 0
        const WHOLE = 1700
        flying.push(
          card.animate(
            going
              ? [
                  { transform: PILE[0], easing: OUT },
                  { transform: LIFT, offset: 0.06, easing: OUT },
                  { transform: SIDE, offset: 0.48, easing: BACK },
                  { transform: PILE[2] },
                ]
              : [
                  { transform: PILE[2], easing: OUT },
                  { transform: SIDE, offset: 0.48, easing: BACK },
                  { transform: PILE[0] },
                ],
            { duration: WHOLE, fill: 'both' },
          ),
          card.animate(
            [
              { opacity: 1 },
              { opacity: 1, offset: 0.06 },
              { opacity: 0, offset: FADED },
              { opacity: 0, offset: 0.54 },
              { opacity: 1 },
            ],
            { duration: WHOLE, easing: 'ease-in-out', fill: 'both' },
          ),
          card.animate(
            going
              ? [
                  { opacity: 0 },
                  { opacity: 0.35, offset: FADED },
                  { opacity: DIM[2], offset: 0.54 },
                  { opacity: DIM[2] },
                ]
              : [{ opacity: DIM[2] }, { opacity: DIM[2], offset: 0.44 }, { opacity: 0, offset: 0.54 }, { opacity: 0 }],
            { ...dim, duration: WHOLE },
          ),
        )
        card.style.zIndex = going ? '5' : '0'
        swapped.push(card)
        // invisible until 54 %
        swapTimer = window.setTimeout(() => {
          drop()
          if (going) card.style.removeProperty('z-index')
          else card.style.zIndex = '5'
        }, WHOLE * 0.49)
        // The piece goes inside its card, so card, filter and zoom leave as one thing. Fading on their own clocks, the piece thinned
        // over a card that was still whole, and the plain photograph came back abruptly before it left (owner, 1 Nov).
        if (going) {
          const piece = a.querySelector<HTMLElement>(`.w-dm.on[data-j="${from}"]`)
          if (piece) {
            carried = { piece, home: piece.parentNode, next: piece.nextSibling }
            card.append(piece)
          }
        }
      })
      swapEnd = window.setTimeout(landed, 1750)
    }
    // the moment in two phases — the photograph alone, then its piece — and what is left of the phase when it pauses,
    // so the pointer leaving the photograph resumes the moment where it was (the word too: its fill only paused)
    let phase = 0
    let phaseEnd = 0
    let remaining = 0
    const schedule = (ms: number, then: () => void) => {
      phaseEnd = performance.now() + ms
      timer = window.setTimeout(then, ms)
    }
    // the end of a moment: its piece leaves first, then the photographs change — changing together, the next photograph
    // slid in beside a piece still fading and its dark veil showed as a square (owner, 29 Oct; recorded frame by frame)
    const next = () => {
      change((m + 1) % 3)
      show(false, false)
      run()
    }
    const toPiece = () => {
      phase = 1
      show(true, false)
      schedule((moment - photo) * 1000, next)
    }
    const run = (resume = false) => {
      stop()
      if (ch < 0 || held || paused || !visible || reduce || !onStage()) return
      if (resume && remaining > 0) {
        if (phase === 0) schedule(remaining, toPiece)
        else schedule(remaining, next)
        return
      }
      phase = 0
      show(false, true)
      schedule(photo * 1000 + lead, toPiece)
    }
    // a chosen moment holds: its photograph first, then its piece, as in the rhythm — and there it stays
    // Choosing a moment (owner, 29 Oct): another moment → it shows at once and becomes the one that counts, and the
    // rotation goes on from there; the current moment → it holds where it is (its word stops filling), and again →
    // it goes on. The hold is the way to stop the movement (WCAG 2.2.2).
    const choose = (j: number) => {
      if (j !== m || reduce) {
        held = false
        if (reduce) {
          m = j
          show(true, true)
          return
        }
        const fromBack = (j - m + 3) % 3 === 2
        change(j)
        lead = fromBack ? CHOSEN_LEAD_MS.fromBack : CHOSEN_LEAD_MS.next
        run()
        lead = 0
        // the keyboard's focus pauses the stage: run does nothing then, and the chosen moment must still show
        if (paused) show(true, true)
        return
      }
      held = !held
      if (held) {
        // held, the moment shows its piece — held during the photograph alone, it would have stayed without it
        stop()
        phase = 1
        remaining = (moment - photo) * 1000
        show(true, false)
      } else {
        show(true, false)
        run(true)
      }
    }
    // The bridge to the Method (README #98, #102): at the end of Experiences the moment seen is held — the Method's light passes over
    // it. It no longer turns to During first: that was for the guide coming loose from the photograph (the slit, #99), and with the
    // light finding the screens in the studio it read as a jump (owner, iPhone, 3 Nov). It starts once the Method, laid over the
    // Work's last screens, is half a screen from being held; scrolling back lets go and time goes on.
    let bridged = false
    const methodEl = document.getElementById('method')
    const bridge = (on: boolean) => {
      if (on === bridged || reduce) return
      bridged = on
      if (on) {
        held = true
        remaining = Math.max(0, phaseEnd - performance.now())
        stop()
      } else {
        held = false
        run(true)
      }
    }
    // half a screen before the slit opens: the Method's section starts half a screen before its scene (README #99)
    const checkBridge = () => bridge(ch === articles.length - 1 && !!methodEl && methodEl.getBoundingClientRect().top < 0)
    listen(window, 'scroll', checkBridge, { passive: true })
    articles.forEach((a) =>
      a
        .querySelectorAll<HTMLButtonElement>('.w-mom')
        .forEach((b) => listen(b, 'click', () => choose(Number(b.dataset.j)))),
    )
    // a pause under the pointer or the focus — on the photograph or the words, not the whole screen: the stage fills it,
    // and over the empty ground the moments would never move
    const pause = (p: boolean) => {
      if (p === paused) return
      paused = p
      section.classList.toggle('w-paused', p)
      if (p) {
        remaining = Math.max(0, phaseEnd - performance.now())
        stop()
        // paused, the moment shows its piece, as a held moment does; held on the photograph alone it stayed without it
        if (phase === 0 && ch >= 0 && onStage()) {
          phase = 1
          remaining = (moment - photo) * 1000
          show(true, false)
        }
      } else run(true)
    }
    // The pointer on the photograph — or a finger held on it — looks at it: time waits and the photograph drifts slowly,
    // as the entrance's blades do; the piece stays (owner, 29 Oct: "mexia a foto mas não retirava a peça"). Not on the
    // words: there it only got in the way of the word filling (owner, same day).
    const look = (a: Element | null, on: boolean) => {
      a?.classList.toggle('w-look', on)
      pause(on)
    }
    section.querySelectorAll<HTMLElement>('.w-stack').forEach((el) => {
      const a = el.closest('.w-ch')
      listen(el, 'pointerenter', (e) => (e as PointerEvent).pointerType === 'mouse' && look(a, true))
      listen(el, 'pointerleave', (e) => (e as PointerEvent).pointerType === 'mouse' && look(a, false))
      listen(el, 'pointerdown', (e) => (e as PointerEvent).pointerType !== 'mouse' && look(a, true))
      listen(el, 'pointerup', (e) => (e as PointerEvent).pointerType !== 'mouse' && look(a, false))
      listen(el, 'pointercancel', (e) => (e as PointerEvent).pointerType !== 'mouse' && look(a, false))
      // a held finger: no image menu over the photograph
      listen(el, 'contextmenu', (e) => e.preventDefault())
    })
    const stage = section.querySelector<HTMLElement>('.w-stage')
    if (stage) {
      // the keyboard's focus only: a tap focuses what it touches, and on a phone that held the moments for good (owner, 29 Oct)
      listen(stage, 'focusin', (e) => (e.target as Element).matches(':focus-visible') && pause(true))
      listen(stage, 'focusout', (e) => !stage.contains((e as FocusEvent).relatedTarget as Node) && pause(false))
    }

    // a chapter off the stage goes back to its first moment, with nothing running: hidden, its piece went on with 12 animations
    const rest = (a: HTMLElement) => {
      a.dataset.m = '0'
      a.dataset.demo = 'false'
      a.querySelectorAll<HTMLElement>('.w-dm.on').forEach((d) => {
        gallery(d, false)
        d.classList.remove('on')
      })
      a.querySelectorAll<HTMLButtonElement>('.w-mom').forEach((b) => {
        b.classList.remove('filling')
        b.classList.toggle('on', b.dataset.j === '0')
        b.setAttribute('aria-pressed', 'false')
      })
    }
    // ---- the chapter: the step under the middle of the screen ----
    // The page's first chapter, and any correction while the browser restores the scroll after a refresh, are put in place at once:
    // a refresh on Experiences showed Weddings (the server's page) and then crossed to Experiences over 1.1 s (owner, 2 Nov).
    const born = performance.now()
    let settled = false
    const settle = () => (settled = true)
    ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((k) => listen(window, k, settle, { once: true, passive: true }))
    const setChapter = (next: number) => {
      if (next === ch) return
      const quiet = !settled && performance.now() - born < 700
      if (quiet) {
        section.classList.add('w-now')
        requestAnimationFrame(() => requestAnimationFrame(() => section.classList.remove('w-now')))
      }
      // in place at once: the chapter that was there rests now, and nothing flies (no passage, the word not held back)
      if (quiet && ch >= 0) rest(articles[ch])
      const from = quiet ? -1 : ch
      landed()
      // once it has faded (the chapter's own 1.2 s), unless the visitor is back
      if (from >= 0) window.setTimeout(() => from !== ch && rest(articles[from]), 1300)
      ch = next
      section.dataset.ch = String(ch)
      held = false
      m = 0
      if (from >= 0 && !reduce) passage(from, ch)
      // The arriving words appear 0.3 s after the change and are mostly there by ~0.45 s: the word started filling at the change and
      // came in with half its first letter lit, a jump (owner, iPhone video, 2 Nov, README #89). It starts empty once it is seen, and the
      // moment's 6 s count from there.
      lead = from >= 0 && !reduce ? CHAPTER_WORD_LEAD_MS : 0
      show(reduce, true)
      run()
      lead = 0
    }
    // FLIP (#73): each chapter's name in the arriving title starts where it was in the leaving one.
    // One Web Animation per name, not a transition switched off and on across two frames: on the iPhone that transition was
    // cut ~0.17 s in and the title jumped to its place (owner's video, 2 Nov, README #90). A name still flying when the visitor
    // turns back is cancelled and the new flight starts from where it is seen.
    const titleFlights = new WeakMap<HTMLElement, Animation>()
    const rootStyle = getComputedStyle(root)
    const moveMs = (parseFloat(rootStyle.getPropertyValue('--chapter-move-seconds')) || 1.2) * 1000
    const moveEase = rootStyle.getPropertyValue('--ease').trim() || 'ease-out'
    const scaleOf = (el: HTMLElement) => {
      const t = getComputedStyle(el).transform
      return t && t !== 'none' ? new DOMMatrix(t).a : 1
    }
    // The photographs rise and fall with Web Animations too, from wherever they are seen. In the owner's iPhone video (12:00)
    // the CSS transitions were cut: the leaving pile vanished ~0.27 s in, the arriving one showed ~0.2 s of its rise and
    // jumped to its place at ~0.55 s (README #91). The CSS rules still say where each pile rests (work.css, 1.1 s, #73).
    const STACK_MS = 1100
    const stackFlights = new WeakMap<HTMLElement, Animation>()
    const fly = (st: HTMLElement | null, opacity: number, transform: string) => {
      if (!st) return
      const cs = getComputedStyle(st)
      const start = { opacity: cs.opacity, transform: cs.transform === 'none' ? 'translate3d(0, 0, 0)' : cs.transform }
      stackFlights.get(st)?.cancel()
      stackFlights.set(st, st.animate([start, { opacity, transform }], { duration: STACK_MS, easing: moveEase }))
    }
    const passage = (from: number, to: number) => {
      fly(articles[from].querySelector('.w-stack'), 0, 'translate3d(0, 5%, 0)')
      fly(articles[to].querySelector('.w-stack'), 1, 'translate3d(0, 0, 0)')
      const was = new Map<string, { r: DOMRect; fs: number; o: number }>()
      articles[from].querySelectorAll<HTMLElement>('.w-nav-ch').forEach((el) => {
        was.set(el.dataset.k ?? '', {
          r: el.getBoundingClientRect(),
          fs: parseFloat(getComputedStyle(el).fontSize) * scaleOf(el),
          o: Number(getComputedStyle(el).opacity),
        })
      })
      articles[to].querySelectorAll<HTMLElement>('.w-nav-ch').forEach((el) => {
        const w = was.get(el.dataset.k ?? '')
        if (!w) return
        titleFlights.get(el)?.cancel()
        const r = el.getBoundingClientRect()
        const s = w.fs / parseFloat(getComputedStyle(el).fontSize)
        const o = getComputedStyle(el).opacity
        const a = el.animate(
          [
            {
              transformOrigin: '0 100%',
              transform: `translate(${w.r.left - r.left}px, ${w.r.bottom - r.bottom}px) scale(${s})`,
              opacity: w.o,
            },
            { transformOrigin: '0 100%', transform: 'none', opacity: o },
          ],
          { duration: moveMs, easing: moveEase },
        )
        titleFlights.set(el, a)
      })
    }
    // The chapter: the step under the middle of the screen, with a dead band. Changing exactly at the middle, a finger resting
    // near it flipped the chapter back and forth and every flip started the photographs, the text and the title again (owner,
    // iPhone, 2 Nov, README #90). Now the next step must pass the middle by BAND of the screen, and going back the current one
    // must leave it by as much. Three rects on scroll: layout is clean while scrolling, so they cost no reflow.
    const BAND = 0.12
    const chooseChapter = () => {
      if (jumping) return
      const mid = innerHeight / 2
      const band = innerHeight * BAND
      const tops = steps.map((s) => s.getBoundingClientRect().top)
      const bottom = steps.length ? steps[steps.length - 1].getBoundingClientRect().bottom : 0
      let k = -1
      tops.forEach((t, i) => t <= mid && (k = i))
      // the first call places a chapter even above the first step (Weddings, under the entrance) or past the last (Experiences)
      if (ch < 0) return setChapter(k < 0 ? 0 : bottom <= mid ? steps.length - 1 : k)
      if (k < 0 || bottom <= mid) return // above the first step or past the last: as the observer did, nothing changes
      if (k > ch) {
        let far = ch
        tops.forEach((t, i) => i > ch && t <= mid - band && (far = i))
        if (far !== ch) setChapter(far)
      } else if (k < ch && tops[ch] > mid + band) setChapter(k)
    }
    listen(window, 'scroll', chooseChapter, { passive: true })
    chooseChapter()
    // the rotation runs only while the stage is on screen
    const seen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) run()
      else stop()
    })
    seen.observe(section)
    cleanups.push(() => seen.disconnect())

    // ---- state 2, the passage: the entrance's film becomes the stage (storyboard, README #33) ----
    // The entrance is held on screen (work.css) while one screen of scroll shrinks its film into the arch of Weddings —
    // the whole frame scaled to cover the arch and cut to it, the words of the entrance leaving, the Work's text coming in
    // beside it — and 0.4 of a screen dissolves it into the first photograph of Weddings, which lies under it in the
    // same place. Transform and opacity, and the arch as a clip-path on the held entrance. Not with reduced motion.
    const holder = document.querySelector<HTMLElement>('.e-hold')
    const entrance = document.getElementById('top')
    const film = entrance?.querySelector<HTMLElement>('.e-film')
    const video = entrance?.querySelector<HTMLVideoElement>('video')
    const fading = entrance ? [...entrance.querySelectorAll<HTMLElement>('.e-final, .e-ded')] : []
    const arch = section.querySelector<HTMLElement>('.w-ch[data-c="weddings"] .w-stack')
    const firstText = section.querySelector<HTMLElement>('.w-ch[data-c="weddings"] .w-tx')
    let pausedFilm = false
    const clamp = (x: number) => Math.min(1, Math.max(0, x))
    // the geometry is read once (and again on resize), never while scrolling: reading it after the frame's writes forced
    // the browser to lay the page out every frame (measured on the Xiaomi, 29 Oct)
    let geo: {
      H: number
      W: number
      top: number
      r: { left: number; top: number; right: number; bottom: number; width: number; height: number }
    } | null = null
    const measure = () => {
      if (!holder || !entrance || !arch) return
      // the arch relative to the stage: during the passage the stage is held at the top of the screen
      const st = section.querySelector('.w-ch')?.getBoundingClientRect() // the chapter's box: on iOS the stage reaches above the screen
      const b = arch.getBoundingClientRect()
      const a = {
        left: b.left,
        right: b.right,
        width: b.width,
        height: b.height,
        top: b.top - (st?.top ?? 0),
        bottom: b.bottom - (st?.top ?? 0),
      }
      geo = {
        // the held entrance's own box (a desktop scrollbar is not part of it)
        H: entrance.clientHeight,
        W: entrance.clientWidth,
        top: holder.getBoundingClientRect().top + scrollY,
        r: { left: a.left, top: a.top, right: a.right, bottom: a.bottom, width: a.width, height: a.height },
      }
    }
    // The passage on the compositor: the scroll itself drives it, with no frame of the main thread. Moved by script it kept
    // pace with the main thread, ~27 frames a second, however fast the screen drew (Xiaomi trace, 31 Oct: 113 draws, 55 main
    // frames, each waiting for raster). The blade of Weddings grows into the arch (owner, 31 Oct): it is the same photograph,
    // so nothing is exchanged. Two boxes fly together, the photograph counter-scaled inside so it never stretches: one with
    // the arch's curve, one with square corners over it, which fades so the curve appears softly (a radius cannot change on
    // the compositor, and scaled flat it bent the blade's top edge). They lie under the entrance's words, so the blade's
    // name stays whole while the box takes over: over it, the name flickered in the first pixels of scroll.
    const host = entrance?.querySelector<HTMLElement>('.e-window')
    const canComposite = 'ScrollTimeline' in window && CSS.supports('animation-range', '0px 100px') && !!host
    let flights: Animation[] = []
    let textFlight: Pick<Animation, 'cancel'> | null = null
    let flyText: (() => void) | null = null
    const lifted: HTMLElement[] = []
    let shadow: HTMLElement | null = null
    const SAMPLES = 32
    const flight = () => {
      flights.forEach((a) => a.cancel())
      flights = []
      textFlight?.cancel()
      textFlight = null
      if (!geo || !entrance || !host || !film || !firstText) return
      const { H, r, top } = geo
      const shape = entrance.querySelector<HTMLElement>('.e-blade .e-blade-shape')
      const blades = [...entrance.querySelectorAll<HTMLElement>('.e-blade')]
      const name = blades[0]?.querySelector<HTMLElement>('.e-blade-name')
      const words = entrance.querySelectorAll<HTMLElement>('.e-head, .e-ded')
      const photo = arch?.querySelector<HTMLImageElement>('.w-ph[data-j="0"] img')
      const cards = [...section.querySelectorAll<HTMLElement>('.w-ch[data-c="weddings"] .w-ph')]
      if (!shape || !photo || !firstText) return
      const shown = shape.querySelector('img') as HTMLImageElement
      // No sizes yet: a resize that swaps the blade's file, or a slow network. Every number below came out NaN and the photograph
      // flew unframed, jumping as it landed (owner, 1 Nov, 768). Until it arrives the passage runs on the main thread (passageFrame).
      if (!shown.naturalWidth) {
        shown.addEventListener(
          'load',
          () => {
            geo = null
            passageFrame()
          },
          { once: true },
        )
        return
      }
      // built for one size: after a resize the old boxes flew with the old arch's place and proportions (owner, 1 Nov, 768)
      lifted.splice(0).forEach((box) => box.remove())
      shadow?.remove()
      shadow = null
      // the photograph's light arrives with it, not before
      const aura = section.querySelector<HTMLElement>('.w-ch[data-c="weddings"] .w-aura[data-j="0"]')
      const glow = aura ? getComputedStyle(aura).opacity : '1'
      const Timeline = (window as unknown as { ScrollTimeline: new (o: object) => AnimationTimeline }).ScrollTimeline
      const timeline = new Timeline({ source: document.documentElement, axis: 'block' })
      const END = 1.4 * H
      const fly = (el: Element, frames: Keyframe[], from = 0, to = END) =>
        el.animate(frames, {
          timeline,
          fill: 'both',
          rangeStart: `${top + from}px`,
          rangeEnd: `${top + to}px`,
        } as unknown as KeyframeAnimationOptions)
      const b = shape.getBoundingClientRect()
      const lean = matchMedia('(orientation: portrait)').matches ? 0.06 : 0.14
      // The photograph starts exactly as the blade shows it: both framings computed from its own proportions, the blade's
      // cover and the arch's. Assuming it filled the arch's width, it jumped as the blade took over (owner, 31 Oct).
      const crop = parseFloat(getComputedStyle(shown).objectPosition.split(' ')[1]) / 100
      const nw = shown.naturalWidth
      const nh = shown.naturalHeight
      const inBlade = Math.max(b.width / nw, b.height / nh)
      const inArch = Math.max(r.width / nw, r.height / nh)
      const cw = nw * inArch
      const ch2 = nh * inArch
      // The boxes end on the device pixel where the blade ends. On a fraction the last row was half covered and flickered
      // light; cut 2 px short, the shade alone showed there as a dark bar (owner, 31 Oct).
      const dpr = devicePixelRatio
      const flush = Math.floor((b.top + b.height) * dpr) / dpr - b.top
      const smooth = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)
      const outer: Keyframe[] = []
      const inner: Keyframe[] = []
      for (let i = 0; i <= SAMPLES; i++) {
        const g = smooth(i / SAMPLES)
        const mix = (a: number, z: number) => a + (z - a) * g
        const x = mix(b.left + lean * b.width, r.left)
        const y = mix(b.top, r.top)
        const sx = mix((1 - lean) * b.width, r.width) / r.width
        const sy = mix(flush, r.height) / r.height
        const sh = (-lean * b.width * (1 - g)) / r.height
        const k = mix(inBlade / inArch, 1)
        const ix = mix(b.left + (b.width - nw * inBlade) / 2, r.left + (r.width - cw) / 2)
        const iy = mix(b.top + (b.height - nh * inBlade) * crop, r.top + (r.height - ch2) / 2)
        outer.push({ transform: `matrix(${sx}, 0, ${sh}, ${sy}, ${x - r.left}, ${y - r.top})` })
        const v = (iy - y) / sy
        inner.push({
          transform: `matrix(${k / sx}, 0, ${(-sh * k) / (sx * sy)}, ${k / sy}, ${(ix - x - sh * v) / sx}, ${v})`,
        })
      }
      if (!lifted.length) {
        for (const round of [true, false]) {
          const box = document.createElement('div')
          box.setAttribute('aria-hidden', 'true')
          box.style.cssText =
            `position:absolute;z-index:3;overflow:hidden;transform-origin:0 0;pointer-events:none;left:${r.left}px;top:${r.top}px;` +
            `width:${r.width}px;height:${r.height}px;will-change:transform,opacity;opacity:0;` +
            (round
              ? `border-radius:${r.width / 2}px ${r.width / 2}px 0 0 / ${0.24 * r.height}px ${0.24 * r.height}px 0 0`
              : '')
          const inside = document.createElement('div')
          inside.style.cssText = `position:absolute;left:0;top:0;width:${cw}px;height:${ch2}px;transform-origin:0 0;will-change:transform`
          const img = document.createElement('img')
          img.alt = ''
          img.src = photo.currentSrc || photo.src
          img.style.cssText = 'display:block;width:100%;height:100%;max-width:none'
          inside.append(img)
          box.append(inside)
          host.append(box)
          lifted.push(box)
        }
      }
      // The blade's own shade, flying over both boxes and past their edges: inside a box it was cut with the photograph, and
      // at fractional positions a row of the photograph stayed uncovered, a line of light under the card (12 → 103 levels,
      // 31 Oct, in the compositor's frames only).
      if (!shadow) {
        shadow = document.createElement('div')
        shadow.setAttribute('aria-hidden', 'true')
        shadow.style.cssText =
          `position:absolute;z-index:3;transform-origin:0 0;pointer-events:none;left:${r.left}px;top:${r.top}px;` +
          `width:${r.width}px;height:${(r.height * (flush + 1.5 / dpr)) / flush}px;opacity:0;will-change:transform,opacity;` +
          'background:linear-gradient(transparent 20%, rgba(15, 14, 12, 0.88))'
        host.append(shadow)
      }
      const [curved, square] = lifted
      flights = [
        fly(curved, outer),
        fly(square, outer),
        ...lifted.map((box) => fly(box.firstElementChild as Element, inner)),
        fly(shadow, outer),
        fly(
          shadow,
          [{ opacity: 0 }, { opacity: 1, offset: 0.04 }, { opacity: 1, offset: 0.06 }, { opacity: 0 }],
          0,
          0.5 * H,
        ),
        fly(curved, [{ opacity: 0 }, { opacity: 1, offset: 0.015 }, { opacity: 1, offset: 0.98 }, { opacity: 0 }]),
        fly(square, [
          { opacity: 0 },
          { opacity: 1, offset: 0.015 },
          { opacity: 1, offset: 0.24 },
          { opacity: 0, offset: 0.5 },
          { opacity: 0 },
        ]),
        fly(shape, [{ opacity: 1 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], 0, 0.1 * H),
        ...(name ? [fly(name, [{ opacity: 1 }, { opacity: 0 }], 0.03 * H, 0.26 * H)] : []),
        ...blades.slice(1).map((el) => fly(el, [{ opacity: 1 }, { opacity: 0 }], 0, 0.3 * H)),
        ...[...words].map((el) => fly(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], 0, 0.35 * H)),
        fly(film, [{ opacity: 1 }, { opacity: 0 }], 0.05 * H, 0.9 * H),
        // The film's top leaves once the film has gone (0.9 H): over the ground it is that same colour, unseen. Leaving earlier it showed
        // the film's last light with a hard edge under the Dynamic Island (owner marked it on the iPhone, 0.77–0.85 H, 1 Nov).
        ...[...entrance.querySelectorAll('.e-edge')].map((el) => fly(el, [{ opacity: 1 }, { opacity: 0 }], 0.9 * H, 0.98 * H)),
      ]
      flyText = () => {
        const held = [
          fly(firstText, [{ opacity: 0 }, { opacity: 1 }], 0.95 * H, END),
          ...cards.map((card) => fly(card, [{ opacity: 0 }, { opacity: 0, offset: 0.9 }, { opacity: 1 }], 0, END)),
          ...(aura ? [fly(aura, [{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: glow }], 0, END)] : []),
        ]
        textFlight = { cancel: () => held.forEach((a) => a.cancel()) }
      }
      // arriving past the passage (a chapter's address, a refresh down the page) the stage is already the stage's own
      if (scrollY - top < END) flyText()
    }
    // once the entrance's own timeline has ended: an animation made here would cover it
    const composited = () => canComposite && !root.dataset.entrance
    // leaving the stage: it goes back to where the passage arrives, the first moment, the first photograph, no piece. Also on
    // a jump straight to the top (the name, the browser's back): without it the next landing brought the blade's photograph
    // into a pile turned to another moment, with the piece on (audit, 31 Oct)
    const leaveStage = () => {
      stop()
      landed()
      held = false
      m = 0
      articles.forEach(rest)
      // a jump to the top from another chapter: the passage arrives at Weddings, and its stage lay under the film as Experiences until
      // the last moment (test round, 1 Nov)
      if (ch > 0) {
        ch = 0
        section.dataset.ch = '0'
      }
      if (flights.length && !textFlight) flyText?.()
    }
    const passageFrame = () => {
      if (!holder || !entrance || !film || !arch || reduce) return
      if (!geo) {
        measure()
        if (geo && composited()) flight()
      }
      if (!geo) return
      const { H, W, r } = geo
      const s = scrollY - geo.top
      if (s <= 0) {
        if (root.dataset.pass) {
          if (root.dataset.pass === 'done') leaveStage()
          delete root.dataset.pass
          ;[film, entrance, firstText, ...fading].forEach((el) => el?.removeAttribute('style'))
          run()
        }
        return
      }
      const p = clamp(s / H)
      const d = clamp((s - H) / (0.4 * H))
      const was = root.dataset.pass
      const state = d >= 1 ? 'done' : 'on'
      if (was !== state) root.dataset.pass = state
      const flying = flights.length > 0
      const k = 1 + (Math.max(r.width / W, r.height / H) - 1) * p
      const tx = (r.left + r.width / 2 - W / 2) * p
      const ty = (r.top + r.height / 2 - H / 2) * p
      if (!flying) {
        film.style.transition = 'none'
        film.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${k}) rotate(0.03deg)`
        const rx = (r.width / 2) * p
        const ry = 0.24 * r.height * p
        entrance.style.clipPath = `inset(${r.top * p}px ${(W - r.right) * p}px ${(H - r.bottom) * p}px ${r.left * p}px round ${rx}px ${rx}px 0 0 / ${ry}px ${ry}px 0 0)`
        entrance.style.opacity = String(1 - d)
        fading.forEach((el) => {
          el.style.transition = 'none'
          el.style.opacity = String(clamp(1 - p / 0.4))
        })
        if (firstText) {
          firstText.style.transition = 'none'
          firstText.style.opacity = String(clamp((p - 0.6) / 0.4))
        }
      }
      // the film stops once it has become the photograph; it plays again on the way back
      if (d >= 1 && video && !video.paused) {
        video.pause()
        pausedFilm = true
      } else if (d < 1 && pausedFilm && video) {
        video.play().catch(() => {})
        pausedFilm = false
      }
      if (was !== 'done' && d >= 1) {
        firstText?.removeAttribute('style')
        // the text belongs to the stage now: its chapter's own rules take over
        textFlight?.cancel()
        textFlight = null
        run()
      } else if (was === 'done' && d < 1) {
        leaveStage()
      }
    }
    let passQueued = false
    const onPassScroll = () => {
      if (passQueued) return
      passQueued = true
      requestAnimationFrame(() => {
        passQueued = false
        passageFrame()
      })
    }
    listen(window, 'scroll', onPassScroll, { passive: true })
    // the phone's address bar hides and shows as one scrolls: only a real change of size measures again
    let sized = `${innerWidth}x${entrance?.clientHeight}`
    listen(window, 'resize', () => {
      const now = `${innerWidth}x${entrance?.clientHeight}`
      if (now === sized) return
      sized = now
      geo = null
      onPassScroll()
    })
    const ended = new MutationObserver(() => {
      if (root.dataset.entrance || flights.length) return
      geo = null
      passageFrame()
    })
    ended.observe(root, { attributes: true, attributeFilter: ['data-entrance'] })
    cleanups.push(() => {
      ended.disconnect()
      flights.forEach((a) => a.cancel())
      textFlight?.cancel()
    })
    passageFrame()

    // ---- a chapter's address (#44): the blades, the title and the menu land on that chapter's step ----
    // one passage, straight from where one is to the chapter chosen: the smooth scroll crosses the steps in between,
    // and each used to start its own passage (III → I on the phone went through II; owner, 29 Oct)
    // #work is the first chapter's step: the section's own box starts under the entrance, at the top of the page, so the index's
    // 01 Work went back to the entrance (test round, 1 Nov)
    const chapterOf = (id: string) => (id === 'work' ? chapters[0] : id)
    const land = (id: string, smooth: boolean) => {
      const k = chapters.indexOf(chapterOf(id))
      if (k < 0) return false
      const top = steps[k].getBoundingClientRect().top + scrollY + 1
      jumping = true
      setChapter(k)
      const done = () => {
        jumping = false
      }
      addEventListener('scrollend', done, { once: true })
      window.setTimeout(done, 1500)
      scrollTo({ top, behavior: smooth && !reduce ? 'smooth' : 'auto' })
      return true
    }
    listen(document, 'click', (e) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      const id = a?.getAttribute('href')?.slice(1) ?? ''
      if (a && chapters.includes(chapterOf(id))) {
        e.preventDefault()
        history.pushState(null, '', `#${id}`)
        land(id, !a.closest('.e-blades'))
      }
    })
    // the address changing on its own — back and forward, or a chapter typed in — lands too
    const onAddress = () => {
      const id = location.hash.slice(1)
      if (chapters.includes(chapterOf(id))) land(id, false)
    }
    listen(window, 'hashchange', onAddress)
    listen(window, 'popstate', onAddress)
    // arriving with a chapter's address: the entrance has already cleared it at the top, so it is read from the arrival
    const arrived = (location.hash || (window as Window & { __c1?: { hash?: string } }).__c1?.hash || '').slice(1)
    if (chapters.includes(chapterOf(arrived))) {
      history.replaceState(history.state, '', `#${arrived}`)
      requestAnimationFrame(() => land(arrived, false))
    }

    // ---- the lines of the pieces (#60): on the desktop all; on a phone one at a time, under the chosen name ----
    const lines = () => {
      articles.forEach((a) =>
        a.querySelectorAll<HTMLElement>('.w-mo').forEach((mo) => {
          const items = [...mo.querySelectorAll<HTMLElement>('.w-li')]
          items.forEach((li, k) => {
            const top = li.querySelector<HTMLElement>('.w-top')
            if (!top) return
            if (phone.matches) {
              top.setAttribute('role', 'button')
              top.tabIndex = 0
              const open = li.dataset.open ? li.dataset.open === 'true' : k === 0
              li.dataset.open = String(open)
              top.setAttribute('aria-expanded', String(open))
            } else {
              top.removeAttribute('role')
              top.removeAttribute('tabindex')
              top.removeAttribute('aria-expanded')
              delete li.dataset.open
            }
          })
        }),
      )
    }
    const pick = (e: Event) => {
      if (!phone.matches) return
      if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return
      const top = (e.target as Element).closest<HTMLElement>('.w-top')
      const li = top?.closest<HTMLElement>('.w-li')
      if (!top || !li) return
      e.preventDefault()
      li.parentElement?.querySelectorAll<HTMLElement>('.w-li').forEach((x) => {
        x.dataset.open = String(x === li)
        x.querySelector('.w-top')?.setAttribute('aria-expanded', String(x === li))
      })
    }
    listen(section, 'click', pick)
    listen(section, 'keydown', pick)
    lines()
    listen(phone, 'change', lines)

    return () => {
      clearInterval(counting)
      clearTimeout(swapTimer)
      stop()
      cleanups.forEach((f) => f())
    }
  }, [moment, photo, demos, chapters])

  return null
}
