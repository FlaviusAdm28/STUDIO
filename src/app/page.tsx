import { nav } from '@content'
import { Bar } from '@/components/bar/bar'
import { Entrance } from '@/components/entrance/entrance'
import { Work } from '@/components/work/work'
import { Method } from '@/components/method/method'
import { About } from '@/components/about/about'
import { Questions } from '@/components/questions/questions'
import { Contact } from '@/components/contact/contact'
import { FpsMeter } from '@/components/fps-meter'

/*
  The one page, in reading order: Entrance → Work → Method → About → Questions → Contact.
  Built module by module (README #75), each section its own component; the colophon closes the Contact (contact.tsx).
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

        <Method />

        <About />

        <Questions />

        <Contact year={year} />
      </main>
    </>
  )
}
