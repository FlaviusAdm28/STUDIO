/*
  The entrance's two scripts. They run inline, as the HTML arrives — before React hydrates — so the arrival
  is never a dark screen waiting for the framework (on the Xiaomi over 4G that wait is seconds). Each is
  a self-contained function serialised with `toString()`: no imports, no closures over this module.

  The server HTML is the final state (E4); with no JavaScript, or with reduced motion / Save-Data / a hash,
  nothing here changes how it looks. Everything this script writes goes on <html> (or inside the dedication,
  whose content React does not hydrate): it runs before hydration, and React rebuilds any element it owns
  whose attributes or text changed (measured 29 Oct: error #418 wiped the state, the text and the film).
  The state lives on <html data-entrance>: e0 waits for the title's face, run plays the one timeline that entrance.css
  declares (E1 the dedication, E2 the letters open, E3 through the O, E4 the final state), and then the attribute goes.
  Any gesture jumps to the end ("skip"). interactions.md §1, storyboard E1–E4, README #64 #66 #70.
*/

/** Runs first in <body>: decides whether the sequence runs, before anything is painted. */
export function entranceGate() {
  try {
    // the page's scripts will run: the Work's stage and the like style themselves on this (no flash, set before paint)
    document.documentElement.dataset.js = ''
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!reduce && !connection?.saveData && !location.hash) document.documentElement.dataset.entrance = 'e0'
  } catch {}
}

