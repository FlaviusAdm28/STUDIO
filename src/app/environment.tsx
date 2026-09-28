import { site } from '@content'

/**
 * **The Environment.** One element, mounted once, behind everything, for the whole session.
 *
 * `final-design-spec.pdf` §11.1 — the locked Environment contract — in one sentence: *"One element,
 * mounted at the Hero, **never unmounted, never re-sourced, never `display:none`**. Sections change its
 * grade, its transform and its playbackRate — nothing else."* And §11.1's consequence, which is the
 * reason this file exists at all: *"no second surface, no iframe, no additional media element… A work
 * surface that replaces the environment — or an environment paused, hidden or re-sourced to make room
 * for it — breaks the law and the 08 → 09 lift together."*
 *
 * ## It is a server component and it has no state
 *
 * There is nothing here to be interactive about. The layers are static DOM; *which* of them is present is
 * six custom properties written on the root by `scroll-stage.tsx` from `src/motion/environment.ts`, and
 * `globals.css` is what reads them. So this file holds no narrative timing, no state calculation, no
 * scroll position, no junction logic, no typography and no opinion about the Ledger — it is the DOM the
 * projection is projected onto.
 *
 * That is also why it renders before everything else in `page.tsx`: it is behind the film and behind the
 * publication, and being first in the document is half of what puts it there. The other half is
 * `z-index` in `globals.css`.
 *
 * ## The hero video lives here now, and that is the one structural move C5 makes
 *
 * It was inside `opening.tsx`, which meant it was inside the film's pinned frame and could not outlive
 * it. `opening.tsx` still **drives** it — the clock, `data-lit`, the play at `MOTION`, and the footage
 * gate on the subtitle are all unchanged and all still the opening's — it simply reaches the element by
 * `.env-hero` rather than by owning it. Nothing about Chapter I's sequence moved; only the element's
 * parent did. `implementation-reconciliation.md` C5.
 *
 * ## Three plates and no fourth
 *
 * §5, locked by §11.2: *"Three plates ship: `hero`, `venice`, `studio`."* Each is a layer that is always
 * mounted and never re-sourced; a state changes how present it is, never what it is. State 13 is the
 * **hero** layer under its own crop and grade, which is what makes the locked 13 → 14 a change on one
 * negative rather than a swap — see `site.environment`.
 *
 * The venice layer is drawn only where the active project has a plate. `null` composes: the layer is
 * absent, the grounds beneath it still stand, and nothing is ever seen to be missing.
 */
