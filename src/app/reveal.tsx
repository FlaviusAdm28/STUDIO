'use client'

import { useEffect } from 'react'
import { studioBlocks } from '@/motion'

/**
 * Chapter III arrives by being scrolled to, not by being animated at.
 *
 * One observer, one opacity transition, nothing else. The film is over; this is a publication, and a
 * publication does not perform. Each one is shown once and then forgotten by the observer, so nothing
 * re-fades on the way back up — `04-visual-language.md` §7, a beat happens once.
 *
 * **The unit is a page, not an element.** `[data-reveal]` sits on the page — the statement *and* the
 * plate *and* the copy that belong to it — so a page comes into existence as one thing and everything on
 * it is already there by the time it is reached. Marking the elements instead is what made the chapter
 * open as a list of things appearing, which is a landing page's language rather than a publication's:
 * three arrivals answering §7's only question, *what changed?*, when the answer is one — the chapter
 * did. `decisions.md` §43.
 *
 * **The first page is not one of them.** The film reveals that one: it comes into existence under the
 * travelling word, driven by scroll position, so that the mark unveils it rather than announcing it once
 * it has finished. It carries `data-emerges` instead, and the only thing this file does for it is the
 * second job below. `decisions.md` §44.
 *
 * That second job is deciding when a plate's footage is allowed to cost anything. The three cuts in this
 * repository are 26, 36 and 29 MB; loading them all up front would put roughly ninety megabytes in front
 * of the first frame, which `05-storyboard.md` §11 forbids outright. So they carry `preload="none"` and
 * are only asked for once their page is on its way in — which for the first page is well before the word
 * sets off, so its plate has the whole emergence to arrive in rather than being asked for at the moment it
 * is needed. Every plate on a page is woken, not the first one: a page is a composition and Chapter III's
 * steps are seven of them.
 */
export default function Reveal() {
  useEffect(() => {
    /*
      Every page is watched, because every page's footage waits to be asked for. Only the ones that
      arrive by being *scrolled to* are shown from here; the first page is shown by the film.
    */
    const pages = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-emerges]'))
    if (pages.length === 0) return

    /**
     * Moving footage plays; a still is asked for one frame and never runs.
     *
     * Every plate on the page, not the first one — a page is a composition and may hold more than one.
     * It holds one each today, and `querySelector` would have been a silent failure the moment that
     * changed rather than a visible one.
     */
    const wake = (page: HTMLElement) => {
      for (const media of page.querySelectorAll<HTMLVideoElement>('video[data-media]')) {
        if (media.dataset.media === 'still') {
          const hold = () => {
            media.currentTime = Number(media.dataset.frame ?? 0)
            media.removeEventListener('loadedmetadata', hold)
          }
          media.addEventListener('loadedmetadata', hold)
          /* `none` means nothing is fetched until asked; metadata is all a single frame needs. */
          media.preload = 'metadata'
          media.load()
          continue
        }
        const attempt = media.play()
        if (attempt !== undefined) attempt.catch(() => undefined)
      }
    }

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const page = entry.target as HTMLElement
          if (page.hasAttribute('data-reveal')) page.dataset.shown = 'true'
          wake(page)
          seen.unobserve(page)
        }
      },
      /* `story.ts` → `afterTheFilm.studioBlocks`, with the fade it pairs with. */
      { rootMargin: studioBlocks.rootMargin, threshold: studioBlocks.threshold },
    )

    pages.forEach((page) => seen.observe(page))
    return () => seen.disconnect()
  }, [])

  return null
}
