'use client'

import { useEffect } from 'react'
import { studioBlocks } from '@/motion'

/**
 * Chapter III arrives by being scrolled to, not by being animated at.
 *
 * One observer, one opacity transition, nothing else. The film is over; this is a publication, and a
 * publication does not perform. Each block is shown once and then forgotten by the observer, so
 * nothing re-fades on the way back up — `04-visual-language.md` §7, a beat happens once.
 *
 * It also decides when the showcase media is allowed to cost anything. The three cuts of footage in
 * this repository are 26, 36 and 29 MB; loading them all up front would put roughly ninety megabytes
 * in front of the first frame, which `05-storyboard.md` §11 forbids outright. So they carry
 * `preload="none"` and are only asked for once their block is on its way in.
 */
export default function Reveal() {
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (blocks.length === 0) return

    /** Moving footage plays; a still is asked for one frame and never runs. */
    const wake = (block: HTMLElement) => {
      const media = block.querySelector<HTMLVideoElement>('video[data-media]')
      if (media === null) return
      if (media.dataset.media === 'still') {
        const hold = () => {
          media.currentTime = Number(media.dataset.frame ?? 0)
          media.removeEventListener('loadedmetadata', hold)
        }
        media.addEventListener('loadedmetadata', hold)
        /* `none` means nothing is fetched until asked; metadata is all a single frame needs. */
        media.preload = 'metadata'
        media.load()
        return
      }
      const attempt = media.play()
      if (attempt !== undefined) attempt.catch(() => undefined)
    }

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const block = entry.target as HTMLElement
          block.dataset.shown = 'true'
          wake(block)
          seen.unobserve(block)
        }
      },
      /* `story.ts` → `afterTheFilm.studioBlocks`, with the fade it pairs with. */
      { rootMargin: studioBlocks.rootMargin, threshold: studioBlocks.threshold },
    )

    blocks.forEach((block) => seen.observe(block))
    return () => seen.disconnect()
  }, [])

  return null
}
