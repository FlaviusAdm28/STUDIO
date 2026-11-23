#!/bin/bash
# walkbar4.sh <label> "<query>" <down|up> [gap] [n]: walkbar3.sh, and the tab's title read at each stop (with &dbg: the colour the page paints); CEN=0: the site without the conductor
L=$1; Q=$2; WAY=$3; GAP=${4:-3.2}; N=${5:-16}
O=$PWD/runs/$L; mkdir -p $O; : > $O/keys.txt; : > $O/titles.txt
osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate' -e "tell application \"Safari\" to set URL of current tab of front window to \"http://localhost:3147/?cenas=${CEN:-1}&$Q&r=$RANDOM\""
sleep 4.5
R=$(osascript -e 'tell application "System Events" to tell process "Safari" to get {position, size} of window 1'); IFS=', ' read -r X Y W H <<< "$R"
key() { osascript -e "tell application \"System Events\" to key code $1"; }
key 56; sleep 2.5
if [ "$WAY" = up ]; then key 119; sleep 3; fi
SECS=$(python3 -c "print(int($N*$GAP+4))")
screencapture -x -V $SECS -R$X,$Y,$W,200 $O/screen.mov &
T0=$(python3 -c 'import time;print(time.time())')
sleep 1.5
K=$([ "$WAY" = up ] && echo 126 || echo 125)
title() { osascript -e 'tell application "Safari" to get name of current tab of front window' >> $O/titles.txt; }
title
for i in $(seq 1 $N); do python3 -c "import time;print(round(time.time()-$T0,3))" >> $O/keys.txt; key $K; sleep $GAP; title; done
wait
osascript -e 'tell application "Safari" to set miniaturized of window 1 to true'
