#!/bin/bash
# walkbar.sh <label> <down|up> [gap s] [keys]: Safari on :3100 directly, the window's top recorded while ArrowDown (or, from the end, ArrowUp)
# walks the page stop by stop; key times in keys.txt (seconds from the recording's start)
L=$1; WAY=$2; GAP=${3:-3.2}; N=${4:-16}
O=$PWD/runs/$L; mkdir -p $O; : > $O/keys.txt
osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate' -e "tell application \"Safari\" to set URL of current tab of front window to \"http://localhost:3100/?cenas=1&r=$RANDOM\""
sleep 4.5
R=$(osascript -e 'tell application "System Events" to tell process "Safari" to get {position, size} of window 1'); IFS=', ' read -r X Y W H <<< "$R"
key() { osascript -e "tell application \"System Events\" to key code $1"; }
key 56; sleep 2.5
if [ "$WAY" = up ]; then key 119; sleep 3; fi   # End: to the page's end first
SECS=$(python3 -c "print(int($N*$GAP+4))")
screencapture -x -V $SECS -R$X,$Y,$W,200 $O/screen.mov &
T0=$(python3 -c 'import time;print(time.time())')
sleep 1.5
K=$([ "$WAY" = up ] && echo 126 || echo 125)
for i in $(seq 1 $N); do python3 -c "import time;print(round(time.time()-$T0,3))" >> $O/keys.txt; key $K; sleep $GAP; done
wait
osascript -e 'tell application "Safari" to set miniaturized of window 1 to true'
echo $O
