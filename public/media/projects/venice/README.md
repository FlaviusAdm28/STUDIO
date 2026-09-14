# venice — project assets

*The Environment plate for `projects.venice` in `content/site.ts`.*

One file belongs here, and as of **27 August 2026 it is here**:

```
public/media/projects/venice/venice.png     1536 × 1024
```

`content/site.ts` carries `plate: '/media/projects/venice/venice.png'`. It was `null` until the master
was supplied — a composed absence, the way `three.work.url` and `contact.write.address` are null when
something has not been decided. That absence is now filled and the plate is **locked**.

**The file is named for the project, not `plate.png`.** This document asked for `plate.png` before the
asset existed; the delivered master is `venice.png` and the record follows the asset. A directory named
for the project holding a file named for the project is the same convention either way.

## What was delivered, measured

**The plate was replaced on 27 August 2026** and this section describes the file that is there now. The
first master — a gondola on the basin at San Giorgio Maggiore, with the couple facing the camera — is
kept beside it as `venice_old.png`. What ships is `venice.png`: **Santa Maria della Salute across the
Grand Canal at sunset**, gondolas moored along the left, a fondamenta running down the right with the
couple walking away up it, and palazzo façades closing the right edge.

| | asked for, below | delivered |
|---|---|---|
| Format | PNG | PNG |
| Orientation | horizontal | horizontal, 3:2 |
| Width | **≥ 2560px** | **1536px** — see below |
| Subject | a place | the Grand Canal at the Salute; the figures are incidental and walking away |
| Light | golden hour / warm dusk | sun on the horizon, warm, strongly directional |
| Identifiable individuals | excluded | **none** — both figures are seen from behind and are unlit |

**The subject clause is now met and the consent question is closed.** The first master put two
recognisable faces in the centre of the frame, and this document held that using it was the couple's
decision to give rather than the studio's to assume. It is not that photograph any more: this one is of
the **place**, which is what §3 asked for, and the two figures in it carry no likeness.

**One departure remains, and it is geometric.** At 1536px the plate is well under the 2560 minimum this
document set. At the 1440 × 760 reference frame `cover` scales it to 1440 × 960 — the width fits exactly
and there is **no horizontal slack at all**. State 08's locked 20% pan is therefore paid for by
over-scaling: `globals.css` gives the venice layer a width of `100% + 20vw`, so the pan always has
precisely its own distance to travel and C7's *maximum available* clause never binds. The cost is a
resample of a 1536px source — about 1.13× at 1440 and 1.5× at 1920. The 20% is design intent and does not
move; C7's order of preservation puts exact pixels last.

## The pan direction, derived from this file

State 08 pans the plate **20% horizontally** (§2). §3's 08 → 09 gives the direction semantically —
*"the frame pans off the canal"* — and the physical left/right follows from what is actually in the
frame. Measured 27 August 2026 by column profile of the decoded PNG:

| feature | measured |
|---|---|
| the sun, low over the canal | brightest block **mean L 242 at plate x 0.102, y 0.211** |
| brightest eighth of the frame — the lit water and sky | **x 0.12 – 0.25**, mean L 126 |
| open canal and the sky over it, as a fraction of each column | **48 – 70% across x 0.00 – 0.56**, then 13% · 0.3% · 0.5% · 12% · 15% · 18% · 0% |
| the water surface itself (y 0.44 – 0.72) | peaks **60.7% at x 0.38 – 0.44**, essentially zero past x 0.75 |
| darkest eighth of the frame — the quay and the palazzo wall | **x 0.62 – 0.75**, mean L 21 |
| the two figures, walking away | inside that dark band, x ≈ 0.56 – 0.81 |

The canal — the water, the sun on it, the moored gondolas and the Salute above them — **is the left of
the plate**. The quay, the architecture and the figures are the right, and they are five times darker.
So *off the canal* means:

> **the frame travels rightward across the plate; the plate translates left.**

Checked against the alternative rather than asserted. Three 80%-wide windows over the whole frame:

| 80%-wide window | mean L | canal + sky |
|---|---|---|
| **frame pans left** — window x 0.00 – 0.80 | 82.8 | 42.3% |
| no pan — window x 0.10 – 0.90 | 74.1 | 37.6% |
| **frame pans right** — window x 0.20 – 1.00 | **60.6** | **30.3%** |

