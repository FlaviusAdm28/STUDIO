'use client'

import { useEffect } from 'react'
import {
  ACT_BEATS,
  BEATS,
  DESTINATIONS,
  METHOD_BEATS,
  PRECISION,
  actTrack,
  aperture,
  assertJunctions,
  assertNarrative,
  assertReachable,
  assertSegments,
  clamp01,
  depthOf,
  atmosphere,
  environmentValues,
  type Leaving,
  rise,
  TIMING,
  input,
  junctionAt,
  occasionsStory,
  junctionSpans,
  methodEntrance,
  methodPlayed,
  methodSpans,
  methodTrack,
  narrativePositions,
  persistSpans,
  persistTrack,
  relightTrack,
  smoothstep,
  stateOf,
  track,
  type JunctionSpan,
} from '@/motion'

/**
 * The shot, timed in scroll rather than seconds.
 *
 * Scroll position is the only input. The footage keeps looping underneath, never paused, never
 * sought, its own timeline given no say in anything — all this decides is how much of it is
 * still lit.
 *
 * This file is the driver and nothing else. It converts scroll position into beats, walks the
 * track, and writes what it is told; it holds no timings, no easing and no opinion about what any
 * value means. The shot itself — every beat, every hold, every range, and the reasoning behind
 * each of them — is `src/motion/story.ts`. To change the choreography, edit that; nothing here
 * needs to be touched to add, remove or retime a cue.
 *
 * Every value is a pure function of scroll position, so the shot runs backwards exactly as it
 * runs forwards, and stopping anywhere holds that frame.
 *
 * ## Where the shot begins
 *
 * Not at scroll position zero — at wherever the page happens to be when the opening finishes.
 *
 * The opening is mandatory, so scrolling during it must hurry it rather than arrive underneath it.
 * That means the shot cannot be a function of raw `scrollY`: somebody who flicks hard on arrival
 * would otherwise be a full viewport into Chapter II before the timestamp had appeared, which is
 * exactly the bug this exists to prevent.
 *
 * So the shot is a function of `scrollY - origin`, and `origin` is fixed at the first frame after
 * `data-opening` reads `done`. Three consequences, all of them wanted:
 *
 *   - Nothing is frozen and nothing is swallowed. The page scrolls normally throughout; the shot
 *     simply is not listening yet.
 *   - There is no jump at the handover. `origin` is taken *at* that moment, so the shot starts at
 *     exactly its first frame however far the visitor had scrolled, and their next gesture carries
 *     straight on into Chapter II.
 *   - The shot keeps its full runway. `--origin` is added to the pinned height, so however far the
 *     visitor scrolled during the opening there is always a whole shot's worth of scrolling left
 *     below them — and they can never reach the bottom while the opening is still running. It is also
 *     where the page below the film begins, which is why it is written *exactly* the moment the origin
 *     stops moving; see `anchor`.
 *
 * The cost is a stretch of scroll above the shot that does nothing, for a visitor who scrolled a
 * long way during the opening and then scrolls back up. What they find there is the hero, held at
 * its first frame, which is a frame worth looking at.
 */
/**
 * **How far a played beat of the method has travelled**, as a linear 0 → 1 the caller then eases.
 *
 * Speed rather than duration is what is constant: `ms` is what a *whole* 0 → 1 costs, so a beat that
 * was reversed at 0.6 takes 0.6 of it to come back. Without that, a reversal halfway would take as
 * long as a full arrival and the page would feel like it was resisting the hand.
 *
 * `ms` of zero is the reduced-motion answer and lands on the target immediately — which is why there
 * is no branch for it anywhere else. `TIMING.method.play`.
 */
const progressOf = (
  latch: { open: boolean; since: number; from: number },
  now: number,
  ms: number,
): number => {
  const target = latch.open ? 1 : 0
  const distance = Math.abs(target - latch.from)
  const span = ms * distance
  if (span <= 0) return target
  const k = Math.min(1, Math.max(0, (now - latch.since) / span))
  return latch.from + (target - latch.from) * k
}

