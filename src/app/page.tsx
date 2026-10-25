import { ui } from '@content'
import { Develop } from '@/components/client/develop'
import { Chapters, Opening, QuestionList, StudioSection } from '@/components/home'
import { ContactBlock, SiteFooter, SiteHeader } from '@/components/site'

export default function Home() {
  return (
    <div className="page">
      <a className="skip-link" href="#main">
        {ui.skipToContent}
      </a>
      <SiteHeader indexHref="#contents" />
      <main id="main">
        <Opening />
        <Chapters />
        <StudioSection />
        <QuestionList />
        <ContactBlock />
      </main>
      <SiteFooter />
      <Develop />
    </div>
  )
}
