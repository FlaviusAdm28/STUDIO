# Chapter III — architecture, interaction and visual direction review

**Date:** 13 August 2026
**Status:** Review only. Nothing here has been implemented, and nothing here is a decision.
**Scope:** Chapter III's act, the experience-preview architecture, the atmosphere, and the contract
between the Studio and a project. Chapters I and II are read for continuity but not under review.

*Grounded in the state of `D:\STUDIO` and `D:\CASAMENTO` on the date above, and in the locked briefs.
Where a number is derived rather than read, the arithmetic is shown so it can be checked.*

---

# Executive summary

Five things matter more than the rest. Two of them are bigger than Chapter III.

1. **The page omits two of the seven states.** Trust/method and Commitment/invitation
   (`05-storyboard.md` §8 Beats 5 and 6) do not exist. `about`, `faq`, `contact` are destinations with
   no sections. §4 rule 2 says *only the person may skip; we may not omit* — and an omitted state
   "gets failed silently." The cinematic → normal transition cannot properly be designed because there
   is nothing on the far side of it.
2. **The device frame contradicts Beat 3's explicit "must not."** §8 Beat 3: *"Must not: show a laptop,
   a phone frame, or a scrolling screenshot."* `decisions.md` §49 answered the *mockup* objection (no
   notch, no speaker) but not the *frame* objection. Part One is supposed to win.
3. **A pinned scroll act and a scrollable interactive iframe cannot share the same gesture.** Once
   `Explore` is pressed on a phone, the thumb over the object scrolls the wedding site, not the page —
   and the object is ~90% of stage height there. This is the most serious usability defect in the
   current concept, and it is structural, not a tuning problem.
4. **The restart requirement and the live-preview requirement contradict each other.** If the visitor
   watches the real thing living behind a veil, restarting it on press throws away the continuity you
   just spent a beat building. Restart should be **deleted**, not implemented — which also deletes the
   need for a protocol.
5. **The atmosphere protocol is not worth building.** Not for performance reasons — for
   `04-visual-language.md` §1 reasons: *"would this still be right if the material were replaced
   tomorrow?"* A scene protocol requires the material to cooperate, so it fails the studio-layer test by
   construction.

---

# Part 1 — Critique of the current Chapter III

## What is genuinely working, and should not be touched

The **aperture as the film's own gesture turned ninety degrees** is the best idea in the chapter.
Chapter II's band opened sideways because it was a landscape; this opens vertically because it is a
portrait object. Same mechanism, same curve. That is what makes Chapter III read as the third act of one
film rather than a page after it, and it is doing more for cinematic continuity than anything else in
the act.

**The dark being beneath the object** — `.act-dark` under `.act-object`, so what the beat removes is the
room and what it leaves is a lit screen — is the single reordering that makes the manifesto demonstrated
instead of illustrated. Keep it.

**`studioEmerges` reaching across two runways** so the mark opens the first third of the aperture is
excellent. There is genuinely nothing between the chapter's head and its work.

**The studio speaking last** (§51) is right and worth defending against any argument to move it. The same
words as an opening claim are a different sentence.

## Does it feel like a continuation of I and II?

Yes, mechanically — one curve, opacity, the same dark. But there is a **register break** nobody has
named: Chapters I and II have no interface in them at all. Chapter III introduces a pressable control, a
hit area, a hover state, a target, a scrollable inner document, and a link that opens a tab. The film
becomes an application in one frame. That is not automatically wrong, but right now the transition is
unmarked — the visitor goes from *watching* to *operating* with no beat that says so. The `screen` beat
lights the glass, but lighting a screen is not the same as saying *this one is yours now*.

## Cinematic enough? Empty enough? Too empty?

Take the recorded numbers. §51 measured margins of **525/525 at 1920**. The object is ~84% of stage
height at 19.5:9, which puts it around 370px wide on a 1080-tall frame. So on a 1920 screen the margin on
each side is roughly **1.4× wider than the subject itself**, and object + gap + column occupies about 45%
of the frame.

`04-visual-language.md` §5 says margins are silence and the first thing worth defending, so this is
defensible — but it is at the limit. The frame does not read "one tiny object floating"; it reads **two
small things marooned in a very wide field.** The problem on desktop is not the object's size, it is that
the composition has *two* subjects sharing the middle 45% and nothing anchoring either to the frame. On
1440 (327/327) it composes noticeably better. If one number is tuned, tune the column width for ≥1600.

