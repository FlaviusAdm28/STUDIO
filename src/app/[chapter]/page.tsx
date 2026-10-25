import Link from 'next/link'
import { notFound } from 'next/navigation'
import { chapters, ui } from '@content'
import { ContactBlock, SiteFooter, SiteHeader } from '@/components/site'

/*
  **Placeholder, M1 only.** The chapter pages are M2 (Weddings) and M4 (Artists, Experiences). This
  exists so the homepage's links lead somewhere honest during review instead of a 404.
*/
export const dynamicParams = false

export function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.id }))
}

export const metadata = { robots: { index: false } }

export default async function ChapterPlaceholder({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: id } = await params
  const chapter = chapters.find((c) => c.id === id)
  if (!chapter) notFound()

  return (
    <div className="page">
      <SiteHeader indexHref="/#contents" />
      <main id="main" className="placeholder">
        <div className="wrap">
          <p className="numeral entry-numeral" aria-hidden="true">
            {chapter.numeral}
          </p>
          <h1 className="entry-title">{chapter.word}</h1>
          <p className="entry-line">{chapter.line}</p>
          <p className="label">{ui.inPreparation}</p>
          <p>
            <Link href="/#contents" className="entry-link">
              <span aria-hidden="true">← </span>
              {ui.backToIndex}
            </Link>
          </p>
        </div>
      </main>
      <ContactBlock />
      <SiteFooter />
    </div>
  )
}
