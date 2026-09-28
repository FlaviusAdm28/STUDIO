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
 *   - **the footage losing speed, then stopping** — here, because a playback rate is not a style
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
    const { opens, closes, slowest, slowAt, rateStep, holdAt } = TIMING.contact.listens

    /*
      **The chosen frame, parked.** The still copy of the footage is taken to `holdAt` once and never
      played; `globals.css` dissolves the live footage into it over the second half of the gesture, so
      whatever the loop was showing when the hand arrived, the world comes to rest on the same image.
    */
    const still = document.querySelector<HTMLVideoElement>('.env-hero-still')
    const park = () => {
      if (still !== null && Math.abs(still.currentTime - holdAt) > 0.01) still.currentTime = holdAt
    }
    if (still !== null) {
      if (still.readyState >= 1) park()
      else still.addEventListener('loadedmetadata', park, { once: true })
    }

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

    const write = () => {
      const e = smoothstep(k)
      root.style.setProperty('--listen', e.toFixed(4))
      const state = k > 0 ? 'listening' : null
      if (state === null) root.removeAttribute('data-listen')
      else if (root.dataset.listen !== state) root.dataset.listen = state
      /*
        **The world losing speed, then coming to rest on the chosen frame.** NORMAL → slowing → slow →
        HOLD: the rate falls 1 → `slowest` on the gesture's own curve, reaching it at `slowAt`, while the
        chosen frame (`holdAt`) dissolves in over it; when the gesture completes the live footage is
        paused underneath, and what stands is the frame that was chosen, not the one the cursor
        happened to stop on. Leaving dissolves back into the live footage as it gathers speed. The rate
        moves in `rateStep`s, because every change re-times the media clock. At rest it is exactly 1.
      */
      const video = film()
      if (video !== null) {
        const fall = Math.min(1, e / slowAt)
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
      const next = hovering || focused ? 1 : 0
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