Panning right takes the canal out of the frame — the open water and lit sky fall from 42.3% to 30.3% of
the window and the mean luminance falls by a quarter. Panning left does the opposite: it walks *into*
more water and more moored gondolas, and the mechanism reads as its own opposite. The direction is not
negotiable; the magnitude is governed by the responsive rule.

**What the pan gains, beyond being correct.** It ends on the dark quay, which is where state 08's own
exposure (.19) and the 08 → 09 lift want it: the frame leaves the brightest part of the negative on the
approach and the lift then brings the whole plate to true exposure at state 09.

## Specification — what the plate was held to

*Written before the asset existed. Kept as the standard that was applied; where the delivered master
departs from it, the table above is what is true.*

| | |
|---|---|
| Format | PNG |
| Orientation | horizontal |
| Minimum width | **2560px** — the plate must be ~120% of the widest supported frame so state 08's fixed 20% horizontal pan has somewhere to travel. At a 1920 viewport a 20% pan needs 2304px of real image; 2560 leaves margin. |
| Subject | a **place**, photographic. §3's 08 → 09 is *"the frame pans off the canal"* — the plate is a world the film moves through, not a portrait it looks at. |
| Light | golden hour or warm dusk, matching §2's light shape for 06–09: warm dark at 06–07, peak true exposure at 09 |
| Must survive | being held at **.09 exposure** with structure still legible, then lifted to 1.00 without revealing compression or upscaling |
| Must carry | the film's typography over it — 52px centred serif (06), the Chapter III lockup at x752 (07), the Ledger index drawn at x38 (08), 80px serif at x196 bottom 74 (09) |
| Must not contain | browser chrome · website UI · overlaid type · identifiable private individuals |

## Why the project's own served imagery did not qualify

*Historical. This is why a plate had to be produced rather than extracted, and it is the reason the
record carried `plate: null` for a day.*

Inspected 26 August 2026 at `https://casamento-chi-ruby.vercel.app/`. Everything the project serves:

| Source | Native size | Why not |
|---|---|---|
| `/images/story/img_story.png` | 1086 × 1448, **portrait** | The right *subject* — the engagement in Venice, golden hour, the canal and San Giorgio, and the reason this project is called `venice` at all. But it is a portrait frame of two identifiable people. Cropping it to horizontal loses either the canal or the couple, and `04-visual-language.md` §5 is quoted in `globals.css` on exactly this: a frame is chosen and then held, *"never re-cropped to fit a column, at any width."* At 1086px of real width it is also below the minimum before any crop. |
| `/images/venue/palace.png` | 1024 × 1024, square | **Not a photograph** — a flat illustration of the Palácio da Igreja Velha on pure black. §5's grounds are *"a grade of one of three photographs"*; an illustration has no light to grade and would read as a black rectangle at .09. |
| `/videos/hero/41830-431406553_tiny.mp4` | 4.1MB, `_tiny` | Stock footage by its filename, not the project's own material, and a preview-resolution encode. |
| `/studio-fragment` (captured 2560 × 1097) | — | Horizontal, chrome-free and UI-free, and correct as the *fragment*. But it is `img_story.png` centre-cropped by `object-fit: cover` — a 2.36× browser upscale of the same 1086px source, cropped to two faces filling the frame. The canal §3 pans off is cropped away. |

`final-design-spec.pdf` §10 sets the standard being applied: storyboard imagery is *"extracted 1010px
video frames and is storyboard-grade only"*, and production plates are needed *"before visual QA."* Every
candidate above is that same order of resolution or smaller.

## One thing to settle before the plate is made — settled

*Answered by the delivered master, 27 August 2026. Kept as written.*

The strongest photograph is of the couple, on a site that does not go live until **28 August 2027** — its
own gallery says *"this space will come to life on the day of our wedding."* Putting their engagement
photograph permanently behind the studio's homepage typography is the couple's decision to give, not the
studio's to assume. A plate of the **place** avoids the question entirely and is what §3 asks for anyway.

## Adding another project

```
public/media/projects/
  venice/venice.png
  <next-id>/<next-id>.png
```

A record in `projects` keyed by the same id, a directory named for it, the plate inside. Nothing else —
no beat, distance or selector anywhere in the project names a wedding. `decisions.md` §49 and §51.