export default function Environment() {
  const { hero, venice, method, studio } = site.environment

  return (
    /*
      `aria-hidden` and out of the tab order throughout. This is a ground, not content: everything it is
      saying is said by the page in front of it, and a screen reader that announced a photograph here
      would be announcing the light in the room.
    */
    <div className="environment" aria-hidden="true">
      {/*
        The hero, and it is the footage. Muted, and it stays muted — `04-visual-language.md` §8, sound
        never starts on its own. The footage was cut to loop, so it simply loops: native `loop`, no seam
        handling, nothing laid over the restart.

        `data-lit` is written by `opening.tsx` and is Chapter I's own arrival of the image. It is not the
        plate's presence — that is `--env-hero` on the layer around it — and the two multiply by nesting,
        so the opening's reveal and the environment's plate selection can never fight over one property.

        No `playbackRate` is set anywhere: §11.1 permits the channel and the design exercises it nowhere,
        so it is 1, which is what a `<video>` is by default. C5's preflight P2.
      */}
      <div className="env-plate env-plate-hero">
        <video
          className="env-hero"
          src={hero.src}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        {/*
          **The frame Contact's listening comes to rest on** — design owner, 26 September 2026: *"a
          pausa deve parecer uma escolha cinematográfica, não uma consequência técnica do cursor."* The
          same file, never played: `contact-listen.tsx` parks it on `TIMING.contact.listens.holdAt`, and
          the live footage dissolves into it as it slows — the loop's own grammar of one shot dissolving
          into the next. Same plate, same framing, so the two are one picture when they meet.
        */}
        <video
          className="env-hero-still"
          src={hero.src}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/*
        Venice — the ground for states 06–09, and the one layer that pans. The 20% is in `globals.css`,
        because how far a plate travels across a frame is a distance in a composition; `--env-pan` only
        says how far along it is. C5's preflight P1.

        **A bare `<img>` rather than `next/image`, and the lint rule is overridden rather than obeyed.**
        `next/image` emits a `srcset`, and a `srcset` is a source the *browser* re-chooses when the
        viewport or the pixel ratio changes. §11.1 says *never re-sourced*, and a plate that reloads at a
        different width mid-session is exactly the swap that voids the contract. So the element declares
        one file and keeps it.

        The cost is real and is not hidden: these are 1.8MB and 2.3MB PNGs served as authored, where the
        optimiser would have made them a tenth of that. Pre-encoding the production plates is delivery
        work and belongs with visual QA — it changes the bytes, never the number of sources.
      */}
      {/*
        The studio — the ground for states 10–12, and the photograph that used to be an inset inside
        About. `width` and `height` are the file's own, so the layer knows its ratio before the bytes
        arrive. C5's preflight P3.

        **Beneath venice, not above it** — 16 September 2026. 09 → 10 is the only junction between
        them, and it is a dissolve *out of whatever ground the Work is standing on*: the studio waits
        underneath, whole, and the Work's ground — venice or an experience plate — clears off it. With
        the studio above, only venice could be dissolved, and any other experience had to be taken away
        first, which put venice back on screen for a moment whatever the visitor had been looking at.
      */}
      {/*
        **The same room, once the person has left.**

        It is *beneath* the studio plate and that ordering is the whole mechanism: across 10 → 11 this
        stands whole while the plate above it clears off it, so what dissolves is the one thing the two
        frames do not share — the person at the desk. The lamp, the wall, the plant and the books are in
        both, pixel for pixel, so nothing about them so much as flickers.

        There is no animation here and none was added. `environment.ts` crosses the two on the dissolve
        it already uses for 09 → 10, and §2's own exposure goes on falling underneath it, which is the
        light in the room going down while the room empties.
      */}
      <div className="env-plate env-plate-method">
        {/* eslint-disable-next-line @next/next/no-img-element -- §11.1: one source, never re-chosen. */}
        <img
          className="env-studio env-method"
          src={method.src}
          width={method.width}
          height={method.height}
          alt={method.alt}
          decoding="async"
        />
      </div>

      <div className="env-plate env-plate-studio">
        {/* eslint-disable-next-line @next/next/no-img-element -- §11.1: one source, never re-chosen. */}
        <img
          className="env-studio"
          src={studio.src}
          width={studio.width}
          height={studio.height}
          alt={studio.alt}
          decoding="async"
        />
      </div>

      {venice.src !== null && (
        <div className="env-plate env-plate-venice">
          {/* eslint-disable-next-line @next/next/no-img-element -- §11.1: one source, never re-chosen. */}
          <img className="env-venice" src={venice.src} alt={venice.alt} decoding="async" />
        </div>
      )}


      {/*
        ── The Work's experiences — C13, 7 September 2026 ───────────────────────────────────────────

        **A fourth plate, and it is a considered departure from §11.2.** The spec says *"three plates
        ship: hero, venice, studio"*, and that was true of a Work showing one project. The design owner
        has made the Work an editorial carousel of the studio's experiences, each with its own
        photograph, so the ground now has to be able to show more than three things. The register is
        `implementation-reconciliation.md` C13.

        **It is here rather than in the film layer, and that is not a preference.** The first attempt
        drew it inside `.v2` — measured in Chrome, `.v2` is at **0.84** by the time the Work is
        composed, because the film is already clearing into the publication. Anything inside it is
        therefore composited *over* the Environment, and the venice plate showed straight through the
        artist's photograph: the Salute's domes were legible across a studio wall. A ground has to be
        opaque, so a ground belongs to the Environment.

        Being here also puts it beneath `.v2-rail-grade`, which is what keeps the Ledger's index legible
        over whatever photograph is showing rather than only over venice's dark water.

        **Which experience is showing is not a function of position**, so this plate is the one thing in
        the Environment that `motion/environment.ts` does not decide: `work-experiences.tsx` writes
        `--exp-src` and `--exp-at` on the root when the visitor presses an arrow. The Environment still
        owns the ground; the Work owns which one.

        **Two boxes, because two different things decide this plate and they must not share a
        transition.** The outer is the section's own presence — scroll, and therefore a pure function of
        position with nothing eased on it. The inner is which experience the visitor chose — a press,
        and therefore a dissolve. Putting both on one element gave the scroll term the press's 1250ms,
        so scrolling out of the Work fast left the artist's photograph lingering over the publication's
        ground after its own type had gone. It is the identical split `.v2-make-slot` and
        `.v2-make-word` already make for the category, and for the identical reason.
      */}
      <div className="env-plate env-plate-experience" aria-hidden="true">
        <div className="env-experience-image" />
      </div>

      {/*
        **The room going down while the work is changed.**

        It is above every plate and below §2's ground, so it dims whichever photograph the Work is
        standing on — venice for the first experience, this layer's own plate for the rest — without
        either of them knowing about it. That is what makes the exchange one language for any
        `Work A → Work B`: the dim does not care which plate is underneath it, and there is no case in
        the code for the first experience.

        **It is the Environment's and not the Work's.** `.v2` is at 0.84 by the time the Work is
        composed, so a scrim drawn inside the film layer would composite over the ground rather than be
        one — the identical fault that put venice through the artist's photograph, recorded in C13.
      */}
      <div className="env-experience-dim" aria-hidden="true" />

      {/*
        §2's own ground, where §2 gives one — `#060605` at state 04 and `#050504` at state 05, the two
        frames it hands a ground instead of a plate. It is **over** the plates rather than under them,
        because 04 → 05 is a hold and what holds is the plate: the warm dark stands in front of a hero
        that has not gone anywhere, which is the difference between a ground and a swap.

        Nothing is visible through it today at those two states — the film's own `--dusk` is at 1.00 by
        state 03 and paints pure black over the whole frame — so this is the contract being expressible
        rather than the contract being seen. That is C4's, at the junctions.
      */}
      {/*
        **The method's room.** The one ground on this site that used to be painted by its own section,
        and therefore the one that used to travel: `.method` is a 6,500px box in ordinary flow, so the
        soft top edge of its ink moved 900px up the screen across About → Method while the photograph
        behind it stood still. Fixed here, it cannot move, and the passage happens inside a frame that
        is genuinely locked.

        It is over the plates and under §2's own ground, for the same reason `.env-experience-dim` is:
        it dims whichever photograph the room is standing on without either of them knowing about it.
        `--m-room-at` is the section's own `--mroom`, published on the root by `scroll-stage.tsx`.
      */}
      <div className="env-room" aria-hidden="true" />

      <div className="env-ground" />

      {/*
        **The rail's legibility field.** It belongs to the photograph rather than to the menu, which is
        why it is a layer of the Environment and not a surface behind the Ledger: it composites with the
        plates, it is under everything else on the page, and its strength is a measurement of whatever
        plate is currently standing behind the rail. `src/motion/environment.ts` holds the measurements
        and the curve; `globals.css` holds the shape. This file only says the Environment has one.
      */}
      <div className="env-legibility" aria-hidden="true" />
    </div>
  )
}
