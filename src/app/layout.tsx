import type { CSSProperties, ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { studio } from '@content'
import { tuningProperties } from '@content/tuning'
import { fontClassName } from '@/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: studio.name,
  description: studio.sentence,
}

export const viewport: Viewport = {
  themeColor: '#1E1D1A',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassName} style={tuningProperties() as CSSProperties}>
      <body>{children}</body>
    </html>
  )
}
