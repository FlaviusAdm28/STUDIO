import type { Metadata, Viewport } from 'next'
import { site } from '@content'
import { motionCss } from '@/motion'
import './globals.css'

export const metadata: Metadata = {
  title: site.title,
  description: site.sentence,
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  /*
    The shot is full bleed, so it goes under the notch and the home indicator rather than being
    letterboxed away from them. This is also what makes `env(safe-area-inset-*)` report real
    numbers — without it those values are zero and any padding written against them does nothing.
  */
  viewportFit: 'cover',
}

/**
 * The homepage is a sequence, not a document, so it always begins at its beginning.
 *
 * This runs synchronously as the first thing in the body — before the browser reaches the point
 * where it would restore a scroll position, and before React has attached anything. Both of those
 * matter:
 *
 * - Setting `scrollRestoration` early is what stops the restore happening at all, rather than
 *   letting it happen and correcting it afterwards, which would show a frame of Chapter II.
 * - Doing it before any listener exists matters because the hero treats a scroll event as the
 *   visitor asking to move on, and accelerates. A programmatic reset after hydration would fire
 *   that event and rush the opening for somebody who had not touched anything.
 */
const BEGIN_AT_THE_BEGINNING = `
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  } catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: BEGIN_AT_THE_BEGINNING }} />

        {/*
          Every motion value in the project, carried from `src/motion` into CSS. `globals.css`
          declares none of them and only reads them, so this is the sole definition of each — see
          `docs/development/02-motion-system.md`.

          `precedence` hoists it into the head rather than leaving it in the body, so `--pin` and
          the rest resolve on the first paint. Left in the body it would be parsed after the
          browser was already entitled to paint, and `.film`'s height depends on `--pin`.
        */}
        <style
          href="chapter-one-motion"
          precedence="high"
          dangerouslySetInnerHTML={{ __html: motionCss() }}
        />

        {children}
      </body>
    </html>
  )
}
