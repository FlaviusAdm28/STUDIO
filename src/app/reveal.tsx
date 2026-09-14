'use client'

import { useEffect } from 'react'
import { studioBlocks } from '@/motion'

/**
 * Chapter III's closing arrives by being scrolled to, not by being animated at.
 *
 * One observer, one opacity transition, nothing else. The film is over; this is a publication, and a
 * publication does not perform. Each page is shown once and then forgotten by the observer, so nothing
 * re-fades on the way back up — `04-visual-language.md` §7, a beat happens once.
 *
 * **The unit is a page, not an element.** `[data-reveal]` sits on the page — everything that belongs to
 * it — so a page comes into existence as one thing and everything on it is already there by the time it
 * is reached. Marking the elements instead is what made the chapter open as a list of things appearing,
 * which is a landing page's language rather than a publication's: three arrivals answering §7's only
 * question, *what changed?*, when the answer is one — the chapter did. `decisions.md` §43.
 *
 * **Chapter III's act is not one of them.** The film reveals that: it comes into existence under the
 * travelling word and then transforms across a pinned frame of its own, driven by scroll position, so
 * that the mark unveils the chapter rather than announcing it once it has finished. Nothing about the act
 * is this file's business. `decisions.md` §44 and §46.
 *
 * It used to have a second job — deciding when the act's two video plates were allowed to start costing
 * something, sixty megabytes that `05-storyboard.md` §11 would not let near the first frame. The act no
 * longer has plates, and since C5 it no longer holds the live work either — `final-design-spec.pdf` §11.1
 * moved that into the Work aside, where it is fetched on the visitor's own press rather than on a scroll
 * position, which is a stronger answer to the same rule than a sentinel half way down the film ever was.
 * `decisions.md` §49, and `fragment.tsx` owns it, mounted by `ledger.tsx`.
 */
export default function Reveal() {
  useEffect(() => {
    const pages = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (pages.length === 0) return

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const page = entry.target as HTMLElement
          page.dataset.shown = 'true'
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
