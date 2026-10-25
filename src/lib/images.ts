/*
  The derivatives `npm run images` has written to `public/media/v5/`, and their intrinsic size at the
  largest width (every width keeps the same ratio). Only what a page uses is listed; add an entry
  when its derivatives exist. Sources and roles: docs/design/v5/assets.md.
*/
const portrait = { width: 1440, height: 2157, widths: [640, 960, 1440] } as const
const plate = { width: 1536, height: 1024, widths: [640, 960, 1536] } as const

export const images = {
  '302': { width: 1440, height: 2157, widths: [640, 960, 1440, 2048] },
  '157': { width: 1440, height: 2157, widths: [640, 960, 1440, 2048] },
  main: portrait,
  '024': portrait,
  '335': portrait,
  '347': portrait,
  art: plate,
  method: plate,
  lamp: plate,
} as const

export type ImageId = keyof typeof images
