import type { CSSProperties, ReactNode } from 'react'
import { sections, work } from '@content'
import { tuning } from '@content/tuning'
import { Picture } from '@/components/picture'
import { WorkClient } from './work-client'
import './work.css'

/*
  The Work (M5; storyboard states 3–6; README #40, #43, #44, #60–#63, #73). One stage held while the page scrolls
  through three steps: the scroll changes the chapter, time changes the moment, and each moment shows its piece at work
  over the whole photograph. The HTML is complete without JavaScript: the three chapters one after another, every moment
  and every piece with its line. WorkClient makes it the stage (data-js on <html>, set before the first paint).
*/

const D = work.demos
const img = (chapter: number, moment: number) => work.chapters[chapter].moments[moment].image.src
// the small photographs inside the demonstrations: decorative, the smallest width
// the guests' photographs: six of the photographer's own, none of them the chapter's three (owner, 29 Oct)
const galleryTiles = [1, 2, 3, 4, 5, 6].map((i) => `/media/v5/work/weddings-guests-${i}`)
const Tile = ({ src, style }: { src: string; style?: CSSProperties }) => (
  <i style={style}>
    <Picture src={src} alt="" sizes="120px" />
  </i>
)

/**
 * The nine demonstrations, keyed by chapter and moment (README #43; the richer pieces chosen on 29 Oct). Each enters in
 * reading order once its moment shows the piece (WorkClient puts .on on it) and is reset at once when it leaves.
 * data-slot elements are filled by WorkClient with the visitor's own date, time and name.
 */
