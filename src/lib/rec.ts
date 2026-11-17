/*
  The flight recorder (owner, 16 Nov: "uma ferramenta de debug no Chrome e no Safari para eu gravar e reproduzir para ti; se o browser
  reiniciar deve parar e enviar a gravação e não a perder"). A test instrument, as the FPS meter: only on this machine (localhost) and only
  with ?rec in the address (kept for the tab; ?rec=0 ends it). Take it out of the page before launch, with the FPS meter.

  What it keeps, in the page's own clock: every frame during a passage (the arch's box: place, size, opacity; the stage's first photograph;
  the passage's clock), the conductor's notes, the wheel and the keys, the scroll, every change of data-pass / the Work's chapter / the
  Method's phase, errors, long frames, the window's size, and a marker on M. A clock in the corner (ms) lets a screen recording be matched
  frame by frame to the log.

  Where it goes: every 0.5 s into localStorage (survives a crash and the reload after it) and to the lab's collector
  (docs/development/ios-lab/desk/cenas/collector.mjs, http://localhost:3199), which writes it to ~/.local/share/v5-lab/rec/live/. A page
  that ended without its pagehide (the browser's renderer died, Safari's "this webpage was reloaded") is noted by the next one, which
  sends what the dead one left.
*/
import { KEY } from './rec-on'
const SINK = 'http://localhost:3199/rec'

type Entry = (string | number | null)[]


const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v)
      return true
    } catch {
      return false
    }
  },
  del: (k: string) => {
    try {
      localStorage.removeItem(k)
    } catch {}
  },
}

// a chunk waiting in localStorage, sent and then removed; what a dead page left is sent by the next
const send = (session: string, n: number, body: string) =>
  fetch(SINK, { method: 'POST', body: `${session} ${n}\n${body}`, keepalive: body.length < 60000, mode: 'cors' })
    .then((r) => (r.ok ? store.del(`${KEY}:${session}:${n}`) : undefined))
    .catch(() => {})
const sendLeft = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith(`${KEY}:`) || k.split(':').length !== 3) continue
    const [, s, n] = k.split(':')
    const body = store.get(k)
    if (body) send(s, Number(n), body)
  }
}

