# Safari's tab bar on a desktop (22 Nov 2026, investigation, nothing in the site changed)

`tint.html` (serve this folder: `python3 -m http.server 3150 --bind 127.0.0.1`) asks Safari's bar for colours by one source or another
(`?src=meta,html,fixed`, `&mode=static|raf|css|sweep|slide|fade|edge`, `&fixh=`, `&sticky`, `&split=`, `&under`, `&flowpage`, `&nopage`);
`tint.sh <label> "<query>" [s]` records the window's top; `tintts.py` / `tintsplit.py` read the bar's colour over time / across it.
`tinyproxy.mjs` (3147) serves the site with no HUD (the lab proxy's HUD tints the bar itself); `keytour.sh` walks it with ArrowDown.

Measured on Safari 27, macOS 27.2 (v5-handoff.md, the top section): the bar takes **one colour** — the background-color of a fixed or
sticky full-width element at the top (20 px yes, 1–4 px no), else html/body's — never theme-color, never an image, a gradient or an edge,
and not the layers' own animations (transform, opacity, clip-path: it changes at their end). It follows a background-color changing
(CSS transition or every frame) smoothly. From html's colour it draws its own tint, a few levels off (the studio 200 → bar 207, the
Questions' stone 224 → 193); from a fixed element, the exact colour — but no hidden one (z-index −1 under the body's colour) drove it in
the site.

## The bar made to follow (22 Nov, evening) — and what was measured on the way

`walkbar.sh <label> down|up` walks the site on :3100 by ArrowDown (or from the end by ArrowUp) with the window's top recorded;
`walkstroke.sh` the same by trackpad strokes (`"cenas=0"`: the visitors' site); `barwalk.py <dir>` per key: the bar before and after,
how long it moved, its largest step from one frame to the next, the page's top line the same; `barcurve.py <dir> <s> <len>` both, every
1/30 s. `tinyproxy.mjs` (3147) also takes `dbg` (the page's own colour in the tab's title, read by AppleScript), `nudge` (keys 1–4: a
flick of html's colour, a 1 px scroll, a paint at the top), `hidekeys` / `hidekeys=top` (keys 5–9, 0, -: candidate layers hidden or
clipped), `noisl` (the bar's islands hidden).

What Safari 27 does with the site (on top of the README above): where the top is not one colour, it falls back on html's background and
follows it at every change; a fixed or sticky full-width element under everything still counts — the About's held stage under the
Questions' paper gave the bar 192 over the paper's 220 (clipped, about.css data-covered, the paper's own 219); and at the top of the page,
after the Work's way back, it keeps a sample of the entrance's film (61–71) that nothing the page does afterwards changes (html, a 1 px
scroll, the entrance itself hidden) — a reload puts it back on html's (23 at night).

## What Safari 27's bar really shows (22 Nov, late) — the glass over the page scrolled off

The bar is glass over **the page's own content that has scrolled off the top of the viewport**, blurred and muted, spatially (left stays
left): `above.html?case=flow` (60 px of magenta in the flow just above the viewport) → the bar magenta, 156,118,158 over a grey page;
`feed.html?split=20|50|80` (an absolutely positioned element of the document laid just above the viewport, magenta left of the split, green
right) → the bar split there, with a soft edge (30 px of it are enough). Not shown there: sticky or fixed elements, even with their top
above the viewport (`above.html?case=sticky|fixed`: 135 and 128, the grey); not the windows behind Safari (`magenta.html` behind: nothing);
not the page's first rows (`lens.html?mode=edge`: stripes at the page's top, contrast 0 in the bar). With nothing scrolled off (the page's
top, scroll 0) the bar takes its own colour: the top's, or html's (the README above). So on the site, whose scenes are held (sticky): the
bar shows whatever is in the flow just above the stop — at the About's 13 the Method's end, its 11's cards to the sides (the owner saw
them, 22 Nov); at the Questions the About's held stage (the 192). The colours: muted by the glass (magenta 255,0,255 → 154,119,157; green
0,192,0 → 124,146,117).

## The bar against the page, by numbers (23 Nov; owner: "a cor do topo poderia dar um match melhor… especialmente nas mais escuras")