const demos: Record<string, ReactNode> = {
  // Before — the wedding website as its countdown: how long until the day, large over the sky, the date, the reply
  '0-0': (
    <>
      <div className="dm-pimg">
        <Picture src={img(0, 0)} alt="" sizes="(min-width: 900px) 28vw, 66vw" />
      </div>
      <div className="dm-veil dm-sky" />
      <div className="dm-cd">
        <div className="dm-k dm-e1" data-slot="website-title">
          {D.website.title}
        </div>
        <div className="dm-nums dm-e2">
          {D.website.units.map((u, i) => (
            <div key={u}>
              <b data-slot={`countdown-${i}`}>00</b>
              <span>{u}</span>
            </div>
          ))}
        </div>
        <div className="dm-date dm-e3" data-slot="wedding-date" />
      </div>
      <div className="dm-foot dm-e4">
        <span className="dm-pill dm-glass" data-lens="0">
          {D.website.reply}
        </span>
      </div>
    </>
  ),
  // On the day — the live gallery: the photographs arrive one by one, the count rising with them
  '0-1': (
    <>
      <div className="dm-veil dm-dark" />
      <div className="dm-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <Tile key={i} src={galleryTiles[i]} style={{ transitionDelay: `${(0.3 + i * 0.32).toFixed(2)}s` }} />
        ))}
      </div>
      <div className="dm-cap">
        <div className="dm-k">{D.gallery.label}</div>
        <div className="dm-count">
          {D.gallery.count.split('{n}')[0]}
          <span data-slot="gallery-count">0</span>
          {D.gallery.count.split('{n}')[1]}
        </div>
        <div className="dm-small" data-slot="gallery-newest" />
      </div>
    </>
  ),
  // After — one year on: the date a year later, three photographs kept, the way in
  '0-2': (
    <>
      <div className="dm-veil" />
      <div className="dm-yo dm-e1">
        <div className="dm-k">{D.yearOn.label}</div>
        <div className="dm-big" data-slot="year-on" />
        <div className="dm-ln" data-slot="year-on-line">
          {D.yearOn.line}
        </div>
      </div>
      <div className="dm-keep dm-e3">
        {[img(0, 0), img(0, 1), '/media/v5/method/screen-wedding'].map((src) => (
          <Tile key={src} src={src} />
        ))}
      </div>
      <div className="dm-foot dm-e4">
        <span className="dm-pill">{D.yearOn.open}</span>
      </div>
    </>
  ),
  // Always — the portfolio: the artist's own site, the kinds of work, the works with their titles and years
  '1-0': (
    <>
      <div className="dm-veil dm-darker" />
      <div className="dm-head dm-e1">
        <span className="dm-title" data-slot="portfolio-title">
          {D.portfolio.title}
        </span>
        <span className="dm-k">{D.portfolio.info}</span>
      </div>
      <div className="dm-filters dm-e2">
        {D.portfolio.filters.map((f, i) => (
          <span key={f} className={i === 0 ? 'on' : undefined}>
            {f}
          </span>
        ))}
      </div>
      <div className="dm-works">
        {[img(1, 0), img(1, 2), img(1, 1)].map((src, i) => (
          <div key={i} style={{ transitionDelay: `${(0.75 + i * 0.25).toFixed(2)}s` }}>
            <Tile src={src} />
            <span>
              {D.portfolio.works[i]}, <span data-slot="year" data-back={i < 2 ? 0 : 1} />
            </span>
          </div>
        ))}
      </div>
    </>
  ),
  // For a moment — the digital exhibition: walking into the room, the wall label of the work in front of you
  '1-1': (
    <>
      <div className="dm-zimg">
        <Picture src={img(1, 1)} alt="" sizes="(min-width: 900px) 28vw, 66vw" />
      </div>
      <div className="dm-veil dm-room" />
      <div className="dm-head dm-e1">
        <span className="dm-k">{D.exhibition.room}</span>
        <span className="dm-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="dm-open dm-e2" data-slot="open-since" />
      <div className="dm-label dm-e4 dm-glass" data-lens="1">
        <span className="dm-k">{D.exhibition.number}</span>
        <span className="dm-title">{D.exhibition.title}</span>
        <span>
          {D.exhibition.medium} · <span data-slot="year" data-back={0} />
        </span>
      </div>
    </>
  ),
  // On record — the archive of works: a catalogue that grows
  '1-2': (
    <>
      <div className="dm-veil dm-darker" />
      <div className="dm-head dm-e1">
        <span className="dm-title">{D.archive.title}</span>
        <span className="dm-k">{D.archive.count}</span>
      </div>
      <div className="dm-arc">
        {[img(1, 0), img(1, 1), img(1, 2), img(1, 0)].map((src, i) => (
          <div key={i} style={{ transitionDelay: `${(0.5 + i * 0.22).toFixed(2)}s` }}>
            <b>{String(i + 1).padStart(3, '0')}</b>
            <Tile src={src} />
            <span>
              {D.archive.works[i][0]}
              <em>
                <span data-slot="year" data-back={i} /> · {D.archive.works[i][1]}
              </em>
            </span>
          </div>
        ))}
      </div>
      <div className="dm-search dm-e6">
        <span>{D.archive.search}</span>
        <span aria-hidden="true">⌕</span>
      </div>
    </>
  ),
  // Before — the invitation & RSVP: the card rises, Accept is chosen and becomes the guest's confirmation
  '2-0': (
    <>
      <div className="dm-still">
        <Picture src={img(2, 0)} alt="" sizes="(min-width: 900px) 28vw, 66vw" />
      </div>
      <div className="dm-veil" />
      <div className="dm-card dm-glass" data-lens="2">
        <div className="dm-k" data-slot="invitation-kicker">
          {D.invitation.kicker}
        </div>
        <div className="dm-h">{D.invitation.title}</div>
        <div className="dm-dt" data-slot="long-date" />
        <div className="dm-small">{D.invitation.where}</div>
        <div className="dm-reply">
          <span className="dm-accept">{D.invitation.accept}</span>
          <span className="dm-accepted">{D.invitation.accepted} ✓</span>
        </div>
      </div>
    </>
  ),
  // During — the on-site guide: what is on now, what comes next and when, and where
  '2-1': (
    <>
      <div className="dm-veil dm-night" />
      <div className="dm-gh dm-e1" data-slot="guide-title">
        {D.guide.title}
      </div>
      <div className="dm-now dm-e2">
        <span className="dm-k">
          {D.guide.now} · <span data-slot="time" />
        </span>
        <span className="dm-title">{D.guide.nowItem}</span>
      </div>
      <div className="dm-next dm-e3">
        <span className="dm-k">{D.guide.next}</span>
        <span className="dm-title">{D.guide.nextItem}</span>
        <span className="dm-small">{D.guide.nextWhere}</span>
      </div>
      <div className="dm-prog dm-e4">
        {D.guide.programme.map((item, i) => (
          <div key={item} className={i === 1 ? 'now' : undefined}>
            <b data-slot="guide-time" data-offset={i - 1} />
            {item}
          </div>
        ))}
      </div>
    </>
  ),
  // After — the thank-you page: the thanks, a strip of the evening's photographs, the way to all of them
  '2-2': (
    <>
      <div className="dm-veil dm-dark" />
      <div className="dm-ty dm-e1">
        <div className="dm-big" data-slot="thanks">
          {D.thanks.title}
        </div>
        <div className="dm-ln">{D.thanks.line}</div>
      </div>
      <div className="dm-strip">
        {[img(2, 1), img(2, 2), img(2, 0), img(2, 1)].map((src, i) => (
          <Tile key={i} src={src} />
        ))}
      </div>
      <div className="dm-foot dm-e4">
        <span className="dm-pill">
          {D.thanks.link} <span aria-hidden="true">→</span>
        </span>
      </div>
    </>
  ),
}

