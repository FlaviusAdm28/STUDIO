# burst NAME N GAP PEAK SIGN[,SIGN...] : N flicks (finger ~190 ms, lifted fast, momentum from 0.8 of the peak), each cut by the next after GAP ms
import sys, math, os
name, n, gap, peak = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), float(sys.argv[4])
signs = [int(s) for s in sys.argv[5].split(',')] if len(sys.argv) > 5 else [1]
rows = []
wait = 0
for k in range(n):
    sg = signs[k % len(signs)]
    t = 0; ev = 24
    for i in range(ev):
        x = (i + 0.5) / ev
        d = peak * (min(1, x / 0.6)) ** 1.3  # ramp up, lifted at speed (a flick)
        rows.append((8 + (wait if i == 0 else 0), round(sg * max(1, d)), 'b' if i == 0 else 'e' if i == ev - 1 else 'c')); t += 8
    v = peak * 0.8; first = True
    while abs(v) >= 1 and t + 16 <= gap:
        rows.append((16, round(sg * v), 'mb' if first else 'mc')); first = False; v *= 0.95; t += 16
    rows.append((16, round(sg), 'me'))
    wait = max(0, gap - t)
open(f"{os.environ['HOME']}/.local/share/v5-lab/strokes/{name}", 'w').write('\n'.join(f'{a} {b} {c}' for a, b, c in rows) + '\n')
print(name, len(rows), 'events', sum(r[0] for r in rows), 'ms')
