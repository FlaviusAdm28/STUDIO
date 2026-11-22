#!/bin/bash
# vid.sh chrome|safari label plan secs : the window recorded while rec.mjs / saf.mjs plays the plan; frames tiled with their time
B=$1; L=$2; PLAN=$3; SECS=${4:-16}
N=~/.local/share/node22/bin/node; export OUTDIR=$PWD/runs PX=0.15 PY=0.85
if [ "$B" = safari ]; then osascript -e 'tell application "Safari" to set miniaturized of window 1 to false' -e 'tell application "Safari" to activate'; sleep 1; R=$(osascript -e 'tell application "System Events" to tell process "Safari" to get {position, size} of window 1'); else R=$(osascript -e "tell application \"System Events\" to tell (first process whose unix id is $(cat ~/.local/share/v5-lab/chrome.pid)) to get {position, size} of window 1"); fi
IFS=', ' read -r X Y W H <<< "$R"
mkdir -p runs/$L
( sleep 3.2; screencapture -x -V $SECS -R$X,$Y,$W,$H runs/$L/screen.mov ) &
if [ "$B" = safari ]; then $N saf.mjs "$PLAN" $L > /dev/null; else $N rec.mjs "$PLAN" $L > /dev/null; fi
wait
echo "$R"
