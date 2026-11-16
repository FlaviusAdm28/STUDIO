#!/usr/bin/env python3
"""vscan.py <label>… — the strategy's phase 0 (v5-scroll-strategy.md): reads $S/rec/<label>.vt.json (vtape.js) and .steps.json (sweep.mjs)
and lists what a visitor would see go wrong, frame by frame:
  JUMP      an element moves or resizes in one frame far more than in the frames around it (the page not jumping)
  SWAP      an element leaves and another showing the same photograph appears in the same frame, elsewhere or another size
  FLASH     an element's opacity changes at once (not a fade) while it stays in view
  PHOTO     the file an image shows changes while it is in view
  POP       a visible element appears or vanishes away from the screen's edges, with no swap and no page jump
  PAGE      the page moves more than 150 px in one frame (a jump: the site's scrollTo, the browser's snap)
  SLOW      a frame longer than 50 ms
  STEP      a step that did not land on the next stop (a stroke) — from the steps file
Each finding carries the time, the step it followed and the section. Same kind + element + step → counted, shown once."""
import json, os, sys, statistics
from collections import defaultdict

S = os.environ['S']

def load(label):
    vt = json.load(open(f'{S}/rec/{label}.vt.json'))
    st = json.load(open(f'{S}/rec/{label}.steps.json'))
    return vt, st

