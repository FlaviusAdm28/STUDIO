/*
  A section's address lands where the section is really seen. The Method and the About lie over the end of the section before them (the
  Method over the Work's last 3.1 screens, the About over the Method's last 1.6), so their own top is still the Work's Experiences and the
  Method's 11: from the menu, 02 Method showed Experiences under "01 Work" and 03 About showed the Method's 11 under "02 Method" (tested
  from the top, the Work, the Method and the About, 1440 × 900 and 390 × 844, 4 Nov). Each marks where it really starts with data-starts,
  as the bar reads it: the address goes there, at once (a smooth scroll would run every passage on the way). The menu, the colophon's
  index, back and forward, and an address arrived with. The Work lands on its own chapters (work-client.tsx).
  With reduced motion or no JavaScript the sections lie one after the other, the marks are not displayed, and the browser's own jump is
  right: nothing is done.
*/
const IDS = ['method', 'about']

export function landOnAddresses() {
  const mark = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-starts="${id}"]`)
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
    scrollTo({ top: el.getBoundingClientRect().top + scrollY + 1, behavior: 'auto' })
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
