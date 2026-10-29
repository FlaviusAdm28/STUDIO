/*
  The entrance's two scripts. They run inline, as the HTML arrives — before React hydrates — so the arrival
  is never a dark screen waiting for the framework (on the Xiaomi over 4G that wait is seconds). Each is
  a self-contained function serialised with `toString()`: no imports, no closures over this module.

  The server HTML is the final state (E4); with no JavaScript, or with reduced motion / Save-Data / a hash,
  nothing here changes how it looks. Everything this script writes goes on <html> (or inside the dedication,
  whose content React does not hydrate): it runs before hydration, and React rebuilds any element it owns
  whose attributes or text changed (measured 29 Oct: error #418 wiped the state, the text and the film).
  The states live on <html data-entrance>: e0 dark → e1 the dedication
  → e2 the letters open → e3 the camera enters through the O → e4 the final state; then the attribute goes.
  Any gesture jumps to the end ("skip"). interactions.md §1, storyboard E1–E4, README #64 #66 #70.
*/

/** Runs first in <body>: decides whether the sequence runs, before anything is painted. */
export function entranceGate() {
  try {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!reduce && !connection?.saveData && !location.hash) document.documentElement.dataset.entrance = 'e0'
  } catch {}
}

export type EntranceConfig = {
  welcomeBack: string
  wide: string
  tall: string
  lettersAt: number
  zoomAt: number
  finalAt: number
  /** How long the final state takes to settle before the veil is removed. */
  settle: number
}

