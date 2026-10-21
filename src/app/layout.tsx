import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Schibsted_Grotesk, Tenor_Sans } from 'next/font/google'
import { site } from '@content'
import { motionCss } from '@/motion'
import './globals.css'

/**
 * **§5's two families, and no others.**
 *
 * `final-design-spec.pdf` §5: *"Cormorant Garamond 300 for every statement… Schibsted Grotesk for every
 * label and micro-caps… Monospace never ships — it is storyboard annotation only."*
 *
 * Self-hosted by `next/font`, so there is no third-party request on the first paint and no layout shift
 * while a face arrives: the fallback is metric-adjusted and the swap is invisible. Each publishes a
 * custom property rather than a class, because the faces are read by `globals.css` at the point of use
 * and a class on the body would type the whole document at once — states 06 → 14 are still the V1
 * composition and are not this pass's to retype.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  display: 'swap',
  variable: '--font-cormorant',
})

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-schibsted',
})

/*
  **The one departure from the two, for one line.** Tenor Sans sets the hero's tagline and nothing else
  (`--v2-tagline` in `globals.css`) — design owner, 21 October 2026, recorded against §5 as
  `docs/design/v2/implementation-reconciliation.md` C43. One weight; the Latin file the page loads is
  10KB (measured on the build).
*/
const tenor = Tenor_Sans({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-tenor',
})

/*
  Where the page lives, for the absolute URLs a share card needs. Vercel says which deployment this is;
  nothing here names a domain, because none has been decided (`open-decisions.md` §1). The icons and the
  share image are files beside this one (`favicon.ico`, `icon.png`, `apple-icon.png`,
  `opengraph-image.jpg`), which is how the framework finds them.
*/
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL

export const metadata: Metadata = {
  metadataBase: new URL(host ? `https://${host}` : 'http://localhost:3000'),
  title: site.title,
  description: site.sentence,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.title,
    title: site.title,
    description: site.sentence,
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.sentence,
  },
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
 * - A fragment in the address is taken off it for the same reason, and here for the same reason:
 *   the browser scrolls to a fragment once the document is in, which is during the opening, and the
 *   film takes wherever the page stands when the opening ends as its origin. Measured on a load of
 *   `/#contact`: an origin of 30,009 and a document 47,317px tall. Nothing in the site writes a
 *   fragment any more (`scroll-stage.tsx`), so this is for an address that already carries one.
 */
const BEGIN_AT_THE_BEGINNING = `
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
    window.scrollTo(0, 0);
  } catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${schibsted.variable} ${tenor.variable}`}>
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
