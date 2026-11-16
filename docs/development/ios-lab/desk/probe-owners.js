// probe-owners.js — fase 1, sonda A (#15): who moves the page and who holds it. Every window.scrollTo and every change of the root's
// overflow / scroll-snap-type / data-pass is written to the tape (vtape.js marks) with scrollY and the caller (the first frames of the stack,
// file:line in the built chunks). Read back from the .vt.json marks.
;(() => {
  if (window.__probeOwners) return 'already'
  window.__probeOwners = true
  const who = () =>
    (new Error().stack || '')
      .split('\n')
      .slice(2, 5)
      .map((l) => l.replace(/^\s*(at\s+)?/, '').replace(/https?:\/\/[^/]+\/_next\/static\/chunks\//, '').slice(0, 70))
      .join(' < ')
  const orig = window.scrollTo.bind(window)
  window.scrollTo = function (a, b) {
    const top = typeof a === 'object' ? a.top : b
    window.__vtMark(`scrollTo ${Math.round(scrollY)}→${Math.round(top)} ${typeof a === 'object' ? a.behavior || '' : ''} @ ${who()}`)
    return orig(...arguments)
  }
  const R = document.documentElement
  let was = ''
  const state = () => `ovf=${R.style.overflow || '-'} snap=${R.style.scrollSnapType || '-'} pass=${R.dataset.pass || '-'} held=${'wheelHeld' in R.dataset ? 1 : 0}`
  new MutationObserver(() => {
    const s = state()
    if (s !== was) {
      window.__vtMark(`root ${s} y=${Math.round(scrollY)} @ ${who()}`)
      was = s
    }
  }).observe(R, { attributes: true, attributeFilter: ['style', 'data-pass', 'data-wheel-held'] })
  // the wheel as the page receives it: one mark per event while the probe runs (sign, size, cancelled or not)
  addEventListener('wheel', (e) => window.__vtMark(`wheel ${Math.round(e.deltaY)} c=${e.cancelable ? 1 : 0} p=${e.defaultPrevented ? 1 : 0} y=${Math.round(scrollY)}`), { passive: true })
  return 'probe on'
})()
