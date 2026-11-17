# The arch's tone frame by frame around each way back to the top (Safari's grey arch, 17 Nov): the mean level and the contrast (standard
# deviation) of the arch's sky and couple, every recorded frame, from 150 ms before each stroke up to 450 ms after. A grey frame shows as
# a dip in both against the frames around it.
#   python3 arch-tone.py <screen.mjs dir>
import json, subprocess, sys
d = sys.argv[1]
plan = json.load(open(f'{d}/plan.json'))
pts = [float(x) for x in subprocess.run(['/usr/local/bin/ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'frame=pts_time', '-of', 'csv=p=0', f'{d}/screen.mov'], capture_output=True, text=True).stdout.replace(',', ' ').split()]
W, H = 40, 60
raw = subprocess.run(['/usr/local/bin/ffmpeg', '-loglevel', 'error', '-i', f'{d}/screen.mov', '-fps_mode', 'passthrough', '-vf', f'crop=iw*0.2:ih*0.4:iw*0.08:ih*0.24,scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
n = len(raw) // (W * H)
def stat(i):
    f = raw[i * W * H:(i + 1) * W * H]
    m = sum(f) / len(f)
    sd = (sum((v - m) ** 2 for v in f) / len(f)) ** 0.5
    return m, sd
worst = []
for t, k in plan['strokes']:
    if k not in 'uU':
        continue
    rows = [(round(pts[i] * 1000), *stat(i)) for i in range(min(n, len(pts))) if t - 150 <= pts[i] * 1000 <= t + 450]
    base_m = sorted(r[1] for r in rows)[len(rows) // 2]
    base_s = sorted(r[2] for r in rows)[len(rows) // 2]
    dips = [r for r in rows if r[1] < base_m - 6 or r[2] < base_s - 4]
    worst.append(len(dips))
    print(f'way back at {t}: median level {base_m:.1f}, contrast {base_s:.1f}; grey frames: ' + (' '.join(f'{r[0]}({r[1]:.0f}/{r[2]:.0f})' for r in dips) or 'none'))
print('ways back with grey frames:', sum(1 for w in worst if w), 'of', len(worst))
