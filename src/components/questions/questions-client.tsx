'use client'

import { useEffect } from 'react'

/*
  What the Questions do once the page is live (states 15–18):
  - one answer open at a time (README #53): a tap opens one and closes the one open before; a tap on the open one closes it.
  - the entrance, once: as the paper rises (a quarter of the way up), the anchor question comes, then the eight questions one by one
    (questions.css .q-in). With reduced motion everything is simply there.
  Closing an answer above the one just opened moves it up by that answer's height, in the answers' 0.7 s: the page is not moved to hold it
  (it pulled the page above the Questions, into the About, at 320 × 640; and the scroll stops at marks there, about-stage.ts).
*/
export function QuestionsClient() {
  useEffect(() => {
    const section = document.getElementById('questions')
    if (!section) return
    const rows = [...section.querySelectorAll<HTMLElement>('.q-row')]
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const open = (i: number) =>
      rows.forEach((row, j) => {
        const on = j === i
        row.classList.toggle('is-open', on)
        row.querySelector('.q-btn')?.setAttribute('aria-expanded', String(on))
      })
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('.q-btn')
      if (!btn) return
      const i = rows.findIndex((r) => r.contains(btn))
      if (i < 0) return
      open(rows[i].classList.contains('is-open') ? -1 : i)
    }
    section.addEventListener('click', onClick)

    // The box's height as it is with every answer closed (questions.css --q-rest, a phone), so an answer opens into the room under the list
    // and the page's length, the Contact's stop and the box's hold over the way there never change. Read from the open box, it followed
    // every answer: the way to the Contact grew longer than the hold and the box went up ~60 px as it faded; made up for from <html>, the
    // whole page was laid out again at every frame of an answer opening — a lag (owner's iPhone, 13 Nov, 01:16 and 10:07; Simulator).
    // Read with the answers taken away, so it stays put while one opens or closes, and set only when it changes
    const list = section.querySelector<HTMLElement>('.q-list')
    const box = section.querySelector<HTMLElement>('.q-box')
    const phone = matchMedia('(max-width: 899px)')
    const set = (k: string, v: string) => {
      if (section.style.getPropertyValue(k) !== v) section.style.setProperty(k, v)
    }
    const rest = () => {
      if (!box || !list) return
      const top = box.getBoundingClientRect().top
      // in fractions, as the rest: whole pixels here made the height come out 925 and 926 by turns
      const opened = [...section.querySelectorAll<HTMLElement>('.q-ans')].reduce((s, a) => s + a.getBoundingClientRect().height, 0)
      const ends = [...box.children].filter((c) => c.getClientRects().length).map((c) => c.getBoundingClientRect().bottom - top)
      if (!phone.matches || !ends.length) return set('--q-rest', '')
      set('--q-rest', `${Math.round(Math.max(...ends) - opened + parseFloat(getComputedStyle(box).paddingBottom))}px`)
    }
    const sized = new ResizeObserver(rest)
    if (list) sized.observe(list)
    if (box) sized.observe(box)

    // Going on to the Contact closes the answer open (owner, 13 Nov), as the light starts going down (contact-client.tsx, c-dusk on <html>):
    // under the fading questions, unseen, and back at the Questions all is closed. Not at a stroke's first pixels (the owner's first idea,
    // "B" chosen over it): a drag to read, which the stop takes back, closed the answer being read. On a small phone an open answer keeps
    // the last questions under the screen (Chrome, 375 × 629: 124 px; 390 × 664: 60 px; 13 Nov): a tap on it closes it. The box keeps its
    // height (--q-rest), so nothing moves as it closes
    const root = document.documentElement
    const dusk = new MutationObserver(() => {
      if (root.classList.contains('c-dusk') && rows.some((r) => r.classList.contains('is-open'))) open(-1)
    })
    if (!reduce) dusk.observe(root, { attributes: true, attributeFilter: ['class'] })

    // the entrance, once
    let seen: IntersectionObserver | null = null
    let done = 0
    const arrive = () => {
      section.classList.add('q-in')
      // the rows' delays are only for their entrance: after it, opening and closing never wait for them
      done = window.setTimeout(() => section.classList.add('q-done'), 1900)
    }
    if (reduce) arrive()
    else {
      // the paper a quarter of the way up: its top above the screen's lowest quarter (once it had nearly arrived, the paper came up empty).
      // The last reading of a batch: landed at #questions the browser gives two at once, unseen (before the jump) then seen, and read
      // by the first the questions never came — an empty paper (Xiaomi, Chrome, 10 Nov; the same in every observer of one element)
      seen = new IntersectionObserver(
        (es) => {
          if (!es[es.length - 1].isIntersecting) return
          seen?.disconnect()
          arrive()
        },
        { rootMargin: '0px 0px -25% 0px' },
      )
      seen.observe(section)
    }

    return () => {
      section.removeEventListener('click', onClick)
      sized.disconnect()
      dusk.disconnect()
      seen?.disconnect()
      clearTimeout(done)
    }
  }, [])
  return null
}
