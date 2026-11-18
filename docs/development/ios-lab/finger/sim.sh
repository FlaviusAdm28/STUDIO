#!/bin/bash
# sim.sh (17 Nov) — source me (from bash, not zsh: zsh does not split `set -- $p`). The iOS Simulator's Safari driven like a visitor:
# real finger drags and taps (simtouch, posting mouse events into the Device Hub window), and the page read and driven through the lab's
# remote console (proxy.mjs 3130, hud.js). Before: the Simulator booted (xcrun simctl boot v5-iphone), Device Hub open with its window at
# 873,68 (842 × 965), simtouch running (`~/.local/share/v5-lab/bin/simtouch ~/.local/share/v5-lab/touch &`, Accessibility granted), the
# proxy on 3130 and a page of the site open in the Simulator (xcrun simctl openurl v5-iphone "http://localhost:3130/?t=<new>").
# ⚠ Every page open on the proxy answers the console: blank the old tabs (sim-fresh below). ⚠ The HUD's buttons lie over the Work's
# chapter names on the right: hide it (hud-off) before tapping them. Taps on the page: y + 64 (the Simulator's Safari top area, 402 × 874).
#   fwd [px] [ms] — a finger stroke up (the page goes down); back — down; tcmd "click x y" — a tap (screen points: gx/gy of page CSS px)
#   where — where the page is (W<chapter>@y, 7…, top); rest — wait until the page is still
T=~/.local/share/v5-lab/touch
export DEVELOPER_DIR=~/Downloads/Xcode-beta.app/Contents/Developer
WHERE=/Users/flaviooliveira/WebstormProjects/STUDIO/docs/development/ios-lab/finger/where.js
run(){ curl -s -m 20 --data-binary "$1" localhost:3130/__diag/run; echo; }
where(){ curl -s -m 20 --data-binary @$WHERE localhost:3130/__diag/run | tr -d '"'; }
gx(){ echo "873 + 373 + $1*0.834" | bc; }
gy(){ echo "68 + 120 + $1*0.836" | bc; }
tcmd(){ rm -f $T/res.txt; echo "$1" > $T/cmd.txt; for i in $(seq 1 300); do [ -f $T/res.txt ] && return; sleep 0.05; done; echo "touch timeout"; }
fwd(){ local d=${1:-300} ms=${2:-120}; tcmd "drag $(gx 110) $(gy 560) $(gx 110) $(gy $((560-d))) $ms 0"; }
back(){ local d=${1:-300} ms=${2:-120}; tcmd "drag $(gx 110) $(gy 200) $(gx 110) $(gy $((200+d))) $ms 0"; }
rest(){ run 'return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 400) ok(1); else requestAnimationFrame(f) }; f() })' >/dev/null; }
front(){ osascript -e 'tell application "System Events" to set frontmost of process "DeviceHub" to true'; sleep 0.4; }
hud-off(){ run 'document.getElementById("v5-hud").style.display = "none"; return 1' >/dev/null; }
# open a fresh page and blank every older tab still polling the console (only the new one must answer)
sim-fresh(){ local NEW=f$RANDOM c=0 r; front; xcrun simctl openurl v5-iphone "http://localhost:3130/${1:-}?t=$NEW"; sleep 9
  for i in $(seq 1 12); do r=$(run "if (!location.search.includes('$NEW')) { location.href = 'about:blank'; return 'blanked' } return 'ok'"); case "$r" in *ok*) c=$((c+1));; esac; [ $c -ge 3 ] && break; sleep 1; done
  hud-off; front; tcmd "click $(gx 201) $(gy 420)"; sleep 4; }
# a tap on the shown chapter's "next" name in the Work
tap-next(){ local p; p=$(run 'const cs = ["weddings","artists","experiences"]; const ch = +document.querySelector(".work").dataset.ch; const r = document.querySelector(".w-ch[data-c=\"" + cs[ch] + "\"] .w-nav-ch[data-role=\"next\"]").getBoundingClientRect(); return Math.round(r.left + r.width / 2) + " " + Math.round(r.top + r.height / 2)' | tr -d '"'); set -- $p; front; tcmd "click $(gx $1) $(gy $(($2 + 64)))"; }
