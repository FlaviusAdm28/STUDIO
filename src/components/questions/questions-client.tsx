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

    // where the list ends in its box, for the box's hold while the light goes down (questions.css): an open answer can take it past the
    // screen's foot
    const list = section.querySelector<HTMLElement>('.q-list')
    const sized = new ResizeObserver(() => list && section.style.setProperty('--q-foot', `${Math.round(list.offsetTop + list.offsetHeight)}px`))
    if (list) sized.observe(list)

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
      seen?.disconnect()
      clearTimeout(done)
    }
  }, [])
  return null
}
