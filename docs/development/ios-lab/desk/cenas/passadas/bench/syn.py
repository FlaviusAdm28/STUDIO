# the bench's made-up cases (bench.mjs "synthetic"), written to ~/.local/share/v5-lab/strokes-syn: a stroke again after a silence (two strokes),
# joined events inside a momentum (one), a strong momentum cut by a silence (two: missed by both rules, a finger starts small)
import os
D = os.path.expanduser('~/.local/share/v5-lab/strokes-syn')
os.makedirs(D, exist_ok=True)
def flick(peak, sign=1):
    return [(8, round(sign * max(1, peak * min(1, (i + 0.5) / 12) ** 1.2))) for i in range(10)] + [(8, round(sign * v)) for v in [peak * 0.5, peak * 0.25, peak * 0.12, peak * 0.06, 2, 1]]
def stroke(peak, n_mom, sign=1):
    rows = [(8, round(sign * max(1, peak * min(1, (i + 0.5) / 12) ** 1.3))) for i in range(20)]
    v = peak * 0.8
    for _ in range(n_mom):
        rows.append((8, round(sign * max(1, v)))); v *= 0.985
    return rows
def write(name, rows, want):
    open(f'{D}/{name}', 'w').write('\n'.join(f'{dt} {dy}' for dt, dy in rows) + '\n'); open(f'{D}/{name}.want', 'w').write(str(want))
for sil in (30, 60, 100, 150, 200, 280):
    for p1, p2 in ((120, 120), (120, 40), (40, 120), (200, 60)):
        a = flick(p1); b = flick(p2); b[0] = (sil, b[0][1])
        # within 150 ms of the first stroke's start a hand does not begin again: one stroke (strokes.ts AGAIN)
        write(f'pause{sil}-{p1}-{p2}', a + b, 1 if sil == 30 and p1 == 40 else 2)
for k in (2, 3, 4, 5, 7):
    for at in (40, 80, 140, 220, 300):
        rows = stroke(150, 360); i = 20 + at
        if i + k >= len(rows): continue
        write(f'joined{k}-at{at}', rows[:i] + [(8 * k, sum(r[1] for r in rows[i:i + k]))] + rows[i + k:], 1)
for k1, k2 in ((3, 4), (5, 5), (2, 6)):
    rows = stroke(150, 360); i = 20 + 150
    j1 = (8 * k1, sum(r[1] for r in rows[i:i + k1])); j2 = (8 * k2, sum(r[1] for r in rows[i + k1:i + k1 + k2]))
    write(f'joined{k1}+{k2}', rows[:i] + [j1, j2] + rows[i + k1 + k2:], 1)
FL = [60, 120, 120, 90, 50, 25, 12, 6]
for sil in (30, 60, 100, 150, 200, 280):
    for first in (20, 60, 150):
        a = [(8, v) for v in FL]; b = [(8, v) for v in [first] + FL[1:]]; b[0] = (sil, first)
        write(f'abrupt{sil}-{first}', a + b, 1 if sil <= 60 else 2)
    rows = [(8, round(max(1, 150 * min(1, (i + 0.5) / 12) ** 1.3))) for i in range(20)]
    v = 120
    for _ in range(40): rows.append((8, round(v))); v *= 0.985
    b = [(8, v) for v in [60] + FL[1:]]; b[0] = (sil, 60)
    write(f'cut{sil}', rows + b, 2)
print(len([f for f in os.listdir(D) if not f.endswith('.want')]), 'cases in', D)