The owner is colour-blind: the match is measured, never judged by eye. `walkbar4.sh <label> "<query>" down` (walkbar3.sh, and the tab's
title at each stop: with `&dbg` the colour the page paints; `&hour=22` sets the page's clock, tinyproxy.mjs) and `barstops.py <dir>`: the
bar's settled colour against the page's top line at each stop, ΔE2000 and L*; `barcols.py <dir>`: the page's top in 8 columns.

**The recording is not the CSS colour.** screencapture writes bt709: the page's #777 (119) comes out 107. Bar and page go through the same
path, so they are compared with each other, never with the value painted; calib.html paints the page under the bar the same colour.

**What the bar does** (`calib.sh <label> "<query>" <secs>` + `calib.py <dir> <set>` on calib.html, served on 3150; light appearance,
transparency on): with html, body and the strip above the viewport (120 px) painted X, the page scrolled, the bar is the page's X
**+8 levels** in each channel, from black (0 → 8) to white (248 → 255), hue kept (the site's colours too). Which element does it:
body ~85 % (`on=body`: +1), the strip the rest (`on=feed`: +5…+7), html nothing while body has one (`on=html,feed`: +5…+6). Body and
the strip painted X − 8: bar − page 0 ± 1 over 16 colours (`comp=8&on=body,feed`).

**Before (the site, ?cenas, 10 h and 22 h, ArrowDown):** bar − page ΔE2000 1.2–3.4 at every stop, the bar lighter in all of them but the
Contact; the Work's chapters 1.9–3.1, the Method's studio 3.0–3.4 at 10 h. Two causes: the +8 above, and the colour a scene says not
being the top's average where the top is not one colour — the studio read across its middle (213 against an average of 205: the light
falls off to the far side, 216 … 178 across), the Contact's flat room #1b1c1a (~10 under the top's 31 … 37, the film's sky through the
veil). The entrance (scroll 0) is Safari's own choice, body's colour as it is (the owner: "acho que o Safari está a escolher bem a cor");
**entrance → Work**: the page darkens 66 → 23 under a bar that stays 23, then the bar steps to 29 ~0.7 s after the page has settled.

**Body is never seen** (`bodyshow.mjs [w] [h] [stroke] [query]` + `bodyshow.py <dir>`: body magenta, html green, the site walked by strokes
down and back with a screenshot every ~120 ms): 0 of 336 shots at 1440 × 900 under the conductor.
At the other sizes too: 0 of 205 (1280 × 590), 122 (2560 × 1305), 460 (1024 × 768), and 681 without the conductor (1440 × 900). (A walk
with a screenshot every ~120 ms is heavy: at 2560 × 1305 strokes were joined and stops skipped, at 1280 × 590 one capture hung — `walk1`
at those sizes, without captures, has 0 failures.)

**Which element, and where it starts** (`which.sh`, calib.html `&above=1`, `&fh=`, `&at=`): body counts as the page's colour, not only as
the page above the viewport — the page above covered by an element in the colour itself, body and the strip at X − 8 still give 0; a
1000 px strip alone gives +5…+7. At scroll 0 and 1 px the bar is in another regime (Safari's own colour, +33 over dark colours, +2 at
240); at 50 px the +8 holds. The site never rests between 1 and 50 px.

**The scenes' colours, measured without Safari** (`edgeprobe.mjs [hour] [w] [h]` + `edgeprobe.py <dir>`: at each stop html's colour
against the true average of the screen's first 4 rows, sRGB from a screenshot; `edgecurve.mjs <stop> <key>`: the same frame by frame
through a passage). Found: in production **`--m-key` is minified to `#ffc48c42`** and `parseColour` read no colour — the Method's edges
were the room alone, without the hour's light (a desktop, the iPhone's island and Android's bar alike); the studio's top read across its
middle; the 11's round light (.m-dark) reaching the top on a desktop (23 … 36 across, said 23); the About's lit room without its grain
(+2.2) and without the glow it carries (.a-glow) through 11 ↔ 12. After: 0.0–0.7 at every stop, passages within 1–2 levels.

**Without the conductor** (`CEN=0 walkbar4.sh …`; `tinyproxy.mjs ?nocomp` gives body html's colour, the bar as it was): the glass shows
the page above the viewport; at the Questions that is the About's dark under the paper, which takes the +8 off by itself — there,
without the strip, no compensation (0.7; with it 2.7).

The recordings and screenshots of 23 Nov (1.6 GB) were moved out of the repository to `~/.local/share/v5-lab/tint-runs-23nov/`;
the scripts write to `./runs/` — move it out again after a session (it is not ignored).

**Phones (23 Nov).** The Xiaomi's Chrome paints its bar with theme-color exactly (`xiaomi-theme.mjs [hour] [old,…] [section] [last]`, via
adb: theme-color, the bar from `screencap`, the page's first rows under it; `old` puts another colour in theme-color at the same moment).
On the iPhone simulator (iOS 27.3) html and body painted magenta change nothing on screen but the status glyphs' antialiasing: iOS 27's
Safari shows the page itself under the island and the bar. `phoneprobe.mjs` (headless, a phone's Chrome emulated) is only a first check:
the photograph is cut differently there (218 over 210 in headless, 218 over 215 on the Xiaomi). The simulator: `openurl` only works with
a clean console proxy (3130) — one left running for days kept old "blank the other tabs" commands queued and blanked every new page.
