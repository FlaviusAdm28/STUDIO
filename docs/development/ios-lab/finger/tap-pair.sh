#!/bin/bash
# tap-pair.sh [gap ms] (17 Nov): pairs of taps on the next name, the second GAP ms after the first (the owner's rhythm: ~1.4 s); the page's own log of clicks and data-ch
source "$(dirname "$0")/sim.sh"
GAP=${1:-1400}
run 'document.getElementById("v5-hud").style.display = "none"; window.__L = []; const t0 = performance.now(); const log = (s) => __L.push(Math.round(performance.now() - t0) + " " + s); addEventListener("scrollend", () => log("scrollend y" + Math.round(scrollY)), { capture: true }); addEventListener("click", () => log("click y" + Math.round(scrollY)), { capture: true }); new MutationObserver(() => log("ch " + document.querySelector(".work").dataset.ch + " y" + Math.round(scrollY))).observe(document.querySelector(".work"), { attributes: true, attributeFilter: ["data-ch"] }); return 1' >/dev/null
for r in 1 2 3; do
  # the next name of the chapter shown and of the one after it (each article keeps its own row)
  p=$(run 'const cs = ["weddings","artists","experiences"]; const ch = +document.querySelector(".work").dataset.ch; const at = (c) => { const r = document.querySelector(".w-ch[data-c=\"" + cs[c % 3] + "\"] .w-nav-ch[data-role=\"next\"]").getBoundingClientRect(); return Math.round(r.left + r.width / 2) + " " + Math.round(r.top + r.height / 2) }; return at(ch) + " " + at(ch + 1)' | tr -d '"')
  set -- $p
  front; tcmd "click $(gx $1) $(gy $(($2 + 64)))
sleep $GAP
click $(gx $3) $(gy $(($4 + 64)))"
  sleep 3
done
run 'return __L.join("\n")' | sed 's/\\n/\n/g'
