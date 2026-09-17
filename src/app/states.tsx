import { site } from '@content'
import WorkExperiences from './work-experiences'

/**
 * **The V2 state layer — states 01 to 09.**
 *
 * One presentation layer for the first nine of V2's fourteen states, composed from
 * `final-design-spec.pdf` §2, §3 and §5 and the storyboard's own frames. It is the film: the V1 cards,
 * the V1 travelling word, the V1 four-occasion composition, the V1 dawn and the V1 Chapter III act are
 * all gone from the tree rather than layered under. `CLAUDE.md`'s revamp principle.
 *
 * ## It is fixed, and it is a sibling of the runways
 *
 * States 01–05 are priced on the film's runway and 09 on the act's, so a layer living inside either
 * could not reach the other. V2 is one continuous film rather than two pinned frames with a seam
 * between them, so the frame is fixed to the viewport — like the Environment it stands on — and the
 * runways below are what they always really were: **distance**.
 *
 * ## It has no state, no clock and no position of its own
 *
 * Every element is placed by `globals.css` and driven by the two properties the driver already
 * publishes: **`--junction` and `--junction-at`**, C4's own output. The stylesheet turns those into one
 * `0 → 1` per junction (`--jp1` … `--jp9`) with a single `clamp()`, so a survivor crosses its whole
 * junction as a pure function of `p` and nothing here holds a second progression model.
 *
 * The one thing that is *not* scroll is Chapter I's arrival, which C8 leaves on a clock because nothing
 * has been caused yet. `opening.tsx` owns that clock and publishes `data-beat`; this renders the frame
 * that clock reveals.
 *
 * ## The ground is the Environment from state 06
 *
 * §2's law 3: *grounds change by grade on one photograph.* States 01–05 are lit by this layer's own
 * scrim, because C5 starts the Environment's exposure at state 06 on purpose. From 06 the ground is the
 * **venice plate itself** — graded .13 · .09 · .19 · 1.00 and panned 20% at state 08 by
 * `motion/environment.ts`, which has been able to do all of that since C5 and was simply painted over.
 * This layer's scrim clears into it, so *the black acquires a photograph* rather than brightening.
 *
 * ## The survivors are single nodes
 *
 * §1's second law: *each junction carries exactly one element across and repurposes it; the survivor is
 * never re-created.* **Chapter** is one element from the 96px hero title to the 11px Chapter II lockup;
 * the numeral **II** is one element from x756 to x560; and the word **chapter** in state 06's sentence
 * is the same node that becomes the Chapter III lockup — in place, with no travel, which is exactly
 * what §3 contrasts against the diagonal at 01 → 02.
 */
