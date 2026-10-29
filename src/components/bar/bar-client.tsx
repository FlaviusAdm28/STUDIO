'use client'

import { useEffect } from 'react'

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
    const setSection = (id: string) => {
      if (root.dataset.section === id) return
      root.dataset.section = id
      const s = byId[id]
      if (sec) sec.innerHTML = s ? `<i>${s.number}</i>${s.label}` : ''
      // at the top the name's island is hidden (#70): out of the keyboard's way too
      if (left) left.tabIndex = s ? 0 : -1
      links.forEach((a) => a.setAttribute('aria-current', String(a.dataset.section === id)))
      queue()
    }
    const watched = [document.getElementById('top'), ...props.sections.map((s) => document.getElementById(s.id))]
    const sections = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSection(e.target.id)),
      { rootMargin: '0px 0px -92% 0px' },
    )
    watched.forEach((el) => el && sections.observe(el))
    cleanups.push(() => sections.disconnect())
    if (left && !root.dataset.section) left.tabIndex = -1

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
        const section = el.closest<HTMLElement>('section[data-lum]')
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
    function queue() {
      if (queued) return
      queued = true
      const wait = Math.max(0, 80 - (performance.now() - last))
      window.setTimeout(
        () =>
          requestAnimationFrame(() => {
            queued = false
            last = performance.now()
            update()
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
    const states = new MutationObserver(queue)
    states.observe(root, { attributes: true, attributeFilter: ['data-entrance', 'data-light'] })
    cleanups.push(() => states.disconnect())
    queue()

    // ---- the lens: a displacement map shaped like each island; within 14 px of its rim the backdrop is pulled from
    // further inside, so the rim magnifies (README #69). Only where backdrop-filter takes a url() (Chromium). ----
    if (CSS.supports('backdrop-filter', 'url(#bar-lens-left) blur(1px)')) {
      const sizes = new Map<string, string>()
      const lensMap = (w: number, h: number) => {
        const c = document.createElement('canvas')
        c.width = w
        c.height = h
        const g = c.getContext('2d')
        if (!g) return ''
        const im = g.createImageData(w, h)
        const r = h / 2
        const E = 14
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++) {
            const cx = Math.min(Math.max(x + 0.5, r), w - r)
            const vx = x + 0.5 - cx
            const vy = y + 0.5 - r
            const len = Math.hypot(vx, vy) || 1
            const d = r - len
            const k = d < E ? ((E - Math.max(d, 0)) / E) ** 2 : 0
            const i = (y * w + x) * 4
            im.data[i] = 128 + 127 * (vx / len) * k * 0.9
            im.data[i + 1] = 128 + 127 * (vy / len) * k * 0.9
            im.data[i + 2] = 128
            im.data[i + 3] = 255
          }
        g.putImageData(im, 0, 0)
        return c.toDataURL()
      }
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
    const open = () => {
      if (root.dataset.menu || !drop) return
      const isl = button?.closest<HTMLElement>('.bar-isl')?.getBoundingClientRect()
      if (!isl) return
      const rCap = isl.height / 2
      // just large enough to reach the farthest corner: the drop covers the screen exactly as it stops growing. Larger
      // (the screen's diagonal), it covered the screen at ~0.94 and kept growing, and its blur grew with it — the owner saw
      // the blurred page shift as it settled (29 Oct, desktop)
      const cx = isl.right - rCap
      const cy = isl.top + rCap
      const R = Math.ceil(Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy))) + 2
      dialog.style.setProperty('--drop-x', `${isl.right - rCap}px`)
      dialog.style.setProperty('--drop-y', `${isl.top + rCap}px`)
      dialog.style.setProperty('--drop-r', `${R}px`)
      dialog.style.setProperty('--drop-s0', (rCap / R).toFixed(4))
      dialog.show()
      const k = lightShare()
      dialog.dataset.ground = k >= 0.5 ? 'light' : k > 0.2 ? 'mixed' : 'dark'
      root.dataset.menu = 'armed'
      inert.forEach((el) => el?.setAttribute('inert', ''))
      setOpenLabel(true)
      // the glass is visible two frames before it grows, so its backdrop exists when the drop starts (28 Oct)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          root.dataset.menu = 'open'
          links[0]?.focus({ preventScroll: true })
        }),
      )
    }
    const close = (focusButton = true) => {
      if (root.dataset.menu !== 'open' && root.dataset.menu !== 'armed') return
      root.dataset.menu = 'closing'
      // if the drop has nothing to shrink (closed before it grew), no transition ends: close anyway
      window.setTimeout(finish, 1200)
      inert.forEach((el) => el?.removeAttribute('inert'))
      setOpenLabel(false)
      if (focusButton) button?.focus({ preventScroll: true })
    }
    // once the drop has shrunk the dialog closes, so no blur is composed behind a closed menu (28 Oct: it lingered)
    function finish() {
      if (root.dataset.menu !== 'closing') return
      dialog?.close()
      delete root.dataset.menu
      queue()
    }
    const shrunk = (e: TransitionEvent) => e.target === drop && finish()
    drop?.addEventListener('transitionend', shrunk)
    cleanups.push(() => drop?.removeEventListener('transitionend', shrunk))
    const onButton = (e: MouseEvent) => {
      e.preventDefault()
      if (root.dataset.menu === 'open' || root.dataset.menu === 'armed') close()
      else open()
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
