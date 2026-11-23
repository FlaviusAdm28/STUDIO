# edgeprobe.py <dir>: edgeprobe.mjs's table — at each stop the colour painted for the top against the screen's first rows (their true
# average, and its spread across 8 columns), ΔE2000 between them
import json, subprocess, sys, re
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from barstops_lab import de2000  # noqa: E402

d = sys.argv[1]
rows = json.load(open(f'{d}/rows.json'))
print(f'{"stop":10s} {"section":10s} {"painted":>16s} {"top (mean)":>16s}  ΔE00  red by column')
for r in rows:
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{d}/{r["f"]}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    n = len(raw) // 3
    top = tuple(round(sum(raw[c::3]) / n) for c in range(3))
    w = n // 4
    cols = []
    for j in range(8):
        seg = [raw[(row * w + x) * 3] for row in range(4) for x in range(j * w // 8, (j + 1) * w // 8)]
        cols.append(round(sum(seg) / len(seg)))
    m = re.findall(r'\d+', r['paint'])
    painted = tuple(int(v) for v in m[:3]) if len(m) >= 3 else None
    de = de2000(painted, top) if painted else float('nan')
    print(f'{str(r["stop"]):10s} {str(r["sec"]):10s} {str(painted):>16s} {str(top):>16s}  {de:4.1f}  {" ".join(f"{c:3d}" for c in cols)}')