export default function States() {


  return (
    /*
      `aria-hidden` throughout, and that is not an oversight. This is the film — the same words are read
      by the document beneath it, in the publication, at reading size. A screen reader that announced
      the frames would be reading the site twice and neither time in order.
    */
    <div className="v2" aria-hidden="true">
      {/*
        ── The light, states 01 → 05 ────────────────────────────────────────────────────────────────
        §2's exposure column — `.50 · .35 · .10 · warm dark · warm dark` — as a solid grade carrying the
        column and the storyboard's own two gradients at their authored strength on top. That is what a
        `brightness()` under a gradient actually is; one alpha standing in for both left the hero at
        nearly full brightness. All three clear into the Environment across the tail of junction 05 → 06.
      */}
      <div className="v2-grade" />
      <div className="v2-scrim" />
      <div className="v2-scrim-flat" />

      {/*
        §2's own ground at 04 and 05 — `#060605` then `#050504` — over a negative that *continues beneath
        at −6*, which is what lets 04 → 05 be the hold it is specified as. The ember is state 04's own
        (68% / 32%) and carries through the hold.
      */}
      <div className="v2-dark">
        <div className="v2-ember" />
      </div>

      {/* §2 state 06: *warm source upper right*, over the venice plate as it arrives. */}
      <div className="v2-warm" />


      {/*
        **The rail's grade.** A burn along the frame's long axis, not a rectangle and not a panel: the
        index arrives over the Grand Canal at true exposure, and the sun's specular track on the water is
        the brightest thing in the photograph. Without this the last two destinations are legible only
        because this particular crop is dark beneath them.

        It is inside `.v2` on purpose — the film's own layer fades it out at junction 09 with everything
        else cinematic, so the publication's rail reads its ink off the page rather than off a grade that
        outlived the film.

        **It is a direct child of `.v2`, and it must come BEFORE `.v2-work`.** Both halves of that were
        found in Chrome. Moving it inside the Work gated it on that section's own opacity, and the grade
        serves the **rail**, which arrives a junction earlier at state 08. Moving it after the Work put
        the burn over the Work's own label and category and washed them out.

        Here it is above every ground — the Environment holds all four plates and sits below `.v2`
        entirely — and below every piece of type. Which is exactly what a burn between a photograph and
        the words on it should be.
      */}
      <div className="v2-rail-grade" />

      {/*
        ── State 09 · the Work ──────────────────────────────────────────────────────────────────────

        **The photograph the film ends on is the Work's first experience, so nothing is swapped to get
        here.** §11.1's boundary is kept exactly: state 09 *is* the environment at the venice plate
        brought to true exposure, and the section arrives by writing type onto it rather than by
        replacing it.

        Two blocks with two different jobs, and the difference between them is the whole composition:

          the editorial block    label → queue → category. Left margin, at the height the narrative
                                 stood at, so the eye does not travel to find it.
          the identification     who and what the photograph is, and the way into it. Lower right,
                                 small, discreet — a caption on a picture, not a title over it.

        `WorkExperiences` is a client component because the queue holds a clock (`TIMING.work.queue`), and
        it owns the second experience's plate for the same reason. Everything else here is static.
      */}
      <div className="v2-work">
        <WorkExperiences />
      </div>

      {/*
        ── State 01 · the time, embedded in the plate ───────────────────────────────────────────────
        §2: *30px / .12em, right 104 / top 196, blend layer plus a 12% floor, read once at mount.* Two
        nodes on one box: `overlay` so the photograph's grain passes through the letterforms, and a flat
        12% floor beneath it so the line survives a dark passage without becoming a caption laid on top.

        The group carries the scroll and each child carries only the clock — they multiply by nesting,
        the same construction `environment.tsx` uses for `data-lit` against `--env-hero`. The clocked
        arrival wants a transition; the scroll-driven departure must never have one.
      */}
      <div className="v2-hero">
        <p className="v2-time">
          <span className="v2-time-blend" data-time />
          <span className="v2-time-floor" data-time />
        </p>
        {/*
          **The release rides a child, and the arrival stays on the element.** `globals.css` holds one
          invariant for this layer — *"only the clocked arrivals transition; nothing driven by scroll
          does"* — and these two carry the opening's own 1.6s fade. Multiplying the junction's release
          into that opacity would have pushed a scroll value through a transition: measured, the three
          crawled 0.682 → 0.672 across the whole junction and forward no longer matched reverse.

          So the two clocks are put on two elements and multiply, which is the construction `.v2-time`
          already uses and `.v2-word` documents: the paragraph keeps the arrival, the span carries the
          release, and neither has to know about the other.
        */}
        <p className="v2-sub">
          <span className="v2-leaves">{site.openingLine}</span>
        </p>
        <p className="v2-of">
          <span className="v2-leaves">{site.chapterOf}</span>
        </p>
      </div>

      {/*
        ── State 01 · the title, and the survivor inside it ─────────────────────────────────────────
        §2: *96px serif at x196, baseline y462.* §3's 01 → 02 is **displace**: *"'One' releases,
        'Chapter' holds and the numeral II takes its place."*

        Release is **in place**, so the survivor leaves the flow line rather than dragging the released
        word with it: the ghost holds the width it used to occupy so `One` stays on the board's
        coordinate and fades where it stands. The travel is the storyboard's *only diagonal*.
      */}
      <p className="v2-title">
        <span className="v2-ghost">{site.two.marker.word}</span>{' '}
        <span className="v2-one">One</span>
      </p>

      {/*
        **The survivor is a sibling of the title, not a child of it — and that is a coordinate decision.**

        It used to live inside `.v2-title`, positioned against the title's own origin and carried to the
        lockup by a `transform`. A transform cannot state a percentage of the *frame*, so its landing had
        to be written in `vw` while every anchor around it is a percentage of `.v2` — and the two bases
        differ by the scrollbar, which is why the lockup drifted off the frame's centre. As a sibling the
        survivor's `left` and `top` are percentages of the same box every other anchor is, so the landing
        can be *derived* (the centred group) instead of guessed. It is still one element, and it still
        stands exactly on the ghost at state 01.

        **It carries two renderings of itself, and that is what a register change is.**

        §1: the survivor is *repurposed*, never re-created. §5 sets the hero's statement in Cormorant and
        every chapter lockup in Schibsted micro-caps — so the word has to arrive as one and land as the
        other. Neither `font-family` nor `text-transform` interpolates.

        So the one node holds both faces of itself and **exchanges them at a single point**, mid-flight,
        where the two are set to the same width. A cross-fade is what read as a duplicated *Chapter*:
        two faces of different widths, both half-lit, for a sixth of the junction. One position, one
        size, one tracking — only the ink changes, which is precisely the thing that changes when a name
        becomes a chapter mark.
      */}
      <span className="v2-word">
        <span className="v2-word-serif">{site.two.marker.word}</span>
        <span className="v2-word-mark">{site.two.marker.word}</span>
      </span>

      {/*
        ── States 02 and 03 · the numeral, the axis, and the label that inherits it ─────────────────
        §2: *numeral origin x756*, then *"Philosophy" rests on x756; II travels 196px to x560.* §2 records
        the survivor of 02 → 03 as **the coordinate itself** rather than as a word, which is why the label
        lands on 756 in the same movement that takes the numeral off it. One gesture, not two.

        The numeral's own place at state 02 is not authored here either: it is the second half of the
        centred `Chapter II` lockup, so it is derived from the survivor's landing in `globals.css`. It
        lands within a pixel and a half of §2's x756 — which is the board telling us the lockup was
        always meant to sit on the frame's centre.
      */}
      <span className="v2-numeral">{site.two.marker.numeral}</span>
      <span className="v2-topic">{site.two.marker.topic}</span>

      {/*
        ── State 04 · the thesis ────────────────────────────────────────────────────────────────────
        §2: *64px serif at x196, centred vertically.* Junction 03 → 04 is **expand**, survivor *the
        label*: the tracking opens to 1.9em as the label becomes the sentence that defines it.
      */}
      <p className="v2-thesis">
        {site.two.statement.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      {/*
        ── State 05 · the stack ─────────────────────────────────────────────────────────────────────
        §2, locked: *stack on one optical centre: 46px / 100%, 31px / 34%, 22px / 12%.* Three occasions,
        one centre, three slots. §2 forbids the rest in as many words — no lateral entry, no depth
        scaling, no horizontal spreading, no per-occasion x offset — so there is no `left` here but 50%
        and no transform but the vertical one. Each arrival displaces the one before it upward and the
        displaced ones remain as residue, which is what junction 05 → 06 then writes over.
      */}
      <div className="v2-stack">
        {site.two.occasions.map((line, i) => (
          <p className="v2-occasion" key={line} data-occasion={i + 1}>
            {line}
          </p>
        ))}
      </div>

      {/*
        ── Junctions 06 → 08 · the photograph, and nothing written on it ────────────────────────────

        **There is no type in this stretch at all — C13, 7 September 2026, design owner.**

        Three things stood here across four passes and all three are removed rather than reworked:

          `Some moments deserve another chapter.`   the sentence, as a centred line and then a column
          `chapter`                                 the survivor it resolved onto, held alone
          `Studio`                                  the name that arrived after the breath

        The narrative ends on `A memory.` (junction 05). What follows it is the photograph holding on
        its own, the camera opening the composition, and the rail being written in the field the camera
        opens — and then the same photograph takes on its second job as the Work's first experience.
        The image and the reframe do the work the sentence was doing in words.

        **Do not reintroduce any of the three, and do not invent a fourth thing to stand here.** If a
        document asks for one, it predates `implementation-reconciliation.md` C13.
      */}


      {/*
        ── The exposure dip · junction 05 → 06 ────────────────────────────────────────────────────
        Above the film INCLUDING its type, because an exposure change is what it is and anything less
        is a scrim over the picture. Outside `.v2` the Ledger is untouched — the room dims, the
        navigation does not.

        Driven by `--v2-dip`, which the driver publishes from `story.ts` §10 `atmosphere.dip`.
      */}
      <div className="v2-dip" />
    </div>
  )
}
