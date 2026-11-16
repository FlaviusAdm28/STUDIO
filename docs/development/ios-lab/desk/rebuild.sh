#!/bin/zsh
# rebuild the V5 and restart the production server on 3100 (Node 22 from the scratchpad; the system Node is 20.5)
N22=$HOME/.local/share/node22/bin/node
S=${S:-$HOME/.local/share/node22/../v5-lab}; mkdir -p $S/rec
cd /Users/flaviooliveira/WebstormProjects/STUDIO || exit 1
PID=$(lsof -tiTCP:3100 -sTCP:LISTEN); [ -n "$PID" ] && kill $PID && sleep 1
$N22 node_modules/next/dist/bin/next build > $S/rec/build.log 2>&1 || { tail -30 $S/rec/build.log; exit 1 }
grep -E "warn|error" $S/rec/build.log | head -5
nohup $N22 node_modules/next/dist/bin/next start -p 3100 > $S/rec/start.log 2>&1 &
for i in {1..40}; do curl -s -o /dev/null http://localhost:3100/ && { echo "3100 up"; exit 0 }; sleep 0.5; done
echo "3100 not up"; tail -5 $S/rec/start.log; exit 1
