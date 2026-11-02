'use client'

import { useEffect, useState } from 'react'

/*
  A test instrument, only with ?fps in the address and only on this machine (owner, 31 Oct: the published site must never
  have it): the frames of the last second and, since the last tap, the worst frame and how many took over 25 and over
  50 ms. A rAF loop and one text update per second, on its own layer: it weighs nothing against what it measures.
*/
export function FpsMeter() {
  const [on, setOn] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (!local || !new URLSearchParams(location.search).has('fps')) return
    const start = requestAnimationFrame(() => setOn(true))
    let frame = 0
    let last = 0
    let times: number[] = []
    let worst = 0
    let over25 = 0
    let over50 = 0
    let shown = 0
    const reset = () => {
      worst = over25 = over50 = 0
    }
    const loop = (t: number) => {
      if (last) {
        const d = t - last
        times.push(t)
        worst = Math.max(worst, d)
        if (d > 25) over25++
        if (d > 50) over50++
      }
      last = t
      times = times.filter((x) => x > t - 1000)
      if (t - shown > 1000) {
        shown = t
        setText(`${times.length} fps · pior ${Math.round(worst)} ms · >25: ${over25} · >50: ${over50}`)
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    addEventListener('pointerdown', reset, { passive: true })
    return () => {
      cancelAnimationFrame(start)
      cancelAnimationFrame(frame)
      removeEventListener('pointerdown', reset)
    }
  }, [])

  if (!on) return null
  return (
    <output
      style={{
        position: 'fixed',
        left: 8,
        bottom: 8,
        zIndex: 2147483647,
        padding: '4px 8px',
        borderRadius: 6,
        background: 'rgba(0, 0, 0, 0.75)',
        color: '#fff',
        font: '12px/1.3 monospace',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
      }}
    >
      {text}
    </output>
  )
}
