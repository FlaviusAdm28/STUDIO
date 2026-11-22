#!/bin/bash
# bug 2 on :3100 directly: the Method by its address, ArrowDown to 10, the window recorded over 10 → 11, back to 10, 11 again
L=$1; URL=${2:-"http://localhost:3100/?cenas=1#method"}
O=$PWD/runs/$L; mkdir -p $O
osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate' -e "tell application \"Safari\" to set URL of current tab of front window to \"$URL\""
sleep 4.5
R=$(osascript -e 'tell application "System Events" to tell process "Safari" to get {position, size} of window 1'); IFS=', ' read -r X Y W H <<< "$R"
key() { osascript -e "tell application \"System Events\" to key code $1"; }
key 56; sleep 2
for i in 1 2 3 4 5; do key 125; sleep 1.6; done
sleep 2.5
screencapture -x -V 11 -R$X,$Y,$W,300 $O/screen.mov &
sleep 1; key 125; sleep 4; key 126; sleep 2.5; key 125
wait
osascript -e 'tell application "Safari" to set miniaturized of window 1 to true'
