# The conductor's battery (`?cenas`, 16 Nov 2026)

Chrome driven by CDP (Node 22: `~/.local/share/node22/bin/node`), wheel events replayed from the lab's stroke profiles
(`~/.local/share/v5-lab/strokes/`, made by `../gen.py`; `gentle300` = a stroke begun gently, as when a hand cuts the last momentum).
Run against `next start -p 3100` (`../rebuild.sh`). A separate headless Chrome for the logic, so the owner's windows are never touched:

    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9333 \
      --user-data-dir=<scratch>/hprofile --window-size=1440,900 --no-first-run about:blank &

`PORT=9223` drives the lab's windowed Chrome instead (it must be in front: a background tab does not draw frames).

- `walk1.mjs [profile]` — every stop, one stroke at a time, down to the end and back; after each: the stop, the scenes' states
  (`h.mjs` `expected`), animations left paused halfway (`STUCK`).
- `fast.mjs burst <ms> <n>` — n strokes, each cut after `ms` (a hand that never stops); `fast.mjs chain` — the owner's recorded chains.
  Prints the conductor's path, strokes kept/dropped, and the state where the hand stopped.
- `cases.mjs` — turning back mid-passage, keys (PageDown, arrows, Space, End, Home), the menu then a stroke at once (#7), someone else's
  scroll (scrollTo), a chapter's title, a resize mid-passage, the name field focused, a reload at 8b, an address arrived with.
- `cases-method.mjs`, `cases-about.mjs` — the Method's phase changes (A, 22 Nov) and the About (step 3) under the conductor.
- `cases-contact.mjs` (step 4, 22 Nov; `W=375 H=667` for another window) — the Questions' stop to the Contact's at once (no frame between,
  the questions' box held where it was while it fades), a stroke on during the passage (0.5 s dropped, 2.3 s kept, 2.9 s goes), turned back
  and turned again, a stroke up during the way back (the barrier), the colophon in and out, a jump, Space and Home, a reload at the end.
  `walk1` and the rest check the Contact too (`h.mjs` `expected`: `dk`, the light down at the Contact and the end; `run`, never at rest).
- `held.mjs [WxH,…]` — the stops from the About's 14 to the end at each size, and which elements move on the screen between each two
  (a scroll every 40 px): where the page may go at once, unseen (`conductor.ts` HELD). `contact-old.mjs [WxH]` — the Contact without the
  conductor (`?cenas=0`): the light down on the way to its stop, up on the way back.
- `smoke.mjs` — both modes (`?cenas=0` / `=1`): console errors and five PageDowns.
- `film.mjs <name>` — the owner's film: Chrome's own frames (CDP screencast, ~45 fps) with a caption per part → `<name>.mp4` (ffmpeg).
- `strokes-sim.mjs` — the stroke detector run offline over every profile (each single stroke must count once).
- `around.mjs <profile> <ms>` — the deltas around a moment of a profile.
- `back.mjs <ms>` — the Work's way back after resting `ms` at Weddings: the arch's brightness frame by frame (the flying photograph ~204,
  missing ~45). 16 Nov: missing for 0.6 s after ~4.5 s at Weddings, fixed in `work-client.tsx` (`syncOne`, `go`).
- `light.mjs` — the Method's light gathered after a way back: it must end at opacity 0.001 (at 1, Safari's hairline over the Work).
- `glitch.mjs <dir> [from] [to]` — any animation on a `screen.mjs` recording: each frame against its neighbours in a 6 × 4 grid of the page.
  FLICKER (a frame or two that do not belong), JUMP (a step far larger than those around it), and the stretches where the page moves.
  A hard edge sweeping across (the Method's light) or a front-loaded curve's first frame also shows as JUMP: look at the frames.
- `owner-trace.mjs <s>` — **the owner's own Chrome and trackpad** (the lab's windowed Chrome, CDP 9223): records `s` seconds of the
  `localhost:3100` tab while the owner scrolls — the screen's holes (> 50 ms without a frame), the compositor's dropped / missing-content frames,
  the main thread's long frames, the trackpad's gestures and the conductor's path; saved in `~/.local/share/v5-lab/rec/owner-trace-*.json`.

## The flight recorder (`?rec`, 16 Nov) — for the owner's own Chrome and Safari

1. `~/.local/share/node22/bin/node docs/development/ios-lab/desk/cenas/collector.mjs &` (listens on 3199; writes `~/.local/share/v5-lab/rec/live/`).
2. In Chrome or Safari: `http://localhost:3100/?cenas&rec` — a red clock in the corner (the log's ms). M drops a mark. Kept for the tab.
3. A screen recording at the same time (⌘⇧5) shows what the compositor drew; the corner clock aligns it with the log.
4. `node rec-read.mjs` lists the sessions (a page that died is flagged); `node rec-read.mjs <session> [frames]` reads one.
`src/lib/rec.ts` + `src/lib/rec-on.ts`, loaded only on localhost with `?rec` — **take them out before launch**, with the FPS meter.
