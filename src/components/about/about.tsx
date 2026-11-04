import { about, sections } from '@content'
import { Picture } from '@/components/picture'
import { AboutClient } from './about-client'
import './about.css'

/*
  03 About (storyboard states 12–14; README #13, #50–#52, #65; interactions.md §4).
  This markup is the final state, 14: the portrait in its place, black and white, "I'm Flávio." as the title, the sentence, the
  paragraph, the credit and 04 Questions ↓, on the desktop as an editorial grid. With no JavaScript or with reduced motion it is
  read as it stands. With both, AboutClient holds it briefly over the Method's last screen and plays the passage: the light finds
  the portrait (12), the room comes up (13), the story (14).

  The colour of the portrait is one photograph: the B&W is derived from the colour frame by `npm run images` (README #50). It is
  shown by a gesture — hover on the desktop, holding on a phone, focus + Enter — and always goes back to B&W on release.
*/
const next = sections.find((s) => s.id === 'questions')

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      {/* held while the passage runs (about-stage.ts); at rest a plain screen */}
      <div className="a-stage" data-lum="0.1">
        {/* the room lit: its ground and the portrait's own atmosphere, B&W while the portrait is, its colours while it shows them */}
        <div className="a-lit" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- a 48 px pre-made blur, stretched: nothing to optimise */}
          <img className="a-aura a-aura-mono" src={`${about.portrait.src}-mono-aura.jpg`} alt="" width={48} height={72} decoding="async" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="a-aura a-aura-col" src={`${about.portrait.src}-aura.jpg`} alt="" width={48} height={72} decoding="async" />
        </div>

        <h2 id="about-title" className="a-title">
          03 About
        </h2>

        <div className="a-box">
          {/* the portrait: B&W by default; the colour (the same photograph) over it, only while hovered, held or chosen */}
          <div className="a-pt" data-colour="off">
            <div className="a-frame">
              <Picture className="a-mono" src={about.portrait.src} alt={about.portrait.alt} mono sizes="(min-width: 900px) 34vw, 100vw" />
              <Picture className="a-col" src={about.portrait.src} alt="" sizes="(min-width: 900px) 34vw, 100vw" />
              {/* the dark of 12 around the light (about-stage.ts): with the motion only */}
              <div className="a-dark" aria-hidden="true">
                <div className="a-edge" />
                <div className="a-spot" />
              </div>
            </div>
          </div>

          <p className="a-role">{about.role}</p>
          <p className="a-name">{about.greeting}</p>
          <p className="a-say">{about.paragraphs[0]}</p>
          <div className="a-rule" aria-hidden="true" />
          <p className="a-para">{about.paragraphs[1]}</p>
          <p className="a-credit">
            <span>{about.credit}</span>
            <span className="a-sep" aria-hidden="true">
              {' · '}
            </span>
            {/* the hint names the gesture of the device (#50): a mouse hovers, a finger holds */}
            <span className="a-hint">
              <span className="a-hint-hover">{about.colourHint.hover}</span>
              <span className="a-hint-hold">{about.colourHint.hold}</span>
            </span>
          </p>
          {next && (
            <a className="a-next" href={`#${next.id}`}>
              {next.number} {next.label} <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      </div>

      <AboutClient />
    </section>
  )
}
