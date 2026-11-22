#!/bin/bash
# walkstroke.sh <label> "<query>" <n> [gap]: Safari on :3100 directly, real trackpad strokes down (gentle300), the window's top recorded
L=$1; Q=$2; N=$3; GAP=${4:-3.0}
S=~/.local/share/v5-lab; O=$PWD/runs/$L; mkdir -p $O; : > $O/keys.txt
osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate' -e "tell application \"Safari\" to set URL of current tab of front window to \"http://localhost:3100/?$Q&r=$RANDOM\""
sleep 4.5
R=$(osascript -e 'tell application "System Events" to tell process "Safari" to get {position, size} of window 1'); IFS=', ' read -r X Y W H <<< "$R"
PX=$((X + W * 85 / 100)); PY=$((Y + 52 + (H - 52) * 85 / 100))
$S/bin/stroke $PX $PY $S/strokes/empty; osascript -e 'tell application "System Events" to key code 56'; sleep 2.5
SECS=$(python3 -c "print(int($N*($GAP+1)+4))")
screencapture -x -V $SECS -R$X,$Y,$W,200 $O/screen.mov &
T0=$(python3 -c 'import time;print(time.time())')
sleep 1
for i in $(seq 1 $N); do python3 -c "import time;print(round(time.time()-$T0,3))" >> $O/keys.txt; $S/bin/stroke $PX $PY $S/strokes/gentle300; sleep $GAP; done
wait
osascript -e 'tell application "Safari" to set miniaturized of window 1 to true'
