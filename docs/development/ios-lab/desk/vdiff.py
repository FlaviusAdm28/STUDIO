#!/usr/bin/env python3
"""vdiff.py <label>… — the strategy's phase 0: what the recording itself shows (the tape's elements can be clipped, hidden or copies; the
video is what a visitor saw). Per video frame, how much the picture changed from the frame before (ffmpeg's scene score, 0–1, on a small
copy); a spike well above the frames around it is a cut, a flash or a jump seen on screen. Each spike is placed on the tape (step, section,
scrollY) and written to $S/rec/<label>.vdiff. The video starts at recWall and the tape at vtWall (sweep.mjs's steps file)."""
import bisect, json, os, re, statistics, subprocess, sys

S = os.environ['S']

def scores(label):
    cache = f'{S}/rec/{label}.scores'
    if not os.path.exists(cache):
        subprocess.run(['/usr/local/bin/ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', f'{S}/rec/{label}.mp4', '-vf',
                        f"scale=288:-2,select='gte(scene,0)',metadata=print:key=lavfi.scene_score:file={cache}", '-f', 'null', '-'], check=True)
    out, t = [], None
    for line in open(cache):
        m = re.search(r'pts_time:([\d.]+)', line)
        if m: t = float(m.group(1))
        m = re.search(r'scene_score=([\d.]+)', line)
        if m and t is not None: out.append((t, float(m.group(1))))
    return out

def run(label):
    sc = scores(label)
    st = json.load(open(f'{S}/rec/{label}.steps.json'))
    vt = json.load(open(f'{S}/rec/{label}.vt.json'))
    off = (st['vtWall'] - st['recWall']) / 1000
    fr = vt['frames']; ft = [f[0] for f in fr]; marks = vt['marks']
    v = [s for _, s in sc]
    # the video's start is known only roughly (ffmpeg starts capturing a moment after it is spawned): the offset is set so that the
    # tape's page jumps (more than 150 px in a frame) fall on the video's biggest changes
    jumps = [fr[i][0] / 1000 for i in range(1, len(fr)) if abs(fr[i][1] - fr[i - 1][1]) > 150]
    vts = [t for t, _ in sc]
    def fit(d):
        tot = 0
        for jt in jumps:
            k = bisect.bisect_left(vts, jt + off + d)
            tot += max(v[max(0, k - 2):k + 3] or [0])
        return tot
    best = max((fit(k / 60 - 1), k / 60 - 1) for k in range(0, 79))  # −1 … +0.3 s: bursts are periodic, a wider search fits a whole period off
    off += best[1]
    calib = best[1]
    open(f'{S}/rec/{label}.calib', 'w').write(f'{calib:.4f}')
    lines = []
    for i in range(6, len(sc) - 6):
        s = v[i]
        around = v[i - 6:i - 1] + v[i + 2:i + 7]
        base = statistics.median(around)
        if s < 0.04 or s < 4 * max(base, 0.004): continue
        if s < v[i - 1] or s < v[i + 1]: continue
        tt = (sc[i][0] - off) * 1000
        if tt < 0: continue
        j = max(0, bisect.bisect_left(ft, tt) - 1)
        f = fr[j] if fr else [0, 0, '', '', []]
        step = '(start)'
        for mt, m in marks:
            if mt <= tt: step = f'{m}@{mt/1000:.1f}s'
        # the page still around it (±0.25 s): a change seen with nothing scrolling
        lo, hi = bisect.bisect_left(ft, tt - 250), bisect.bisect_right(ft, tt + 250)
        span = [x[1] for x in fr[lo:hi]] or [f[1]]
        still = max(span) - min(span) < 4
        lines.append((s, tt, step, f[2], f[1], f[3], base, still))
    lines.sort(key=lambda x: x[1])
    with open(f'{S}/rec/{label}.vdiff', 'w') as o:
        o.write(f'== {label}: {len(sc)} video frames, {len(lines)} spikes, {sum(x[7] for x in lines)} with the page still; video offset corrected by {calib:+.3f} s\n')
        for s, tt, step, sec, y, flags, base, still in lines:
            o.write(f'  {"STILL" if still else "moving"} t={tt/1000:7.2f}s score {s:.3f} (around {base:.3f}) after {step:<22} [{sec}] y={y} {flags}\n')
    print(f'{label}: {len(lines)} spikes, {sum(x[7] for x in lines)} still, offset {calib:+.3f} s')

for label in sys.argv[1:]:
    run(label)