def scan(label):
    vt, st = load(label)
    els, frames, marks = vt['els'], vt['frames'], vt['marks']
    H = 0
    state = {}            # key -> [x,y,w,h,o,src]
    series = defaultdict(list)  # key -> list of (fi, rec or None)
    for fi, (t, y, sec, flags, recs) in enumerate(frames):
        for r in recs:
            k = r[0]
            if len(r) == 1:
                state.pop(k, None); series[k].append((fi, None))
            else:
                state[k] = r[1:]; series[k].append((fi, r[1:]))
                H = max(H, r[2] + r[4])
    W = max((r[1:][0] + r[1:][2] for f in frames for r in f[4] if len(r) > 1), default=1728)
    def step_at(t):
        s = '(start)'
        for mt, m in marks:
            if mt <= t: s = f'{m}@{mt/1000:.1f}s'
        return s
    found = []
    def add(kind, fi, el, detail):
        t = frames[fi][0]
        found.append((kind, t, step_at(t), frames[fi][2], el, detail))
    ys = [f[1] for f in frames]
    page_jump = set()
    for fi in range(1, len(frames)):
        dt = frames[fi][0] - frames[fi - 1][0]
        if dt > 50: add('SLOW', fi, '', f'{dt} ms')
        if abs(ys[fi] - ys[fi - 1]) > 150:
            page_jump.add(fi); add('PAGE', fi, '', f'{ys[fi-1]} → {ys[fi]}')
    # per element, rebuild a dense per-frame track (None = out of view)
    dense = {}
    for k, ch in series.items():
        tr = [None] * len(frames); cur = None; j = 0
        ch_by = {fi: rec for fi, rec in ch}
        for fi in range(len(frames)):
            if fi in ch_by: cur = ch_by[fi]
            tr[fi] = cur
        dense[k] = tr
    def edge(r):
        x, y, w, h = r[0], r[1], r[2], r[3]
        return y <= 2 or y + h >= H - 2 or x <= 2 or x + w >= W - 2 or y < 0 or y + h > H
    # leaving and arriving per frame, for SWAP
    for fi in range(1, len(frames)):
        if fi in page_jump or (fi + 1 < len(frames) and fi + 1 in page_jump): continue
        gone, came = [], []
        for k, tr in dense.items():
            a, b = tr[fi - 1], tr[fi]
            if a and not b and a[4] >= 30: gone.append((k, a))
            if b and not a and b[4] >= 30: came.append((k, b))
        for k, b in came:
            match = [(gk, a) for gk, a in gone if a[5] and a[5] == b[5]]
            if match:
                gk, a = match[0]
                dx, dy, dw, dh = b[0] - a[0], b[1] - a[1], b[2] - a[2], b[3] - a[3]
                if max(abs(dx), abs(dy)) > 6 or abs(dw) > 0.03 * a[2] or abs(dh) > 0.03 * a[3]:
                    add('SWAP', fi, f'{els[gk]}  ⇒  {els[k]}', f'Δ {dx:+},{dy:+} px, size {a[2]}×{a[3]} → {b[2]}×{b[3]}')
            elif not edge(b) and b[2] * b[3] > 4000:
                add('POP', fi, els[k], f'in at {b[0]},{b[1]} {b[2]}×{b[3]} o={b[4]}')
        for k, a in gone:
            if not any(a[5] and a[5] == b[5] for _, b in came) and not edge(a) and a[2] * a[3] > 4000:
                add('POP', fi, els[k], f'out from {a[0]},{a[1]} {a[2]}×{a[3]} o={a[4]}')
    # per element motion against its neighbours
    for k, tr in dense.items():
        for fi in range(3, len(frames) - 3):
            a, b = tr[fi - 1], tr[fi]
            if not a or not b or b[4] < 20 or fi in page_jump: continue
            d = [b[i] - a[i] for i in range(4)]
            near = []
            for j in (fi - 2, fi - 1, fi + 1, fi + 2):
                p, q = tr[j - 1], tr[j]
                if p and q: near.append(max(abs(q[i] - p[i]) for i in range(4)))
            base = statistics.median(near) if near else 0
            m = max(abs(x) for x in d)
            # moving with the page (scroll) is not a jump of its own
            ds = ys[fi] - ys[fi - 1]
            if abs(d[1] + ds) < 3 and abs(d[0]) < 3 and abs(d[2]) < 3: continue
            if m >= 24 and m > 4 * max(base, 2):
                add('JUMP', fi, els[k], f'Δx{d[0]:+} Δy{d[1]:+} Δw{d[2]:+} Δh{d[3]:+} (neighbours {base:.0f}), scroll {ds:+}')
            if abs(b[4] - a[4]) >= 35 and (not near or base < 10):
                add('FLASH', fi, els[k], f'opacity {a[4]} → {b[4]}')
            if a[5] and b[5] and a[5] != b[5] and min(a[4], b[4]) >= 30:
                add('PHOTO', fi, els[k], f'{a[5]} → {b[5]}')
    # steps
    stops = sorted({int(s['to'].split()[0]) for s in st['steps'] if s['to']})
    for s in st['steps']:
        if not s['from'] or not s['to']: continue
        f, t = int(s['from'].split()[0]), int(s['to'].split()[0])
        name = s['step']
        if not name.startswith('swipe') and not name.startswith('o'): continue
        way = -1 if 'up' in name else 1
        ahead = [x for x in stops if way * (x - f) > 2]
        nxt = (min(ahead) if way > 0 else max(ahead)) if ahead else f
        if abs(t - nxt) > 3:
            found.append(('STEP', s['at'], name, '', f"{s['from']} → {s['to']}", f'expected {nxt}'))
    return found, len(frames), frames[-1][0] if frames else 0

if __name__ == '__main__':
    for label in sys.argv[1:]:
        found, n, dur = scan(label)
        kinds = defaultdict(int)
        groups = defaultdict(list)
        for f in found:
            kinds[f[0]] += 1
            groups[(f[0], f[4], f[2].split('@')[0])].append(f)
        print(f'== {label}: {n} frames, {dur/1000:.0f} s; ' + ', '.join(f'{k} {v}' for k, v in sorted(kinds.items())))
        for (kind, el, step), fs in sorted(groups.items(), key=lambda g: (g[0][0], g[1][0][1])):
            f = fs[0]
            print(f'  {kind:5} ×{len(fs):<3} t={f[1]/1000:7.2f}s after {f[2]:<22} [{f[3]}] {el[:110]}  {f[5]}')