The real emptiness problem is elsewhere: **after the act's last beat the chapter holds for 0.62 beats and
then hands over to a two-line "IV — future work" section and stops.** The chapter's ending is currently a
shrug.

## Too long?

Yes on mobile, and by a wide margin. `pin.coarse` 588vh + `actPin.coarse` 528vh = **1116vh — 11.2
screen-heights of pinned, non-skippable cinematic scroll** before a phone visitor reaches anything that
behaves like a page. Desktop is 744vh, about 7.4 screens, which is fine.

`04-visual-language.md` §11.2 forbids *"anything that holds a person in place… sequences that cannot be
skipped."* Eleven screens of flicking through a pinned frame is arguably exactly that. And
`05-storyboard.md` §1 requires that the referred and downstream visitor get **"a fast route past the
atmosphere"** — while `opening.tsx` is mandatory by design and its navigation is inert while
`data-opening` reads `running`. That is a deliberate, documented decision in `CLAUDE.md`, so it stands as
the studio's call; noting only that Part One says Part One wins, and that this is the one place the
implementation openly overrides it.

## Are we saying too much?

No — the page says **less** than the brief requires, in the wrong distribution. Chapter II carries Beat 4
(the range: `--i1`…`--i4`, wedding/exhibition/artist/performance). Chapter III carries Beat 3 (evidence).
So the implementation has quietly resolved `05-storyboard.md` §13's open decision #1 by putting
**Recognition before Curiosity**. That is a legitimate choice and it may well be the right one — but it
is unrecorded, and it means the four domain lines in Chapter II are now load-bearing for the hinge state.
They are currently four lines of type with no image each, against a brief that asks for "one image and
one line each." Worth a decision entry either way.

## Is the manifesto in the right place?

Yes. §51 got this right and it should not be reopened. The only thing worth questioning is whether **four
words deserve a full beat of silence on each side** — `lead` has `after: 0.16`, `hold: 0.55`, and `body`
follows after another 0.16. On a phone at 82.5vh per beat that is about 1.2 screens of scrolling to read
six words. It is very close to holding a person in place to prove a sentence was worth making.

## Does the CTA feel natural?

No, and this is the weakest interaction in the chapter. `invite: 'Explore'` inside the glass and
`cta: 'Explore experience →'` beside it are **the same verb, twice, ~200px apart on a phone.** §51 argues
they are set differently so they cannot be confused — but visual differentiation does not fix a semantic
collision. A visitor reading "Explore" and "Explore experience" side by side does not conclude *one
enters and one leaves*; they conclude *there are two buttons and one of them is longer*.

## Does it still feel like a studio rather than a portfolio template?

Mostly yes — because the work is live and because the studio speaks after it. Two things pull toward
template:

- **`01 / SELECTED EXPERIENCE`.** Index + category label + title + two lines + arrow-link is,
  structurally, a portfolio card. It is set beautifully, but the *schema* is inherited, and
  `04-visual-language.md` §10 says nothing is inherited.
- **The device.** A phone frame around a website is the single most recognisable convention in agency
  portfolio design. Every argument for keeping it is an argument about how *well* it is drawn, which is
  the wrong axis.

---

# Part 2 — Design improvements

## A. The iPhone entrance

The aperture is already right and it is the only option here defensible from the briefs.

| Approach | Verdict |
|---|---|
| **Aperture / crop reveal** (current) | **Keep.** It is Chapter II's gesture rotated. §7: light changed, not position. |
| Rising from below | Rejected already in §49 on a measurable ground — translating an element containing a live cross-origin frame re-rasterizes it, and the act is reversible, so scrolling back up drags a re-rasterizing document. That finding is still true. |
| Scaling large→final | Worst option. §11.1 — an effect performed so the effect is noticed. Also re-rasterizes. |
| Emerging from atmosphere | The atmosphere arrives *after* the object (`atmosphere.risesWhenDarkIs` is welded to the dark, which is welded to the object). Reversing that order means colour before there is anything making it. |

One refinement: the aperture currently opens the *device*. If the drawn hardware is dropped, it opens the
**work itself**, which is strictly better — the thing being uncovered becomes the thing the chapter is
about rather than the container it sits in.

## B. Composition after arrival

Keep the asymmetric spread — `04-visual-language.md` §5, asymmetry by default, centring reserved for
ceremony. The crossing earns itself (§7: what changed is a relationship).

Two changes worth making:

