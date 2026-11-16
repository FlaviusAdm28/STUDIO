// vtape.js — the strategy's phase 0 (v5-scroll-strategy.md): what is on screen, frame by frame. Injected into the page (Chrome by CDP,
// Safari by the lab proxy's remote console); same code in both. Per frame: the time, scrollY, the root's flags that matter, and for each
// element that counts and is in view (photographs, video, headings, text, the bar, the menu, and whatever is animating) its box, its
// effective opacity and, for an image, the file it shows — written only when it changed. Read back with window.__vtDump(from, n).
;(() => {
  if (window.__vt) return 'already'
  const t0 = performance.now()
  const VT = (window.__vt = { t0, wall0: Date.now(), els: [], frames: [], marks: [] })
  const keys = new Map()
  const name = (el) => {
    const bit = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : '')
    const up = []
    for (let e = el, i = 0; e && e !== document.body && i < 4; e = e.parentElement, i++) up.unshift(bit(e))
    const src = el.currentSrc || el.getAttribute?.('src') || ''
    const txt = /^(H\d|P|SPAN|A|LI|BLOCKQUOTE|FIGCAPTION|BUTTON)$/.test(el.tagName) ? el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) : ''
    return up.join(' > ') + (src ? ' {' + src.split('/').pop().split('?')[0] + '}' : '') + (txt ? ' "' + txt + '"' : '')
  }
  const keyOf = (el) => {
    let k = keys.get(el)
    if (k === undefined) {
      k = VT.els.length
      keys.set(el, k)
      VT.els.push(name(el))
    }
    return k
  }
  const SEL = 'main img, main video, main canvas, main h1, main h2, main h3, main p, main figure, main blockquote, main li, header.bar .bar-isl, header.bar .bar-menu, dialog.menu, dialog.menu a'
  let cand = []
  let queried = -1e9
  const query = (now) => {
    const set = new Set(document.querySelectorAll(SEL))
    for (const a of document.getAnimations()) {
      const t = a.effect && a.effect.target
      if (t && t.nodeType === 1) set.add(t)
    }
    cand = [...set]
    queried = now
  }
  const last = new Map()
  let lastAnim = 0
  const frame = (now) => {
    if (VT.stopped) return
    const anims = document.getAnimations().length
    if (now - queried > 400 || anims !== lastAnim) query(now)
    lastAnim = anims
    const H = innerHeight
    const opa = new Map()
    const eff = (el) => {
      let o = 1
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        let v = opa.get(e)
        if (v === undefined) {
          const cs = getComputedStyle(e)
          v = cs.visibility === 'hidden' || cs.display === 'none' ? 0 : +cs.opacity
          opa.set(e, v)
        }
        o *= v
        if (!o) break
      }
      return o
    }
    const recs = []
    for (const el of cand) {
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H) {
        if (last.has(el)) {
          recs.push([keyOf(el)])
          last.delete(el)
        }
        continue
      }
      const o = Math.round(eff(el) * 100)
      const src = el.currentSrc ? el.currentSrc.split('/').pop().split('?')[0] : ''
      const v = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), o, src]
      const p = last.get(el)
      if (p && Math.abs(p[0] - v[0]) < 1 && Math.abs(p[1] - v[1]) < 1 && Math.abs(p[2] - v[2]) < 1 && Math.abs(p[3] - v[3]) < 1 && p[4] === v[4] && p[5] === v[5]) continue
      last.set(el, v)
      recs.push([keyOf(el), ...v])
    }
    const R = document.documentElement
    const flags = Object.keys(R.dataset).filter((k) => !['js', 'theme', 'section'].includes(k)).join(',') + (R.style.overflow ? '|ovf' : '') + (R.style.scrollSnapType ? '|nosnap' : '')
    VT.frames.push([Math.round(now - t0), Math.round(scrollY), R.dataset.section || '', flags, recs])
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
  window.__vtMark = (label) => VT.marks.push([Math.round(performance.now() - t0), label])
  window.__vtDump = (from, n) => JSON.stringify({ wall0: VT.wall0, els: VT.els, marks: VT.marks, frames: VT.frames.slice(from, from + n), total: VT.frames.length })
  window.__vtStop = () => (VT.stopped = true)
  return 'on'
})()
