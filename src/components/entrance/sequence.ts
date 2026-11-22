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
  // arrived at the Contact: its light already down before the page comes alive (contact-client.tsx keeps it from there), or the
  // Questions' paper, held over it, showed empty until then
  if (location.hash === '#contact') root.classList.add('c-dusk')
  // The page's colour: Safari fills the status area and the overscroll from html and body. Nothing fixed at the bottom edge: a strip made
  // Safari paint a solid bar there, and the scenes now run on under it (entrance.css).
  const frame = getComputedStyle(root).getPropertyValue(`--frame-${light}`).trim()
  const themeMeta = document.querySelector('meta[name="theme-color"]')
  let tone = ''
  let viaMethod = false
  let wasDusk = false
  const ios = CSS.supports('-webkit-touch-callout', 'none')
  const QUESTIONS_EDGE = '#dcd5c8'
  // the Contact's room (contact.css: its own dark)
  const CONTACT_EDGE = '#1b1c1a'
  // the Work's chapters' own addresses (work-client.tsx land): a jump there is a jump to the Work
  const CHAPTERS = ['weddings', 'artists', 'experiences']
  // Chrome's bar showing the open menu's film (Android): put back to the page's colour when the menu goes, even when that colour has not
  // changed
  let menuFilm = false
  // Desktop Safari tints its tab bar, the whole top of its window, with the page's colour (html and body's; it ignores theme-color and the
  // layers' own animations — measured on Safari 27, desk/cenas/tint) and changes it at once, with no fade of its own. So there the colour
  // itself moves, frame by frame, from the one on screen: in its scene's time where the scene has one (a chapter crossing, the dusk), at
  // once where the scene already says it at every frame (the Method's light, the About's room) and for a jump (owner, 22 Nov: "a cor
  // conseguir adaptar a janela toda do safari de forma smooth… tanto scroll para a frente como para trás"). Turned back halfway, it goes
  // back from where it is. Elsewhere (Chrome's desktop draws no colour; iOS and Android have their own, below) as before
  const tinted = !ios && /Apple/.test(navigator.vendor) && matchMedia('(hover: hover) and (pointer: fine)').matches
  type Ease = (t: number) => number
  type Glide = { ms: number; ease: Ease; delay?: number }
  const AT_ONCE: Glide = { ms: 0, ease: (t) => t }
  // a CSS cubic-bezier as a function of the time's share (bisection: a colour needs no more)
  const bezier = (css: string, fallback: Ease): Ease => {
    const p = css.match(/cubic-bezier\(([^)]+)\)/)?.[1].split(',').map(Number)
    if (!p || p.length !== 4 || !p.every(Number.isFinite)) return fallback
    const [x1, y1, x2, y2] = p
    const c = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3
    return (t) => {
      let lo = 0
      let hi = 1
      for (let i = 0; i < 24; i++) {
        const m = (lo + hi) / 2
        if (c(x1, x2, m) < t) lo = m
        else hi = m
      }
      return c(y1, y2, (lo + hi) / 2)
    }
  }
  const inOut: Ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
  const rgbIn = (c: string): number[] | null => {
    const h = c.trim().match(/^#([0-9a-f]{6})$/i)
    if (h) return [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16))
    const m = c.match(/\d+(\.\d+)?/g)
    return m && m.length >= 3 ? m.slice(0, 3).map(Number) : null
  }
  const rgbOut = (v: number[]) => `rgb(${v.map((x) => Math.round(x)).join(', ')})`
  // the colour on screen now (the tinted path), and the glide under way: from, to, when it starts, how long, its curve
  let shown: number[] | null = null
  let glideRaf = 0
  let gFrom: number[] = []
  let gTo: number[] = []
  let gT0 = 0
  let gMs = 0
  let gEase: Ease = inOut
  // the strip of the page the conductor lays just above the viewport for desktop Safari's glass (lib/conductor.ts feed): the same colour,
  // or the Method's light crossing the top as drawn (feedLit)
  let feedEl: HTMLElement | null = null
  let feedLit: string | null = null
  const writeEdges = (colour: string) => {
    // written on the two elements: as a custom property on <html> every change restyled the whole page, on the phone's chapter change
    root.style.backgroundColor = colour
    document.body.style.backgroundColor = colour
    if (!feedEl?.isConnected) feedEl = document.getElementById('c1-feed')
    if (feedEl) feedEl.style.background = feedLit ?? colour
  }
  const step = (now: number) => {
    // the Contact's passage draws the page's colour itself, a frame at a time (contact-client.tsx edges): a glide under way gives way
    if (root.dataset.cRun !== undefined) {
      glideRaf = 0
      return
    }
    const k = Math.min(1, Math.max(0, (now - gT0) / gMs))
    const e = gEase(k)
    shown = gFrom.map((v, i) => v + (gTo[i] - v) * e)
    writeEdges(rgbOut(shown))
    glideRaf = k < 1 ? requestAnimationFrame(step) : 0
  }
  // follow: the scene says its colour at every frame (data-edge) — at once, unless a glide is under way: then it goes on, in its own time,
  // to the colour now said (cut short, the dusk's or a chapter's glide jumped to the scene's colour at its first frame)
  const glideTo = (target: number[], g: Glide, follow = false) => {
    if (follow && glideRaf) {
      gTo = target
      return
    }
    cancelAnimationFrame(glideRaf)
    glideRaf = 0
    // from the colour really on the page: another script may have painted it since (the Contact's passage)
    const now = rgbIn(root.style.backgroundColor) ?? shown
    if (!g.ms || !now) {
      shown = target
      writeEdges(rgbOut(target))
      return
    }
    gFrom = now
    gTo = target
    gT0 = performance.now() + (g.delay ?? 0)
    gMs = g.ms
    gEase = g.ease
    glideRaf = requestAnimationFrame(step)
  }
  const paintEdges = (colour: string, glide: Glide = AT_ONCE, follow = false, lit: string | null = null) => {
    if (colour === tone && lit === feedLit && !menuFilm) return
    feedLit = lit
    menuFilm = false
    tone = colour
    themeMeta?.setAttribute('content', colour)
    const target = tinted ? rgbIn(colour) : null
    if (target) return glideTo(target, glide, follow)
    writeEdges(colour)
  }
  // the dusk's own curve (contact-client.tsx .c-dusk: iOS's fade, above, the same), and the Work's chapters' (work.css --chapter-ease)
  const duskEase = bezier('cubic-bezier(.33, 1, .68, 1)', inOut)
  let chapterEase: Ease | null = null
  const mixHex = (a: string, b: string, k: number) => {
    const x = rgbIn(a)
    const y = rgbIn(b)
    if (!x || !y) return b
    return `#${x.map((v, i) => Math.round(v + (y[i] - v) * Math.min(1, Math.max(0, k))).toString(16).padStart(2, '0')).join('')}`
  }
  if (frame) {
    root.style.setProperty('--frame', frame)
    paintEdges(frame)
    // The open menu is what is at the top of the screen (owner, 12 Nov: "o menu deve ficar completo no ecrã todo… não barras de cor"):
    // on Android the bar Chrome draws over the page takes its colour from theme-color, and stayed the paper's stone over the menu's dark
    // glass (Xiaomi, over the Questions). There it is the menu's film over the colour that was there (bar.css .menu-film, by the ground
    // measured as it opens). On an iPhone the menu runs under the island and Safari's bar itself (bar.css .menu-room), but Safari lays
    // a fade of its own at the screen's top, behind the clock and the island, in the page's colour — ~35 % of it over what is there: the
    // stone's or the studio's over the dark glass, a light band (owner's iPhone, 13 Nov 17:01, measured: 132 over a glass of 78 at the
    // Questions, 121 over 75 at the Method). There too, then, the glass's colour while it is open.
    // The film as the glass is seen through the blur, measured on the devices (the owner's iPhone and the Xiaomi, 13 Nov: 220 → 78 and
    // 72 at the Questions, 202 → 75 and 72 at the Method, the Method's 9 161 → 56, the About's 13 173 → 66): ~0.72 over a light ground
    // (the film's own 0.66 came 20–28 too light on the Xiaomi's bar)
    const FILM: Record<string, number> = { dark: 0.3, mixed: 0.58, light: 0.72 }
    const rgbOf = (c: string) => {
      const h = c.trim().match(/^#([0-9a-f]{6})$/i)
      if (h) return [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16))
      const m = c.match(/\d+(\.\d+)?/g)
      return m && m.length >= 3 ? m.slice(0, 3).map(Number) : null
    }
    const menuTone = (under: string) => {
      const rgb = rgbOf(under)
      const a = FILM[document.querySelector<HTMLElement>('dialog.menu')?.dataset.ground ?? 'dark'] ?? 0.3
      if (!rgb) return '#1e1d1a'
      const film = [20, 19, 17]
      return `#${rgb.map((v, i) => Math.round(v * (1 - a) + film[i] * a).toString(16).padStart(2, '0')).join('')}`
    }
    let menuShown = false
    // the drop's own time (bar.css): the page's colour goes to the glass's and back as the drop grows and shrinks
    const dropSeconds = () => getComputedStyle(root).getPropertyValue('--menu-drop-seconds').trim() || '0.45s'
    const dropTime = () => `background-color ${dropSeconds()} ${getComputedStyle(root).getPropertyValue('--menu-drop-ease').trim() || 'ease'}`
    // while the drop shrinks (from the moment the menu starts closing, for the drop's time): any colour the page takes then — the jump's
    // own too, which may come a moment later — goes in the drop's time
    let menuClosedAt = -1e9
    const closingMenu = () => performance.now() - menuClosedAt < parseFloat(dropSeconds()) * 1000
    const scene = (records?: MutationRecord[]) => {
      const d = root.dataset
      const menuOn = d.menu === 'armed' || d.menu === 'open'
      if (menuOn || menuShown) {
        // closed by a jump (data-jump), the colour of where it was is not put back: the jump's own follows (below) — put back, Chrome's bar
        // showed it 25–80 ms between the menu's and the destination's (Xiaomi, menu tour, 13 Nov)
        if (!ios && (menuOn || d.jump === undefined)) themeMeta?.setAttribute('content', menuOn ? menuTone(tone) : tone)
        if (ios && menuOn) {
          // the page's own colour (tone) stays what the scene says: the glass's is written beside it
          const glass = menuTone(tone)
          root.style.transition = dropTime()
          document.body.style.transition = dropTime()
          root.style.backgroundColor = glass
          document.body.style.backgroundColor = glass
        }
        if (menuShown && !menuOn) menuClosedAt = performance.now()
        // the page (iOS) or Chrome's bar (Android) shows the glass's colour, not the scene's: the next painting puts the scene's back even
        // when it is the same as before the menu (paintEdges clears this)
        if (menuOn) menuFilm = true
        menuShown = menuOn
        if (menuOn) return
      }
      // A jump of the site's own (data-jump: lib/address.ts, the Work's chapters) is painted for where it goes from its first frame: the
      // section said for a moment the one it left, and the edges went by its colour first — the dark of the Method's 11 for ~150 ms on the
      // way from the Method to the Questions' stone (owner, 13 Nov, the menu: "aparecem as barras de cor antigas"; Simulator)
      const jumpTo = d.jump === undefined ? undefined : CHAPTERS.includes(d.jump) ? 'work' : d.jump
      const sec = jumpTo ?? d.section
      const work = document.querySelector<HTMLElement>('.work') // parsed after this script
      const ch = Number(work?.dataset.ch ?? 0)
      const ground = ch > 0 && d.pass === 'done' && work?.querySelectorAll('.w-ground')[ch]
      const past = sec && sec !== 'top' && sec !== 'work' && sec !== 'method' && sec !== 'about'
      // the Method and the About say their colour once they are in place (data-edge): the one they said last time is not where the jump
      // lands (the About's from 14, grey, over 12's dark, ~110 ms, as the section changed before the About had answered; Simulator, 13 Nov)
      // — until the scene it lands on has said it, nothing is painted (the jump's mark going, 600 ms on, paints whatever is there)
      if (jumpTo && (sec === 'method' || sec === 'about') && records && !records.some((r) => r.attributeName === 'data-edge' && (r.target as HTMLElement).id === sec)) return
      // The Method and the About say their own (data-edge): the colour of what is really at the top of the screen, read from the picture
      // drawn there when it is there (src/lib/top-colour.ts; owner, iPhone, 4 Nov) — the Work's ground until the light has covered the
      // screen, then the studio's top, the 9's own page, the dark of 11; the About's dark at 12, the portrait's sky (or the room) at 13.
      // Back above the Method the section is the Work's at once, but the light is still going back: its edge holds until it has gone.
      // Just into the About, before its passage has started, its section is already the About's but what is seen is still the Method's 11.
      const methodEdge = document.getElementById('method')?.dataset.edge ?? ''
      const aboutEdge = document.getElementById('about')?.dataset.edge ?? ''
      // the scene left behind says nothing for a jump: only the one it lands on
      const edge =
        sec === 'about' ? aboutEdge || (jumpTo ? '' : methodEdge) : sec === 'method' || (sec === 'work' && !jumpTo) ? methodEdge : ''

      // in the Method and the About the edges cross-fade (0.3 s, as the light's edge passes the island), and so does the change that ends
      // it; elsewhere they change at once, as before
      // only where the edges are seen (iOS Safari: its status area and the band under its bar); on Android a cross-fade of the page's
      // background repainted the whole page on every frame (Xiaomi, quick strokes over the seam: 58 fps with it, 67.5 without, 3 Nov)
      // the light going down at the Contact (#106, contact-client.tsx .c-dusk) takes the edges with the paper, in its time (1.4 s out;
      // back 0.9 s after 0.15 s): changed at once, the island and the band under Safari's bar stayed the paper's stone over a room
      // already dark, then went dark in one go (owner's iPhone, 10 Nov 13:22: "as cores das bordas topo e fundo ficam bugadas")
      const dusk = root.classList.contains('c-dusk')
      const duskTurn = dusk !== wasDusk && (sec === 'questions' || sec === 'contact')
      wasDusk = dusk
      // a jump of the site's own (the menu, an address: data-jump) lands on its colour at once: faded, the island and the band under
      // Safari's bar kept the colour of where the page had been — the stone's or the studio's over a scene already dark — for 0.3–1.1 s
      // (owner, 13 Nov: "aparecem as barras de cor antigas do topo, zona da ilha, e do fim"; Simulator, menu tour)
      // back from the menu's glass in the drop's time, as it shrinks (on an iPhone: Safari's fade at the top follows the page's colour)
      const fade = !ios
        ? ''
        : closingMenu()
          ? dropTime()
          : d.jump !== undefined
            ? ''
            : duskTurn
          ? dusk
            ? 'background-color 1.1s cubic-bezier(.33, 1, .68, 1) -0.1s'
            : 'background-color .9s cubic-bezier(.33, 1, .68, 1) .15s'
          : sec === 'method' || sec === 'about' || edge || viaMethod
            ? 'background-color .3s linear'
            : ''
      viaMethod = !!edge
      // The Work's own colour: its chapter's ground, the frame's at the top and on Weddings
      const workTone = ground ? getComputedStyle(ground).backgroundColor : frame
      // The Method's light still crossing the top (a desktop, method-stage.ts beamEdge): what is there is the studio's on the lit share of
      // the top line and the Work's on the rest — the share it says (data-mix), of the studio's colour over the Work's
      const share = Number(document.getElementById('method')?.dataset.mix ?? NaN)
      const lit = edge && edge === methodEdge && Number.isFinite(share) ? mixHex(workTone, methodEdge, share) : edge
      // and, for the strip above the viewport, where on the top line it is lit (data-lit: its two edges, shares of the width): the studio
      // between them, the Work's outside, each edge as soft as the light's own spill (a twentieth of the width, method.css)
      const band = lit !== edge ? document.getElementById('method')?.dataset.lit?.split(',').map(Number) : undefined
      const beam =
        band && band.length === 2 && band.every(Number.isFinite)
          ? `linear-gradient(90deg, ${workTone} ${(band[0] * 100 - 2.5).toFixed(2)}%, ${methodEdge} ${(band[0] * 100 + 2.5).toFixed(2)}%, ${methodEdge} ${(band[1] * 100 - 2.5).toFixed(2)}%, ${workTone} ${(band[1] * 100 + 2.5).toFixed(2)}%)`
          : null
      // the Questions: their paper's top (questions.css .q-paper), so the island and the band under Safari's bar are the stone's; the
      // charcoal once the light is down
      const colour =
        lit ||
        (sec === 'questions' || sec === 'contact'
          ? dusk || sec === 'contact'
            ? // on Android the Contact says what is at the top of the screen (contact-client.tsx, data-edge), once it has settled there
              (!ios && sec === 'contact' && document.getElementById('contact')?.dataset.edge) || CONTACT_EDGE
            : QUESTIONS_EDGE
          : past || sec === 'about'
            ? '#1e1d1a'
            : workTone)
      // a fade under way (the light's) is left to run while nothing changes the colour
      if (colour === tone && !menuFilm) return
      // on iOS (and desktop Safari) the Contact's passage draws the edges itself, a frame at a time with the paper's light (contact-client.tsx
      // edges()): while it runs (data-c-run) this colour is only where it ends
      if ((ios || tinted) && !jumpTo && (duskTurn || 'cRun' in d) && (sec === 'questions' || sec === 'contact')) {
        tone = colour
        return
      }
      root.style.transition = fade
      document.body.style.transition = fade
      if (!tinted) return paintEdges(colour)
      // Desktop Safari: in the time of what changes. A jump, at once; the dusk in its own time (as iOS's fade, above); the Method's and
      // the About's colour, said at every frame while it moves, as said; a chapter of the Work in its crossing (work.css: the grounds,
      // 1.1 s); any other change (the Questions' paper reaching the top, the way back from it, the sections' own) in 0.45 s
      const changed = new Set((records ?? []).map((r) => r.attributeName))
      chapterEase ??= bezier(getComputedStyle(work ?? root).getPropertyValue('--chapter-ease'), inOut)
      if (!records || d.jump !== undefined || jumpTo) paintEdges(colour)
      else if (duskTurn) paintEdges(colour, dusk ? { ms: 1100, delay: -100, ease: duskEase } : { ms: 900, delay: 150, ease: duskEase })
      else if (edge && (changed.has('data-edge') || changed.has('data-mix') || changed.has('data-lit'))) paintEdges(colour, AT_ONCE, true, beam)
      else if (changed.has('data-ch')) paintEdges(colour, { ms: 1100, ease: chapterEase })
      else paintEdges(colour, { ms: 450, ease: inOut })
    }
    const watch = new MutationObserver(scene)
    watch.observe(root, { attributes: true, attributeFilter: ['data-pass', 'data-section', 'class', 'data-menu', 'data-jump'] })
    addEventListener('DOMContentLoaded', () => {
      const work = document.querySelector('.work')
      if (work) watch.observe(work, { attributes: true, attributeFilter: ['data-ch'] })
      const method = document.getElementById('method')
      if (method) watch.observe(method, { attributes: true, attributeFilter: ['data-edge', 'data-mix', 'data-lit'] })
      const about = document.getElementById('about')
      if (about) watch.observe(about, { attributes: true, attributeFilter: ['data-edge'] })
      const contact = document.getElementById('contact')
      if (contact && !ios) watch.observe(contact, { attributes: true, attributeFilter: ['data-edge'] })
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
  // The camera goes through the O once the film moves: started before it played, the woman stood still through the letters and the
  // video came in later, now and then (owner, iPhone over the LAN, 7 Nov). It waits for 'playing', at most FILM_WAIT, and not at all
  // where the film will not play (an error; play() refused, as in iOS's Low Power Mode).
  const FILM_WAIT = 2500
  let filmMoves: () => void = () => {}
  const filmReady = new Promise<void>((r) => (filmMoves = r))
  if (video && !reduce && !connection?.saveData) {
    video.muted = true
    video.src = matchMedia('(orientation: portrait)').matches ? c.tall : c.wide
    video.addEventListener(
      'playing',
      () => {
        root.dataset.film = 'playing'
        filmMoves()
      },
      { once: true },
    )
    video.addEventListener('error', filmMoves, { once: true })
    // Paused while the entrance is out of view: it costs nothing under the rest of the page.
    new IntersectionObserver((es) => {
      if (es[es.length - 1].isIntersecting) video.play().catch(filmMoves)
      else video.pause()
    }).observe(section)
  } else filmMoves()

  let away = false
  // Back at the top, the address loses its #chapter: a refresh there shows the entrance again (README #66), as it
  // would for a first visit — with the hash it went straight to that chapter.
  new IntersectionObserver(
    (es) => {
      const ratio = es[es.length - 1].intersectionRatio
      // only once the visitor has been away and comes back up: on arrival with an address the page is still at the top when this first
      // reads, and Safari read it before the page had gone to the address — the address went and the visitor stayed at the top
      // (Safari 27.2, #questions, 2 times in 2, 10 Nov)
      if (ratio < 0.95) away = true
      else if (away && location.hash) history.replaceState(history.state, '', location.pathname + location.search)
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
      // still from the moment the passage starts: the Work measures the blade then and flies from there (work-client.tsx, pathNow); one
      // still gliding went on under the photograph as it took the blade's place. The next movement of the pointer at the top goes on from here
      if (root.dataset.pass) {
        frame = 0
        return
      }
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
  // the film: under the 3 s above, so the sequence still runs when the video is slow (then over the poster, as before)
  const film = Promise.race([filmReady, new Promise<void>((r) => setTimeout(r, FILM_WAIT))])
  Promise.all([Promise.race([loaded, timeout]), film])
    .then(([ready]) => {
      if (root.dataset.entrance !== 'e0') return
      if (!ready || scrollY > 0 || !origin()) return skip()
      addEventListener('resize', origin)
      root.dataset.entrance = 'run'
      timers.push(window.setTimeout(unhold, c.finalAt))
      timers.push(window.setTimeout(finish, c.finalAt + c.settle))
    })
    .catch(skip)
}
