'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { railFieldFor } from '@/motion/environment'
import { site, projects } from '@content'
import { TIMING, clamp01, smoothstep } from '@/motion'

/**
 * **The Work — what the studio actually makes, one category at a time.**
 *
 * C13 (7 September 2026) made the Work an editorial section on the photograph the film ends on; C14
 * (16 September 2026, design owner, the Q2 exploration — *fila que roda*) decides how the categories
 * are navigated. The record is `docs/design/v2/implementation-reconciliation.md` C14.
 *
 * ## The category word is the index
 *
 * ```
 *   WHAT WE ACTUALLY MAKE
 *   ART   EXHIBITION   PERFORMANCE        ← the queue: the next category first, filling with time
 *   Wedding experiences                   ← the active category: the headline, never in the queue
 * ```
 *
 * The category that is showing is the headline and is **not** in the row, so the small word and the
 * large one are never the same claim at the same time: the small word is a category preparing, the
 * headline is the category standing. The first word fills across `TIMING.work.queue.holds`; when it is
 * full it is promoted —
 *
 *   1. it leaves the row on the dip's own `out`, as the headline leaves the frame;
 *   2. the row moves up while the frame is empty, and the category that was showing re-enters at the
 *      tail;
 *   3. the content — headline, caption, photograph — changes on the dip's own signal, in the gap;
 *   4. once the new headline has arrived, the next word starts to fill.
 *
 * **The headline never travels.** It stays on the left margin at its own height; the row moves, and
 * only horizontally, only inside itself. No dots, no counter, no arrows, no bars.
 *
 * ## Two axes, and scroll is still only one of them
 *
 * Scroll owns entry and exit of the section and nothing else: it never changes the category. The queue
 * runs on a clock, which C8 reserves for what the visitor did not cause, and **only while the section is
 * composed** (`data-work`). Pressing a word completes it and promotes it — the press follows the same
 * rule the clock does — and the queue carries on from there.
 *
 * ## What is state and what is not
 *
 * `at` is the category being shown or about to be; `row` is the category the row treats as active and
 * follows `at` once the promoted word has left; `shown` is what the content displays and changes inside
 * the gap. The fill is **not** React state — it is written to one custom property every frame, the way
 * the driver writes scroll, so the clock never re-renders the section.
 */

type ProjectId = keyof typeof projects

const { makes } = site.three.work
const categories = makes.categories
const count = categories.length
const wrap = (i: number) => ((i % count) + count) % count
const workOf = (i: number) => projects[categories[i].work as ProjectId]
/** The optional line above the name — only some captions carry one. */
const labelOf = (work: ReturnType<typeof workOf>) => ('label' in work.context ? work.context.label : null)
const linesOf = (work: ReturnType<typeof workOf>) =>
  work.context.meta.length + (work.experienceUrl ? 1 : 0) + (labelOf(work) ? 1 : 0)

/*
  **The tallest caption, chosen rather than named** — the most lines, counting the offer where the work
  has somewhere to go and the line above the name where there is one. `.v2-ident-set`s are stacked on
  one origin so the corner cannot shift when the category changes, which leaves `.v2-ident` itself
  measuring zero; this copy, in flow and hidden, is what gives it a height. The same construction `.v2-make-ghost` uses, for the same reason.
*/
const tallest = categories
  .map((_, i) => workOf(i))
  .reduce((a, b) => (linesOf(b) > linesOf(a) ? b : a))

const longest = categories.map((c) => c.headline).reduce((a, b) => (b.length > a.length ? b : a))

