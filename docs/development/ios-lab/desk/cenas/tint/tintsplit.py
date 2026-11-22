# the bar's colour at several points across it (left → right), at given times: does it carry an edge?
import subprocess, sys
mov = sys.argv[1]
xs = [120, 400, 1100, 1800, 2500, 3300]  # device px across the 3456 px window (the URL field spans ~1024–2440)
for t in [float(x) for x in sys.argv[2:]]:
    row = []
    for x in xs:
        out = subprocess.run(['ffmpeg','-loglevel','error','-ss',str(t),'-i',mov,'-frames:v','1','-vf',f'crop=40:16:{x}:6,scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
        row.append(f'{out[0]}/{out[2]}')
    out = subprocess.run(['ffmpeg','-loglevel','error','-ss',str(t),'-i',mov,'-frames:v','1','-vf','crop=3456:30:0:240,scale=6:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    page = ' '.join(f'{out[i]}/{out[i+2]}' for i in range(0, 18, 3))
    print(f'{t:4.1f}s bar {" ".join(row)}   | page top {page}')
