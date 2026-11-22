# the bar across its width (5 points, its bottom strip) and the page's top line under the same points, every 1/30 s from a key
import subprocess, sys
d, k, secs = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
xs = [300, 800, 1728, 2700, 3200]
def series(x, y, h):
    out = subprocess.run(['ffmpeg','-loglevel','error','-ss',str(k - 0.05),'-t',str(secs),'-i',f'{d}/screen.mov','-vf',f'fps=30,crop=60:{h}:{x}:{y},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return [out[i] for i in range(0, len(out), 3)]
bars = [series(x, 86, 12) for x in xs]
pages = [series(x, 108, 6) for x in xs]
n = min(len(b) for b in bars)
for i in range(0, n, 2):
    print(f'{i/30:4.2f}s  bar ' + ' '.join(f'{b[i]:3d}' for b in bars) + '   | page ' + ' '.join(f'{p[i]:3d}' for p in pages))