export default function WorkExperiences() {
  const [at, setAt] = useState(0)
  const [row, setRow] = useState(0)
  const [shown, setShown] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const [live, setLive] = useState(false)
  /*
    Lab, `?sheet=next` only. **What is selected and what is presented are two things.** `at` is the
    carousel's own state — the category the queue has reached — and nothing here ever changes it. While
    the Opening still owns the arrival (`data-sheet-title='page'`), the section *presents* its first
    category: the photograph the film ends on, that work's caption and that work's queue, because that is
    the composition `A memory.` is carried into. When the Opening hands over, the section goes to the
    category it really holds by its own exchange — the dip — exactly as if the queue had promoted it; and
    when the Opening takes the arrival back, it returns to the first by the same exchange.
  */
  const [owned, setOwned] = useState(false)
  const target = owned ? 0 : at
  const [widths, setWidths] = useState<number[]>([])

  const queue = useRef<HTMLDivElement>(null)
  const words = useRef<(HTMLButtonElement | null)[]>([])

  /*
    Everything the frame loop reads. Refs rather than state because the loop runs every frame and must
    not re-render anything; `at` and `swapping` are mirrored here from state for the same reason.
  */
  const clock = useRef({
    at: 0,
    swapping: false,
    held: false,
    elapsed: 0,
    /** The word the clock is filling, or -1 while an exchange runs. */
    next: count > 1 ? 1 : -1,
    /** A word the visitor pressed, completing on its own short ramp; -1 otherwise. */
    pressed: -1,
    pressedFill: 0,
    /** The word that has just been promoted and is leaving the row, full. */
    leaving: -1,
  })

  const paint = () => {
    const c = clock.current
    const p = clamp01(c.elapsed / TIMING.work.queue.holds)
    words.current.forEach((el, i) => {
      if (!el) return
      let fill = 0
      if (i === c.leaving) fill = 1
      else if (i === c.pressed) fill = c.pressedFill
      else if (i === c.next) fill = p
      el.style.setProperty('--p', String(fill))
    })
  }

  const promote = (i: number) => {
    const c = clock.current
    if (c.swapping || i === c.at) return
    c.leaving = i
    c.pressed = -1
    c.next = -1
    c.elapsed = 0
    c.swapping = true
    paint()
    setAt(i)
  }

  /*
    ── Whether the section is composed ─────────────────────────────────────────────────────────────

    `data-work` is the driver's own answer to *is the Work on screen*, and it gates two things: whether
    the clock runs, and whether the words can be pressed or reached by keyboard. It never resets the
    category — the design owner ruled that scroll does not change what is showing.

    `--state` and an `IntersectionObserver` are both wrong gates, measured: the Work is composed across
    the tail of junction 08 → 09 where the state is still 8, and `.v2` is a fixed layer that intersects
    the viewport from the first frame of the session.
  */
  useEffect(() => {
    const root = document.documentElement
    /*
      Lab, `?sheet=next` only (`data-sheet-title` is written by nothing else): while the Opening still
      owns the headline's line the section is not yet the Work's, so the queue does not count and its
      words are not pressable. The clock starts at the hand-over, from zero, at its own 8 seconds.
    */
    const read = () => {
      const page = root.dataset.sheetTitle === 'page'
      setOwned(page)
      setLive(root.dataset.work === 'on' && !page)
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['data-work', 'data-sheet-title'] })
    return () => mo.disconnect()
  }, [])

  /*
    ── The clock ────────────────────────────────────────────────────────────────────────────────────

    Runs only while the section is composed. Leaving the section stops it and empties the fill, so a
    return starts the category's time again rather than promoting on arrival.

    The step is clamped: a frame loop that adds the raw delta leaps after a stall — a background tab,
    a long task — and would promote a category the visitor never saw fill. Under reduced motion the
    queue does not advance on its own; the words stay pressable.
  */
  useEffect(() => {
    const c = clock.current
    if (!live) {
      c.elapsed = 0
      paint()
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const step = Math.min(now - last, 64)
      last = now
      if (c.pressed < 0 && !c.swapping) {
        c.next = count > 1 ? wrap(c.at + 1) : -1
        if (!c.held && !reduced.matches && c.next >= 0) c.elapsed += step
        if (c.elapsed >= TIMING.work.queue.holds) {
          c.elapsed = TIMING.work.queue.holds
          paint()
          promote(c.next)
        }
      }
      paint()
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
    // `paint` and `promote` read refs only; the loop is rebuilt when the section's presence changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live])

  /*
    ── A press ──────────────────────────────────────────────────────────────────────────────────────

    The word completes before it is promoted — from wherever the clock had it, if it was the one
    filling. The press shows the rule rather than cutting past it: a word enters when it is full.
  */
  const press = (i: number) => {
    const c = clock.current
    if (c.swapping || c.pressed >= 0 || i === c.at) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = i === c.next ? clamp01(c.elapsed / TIMING.work.queue.holds) : 0
    const span = reduced ? 0 : TIMING.work.queue.completes
    c.pressed = i
    c.pressedFill = from
    c.next = -1
    let t0 = -1
    const ramp = (now: number) => {
      if (t0 < 0) t0 = now
      const k = span > 0 ? clamp01((now - t0) / span) : 1
      c.pressedFill = from + (1 - from) * smoothstep(k)
      paint()
      if (k < 1) window.requestAnimationFrame(ramp)
      else promote(i)
    }
    window.requestAnimationFrame(ramp)
  }

  /*
    ── The exchange ─────────────────────────────────────────────────────────────────────────────────

    **One attribute carries the dip** — `data-swapping` on the root, which the headline, the caption and
    the Environment's dim all read — and three moments inside it:

      out                  the promoted word has left with the headline → the row recomposes
      out + exchange.at    the frame is empty and at the dim floor → the content changes, all of it
      out + gap + in       the new headline has arrived → the next word starts to fill

    Guarded by the previous value rather than a mounted flag, so a development double-invocation of the
    effect cannot run an exchange on mount.
  */
  useEffect(() => {
    clock.current.at = at
  }, [at])

  /*
    Keyed on what is to be *presented* (`target`), which is `at` everywhere but in the lab's
    `?sheet=next`, where the Opening's arrival presents the first category. An exchange the queue did
    not start — the hand-over, either way — is marked exactly as `promote` marks its own, so the clock
    waits for it and the word that becomes the headline leaves the row full.
  */
  const previous = useRef(target)
  useEffect(() => {
    if (previous.current === target) return
    previous.current = target
    const k = TIMING.work.carousel
    const root = document.documentElement
    const c = clock.current
    c.leaving = target
    c.pressed = -1
    c.next = -1
    c.elapsed = 0
    c.swapping = true
    paint()
    setSwapping(true)
    root.dataset.swapping = '1'
    const timers = [
      window.setTimeout(() => setRow(target), k.out),
      window.setTimeout(() => setShown(target), k.out + k.exchange.at),
      window.setTimeout(() => {
        setSwapping(false)
        root.dataset.swapping = '0'
      }, k.out + k.gap),
      window.setTimeout(() => {
        c.leaving = -1
        c.elapsed = 0
        c.swapping = false
      }, k.out + k.gap + k.in),
    ]
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [target])

  /*
    ── The row's measure ────────────────────────────────────────────────────────────────────────────

    The words are placed from their own widths, which change with the viewport (the type is `clamp`ed
    on `vw`) and with the face loading. Observed rather than read once — a width read at mount goes stale
    the moment the frame changes size.
  */
  useLayoutEffect(() => {
    const measure = () => setWidths(words.current.map((el) => (el ? el.getBoundingClientRect().width : 0)))
    measure()
    const ro = new ResizeObserver(measure)
    words.current.forEach((el) => el && ro.observe(el))
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  /*
    ── The row's order ──────────────────────────────────────────────────────────────────────────────

    **The next category is always first**, directly above the headline it will become; the rest follow
    in the order they will come; the category that is showing is last and not drawn. When `row` moves,
    the promoted word — already gone — is placed at the tail without a transition, and everything else
    slides to its new place while the returning word writes itself in.

    If the row is wider than the room the frame leaves it, it runs on past the edge and fades there
    rather than wrapping: the queue continues, it does not become a second line.
  */
  const placed = useRef(row)
  useLayoutEffect(() => {
    const el = queue.current
    if (!el || widths.length !== count) return
    const from = placed.current
    const jumped = from !== row ? row : -1
    /*
      Lab, `?sheet=next` only. **A step the queue did not take is not a promotion.** The Opening's
      hand-over moves the row by something other than one place forward — back to the first category,
      or straight to the one the carousel holds — and then the category that was showing does not
      re-enter at the tail: it re-enters ahead of words that are standing. Sliding it there from the
      tail carried it through them. Measured on 6 October 2026 at 390 and 1440: `Artists` crossed
      `Weddings` (0 → 2) and `Selected Projects` (1 → 0), two words legible on top of each other for
      150–210ms and up to 57px. So on those steps it is placed where it re-enters while it is still
      not drawn, and only its ink arrives. The queue's own step, one place forward, is untouched.
    */
    const enters =
      jumped >= 0 && row !== wrap(from + 1) && document.documentElement.dataset.next === 'on' ? from : -1
    placed.current = row
    /*
      Marked before anything here reads a style. The word's ink is already on its way in this commit,
      and the first style read starts that arrival on whatever rule matches then: measured in Chrome,
      with the mark set after the row's font size had been read, the arrival ran on the row's own
      timing and the two words shared the place at part ink for ~150ms.
    */
    const entering = enters >= 0 ? words.current[enters] : null
    entering?.setAttribute('data-enters', '')
    const gap = parseFloat(getComputedStyle(el).fontSize) * 1.6
    let x = 0
    for (let k = 1; k <= count; k++) {
      const i = wrap(row + k)
      const word = words.current[i]
      if (!word) continue
      if (i === jumped) word.dataset.instant = ''
      /* Never left over from an arrival that did not finish: the row's own rules apply unless set above. */
      if (jumped >= 0 && i !== enters) delete word.dataset.enters
      word.style.setProperty('--x', `${x}px`)
      if (i !== row) x += widths[i] + gap
    }
    const room = window.innerWidth - el.getBoundingClientRect().left - 16
    const runs = x - gap > room
    if (runs) {
      el.dataset.overflow = ''
      el.style.setProperty('--queue-room', `${room}px`)
    } else {
      delete el.dataset.overflow
    }
    if (jumped >= 0) {
      const word = words.current[jumped]
      if (word) {
        void word.offsetWidth
        delete word.dataset.instant
      }
      /*
        Kept until its ink has arrived, not dropped at once like `data-instant`: the wait is part of
        the arrival and the rule is the only place it is stated. Dropped when the arrival ends or is
        cancelled, so the word is back on the row's rules before anything else can happen to it.
      */
      if (entering) {
        const arrived = (e: TransitionEvent) => {
          if (e.target !== entering || e.propertyName !== 'opacity') return
          delete entering.dataset.enters
          entering.removeEventListener('transitionend', arrived)
          entering.removeEventListener('transitioncancel', arrived)
        }
        entering.addEventListener('transitionend', arrived)
        entering.addEventListener('transitioncancel', arrived)
      }
    }
  }, [row, widths])

  /*
    ── The ground ───────────────────────────────────────────────────────────────────────────────────

    **The photograph is the Environment's, not this component's.** `--exp-src` and `--exp-at` are
    written on the root and `.env-plate-experience` draws them. The first category stands on the plate
    the film ends on, so that layer stays transparent for it — the entry into the Work is a bridge, not
    a cross-fade. `.v2` is at 0.84 by the time the Work is composed, so a plate drawn in here would
    composite over the ground instead of being one; measured in Chrome.
  */
  useEffect(() => {
    const root = document.documentElement
    const first = shown === 0
    root.style.setProperty('--exp-at', first ? '0' : '1')
    if (!first) root.style.setProperty('--exp-src', `url(${workOf(shown).plate})`)
    /*
      **And how much wash the rail needs over this plate — and nothing else about the rail.** This is
      the one ground on the site that changes on time rather than on scroll, so the Environment cannot
      measure it; the project's `lum` is in `content/site.ts` and the curve is `motion/environment.ts`.
      The rail's *ink* is not the Work's to choose: the rail is the site's navigation and keeps one
      register over every category (design owner, 26 September 2026). Written inside the film's own
      dip, on the same beat as the category, so a change in the wash is never seen happening.
    */
    root.style.setProperty('--exp-field', String(railFieldFor(workOf(shown).rail.lum)))
  }, [shown])

  const hold = (held: boolean) => {
    clock.current.held = held
  }

  return (
    <div className="v2-work-type">
      <div className="v2-make">
        <p className="v2-make-label">{makes.label}</p>

        {/*
          ── The queue ────────────────────────────────────────────────────────────────────────────
          Each word is drawn twice on one origin: the waiting ink, and a full-ink copy uncovered from
          the left by `--p`. The fill is the word itself, not a mark beside it.
        */}
        <div
          ref={queue}
          className="v2-queue"
          aria-label={makes.label}
          aria-hidden={live ? undefined : true}
          onPointerEnter={() => hold(true)}
          onPointerLeave={() => hold(false)}
          onFocus={() => hold(true)}
          onBlur={() => hold(false)}
        >
          {categories.map((c, i) => {
            const state =
              i === row ? 'active' : i === target ? 'leaving' : !swapping && i === wrap(target + 1) ? 'next' : 'waiting'
            const reachable = live && (state === 'next' || state === 'waiting')
            return (
              <button
                key={c.word}
                ref={(el) => {
                  words.current[i] = el
                }}
                type="button"
                className="v2-queue-word"
                data-state={state}
                aria-label={c.headline}
                aria-hidden={reachable ? undefined : true}
                tabIndex={reachable ? undefined : -1}
                onClick={() => press(i)}
              >
                <span className="v2-queue-base">{c.word}</span>
                <span className="v2-queue-fill" aria-hidden="true">
                  {c.word}
                </span>
              </button>
            )
          })}
        </div>

        {/*
          The category, and it is the protagonist. A stack rather than a sequence: every headline is on
          one origin, with an invisible copy of the longest in flow, so the block's size never depends on
          which one is lit.
        */}
        <span className="v2-make-slot">
          <span className="v2-make-ghost" aria-hidden="true">
            {longest}
          </span>
          {categories.map((c, i) => (
            <span
              key={c.word}
              className="v2-make-word"
              data-lit={shown === i ? '1' : '0'}
              aria-hidden={shown === i ? undefined : true}
            >
              {c.headline}
            </span>
          ))}
        </span>
      </div>

      {/*
        ── The identification ─────────────────────────────────────────────────────────────────────
        Who and what the photograph is, and the way into it where there is one. Lower right, small: a
        caption on a picture rather than a title over it. The offer belongs to the work, so it lives
        here and is simply absent where the work has nowhere to go yet.
      */}
      <div className="v2-ident">
        <div className="v2-ident-ghost" aria-hidden="true">
          {labelOf(tallest) && <p className="v2-ident-line">{labelOf(tallest)}</p>}
          <p className="v2-ident-name">{tallest.context.identity}</p>
          {tallest.context.meta.map((line) => (
            <p className="v2-ident-line" key={line}>
              {line}
            </p>
          ))}
          {tallest.experienceUrl && <span className="v2-ident-open">{makes.cta}</span>}
        </div>

        {categories.map((c, i) => {
          const work = workOf(i)
          const lit = shown === i
          return (
            <div key={c.word} className="v2-ident-set" data-lit={lit ? '1' : '0'} aria-hidden={lit ? undefined : true}>
              {labelOf(work) && <p className="v2-ident-line">{labelOf(work)}</p>}
              <p className="v2-ident-name">{work.context.identity}</p>
              {work.context.meta.map((line) => (
                <p className="v2-ident-line" key={line}>
                  {line}
                </p>
              ))}
              {work.experienceUrl && (
                <a
                  className="v2-ident-open"
                  href={work.experienceUrl}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={lit && live ? undefined : -1}
                >
                  {makes.cta}
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
