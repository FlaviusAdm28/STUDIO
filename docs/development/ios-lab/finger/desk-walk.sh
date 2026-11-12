PORT=$1; X=$2; Y=$3; FOCUS=$4; DIR=$(cd "$(dirname "$0")" && pwd); W=${WHEEL:?compile wheel.swift outside the repo and set WHEEL}; NS=$DIR
run(){ curl -s -m 20 --data-binary "$1" localhost:$PORT/__diag/run | tr -d '"'; }
rest(){ run 'return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })' >/dev/null; }
wh(){ curl -s -m 20 --data-binary @$NS/where.js localhost:$PORT/__diag/run | tr -d '"'; }
walk(){ local lab=$1 n=$2 dy=$3 ev=$4 p=$5; local o=""; for k in $(command seq 1 $n); do $W $X $Y $dy $ev pad; sleep 0.3; rest; o="$o $(wh)"; sleep $p; done; echo "$lab:$o"; }
eval "$FOCUS"; sleep 0.5
run "document.querySelector('.menu a[href=\"#work\"]').click(); return 1" >/dev/null; sleep 3; rest; echo "#work: $(wh)"
walk "trackpad normal ↓" 19 300 20 2.6; walk "trackpad normal ↑" 20 -300 20 2.2
run "document.querySelector('.menu a[href=\"#work\"]').click(); return 1" >/dev/null; sleep 3; rest
walk "trackpad rápido ↓" 17 1200 8 2.6; walk "trackpad rápido ↑" 18 -1200 8 2.2
