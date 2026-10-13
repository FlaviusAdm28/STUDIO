'use client'

import { useEffect, useRef } from 'react'
import { TIMING, smoothstep } from '@/motion'

/**
 * ── We're listening · Contact's one interaction ──────────────────────────────────────────────────
 *
 * **TRIGGER → SLOW PLAY → HOLD, and the trigger is a hand** — design owner, 26 September 2026:
 * *"O utilizador deve sentir que está a interagir com o TEMPO da cena, não a arrastar uma timeline."*
 *
 * One value, `--listen`, runs 0 → 1 on `TIMING.contact.listens` while the pointer (or focus) is on the
 * sentence, and back from wherever it is when it leaves. Everything the direction lists reads that one
 * value, so the parts cannot drift from each other:
 *
 *   - the sentence opening and recomposing into *We're listening.* — `globals.css`
 *   - the line under it growing to the question's measure — `globals.css`
 *   - the scene drawing in, very slightly: a little less light, a little more definition —
 *     `globals.css`, on `.env-hero`
 *   - the contacts under it gaining presence — `globals.css`
 *   - **the footage losing speed until it has stopped** — here, because a playback rate is not a
 *     style. It is the footage itself, stopped on whatever frame the slowing reached: there is no chosen
 *     frame and no second copy of the film (design owner, 13 October 2026)
 *
 * It is written on the root because the footage is the Environment's element and not a descendant of
 * the publication. Leaving Contact — the driver writes `data-contact="off"` — lets it go, and the world
 * has its own time again.
 *
 * **The press is an ordinary `mailto:` link** — design owner, 26 September 2026, second review: *"ao
 * clicar na interação depois do hover, a página fica bloqueada… O click deve abrir o contacto por email
 * através do mailto existente."* It was a button that held the listening and paused the footage for
 * good, which read as the page having stopped responding. Nothing here listens for the click any more:
 * the browser hands the address to the mail handler and the page is left exactly as it was.
 *
 * Scroll never touches it. This is interface response, the one kind of clock C8 has always allowed.
 */
