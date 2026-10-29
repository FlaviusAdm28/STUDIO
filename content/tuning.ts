/**
 * Chapter One V5 — the times and scales worth touching, in one place (README #59). The layout passes
 * each one to the CSS as a custom property on `<html>`; a component that needs a value in script
 * reads it from here. Only values that are worth changing live here — no configuration system.
 * Each value says where it was decided; change it, then measure on the Xiaomi.
 */

export const tuning = {
  /** The base curve (interactions.md §0). */
  ease: 'cubic-bezier(0.2, 0.7, 0.2, 1)',

  /** Work — one moment lasts as long as its word takes to fill (#73): the photograph, then the piece. */
  momentSeconds: 4,
  momentPhotoSeconds: 1.2,
  momentPieceSeconds: 2.8,
  /** Moments not yet lit: linen at this opacity (#73; 3.1:1 on the stage, the owner's choice). */
  momentDimOpacity: 0.38,
  /** Work — the chapter passage (#73): the arriving chapter grows and slides, the old text fades, the new text enters. */
  chapterMoveSeconds: 1.2,
  chapterTextOutSeconds: 0.65,
  chapterTextInSeconds: 1,

  /** Menu — the drop of glass (#69): grows by transform: scale; the words wait for it. */
  menuDropSeconds: 0.9,
  menuDropEase: 'cubic-bezier(0.65, 0, 0.25, 1)',
  menuWordsDelaySeconds: 0.32,
  menuWordsStaggerSeconds: 0.07,
  menuWordsOutSeconds: 0.25,

  /** Bar glass (#69): the blur on a phone, multiplied on the desktop (≥ 900 px); the menu's glass is × 1.4. */
  glassBlurPx: 8,
  glassDesktopFactor: 1.6,
  glassMenuFactor: 1.4,
} as const

/** The tuning as CSS custom properties: `momentSeconds` → `--moment-seconds: 4s`. */
export function tuningProperties(): Record<string, string> {
  const units: Record<string, string> = { Seconds: 's', Px: 'px' }
  return Object.fromEntries(
    Object.entries(tuning).map(([key, value]) => {
      const unit = Object.keys(units).find((u) => key.endsWith(u))
      const name = `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`
      return [name, unit ? `${value}${units[unit]}` : String(value)]
    }),
  )
}
