import { contact, entrance, sections } from '@content'
import { ContactClient } from './contact-client'
import './contact.css'

/*
  05 Contact — states 19–21 (storyboard; README #54, #55, #106). The last scene: the studio's light goes down where it is (the Questions'
  paper darkens, questions.css) and behind it the entrance's film comes back, very dark under a charcoal veil; the approved question,
  large and alone, held a moment; the visitor's own times and the one action, Talk to us (Instagram), with the handle as text; then the
  colophon as the site's last page: Built around you., the index and the channels.
  Server markup, readable as it is: with no JavaScript the poster stands for the film and the line of the times is left out (it needs the
  visitor's clock). The island (contact-client.tsx) loads and plays the film where it is seen, writes the times and the name.
*/

// the question as the storyboard sets it: "Is there something / that deserves / its own experience?" in italic
const ask = (q: string) => {
  const a = q.indexOf(' that ')
  const b = q.indexOf(' its ')
  if (a < 0 || b < 0) return q
  return (
    <>
      {q.slice(0, a)}
      <br />
      {q.slice(a + 1, b)}
      <br />
      <i>{q.slice(b + 1)}</i>
    </>
  )
}

export function Contact({ year }: { year: number }) {
  const instagram = contact.channels.find((c) => c.label === 'Instagram')

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title" data-lum="0.1">
      {/* the room: the entrance's poster, its film over it once seen, the veil and one low warm light */}
      <div className="c-room" aria-hidden="true">
        <picture className="c-poster">
          <source media="(orientation: portrait)" type="image/avif" srcSet={`${entrance.video.posterTall}-720.avif`} />
          <source media="(orientation: portrait)" srcSet={`${entrance.video.posterTall}-720.jpg`} />
          <source
            type="image/avif"
            srcSet={`${entrance.video.posterWide}-960.avif 960w, ${entrance.video.posterWide}-1920.avif 1920w`}
            sizes="100vw"
          />
          <img
            src={`${entrance.video.posterWide}-960.jpg`}
            srcSet={`${entrance.video.posterWide}-960.jpg 960w, ${entrance.video.posterWide}-1920.jpg 1920w`}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
        <video className="c-film" playsInline loop muted preload="none" suppressHydrationWarning />
        <div className="c-veil" />
        <div className="c-shade" />
      </div>

      {/* where the Contact really starts, under the Questions' last screen (the bar, an address) */}
      <span className="c-start" data-starts="contact" aria-hidden="true" />
      <div className="c-hold">
        <div className="c-scene">
          <h2 id="contact-title" className="c-ask">
            {ask(contact.ask)}
          </h2>
          <div className="c-now">
            {/* written by the island from the arrival kept at the start and the clock */}
            <p className="c-time" hidden />
            <a className="c-cta" href={contact.message}>
              <span className="c-cta-w">{contact.cta}</span> <span aria-hidden="true">→</span>
            </a>
            {instagram && <p className="c-handle">{instagram.handle}</p>}
          </div>
        </div>
        <div className="c-gap" aria-hidden="true" />

        <footer className="colophon">
          <p className="c-sig">
            <span className="c-sig-w">{contact.colophon.signature}</span>
            <small>{contact.colophon.year.replace('{year}', String(year))}</small>
          </p>
          <nav id="index" className="c-col" aria-labelledby="c-index">
            <h3 id="c-index" className="c-k">
              {contact.colophon.index}
            </h3>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {s.number} {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="c-col">
            <h3 className="c-k">{contact.cta}</h3>
            <ul>
              {contact.channels.map((c) => (
                <li key={c.label}>
                  <a href={c.href}>
                    {c.label} · {c.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
      <ContactClient
        film={{ wide: entrance.video.wide, tall: entrance.video.tall }}
        time={contact.time}
        cta={contact.cta}
        ctaNamed={contact.ctaNamed}
        signature={contact.colophon.signature}
        signatureNamed={contact.colophon.signatureNamed}
      />
    </section>
  )
}
