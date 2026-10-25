'use client'

import { useRef, useState, type ReactNode } from 'react'

type Props = {
  /** The monochrome derived from the colour frame — the studio's default. */
  mono: ReactNode
  /** The same frame in colour. */
  colour: ReactNode
  buttonLabel: string
  className?: string
}

const SLOP = 14 // px of movement that turns a press into a scroll or a drag

/*
  Colour belongs to the work, and appears when asked for. Holding the photograph (mouse or finger)
  shows it in colour; letting go returns it. A visible button does the same by click, Enter or Space,
  and keeps its state (aria-pressed) — the alternative to the gesture and the way to discover it.
  Moving more than a few pixels cancels the press, so a scroll is never mistaken for a hold.
  The swap is an opacity change between two pre-generated images; under reduced motion it is instant.
*/
export function ColourReveal({ mono, colour, buttonLabel, className }: Props) {
  const [held, setHeld] = useState(false)
  const [pinned, setPinned] = useState(false)
  const press = useRef<{ id: number; x: number; y: number } | null>(null)

  const release = () => {
    press.current = null
    setHeld(false)
  }

  return (
    <div className={`reveal ${className ?? ''}`} data-colour={held || pinned ? 'on' : 'off'}>
      <div
        className="reveal-frame"
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return
          press.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
          setHeld(true)
        }}
        onPointerMove={(e) => {
          const p = press.current
          if (p && p.id === e.pointerId && Math.hypot(e.clientX - p.x, e.clientY - p.y) > SLOP) release()
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onContextMenu={(e) => {
          if (press.current) e.preventDefault()
        }}
      >
        <div className="reveal-mono">{mono}</div>
        <div className="reveal-colour" aria-hidden="true">
          {colour}
        </div>
      </div>
      <button type="button" className="reveal-button" aria-pressed={pinned} onClick={() => setPinned((v) => !v)}>
        <span className="reveal-dot" aria-hidden="true" />
        {buttonLabel}
      </button>
    </div>
  )
}
