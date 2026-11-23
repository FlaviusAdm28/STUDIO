# calib.py <dir> <set> : the bar's colour for each colour of a calib.html recording (calib.sh): the magenta step found, then each step's
# median over its last 0.6 s (of 1.4 s), against the colour painted
import subprocess, sys, statistics as st, json
d, cset = sys.argv[1], sys.argv[2]
fps = 30
out = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{d}/screen.mov', '-vf', f'fps={fps},crop=400:60:550:20,scale=1:1:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
bar = [tuple(out[i:i + 3]) for i in range(0, len(out), 3)]
out = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{d}/screen.mov', '-vf', f'fps={fps},crop=400:40:1400:250,scale=1:1:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
page = [tuple(out[i:i + 3]) for i in range(0, len(out), 3)]
# the magenta step: red and blue well over green; its end is the first colour's start
mag = [i for i, c in enumerate(bar) if c[0] - c[1] > 20 and c[2] - c[1] > 20]
start = mag[-1] + 1
if cset == 'grey':
    lst = [[min(255, v)] * 3 for v in range(0, 257, 8)]
elif cset == 'mix':
    lst = [[30, 29, 26], [23, 24, 28], [28, 27, 23], [23, 24, 30], [34, 37, 45], [45, 46, 45], [39, 39, 36], [220, 213, 200], [208, 209, 208], [216, 218, 219], [16, 16, 16], [64, 64, 64], [128, 128, 128], [192, 192, 192], [240, 240, 240], [44, 51, 45]]
elif cset == 'site':
    lst = [[30, 29, 26], [23, 24, 28], [28, 27, 23], [23, 24, 30], [35, 36, 41], [27, 28, 25], [43, 43, 42], [36, 36, 33], [216, 210, 196], [208, 209, 208], [238, 232, 221], [216, 208, 194], [44, 51, 45], [20, 19, 17], [60, 58, 54], [92, 91, 91]]
else:
    c = [int(x) for x in cset.split('=')[1].split(',')]
    lst = [[max(0, min(255, round(v * k / 10))) for v in c] for k in range(13)]
res = []
for i, c in enumerate(lst):
    a = start + int((i * 1.4 + 0.75) * fps)
    b = start + int((i * 1.4 + 1.35) * fps)
    seg, pseg = bar[a:b], page[a:b]
    if not seg:
        break
    m = tuple(round(st.median(x[j] for x in seg)) for j in range(3))
    p = tuple(round(st.median(x[j] for x in pseg)) for j in range(3))
    res.append((c, m, p))
    # painted (CSS) → the page as recorded, the bar as recorded (both bt709-encoded by the recording): the bar against the page
    print(f'{str(tuple(c)):>16s}  page {str(p):>16s}  bar {str(m):>16s}   bar − page {m[0] - p[0]:+4d} {m[1] - p[1]:+4d} {m[2] - p[2]:+4d}')
json.dump(res, open(f'{d}/calib.json', 'w'))