export type EntranceConfig = {
  welcomeBack: string
  wide: string
  tall: string
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
  // The light of the visitor's hour follows the real sun of the day (owner, 29 Oct: fixed hours said "evening" at 20:50
  // in late October, two hours after sunset). Sunrise and sunset from the sunrise equation, for Lisbon / Madeira / the
  // Azores by time zone, elsewhere for the zone's meridian at 40° N — nothing is asked of the visitor. Morning: from
  // 30 min before sunrise to 3 h after; evening: from 1 h 30 before sunset to 40 min after; day between; night the rest.
  const zone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return ''
    }
  })()
  const place: Record<string, [number, number]> = {
    'Europe/Lisbon': [38.72, -9.14],
    'Atlantic/Madeira': [32.65, -16.91],
    'Atlantic/Azores': [37.74, -25.67],
  }
  const [lat, lon] = place[zone] ?? [40, -now.getTimezoneOffset() / 4]
  const rad = Math.PI / 180
  const J2000 = Date.UTC(2000, 0, 1, 12)
  const n = Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12) - J2000) / 864e5) - lon / 360
  const M = (357.5291 + 0.98560028 * n) % 360
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad)
  const lambda = (M + C + 282.9372) % 360
  const transit = n + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * lambda * rad)
  const dec = Math.asin(Math.sin(lambda * rad) * Math.sin(23.44 * rad))
  const cosW = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) / (Math.cos(lat * rad) * Math.cos(dec))
  const w0 = Math.acos(Math.min(1, Math.max(-1, cosW))) / rad / 360
  const rise = J2000 + (transit - w0) * 864e5
  const set = J2000 + (transit + w0) * 864e5
  const t = now.getTime()
  const min = 6e4
  const light =
    t >= rise - 30 * min && t < rise + 180 * min
      ? 'morning'
      : t >= rise + 180 * min && t < set - 90 * min
        ? 'day'
        : t >= set - 90 * min && t < set + 40 * min
          ? 'evening'
          : 'night'
  const w = window as Window & {
    __c1?: { arrival: object; chapter: string | null; hash: string }
  }
  w.__c1 = {
    arrival: { time: now.getTime(), hhmm, light, returning },
    chapter: null,
    // the address the visitor arrived with: the Work lands on it later, after this script has cleared it at the top
    hash: location.hash,
  }
  root.dataset.light = light
  // The page's colour: Safari fills the status area and the overscroll from html and body. Nothing fixed at the bottom edge: a strip made
  // Safari paint a solid bar there, and the scenes now run on under it (entrance.css).
  const frame = getComputedStyle(root).getPropertyValue(`--frame-${light}`).trim()
  const themeMeta = document.querySelector('meta[name="theme-color"]')
  let tone = ''
  let viaMethod = false
  const ios = CSS.supports('-webkit-touch-callout', 'none')
  const paintEdges = (colour: string) => {
    if (colour === tone) return
    tone = colour
    // written on the two elements: as a custom property on <html> every change restyled the whole page, on the phone's chapter change
    root.style.backgroundColor = colour
    document.body.style.backgroundColor = colour
    themeMeta?.setAttribute('content', colour)
  }
  if (frame) {
    root.style.setProperty('--frame', frame)
    paintEdges(frame)
    const scene = () => {
      const d = root.dataset
      const work = document.querySelector<HTMLElement>('.work') // parsed after this script
      const ch = Number(work?.dataset.ch ?? 0)
      const ground = ch > 0 && d.pass === 'done' && work?.querySelectorAll('.w-ground')[ch]
      const past = d.section && d.section !== 'top' && d.section !== 'work' && d.section !== 'method' && d.section !== 'about'
      // The Method and the About say their own (data-edge): the colour of what is really at the top of the screen, read from the picture
      // drawn there when it is there (src/lib/top-colour.ts; owner, iPhone, 4 Nov) — the Work's ground until the light has covered the
      // screen, then the studio's top, the 9's own page, the dark of 11; the About's dark at 12, the portrait's sky (or the room) at 13.
      // Back above the Method the section is the Work's at once, but the light is still going back: its edge holds until it has gone.
      // Just into the About, before its passage has started, its section is already the About's but what is seen is still the Method's 11.
      const methodEdge = document.getElementById('method')?.dataset.edge ?? ''
      const aboutEdge = document.getElementById('about')?.dataset.edge ?? ''
      const edge = d.section === 'about' ? aboutEdge || methodEdge : d.section === 'method' || d.section === 'work' ? methodEdge : ''
      // in the Method and the About the edges cross-fade (0.3 s, as the light's edge passes the island), and so does the change that ends
      // it; elsewhere they change at once, as before
      // only where the edges are seen (iOS Safari: its status area and the band under its bar); on Android a cross-fade of the page's
      // background repainted the whole page on every frame (Xiaomi, quick strokes over the seam: 58 fps with it, 67.5 without, 3 Nov)
      const fade = ios && (d.section === 'method' || d.section === 'about' || edge || viaMethod) ? 'background-color .3s linear' : ''
      viaMethod = !!edge
      root.style.transition = fade
      document.body.style.transition = fade
      paintEdges(edge || (past || d.section === 'about' ? '#1e1d1a' : ground ? getComputedStyle(ground).backgroundColor : frame))
    }
    const watch = new MutationObserver(scene)
    watch.observe(root, { attributes: true, attributeFilter: ['data-pass', 'data-section'] })
    addEventListener('DOMContentLoaded', () => {
      const work = document.querySelector('.work')
      if (work) watch.observe(work, { attributes: true, attributeFilter: ['data-ch'] })
      const method = document.getElementById('method')
      if (method) watch.observe(method, { attributes: true, attributeFilter: ['data-edge'] })
      const about = document.getElementById('about')
      if (about) watch.observe(about, { attributes: true, attributeFilter: ['data-edge'] })
    })
  }
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

  // Slight depth on the blades with a fine pointer, across only. Each blade is eased here and written directly. It was a custom
  // property on <html> with a CSS transition: every movement recalculated the page and restarted the transition, and the blades
  // shook under the pointer (owner, 31 Oct). The loop runs only while they are settling, and not during the sequence.
  if (matchMedia('(pointer: fine)').matches && !reduce) {
    const blades = [...section.querySelectorAll<HTMLElement>('.e-blade')]
    let aim = 0
    let mid = 0
    let x = 0
    let frame = 0
    let last = 0
    // Nothing vertical, and the bottom edge held on a device pixel. Moving through fractions of a pixel, the photograph and its
    // shade, composited apart, were cut differently there: a light or dark line that trembled under the slow zoom (owner, 1 Nov;
    // risco.mjs, 20 levels with the 4–6 px of vertical depth).
    let snaps: string[] | null = null
    addEventListener('resize', () => (snaps = null))
    const snap = () =>
      blades.map((b) => {
        const bottom = b.getBoundingClientRect().bottom - (parseFloat(b.style.translate.split(' ')[1]) || 0)
        const dpr = devicePixelRatio
        return (Math.round(bottom * dpr) / dpr - bottom).toFixed(3)
      })
    // Two easings in a row, on the clock and not per frame: one passed a shaken pointer through as a tremor, worse the more hertz
    // the screen has (owner, 1 Nov).
    const ease = (t: number) => {
      const k = 1 - Math.exp(-Math.min(0.05, (t - last) / 1000) * 7)
      last = t
      mid += (aim - mid) * k
      x += (mid - x) * k
      const resting = Math.abs(aim - x) < 0.002
      if (resting) mid = x = aim
      snaps ??= snap()
      const edges = snaps
      blades.forEach((b, i) => (b.style.translate = `${(x * (6 + i * 2)).toFixed(2)}px ${edges[i]}px`))
      frame = resting ? 0 : requestAnimationFrame(ease)
    }
    section.addEventListener(
      'pointermove',
      (e) => {
        if (root.dataset.entrance) return
        aim = (e.clientX / innerWidth) * 2 - 1
        if (frame) return
        last = performance.now()
        frame = requestAnimationFrame(ease)
      },
      { passive: true },
    )
  }

  if (root.dataset.entrance !== 'e0') return

  const timers: number[] = []
  const gestures = ['keydown', 'scroll'] as const
  // Scrolling does nothing until the camera is through (owner, iPhone, 1 Nov: a scroll cut the entrance short and went on to Weddings;
  // revises "any gesture"). A tap or a key still completes it, and the lock ends with the sequence, within 3 s if it never starts.
  const hold = (e: Event) => e.preventDefault()
  const unhold = () => {
    removeEventListener('wheel', hold)
    removeEventListener('touchmove', hold)
  }
  let downY = 0
  const down = (e: PointerEvent) => (downY = e.clientY)
  const up = (e: PointerEvent) => {
    if (Math.abs(e.clientY - downY) < 10) skip()
  }
  const finish = () => {
    timers.forEach(clearTimeout)
    gestures.forEach((g) => removeEventListener(g, skip, true))
    removeEventListener('pointerdown', down, true)
    removeEventListener('pointerup', up, true)
    unhold()
    delete root.dataset.entrance
  }
  // The final state at once, without transitions, then the page is the page.
  function skip() {
    timers.forEach(clearTimeout)
    unhold()
    root.dataset.entrance = 'skip'
    requestAnimationFrame(() => requestAnimationFrame(finish))
  }
  gestures.forEach((g) => addEventListener(g, skip, { capture: true, passive: true }))
  addEventListener('pointerdown', down, { capture: true, passive: true })
  addEventListener('pointerup', up, { capture: true, passive: true })
  addEventListener('wheel', hold, { passive: false })
  addEventListener('touchmove', hold, { passive: false })

  // The camera enters through the O's left stroke — the letter is the window, its middle is veil.
  const veil = section.querySelector<SVGSVGElement>('.e-veil')
  const origin = () => {
    const portrait = matchMedia('(orientation: portrait)').matches
    const text = section.querySelector<SVGTextElement>(portrait ? '.e-veil .tall' : '.e-veil .wide')
    if (!veil || !text || text.getNumberOfChars() < 9) return false
    if (portrait) {
      const lines = text.querySelectorAll('tspan')
      const shown = Math.min(section.clientHeight, innerHeight)
      lines[0]?.setAttribute('y', String(shown * 0.5))
      lines[1]?.setAttribute('y', String(shown * 0.5923))
    }
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
      // the letters sit on the part of the screen that shows, not on the scene that runs on under the bar
      const H = Math.min(section.clientHeight, innerHeight)
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
      root.dataset.entrance = 'run'
      timers.push(window.setTimeout(unhold, c.finalAt))
      timers.push(window.setTimeout(finish, c.finalAt + c.settle))
    })
    .catch(skip)
}
