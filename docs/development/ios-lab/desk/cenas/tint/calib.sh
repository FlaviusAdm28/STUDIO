#!/bin/bash
# calib.sh <label> "<query>" <secs>: Safari on calib.html (served on 3150), its window's top recorded; then calib.py <dir> <set>
L=$1; Q=$2; SECS=${3:-55}
O=$PWD/runs/$L; mkdir -p $O
osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate' -e "tell application \"Safari\" to set URL of current tab of front window to \"http://localhost:3150/calib.html?$Q&r=$RANDOM\""
R=$(osascript -e 'tell application "System Events" to tell process "Safari" to get {position, size} of window 1'); IFS=', ' read -r X Y W H <<< "$R"
sleep 0.3
screencapture -x -V $SECS -R$X,$Y,$W,200 $O/screen.mov
osascript -e 'tell application "Safari" to set miniaturized of window 1 to true'
