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
