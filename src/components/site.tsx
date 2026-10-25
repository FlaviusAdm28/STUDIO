import Link from 'next/link'
import { chapters, contact, media, studio, ui } from '@content'
import { Picture } from './picture'

/**
 * The header on every page: the wordmark, the chapters, and the way to start a project.
 * On a phone the chapters give way to `Index`, which leads to the contents on the homepage
 * (the dialog version is a later island; this link works without scripts).
 */
export function SiteHeader({ indexHref }: { indexHref: string }) {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link href="/" className="wordmark">
          {studio.name}
        </Link>
        <nav className="header-nav" aria-label={ui.chapters}>
          <ul>
            {chapters.map((c) => (
              <li key={c.id}>
                <Link href={c.href}>
                  <span className="numeral">{c.numeral}</span> {c.word}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <Link href={indexHref} className="header-index">
            {ui.index}
          </Link>
          <a href="#contact" className="cta">
            {contact.cta}
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>
    </header>
  )
}

/**
 * The page ends where it began, at night, but the last photograph is the first one in colour that
 * nobody had to ask for: the road at dusk. Colour arrives as the visitor arrives at the question.
 */
export function ContactBlock() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <figure className="contact-print" data-develop>
          <Picture id="302" alt={media.contact.alt} sizes="(min-width: 960px) 26vw, 60vw" />
        </figure>
        <h2 id="contact-title" className="contact-ask">
          {contact.ask.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </h2>
        <div className="contact-act">
          <p className="contact-tell">{contact.tell}</p>
          <a className="contact-link" href={contact.instagram.profile} rel="noopener">
            <span>{contact.via}</span>
            <span className="contact-handle">
              {contact.instagram.handle}
              <span aria-hidden="true"> →</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

/** The chapters again, without scripts, and the photographer's credit. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <Link href="/" className="wordmark">
          {studio.name}
        </Link>
        <ul className="footer-nav">
          {chapters.map((c) => (
            <li key={c.id}>
              <Link href={c.href}>
                <span className="numeral">{c.numeral}</span> {c.word}
              </Link>
            </li>
          ))}
          <li>
            <a href={contact.instagram.profile} rel="noopener">
              {contact.instagram.label}
            </a>
          </li>
        </ul>
        <p className="footer-credit">{ui.credit}</p>
      </div>
    </footer>
  )
}
