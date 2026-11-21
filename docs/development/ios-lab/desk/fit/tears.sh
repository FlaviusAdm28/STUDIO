#!/bin/bash
# The seam Work ↔ Method in the lab's real Chrome: passages Experiences → 7 and back, repeated, each run recorded (cenas/screen.mjs) and read
# (cenas/glitch.mjs); a "tear" is a frame or two where a held stage is drawn out of its place — the whole screen flags at once (> 10 cells).
# Counts the tears per stroke: entering 7 (d) and the way back (u).   tears.sh <label> <runs> [site port] [window WxH] [chrome|safari] [plan]
# (safari: its window is taken out of the Dock for the run and put back after; a full walk: PLAN="d2600 d2600 d2600 d3800 d3000 … u3000")
LABEL=$1; RUNS=${2:-2}; SITE=${3:-3100}; WIN=${4:-1366x720}; B=${5:-chrome}
N=~/.local/share/node22/bin/node
C=/Users/flaviooliveira/WebstormProjects/STUDIO/docs/development/ios-lab/desk/cenas
P=$(cat ~/.local/share/v5-lab/chrome.pid)
if [ "$B" = safari ]; then PROC='process "Safari"'; osascript -e 'tell application "Safari" to set miniaturized of window 1 to false'; else PROC="(first process whose unix id is $P)"; fi
osascript -e "tell application \"System Events\" to tell $PROC to set size of window 1 to {${WIN%x*}, ${WIN#*x}}"
sleep 1
PLAN=${6:-"d2600 d2600 d2600 d3800 u3200 d3800 u3200 d3800 u3200 d3800 u3200 d3800 u3200 d3800 u3200"}
TE=0; TB=0; NE=0; NB=0
for r in $(seq 1 $RUNS); do
  (cd $C && SITE=$SITE CENAS=${CENAS:-0} $N screen.mjs $B "$PLAN" tears-$LABEL-$r > /dev/null 2>&1)
  D=$(ls -td ~/.local/share/v5-lab/rec/screen/*$B-tears-$LABEL-$r | head -1)
  (cd $C && $N glitch.mjs $D > $D/glitch.txt 2>&1)
  read -r te tb ne nb <<< "$(python3 - "$D" <<'EOF'
import json, sys, re, collections
d = sys.argv[1]
strokes = json.load(open(d + '/plan.json'))['strokes'][3:]
c = collections.Counter(int(m.group(1)) for m in (re.match(r'\s*(\d+) ', l) for l in open(d + '/glitch.txt')) if m)
tears = [t for t, n in c.items() if n > 10]
te = tb = 0
for t in tears:
    prev = [s for s in strokes if s[0] <= t + 150 and t - s[0] < 1500]
    if prev:
        if prev[-1][1] == 'd': te += 1
        else: tb += 1
ne = sum(1 for s in strokes if s[1] == 'd'); nb = len(strokes) - ne
print(te, tb, ne, nb)
EOF
)"
  echo "  run $r: entering 7 $te/$ne, way back $tb/$nb  ($D)"
  TE=$((TE+te)); TB=$((TB+tb)); NE=$((NE+ne)); NB=$((NB+nb))
done
if [ "$B" = safari ]; then osascript -e "tell application \"System Events\" to tell $PROC to set size of window 1 to {1728, 1062}" -e 'tell application "Safari" to set miniaturized of window 1 to true'; else osascript -e "tell application \"System Events\" to tell $PROC to set size of window 1 to {1728, 1029}"; fi
echo "$LABEL: entering 7 $TE/$NE, way back $TB/$NB"
