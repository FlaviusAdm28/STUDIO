import { about, contact, method, nav, questions, sections } from '@content'
import { Bar } from '@/components/bar/bar'
import { Entrance } from '@/components/entrance/entrance'
import { Work } from '@/components/work/work'
import { Picture } from '@/components/picture'
import { FpsMeter } from '@/components/fps-meter'

/*
  The one page, in reading order: Entrance → Work → Method → About → Questions → Contact.
  Built module by module (README #75): the entrance is M3; the sections after it are still the M2
  skeleton — every approved word and photograph, readable with no JavaScript and no design yet.
*/
export default function Home() {
  const year = new Date().getFullYear()

  return (
    <>
      <a className="skip-link" href="#main">
        {nav.skipToContent}
      </a>
      <Bar />
      <FpsMeter />

      <main id="main">
        {/* the entrance is held here while the passage turns its film into the Work's stage (work.css) */}
        <div className="e-hold">
          <Entrance />
        </div>

        <Work />

        <section id="method" aria-labelledby="method-title">
          <h2 id="method-title">02 Method</h2>
          <p>{method.thesis}</p>
          <ol>
            {method.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p>{method.close}</p>
        </section>

        <section id="about" aria-labelledby="about-title">
          <h2 id="about-title">03 About</h2>
          <Picture src={about.portrait.src} alt={about.portrait.alt} mono sizes="(min-width: 900px) 40vw, 100vw" />
          <p>{about.role}</p>
          <p>{about.greeting}</p>
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>{about.credit}</p>
        </section>

        <section id="questions" aria-labelledby="questions-title">
          <h2 id="questions-title">04 Questions</h2>
          <h3>{questions.anchor.q}</h3>
          <p>{questions.anchor.a}</p>
          {questions.rows.map((row) => (
            <details key={row.q}>
              <summary>{row.q}</summary>
              <p>{row.a}</p>
            </details>
          ))}
        </section>

        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">05 Contact</h2>
          <p>{contact.ask}</p>
          <a href={contact.message}>{contact.cta}</a>
        </section>
      </main>

      <footer className="colophon">
        <p>{contact.colophon.signature}</p>
        <nav id="index" aria-label={contact.colophon.index}>
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
        <ul>
          {contact.channels.map((c) => (
            <li key={c.label}>
              <a href={c.href}>
                {c.label} · {c.handle}
              </a>
            </li>
          ))}
        </ul>
        <p>{contact.colophon.year.replace('{year}', String(year))}</p>
      </footer>
    </>
  )
}
