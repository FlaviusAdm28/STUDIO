# the bar against the page's top line, frame by frame (60 fps), around each key of a walkbar.sh recording: the bar's colour before and after,
# how long it took to change, its largest step from one frame to the next (a jump shows as one large step), and the page's top line the same
import subprocess, sys
d = sys.argv[1]; fps = 60
mov = f'{d}/screen.mov'
def series(crop):
    out = subprocess.run(['ffmpeg','-loglevel','error','-i',mov,'-vf',f'fps={fps},crop={crop},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return [tuple(out[i:i+3]) for i in range(0, len(out), 3)]
bar = series('400:60:550:20')
top = series('3456:6:0:108')   # the page's first rows under the bar, the whole width
keys = [float(x) for x in open(f'{d}/keys.txt').read().split()]
lum = lambda c: sum(c) / 3
for i, k in enumerate(keys):
    a = int((k - 0.1) * fps); b = int(min(len(bar) - 1, (keys[i + 1] if i + 1 < len(keys) else k + 3) * fps - 1))
    seg = bar[a:b]; pg = top[a:b]
    if not seg: continue
    steps = [max(abs(seg[j][c] - seg[j - 1][c]) for c in range(3)) for j in range(1, len(seg))]
    big = max(steps) if steps else 0
    moved = [j for j, s in enumerate(steps) if s > 1]
    dur = (moved[-1] - moved[0] + 1) / fps if moved else 0
    psteps = [max(abs(pg[j][c] - pg[j - 1][c]) for c in range(3)) for j in range(1, len(pg))]
    print(f'key {i + 1:2d} @{k:6.2f}s  bar {seg[0]} → {seg[-1]}  over {dur:4.2f}s, largest step {big:3d} | page top {pg[0]} → {pg[-1]}, largest step {max(psteps) if psteps else 0:3d}')
