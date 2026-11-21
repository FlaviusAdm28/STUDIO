# The site at the most-used resolutions (21 Nov 2026)

The owner, 21 Nov: the Method was built on a 1440p screen, and below it "os cards ficam acima do text input"; "todos os cenários devem
ser ajustados para ser responsive… devemos tentar assegurar as resoluções mais usadas sempre". The list (the browser's own viewport,
the screen less its bars) is in `docs/design/v5/acceptance.md`.

Three probes, each one viewport per run, in a headless Chrome of its own (never the owner's windows):

    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9334 \
      --user-data-dir=<scratch>/hprofile --window-size=1440,900 --no-first-run about:blank &
    PORT=9334 ~/.local/share/node22/bin/node mprobe.mjs 1440 790 <outdir> http://localhost:3100/

One run takes ~35 s (the Method, the Work) to ~5 min (the whole page). Run two sweeps in parallel only in two Chromes (two tabs of one
headless Chrome may throttle each other). Each writes a screenshot per state into `<outdir>`: look at them, the numbers are a first check.

- `mprobe.mjs` — the Method, 7 → 11, at rest: every screen's real outline (its turn and scale counted, and the template sheet lifting at 8)
  against the thesis, Make it yours, the bar's islands and the words of 11; the room left under the field and at the screen's foot. On the
  owner's 2560 × 1305 the sheets of 8 rest 22 px under the field and the row of 7 ~100 px above the foot. Also writes `<W>x<H>.json` (the
  outlines), to compare two builds point by point.
- `wprobe.mjs` — the Work, every chapter and every moment (chosen by a tap): where the text's last line ends against the screen's foot.
  ("photo over text" means nothing on a phone, where the photograph is above the text.)
- `pprobe.mjs` — the whole page, stop by stop (every `[data-stop]`, top to bottom): words over words, words under the bar, words cut by
  the screen, a horizontal overflow. Only words that are really seen count (nothing opaque over their middle, hit-tested with the page's
  `pointer-events` forced on). Still flags, and they are not faults: the Work's words above the screen under the Method's studio (their
  middle is off the screen, so not tested), the About's title under the dark of 11, and on a phone the screen of 9 under the bar (#96).

Measured on 21 Nov before and after the fit (`v5-tests.md`, "O site nas resoluções mais usadas").

## The stops, frame by frame, in the real browsers (21 Nov, afternoon)

The frames a held stage is drawn out of its place at a stop (`v5-tests.md`, "Os fotogramas fora do lugar nas paragens"). They need the
real browsers and the real trackpad (the lab's windowed Chrome on CDP 9223, Safari; `bin/stroke`): a headless Chrome with synthetic wheel
events does not move through the stops as a trackpad does (the governor held it at the Work's stops on both builds) — no headless tool here.

- `seam.mjs "<plan>" <label> [port]` — the page's own log of every frame and every scroll event in the real Chrome while real strokes run
  (the scroll; the Method's section, stage, phase, snapping, leaving; the Work's stage; the About's section, stage, phase, leaving; the
  governor's hold), saved in `~/.local/share/v5-lab/rec/seam/<label>.json`, and the stop the page rests on after each stroke. The page's log
  never sees the out-of-place frames (they are the browser's drawing): it shows the jumps (a stroke's few frames, then the governor's jump)
  and any page carried past its stop.
- `tears.sh <label> <runs> [port] [WxH] [chrome|safari] [plan]` — strokes repeated, each run recorded on the screen (`cenas/screen.mjs`) and
  read (`cenas/glitch.mjs`); a tear is the whole screen changing in one frame (> 10 cells). Counts the tears per stroke down / up (`CENAS=1` for the conductor; the site as visitors have it otherwise). Safari's
  window is taken out of the Dock for the run and put back after. A passage that changes the whole screen fast by design (the Questions'
  paper rising) counts too: look at the frames.
- `perstroke.py <recording dir> [first stroke]` — a recording's tears, by stroke and how soon after it.