1. **Anchor the pair to the frame's optical left-of-centre, not to a computed equal-margin centre.** §51
   solved `--object-cross` so margins are equal at 525/525. Equal margins are the definition of a centred
   composition — what has been built is a symmetric arrangement of two asymmetric elements. Letting the
   pair sit left, with the larger silence on the right, would give the frame direction, which is what §5
   asks asymmetry for.
2. **Give the object something to stand against at ≥1600.** Not a shadow and not a glow (§5, and §49
   already banned both) — the existing `.act-device::after` hairline is the right instrument, but the
   room could carry a horizon: a single value change in the ground between upper and lower half. That is
   *light*, which §2 makes the primary variable, and it costs one more compositor layer.

## C. The project context

`01 / SELECTED EXPERIENCE / Wedding Experience / two lines / Explore experience →` is **too much, and it
is too much in a specific way**: three of those five elements are metadata about the studio's cataloguing
rather than about the work.

- `01` says the studio is choosing rather than running out. That is an argument *for us*, which §11.3
  forbids. When there is one project, an index numeral is a promise that has not been kept.
- `SELECTED EXPERIENCE` is a category label. §12: *if a sentence would survive being moved to another
  studio's site, it is not ours yet.* This one would survive being moved anywhere.
- The two lines are excellent and are the only part to keep unconditionally. *"A mobile-first wedding
  experience. / Opened on the day. Kept after it."* — concrete nouns, no superlative, plainly true.

**Recommendation:** cut to **title + the two lines**, and let the annotation be a caption in the studio's
voice rather than a catalogue entry. Future-proofing is better served by fewer fields, not more:
`title` + `note[2]` is a contract every future project can fill honestly; `index` and `label` are fields
that will start lying the moment there are three projects.

On timing: keep it arriving *during* the crossing (`arrivesWhenCrossingIs: 0.42`). That is one
transformation rather than two and it is the correct call.

## D. The Studio manifesto

Keep both lines, keep them last, keep them never sharing a frame. §51's reasoning is sound and should not
be reopened.

