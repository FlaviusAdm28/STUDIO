import { Cormorant_Garamond, Schibsted_Grotesk } from 'next/font/google'

/*
  The V5 faces, chosen by the design owner after the M1 comparison (variant A): Cormorant Garamond for
  what speaks, Schibsted Grotesk for what is read and operated. `latin` covers Portuguese
  (á ã â ç é ê í ó õ ô ú, €, º — checked in the browser); `latin-ext` would only add files.
  Three files in all (Cormorant 300 normal and italic, Schibsted variable).
*/
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
})

const text = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
})

export const fontClassName = `${display.variable} ${text.variable}`
