import { contact, method, work } from '@content'
import { Picture } from '@/components/picture'
import { MethodClient } from './method-client'
import './method.css'

/*
  02 Method — "Made for whoever arrives" (storyboard states 7–11; README #30, #35–#39, #45, #47–#49, #93, #94).
  The studio of the visitor's hour (one prepared room per hour, its light a layer of its own), the thesis and Make it
  yours, six live screens (three on a phone), the cover of the visitor's chapter, and the light going down on
  "Made once, for one moment." This markup is the final state: with no JavaScript or with reduced motion it is read as
  it stands. data-slot elements are filled by MethodClient with the visitor's own date, time and name; the plain text
  is what is read without it.
*/
const s = method.screens

/** One template sheet: the same on every screen until the transformation lifts it (state 7). */
function Sheet() {
  return (
    <div className="m-sheet" aria-hidden="true">
      <div className="m-sk-bar">
        <span>{method.template.logo}</span>
        <span>≡</span>
      </div>
      <div className="m-sk-img" />
      <div className="m-sk-t" data-slot="template-title">
        {method.template.title}
      </div>
      <div className="m-sk-l" />
      <div className="m-sk-l m-sk-s" />
      <div className="m-sk-btn">{method.template.button}</div>
    </div>
  )
}

const SCREENS = {
  wedding: (
    <div className="m-scr s-wed">
      <div className="s-wed-ph">
        <Picture src={method.screenWedding.src} alt={method.screenWedding.alt} sizes="(min-width: 900px) 15vw, 100vw" />
        <div className="s-wed-nav" aria-hidden="true">
          {s.wedding.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
      <div className="s-wed-tx">
        <div className="s-h" data-slot="wedding-title">
          {s.wedding.plain}
        </div>
        <div className="s-wed-named" data-slot="wedding-named-line" hidden />
        <div className="s-k" data-slot="wedding-line" />
      </div>
    </div>
  ),
  rsvp: (
    <div className="m-scr s-rsvp">
      <div className="s-k">{s.rsvp.kicker}</div>
      <div className="s-h" data-slot="rsvp-title">
        {s.rsvp.title}
      </div>
      <div className="s-cd">
        {s.rsvp.units.map((u, i) => (
          <div key={u}>
            <b data-slot={`rsvp-${i}`}>00</b>
            <span>{u}</span>
          </div>
        ))}
      </div>
      <div className="s-line" data-slot="rsvp-line" />
      <div className="s-yes">{s.rsvp.yes}</div>
      <div className="s-no">{s.rsvp.no}</div>
    </div>
  ),
  portfolio: (
    <div className="m-scr s-folio">
      <div className="s-folio-top s-k">
        <span data-slot="portfolio-title">{s.portfolio.title}</span>
        <span aria-hidden="true">≡</span>
      </div>
      <div className="s-folio-i" data-slot="portfolio-initial" aria-hidden="true">
        P
      </div>
      <div className="s-folio-strip">
        {[work.chapters[1].moments[0], work.chapters[1].moments[1], work.chapters[1].moments[2]].map((m) => (
          <Picture key={m.image.src} src={m.image.src} alt="" sizes="(min-width: 900px) 7vw, 20vw" />
        ))}
      </div>
      <div className="s-k s-folio-line" data-slot="portfolio-line" />
    </div>
  ),
  exhibition: (
    <div className="m-scr s-expo">
      <Picture src={work.chapters[1].moments[1].image.src} alt="" sizes="(min-width: 900px) 15vw, 100vw" />
      <div className="s-ov">
        <div className="s-k">{s.exhibition.kicker}</div>
        <div className="s-h" data-slot="exhibition-title">
          {s.exhibition.plain}
        </div>
        <div className="s-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  ),
  event: (
    <div className="m-scr s-event">
      <Picture src={work.chapters[2].moments[0].image.src} alt="" sizes="(min-width: 900px) 12vw, 30vw" />
      <div className="s-ov">
        <div className="s-k" data-slot="event-kicker" />
        <div className="s-h" data-slot="event-title">
          {s.event.plain}
        </div>
        <div className="s-k s-dim" data-slot="event-line">
          {s.event.line}
        </div>
        <div className="s-btn">{s.event.button}</div>
      </div>
    </div>
  ),
  guide: (
    <div className="m-scr s-guide">
      <div className="s-k s-dim">{s.guide.kicker}</div>
      <div className="s-h" data-slot="guide-title">
        {s.guide.title}
      </div>
      <ol>
        {s.guide.rows.map((r, i) => (
          <li key={r} className={i === 2 ? 'now' : undefined}>
            <b data-slot="guide-time" data-offset={i - 2} />
            <span data-slot={i === 2 ? 'guide-arrives' : undefined}>{r}</span>
          </li>
        ))}
      </ol>
    </div>
  ),
} as const

// the order of the six (README #35); on a phone only three, one per chapter (Wedding website, Digital exhibition,
// On-site guide); the featured one is the chapter chosen at the entrance (#45)
const ORDER = ['wedding', 'rsvp', 'portfolio', 'exhibition', 'event', 'guide'] as const
const PHONE = new Set(['wedding', 'exhibition', 'guide'])
const CHAPTER = { wedding: 'weddings', exhibition: 'artists', guide: 'experiences' } as const

export function Method() {
  const [first, second] = method.thesis.split('. ')
  return (
    <section id="method" className="method" aria-labelledby="method-title">
      {/* where the Method really starts, for the bar: with the motion, half a screen in (its stage is held before the scene) */}
      <span className="m-start" data-starts="method" aria-hidden="true" />
      {/* the stage: held while the scene runs (method-client, the motion); at rest a plain block */}
      <div className="m-stage">
      {/* the Work's ground, under the light once it covers the screen */}
      <div className="m-night" aria-hidden="true" />
      {/* the light (README #96, #102): with the motion, one oblique edge of light crosses the screen from the hour's side and leaves
          the studio lit. Two clipping boxes, one per edge, the room inside moved back by both. At rest the wrappers are nothing */}
      <div className="m-wipe" aria-hidden="true">
        <div className="m-wipe-b">
          <div className="m-wipe-in">
            <div className="m-studio">
              <div className="m-room" />
              {/* iOS only (method.css): the room's top mirrored into the 70 px behind the Dynamic Island */}
              <div className="m-mirror" />
              <div className="m-key" />
            </div>
          </div>
        </div>
      </div>
      {/* the room's light spilling out of the moving edge onto what is still unlit, one each side (README #100) */}
      <div className="m-spill m-spill-l" aria-hidden="true" />
      <div className="m-spill m-spill-r" aria-hidden="true" />
      <h2 id="method-title" className="m-title">
        02 Method
      </h2>

      <div className="m-head">
        {/* two lines, each found by the light (README #102) */}
        <p className="m-thesis">
          <span>{first}.</span>
          <i> {second}</i>
        </p>
        <div className="m-field">
          <label htmlFor="m-name">{method.makeItYours}</label>
          <span className="m-in">
            <input id="m-name" type="text" placeholder={method.nameLabel} autoComplete="given-name" maxLength={18} spellCheck={false} />
            {/* the caret waiting in the field, with the motion only: it blinks a few seconds, then stays (README #102) */}
            <span className="m-caret" aria-hidden="true" />
          </span>
        </div>
      </div>

      <ul className="m-screens">
        {ORDER.map((k) => (
          <li
            key={k}
            className="m-card"
            data-k={k}
            data-phone={PHONE.has(k) ? '' : undefined}
            data-chapter={k in CHAPTER ? CHAPTER[k as keyof typeof CHAPTER] : undefined}
          >
            <span className="m-label">{s[k].label}</span>
            <div className="m-dev">
              {SCREENS[k]}
              {/* the cover's words, over this screen when it becomes the cover (state 10, README #96) */}
              <div className="m-cv" aria-hidden="true">
                <div className="m-cv-k" data-slot="cover-kicker">
                  {method.cover.title}
                </div>
                <div className="m-cv-h" data-slot="cover-title">
                  {method.cover.untitled}
                </div>
                <div className="m-cv-d" data-slot="cover-date" />
              </div>
            </div>
            <Sheet />
          </li>
        ))}
      </ul>

      <div className="m-cover">
        <div className="m-dev">
          <div className="m-scr m-cover-scr">
            <div className="s-k" data-slot="cover-kicker">
              {method.cover.title}
            </div>
            <div className="s-h" data-slot="cover-title">
              {method.cover.untitled}
            </div>
            <div className="m-rule" />
            <div className="m-cover-date" data-slot="cover-date" />
          </div>
        </div>
      </div>

      <div className="m-end" data-lum="0.1">
        <div className="m-dark" aria-hidden="true" />
        <p className="m-close">
          {method.close.split(', ')[0]},<i> {method.close.split(', ')[1]}</i>
          <span className="m-for" data-slot="close-for" hidden />
        </p>
        <ol className="m-steps">
          {method.steps.map((st) => (
            <li key={st}>{st}</li>
          ))}
        </ol>
        <a className="m-cta" href={contact.message} data-slot="cta">
          {contact.cta}
        </a>
      </div>
      </div>

      <MethodClient />
    </section>
  )
}
