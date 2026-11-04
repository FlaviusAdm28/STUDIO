/*
  The portrait's colour (README #50, #52; storyboard 14): black and white by default; the colour — the same photograph — shows slowly
  (~2 s) while a mouse is over it, while a finger holds it, or after focus + Enter (Enter or Escape again, or leaving it, brings the
  B&W back). On release it always goes back. A finger that starts a scroll cancels the pointer (touch-action: pan-y), and so the B&W
  comes back: holding works here because the About is not held when it is read (#50). The room's atmosphere changes with it
  (about.css, [data-colour] on the section). Without JavaScript only a mouse shows it (about.css).
*/
export function bindPortrait(about: HTMLElement) {
  const pt = about.querySelector<HTMLElement>('.a-pt')
  if (!pt) return { release: () => {}, stop: () => {} }

  const colour = (on: boolean) => {
    const v = on ? 'on' : 'off'
    if (pt.dataset.colour === v) return
    pt.dataset.colour = v
    about.dataset.colour = v
    pt.setAttribute('aria-pressed', String(on))
  }
  // a control for the keyboard and for assistive technology: its name is the portrait's own description (its alt)
  pt.setAttribute('role', 'button')
  pt.tabIndex = 0
  pt.setAttribute('aria-pressed', 'false')
  pt.querySelectorAll('img').forEach((img) => (img.draggable = false))

  // A mouse that really moves over it: the portrait sliding under a resting cursor (12 → 13) fires an enter with no movement, and
  // the colour came on with no gesture (Chrome, 4 Nov)
  const moved = (e: PointerEvent) => e.pointerType === 'mouse' && (e.movementX !== 0 || e.movementY !== 0)
  const onEnter = (e: PointerEvent) => moved(e) && colour(true)
  const onMove = (e: PointerEvent) => pt.dataset.colour !== 'on' && moved(e) && colour(true)
  const onLeave = (e: PointerEvent) => e.pointerType === 'mouse' && colour(false)
  const onDown = (e: PointerEvent) => e.pointerType !== 'mouse' && colour(true)
  const onUp = (e: PointerEvent) => e.pointerType !== 'mouse' && colour(false)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      colour(pt.dataset.colour !== 'on')
    } else if (e.key === 'Escape') colour(false)
  }
  const onBlur = () => colour(false)
  // no callout, no menu, no drag of the photograph under a holding finger
  const noMenu = (e: Event) => e.preventDefault()
  const ends = ['pointerup', 'pointercancel', 'pointerleave'] as const

  pt.addEventListener('pointerenter', onEnter)
  pt.addEventListener('pointermove', onMove)
  pt.addEventListener('pointerleave', onLeave)
  pt.addEventListener('pointerdown', onDown)
  ends.forEach((t) => pt.addEventListener(t, onUp))
  pt.addEventListener('keydown', onKey)
  pt.addEventListener('blur', onBlur)
  pt.addEventListener('contextmenu', noMenu)

  return {
    release: () => colour(false),
    stop: () => {
      pt.removeEventListener('pointerenter', onEnter)
      pt.removeEventListener('pointermove', onMove)
      pt.removeEventListener('pointerleave', onLeave)
      pt.removeEventListener('pointerdown', onDown)
      ends.forEach((t) => pt.removeEventListener(t, onUp))
      pt.removeEventListener('keydown', onKey)
      pt.removeEventListener('blur', onBlur)
      pt.removeEventListener('contextmenu', noMenu)
      colour(false)
    },
  }
}
