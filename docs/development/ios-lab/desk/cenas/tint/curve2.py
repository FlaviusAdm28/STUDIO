import subprocess, sys
mov, a, secs = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
def series(crop):
    out = subprocess.run(['ffmpeg','-loglevel','error','-ss',str(a),'-t',str(secs),'-i',mov,'-vf',f'fps=30,crop={crop},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return [out[i] for i in range(0, len(out), 3)]
print('bar ', ' '.join(f'{v:3d}' for v in series('400:60:550:20')))
print('page', ' '.join(f'{v:3d}' for v in series('3456:6:0:108')))
