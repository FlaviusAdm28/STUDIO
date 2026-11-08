# source me. Simulator (Device Hub window) finger lab.
S=/private/tmp/claude-502/-Users-flaviooliveira-WebstormProjects-STUDIO/22080907-07b8-489d-ae44-a79db41002fc/scratchpad
T=$S/touch
PORT=${PORT:-3130}
export DEVELOPER_DIR=~/Downloads/Xcode-beta.app/Contents/Developer
run(){ curl -s -m 15 --data-binary "$1" localhost:$PORT/__diag/run; echo; }
# device point -> global point (Device Hub window at 873,68; screen at +373,+120; 0.834 pt per device pt)
gx(){ echo "873 + 373 + $1*0.834" | bc; }
gy(){ echo "68 + 120 + $1*0.836" | bc; }
tcmd(){ rm -f $T/res.txt; echo "$1" > $T/cmd.txt; for i in $(seq 1 300); do [ -f $T/res.txt ] && return; sleep 0.05; done; echo "touch timeout"; }
# swipe up (page goes down) / down (page goes up): dist in device pt, ms duration, hold ms before release (0 = fling)
fwd(){ local d=${1:-300} ms=${2:-120} h=${3:-0}; local y0=$((560)); tcmd "drag $(gx 110) $(gy $y0) $(gx 110) $(gy $((y0-d))) $ms $h"; }
back(){ local d=${1:-300} ms=${2:-120} h=${3:-0}; local y0=$((200)); tcmd "drag $(gx 110) $(gy $y0) $(gx 110) $(gy $((y0+d))) $ms $h"; }
# in-page recorder: every frame [t, scrollY, m.phase, near, leaving, snapType, a.phase, section, sceneTop/H, label]
REC='(() => { const L = (window.__L = []); const t0 = performance.now(); const m = document.querySelector(".method"), a = document.querySelector(".about"), R = document.documentElement;
  const st = m.querySelector(".m-start"); cancelAnimationFrame(window.__raf);
  const f = () => { const H = innerHeight; L.push([Math.round(performance.now() - t0), Math.round(scrollY), m.dataset.phase || "", "near" in m.dataset ? 1 : 0, m.classList.contains("m-leaving") ? 1 : 0, getComputedStyle(R).scrollSnapType.startsWith("y") ? 1 : 0, (a && a.dataset.phase) || "", R.dataset.section || "", +((m.getBoundingClientRect().top + st.offsetTop) / H).toFixed(2), (document.querySelector("[data-bar-label], .bar-label") || {}).textContent || ""]); window.__raf = requestAnimationFrame(f) }; f(); return "rec" })()'