/** Runs right after the entrance's HTML: the arrival, the film, the sequence. */
export function entranceSequence(c: EntranceConfig) {
  const root = document.documentElement
  const section = document.getElementById('top')
  if (!section) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection

  // The arrival, kept for the Method and the Contact. Nothing is sent anywhere.
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  let returning = false
  try {
    // A return only after more than 30 minutes away: read before writing this visit (README #66).
    const last = Date.parse(localStorage.getItem('c1.lastVisit') || '')
    returning = now.getTime() - last > 30 * 60 * 1000
    localStorage.setItem('c1.lastVisit', now.toISOString())
  } catch {}
  const h = now.getHours()
  const light = h >= 5 && h < 11 ? 'morning' : h >= 11 && h < 17 ? 'day' : h >= 17 && h < 21 ? 'evening' : 'night'
  const w = window as Window & {
    __c1?: { arrival: object; chapter: string | null }
  }
  w.__c1 = {
    arrival: { time: now.getTime(), hhmm, light, returning },
    chapter: null,
  }
  root.dataset.light = light
  const dedication = section.querySelector('.e-ded')
  if (dedication) {
    const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' })
    const month = now.toLocaleDateString('en-GB', { month: 'long' })
    dedication.textContent = `${returning ? `${c.welcomeBack} · ` : ''}${weekday}, ${now.getDate()} ${month} · ${hhmm}`
  }

  // A blade remembers its chapter for the Work and the Method (README #44, #45).
  section.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLElement>('a[data-chapter]')
    if (a && w.__c1) w.__c1.chapter = a.dataset.chapter ?? null
  })
  // A finger held on a blade shows its movement, on <html data-held> (the blades are React's). Android's link menu
  // would cover it after ~1 s; the blades are links within this page, so that menu (open in a new tab, copy) has nothing
  // to give (owner, 29 Oct, README #34) — the mouse's right-click menu stays. Holding, Chrome then cancels the touch and
  // never says when the finger lifts (measured on the Xiaomi: contextmenu at 1.16 s, pointercancel at 1.24 s), so after
  // a long press the movement plays to its end (1.6 s) and settles back.
  let held = 0
  let longPress = false
  const release = (after = 0) => {
    clearTimeout(held)
    held = window.setTimeout(() => delete root.dataset.held, after)
  }
  section.addEventListener(
    'pointerdown',
    (e) => {
      const blade = (e.target as Element).closest('.e-blade')
      if (e.pointerType === 'mouse' || !blade) return
      clearTimeout(held)
      longPress = false
      root.dataset.held = String([...section.querySelectorAll('.e-blade')].indexOf(blade))
    },
    { passive: true },
  )
  section.addEventListener('contextmenu', (e) => {
    if (root.dataset.held === undefined) return
    e.preventDefault()
    longPress = true
  })
  section.addEventListener('pointerup', () => release())
  section.addEventListener('pointercancel', () => release(longPress ? 1600 : 0))

  // The film: one request, chosen by the screen's shape; never for reduced motion or Save-Data.
  const video = section.querySelector('video')
  if (video && !reduce && !connection?.saveData) {
    video.muted = true
    video.src = matchMedia('(orientation: portrait)').matches ? c.tall : c.wide
    video.addEventListener('playing', () => (root.dataset.film = 'playing'), {
      once: true,
    })
    // Paused while the entrance is out of view: it costs nothing under the rest of the page.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }).observe(section)
  }

  // Back at the top, the address loses its #chapter: a refresh there shows the entrance again (README #66), as it
  // would for a first visit — with the hash it went straight to that chapter.
  new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio > 0.95 && location.hash)
        history.replaceState(history.state, '', location.pathname + location.search)
    },
    { threshold: [0.95] },
  ).observe(section)

  // Slight depth on the blades with a fine pointer, one frame per movement at most.
  if (matchMedia('(pointer: fine)').matches && !reduce) {
    let frame = 0
    section.addEventListener('pointermove', (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        root.style.setProperty('--px', ((e.clientX / innerWidth) * 2 - 1).toFixed(3))
        root.style.setProperty('--py', ((e.clientY / innerHeight) * 2 - 1).toFixed(3))
      })
    })
  }

  if (root.dataset.entrance !== 'e0') return

  const timers: number[] = []
  const gestures = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'] as const
  const finish = () => {
    timers.forEach(clearTimeout)
    gestures.forEach((g) => removeEventListener(g, skip, true))
    delete root.dataset.entrance
  }
  // Any gesture: the final state at once, without transitions, then the page is the page.
  function skip() {
    timers.forEach(clearTimeout)
    root.dataset.entrance = 'skip'
    requestAnimationFrame(() => requestAnimationFrame(finish))
  }
  gestures.forEach((g) => addEventListener(g, skip, { capture: true, passive: true }))
  const at = (ms: number, state: string) => timers.push(window.setTimeout(() => (root.dataset.entrance = state), ms))

  // The camera enters through the O's left stroke — the letter is the window, its middle is veil.
  const veil = section.querySelector<SVGSVGElement>('.e-veil')
  const origin = () => {
    const portrait = matchMedia('(orientation: portrait)').matches
    const text = section.querySelector<SVGTextElement>(portrait ? '.e-veil .tall' : '.e-veil .wide')
    if (!veil || !text || text.getNumberOfChars() < 9) return false
    const o = text.getExtentOfChar(portrait ? 7 : 8)
    const ox = o.x + o.width * 0.125
    const oy = o.y + o.height * 0.55
    root.style.setProperty('--e-origin', `${ox}px ${oy}px`)

    // The O again, in a small layer over it: the GPU keeps a layer's texture no bigger than about the screen, so the
    // full-screen veil grows from a 1× drawing and the O's edge turned to steps (owner, 29 Oct); a layer the size of
    // the O is drawn several times finer (measured on the PC at ×20: stepped vs sharp). It holds the whole title,
    // cropped to the O's box, so the neighbouring letters match; the veil has a hole there, 4 px smaller, so its
    // soft edge stays under this layer's charcoal.
    const layer = section.querySelector('.e-o')
    if (layer) {
      const pad = o.height * 0.2
      const [x, y, bw, bh] = [o.x - pad, o.y - pad, o.width + 2 * pad, o.height + 2 * pad]
      const W = section.clientWidth
      const H = section.clientHeight
      const box = { x, y, w: bw, h: bh }
      for (const [k, v] of Object.entries(box)) root.style.setProperty(`--e-o-${k}`, `${v.toFixed(2)}px`)
      layer.innerHTML =
        `<svg viewBox="${x} ${y} ${bw} ${bh}"><defs><mask id="e-o-letters">` +
        `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="#fff"/>` +
        `<text class="wide" x="${W / 2}" y="${H * 0.56}" text-anchor="middle" fill="#000">CHAPTER ONE</text>` +
        `<text class="tall" text-anchor="middle" fill="#000"><tspan x="${W / 2}" y="${H * 0.5}">CHAPTER</tspan>` +
        `<tspan x="${W / 2}" y="${H * 0.5923}">ONE</tspan></text></mask></defs>` +
        `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="#1e1d1a" mask="url(#e-o-letters)"/></svg>`
    }
    return true
  }

  // Never a dark screen: whatever happens below, the final state comes within 3 s.
  timers.push(window.setTimeout(() => root.dataset.entrance === 'e0' && skip(), 3000))

  // The letters need their own face; wait for it a moment, never long: without it, the final state.
  // Only the real family: on Android the fallback face next/font declares (a local() font that is not there)
  // makes document.fonts.load reject with a NetworkError (measured on the Xiaomi, 29 Oct).
  const text = section.querySelector('.e-veil text')
  const family = text ? getComputedStyle(text).fontFamily.split(',')[0] : ''
  const timeout = new Promise<boolean>((r) => setTimeout(() => r(false), 1500))
  const loaded = document.fonts.load(`700 100px ${family}`).then(
    (faces) => faces.length > 0,
    () => false,
  )
  Promise.race([loaded, timeout])
    .then((ready) => {
      if (root.dataset.entrance !== 'e0') return
      if (!ready || scrollY > 0 || !origin()) return skip()
      addEventListener('resize', origin)
      root.dataset.entrance = 'e1'
      at(c.lettersAt, 'e2')
      at(c.zoomAt, 'e3')
      at(c.finalAt, 'e4')
      timers.push(window.setTimeout(finish, c.finalAt + c.settle))
    })
    .catch(skip)
}
