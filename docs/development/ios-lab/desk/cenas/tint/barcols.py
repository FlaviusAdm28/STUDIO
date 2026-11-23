# barcols.py <dir>: at each stop of a walkbar3/4.sh recording, the page's top line in 8 columns (left → right) — how far the page's top
# varies across the width, which one colour in the bar cannot follow
import subprocess, sys, statistics as st
d = sys.argv[1]; fps = 30
out = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{d}/screen.mov', '-vf', f'fps={fps},crop=3456:6:0:108,scale=8:1:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
fr = [[tuple(out[i + j * 3:i + j * 3 + 3]) for j in range(8)] for i in range(0, len(out), 24)]
keys = [float(x) for x in open(f'{d}/keys.txt').read().split()]
for s, b in enumerate(keys + [keys[-1] + 3]):
    seg = fr[int((b - 0.5) * fps):int((b - 0.05) * fps)]
    if not seg: continue
    cols = [round(st.median(f[j][0] for f in seg)) for j in range(8)]
    print(f'stop {s:2d}  red by column: {" ".join(f"{c:3d}" for c in cols)}   spread {max(cols) - min(cols)}')
