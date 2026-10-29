/**
 * Chapter One V5 — the times and scales worth touching, in one place (README #59). The layout passes
 * each one to the CSS as a custom property on `<html>`; a component that needs a value in script
 * reads it from here. Only values that are worth changing live here — no configuration system.
 * Each value says where it was decided; change it, then measure on the Xiaomi.
 */

export const tuning = {
  /** The base curve (interactions.md §0). */
  ease: 'cubic-bezier(0.2, 0.7, 0.2, 1)',

  /**
   * Entrance (interactions.md §1; storyboard E1–E4). When each phase starts, in ms from the arrival:
   * the letters open, the camera enters through the O, the final state. Each beat of the storyboard is seen on its
   * own (owner, 29 Oct: at 300 / 1400 / 2400 the dedication had 0.3 s alone and the letters were never still):
   * E1 the dedication alone 0–0.7 s; E2 the letters open over 1.1 s (the storyboard's fade) and hold; E3 from 2.0 s.
   */
  entranceLettersAtMs: 700,
  entranceLettersSeconds: 1.1,
  entranceZoomAtMs: 2000,
  entranceFinalAtMs: 3200,
  /**
   * The veil grows from the O's stroke until the stroke covers the screen. Measured: ×60 left 40 % dark (27 Oct);
   * ×120 still left a dark band at the left edge on the desktop (29 Oct); ×160 covers it. Transform only: no cost.
   */
  entranceZoomScale: 160,
  entranceZoomSeconds: 1.9,
  entranceZoomEase: 'cubic-bezier(0.75, 0, 0.2, 1)',
  /** The film eases in as the camera arrives (a dolly): from this scale to 1. */
  entranceDollyScale: 1.14,
  entranceDollySeconds: 2.2,
  /** The blades enter one after another. */
  entranceBladeStaggerSeconds: 0.12,
  /**
   * The tint of the hour over the film (interactions.md §1): the top colour changes with the visitor's
   * light; the bottom stays dark for the words. Never lighter than the storyboard's own tint, 0.35 at the top →
   * 0.55 below (owner, 29 Oct: "devemos sempre seguir o storyboard… podemos escurecer a tinta"; day was 0.16,
   * morning and evening 0.30). The hues are still starting values for the owner to see on the real video (#31).
   */
  tintMorning: 'rgba(52, 64, 82, 0.38)',
  tintDay: 'rgba(30, 28, 25, 0.35)',
  tintEvening: 'rgba(96, 60, 24, 0.38)',
  tintNight: 'rgba(12, 16, 36, 0.48)',
  tintFloor: 'rgba(20, 18, 15, 0.55)',

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
  const units: Record<string, string> = { Seconds: 's', Px: 'px', Ms: 'ms' }
  return Object.fromEntries(
    Object.entries(tuning).map(([key, value]) => {
      const unit = Object.keys(units).find((u) => key.endsWith(u))
      const name = `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`
      return [name, unit ? `${value}${units[unit]}` : String(value)]
    }),
  )
}
