#!/bin/bash
# which.sh: what in the page desktop Safari's bar takes its colour from (23 Nov), on calib.html (3150), each run's bar − page per colour:
#   above   body and the strip painted X − 8, the page above the strip covered by an element in X itself: body read as a tint (bar − page
#           ~0) or only as the page scrolled off above the viewport (~+6)?
#   tall    only the strip X − 8, 1000 px of it: does a tall enough strip alone carry the bar?
#   at0/1/50  body and the strip X − 8 with the page at its top / 1 px / 50 px down: where does the lift start?
cd "$(dirname "$0")"
run() { bash calib.sh "$1" "$2" 27 && echo "== $1 ($2)" && python3 calib.py "runs/$1" mix | sed -E 's/.*bar − page +//' | tr '\n' '|'; echo; }
run w-above "mode=both&set=mix&comp=8&on=body,feed&above=1"
run w-tall "mode=both&set=mix&comp=8&on=feed&fh=1000"
run w-at0 "mode=both&set=mix&comp=8&on=body,feed&at=0"
run w-at1 "mode=both&set=mix&comp=8&on=body,feed&at=1"
run w-at50 "mode=both&set=mix&comp=8&on=body,feed&at=50"
