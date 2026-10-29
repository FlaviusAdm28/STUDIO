/*
  The derivatives `npm run images` writes, by base path: the widths written and the intrinsic size of
  the largest (every width keeps the ratio), so the layout never shifts. Add an entry when a page uses
  a new image; its source and role are in scripts/images.mjs and docs/design/v5/assets.md.
*/
const photo = { widths: [640, 960, 1440], width: 1440, height: 2157 } as const
const ai = { widths: [640, 1024], width: 1024, height: 1536 } as const

export const media: Record<string, { widths: readonly number[]; width: number; height: number }> = {
  '/media/v5/entrance/poster-wide': { widths: [960, 1920], width: 1920, height: 960 },
  '/media/v5/entrance/poster-tall': { widths: [720], width: 720, height: 1280 },
  '/media/v5/work/weddings-before': photo,
  '/media/v5/work/weddings-day': photo,
  '/media/v5/work/weddings-after': photo,
  '/media/v5/work/artists-always': ai,
  '/media/v5/work/artists-moment': ai,
  '/media/v5/work/artists-record': ai,
  '/media/v5/work/experiences-before': ai,
  '/media/v5/work/experiences-during': ai,
  '/media/v5/work/experiences-after': ai,
  '/media/v5/method/screen-wedding': { widths: [640, 960], width: 960, height: 1438 },
  '/media/v5/about/portrait': photo,
  '/media/v5/about/workspace': ai,
}
