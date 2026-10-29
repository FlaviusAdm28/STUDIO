import { Cormorant_Garamond, Schibsted_Grotesk } from 'next/font/google'

/*
  The V5 faces, chosen by the design owner after the M1 comparison (variant A): Cormorant Garamond for
  what speaks, Schibsted Grotesk for what is read and operated. `latin` covers Portuguese
  (á ã â ç é ê í ó õ ô ú, €, º — checked in the browser); `latin-ext` would only add files.
  Three files for the page (Cormorant 400 normal and italic, Schibsted variable) and one for the entrance.
  400, as in the storyboard (its h1–h3, the dedication, the blades); 300 was thinner than the approved frames
  (owner, 29 Oct: "no storyboard é mais larga/bold").
*/
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
})

/*
  The entrance's window letters: CHAPTER ONE cut out of the veil needs a heavier stroke to be a window
  (storyboard: 600 asked of a family loaded at 400/500, so the browser drew 500 in synthetic bold — measured
  29 Oct to match a real 700). One more file, approved with the entrance (assets.md §7); a separate instance so
  the italic 700 is never fetched.
*/
const windowLetters = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['700'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-window',
})

const text = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
})

export const fontClassName = `${display.variable} ${windowLetters.variable} ${text.variable}`