export function Work() {
  const title = sections[0]
  return (
    <section id="work" className="work" aria-labelledby="work-title">
      {/* the lens of each piece of glass, drawn by WorkClient (Chromium only; elsewhere the plain blur stays) */}
      <svg className="w-lenses" width="0" height="0" aria-hidden="true" focusable="false">
        {[0, 1, 2].map((k) => (
          <filter
            key={k}
            id={`dm-lens-${k}`}
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1000"
            height="1000"
            colorInterpolationFilters="sRGB"
          >
            <feImage className="w-lens-map" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="30" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
      </svg>
      <h2 id="work-title" className="visually-hidden">
        {title.number} {title.label}
      </h2>
      {/* three steps of scroll, one per chapter: the stage is held while they pass (WorkClient) */}
      <div className="w-steps" aria-hidden="true">
        <span className="w-pass" />
        {work.chapters.map((c, i) => (
          <span key={c.id} className="w-step" data-c={c.id} data-starts={i === 0 ? 'work' : undefined} />
        ))}
      </div>
      <div className="w-stage">
        {work.chapters.map((c, ci) => (
          <article
            key={c.id}
            id={c.id}
            className="w-ch"
            data-c={c.id}
            aria-labelledby={`${c.id}-title`}
            style={{ '--ci': ci } as CSSProperties}
          >
            <div className="w-ground" aria-hidden="true" />
            <div className="w-stack">
              {/* the photograph's own atmosphere (#40): its tiny blurred copy, pre-made, stretched and masked */}
              {c.moments.map((m, j) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`a${j}`}
                  className="w-aura"
                  data-j={j}
                  src={`${m.image.src}-aura.jpg`}
                  alt=""
                  aria-hidden="true"
                />
              ))}
              {c.moments.map((m, j) => (
                <div key={`p${j}`} className="w-ph" data-j={j}>
                  <Picture src={m.image.src} alt={m.image.alt} sizes="(min-width: 900px) 28vw, 66vw" />
                </div>
              ))}
              {c.moments.map((m, j) => (
                <div key={`d${j}`} className="w-dm" data-j={j} aria-hidden="true">
                  {demos[`${ci}-${j}`]}
                </div>
              ))}
            </div>
            <div className="w-tx">
              {/* the title is the chapters' navigation (#62): this chapter large, the others small */}
              <nav className="w-nav" aria-label={work.chaptersLabel}>
                {[ci, ...[0, 1, 2].filter((k) => k !== ci)].map((k) => {
                  const o = work.chapters[k]
                  return (
                    <a
                      key={o.id}
                      id={k === ci ? `${c.id}-title` : undefined}
                      className="w-nav-ch"
                      href={`#${o.id}`}
                      data-k={k}
                      data-role={k === ci ? 'current' : k === (ci + 1) % 3 ? 'next' : 'other'}
                      aria-current={k === ci ? 'true' : undefined}
                    >
                      <span className="w-num">{o.numeral}</span> {o.word}
                    </a>
                  )
                })}
              </nav>
              {/* the moments: time moves them; choosing one holds it (#43; the way to stop the rotation, WCAG 2.2.2) */}
              <div className="w-moments">
                {c.moments.map((m, j) => (
                  <button key={m.moment} type="button" className="w-mom" data-j={j} aria-pressed="false">
                    <span className="w-w">{m.moment}</span>
                    <span className="w-wf" aria-hidden="true">
                      {m.moment}
                    </span>
                  </button>
                ))}
              </div>
              {c.moments.map((m, j) => (
                <section key={m.moment} className="w-mo" data-j={j} aria-label={`${c.word} · ${m.moment}`}>
                  <h3 className="w-mo-h">{m.moment}</h3>
                  <ul className="w-list">
                    {m.pieces.map((p, k) => (
                      <li key={p.name} className="w-li" data-k={k}>
                        <div className="w-top">
                          <span className="w-nm">
                            {k === 0 && <i className="w-g" aria-hidden="true" />}
                            {p.name}
                          </span>
                          {k === 0 && <span className="w-on">{work.onThePhotograph}</span>}
                        </div>
                        <p className="w-ln">{p.line}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <p className="w-foot">{work.footer}</p>
            </div>
          </article>
        ))}
      </div>
      <WorkClient
        moment={tuning.momentSeconds}
        photo={tuning.momentPhotoSeconds}
        demos={D}
        chapters={work.chapters.map((c) => c.id)}
      />
    </section>
  )
}
