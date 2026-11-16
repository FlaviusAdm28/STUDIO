#!/bin/bash
# phase0.sh [chrome|safari|both] [M1 …] — the strategy's phase 0 matrix (v5-scroll-strategy.md): each sweep in each browser, recorded,
# then vscan.py. S must be set; the lab (3100, proxies 3141 and 3142, the test Chrome) up; nobody using the Mac (strokes and keys go to
# the window in front). Logs and tapes in $S/rec/p0-<browser>-<M>.*
set -u
cd "$(dirname "$0")"
N=~/.local/share/node22/bin/node
rep() { local n=$1; shift; for ((i = 0; i < n; i++)); do printf '%s ' "$@"; done; }
steps() {  # bash 3.2 (macOS): no associative arrays
  case $1 in
    M1) echo "$(rep 17 swipe120:3800) $(rep 17 swipe120-up:3800)" ;;
    M2) echo "$(rep 17 swipe300:3800) $(rep 17 swipe300-up:3800)" ;;
    M3) echo "$(rep 17 swipe800:3800) $(rep 17 swipe800-up:3800)" ;;
    M4) echo "$(rep 17 o15-drag:3000) $(rep 17 o15-drag-up:3000)" ;;
    M5) echo "$(rep 20 swipe300:400!) swipe300:4000 $(rep 20 swipe300-up:400!) swipe300-up:4000" ;;
    M6) echo "$(rep 16 swipe300:250! swipe300-up:3800 swipe300:3800) $(rep 16 swipe300-up:250! swipe300:3800 swipe300-up:3800)" ;;
    M7) echo "menu=work:3500 swipe300:3800 swipe300-up:3800 menu=method:3500 swipe300:3800 swipe300-up:3800 menu=about:3500 swipe300:3800 swipe300-up:3800 menu=questions:3500 swipe300:3800 swipe300-up:3800 menu=contact:3500 swipe300-up:3800 swipe300:3800 name:300! swipe300:3800 name:3000 $(rep 17 key=PageDown:3000) $(rep 17 key=PageUp:3000) $(rep 5 key=Space:3000) key=End:3500 key=Home:3500" ;;
    M8) echo "owner-chain-chrome:6000 owner-chain-safari:6000 owner-chain-safari-up:6000 owner-chain-chrome-up:6000 owner-chrome-2:8000 owner-chrome-3:8000" ;;
  esac
}
which=${1:-both}; shift || true
list=${*:-M1 M2 M3 M4 M5 M6 M7 M8}
browsers=$([ "$which" = both ] && echo "chrome safari" || echo "$which")
for m in $list; do
  for b in $browsers; do
    label="${TAG:-p0}-$b-$m"  # TAG: a later run beside the phase 0 baseline (e.g. TAG=p3s1)
    echo "=== $label $(date +%H:%M:%S)"
    # shellcheck disable=SC2086
    timeout 900 $N sweep.mjs "$b" "$label" 600 $(steps "$m") > "$S/rec/$label.log" 2>&1
    echo "exit $? $(tail -1 "$S/rec/$label.log")"
    ls -t ~/Library/Logs/DiagnosticReports/com.apple.WebKit.WebContent-* 2>/dev/null | head -1
    python3 vscan.py "$label" > "$S/rec/$label.scan" 2>&1; head -1 "$S/rec/$label.scan"
  done
done
echo "=== done $(date +%H:%M:%S)"