export function startRec() {
  const root = document.documentElement
  const session = `${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}-${Math.random().toString(36).slice(2, 6)}`
  const t0 = performance.now()
  const now = () => Math.round(performance.now() - t0)
  let buf: Entry[] = []
  let chunk = 0
  const log = (...e: Entry) => buf.push([now(), ...e])

  // the page before this one: ended without a pagehide → it died (crash, or killed and reloaded)
  const alive = store.get(`${KEY}-alive`)
  if (alive) {
    try {
      const a = JSON.parse(alive) as { session: string; at: number; closed?: boolean }
      if (!a.closed) log('PREVIOUS-DIED', a.session, Date.now() - a.at)
    } catch {}
  }
  sendLeft()

  const w = window as unknown as { __vtMark?: (s: string) => void; __cenas?: { current: () => string | null } }
  log(
    'start',
    location.href,
    navigator.userAgent,
    `${innerWidth}x${innerHeight}@${devicePixelRatio}`,
    [...document.scripts].map((s) => s.src.split('/').pop()).filter(Boolean).slice(0, 3).join(','),
  )
  const prevMark = w.__vtMark
  w.__vtMark = (s: string) => {
    log('note', s)
    prevMark?.(s)
  }

  // the corner clock: the log's time, readable in a screen recording
  const clock = document.createElement('div')
  clock.setAttribute('aria-hidden', 'true')
  clock.style.cssText =
    'position:fixed;right:8px;bottom:8px;z-index:2147483647;font:600 13px/1 ui-monospace,monospace;color:#fff;background:rgba(200,20,20,.85);' +
    'padding:4px 6px;border-radius:4px;pointer-events:none'
  document.body.append(clock)

  const on = (t: EventTarget, k: string, f: (e: Event) => void, o: AddEventListenerOptions = { passive: true, capture: true }) => {
    t.addEventListener(k, f, o)
    return () => t.removeEventListener(k, f, o)
  }
  const offs: (() => void)[] = []
  offs.push(on(window, 'wheel', (e) => log('wheel', Math.round((e as WheelEvent).deltaY), (e as WheelEvent).deltaMode)))
  offs.push(
    on(window, 'keydown', (e) => {
      const k = (e as KeyboardEvent).key
      if (k === 'm' || k === 'M') log('MARK')
      else log('key', k)
    }),
  )
  offs.push(on(window, 'resize', () => log('resize', `${innerWidth}x${innerHeight}@${devicePixelRatio}`)))
  offs.push(on(window, 'error', (e) => log('ERROR', String((e as ErrorEvent).message), String((e as ErrorEvent).filename).split('/').pop() ?? '', (e as ErrorEvent).lineno)))
  offs.push(on(window, 'unhandledrejection', (e) => log('REJECTION', String((e as PromiseRejectionEvent).reason))))
  offs.push(on(document, 'visibilitychange', () => log('visibility', document.visibilityState)))
  let lastY = -1
  offs.push(
    on(window, 'scroll', () => {
      const y = Math.round(scrollY)
      if (y !== lastY) log('scroll', y)
      lastY = y
    }),
  )
  // the states the scenes write
  let passAt = -1e9
  const watch = (el: Element | null, attrs: string[]) => {
    if (!el) return
    const mo = new MutationObserver((ms) =>
      ms.forEach((m) => {
        if (el === root && m.attributeName === 'data-pass') passAt = performance.now()
        log('attr', (el as HTMLElement).id || el.tagName.toLowerCase(), m.attributeName, (el as HTMLElement).getAttribute(m.attributeName ?? ''))
      }),
    )
    mo.observe(el, { attributes: true, attributeFilter: attrs })
    offs.push(() => mo.disconnect())
  }
  watch(root, ['data-pass', 'data-jump', 'data-menu', 'data-entrance'])
  watch(document.getElementById('work'), ['data-ch'])
  watch(document.getElementById('method'), ['data-phase'])
  watch(document.getElementById('top'), ['style'])
  try {
    const po = new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => log('longframe', Math.round(e.startTime - t0), Math.round(e.duration))),
    )
    po.observe({ type: 'long-animation-frame', buffered: false })
    offs.push(() => po.disconnect())
  } catch {}

  // every frame: the clock; during a passage, the arch's box and the stage's first photograph as the page sees them
  const entrance = document.getElementById('top')
  const host = entrance?.querySelector('.e-window')
  const card = document.querySelector('.w-ch[data-c="weddings"] .w-ph[data-j="0"]')
  // the first chapter's words (Safari, 17 Nov: gone for 1–2 frames at the start of the way back)
  const words = document.querySelector('.w-ch[data-c="weddings"] .w-tx')
  const clocksOf = (el: Element | null | undefined) =>
    (el?.getAnimations() ?? [])
      .map((x) => {
        // which property it moves (o opacity, t transform), its state, its time, back (-), and R if the browser removed it
        const k = (x.effect as KeyframeEffect | null)?.getKeyframes?.()[0] ?? {}
        const what = 'opacity' in k ? 'o' : 'transform' in k ? 't' : '?'
        const gone = (x as Animation & { replaceState?: string }).replaceState === 'removed' ? 'R' : ''
        return `${what}${x.playState[0]}${Math.round(Number(x.currentTime ?? -1))}${x.playbackRate < 0 ? '-' : ''}${gone}`
      })
      .join(' ')
  let raf = 0
  let last = 0
  const frame = (t: number) => {
    const ms = now()
    clock.textContent = String(ms)
    if (last && t - last > 50) log('gap', Math.round(t - last))
    last = t
    // during a passage, while the way back waits for its entrance, and 0.6 s after any change of the passage's state (the landing)
    if (root.dataset.pass === 'on' || entrance?.style.visibility || performance.now() - passAt < 600) {
      const box = host?.querySelector<HTMLElement>(':scope > div[aria-hidden][style*="border-radius"]')
      if (box) {
        const r = box.getBoundingClientRect()
        const c = card?.getBoundingClientRect()
        log(
          'f',
          Math.round(r.left),
          Math.round(r.top),
          Math.round(r.width),
          Number(getComputedStyle(box).opacity).toFixed(2),
          clocksOf(box),
          c ? `${Math.round(c.left)},${Math.round(c.top)},${Math.round(c.width)}` : '',
          card ? Number(getComputedStyle(card).opacity).toFixed(2) : '',
          Math.round(scrollY),
          words ? `${Number(getComputedStyle(words).opacity).toFixed(2)} ${clocksOf(words)}` : '',
        )
      }
    }
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  // memory, where the browser tells it (Chrome)
  const mem = window.setInterval(() => {
    const m = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
    log('beat', w.__cenas?.current?.() ?? '', m ? Math.round(m.usedJSHeapSize / 1e6) : '')
  }, 1000)

  // keep and send: every 0.5 s a chunk into localStorage, then to the collector; the heartbeat says this page is alive
  const flush = (closing = false) => {
    store.set(`${KEY}-alive`, JSON.stringify({ session, at: Date.now(), closed: closing }))
    if (!buf.length) return
    const body = buf.map((e) => JSON.stringify(e)).join('\n')
    buf = []
    const n = chunk++
    if (!store.set(`${KEY}:${session}:${n}`, body)) {
      // full: the oldest chunks go first
      sendLeft()
    }
    if (closing) {
      const ok = navigator.sendBeacon?.(SINK, new Blob([`${session} ${n}\n${body}`], { type: 'text/plain' }))
      if (ok) store.del(`${KEY}:${session}:${n}`)
    } else send(session, n, body)
  }
  const tick = window.setInterval(() => flush(), 500)
  offs.push(
    on(window, 'pagehide', () => {
      log('pagehide')
      flush(true)
    }),
  )
  log('ready')

  return () => {
    cancelAnimationFrame(raf)
    clearInterval(tick)
    clearInterval(mem)
    offs.forEach((f) => f())
    clock.remove()
    w.__vtMark = prevMark
    flush(true)
  }
}