The one thing worth testing: **should the annotation and the manifesto share the same box at all?** They
currently do (`.act-said`, one grid cell, cross-fading in place). The argument is elegant — the studio
speaks *in the space the work's description vacated*. But it means the work's name is erased in order for
the studio to talk about itself, in a chapter whose whole thesis is that the material wins (§1: *"the
studio layer exists to be underneath"*). Having the title persist and only the two lines cross-fade would
say something truer, and costs one grid row.

## E. The final CTA

Change the verb, not the styling.

- **Inside the glass:** under the live-preview model, the right answer is that there is no button at all
  — see Part 5.
- **Outside:** `Explore experience →` should become something that plainly means *leaves*. "Open the full
  experience →" or simply "Open →". The arrow already does the work; the word should not compete with the
  one inside the phone.

Could one be removed? **Yes — remove the outside one.** Its job is "open the work at its own size," which
is exactly what a visitor does by pressing the live thing and then, if they want more, using their own
browser. Two doors to the same room, three inches apart, is the interaction problem here. If both are
kept, they must not share a verb.

## F. The transition into normal scrolling

This is the part to rebuild, and it is blocked on the omitted beats.

**Where cinematic mode should end:** at the moment the work becomes *usable*, not after. Right now the
act holds a lit, interactive object for 0.62 beats inside a pinned frame, which is where the scroll trap
lives (Part 9). Ending the pin at the manifesto's second sentence and letting the final composition sit
in an ordinary, unpinned frame gives: the same picture, no gesture conflict, and a natural place for
About to begin.

**Should the CTA be the last cinematic beat?** No. The last cinematic beat should be the studio's second
sentence. The way out belongs to the page, not to the film — that is what makes it read as the film
ending rather than as the film asking for something.

**Should About enter immediately?** No — one beat of ground change is needed. §2: *a change of ground is
one event.* The act ends in a dark room; About is a publication on paper. The return to paper is that
event, and it is currently spent on `IV — future work`, which is a section apologising for not existing.

**Header:** the masthead is already correct (fixed band of the page's own paper, `decisions.md` §47). It
should stop being clipped and simply become a normal sticky head once the act releases. No behaviour
change beyond that.

**Length:** target ~4.5 act beats, not 6.4. The 1.9 recovered come from the manifesto's holds and the
0.62-beat tail that should be an unpinned frame anyway.

---

# Part 3 — Atmosphere

| | Approach | Looks | Elegance | Verdict |
|---|---|---|---|---|
| A | Static project-defined (current) | Good | High | **Recommended** |
| B | Dynamic project-defined (studio-authored variation) | Same | High | Optional refinement |
| C | Semantic scene messages from iframe | Marginally better | **Low** | Reject |
| D | Preview-image-derived | Same as A | Medium | Reject — assets are ruled out |
| E | Direct visual sampling | — | — | Impossible (see below) |
| F | No atmosphere at all | Cleaner | Highest | Genuinely worth considering |

**E is closed, permanently.** `canvas.drawImage()` does not accept an `<iframe>` as a source — it is not
a `CanvasImageSource`, before cross-origin even applies. DOM-rendering approaches need read access;
`contentDocument` is null. `getDisplayMedia` with Region Capture is Chromium-only and requires an OS
permission prompt. `-moz-element()` is single-engine and does not cross origins. `decisions.md` §51
already recorded this and nothing has changed.

**C is the one to argue against on design grounds, not technical ones.** It is technically fine —
event-driven postMessage costs nothing. The objections are:

- `04-visual-language.md` §1's boundary test: *would this still be right if the material were replaced
  tomorrow?* A scene protocol is only right if the material **cooperates**. That makes it a studio-layer
  feature with a project-layer dependency, which is precisely the boundary the document says is the most
  important decision in the system.
- §7: *if nothing has changed in meaning, nothing moves.* The room changing hue because the visitor
  scrolled to the gallery *inside* the phone is a change in the material, not in the room they are
  standing in.
- §11.1: an atmosphere that visibly answers the iframe is **the mechanism becoming visible.** The moment
  a viewer notices the background responding, they are outside the experience and inside the demo.
- And the payoff is genuinely small: three fields at 16–24% alpha behind a lit object. Nobody
  consciously registers a hue shift there.

**The one coupling worth having already exists.** `--experience-spill` — the screen's own light reaching
into the room once the work is actually running — is a real, meaningful, causal response, it needs no
protocol, and it works for a project that implements nothing. That is the effect. The rest is the second
ten per cent.

**Could the atmosphere become distracting?** In its current form, no — §51's measurements (7.00ms idle /
6.94ms scrolling, no dropped frames in 240) and the boundary-less falloff are doing their job. A
*responsive* atmosphere absolutely could.

**Would something simpler be stronger?** Option F deserves a real hearing. §2 makes light the primary
variable and colour deliberately weak; the chapter's strongest move is already the room going dark around
a lit thing. Colour fields are the one place Chapter III adds a variable Chapters I and II do not use.
Worth keeping — but noting that they are the most removable thing in the act and the piece would survive
their loss.

---

# Part 4 — Experience preview architecture

**B (lazy) is what is built and it is the safest. A (eager + veil) is what is wanted and it is
defensible, with one change.**

The strongest argument for A is not aesthetic, it is the brief: §8 Beat 3 requires **"a fragment of the
actual experience — a real moment from it, behaving the way it behaves — rather than a picture of a
screen."** A black rectangle with one word on it is not a fragment of the experience; it is a picture of
a phone. The current implementation fails Beat 3 in a way the live preview would fix.

The cost is real and it is the one `CLAUDE.md` names as non-negotiable (§11: *media never delays the
first meaningful thing on screen*). But that cost is avoidable:

**Mount the iframe when Chapter III's act approaches the viewport, not on page load.** One
IntersectionObserver with a generous rootMargin, fires once. A visitor who never reaches Chapter III pays
nothing; a visitor who does has a live, settled document by the time the aperture opens. That preserves
the whole intent of the lazy rule while giving the live preview.

**Use a scrim, not a blur.** `backdrop-filter: blur()` over a live animating iframe is a per-frame GPU
blur of a large region — continuous cost, and §49 already recorded that WebKit rasterizes cross-origin
frames inside clipped/opacity-driven ancestors unpredictably. A translucent overlay reads as *dimmed*,
costs one compositor layer, and "dimmed" is the better word for a device that has not been woken.

**The veiled frame must be `inert` and `pointer-events: none`**, not merely covered. A covered iframe
still takes focus by keyboard and still scrolls under a stray touch.

---

# Part 5 — "Explore"

If the live experience is visible behind a veil, **the strongest interaction is not a button at all.**

The visitor can see a thing that is alive and is being held back from them. The correct affordance for
that is the veil itself — the whole dimmed surface is the target, and a single line of type sits on it
saying what happens. `04-visual-language.md` §10: *understood before it is used; nothing is inherited.* A
word centred in a rounded rectangle on a phone screen is the most inherited control on the internet.

Ranking, if a word is kept:

1. **No word — the veil is the target,** with one quiet line beneath the object (outside the glass)
   reading *Touch to use it* / *Press to try it*. Best. The instruction lives in the page's voice, the
   glass stays the work's.
2. **A verb that is not "Explore."** *Try it.* / *Use it.* Concrete, in the studio's register, and it
   does not collide with the outside link. "Explore" is on §12's spirit-of-the-ban list — it is what
   everyone writes.
3. **"Explore" (current).** Works, collides with the CTA, reads as SaaS.
4. **Icon + text.** No — §10, nothing is inherited, and the chapter has no icon vocabulary.

Whatever is chosen must remain a real `<button>` for keyboard and screen reader. The current
implementation gets that right and it should not regress.

---

# Part 6 — Restart

**Recommendation: delete the requirement.**

The veil model and the restart requirement work against each other. A beat is spent showing the visitor
something alive; the reward for pressing is that it is destroyed and they watch it assemble again. The
most *immediate* possible outcome is that the veil lifts on exactly the frame they were already looking
at, and their finger is on a running application in the same instant.

The wedding hero makes this better, not worse: after its ~2.75s entrance (`Hero.tsx`, `SCROLL_HINT_DELAY`)
it settles to a looping background video under settled type. Behind a veil that is a living preview, and
pressing into it is seamless.

If restart is wanted anyway, the trade-offs:

| Mechanism | Cooperation needed | Cost | Notes |
|---|---|---|---|
| **Remount** (bump React `key`) | None | Full document boot, visible | The only fully generic option. Re-setting an identical `src` does *not* reliably re-navigate — it must be a remount. Cache is warm from the preview, so it is faster than a cold load, but it is still a boot the visitor watches. |
| **postMessage `restart`** | Yes | ~0 | Instant, no network. But it is exactly the dependency Part 7 says to avoid. |
| **URL strategy** (`?restart=1`) | Yes (child must read it) | Full boot | Worst of both — cooperation *and* a reload. |
| **Internal reset** | Yes | ~0 | Same as postMessage, different transport. |

Note the asymmetry: the generic option is the slow one, and the fast one requires the thing being
avoided. That asymmetry is itself an argument that restart is the wrong requirement.

---

# Part 7 — postMessage

**Recommendation: A — no protocol, for now.**

The stated requirement decides this: *an experience must work perfectly inside Studio even if it
implements zero Studio-specific code.* Everything a protocol would buy is either (a) something the
no-protocol path already does adequately, or (b) something argued against on design grounds:

- **Atmosphere scenes** — argued against in Part 3 (§1 boundary test, §7, §11.1).
- **Restart** — argued against in Part 6 (the requirement itself is wrong).
- **`ready`** — not needed. `experience.tsx:150-161` already has a measured, working readiness heuristic,
  and the `SecurityError`-is-success path is documented.

That leaves nothing with a real job. **A protocol whose every message is optional and whose absence must
be indistinguishable from its presence is a protocol with no function.**

If one is built later anyway, the shape that would be correct:

- **Studio → Experience:** `restart` only. Not `pause`, not `mute`, not `setTheme` — anything that
  changes how the work *looks* makes the studio an art director of someone else's material, which §1
  forbids.
- **Experience → Studio:** `ready` only, and even that is redundant today.
- **Never include:** anything project-specific (`hero`/`gallery`/`rsvp`), anything carrying colour or
  CSS, anything periodic, anything on scroll, anything the studio would *break* without.
- **Versioning:** `{protocol, v, type}`, integer `v`, unknown `v` ignored silently.
- **Origin validation:** `event.origin === work.origin` **and** `event.source === frame.contentWindow`.
  Origin alone is insufficient — any frame can post a message claiming any shape. Explicit `targetOrigin`
  outbound, never `'*'`.
- **Unknown messages:** dropped without logging. A studio page that logs a stranger's messages is a
  studio page with an attack surface.
- **Child side:** no-op entirely when `window.parent === window`.

---

# Part 8 — The smallest contract

Everything the act needs, and nothing else:

```
url          the deployment
title        what it is called
note[2]      two authored lines about it
viewport     the width it was drawn for
embeds       whether it consents to being framed  ← measured, written down
atmosphere   three tones + one light               ← chosen by the studio
```

Six fields. Note what is absent: no scenes, no integration flag, no crop config, no protocol version.
`context.index` and `context.label` would be dropped per Part 2C.

Two of these deserve defending:

- **`embeds` must stay a written-down header read.** §49 proved it cannot be discovered at runtime: a
  refused frame commits an error document at the *target's* origin, so it is indistinguishable from a
  working one. Every heuristic reduces to a timeout, and a timeout sends a working experience to a new
  tab on a slow connection. This is the single best-argued line in `site.ts` and it should never be
  replaced with detection.
- **`atmosphere` is studio-authored, not project-emitted.** That is what keeps the room the studio's.

The current `work` object is already very close to this. The architecture is fine; it is the two extra
catalogue fields and the proposed protocol that would erode it.

---

# Part 9 — Mobile

This is where the concept is weakest, and one problem is severe.

**The scroll trap.** `.act-device` is `pointer-events: auto`; the iframe inside it is interactive once
`[data-experience='live']`. On a phone, `--screen-h` is up to 90% of stage height and the object is
~64vw wide, leaving roughly 70px of margin each side on a 390 screen. Inside a **pinned** act, a thumb
that lands on the object scrolls the wedding site; the page cannot advance or retreat. The visitor's
escape routes are two 70px gutters and whatever is above/below the object. This is not a tuning issue — a
pinned scroll-driven frame and a scrollable inner document are competing for the same gesture, and there
is no CSS that resolves it.

Three fixes, in order of preference:

1. **End the pin before the work becomes interactive.** The act's final composition lives in an ordinary
   unpinned frame; interactivity is enabled there. Solves it completely and shortens the act, which
   Part 1 wanted anyway.
2. **Gate interactivity on the act being complete** (an `--aoffer`-style step at the end of the runway)
   rather than on the press. The press lifts the veil; the frame becomes touchable only once nothing is
   left to scroll through.
3. **Keep the frame inert on coarse pointers entirely** and offer only the outward link on mobile.
   Honest, and much weaker — it means the phone visitor, who is most of the traffic, never touches the
   work.

**Other mobile findings:**

- **`100svh` / browser chrome.** `--stage-h` derivations must survive the URL bar collapsing mid-act.
  Worth a specific check — a stage height that changes mid-pin re-solves `--screen-h` and re-runs the
  `ResizeObserver` in `experience.tsx:117-126`, which re-scales a live frame.
- **1116vh of pinned scroll** (Part 1). This is the number to attack first.
- **The landscape branch** (`max-height: 560px`) honestly documents that the object lands at ~130pt wide
  and the experience inside it is small. That is the right way to record a limitation, and the branch is
  correct.
- **The preview reads better on mobile than desktop.** A portrait live document at 390 CSS px scaled into
  a portrait object is 1:1 — no scaling artifacts, no scrollbar gutter. Desktop is where the
  `--screen-gutter` arithmetic and the scale-down live, and it is already handled well.

---

# Part 10 — Performance

| Technique | Verdict |
|---|---|
| **Opacity cross-fade** | Safe. Compositor-only, no repaint. The house idiom already. |
| **`translate3d` on pre-painted layers** | Safe. §51 measured 7ms with three fields drifting. |
| **postMessage, event-driven** | Free at a few messages/minute. Never in rAF — 60 main-thread wakes/sec in a page whose scroll architecture depends on an idle main thread would be worse than the canvas work being avoided. |
| **iframe, mounted at act entry** | Acceptable. One document boot, once, for visitors who reach Chapter III. Note it does **not** get throttled while visible — its animations run behind the veil. |
| **Transitioning gradient *colours*** (`@property`-registered) | **Avoid.** Repaints three near-viewport-sized layers every frame of the transition, destroying the zero-repaint property §51 measured. If hue must change, stack pre-painted sets and cross-fade opacity. |
| **`backdrop-filter: blur()` over a live iframe** | **Avoid as the main mechanism.** Continuous large-region GPU blur, and WebKit rasterizes cross-origin frames in clipped/opacity ancestors unpredictably (§49, §51 "not verified"). |
| **Canvas / pixel sampling / per-frame analysis** | Impossible *and* forbidden. Both. |
| **Permanent rAF** | Never needed. Every value in the piece is either a function of scroll or an event consequence. |
| **`transform` on the object** | Already accepted for `--across` with eyes open (§51). Note this is the one place a live cross-origin frame is translated, and it is on the list of things iOS Safari has never been tested against. |

**One addition to the validation set:** measure a frame *with the iframe live and the object crossing* on
a real mid-range Android. Every measurement on record (§51's 7.00ms) was taken with the room at full
colour but, as far as the log shows, not with a running remote application inside a translating clipped
ancestor. That combination is the untested one.

---

# Part 11 — The Exhibition test

Next project: an exhibition experience. Landscape-first, dark, video-heavy, no postMessage, sends
`X-Frame-Options: SAMEORIGIN`.

Under the **recommended architecture:**

- `embeds: false` → no frame is ever mounted. The screen composes as a link that opens the work at its
  own size. Fully composed ending, not a degradation. **Works.**
- `atmosphere` → three tones read off the exhibition's own material by hand, written into `site.ts`.
  **Works.**
- No protocol → nothing is missing, because nothing was ever required. **Works.**
- `viewport: 1440`, landscape → **this is the one special case.** The object is a portrait device; a
  landscape document in it is wrong. The aperture opens vertically *because* the object is portrait
  (§49). A landscape project needs the object to be landscape and the aperture to open sideways — which
  is Chapter II's original band.

So: **one warning sign, and it is the device.** If the object were a *chosen crop of the work* rather
than a drawn phone, the ratio would be a field (`--screen-ratio` already exists) and the aperture axis
would follow it — and there would be no special case at all. That is a second, independent argument for
the recommendation in Part 1 and Alternative 1 below.

Under the **scene-protocol architecture**, the exhibition gets a static default atmosphere and the
wedding gets a live one, meaning the two projects are presented with different amounts of life — the
studio layer varying by how much the material cooperated. That is the failure §1 describes.

---

# Part 12 — Best overall

**A. Sequence**

```
III Studio            ← the mark lands, and it is already opening the work
the work is uncovered ← aperture, live, veiled, alive
the room goes dark    ← around it; the work stays lit
the veil lifts        ← on press. it is theirs now. no restart.
it crosses            ← and the annotation is written beside it
"We don't build websites."
"We create digital experiences that become part of the memory itself."
                      ← pin releases here
the ground returns to paper
About · FAQ · Contact ← Beats 5 and 6, which do not yet exist
```

**B. Entrance** — the aperture, unchanged. Opening the work rather than a device.

**C. Composition** — asymmetric spread, but sitting left of centre rather than at equal margins, with the
larger silence on the right.

**D. Context** — title + two lines. Drop `index` and `label`. Keep it arriving during the crossing.

**E. Manifesto** — where it is. Consider letting the title persist beneath rather than being erased by it.

**F. Explore** — the veil is the target; one quiet line beneath the object in the page's voice. If a word
must sit on the glass, not "Explore."

**G. Atmosphere** — static, project-defined, studio-authored. Exactly what exists. No protocol.
`--experience-spill` is the dynamic coupling and it is enough.

**H. iframe** — mounted at act entry, veiled with a scrim (not a blur), `inert` until pressed,
interactive only once the pin releases.

**I. postMessage** — not worth it. Revisit only if a specific, generic need appears that the no-protocol
path genuinely cannot serve.

**J. Transition** — pin ends on the second sentence. One beat of ground change back to paper. About
begins on paper as an ordinary section.

**K. Mobile** — shorten the act toward ~4.5 beats; never enable inner interactivity inside a pinned
frame; verify `svh` behaviour across URL-bar collapse.

---

# Three alternatives that could be stronger

## 1. The Plate — remove the device

**Visual:** No drawn hardware. The live experience is a **chosen crop** of the running document — a lit
rectangle standing in a dark room, with a hairline edge and nothing else. `--screen-ratio` becomes a
per-project field; the aperture opens along the crop's short axis.

**Interaction:** Identical to the recommendation above.

**Why stronger:** It is the only version that satisfies `05-storyboard.md` §8 Beat 3's explicit *"must
not show… a phone frame."* It satisfies §5's *a frame is chosen, not inherited* — the studio chooses the
crop, which is a composition decision the studio is entitled to make about someone else's material. It
removes the most portfolio-template object on the page. And it deletes the Exhibition special case from
Part 11 outright: a landscape project is a landscape crop, and the aperture follows.

**Risk:** Loses the "held in the hand" reading, which is genuinely part of what the wedding piece *is*
(`note`: *"A mobile-first wedding experience"*). A rectangle of live website with no frame may read as an
inset panel rather than an object. Mitigation: the room's dark and the hairline are doing most of that
work already — §51 measured that the device at half-open was "a mid-grey pill," which suggests the
*hardware* is contributing less than assumed.

**Scales:** Best of the three. One ratio field per project, no other change.

## 2. The Ground — the work is the room

**Visual:** Invert figure and ground. Chapter III does not put the work *in* the studio's room; the work
**is** the ground for Chapter III, full-bleed. The studio's two sentences are set over it exactly the way
Chapter I's identity is set over the footage — type on a moving image, with a scrim carrying the
legibility.

**Interaction:** The manifesto is read over the living work. When the last sentence lands, the scrim lifts
and the whole frame is the experience, edge to edge. There is no object to press, no device, no
inside/outside CTA collision — pressing anywhere is entering.

**Why stronger:** It is the most *cinematically consistent* option by a distance. Chapter I is words over
a photograph; Chapter II is words over a fading photograph; Chapter III would be words over a living one.
One language, three acts. It also makes §49's core insight literal — the manifesto is not spoken *near* a
running experience, it is spoken *on* it.

**Risk:** Two real ones. **Legibility over arbitrary material** — a scrim over a live cross-origin iframe
is exactly the continuous-blur/filter cost Part 10 warns about, and a scrim strong enough to guarantee
contrast over any future project's ground is strong enough to hide the work. **And a mobile-first
document full-bleed on a 1920 desktop** is a 390px column stretched or a 1440px void. This alternative
gets *better* the more the project's own viewport matches the visitor's, which makes it phone-excellent
and desktop-fragile.

**Scales:** Poorly to projects with light grounds or unpredictable contrast. Would need a per-project
scrim value, which starts the slide back toward art-directing someone else's work.

## 3. The Handover — the work is not in the chapter

**Visual:** Chapter III's cinematic act contains **no work at all**. It is the mark, the room going dark,
and the studio's two sentences — a short, dense, purely typographic act in the same language as
Chapter II. Four beats, maybe three. Then it releases, the ground returns to paper, and the work appears
**below the film** as an ordinary, unpinned, quiet section: the live experience at a comfortable size,
immediately usable, with its two lines beside it.

**Interaction:** No veil, no press, no aperture on the object. The work is simply there and simply works,
in a normal document, where a thumb scrolling it is not fighting anything.

**Why stronger:** It resolves the gesture conflict *structurally* rather than by gating (Part 9). It
halves the act's length, which addresses the 1116vh mobile problem. It makes Chapter III's cinematic
portion genuinely short and dense, which is what §51's brief asked for. It is the most project-agnostic
of the three: a project that refuses framing is a link in the same slot and nothing about the chapter
changes. And it respects §11.2 — nothing holds the visitor in place while they try to use something.

**Risk:** It gives up the thing §49 fought hardest to win — the manifesto being *demonstrated* rather
than illustrated, spoken over an experience that is running while it is read. That is a real loss and it
is the reason this ranks third rather than first. It also risks the work reading as a portfolio entry
appended after the film, which is precisely the failure mode §8 Beat 3 names.

**Scales:** Perfectly. It is the architecture with the fewest assumptions about the material.

---

# Where the weight should go

The current direction is good, and §51 improved it substantially. Three changes before touching the
protocol or the atmosphere at all:

1. **Build Beats 5 and 6.** The page currently omits two of seven states and ends on a section
   apologising for not existing. Everything about the cinematic → normal transition is unanswerable
   until there is something on the other side.
2. **Take the interactivity out of the pinned frame.** This is a correctness problem on mobile, not a
   preference.
3. **Drop the drawn device** (Alternative 1). It is the cheapest of the three alternatives to adopt, it
   resolves a direct conflict with a locked brief, and it removes the Exhibition special case for free.

Then: live preview behind a scrim, mounted at act entry, no restart, no protocol, atmosphere exactly as
it is.

---

# Not verified

Neither project was run, the deployment was not fetched, and nothing was measured on real hardware. All
numbers above are either read from the repository or derived from measurements already recorded in
`decisions.md` §51 — where derived (the 1116vh, the margin-to-object ratio at 1920), the arithmetic is
shown so it can be checked. iOS Safari remains untestable from this environment, and it is the engine
where the translating-clipped-cross-origin-frame composition is least predictable.