recstart(){ run "return $REC"; }
# compact: print rows where phase/near/leaving/snap/aphase changes, plus final
recdump(){ run 'cancelAnimationFrame(window.__raf); const L = window.__L || []; const o = []; let k = ""; L.forEach((r, i) => { const kk = [r[2], r[3], r[4], r[5], r[6], r[7]].join(); if (kk !== k || i === L.length - 1) { o.push(r.join(" ")); k = kk } }); return o.join("\n") + "\nrows " + L.length' | sed 's/\\n/\n/g'; }
# state now: scrollY, method phase, about phase, section, snap
st(){ run 'const m = document.querySelector(".method"), a = document.querySelector(".about"); return [Math.round(scrollY), m.dataset.phase, a && a.dataset.phase, document.documentElement.dataset.section, getComputedStyle(document.documentElement).scrollSnapType.startsWith("y") ? "snap" : "free", "near" in m.dataset ? "near" : "", m.classList.contains("m-leaving") ? "leaving" : ""].join(" ")'; }
# wait until scrollY is still for 500 ms (max 6 s)
rest(){ run 'return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 400) ok(1); else requestAnimationFrame(f) }; f() })' >/dev/null; }
# go to a place with snapping off for the jump
goto(){ run "document.documentElement.style.scrollSnapType = 'none'; scrollTo(0, $1); setTimeout(() => document.documentElement.style.scrollSnapType = '', 300); return 1" >/dev/null; sleep 1.2; }
NODE=/private/tmp/claude-502/-Users-flaviooliveira-WebstormProjects-STUDIO/c09416c4-4b91-4188-8647-f2460a1981be/scratchpad/node-v22.12.0-darwin-arm64/bin
rebuild(){ (cd /Users/flaviooliveira/WebstormProjects/STUDIO && PATH="$NODE:$PATH" npm run build 2>&1 | grep -E "rror|✓ Compiled" | head -5); }
reload(){ xcrun simctl openurl booted "http://localhost:3130/?t=$RANDOM"; sleep 6; tcmd "click 1414 600"; sleep 4; }
restart(){ local p=$(lsof -nP -iTCP:3100 -sTCP:LISTEN -t); [ -n "$p" ] && kill $p; sleep 1; (cd /Users/flaviooliveira/WebstormProjects/STUDIO && PATH="$NODE:$PATH" nohup npx next start -p 3100 > $S/next3100.log 2>&1 &); sleep 3; curl -s -o /dev/null -w "3100 %{http_code}\n" localhost:3100/; }
ph(){ run 'const m = document.querySelector(".method"), a = document.querySelector(".about"); const y = Math.round(scrollY); return a.dataset.phase !== "pre" && y > 11400 && y < 14500 ? a.dataset.phase : (y >= 14500 ? "Q" + y : m.dataset.phase === "pre" ? "W" + y : m.dataset.phase)' | tr -d '"'; }
seqs(){ local o=""; for k in $(seq 1 $1); do $2 $3 $4; sleep 0.3; rest; o="$o $(ph)"; sleep $5; done; echo "$o"; }
jump(){ run "document.querySelector('.menu a[href=\"$1\"]').click(); return 1" >/dev/null; sleep 3.5; rest; }
allbat(){
  goto 4471; sleep 2; echo "fwd normal:"; seqs 13 fwd 280 110 2.6; echo "back normal:"; seqs 13 back 280 110 1.6
  goto 4471; sleep 2; echo "fwd strong:"; seqs 13 fwd 450 45 2.6; echo "back strong:"; seqs 13 back 450 45 1.6
  for start in 1300 3900 4200; do o=""; for r in 1 2; do goto $start; sleep 2.5; fwd 450 45; sleep 0.3; rest; sleep 3.5; o="$o $(ph)"; done; echo "strong fwd from $start:$o"; done
  for start in 14763 15189; do o=""; for r in 1 2; do goto $start; sleep 2.5; back 450 45; sleep 0.3; rest; sleep 1.5; o="$o $(ph)"; done; echo "strong back from $start:$o"; done
  goto 4471; sleep 2; fwd 300 110; sleep 0.25; fwd 420 50; sleep 0.25; fwd 420 50; sleep 0.25; fwd 420 50; sleep 0.3; rest; echo "rapid during passage: $(ph)"; sleep 3; echo "  then: $(ph)"; fwd 280 110; sleep 0.3; rest; echo "  next stroke: $(ph)"
  goto 4471; sleep 2; o=""; for r in 1 2 3 4 5; do back 300 70; sleep 0.5; fwd 300 70; sleep 0.5; done; rest; sleep 3; o="$(ph)"; back 300 70; sleep 0.3; rest; o="$o $(ph)"; back 300 70; sleep 0.3; rest; o="$o $(ph)"; echo "alternation then 2 back: $o"
  o=""; for to in "#method" "#about" "#questions" "#contact" "#work" "#top"; do goto 9204; sleep 2.5; jump "$to"; o="$o $to→$(ph)"; done; echo "jumps from 9: $o"
}
phs(){ run 'const m = document.querySelector(".method"), a = document.querySelector(".about"), s = document.documentElement.dataset.section; const y = Math.round(scrollY); if (s === "questions" || s === "contact") return "Q" + y; if (a.dataset.phase !== "pre" && s === "about") return a.dataset.phase; return m.dataset.phase !== "pre" ? m.dataset.phase : "W" + y' | tr -d '"'; }
padseq(){ local o=""; for k in $(seq 1 $1); do tcmd "pad 864 600 $2 12"; sleep 0.4; rest; o="$o $(phs)"; sleep $3; done; echo "$o"; }
toexp(){ run "document.documentElement.style.scrollSnapType = 'none'; scrollTo(0, document.querySelector('.m-snap[data-at=\"out\"]').getBoundingClientRect().top + scrollY); setTimeout(() => document.documentElement.style.scrollSnapType = '', 400); return 1" >/dev/null; sleep 2; }
cev(){ (cd $S && $NODE/node cev.mjs "$@"); }
crest(){ cev 'return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })' >/dev/null; }
cph(){ cev 'const m = document.querySelector(".method"), a = document.querySelector(".about"), s = document.documentElement.dataset.section; const y = Math.round(scrollY); if (s === "questions" || s === "contact") return "Q" + y; if (a.dataset.phase !== "pre" && s === "about") return a.dataset.phase; return m.dataset.phase !== "pre" ? m.dataset.phase : "W" + y' | tr -d '"'; }
cpadseq(){ local o=""; for k in $(seq 1 $1); do tcmd "pad 772 600 $2 12"; sleep 0.4; crest; o="$o $(cph)"; sleep $3; done; echo "$o"; }
