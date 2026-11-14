'use client'

import { useEffect } from 'react'
import { lensMap } from '@/lib/lens'
import { press } from '@/lib/press'
import { landOnAddresses } from '@/lib/address'
import { unsnapped } from '@/lib/unsnapped'
import { governWheel } from '@/lib/finger'

type Section = { readonly id: string; readonly number: string; readonly label: string }
type Props = {
  sections: readonly Section[]
  hello: string
  yourTime: string
  openMenu: string
  closeMenu: string
}

/*
  What the bar does once the page is live (README #69, #70, #71): the section under the bar, the visitor's time, each
  island's darkness from what is really behind its words, the lens of each island, and the menu. It returns nothing:
  the markup is the server's (bar.tsx). It runs after hydration, so it may write to React's elements; the states it
  shares with the CSS live on <html> (data-section, data-menu).
*/
export function BarClient(props: Props) {
  useEffect(() => {
    const root = document.documentElement
    const bar = document.querySelector<HTMLElement>('.bar')
    const dialog = document.querySelector<HTMLDialogElement>('dialog.menu')
    if (!bar || !dialog) return
    const islands = [...bar.querySelectorAll<HTMLElement>('.bar-isl')]
    const sec = bar.querySelector<HTMLElement>('.bar-sec')
    const left = bar.querySelector<HTMLAnchorElement>('.bar-left')
    const button = bar.querySelector<HTMLAnchorElement>('.bar-menu')
    const drop = dialog.querySelector<HTMLElement>('.menu-drop')
    const links = [...dialog.querySelectorAll<HTMLAnchorElement>('.menu-list a')]
    const cleanups: (() => void)[] = []
    const on = <K extends keyof WindowEventMap>(
      k: K,
      f: (e: WindowEventMap[K]) => void,
      o?: AddEventListenerOptions,
    ) => {
      addEventListener(k, f, o)
      cleanups.push(() => removeEventListener(k, f, o))
    }

    // ---- the section under the bar: a band at the top of the screen, watched by an observer (no scroll handler) ----
    const byId = Object.fromEntries(props.sections.map((s) => [s.id, s]))
    // The words follow the scene that is seen, not only the line the page has crossed: the Method and the About change scene by their
    // own phases (a dead band, a passage, a way back held while the light goes), and by position alone the bar said 02 Method over the
    // whole Work for 0.2 s, 02 Method over the About's portrait for 1.9 s going back, 02 Method over Experiences for 2.4 s (owner,
    // iPhone, 6 Nov; Simulator journey, 7 Nov). While a scene runs (data-phase) it decides, by what each scene says is seen (data-seen:
    // the Method once its light has crossed the top's middle, the About once its portrait is half there); elsewhere, and without the
    // motion, the position. html's data-section stays the position (the edges' colours read it, sequence.ts).
    const method = document.getElementById('method')
    const about = document.getElementById('about')
    const seen = (id: string) => {
      if (id !== 'work' && id !== 'method' && id !== 'about') return id
      if (!method?.dataset.phase && !about?.dataset.phase) return id
      if (about?.dataset.seen !== undefined) return 'about'
      if (method?.dataset.seen !== undefined) return 'method'
      return 'work'
    }
    let shown = ''
    const render = () => {
      const id = seen(root.dataset.section ?? '')
      if (id === shown) return
      shown = id
      const s = byId[id]
      // Leaving for the top the last words stay while the island fades: emptied here, 01 Work vanished at once and the name went
      // on alone (owner, iPhone, 1 Nov).
      // the word alone, no number (owner, 12 Nov: "Chapter One | 03 About" read as two numberings; the menu keeps them, in order)
      if (sec && s) sec.textContent = s.label
      // at the top the name's island is hidden (#70): out of the keyboard's way too
      if (left) left.tabIndex = s ? 0 : -1
      links.forEach((a) => a.setAttribute('aria-current', String(a.dataset.section === id)))
    }
    const setSection = (id: string) => {
      if (root.dataset.section === id) return
      root.dataset.section = id
      render()
      queue()
    }
    // the scenes' changes of phase and their ways back
    const scenes = new MutationObserver(render)
    for (const el of [method, about]) if (el) scenes.observe(el, { attributes: true, attributeFilter: ['data-phase', 'data-seen'] })
    cleanups.push(() => scenes.disconnect())
    // a section can mark where it really starts (data-starts): the Work lies under the entrance during the passage
    const mark = (id: string) => document.querySelector(`[data-starts="${id}"]`) ?? document.getElementById(id)
    const watched = [document.getElementById('top'), ...props.sections.map((s) => mark(s.id))]
    const idOf = (el: Element) => (el as HTMLElement).dataset.starts ?? el.id
    // The held entrance lies over the Work's start: two marks can share the band. The later one in the page wins. Weddings'
    // step grew half a screen (README #88), and on the way up the entrance's end then reached the band inside Weddings and
    // hid the name's island there (Xiaomi, 2 Nov).
    const inBand = new Set<Element>()
    const sections = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target)))
        entries.forEach((e) => {
          const later = watched.slice(watched.indexOf(e.target) + 1).some((x) => x && inBand.has(x))
          if (e.isIntersecting) {
            if (!later) setSection(idOf(e.target))
          }
          // Back above a section's start, the one before it again: it never left the line, so nothing announces it. The bar stayed
          // on 02 Method over the whole of Experiences on the way up (test round, 1 Nov); above the Work it is the top. The later one
          // in the band if there is one: a jump from the Contact to the About (the menu) passed the Questions, and the one before the
          // Contact set 04 Questions over the About's 12 (Chrome and Safari 1500 wide, 12 Nov)
          else if (idOf(e.target) === root.dataset.section && e.boundingClientRect.top > 0) {
            const last = [...watched].reverse().find((x) => x && inBand.has(x))
            const before = last ?? watched[watched.indexOf(e.target) - 1]
            if (before) setSection(idOf(before))
          }
        })
      },
      { rootMargin: '0px 0px -92% 0px' },
    )
    watched.forEach((el) => el && sections.observe(el))
    cleanups.push(() => sections.disconnect())
    if (left && !root.dataset.section) left.tabIndex = -1
    // The name goes to the top. By its address alone it did nothing in the passage and at the start of the Work: the held
    // entrance is already on screen there, so there is nowhere to scroll to (audit, 31 Oct).
    const toTop = (e: MouseEvent) => {
      e.preventDefault()
      history.pushState(null, '', location.pathname + location.search)
      unsnapped(() => scrollTo(0, 0))
    }
    left?.addEventListener('click', toTop)
    cleanups.push(() => left?.removeEventListener('click', toTop))

    // ---- the visitor's time, in the bar (desktop) and the menu ----
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = () => {
      const d = new Date()
      const hhmm = `${pad(d.getHours())}:${pad(d.getMinutes())}`
      const time = bar.querySelector('.bar-time')
      if (time) time.textContent = hhmm
      const menuTime = dialog.querySelector('.menu-time')
      if (menuTime) menuTime.textContent = props.yourTime.replace('{time}', hhmm)
    }
    tick()
    const clock = window.setInterval(tick, 15000)
    cleanups.push(() => clearInterval(clock))
    // the press under a finger: the menu's button and the menu's own links (owner, 3 Nov, option A)
    cleanups.push(press(document.body, '.bar-menu, .menu-list a, .menu-go, .menu-channels a'))
    // the Method's and the About's addresses land where they are seen, not on their top (src/lib/address.ts)
    cleanups.push(landOnAddresses())
    // one stroke of a wheel or a trackpad, one stop, on a desktop (lib/finger.ts): for the whole page, so here, with the bar
    cleanups.push(governWheel())

    // ---- each island's darkness: measured under its words only (README #71) ----
    // The brightness of every image is read once, on a 24 × 24 grid (sRGB luma); the film is read from its poster (the
    // same frame) through the entrance's tint; a section with no image under the point counts as charcoal.
    const N = 24
    const grids = new Map<string, Float32Array>()
    const reading = new Set<string>()
    const grid = (img: HTMLImageElement) => {
      const url = img.currentSrc || img.src
      if (!url || grids.has(url) || reading.has(url) || !img.complete || !img.naturalWidth) return grids.get(url)
      reading.add(url)
      const c = document.createElement('canvas')
      c.width = c.height = N
      const g = c.getContext('2d', { willReadFrequently: true })
      if (!g) return
      g.drawImage(img, 0, 0, N, N)
      const d = g.getImageData(0, 0, N, N).data
      const L = new Float32Array(N * N)
      for (let i = 0; i < N * N; i++) L[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255
      grids.set(url, L)
      return L
    }
    // a point of an <img> drawn with object-fit: cover at its object-position
    const imageLum = (img: HTMLImageElement, x: number, y: number) => {
      const L = grid(img)
      if (!L) return null
      const r = img.getBoundingClientRect()
      const sc = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight)
      const dw = img.naturalWidth * sc
      const dh = img.naturalHeight * sc
      const [px, py] = getComputedStyle(img)
        .objectPosition.split(' ')
        .map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5))
      const u = (x - r.left - (r.width - dw) * px) / dw
      const v = (y - r.top - (r.height - dh) * py) / dh
      const col = Math.min(N - 1, Math.max(0, Math.floor(u * N)))
      const row = Math.min(N - 1, Math.max(0, Math.floor(v * N)))
      return L[row * N + col]
    }
    const lumAt = (x: number, y: number) => {
      let dim = 1
      for (const el of document.elementsFromPoint(x, y)) {
        if (el.closest('.bar, dialog.menu')) continue
        // the entrance's tint of the hour over the film: about .62 of the light comes through at the bar's height
        if (el.classList.contains('e-tint')) {
          dim *= 0.62
          continue
        }
        const img =
          el instanceof HTMLImageElement
            ? el
            : el.classList.contains('e-video')
              ? el.parentElement?.querySelector<HTMLImageElement>('picture img')
              : null
        if (img) {
          const l = imageLum(img, x, y)
          if (l !== null) return l * dim
          continue
        }
        // a section, or a part of one, that declares its own brightness (the Method's studio by the hour, its dark end)
        const section = el.closest<HTMLElement>('[data-lum]')
        if (section) return +(section.dataset.lum ?? 0.1) * dim
      }
      return 0.1 * dim
    }
    const tintFor = (el: HTMLElement) => {
      // the words' box: 6 × 2 points, the 75th percentile (one bright corner no longer darkens the whole island)
      const r = el.getBoundingClientRect()
      const L: number[] = []
      for (let i = 0; i < 6; i++)
        for (let j = 0; j < 2; j++)
          L.push(lumAt(r.left + (r.width * (i + 0.5)) / 6, r.top + (r.height * (j + 0.5)) / 2))
      L.sort((a, b) => a - b)
      const lum = L[Math.floor(L.length * 0.75)]
      return { lum, a: Math.min(0.5, Math.max(0.06, 0.06 + (lum - 0.2) * 0.75)) }
    }
    const update = () => {
      // with the menu open the islands keep the darkness they had (28 Oct: dropping it washed one out over the sun)
      if (root.dataset.menu) return
      islands.forEach((el) => {
        const { lum, a } = tintFor(el)
        el.style.setProperty('--tint', `rgba(22, 21, 19, ${a.toFixed(2)})`)
        el.classList.toggle('on-paper', lum > 0.55)
      })
    }
    // at most every 80 ms while scrolling, once after it stops; never per frame
    let last = 0
    let queued = false
    // Not while the camera goes through the O, nor during the passage: 24 hit tests force the style of the whole page,
    // and with the Work in it that blocked the main thread 60–100 ms right as the zoom began; the film skipped up to 5
    // frames, the tremor the owner saw (Xiaomi, 31 Oct). What is behind the islands is read before and after.
    const moving = () => root.dataset.entrance === 'run' || root.dataset.pass === 'on'
    function queue() {
      if (queued || moving()) return
      queued = true
      const wait = Math.max(0, 80 - (performance.now() - last))
      window.setTimeout(
        () =>
          requestAnimationFrame(() => {
            queued = false
            last = performance.now()
            if (!moving()) update()
          }),
        wait,
      )
    }
    on('scroll', queue, { passive: true })
    on('resize', queue)
    on('load', queue)
    // images arriving later (lazy) and the entrance ending change what is behind the islands
    const onImage = (e: Event) => e.target instanceof HTMLImageElement && queue()
    document.addEventListener('load', onImage, true)
    cleanups.push(() => document.removeEventListener('load', onImage, true))
    // A jump to a chapter passes the mark of the Work's start without ever touching the band, and no observer fires: the bar
    // stayed with no section, and the name's island hidden, arriving by a blade or a chapter's address (audit, 31 Oct).
    const states = new MutationObserver(() => {
      if (root.dataset.pass === 'done' && (!root.dataset.section || root.dataset.section === 'top'))
        setSection(props.sections[0].id)
      queue()
    })
    states.observe(root, { attributes: true, attributeFilter: ['data-entrance', 'data-light', 'data-pass'] })
    cleanups.push(() => states.disconnect())
    queue()

    // ---- the lens: a displacement map shaped like each island; within 14 px of its rim the backdrop is pulled from
    // further inside, so the rim magnifies (README #69). Only where backdrop-filter takes a url() (Chromium). ----
    // Not in WebKit: Safari (iOS 27.3 at least) now accepts the url() but draws no lens (the island pixel for pixel the same with it or
    // without, Simulator, 9 Nov), and its filter kept a map of an older width: a second, smaller pill inside the left island, from its
    // left end to about the section's number (owner's iPhone, 9 Nov). Turning the filter off and on cleared it; without the url() it
    // has nothing to keep
    const webkit = navigator.vendor === 'Apple Computer, Inc.'
    if (!webkit && CSS.supports('backdrop-filter', 'url(#bar-lens-left) blur(1px)')) {
      const sizes = new Map<string, string>()
      const lens = () =>
        islands.forEach((el) => {
          const side = el.dataset.lens ?? ''
          const w = Math.round(el.offsetWidth)
          const h = Math.round(el.offsetHeight)
          if (!w || !h || sizes.get(side) === `${w}x${h}`) return
          sizes.set(side, `${w}x${h}`)
          const map = document.querySelector(`#bar-lens-${side} .bar-lens-map`)
          map?.setAttribute('href', lensMap(w, h))
          map?.setAttribute('width', String(w))
          map?.setAttribute('height', String(h))
        })
      lens()
      root.classList.add('bar-lens')
      const resized = new ResizeObserver(lens)
      islands.forEach((el) => resized.observe(el))
      cleanups.push(() => resized.disconnect())
    }

    // ---- the menu: a drop of glass grown from the menu island's rounded right end (README #69) ----
    const inert = [document.querySelector('main'), document.querySelector('.colophon'), left]
    const setOpenLabel = (open: boolean) => {
      button?.setAttribute('aria-label', open ? props.closeMenu : props.openMenu)
      button?.setAttribute('aria-expanded', String(open))
    }
    setOpenLabel(false)
    const lightShare = () => {
      // how much of the list's area is over a light ground, measured once as the menu opens
      const r = dialog.querySelector('.menu-list')?.getBoundingClientRect()
      if (!r) return 0
      let light = 0
      for (let i = 0; i < 6; i++)
        for (let j = 0; j < 6; j++)
          if (lumAt(r.left + (r.width * (i + 0.5)) / 6, r.top + (r.height * (j + 0.5)) / 6) > 0.55) light++
      return light / 36
    }
    // the page stays still under the open menu (owner, 12 Nov: a stroke over the menu took the page from the Questions to the Contact
    // behind it, and on an iPhone the menu, lying in the page, went with it): strokes, the wheel and the keys that scroll. By the events,
    // not overflow: hidden on the page — a change of the page's layout while it rests on a stop, and Safari puts it back on the stop it
    // last knew (WebKit's resnap, 12 Nov)
    const ios = CSS.supports('-webkit-touch-callout', 'none')
    const still = (e: Event) => e.cancelable && e.preventDefault()
    const SCROLL_KEYS = new Set([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'])
    const stillKeys = (e: KeyboardEvent) => SCROLL_KEYS.has(e.key) && e.preventDefault()
    // a stroke's momentum may still carry the page as the menu opens: on an iPhone the menu, in the page, goes with it
    const follow = () => dialog.style.setProperty('--menu-at', `${scrollY}px`)
    const hold = (on: boolean) => {
      if (on) {
        window.addEventListener('wheel', still, { passive: false })
        window.addEventListener('touchmove', still, { passive: false })
        window.addEventListener('keydown', stillKeys)
        if (ios) window.addEventListener('scroll', follow, { passive: true })
      } else {
        window.removeEventListener('wheel', still)
        window.removeEventListener('touchmove', still)
        window.removeEventListener('keydown', stillKeys)
        // following the page goes on while the drop shrinks (finish): the menu stays where the screen is as a section chosen in it moves
        // the page (bar.css: in the page until it has closed)
      }
    }
    const unfollow = () => window.removeEventListener('scroll', follow)
    cleanups.push(unfollow)
    cleanups.push(() => hold(false))
    on('resize', () => (root.dataset.menu === 'open' || root.dataset.menu === 'armed') && placeDrop())
    // the drop's place and size, from the menu island where it is now: as it opens, and again if the window changes while it is open
    // (made wider, a corner was left uncovered; made narrow, the island moved and the drop would have closed onto where it had been)
    let belowNow = 0
    const placeDrop = () => {
      const isl = button?.closest<HTMLElement>('.bar-isl')?.getBoundingClientRect()
      if (!isl) return false
      const rCap = isl.height / 2
      // on an iPhone the menu lies in the page where the screen is, its room on into the bands above and below (bar.css)
      const px = (k: string) => parseFloat(getComputedStyle(root).getPropertyValue(k)) || 0
      const above = ios ? px('--menu-above') : 0
      // below the screen only as much as the page still has there: past the page's end the room made the page longer, and at the end
      // WebKit took the page on into it, a pixel at a time (its stop at the end is aligned by the page's foot, and the menu followed the
      // page): the colophon went up ~40 px with the menu open, and stayed (owner's iPhone, 14 Nov 00:54; the Simulator: 16098 → 16138,
      // the page 160 px longer). There Safari paints the band under its bar with the page's own colour, which is the glass's while the
      // menu is open (entrance/sequence.ts). Measured as it opens, the menu not yet in the page
      if (ios && !root.dataset.menu) belowNow = Math.max(0, Math.min(px('--menu-below'), root.scrollHeight - scrollY - innerHeight))
      const below = ios ? belowNow : 0
      if (ios) {
        dialog.style.setProperty('--menu-at', `${scrollY}px`)
        dialog.style.setProperty('--menu-h', `${innerHeight}px`)
        dialog.style.setProperty('--menu-below', `${below}px`)
      }
      // just large enough to reach the farthest corner of its room: the drop covers it exactly as it stops growing. Larger
      // (the screen's diagonal), it covered the screen at ~0.94 and kept growing, and its blur grew with it — the owner saw
      // the blurred page shift as it settled (29 Oct, desktop)
      const cx = isl.right - rCap
      const cy = isl.top + rCap + above
      const R = Math.ceil(Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight + above + below - cy))) + 2
      dialog.style.setProperty('--drop-x', `${cx}px`)
      dialog.style.setProperty('--drop-y', `${cy}px`)
      dialog.style.setProperty('--drop-r', `${R}px`)
      dialog.style.setProperty('--drop-s0', (rCap / R).toFixed(4))
      return true
    }
    const open = (byKeys = false) => {
      if (root.dataset.menu || !drop || !placeDrop()) return
      dialog.show()
      const k = lightShare()
      dialog.dataset.ground = k >= 0.5 ? 'light' : k > 0.2 ? 'mixed' : 'dark'
      root.dataset.menu = 'armed'
      inert.forEach((el) => el?.setAttribute('inert', ''))
      hold(true)
      setOpenLabel(true)
      // the glass is visible two frames before it grows, so its backdrop exists when the drop starts (28 Oct)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          root.dataset.menu = 'open'
          // from the keyboard the first link takes the focus; opened by a touch or the mouse the menu itself does: on a link, Safari
          // drew its focus ring around 01 Work under the finger (iPhone Simulator, 12 Nov)
          if (byKeys) links[0]?.focus({ preventScroll: true })
          else dialog.focus({ preventScroll: true })
        }),
      )
    }
    // closed by a click or a touch the focus still goes back to the button, without its ring: Safari drew it round Menu after every click
    // (Safari 27.2, real mouse, 12 Nov); the next key brings it back
    const unquiet = () => button && delete button.dataset.quiet
    on('keydown', unquiet)
    button?.addEventListener('blur', unquiet)
    cleanups.push(() => button?.removeEventListener('blur', unquiet))
    const close = (focusButton = true, quiet = false) => {
      if (root.dataset.menu !== 'open' && root.dataset.menu !== 'armed') return
      // in the page still while the drop shrinks, following it (bar.css, follow): a section chosen in it moves the page, and the menu stays
      // where the screen is. Back to fixed as it began to close, Safari no longer drew its glass in the bands of the Dynamic Island and
      // under its bar, and they were the page's flat colour round the shrinking drop — the stone's over the Questions (owner's iPhone,
      // 13 Nov 16:48: "as barras perto da ilha e em baixo … não são simplesmente o background da categoria com o menu por cima";
      // measured in his video: 214,205,192 flat at the top and the foot, the glass 149 between)
      root.dataset.menu = 'closing'
      hold(false)
      // if the drop has nothing to shrink (closed before it grew), no transition ends: close anyway
      window.setTimeout(finish, 1200)
      inert.forEach((el) => el?.removeAttribute('inert'))
      setOpenLabel(false)
      if (focusButton && button) {
        if (quiet) button.dataset.quiet = ''
        button.focus({ preventScroll: true })
      }
    }
    // once the drop has shrunk the dialog closes, so no blur is composed behind a closed menu (28 Oct: it lingered)
    function finish() {
      if (root.dataset.menu !== 'closing') return
      unfollow()
      dialog?.close()
      delete root.dataset.menu
      queue()
    }
    const shrunk = (e: TransitionEvent) => e.target === drop && finish()
    drop?.addEventListener('transitionend', shrunk)
    cleanups.push(() => drop?.removeEventListener('transitionend', shrunk))
    const onButton = (e: MouseEvent) => {
      e.preventDefault()
      if (root.dataset.menu === 'open' || root.dataset.menu === 'armed') close(true, e.detail > 0)
      // a click from the keyboard (Enter) has no detail
      else open(e.detail === 0)
    }
    button?.addEventListener('click', onButton)
    cleanups.push(() => button?.removeEventListener('click', onButton))
    // a section chosen in the menu: the menu closes and the page goes there
    const onLink = (e: MouseEvent) => {
      if ((e.target as Element).closest('.menu-list a, .menu-side a')) close(false)
    }
    dialog.addEventListener('click', onLink)
    cleanups.push(() => dialog.removeEventListener('click', onLink))
    on('keydown', (e) => {
      if (!root.dataset.menu) return
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
      // the focus stays with the menu: the menu island (Talk to us, Close) and the menu's own links, in a loop
      if (e.key === 'Tab') {
        const loop = [
          ...bar.querySelectorAll<HTMLElement>('.bar-right a'),
          ...dialog.querySelectorAll<HTMLElement>('a'),
        ]
        const i = loop.indexOf(document.activeElement as HTMLElement)
        const next = e.shiftKey ? (i <= 0 ? loop.length - 1 : i - 1) : i === loop.length - 1 || i < 0 ? 0 : i + 1
        e.preventDefault()
        loop[next]?.focus()
      }
    })

    // "Hello, {name}." once the visitor has given a name (the Method, M6)
    const name = (window as Window & { __c1?: { name?: string } }).__c1?.name
    const hello = dialog.querySelector<HTMLElement>('.menu-hello')
    if (hello && name) {
      hello.textContent = props.hello.replace('{name}', name)
      hello.hidden = false
    }

    return () => cleanups.forEach((f) => f())
  }, [props])

  return null
}
