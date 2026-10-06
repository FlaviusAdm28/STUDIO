'use client'

import { useEffect, useRef } from 'react'
import { site } from '@content'
import { MEMORY3, NEXT_MOVE, SHEET, at5, atOf, memory3On, nextOn, sheetOn, vpAt } from '@/motion/sheet'

/**
 * **The sheet · J2B on the real driver — integration lab only.**
 *
 * States 01 → 05 as one page: `Chapter One` counts to `Chapter II`, the line is filed into the head,
 * the thesis is written where the title stood, `Philosophy` completes the head, and the occasions
 * continue the page. `prototypes/the-sheet` (`?variant=j2b`) is the reference and this is its
 * arithmetic, unchanged.
 *
 * It owns no progression. `scroll-stage.tsx` hands it two numbers a frame — how far past the hero the
 * hand is, in viewports, and where the film is (`p`) — and everything that MOVES here is a pure
 * function of the first. What APPEARS is ink on short clocks, triggered by position and symmetric in
 * reverse. The page's leaving is triggered on junction 05's own position, on the film's existing
 * windows, so what follows it — the photograph, the camera, the rail, the Work — is untouched.
 */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const span = (v: number, [a, b]: readonly [number, number]) => clamp((v - a) / (b - a), 0, 1)
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function Sheet() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el === null || !sheetOn()) return
    const root = document.documentElement
    const q = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel)
    const early = q('.sh-early')
    const line = q('.sh-line')
    const word = q('.sh-word')
    const num = q('.sh-num')
    const sans = q('.sh-two-sans')
    const topic = q('.sh-topic')
    const thesis = q('.sh-thesis')
    const stack = q('.sh-stack')
    const occasions = [...el.querySelectorAll<HTMLElement>('.sh-occasion')]
    const survivor = q('.sh-survivor')
    const standin = q('.sh-standin')
    const memory3 = memory3On()
    if (memory3) el.setAttribute('data-memory3', '')
    /* NEXT — set before anything is measured: the Work's title has its new size under this attribute. */
    const next = nextOn()
    if (next) {
      el.setAttribute('data-next', '')
      root.dataset.next = 'on'
    }
    const film = el.parentElement
    const ground = next ? document.querySelector<HTMLElement>('.environment') : null
    /* Lab only: `&lag=0` shows the rewriting without the trailing edge, for comparison. */
    const lagParam = new URLSearchParams(window.location.search).get('lag')
    const LAG = lagParam === null ? null : Number(lagParam)
    const plate = next ? document.querySelector<HTMLElement>('.env-plate-venice') : null
    if (!early || !line || !word || !num || !sans || !topic || !thesis || !stack) return

    const probe = (text: string, css: Partial<CSSStyleDeclaration>) => {
      const p = document.createElement('span')
      p.className = 'sh-probe'
      p.textContent = text
      Object.assign(p.style, css)
      el.appendChild(p)
      const w = p.getBoundingClientRect().width
      p.remove()
      return w
    }

    type Geometry = {
      axis: number
      T: number
      L: number
      Lt: number
      heroTop: number
      thH: number
      gapHead: number
      gapOcc: number
      top1: number
      lift: number
      topicX: number
      wordEm: number
      ocFs: number
      /** The Work's title, as the page finds it: its box relative to the page, and its setting. */
      title: { x: number; y: number; fs: number; lh: number } | null
      survivorTop: number
    }
    let G: Geometry | null = null

    const measure = () => {
      const W = el.clientWidth
      const H = el.clientHeight
      if (W === 0 || H === 0) return
      const rem = 16
      /* The project's own tokens: `--x196`, `--v2-title-size`, `--lockup`, and the title's baseline at 462 / 760. */
      const axis = clamp(0.20024 * W - 92.34, 0.08 * W, (196 / 1440) * W)
      const T = clamp(Math.max(0.02407 * W + 33.51, (96 / 1440) * W), 2 * rem, 8 * rem)
      const L = clamp((16 / 1440) * W, 0.75 * rem, 1.25 * rem)
      const Lt = (L * 12.5) / 11
      const heroTop = (462 / 760) * H - 0.76 * T

      thesis.style.maxWidth = `${W <= 820 ? W - axis - 0.03 * W : (1000 / 1440) * W}px`
      const thFs = parseFloat(getComputedStyle(thesis).fontSize)
      const ocFs = thFs * (W <= 820 ? 0.78 : 0.62)
      for (const o of occasions) o.style.fontSize = `${ocFs}px`
      /* MEMORY3 carries the survivor inline; it is measured at rest. */
      if (survivor !== null) {
        survivor.style.lineHeight = ''
        survivor.style.transform = ''
      }
      const thH = thesis.offsetHeight
      const ocH = stack.offsetHeight
      const gapHead = thFs * 0.9 + L
      const gapOcc = thFs * 0.82

      let top1 = heroTop + (T - thFs) * 0.18
      top1 = Math.min(top1, H * 0.9 - thH)
      const total = L + gapHead + thH + gapOcc + ocH
      const top2 = Math.max(H * 0.1, (H - total) / 2) + L + gapHead
      const lift = Math.max(0, top1 - top2)

      const numW = probe('II', {
        fontFamily: 'var(--v2-sans)',
        fontSize: `${L}px`,
        letterSpacing: '0.42em',
        textTransform: 'uppercase',
      })
      topic.style.fontSize = `${Lt}px`
      const wordEm = probe(site.two.marker.word, { fontFamily: 'var(--v2-serif)', fontWeight: '300', fontSize: '100px' }) / 100 + 0.24
/*
        MEMORY3 — the Work's title is measured, never restated: its box and its setting are read from
        the Work's own element, so the slot `A memory.` is carried into is the title's by construction.
      */
      let title: Geometry['title'] = null
      const real = memory3 ? document.querySelector<HTMLElement>('.v2-make-word') : null
      if (real !== null && standin !== null) {
        const r = real.getBoundingClientRect()
        const box = el.getBoundingClientRect()
        const cs = getComputedStyle(real)
        const fs = parseFloat(cs.fontSize)
        const lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight)
        title = { x: r.left - box.left, y: r.top - box.top, fs, lh }
        standin.textContent = real.textContent
        if (next) {
          /* The rewriting's edge: how soft it is, and how far it has to travel. */
          /*
            Seen at 2×: with a half-em edge that eased in and out ON the line, `W` and `A` stood on
            top of each other for a tenth of a second at either end ("XA memory."). The edge is now a
            fifth of an em — narrower than a letter — and it starts and stops clear of the line, so
            its slow first and last moments are spent where there is nothing to double.
          */
          feather = fs * 0.2
          el.style.setProperty('--sh-feather', `${(fs * 0.2).toFixed(1)}px`)
          el.style.setProperty('--sh-clear', `${(fs * 0.9).toFixed(1)}px`)
          /* The new line's ink trails the old line's leaving by this much, so `W` is not read on top of `A`. */
          el.style.setProperty('--sh-lag', `${(fs * (LAG ?? 0.3)).toFixed(1)}px`)
          el.style.setProperty('--sh-wipe-end', `${Math.ceil(r.width)}px`)
          /* Where the edge stands once the new line is whole: its far end, plus what trails the edge. */
          written = Math.ceil(r.width) + fs * (LAG ?? 0.3) + fs * 0.2
        }
        Object.assign(standin.style, {
          transform: `translate(${title.x.toFixed(2)}px, ${title.y.toFixed(2)}px)`,
          left: '',
          top: '',
          marginTop: '',
          paddingTop: '',
          fontSize: cs.fontSize,
          lineHeight: `${lh}px`,
          letterSpacing: cs.letterSpacing,
          fontFamily: cs.fontFamily,
          fontWeight: cs.fontWeight,
          color: cs.color,
        })
        /*
          **NEXT — the page's line is placed the way the title is placed, not merely where it is.**
          Measured on 6 October 2026 at 768 × 900: the two boxes agreed to a hundredth of a pixel and
          the two renderings did not — at the hand-over `Wedding experiences` dropped one whole pixel
          (1,496 pixels changed; the Work's line was the page's shifted down by one). The cause is
          where the fraction is rounded. The title is painted through its block's own transform
          (`.v2-make`, `translateY(-50%)`, a fractional distance), from that block's origin; the
          page's line had one translation of its own to the title's final place. Same sum, rounded
          in two different places, so it agreed at some widths (1440, 390) and not at others.

          So the line is laid out from the same origin and carried by the same transform: the
          block's untransformed corner, the block's transform, and the title's own offset inside
          the block as padding (which also keeps the mask's box over the whole letter, as the
          0.34em did). Pixel-identical to the Work's own line at 390, 768 and 1440. Where the title
          has no transformed block above it, or is too close to its top, the old placement stands.
        */
        if (next) {
          let host: HTMLElement | null = real.parentElement
          while (host !== null && getComputedStyle(host).transform === 'none') host = host.parentElement
          if (host !== null) {
            const m = new DOMMatrix(getComputedStyle(host).transform)
            const hr = host.getBoundingClientRect()
            const inset = r.top - hr.top
            if (m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && inset >= fs * 0.34) {
              Object.assign(standin.style, {
                transform: `translate(${m.e}px, ${m.f}px)`,
                left: `${r.left - m.e - box.left}px`,
                top: `${hr.top - m.f - box.top}px`,
                marginTop: '0px',
                paddingTop: `${inset}px`,
              })
            }
          }
        }
      }
      /* Where `A memory.` stands inside the stack, before it is carried. */
      /* Its text's own top: in `next` the element carries block padding so its mask cannot cut a descender. */
      const survivorTop = survivor !== null ? survivor.offsetTop + parseFloat(getComputedStyle(survivor).paddingTop) : 0
      G = { axis, T, L, Lt, heroTop, thH, gapHead, gapOcc, top1, lift, topicX: axis + numW + L * 0.55, wordEm, ocFs, title, survivorTop }
    }

    /* Ink: triggers by position, drawn by the stylesheet's clocks. */
    const since = [0, 0, 0]
    const on = [false, false, false]
    let pending = false
    /* MEMORY3 — when the title last let go of the slot, and how much ink an element really has. */
    let titleOffAt = -1
    /* NEXT — when the page last began to let go: the carry waits for the lines above the word to be gone. */
    let leavingAt = -1
    /* NEXT — the rewriting's edge position at which `Wedding experiences` is whole (set by `measure`). */
    let written = 0
    /* NEXT — backward: whether the page's new line still has ink in the slot, and when it last gave the slot back. */
    let lineOut = false
    let givenBackAt = -1
    let feather = 0
    /* NEXT — the Work's first headline: the page takes the line back only while this is the one lit. */
    const firstWord = next ? document.querySelector<HTMLElement>('.v2-make-word') : null
    const inkOf = (node: HTMLElement | null): number => {
      let ink = 1
      for (let e: HTMLElement | null = node; e !== null && e !== document.documentElement; e = e.parentElement) {
        const cs = getComputedStyle(e)
        if (cs.visibility === 'hidden' || cs.display === 'none') return 0
        ink *= parseFloat(cs.opacity)
      }
      return node === null ? 0 : ink
    }
    let last: [number, number] = [0, 0]

    const flag = (name: string, value: boolean) => {
      if (value) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '')
      } else if (el.hasAttribute(name)) el.removeAttribute(name)
    }

    const draw = (s: number, p: number, now: number) => {
      last = [s, p]
      if (G === null) return
      const g = G
      const kr = span(s, SHEET.recede)
      const k2 = smooth(span(s, SHEET.lift))
      const thesisTop = g.top1 - g.lift * k2
      const headY = thesisTop - g.gapHead - g.L

      /* The line: one element, filed. Anchored on its own left edge; geometric in size. */
      const fs = g.T * Math.pow(g.L / g.T, smooth(span(kr, SHEET.size)))
      const y = lerp(g.heroTop, headY, smooth(span(kr, SHEET.rise)))
      line.style.fontSize = `${fs.toFixed(3)}px`
      line.style.transform = `translate(${g.axis.toFixed(2)}px, ${y.toFixed(2)}px)`
      word.style.opacity = (1 - span(kr, SHEET.wordInk)).toFixed(3)
      const closes = smooth(span(kr, SHEET.closes))
      num.style.transform = `translateX(${(-g.wordEm * fs * closes).toFixed(2)}px)`

      /* The mark takes over at the serif's cap height, baseline and spacing, and relaxes by the landing. */
      const u = span(kr, [SHEET.swapAt, 1])
      const f = lerp(SHEET.cap, 1, u)
      sans.style.fontSize = `${f.toFixed(4)}em`
      sans.style.letterSpacing = `${lerp(SHEET.track, 0.42, u).toFixed(4)}em`
      sans.style.setProperty('--sh-mark-ink', lerp(0.76, 1, u).toFixed(3))
      sans.style.top = `${((0.8185 / f - 0.8623) * (1 - u)).toFixed(4)}em`

      topic.style.transform = `translate(${g.topicX.toFixed(2)}px, ${(headY + (g.L - g.Lt) * 0.86).toFixed(2)}px)`
      thesis.style.transform = `translate(${g.axis.toFixed(2)}px, ${thesisTop.toFixed(2)}px)`
      thesis.style.opacity = lerp(1, SHEET.thesisRests, k2).toFixed(3)
      stack.style.transform = `translate(${g.axis.toFixed(2)}px, ${(thesisTop + g.thH + g.gapOcc).toFixed(2)}px)`

      flag('data-counted', s >= SHEET.counts)
      /* NEXT — the first pixels of the first scroll are answered by the hand: `One` begins to give way before the count's clock. */
      if (next) el.style.setProperty('--sh-onset', (1 - 0.45 * span(s, [0, SHEET.counts])).toFixed(3))
      flag('data-swapped', kr >= SHEET.swapAt)
      flag('data-written', s >= SHEET.writes)
      flag('data-headed', s >= SHEET.heads)
      /* The hero's second level lets go with `One`, on the same clock. */
      if (s >= SHEET.counts) root.dataset.sheetCounted = ''
      else delete root.dataset.sheetCounted

      pending = false
      for (let i = 0; i < 3; i += 1) {
        const wanted = s >= SHEET.occasions[i]
        const prior = i === 0 || (on[i - 1] && now - since[i - 1] >= SHEET.chain)
        if (wanted && !on[i]) {
          if (prior) {
            on[i] = true
            since[i] = now
          } else pending = true
        } else if (!wanted && on[i]) on[i] = false
      }
      const count = on.filter(Boolean).length
      occasions.forEach((o, i) => {
        o.dataset.on = on[i] ? '1' : '0'
        o.style.setProperty('--sh-rank', String(count === 0 ? 1 : SHEET.ladder[clamp(2 - (count - 1 - i), 0, 2)]))
      })

      /* The page lets go on the film's own windows of junction 05; `A memory.` is the last to. */
      const at = at5(p)
      const leaving = at >= SHEET.releaseAt
      flag('data-leaving', leaving)
      if (!leaving) leavingAt = -1
      else if (leavingAt < 0) leavingAt = now
if (memory3 && survivor !== null && g.title !== null) {
        /*
          The carry is the hand's: up the axis into the title's slot, to the title's size and leading.
          The slot changing hands is ink, so it is a clock — out, then in, never together.
        */
        /*
          NEXT — the carry is one move across what used to be a wait, measured under the hand so it has
          one speed across the junction it spans; the veil over the photograph lifts on the same move.
        */
        const v0 = next ? vpAt(NEXT_MOVE.from[0], NEXT_MOVE.from[1]) : 0
        const fine = !window.matchMedia('(pointer: coarse)').matches
        const end = fine ? NEXT_MOVE.toFine : NEXT_MOVE.to
        const v1 = next ? vpAt(end[0], end[1]) : 1
        /* Eased out: it leaves promptly and settles; the picture (smoothstep) trails it by a little. */
        const t = span(s, [v0, v1])
        /*
          The title's slot is ABOVE the stack, so the word's way up crosses where `A wedding.` and
          `An artist.` stand — and those two leave on a half-second clock. At a slow hand they are long
          gone; at a fast one (watched: a flick carried the word straight through `An artist.`) the
          word would travel through lines that are still inked. So it is held for the first 220ms of
          their leaving and released over the next 380 — nothing at a walking pace, a short catch-up
          after a flick.
        */
        const clear = leavingAt < 0 ? 0 : smooth(clamp((now - leavingAt - 220) / 380, 0, 1))
        if (next && leaving && clear < 1) pending = true
        /*
          One trajectory for the two of them: the word's rise is half smoothstep, half ease-out — it
          leaves without a jolt and settles — and the photograph's sideways lead is the smoothstep of
          the same stretch, so both start together, both slow together, and the picture is never the
          faster of the two.
        */
        const rise = 0.5 * smooth(t) + 0.5 * (1 - (1 - t) * (1 - t))
        let k = next ? rise * clear : smooth(span(at, MEMORY3.promotes))
        if (next) {
          /*
            **Backward, the word waits in the slot for the line to be given back.** The rewriting is a
            clock (1s) and the carry is the hand's, so on the way back a quick hand took `A memory.`
            down the axis while `Wedding experiences` was still being unwritten above it: the line
            stood in two pieces on two baselines. Seen on 6 October 2026 on a backward flick, at 1440
            (`Wedding` in the slot, `…mory.` 15–20px lower, ~250ms) and at 390.

            So while the new line still has ink in the slot the word stays where it is being
            uncovered, and once the line is whole again it is released to where the hand is over the
            same 380ms the forward carry uses to catch up. Forward is untouched, and so is a slow
            hand: there the un-writing is over before the carry has moved the word at all.
          */
          const titledNow = atOf(6, p) >= NEXT_MOVE.rewritesAt
          if (titledNow) {
            lineOut = true
            givenBackAt = -1
          } else {
            if (lineOut) {
              const edge = parseFloat(getComputedStyle(el).getPropertyValue('--sh-wipe'))
              if (!Number.isFinite(edge) || edge <= -feather) {
                lineOut = false
                givenBackAt = now
              }
            }
            const back = lineOut ? 0 : givenBackAt < 0 ? 1 : smooth(clamp((now - givenBackAt) / 380, 0, 1))
            if (back < 1) pending = true
            k = 1 - (1 - k) * back
          }
        }
        if (next && plate !== null) {
          const lead = (fine ? NEXT_MOVE.lead.fine : NEXT_MOVE.lead.coarse) * smooth(t)
          plate.style.setProperty('--sh-lead', lead.toFixed(4))
        }
        if (next && film !== null) {
          const open = smooth(span(s, [v0 + (v1 - v0) * NEXT_MOVE.opensFrom, v1]))
          film.style.setProperty('--sh-open', open.toFixed(4))
          /* The plates change hands on the same move: the film holds the page, the photograph is born with the carry. */
          ground?.style.setProperty('--sh-open', open.toFixed(4))
        }
        const stackTop = thesisTop + g.thH + g.gapOcc
        const dy = g.title.y - (stackTop + g.survivorTop)
        const dx = g.title.x - g.axis
        survivor.style.transform = `translate(${(dx * k).toFixed(2)}px, ${(dy * k).toFixed(2)}px)`
        /*
          **NEXT — the word takes the title's setting one line before it arrives.** Seen on a wheel
          at 1440 (6 October 2026, and the same at every landing price): `A memory.` crept up into
          the slot and, on its very last frame, dropped one whole pixel — the final frame was the one
          before it shifted down by one, 1,113 pixels. Two things were placing the line. The carry is
          continuous; the size is not: a font's ascent is a whole number of pixels, so a growing word
          steps as it grows, and at 46px that last step falls at 45.996 — the size reached it on the
          same frame the word stopped, where nothing was moving to hide it.

          So the setting (size and leading) is complete while the word still has one line of the
          title to travel, and that last line is the carry alone — one system, sub-pixel, no step.
          The place the word is carried to, and how it gets there, are unchanged.
        */
        const set = next ? clamp(k / Math.max(0.5, 1 - g.title.lh / Math.max(Math.abs(dy), g.title.lh)), 0, 1) : k
        survivor.style.fontSize = `${lerp(g.ocFs, g.title.fs, set).toFixed(3)}px`
        survivor.style.lineHeight = `${lerp(g.ocFs * 1.24, g.title.lh, set).toFixed(3)}px`
        const at7 = atOf(7, p)
        /*
          Forward, the word goes out and the title is written after it. Backward, the title lets go
          first — the page's at once, the Work's own in the Work's own time — and the word is given the
          slot back only once that ink is actually gone, so the two are never read together.
        */
        if (next) {
          /*
            The line is rewritten in place (the stylesheet's wipe, on a clock), and the page owns the
            title until the Work's own is whole — the Work's is not drawn under it meanwhile, so there
            is never a second rendering of the line anywhere in the frame.
          */
          /*
            **One owner at a time, and the Opening is the first.** Measured on 6 October 2026: the
            page used to give the line up whenever the Work's queue had turned (`data-rotated`), and
            the queue's 8s clock ran from junction 07 @ 0.21 — before the hand-over. After one turn
            `A memory.` was rewritten into a hidden line and the slot stood empty for up to 4.6s.

            So the line is the page's from the carry until the hand-over, whatever the queue has
            done: it always reads the Work's first category, the narrative's entry into the Work.
            The Work is told (`data-sheet-title`) and its queue does not count until it is handed
            the line. And the hand-over waits for the rewriting to be whole, so the Work's own title
            is never drawn over a line that is still being written (a flick reached 07 @ 0.5 a fifth
            of a second into the wipe). Backward it is immediate: the page takes the line back whole.
          */
          flag('data-titled', atOf(6, p) >= NEXT_MOVE.rewritesAt)
          let handed = at7 >= NEXT_MOVE.handsAt
          if (handed && !el.hasAttribute('data-handed')) {
            const edge = parseFloat(getComputedStyle(el).getPropertyValue('--sh-wipe'))
            if (Number.isFinite(edge) && edge < written) {
              handed = false
              pending = true
            }
          }
          /*
            **The arrival and the line are handed over separately.** `data-sheet-title='page'` is the
            Opening owning the *arrival* — position alone decides it, and while it stands the Work
            presents its first category (the photograph, the caption and the queue `A memory.` is
            carried into), whatever its queue has reached. The *line* changes hands only where the
            Work's own headline reads the same words: forward that is at once, since the Work is
            still presenting its first category and then goes to the one it holds by its own exchange;
            backward the Work first returns to its first category — its exchange, its dip — and the
            page takes the line back in the dark of it. Never `Wedding experiences` over another
            category's frame, and never two lines.
          */
          /*
            …and only while the Work is in the frame at all. Seen on a backward flick: the hand was
            out of junction 07 before the Work's exchange had reached its dark, the page was still
            waiting for it, and the slot stood empty on Venice for over half a second. Before 07 there
            is no category's frame for the line to disagree with, so the page takes it at once, whole.
          */
          const within = at7 > 0
          flag('data-within', within)
          const wants = handed
          if (!wants && within && el.hasAttribute('data-handed') && firstWord !== null && firstWord.dataset.lit !== '1')
            handed = true
          flag('data-handed', handed)
          if (handed) root.dataset.sheetLine = 'work'
          else delete root.dataset.sheetLine
          if (!wants) root.dataset.sheetTitle = 'page'
          else delete root.dataset.sheetTitle
        }
        const titled = !next && atOf(6, p) >= MEMORY3.cedesAt
        if (!next) flag('data-titled', titled)
        if (next) {
          /* handled above */
        } else if (titled) {
          titleOffAt = -1
          flag('data-ceded', true)
        } else if (el.hasAttribute('data-ceded')) {
          if (titleOffAt < 0) titleOffAt = now
          const real = document.querySelector<HTMLElement>('.v2-make-word')
          if (now - titleOffAt >= 240 && inkOf(real) <= 0.03) flag('data-ceded', false)
          else pending = true
        }
        if (!next) flag('data-handed', at7 >= MEMORY3.handsAt)
      } else {
        flag('data-gone', at >= SHEET.deconAt)
      }

      if (pending) window.requestAnimationFrame((t) => draw(last[0], last[1], t))
    }

    const relayout = () => {
      measure()
      draw(last[0], last[1], window.performance.now())
    }
    /*
      MEMORY3 — the Work's queue is a clock. If it turns while the page's stand-in is still up (a visitor
      resting mid-arrival), the stand-in would name a category that is no longer the one showing: it
      stands only while the first category is the lit one.
    */
    /*
      NEXT never hides the page's line for a turn of the queue (`data-rotated` is memory3's). What it
      waits for is the Work returning to its first category on the way back — and that happens on the
      Work's clock, with the hand at rest — so the frame is redrawn when it does: no state is left
      stale while the visitor is not scrolling.
    */
    const firstTitle = memory3 ? document.querySelector<HTMLElement>('.v2-make-word') : null
    const queue =
      firstTitle !== null
        ? new MutationObserver(() => {
            if (next) draw(last[0], last[1], window.performance.now())
            else flag('data-rotated', firstTitle.dataset.lit !== '1')
          })
        : null
    if (firstTitle !== null) queue?.observe(firstTitle, { attributes: true, attributeFilter: ['data-lit'] })

    window.__sheet = draw
    window.addEventListener('resize', relayout)
    let cancelled = false
    void document.fonts.ready.then(() => {
      if (!cancelled) relayout()
    })
    relayout()

    return () => {
      cancelled = true
      queue?.disconnect()
      window.removeEventListener('resize', relayout)
      if (window.__sheet === draw) delete window.__sheet
      delete root.dataset.sheetCounted
      delete root.dataset.sheetTitle
      delete root.dataset.sheetLine
    }
  }, [])

  const [first, second, third] = site.two.occasions
  return (
    <div className="sh" ref={ref}>
      <div className="sh-early">
        <span className="sh-line">
          <span className="sh-word">{site.two.marker.word}</span>
          <span className="sh-num">
            <span className="sh-one">One</span>
            <span className="sh-two">
              <span className="sh-two-serif">{site.two.marker.numeral}</span>
              <span className="sh-two-sans">{site.two.marker.numeral}</span>
            </span>
          </span>
        </span>
        <span className="sh-topic">{site.two.marker.topic}</span>
        <p className="sh-thesis">
          {site.two.statement.map((text) => (
            <span key={text}>{text}</span>
          ))}
        </p>
      </div>
      <div className="sh-stack">
        <div className="sh-early">
          <p className="sh-occasion">{first}</p>
          <p className="sh-occasion">{second}</p>
        </div>
        <p className="sh-occasion sh-survivor">{third}</p>
      </div>
      {/* MEMORY3 — the page's stand-in for the Work's title; its text and setting are read from the real one. */}
      <span className="sh-standin" aria-hidden="true" />
    </div>
  )
}
