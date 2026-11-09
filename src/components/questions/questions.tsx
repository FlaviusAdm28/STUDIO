import type { CSSProperties } from 'react'
import { questions, sections, work } from '@content'
import { QuestionsClient } from './questions-client'
import './questions.css'

/*
  04 Questions — states 15–18 (storyboard; README #53). The studio's paper in the brand's stone, in full light; the anchor question as the
  title (no "Questions" label above it: the bar says where we are) with its answer and the three chapters, which lead back to the Work;
  then eight numbered questions, one answer open at a time.
  Server markup, readable as it is: with no JavaScript every answer is shown (questions.css), the buttons do nothing. The island
  (questions-client.tsx) opens one at a time and plays the entrance once.
*/
const next = sections.find((s) => s.id === 'contact')

// the anchor set as the storyboard's title page: "What do you" / "actually create?" in italic, on its own line
const title = (q: string) => {
  const cut = q.indexOf(' actually ')
  if (cut < 0) return q
  return (
    <>
      {q.slice(0, cut)}
      <br />
      <i>{q.slice(cut + 1)}</i>
    </>
  )
}

export function Questions() {
  return (
    <section id="questions" className="questions" aria-labelledby="questions-title" data-lum="0.8">
      <div className="q-paper" aria-hidden="true" />
      <div className="q-box">
        <div className="q-anchor">
          <h2 id="questions-title" className="q-title">
            {title(questions.anchor.q)}
          </h2>
          <p className="q-lead">{questions.anchor.a}</p>
          <nav className="q-chs" aria-label={work.chaptersLabel}>
            {work.chapters.map((c) => (
              <a key={c.id} href={`#${c.id}`}>
                <span>
                  <i>{c.numeral}</i>
                  {c.word}
                </span>
                <span className="q-ar" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </nav>
        </div>
        <ol className="q-list">
          {questions.rows.map((row, i) => (
            <li key={row.q} className="q-row" style={{ '--i': i } as CSSProperties}>
              <h3 className="q-h">
                <button type="button" className="q-btn" aria-expanded="false" aria-controls={`q-a-${i + 1}`} id={`q-b-${i + 1}`}>
                  <span className="q-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="q-q">{row.q}</span>
                  <span className="q-pm" aria-hidden="true" />
                </button>
              </h3>
              <div className="q-ans" id={`q-a-${i + 1}`} role="region" aria-labelledby={`q-b-${i + 1}`}>
                <div>
                  <p>{row.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        {next && (
          <a className="q-next" href={`#${next.id}`}>
            {next.number} {next.label} <span aria-hidden="true">↓</span>
          </a>
        )}
      </div>
      <QuestionsClient />
    </section>
  )
}
