/*
  The press under a finger (owner, 3 Nov: storyboard "O toque no telemóvel", option A, "Recua"; only on the menu and on the Work's
  chapter names and moments). What is pressed sinks back a little (96 %) and darkens while the finger is on it, and comes back in
  0.22 s; a quick tap is held 0.12 s so it is seen. By the independent `scale` and `filter`, played with Web Animations: the chapter
  names already move by `transform` and `opacity` (their flights between chapters), and this never touches either. With reduced motion
  it only darkens. The browser's own tap colour is off everywhere (globals.css).
*/
const DOWN = { scale: '0.96', filter: 'brightness(0.55)' }
const REST = { scale: '1', filter: 'brightness(1)' }
const HOLD_MS = 120

export function press(root: Element, selector: string) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  const down = new WeakMap<Element, number>()
  const play = (el: Element, to: Keyframe, ms: number) => {
    const frame = reduce.matches ? { filter: to.filter } : to
    el.getAnimations().forEach((a) => a.id === 'press' && a.cancel())
    const a = el.animate([frame], { duration: ms, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' })
    a.id = 'press'
    return a
  }
  const onDown = (e: Event) => {
    const pe = e as PointerEvent
    if (pe.pointerType === 'mouse') return
    const el = (pe.target as Element | null)?.closest(selector)
    if (!el || !root.contains(el)) return
    down.set(el, performance.now())
    play(el, DOWN, 60)
  }
  const onUp = (e: Event) => {
    const el = (e.target as Element | null)?.closest(selector)
    if (!el || !down.has(el)) return
    const since = performance.now() - (down.get(el) ?? 0)
    down.delete(el)
    window.setTimeout(() => {
      // back at rest the animation goes, so nothing is left holding a layer
      play(el, REST, 220).onfinish = (ev) => (ev.target as Animation).cancel()
    }, Math.max(0, HOLD_MS - since))
  }
  root.addEventListener('pointerdown', onDown, { passive: true })
  ;['pointerup', 'pointercancel', 'pointerout'].forEach((t) => root.addEventListener(t, onUp, { passive: true }))
  return () => {
    root.removeEventListener('pointerdown', onDown)
    ;['pointerup', 'pointercancel', 'pointerout'].forEach((t) => root.removeEventListener(t, onUp))
  }
}
