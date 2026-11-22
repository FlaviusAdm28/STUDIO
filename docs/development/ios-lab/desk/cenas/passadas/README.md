# Strokes under the conductor, measured in the page (22 Nov 2026)

The owner's report (`?cenas`, Chrome and Safari): in the Method, strong strokes back and forth while a change still played sometimes
went 9 → 11, and the cards "opened all at once". These tools found the two causes (`v5-tests.md`, "Passadas no Method") and check the fix.
Node 22 (`~/.local/share/node22/bin/node`); run from a working folder, results in `$OUTDIR/<label>` (e.g. `OUTDIR=$PWD/runs`).

- `rec.mjs "<plan>" <label>` — the lab's windowed Chrome (CDP 9223): a tab of its own (`method-lab`), a recorder in the page from its first
  script (every wheel event with its own time `e.timeStamp`, cancelable and prevented; every scroll; the conductor's notes; the scenes'
  phases; frames over 34 ms), then real macOS trackpad strokes (`bin/stroke`). Plan: `J<stop>:<ms>` a jump (lab hook), `P<profile>:<ms>`
  a profile from `~/.local/share/v5-lab/strokes`, or `d u D U s S n N` + ms as in `screen.mjs`. `PX`/`PY`: where the strokes land, as
  shares of the viewport (a system dialog in the middle of the screen took them, 22 Nov: `PX=0.15 PY=0.85`).
- `saf.mjs` — the same in the real Safari, through the proxy's remote console: `node ../../../proxy.mjs 3146 3100` first (its own port, so
  no other page answers). Safari comes out of the Dock for the run and goes back.
- `read.mjs <dir>` — the run's timeline: strokes, decisions, phases, long frames, wheel events late or not prevented, scrolls off a stop.
- `holds.mjs <run…>` — after the fix: the stops in order, flagging a stop skipped or a stop the same way sooner than its change was seen.
- `why.mjs <dir> [from] [to]` — the conductor's stroke detector replayed on the events the page got: each "fresh" and its rule.
- `gaps.mjs <dir>` — wheel events joined by the browser (inter-arrival ≥ 20 ms; values that are sums).
- `detsim.mjs <rec.jsonl…>` — the detector over the owner's own recordings (`../../../out/*rec.jsonl`, rec.js): new strokes found inside a
  stroke, SPIKE = one event 2.5× its neighbours and the momentum going on as before (a joined event, not a hand).
- `cmp.mjs <run…>` (`WIN=48`) and `prof.mjs` — today's rule against the same rule on the stroke's speed over a window of its events' own
  time: on the runs (strokes made known) and on every lab profile. The window fixed the runs but not the jittered profiles nor
  owner-chrome-3 (7 of 12): a direction for the detector, not a fix.
- `real.py NAME PEAK SIGNS GAP` — strokes like the owner's trackpad (events every 8 ms, momentum included); `burst.py` the older 16 ms kind
  (it never showed the joined events: the trackpad sends 8 ms).
- `vid.sh chrome|safari <label> "<plan>" <s>` — the window recorded during a run; `tile.sh <label> <from> <to> [fps] [cols]` its frames tiled.
- `tabs.mjs [port]` — read-only: the state of each `localhost:3100` tab in a Chrome (which mode, where, how long ago loaded).

## The bench (`bench/`, B, 22 Nov) — the stroke detector against every corpus

`python3 bench/syn.py` once (the made-up cases → `~/.local/share/v5-lab/strokes-syn`), then `node bench/bench.mjs <variant> [k=v…]`:
the runs recorded in the page (`RUNS`, default `~/.local/share/v5-lab/rec/passadas`: strokes made known from their plans), every lab
profile, the made-up cases, and the owner's own recordings (`../../../out/*rec.jsonl`, one stream per page session; arrival times only).
Variants in `det.mjs`: `today` (the rule before), `v1`–`v7` (the way there, kept for the record), and `prod` = the site's own
`src/lib/strokes.ts`, transpiled as it is (`prod.mjs`). `lost.mjs` (`VAR=v7`): every detection the rule before made and the new one does
not, sorted into duplicate / delayed / lost with its events; `verify.mjs <run…>` new runs; `trace.mjs`, `ptrace.mjs`, `rtrace.mjs` where
two variants disagree on a run, a profile, an owner session.
