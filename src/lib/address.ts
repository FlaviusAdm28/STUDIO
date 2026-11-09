/*
  A section's address lands where the section is really seen. The Method and the About lie over the end of the section before them (the
  Method over the Work's last 3.1 screens, the About over the Method's last 1.6), so their own top is still the Work's Experiences and the
  Method's 11: from the menu, 02 Method showed Experiences under "01 Work" and 03 About showed the Method's 11 under "02 Method" (tested
  from the top, the Work, the Method and the About, 1440 × 900 and 390 × 844, 4 Nov). Each marks where it really starts with data-starts,
  as the bar reads it: the address goes there, at once (a smooth scroll would run every passage on the way). The menu, the colophon's
  index, back and forward, and an address arrived with. The Work lands on its own chapters (work-client.tsx).
  The Questions and the Contact start at their own top, but an address arrived with went there before the scenes had their heights: on a
  phone #questions opened in the Method (y 10 644 for a top at 13 799, Chrome 390 × 844, 8 Nov). They land the same way, once laid out.
  With reduced motion or no JavaScript the sections lie one after the other, the marks are not displayed, and the browser's own jump is
  right: nothing is done (the Questions and the Contact are set at their top, where the browser already put them).
*/
const IDS = ['method', 'about', 'questions', 'contact']
const OWN = ['questions', 'contact']

import { unsnapped } from '@/lib/unsnapped'

export function landOnAddresses() {
  const mark = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-starts="${id}"]`) ?? (OWN.includes(id) ? document.getElementById(id) : null)
    return el && getComputedStyle(el).display !== 'none' ? el : null
  }
  // the scenes are told it is a jump, not a scroll (data-jump on <html>, for a moment): from it they settle at once, or start from what is
  // seen (about-stage.ts: no copy of a Method's 11 that was never shown). From the Method's 9 to the About is only 0.87 screen: by its
  // distance alone it read as a scroll
  let unmark = 0
  const go = (id: string) => {
    const el = mark(id)
    if (!el) return false
    const root = document.documentElement
    root.dataset.jump = id
    clearTimeout(unmark)
    unmark = window.setTimeout(() => delete root.dataset.jump, 600)
    // on a phone, on the first phase's mark (the stop at each phase, method.css): landed at the start, the next stroke only took the page
    // to the mark, the phase unchanged (03 About, Simulator, 8 Nov)
    // the Questions on an iPhone: their card goes on 70 px under the island, the words where they are seen (questions.css --q-lift)
    const at = el.getBoundingClientRect().top + (parseFloat(getComputedStyle(el).getPropertyValue('--q-lift')) || 0)
    const first = matchMedia('(max-width: 899px)').matches
      ? [...(el.closest('section')?.querySelectorAll<HTMLElement>('.m-snap, .a-snap') ?? [])]
          .map((m) => m.getBoundingClientRect().top)
          .filter((t) => t >= at - 1)
          .sort((a, b) => a - b)[0]
      : undefined
    unsnapped(() => scrollTo({ top: (first ?? at + 1) + scrollY, behavior: 'auto' }))
    return true
  }
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
    const id = a?.getAttribute('href')?.slice(1) ?? ''
    if (!IDS.includes(id) || !mark(id)) return
    e.preventDefault()
    if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
    go(id)
  }
  const onAddress = () => {
    const id = location.hash.slice(1)
    if (IDS.includes(id)) go(id)
  }
  document.addEventListener('click', onClick)
  addEventListener('hashchange', onAddress)
  addEventListener('popstate', onAddress)
  // arrived with the address: once the page is laid out (the entrance does not run with a hash)
  const arrived = location.hash.slice(1)
  let raf = 0
  if (IDS.includes(arrived)) raf = requestAnimationFrame(() => requestAnimationFrame(() => go(arrived)))
  return () => {
    cancelAnimationFrame(raf)
    clearTimeout(unmark)
    document.removeEventListener('click', onClick)
    removeEventListener('hashchange', onAddress)
    removeEventListener('popstate', onAddress)
  }
}