export default function ContactListen({
  begins,
  listening,
  href,
}: {
  begins: string
  listening: string
  /** The letter the press opens; `null` renders the sentence composed and inert. */
  href: string | null
}) {
  const press = useRef<HTMLElement>(null)

  useEffect(() => {
    const button = press.current
    if (button === null) return
    const root = document.documentElement
    const publication = button.closest<HTMLElement>('.publication')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const { opens, closes, slowest, slows, rateStep } = TIMING.contact.listens

    /** How far the listening has gone, linear in time; `--listen` is this eased. */
    let k = 0
    let target = 0
    let hovering = false
    let focused = false
    let frame = 0
    let last = 0
    /** Whether the footage is paused because of the listening, so only this file ever resumes it. */
    let stilled = false

    const film = () => document.querySelector<HTMLVideoElement>('.env-hero')

    /*
      **The listening exists only for a hand that hovers** — design owner, 13 October 2026: on a touch
      device the sentence does not control the footage at all, and where a device is ambiguous the
      footage plays on. So this is one rule in one place rather than a rule per event: the primary
      pointer hovers and is fine, **and** no pointer the device has is coarse. A phone, a tablet and a
      laptop with a touch screen all fail it, and there the listening never starts — no `--listen`, no
      rate, no pause — whatever a tap, a focus or a return to the page does. Read live: a screen can be
      docked and a mouse can be the only pointer left.
    */
    const hand = window.matchMedia('(hover: hover) and (pointer: fine)')
    const finger = window.matchMedia('(any-pointer: coarse)')

    const write = () => {
      const e = smoothstep(k)
      root.style.setProperty('--listen', e.toFixed(4))
      const state = k > 0 ? 'listening' : null
      if (state === null) root.removeAttribute('data-listen')
      else if (root.dataset.listen !== state) root.dataset.listen = state
      /*
        **The world losing speed until it has stopped** — 13 October 2026. The rate is a function of
        this gesture's own progress and of nothing else — `k`, the very number `--listen` was eased
        from one line above — so the footage cannot be ahead of or behind what the sentence, the line
        and the light are doing: there is no second clock to drift. It falls 1 → `slowest` on
        `1 − k^slows` (`timing.ts` has why that shape), and when the gesture completes the footage is
        paused on the frame it reached. Leaving plays it from that frame and takes the rate back up the
        same curve, so nothing is sought and nothing jumps. The rate moves in `rateStep`s, because every
        change re-times the media clock. At rest it is exactly 1.
      */
      const video = film()
      if (video !== null) {
        const fall = k ** slows
        const rate =
          k === 0 ? 1 : Math.max(slowest, Math.round((1 - (1 - slowest) * fall) / rateStep) * rateStep)
        if (Math.abs(video.playbackRate - rate) > 0.001) video.playbackRate = rate
        if (k >= 1 && !stilled) {
          /* Marked first, so the opening's own per-frame `roll()` leaves this pause alone. */
          video.dataset.still = 'listening'
          video.pause()
          stilled = true
        } else if (k < 1 && stilled) {
          stilled = false
          delete video.dataset.still
          void video.play().catch(() => {})
        }
      }
    }

    const tick = (now: number) => {
      const dt = last === 0 ? 0 : (now - last) / 1000
      last = now
      const over = target > k ? opens : closes
      k = calm.matches ? target : target > k ? Math.min(target, k + dt / over) : Math.max(target, k - dt / over)
      write()
      if (k !== target) frame = requestAnimationFrame(tick)
      else {
        frame = 0
        last = 0
      }
    }

    const aim = () => {
      const next = hand.matches && !finger.matches && (hovering || focused) ? 1 : 0
      if (next === target && (frame !== 0 || k === target)) return
      target = next
      if (frame === 0) {
        last = 0
        frame = requestAnimationFrame(tick)
      }
    }

    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      hovering = true
      aim()
    }
    const leave = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      hovering = false
      aim()
    }
    const focus = () => {
      focused = button.matches(':focus-visible')
      aim()
    }
    const blur = () => {
      focused = false
      aim()
    }
    /*
      Leaving Contact lets the world go, whatever the hand was doing — and it starts to the moment
      Contact starts leaving (`held → playing`), not once it has gone. Navigation QA, 27 September 2026:
      waiting for `off` let the slowed, parked footage carry ~2.4s into the Hero after a Home press.
    */
    let contactWas = publication?.dataset.contact
    const watch = new MutationObserver(() => {
      const now = publication?.dataset.contact
      const leaving = now === 'off' || (contactWas === 'held' && now === 'playing')
      contactWas = now
      if (!leaving) return
      hovering = false
      focused = false
      aim()
    })
    if (publication !== null) {
      watch.observe(publication, { attributes: true, attributeFilter: ['data-contact'] })
    }

    button.addEventListener('pointerenter', enter)
    button.addEventListener('pointerleave', leave)
    button.addEventListener('focus', focus)
    button.addEventListener('blur', blur)

    return () => {
      watch.disconnect()
      button.removeEventListener('pointerenter', enter)
      button.removeEventListener('pointerleave', leave)
      button.removeEventListener('focus', focus)
      button.removeEventListener('blur', blur)
      cancelAnimationFrame(frame)
      root.style.removeProperty('--listen')
      root.removeAttribute('data-listen')
      const video = film()
      if (video !== null) {
        video.playbackRate = 1
        delete video.dataset.still
        if (stilled) void video.play().catch(() => {})
      }
    }
  }, [])

  const words = (
    <>
      <span className="contact-begin-rest">{begins}</span>
      <span className="contact-begin-heard" aria-hidden="true">
        {listening}
      </span>
    </>
  )

  return (
    <div className="contact-begin">
      {/*
        A link, and nothing else: the press opens the letter in the visitor's own mail handler. Its name
        is the sentence at rest; *We're listening.* is what it becomes under the hand, and it is drawn
        rather than announced.
      */}
      {href === null ? (
        <span
          ref={press as React.RefObject<HTMLSpanElement>}
          className="contact-begin-press"
          aria-disabled="true"
          tabIndex={0}
        >
          {words}
        </span>
      ) : (
        <a ref={press as React.RefObject<HTMLAnchorElement>} className="contact-begin-press" href={href}>
          {words}
        </a>
      )}
      <i className="contact-begin-line" aria-hidden="true" />
    </div>
  )
}
