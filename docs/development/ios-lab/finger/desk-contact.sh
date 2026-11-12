# desk.sh <port> <x> <y> <focus-cmd> <reload-url-cmd>: the Contact on a desktop browser with real macOS wheel events (wheel.swift)
PORT=$1; X=$2; Y=$3; FOCUS=$4; DIR=$(cd "$(dirname "$0")" && pwd)
NS=$DIR; W=${WHEEL:?compile wheel.swift outside the repo and set WHEEL}
run(){ curl -s -m 20 --data-binary "$1" localhost:$PORT/__diag/run | tr -d '"'; }
st(){ curl -s -m 20 --data-binary @$NS/cstate.js localhost:$PORT/__diag/run | tr -d '"'; }
rest(){ run 'return new Promise((ok) => { let y = scrollY, n = 0, k = 0; const f = () => { if (Math.abs(scrollY - y) < 1) n++; else n = 0; y = scrollY; if (n > 30 || ++k > 600) ok(1); else requestAnimationFrame(f) }; f() })' >/dev/null; }
focus(){ eval "$FOCUS"; sleep 0.4; }
pad(){ $W $X $Y $1 $2 pad; sleep 0.3; rest; sleep ${3:-3.6}; }
notch(){ $W $X $Y $1 0; sleep 0.3; rest; sleep 3.6; }
jump(){ run "document.querySelector('.menu a[href=\"$1\"]').click(); return 1" >/dev/null; sleep 2; rest; sleep 3.5; }
series(){ local lab=$1 n=$2; shift 2; local o=""; for i in $(command seq 1 $n); do "$@"; o="$o  $(st)"; done; echo "$lab:$o"; }
focus
jump '#questions'; echo "salto #questions: $(st)"
series "trackpad normal ↓ desde Q" 3 pad 300 20; series "trackpad normal ↑" 4 pad -300 20
jump '#questions'; series "roda ↓ (1 clique)" 3 notch 1; series "roda ↑" 4 notch -1
jump '#questions'; series "trackpad lento ↓" 2 pad 300 150; series "trackpad lento ↑" 3 pad -300 150
jump '#questions'; series "trackpad rápido ↓" 2 pad 1200 8; series "trackpad rápido ↑ (do fim)" 2 pad -1200 8
jump '#questions'; pad 120 10; echo "gesto curto ↓ desde Q: $(st)"
jump '#questions'; $W $X $Y 300 20 pad; sleep 0.7; $W $X $Y -300 20 pad; sleep 0.3; rest; sleep 4; echo "↓ e ↑ a meio da passagem: $(st)"
jump '#contact'; $W $X $Y -300 20 pad; sleep 0.7; $W $X $Y 300 20 pad; sleep 0.3; rest; sleep 4; echo "↑ e ↓ a meio da passagem (do C): $(st)"
