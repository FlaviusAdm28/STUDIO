# real NAME PEAK SIGNS GAP : strokes like the owner's trackpad (events every 8 ms, finger and momentum alike, as rec.js recorded them):
# finger ~20 events ramping to PEAK and lifted at speed, then a momentum from 0.8 PEAK decaying 0.985 per 8 ms down to 1 (a strong stroke's
# ~2 s). SIGNS e.g. 1 or 1,1,-1; GAP ms from one stroke's start to the next (the next cuts the momentum); 0 = each runs out, then 400 ms
import sys, os
name, peak, signs, gap = sys.argv[1], float(sys.argv[2]), [int(s) for s in sys.argv[3].split(',')], int(sys.argv[4])
rows = []; wait = 0
for k, sg in enumerate(signs):
    t = 0
    for i in range(20):
        x = (i + 0.5) / 20
        d = peak * min(1, x / 0.6) ** 1.3
        rows.append((8 + (wait if i == 0 else 0), round(sg * max(1, d)), 'b' if i == 0 else 'e' if i == 19 else 'c')); t += 8
    v = peak * 0.8; first = True
    while v >= 1 and (gap == 0 or t + 8 <= gap):
        rows.append((8, round(sg * v), 'mb' if first else 'mc')); first = False; v *= 0.985; t += 8
    rows.append((8, sg, 'me')); t += 8
    wait = max(0, gap - t) if gap else 400
open(f"{os.environ['HOME']}/.local/share/v5-lab/strokes/{name}", 'w').write('\n'.join(f'{a} {b} {c}' for a, b, c in rows) + '\n')
print(name, len(rows), 'events', sum(r[0] for r in rows), 'ms')
