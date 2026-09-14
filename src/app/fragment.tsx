'use client'

import { useState } from 'react'
import { site } from '@content'

/**
 * **The Work surface, and it is the aside's — never the environment.**
 *
 * `final-design-spec.pdf` §11.1, the locked Environment contract, is explicit about what this element is
 * not allowed to be: *"no second surface, no iframe, no additional media element… A work surface that
 * replaces the environment — or an environment paused, hidden or re-sourced to make room for it —
 * breaks the law and the 08 → 09 lift together."*
 *
 * So it is not the ground of Chapter III any more. State 09 is *the film* — the continuous environment
 * at the venice plate, brought to true exposure — and the live work exists only inside §6's reversible
 * aside, **above** an environment that keeps running beneath it and is never unmounted, including while
 * this is open. `implementation-map.md`'s *State 09, and what is not in this list* is the whole of it.
 *
 * ## What that changes, and what it does not
 *
 * It mounts when Work is opened and unmounts when Work is closed — `ledger.tsx` renders it only while
 * the aside is out, which is what makes both of those true without a line of code here. The prefetch
 * that used to watch for Chapter III approaching went with the change: nothing is fetched until the
 * visitor asks, which is what `05-storyboard.md` §8 asked for in the first place and what the act's own
 * *press before anything is loaded* rule always said.
 *
 * What has not changed is the contract with the project. `site.three.work.fragment` is a URL and that is
 * all of it: the project supplies a route that fills whatever frame it is given, composes for it, never
 * scrolls, carries no navigation and no controls, and is silent. No postMessage, no handshake, no shared
 * vocabulary, nothing in either repository that names the other. `decisions.md` §49 and §53.
 *
 * ## It is material, not a document
 *
 * `pointer-events: none` in `globals.css`, throughout, and that is the whole of the nested-scroll
 * answer. The fragment has nothing to press and nothing to scroll, so a finger on it reaches the panel
 * underneath. The way out of the aside is the aside's own — the scrim, the back word, and Escape — and
 * none of them can be swallowed by a cross-origin frame that cannot receive a press.
 */
export default function WorkFragment() {
  const work = site.three.work

  /** Whether it has painted. Drives one fade, and nothing else reads it. */
  const [arrived, setArrived] = useState(false)

  if (work.fragment === null) return null

  return (
    /*
      `data-work` rather than a second piece of state: the fade is a property of the surface, and the
      surface is what the stylesheet reads. One transition, on the load event, and its only job is that
      the frame is never seen to fill in — `story.afterTheFilm.work.arrives`.
    */
    <div className="register-work" data-work={arrived ? 'here' : 'coming'}>
      <iframe
        className="register-frame"
        src={work.fragment}
        title={work.title}
        onLoad={() => setArrived(true)}
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}
