'use client'

import { useEffect } from 'react'
import { bindPortrait } from './portrait'
import { runStage } from './about-stage'

/*
  What the About does once the page is live: the portrait's colour by gesture (always), and the passage from the Method's 11 (only
  with motion; with reduced motion the final state stays as it is, read by scrolling). It returns nothing: the markup is the server's.
*/
export function AboutClient() {
  useEffect(() => {
    const about = document.getElementById('about')
    if (!about) return
    const portrait = bindPortrait(about)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const stopStage = reduce ? () => {} : runStage(about, portrait.release)
    return () => {
      stopStage()
      portrait.stop()
    }
  }, [])
  return null
}
