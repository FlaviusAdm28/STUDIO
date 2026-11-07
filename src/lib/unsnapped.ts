/*
  A jump made by the site (the menu, an address, the bar's name, the Work's chapters) with the phone's stop-at-each-phase off
  (method.css: scroll-snap-type, mandatory while the Method or the About is on stage). With it on, the browser takes the jump's
  destination to the nearest mark: from the Method's 8b, a jump to the Work landed on Experiences (Simulator, iOS 27.3, 7 Nov). Put back
  once the scenes have answered the jump and their light has gone back (the Method's way back, 1.4 s on a phone).
*/
let back = 0

export function unsnapped(jump: () => void, ms = 1600) {
  const root = document.documentElement
  root.style.scrollSnapType = 'none'
  clearTimeout(back)
  jump()
  back = window.setTimeout(() => root.style.removeProperty('scroll-snap-type'), ms)
}
