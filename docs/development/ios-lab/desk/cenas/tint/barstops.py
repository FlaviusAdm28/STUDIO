# barstops.py <dir> [labels]: at each stop of a walkbar3.sh recording, the bar's settled colour against the page's top line — the median
# of the last 0.7 s before the next key — and how far apart they are: ΔE2000 (CIE, sRGB D65; ~1 just seen side by side, ≥ 3 clearly
# different, ≥ 6 another colour) and the lightness L* of each. The owner is colour-blind: the match is judged by these numbers (23 Nov).
import subprocess, sys, math, statistics as st

d = sys.argv[1]
names = sys.argv[2].split(',') if len(sys.argv) > 2 else None
fps = 30
mov = f'{d}/screen.mov'


def series(crop):
    # each frame's true average over the crop, from its own pixels (ffmpeg's scale to 1 × 1 read 1–2 levels light over a top that is not
    # one colour: 208 for 206.8, 23 Nov)
    w, h = (int(v) for v in crop.split(':')[:2])
    n = w * h
    out = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', mov, '-vf', f'fps={fps},crop={crop}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    return [tuple(round(sum(out[i + c:i + 3 * n:3]) / n) for c in range(3)) for i in range(0, len(out) - 3 * n + 1, 3 * n)]


def lab(c):
    def lin(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(lin, c)
    x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 216 / 24389 else (24389 / 27 * t + 16) / 116
    fx, fy, fz = f(x), f(y), f(z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def de2000(c1, c2):
    L1, a1, b1 = lab(c1)
    L2, a2, b2 = lab(c2)
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2)
    Cm = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)))
    a1p, a2p = a1 * (1 + G), a2 * (1 + G)
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360
    h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dL, dC = L2 - L1, C2p - C1p
    dh = 0 if C1p * C2p == 0 else (h2p - h1p if abs(h2p - h1p) <= 180 else h2p - h1p - 360 if h2p > h1p else h2p - h1p + 360)
    dH = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dh / 2))
    Lm, Cmp = (L1 + L2) / 2, (C1p + C2p) / 2
    hm = h1p + h2p if C1p * C2p == 0 else ((h1p + h2p) / 2 if abs(h1p - h2p) <= 180 else (h1p + h2p + 360) / 2 if h1p + h2p < 360 else (h1p + h2p - 360) / 2)
    T = 1 - 0.17 * math.cos(math.radians(hm - 30)) + 0.24 * math.cos(math.radians(2 * hm)) + 0.32 * math.cos(math.radians(3 * hm + 6)) - 0.2 * math.cos(math.radians(4 * hm - 63))
    SL = 1 + 0.015 * (Lm - 50) ** 2 / math.sqrt(20 + (Lm - 50) ** 2)
    SC, SH = 1 + 0.045 * Cmp, 1 + 0.015 * Cmp * T
    RT = -2 * math.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7)) * math.sin(math.radians(60 * math.exp(-(((hm - 275) / 25) ** 2))))
    return math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH))


bar = series('400:60:550:20')
top = series('3456:4:0:108')  # the page's first rows under the bar, the whole width
keys = [float(x) for x in open(f'{d}/keys.txt').read().split()]
med = lambda seg: tuple(round(st.median(c[i] for c in seg)) for i in range(3))
rows = []
# the stop before the first key, then after each key
marks = [(0.5, keys[0])] + [(k, keys[i + 1] if i + 1 < len(keys) else k + 3) for i, k in enumerate(keys)]
for i, (a, b) in enumerate(marks):
    seg_b = bar[int((b - 0.75) * fps):int((b - 0.05) * fps)]
    seg_t = top[int((b - 0.75) * fps):int((b - 0.05) * fps)]
    if not seg_b or not seg_t:
        continue
    cb, ct = med(seg_b), med(seg_t)
    name = names[i] if names and i < len(names) else f'stop {i}'
    rows.append((name, cb, ct, de2000(cb, ct), lab(cb)[0], lab(ct)[0]))
print(f'{"stop":14s} {"bar":>15s} {"page top":>15s}  ΔE00   L*bar  L*page')
for name, cb, ct, de, lb, lt in rows:
    print(f'{name:14s} {str(cb):>15s} {str(ct):>15s}  {de:5.1f}  {lb:5.1f}  {lt:5.1f}')
print(f'mean ΔE00 {st.mean(r[3] for r in rows):.1f}, worst {max(r[3] for r in rows):.1f}')
