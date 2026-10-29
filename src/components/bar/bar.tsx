import type { CSSProperties } from 'react'
import { contact, nav, sections, studio } from '@content'
import { BarClient } from './bar-client'
import './bar.css'

/*
  The bar and the menu (M4; README #56, #67, #69, #70, #71). Two islands of dark live glass: at the left the name and
  the current section (not at the top: the title is the name there, #70), at the right the time, Talk to us and Menu
  (on the phone only the button, in a circle). The menu fills the screen: a drop of the same glass that grows by
  transform from the menu island's rounded end. Server-rendered; BarClient adds the section, the time, the glass's
  darkness and lens, and the menu. Without JavaScript the bar is two links and Menu goes to the index in the colophon.
*/
export function Bar() {
  return (
    <>
      {/* the lens of each island: a displacement map shaped like it, drawn by BarClient (Chromium only; elsewhere the
          plain blur declared first stays) */}
      <svg className="bar-lenses" width="0" height="0" aria-hidden="true" focusable="false">
        {['left', 'right'].map((side) => (
          <filter
            key={side}
            id={`bar-lens-${side}`}
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1600"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              className="bar-lens-map"
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="30" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
      </svg>

      <header className="site-header bar">
        <a className="bar-isl bar-left" href="#top" data-lens="left">
          <span className="bar-name">{studio.name}</span>
          <span className="bar-sep" aria-hidden="true" />
          {/* the section under the bar, written by BarClient */}
          <span className="bar-sec" aria-live="off" />
        </a>
        <div className="bar-isl bar-right" data-lens="right">
          <span className="bar-time" aria-hidden="true" />
          <a className="bar-talk" href={contact.message}>
            {contact.cta}
          </a>
          <a className="bar-menu" href="#index" aria-label={nav.openMenu} aria-haspopup="dialog">
            <span className="bar-icon" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {/* both words hold the same cell, so the island never changes width when Menu turns into Close */}
            <span className="bar-menu-word" aria-hidden="true">
              <span>{nav.menu}</span>
              <span>{nav.close}</span>
            </span>
          </a>
        </div>
      </header>

      <dialog className="menu" aria-label={nav.menu}>
        <div className="menu-drop" aria-hidden="true">
          <div className="menu-film" />
          <div className="menu-sheen" />
        </div>
        <ol className="menu-list">
          {sections.map((s, i) => (
            <li key={s.id} style={{ '--i': i } as CSSProperties}>
              <a href={`#${s.id}`} data-section={s.id}>
                <i>{s.number}</i>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="menu-side">
          {/* "Hello, {name}." once the visitor has given a name in the Method (M6) */}
          <p className="menu-hello" hidden />
          <p className="menu-k">{contact.cta}</p>
          <a className="menu-go" href={contact.message}>
            {contact.channels[0].label}
            <span aria-hidden="true"> →</span>
          </a>
          <ul className="menu-channels">
            {contact.channels.map((c) => (
              <li key={c.label}>
                <a href={c.href}>
                  {c.label} · {c.handle}
                </a>
              </li>
            ))}
          </ul>
          <p className="menu-k menu-time" />
        </div>
      </dialog>

      <BarClient
        sections={sections}
        hello={nav.hello}
        yourTime={nav.yourTime}
        openMenu={nav.openMenu}
        closeMenu={nav.closeMenu}
      />
    </>
  )
}
