/*
  The derivatives `npm run images` writes, by base path: the widths written and the intrinsic size of
  the largest (every width keeps the ratio), so the layout never shifts. Add an entry when a page uses
  a new image; its source and role are in scripts/images.mjs and docs/design/v5/assets.md.
*/
const photo = { widths: [640, 960, 1440], width: 1440, height: 2157 } as const
// the Work's real photographs reach 1600: a frame of 533 px on a 1920 screen at 2× needs 1066
const fine = { widths: [640, 960, 1280, 1600], width: 1600, height: 2397 } as const
const ai = { widths: [640, 1024], width: 1024, height: 1536 } as const

export const media: Record<string, { widths: readonly number[]; width: number; height: number }> = {
  '/media/v5/entrance/poster-wide': { widths: [960, 1920], width: 1920, height: 960 },
  '/media/v5/entrance/poster-tall': { widths: [720], width: 720, height: 1280 },
  '/media/v5/work/weddings-before': fine,
  '/media/v5/work/weddings-day': fine,
  '/media/v5/work/weddings-after': fine,
  '/media/v5/work/artists-always': ai,
  '/media/v5/work/artists-moment': ai,
  '/media/v5/work/artists-record': ai,
  '/media/v5/work/experiences-before': ai,
  '/media/v5/work/experiences-during': ai,
  '/media/v5/work/experiences-after': ai,
  // bought-in photographs (Unsplash, 30 Oct), each with its own ratio
  '/media/v5/work/artists-always-photo': { widths: [640, 960], width: 960, height: 1536 },
  '/media/v5/work/artists-moment-photo': { ...fine, height: 2133 },
  '/media/v5/work/experiences-before-photo': { ...fine, height: 2416 },
  '/media/v5/work/experiences-during-photo': { ...fine, height: 2133 },
  '/media/v5/work/experiences-after-photo': { ...fine, height: 2400 },
  // the live gallery's guests' photographs (On the day): small, never shown large
  ...Object.fromEntries(
    [1, 2, 3, 4, 5, 6].map((i) => [
      `/media/v5/work/weddings-guests-${i}`,
      { widths: [320, 640], width: 640, height: 958 },
    ]),
  ),
  '/media/v5/method/screen-wedding': { widths: [640, 960], width: 960, height: 1438 },
  '/media/v5/about/portrait': photo,
  '/media/v5/about/workspace': ai,
}
