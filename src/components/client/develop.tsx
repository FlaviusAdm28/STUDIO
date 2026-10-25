'use client'

import { useEffect } from 'react'

/*
  Prints develop once as they come into view: every element marked `data-develop` gets `is-in` the
  first time a fifth of it is visible, and is then forgotten — returning to a place is not an event
  (`04-visual-language` §7). Nothing is tied to the scroll position.

  This island is also what switches the effect on (the `develop` class on <html>), so without
  scripts — or if hydration never happens — nothing is ever hidden. Under reduced motion the CSS
  ignores the class and everything is simply there.
*/
export function Develop() {
  useEffect(() => {
    const root = document.documentElement
    const items = document.querySelectorAll<HTMLElement>('[data-develop]:not(.is-in)')
    if (!('IntersectionObserver' in window)) return
    root.classList.add('develop')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.2 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
