'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/*
  The desk answers the hand: the objects shift by their own depth and the lamp's light follows a
  little, so the composition reads as things lying at different heights under one light.

  Fine pointers only, and never under reduced motion. Pointer events only set a target; one rAF loop
  eases towards it and stops itself once the desk is still, so nothing runs while nobody moves.
  Writes two custom properties on the stage (--px, --py in −1…1); CSS turns them into transforms.
*/
export function DeskDepth({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return

    const target = { x: 0, y: 0 }
    const now = { x: 0, y: 0 }
    let raf = 0

    const step = () => {
      raf = 0
      now.x += (target.x - now.x) * 0.08
      now.y += (target.y - now.y) * 0.08
      el.style.setProperty('--px', now.x.toFixed(4))
      el.style.setProperty('--py', now.y.toFixed(4))
      if (Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.001) raf = requestAnimationFrame(step)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      kick()
    }
    const leave = () => {
      target.x = 0
      target.y = 0
      kick()
    }

    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
