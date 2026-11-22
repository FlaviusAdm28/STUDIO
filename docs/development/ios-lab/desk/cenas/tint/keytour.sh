#!/bin/bash
# keytour.sh <label> "<query>": Safari on the bare proxy (3147), ArrowDown through the page, a screenshot of the window's top after each stop
L=$1; Q=$2; O=$PWD/runs/$L; mkdir -p $O
osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate' -e "tell application \"Safari\" to set URL of current tab of front window to \"http://localhost:3147/?cenas=1&$Q&r=$RANDOM\""
sleep 4.5
R=$(osascript -e 'tell application "System Events" to tell process "Safari" to get {position, size} of window 1'); IFS=', ' read -r X Y W H <<< "$R"
key() { osascript -e "tell application \"System Events\" to key code $1"; }
key 56; sleep 2.5
for i in $(seq 0 15); do
  screencapture -x -R$X,$Y,$W,160 $O/s$i.png
  python3 -c "
import subprocess
def px(x,y):
    out=subprocess.run(['ffmpeg','-loglevel','error','-i','$O/s$i.png','-vf',f'crop=60:20:{x}:{y},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return f'{out[0]},{out[1]},{out[2]}'
print('stop $i'.ljust(8),'bar',px(600,30).ljust(13),'page',px(1600,140),'page top row',px(1600,108),px(300,108),px(3000,108))"
  key 125; sleep 3.2
done
osascript -e 'tell application "Safari" to set miniaturized of window 1 to true'
