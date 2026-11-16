// probe-paint.js — fase 1, sonda B (#18): is the arch missing on Chrome's way back because the flight's copies sit at opacity 0 (layers
// dropped, image not decoded) until they fly? The copies (work-client.tsx flight(): absolutely placed boxes with z-index 3 holding an img)
// get their opacity keyframes of 0 raised to 0.002 (unseen, still painted) and their images decoded; re-applied every 300 ms (a resize or a
// new measure builds the flight again). If the arch then stays on screen all the way back, that is the cause.
;(() => {
  if (window.__probePaint) return 'already'
  window.__probePaint = true
  const boxes = () => [...document.querySelectorAll('div[aria-hidden="true"]')].filter((d) => d.style.zIndex === '3' && d.querySelector('img'))
  const patch = () => {
    let n = 0
    for (const box of boxes()) {
      for (const a of box.getAnimations()) {
        const kf = a.effect.getKeyframes()
        if (!kf.some((k) => k.opacity !== undefined && +k.opacity === 0)) continue
        a.effect.setKeyframes(kf.map((k) => (k.opacity !== undefined && +k.opacity === 0 ? { ...k, opacity: 0.002 } : k)))
        n++
      }
      const img = box.querySelector('img')
      if (img && !img.__decoded) {
        img.__decoded = true
        img.decode().catch(() => {})
      }
    }
    if (n) window.__vtMark(`probe-paint patched ${n}`)
  }
  patch()
  setInterval(patch, 300)
  return 'probe on: ' + boxes().length + ' boxes'
})()
