import type { Metadata, Viewport } from 'next'
import { studio } from '@content'
import { fontClassName } from '@/fonts'
import './globals.css'

/*
  The faces are set once here (`src/fonts`), chosen after the M1 comparison.

  Absolute URLs for share cards: Vercel names the deployment; no domain has been decided. The icons
  and the share image are files beside this one, which is how the framework finds them.
*/
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL

export const metadata: Metadata = {
  metadataBase: new URL(host ? `https://${host}` : 'http://localhost:3100'),
  title: studio.name,
  description: studio.sentence,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: studio.name,
    title: studio.name,
    description: studio.sentence,
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title: studio.name,
    description: studio.sentence,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#12100d',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClassName}>
      <body>{children}</body>
    </html>
  )
}