export default function ScrollStage() {
  useEffect(() => {
    const root = document.documentElement

    /**
     * Written values, remembered.
     *
     * Setting a custom property on the root invalidates style for the whole document, and this
     * writes eighteen of them. That was free while the page was three elements deep; once Chapter
     * III existed it became eighteen full style recalculations per frame on a large tree, and the
     * main thread stopped keeping up.
     *
     * Almost nothing changes between one frame and the next, and past the end of the shot nothing
     * changes at all — so comparing first and writing only on a real change takes the usual cost
     * from eighteen invalidations a frame to none.
     */
    const written = new Map<string, string>()

    /*
      How many viewport heights of scrolling one beat costs, taken from `--pin` so the pinned
      height and the timeline can never disagree. Change `pin` in the motion module and the whole
      shot compresses or opens out with it, in proportion, without a single beat being touched.

      Re-read rather than captured once: `--pin` is longer for touch pointers, and a tablet that
      gets rotated or a window dragged between screens can cross that boundary while the page is
      open. A stale value would leave the timeline and the pinned height disagreeing, which is the
      one way this can visibly break.
    */
    let perBeat = 1
    let perActBeat = 1
    let perMethodBeat = 1
    const price = () => {
      const read = (name: string) => parseFloat(getComputedStyle(root).getPropertyValue(name))
      const pin = read('--pin')
      perBeat = (Number.isFinite(pin) ? pin / 100 : BEATS) / BEATS
      const actPin = read('--act-pin')
      perActBeat = (Number.isFinite(actPin) ? actPin / 100 : ACT_BEATS) / ACT_BEATS
      const methodPin = read('--method-pin')
      perMethodBeat = (Number.isFinite(methodPin) ? methodPin / 100 : METHOD_BEATS) / METHOD_BEATS
    }
    price()

    /**
     * Where Chapter III's act begins, in pixels down the document.
     *
     * The act is the second pinned frame, and its beats are measured from the moment its own top edge
     * reaches the top of the viewport — not from the shot's origin, because its length is decided by
     * what it has to say rather than by anything in the film.
     *
     * Measured rather than derived, for the same reason the word's travel is: the answer depends on
     * `--pin`, `--origin` and the reach-back all at once, and the rendered layout already knows it.
     * Cached rather than read every frame — a `getBoundingClientRect` in the scroll loop forces a
     * synchronous layout of the whole document, which is the cost this driver was rewritten to avoid.
     * It can only move when the viewport changes or when `--origin` is written, and both say so.
     */
    let actTop = Number.POSITIVE_INFINITY

    /**
     * Where the method's frame begins, and **where its values are written**.
     *
     * The method is the third held frame and the only one outside the film. Its beats are measured from the
     * moment its own frame is stuck under the head margin, which is `.method`'s top less the sticky offset —
     * `.method` is measured rather than the stage, because a stuck element's rect no longer reports where it
     * came from, and a resize while the section is stuck would read the sticky offset back as its position.
     *
     * **Its properties are written on the section rather than on the root.** Setting a custom property
     * on `:root` invalidates style for the whole document; these are read by nothing outside this section, so
     * writing them here keeps a frame of the method's own choreography from re-resolving the film, the
     * publication and a cross-origin iframe along with it. The rest of the driver still writes to the root,
     * because the shot's properties are read in both the film and Chapter III. `decisions.md` §55.
     *
     * **On `.method` rather than on `.method-stage`, and that moved with §56.** The room is the section's
     * ground now, and the ground is painted by the outer box — it has to be, because the band above the frame
     * and the strip beneath the head margin are both outside the stage and both go dark. A custom property
     * inherits *down*, so a value written on the stage cannot be read by its own parent. One element up costs
     * nothing and the whole section can see them.
     */
    let methodTop = Number.POSITIVE_INFINITY
    let methodEl: HTMLElement | null = null

    /**
     * **Where each of V2's states that is an ordinary section begins.**
     *
     * States 10, 13 and 14 are not on a runway — they are pages in flow, so there is no beat to resolve
     * and nothing to price. They are measured instead, and the element says which state it is with
     * `data-state`: the mapping belongs in the markup, not in a selector table down here. This file
     * still holds no opinion about what any state means.
     *
     * A page begins when its top reaches the head margin, which is the same distance `scroll-margin-top`
     * already declares for it — read from the rendered box rather than written down a second time.
     */
    let flowTops = new Map<number, number>()

    /**
     * **Where the Questions list stops travelling**, as a document scroll position.
     *
     * `.asked` is `position: sticky` under the head margin, so on the approach it is carried up the
     * screen by ordinary page scroll and only stands once its top reaches that margin. Everything in
     * Questions is inside it, so anything revealed before this point is revealed **on the move** —
     * measured at 1920 × 889, the anchor was uncovered at y 800 and travelled 700px to the y 99 it
     * keeps, with `transform: none` on every element the whole way.
     *
     * So the section's three moments are authored as offsets from here rather than from its top.
     * `TIMING.questions.anchor.afterLock` records the reasoning; this is the measurement.
     *
     * **Measured the way the method's lock is measured, and for the same reason**: from the box that
     * is *not* stuck. A stuck element's rect reports its sticky offset rather than where it came from
     * — the trap `decisions.md` §55 records — so the frame gives the position and the list gives only
     * the offset it stands at.
     */
    let askedLock = Number.POSITIVE_INFINITY

    /**
     * **Junction 13 → 14, measured.** Where the persistent rule stands in the document, and where the
     * publication's own properties are written.
     *
     * The junction is not a runway and has no `pin`: C8 prices it from `persisting.total × SECONDS_TO_VH`
     * and nothing else, so there is no authored length here to disagree with. What is measured is one
     * thing — where the survivor stands — because everything else is derived from it.
     *
     * The reference line is V2's own: §8 puts the rule at `y529` of a 760-high frame, so the junction
     * opens when the rule reaches `529 / 760` of the viewport. That ratio is the spec's, not a guess,
     * and it is the only geometry this prototype takes from the 1440 × 760 frame — C7 owns the rest.
     *
     * Written on `.publication` rather than on `:root`, for the reason the method's are: nothing outside
     * this half of the page reads them, and a root write invalidates style for the whole document.
     */
    let persistTop = Number.POSITIVE_INFINITY
    let publicationEl: HTMLElement | null = null

    /**
     * **§8's sheet, for the two things outside `.publication` that have to read it.**
     *
     * The Environment and the publication's own ground are one exchange at this junction — the
     * photograph, the scrim over it, the ink on the outgoing plate and the light all move together
     * or they are four layers — and the sheet that describes it is the persist track, not `p`. This
     * is where the frame's answer is kept between the block that resolves it and the blocks that
     * read it, which run later in the same frame.
     *
     * `null` everywhere the junction is not crossing, so nothing downstream has to know it exists.
     */
    let persistAt = 0
    let leaving: Leaving | null = null
    /**
     * **Whether Contact has been asked for**, and it is the one latch in the junction. The persist
     * track is a pure function of position; this is not, on purpose — it is the trigger of
     * TRIGGER → PLAY → HOLD, with a gap between where it fires and where it lets go
     * (`persistSpans.asks` and `persistSpans.empty.from`), so a hand resting near the threshold
     * cannot flicker the composition on and off.
     */
    let contactAsked = false
    /*
      **The hero footage is not held here any more** — 26 September 2026. C22's found frame (seek,
      slow motion, stop) is retired: Contact's footage runs at its own speed, and the only thing that
      slows it is a hand on *Tell us where it begins.*, which `contact-listen.tsx` owns.

      What is left is one cue on the file (`TIMING.contact.arrives`): the footage is taken to its first
      shot at the instant the plates begin to cross, when it is still invisible, so the passage ends on
      the film's own dissolve. `footageArmed` is whether that cue is still to be given on this pass.
    */
    let footageArmed = true
    /**
     * **Whether the list has been told to let go** — the one latch of Questions' release. Set past
     * `persistSpans.lets`, cleared back above half of it, so a hand resting on the threshold cannot
     * flicker the list.
     */
    let listReleased = false
    /**
     * **The passage 13 → 14, played** — fourth review, 26 September 2026. `passageOn` is whether the
     * scroll has started it; `passageAt` is how far the sheet has got, in its own 0 → 1, advanced by the
     * clock at `1 / persisting.total` a second and run back at `1 / persisting.rewinds` when the hand
     * goes back above the junction. `passageLast` is the clock of the last frame that moved it.
     */
    let passageOn = false
    let passageAt = 0
    let passageLast = 0
    /** Where the passage last looked, so a jump (a rail link, a reload) can be told from scrolling. */
    let passageY = Number.NaN
    /**
     * **Whether an in-page link has just been pressed** — navigation QA, 27 September 2026. Distance
     * alone could not tell the rail from a hand: *Questions → Contact* is 2,549px at 1920 × 889, under
     * the three viewports the passage takes as a jump, so the rail's *Contact* played ~2.5s of empty
     * passage under a rail already saying CONTACT, and *Questions* played the rewind under the list.
     * The press says it outright. Set by the click, spent by the first frame after it.
     */
    let navigated = false
    /**
     * **Whether the Method's room has stood empty long enough for Questions to begin** — fourth review:
     * *"depois existe um verdadeiro hold da sala vazia; só depois Questions começa."* Set by the Method's
     * leaving, read by the Questions anchor's trigger.
     */
    let methodRested = true
    /**
     * **Whether the Method has left the room**, and the scroll position it was last decided at. A latch
     * rather than `m >= leaves`, because the two directions release it at different places — see where
     * it is set.
     */
    let methodOut = false
    let methodY = Number.NaN


    /*
      **The dock measures nothing — C13, 7 September 2026.**

       /  stood the sentence's column so its surviving word sat on the frame's
      centre, and `dockMeasured` latched them once. There is no sentence and no survivor: the gesture
      is the camera, the light and the rail, and none of those is a function of where a box happens
      to be. `place()` reads no boxes for it at all.
    */


    /* Set whenever layout moves, so the narrative order is re-checked once and not every frame. */
    let audit = true

    /**
     * **The thirteen junctions, on `p`.** Re-resolved once per measurement rather than per frame: both
     * of a junction's endpoints are state positions, and only `place()` can move one.
     */
    let junctionsOnP: readonly JunctionSpan[] = []

    const place = () => {
      audit = true
      flowTops = new Map(
        Array.from(document.querySelectorAll<HTMLElement>('[data-state]'), (el) => {
          const head = parseFloat(getComputedStyle(el).scrollMarginTop)
          return [
            Number(el.dataset.state),
            el.getBoundingClientRect().top + window.scrollY - (Number.isFinite(head) ? head : 0),
          ] as const
        }),
      )


      /*
        **Nothing about the dock is measured any more — C13, 7 September 2026.**

        `[data-title-ghost]`, `[data-title-num]`, `.v2-three-line`, the pair's travel and the column's
        anchor were all read here. Every one of them served a movement — a survivor travelling to a
        card, a numeral migrating to the rail, a deck being drawn, a line being re-centred, a column
        being stood on its survivor — and **none of those movements exists.** The gesture is the camera,
        the light and the rail.
      */

      /*
        The reading zone's lock. `top` on the list is `var(--masthead)` while it is sticky and `auto`
        where the narrow breakpoints put it back in ordinary flow — there is no lock on a phone, and
        the stylesheet says why: *space to read through rather than space to stand still in*. The
        fallback is the section's own head margin, which is the distance `flowTops` already subtracts,
        so the beats still fire as the composition reaches the top of the frame rather than at an
        arbitrary place.
      */
      const askedFrame = document.querySelector<HTMLElement>('[data-asked-frame]')
      const askedList = document.querySelector<HTMLElement>('[data-asked-list]')
      if (askedFrame === null || askedList === null) {
        askedLock = Number.POSITIVE_INFINITY
      } else {
        /*
          **Only a list that stands has a lock at the head margin.** Chrome reports the specified `top`
          even under `position: static`, so the branch above never fell back on a phone: the lock stayed
          at the head margin, which for a list in ordinary flow is the moment it leaves. Where the list
          is not sticky the lock is where it enters the frame — `TIMING.questions.flowLock` argues it.
        */
        /*
          The list's own height, for the phone's hold: below 700px the list stands at whichever is lower
          of the head margin and the height that keeps its foot on screen (`globals.css`, `--asked-top`),
          and only the rendered box knows how tall it is. Written before `top` is read below, so the lock
          is measured against the value it produces.
        */
        root.style.setProperty('--asked-h', `${askedList.offsetHeight}px`)
        const listStandsAt = getComputedStyle(askedList).position === 'sticky'
        const stuck = parseFloat(getComputedStyle(askedList).top)
        const head = !listStandsAt
          ? window.innerHeight * TIMING.questions.flowLock
          : Number.isFinite(stuck)
            ? stuck
            : parseFloat(getComputedStyle(askedFrame).scrollMarginTop) || 0
        askedLock = askedFrame.getBoundingClientRect().top + window.scrollY - head
      }

      publicationEl = document.querySelector<HTMLElement>('[data-junction-host]')
      /*
        **Measured from the section and the frame's own offset, never from the survivor's rect.**

        This used to read the rule's own box: `rule.rect.top + scrollY − vh × 529/760`. The rule lives
        inside `.closing-frame`, which is `position: sticky` — so once the frame was stuck the rect
        reported the held offset and `persistTop` came back one whole `--rule-y` further down the
        document. Measured at 1610 × 832: 30560 when the page was measured at the top, 31361 when it was
        measured at the foot — and 31361 *is* the last scrollable pixel, so `j` below stayed at 0 for the
        entire junction and Contact never composed. The headline, the writing line, the three terms and
        the colophon were all still at `--jhead`/`--jtell`/`--jres1..4` = 0 with the visitor standing at
        the end of the site, looking at a rule on an empty plate.

        It is the identical trap the method already records, and the answer is the method's: **read the
        distance from the section, and the offset from the frame's computed `top`.** Neither is affected
        by the frame being stuck. It also stops `529 / 760` being written down here a second time —
        `--rule-y` owns that ratio in `globals.css`, and this now reads whatever it resolved to.
      */
      const closingEl = document.querySelector<HTMLElement>('[data-segment="closing"]')
      const closingFrame = closingEl?.querySelector<HTMLElement>('[data-segment-frame]') ?? null
      persistTop =
        closingEl === null || closingFrame === null
          ? Number.POSITIVE_INFINITY
          : closingEl.getBoundingClientRect().top +
            window.scrollY -
            parseFloat(getComputedStyle(closingFrame).top)

      /*
        **Whether the rail's *Questions* may land past the lock** — navigation QA, 28 September 2026.
        `--asked-lands` puts the press where the FAQ sequence fires, but the passage 13 → 14 starts
        `persisting.startsBefore` above `persistTop`, and on a short reading zone that comes first:
        measured at 390 × 844 the lock was 27006, the passage 27151 and the landing 27295, so the jump
        arrived with the passage at its end — CONTACT on the rail and neither composition on screen.
        Where the FAQ point does not fit before the passage, the press lands on the lock itself — the
        landing that was measured correct there before `--asked-lands` existed. Landing just short of
        the passage instead was tried: at 390 the list is not sticky, and 143px past the lock its first
        question stands under the rail. `--asked-fits` is 1 or 0; `globals.css` multiplies by it.

        **And only where the list stands.** Past the lock the list holds still only while it is sticky;
        where it is not (≤ 700px, or a short landscape frame) every pixel past the lock carries the anchor
        up under the rail — measured at 320 × 760, the question landed at y −72. There the lock is the
        landing whatever the room.
      */
      const passageStarts = persistTop - TIMING.environment.persisting.startsBefore * window.innerHeight
      const faqLands = askedLock + TIMING.questions.faq.afterLock * window.innerHeight + 2
      const listStands = askedList !== null && getComputedStyle(askedList).position === 'sticky'
      root.style.setProperty(
        '--asked-fits',
        Number.isFinite(askedLock) && Number.isFinite(persistTop) && (faqLands >= passageStarts || !listStands)
          ? '0'
          : '1',
      )

      const stage = document.querySelector<HTMLElement>('[data-segment="act"]')
      actTop = stage === null ? Number.POSITIVE_INFINITY : stage.getBoundingClientRect().top + window.scrollY

      methodEl = document.querySelector<HTMLElement>('[data-segment="method"]')
      const frame = methodEl === null ? null : methodEl.querySelector<HTMLElement>('[data-segment-frame]')
      if (methodEl === null || frame === null) {
        methodTop = Number.POSITIVE_INFINITY
        return
      }
      /*
        Where the frame locks: the section's own top, plus the band the room arrives in, less the head margin
        the frame is stuck under. Both distances are read from the rendered box rather than from a copy of the
        number — `globals.css` owns `--room-edge` and the sticky offset, and neither is written down twice.

        The padding is read from `.method` and the offset from the stage, and **neither is affected by the
        stage being stuck**, which the stage's own rect is. That is the trap `decisions.md` §55 records and
        the reason the section is measured rather than the frame.
      */
      const band = parseFloat(getComputedStyle(methodEl).paddingTop)
      const held = parseFloat(getComputedStyle(frame).top)
      methodTop =
        methodEl.getBoundingClientRect().top +
        window.scrollY +
        (Number.isFinite(band) ? band : 0) -
        (Number.isFinite(held) ? held : 0)
    }
    place()


    /*
      **The travelling word's two surveys are gone.** They measured `.mark` against `.mark-anchor` and
      `.card-marker` against its own rewritten line, and published `--mx` / `--my` / `--ms` / `--mk` for a
      V1 composition that no longer exists: V2 carries the word from the hero title to the Chapter II
      lockup on `--jp1`, and the register change at 06 → 07 happens in place. Nothing in the stylesheet
      reads those four properties any more, and the elements they measured are not in the tree.
    */

    let frame = 0

    /*
      ── §7 · THE INPUT LAYER ─────────────────────────────────────────────────────────────────────────
      **A wheel notch moves the page by its full 100px in one frame.** Measured by dispatching real
      wheel events through the input pipeline and recording every wheel event, scroll event and
      animation frame: one frame moves 100px, every other frame moves exactly zero, and it is identical
      with smooth scrolling forced on. The film was never stepped — it was being sampled at 100px
      intervals, which on junction 05 is 3.6% of the whole junction in a single frame.

      So the driver renders from `shown`, which follows the real position as a **critically damped
      second-order system**. Exponential smoothing is the obvious choice and it is wrong: its velocity
      is (target − shown)/tau, so a 100px target jump makes velocity leap from zero — a step in velocity
      at the start of every notch. A second-order system answers with a step in *acceleration*, so
      position stays C¹, it never overshoots, retargeting mid-flight is continuous by construction, and
      reversal decelerates through zero instead of snapping.

      The step below is the **exact** analytic solution — x(t) = (c1 + c2·t)e^-wt with c1 = d0 and
      c2 = v0 + w·d0 — not an Euler integration, so it is stable at any frame duration. That matters:
      the first frame after an idle period can be long and an Euler spring explodes there.

      **It bends purity, by a bounded amount.** Scroll-driven state is a pure function of position; this
      makes the *path between* positions a function of history. It converges and snaps exactly, so every
      resting frame is unchanged and only the transit is smoothed.

      Every number is in `story.ts` §7.
    */
    let shown = window.scrollY
    let velocity = 0
    let last = 0

    /**
     * **Where a played beat of the method has got to.** `TIMING.method.play` argues the model.
     *
     *   `open`   which way it is going — triggered, or reversed back out
     *   `since`  when it last changed direction
     *   `from`   the progress it had at that moment, so a reversal halfway comes back from halfway
     *
     * It is deliberately not a *has fired* flag: nothing is remembered across crossings, which is what
     * keeps coming back up the page the same film backwards.
     */
    const played = new Map<string, { open: boolean; since: number; from: number }>()

    /** Converge exactly. After this, `shown` is `window.scrollY` to the bit. */
    const settle = () => {
      shown = window.scrollY
      velocity = 0
    }

    /** One spring step. Returns whether it is still in flight. */
    const advance = (now: number): boolean => {
      const target = window.scrollY
      const d0 = shown - target
      /*
        Above this it is not a wheel gesture — a scrollbar track-click, Home/End, or a restored
        position — and springing a thousand pixels reads as the page catching up.
      */
      if (Math.abs(d0) > input.snapAbove) {
        settle()
        return false
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      /*
        w stiffens continuously with the lag, so a nudge is answered calmly and a spin firmly and the
        page can never feel like it is ignoring the hand. Continuous in the lag, so it adds no
        discontinuity of its own.
      */
      const w = input.omega * (1 + Math.min(input.stiffenMax, Math.abs(d0) / input.stiffenAt))
      const decay = Math.exp(-w * dt)
      const c2 = velocity + w * d0
      shown = target + (d0 + c2 * dt) * decay
      velocity = (velocity - c2 * w * dt) * decay
      if (Math.abs(shown - target) < input.settleWithin && Math.abs(velocity) < input.settleBelow) {
        settle()
        return false
      }
      return true
    }

    /*
      Inertia is motion, so somebody who has asked for less of it does not get a spring. `calm` is read
      live rather than captured, because the setting can change while the page is open.
    */
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')

    /*
      ── §9/§10 published, once ───────────────────────────────────────────────────────────────────────
      The junction 05 → 06 windows and the dip, straight out of `story.ts`, as custom properties the
      stylesheet reads. They never change, so they are written at mount and never again — the driver
      writes no choreography constant per frame.

      This is what makes the central configuration *consumed* rather than merely present: the numbers
      the sentence and the stack are timed by are the ones in §9 and §10, and editing them there is
      what moves them here.
    */
    {
      const window5 = (w: readonly number[]) => [w[0], Math.max(1e-6, w[1] - w[0])] as const
      const [releaseAt, releaseOver] = window5([
        occasionsStory.release.first[0],
        occasionsStory.release.second[1],
      ])
      const [deconAt, deconOver] = window5(occasionsStory.deconstruction.window)
      const [someAt, someOver] = window5(occasionsStory.sentence.window)
      const [fallAt, fallOver] = window5(atmosphere.dip.fall)
      const [riseAt, riseOver] = window5(atmosphere.dip.rise)
      /*
        The ground handover — when the film's own scrim clears into the venice plate. It was a
        literal in `globals.css` (`--v2-handover: (jp5 − 0.75) / 0.25`) and is `atmosphere.groundSwap`
        now, so the beat that bridges `A memory.` and the sentence is authored where every other beat
        is. C12, 7 September 2026.
      */
      const [swapAt, swapOver] = window5(atmosphere.groundSwap)
      const constants: ReadonlyArray<readonly [string, number]> = [
        ['--q5-release-at', releaseAt],
        ['--q5-release-over', releaseOver],
        ['--q5-decon-at', deconAt],
        ['--q5-decon-over', deconOver],
        ['--q5-some-at', someAt],
        ['--q5-some-over', someOver],
        ['--q5-dip-fall-at', fallAt],
        ['--q5-dip-fall-over', fallOver],
        ['--q5-dip-rise-at', riseAt],
        ['--q5-dip-rise-over', riseOver],
        ['--q5-dip-depth', atmosphere.dip.depth],
        ['--q5-swap-at', swapAt],
        ['--q5-swap-over', swapOver],

        /*
          §arriving — how a publication state writes itself. One set of windows shared by states 10 to
          14, so the second half of the site has one grammar rather than five.
        */
        ['--arr-empty', TIMING.arriving.empty],
        ['--arr-stmt-at', TIMING.arriving.statement[0]],
        ['--arr-stmt-over', TIMING.arriving.statement[1] - TIMING.arriving.statement[0]],
        ['--arr-supp-at', TIMING.arriving.support[0]],
        ['--arr-supp-over', TIMING.arriving.support[1] - TIMING.arriving.support[0]],
        ['--arr-detail-at', TIMING.arriving.detail[0]],
        ['--arr-detail-over', TIMING.arriving.detail[1] - TIMING.arriving.detail[0]],
        ['--arr-stagger', TIMING.arriving.stagger],
        ['--arr-track', TIMING.arriving.track],
        ['--arr-rise', TIMING.arriving.rise],
      ]
      for (const [name, value] of constants) root.style.setProperty(name, String(value))
    }

    /**
     * Where the shot starts, in pixels. `null` until the opening has finished.
     *
     * Taken lazily, on the first frame after the opening is done, rather than tracked and frozen. That
     * is what makes the handover exact: whatever the visitor did while the opening ran, the shot's
     * first frame is the frame they are looking at when it ends.
     */
    let origin: number | null = null

    /**
     * Where the visitor was the last time the shot looked, while the opening was still running.
     *
     * The origin is taken from **this** rather than from the scroll position that happens to be
     * current when the opening is found to be over, and the difference is not pedantry. Nothing calls
     * `read` between frames, so the first read after the opening ends is whatever event woke it — and
     * if that event is an anchor jump to Chapter III, taking the origin there would put the shot's
     * first frame under the visitor's feet and move Chapter III a whole film further down. Measured:
     * a click on the hero's `Studio` in the last second of the opening left the page at 4066 with the
     * origin set to 4065 and the chapter at 8131, having gone nowhere.
     *
     * Zero unless somebody scrolled, which is the case this exists to keep exact.
     */
    let held = 0

    /*
      Written whenever it changes, and added to the pinned height in CSS. While the opening runs this
      follows the visitor down the page, so there is always a full shot's worth of scrolling beneath
      them — they cannot reach the bottom and find the shot with no room left to play in.

      **While it is still moving** it is rounded up to whole viewports rather than tracked to the pixel.
      This is the one value in the system that changes the document's *height*, so writing it costs a
      layout of the whole page rather than a paint — and the moment it would be written most often is a
      hard flick during the opening, which is the worst possible moment to be relaying out. Rounding up
      keeps the guarantee (the value is always at least the scroll position, so there is always a full
      `--pin` beneath) while relaying out once per viewport travelled instead of once per frame.

      **Once the shot's origin is fixed it is written exactly**, and that matters rather than being
      tidiness. The rounded value can exceed the real origin by nearly a viewport, and the film's height
      is where the page below it starts — so anything positioned against a beat of the shot would be that
      far out for a visitor who scrolled during the opening. Chapter III's overlap is exactly that, and
      a hand-driven replay found it: the shot's origin was 1111px and `--origin` said 1974px, which put
      the chapter 87vh lower than the beat it is placed against and handed the dead moment straight back.

      Exact is also *more* correct about the guarantee, not less: at `scrollY === origin` there is then
      precisely one `--pin` left beneath. Rounding was only ever a way to avoid relaying out on a value
      that changed every frame, and this one has stopped changing.
    */
    const anchor = (px: number, exact = false) => {
      const vh = window.innerHeight
      const next = `${exact ? px : Math.ceil(px / vh) * vh}px`
      if (written.get('--origin') === next) return
      written.set('--origin', next)
      root.style.setProperty('--origin', next)
      /*
        `--origin` is the one value that changes the document's height, so it is also the one thing
        that can move the act. Re-measuring here rather than every frame is what keeps the layout it
        costs rare: at most once per viewport travelled during the opening, and once when the origin
        is finally fixed.
      */
      place()
    }

    const read = (stamp?: number) => {
      frame = 0
      /* Real time, for the method's played beats. `now` further down is the film's state index. */
      const clock = stamp ?? window.performance.now()
      /* Set by the method's played beats while any of them is in transit; it keeps the loop alive. */
      let playing = false

      /*
        In flight only when the frame came from `requestAnimationFrame`. Every other caller — the
        opening's release, a restored page, a resize — wants the frame to be exact rather than eased,
        and gets it by snapping first.
      */
      const flying = typeof stamp === 'number' && !calm.matches ? advance(stamp) : (settle(), false)
      const y = shown

      /*
        The opening is mandatory. Until it is over the shot holds its first frame — the page still
        scrolls, and `opening.tsx` turns that scrolling into a faster opening instead.

        Scroll is measured in viewport heights, then in beats, so the shot is the same on any screen.
      */
      let s = 0
      if (root.dataset.opening === 'running') {
        origin = null
        held = y
        anchor(y)
      } else {
        if (origin === null) {
          origin = held
          anchor(held, true)
        } else if (y < origin) {
          /*
            Scrolling back up above where the shot began, which only happens to somebody who scrolled a
            long way during the opening. The origin follows them, so the stretch of scroll that did
            nothing collapses behind them instead of being there for good.

            Free of visual consequence by construction: above the origin the shot is already at its
            first frame, so moving the origin cannot change a single value. All it changes is how far
            they have to scroll to get back to Chapter II — from "however far I flicked" to "not at
            all", which is the answer they would expect.
          */
          origin = y
          anchor(y, true)
        }
        s = Math.max(0, y - origin) / window.innerHeight / perBeat
      }

      /*
        ── One continuous narrative position ────────────────────────────────────────────────────────
        **`p` is the whole film, states 01 → 14, in one scalar.** It is measured in beats of the shot
        because that is the unit the sequence was composed in, and it spans everything: there is no
        second origin anywhere in this file any more.

        What is left of the three runways is not three positions but **three views of one**. The act and
        the method are still priced differently on purpose — a beat of the method costs less than a beat
        of the film, because the publication is not cinema — so each keeps an *offset* on `p` and a
        *scale*, and its local beat number is `(p − offset) × scale`.

        That is the same arithmetic the driver did before, and it produces the same numbers to the last
        decimal: `(p − actAt) × perBeat/perActBeat` expands to `(y − actTop) / vh / perActBeat`, which is
        exactly what the previous line said. **C4 changed where a position comes from, never what it
        is.**

        Why it matters: a value can now be a function of `p` across any boundary. `aperture` is the proof
        — it used to be three properties added together in the stylesheet because neither runway could
        see the other, and it is now one number computed in one place.
      */
      const p = s
      const vhNow = window.innerHeight
      const actAt = origin === null ? Number.POSITIVE_INFINITY : (actTop - origin) / vhNow / perBeat
      const methodAt =
        origin === null ? Number.POSITIVE_INFINITY : (methodTop - origin) / vhNow / perBeat

      /* The act's view of `p`. Clamped at zero: before its offset the segment simply has not begun. */
      const a = Math.max(0, (p - actAt) * (perBeat / perActBeat))

      /*
        **The aperture, and the weld that is gone.** One survivor crossing what used to be a runway
        boundary, written as one property. `globals.css` no longer adds two stages together and
        `--frame-mark` no longer exists — see `scroll.ts`'s `aperture`.
      */
      {
        const next = aperture(p, a).toFixed(PRECISION)
        if (written.get('--aperture') !== next) {
          written.set('--aperture', next)
          root.style.setProperty('--aperture', next)
        }
      }

      for (const [source, at] of [
        [s, track],
        [a, actTrack],
      ] as const) {
        for (const [name, value] of at) {
          const next = value(source).toFixed(PRECISION)
          if (written.get(name) === next) continue
          written.set(name, next)
          root.style.setProperty(name, next)
        }
      }

      /*
        **How much of the method's room is standing**, and the publication's own ground reads it below.
        Zero everywhere else, which is what makes the composition at `--page-ink` a no-op outside this
        one section. `globals.css` composes the identical product as `--mroom` for the section's own
        colours; this is the same number, hoisted so the grounds block can see it.
      */
      let methodRoom = 0

      /*
        The method, on its own runway and written on its own element. Three positions, one hand: each is a
        pure function of `scrollY`, so the joins hold no state and reversing through them is the same
        arithmetic backwards.
      */
      /**
       * **One beat of TRIGGER → PLAY → HOLD, written wherever it belongs.**
       *
       * `open` is the trigger and it is the only thing scroll decides; `seconds` is what a whole 0 → 1
       * costs; `delay` staggers a row inside a moment that fired as one. `TIMING.method.play` argues
       * the model and records that it is a departure from C8.
       *
       * Reduced motion is answered by the duration being zero, which lands on the target the frame the
       * beat fires — so there is no branch for it anywhere else.
       */
      const play = (
        el: HTMLElement,
        name: string,
        open: boolean,
        seconds: number,
        delay: number,
        /**
         * What letting go costs, when it is not what arriving costs. Contact's composition arrives over
         * seconds and releases in half of one (`TIMING.contact.composes.releases`); everything else
         * leaves this out and lets go at its own speed.
         */
        out: number = seconds,
      ): number => {
        const msOf = (opening: boolean) => (calm.matches ? 0 : (opening ? seconds : out) * 1000)
        const ms = msOf(open)
        const latch = played.get(name)
        if (latch === undefined || latch.open !== open) {
          /*
            Retarget from wherever it actually is, not from 0 or 1 — a beat reversed halfway must come
            back from halfway, or the reversal is a jump of exactly the size this exists to remove. The
            stagger applies on the way in only: a composition lets go all at once.

            Where it actually is is measured at the speed it was *going*, not the speed it is about to
            go — the two differ when `out` is given, and reading the old direction at the new speed
            would put the value somewhere it never was.
          */
          const at =
            latch === undefined ? (open ? 1 : 0) : progressOf(latch, clock, msOf(latch.open))
          played.set(name, {
            open,
            since: clock + (open && !calm.matches ? delay * 1000 : 0),
            from: at,
          })
        }
        const state = played.get(name)
        if (state === undefined) return 0
        const p01 = progressOf(state, clock, ms)
        /*
          **It is playing while it is not yet where it is going**, and not merely while it is strictly
          between 0 and 1. On the frame a beat is triggered its progress is exactly 0, so the looser
          test reported *at rest* and the loop stopped on the frame it had just started.
        */
        if (p01 !== (state.open ? 1 : 0)) playing = true
        const next = smoothstep(p01).toFixed(PRECISION)
        if (written.get(name) === next) return p01
        written.set(name, next)
        el.style.setProperty(name, next)
        return p01
      }

      if (methodEl !== null) {
        const vh = window.innerHeight
        /*
          The method's view of `p` — same construction as the act's, a different price.

          **It is not clamped at zero, where the act's is** — design owner, 19 September 2026. The
          studio's question has to *"começar a aparecer logo no início do Method, aproveitando o mesmo
          território visual de atenção que vinha do texto grande do About"*, and the only honest way to
          say that in this file's own unit is a negative beat: `composed.ask` opens at −0.24, which is a
          position on the approach, a quarter of a beat above the section's own top.

          Nothing else moves, because `rise` and `ramp` both clamp their input to their own range: a span
          authored at or after zero reads exactly as it did. What the clamp was protecting against was a
          track that ran before its section, and the track now decides that per entry instead of having
          it decided for all of them.
        */
        const m = (p - methodAt) * (perBeat / perMethodBeat)

        /*
          **The room arriving, and it is the one value in the driver that is not a beat.**

          Everything else here is a position on a runway divided by what a beat of that runway costs. This is
          a position on the *approach* to the runway — the stretch between the section's box entering the
          viewport and its frame locking under the head margin — and that stretch is a layout distance rather
          than a priced one. It is the same length whatever `--method-pin` says, and `--method-pin` is half as
          long again for a thumb, so the identical movement would be 2.2 beats on a wheel and 1.4 on a thumb.
          Measured in viewport heights it is one movement on both. `story.methodArrival`.

          Written whatever happens, including from far above, because it is a pure function of scroll position
          like everything else: at the top of the page it is 0, which is paper, which is correct.

          `globals.css` composes it with `--mreturn` into `--mroom`, exactly as it adds the aperture's two
          halves — so neither end of the transition has to know the other exists.
        */
        const entered = smoothstep(
          clamp01((y - (methodTop - methodEntrance.begins * vh)) / (methodEntrance.over * vh)),
        )

        for (const [name, value] of [
          ...methodTrack,
          ['--menter', () => entered] as const,
        ]) {
          const next = value(m).toFixed(PRECISION)
          if (written.get(name) === next) continue
          written.set(name, next)
          methodEl.style.setProperty(name, next)
        }

        /*
          ── TRIGGER → PLAY → HOLD ───────────────────────────────────────────────────────────────

          **Scroll fires each beat of this section; the beat then plays itself.** `TIMING.method.play`
          argues the model and records that it is a departure from C8 taken by the design owner: every
          wheel notch used to re-scrub the percentage of an arrival already in flight, so a statement
          fading in was stepped by the hand rather than watched.

          **What is a pure function of scroll is the *trigger*, and that is the whole of what C8 keeps
          here.** `m >= span.from` is the same comparison the scrubbed track made; it just answers
          *has this started* instead of *how far in is it*. The beat is still authored at the beat it
          was always authored at, and the order cannot change, because the order is the `from`s.

          A latch holds one number — when the beat started, and in which direction. Value is the same
          `smoothstep` the scrubbed track used, over real time instead of over distance, so a beat that
          has finished is bit-identical to what the old track wrote at the end of its window.

          **Reversal is symmetric and holds nothing.** Crossing back above `from` plays the beat out
          over the same duration; crossing down again plays it in. The latch carries no memory of
          previous crossings, so coming back up the page is the same film backwards rather than a set
          of flags that have already fired.

          **Reduced motion is answered by the duration and not by a branch**: it is zero, so a beat is
          simply at its end the frame it is triggered. Scroll still decides which frame that is.
        */
        const frameEl = methodEl
        for (const [name, span] of methodPlayed) {
          /*
            The duration is the beat's own authored `over`, converted once. `over` was a distance and is
            a weight now: the widest arrival in the frame is still the widest.
          */
          play(frameEl, name, m >= span.from, (span.to - span.from) * TIMING.method.play.perBeat, 0)
        }

        /*
          ── The Method leaving, in layers · TRIGGER → PLAY ───────────────────────────────────────
          The main composition in read order, then the seven thoughts each at its own moment, then the
          note — and then the room, empty. `--mout-*` is 0 standing and 1 gone; `globals.css` multiplies
          each part's light by it. `--mclear` above is the scrubbed guarantee behind it.
        */
        {
          const lv = TIMING.method.leaves
          /*
            **Forward it leaves at `leaves`; backward it comes back as soon as the room can hold it** —
            reverse QA, 26 September 2026. Released only above `leaves`, the Method stood absent for
            ~1,400px of empty room when scrolling back from Questions, under a rail already saying
            METHOD. Going back past the start of the scrolled guarantee (`clear.from`) — the first point
            the frame is not forced empty — lets the composition return; forward is unchanged.
          */
          const first = !Number.isFinite(methodY)
          const heading = first ? 0 : Math.sign(y - methodY)
          methodY = y
          if (m < methodSpans.leaves) methodOut = false
          else if (heading > 0) methodOut = true
          else if (heading < 0 && m < methodSpans.clear.from) methodOut = false
          /* Loaded mid-section: out only where the guarantee would have emptied the frame anyway. */
          else if (first) methodOut = m >= methodSpans.clear.from
          const out = methodOut
          const main = ['--mout-a', '--mout-l', '--mout-q']
          main.forEach((name, i) =>
            play(frameEl, name, out, lv.main.over, lv.main.at + i * lv.main.stagger, lv.returns),
          )
          lv.thoughts.delays.forEach((delay, i) =>
            play(frameEl, `--mout-w${i + 1}`, out, lv.thoughts.over, lv.thoughts.at + delay, lv.returns),
          )
          play(frameEl, '--mout-n1', out, lv.notes.over, lv.notes.at, lv.returns)
          const note = played.get('--mout-n1')
          /*
            Past the scrolled guarantee the Method's frame is empty whatever the clock says, so a jump
            (the rail's *Questions*, a reload low on the page) never waits on a leaving nobody saw.
          */
          methodRested =
            !out ||
            m >= methodSpans.clear.to ||
            (note !== undefined &&
              note.open &&
              clock - note.since >= (calm.matches ? 0 : (lv.notes.over + lv.emptyHolds) * 1000))
          if (out && !methodRested) playing = true
        }

        /*
          **The room, as one number, and the publication's ground is about to need it.** Identical to
          `globals.css`'s own `--mroom` — the arrival, less however much of the printing has given the
          page back — and it is composed here rather than read back out of the element because the
          grounds block runs on the root and must not depend on a section's computed style.
        */
        /*
          **The arrival, and nothing takes it away here.** It was `entered * (1 - --mreturn)` — the
          paper's return, which is gone with the printing: the room the method resolves in is the room
          Questions is written in, and the material is not given back until Contact. What takes it away
          is junction 13 → 14, below, which is a position rather than a beat of this section.
        */
        methodRoom = entered
      }

      /*
        ── Junction 13 → 14 ─────────────────────────────────────────────────────────────────────────
        The junction's own `0 → 1`, from scroll position over the distance C8's conversion bought it.
        A pure function of `scrollY` like everything else here, so it runs backwards exactly as it runs
        forwards, holds a composed frame wherever it is stopped, and has no state to leave behind.

        `persistSpans.length` is in viewport-hundredths, so the divisor is the same shape as a runway's
        price without being one: nothing authored a length, the seconds did.
      */
      if (publicationEl !== null && Number.isFinite(persistTop)) {
        const jScroll = clamp01((y - persistTop) / ((persistSpans.length / 100) * window.innerHeight))
        /** Whether this frame put the passage at its end rather than playing it — a jump. */
        let leapt = false
        /*
          **The scroll starts the passage; the passage then plays.** Seen in the recordings: scrubbed,
          a wheel crossed the whole sheet in about a second and every order in it read as one fade. The
          closing frame is held to the end of the document, so once the hand has brought it in nothing
          on the page moves while the sheet runs — `detail → structure → question → silence → Contact`
          in real seconds. Back above the junction it runs backwards, briskly; stopping anywhere holds.
          Reduced motion takes the end of it, as every played beat here does.
        */
        {
          const sheet = TIMING.environment.persisting
          /* Measured from the frame's lock, in viewports: negative while the list still stands. */
          const fromLock = (y - persistTop) / window.innerHeight
          const wasOn = passageOn
          /*
            **Which way the hand is going decides the threshold** — reverse QA, 26 September 2026.
            Forward, the passage starts where the list still stands (`startsBefore`). Backward it used
            to rewind only above that same point, so between Contact letting go (the frame unlocking)
            and Questions coming back there were ~700px of empty hillside under a rail still saying
            CONTACT. Going back past the unlock now rewinds it — the same instant Contact releases —
            and only a hand moving forward can start it again.
          */
          const heading = Number.isFinite(passageY) ? Math.sign(y - passageY) : 1
          if (!passageOn && fromLock >= -sheet.startsBefore && heading > 0) passageOn = true
          else if (
            passageOn &&
            (fromLock < -sheet.startsBefore - 0.15 || (heading < 0 && fromLock < 0))
          ) {
            passageOn = false
          }
          /*
            **A jump is not a passage** — QA, 26 September 2026. The sheet is played for a hand that
            scrolls through it. Arriving by the rail (*Contact* from the Work) played all 7s of it on
            arrival — the studio standing empty under a rail that already said CONTACT — and leaving by
            the rail played the rewind under the section arrived at. A switch that comes with more than
            three viewports of travel in one frame is a jump — a hard flick of the wheel can cover one —
            and the passage is simply at its end.
          */
          const jumped =
            wasOn !== passageOn &&
            Number.isFinite(passageY) &&
            (navigated || Math.abs(y - passageY) > 3 * window.innerHeight)
          passageY = y
          const target = passageOn ? 1 : 0
          leapt = jumped
          if (calm.matches || jumped) passageAt = target
          /*
            **Once the frame has locked, the list is behind the hand** — QA, 26 September 2026. A fast
            scroll reached the end of the page with the list already carried off the top, and then
            stood on the empty studio for ~4s while the release played to nobody. Past the lock the
            passage goes no slower than the veil lifting; a hand that reads the list still sees all of it.
          */
          else if (passageOn && jScroll > 0 && passageAt < persistSpans.dusk.from) {
            passageAt = persistSpans.dusk.from
          }
          else if (passageAt !== target) {
            const dt = passageLast === 0 ? 0 : Math.min(0.1, (clock - passageLast) / 1000)
            passageAt = passageOn
              ? Math.min(1, passageAt + dt / sheet.total)
              : Math.max(0, passageAt - dt / sheet.rewinds)
          }
          if (passageAt !== target) {
            passageLast = clock
            playing = true
          } else {
            passageLast = 0
          }
        }
        const j = passageAt
        persistAt = j
        /*
          **§8's sheet, resolved once, for everything that reads it.**

          The plates, the scrim, the publication's ink, the ink the method's room is wearing and the
          light itself are one exchange, and until now they were read off two different
          parameterisations — `--junction-at` for some and this track for others. `persisting` argues
          why that could not hold. These two numbers are the whole of it: how far the plates have
          changed places, and how far the light is down while they do.

          Eased here rather than where they are used, so no consumer can apply a second curve: one
          movement, one shape, wherever it is read.
        */
        leaving = {
          cross: smoothstep(rise(j, persistSpans.crosses)),
          dip: clamp01(rise(j, persistSpans.dusk) - rise(j, persistSpans.dawn)),
          leave: rise(j, persistSpans.leaves),
          back: 1 - rise(j, persistSpans.returns),
        }
        /*
          **The film's own transformation is the last step of the passage.** Below the crossing the
          cue is armed; the first frame at or past `crosses.from` — where the hero's presence is still
          0 — takes the footage to its first shot and lets it run at its own speed. Its sky moves
          through the room as the plates cross, and its own dissolve brings the figure in while
          Contact is written. Nothing here holds or slows it.
        */
        if (j < persistSpans.crosses.from) footageArmed = true
        else if (footageArmed) {
          footageArmed = false
          const film = document.querySelector<HTMLVideoElement>('.env-hero')
          if (film !== null && j < persistSpans.crosses.to) {
            film.currentTime = TIMING.contact.arrives.seekTo
            if (!calm.matches) void film.play().catch(() => {})
          }
        }

        for (const [name, value] of persistTrack) {
          const next = value(j).toFixed(PRECISION)
          if (written.get(name) === next) continue
          written.set(name, next)
          publicationEl.style.setProperty(name, next)
        }

        /*
          ── Questions letting go · TRIGGER → PLAY ─────────────────────────────────────────────
          The anchor first, then the rows in pairs, each row's hairline a beat after its words — on a
          clock, so the order is seen at any speed of hand. `--jgone*` is 0 standing and 1 gone; the
          stylesheet multiplies it with `--jclear`, the scroll's guarantee.
        */
        if (!listReleased && j >= persistSpans.lets) listReleased = true
        else if (listReleased && j < persistSpans.lets / 2) listReleased = false
        {
          const r = TIMING.environment.persisting.releases.clock
          /*
            **A passage that was jumped is not released on a clock either** — navigation QA, 27
            September 2026. The rail's *Questions* from Contact put the sheet at 0 in one frame and then
            played the list's return over ~450ms while the rows' own ink was letting go over ~300ms: six
            rows flashed back to ~13% and went again. The release is the passage's, so it lands with it —
            and so do the rows it releases, or landing one half alone shows them whole for a moment.
            Forgotten latches start at their target (`play`), which is what landing means here.
          */
          if (leapt) {
            played.delete('--jgoneb')
            played.delete('--jgone1')
            for (let i = 0; i < 6; i++) {
              played.delete(`--jgone${i + 2}`)
              played.delete(`--jgoner${i + 2}`)
            }
            for (let n = 1; n <= TIMING.questions.faq.rows; n++) {
              played.delete(`--qr${n}`)
              played.delete(`--qi${n}`)
            }
          }
          /*
            Detail, then structure, then the question: the rows' words in pairs from the bottom up
            (row 6 first), each row's hairline `ruleLags` after its words, the anchor's answer with the
            first pair, and *What do you actually create?* last and alone.
          */
          play(publicationEl, '--jgoneb', listReleased, r.body.over, r.body.at, r.returns)
          for (let i = 0; i < 6; i++) {
            const fromBottom = 5 - i
            const at =
              r.rows.at +
              Math.floor(fromBottom / r.rows.per) * r.rows.groupGap +
              (fromBottom % r.rows.per) * r.rows.stagger
            play(publicationEl, `--jgone${i + 2}`, listReleased, r.rows.over, at, r.returns)
            play(publicationEl, `--jgoner${i + 2}`, listReleased, r.rows.over, at + r.ruleLags, r.returns)
          }
          const questionGone = play(
            publicationEl,
            '--jgone1',
            listReleased,
            r.question.over,
            r.question.at,
            r.returns,
          )
          /*
            **Whether the questions have left the room** — the question goes last and alone, so once it
            is fully gone nothing of the list is drawn. On a phone the head line keeps a ground while the
            questions are written and until this reads `1` (`globals.css`, ≤ 700px); the room is then
            empty before the footage crosses in, so the passage's own frames are untouched. Written only
            when it changes.
          */
          const askedGone = questionGone >= 1 ? '1' : '0'
          if (publicationEl.dataset.askedGone !== askedGone) publicationEl.dataset.askedGone = askedGone
        }

        /*
          **Nothing that has not arrived may be pressed.**

          `.page-last` is absolutely positioned inside the closing frame with no height of its own, so
          Contact's composition lays out *over* Questions long before the junction that delivers it.
          At `opacity: 0` it is invisible and still hit-tested: measured at 1920 × 889, `.page-ask` —
          *Tell us about it.* — occupies 633–1137 × 542–706 while Questions is being read, and
          `elementFromPoint` returned it for rows 5 and 6. That is the whole of the *"apenas alguns '+'
          funcionam"* fault: those two rows were not broken, they were covered.

          This is a hit-testing gate and not the transition: nothing about how Contact arrives, or what
          it looks like while it does, is touched here. The frame becomes pressable when its own
          junction begins, which is the first moment anything in it is meant to be reachable.
        */
        const closing = jScroll > 0 ? '1' : '0'
        if (publicationEl.dataset.closing !== closing) publicationEl.dataset.closing = closing

        /*
          ── Contact · TRIGGER → PLAY → HOLD ────────────────────────────────────────────────────

          **The scroll decides one thing here: that Contact has been asked for.** Past
          `persistSpans.asks` the composition writes itself on `TIMING.contact.composes`, and nothing
          about it is a function of position from then on — a hand that keeps scrolling, stops, or
          flicks back a little leaves it exactly where the clock has it. Design owner, 24 September
          2026: *"O utilizador pode entrar no Contact, deixar de fazer scroll e observar a composição
          completar-se."*

          Back past `empty.from` — where the landed hillside began to stand empty — it lets go, all at once
          and quickly, and the passage is the scroll's again. That is a release, not the arrival
          reversed: nothing plays backwards, and coming down again plays it from the start.
        */
        /*
          The trigger is position alone now: the footage no longer comes to rest, so there is nothing
          to wait for but the frame having stood empty.
        */
        /*
          And only once the closing frame has locked: Contact is placed from the frame, and a frame
          still travelling would carry the composition with it.
        */
        if (!contactAsked && j >= persistSpans.asks && jScroll > 0) contactAsked = true
        /*
          And it lets go the moment the frame stops being held on the way back up — QA, 26 September
          2026: held past that point, the composition was carried down the screen with the frame.
        */
        else if (contactAsked && (j < persistSpans.empty.from || jScroll <= 0)) contactAsked = false

        const c = TIMING.contact.composes
        /* Released by the frame unlocking on the way back up, it goes faster — it is being carried. */
        const lets = jScroll <= 0 ? c.unlocks : c.releases
        const parts = [
          play(publicationEl, '--c-q1', contactAsked, c.question.over, c.question.at, lets),
          play(
            publicationEl,
            '--c-q2',
            contactAsked,
            c.question.over,
            c.question.at + c.question.lineLeads,
            lets,
          ),
          play(publicationEl, '--c-begin', contactAsked, c.begins.over, c.begins.at, lets),
          play(publicationEl, '--c-note', contactAsked, c.note.over, c.note.at, lets),
        ]
        /*
          `off`, `playing` or `held`, written only when it changes. The stylesheet reads it for one
          thing — nothing in the frame can be pressed until it has begun to be written.
        */
        const contact = !contactAsked && parts.every((v) => v === 0)
          ? 'off'
          : contactAsked && parts.every((v) => v === 1)
            ? 'held'
            : 'playing'
        if (publicationEl.dataset.contact !== contact) publicationEl.dataset.contact = contact
      }

      /*
      /*
        ── Questions · THREE NARRATIVE MOMENTS, THREE AUTONOMOUS SYSTEMS ───────────────────

            anchor        --qa / --qa-body            data-anchor
            faq sequence  --qr1..6  / --qi1..6        data-faq

        **Nothing here is shared between the three but the unit they measure in.** They have separate
        timings (`TIMING.questions.anchor`, `TIMING.questions.faq`), separate passes, separate channel
        namespaces and separate state attributes — design owner, 21 September 2026, who asked for
        exactly that and said why: adapting the anchor to the rows' system is what kept producing the
        wrong behaviour.

        **A beat is a narrative state, not a wheel event.** Scroll crosses the runway and fires the
        next state; the state then plays on its own clock and holds. Nothing in this section is ever a
        function of scroll *position* once it has been triggered, so a fast hand cannot drag any of it
        and a stopped hand leaves every composition standing exactly where it is.
      */
      if (publicationEl !== null) {
        const pubEl = publicationEl
        /*
          The section's own top, which `place()` already measures for every `[data-state]`, less the
          head margin it reserves. Questions is state 13. Distance from it, in viewport heights: a
          layout position, like the method's approach, and for the same reason.
        */
        /*
          **Everything in this section is measured from the lock**, not from the section's top: above
          the lock the list is still being carried up the screen by page scroll, so a beat fired there
          is a beat revealed on the move. `askedLock` is the measurement and
          `TIMING.questions.anchor.afterLock` is the argument.
        */
        const afterLock = Number.isFinite(askedLock)
          ? (y - askedLock) / window.innerHeight
          : Number.NEGATIVE_INFINITY

        /*
          The three states, written only when they change. `off` before the trigger, `playing` while
          anything in the moment is still moving, `held` once it is standing and nothing in it will
          change again until 13 → 14 releases it. Nothing styles off these; they exist so that three
          systems that are genuinely separate are inspectable as three.
        */
        const phase = (name: string, fired: boolean, parts: readonly number[]) => {
          const state = !fired && parts.every((v) => v === 0)
            ? 'off'
            : parts.every((v) => v === 1)
              ? 'held'
              : 'playing'
          if (pubEl.dataset[name] !== state) pubEl.dataset[name] = state
        }

        /*
          ── BEAT 1 · THE ANCHOR ────────────────────────────────────────────────────

          One trigger, two channels, no index anywhere. The block is already composed where it belongs;
          scroll decides the frame it begins on and the clock does the rest. Its answer follows on
          `body.leads`, which is a relationship rather than a position, so it is stated in the timings
          and never as an entry in a table of places.
        */
        const anchor = TIMING.questions.anchor
        /*
          And the room the Method left has to have stood empty first — `TIMING.method.leaves.emptyHolds`.
          Below the Method (`!out`) this is always true, so nothing changes for a visitor already here.
        */
        const anchorFired = afterLock >= anchor.afterLock && methodRested
        const qa = play(pubEl, '--qa', anchorFired, anchor.over, 0)
        const qaBody = play(pubEl, '--qa-body', anchorFired, anchor.body.over, anchor.body.leads)
        phase('anchor', anchorFired, [qa, qaBody])

        /*
          ── BEAT 2 · THE FAQ SEQUENCE, ON ONE TRIGGER ───────────────────────────────

          **Scroll fires this once and the whole of it finishes on its own** — design owner,
          21 September 2026. All six rows hang off the same comparison; what separates them is
          `stagger`, and one longer `breath` after the third. Both are delays in seconds, so the
          sequence arrives whether the hand moves again or not: stopping dead cannot leave the
          composition unfinished, because no row was ever waiting for a position.

          **It is one build, not two groups.** The breath is the only thing that makes the six read as
          three and three, and it is 0.35s rather than a second trigger.

          Two channels per row, because the verb is *ruled first, written second*: `--qr{n}` draws the
          hairline out from the axis, and `--qi{n}` brings the question's ink up in the space it
          opened, `rule.leads` later. On the way out the sequence lets go at once — `play` applies
          delays inbound only.
        */
        const faq = TIMING.questions.faq
        const faqFired = afterLock >= faq.afterLock
        const faqParts: number[] = []

        for (let i = 0; i < faq.rows; i += 1) {
          const n = i + 1
          /*
            Where this row opens on the sequence's own clock: its place in the stagger, plus the
            breath once the sequence has passed `breathAfter`. Rule and ink shift together, so the
            row arrives as one thing however far into the build it is.
          */
          const delay = i * faq.stagger + (i >= faq.breathAfter ? faq.breath : 0)

          /* The rule goes first within the row: it is what opens the space. */
          faqParts.push(play(pubEl, `--qr${n}`, faqFired, faq.rule.over, delay))

          const at = play(pubEl, `--qi${n}`, faqFired, faq.over, delay + faq.rule.leads)
          faqParts.push(at)

          /*
            **A row that is not there yet cannot be pressed.** The rows exist in the document from the
            first frame, so without this the section's whole hit area is live while it is still empty
            and a visitor scrolling in can open a question that has not arrived. A keyword in a custom
            property, because `pointer-events` takes no number and CSS cannot branch on one.

            It follows the ink and not the rule, so a row becomes pressable when there is something
            written to press rather than when its line has been drawn.
          */
          const hit = `--qh${n}`
          const live = at > 0 ? 'auto' : 'none'
          if (written.get(hit) !== live) {
            written.set(hit, live)
            pubEl.style.setProperty(hit, live)
          }
        }

        phase('faq', faqFired, faqParts)
      }

      /*
        ── Where the film is ────────────────────────────────────────────────────────────────────────
        The one thing in this file that is not a value on a runway: which of V2's fourteen states the
        visitor is standing in. `src/motion/spine.ts` says what a state is and `timeline.ts` resolves
        where each one begins, in the unit of whichever runway prices it; all this does is ask which was
        passed last.

        Four units and one comparison, because a state's entry is a beat and a beat is only a distance
        once you know what it costs. Flow states have no beat at all — they are measured in `place()`.

        It is a pure function of scroll position like everything else here, which is what makes the
        Ledger exact in reverse: coming back up the page unlights a destination at the same pixel that
        lit it, with nothing remembered.
      */
      /**
       * **Every state's position, on `p`.** Not three scalars compared against three origins any more —
       * one number per state, in one unit, which is what makes "state 9 comes after state 8" a fact
       * about the sequence rather than about how the page happened to be laid out.
       *
       * **The resolving moved out of this file.** It was an `if` ladder here, one branch per runway,
       * which is the shape a driver takes when it is quietly holding a second model of the sequence.
       * `timeline.ts`'s `narrativePositions` owns it now: this measures the two segments and the flow
       * tops and hands them over, and gets fourteen positions on one scale back. The arithmetic is
       * identical — the same offsets, the same prices, the same numbers — and there is now one place
       * that knows how an authored beat becomes a position.
       *
       * A flow state has no beat, so its measured top is converted into `p` the same way everything
       * else is. That conversion is the whole reason the publication can stop being a separate world.
       */
      const flow = new Map<number, number>()
      if (origin !== null) {
        for (const [id, top] of flowTops) flow.set(id, (top - origin) / vhNow / perBeat)
      }

      const placed = narrativePositions({
        act: { offset: actAt, scale: perBeat / perActBeat },
        method: { offset: methodAt, scale: perBeat / perMethodBeat },
        flow,
      })

      let now = 1
      for (const entry of placed) if (p >= entry.at) now = entry.id

      /*
        ── What the Ledger names, and it is the one thing allowed to run ahead of the film ──────────

        **The same table, walked with a lead on two of its entries.** `now` above is the film's real
        position and nothing here touches it: the grounds, the plates, the exposures, the rail's own
        ink and `data-film-state` all go on reading it, so this cannot move anything that is drawn.

        What it moves is which of the five words the Ledger lights. A state begins where its section
        begins, and for the two chapter changes in the publication that is measurably later than the
        moment the new section owns the screen — the Method's held frame is completely cleared 1,150px
        before `.questions` starts. `TIMING.ledger` carries the measurements and argues the number.

        The lead is authored in viewport heights and `perBeat` is viewports per beat of `p`, so the
        conversion is the one every other position in this file goes through. Subtracting it from the
        entry rather than adding it to `p` is what keeps it to the two states that asked for it.
      */
      const railLead = TIMING.ledger.lead / perBeat
      const railLeads: ReadonlySet<number> = new Set(TIMING.ledger.leads)
      let railNow = 1
      for (const entry of placed) {
        if (p >= entry.at - (railLeads.has(entry.id) ? railLead : 0)) railNow = entry.id
      }
      /*
        **And the played passage leads it into Contact** — 26 September 2026. 13 → 14 runs on its own
        clock now, ahead of the position, so once the footage has replaced the room the rail names the
        chapter the visitor is in rather than the one the scroll has not yet left.
      */
      if (persistAt >= persistSpans.crosses.to) railNow = Math.max(railNow, 14)

      /*
        The two things C8 makes checkable, and neither could be written down before it. Fourteen states
        strictly in order on one position; and no segment boundary inside a junction that has a distance
        to be inside of. Both run once per measurement rather than per frame — `place()` is the only
        thing that can move them.

        Junction 13 → 14 is the one priced junction today, and its length is already in `p`'s own unit:
        `persistSpans.length` is viewport-hundredths, and a beat of `p` costs `perBeat` viewports, so
        dividing by `perBeat * 100` is the same conversion every other position here goes through.
      */
      const boundaries = [
        { name: 'act', at: actAt },
        { name: 'method', at: methodAt },
      ]

      /*
        ── The thirteen junctions, on the same position ─────────────────────────────────────────────
        **C4.** Each junction is the interval between the two states it joins, resolved out of `placed`
        and nothing else — so the movements between the states are on the same scalar the states are,
        and a survivor can be a pure function of `p` from the frame it leaves to the frame it arrives
        in. `timeline.ts` owns the arithmetic; this measures and publishes.

        Re-resolved only when layout moves, because both endpoints are state positions and `place()` is
        the only thing that can move one.
      */
      if (audit) junctionsOnP = junctionSpans(placed, perBeat)

      /*
        **The audit waits for the origin, and that is not a weakening of it.**

        While the opening runs there is deliberately no origin, so `actAt` and `methodAt` are `+Infinity`
        and the flow map is empty — `narrativePositions` then answers `+Infinity` for states 09 → 14,
        which its own doc calls *"the honest answer while the page is measuring"*. Auditing there checked
        a model the driver has not resolved yet, and it reported that as six ordering faults and six
        junctions with nowhere to happen, on every load.

        The cost was not noise. Those six are exactly the junctions still to be built, so a real fault in
        any of them would have been indistinguishable from the message the opening prints anyway.

        `audit` is *held* rather than spent, so the first read after the origin is fixed runs the whole
        audit against real numbers. Not one check is skipped, relaxed or made conditional on a value —
        this only stops them being asked a question that has no answer yet.
      */
      if (audit && origin !== null) {
        audit = false
        assertNarrative(placed)
        /*
          The furthest `p` the visitor can ever reach, in the same unit `placed` is in and through the
          same conversion every other position here goes through. `s` is `(y − origin) / vh / perBeat`
          and `y` stops at the last scrollable pixel, so this is simply that expression at its maximum.
        */
        assertReachable(
          placed,
          (document.documentElement.scrollHeight - vhNow - origin) / vhNow / perBeat,
        )
        assertJunctions(junctionsOnP, boundaries)
        assertSegments(placed, boundaries, [
          { from: 13, length: persistSpans.length / 100 / perBeat },
        ])
      }

      /*
        **Which junction the film is crossing, and how far through it is.** The whole of what C4 puts on
        the page: `--junction` is §3's own numbering and `--junction-at` is that junction's `0 → 1`,
        affine in `p` across its entire interval.

        Nothing reads them yet — the survivors are C6's, one per junction — and they are published now
        because publishing is what makes the range available to a survivor without that survivor knowing
        where it sits on the page or what lies inside its interval. Two properties against the forty this
        loop already writes, and both go through the same write-only-on-change map.
      */
      {
        let crossing = 0
        let through = 0
        for (const span of junctionsOnP) {
          if (!Number.isFinite(span.at) || p < span.at) continue
          crossing = span.id
          through = junctionAt(span, p)
        }
        const id = String(crossing)
        if (written.get('--junction') !== id) {
          written.set('--junction', id)
          root.style.setProperty('--junction', id)
        }
        const at = through.toFixed(PRECISION)
        if (written.get('--junction-at') !== at) {
          written.set('--junction-at', at)
          root.style.setProperty('--junction-at', at)
        }

        /*
          ── The exposure dip at the chapter turn ─────────────────────────────────────────────────
          §10's `atmosphere.dip`, eased here rather than in the stylesheet because CSS has no sine and
          a linear dip reads as a wipe. One number, published only while junction 05 is crossing.

          It is what makes the handover a crossing rather than a crossfade: the survivor coming apart
          and the sentence forming DO overlap between 0.850 and 0.907 — that is the approved
          choreography — and the frame is at 28% of its exposure through the whole of it, so the two
          are never both legible in the same composition.
        */
        {
          const jp5 = clamp01(crossing - 5 + through)
          const ramp = (from: number, to: number) =>
            to > from ? (1 - Math.cos(Math.PI * clamp01((jp5 - from) / (to - from)))) / 2 : 0
          const [fallFrom, fallTo] = atmosphere.dip.fall
          const [riseFrom, riseTo] = atmosphere.dip.rise
          const dip = (
            atmosphere.dip.depth * (ramp(fallFrom, fallTo) - ramp(riseFrom, riseTo))
          ).toFixed(PRECISION)
          if (written.get('--v2-dip') !== dip) {
            written.set('--v2-dip', dip)
            root.style.setProperty('--v2-dip', dip)
          }
        }
      }

      /*
        ── Junction 12 → 13 · relight ───────────────────────────────────────────────────────────────
        The storyboard's four channels, on junction 12's **own** `0 → 1` rather than on `--junction-at`,
        which only carries whichever junction the film is currently crossing. `junctionAt` is C4's and is
        read, not changed: the span is looked up by id and the arithmetic is C4's own.

        **Written on the root, and that is not the persist track's mistake repeated.** These are read by
        the Environment's own layers, which are mounted outside `.publication` at `z-index: 0` — a custom
        property inherits *down*, so a value written on the publication cannot be seen by the element
        behind it. The persist track is written on `.publication` precisely because nothing outside that
        half reads it; this one is read by the ground.

        Off the junction the five are 0 before it and 1 after it by construction — `junctionAt` clamps —
        so the relit ground stays relit through states 13 and 14 without anything holding state.
      */
      {
        const span = junctionsOnP.find((s) => s.id === 12)
        const rl = span === undefined ? 0 : junctionAt(span, p)
        for (const [name, value] of relightTrack) {
          const next = value(rl).toFixed(PRECISION)
          if (written.get(name) === next) continue
          written.set(name, next)
          root.style.setProperty(name, next)
        }
      }

      /*
        ── The Environment ──────────────────────────────────────────────────────────────────────────
        Which of the three plates is behind the page, how lit it is, and how far state 08's pan has run.

        **It is a projection and not a second driver.** Every number comes out of `spine.ts`'s own §2
        columns, and the only input that is not in the spine is `placed` — where each state sits — which
        this loop has already computed for the Ledger. So the environment cannot disagree with the
        sequence: there is one position, one state table, and this reads both.

        Written on the root beside everything else, through the same write-only-on-change map: seven
        properties that almost never change, which is the case that comparison exists for.
      */
      for (const [name, value] of environmentValues(p, placed, (n) => n.toFixed(PRECISION), leaving)) {
        if (written.get(name) === value) continue
        written.set(name, value)
        root.style.setProperty(name, value)
      }

      /*
        And what the Ledger reads, which is nothing but a projection of that number. The rail renders
        five words and reads none of these; the stylesheet does. `spine.ts` decides every value.
      */
      const put = (name: string, value: number) => {
        const next = String(value)
        if (written.get(name) === next) return
        written.set(name, next)
        root.style.setProperty(name, next)
      }

      const ledger = stateOf(now).ledger
      put('--state', now)

      /*
        **The state as an attribute, so something outside the stylesheet can know where the film is.**

        Added 7 September 2026 (C13) for the Work's carousel, and it is the same device `data-opening`
        already is: a fact about the film, on the root, that a component can watch without reading
        scroll or running a loop of its own.

        `work-experiences.tsx` needs exactly one thing — *is the Work on screen* — so its clock can run
        while the section is being looked at and stop when it is not. An `IntersectionObserver` cannot
        answer that: `.v2` is a **fixed** layer, so `.v2-work` intersects the viewport from the first
        frame of the session whatever the scroll position is, and the clock started at page load and was
        already on the second experience by the time the visitor arrived. Measured in Chrome — the
        section opened on `Art experiences` instead of on the plate the film had just ended on.

        This is not the carousel being scroll-driven. Scroll decides **entry and exit of the section**,
        which is what the design owner reserved for it; which experience is showing is the clock's, and
        nothing here says anything about that.
      */
      if (root.dataset.filmState !== String(now)) root.dataset.filmState = String(now)

      /*
        **And the rail's own, which is `data-film-state` with the lead on it.** A second attribute
        rather than a shifted first one, because `data-film-state` already has a reader with a very
        different question — `work-experiences.tsx` gates the Work's clock on *is the Work on screen*,
        which must stay the film's real answer. Written guarded, the same way, so the Ledger's observer
        still fires once per chapter and not once per frame.
      */
      /*
        **About is named when About is on screen** — QA, 26 September 2026. About is a frame written
        *during* junction 09 → 10 (C15, `--jp9`), so it stood fully composed for ~3,000px at 1920 × 889
        while the rail still said WORK, and changed only as About was about to be released. The rail
        now names it at the middle of the two rooms' crossing (`TIMING.about.superimpose`), which is
        the instant the studio owns the screen and the headline is being written.
      */
      if (now === 9) {
        const [crossFrom, crossTo] = TIMING.about.superimpose
        if (clamp01(Number(written.get('--junction-at') ?? 0)) >= (crossFrom + crossTo) / 2) {
          railNow = Math.max(railNow, 10)
        }
      }
      if (root.dataset.railState !== String(railNow)) root.dataset.railState = String(railNow)
      put('--lunlit', ledger.unlit ? 1 : 0)
      put('--lindex', ledger.index ? 1 : 0)

      /*
        ── The dock · junctions 06 → 07 → 08 ────────────────────────────────────────────────────────
        **The sentence becoming the studio**, in one movement with no cut in it: the line is consumed
        from the right while `chapter` escapes over it, the survivor lands at the rail's axis as the
        lockup, `III` joins it, the word goes, the thesis enters, and the numeral lies down as the
        mark the index is drawn out of.

        `timing.ts` §dock owns every number. This turns them into channels and measures the two things
        that cannot be authored — where the survivor's slot in the line is, and where the numeral
        stands in the landed lockup.

        **Why they are measured rather than written down.** Both are answers to *where two real boxes
        are relative to each other*, and both change with the viewport, the font and the frame. Every
        delta below is published in pixels against the rail's own mark, so `globals.css` interpolates
        between two measured boxes rather than between two copies of a coordinate that have to be kept
        in agreement.
      */
      {
        const d = TIMING.dock
        const at = clamp01(Number(written.get('--junction-at') ?? 0))
        const junction = Number(written.get('--junction') ?? 0)
        /*
          The gesture's own `0 → 1`, spanning `spans` junctions from `from`. `junction − from + at` is
          how far past the start of that junction the film is, in junctions; dividing by `spans` makes
          every window below a fraction of the whole movement rather than of one junction. Pure in `p`,
          so it reverses exactly.
        */
        const j = clamp01((junction - d.from + at) / d.spans)
        /*
          **Every channel is eased, and with the one curve the rest of the site uses.**

          A linear ramp on the travel read as a speck drifting across the photograph rather than as a
          movement with intent: 450px of scroll at a constant rate, on an object 1.4px wide. Smoothstep
          gives it the departure and the settle the eye reads as deliberate, and it is the same curve
          `grounds.cross` and the arrivals already use — nothing new enters the vocabulary.
        */
        const win = ([from, to]: readonly [number, number]) =>
          smoothstep(clamp01((j - from) / (to - from)))

        /*
          ── There is no type in this gesture — C13, 7 September 2026 ─────────────────────────────
          `--s1..4`, `--goes`, `--anchor-dx`, `--anchor-dy` and the pixel conversion that timed the
          survivor's exit are all gone. They drove a sentence being consumed, a word held alone and
          that word leaving; none of those exists. The narrative ends on `A memory.` in junction 05,
          and this gesture opens on a frame that already carries no type.

          What it still publishes is the camera, the light, the grade and the rail — the composition
          opening and the navigation being written in the field it opens.
        */

        /* ── 3 · the rail is written in the field the camera opened ─────────────────────── */
        /*
          The rail's head — `III — Studio`, as type, in the margin the recompose opened. It is the only
          survivor of the old mark choreography that was ever consumed (`globals.css`'s `.marker`), and
          it is not an arrival from the frame. Nothing travelled here and no word handed over to it: C12 removed
          the display `Studio` entirely, so the studio is named once, where its structure is.
        */
        /*
          `--numeral`, `--three1..3`, `--reposition`, `--subject` and `--subject-entry` are gone —
          7 September 2026. Five channels published to a stylesheet that read none of them, describing a
          numeral being assembled beside the name and then carried to the corner. `Studio` does not
          travel to the rail, so the table that said it did is retired rather than left as debt.
        */
        put('--rail-grade', win(d.grades as unknown as readonly [number, number]))

        /*
          ── The camera ──────────────────────────────────────────────────────────────────────────
          **One term, and it carries no lateral move.** `--cam-x` and `--cam-y` are gone with the push
          that authored them: §2's own 20% pan (`environment.ts`) is the only thing that moves this frame
          sideways, and the recompose used to push 40px back against its 512px on a different schedule.
          What is left is a 1.6% settle that comes to rest with the light at `camera.opens[1]`, so the
          rail is written onto a frame that has stopped. `timing.ts` §dock owns the reasoning.
        */
        const opens = win(d.camera.opens as unknown as readonly [number, number])
        put('--cam-scale', 1 + d.camera.scale.open * opens)

        /*
          ── The film's own exposure ─────────────────────────────────────────────────────────────
          Published as resolved values rather than as a position, because the curve has five stops and
          CSS cannot interpolate a table. `sat` is derived from the luminance so it can never disagree
          with it. Continuity at the edges is `spine.ts`'s job: states 06 and 08 carry this curve's own
          first and last luminance, so the Environment hands over without a step.
        */
        {
          const stops = d.exposure.stops
          let lum: number = stops[0].lum
          let con: number = stops[0].con
          if (j >= stops[stops.length - 1].at) {
            lum = stops[stops.length - 1].lum
            con = stops[stops.length - 1].con
          } else {
            for (let i = 1; i < stops.length; i += 1) {
              if (j < stops[i].at) {
                const a = stops[i - 1]
                const b = stops[i]
                const k = smoothstep(clamp01((j - a.at) / (b.at - a.at)))
                lum = a.lum + (b.lum - a.lum) * k
                con = a.con + (b.con - a.con) * k
                break
              }
            }
          }
          const [satFrom, satTo] = [d.exposure.sat.from, d.exposure.sat.to]
          const [satLo, satHi] = d.exposure.sat.over
          const sat = satFrom + (satTo - satFrom) * clamp01((lum - satLo) / (satHi - satLo))
          put('--film-lum', lum)
          put('--film-con', con)
          put('--film-sat', sat)

          /*
            ── HOW MUCH OF THE FILM'S CURVE APPLIES ────────────────────────────────────────────
            **`j` is clamped, so without this the curve governs the whole site.** Below the dock it
            resolves to the first stop and above it to the last — measured before this was added, the
            plate was pinned at 0.62 through the whole of junction 05 while §2's column asked for 0.79,
            and pinned at 0.835 from junction 08 onward, so state 09 — *the brightest state on the
            site* — never got past the value the film settles to.

            The luminance itself needs no ramp: `spine.ts` carries this curve's first and last value at
            states 06 and 08, so brightness is already continuous at both ends. **Contrast and
            saturation are not** — they sit at 0.96 / 0.79 where the gesture opens and 0.985 / 0.91
            where it closes, against 1 / 1 outside — so the blend is ramped rather than switched, over
            the shoulder of the junction either side. Nothing steps and nothing carries.
          */
          const shoulder = 0.3
          let filmAt = 0
          if (junction === d.from - 1) filmAt = smoothstep(clamp01((at - (1 - shoulder)) / shoulder))
          else if (junction >= d.from && junction < d.from + d.spans) filmAt = 1
          else if (junction === d.from + d.spans) filmAt = 1 - smoothstep(clamp01(at / shoulder))
          put('--film-at', filmAt)
        }

        /*
          ── 5 · the identity does not resolve here, because it never left ────────────────────────
          `--dock-fall1..3`, `--dock-stack` and `--dock-gap` are gone — 7 September 2026. They laid the
          three strokes down and closed their tracking into a mark. The head is type and has been since
          C10; these were writing to nothing.
        */
        /*
          ── 6 · stillness, then the rail is written ────────────────────────────────────────────
          `stills` is published so the stylesheet can be *checked* against it, and consumed by nothing:
          its whole job is to be a range in which no channel moves. Between `lights[1]` and `draws[0]`
          there must be nothing.

          **There is no `assertDock`.** This comment claimed one held the rule; `grep` finds no such
          function anywhere in `src/`. The range is held by reading the table, which is why the windows
          in `timing.ts` §dock are authored end to end rather than as gaps between other windows.
        */
        /*
          **The index is drawn by one wipe, not by five fades behind a shutter.** `--i1..--i5` are gone:
          they were five per-row opacity ramps spent entirely while `.ledger-index` was clipped to
          nothing by `--handoff`, which is a step. Measured on the running page: ten pixels of scroll
          took the navigation from invisible to complete. This is the clip itself, driven, so the rows
          are drawn downward out of the head — §3's own *decompose* — and `--handoff` goes back to
          gating reachability alone, which is what it was added for.
        */
        put('--rail-draw', win(d.draws as unknown as readonly [number, number]))

        /*
          **The anchor is gone with the column it placed.** `--anchor-dx` / `--anchor-dy` stood the
          sentence so its surviving word sat on the frame's centre. There is no sentence and no
          survivor, so there is nothing to anchor and nothing to measure: `place()` reads no boxes for
          this gesture at all now.
        */
      }

      /*
        ── State 09 · the Work ──────────────────────────────────────────────────────────────────────

        Two things are published and neither of them chooses an experience.

        `--work-holds` keeps the section at full ink through the first 45% of junction 09 → 10 and takes
        it out across the rest, inside the plate superimpose §3 authors there.

        `--wk-label` / `--wk-index` / `--wk-cat` / `--wk-ident` are the section's own arrival across
        junction 08 → 09 — the lift that brings the plate to true exposure. They are four windows rather
        than one because the composition is a reading order: **label → index → category**, with the
        identification settling last, the way a caption settles after its picture.

        **Which category is showing is NOT here, and that is C13's whole point.** It used to be
        `--make1..3`, scrubbed by `--jp9`, so the content was a function of scroll position. The queue
        has a clock and `work-experiences.tsx` owns it (C14); the driver publishes nothing about it and
        cannot.
      */
      {
        const w = TIMING.work
        const jn = Number(written.get('--junction') ?? 0)
        const ja = clamp01(Number(written.get('--junction-at') ?? 0))
        const jp9 = clamp01(jn - 9 + ja)
        /*
          **The Work's arrival spans the tail of junction 07 → 08 and the whole of 08 → 09.** It was
          `jp8` — junction 08 alone — which made the section's first ink impossible before the rail had
          completely finished. `timing.ts` §work owns `from`, `opensAt` and `spans`; this only resolves
          them, the way `dock` resolves its own two-junction gesture.
        */
        const a = w.arrives
        const wp = clamp01((jn - a.from + ja - a.opensAt) / a.spans)
        put(
          '--work-holds',
          1 - smoothstep(clamp01((jp9 - w.release[0]) / (w.release[1] - w.release[0]))),
        )
        const arr = (window0: readonly [number, number]) =>
          smoothstep(clamp01((wp - window0[0]) / (window0[1] - window0[0])))
        const workIn = arr(w.arrives.block as unknown as readonly [number, number])
        put('--work-in', workIn)
        put('--wk-label', arr(w.arrives.label as unknown as readonly [number, number]))
        put('--wk-cat', arr(w.arrives.category as unknown as readonly [number, number]))
        put('--wk-index', arr(w.arrives.index as unknown as readonly [number, number]))
        put('--wk-ident', arr(w.arrives.identity as unknown as readonly [number, number]))

        /*
          **Whether the Work is on screen, as an attribute, for the carousel's clock.**

          `work-experiences.tsx` needs one fact: *is this section being looked at*, so its clock can run
          while it is and stop when it is not. It cannot ask the DOM — `.v2` is a fixed layer, so an
          `IntersectionObserver` sees the section from the first frame of the session whatever the scroll
          position is. And it cannot ask `--state`: the Work is composed across the **tail of junction
          08 → 09**, where the state is still 8, so gating on state 9 left the clock stopped for almost
          the whole time the section was readable. Measured — eleven seconds parked in the Work and the
          category had not changed once.

          So the driver publishes the thing it alone knows: the section's own composed presence, the
          product of its arrival and its release. Scroll decides entry and exit, which is what the design
          owner reserved for it; which experience is showing is the clock's and is not here.
        */
        const shown =
          workIn * (1 - smoothstep(clamp01((jp9 - w.release[0]) / (w.release[1] - w.release[0]))))
        /*
          0.6, not 0.9: the section is *readable* well before it is at full ink, and the clock should be
          running by the time the visitor can read it. At 0.9 the band was a few hundred pixels wide and
          the gate never opened at any sample — measured in Chrome.
        */
        const workOn = shown > 0.6 ? 'on' : 'off'
        if (root.dataset.work !== workOn) root.dataset.work = workOn

        /*
          **Which of About's groups the hand has reached** — `TIMING.about.arrives.at`. Scroll starts a
          group; the stylesheet resolves it on its own curve. A count, so crossing back under a threshold
          releases exactly the groups above it.
        */
        const at = TIMING.about.arrives.at
        const aboutStage = String([at.statement, at.support, at.detail].filter((v) => jp9 >= v).length)
        if (root.dataset.about !== aboutStage) root.dataset.about = aboutStage
      }

      /*
        ── The publication's ground ─────────────────────────────────────────────────────────────────
        `timing.ts` §grounds, interpolated on the junction the film is crossing, so the veil and the ink
        move continuously between two states rather than switching at the boundary. Two properties; the
        stylesheet does the mixing.

        The plates were always right — this is only what stands in front of them.
      */
      {
        const table = TIMING.grounds.states
        const [crossFrom, crossTo] = TIMING.grounds.cross
        const first = table[0]
        const last = table[table.length - 1]
        let veil = now <= first.state ? first.veil : last.veil
        let inkAt = now <= first.state ? first.ink : last.ink
        for (let i = 0; i < table.length - 1; i += 1) {
          const a = table[i]
          const b = table[i + 1]
          if (now !== a.state) continue
          /*
            `--junction-at` is how far through the junction that leaves this state we are; the cross is
            spent entirely inside `grounds.cross`, so it is over before `arriving.empty` lets the next
            section's first line appear. Smoothstep rather than linear — a ground arriving at a constant
            rate reads as a wipe, and this has to read as a change of light.
          */
          /* A state may hold its ground longer than the shared window — state 12 does; see `grounds`. */
          const own = (a as { readonly cross?: readonly [number, number] }).cross
          const [from, to] = own ?? [crossFrom, crossTo]
          const raw = clamp01(
            (clamp01(Number(written.get('--junction-at') ?? 0)) - from) / (to - from),
          )
          const t = raw * raw * (3 - 2 * raw)
          veil = a.veil + (b.veil - a.veil) * t
          inkAt = a.ink + (b.ink - a.ink) * t
          break
        }

        /*
          ── 13 → 14 crosses on §8's sheet, not on `--junction-at` ────────────────────────

          **The only crossing on the site, and the loop above cannot carry it.** Two things are true
          of this junction and of no other. The scrim has to change in the same frames the plates do,
          or the hero arrives wearing Questions' register — and the plates now change on the persist
          track (`persisting`, 22 September 2026), which is a different parameterisation from
          `--junction-at`. And the persist track is *longer than the junction's tail*: state 14 is
          reached at about 0.48 of it, so by the time §8's sheet crosses the ground, `now` is already
          14 and the loop above has nothing left to interpolate — measured, the veil snapped from 0 to
          0.62 in one frame at the moment the state changed.

          So the pair is interpolated here, from `leaving.cross`, for as long as the track is engaged.
          It is the same two rows of `grounds.states` the loop would have used, read off the sheet the
          photograph underneath them is already reading. Outside the track this does nothing at all.
        */
        if (leaving !== null && persistAt > 0) {
          const table13 = table.find((row) => row.state === 13)
          const table14 = table.find((row) => row.state === 14)
          if (table13 !== undefined && table14 !== undefined) {
            veil = table13.veil + (table14.veil - table13.veil) * leaving.cross
            inkAt = table13.ink + (table14.ink - table13.ink) * leaving.cross
          }
        }
        /*
          ── The method holds the publication's ink for as long as its room is up ─────────────────

          **Found in Chrome on 18 September 2026, and it had made the method's resolution unreadable.**

          Everything above is a function of *position*, and state 12 is placed **inside the method's
          held frame** — so the cross out of the studio's ink and into Questions' warm stone ran about
          400px into junction 12, while the frame was still held and `--manswer` was still rising.
          Measured at 1440 × 749: at 3,600px into the section the ink was 1.00, and at 4,000px it was
          0.00. `Your experience` therefore resolved **light on a ground that had already gone light** —
          the ~1.1:1 frame `story.methodStory.printing` exists to prevent, arriving from outside the
          section rather than from its own beats. The three stages then ran on a page that had already
          been given back, and the rail crossed to dark ink over a room that was still dark.

          `--mroom` is the section's own answer to *what material is this frame made of*, and it already
          says exactly when the paper comes back — `methodStory.printing.returns`. So the ink is the
          greater of the two: the publication's, and the method's room. Outside the method the second
          term is zero and this line does nothing; inside it, the page stays the studio's ink until the
          printing gives it back, and then falls to paper on the printing's own curve rather than on a
          junction's.

          **The veil is deliberately left alone.** Junction 12 still takes it 0.60 → 1.00 across the
          resolution, which with the ink held is the room going fully dark around the answer — that is
          `resolve.holds` performed rather than contradicted.

          Position still decides everything; what changed is *which* position. `--page-ink` is the
          publication's, this is the method's, and the method is the one section of the publication
          that is not paper — `CLAUDE.md`, *the method's room is the publication's own ink standing in
          for its paper for 200vh*.
        */
        /*
          ── And the room comes off at Contact, on the junction that changes the environment ────────

          **`ABOUT → METHOD → QUESTIONS` is one room and `QUESTIONS → CONTACT` is where it is left** —
          design owner, 19 September 2026. Every other value in this block crosses on `grounds.cross`,
          inside the empty frame; this one crosses across the **whole** of junction 13 → 14 instead,
          because it is not a scrim being exchanged in a gap — it is the ink over a photograph, and the
          photograph underneath it is crossing from the method's plate to the hero's over exactly that
          span (`motion/environment.ts`). The two have to come off together or the hero plate arrives
          wearing the studio's ink.

          **It comes off on §8's own window, not across the whole junction**, because it is one half of
          a single exchange: `motion/environment.ts` crosses the plates on `persisting.crosses` — the
          beat §8 gives to *the ground turning under the rule*, after the list has released around it —
          and the ink over the outgoing plate has to leave on exactly those frames or the hero arrives
          wearing it. Two files read the same two numbers rather than holding two opinions.

          A pure function of position like everything else: `--junction-at` is how far through the
          junction leaving the current state we are, so at state 13 it is this junction's own `0 → 1`,
          and above state 13 the room is simply gone.
        */
        /*
          **And it reads the same number the ground does now.** It used to derive its own window from
          `persisting.crosses / total` and then apply it to `--junction-at`, which is the unit mismatch
          `motion/environment.ts` records: seconds of §8's sheet measured against the junction's
          position on `p`. `leaving.cross` is that sheet, resolved once, on the track it belongs to.
        */
        if (leaving !== null && persistAt > 0) {
          /*
            **Off during the breath, before the plates cross** — 26 September 2026, third review: the
            veil is a flat layer of the room's ink over *every* plate, so taken off with the crossing it
            lay over the footage as it arrived and read as a grey filter. It leaves on `dusk`, while only
            the room is on screen, and the crossing then happens between two clean photographs.
          */
          methodRoom *= 1 - Math.max(smoothstep(rise(persistAt, persistSpans.dusk)), leaving.cross)
        } else if (now > 13) {
          methodRoom = 0
        }

        put('--page-veil', veil)
        put('--page-ink', Math.max(inkAt, methodRoom))

        /*
          **The method's room, published on the root so the Environment can paint it.**

          It used to be painted by the section itself — a gradient on `.method`'s own box and a scrim on
          its `::before`. Both scroll with the box, and measured at 1440 × 749 the ground's top edge
          travelled from y 898 to y −2 across the passage: **a soft ink line moving 900px up the screen,
          over a photograph that is fixed**. That is the "camada a subir" the design owner kept seeing,
          and it survived every change to the transition because it was never part of it.

          A ground belongs to the Environment — C13 argued exactly this for the Work's plate. Fixed, it
          cannot travel, and the passage happens in a frame where nothing moves at all.
        */
        put('--m-room-at', methodRoom)
      }

      /* 0 unvisited, 1 visited, 2 active — §6's rule length, and the stylesheet multiplies one unit. */
      DESTINATIONS.forEach((destination, i) => put(`--l${i + 1}`, depthOf(destination, now)))

      /*
        The loop runs only while the spring is in flight and stops the moment it converges, so there is
        no latched callback to freeze the page on a stale frame — which is why drawing straight off the
        scroll event was correct before there was a spring, and why `visibilitychange` and `pageshow`
        still force an exact frame rather than easing to one.
      */
      /* A press is spent once the page has arrived where it sent it — the spring carries a short one. */
      if (!flying) navigated = false

      if ((flying || playing) && frame === 0) frame = window.requestAnimationFrame(read)
    }

    const onScroll = () => {
      if (frame !== 0) return
      last = window.performance.now()
      frame = window.requestAnimationFrame(read)
    }

    const onResize = () => {
      price()
      place()
      onScroll()
    }

    /*
      Any in-page link — the rail, a mark — and only one whose default went ahead. Listened for on the
      window, where the bubble ends, so a handler that declined the navigation has already said so.
    */
    const onPress = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.target instanceof Element && event.target.closest('a[href^="#"]')) navigated = true
    }

    /*
      Coming back through history is the one case the inline script in layout.tsx cannot cover: a
      page restored from the back/forward cache is reinstated whole, scroll position included, and
      `scrollRestoration` has no say over that. This returns those visitors to the beginning too.

      Safe with respect to the hero: on a cached restore the opening sequence finished long ago, so
      the scroll event this fires has nothing left to accelerate.
    */
    const rewind = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      window.scrollTo(0, 0)
      /*
        A restored page keeps its heap, so `origin` survives with it — and a visitor who had scrolled a
        long way during the opening would come back to a shot that only starts a thousand pixels down.
        Releasing it lets the next read anchor at the top, where we have just put them.
      */
      origin = null
      held = 0
      read()
    }

    /*
      The origin is taken the instant the opening reports it is over, rather than whenever the page next
      happens to move.

      Lazily was correct while the only way to move was to scroll. It stopped being correct the moment
      the hero's navigation could jump to Chapter III: `--origin` is part of the film's height, so
      rewriting it *after* a jump moves the destination out from under the visitor. Scrolled 100px during
      the opening and then clicked `Studio`, the rounded origin (986) was replaced by the exact one (100)
      and the chapter rose 886px — landing them 1.7 beats into an act they had asked to see the start of.

      Fixed at the flip, `--origin` is exact and settled before any link can be pressed, and every
      anchor resolves against a layout that is no longer going to change.
    */
    /*
      `read` takes an optional frame timestamp, and an observer would hand it a MutationRecord array —
      which is also exactly wrong in kind: the origin flip wants an exact frame, not an eased one.
    */
    let wasOpening = root.dataset.opening
    const released = new MutationObserver(() => {
      /*
        Only an actual **change** of the attribute is the event this exists for. A repeated write of the
        same value is still a MutationRecord, and answering one would force an exact frame — which
        snaps the spring — for something that did not happen.
      */
      const now = root.dataset.opening
      if (now === wasOpening) return
      wasOpening = now
      read()
    })
    released.observe(root, { attributeFilter: ['data-opening'] })

    /*
      **The questions change height when an answer opens**, and on a phone the list stands at a height
      derived from its own (`--asked-h`), so its lock and the passage after it move with it. The page is
      re-measured exactly as a resize re-measures it — one path, not a second one.
    */
    const askedBox = document.querySelector<HTMLElement>('[data-asked-list]')
    const grows =
      askedBox !== null && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    if (askedBox !== null) grows?.observe(askedBox)

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('pageshow', rewind)
    window.addEventListener('click', onPress)

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      released.disconnect()
      grows?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pageshow', rewind)
      window.removeEventListener('click', onPress)
    }
  }, [])

  return null
}
