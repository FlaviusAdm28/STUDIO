# bodyshow.py <dir>: the magenta (body) and green (html) pixels in each of bodyshow.mjs's screenshots — any shot with some is listed
# (ffmpeg's geq marks them in the red channel, 255 body and 128 html, so the count is a byte count)
import subprocess, sys, os
d = sys.argv[1]
bad = 0
files = sorted(f for f in os.listdir(d) if f.endswith('.png'))
mark = "if(gt(r(X,Y),200)*lt(g(X,Y),60)*gt(b(X,Y),200),255,if(gt(g(X,Y),200)*lt(r(X,Y),60)*lt(b(X,Y),60),128,0))"
for f in files:
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{d}/{f}', '-vf', f"format=rgb24,geq=r='{mark}':g=0:b=0", '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    red = raw[0::3]
    mag, grn = red.count(255), red.count(128)
    if mag > 20 or grn > 20:
        bad += 1
        print(f'{f}: body {mag} px, html {grn} px')
print(f'{bad} of {len(files)} shots show the page\'s own background')
