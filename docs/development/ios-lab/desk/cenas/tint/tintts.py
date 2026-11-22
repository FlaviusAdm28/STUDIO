# the bar's colour every step s of a tint.sh recording (and the page's just under the bar)
import subprocess, sys
mov, step = sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 0.1
def series(crop):
    out = subprocess.run(['ffmpeg','-loglevel','error','-i',mov,'-vf',f'fps={1/step},crop={crop},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return [tuple(out[i:i+3]) for i in range(0,len(out),3)]
bar, page = series('400:60:550:20'), series('400:40:1400:250')
print(' '.join(f'{b[0]}/{b[2]}' for b in bar))
print('page ' + ' '.join(f'{p[0]}/{p[2]}' for p in page))
