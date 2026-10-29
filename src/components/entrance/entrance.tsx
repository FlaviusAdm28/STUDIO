import type { CSSProperties } from 'react'
import { entrance, work } from '@content'
import { tuning } from '@content/tuning'
import { Picture } from '@/components/picture'
import { entranceSequence, type EntranceConfig } from './sequence'
import './entrance.css'

const config: EntranceConfig = {
  welcomeBack: entrance.welcomeBack,
  wide: entrance.video.wide,
  tall: entrance.video.tall,
  lettersAt: tuning.entranceLettersAtMs,
  zoomAt: tuning.entranceZoomAtMs,
  finalAt: tuning.entranceFinalAtMs,
  settle: 1600,
}

/*
  The entrance (E1–E4). The HTML is the final state — the film's poster, the title, the subtitle and the
  three blades as links — so it reads with no JavaScript. The veil (CHAPTER ONE cut out of charcoal) and
  the cover only show while the sequence runs; sequence.ts drives it. The dedication and the film's
  source are filled in by that script (the visitor's own time; one request for the screen's shape).
*/
export function Entrance() {
  const chapters = Object.fromEntries(work.chapters.map((c) => [c.id, c]))

  return (
    <section id="top" className="entrance" aria-labelledby="entrance-title">
      <div className="e-film" aria-hidden="true">
        <picture>
          <source media="(orientation: portrait)" type="image/avif" srcSet={`${entrance.video.posterTall}-720.avif`} />
          <source media="(orientation: portrait)" srcSet={`${entrance.video.posterTall}-720.jpg`} />
          <source
            type="image/avif"
            srcSet={`${entrance.video.posterWide}-960.avif 960w, ${entrance.video.posterWide}-1920.avif 1920w`}
            sizes="100vw"
          />
          <img
            src={`${entrance.video.posterWide}-1920.jpg`}
            srcSet={`${entrance.video.posterWide}-960.jpg 960w, ${entrance.video.posterWide}-1920.jpg 1920w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
          />
        </picture>
        <video className="e-video" playsInline loop muted preload="none" suppressHydrationWarning />
        <div className="e-tint" />
      </div>

      <div className="e-zoom" aria-hidden="true">
        <svg className="e-veil" aria-hidden="true" focusable="false">
          <defs>
            <mask id="e-letters">
              <rect width="100%" height="100%" fill="#fff" />
              <text className="wide" x="50%" y="56%" textAnchor="middle" fill="#000">
                CHAPTER ONE
              </text>
              <text className="tall" textAnchor="middle" fill="#000">
                <tspan x="50%" y="50%">
                  CHAPTER
                </tspan>
                <tspan x="50%" y="59.23%">
                  ONE
                </tspan>
              </text>
              {/* where .e-o draws the O sharper, the veil has a hole (placed by sequence.ts through CSS) */}
              <rect className="e-o-hole" fill="#000" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#1e1d1a" mask="url(#e-letters)" />
        </svg>
        {/* the O's window as a small layer of its own, built by sequence.ts: see entrance.css */}
        <div className="e-o" dangerouslySetInnerHTML={{ __html: '' }} suppressHydrationWarning />
      </div>
      <div className="e-cover" aria-hidden="true" />

      {/* filled by sequence.ts before hydration; React does not hydrate an element's inner HTML */}
      <p className="e-ded" dangerouslySetInnerHTML={{ __html: '' }} suppressHydrationWarning />

      <div className="e-final">
        <div className="e-head">
          <h1 id="entrance-title" className="e-title">
            <span>CHAPTER</span> <span>ONE</span>
          </h1>
          <p className="e-sub">{entrance.subtitle}</p>
        </div>
        <ul className="e-blades">
          {entrance.blades.map((b, i) => {
            const chapter = chapters[b.chapter]
            return (
              <li
                key={b.chapter}
                className="e-blade"
                style={
                  {
                    '--i': i,
                    '--fy': b.frame.y,
                    '--fy-tall': b.frame.yTall,
                    '--fz': b.frame.zoom,
                    '--fx': b.frame.shift,
                  } as CSSProperties
                }
              >
                <a href={`#${b.chapter}`} data-chapter={b.chapter}>
                  <span className="e-blade-shape">
                    <Picture src={b.image} mono={b.mono} alt="" sizes="(orientation: portrait) 84vw, 22vw" />
                  </span>
                  <span className="e-blade-name">
                    <i>{chapter.numeral}</i> {chapter.word}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `(${entranceSequence.toString()})(${JSON.stringify(config)})`,
        }}
      />
    </section>
  )
}
