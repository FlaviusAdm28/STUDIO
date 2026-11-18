# island-gone.py <dir>… (17 Nov): the bar's left island ("Chapter One | Work") missing for a frame or two in a screen.mjs / clicks.mjs
# recording — its region (the window's top left, under the toolbar) frame by frame against the frames either side: a frame unlike both
# neighbours while they are alike, darker = the island not drawn
import json, subprocess, sys
for d in sys.argv[1:]:
    plan = json.load(open(f'{d}/plan.json'))
    W, H = 60, 14
    top = (plan['viewport'][1] - plan['window'][1]) / plan['window'][3]
    crop = f"crop=iw*0.13:ih*0.05:iw*0.03:ih*{top + 0.01:.3f}"
    pts = [float(x) for x in subprocess.run(['/usr/local/bin/ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'frame=pts_time', '-of', 'csv=p=0', f'{d}/screen.mov'], capture_output=True, text=True).stdout.replace(',', ' ').split()]
    raw = subprocess.run(['/usr/local/bin/ffmpeg', '-loglevel', 'error', '-i', f'{d}/screen.mov', '-fps_mode', 'passthrough', '-vf', f'{crop},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    n = min(len(raw) // (W * H), len(pts))
    fr = lambda i: raw[i * W * H:(i + 1) * W * H]
    diff = lambda a, b: sum(abs(x - y) for x, y in zip(fr(a), fr(b))) / (W * H)
    hits = []
    for i in range(1, n - 2):
        for k in (1, 2):  # one or two frames gone
            a, b, c = i - 1, i, i + k
            if c >= n: continue
            if diff(a, c) < 1.5 and all(diff(a, j) > 6 for j in range(i, i + k)):
                hits.append(f'{round(pts[i] * 1000)}({k})')
                break
    print(f"{d.split('/')[-1]}: {len(hits)} {' '.join(hits)}")
