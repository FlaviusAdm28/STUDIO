# the bar and the page's top line (red channel) every 1/30 s from a key, side by side
import subprocess, sys
d, k, secs = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]) if len(sys.argv) > 3 else 2.0
def series(crop):
    out = subprocess.run(['ffmpeg','-loglevel','error','-ss',str(k - 0.1),'-t',str(secs),'-i',f'{d}/screen.mov','-vf',f'fps=30,crop={crop},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return [out[i] for i in range(0, len(out), 3)]
bar, top = series('400:60:550:20'), series('3456:6:0:108')
print('bar ', ' '.join(f'{v:3d}' for v in bar))
print('page', ' '.join(f'{v:3d}' for v in top))
