#!/bin/bash
# walkbar3.sh <label> "<query>" <down|up> [gap] [n]: through the bare proxy (3147), ArrowDown from the top or ArrowUp from the end
L=$1; Q=$2; WAY=$3; GAP=${4:-3.2}; N=${5:-16}
O=$PWD/runs/$L; mkdir -p $O; : > $O/keys.txt
osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate' -e "tell application \"Safari\" to set URL of current tab of front window to \"http://localhost:3147/?cenas=1&$Q&r=$RANDOM\""
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
for i in $(seq 1 $N); do python3 -c "import time;print(round(time.time()-$T0,3))" >> $O/keys.txt; key $K; sleep $GAP; done
wait
osascript -e 'tell application "Safari" to set miniaturized of window 1 to true'
